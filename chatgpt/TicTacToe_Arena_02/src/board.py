"""Board representation and rule helpers."""

from src.constants import CELL_COUNT, WIN_LINES


class Board:
    """A 3x3 board represented by a list of nine cells."""

    def __init__(self):
        self.cells = [""] * CELL_COUNT

    def reset(self):
        """Clear every cell."""
        self.cells = [""] * CELL_COUNT

    def is_valid_move(self, index):
        """Return True only when index is a valid, empty cell."""
        if not isinstance(index, int):
            return False
        if index < 0 or index >= CELL_COUNT:
            return False
        return self.cells[index] == ""

    def place_mark(self, index, mark):
        """Place X or O in an empty cell. Return whether it succeeded."""
        if mark not in ("X", "O"):
            return False
        if self.is_valid_move(index):
            self.cells[index] = mark
            return True
        return False

    def empty_cells(self):
        """Generator yielding the indexes of all empty cells."""
        for index, value in enumerate(self.cells):
            if value == "":
                yield index

    def is_full(self):
        return not any(cell == "" for cell in self.cells)

    def winner(self):
        """Return (mark, winning_line) or (None, None)."""
        for line in WIN_LINES:
            a, b, c = line
            if self.cells[a] and self.cells[a] == self.cells[b] == self.cells[c]:
                return self.cells[a], line
        return None, None

    def is_draw(self):
        mark, _line = self.winner()
        if mark is None and self.is_full():
            return True
        return False

    def available_moves(self):
        """Return a list built from the empty-cell generator."""
        return list(self.empty_cells())

    def copy(self):
        """Return a separate board object with the same cells."""
        other = Board()
        other.cells = self.cells.copy()
        return other
