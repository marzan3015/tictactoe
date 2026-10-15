"""Basic unit tests for board rules and AI. Run with: py -m unittest discover -s tests"""

import unittest

from src.board import Board
from src.ai import AIPlayer


class BoardTests(unittest.TestCase):
    def test_empty_board_has_nine_moves(self):
        board = Board()
        self.assertEqual(len(board.available_moves()), 9)

    def test_horizontal_win(self):
        board = Board()
        for index, mark in [(0, "X"), (3, "O"), (1, "X"), (4, "O"), (2, "X")]:
            board.place_mark(index, mark)
        self.assertEqual(board.winner()[0], "X")

    def test_diagonal_win(self):
        board = Board()
        for index, mark in [(0, "O"), (1, "X"), (4, "O"), (2, "X"), (8, "O")]:
            board.place_mark(index, mark)
        self.assertEqual(board.winner()[0], "O")

    def test_occupied_cell_cannot_be_replaced(self):
        board = Board()
        self.assertTrue(board.place_mark(4, "X"))
        self.assertFalse(board.place_mark(4, "O"))
        self.assertEqual(board.cells[4], "X")

    def test_draw(self):
        board = Board()
        sequence = [
            (0, "X"), (1, "O"), (2, "X"),
            (4, "O"), (3, "X"), (5, "O"),
            (7, "X"), (6, "O"), (8, "X")
        ]
        # This sequence may win before the final cell; use a known draw below.
        board.cells = ["X", "O", "X", "X", "O", "O", "O", "X", "X"]
        self.assertTrue(board.is_draw())


class AITests(unittest.TestCase):
    def test_ai_returns_legal_move(self):
        board = Board()
        board.place_mark(0, "X")
        move = AIPlayer("Easy").choose_move(board, "O", "X")
        self.assertIn(move, board.available_moves())

    def test_medium_takes_winning_move(self):
        board = Board()
        board.cells = ["O", "O", "", "X", "X", "", "", "", ""]
        self.assertEqual(AIPlayer("Medium").choose_move(board, "O", "X"), 2)

    def test_medium_blocks_human_win(self):
        board = Board()
        board.cells = ["X", "X", "", "O", "", "", "", "", ""]
        self.assertEqual(AIPlayer("Medium").choose_move(board, "O", "X"), 2)

    def test_hard_takes_immediate_win(self):
        board = Board()
        board.cells = ["O", "O", "", "X", "X", "", "", "", ""]
        self.assertEqual(AIPlayer("Hard").choose_move(board, "O", "X"), 2)


if __name__ == "__main__":
    unittest.main()
