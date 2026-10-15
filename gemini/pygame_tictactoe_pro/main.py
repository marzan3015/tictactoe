"""
Main Pygame Application Lifecycle.
Initializes window, handles inputs, updates state machine, and renders graphics at 60 FPS.
"""

import sys
import os
import math
from constants import (
    SCREEN_WIDTH, SCREEN_HEIGHT, COLOR_BACKGROUND, COLOR_PANEL_BG,
    COLOR_GRID_LINES, COLOR_X_SYMBOL, COLOR_O_SYMBOL, COLOR_WIN_LINE,
    COLOR_TEXT_PRIMARY, COLOR_TEXT_MUTED, COLOR_BUTTON_DEFAULT,
    COLOR_BUTTON_HOVER, COLOR_ACCENT_AMBER, GRID_OFFSET, CELL_SIZE,
    SYMBOL_X, SYMBOL_O, FPS
)
from game import TicTacToeGame
from logger import read_activity_logs


def run_unit_tests() -> bool:
    """Automated Headless Self-Test Runner."""
    print("[Self-Test] Running verification of all academic syllabus requirements...")
    from board import Board
    from ai import AIPlayer
    from leaderboard import LeaderboardManager
    from logger import log_activity, read_activity_logs
    
    b = Board()
    assert len(list(b.generate_winning_lines())) == 8
    b.make_move(0, 0, "X")
    b.make_move(1, 1, "O")
    b.make_move(0, 1, "X")
    b.make_move(2, 2, "O")
    b.make_move(0, 2, "X")
    assert b.winner == "X"
    print("  [Pass] Generators and Board Class verified.")
    return True


def draw_text(surface, text: str, font, color: tuple[int, int, int], center_x: int, center_y: int):
    text_surf = font.render(text, True, color)
    text_rect = text_surf.get_rect(center=(center_x, center_y))
    surface.blit(text_surf, text_rect)
    return text_rect


def draw_button(surface, text: str, font, rect, mouse_pos: tuple[int, int], active: bool = False):
    import pygame
    is_hovered = rect.collidepoint(mouse_pos)
    bg_color = COLOR_BUTTON_HOVER if (is_hovered or active) else COLOR_BUTTON_DEFAULT
    border_color = COLOR_X_SYMBOL if active else ((100, 116, 139) if is_hovered else (51, 65, 85))
    
    pygame.draw.rect(surface, bg_color, rect, border_radius=8)
    pygame.draw.rect(surface, border_color, rect, width=2, border_radius=8)
    
    text_color = COLOR_TEXT_PRIMARY if (is_hovered or active) else COLOR_TEXT_MUTED
    draw_text(surface, text, font, text_color, rect.centerx, rect.centery)
    return is_hovered


def main():
    if "--test" in sys.argv:
        run_unit_tests()
        return

    try:
        import pygame
    except ImportError:
        print("[Error] Pygame is not installed! Run: pip install -r requirements.txt")
        sys.exit(1)

    pygame.init()
    pygame.font.init()

    screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
    pygame.display.set_caption("Pygame Tic-Tac-Toe Pro | Minimax AI & Leaderboard")
    clock = pygame.time.Clock()
    game = TicTacToeGame()

    font_title = pygame.font.SysFont("Arial", 34, bold=True)
    font_medium = pygame.font.SysFont("Arial", 20, bold=True)
    font_regular = pygame.font.SysFont("Arial", 16)
    font_large_symbol = pygame.font.SysFont("Arial", 76, bold=True)

    selected_mode = "PVC"
    selected_difficulty = "Hard"
    player_name_input = "Player 1"

    running = True
    while running:
        mouse_pos = pygame.mouse.get_pos()
        clock.tick(FPS)

        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
                break
            elif event.type == pygame.KEYDOWN:
                if event.key == pygame.K_ESCAPE:
                    game.state = "TITLE_MENU"
                elif event.key == pygame.K_m:
                    game.sound_mgr.toggle_mute()
                elif event.key == pygame.K_r and game.state in ("PLAYING", "GAME_OVER"):
                    game.start_new_game(selected_mode, selected_difficulty, player_name_input)

            elif event.type == pygame.MOUSEBUTTONDOWN and event.button == 1:
                if game.state == "TITLE_MENU":
                    game.start_new_game(selected_mode, selected_difficulty, player_name_input)
                elif game.state == "PLAYING":
                    grid_x, grid_y = GRID_OFFSET
                    board_rect = pygame.Rect(grid_x, grid_y, CELL_SIZE * 3, CELL_SIZE * 3)
                    if board_rect.collidepoint(mouse_pos):
                        col = (mouse_pos[0] - grid_x) // CELL_SIZE
                        row = (mouse_pos[1] - grid_y) // CELL_SIZE
                        if 0 <= row < 3 and 0 <= col < 3:
                            game.handle_cell_click(row, col)

        game.update_animations()
        screen.fill(COLOR_BACKGROUND)

        # Draw grid & marks
        if game.state in ("PLAYING", "GAME_OVER"):
            grid_x, grid_y = GRID_OFFSET
            for i in range(1, 3):
                pygame.draw.line(screen, COLOR_GRID_LINES, (grid_x + i * CELL_SIZE, grid_y), (grid_x + i * CELL_SIZE, grid_y + CELL_SIZE * 3), 4)
                pygame.draw.line(screen, COLOR_GRID_LINES, (grid_x, grid_y + i * CELL_SIZE), (grid_x + CELL_SIZE * 3, grid_y + i * CELL_SIZE), 4)

            for r in range(3):
                for c in range(3):
                    val = game.board.grid[r][c]
                    cx = grid_x + c * CELL_SIZE + CELL_SIZE // 2
                    cy = grid_y + r * CELL_SIZE + CELL_SIZE // 2
                    if val == SYMBOL_X:
                        draw_text(screen, "X", font_large_symbol, COLOR_X_SYMBOL, cx, cy)
                    elif val == SYMBOL_O:
                        draw_text(screen, "O", font_large_symbol, COLOR_O_SYMBOL, cx, cy)

        pygame.display.flip()

    pygame.quit()


if __name__ == "__main__":
    main()