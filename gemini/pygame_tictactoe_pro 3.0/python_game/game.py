"""
Main Game Controller and State Machine
--------------------------------------
Covers Syllabus Requirements:
  - Python OOP: Class (TicTacToeGame, Particle), Object lifecycle, instance methods
  - Modularization: Combining board, ai, sound, logger, and leaderboard modules
  - Animations: Glitter sparkle particle bursts, strike lines, hover transitions
  - Player vs Player (PvP) and Player to Computer (Solo) modes with 1.0s AI delay
"""

import math
import random
from typing import Generator

try:
    import pygame
except ImportError:
    pygame = None

from board import Board
from ai import AIPlayer
from leaderboard import LeaderboardManager
from sound_manager import SoundManager
from logger import log_activity
from constants import (
    SYMBOL_X, SYMBOL_O, COLOR_X_SYMBOL, COLOR_O_SYMBOL, COLOR_WIN_LINE,
    CELL_SIZE, GRID_OFFSET
)


class Particle:
    """Represents a single glowing, glittering animated particle."""
    def __init__(self, x: float, y: float, color: tuple[int, int, int]):
        self.x: float = float(x)
        self.y: float = float(y)
        angle = random.uniform(0, 2 * math.pi)
        speed = random.uniform(2.0, 7.5)
        self.vx: float = math.cos(angle) * speed
        self.vy: float = math.sin(angle) * speed
        self.color: tuple[int, int, int] = color
        self.radius: float = random.uniform(3.0, 8.0)
        self.life: float = 1.0  # 1.0 to 0.0 decay
        self.decay_rate: float = random.uniform(0.02, 0.045)
        # 40% of particles are glistening diamond/star sparkles
        self.is_sparkle: bool = random.random() < 0.45
        self.sparkle_angle: float = random.uniform(0, math.pi)

    def update(self) -> bool:
        """Updates particle physics. Returns False when particle expires."""
        self.x += self.vx
        self.y += self.vy
        self.vx *= 0.94  # Smooth air drag
        self.vy *= 0.94
        self.life -= self.decay_rate
        self.radius = max(0.5, self.radius * 0.96)
        self.sparkle_angle += 0.1
        return self.life > 0.0

    def draw(self, surface: any) -> None:
        """Draws glowing particle with semi-transparent halo and star sparkle."""
        if pygame is None or self.life <= 0:
            return

        alpha = int(max(0, min(255, self.life * 255)))
        # Create small temporary alpha surface for glow
        surf_size = int(self.radius * 6) + 4
        glow_surf = pygame.Surface((surf_size, surf_size), pygame.SRCALPHA)
        center = surf_size // 2

        # Draw outer soft glow
        glow_color = (self.color[0], self.color[1], self.color[2], int(alpha * 0.35))
        pygame.draw.circle(glow_surf, glow_color, (center, center), int(self.radius * 1.8))

        # Draw inner core
        core_color = (
            min(255, self.color[0] + 50),
            min(255, self.color[1] + 50),
            min(255, self.color[2] + 50),
            alpha
        )
        pygame.draw.circle(glow_surf, core_color, (center, center), int(self.radius))

        # If it's a sparkle, draw glistening cross glint
        if self.is_sparkle and self.life > 0.3:
            arm_len = int(self.radius * 2.2)
            sparkle_color = (255, 255, 255, int(alpha * 0.8))
            pygame.draw.line(glow_surf, sparkle_color, (center - arm_len, center), (center + arm_len, center), 1)
            pygame.draw.line(glow_surf, sparkle_color, (center, center - arm_len), (center, center + arm_len), 1)

        surface.blit(glow_surf, (int(self.x - center), int(self.y - center)))


