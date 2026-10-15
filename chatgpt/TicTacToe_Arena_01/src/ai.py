"""Computer opponent strategies, including recursive Minimax."""

import random
from src.constants import WIN_LINES


class AIPlayer:
    """Selects a legal move according to the requested difficulty."""

    def __init__(self, difficulty="Medium"):
        self.difficulty = difficulty

    def choose_move(self, board, ai_mark="O", human_mark="X"):
        legal_moves = board.available_moves()
        if not legal_moves:
            return None

        if self.difficulty == "Easy":
            return random.choice(legal_moves)
        if self.difficulty == "Hard":
            best_score = float("-inf")
            best_move = legal_moves[0]
            for move in legal_moves:
                simulated = board.copy()
                simulated.place_mark(move, ai_mark)
                score = self._minimax(
                    simulated, False, ai_mark, human_mark, depth=1
                )
                if score > best_score:
                    best_score = score
                    best_move = move
            return best_move

        return self._medium_move(board, legal_moves, ai_mark, human_mark)

    def _winning_move(self, board, mark):
        """Find a move that immediately wins for mark, if one exists."""
        for move in board.available_moves():
            simulated = board.copy()
            simulated.place_mark(move, mark)
            winner, _line = simulated.winner()
            if winner == mark:
                return move
        return None

    def _medium_move(self, board, legal_moves, ai_mark, human_mark):
        # Nested conditionals intentionally make the decision priorities
        # visible for a beginner-level university project.
        winning = self._winning_move(board, ai_mark)
        if winning is not None:
            return winning
        else:
            blocking = self._winning_move(board, human_mark)
            if blocking is not None:
                return blocking
            else:
                if 4 in legal_moves:
                    return 4
                else:
                    corners = [i for i in (0, 2, 6, 8) if i in legal_moves]
                    if corners:
                        return random.choice(corners)
                    else:
                        return random.choice(legal_moves)

    def _minimax(self, board, maximizing, ai_mark, human_mark, depth):
        """Recursive minimax search for classic 3x3 Tic-Tac-Toe."""
        winner, _line = board.winner()
        if winner == ai_mark:
            return 10 - depth
        if winner == human_mark:
            return depth - 10
        if board.is_full():
            return 0

        if maximizing:
            best_score = float("-inf")
            for move in board.empty_cells():
                simulated = board.copy()
                simulated.place_mark(move, ai_mark)
                score = self._minimax(
                    simulated, False, ai_mark, human_mark, depth + 1
                )
                best_score = max(best_score, score)
            return best_score
        else:
            best_score = float("inf")
            for move in board.empty_cells():
                simulated = board.copy()
                simulated.place_mark(move, human_mark)
                score = self._minimax(
                    simulated, True, ai_mark, human_mark, depth + 1
                )
                best_score = min(best_score, score)
            return best_score
