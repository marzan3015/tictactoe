# Tic-Tac-Toe Arena

A complete offline Tic-Tac-Toe desktop game built with Python and Pygame for a university programming project.

## Features

- Local Player vs Player (two people, one computer)
- Solo Player vs Computer
- Easy, Medium, and Hard AI
- Hard AI uses recursive Minimax
- Animated X/O marks and a winning line
- Sound effects and looping background music (can be muted)
- Persistent leaderboard and match statistics
- Text-mode activity log and match history
- Main menu, restart, rematch, and leaderboard screens
- Graceful handling of missing or invalid data files

## Requirements

- Python 3.10 or newer recommended
- Pygame 2.5 or newer
- Windows 10/11, or another OS that supports Pygame

## Run from source

1. Open a terminal in this project folder.
2. Install the dependency:

   ```powershell
   py -m pip install -r requirements.txt
   ```

3. Start the game:

   ```powershell
   py main.py
   ```

If `py` is not available, use `python` instead.

## Controls

- Mouse: click menu buttons and board cells
- `R`: restart the current match
- `Esc`: return to the main menu
- `M`: toggle sound and music
- `X`: quit the game
- Enter player name(s) before each match; use `Tab` to switch fields and `Enter` to continue
- Buttons have click sound effects, and X/O marks trigger a glitter particle burst
- Click `Made by @marzan3015` at the bottom to open the GitHub profile

## Game modes

### Player vs Player
Two local players take turns using X and O. The scoreboard records the winner.

### Solo vs Computer
You play as X and the computer plays as O. Select Easy, Medium, or Hard on the main menu.

- **Easy:** random legal move.
- **Medium:** take a winning move, block an immediate loss, prefer the center/corners.
- **Hard:** recursive Minimax. Against correct play, it cannot be forced to lose.

## Saved data

The game creates these files in `data/` after it runs:

- `leaderboard.json` — cumulative wins, losses, draws, and points by display name.
- `match_history.txt` — human-readable record of completed matches.
- `activity.log` — timestamped events, player names, moves, match outcomes, menu actions, and errors.

The game uses Python text-mode file I/O (`open(..., "r"/"w"/"a")`) and JSON serialization. If a saved JSON file is invalid, the game logs the issue and starts with safe defaults. The original invalid file is not automatically deleted.

## Project structure

```text
TicTacToe_Arena/
├── main.py
├── requirements.txt
├── README.md
├── .gitignore
├── assets/
│   └── sounds/
│       ├── click.wav
│       ├── move.wav
│       ├── win.wav
│       ├── lose.wav
│       ├── draw.wav
│       └── background.wav
├── data/                    # created/updated during play
├── src/
│   ├── __init__.py
│   ├── constants.py
│   ├── board.py
│   ├── ai.py
│   ├── storage.py
│   ├── audio_manager.py
│   └── game.py
├── tests/
│   └── test_game_logic.py
└── build_exe.ps1
```

## Syllabus topic map

| Required topic | Where it appears |
|---|---|
| Nested conditional statements | `src/game.py`, `src/ai.py` |
| Nested loops | `src/game.py` board drawing; `src/board.py` board evaluation |
| Functions, calls, parameters | All modules |
| Variable scope | Function-local variables and module constants |
| Generators | `Board.empty_cells()` in `src/board.py` uses `yield` |
| Recursion | `AIPlayer._minimax()` in `src/ai.py` |
| List | Board cells, move history, leaderboard rows |
| Tuple | Colors, cell coordinates, winning line indices |
| String | Player names, result labels, log messages |
| Set | Unique player names and win-line validation |
| Dictionary | Game settings, leaderboard records, AI scores |
| Modularization | The separate modules inside `src/` |
| Pygame | Window, events, drawing, fonts, timing, audio |
| Text-mode file I/O | `src/storage.py` |
| Exception handling | `try`/`except` around saved-data and audio loading |
| Classes and objects | `Board`, `AIPlayer`, `Storage`, `AudioManager`, `GameApp` |

## Design notes

- The game engine and board rules are separate from the display loop.
- The AI returns a proposed cell; the game validates it before placing a mark.
- Scores are saved once per completed match.
- The leaderboard is local to this computer and is not an online ranking service.
- Pygame is the only third-party runtime dependency. `json`, `datetime`, `logging`, `pathlib`, `random`, and `wave` are from the Python standard library.

## Build a Windows executable

It is best to run and test the game from source first. Fix any errors, confirm audio works, and verify that the leaderboard and logs are saved. Then package it.

Install PyInstaller:

```powershell
py -m pip install pyinstaller
```

From the project folder, run:

```powershell
py -m PyInstaller --noconfirm --clean --windowed --name TicTacToeArena --add-data "assets;assets" main.py
```

The executable will be in `dist\\TicTacToeArena\\TicTacToeArena.exe` if using the default one-folder build configuration. For a more reliable first build, use one-folder mode so assets are easier to inspect. A one-file build is also possible, but writable user data should remain outside the bundled executable.

If you want to use the supplied helper script, open PowerShell in the project folder and run:

```powershell
powershell -ExecutionPolicy Bypass -File .\\build_exe.ps1
```

## Suggested demonstration order

1. Explain the `Board` class and the winning-line checks.
2. Show PvP and a draw/win.
3. Show the three AI difficulty levels.
4. Explain how the recursive Minimax function works.
5. Open the leaderboard and activity log.
6. Point out the generator, dictionary, set, list, tuple, and exception handling.
7. Show the README topic map and run the automated logic tests.
