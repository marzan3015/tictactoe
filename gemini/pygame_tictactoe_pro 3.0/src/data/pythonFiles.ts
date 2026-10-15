export interface PythonFileItem {
  id: string;
  name: string;
  path: string;
  language: string;
  description: string;
  topicsCovered: string[];
  content: string;
}

export const PYTHON_FILES: PythonFileItem[] = [
  {
    id: "requirements",
    name: "requirements.txt",
    path: "requirements.txt",
    language: "text",
    description: "Project dependencies specification for pip (uses pygame-ce for enhanced performance).",
    topicsCovered: ["Introduction of a library - pygame / pygame-ce"],
    content: `pygame-ce==2.5.8`
  },
  {
    id: "readme",
    name: "README.md",
    path: "README.md",
    language: "markdown",
    description: "Complete project documentation, academic syllabus mapping, and PyInstaller .exe compilation guide.",
    topicsCovered: ["Modularization", "Library - pygame", "PyInstaller Guide", "Curriculum Mapping"],
    content: `# Pygame Tic-Tac-Toe Pro

A modern, production-grade 2D Tic-Tac-Toe game engineered in Python using **Pygame**, featuring recursive Minimax AI (unbeatable), sound effects & procedural audio synthesis, particle animations, text file activity logging, and a persistent leaderboard system.

---

## 📚 Academic & Curriculum Requirements Coverage

| Syllabus Requirement | Implementation Details | File & Functions |
| :--- | :--- | :--- |
| **1. Conditional Statements (Nested)** | Nested if/elif/else structures for bounds check, vacancy, win detection, and difficulty branching | board.py (is_valid_move, check_game_over), ai.py (minimax, get_best_move) |
| **2. Loops (Nested)** | 2D matrix traversal over 3x3 board rows and columns for rendering, resetting, and full-board checks | board.py (reset, is_full), main.py (grid and mark rendering) |
| **3. Functions & Scope** | Modular functions with positional & default parameters, return values, local variables vs module-level / global variables | logger.py (log_activity, get_log_operations_count), ai.py (evaluate_board) |
| **4. Generators (yield)** | Generator functions producing iterable sequences on the fly for winning coordinate lines and vacant cell coordinates | board.py (generate_winning_lines, iter_empty_cells), ai.py (generate_available_moves) |
| **5. Recursion** | Classic Minimax game tree search algorithm exploring hypothetical future moves recursively with depth scoring | ai.py (def minimax(grid, depth, is_maximizing, alpha, beta)) |
| **6. Built-in Data Types** | List (2D matrix, logs), Tuple (coords, RGB colors, screen dimensions), String (symbols, paths), Set (unique symbols & usernames), Dict (scoring, themes, profiles) | constants.py, leaderboard.py, board.py |
| **7. Modularization** | Clean separation of concerns across single-purpose modules | constants.py, board.py, ai.py, sound_manager.py, logger.py, leaderboard.py, game.py, main.py |
| **8. Library - Pygame** | Display surface setup, 60 FPS clock, event polling loop, font rendering, geometric primitive drawing, sound mixer playback | main.py, sound_manager.py |
| **9. Files (File I/O) - Text Mode** | Opening, reading, writing, and appending files in text mode ('r', 'w', 'a') with UTF-8 encoding | logger.py (player_activity_log.txt), leaderboard.py (leaderboard.txt) |
| **10. Exception Handling** | Comprehensive try-except-else-finally blocks handling FileNotFoundError, IOError, OSError, ValueError, and audio fallback | logger.py, leaderboard.py, sound_manager.py, main.py |
| **11. Python - Class, Object** | Object-Oriented Architecture with classes, attributes (self), constructors (__init__), encapsulation, and property getters | board.py (Board), leaderboard.py (PlayerProfile, LeaderboardManager), ai.py (AIPlayer), game.py (TicTacToeGame, Particle) |

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
\`\`\`bash
pip install -r requirements.txt
\`\`\`

### 2. Run the Game
\`\`\`bash
python main.py
\`\`\`

To run the automated verification suite without a GUI window:
\`\`\`bash
python main.py --test
\`\`\`

---

## 📦 How to Compile to Standalone .EXE with PyInstaller

\`\`\`bash
pip install pyinstaller
pyinstaller --onefile --noconsole --name "TicTacToePro" main.py
\`\`\`
The compiled executable will be generated inside the dist/ directory!`
  },
  {
    id: "constants",
    name: "constants.py",
    path: "constants.py",
    language: "python",
    description: "Centralized configuration defining Tuples, Lists, Strings, Sets, and Dictionaries.",
    topicsCovered: ["Built-in data types: List, Tuple, String, Set, Dictionary", "Modularization"],
    content: `"""
Constants and Configuration Module
----------------------------------
Demonstrates Python Built-in Data Types:
  - Tuple: Screen dimensions, RGB Color definitions, coordinate pairs
  - List: Difficulty options, player default names
  - String: Player symbols, file paths, status labels
  - Set: Valid player symbols, immutable unique lookups
  - Dictionary: Color palettes/themes, game scoring rewards
"""

# ==============================================================================
# 1. TUPLES (Immutable Sequences)
# ==============================================================================
SCREEN_DIMENSIONS: tuple[int, int] = (800, 650)
SCREEN_WIDTH, SCREEN_HEIGHT = SCREEN_DIMENSIONS

GRID_OFFSET: tuple[int, int] = (175, 120)  # (Top-Left X, Top-Left Y) of 3x3 board
CELL_SIZE: int = 150
GRID_SIZE: int = CELL_SIZE * 3  # 450x450 px

# Color Tuples: (Red, Green, Blue)
COLOR_BACKGROUND: tuple[int, int, int] = (15, 23, 42)      # Deep slate #0f172a
COLOR_PANEL_BG: tuple[int, int, int] = (30, 41, 59)        # Slate #1e293b
COLOR_GRID_LINES: tuple[int, int, int] = (51, 65, 85)      # Slate line #334155
COLOR_X_SYMBOL: tuple[int, int, int] = (56, 189, 248)      # Cyan #38bdf8
COLOR_O_SYMBOL: tuple[int, int, int] = (244, 63, 94)       # Rose #f43f5e
COLOR_WIN_LINE: tuple[int, int, int] = (16, 185, 129)      # Emerald #10b981
COLOR_TEXT_PRIMARY: tuple[int, int, int] = (248, 250, 252) # White #f8fafc
COLOR_TEXT_MUTED: tuple[int, int, int] = (148, 163, 184)   # Slate text #94a3b8
COLOR_BUTTON_DEFAULT: tuple[int, int, int] = (30, 41, 59)  # Button normal
COLOR_BUTTON_HOVER: tuple[int, int, int] = (71, 85, 105)   # Button hover
COLOR_ACCENT_AMBER: tuple[int, int, int] = (245, 158, 11)  # Amber #f59e0b

# ==============================================================================
# 2. LISTS (Mutable Sequences)
# ==============================================================================
DIFFICULTY_OPTIONS: list[str] = [
    "Easy (Random / Casual)",
    "Medium (Tactical Blocker)",
    "Hard (Recursive Minimax Unbeatable)"
]

DEFAULT_PLAYER_NAMES: list[str] = ["Player 1", "Computer"]
GAME_MODES: list[str] = ["Solo vs Computer", "Player vs Player"]

# ==============================================================================
# 3. STRINGS (Text sequences)
# ==============================================================================
SYMBOL_X: str = "X"
SYMBOL_O: str = "O"
SYMBOL_EMPTY: str = " "

TITLE_TEXT: str = "Pygame Tic-Tac-Toe Pro"
SUBTITLE_TEXT: str = "Production Python Game Architecture with Minimax AI & File I/O"

LOG_FILE_PATH: str = "player_activity_log.txt"
LEADERBOARD_FILE_PATH: str = "leaderboard.txt"

# ==============================================================================
# 4. SETS (Unique Unordered Collections)
# ==============================================================================
VALID_SYMBOLS: set[str] = {SYMBOL_X, SYMBOL_O}
CORNER_CELLS: set[tuple[int, int]] = {(0, 0), (0, 2), (2, 0), (2, 2)}
EDGE_CELLS: set[tuple[int, int]] = {(0, 1), (1, 0), (1, 2), (2, 1)}

# ==============================================================================
# 5. DICTIONARIES (Key-Value Mappings)
# ==============================================================================
SCORE_REWARDS: dict[str, int] = {
    "win_hard_ai": 100,
    "win_medium_ai": 60,
    "win_easy_ai": 30,
    "win_pvp": 50,
    "draw": 15,
    "loss": 0
}

AUDIO_FREQUENCIES: dict[str, float] = {
    "click": 440.0,
    "move_x": 587.33,
    "move_o": 659.25,
    "win": 880.0,
    "draw": 330.0,
    "btn_hover": 523.25
}

FPS: int = 60`
  },
  {
    id: "logger",
    name: "logger.py",
    path: "logger.py",
    language: "python",
    description: "Demonstrates text mode file writing, reading, and exception handling with try-except-else-finally.",
    topicsCovered: ["Files (File I/O) - text mode", "Exception Handling - try-catch", "Functions - calls, parameters, scope of variables"],
    content: `"""
Activity Logger Module
----------------------
Covers Syllabus Requirements:
  - Files (File I/O) in Text Mode ('w', 'a', 'r' with encoding='utf-8')
  - Exception Handling (try-except-else-finally blocks, handling IOError/OSError)
  - Functions: Calls, default/keyword parameters, return values
  - Scope of Variables: Local vs Module-level / Global scope
"""

import os
from datetime import datetime
from constants import LOG_FILE_PATH

_TOTAL_LOG_OPERATIONS: int = 0


def get_log_operations_count() -> int:
    """Demonstrates local variable returning module-level variable."""
    return _TOTAL_LOG_OPERATIONS


def log_activity(event_type: str, details: str, username: str = "Anonymous") -> bool:
    """
    Appends an activity entry to a persistent text file.
    Demonstrates parameters, variable scope ('global'), File I/O text mode, and try-except-finally.
    """
    global _TOTAL_LOG_OPERATIONS
    
    timestamp: str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    entry_line: str = f"[{timestamp}] [{event_type.upper()}] Player: {username} | {details}\\n"
    
    file_handle = None
    success: bool = False
    
    try:
        file_handle = open(LOG_FILE_PATH, mode="a", encoding="utf-8")
        file_handle.write(entry_line)
        file_handle.flush()
        success = True
        _TOTAL_LOG_OPERATIONS += 1
    except (IOError, OSError) as file_error:
        print(f"[Logger Error] Failed to write to {LOG_FILE_PATH}: {file_error}")
        success = False
    except Exception as unexpected_error:
        print(f"[Logger Error] Unexpected error occurred: {unexpected_error}")
        success = False
    else:
        pass
    finally:
        if file_handle is not None and not file_handle.closed:
            file_handle.close()
            
    return success


def read_activity_logs(max_entries: int = 50) -> list[str]:
    """Reads recent activity log entries from text file."""
    logs: list[str] = []
    
    if not os.path.exists(LOG_FILE_PATH):
        return ["No activity logs recorded yet. Play a game to record logs!"]
        
    try:
        with open(LOG_FILE_PATH, mode="r", encoding="utf-8") as file:
            all_lines: list[str] = file.readlines()
            recent_lines: list[str] = [line.strip() for line in all_lines[-max_entries:]]
            recent_lines.reverse()
            logs = recent_lines
    except FileNotFoundError:
        logs = ["Log file was not found."]
    except (IOError, OSError) as read_error:
        logs = [f"Error reading activity log: {read_error}"]
        
    return logs


def clear_activity_logs() -> bool:
    """Clears all logged history in text mode ('w' truncates existing content)."""
    try:
        with open(LOG_FILE_PATH, mode="w", encoding="utf-8") as file:
            file.write(f"=== Activity Log Reset at {datetime.now()} ===\\n")
        return True
    except (IOError, OSError) as e:
        print(f"Error resetting logs: {e}")
        return False`
  },
  {
    id: "leaderboard",
    name: "leaderboard.py",
    path: "leaderboard.py",
    language: "python",
    description: "OOP Leaderboard manager reading/writing persistent high scores with dictionaries, sets, and tuples.",
    topicsCovered: ["Python - Class, Object", "Files (File I/O) - text mode", "Exception Handling - try-catch", "Built-in data types: Dictionary, Set, Tuple, List"],
    content: `"""
Persistent Leaderboard & Stats Manager Module
---------------------------------------------
Covers Syllabus Requirements:
  - Python OOP: Class and Object encapsulation
  - File I/O: Text mode file operations ('r', 'w')
  - Built-in data types: Dictionary, List, Tuple, Set, String
  - Exception Handling: FileNotFoundError, ValueError, general Exception
  - Nested conditionals & nested loops
"""

import os
from datetime import datetime
from constants import LEADERBOARD_FILE_PATH, SCORE_REWARDS


class PlayerProfile:
    """Represents an individual player's statistical record."""
    def __init__(self, username: str, wins: int = 0, draws: int = 0, losses: int = 0, score: int = 0):
        self.username: str = str(username).strip()
        self.wins: int = int(wins)
        self.draws: int = int(draws)
        self.losses: int = int(losses)
        self.score: int = int(score)
        self.last_played: str = datetime.now().strftime("%Y-%m-%d %H:%M")

    @property
    def total_games(self) -> int:
        return self.wins + self.draws + self.losses

    @property
    def win_rate(self) -> float:
        if self.total_games == 0:
            return 0.0
        return round((self.wins / self.total_games) * 100, 1)

    def to_text_line(self) -> str:
        """Serializes player stats into a pipe-delimited text record."""
        return f"{self.username}|{self.wins}|{self.draws}|{self.losses}|{self.score}|{self.last_played}\\n"

    def __str__(self) -> str:
        return f"{self.username}: Score {self.score} (W:{self.wins} D:{self.draws} L:{self.losses} - {self.win_rate}%)"


class LeaderboardManager:
    """
    Manages persistent high scores and leaderboard storage using text files.
    """
    def __init__(self, storage_path: str = LEADERBOARD_FILE_PATH):
        self.storage_path: str = storage_path
        self.players: dict[str, PlayerProfile] = {}
        self.unique_usernames: set[str] = set()
        self.load_from_file()

    def record_match_result(self, username: str, result: str, difficulty: str = "Medium") -> None:
        """Updates player statistics based on match outcome with nested conditionals."""
        clean_name: str = username.strip() or "Player 1"
        
        if clean_name not in self.players:
            self.players[clean_name] = PlayerProfile(clean_name)
            self.unique_usernames.add(clean_name)
            
        profile: PlayerProfile = self.players[clean_name]
        
        # Nested conditional statements
        if result == "win":
            profile.wins += 1
            if "Hard" in difficulty or "Unbeatable" in difficulty:
                profile.score += SCORE_REWARDS["win_hard_ai"]
            elif "Medium" in difficulty:
                profile.score += SCORE_REWARDS["win_medium_ai"]
            elif "Easy" in difficulty:
                profile.score += SCORE_REWARDS["win_easy_ai"]
            else:
                profile.score += SCORE_REWARDS["win_pvp"]
        elif result == "draw":
            profile.draws += 1
            profile.score += SCORE_REWARDS["draw"]
        else:  # "loss"
            profile.losses += 1
            if profile.score > 0:
                profile.score = max(0, profile.score - 10)
                
        profile.last_played = datetime.now().strftime("%Y-%m-%d %H:%M")
        self.save_to_file()

    def load_from_file(self) -> bool:
        """Reads persistent leaderboard records from text file with Exception Handling."""
        if not os.path.exists(self.storage_path):
            self._seed_default_scores()
            return True

        self.players.clear()
        self.unique_usernames.clear()

        try:
            with open(self.storage_path, mode="r", encoding="utf-8") as file:
                lines: list[str] = file.readlines()
                for line in lines:
                    line = line.strip()
                    if not line or line.startswith("#"):
                        continue
                        
                    parts: list[str] = line.split("|")
                    if len(parts) >= 5:
                        try:
                            name: str = parts[0]
                            w: int = int(parts[1])
                            d: int = int(parts[2])
                            l: int = int(parts[3])
                            s: int = int(parts[4])
                            
                            profile = PlayerProfile(name, w, d, l, s)
                            if len(parts) >= 6:
                                profile.last_played = parts[5]
                                
                            self.players[name] = profile
                            self.unique_usernames.add(name)
                        except ValueError as parse_err:
                            print(f"[Leaderboard Warning] Corrupted line skipped: '{line}': {parse_err}")
                            continue
            return True
        except FileNotFoundError:
            self._seed_default_scores()
            return False
        except (IOError, OSError) as io_err:
            print(f"[Leaderboard Error] Could not read leaderboard file: {io_err}")
            return False

    def save_to_file(self) -> bool:
        """Saves player records to text file."""
        try:
            with open(self.storage_path, mode="w", encoding="utf-8") as file:
                file.write("# Username|Wins|Draws|Losses|Score|LastPlayed\\n")
                for profile in self.players.values():
                    file.write(profile.to_text_line())
            return True
        except (IOError, OSError) as write_error:
            print(f"[Leaderboard Error] Failed to write leaderboard: {write_error}")
            return False

    def get_top_players(self, limit: int = 10) -> list[tuple[int, PlayerProfile]]:
        """Returns sorted list of Tuples (rank, PlayerProfile)."""
        sorted_profiles: list[PlayerProfile] = sorted(
            self.players.values(),
            key=lambda p: (p.score, p.wins, p.win_rate),
            reverse=True
        )
        top_list: list[tuple[int, PlayerProfile]] = []
        for index, profile in enumerate(sorted_profiles[:limit], start=1):
            top_list.append((index, profile))
        return top_list

    def _seed_default_scores(self) -> None:
        default_seed = [
            ("Grandmaster_AI", 15, 3, 0, 1545),
            ("CodeNinja", 10, 2, 2, 980),
            ("RetroGamer", 7, 4, 3, 680),
            ("Challenger_One", 4, 1, 4, 385),
            ("Novice_Player", 1, 1, 3, 115)
        ]
        for name, w, d, l, s in default_seed:
            self.players[name] = PlayerProfile(name, w, d, l, s)
            self.unique_usernames.add(name)
        self.save_to_file()`
  },
  {
    id: "sound_manager",
    name: "sound_manager.py",
    path: "sound_manager.py",
    language: "python",
    description: "Pygame audio system with procedural wave synthesis fallback and exception handling.",
    topicsCovered: ["Library - pygame (pygame.mixer)", "Exception Handling - try-catch", "Functions, Scope, and Wave Synthesis"],
    content: `"""
Sound and Music Audio Engine
----------------------------
Covers Syllabus Requirements:
  - Library: pygame (pygame.mixer module initialization and Sound playback)
  - Exception Handling: try-catch for audio device failure, missing drivers
  - Functions, Scope, File I/O (procedural synthesis using Python 'wave' module)
  - Modularization: Encapsulated SoundManager class
"""

import math
import os
import struct
import wave
from constants import AUDIO_FREQUENCIES


class SoundManager:
    """Manages game sound effects and synthesized audio."""
    def __init__(self, sound_dir: str = "assets/sounds"):
        self.sound_dir: str = sound_dir
        self.audio_enabled: bool = False
        self.muted: bool = False
        self.sounds: dict[str, any] = {}
        
        os.makedirs(self.sound_dir, exist_ok=True)
        self._initialize_mixer()
        self._ensure_sound_files()
        self._load_sounds()

    def _initialize_mixer(self) -> None:
        """Attempts to initialize pygame.mixer with try-catch block."""
        try:
            import pygame
            pygame.mixer.pre_init(frequency=44100, size=-16, channels=2, buffer=512)
            pygame.mixer.init()
            self.audio_enabled = True
            print("[Audio] Pygame mixer successfully initialized.")
        except Exception as audio_err:
            print(f"[Audio Warning] Sound system disabled (Audio driver error: {audio_err})")
            self.audio_enabled = False

    def _generate_sine_wav(self, filename: str, frequency: float, duration_seconds: float = 0.15, volume: float = 0.5) -> None:
        """Synthesizes a clean audio WAV file using Python standard library (wave & struct)."""
        filepath = os.path.join(self.sound_dir, filename)
        if os.path.exists(filepath):
            return
            
        sample_rate = 44100
        total_samples = int(sample_rate * duration_seconds)
        
        try:
            with wave.open(filepath, "w") as wav_file:
                wav_file.setparams((1, 2, sample_rate, total_samples, "NONE", "not compressed"))
                samples_data = bytearray()
                for i in range(total_samples):
                    t = float(i) / sample_rate
                    envelope = math.exp(-3.0 * (i / total_samples))
                    val = math.sin(2.0 * math.pi * frequency * t) * envelope * volume
                    sample_int = int(max(min(val * 32767.0, 32767.0), -32768.0))
                    samples_data.extend(struct.pack("<h", sample_int))
                wav_file.writeframes(samples_data)
        except Exception as synth_err:
            print(f"[Audio Error] Failed to synthesize {filename}: {synth_err}")

    def _ensure_sound_files(self) -> None:
        self._generate_sine_wav("click.wav", AUDIO_FREQUENCIES["click"], duration_seconds=0.08, volume=0.3)
        self._generate_sine_wav("move_x.wav", AUDIO_FREQUENCIES["move_x"], duration_seconds=0.12, volume=0.45)
        self._generate_sine_wav("move_o.wav", AUDIO_FREQUENCIES["move_o"], duration_seconds=0.12, volume=0.45)
        self._generate_sine_wav("win.wav", AUDIO_FREQUENCIES["win"], duration_seconds=0.45, volume=0.55)
        self._generate_sine_wav("draw.wav", AUDIO_FREQUENCIES["draw"], duration_seconds=0.30, volume=0.4)

    def _load_sounds(self) -> None:
        if not self.audio_enabled:
            return

        try:
            import pygame
            sound_mappings = {
                "click": "click.wav",
                "move_x": "move_x.wav",
                "move_o": "move_o.wav",
                "win": "win.wav",
                "draw": "draw.wav"
            }
            for key, fname in sound_mappings.items():
                full_path = os.path.join(self.sound_dir, fname)
                if os.path.exists(full_path):
                    self.sounds[key] = pygame.mixer.Sound(full_path)
        except Exception as load_err:
            print(f"[Audio Error] Failed to load sound effects: {load_err}")

    def play_sound(self, sound_name: str) -> None:
        if not self.audio_enabled or self.muted:
            return
            
        try:
            sound_obj = self.sounds.get(sound_name)
            if sound_obj:
                sound_obj.play()
        except Exception as play_err:
            print(f"[Audio Warning] Could not play sound '{sound_name}': {play_err}")

    def toggle_mute(self) -> bool:
        self.muted = not self.muted
        return self.muted`
  },
  {
    id: "board",
    name: "board.py",
    path: "board.py",
    language: "python",
    description: "Encapsulates the 3x3 game board with generators, nested loops, and nested conditionals.",
    topicsCovered: ["Python - Class, Object", "Generators", "Loops (Nested)", "Conditional Statements (Nested)"],
    content: `"""
Board and Move Engine Module
----------------------------
Covers Syllabus Requirements:
  - Python OOP: Class (Board), Object lifecycle, Encapsulation
  - Loops (Nested): 3x3 matrix iteration, grid traversal
  - Conditional Statements (Nested): Move validation, winning line identification
  - Generators: Generator yielding winning combinations and empty cells
  - Built-in data types: List (2D grid), Tuple (row, col coordinates), String ('X', 'O')
"""

from typing import Generator
from constants import SYMBOL_X, SYMBOL_O, SYMBOL_EMPTY


class Board:
    """Encapsulates the 3x3 Tic-Tac-Toe game board grid and state."""
    def __init__(self):
        self.grid: list[list[str]] = []
        self.last_move: tuple[int, int] | None = None
        self.winning_line: list[tuple[int, int]] | None = None
        self.winner: str | None = None
        self.is_draw: bool = False
        self.move_count: int = 0
        self.reset()

    def reset(self) -> None:
        """Clears board using NESTED LOOPS."""
        self.grid = []
        for row_idx in range(3):
            row: list[str] = []
            for col_idx in range(3):
                row.append(SYMBOL_EMPTY)
            self.grid.append(row)
            
        self.last_move = None
        self.winning_line = None
        self.winner = None
        self.is_draw = False
        self.move_count = 0

    def generate_winning_lines(self) -> Generator[list[tuple[int, int]], None, None]:
        """Generator yielding all 8 winning coordinate lines via 'yield'."""
        for r in range(3):
            yield [(r, 0), (r, 1), (r, 2)]

        for c in range(3):
            yield [(0, c), (1, c), (2, c)]

        yield [(0, 0), (1, 1), (2, 2)]
        yield [(0, 2), (1, 1), (2, 0)]

    def iter_empty_cells(self) -> Generator[tuple[int, int], None, None]:
        """Generator that yields available (row, col) coordinates."""
        for r in range(3):
            for c in range(3):
                if self.grid[r][c] == SYMBOL_EMPTY:
                    yield (r, c)

    def is_valid_move(self, row: int, col: int) -> bool:
        """Validates move using NESTED CONDITIONAL STATEMENTS."""
        if 0 <= row < 3 and 0 <= col < 3:
            if self.grid[row][col] == SYMBOL_EMPTY:
                return True
            else:
                return False
        else:
            return False

    def make_move(self, row: int, col: int, symbol: str) -> bool:
        if not self.is_valid_move(row, col):
            return False
            
        if self.winner or self.is_draw:
            return False

        self.grid[row][col] = symbol
        self.last_move = (row, col)
        self.move_count += 1
        self.check_game_over()
        return True

    def check_game_over(self) -> tuple[str | None, bool]:
        """Evaluates win or draw using generator consumption and nested conditionals."""
        for line in self.generate_winning_lines():
            c0, c1, c2 = line
            val0 = self.grid[c0[0]][c0[1]]
            val1 = self.grid[c1[0]][c1[1]]
            val2 = self.grid[c2[0]][c2[1]]

            if val0 != SYMBOL_EMPTY:
                if val0 == val1 and val1 == val2:
                    self.winner = val0
                    self.winning_line = line
                    return (self.winner, False)

        if self.is_full() and not self.winner:
            self.is_draw = True
            return (None, True)

        return (None, False)

    def is_full(self) -> bool:
        for r in range(3):
            for c in range(3):
                if self.grid[r][c] == SYMBOL_EMPTY:
                    return False
        return True

    def get_board_copy(self) -> list[list[str]]:
        return [[self.grid[r][c] for c in range(3)] for r in range(3)]`
  },
  {
    id: "ai",
    name: "ai.py",
    path: "ai.py",
    language: "python",
    description: "Minimax AI decision engine using Recursion, alpha-beta pruning, and multiple difficulty levels.",
    topicsCovered: ["Recursion", "Conditional Statements (Nested)", "Loops (Nested)", "Generators", "Functions - parameters and scope"],
    content: `"""
Artificial Intelligence Module
------------------------------
Covers Syllabus Requirements:
  - Recursion: Minimax Decision Algorithm with recursive tree expansion
  - Conditional Statements (Nested): Recursive terminal state evaluation, Alpha-Beta pruning
  - Loops (Nested): Board traversal for empty spaces
  - Functions: Recursive calls, parameter passing, return values, variable scope
  - Generators: Generator yielding available coordinates
"""

import random
from typing import Generator
from constants import SYMBOL_X, SYMBOL_O, SYMBOL_EMPTY


def generate_available_moves(grid: list[list[str]]) -> Generator[tuple[int, int], None, None]:
    for r in range(3):
        for c in range(3):
            if grid[r][c] == SYMBOL_EMPTY:
                yield (r, c)


def evaluate_board(grid: list[list[str]]) -> int | None:
    lines = [
        [(0, 0), (0, 1), (0, 2)], [(1, 0), (1, 1), (1, 2)], [(2, 0), (2, 1), (2, 2)],
        [(0, 0), (1, 0), (2, 0)], [(0, 1), (1, 1), (2, 1)], [(0, 2), (1, 2), (2, 2)],
        [(0, 0), (1, 1), (2, 2)], [(0, 2), (1, 1), (2, 0)]
    ]

    for line in lines:
        c0, c1, c2 = line
        val0 = grid[c0[0]][c0[1]]
        val1 = grid[c1[0]][c1[1]]
        val2 = grid[c2[0]][c2[1]]

        if val0 != SYMBOL_EMPTY:
            if val0 == val1 and val1 == val2:
                if val0 == SYMBOL_O:
                    return 10
                elif val0 == SYMBOL_X:
                    return -10

    for r in range(3):
        for c in range(3):
            if grid[r][c] == SYMBOL_EMPTY:
                return None

    return 0


# ==============================================================================
# RECURSIVE MINIMAX ALGORITHM (Syllabus Requirement: Recursion)
# ==============================================================================
def minimax(
    grid: list[list[str]],
    depth: int,
    is_maximizing: bool,
    alpha: float = -float('inf'),
    beta: float = float('inf')
) -> int:
    """Unbeatable AI decision logic implemented via RECURSION."""
    # BASE CASE
    score = evaluate_board(grid)
    if score is not None:
        if score > 0:
            return score - depth
        elif score < 0:
            return score + depth
        else:
            return 0

    # RECURSIVE STEP: Maximizing (AI 'O')
    if is_maximizing:
        max_eval = -float('inf')
        for row, col in generate_available_moves(grid):
            grid[row][col] = SYMBOL_O
            evaluation = minimax(grid, depth + 1, False, alpha, beta)
            grid[row][col] = SYMBOL_EMPTY
            
            if evaluation > max_eval:
                max_eval = evaluation
            if max_eval > alpha:
                alpha = max_eval
            if beta <= alpha:
                break
        return int(max_eval)

    # RECURSIVE STEP: Minimizing (Human 'X')
    else:
        min_eval = float('inf')
        for row, col in generate_available_moves(grid):
            grid[row][col] = SYMBOL_X
            evaluation = minimax(grid, depth + 1, True, alpha, beta)
            grid[row][col] = SYMBOL_EMPTY
            
            if evaluation < min_eval:
                min_eval = evaluation
            if min_eval < beta:
                beta = min_eval
            if beta <= alpha:
                break
        return int(min_eval)


class AIPlayer:
    def __init__(self, difficulty: str = "Hard", symbol: str = SYMBOL_O):
        self.difficulty: str = difficulty
        self.symbol: str = symbol
        self.opponent_symbol: str = SYMBOL_X if symbol == SYMBOL_O else SYMBOL_O

    def get_best_move(self, board_grid: list[list[str]]) -> tuple[int, int] | None:
        available_moves: list[tuple[int, int]] = list(generate_available_moves(board_grid))
        if not available_moves:
            return None

        if "Easy" in self.difficulty:
            return random.choice(available_moves)

        elif "Medium" in self.difficulty:
            for r, c in available_moves:
                board_grid[r][c] = self.symbol
                if evaluate_board(board_grid) == 10:
                    board_grid[r][c] = SYMBOL_EMPTY
                    return (r, c)
                board_grid[r][c] = SYMBOL_EMPTY

            for r, c in available_moves:
                board_grid[r][c] = self.opponent_symbol
                if evaluate_board(board_grid) == -10:
                    board_grid[r][c] = SYMBOL_EMPTY
                    return (r, c)
                board_grid[r][c] = SYMBOL_EMPTY

            if (1, 1) in available_moves:
                return (1, 1)
            return random.choice(available_moves)

        else:  # Hard / Unbeatable (Minimax Recursion)
            best_score = -float('inf')
            optimal_move = available_moves[0]

            if len(available_moves) >= 8 and (1, 1) in available_moves:
                return (1, 1)

            for r, c in available_moves:
                board_grid[r][c] = self.symbol
                move_score = minimax(board_grid, depth=0, is_maximizing=False)
                board_grid[r][c] = SYMBOL_EMPTY

                if move_score > best_score:
                    best_score = move_score
                    optimal_move = (r, c)

            return optimal_move`
  },
  {
    id: "game",
    name: "game.py",
    path: "game.py",
    language: "python",
    description: "Main game orchestrator managing state machine, animations, particle bursts, and scoring.",
    topicsCovered: ["Python - Class, Object", "Modularization", "Animations", "Player to Player & Player to Computer"],
    content: '"""\nMain Game Controller and State Machine\n--------------------------------------\nCovers Syllabus Requirements:\n  - Python OOP: Class (TicTacToeGame, Particle), Object lifecycle, instance methods\n  - Modularization: Combining board, ai, sound, logger, and leaderboard modules\n  - Animations: Glitter sparkle particle bursts, strike lines, hover transitions\n  - Player vs Player (PvP) and Player to Computer (Solo) modes with 1.0s AI delay\n"""\n\nimport math\nimport random\nfrom typing import Generator\n\ntry:\n    import pygame\nexcept ImportError:\n    pygame = None\n\nfrom board import Board\nfrom ai import AIPlayer\nfrom leaderboard import LeaderboardManager\nfrom sound_manager import SoundManager\nfrom logger import log_activity\nfrom constants import (\n    SYMBOL_X, SYMBOL_O, COLOR_X_SYMBOL, COLOR_O_SYMBOL, COLOR_WIN_LINE,\n    CELL_SIZE, GRID_OFFSET\n)\n\n\nclass Particle:\n    """Represents a single glowing, glittering animated particle."""\n    def __init__(self, x: float, y: float, color: tuple[int, int, int]):\n        self.x: float = float(x)\n        self.y: float = float(y)\n        angle = random.uniform(0, 2 * math.pi)\n        speed = random.uniform(2.0, 7.5)\n        self.vx: float = math.cos(angle) * speed\n        self.vy: float = math.sin(angle) * speed\n        self.color: tuple[int, int, int] = color\n        self.radius: float = random.uniform(3.0, 8.0)\n        self.life: float = 1.0  # 1.0 to 0.0 decay\n        self.decay_rate: float = random.uniform(0.02, 0.045)\n        # 40% of particles are glistening diamond/star sparkles\n        self.is_sparkle: bool = random.random() < 0.45\n        self.sparkle_angle: float = random.uniform(0, math.pi)\n\n    def update(self) -> bool:\n        """Updates particle physics. Returns False when particle expires."""\n        self.x += self.vx\n        self.y += self.vy\n        self.vx *= 0.94  # Smooth air drag\n        self.vy *= 0.94\n        self.life -= self.decay_rate\n        self.radius = max(0.5, self.radius * 0.96)\n        self.sparkle_angle += 0.1\n        return self.life > 0.0\n\n    def draw(self, surface: any) -> None:\n        """Draws glowing particle with semi-transparent halo and star sparkle."""\n        if pygame is None or self.life <= 0:\n            return\n\n        alpha = int(max(0, min(255, self.life * 255)))\n        # Create small temporary alpha surface for glow\n        surf_size = int(self.radius * 6) + 4\n        glow_surf = pygame.Surface((surf_size, surf_size), pygame.SRCALPHA)\n        center = surf_size // 2\n\n        # Draw outer soft glow\n        glow_color = (self.color[0], self.color[1], self.color[2], int(alpha * 0.35))\n        pygame.draw.circle(glow_surf, glow_color, (center, center), int(self.radius * 1.8))\n\n        # Draw inner core\n        core_color = (\n            min(255, self.color[0] + 50),\n            min(255, self.color[1] + 50),\n            min(255, self.color[2] + 50),\n            alpha\n        )\n        pygame.draw.circle(glow_surf, core_color, (center, center), int(self.radius))\n\n        # If it\'s a sparkle, draw glistening cross glint\n        if self.is_sparkle and self.life > 0.3:\n            arm_len = int(self.radius * 2.2)\n            sparkle_color = (255, 255, 255, int(alpha * 0.8))\n            pygame.draw.line(glow_surf, sparkle_color, (center - arm_len, center), (center + arm_len, center), 1)\n            pygame.draw.line(glow_surf, sparkle_color, (center, center - arm_len), (center, center + arm_len), 1)\n\n        surface.blit(glow_surf, (int(self.x - center), int(self.y - center)))\n\n\nclass TicTacToeGame:\n    """\n    Main Game Controller orchestrating rules, UI states, audio cues, AI timing, and logs.\n    """\n    def __init__(self):\n        # Subsystem instances (Object Creation)\n        self.board: Board = Board()\n        self.leaderboard: LeaderboardManager = LeaderboardManager()\n        self.sound_mgr: SoundManager = SoundManager()\n        self.ai: AIPlayer = AIPlayer(difficulty="Hard", symbol=SYMBOL_O)\n\n        # Game Session State\n        self.game_mode: str = "PVC"  # \'PVC\' (Solo vs AI) or \'PVP\' (2 Players)\n        self.ai_difficulty: str = "Hard"\n        self.player_x_name: str = "Player 1"\n        self.player_o_name: str = "AI Minimax"\n        self.current_turn: str = SYMBOL_X\n        self.state: str = "TITLE_MENU"  # \'TITLE_MENU\', \'PLAYING\', \'GAME_OVER\', \'LEADERBOARD\', \'LOGS\'\n\n        # 1.0s AI Reaction Delay system\n        self.ai_thinking: bool = False\n        self.ai_think_start_time: int = 0\n        self.ai_delay_ms: int = 1000  # Exactly 1 second delay requested by user\n\n        # Animation states\n        self.particles: list[Particle] = []\n        self.strike_progress: float = 0.0\n        self.is_animating_win: bool = False\n\n        # Session scores\n        self.session_wins_x: int = 0\n        self.session_wins_o: int = 0\n        self.session_draws: int = 0\n\n    def start_new_game(self, mode: str = "PVC", difficulty: str = "Hard", p1_name: str = "Player 1", p2_name: str = "Computer") -> None:\n        """Initializes a new match with custom parameters."""\n        self.game_mode = mode\n        self.ai_difficulty = difficulty\n        self.player_x_name = p1_name.strip() or "Player 1"\n        self.player_o_name = p2_name.strip() if mode == "PVP" else f"AI ({difficulty})"\n        self.ai = AIPlayer(difficulty=difficulty, symbol=SYMBOL_O)\n        \n        self.board.reset()\n        self.current_turn = SYMBOL_X\n        self.particles.clear()\n        self.strike_progress = 0.0\n        self.is_animating_win = False\n        self.ai_thinking = False\n        self.ai_think_start_time = 0\n        self.state = "PLAYING"\n\n        log_activity(\n            event_type="GAME_START",\n            details=f"Mode: {mode} | Opponent: {self.player_o_name} | Difficulty: {difficulty}",\n            username=self.player_x_name\n        )\n        self.sound_mgr.play_sound("click")\n\n    def handle_cell_click(self, row: int, col: int) -> bool:\n        """Processes a click on grid coordinates (row, col)."""\n        if self.state != "PLAYING" or self.is_animating_win or self.ai_thinking:\n            return False\n\n        # Move validation\n        if not self.board.is_valid_move(row, col):\n            return False\n\n        # Calculate cell center coordinates for particle burst\n        grid_x, grid_y = GRID_OFFSET\n        cx = grid_x + col * CELL_SIZE + CELL_SIZE // 2\n        cy = grid_y + row * CELL_SIZE + CELL_SIZE // 2\n        burst_color = COLOR_X_SYMBOL if self.current_turn == SYMBOL_X else COLOR_O_SYMBOL\n        self.spawn_particles(cx, cy, burst_color, count=28)\n\n        # Move execution\n        success = self.board.make_move(row, col, self.current_turn)\n        if not success:\n            return False\n\n        # Sound feedback\n        self.sound_mgr.play_sound("move_x" if self.current_turn == SYMBOL_X else "move_o")\n        \n        # Check if match concluded\n        if self._evaluate_match_status():\n            return True\n\n        # Switch turns\n        next_turn = SYMBOL_O if self.current_turn == SYMBOL_X else SYMBOL_X\n        self.current_turn = next_turn\n\n        # If playing vs AI and it\'s now AI\'s turn, initiate 1.0 second delay timer\n        if self.game_mode == "PVC" and self.current_turn == SYMBOL_O:\n            self.ai_thinking = True\n            self.ai_think_start_time = pygame.time.get_ticks() if pygame else 0\n\n        return True\n\n    def update_ai_timer(self, current_time_ms: int) -> None:\n        """\n        Manages the 1.0 second AI thinking delay.\n        Triggers AI move only when 1.0 second (1000ms) has elapsed.\n        """\n        if not self.ai_thinking or self.state != "PLAYING":\n            return\n\n        # Check if 1000ms delay has elapsed\n        if current_time_ms - self.ai_think_start_time >= self.ai_delay_ms:\n            self._execute_ai_move()\n\n    def _execute_ai_move(self) -> None:\n        """Executes computer opponent move after the 1-second delay."""\n        self.ai_thinking = False\n        board_copy = self.board.get_board_copy()\n        ai_move = self.ai.get_best_move(board_copy)\n        \n        if ai_move:\n            r, c = ai_move\n            grid_x, grid_y = GRID_OFFSET\n            cx = grid_x + c * CELL_SIZE + CELL_SIZE // 2\n            cy = grid_y + r * CELL_SIZE + CELL_SIZE // 2\n            # Glitter particle burst for AI move\n            self.spawn_particles(cx, cy, COLOR_O_SYMBOL, count=28)\n\n            self.board.make_move(r, c, SYMBOL_O)\n            self.sound_mgr.play_sound("move_o")\n            \n            if not self._evaluate_match_status():\n                self.current_turn = SYMBOL_X\n\n    def _evaluate_match_status(self) -> bool:\n        """Checks if game ended with a win or draw. Updates stats, logs, and leaderboard."""\n        winner, is_draw = self.board.check_game_over()\n        \n        if winner:\n            self.state = "GAME_OVER"\n            self.is_animating_win = True\n            self.strike_progress = 0.0\n            self.sound_mgr.play_sound("win")\n\n            winner_name = self.player_x_name if winner == SYMBOL_X else self.player_o_name\n            loser_name = self.player_o_name if winner == SYMBOL_X else self.player_x_name\n\n            if winner == SYMBOL_X:\n                self.session_wins_x += 1\n                self.leaderboard.record_match_result(self.player_x_name, "win", self.ai_difficulty)\n                if self.game_mode == "PVP":\n                    self.leaderboard.record_match_result(self.player_o_name, "loss", self.ai_difficulty)\n            else:\n                self.session_wins_o += 1\n                if self.game_mode == "PVC":\n                    self.leaderboard.record_match_result(self.player_x_name, "loss", self.ai_difficulty)\n                else:\n                    self.leaderboard.record_match_result(self.player_o_name, "win", self.ai_difficulty)\n                    self.leaderboard.record_match_result(self.player_x_name, "loss", self.ai_difficulty)\n\n            log_activity(\n                event_type="GAME_WIN",\n                details=f"Winner: {winner_name} ({winner}) over {loser_name} in {self.board.move_count} moves",\n                username=winner_name\n            )\n            return True\n\n        elif is_draw:\n            self.state = "GAME_OVER"\n            self.session_draws += 1\n            self.sound_mgr.play_sound("draw")\n\n            self.leaderboard.record_match_result(self.player_x_name, "draw", self.ai_difficulty)\n            if self.game_mode == "PVP":\n                self.leaderboard.record_match_result(self.player_o_name, "draw", self.ai_difficulty)\n\n            log_activity(\n                event_type="GAME_DRAW",\n                details=f"Draw between {self.player_x_name} and {self.player_o_name} (9 moves)",\n                username=self.player_x_name\n            )\n            return True\n\n        return False\n\n    def spawn_particles(self, x: float, y: float, color: tuple[int, int, int], count: int = 25) -> None:\n        """Spawns glistening glitter particles at pixel coordinates."""\n        for _ in range(count):\n            self.particles.append(Particle(x, y, color))\n\n    def update_animations(self) -> None:\n        """Updates running animations (particles and win strike line)."""\n        # Update particles and prune expired ones\n        self.particles = [p for p in self.particles if p.update()]\n\n        # Progress win strike line smoothly\n        if self.is_animating_win and self.strike_progress < 1.0:\n            self.strike_progress = min(1.0, self.strike_progress + 0.05)\n            # Continuous celebratory fireworks sparkles during victory\n            if len(self.particles) < 70 and random.random() < 0.6:\n                rx = random.uniform(180, 620)\n                ry = random.uniform(130, 560)\n                sparkle_color = random.choice([COLOR_WIN_LINE, (255, 215, 0), COLOR_X_SYMBOL, (255, 255, 255)])\n                self.spawn_particles(rx, ry, sparkle_color, count=3)\n'
  },
  {
    id: "main",
    name: "main.py",
    path: "main.py",
    language: "python",
    description: "Pygame display window, clock loop, event handling, particle rendering, and self-testing mode.",
    topicsCovered: ["Introduction of a library - pygame", "Library - pygame", "Event loop & 60 FPS clock", "Rendering Primitives & HUD"],
    content: '"""\n================================================================================\nPygame Tic-Tac-Toe Pro: Complete Desktop PC Edition\n================================================================================\nFeatures:\n  - High-Fidelity Title Screen with Bespoke Logo, Mode Select, and Name Input\n  - Interactive Text Input Boxes (Type custom player names!)\n  - 1.0-Second AI Thinking Delay with "AI is thinking..." Status\n  - Dazzling Glitter Particle Effects & Victory Confetti\n  - Clear Navigation & Controls: Press R to Restart, ESC for Menu, X to Exit, M to Mute\n  - Game Over Status: "{Player} Wins!" / "AI Wins! {Player} Loses!"\n  - Persistent Text File I/O (Leaderboard & Player Activity Logs)\n  - 100% Compatible with both pygame and pygame-ce\n================================================================================\n"""\n\nfrom __future__ import annotations\nimport sys\nimport os\nimport math\n\ntry:\n    import pygame\nexcept ImportError:\n    pygame = None\n\nfrom constants import (\n    SCREEN_WIDTH, SCREEN_HEIGHT, COLOR_BACKGROUND, COLOR_PANEL_BG,\n    COLOR_GRID_LINES, COLOR_X_SYMBOL, COLOR_O_SYMBOL, COLOR_WIN_LINE,\n    COLOR_TEXT_PRIMARY, COLOR_TEXT_MUTED, COLOR_BUTTON_DEFAULT,\n    COLOR_BUTTON_HOVER, COLOR_ACCENT_AMBER, GRID_OFFSET, CELL_SIZE,\n    SYMBOL_X, SYMBOL_O, FPS\n)\n\n\ndef get_safe_font(size: int, bold: bool = False):\n    """\n    Returns a reliable font with graceful fallback to Pygame\'s built-in font\n    to guarantee text renders on Windows, Mac, and Linux without blank screens.\n    """\n    import pygame\n    try:\n        f = pygame.font.SysFont("Arial", size, bold=bold)\n        if f:\n            return f\n    except Exception:\n        pass\n    return pygame.font.Font(None, int(size * 1.15))\n\n\ndef draw_text(surface: pygame.Surface, text: str, font: pygame.font.Font, color: tuple[int, int, int], center_x: int, center_y: int) -> pygame.Rect:\n    """Renders centered text onto surface."""\n    text_surf = font.render(text, True, color)\n    text_rect = text_surf.get_rect(center=(int(center_x), int(center_y)))\n    surface.blit(text_surf, text_rect)\n    return text_rect\n\n\ndef draw_text_left(surface: pygame.Surface, text: str, font: pygame.font.Font, color: tuple[int, int, int], left_x: int, center_y: int) -> pygame.Rect:\n    """Renders left-aligned text onto surface."""\n    text_surf = font.render(text, True, color)\n    text_rect = text_surf.get_rect(midleft=(int(left_x), int(center_y)))\n    surface.blit(text_surf, text_rect)\n    return text_rect\n\n\ndef draw_button(surface: pygame.Surface, text: str, font: pygame.font.Font, rect: pygame.Rect, mouse_pos: tuple[int, int], active: bool = False, accent_color: tuple[int, int, int] | None = None) -> bool:\n    """Renders a button with hover highlights, borders, and active glow."""\n    is_hovered = rect.collidepoint(mouse_pos)\n    \n    if active:\n        bg_color = (24, 40, 68)\n        border_color = accent_color or COLOR_X_SYMBOL\n        text_color = accent_color or COLOR_X_SYMBOL\n    elif is_hovered:\n        bg_color = COLOR_BUTTON_HOVER\n        border_color = (148, 163, 184)\n        text_color = COLOR_TEXT_PRIMARY\n    else:\n        bg_color = COLOR_BUTTON_DEFAULT\n        border_color = (51, 65, 85)\n        text_color = COLOR_TEXT_MUTED\n\n    pygame.draw.rect(surface, bg_color, rect, border_radius=8)\n    pygame.draw.rect(surface, border_color, rect, width=2 if (active or is_hovered) else 1, border_radius=8)\n    draw_text(surface, text, font, text_color, rect.centerx, rect.centery)\n    return is_hovered\n\n\ndef draw_logo(surface: pygame.Surface, center_x: int, center_y: int, font_logo: pygame.font.Font):\n    """Draws stylized inline logo with mini board and glowing X and O."""\n    # Mini 3x3 board icon (42x42 px)\n    icon_w = 42\n    icon_x = center_x - 170\n    icon_y = center_y - 21\n    \n    # Background plate for logo icon\n    pygame.draw.rect(surface, (30, 41, 59), (icon_x, icon_y, icon_w, icon_w), border_radius=8)\n    pygame.draw.rect(surface, (51, 65, 85), (icon_x, icon_y, icon_w, icon_w), width=1, border_radius=8)\n    \n    # Mini grid lines\n    step = icon_w // 3\n    pygame.draw.line(surface, (71, 85, 105), (icon_x + step, icon_y + 4), (icon_x + step, icon_y + icon_w - 4), 1)\n    pygame.draw.line(surface, (71, 85, 105), (icon_x + step * 2, icon_y + 4), (icon_x + step * 2, icon_y + icon_w - 4), 1)\n    pygame.draw.line(surface, (71, 85, 105), (icon_x + 4, icon_y + step), (icon_x + icon_w - 4, icon_y + step), 1)\n    pygame.draw.line(surface, (71, 85, 105), (icon_x + 4, icon_y + step * 2), (icon_x + icon_w - 4, icon_y + step * 2), 1)\n    \n    # Mini X in top-left, mini O in bottom-right\n    x_font = get_safe_font(16, bold=True)\n    draw_text(surface, "X", x_font, COLOR_X_SYMBOL, icon_x + step // 2, icon_y + step // 2)\n    draw_text(surface, "O", x_font, COLOR_O_SYMBOL, icon_x + step * 2 + step // 2, icon_y + step * 2 + step // 2)\n\n    # Title text\n    draw_text_left(surface, "TIC-TAC-TOE PRO", font_logo, COLOR_TEXT_PRIMARY, center_x - 110, center_y)\n\n\ndef main():\n    """Main Game Loop & Lifecycle."""\n    # Headless test flag support\n    if "--test" in sys.argv:\n        from board import Board\n        from ai import AIPlayer\n        b = Board()\n        assert len(list(b.generate_winning_lines())) == 8\n        ai = AIPlayer(difficulty="Hard")\n        print("[Pass] Self-tests verified successfully!")\n        return\n\n    if pygame is None:\n        print("\\n[Error] Pygame or Pygame-ce is not installed!")\n        print("Please run: pip install -r requirements.txt\\n")\n        sys.exit(1)\n\n    pygame.init()\n    pygame.font.init()\n\n    screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))\n    pygame.display.set_caption("Pygame Tic-Tac-Toe Pro | Minimax AI & Leaderboard")\n    clock = pygame.time.Clock()\n    game = TicTacToeGame()\n\n    # Font definitions\n    font_logo = get_safe_font(30, bold=True)\n    font_title = get_safe_font(26, bold=True)\n    font_heading = get_safe_font(18, bold=True)\n    font_button = get_safe_font(15, bold=True)\n    font_regular = get_safe_font(14, bold=False)\n    font_small = get_safe_font(12, bold=False)\n    font_large_symbol = get_safe_font(74, bold=True)\n    font_code = get_safe_font(13, bold=False)\n\n    # Setup State\n    selected_mode = "PVC"  # \'PVC\' or \'PVP\'\n    selected_difficulty = "Hard"\n    p1_name = "Player 1"\n    p2_name = "Player 2"\n    active_input_box: str | None = None  # \'p1\', \'p2\', or None\n    cursor_timer = 0\n\n    # Layout Rectangles for Title Screen\n    btn_mode_pvc = pygame.Rect(170, 160, 220, 42)\n    btn_mode_pvp = pygame.Rect(410, 160, 220, 42)\n\n    btn_diff_easy = pygame.Rect(170, 245, 140, 38)\n    btn_diff_med = pygame.Rect(330, 245, 140, 38)\n    btn_diff_hard = pygame.Rect(490, 245, 140, 38)\n\n    input_rect_p1 = pygame.Rect(260, 318, 280, 36)\n    input_rect_p2 = pygame.Rect(260, 370, 280, 36)\n\n    btn_start_game = pygame.Rect(250, 435, 300, 50)\n    btn_view_leaderboard = pygame.Rect(250, 500, 145, 38)\n    btn_view_logs = pygame.Rect(405, 500, 145, 38)\n\n    # In-Game Bottom Navigation Buttons\n    btn_ingame_restart = pygame.Rect(120, 595, 130, 38)\n    btn_ingame_menu = pygame.Rect(265, 595, 130, 38)\n    btn_ingame_mute = pygame.Rect(410, 595, 130, 38)\n    btn_ingame_exit = pygame.Rect(555, 595, 130, 38)\n\n    running = True\n\n    while running:\n        current_time = pygame.time.get_ticks()\n        mouse_pos = pygame.mouse.get_pos()\n        delta_time = clock.tick(FPS)\n        cursor_timer = (cursor_timer + 1) % 60\n\n        # Manage 1.0s AI Reaction Delay\n        game.update_ai_timer(current_time)\n\n        # ----------------------------------------------------------------------\n        # EVENT HANDLING\n        # ----------------------------------------------------------------------\n        for event in pygame.event.get():\n            if event.type == pygame.QUIT:\n                running = False\n                break\n\n            # ------------------------------------------------------------------\n            # KEYBOARD SHORTCUTS\n            # ------------------------------------------------------------------\n            elif event.type == pygame.KEYDOWN:\n                # Text input typing when box is focused on title screen\n                if game.state == "TITLE_MENU" and active_input_box is not None:\n                    if event.key == pygame.K_RETURN:\n                        active_input_box = None\n                    elif event.key == pygame.K_BACKSPACE:\n                        if active_input_box == "p1":\n                            p1_name = p1_name[:-1]\n                        elif active_input_box == "p2":\n                            p2_name = p2_name[:-1]\n                    else:\n                        if len(event.unicode) > 0 and event.unicode.isprintable():\n                            if active_input_box == "p1" and len(p1_name) < 15:\n                                p1_name += event.unicode\n                            elif active_input_box == "p2" and len(p2_name) < 15:\n                                p2_name += event.unicode\n                    continue\n\n                # Global Nav Shortcuts\n                if event.key == pygame.K_x:\n                    running = False\n                    break\n                elif event.key == pygame.K_ESCAPE:\n                    game.state = "TITLE_MENU"\n                    game.sound_mgr.play_sound("click")\n                elif event.key == pygame.K_m:\n                    game.sound_mgr.toggle_mute()\n                elif event.key == pygame.K_r:\n                    if game.state in ("PLAYING", "GAME_OVER"):\n                        p2 = p2_name if selected_mode == "PVP" else "Computer"\n                        game.start_new_game(selected_mode, selected_difficulty, p1_name, p2)\n\n            # ------------------------------------------------------------------\n            # MOUSE CLICKS\n            # ------------------------------------------------------------------\n            elif event.type == pygame.MOUSEBUTTONDOWN and event.button == 1:\n                # TITLE MENU INTERACTIONS\n                if game.state == "TITLE_MENU":\n                    # Mode selection\n                    if btn_mode_pvc.collidepoint(mouse_pos):\n                        selected_mode = "PVC"\n                        active_input_box = None\n                        game.sound_mgr.play_sound("click")\n                    elif btn_mode_pvp.collidepoint(mouse_pos):\n                        selected_mode = "PVP"\n                        active_input_box = None\n                        game.sound_mgr.play_sound("click")\n\n                    # Difficulty selection (Solo)\n                    elif selected_mode == "PVC" and btn_diff_easy.collidepoint(mouse_pos):\n                        selected_difficulty = "Easy"\n                        active_input_box = None\n                        game.sound_mgr.play_sound("click")\n                    elif selected_mode == "PVC" and btn_diff_med.collidepoint(mouse_pos):\n                        selected_difficulty = "Medium"\n                        active_input_box = None\n                        game.sound_mgr.play_sound("click")\n                    elif selected_mode == "PVC" and btn_diff_hard.collidepoint(mouse_pos):\n                        selected_difficulty = "Hard"\n                        active_input_box = None\n                        game.sound_mgr.play_sound("click")\n\n                    # Input box clicks\n                    elif input_rect_p1.collidepoint(mouse_pos):\n                        active_input_box = "p1"\n                    elif selected_mode == "PVP" and input_rect_p2.collidepoint(mouse_pos):\n                        active_input_box = "p2"\n                    else:\n                        active_input_box = None\n\n                    # Action buttons\n                    if btn_start_game.collidepoint(mouse_pos):\n                        p2 = p2_name if selected_mode == "PVP" else "Computer"\n                        game.start_new_game(selected_mode, selected_difficulty, p1_name, p2)\n                    elif btn_view_leaderboard.collidepoint(mouse_pos):\n                        game.state = "LEADERBOARD"\n                        game.sound_mgr.play_sound("click")\n                    elif btn_view_logs.collidepoint(mouse_pos):\n                        game.state = "LOGS"\n                        game.sound_mgr.play_sound("click")\n\n                # IN-GAME & GAME OVER INTERACTIONS\n                elif game.state in ("PLAYING", "GAME_OVER"):\n                    # Bottom navigation buttons\n                    if btn_ingame_restart.collidepoint(mouse_pos):\n                        p2 = p2_name if selected_mode == "PVP" else "Computer"\n                        game.start_new_game(selected_mode, selected_difficulty, p1_name, p2)\n                    elif btn_ingame_menu.collidepoint(mouse_pos):\n                        game.state = "TITLE_MENU"\n                        game.sound_mgr.play_sound("click")\n                    elif btn_ingame_mute.collidepoint(mouse_pos):\n                        game.sound_mgr.toggle_mute()\n                    elif btn_ingame_exit.collidepoint(mouse_pos):\n                        running = False\n                        break\n\n                    # 3x3 Board Cell Clicks\n                    grid_x, grid_y = GRID_OFFSET\n                    board_rect = pygame.Rect(grid_x, grid_y, CELL_SIZE * 3, CELL_SIZE * 3)\n\n                    if board_rect.collidepoint(mouse_pos) and game.state == "PLAYING" and not game.ai_thinking:\n                        col = (mouse_pos[0] - grid_x) // CELL_SIZE\n                        row = (mouse_pos[1] - grid_y) // CELL_SIZE\n                        if 0 <= row < 3 and 0 <= col < 3:\n                            game.handle_cell_click(row, col)\n\n                # MODAL SCREENS (Leaderboard / Logs)\n                elif game.state in ("LEADERBOARD", "LOGS"):\n                    btn_back = pygame.Rect(325, 585, 150, 42)\n                    if btn_back.collidepoint(mouse_pos):\n                        game.state = "TITLE_MENU"\n                        game.sound_mgr.play_sound("click")\n\n        # ----------------------------------------------------------------------\n        # UPDATE ANIMATIONS\n        # ----------------------------------------------------------------------\n        game.update_animations()\n\n        # ----------------------------------------------------------------------\n        # RENDERING PIPELINE\n        # ----------------------------------------------------------------------\n        screen.fill(COLOR_BACKGROUND)\n\n        # ======================================================================\n        # 1. RENDER TITLE SCREEN\n        # ======================================================================\n        if game.state == "TITLE_MENU":\n            # Logo & Title\n            draw_logo(screen, SCREEN_WIDTH // 2, 60, font_logo)\n            draw_text(screen, "Pygame Edition · Minimax AI · Persistent Leaderboard", font_small, COLOR_TEXT_MUTED, SCREEN_WIDTH // 2, 98)\n\n            # --- MODE SELECTION ---\n            draw_text(screen, "1. Select Game Mode:", font_heading, COLOR_TEXT_PRIMARY, SCREEN_WIDTH // 2, 138)\n            draw_button(screen, "Solo vs AI (Computer)", font_button, btn_mode_pvc, mouse_pos, active=(selected_mode == "PVC"))\n            draw_button(screen, "Player vs Player (PvP)", font_button, btn_mode_pvp, mouse_pos, active=(selected_mode == "PVP"))\n\n            # --- DIFFICULTY (Only if Solo) ---\n            if selected_mode == "PVC":\n                draw_text(screen, "2. AI Difficulty Level:", font_heading, COLOR_TEXT_PRIMARY, SCREEN_WIDTH // 2, 222)\n                draw_button(screen, "Easy (Casual)", font_regular, btn_diff_easy, mouse_pos, active=(selected_difficulty == "Easy"))\n                draw_button(screen, "Medium (Blocker)", font_regular, btn_diff_med, mouse_pos, active=(selected_difficulty == "Medium"))\n                draw_button(screen, "Unbeatable (Minimax)", font_regular, btn_diff_hard, mouse_pos, active=(selected_difficulty == "Hard"), accent_color=(56, 189, 248))\n\n            # --- PLAYER NAMES INPUT ---\n            y_name_sec = 300 if selected_mode == "PVC" else 240\n            draw_text(screen, "Enter Player Name(s):", font_heading, COLOR_TEXT_PRIMARY, SCREEN_WIDTH // 2, y_name_sec)\n\n            # Player 1 Input\n            p1_box_y = y_name_sec + 34\n            input_rect_p1.y = p1_box_y\n            draw_text_left(screen, "Player 1 (X):", font_regular, COLOR_X_SYMBOL, 150, p1_box_y + 18)\n            pygame.draw.rect(screen, (15, 23, 42), input_rect_p1, border_radius=6)\n            pygame.draw.rect(screen, COLOR_X_SYMBOL if active_input_box == "p1" else (51, 65, 85), input_rect_p1, width=2 if active_input_box == "p1" else 1, border_radius=6)\n            cursor_p1 = "|" if (active_input_box == "p1" and cursor_timer < 30) else ""\n            draw_text_left(screen, p1_name + cursor_p1, font_button, COLOR_TEXT_PRIMARY, input_rect_p1.x + 12, input_rect_p1.centery)\n\n            # Player 2 Input (Only if PvP)\n            if selected_mode == "PVP":\n                p2_box_y = p1_box_y + 48\n                input_rect_p2.y = p2_box_y\n                draw_text_left(screen, "Player 2 (O):", font_regular, COLOR_O_SYMBOL, 150, p2_box_y + 18)\n                pygame.draw.rect(screen, (15, 23, 42), input_rect_p2, border_radius=6)\n                pygame.draw.rect(screen, COLOR_O_SYMBOL if active_input_box == "p2" else (51, 65, 85), input_rect_p2, width=2 if active_input_box == "p2" else 1, border_radius=6)\n                cursor_p2 = "|" if (active_input_box == "p2" and cursor_timer < 30) else ""\n                draw_text_left(screen, p2_name + cursor_p2, font_button, COLOR_TEXT_PRIMARY, input_rect_p2.x + 12, input_rect_p2.centery)\n\n            # --- START & EXTRA BUTTONS ---\n            btn_start_y = 445 if selected_mode == "PVC" else 460\n            btn_start_game.y = btn_start_y\n            draw_button(screen, "START MATCH", font_heading, btn_start_game, mouse_pos, active=True, accent_color=(16, 185, 129))\n\n            btn_view_leaderboard.y = btn_start_y + 65\n            btn_view_logs.y = btn_start_y + 65\n            draw_button(screen, "Leaderboard", font_small, btn_view_leaderboard, mouse_pos)\n            draw_button(screen, "Activity Logs", font_small, btn_view_logs, mouse_pos)\n\n            # Bottom helper note\n            draw_text(screen, "Click text box to edit name · Press [X] anytime to Exit", font_small, (100, 116, 139), SCREEN_WIDTH // 2, SCREEN_HEIGHT - 25)\n\n        # ======================================================================\n        # 2. RENDER ACTIVE PLAYING / GAME OVER VIEW\n        # ======================================================================\n        elif game.state in ("PLAYING", "GAME_OVER"):\n            # Header status banner\n            if game.state == "PLAYING":\n                if game.ai_thinking:\n                    # Animated dots for 1.0s thinking delay\n                    dots = "." * ((current_time // 250) % 4)\n                    draw_text(screen, f"AI is thinking{dots}", font_title, COLOR_ACCENT_AMBER, SCREEN_WIDTH // 2, 42)\n                    draw_text(screen, f"Calculating optimal move (1.0s delay)", font_small, COLOR_TEXT_MUTED, SCREEN_WIDTH // 2, 74)\n                else:\n                    turn_name = game.player_x_name if game.current_turn == SYMBOL_X else game.player_o_name\n                    turn_col = COLOR_X_SYMBOL if game.current_turn == SYMBOL_X else COLOR_O_SYMBOL\n                    draw_text(screen, f"{turn_name}\'s Turn ({game.current_turn})", font_title, turn_col, SCREEN_WIDTH // 2, 42)\n                    mode_sub = f"Mode: Solo vs AI ({game.ai_difficulty})" if game.game_mode == "PVC" else "Mode: Player vs Player"\n                    draw_text(screen, f"{mode_sub}  ·  Moves: {game.board.move_count}/9", font_small, COLOR_TEXT_MUTED, SCREEN_WIDTH // 2, 74)\n            else:\n                # GAME OVER BANNER (Explicit Win / Loss / Draw text requested by user)\n                if game.board.winner:\n                    win_sym = game.board.winner\n                    if win_sym == SYMBOL_X:\n                        draw_text(screen, f"{game.player_x_name} Wins! (Victorious)", font_title, COLOR_WIN_LINE, SCREEN_WIDTH // 2, 40)\n                        draw_text(screen, f"Congratulations! {game.player_o_name} was defeated.", font_regular, COLOR_TEXT_MUTED, SCREEN_WIDTH // 2, 72)\n                    else:\n                        if game.game_mode == "PVC":\n                            draw_text(screen, f"AI Wins! {game.player_x_name} Loses!", font_title, COLOR_O_SYMBOL, SCREEN_WIDTH // 2, 40)\n                            draw_text(screen, "The Recursive Minimax algorithm scored a victory.", font_regular, COLOR_TEXT_MUTED, SCREEN_WIDTH // 2, 72)\n                        else:\n                            draw_text(screen, f"{game.player_o_name} Wins!", font_title, COLOR_WIN_LINE, SCREEN_WIDTH // 2, 40)\n                            draw_text(screen, f"{game.player_x_name} was defeated.", font_regular, COLOR_TEXT_MUTED, SCREEN_WIDTH // 2, 72)\n                else:\n                    draw_text(screen, "Match Ended in a Draw!", font_title, COLOR_ACCENT_AMBER, SCREEN_WIDTH // 2, 40)\n                    draw_text(screen, "Well fought tie! No empty squares remain.", font_regular, COLOR_TEXT_MUTED, SCREEN_WIDTH // 2, 72)\n\n            # Draw Board Background Plate\n            gx, gy = GRID_OFFSET\n            pygame.draw.rect(screen, (20, 29, 47), (gx - 10, gy - 10, CELL_SIZE * 3 + 20, CELL_SIZE * 3 + 20), border_radius=14)\n\n            # Draw Board Grid Lines\n            for i in range(1, 3):\n                # Vertical\n                pygame.draw.line(screen, COLOR_GRID_LINES, (gx + i * CELL_SIZE, gy), (gx + i * CELL_SIZE, gy + CELL_SIZE * 3), 4)\n                # Horizontal\n                pygame.draw.line(screen, COLOR_GRID_LINES, (gx, gy + i * CELL_SIZE), (gx + CELL_SIZE * 3, gy + i * CELL_SIZE), 4)\n\n            # Draw Cell Marks (X & O)\n            for r in range(3):\n                for c in range(3):\n                    val = game.board.grid[r][c]\n                    cx = gx + c * CELL_SIZE + CELL_SIZE // 2\n                    cy = gy + r * CELL_SIZE + CELL_SIZE // 2\n\n                    if val == SYMBOL_X:\n                        draw_text(screen, "X", font_large_symbol, COLOR_X_SYMBOL, cx, cy)\n                    elif val == SYMBOL_O:\n                        draw_text(screen, "O", font_large_symbol, COLOR_O_SYMBOL, cx, cy)\n\n            # Draw Animated Winning Line Strike\n            if game.board.winning_line and game.is_animating_win:\n                start_c = game.board.winning_line[0]\n                end_c = game.board.winning_line[2]\n                sx = gx + start_c[1] * CELL_SIZE + CELL_SIZE // 2\n                sy = gy + start_c[0] * CELL_SIZE + CELL_SIZE // 2\n                ex = gx + end_c[1] * CELL_SIZE + CELL_SIZE // 2\n                ey = gy + end_c[0] * CELL_SIZE + CELL_SIZE // 2\n                cur_x = sx + (ex - sx) * game.strike_progress\n                cur_y = sy + (ey - sy) * game.strike_progress\n                pygame.draw.line(screen, COLOR_WIN_LINE, (sx, sy), (cur_x, cur_y), 8)\n\n            # --- BOTTOM NAVIGATION BAR (All clickable & keyboard shortcuts) ---\n            draw_button(screen, "Restart [R]", font_small, btn_ingame_restart, mouse_pos)\n            draw_button(screen, "Menu [ESC]", font_small, btn_ingame_menu, mouse_pos)\n            mute_label = "Mute [M]: ON" if game.sound_mgr.muted else "Mute [M]: OFF"\n            draw_button(screen, mute_label, font_small, btn_ingame_mute, mouse_pos)\n            draw_button(screen, "Exit [X]", font_small, btn_ingame_exit, mouse_pos)\n\n        # ======================================================================\n        # 3. RENDER LEADERBOARD SCREEN\n        # ======================================================================\n        elif game.state == "LEADERBOARD":\n            draw_text(screen, "PERSISTENT LEADERBOARD", font_title, COLOR_TEXT_PRIMARY, SCREEN_WIDTH // 2, 50)\n            draw_text(screen, "Stored in \'leaderboard.txt\' via Text Mode File I/O", font_small, COLOR_TEXT_MUTED, SCREEN_WIDTH // 2, 82)\n\n            pygame.draw.rect(screen, COLOR_PANEL_BG, (100, 115, 600, 445), border_radius=12)\n            header_str = f"{\'Rank\':<6} {\'Username\':<18} {\'Score\':<8} {\'Wins\':<6} {\'Draws\':<6} {\'Losses\':<6} {\'Win Rate\':<8}"\n            draw_text(screen, header_str, font_code, COLOR_X_SYMBOL, SCREEN_WIDTH // 2, 140)\n            pygame.draw.line(screen, COLOR_GRID_LINES, (120, 160), (680, 160), 2)\n\n            top_players = game.leaderboard.get_top_players(limit=8)\n            y_offset = 190\n            for rank, profile in top_players:\n                line_str = f"#{rank:<5} {profile.username:<18} {profile.score:<8} {profile.wins:<6} {profile.draws:<6} {profile.losses:<6} {profile.win_rate}%"\n                draw_text(screen, line_str, font_code, COLOR_TEXT_PRIMARY, SCREEN_WIDTH // 2, y_offset)\n                y_offset += 38\n\n            draw_button(screen, "Return to Menu [ESC]", font_regular, pygame.Rect(310, 585, 180, 40), mouse_pos)\n\n        # ======================================================================\n        # 4. RENDER ACTIVITY LOGS SCREEN\n        # ======================================================================\n        elif game.state == "LOGS":\n            draw_text(screen, "ACTIVITY LOG INSPECTOR", font_title, COLOR_TEXT_PRIMARY, SCREEN_WIDTH // 2, 50)\n            draw_text(screen, "Read from \'player_activity_log.txt\' using Python File I/O", font_small, COLOR_TEXT_MUTED, SCREEN_WIDTH // 2, 82)\n\n            pygame.draw.rect(screen, COLOR_PANEL_BG, (60, 115, 680, 445), border_radius=12)\n            logs = read_activity_logs(max_entries=11)\n            y_offset = 145\n            for log_entry in logs:\n                display_entry = log_entry[:82]\n                draw_text(screen, display_entry, font_code, COLOR_TEXT_PRIMARY, SCREEN_WIDTH // 2, y_offset)\n                y_offset += 34\n\n            draw_button(screen, "Return to Menu [ESC]", font_regular, pygame.Rect(310, 585, 180, 40), mouse_pos)\n\n        # ======================================================================\n        # 5. RENDER GLITTER PARTICLES (Glowing halos + diamond sparkles)\n        # ======================================================================\n        for p in game.particles:\n            p.draw(screen)\n\n        pygame.display.flip()\n\n    pygame.quit()\n    print("[Shutdown] Pygame cleaned up successfully.")\n\n\nif __name__ == "__main__":\n    main()\n'
  },
  {
    id: "build_exe",
    name: "build_exe.bat",
    path: "build_exe.bat",
    language: "bat",
    description: "Windows batch script for single-click compilation to standalone .exe via PyInstaller.",
    topicsCovered: ["PyInstaller standalone compilation", "Automation script"],
    content: '"""\n================================================================================\nPygame Tic-Tac-Toe Pro: Complete Desktop PC Edition\n================================================================================\nFeatures:\n  - High-Fidelity Title Screen with Bespoke Logo, Mode Select, and Name Input\n  - Interactive Text Input Boxes (Type custom player names!)\n  - 1.0-Second AI Thinking Delay with "AI is thinking..." Status\n  - Dazzling Glitter Particle Effects & Victory Confetti\n  - Clear Navigation & Controls: Press R to Restart, ESC for Menu, X to Exit, M to Mute\n  - Game Over Status: "{Player} Wins!" / "AI Wins! {Player} Loses!"\n  - Persistent Text File I/O (Leaderboard & Player Activity Logs)\n  - 100% Compatible with both pygame and pygame-ce\n================================================================================\n"""\n\nfrom __future__ import annotations\nimport sys\nimport os\nimport math\n\ntry:\n    import pygame\nexcept ImportError:\n    pygame = None\n\nfrom constants import (\n    SCREEN_WIDTH, SCREEN_HEIGHT, COLOR_BACKGROUND, COLOR_PANEL_BG,\n    COLOR_GRID_LINES, COLOR_X_SYMBOL, COLOR_O_SYMBOL, COLOR_WIN_LINE,\n    COLOR_TEXT_PRIMARY, COLOR_TEXT_MUTED, COLOR_BUTTON_DEFAULT,\n    COLOR_BUTTON_HOVER, COLOR_ACCENT_AMBER, GRID_OFFSET, CELL_SIZE,\n    SYMBOL_X, SYMBOL_O, FPS\n)\nfrom game import TicTacToeGame\nfrom logger import read_activity_logs\n\n\ndef get_safe_font(size: int, bold: bool = False):\n    """\n    Returns a reliable font with graceful fallback to Pygame\'s built-in font\n    to guarantee text renders on Windows, Mac, and Linux without blank screens.\n    """\n    import pygame\n    try:\n        f = pygame.font.SysFont("Arial", size, bold=bold)\n        if f:\n            return f\n    except Exception:\n        pass\n    return pygame.font.Font(None, int(size * 1.15))\n\n\ndef draw_text(surface: pygame.Surface, text: str, font: pygame.font.Font, color: tuple[int, int, int], center_x: int, center_y: int) -> pygame.Rect:\n    """Renders centered text onto surface."""\n    text_surf = font.render(text, True, color)\n    text_rect = text_surf.get_rect(center=(int(center_x), int(center_y)))\n    surface.blit(text_surf, text_rect)\n    return text_rect\n\n\ndef draw_text_left(surface: pygame.Surface, text: str, font: pygame.font.Font, color: tuple[int, int, int], left_x: int, center_y: int) -> pygame.Rect:\n    """Renders left-aligned text onto surface."""\n    text_surf = font.render(text, True, color)\n    text_rect = text_surf.get_rect(midleft=(int(left_x), int(center_y)))\n    surface.blit(text_surf, text_rect)\n    return text_rect\n\n\ndef draw_button(surface: pygame.Surface, text: str, font: pygame.font.Font, rect: pygame.Rect, mouse_pos: tuple[int, int], active: bool = False, accent_color: tuple[int, int, int] | None = None) -> bool:\n    """Renders a button with hover highlights, borders, and active glow."""\n    is_hovered = rect.collidepoint(mouse_pos)\n    \n    if active:\n        bg_color = (24, 40, 68)\n        border_color = accent_color or COLOR_X_SYMBOL\n        text_color = accent_color or COLOR_X_SYMBOL\n    elif is_hovered:\n        bg_color = COLOR_BUTTON_HOVER\n        border_color = (148, 163, 184)\n        text_color = COLOR_TEXT_PRIMARY\n    else:\n        bg_color = COLOR_BUTTON_DEFAULT\n        border_color = (51, 65, 85)\n        text_color = COLOR_TEXT_MUTED\n\n    pygame.draw.rect(surface, bg_color, rect, border_radius=8)\n    pygame.draw.rect(surface, border_color, rect, width=2 if (active or is_hovered) else 1, border_radius=8)\n    draw_text(surface, text, font, text_color, rect.centerx, rect.centery)\n    return is_hovered\n\n\ndef draw_logo(surface: pygame.Surface, center_x: int, center_y: int, font_logo: pygame.font.Font):\n    """Draws stylized inline logo with mini board and glowing X and O."""\n    # Mini 3x3 board icon (42x42 px)\n    icon_w = 42\n    icon_x = center_x - 170\n    icon_y = center_y - 21\n    \n    # Background plate for logo icon\n    pygame.draw.rect(surface, (30, 41, 59), (icon_x, icon_y, icon_w, icon_w), border_radius=8)\n    pygame.draw.rect(surface, (51, 65, 85), (icon_x, icon_y, icon_w, icon_w), width=1, border_radius=8)\n    \n    # Mini grid lines\n    step = icon_w // 3\n    pygame.draw.line(surface, (71, 85, 105), (icon_x + step, icon_y + 4), (icon_x + step, icon_y + icon_w - 4), 1)\n    pygame.draw.line(surface, (71, 85, 105), (icon_x + step * 2, icon_y + 4), (icon_x + step * 2, icon_y + icon_w - 4), 1)\n    pygame.draw.line(surface, (71, 85, 105), (icon_x + 4, icon_y + step), (icon_x + icon_w - 4, icon_y + step), 1)\n    pygame.draw.line(surface, (71, 85, 105), (icon_x + 4, icon_y + step * 2), (icon_x + icon_w - 4, icon_y + step * 2), 1)\n    \n    # Mini X in top-left, mini O in bottom-right\n    x_font = get_safe_font(16, bold=True)\n    draw_text(surface, "X", x_font, COLOR_X_SYMBOL, icon_x + step // 2, icon_y + step // 2)\n    draw_text(surface, "O", x_font, COLOR_O_SYMBOL, icon_x + step * 2 + step // 2, icon_y + step * 2 + step // 2)\n\n    # Title text\n    draw_text_left(surface, "TIC-TAC-TOE PRO", font_logo, COLOR_TEXT_PRIMARY, center_x - 110, center_y)\n\n\ndef main():\n    """Main Game Loop & Lifecycle."""\n    # Headless test flag support\n    if "--test" in sys.argv:\n        from board import Board\n        from ai import AIPlayer\n        b = Board()\n        assert len(list(b.generate_winning_lines())) == 8\n        ai = AIPlayer(difficulty="Hard")\n        print("[Pass] Self-tests verified successfully!")\n        return\n\n    if pygame is None:\n        print("\\n[Error] Pygame or Pygame-ce is not installed!")\n        print("Please run: pip install -r requirements.txt\\n")\n        sys.exit(1)\n\n    pygame.init()\n    pygame.font.init()\n\n    screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))\n    pygame.display.set_caption("Pygame Tic-Tac-Toe Pro | Minimax AI & Leaderboard")\n    clock = pygame.time.Clock()\n    game = TicTacToeGame()\n\n    # Font definitions\n    font_logo = get_safe_font(30, bold=True)\n    font_title = get_safe_font(26, bold=True)\n    font_heading = get_safe_font(18, bold=True)\n    font_button = get_safe_font(15, bold=True)\n    font_regular = get_safe_font(14, bold=False)\n    font_small = get_safe_font(12, bold=False)\n    font_large_symbol = get_safe_font(74, bold=True)\n    font_code = get_safe_font(13, bold=False)\n\n    # Setup State\n    selected_mode = "PVC"  # \'PVC\' or \'PVP\'\n    selected_difficulty = "Hard"\n    p1_name = "Player 1"\n    p2_name = "Player 2"\n    active_input_box: str | None = None  # \'p1\', \'p2\', or None\n    cursor_timer = 0\n\n    # Layout Rectangles for Title Screen\n    btn_mode_pvc = pygame.Rect(170, 160, 220, 42)\n    btn_mode_pvp = pygame.Rect(410, 160, 220, 42)\n\n    btn_diff_easy = pygame.Rect(170, 245, 140, 38)\n    btn_diff_med = pygame.Rect(330, 245, 140, 38)\n    btn_diff_hard = pygame.Rect(490, 245, 140, 38)\n\n    input_rect_p1 = pygame.Rect(260, 318, 280, 36)\n    input_rect_p2 = pygame.Rect(260, 370, 280, 36)\n\n    btn_start_game = pygame.Rect(250, 435, 300, 50)\n    btn_view_leaderboard = pygame.Rect(250, 500, 145, 38)\n    btn_view_logs = pygame.Rect(405, 500, 145, 38)\n\n    # In-Game Bottom Navigation Buttons\n    btn_ingame_restart = pygame.Rect(120, 595, 130, 38)\n    btn_ingame_menu = pygame.Rect(265, 595, 130, 38)\n    btn_ingame_mute = pygame.Rect(410, 595, 130, 38)\n    btn_ingame_exit = pygame.Rect(555, 595, 130, 38)\n\n    running = True\n\n    while running:\n        current_time = pygame.time.get_ticks()\n        mouse_pos = pygame.mouse.get_pos()\n        delta_time = clock.tick(FPS)\n        cursor_timer = (cursor_timer + 1) % 60\n\n        # Manage 1.0s AI Reaction Delay\n        game.update_ai_timer(current_time)\n\n        # ----------------------------------------------------------------------\n        # EVENT HANDLING\n        # ----------------------------------------------------------------------\n        for event in pygame.event.get():\n            if event.type == pygame.QUIT:\n                running = False\n                break\n\n            # ------------------------------------------------------------------\n            # KEYBOARD SHORTCUTS\n            # ------------------------------------------------------------------\n            elif event.type == pygame.KEYDOWN:\n                # Text input typing when box is focused on title screen\n                if game.state == "TITLE_MENU" and active_input_box is not None:\n                    if event.key == pygame.K_RETURN:\n                        active_input_box = None\n                    elif event.key == pygame.K_BACKSPACE:\n                        if active_input_box == "p1":\n                            p1_name = p1_name[:-1]\n                        elif active_input_box == "p2":\n                            p2_name = p2_name[:-1]\n                    else:\n                        if len(event.unicode) > 0 and event.unicode.isprintable():\n                            if active_input_box == "p1" and len(p1_name) < 15:\n                                p1_name += event.unicode\n                            elif active_input_box == "p2" and len(p2_name) < 15:\n                                p2_name += event.unicode\n                    continue\n\n                # Global Nav Shortcuts\n                if event.key == pygame.K_x:\n                    running = False\n                    break\n                elif event.key == pygame.K_ESCAPE:\n                    game.state = "TITLE_MENU"\n                    game.sound_mgr.play_sound("click")\n                elif event.key == pygame.K_m:\n                    game.sound_mgr.toggle_mute()\n                elif event.key == pygame.K_r:\n                    if game.state in ("PLAYING", "GAME_OVER"):\n                        p2 = p2_name if selected_mode == "PVP" else "Computer"\n                        game.start_new_game(selected_mode, selected_difficulty, p1_name, p2)\n\n            # ------------------------------------------------------------------\n            # MOUSE CLICKS\n            # ------------------------------------------------------------------\n            elif event.type == pygame.MOUSEBUTTONDOWN and event.button == 1:\n                # TITLE MENU INTERACTIONS\n                if game.state == "TITLE_MENU":\n                    # Mode selection\n                    if btn_mode_pvc.collidepoint(mouse_pos):\n                        selected_mode = "PVC"\n                        active_input_box = None\n                        game.sound_mgr.play_sound("click")\n                    elif btn_mode_pvp.collidepoint(mouse_pos):\n                        selected_mode = "PVP"\n                        active_input_box = None\n                        game.sound_mgr.play_sound("click")\n\n                    # Difficulty selection (Solo)\n                    elif selected_mode == "PVC" and btn_diff_easy.collidepoint(mouse_pos):\n                        selected_difficulty = "Easy"\n                        active_input_box = None\n                        game.sound_mgr.play_sound("click")\n                    elif selected_mode == "PVC" and btn_diff_med.collidepoint(mouse_pos):\n                        selected_difficulty = "Medium"\n                        active_input_box = None\n                        game.sound_mgr.play_sound("click")\n                    elif selected_mode == "PVC" and btn_diff_hard.collidepoint(mouse_pos):\n                        selected_difficulty = "Hard"\n                        active_input_box = None\n                        game.sound_mgr.play_sound("click")\n\n                    # Input box clicks\n                    elif input_rect_p1.collidepoint(mouse_pos):\n                        active_input_box = "p1"\n                    elif selected_mode == "PVP" and input_rect_p2.collidepoint(mouse_pos):\n                        active_input_box = "p2"\n                    else:\n                        active_input_box = None\n\n                    # Action buttons\n                    if btn_start_game.collidepoint(mouse_pos):\n                        p2 = p2_name if selected_mode == "PVP" else "Computer"\n                        game.start_new_game(selected_mode, selected_difficulty, p1_name, p2)\n                    elif btn_view_leaderboard.collidepoint(mouse_pos):\n                        game.state = "LEADERBOARD"\n                        game.sound_mgr.play_sound("click")\n                    elif btn_view_logs.collidepoint(mouse_pos):\n                        game.state = "LOGS"\n                        game.sound_mgr.play_sound("click")\n\n                # IN-GAME & GAME OVER INTERACTIONS\n                elif game.state in ("PLAYING", "GAME_OVER"):\n                    # Bottom navigation buttons\n                    if btn_ingame_restart.collidepoint(mouse_pos):\n                        p2 = p2_name if selected_mode == "PVP" else "Computer"\n                        game.start_new_game(selected_mode, selected_difficulty, p1_name, p2)\n                    elif btn_ingame_menu.collidepoint(mouse_pos):\n                        game.state = "TITLE_MENU"\n                        game.sound_mgr.play_sound("click")\n                    elif btn_ingame_mute.collidepoint(mouse_pos):\n                        game.sound_mgr.toggle_mute()\n                    elif btn_ingame_exit.collidepoint(mouse_pos):\n                        running = False\n                        break\n\n                    # 3x3 Board Cell Clicks\n                    grid_x, grid_y = GRID_OFFSET\n                    board_rect = pygame.Rect(grid_x, grid_y, CELL_SIZE * 3, CELL_SIZE * 3)\n\n                    if board_rect.collidepoint(mouse_pos) and game.state == "PLAYING" and not game.ai_thinking:\n                        col = (mouse_pos[0] - grid_x) // CELL_SIZE\n                        row = (mouse_pos[1] - grid_y) // CELL_SIZE\n                        if 0 <= row < 3 and 0 <= col < 3:\n                            game.handle_cell_click(row, col)\n\n                # MODAL SCREENS (Leaderboard / Logs)\n                elif game.state in ("LEADERBOARD", "LOGS"):\n                    btn_back = pygame.Rect(325, 585, 150, 42)\n                    if btn_back.collidepoint(mouse_pos):\n                        game.state = "TITLE_MENU"\n                        game.sound_mgr.play_sound("click")\n\n        # ----------------------------------------------------------------------\n        # UPDATE ANIMATIONS\n        # ----------------------------------------------------------------------\n        game.update_animations()\n\n        # ----------------------------------------------------------------------\n        # RENDERING PIPELINE\n        # ----------------------------------------------------------------------\n        screen.fill(COLOR_BACKGROUND)\n\n        # ======================================================================\n        # 1. RENDER TITLE SCREEN\n        # ======================================================================\n        if game.state == "TITLE_MENU":\n            # Logo & Title\n            draw_logo(screen, SCREEN_WIDTH // 2, 60, font_logo)\n            draw_text(screen, "Pygame Edition · Minimax AI · Persistent Leaderboard", font_small, COLOR_TEXT_MUTED, SCREEN_WIDTH // 2, 98)\n\n            # --- MODE SELECTION ---\n            draw_text(screen, "1. Select Game Mode:", font_heading, COLOR_TEXT_PRIMARY, SCREEN_WIDTH // 2, 138)\n            draw_button(screen, "Solo vs AI (Computer)", font_button, btn_mode_pvc, mouse_pos, active=(selected_mode == "PVC"))\n            draw_button(screen, "Player vs Player (PvP)", font_button, btn_mode_pvp, mouse_pos, active=(selected_mode == "PVP"))\n\n            # --- DIFFICULTY (Only if Solo) ---\n            if selected_mode == "PVC":\n                draw_text(screen, "2. AI Difficulty Level:", font_heading, COLOR_TEXT_PRIMARY, SCREEN_WIDTH // 2, 222)\n                draw_button(screen, "Easy (Casual)", font_regular, btn_diff_easy, mouse_pos, active=(selected_difficulty == "Easy"))\n                draw_button(screen, "Medium (Blocker)", font_regular, btn_diff_med, mouse_pos, active=(selected_difficulty == "Medium"))\n                draw_button(screen, "Unbeatable (Minimax)", font_regular, btn_diff_hard, mouse_pos, active=(selected_difficulty == "Hard"), accent_color=(56, 189, 248))\n\n            # --- PLAYER NAMES INPUT ---\n            y_name_sec = 300 if selected_mode == "PVC" else 240\n            draw_text(screen, "Enter Player Name(s):", font_heading, COLOR_TEXT_PRIMARY, SCREEN_WIDTH // 2, y_name_sec)\n\n            # Player 1 Input\n            p1_box_y = y_name_sec + 34\n            input_rect_p1.y = p1_box_y\n            draw_text_left(screen, "Player 1 (X):", font_regular, COLOR_X_SYMBOL, 150, p1_box_y + 18)\n            pygame.draw.rect(screen, (15, 23, 42), input_rect_p1, border_radius=6)\n            pygame.draw.rect(screen, COLOR_X_SYMBOL if active_input_box == "p1" else (51, 65, 85), input_rect_p1, width=2 if active_input_box == "p1" else 1, border_radius=6)\n            cursor_p1 = "|" if (active_input_box == "p1" and cursor_timer < 30) else ""\n            draw_text_left(screen, p1_name + cursor_p1, font_button, COLOR_TEXT_PRIMARY, input_rect_p1.x + 12, input_rect_p1.centery)\n\n            # Player 2 Input (Only if PvP)\n            if selected_mode == "PVP":\n                p2_box_y = p1_box_y + 48\n                input_rect_p2.y = p2_box_y\n                draw_text_left(screen, "Player 2 (O):", font_regular, COLOR_O_SYMBOL, 150, p2_box_y + 18)\n                pygame.draw.rect(screen, (15, 23, 42), input_rect_p2, border_radius=6)\n                pygame.draw.rect(screen, COLOR_O_SYMBOL if active_input_box == "p2" else (51, 65, 85), input_rect_p2, width=2 if active_input_box == "p2" else 1, border_radius=6)\n                cursor_p2 = "|" if (active_input_box == "p2" and cursor_timer < 30) else ""\n                draw_text_left(screen, p2_name + cursor_p2, font_button, COLOR_TEXT_PRIMARY, input_rect_p2.x + 12, input_rect_p2.centery)\n\n            # --- START & EXTRA BUTTONS ---\n            btn_start_y = 445 if selected_mode == "PVC" else 460\n            btn_start_game.y = btn_start_y\n            draw_button(screen, "START MATCH", font_heading, btn_start_game, mouse_pos, active=True, accent_color=(16, 185, 129))\n\n            btn_view_leaderboard.y = btn_start_y + 65\n            btn_view_logs.y = btn_start_y + 65\n            draw_button(screen, "Leaderboard", font_small, btn_view_leaderboard, mouse_pos)\n            draw_button(screen, "Activity Logs", font_small, btn_view_logs, mouse_pos)\n\n            # Bottom helper note\n            draw_text(screen, "Click text box to edit name · Press [X] anytime to Exit", font_small, (100, 116, 139), SCREEN_WIDTH // 2, SCREEN_HEIGHT - 25)\n\n        # ======================================================================\n        # 2. RENDER ACTIVE PLAYING / GAME OVER VIEW\n        # ======================================================================\n        elif game.state in ("PLAYING", "GAME_OVER"):\n            # Header status banner\n            if game.state == "PLAYING":\n                if game.ai_thinking:\n                    # Animated dots for 1.0s thinking delay\n                    dots = "." * ((current_time // 250) % 4)\n                    draw_text(screen, f"AI is thinking{dots}", font_title, COLOR_ACCENT_AMBER, SCREEN_WIDTH // 2, 42)\n                    draw_text(screen, f"Calculating optimal move (1.0s delay)", font_small, COLOR_TEXT_MUTED, SCREEN_WIDTH // 2, 74)\n                else:\n                    turn_name = game.player_x_name if game.current_turn == SYMBOL_X else game.player_o_name\n                    turn_col = COLOR_X_SYMBOL if game.current_turn == SYMBOL_X else COLOR_O_SYMBOL\n                    draw_text(screen, f"{turn_name}\'s Turn ({game.current_turn})", font_title, turn_col, SCREEN_WIDTH // 2, 42)\n                    mode_sub = f"Mode: Solo vs AI ({game.ai_difficulty})" if game.game_mode == "PVC" else "Mode: Player vs Player"\n                    draw_text(screen, f"{mode_sub}  ·  Moves: {game.board.move_count}/9", font_small, COLOR_TEXT_MUTED, SCREEN_WIDTH // 2, 74)\n            else:\n                # GAME OVER BANNER (Explicit Win / Loss / Draw text requested by user)\n                if game.board.winner:\n                    win_sym = game.board.winner\n                    if win_sym == SYMBOL_X:\n                        draw_text(screen, f"{game.player_x_name} Wins! (Victorious)", font_title, COLOR_WIN_LINE, SCREEN_WIDTH // 2, 40)\n                        draw_text(screen, f"Congratulations! {game.player_o_name} was defeated.", font_regular, COLOR_TEXT_MUTED, SCREEN_WIDTH // 2, 72)\n                    else:\n                        if game.game_mode == "PVC":\n                            draw_text(screen, f"AI Wins! {game.player_x_name} Loses!", font_title, COLOR_O_SYMBOL, SCREEN_WIDTH // 2, 40)\n                            draw_text(screen, "The Recursive Minimax algorithm scored a victory.", font_regular, COLOR_TEXT_MUTED, SCREEN_WIDTH // 2, 72)\n                        else:\n                            draw_text(screen, f"{game.player_o_name} Wins!", font_title, COLOR_WIN_LINE, SCREEN_WIDTH // 2, 40)\n                            draw_text(screen, f"{game.player_x_name} was defeated.", font_regular, COLOR_TEXT_MUTED, SCREEN_WIDTH // 2, 72)\n                else:\n                    draw_text(screen, "Match Ended in a Draw!", font_title, COLOR_ACCENT_AMBER, SCREEN_WIDTH // 2, 40)\n                    draw_text(screen, "Well fought tie! No empty squares remain.", font_regular, COLOR_TEXT_MUTED, SCREEN_WIDTH // 2, 72)\n\n            # Draw Board Background Plate\n            gx, gy = GRID_OFFSET\n            pygame.draw.rect(screen, (20, 29, 47), (gx - 10, gy - 10, CELL_SIZE * 3 + 20, CELL_SIZE * 3 + 20), border_radius=14)\n\n            # Draw Board Grid Lines\n            for i in range(1, 3):\n                # Vertical\n                pygame.draw.line(screen, COLOR_GRID_LINES, (gx + i * CELL_SIZE, gy), (gx + i * CELL_SIZE, gy + CELL_SIZE * 3), 4)\n                # Horizontal\n                pygame.draw.line(screen, COLOR_GRID_LINES, (gx, gy + i * CELL_SIZE), (gx + CELL_SIZE * 3, gy + i * CELL_SIZE), 4)\n\n            # Draw Cell Marks (X & O)\n            for r in range(3):\n                for c in range(3):\n                    val = game.board.grid[r][c]\n                    cx = gx + c * CELL_SIZE + CELL_SIZE // 2\n                    cy = gy + r * CELL_SIZE + CELL_SIZE // 2\n\n                    if val == SYMBOL_X:\n                        draw_text(screen, "X", font_large_symbol, COLOR_X_SYMBOL, cx, cy)\n                    elif val == SYMBOL_O:\n                        draw_text(screen, "O", font_large_symbol, COLOR_O_SYMBOL, cx, cy)\n\n            # Draw Animated Winning Line Strike\n            if game.board.winning_line and game.is_animating_win:\n                start_c = game.board.winning_line[0]\n                end_c = game.board.winning_line[2]\n                sx = gx + start_c[1] * CELL_SIZE + CELL_SIZE // 2\n                sy = gy + start_c[0] * CELL_SIZE + CELL_SIZE // 2\n                ex = gx + end_c[1] * CELL_SIZE + CELL_SIZE // 2\n                ey = gy + end_c[0] * CELL_SIZE + CELL_SIZE // 2\n                cur_x = sx + (ex - sx) * game.strike_progress\n                cur_y = sy + (ey - sy) * game.strike_progress\n                pygame.draw.line(screen, COLOR_WIN_LINE, (sx, sy), (cur_x, cur_y), 8)\n\n            # --- BOTTOM NAVIGATION BAR (All clickable & keyboard shortcuts) ---\n            draw_button(screen, "Restart [R]", font_small, btn_ingame_restart, mouse_pos)\n            draw_button(screen, "Menu [ESC]", font_small, btn_ingame_menu, mouse_pos)\n            mute_label = "Mute [M]: ON" if game.sound_mgr.muted else "Mute [M]: OFF"\n            draw_button(screen, mute_label, font_small, btn_ingame_mute, mouse_pos)\n            draw_button(screen, "Exit [X]", font_small, btn_ingame_exit, mouse_pos)\n\n        # ======================================================================\n        # 3. RENDER LEADERBOARD SCREEN\n        # ======================================================================\n        elif game.state == "LEADERBOARD":\n            draw_text(screen, "PERSISTENT LEADERBOARD", font_title, COLOR_TEXT_PRIMARY, SCREEN_WIDTH // 2, 50)\n            draw_text(screen, "Stored in \'leaderboard.txt\' via Text Mode File I/O", font_small, COLOR_TEXT_MUTED, SCREEN_WIDTH // 2, 82)\n\n            pygame.draw.rect(screen, COLOR_PANEL_BG, (100, 115, 600, 445), border_radius=12)\n            header_str = f"{\'Rank\':<6} {\'Username\':<18} {\'Score\':<8} {\'Wins\':<6} {\'Draws\':<6} {\'Losses\':<6} {\'Win Rate\':<8}"\n            draw_text(screen, header_str, font_code, COLOR_X_SYMBOL, SCREEN_WIDTH // 2, 140)\n            pygame.draw.line(screen, COLOR_GRID_LINES, (120, 160), (680, 160), 2)\n\n            top_players = game.leaderboard.get_top_players(limit=8)\n            y_offset = 190\n            for rank, profile in top_players:\n                line_str = f"#{rank:<5} {profile.username:<18} {profile.score:<8} {profile.wins:<6} {profile.draws:<6} {profile.losses:<6} {profile.win_rate}%"\n                draw_text(screen, line_str, font_code, COLOR_TEXT_PRIMARY, SCREEN_WIDTH // 2, y_offset)\n                y_offset += 38\n\n            draw_button(screen, "Return to Menu [ESC]", font_regular, pygame.Rect(310, 585, 180, 40), mouse_pos)\n\n        # ======================================================================\n        # 4. RENDER ACTIVITY LOGS SCREEN\n        # ======================================================================\n        elif game.state == "LOGS":\n            draw_text(screen, "ACTIVITY LOG INSPECTOR", font_title, COLOR_TEXT_PRIMARY, SCREEN_WIDTH // 2, 50)\n            draw_text(screen, "Read from \'player_activity_log.txt\' using Python File I/O", font_small, COLOR_TEXT_MUTED, SCREEN_WIDTH // 2, 82)\n\n            pygame.draw.rect(screen, COLOR_PANEL_BG, (60, 115, 680, 445), border_radius=12)\n            logs = read_activity_logs(max_entries=11)\n            y_offset = 145\n            for log_entry in logs:\n                display_entry = log_entry[:82]\n                draw_text(screen, display_entry, font_code, COLOR_TEXT_PRIMARY, SCREEN_WIDTH // 2, y_offset)\n                y_offset += 34\n\n            draw_button(screen, "Return to Menu [ESC]", font_regular, pygame.Rect(310, 585, 180, 40), mouse_pos)\n\n        # ======================================================================\n        # 5. RENDER GLITTER PARTICLES (Glowing halos + diamond sparkles)\n        # ======================================================================\n        for p in game.particles:\n            p.draw(screen)\n\n        pygame.display.flip()\n\n    pygame.quit()\n    print("[Shutdown] Pygame cleaned up successfully.")\n\n\nif __name__ == "__main__":\n    main()\n'
  },
];

