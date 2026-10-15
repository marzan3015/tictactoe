"""
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
    """
    Encapsulates the 3x3 Tic-Tac-Toe game board grid and state.
    """
    def __init__(self):
        # 2D List representing 3x3 grid: built-in data type List
        self.grid: list[list[str]] = []
        self.last_move: tuple[int, int] | None = None
        self.winning_line: list[tuple[int, int]] | None = None
        self.winner: str | None = None
        self.is_draw: bool = False
        self.move_count: int = 0
        
        # Initialize empty grid via nested loop
        self.reset()

    def reset(self) -> None:
        """
        Clears the board back to empty state.
        Demonstrates NESTED LOOPS for matrix re-initialization.
        """
        self.grid = []
        # Outer Loop: Rows (0 to 2)
        for row_idx in range(3):
            row: list[str] = []
            # Inner Loop: Columns (0 to 2)
            for col_idx in range(3):
                row.append(SYMBOL_EMPTY)
            self.grid.append(row)
            
        self.last_move = None
        self.winning_line = None
        self.winner = None
        self.is_draw = False
        self.move_count = 0

    # --------------------------------------------------------------------------
    # GENERATORS (Syllabus Requirement: generator function with 'yield')
    # --------------------------------------------------------------------------
    def generate_winning_lines(self) -> Generator[list[tuple[int, int]], None, None]:
        """
        Generator function yielding all 8 potential winning 3-in-a-row coordinate lines:
          - 3 horizontal rows
          - 3 vertical columns
          - 2 diagonals
        Demonstrates the Python 'yield' keyword and generator protocol.
        """
        # Yield 3 horizontal rows
        for r in range(3):
            yield [(r, 0), (r, 1), (r, 2)]

        # Yield 3 vertical columns
        for c in range(3):
            yield [(0, c), (1, c), (2, c)]

        # Yield Main Diagonal (top-left to bottom-right)
        yield [(0, 0), (1, 1), (2, 2)]

        # Yield Anti-Diagonal (top-right to bottom-left)
        yield [(0, 2), (1, 1), (2, 0)]

    def iter_empty_cells(self) -> Generator[tuple[int, int], None, None]:
        """
        Generator that yields available (row, col) coordinates.
        Demonstrates NESTED LOOPS combined with a GENERATOR.
        """
        for r in range(3):
            for c in range(3):
                if self.grid[r][c] == SYMBOL_EMPTY:
                    yield (r, c)

    def is_valid_move(self, row: int, col: int) -> bool:
        """
        Validates if target coordinate is inside bounds and empty.
        Demonstrates NESTED CONDITIONAL STATEMENTS.
        """
        # Outer conditional: Coordinate bounds check
        if 0 <= row < 3 and 0 <= col < 3:
            # Inner conditional: Cell vacancy check
            if self.grid[row][col] == SYMBOL_EMPTY:
                return True
            else:
                return False
        else:
            return False

    def make_move(self, row: int, col: int, symbol: str) -> bool:
        """
        Applies a player move to the board.
        Returns True if successful, False otherwise.
        """
        if not self.is_valid_move(row, col):
            return False
            
        if self.winner or self.is_draw:
            return False  # Game already completed

        self.grid[row][col] = symbol
        self.last_move = (row, col)
        self.move_count += 1
        
        # Check if this move triggers a win or a draw
        self.check_game_over()
        return True

    def check_game_over(self) -> tuple[str | None, bool]:
        """
        Evaluates whether a player has won or if the board ended in a draw.
        Demonstrates generator consumption and nested conditionals.
        """
        # Iterate over winning lines produced by our generator
        for line in self.generate_winning_lines():
            c0, c1, c2 = line
            val0 = self.grid[c0[0]][c0[1]]
            val1 = self.grid[c1[0]][c1[1]]
            val2 = self.grid[c2[0]][c2[1]]

            # Nested conditional check
            if val0 != SYMBOL_EMPTY:
                if val0 == val1 and val1 == val2:
                    self.winner = val0
                    self.winning_line = line
                    return (self.winner, False)

        # Check for Draw condition
        if self.is_full() and not self.winner:
            self.is_draw = True
            return (None, True)

        return (None, False)

    def is_full(self) -> bool:
        """Checks if all cells are occupied using nested loops."""
        for r in range(3):
            for c in range(3):
                if self.grid[r][c] == SYMBOL_EMPTY:
                    return False
        return True

    def get_board_copy(self) -> list[list[str]]:
        """Returns deep copy of the 3x3 grid using nested list comprehension."""
        return [[self.grid[r][c] for c in range(3)] for r in range(3)]
