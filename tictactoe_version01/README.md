# Tic-Tac-Toe Version 01

A simple Tic-Tac-Toe game made with Python, pygame-ce, and NumPy.

## Requirements

- Python 3.14.x Interpreter
- pygame-ce 2.5.8 Library
- NumPy 2.5.3 Library

## Installation

Install the required libraries in powershell:

>pip install -r requirements.txt

Or, 
Manually install-

>pip install pygame-ce==2.5.8

>pip install numpy==2.5.3

If it doesnt work, create virtual environment in powershell:

>uv venv --python 3.14

>uv pip install pygame-ce==2.5.8 numpy==2.5.3


### How To Play

1. The game is played on a grid that's 3 squares by 3 squares.
2. You are X, your friend (or the computer in this case) is O.
3. Players take turns putting their marks in empty squares.
4. The first player to get 3 of her marks in a row (up, down, across, or diagonally) is the winner.
5. When all 9 squares are full, the game is over.
6. Press R to restart, X to exit the game