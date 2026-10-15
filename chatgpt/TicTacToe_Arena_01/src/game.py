"""Pygame application: menus, gameplay, animation, leaderboard, and logs."""

import math
import random
import time
from pathlib import Path

import pygame

from src.ai import AIPlayer
from src.audio_manager import AudioManager
from src.board import Board
from src.constants import (
    WIDTH, HEIGHT, FPS, TITLE, BG, PANEL, PANEL_LIGHT, GRID, TEXT, MUTED,
    CYAN, ORANGE, GREEN, RED, PURPLE, WIN_LINES,
)
from src.storage import Storage


class Button:
    """Small reusable button object."""

    def __init__(self, rect, label, action, color=CYAN):
        self.rect = pygame.Rect(rect)
        self.label = label
        self.action = action
        self.color = color

    def draw(self, surface, font, mouse_pos):
        hovered = self.rect.collidepoint(mouse_pos)
        fill = PANEL_LIGHT if hovered else PANEL
        pygame.draw.rect(surface, fill, self.rect, border_radius=12)
        pygame.draw.rect(surface, self.color if hovered else GRID, self.rect, 2, border_radius=12)
        label_surface = font.render(self.label, True, TEXT)
        surface.blit(label_surface, label_surface.get_rect(center=self.rect.center))