class TicTacToeGame:
    """
    Main Game Controller orchestrating rules, UI states, audio cues, AI timing, and logs.
    """
    def __init__(self):
        # Subsystem instances (Object Creation)
        self.board: Board = Board()
        self.leaderboard: LeaderboardManager = LeaderboardManager()
        self.sound_mgr: SoundManager = SoundManager()
        self.ai: AIPlayer = AIPlayer(difficulty="Hard", symbol=SYMBOL_O)

        # Game Session State
        self.game_mode: str = "PVC"  # 'PVC' (Solo vs AI) or 'PVP' (2 Players)
        self.ai_difficulty: str = "Hard"
        self.player_x_name: str = "Player 1"
        self.player_o_name: str = "AI Minimax"
        self.current_turn: str = SYMBOL_X
        self.state: str = "TITLE_MENU"  # 'TITLE_MENU', 'PLAYING', 'GAME_OVER', 'LEADERBOARD', 'LOGS'

        # 1.0s AI Reaction Delay system
        self.ai_thinking: bool = False
        self.ai_think_start_time: int = 0
        self.ai_delay_ms: int = 1000  # Exactly 1 second delay requested by user

        # Animation states
        self.particles: list[Particle] = []
        self.strike_progress: float = 0.0
        self.is_animating_win: bool = False

        # Session scores
        self.session_wins_x: int = 0
        self.session_wins_o: int = 0
        self.session_draws: int = 0

    def start_new_game(self, mode: str = "PVC", difficulty: str = "Hard", p1_name: str = "Player 1", p2_name: str = "Computer") -> None:
        """Initializes a new match with custom parameters."""
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
        self.ai_thinking = False
        self.ai_think_start_time = 0
        self.state = "PLAYING"

        log_activity(
            event_type="GAME_START",
            details=f"Mode: {mode} | Opponent: {self.player_o_name} | Difficulty: {difficulty}",
            username=self.player_x_name
        )
        self.sound_mgr.play_sound("click")

    def handle_cell_click(self, row: int, col: int) -> bool:
        """Processes a click on grid coordinates (row, col)."""
        if self.state != "PLAYING" or self.is_animating_win or self.ai_thinking:
            return False

        # Move validation
        if not self.board.is_valid_move(row, col):
            return False

        # Calculate cell center coordinates for particle burst
        grid_x, grid_y = GRID_OFFSET
        cx = grid_x + col * CELL_SIZE + CELL_SIZE // 2
        cy = grid_y + row * CELL_SIZE + CELL_SIZE // 2
        burst_color = COLOR_X_SYMBOL if self.current_turn == SYMBOL_X else COLOR_O_SYMBOL
        self.spawn_particles(cx, cy, burst_color, count=28)

        # Move execution
        success = self.board.make_move(row, col, self.current_turn)
        if not success:
            return False

        # Sound feedback
        self.sound_mgr.play_sound("move_x" if self.current_turn == SYMBOL_X else "move_o")
        
        # Check if match concluded
        if self._evaluate_match_status():
            return True

        # Switch turns
        next_turn = SYMBOL_O if self.current_turn == SYMBOL_X else SYMBOL_X
        self.current_turn = next_turn

        # If playing vs AI and it's now AI's turn, initiate 1.0 second delay timer
        if self.game_mode == "PVC" and self.current_turn == SYMBOL_O:
            self.ai_thinking = True
            self.ai_think_start_time = pygame.time.get_ticks() if pygame else 0

        return True

    def update_ai_timer(self, current_time_ms: int) -> None:
        """
        Manages the 1.0 second AI thinking delay.
        Triggers AI move only when 1.0 second (1000ms) has elapsed.
        """
        if not self.ai_thinking or self.state != "PLAYING":
            return

        # Check if 1000ms delay has elapsed
        if current_time_ms - self.ai_think_start_time >= self.ai_delay_ms:
            self._execute_ai_move()

    def _execute_ai_move(self) -> None:
        """Executes computer opponent move after the 1-second delay."""
        self.ai_thinking = False
        board_copy = self.board.get_board_copy()
        ai_move = self.ai.get_best_move(board_copy)
        
        if ai_move:
            r, c = ai_move
            grid_x, grid_y = GRID_OFFSET
            cx = grid_x + c * CELL_SIZE + CELL_SIZE // 2
            cy = grid_y + r * CELL_SIZE + CELL_SIZE // 2
            # Glitter particle burst for AI move
            self.spawn_particles(cx, cy, COLOR_O_SYMBOL, count=28)

            self.board.make_move(r, c, SYMBOL_O)
            self.sound_mgr.play_sound("move_o")
            
            if not self._evaluate_match_status():
                self.current_turn = SYMBOL_X

    def _evaluate_match_status(self) -> bool:
        """Checks if game ended with a win or draw. Updates stats, logs, and leaderboard."""
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
        """Spawns glistening glitter particles at pixel coordinates."""
        for _ in range(count):
            self.particles.append(Particle(x, y, color))

    def update_animations(self) -> None:
        """Updates running animations (particles and win strike line)."""
        # Update particles and prune expired ones
        self.particles = [p for p in self.particles if p.update()]

        # Progress win strike line smoothly
        if self.is_animating_win and self.strike_progress < 1.0:
            self.strike_progress = min(1.0, self.strike_progress + 0.05)
            # Continuous celebratory fireworks sparkles during victory
            if len(self.particles) < 70 and random.random() < 0.6:
                rx = random.uniform(180, 620)
                ry = random.uniform(130, 560)
                sparkle_color = random.choice([COLOR_WIN_LINE, (255, 215, 0), COLOR_X_SYMBOL, (255, 255, 255)])
                self.spawn_particles(rx, ry, sparkle_color, count=3)
