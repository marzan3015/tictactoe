import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Volume2,
  VolumeX,
  RotateCcw,
  Trophy,
  FileText,
  User,
  Bot,
  Zap,
  Download,
  Flame,
  CheckCircle2,
  Github
} from "lucide-react";
import {
  PlayerSymbol,
  GameMode,
  AIDifficulty,
  checkWinner,
  getAIMove,
  getStoredLeaderboard,
  savePlayerRecord,
  getStoredLogs,
  appendActivityLog,
  exportLogsToTextFile,
  exportLeaderboardToTextFile,
  PlayerStats,
  LogEntry,
  ParticleData
} from "../game/engine";
import { soundSynth } from "../utils/audio";

export const GameArena: React.FC = () => {
  // Game Setup
  const [gameMode, setGameMode] = useState<GameMode>("PVC");
  const [difficulty, setDifficulty] = useState<AIDifficulty>("Hard");
  const [playerXName, setPlayerXName] = useState<string>("Player 1");
  const [playerOName, setPlayerOName] = useState<string>("AI Minimax");

  // Game Board State
  const [grid, setGrid] = useState<PlayerSymbol[][]>([
    [" ", " ", " "],
    [" ", " ", " "],
    [" ", " ", " "]
  ]);
  const [currentTurn, setCurrentTurn] = useState<"X" | "O">("X");
  const [winner, setWinner] = useState<PlayerSymbol | null>(null);
  const [winningLine, setWinningLine] = useState<[number, number][] | null>(null);
  const [isDraw, setIsDraw] = useState<boolean>(false);
  const [moveCount, setMoveCount] = useState<number>(0);
  const [isAiThinking, setIsAiThinking] = useState<boolean>(false);

  // Audio & Sub-views
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [subView, setSubView] = useState<"board" | "leaderboard" | "logs">("board");

  // Persistent Storage States
  const [leaderboard, setLeaderboard] = useState<PlayerStats[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  // Canvas ref for animations
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<ParticleData[]>([]);
  const animFrameRef = useRef<number | null>(null);
  const strikeProgressRef = useRef<number>(0);

  // Initialize storage
  useEffect(() => {
    setLeaderboard(getStoredLeaderboard());
    setLogs(getStoredLogs());
  }, []);

  const spawnParticles = (x: number, y: number, color: string, count = 20) => {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 5.0;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color,
        radius: 3 + Math.random() * 4,
        life: 1.0,
        decayRate: 0.02 + Math.random() * 0.03
      });
    }
  };

  // Particle & winning strike rendering loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let running = true;

    const render = () => {
      if (!running) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update & render particles
      const activeParticles: ParticleData[] = [];
      for (const p of particlesRef.current) {
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.95;
        p.vy *= 0.95;
        p.life -= p.decayRate;
        p.radius = Math.max(0.5, p.radius * 0.96);

        if (p.life > 0) {
          ctx.save();
          ctx.globalAlpha = p.life;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
          activeParticles.push(p);
        }
      }
      particlesRef.current = activeParticles;

      // Render animated strike line if winner exists
      if (winningLine && canvas) {
        if (strikeProgressRef.current < 1.0) {
          strikeProgressRef.current = Math.min(1.0, strikeProgressRef.current + 0.06);
        }

        const [[r0, c0], , [r2, c2]] = winningLine;
        const cellW = canvas.width / 3;
        const cellH = canvas.height / 3;

        const startX = c0 * cellW + cellW / 2;
        const startY = r0 * cellH + cellH / 2;
        const endX = c2 * cellW + cellW / 2;
        const endY = r2 * cellH + cellH / 2;

        const curX = startX + (endX - startX) * strikeProgressRef.current;
        const curY = startY + (endY - startY) * strikeProgressRef.current;

        ctx.save();
        ctx.strokeStyle = "#10b981"; // Emerald
        ctx.lineWidth = 8;
        ctx.lineCap = "round";
        ctx.shadowColor = "#10b981";
        ctx.shadowBlur = 14;

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(curX, curY);
        ctx.stroke();
        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      running = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [winningLine]);

  // Restart match handler
  const handleRestart = useCallback(() => {
    soundSynth.startBgm();
    setGrid([
      [" ", " ", " "],
      [" ", " ", " "],
      [" ", " ", " "]
    ]);
    setCurrentTurn("X");
    setWinner(null);
    setWinningLine(null);
    setIsDraw(false);
    setMoveCount(0);
    setIsAiThinking(false);
    particlesRef.current = [];
    strikeProgressRef.current = 0;
    soundSynth.playClick();

    const opponentName = gameMode === "PVC" ? `AI (${difficulty})` : playerOName;
    const updatedLogs = appendActivityLog(
      "GAME_START",
      `New match started. Mode: ${gameMode} vs ${opponentName}`,
      playerXName
    );
    setLogs(updatedLogs);
  }, [gameMode, difficulty, playerXName, playerOName]);

  // Handle cell click
  const handleCellClick = (row: number, col: number) => {
    soundSynth.startBgm();
    if (grid[row][col] !== " " || winner || isDraw || isAiThinking) {
      return;
    }

    // Coordinates for particle burst
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const cellW = rect.width / 3;
      const cellH = rect.height / 3;
      const centerX = col * cellW + cellW / 2;
      const centerY = row * cellH + cellH / 2;
      spawnParticles(centerX, centerY, currentTurn === "X" ? "#38bdf8" : "#f43f5e", 18);
    }

    soundSynth.playMove(currentTurn);

    const newGrid = grid.map((r, rIdx) =>
      r.map((cell, cIdx) => (rIdx === row && cIdx === col ? currentTurn : cell))
    );

    setGrid(newGrid);
    const newMoveCount = moveCount + 1;
    setMoveCount(newMoveCount);

    const outcome = checkWinner(newGrid);

    if (outcome.winner) {
      setWinner(outcome.winner);
      setWinningLine(outcome.line);
      strikeProgressRef.current = 0;
      soundSynth.playWin();

      const winnerName = outcome.winner === "X" ? playerXName : (gameMode === "PVC" ? `AI (${difficulty})` : playerOName);
      const updatedLeaderboard = savePlayerRecord(winnerName, "win", difficulty);
      setLeaderboard(updatedLeaderboard);

      const updatedLogs = appendActivityLog(
        "GAME_WIN",
        `Winner: ${winnerName} (${outcome.winner}) in ${newMoveCount} moves`,
        winnerName
      );
      setLogs(updatedLogs);
      return;
    }

    if (outcome.isDraw) {
      setIsDraw(true);
      soundSynth.playDraw();

      const updatedLeaderboard = savePlayerRecord(playerXName, "draw", difficulty);
      setLeaderboard(updatedLeaderboard);

      const updatedLogs = appendActivityLog(
        "GAME_DRAW",
        `Match ended in draw between ${playerXName} and ${gameMode === "PVC" ? `AI (${difficulty})` : playerOName}`,
        playerXName
      );
      setLogs(updatedLogs);
      return;
    }

    // Switch turn
    const nextTurn = currentTurn === "X" ? "O" : "X";
    setCurrentTurn(nextTurn);

    // AI Turn Trigger
    if (gameMode === "PVC" && nextTurn === "O") {
      setIsAiThinking(true);
      setTimeout(() => {
        const aiMove = getAIMove(newGrid, difficulty);
        if (aiMove) {
          const [aiR, aiC] = aiMove;
          soundSynth.playMove("O");

          if (canvas) {
            const rect = canvas.getBoundingClientRect();
            const cellW = rect.width / 3;
            const cellH = rect.height / 3;
            spawnParticles(aiC * cellW + cellW / 2, aiR * cellH + cellH / 2, "#f43f5e", 18);
          }

          const aiGrid = newGrid.map((r, rIdx) =>
            r.map((cell, cIdx) => (rIdx === aiR && cIdx === aiC ? "O" : cell))
          );
          setGrid(aiGrid);
          setMoveCount(newMoveCount + 1);

          const aiOutcome = checkWinner(aiGrid);
          if (aiOutcome.winner) {
            setWinner("O");
            setWinningLine(aiOutcome.line);
            strikeProgressRef.current = 0;
            soundSynth.playWin();

            const updatedLeaderboard = savePlayerRecord(playerXName, "loss", difficulty);
            setLeaderboard(updatedLeaderboard);

            const updatedLogs = appendActivityLog(
              "GAME_WIN",
              `AI (${difficulty}) defeated ${playerXName}`,
              `AI (${difficulty})`
            );
            setLogs(updatedLogs);
          } else if (aiOutcome.isDraw) {
            setIsDraw(true);
            soundSynth.playDraw();

            const updatedLeaderboard = savePlayerRecord(playerXName, "draw", difficulty);
            setLeaderboard(updatedLeaderboard);

            const updatedLogs = appendActivityLog(
              "GAME_DRAW",
              `Match ended in draw between ${playerXName} and AI`,
              playerXName
            );
            setLogs(updatedLogs);
          } else {
            setCurrentTurn("X");
          }
        }
        setIsAiThinking(false);
      }, 350);
    }
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "r" || e.key === "R") {
        handleRestart();
      } else if (e.key === "m" || e.key === "M") {
        setIsMuted(prev => {
          const nextVal = !prev;
          soundSynth.setEnabled(!nextVal);
          return nextVal;
        });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleRestart]);

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundSynth.setEnabled(!nextMuted);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* Upper Navigation & Mode Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setSubView("board"); soundSynth.playClick(); }}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              subView === "board"
                ? "bg-sky-500 text-slate-950 shadow-sm"
                : "bg-slate-800/80 text-slate-300 hover:text-white"
            }`}
          >
            Game Board
          </button>
          <button
            onClick={() => { setSubView("leaderboard"); soundSynth.playClick(); }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              subView === "leaderboard"
                ? "bg-sky-500 text-slate-950 shadow-sm"
                : "bg-slate-800/80 text-slate-300 hover:text-white"
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Leaderboard</span>
          </button>
          <button
            onClick={() => { setSubView("logs"); soundSynth.playClick(); }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              subView === "logs"
                ? "bg-sky-500 text-slate-950 shadow-sm"
                : "bg-slate-800/80 text-slate-300 hover:text-white"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Activity Logs (File I/O)</span>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleMute}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors cursor-pointer"
            title="Toggle Audio (Shortcut: M)"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-sky-400" />}
            <span>{isMuted ? "Unmute" : "Mute (M)"}</span>
          </button>

          <button
            onClick={handleRestart}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors cursor-pointer border border-slate-700"
            title="Reset Game (Shortcut: R)"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>Reset (R)</span>
          </button>
        </div>
      </div>

      {/* Main View Area */}
      {subView === "board" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Game Board Canvas & Controls */}
          <div className="lg:col-span-8 flex flex-col items-center">
            {/* Status cluster */}
            <div className="w-full max-w-[440px] flex items-center justify-between px-4 py-3 mb-4 rounded-xl bg-slate-900/90 border border-slate-800">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${currentTurn === "X" ? "bg-sky-400 shadow-sm shadow-sky-400" : "bg-rose-400 shadow-sm shadow-rose-400"}`} />
                <span className="text-xs font-mono font-medium text-slate-300">
                  {winner ? (
                    <span className="text-emerald-400 font-bold">
                      {winner === "X" ? playerXName : (gameMode === "PVC" ? `AI (${difficulty})` : playerOName)} Victorious!
                    </span>
                  ) : isDraw ? (
                    <span className="text-amber-400 font-bold">Draw Game!</span>
                  ) : (
                    <span>
                      Turn: <strong className={currentTurn === "X" ? "text-sky-400" : "text-rose-400"}>
                        {currentTurn === "X" ? playerXName : (gameMode === "PVC" ? `AI (${difficulty})` : playerOName)} ({currentTurn})
                      </strong>
                    </span>
                  )}
                </span>
              </div>

              <div className="text-xs font-mono text-slate-400">
                Moves: <span className="text-white font-bold">{moveCount}/9</span>
              </div>
            </div>

            {/* Board Container */}
            <div className="relative w-full max-w-[440px] aspect-square rounded-2xl p-4 bg-slate-900/80 border border-slate-800/80 shadow-2xl flex items-center justify-center">
              {/* Particle and Line Canvas overlay */}
              <canvas
                ref={canvasRef}
                width={408}
                height={408}
                className="absolute inset-4 pointer-events-none z-20"
              />

              {/* 3x3 Grid Buttons */}
              <div className="grid grid-cols-3 grid-rows-3 gap-3 w-full h-full z-10">
                {grid.map((row, rIdx) =>
                  row.map((cell, cIdx) => {
                    const isWinningCell = winningLine?.some(([r, c]) => r === rIdx && c === cIdx);
                    return (
                      <button
                        key={`${rIdx}-${cIdx}`}
                        onClick={() => handleCellClick(rIdx, cIdx)}
                        disabled={cell !== " " || !!winner || isDraw || isAiThinking}
                        className={`relative rounded-xl flex items-center justify-center font-mono text-5xl font-extrabold transition-all duration-150 cursor-pointer select-none ${
                          cell === " "
                            ? "bg-slate-800/40 hover:bg-slate-800/80 hover:border-slate-600 border border-slate-800/70"
                            : isWinningCell
                            ? "bg-emerald-950/40 border-2 border-emerald-500 text-emerald-400 shadow-lg shadow-emerald-950/50"
                            : cell === "X"
                            ? "bg-slate-800/60 border border-sky-500/30 text-sky-400"
                            : "bg-slate-800/60 border border-rose-500/30 text-rose-400"
                        }`}
                      >
                        {cell !== " " && (
                          <span className="scale-100 transition-transform duration-200">
                            {cell}
                          </span>
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Game Over Action Banner */}
            {(winner || isDraw) && (
              <div className="w-full max-w-[440px] mt-4 p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                <div className="text-xs text-slate-300">
                  {winner ? "Match recorded in persistent leaderboard!" : "Well fought draw!"}
                </div>
                <button
                  onClick={handleRestart}
                  className="px-4 py-2 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors cursor-pointer shadow-sm"
                >
                  Play Again (R)
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Settings & Match Configuration */}
          <div className="lg:col-span-4 space-y-6">
            {/* Match Mode Configuration Card */}
            <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
              <h3 className="text-sm font-semibold text-white tracking-wide flex items-center gap-2">
                <Zap className="w-4 h-4 text-sky-400" />
                <span>Match Configuration</span>
              </h3>

              {/* Mode Selector */}
              <div>
                <label className="text-xs font-medium text-slate-400 mb-1.5 block">
                  Select Game Mode
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => { setGameMode("PVC"); handleRestart(); }}
                    className={`flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                      gameMode === "PVC"
                        ? "bg-sky-500/10 border-sky-500 text-sky-400"
                        : "bg-slate-800/40 border-slate-700/60 text-slate-400 hover:text-white"
                    }`}
                  >
                    <Bot className="w-3.5 h-3.5" />
                    <span>Solo vs AI</span>
                  </button>
                  <button
                    onClick={() => { setGameMode("PVP"); handleRestart(); }}
                    className={`flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                      gameMode === "PVP"
                        ? "bg-sky-500/10 border-sky-500 text-sky-400"
                        : "bg-slate-800/40 border-slate-700/60 text-slate-400 hover:text-white"
                    }`}
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>2 Players (PvP)</span>
                  </button>
                </div>
              </div>

              {/* AI Difficulty Selector (Only for PVC) */}
              {gameMode === "PVC" && (
                <div>
                  <label className="text-xs font-medium text-slate-400 mb-1.5 block">
                    AI Algorithm Tier
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(["Easy", "Medium", "Hard"] as AIDifficulty[]).map((diff) => (
                      <button
                        key={diff}
                        onClick={() => { setDifficulty(diff); handleRestart(); }}
                        className={`py-1.5 px-2 text-xs font-mono font-medium rounded-lg border transition-colors cursor-pointer text-center ${
                          difficulty === diff
                            ? "bg-sky-500 text-slate-950 border-sky-500 font-bold"
                            : "bg-slate-800/40 border-slate-700/60 text-slate-400 hover:text-white"
                        }`}
                      >
                        {diff === "Hard" ? "Minimax" : diff}
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {difficulty === "Hard"
                      ? "Unbeatable: uses recursive Minimax decision tree"
                      : difficulty === "Medium"
                      ? "Tactical: prioritizes blocks & immediate wins"
                      : "Casual: random available moves"}
                  </p>
                </div>
              )}

              {/* Player Names Input */}
              <div className="space-y-3 pt-2 border-t border-slate-800/80">
                <div>
                  <label className="text-xs font-medium text-slate-400 block mb-1">
                    Player 1 (X) Name
                  </label>
                  <input
                    type="text"
                    value={playerXName}
                    onChange={(e) => setPlayerXName(e.target.value)}
                    maxLength={18}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
                  />
                </div>

                {gameMode === "PVP" && (
                  <div>
                    <label className="text-xs font-medium text-slate-400 block mb-1">
                      Player 2 (O) Name
                    </label>
                    <input
                      type="text"
                      value={playerOName}
                      onChange={(e) => setPlayerOName(e.target.value)}
                      maxLength={18}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Quick Leaderboard Preview */}
            <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span>Top Players</span>
                </span>
                <button
                  onClick={() => setSubView("leaderboard")}
                  className="text-[11px] font-medium text-sky-400 hover:underline cursor-pointer"
                >
                  View All
                </button>
              </div>

              <div className="space-y-2">
                {leaderboard.slice(0, 3).map((player, idx) => (
                  <div
                    key={player.username}
                    className="flex items-center justify-between text-xs px-2.5 py-1.5 rounded-lg bg-slate-950/60 border border-slate-800/60"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] text-amber-400 font-bold">#{idx + 1}</span>
                      <span className="text-slate-200 font-medium truncate max-w-[120px]">{player.username}</span>
                    </div>
                    <span className="font-mono font-bold text-sky-400">{player.score} pts</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard View */}
      {subView === "leaderboard" && (
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                <span>Persistent Leaderboard System</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Saved in local storage (mirrors Python &apos;leaderboard.txt&apos; file I/O).
              </p>
            </div>

            <button
              onClick={() => exportLeaderboardToTextFile(leaderboard)}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-sky-400" />
              <span>Export leaderboard.txt</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Rank</th>
                  <th className="py-3 px-4">Player</th>
                  <th className="py-3 px-4">Score</th>
                  <th className="py-3 px-4">Wins</th>
                  <th className="py-3 px-4">Draws</th>
                  <th className="py-3 px-4">Losses</th>
                  <th className="py-3 px-4">Win Rate</th>
                  <th className="py-3 px-4">Last Match</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
                {leaderboard.map((p, idx) => {
                  const total = p.wins + p.draws + p.losses;
                  const rate = total > 0 ? ((p.wins / total) * 100).toFixed(1) : "0.0";
                  return (
                    <tr key={p.username} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-4 font-bold text-amber-400">#{idx + 1}</td>
                      <td className="py-3 px-4 text-white font-semibold">{p.username}</td>
                      <td className="py-3 px-4 text-sky-400 font-bold">{p.score}</td>
                      <td className="py-3 px-4 text-emerald-400">{p.wins}</td>
                      <td className="py-3 px-4 text-amber-400">{p.draws}</td>
                      <td className="py-3 px-4 text-rose-400">{p.losses}</td>
                      <td className="py-3 px-4 text-slate-300">{rate}%</td>
                      <td className="py-3 px-4 text-slate-500 text-[11px]">{p.lastPlayed || "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Activity Logs View */}
      {subView === "logs" && (
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-sky-400" />
                <span>Player Activity Logs</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Chronological audit logs of matches, wins, and moves (mirrors Python &apos;player_activity_log.txt&apos;).
              </p>
            </div>

            <button
              onClick={() => exportLogsToTextFile(logs)}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-sky-400" />
              <span>Export player_activity_log.txt</span>
            </button>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs space-y-2 max-h-[460px] overflow-y-auto">
            {logs.length === 0 ? (
              <div className="text-slate-500 py-6 text-center">No activity recorded yet. Play a match!</div>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="leading-relaxed border-b border-slate-900/80 pb-1.5 last:border-b-0">
                  <span className="text-slate-500">[{log.timestamp}]</span>{" "}
                  <span
                    className={
                      log.type === "GAME_WIN"
                        ? "text-emerald-400 font-bold"
                        : log.type === "GAME_DRAW"
                        ? "text-amber-400 font-bold"
                        : "text-sky-400"
                    }
                  >
                    [{log.type}]
                  </span>{" "}
                  <span className="text-slate-300 font-medium">Player: {log.username}</span>{" "}
                  <span className="text-slate-400">| {log.details}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Bottom Middle Author Attribution with GitHub Link */}
      <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-col items-center justify-center gap-2 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span>Made by</span>
          <a
            href="https://github.com/marzan3015"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-700/80 text-sky-400 hover:text-sky-300 hover:border-sky-500 transition-all font-mono font-medium shadow-sm hover:shadow-sky-500/10"
            title="Visit @marzan3015 on GitHub"
          >
            <Github className="w-3.5 h-3.5" />
            <span>@marzan3015</span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-400 hover:underline">https://github.com/marzan3015</span>
          </a>
        </div>
        <p className="text-[11px] text-slate-500">
          Continuous background theme song · Recursive Minimax AI · Persistent File I/O
        </p>
      </div>
    </div>
  );
};
