"""
Artificial Intelligence Module
------------------------------
Covers Syllabus Requirements:
  - Recursion: Minimax Decision Algorithm with recursive tree expansion
  - Conditional Statements (Nested): Recursive terminal state evaluation, Alpha-Beta pruning
  - Loops (Nested): Board traversal for empty spaces
  - Functions: Recursive calls, parameter passing, return values, variable scope
  - Generators: Generator yielding available coordinates
"""

import random
from typing import Generator
from constants import SYMBOL_X, SYMBOL_O, SYMBOL_EMPTY


def generate_available_moves(grid: list[list[str]]) -> Generator[tuple[int, int], None, None]:
    """
    Generator function that yields available coordinate tuples (r, c).
    Demonstrates NESTED LOOPS and GENERATOR protocol.
    """
    for r in range(3):
        for c in range(3):
            if grid[r][c] == SYMBOL_EMPTY:
                yield (r, c)


def evaluate_board(grid: list[list[str]]) -> int | None:
    """
    Evaluates terminal win state for Minimax.
    Returns +10 if AI ('O') wins, -10 if Human ('X') wins, 0 for draw, None if ongoing.
    """
    lines = [
        # 3 Rows
        [(0, 0), (0, 1), (0, 2)],
        [(1, 0), (1, 1), (1, 2)],
        [(2, 0), (2, 1), (2, 2)],
        # 3 Columns
        [(0, 0), (1, 0), (2, 0)],
        [(0, 1), (1, 1), (2, 1)],
        [(0, 2), (1, 2), (2, 2)],
        # 2 Diagonals
        [(0, 0), (1, 1), (2, 2)],
        [(0, 2), (1, 1), (2, 0)]
    ]

    for line in lines:
        c0, c1, c2 = line
        val0 = grid[c0[0]][c0[1]]
        val1 = grid[c1[0]][c1[1]]
        val2 = grid[c2[0]][c2[1]]

        # Nested conditional check
        if val0 != SYMBOL_EMPTY:
            if val0 == val1 and val1 == val2:
                if val0 == SYMBOL_O:
                    return 10   # AI wins
                elif val0 == SYMBOL_X:
                    return -10  # Human wins

    # Check for empty cells via nested loop
    for r in range(3):
        for c in range(3):
            if grid[r][c] == SYMBOL_EMPTY:
                return None  # Game is still ongoing

    return 0  # Draw / Tie


# ==============================================================================
# RECURSIVE MINIMAX ALGORITHM (Syllabus Requirement: Recursion)
# ==============================================================================
def minimax(
    grid: list[list[str]],
    depth: int,
    is_maximizing: bool,
    alpha: float = -float('inf'),
    beta: float = float('inf')
) -> int:
    """
    Unbeatable AI decision logic implemented via RECURSION.
    
    Demonstrates:
      - Recursion: Base case checks followed by recursive self-calls (minimax)
      - Variable Scope: 'depth', 'alpha', 'beta', and local 'best_score' isolated to call stack frame
      - Nested Conditional Statements: Base terminal checks, alpha-beta bounds
      - Nested Loops: Exploring child branches of 3x3 board
    """
    # --------------------------------------------------------------------------
    # RECURSION BASE CASE: Check if node is terminal or max depth reached
    # --------------------------------------------------------------------------
    score = evaluate_board(grid)
    if score is not None:
        # Depth penalty: Prefer faster victories (+10 - depth) and delayed defeats (-10 + depth)
        if score > 0:
            return score - depth
        elif score < 0:
            return score + depth
        else:
            return 0  # Draw

    # --------------------------------------------------------------------------
    # RECURSIVE STEP: Maximizing Player (AI 'O')
    # --------------------------------------------------------------------------
    if is_maximizing:
        max_eval = -float('inf')
        
        # Generator usage inside recursive function
        for row, col in generate_available_moves(grid):
            # Apply hypothetical move
            grid[row][col] = SYMBOL_O
            
            # RECURSIVE CALL: Explore opponent's subsequent turn
            evaluation = minimax(grid, depth + 1, False, alpha, beta)
            
            # Backtrack state
            grid[row][col] = SYMBOL_EMPTY
            
            # Update best evaluation
            if evaluation > max_eval:
                max_eval = evaluation
            if max_eval > alpha:
                alpha = max_eval
                
            # Alpha-Beta Pruning (Nested Conditional)
            if beta <= alpha:
                break
                
        return int(max_eval)

    # --------------------------------------------------------------------------
    # RECURSIVE STEP: Minimizing Player (Human 'X')
    # --------------------------------------------------------------------------
    else:
        min_eval = float('inf')
        
        for row, col in generate_available_moves(grid):
            grid[row][col] = SYMBOL_X
            
            # RECURSIVE CALL: Explore AI's subsequent turn
            evaluation = minimax(grid, depth + 1, True, alpha, beta)
            
            # Backtrack state
            grid[row][col] = SYMBOL_EMPTY
            
            if evaluation < min_eval:
                min_eval = evaluation
            if min_eval < beta:
                beta = min_eval
                
            # Alpha-Beta Pruning (Nested Conditional)
            if beta <= alpha:
                break
                
        return int(min_eval)


