/**
 * Core Game Engine mirroring the Python implementation
 * Provides:
 *   - 3x3 Grid State
 *   - Recursive Minimax AI
 *   - Particle Animation Simulation
 *   - Persistent LocalStorage Leaderboard & Activity Logging
 */

export type PlayerSymbol = "X" | "O" | " ";
export type GameMode = "PVC" | "PVP";
export type AIDifficulty = "Easy" | "Medium" | "Hard";

export interface LogEntry {
  id: string;
  timestamp: string;
  type: string;
  details: string;
  username: string;
}

export interface PlayerStats {
  username: string;
  wins: number;
  draws: number;
  losses: number;
  score: number;
  lastPlayed: string;
}

export interface ParticleData {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  radius: number;
  life: number;
  decayRate: number;
}

export const WINNING_COMBINATIONS: [number, number][][] = [
  // Rows
  [[0, 0], [0, 1], [0, 2]],
  [[1, 0], [1, 1], [1, 2]],
  [[2, 0], [2, 1], [2, 2]],
  // Columns
  [[0, 0], [1, 0], [2, 0]],
  [[0, 1], [1, 1], [2, 1]],
  [[0, 2], [1, 2], [2, 2]],
  // Diagonals
  [[0, 0], [1, 1], [2, 2]],
  [[0, 2], [1, 1], [2, 0]]
];

/**
 * Checks terminal state of a 3x3 board matrix.
 * Returns: 'X' | 'O' | 'draw' | null
 */
export function checkWinner(grid: PlayerSymbol[][]): {
  winner: PlayerSymbol | null;
  line: [number, number][] | null;
  isDraw: boolean;
} {
  for (const line of WINNING_COMBINATIONS) {
    const [[r0, c0], [r1, c1], [r2, c2]] = line;
    const v0 = grid[r0][c0];
    const v1 = grid[r1][c1];
    const v2 = grid[r2][c2];

    if (v0 !== " " && v0 === v1 && v1 === v2) {
      return { winner: v0, line, isDraw: false };
    }
  }

  const isFull = grid.every(row => row.every(cell => cell !== " "));
  if (isFull) {
    return { winner: null, line: null, isDraw: true };
  }

  return { winner: null, line: null, isDraw: false };
}

/**
 * Recursive Minimax Evaluation
 * Mirroring ai.py
 */
function evaluateForMinimax(grid: PlayerSymbol[][]): number | null {
  for (const line of WINNING_COMBINATIONS) {
    const [[r0, c0], [r1, c1], [r2, c2]] = line;
    const v0 = grid[r0][c0];
    const v1 = grid[r1][c1];
    const v2 = grid[r2][c2];

    if (v0 !== " " && v0 === v1 && v1 === v2) {
      return v0 === "O" ? 10 : -10;
    }
  }

  const isFull = grid.every(row => row.every(cell => cell !== " "));
  if (isFull) return 0;
  return null;
}

export function minimax(
  grid: PlayerSymbol[][],
  depth: number,
  isMaximizing: boolean,
  alpha = -Infinity,
  beta = Infinity
): number {
  const terminal = evaluateForMinimax(grid);
  if (terminal !== null) {
    if (terminal > 0) return terminal - depth;
    if (terminal < 0) return terminal + depth;
    return 0;
  }

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (grid[r][c] === " ") {
          grid[r][c] = "O";
          const evaluation = minimax(grid, depth + 1, false, alpha, beta);
          grid[r][c] = " ";
          maxEval = Math.max(maxEval, evaluation);
          alpha = Math.max(alpha, evaluation);
          if (beta <= alpha) break;
        }
      }
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (grid[r][c] === " ") {
          grid[r][c] = "X";
          const evaluation = minimax(grid, depth + 1, true, alpha, beta);
          grid[r][c] = " ";
          minEval = Math.min(minEval, evaluation);
          beta = Math.min(beta, evaluation);
          if (beta <= alpha) break;
        }
      }
    }
    return minEval;
  }
}

export function getAIMove(grid: PlayerSymbol[][], difficulty: AIDifficulty): [number, number] | null {
  const available: [number, number][] = [];
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      if (grid[r][c] === " ") available.push([r, c]);
    }
  }

  if (available.length === 0) return null;

  if (difficulty === "Easy") {
    return available[Math.floor(Math.random() * available.length)];
  }

  if (difficulty === "Medium") {
    // 1. Check for immediate winning move
    for (const [r, c] of available) {
      grid[r][c] = "O";
      if (evaluateForMinimax(grid) === 10) {
        grid[r][c] = " ";
        return [r, c];
      }
      grid[r][c] = " ";
    }
    // 2. Check for immediate block
    for (const [r, c] of available) {
      grid[r][c] = "X";
      if (evaluateForMinimax(grid) === -10) {
        grid[r][c] = " ";
        return [r, c];
      }
      grid[r][c] = " ";
    }
    // 3. Center preference
    if (grid[1][1] === " ") return [1, 1];
    return available[Math.floor(Math.random() * available.length)];
  }

  // Hard / Unbeatable (Minimax Recursion)
  if (available.length >= 8 && grid[1][1] === " ") {
    return [1, 1];
  }

  let bestScore = -Infinity;
  let bestMove = available[0];

  for (const [r, c] of available) {
    grid[r][c] = "O";
    const score = minimax(grid, 0, false);
    grid[r][c] = " ";
    if (score > bestScore) {
      bestScore = score;
      bestMove = [r, c];
    }
  }

  return bestMove;
}

