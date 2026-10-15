"""
Constants and Configuration Module
----------------------------------
Demonstrates Python Built-in Data Types:
  - Tuple: Screen dimensions, RGB Color definitions, coordinate pairs
  - List: Difficulty options, player default names
  - String: Player symbols, file paths, status labels
  - Set: Valid player symbols, immutable unique lookups
  - Dictionary: Color palettes/themes, game scoring rewards
"""

import os

# ==============================================================================
# 1. TUPLES (Immutable Sequences)
# ==============================================================================
SCREEN_DIMENSIONS: tuple[int, int] = (800, 670)
SCREEN_WIDTH, SCREEN_HEIGHT = SCREEN_DIMENSIONS

GRID_OFFSET: tuple[int, int] = (175, 110)  # (Top-Left X, Top-Left Y) of 3x3 board
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

# Author Branding & Attribution (Displayed bottom-middle on all screens)
AUTHOR_CREDIT: str = "Made by @marzan3015"
AUTHOR_GITHUB_URL: str = "https://github.com/marzan3015"

# File Paths (Anchored to module directory for reliable execution from any cwd)
BASE_DIR: str = os.path.dirname(os.path.abspath(__file__))
LOG_FILE_PATH: str = os.path.join(BASE_DIR, "player_activity_log.txt")
LEADERBOARD_FILE_PATH: str = os.path.join(BASE_DIR, "leaderboard.txt")
ASSETS_DIR: str = os.path.join(BASE_DIR, "assets", "sounds")

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
    "click": 440.0,       # A4 tone
    "move_x": 587.33,     # D5 tone
    "move_o": 659.25,     # E5 tone
    "win": 880.0,         # A5 triumphant chord
    "draw": 330.0,        # E4 low chord
    "btn_hover": 523.25   # C5 tone
}

FPS: int = 60
