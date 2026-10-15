# Pygame Tic-Tac-Toe Pro

A modern, production-grade 2D Tic-Tac-Toe game engineered in Python using **Pygame**, featuring recursive Minimax AI (unbeatable), sound effects & procedural audio synthesis, particle animations, text file activity logging, and a persistent leaderboard system.

---

## 📚 Academic & Curriculum Requirements Coverage

This codebase was specifically architected to demonstrate the core tenets of computer science and Python programming:

| Syllabus Requirement | Implementation Details | File & Functions |
| :--- | :--- | :--- |
| **1. Conditional Statements (Nested)** | Nested `if / elif / else` structures for coordinate validation, win evaluation, alpha-beta pruning, and difficulty branching | `board.py` (`is_valid_move`, `check_game_over`), `ai.py` (`minimax`, `get_best_move`) |
| **2. Loops (Nested)** | 2D matrix traversal over 3x3 board rows and columns for rendering, resetting, and full-board checks | `board.py` (`reset`, `is_full`), `main.py` (grid and mark rendering) |
| **3. Functions & Scope** | Modular functions with positional & default parameters, return values, local variables vs module-level / global variables (`global _TOTAL_LOG_OPERATIONS`) | `logger.py` (`log_activity`, `get_log_operations_count`), `ai.py` (`evaluate_board`) |
| **4. Generators (`yield`)** | Generator functions producing iterable sequences on the fly for winning coordinate lines and vacant cell coordinates | `board.py` (`generate_winning_lines`, `iter_empty_cells`), `ai.py` (`generate_available_moves`) |
| **5. Recursion** | Classic Minimax game tree search algorithm exploring hypothetical future moves recursively with depth scoring and alpha-beta pruning | `ai.py` (`def minimax(grid, depth, is_maximizing, alpha, beta)`) |
| **6. Built-in Data Types** | - **List**: 2D grid matrix, ranked players, log entries<br>- **Tuple**: Coordinate pairs `(row, col)`, RGB color definitions `(15, 23, 42)`, window size `(800, 650)`<br>- **String**: Symbols `'X'`, `'O'`, log records, player usernames<br>- **Set**: Valid player symbols `{'X', 'O'}`, unique registered usernames<br>- **Dictionary**: Scoring rewards, theme colors, audio frequency maps, player profile mappings | `constants.py`, `leaderboard.py`, `board.py` |
| **7. Modularization** | Clean separation of concerns across single-purpose modules (`constants.py`, `board.py`, `ai.py`, `sound_manager.py`, `logger.py`, `leaderboard.py`, `game.py`, `main.py`) | All files in `/python_game` |
| **8. Library - Pygame** | Display surface setup, 60 FPS clock timing, event polling loop (`QUIT`, `KEYDOWN`, `MOUSEBUTTONDOWN`), font rendering, geometric primitive drawing, sound mixer playback | `main.py`, `sound_manager.py` |
| **9. Files (File I/O) - Text Mode** | Opening, reading, writing, and appending files in text mode (`'r'`, `'w'`, `'a'`) with UTF-8 encoding | `logger.py` (`player_activity_log.txt`), `leaderboard.py` (`leaderboard.txt`) |
| **10. Exception Handling** | Comprehensive `try-except-else-finally` blocks handling `FileNotFoundError`, `IOError`, `OSError`, `ValueError`, and audio driver fallback | `logger.py`, `leaderboard.py`, `sound_manager.py`, `main.py` |
| **11. Python - Class, Object** | Object-Oriented Architecture with classes, attributes (`self`), constructors (`__init__`), encapsulation, and property getters | `board.py` (`Board`), `leaderboard.py` (`PlayerProfile`, `LeaderboardManager`), `ai.py` (`AIPlayer`), `game.py` (`TicTacToeGame`, `Particle`) |

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Python 3.9, 3.10, 3.11, or 3.12 installed on your PC.
- Check Python installation:
  ```bash
  python --version
  ```

### 2. Install Dependencies
Navigate into the game folder and install dependencies:
```bash
pip install -r requirements.txt
```
*(Note: Both standard `pygame` and `pygame-ce` are 100% compatible. If you already have `pygame-ce==2.5.8` installed, you do not need to install anything else!)*

### 3. Run the Game
```bash
python main.py
```

To run the automated verification suite without a GUI window:
```bash
python main.py --test
```

---

## 🎮 Controls & Gameplay

- **Left Mouse Click**: Place your marker (`X` or `O`) on the 3x3 board.
- **R**: Restart current match / Play Again.
- **ESC**: Return to Title Menu.
- **M**: Toggle Sound & Audio Mute.
- **L**: Open Persistent Leaderboard Screen.
- **P**: Open Activity Log Inspector.

---

## 📦 How to Compile to a Standalone Executable (.exe) using PyInstaller

You can compile this entire game into a single standalone `.exe` that runs on any Windows PC without requiring Python or Pygame to be installed!

### Step 1: Install PyInstaller
```bash
pip install pyinstaller
```

### Step 2: One-Click Compile Command
Run this command from inside the `python_game` directory:
```bash
pyinstaller --onefile --noconsole --name "TicTacToePro" --add-data "assets;assets" main.py
```
*(On macOS or Linux, use `--add-data "assets:assets"` instead of a semicolon).*

### Parameter Explanation:
- `--onefile`: Packages the entire Python interpreter, Pygame libraries, and all `.py` scripts into a single standalone `.exe` file.
- `--noconsole` (or `-w`): Hides the black terminal/command prompt window so only the polished Pygame window is displayed.
- `--name "TicTacToePro"`: Names the resulting executable file `TicTacToePro.exe`.
- `--add-data "assets;assets"`: Ensures synthesized audio wave files in the `assets/` folder are bundled directly inside the executable.

### Step 3: Find Your Executable
Once the build completes:
1. Open the `dist/` folder that PyInstaller creates.
2. Double-click `TicTacToePro.exe` to launch your standalone PC game!

---

## 👨‍💻 Author & Credits
- **Created by**: [@marzan3015](https://github.com/marzan3015)
- **GitHub**: [https://github.com/marzan3015](https://github.com/marzan3015)
- **Features**: Interactive bottom attribution with one-click GitHub profile launch, continuous looping background theme song, recursive Minimax AI, particle glitter animations, and persistent text file leaderboard.
