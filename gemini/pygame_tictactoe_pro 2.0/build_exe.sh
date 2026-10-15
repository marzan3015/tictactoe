#!/usr/bin/env bash
echo "============================================================"
echo "Compiling Pygame Tic-Tac-Toe Pro to Executable (Linux/macOS)"
echo "============================================================"

python3 -m pip install -r requirements.txt
python3 -m pip install pyinstaller

echo ""
echo "Building executable with PyInstaller..."
pyinstaller --onefile --noconsole --name "TicTacToePro" --add-data "assets:assets" main.py

echo ""
echo "Compilation complete! Executable is in: dist/TicTacToePro"