class GameApp:
    def __init__(self, project_dir):
        pygame.init()
        pygame.display.set_caption(TITLE)
        self.screen = pygame.display.set_mode((WIDTH, HEIGHT), pygame.RESIZABLE)
        self.clock = pygame.time.Clock()
        self.project_dir = Path(project_dir)
        self.storage = Storage(self.project_dir)
        self.audio = AudioManager(self.project_dir)
        self.fonts = {
            "title": pygame.font.SysFont("segoeui", 44, bold=True),
            "heading": pygame.font.SysFont("segoeui", 28, bold=True),
            "body": pygame.font.SysFont("segoeui", 21),
            "small": pygame.font.SysFont("consolas", 14),
            "mark": pygame.font.SysFont("segoeui", 88, bold=True),
            "large": pygame.font.SysFont("segoeui", 36, bold=True),
        }
        self.screen_name = "menu"
        self.mode = "pvai"
        self.difficulty = "Medium"
        self.board = Board()
        self.current_mark = "X"
        self.player_x = "You"
        self.player_o = "Computer"
        self.result = None
        self.winning_line = None
        self.moves = []
        self.started_at = time.monotonic()
        self.ai_due = None
        self.animations = {}
        self.result_saved = False
        self.message = ""
        self.message_until = 0
        self.menu_buttons = []
        self.game_buttons = []
        self.other_buttons = []
        self._build_menu_buttons()
        self.storage.log_event("Application launched.")

    def _build_menu_buttons(self):
        cx = self.screen.get_width() // 2
        self.menu_buttons = [
            Button((cx - 170, 250, 340, 54), "SOLO  •  PLAYER VS AI", lambda: self.start_game("pvai")),
            Button((cx - 170, 318, 340, 54), "LOCAL  •  TWO PLAYERS", lambda: self.start_game("pvp"), ORANGE),
            Button((cx - 170, 386, 340, 54), f"AI DIFFICULTY: {self.difficulty.upper()}", self.cycle_difficulty, PURPLE),
            Button((cx - 170, 454, 160, 50), "LEADERBOARD", lambda: self.open_screen("leaderboard"), GREEN),
            Button((cx + 10, 454, 160, 50), "MATCH HISTORY", lambda: self.open_screen("history"), CYAN),
            Button((cx - 170, 518, 160, 50), "ACTIVITY LOG", lambda: self.open_screen("activity"), PURPLE),
            Button((cx + 10, 518, 160, 50), self._sound_label(), self.toggle_sound, ORANGE),
            Button((cx - 170, 582, 340, 48), "QUIT GAME", self.quit, RED),
        ]

    def _sound_label(self):
        return "SOUND: ON" if self.audio.sound_enabled else "SOUND: OFF"

    def _refresh_menu_buttons(self):
        self._build_menu_buttons()

    def cycle_difficulty(self):
        levels = ("Easy", "Medium", "Hard")
        self.difficulty = levels[(levels.index(self.difficulty) + 1) % len(levels)]
        self.storage.log_event(f"AI difficulty changed to {self.difficulty}.")
        self._refresh_menu_buttons()

    def toggle_sound(self):
        enabled = self.audio.toggle()
        self.storage.log_event(f"Sound toggled: {'on' if enabled else 'off'}.")
        self._refresh_menu_buttons()

    def open_screen(self, name):
        self.screen_name = name
        self.storage.log_event(f"Opened {name} screen.")

    def start_game(self, mode):
        self.mode = mode
        self.board.reset()
        self.current_mark = "X"
        self.result = None
        self.winning_line = None
        self.moves = []
        self.animations = {}
        self.result_saved = False
        self.started_at = time.monotonic()
        self.ai_due = None
        self.player_x = "Player 1" if mode == "pvp" else "You"
        self.player_o = "Player 2" if mode == "pvp" else f"Computer ({self.difficulty})"
        self.screen_name = "game"
        self.storage.log_event(f"Started {mode} match at {self.difficulty} difficulty.")
        self._refresh_game_buttons()

    def _refresh_game_buttons(self):
        w = self.screen.get_width()
        self.game_buttons = [
            Button((w // 2 - 240, self.screen.get_height() - 78, 150, 46), "RESTART", self.restart_game, ORANGE),
            Button((w // 2 - 75, self.screen.get_height() - 78, 150, 46), "MAIN MENU", self.return_menu, CYAN),
            Button((w // 2 + 90, self.screen.get_height() - 78, 150, 46), self._sound_label(), self.toggle_sound, PURPLE),
        ]

    def restart_game(self):
        self.start_game(self.mode)
        self.storage.log_event("Current match restarted.")

    def return_menu(self):
        self.screen_name = "menu"
        self._refresh_menu_buttons()
        self.storage.log_event("Returned to main menu.")

    def quit(self):
        self.storage.log_event("Application closed.")
        self.audio.close()
        pygame.quit()
        raise SystemExit

    def _text(self, text, font, color, x, y, center=False):
        surface = self.fonts[font].render(str(text), True, color)
        rect = surface.get_rect()
        if center:
            rect.center = (int(x), int(y))
        else:
            rect.topleft = (int(x), int(y))
        self.screen.blit(surface, rect)
        return rect

    def _background(self):
        self.screen.fill(BG)
        w, h = self.screen.get_size()
        # Subtle decorative circles use tuples and nested loops in rendering.
        for row in range(3):
            for col in range(5):
                x = (col * 237 + 60) % max(w, 1)
                y = (row * 281 + 45) % max(h, 1)
                pygame.draw.circle(self.screen, (22, 27, 43), (x, y), 3)

    def _draw_menu(self):
        self._background()
        w = self.screen.get_width()
        self._text("TIC-TAC-TOE", "title", TEXT, w // 2, 95, center=True)
        self._text("A R E N A", "body", CYAN, w // 2, 145, center=True)
        self._text("CLASSIC 3 × 3  •  OFFLINE EDITION", "small", MUTED, w // 2, 184, center=True)
        mouse = pygame.mouse.get_pos()
        for button in self.menu_buttons:
            button.draw(self.screen, self.fonts["body"], mouse)
        self._text("X  THINK AHEAD", "small", CYAN, 35, self.screen.get_height() - 32)
        self._text("O  PLAY SMART", "small", ORANGE, self.screen.get_width() - 155, self.screen.get_height() - 32)

    def _board_rect(self):
        w, h = self.screen.get_size()
        size = min(420, w - 100, h - 250)
        size = max(240, size)
        return pygame.Rect((w - size) // 2, max(165, (h - size) // 2 - 5), size, size)

    def _draw_mark(self, index, rect, mark, progress=1.0):
        color = CYAN if mark == "X" else ORANGE
        cx, cy = rect.center
        pad = max(18, int(rect.width * 0.23))
        progress = max(0.0, min(1.0, progress))
        if mark == "X":
            length = int(pad * 2 * progress)
            pygame.draw.line(self.screen, color, (cx - length // 2, cy - length // 2),
                             (cx + length // 2, cy + length // 2), max(4, rect.width // 30))
            pygame.draw.line(self.screen, color, (cx + length // 2, cy - length // 2),
                             (cx - length // 2, cy + length // 2), max(4, rect.width // 30))
        else:
            radius = int(pad * progress)
            pygame.draw.circle(self.screen, color, (cx, cy), radius, max(4, rect.width // 30))

    def _draw_board(self):
        board_rect = self._board_rect()
        cell_w = board_rect.width / 3
        cell_h = board_rect.height / 3
        pygame.draw.rect(self.screen, PANEL, board_rect, border_radius=18)
        for i in range(1, 3):
            x = round(board_rect.x + i * cell_w)
            y = round(board_rect.y + i * cell_h)
            pygame.draw.line(self.screen, GRID, (x, board_rect.y + 16), (x, board_rect.bottom - 16), 4)
            pygame.draw.line(self.screen, GRID, (board_rect.x + 16, y), (board_rect.right - 16, y), 4)

        now = time.monotonic()
        for row in range(3):
            for col in range(3):
                index = row * 3 + col
                rect = pygame.Rect(
                    round(board_rect.x + col * cell_w + 4),
                    round(board_rect.y + row * cell_h + 4),
                    round(cell_w - 8),
                    round(cell_h - 8),
                )
                mark = self.board.cells[index]
                if mark:
                    start = self.animations.get(index, now - 0.2)
                    progress = min(1.0, (now - start) / 0.18)
                    self._draw_mark(index, rect, mark, progress)

        if self.winning_line:
            centers = []
            for index in self.winning_line:
                row, col = divmod(index, 3)
                centers.append((
                    round(board_rect.x + (col + 0.5) * cell_w),
                    round(board_rect.y + (row + 0.5) * cell_h),
                ))
            color = GREEN
            pygame.draw.line(self.screen, color, centers[0], centers[-1], 8)
            for center in (centers[0], centers[-1]):
                pygame.draw.circle(self.screen, TEXT, center, 5)

    def _draw_game(self):
        self._background()
        w, h = self.screen.get_size()
        title = "PLAYER VS PLAYER" if self.mode == "pvp" else f"SOLO MODE  •  {self.difficulty.upper()} AI"
        self._text(title, "heading", TEXT, w // 2, 48, center=True)
        if self.result is None:
            active_name = self.player_x if self.current_mark == "X" else self.player_o
            active_color = CYAN if self.current_mark == "X" else ORANGE
            self._text(f"{active_name}'s turn  ({self.current_mark})", "body", active_color,
                       w // 2, 100, center=True)
        else:
            if self.result == "draw":
                result_text, result_color = "IT'S A DRAW", PURPLE
            else:
                name = self.player_x if self.result == "X" else self.player_o
                result_text = f"{name} WINS!"
                result_color = GREEN
            self._text(result_text, "heading", result_color, w // 2, 100, center=True)

        self._draw_board()
        if self.result is None and self.mode == "pvai" and self.current_mark == "O":
            self._text("Computer is thinking...", "small", MUTED, w // 2, self._board_rect().bottom + 15, center=True)
        mouse = pygame.mouse.get_pos()
        self._refresh_game_buttons()
        for button in self.game_buttons:
            button.draw(self.screen, self.fonts["small"], mouse)

    def _draw_leaderboard(self):
        self._background()
        w = self.screen.get_width()
        self._text("LEADERBOARD", "title", TEXT, w // 2, 70, center=True)
        self._text("3 points for a win  •  1 point for a draw", "small", MUTED, w // 2, 122, center=True)
        data = self.storage.load_leaderboard()
        rows = sorted(data.items(), key=lambda item: (
            int(item[1].get("points", 0)), int(item[1].get("wins", 0))
        ), reverse=True)
        headers = ("RANK", "PLAYER", "W", "L", "D", "PTS")
        x_positions = (w // 2 - 300, w // 2 - 205, w // 2 + 100, w // 2 + 165, w // 2 + 220, w // 2 + 270)
        pygame.draw.rect(self.screen, PANEL, (w // 2 - 320, 170, 640, 44), border_radius=8)
        for header, x in zip(headers, x_positions):
            self._text(header, "small", CYAN, x, 184)
        if not rows:
            self._text("No completed matches yet. Play a game first!", "body", MUTED, w // 2, 265, center=True)
        for rank, (name, stats) in enumerate(rows[:10], start=1):
            y = 232 + (rank - 1) * 38
            if rank % 2 == 0:
                pygame.draw.rect(self.screen, PANEL, (w // 2 - 320, y - 5, 640, 34), border_radius=6)
            values = (str(rank), name[:16], str(stats.get("wins", 0)),
                      str(stats.get("losses", 0)), str(stats.get("draws", 0)),
                      str(stats.get("points", 0)))
            for value, x in zip(values, x_positions):
                self._text(value, "small", TEXT, x, y + 4)
        self._draw_back_button()

    def _draw_text_list(self, title, lines):
        self._background()
        w, h = self.screen.get_size()
        self._text(title, "title", TEXT, w // 2, 62, center=True)
        panel = pygame.Rect(45, 120, w - 90, h - 220)
        pygame.draw.rect(self.screen, PANEL, panel, border_radius=12)
        y = panel.y + 18
        for line in lines:
            shown = line
            max_chars = max(45, int((w - 130) / 8))
            if len(shown) > max_chars:
                shown = shown[:max_chars - 3] + "..."
            self._text(shown, "small", MUTED if line.startswith("No ") else TEXT, panel.x + 18, y)
            y += 25
            if y > panel.bottom - 25:
                break
        self._draw_back_button()

    def _draw_back_button(self):
        button = Button((self.screen.get_width() // 2 - 100, self.screen.get_height() - 72, 200, 46),
                        "BACK TO MENU", self.return_menu, CYAN)
        button.draw(self.screen, self.fonts["small"], pygame.mouse.get_pos())
        self.other_buttons = [button]

    def _handle_board_click(self, position):
        if self.result is not None:
            return
        if self.mode == "pvai" and self.current_mark == "O":
            return
        rect = self._board_rect()
        if not rect.collidepoint(position):
            return
        col = int((position[0] - rect.x) / (rect.width / 3))
        row = int((position[1] - rect.y) / (rect.height / 3))
        index = row * 3 + col
        self._play_move(index)

    def _play_move(self, index):
        if self.result is not None:
            return
        if not self.board.is_valid_move(index):
            self._show_message("That cell is already occupied.")
            self.storage.log_event(f"Invalid move attempted at cell {index}.")
            return
        mark = self.current_mark
        if self.board.place_mark(index, mark):
            self.moves.append((mark, index))
            self.animations[index] = time.monotonic()
            self.audio.play("move")
            self.storage.log_event(f"Move: {mark} at cell {index}.")
            winner, line = self.board.winner()
            if winner is not None:
                self.result = winner
                self.winning_line = line
                self._finish_match()
            elif self.board.is_draw():
                self.result = "draw"
                self._finish_match()
            else:
                if mark == "X":
                    self.current_mark = "O"
                else:
                    self.current_mark = "X"
                if self.mode == "pvai" and self.current_mark == "O":
                    self.ai_due = time.monotonic() + 0.45

    def _finish_match(self):
        if self.result_saved:
            return
        duration = time.monotonic() - self.started_at
        self.storage.record_match(
            self.mode, self.player_x, self.player_o, self.result, self.moves, duration
        )
        self.result_saved = True
        if self.result == "draw":
            self.audio.play("draw")
        elif self.mode == "pvai" and self.result == "O":
            self.audio.play("lose")
        else:
            self.audio.play("win")

    def _show_message(self, message):
        self.message = message
        self.message_until = time.monotonic() + 1.5

    def _handle_click(self, position):
        if self.screen_name == "menu":
            for button in self.menu_buttons:
                if button.rect.collidepoint(position):
                    button.action()
                    return
        elif self.screen_name == "game":
            if self.result is not None:
                # Clicking the board after a match does nothing; controls remain active.
                pass
            for button in self.game_buttons:
                if button.rect.collidepoint(position):
                    button.action()
                    return
            self._handle_board_click(position)
        else:
            for button in self.other_buttons:
                if button.rect.collidepoint(position):
                    button.action()
                    return

    def _update(self):
        if self.screen_name == "game" and self.ai_due is not None:
            if time.monotonic() >= self.ai_due and self.result is None:
                self.ai_due = None
                ai = AIPlayer(self.difficulty)
                move = ai.choose_move(self.board, "O", "X")
                if move is not None:
                    self._play_move(move)

    def run(self):
        running = True
        while running:
            self.clock.tick(FPS)
            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    self.quit()
                elif event.type == pygame.VIDEORESIZE:
                    self.screen = pygame.display.set_mode(event.size, pygame.RESIZABLE)
                    self._refresh_menu_buttons()
                    if self.screen_name == "game":
                        self._refresh_game_buttons()
                elif event.type == pygame.MOUSEBUTTONDOWN and event.button == 1:
                    self._handle_click(event.pos)
                elif event.type == pygame.KEYDOWN:
                    if event.key == pygame.K_ESCAPE or event.key == pygame.K_m:
                        if self.screen_name != "menu":
                            self.return_menu()
                    elif event.key == pygame.K_r and self.screen_name == "game":
                        self.restart_game()
                    elif event.key == pygame.K_s:
                        self.toggle_sound()

            self._update()
            if self.screen_name == "menu":
                self._draw_menu()
            elif self.screen_name == "game":
                self._draw_game()
            elif self.screen_name == "leaderboard":
                self._draw_leaderboard()
            elif self.screen_name == "history":
                self._draw_text_list("MATCH HISTORY", self.storage.read_history())
            elif self.screen_name == "activity":
                self._draw_text_list("ACTIVITY LOG", self.storage.read_activity())

            if self.message and time.monotonic() < self.message_until:
                box = pygame.Rect(self.screen.get_width() // 2 - 220, 145, 440, 42)
                pygame.draw.rect(self.screen, PANEL_LIGHT, box, border_radius=10)
                self._text(self.message, "small", RED, box.centerx, box.centery, center=True)
            elif time.monotonic() >= self.message_until:
                self.message = ""

            pygame.display.flip()


def run_game(project_dir):
    """Public entry point used by main.py."""
    app = GameApp(project_dir)
    app.run()
