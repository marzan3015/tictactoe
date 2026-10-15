# Pygame Tic-Tac-Toe Pro

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
```bash
pip install -r requirements.txt
```

### 2. Run the Game
```bash
python main.py
```

To run the automated verification suite without a GUI window:
```bash
python main.py --test
```

---

## 📦 How to Compile to Standalone .EXE with PyInstaller

```bash
pip install pyinstaller
pyinstaller --onefile --noconsole --name "TicTacToePro" main.py
```
The compiled executable will be generated inside the dist/ directory!