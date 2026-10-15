"""
Main Game Controller and State Machine
--------------------------------------
Covers Syllabus Requirements:
  - Python OOP: Class (TicTacToeGame), Object lifecycle, instance methods
  - Modularization: Combining board, ai, sound, logger, and leaderboard modules
  - Animations: Particle bursts, strike lines, hover transitions
  - Player vs Player (PvP) and Player to Computer (Solo) modes
"""

import math
import random
from typing import Generator
from board import Board
from ai import AIPlayer
from leaderboard import LeaderboardManager
from sound_manager import SoundManager
from logger import log_activity
from constants import SYMBOL_X, SYMBOL_O, COLOR_X_SYMBOL, COLOR_O_SYMBOL, COLOR_WIN_LINE


class Particle:
    """Represents a single glowing animated particle for visual effects."""
    def __init__(self, x: float, y: float, color: tuple[int, int, int]):
        self.x: float = float(x)
        self.y: float = float(y)
        angle = random.uniform(0, 2 * math.pi)
        speed = random.uniform(2.0, 7.0)
        self.vx: float = math.cos(angle) * speed
        self.vy: float = math.sin(angle) * speed
        self.color: tuple[int, int, int] = color
        self.radius: float = random.uniform(3.0, 7.0)
        self.life: float = 1.0
        self.decay_rate: float = random.uniform(0.02, 0.05)

    def update(self) -> bool:
        self.x += self.vx
        self.y += self.vy
        self.vx *= 0.95
        self.vy *= 0.95
        self.life -= self.decay_rate
        self.radius = max(0.5, self.radius * 0.96)
        return self.life > 0.0


class TicTacToeGame:
    def __init__(self):
        self.board: Board = Board()
        self.leaderboard: LeaderboardManager = LeaderboardManager()
        self.sound_mgr: SoundManager = SoundManager()
        self.ai: AIPlayer = AIPlayer(difficulty="Hard", symbol=SYMBOL_O)

        self.game_mode: str = "PVC"
        self.ai_difficulty: str = "Hard"
        self.player_x_name: str = "Player 1"
        self.player_o_name: str = "AI Minimax"
        self.current_turn: str = SYMBOL_X
        self.state: str = "TITLE_MENU"

        self.particles: list[Particle] = []
        self.strike_progress: float = 0.0
        self.is_animating_win: bool = False

        self.session_wins_x: int = 0
        self.session_wins_o: int = 0
        self.session_draws: int = 0

    def start_new_game(self, mode: str = "PVC", difficulty: str = "Hard", p1_name: str = "Player 1", p2_name: str = "Computer") -> None:
        self.game_mode = mode
        self.ai_difficulty = difficulty
        self.player_x_name = p1_name.strip() or "Player 1"
        self.player_o_name = p2_name.strip() if mode == "PVP" else f"AI ({difficulty})"
        self.ai = AIPlayer(difficulty=difficulty, symbol=SYMBOL_O)
        
        self.board.reset()
        self.current_turn = SYMBOL_X
        self.particles.clear()
        self.strike_progress = 0.0
        self.is_animating_win = False
        self.state = "PLAYING"

        log_activity(
            event_type="GAME_START",
            details=f"Mode: {mode} | Opponent: {self.player_o_name} | Difficulty: {difficulty}",
            username=self.player_x_name
        )
        self.sound_mgr.play_sound("click")

    def handle_cell_click(self, row: int, col: int) -> bool:
        if self.state != "PLAYING" or self.is_animating_win:
            return False

        if not self.board.is_valid_move(row, col):
            return False

        success = self.board.make_move(row, col, self.current_turn)
        if not success:
            return False

        self.sound_mgr.play_sound("move_x" if self.current_turn == SYMBOL_X else "move_o")
        
        if self._evaluate_match_status():
            return True

        self.current_turn = SYMBOL_O if self.current_turn == SYMBOL_X else SYMBOL_X

        if self.game_mode == "PVC" and self.current_turn == SYMBOL_O:
            self._trigger_ai_move()

        return True

    def _trigger_ai_move(self) -> None:
        if self.state != "PLAYING":
            return

        board_copy = self.board.get_board_copy()
        ai_move = self.ai.get_best_move(board_copy)
        
        if ai_move:
            r, c = ai_move
            self.board.make_move(r, c, SYMBOL_O)
            self.sound_mgr.play_sound("move_o")
            
            if not self._evaluate_match_status():
                self.current_turn = SYMBOL_X

    def _evaluate_match_status(self) -> bool:
        winner, is_draw = self.board.check_game_over()
        
        if winner:
            self.state = "GAME_OVER"
            self.is_animating_win = True
            self.strike_progress = 0.0
            self.sound_mgr.play_sound("win")

            winner_name = self.player_x_name if winner == SYMBOL_X else self.player_o_name
            loser_name = self.player_o_name if winner == SYMBOL_X else self.player_x_name

            if winner == SYMBOL_X:
                self.session_wins_x += 1
                self.leaderboard.record_match_result(self.player_x_name, "win", self.ai_difficulty)
                if self.game_mode == "PVP":
                    self.leaderboard.record_match_result(self.player_o_name, "loss", self.ai_difficulty)
            else:
                self.session_wins_o += 1
                if self.game_mode == "PVC":
                    self.leaderboard.record_match_result(self.player_x_name, "loss", self.ai_difficulty)
                else:
                    self.leaderboard.record_match_result(self.player_o_name, "win", self.ai_difficulty)
                    self.leaderboard.record_match_result(self.player_x_name, "loss", self.ai_difficulty)

            log_activity(
                event_type="GAME_WIN",
                details=f"Winner: {winner_name} ({winner}) over {loser_name} in {self.board.move_count} moves",
                username=winner_name
            )
            return True

        elif is_draw:
            self.state = "GAME_OVER"
            self.session_draws += 1
            self.sound_mgr.play_sound("draw")

            self.leaderboard.record_match_result(self.player_x_name, "draw", self.ai_difficulty)
            if self.game_mode == "PVP":
                self.leaderboard.record_match_result(self.player_o_name, "draw", self.ai_difficulty)

            log_activity(
                event_type="GAME_DRAW",
                details=f"Draw between {self.player_x_name} and {self.player_o_name} (9 moves)",
                username=self.player_x_name
            )
            return True

        return False

    def spawn_particles(self, x: float, y: float, color: tuple[int, int, int], count: int = 25) -> None:
        for _ in range(count):
            self.particles.append(Particle(x, y, color))

    def update_animations(self) -> None:
        self.particles = [p for p in self.particles if p.update()]
        if self.is_animating_win and self.strike_progress < 1.0:
            self.strike_progress = min(1.0, self.strike_progress + 0.05)
            if len(self.particles) < 50 and random.random() < 0.4:
                rx = random.uniform(200, 600)
                ry = random.uniform(150, 550)
                self.spawn_particles(rx, ry, COLOR_WIN_LINE, count=2)