// -----------------------------------------------------------------------------
// Local Storage Persistence (Leaderboard & Logs)
// -----------------------------------------------------------------------------

const STORAGE_LEADERBOARD_KEY = "pygame_tictactoe_leaderboard_v1";
const STORAGE_LOGS_KEY = "pygame_tictactoe_logs_v1";

const DEFAULT_SEED_PLAYERS: PlayerStats[] = [
  { username: "Grandmaster_AI", wins: 15, draws: 3, losses: 0, score: 1545, lastPlayed: "2026-10-14 14:20" },
  { username: "CodeNinja", wins: 10, draws: 2, losses: 2, score: 980, lastPlayed: "2026-10-14 12:15" },
  { username: "RetroGamer", wins: 7, draws: 4, losses: 3, score: 680, lastPlayed: "2026-10-13 19:40" },
  { username: "Challenger_One", wins: 4, draws: 1, losses: 4, score: 385, lastPlayed: "2026-10-13 16:30" },
  { username: "Novice_Player", wins: 1, draws: 1, losses: 3, score: 115, lastPlayed: "2026-10-12 11:00" }
];

export function getStoredLeaderboard(): PlayerStats[] {
  if (typeof window === "undefined") return DEFAULT_SEED_PLAYERS;
  try {
    const raw = localStorage.getItem(STORAGE_LEADERBOARD_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_LEADERBOARD_KEY, JSON.stringify(DEFAULT_SEED_PLAYERS));
      return DEFAULT_SEED_PLAYERS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_SEED_PLAYERS;
  }
}

export function savePlayerRecord(username: string, outcome: "win" | "draw" | "loss", difficulty: AIDifficulty): PlayerStats[] {
  const current = getStoredLeaderboard();
  const cleanName = username.trim() || "Player 1";
  
  let player = current.find(p => p.username.toLowerCase() === cleanName.toLowerCase());
  if (!player) {
    player = { username: cleanName, wins: 0, draws: 0, losses: 0, score: 0, lastPlayed: "" };
    current.push(player);
  }

  const now = new Date();
  player.lastPlayed = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

  if (outcome === "win") {
    player.wins += 1;
    if (difficulty === "Hard") player.score += 100;
    else if (difficulty === "Medium") player.score += 60;
    else player.score += 30;
  } else if (outcome === "draw") {
    player.draws += 1;
    player.score += 15;
  } else {
    player.losses += 1;
    player.score = Math.max(0, player.score - 10);
  }

  // Sort descending by score
  current.sort((a, b) => b.score - a.score || b.wins - a.wins);

  try {
    localStorage.setItem(STORAGE_LEADERBOARD_KEY, JSON.stringify(current));
  } catch (err) {
    console.warn("Storage save error", err);
  }

  return current;
}

export function getStoredLogs(): LogEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_LOGS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function appendActivityLog(type: string, details: string, username: string): LogEntry[] {
  const logs = getStoredLogs();
  const now = new Date();
  const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;

  const entry: LogEntry = {
    id: `${Date.now()}-${Math.random()}`,
    timestamp,
    type: type.toUpperCase(),
    details,
    username: username || "Player 1"
  };

  logs.unshift(entry);
  const truncated = logs.slice(0, 100);

  try {
    localStorage.setItem(STORAGE_LOGS_KEY, JSON.stringify(truncated));
  } catch (err) {
    console.warn("Storage log error", err);
  }

  return truncated;
}

export function exportLogsToTextFile(logs: LogEntry[]): void {
  const content = logs.map(l => `[${l.timestamp}] [${l.type}] Player: ${l.username} | ${l.details}`).join("\n");
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "player_activity_log.txt";
  a.click();
  URL.revokeObjectURL(url);
}

export function exportLeaderboardToTextFile(players: PlayerStats[]): void {
  const header = "# Username|Wins|Draws|Losses|Score|LastPlayed\n";
  const rows = players.map(p => `${p.username}|${p.wins}|${p.draws}|${p.losses}|${p.score}|${p.lastPlayed}`).join("\n");
  const blob = new Blob([header + rows], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "leaderboard.txt";
  a.click();
  URL.revokeObjectURL(url);
}
