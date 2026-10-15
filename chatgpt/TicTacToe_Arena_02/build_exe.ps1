$ErrorActionPreference = "Stop"
py -m pip install pyinstaller
py -m PyInstaller --noconfirm --clean --windowed --name TicTacToeArena --add-data "assets;assets" main.py
Write-Host ""
Write-Host "Build finished. Check the dist folder."
Write-Host "Run dist\TicTacToeArena\TicTacToeArena.exe"