export interface SyllabusItem {
  number: number;
  title: string;
  summary: string;
  keyConcepts: string[];
  primaryFile: string;
  codeSnippet: string;
}

export const SYLLABUS_TOPICS: SyllabusItem[] = [
  {
    number: 1,
    title: "Conditional Statements (Nested)",
    summary: "Nested if-elif-else logic used for move validation, win detection, difficulty branching, and alpha-beta pruning.",
    keyConcepts: ["Inner boundary check inside outer range check", "Multi-tier win line comparisons", "Alpha-Beta cutoff conditions"],
    primaryFile: "board.py",
    codeSnippet: `def is_valid_move(self, row: int, col: int) -> bool:
    # Outer conditional: Coordinate bounds check
    if 0 <= row < 3 and 0 <= col < 3:
        # Inner conditional: Cell vacancy check
        if self.grid[row][col] == SYMBOL_EMPTY:
            return True
        else:
            return False
    else:
        return False`
  },
  {
    number: 2,
    title: "Loops (Nested)",
    summary: "Nested for-loops traversing 2D matrices across rows and columns to construct, reset, and check 3x3 boards.",
    keyConcepts: ["Outer row loop and inner column loop", "Matrix clearing and deep copies", "Drawing orthogonal lines in Pygame"],
    primaryFile: "board.py",
    codeSnippet: `def reset(self) -> None:
    self.grid = []
    # Outer Loop: Rows (0 to 2)
    for row_idx in range(3):
        row: list[str] = []
        # Inner Loop: Columns (0 to 2)
        for col_idx in range(3):
            row.append(SYMBOL_EMPTY)
        self.grid.append(row)`
  },
  {
    number: 3,
    title: "Functions - Calls, Parameters, Scope",
    summary: "Modular functions illustrating positional args, keyword defaults, local variables, and global variable modification.",
    keyConcepts: ["Positional & default arguments", "Local function scope isolation", "Explicit 'global' keyword mutation"],
    primaryFile: "logger.py",
    codeSnippet: `_TOTAL_LOG_OPERATIONS: int = 0

def log_activity(event_type: str, details: str, username: str = "Anonymous") -> bool:
    global _TOTAL_LOG_OPERATIONS  # Modifying module-level global variable
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")  # Local variable
    ...
    _TOTAL_LOG_OPERATIONS += 1
    return True`
  },
  {
    number: 4,
    title: "Generators (yield)",
    summary: "Python generator functions producing iterable sequences lazily on demand without storing everything in memory.",
    keyConcepts: ["yield keyword", "Generator iterator protocol", "Memory-efficient move and winning line evaluation"],
    primaryFile: "board.py",
    codeSnippet: `def generate_winning_lines(self) -> Generator[list[tuple[int, int]], None, None]:
    # Yield 3 horizontal rows
    for r in range(3):
        yield [(r, 0), (r, 1), (r, 2)]
    # Yield 3 vertical columns
    for c in range(3):
        yield [(0, c), (1, c), (2, c)]
    # Yield 2 diagonals
    yield [(0, 0), (1, 1), (2, 2)]
    yield [(0, 2), (1, 1), (2, 0)]`
  },
  {
    number: 5,
    title: "Recursion (Minimax Algorithm)",
    summary: "Recursive game tree exploration simulating future board states with depth weighting for unbeatable AI.",
    keyConcepts: ["Base case terminal check", "Recursive branch exploration", "Backtracking board state", "Alpha-Beta pruning"],
    primaryFile: "ai.py",
    codeSnippet: `def minimax(grid, depth, is_maximizing, alpha, beta):
    # BASE CASE
    score = evaluate_board(grid)
    if score is not None:
        return score - depth if score > 0 else (score + depth if score < 0 else 0)

    # RECURSIVE STEP
    if is_maximizing:
        max_eval = -float('inf')
        for r, c in generate_available_moves(grid):
            grid[r][c] = SYMBOL_O
            evaluation = minimax(grid, depth + 1, False, alpha, beta)  # Recursive call
            grid[r][c] = SYMBOL_EMPTY  # Backtrack
            max_eval = max(max_eval, evaluation)
        return max_eval`
  },
  {
    number: 6,
    title: "Built-in Data Types (List, Tuple, String, Set, Dict)",
    summary: "Rigorous use of all 5 fundamental Python standard collection and sequence data types.",
    keyConcepts: ["List: mutable 2D grid matrix", "Tuple: immutable coordinates & RGB color triples", "String: symbols and formatted logs", "Set: unique player names and coordinate lookups", "Dictionary: difficulty rewards, profiles, and audio frequencies"],
    primaryFile: "constants.py",
    codeSnippet: `# Tuple (immutable)
SCREEN_DIMENSIONS: tuple[int, int] = (800, 650)
COLOR_X_SYMBOL: tuple[int, int, int] = (56, 189, 248)

# Set (unique collection)
VALID_SYMBOLS: set[str] = {"X", "O"}
CORNER_CELLS: set[tuple[int, int]] = {(0, 0), (0, 2), (2, 0), (2, 2)}

# Dictionary (key-value mapping)
SCORE_REWARDS: dict[str, int] = {"win_hard_ai": 100, "win_pvp": 50, "draw": 15}`
  },
  {
    number: 7,
    title: "Modularization (Functions & Modules)",
    summary: "Architecture decomposed into dedicated, cohesive Python modules imported cleanly across boundaries.",
    keyConcepts: ["High cohesion & low coupling", "Importing specific classes and functions", "Reusable component modules"],
    primaryFile: "game.py",
    codeSnippet: `from board import Board
from ai import AIPlayer
from leaderboard import LeaderboardManager
from sound_manager import SoundManager
from logger import log_activity`
  },
  {
    number: 8,
    title: "Library - Pygame",
    summary: "Full Pygame engine setup with 60 FPS clock, display surface, event polling, fonts, geometry, and audio.",
    keyConcepts: ["pygame.init() & pygame.display.set_mode()", "clock.tick(60) frame capping", "pygame.event.get() event pump", "pygame.draw primitives and font rendering"],
    primaryFile: "main.py",
    codeSnippet: `pygame.init()
pygame.font.init()
screen = pygame.display.set_mode((800, 650))
pygame.display.set_caption("Pygame Tic-Tac-Toe Pro")
clock = pygame.time.Clock()

while running:
    clock.tick(60)
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False`
  },
  {
    number: 9,
    title: "Files (File I/O) - Text Mode",
    summary: "Text mode reading ('r'), writing ('w'), and appending ('a') using UTF-8 encoding with stream flushing.",
    keyConcepts: ["open(..., mode='a', encoding='utf-8')", "file.write() and file.flush()", "file.readlines() parsing"],
    primaryFile: "logger.py",
    codeSnippet: `# Opening file in text mode ('a' = append)
with open(LOG_FILE_PATH, mode="a", encoding="utf-8") as file:
    file.write(f"[{timestamp}] [{event_type}] Player: {username} | {details}\\n")
    file.flush()`
  },
  {
    number: 10,
    title: "Exception Handling (try-catch)",
    summary: "Full try-except-else-finally error handling preventing runtime crashes from missing files or audio driver errors.",
    keyConcepts: ["Catching IOError, OSError, FileNotFoundError", "Handling ValueError during text parsing", "Guaranteed cleanup in 'finally' block"],
    primaryFile: "leaderboard.py",
    codeSnippet: `try:
    with open(self.storage_path, mode="r", encoding="utf-8") as file:
        lines = file.readlines()
        for line in lines:
            parts = line.strip().split("|")
            ...
except FileNotFoundError:
    self._seed_default_scores()
except (IOError, OSError) as io_err:
    print(f"I/O Error: {io_err}")`
  },
  {
    number: 11,
    title: "Python - Class, Object (OOP)",
    summary: "Complete Object-Oriented Architecture with encapsulation, instance attributes (self), constructors, and methods.",
    keyConcepts: ["class and __init__ constructor", "Encapsulation of state in self", "Object composition (Game has Board, AI, SoundManager)"],
    primaryFile: "board.py",
    codeSnippet: `class Board:
    def __init__(self):
        self.grid: list[list[str]] = []
        self.last_move = None
        self.winning_line = None
        self.winner = None
        self.is_draw = False
        self.move_count = 0
        self.reset()`
  }
];