class AIPlayer:
    """
    Computer opponent supporting multiple difficulty tiers:
      - Easy: Selects random available cells
      - Medium: Checks for immediate wins/blocks, otherwise random
      - Hard: Uses Recursive Minimax algorithm for mathematically optimal play
    """
    def __init__(self, difficulty: str = "Hard", symbol: str = SYMBOL_O):
        self.difficulty: str = difficulty
        self.symbol: str = symbol
        self.opponent_symbol: str = SYMBOL_X if symbol == SYMBOL_O else SYMBOL_O

    def get_best_move(self, board_grid: list[list[str]]) -> tuple[int, int] | None:
        """
        Determines the AI's move based on selected difficulty.
        Demonstrates nested conditional branching and function dispatching.
        """
        available_moves: list[tuple[int, int]] = list(generate_available_moves(board_grid))
        if not available_moves:
            return None

        # ----------------------------------------------------------------------
        # NESTED CONDITIONAL STATEMENTS FOR DIFFICULTY BRANCHING
        # ----------------------------------------------------------------------
        if "Easy" in self.difficulty:
            return random.choice(available_moves)

        elif "Medium" in self.difficulty:
            # 1. Check if AI can win on next move
            for r, c in available_moves:
                board_grid[r][c] = self.symbol
                if evaluate_board(board_grid) == 10:
                    board_grid[r][c] = SYMBOL_EMPTY
                    return (r, c)
                board_grid[r][c] = SYMBOL_EMPTY

            # 2. Check if Human could win on next move and block them
            for r, c in available_moves:
                board_grid[r][c] = self.opponent_symbol
                if evaluate_board(board_grid) == -10:
                    board_grid[r][c] = SYMBOL_EMPTY
                    return (r, c)
                board_grid[r][c] = SYMBOL_EMPTY

            # 3. Otherwise pick center or random
            if (1, 1) in available_moves:
                return (1, 1)
            return random.choice(available_moves)

        else:  # Hard / Unbeatable (Minimax Recursion)
            best_score = -float('inf')
            optimal_move = available_moves[0]

            # Prioritize center on first turn for efficiency
            if len(available_moves) >= 8 and (1, 1) in available_moves:
                return (1, 1)

            for r, c in available_moves:
                board_grid[r][c] = self.symbol
                # Call recursive minimax function
                move_score = minimax(board_grid, depth=0, is_maximizing=False)
                board_grid[r][c] = SYMBOL_EMPTY

                # Nested conditional for score comparison
                if move_score > best_score:
                    best_score = move_score
                    optimal_move = (r, c)

            return optimal_move
