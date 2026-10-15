@echo off
echo ============================================================
echo Compiling Pygame Tic-Tac-Toe Pro to Standalone Windows .EXE
echo ============================================================

REM Install dependencies if not already installed
python -m pip install -r requirements.txt
python -m pip install pyinstaller

echo.
echo Building executable with PyInstaller...
pyinstaller --onefile --noconsole --name "TicTacToePro" main.py

echo.
echo ============================================================
echo Compilation Successful!
echo Your executable is ready in the 'dist' directory:
echo dist\TicTacToePro.exe
echo ============================================================
pause
