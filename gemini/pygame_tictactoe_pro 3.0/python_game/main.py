"""
================================================================================
Pygame Tic-Tac-Toe Pro: Complete Desktop PC Edition
================================================================================
Features:
  - High-Fidelity Title Screen with Bespoke Logo, Mode Select, and Name Input
  - Interactive Text Input Boxes (Type custom player names!)
  - 1.0-Second AI Thinking Delay with "AI is thinking..." Status
  - Dazzling Glitter Particle Effects & Victory Confetti
  - Clear Navigation & Controls: Press R to Restart, ESC for Menu, X to Exit, M to Mute
  - Game Over Status: "{Player} Wins!" / "AI Wins! {Player} Loses!"
  - Persistent Text File I/O (Leaderboard & Player Activity Logs)
  - 100% Compatible with both pygame and pygame-ce
================================================================================
"""

from __future__ import annotations
import sys
import os
import math
import webbrowser

try:
    import pygame
except ImportError:
    pygame = None

from constants import (
    SCREEN_WIDTH, SCREEN_HEIGHT, COLOR_BACKGROUND, COLOR_PANEL_BG,
    COLOR_GRID_LINES, COLOR_X_SYMBOL, COLOR_O_SYMBOL, COLOR_WIN_LINE,
    COLOR_TEXT_PRIMARY, COLOR_TEXT_MUTED, COLOR_BUTTON_DEFAULT,
    COLOR_BUTTON_HOVER, COLOR_ACCENT_AMBER, GRID_OFFSET, CELL_SIZE,
    SYMBOL_X, SYMBOL_O, FPS, AUTHOR_CREDIT, AUTHOR_GITHUB_URL
)
from game import TicTacToeGame
from logger import read_activity_logs


def draw_footer_attribution(surface: pygame.Surface, mouse_pos: tuple[int, int], font_credit: pygame.font.Font) -> pygame.Rect:
    """
    Renders 'Made by @marzan3015  ·  https://github.com/marzan3015' at the bottom middle.
    Hovering highlights the badge with a glowing cyan border and changes mouse cursor to hand pointer.
    Clicking opens user's GitHub profile in their default web browser.
    """
    center_x = SCREEN_WIDTH // 2
    center_y = SCREEN_HEIGHT - 20
    
    text_content = f"{AUTHOR_CREDIT}  ·  {AUTHOR_GITHUB_URL}"
    text_surf = font_credit.render(text_content, True, (148, 163, 184))
    text_rect = text_surf.get_rect(center=(center_x, center_y))
    hit_box = text_rect.inflate(28, 10)
    
    is_hovered = hit_box.collidepoint(mouse_pos)
    if is_hovered:
        pygame.draw.rect(surface, (30, 41, 59), hit_box, border_radius=6)
        pygame.draw.rect(surface, COLOR_X_SYMBOL, hit_box, width=1, border_radius=6)
        hover_surf = font_credit.render(text_content, True, COLOR_X_SYMBOL)
        surface.blit(hover_surf, text_rect)
        try:
            pygame.mouse.set_cursor(pygame.SYSTEM_CURSOR_HAND)
        except Exception:
            pass
    else:
        surface.blit(text_surf, text_rect)
        
    return hit_box


def get_safe_font(size: int, bold: bool = False):
    """
    Returns a reliable font with graceful fallback to Pygame's built-in font
    to guarantee text renders on Windows, Mac, and Linux without blank screens.
    """
    import pygame
    try:
        f = pygame.font.SysFont("Arial", size, bold=bold)
        if f:
            return f
    except Exception:
        pass
    return pygame.font.Font(None, int(size * 1.15))


def draw_text(surface: pygame.Surface, text: str, font: pygame.font.Font, color: tuple[int, int, int], center_x: int, center_y: int) -> pygame.Rect:
    """Renders centered text onto surface."""
    text_surf = font.render(text, True, color)
    text_rect = text_surf.get_rect(center=(int(center_x), int(center_y)))
    surface.blit(text_surf, text_rect)
    return text_rect


def draw_text_left(surface: pygame.Surface, text: str, font: pygame.font.Font, color: tuple[int, int, int], left_x: int, center_y: int) -> pygame.Rect:
    """Renders left-aligned text onto surface."""
    text_surf = font.render(text, True, color)
    text_rect = text_surf.get_rect(midleft=(int(left_x), int(center_y)))
    surface.blit(text_surf, text_rect)
    return text_rect


def draw_button(surface: pygame.Surface, text: str, font: pygame.font.Font, rect: pygame.Rect, mouse_pos: tuple[int, int], active: bool = False, accent_color: tuple[int, int, int] | None = None) -> bool:
    """Renders a button with hover highlights, borders, and active glow."""
    is_hovered = rect.collidepoint(mouse_pos)
    
    if active:
        bg_color = (24, 40, 68)
        border_color = accent_color or COLOR_X_SYMBOL
        text_color = accent_color or COLOR_X_SYMBOL
    elif is_hovered:
        bg_color = COLOR_BUTTON_HOVER
        border_color = (148, 163, 184)
        text_color = COLOR_TEXT_PRIMARY
    else:
        bg_color = COLOR_BUTTON_DEFAULT
        border_color = (51, 65, 85)
        text_color = COLOR_TEXT_MUTED

    pygame.draw.rect(surface, bg_color, rect, border_radius=8)
    pygame.draw.rect(surface, border_color, rect, width=2 if (active or is_hovered) else 1, border_radius=8)
    draw_text(surface, text, font, text_color, rect.centerx, rect.centery)
    return is_hovered


def draw_logo(surface: pygame.Surface, center_x: int, center_y: int, font_logo: pygame.font.Font):
    """Draws stylized inline logo with mini board and glowing X and O."""
    # Mini 3x3 board icon (42x42 px)
    icon_w = 42
    icon_x = center_x - 170
    icon_y = center_y - 21
    
    # Background plate for logo icon
    pygame.draw.rect(surface, (30, 41, 59), (icon_x, icon_y, icon_w, icon_w), border_radius=8)
    pygame.draw.rect(surface, (51, 65, 85), (icon_x, icon_y, icon_w, icon_w), width=1, border_radius=8)
    
    # Mini grid lines
    step = icon_w // 3
    pygame.draw.line(surface, (71, 85, 105), (icon_x + step, icon_y + 4), (icon_x + step, icon_y + icon_w - 4), 1)
    pygame.draw.line(surface, (71, 85, 105), (icon_x + step * 2, icon_y + 4), (icon_x + step * 2, icon_y + icon_w - 4), 1)
    pygame.draw.line(surface, (71, 85, 105), (icon_x + 4, icon_y + step), (icon_x + icon_w - 4, icon_y + step), 1)
    pygame.draw.line(surface, (71, 85, 105), (icon_x + 4, icon_y + step * 2), (icon_x + icon_w - 4, icon_y + step * 2), 1)
    
    # Mini X in top-left, mini O in bottom-right
    x_font = get_safe_font(16, bold=True)
    draw_text(surface, "X", x_font, COLOR_X_SYMBOL, icon_x + step // 2, icon_y + step // 2)
    draw_text(surface, "O", x_font, COLOR_O_SYMBOL, icon_x + step * 2 + step // 2, icon_y + step * 2 + step // 2)

    # Title text
    draw_text_left(surface, "TIC-TAC-TOE PRO", font_logo, COLOR_TEXT_PRIMARY, center_x - 110, center_y)


def main():
    """Main Game Loop & Lifecycle."""
    # Headless test flag support
    if "--test" in sys.argv:
        from board import Board
        from ai import AIPlayer
        b = Board()
        assert len(list(b.generate_winning_lines())) == 8
        ai = AIPlayer(difficulty="Hard")
        print("[Pass] Self-tests verified successfully!")
        return

    if pygame is None:
        print("\n[Error] Pygame or Pygame-ce is not installed!")
        print("Please run: pip install -r requirements.txt\n")
        sys.exit(1)

    pygame.init()
    pygame.font.init()

    screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
    pygame.display.set_caption("Pygame Tic-Tac-Toe Pro | Minimax AI & Leaderboard")
    clock = pygame.time.Clock()
    game = TicTacToeGame()

    # Font definitions
    font_logo = get_safe_font(30, bold=True)
    font_title = get_safe_font(26, bold=True)
    font_heading = get_safe_font(18, bold=True)
    font_button = get_safe_font(15, bold=True)
    font_regular = get_safe_font(14, bold=False)
    font_small = get_safe_font(12, bold=False)
    font_large_symbol = get_safe_font(74, bold=True)
    font_code = get_safe_font(13, bold=False)
    font_credit = get_safe_font(12, bold=True)

    # Setup State
    selected_mode = "PVC"  # 'PVC' or 'PVP'
    selected_difficulty = "Hard"
    p1_name = "Player 1"
    p2_name = "Player 2"
    active_input_box: str | None = None  # 'p1', 'p2', or None
    cursor_timer = 0

    # Layout Rectangles for Title Screen
    btn_mode_pvc = pygame.Rect(170, 150, 220, 42)
    btn_mode_pvp = pygame.Rect(410, 150, 220, 42)

    btn_diff_easy = pygame.Rect(170, 230, 140, 38)
    btn_diff_med = pygame.Rect(330, 230, 140, 38)
    btn_diff_hard = pygame.Rect(490, 230, 140, 38)

    input_rect_p1 = pygame.Rect(260, 305, 280, 36)
    input_rect_p2 = pygame.Rect(260, 355, 280, 36)

    btn_start_game = pygame.Rect(250, 420, 300, 48)
    btn_view_leaderboard = pygame.Rect(250, 485, 145, 36)
    btn_view_logs = pygame.Rect(405, 485, 145, 36)

    # In-Game Bottom Navigation Buttons
    btn_ingame_restart = pygame.Rect(120, 580, 130, 36)
    btn_ingame_menu = pygame.Rect(265, 580, 130, 36)
    btn_ingame_mute = pygame.Rect(410, 580, 130, 36)
    btn_ingame_exit = pygame.Rect(555, 580, 130, 36)

    running = True

    while running:
        current_time = pygame.time.get_ticks()
        mouse_pos = pygame.mouse.get_pos()
        delta_time = clock.tick(FPS)
        cursor_timer = (cursor_timer + 1) % 60

        # Keep background theme song continuously playing until window closes
        game.sound_mgr.ensure_bgm_playing()

        # Manage 1.0s AI Reaction Delay
        game.update_ai_timer(current_time)

        # ----------------------------------------------------------------------
        # EVENT HANDLING
        # ----------------------------------------------------------------------
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
                break

            # ------------------------------------------------------------------
            # KEYBOARD SHORTCUTS
            # ------------------------------------------------------------------
            elif event.type == pygame.KEYDOWN:
                # Text input typing when box is focused on title screen
                if game.state == "TITLE_MENU" and active_input_box is not None:
                    if event.key == pygame.K_RETURN:
                        active_input_box = None
                    elif event.key == pygame.K_BACKSPACE:
                        if active_input_box == "p1":
                            p1_name = p1_name[:-1]
                        elif active_input_box == "p2":
                            p2_name = p2_name[:-1]
                    else:
                        if len(event.unicode) > 0 and event.unicode.isprintable():
                            if active_input_box == "p1" and len(p1_name) < 15:
                                p1_name += event.unicode
                            elif active_input_box == "p2" and len(p2_name) < 15:
                                p2_name += event.unicode
                    continue

                # Global Nav Shortcuts
                if event.key == pygame.K_x:
                    running = False
                    break
                elif event.key == pygame.K_ESCAPE:
                    game.state = "TITLE_MENU"
                    game.sound_mgr.play_sound("click")
                elif event.key == pygame.K_m:
                    game.sound_mgr.toggle_mute()
                elif event.key == pygame.K_r:
                    if game.state in ("PLAYING", "GAME_OVER"):
                        p2 = p2_name if selected_mode == "PVP" else "Computer"
                        game.start_new_game(selected_mode, selected_difficulty, p1_name, p2)

            elif event.type == pygame.MOUSEBUTTONDOWN and event.button == 1:
                # Global attribution footer click (opens author GitHub)
                footer_rect = pygame.Rect(SCREEN_WIDTH // 2 - 240, SCREEN_HEIGHT - 35, 480, 30)
                if footer_rect.collidepoint(mouse_pos):
                    try:
                        webbrowser.open(AUTHOR_GITHUB_URL)
                        game.sound_mgr.play_sound("click")
                    except Exception as browser_err:
                        print(f"[Browser Error] Could not open GitHub URL: {browser_err}")
                    continue

                # TITLE MENU INTERACTIONS
                if game.state == "TITLE_MENU":
                    # Mode selection
                    if btn_mode_pvc.collidepoint(mouse_pos):
                        selected_mode = "PVC"
                        active_input_box = None
                        game.sound_mgr.play_sound("click")
                    elif btn_mode_pvp.collidepoint(mouse_pos):
                        selected_mode = "PVP"
                        active_input_box = None
                        game.sound_mgr.play_sound("click")

                    # Difficulty selection (Solo)
                    elif selected_mode == "PVC" and btn_diff_easy.collidepoint(mouse_pos):
                        selected_difficulty = "Easy"
                        active_input_box = None
                        game.sound_mgr.play_sound("click")
                    elif selected_mode == "PVC" and btn_diff_med.collidepoint(mouse_pos):
                        selected_difficulty = "Medium"
                        active_input_box = None
                        game.sound_mgr.play_sound("click")
                    elif selected_mode == "PVC" and btn_diff_hard.collidepoint(mouse_pos):
                        selected_difficulty = "Hard"
                        active_input_box = None
                        game.sound_mgr.play_sound("click")

                    # Input box clicks
                    elif input_rect_p1.collidepoint(mouse_pos):
                        active_input_box = "p1"
                    elif selected_mode == "PVP" and input_rect_p2.collidepoint(mouse_pos):
                        active_input_box = "p2"
                    else:
                        active_input_box = None

                    # Action buttons
                    if btn_start_game.collidepoint(mouse_pos):
                        p2 = p2_name if selected_mode == "PVP" else "Computer"
                        game.start_new_game(selected_mode, selected_difficulty, p1_name, p2)
                    elif btn_view_leaderboard.collidepoint(mouse_pos):
                        game.state = "LEADERBOARD"
                        game.sound_mgr.play_sound("click")
                    elif btn_view_logs.collidepoint(mouse_pos):
                        game.state = "LOGS"
                        game.sound_mgr.play_sound("click")

                # IN-GAME & GAME OVER INTERACTIONS
                elif game.state in ("PLAYING", "GAME_OVER"):
                    # Bottom navigation buttons
                    if btn_ingame_restart.collidepoint(mouse_pos):
                        p2 = p2_name if selected_mode == "PVP" else "Computer"
                        game.start_new_game(selected_mode, selected_difficulty, p1_name, p2)
                    elif btn_ingame_menu.collidepoint(mouse_pos):
                        game.state = "TITLE_MENU"
                        game.sound_mgr.play_sound("click")
                    elif btn_ingame_mute.collidepoint(mouse_pos):
                        game.sound_mgr.toggle_mute()
                    elif btn_ingame_exit.collidepoint(mouse_pos):
                        running = False
                        break

                    # 3x3 Board Cell Clicks
                    grid_x, grid_y = GRID_OFFSET
                    board_rect = pygame.Rect(grid_x, grid_y, CELL_SIZE * 3, CELL_SIZE * 3)

                    if board_rect.collidepoint(mouse_pos) and game.state == "PLAYING" and not game.ai_thinking:
                        col = (mouse_pos[0] - grid_x) // CELL_SIZE
                        row = (mouse_pos[1] - grid_y) // CELL_SIZE
                        if 0 <= row < 3 and 0 <= col < 3:
                            game.handle_cell_click(row, col)

                # MODAL SCREENS (Leaderboard / Logs)
                elif game.state in ("LEADERBOARD", "LOGS"):
                    btn_back = pygame.Rect(310, 570, 180, 38)
                    if btn_back.collidepoint(mouse_pos):
                        game.state = "TITLE_MENU"
                        game.sound_mgr.play_sound("click")

        # ----------------------------------------------------------------------
        # UPDATE ANIMATIONS
        # ----------------------------------------------------------------------
        game.update_animations()

        # ----------------------------------------------------------------------
        # RENDERING PIPELINE
        # ----------------------------------------------------------------------
        screen.fill(COLOR_BACKGROUND)

        # ======================================================================
        # 1. RENDER TITLE SCREEN
        # ======================================================================
        if game.state == "TITLE_MENU":
            # Logo & Title
            draw_logo(screen, SCREEN_WIDTH // 2, 60, font_logo)
            draw_text(screen, "Pygame Edition · Minimax AI · Persistent Leaderboard", font_small, COLOR_TEXT_MUTED, SCREEN_WIDTH // 2, 98)

            # --- MODE SELECTION ---
            draw_text(screen, "1. Select Game Mode:", font_heading, COLOR_TEXT_PRIMARY, SCREEN_WIDTH // 2, 125)
            draw_button(screen, "Solo vs AI (Computer)", font_button, btn_mode_pvc, mouse_pos, active=(selected_mode == "PVC"))
            draw_button(screen, "Player vs Player (PvP)", font_button, btn_mode_pvp, mouse_pos, active=(selected_mode == "PVP"))

            # --- DIFFICULTY (Only if Solo) ---
            if selected_mode == "PVC":
                draw_text(screen, "2. AI Difficulty Level:", font_heading, COLOR_TEXT_PRIMARY, SCREEN_WIDTH // 2, 210)
                draw_button(screen, "Easy (Casual)", font_regular, btn_diff_easy, mouse_pos, active=(selected_difficulty == "Easy"))
                draw_button(screen, "Medium (Blocker)", font_regular, btn_diff_med, mouse_pos, active=(selected_difficulty == "Medium"))
                draw_button(screen, "Unbeatable (Minimax)", font_regular, btn_diff_hard, mouse_pos, active=(selected_difficulty == "Hard"), accent_color=(56, 189, 248))

            # --- PLAYER NAMES INPUT ---
            y_name_sec = 300 if selected_mode == "PVC" else 240
            draw_text(screen, "Enter Player Name(s):", font_heading, COLOR_TEXT_PRIMARY, SCREEN_WIDTH // 2, y_name_sec)

            # Player 1 Input
            p1_box_y = y_name_sec + 34
            input_rect_p1.y = p1_box_y
            draw_text_left(screen, "Player 1 (X):", font_regular, COLOR_X_SYMBOL, 150, p1_box_y + 18)
            pygame.draw.rect(screen, (15, 23, 42), input_rect_p1, border_radius=6)
            pygame.draw.rect(screen, COLOR_X_SYMBOL if active_input_box == "p1" else (51, 65, 85), input_rect_p1, width=2 if active_input_box == "p1" else 1, border_radius=6)
            cursor_p1 = "|" if (active_input_box == "p1" and cursor_timer < 30) else ""
            draw_text_left(screen, p1_name + cursor_p1, font_button, COLOR_TEXT_PRIMARY, input_rect_p1.x + 12, input_rect_p1.centery)

            # Player 2 Input (Only if PvP)
            if selected_mode == "PVP":
                p2_box_y = p1_box_y + 48
                input_rect_p2.y = p2_box_y
                draw_text_left(screen, "Player 2 (O):", font_regular, COLOR_O_SYMBOL, 150, p2_box_y + 18)
                pygame.draw.rect(screen, (15, 23, 42), input_rect_p2, border_radius=6)
                pygame.draw.rect(screen, COLOR_O_SYMBOL if active_input_box == "p2" else (51, 65, 85), input_rect_p2, width=2 if active_input_box == "p2" else 1, border_radius=6)
                cursor_p2 = "|" if (active_input_box == "p2" and cursor_timer < 30) else ""
                draw_text_left(screen, p2_name + cursor_p2, font_button, COLOR_TEXT_PRIMARY, input_rect_p2.x + 12, input_rect_p2.centery)

            # --- START & EXTRA BUTTONS ---
            btn_start_y = 420 if selected_mode == "PVC" else 435
            btn_start_game.y = btn_start_y
            draw_button(screen, "START MATCH", font_heading, btn_start_game, mouse_pos, active=True, accent_color=(16, 185, 129))

            btn_view_leaderboard.y = btn_start_y + 58
            btn_view_logs.y = btn_start_y + 58
            draw_button(screen, "Leaderboard", font_small, btn_view_leaderboard, mouse_pos)
            draw_button(screen, "Activity Logs", font_small, btn_view_logs, mouse_pos)

            # Bottom helper note
            draw_text(screen, "Click text box to edit name · Press [X] anytime to Exit · [M] to Mute", font_small, (100, 116, 139), SCREEN_WIDTH // 2, btn_start_y + 105)

        # ======================================================================
        # 2. RENDER ACTIVE PLAYING / GAME OVER VIEW
        # ======================================================================
        elif game.state in ("PLAYING", "GAME_OVER"):
            # Header status banner
            if game.state == "PLAYING":
                if game.ai_thinking:
                    # Animated dots for 1.0s thinking delay
                    dots = "." * ((current_time // 250) % 4)
                    draw_text(screen, f"AI is thinking{dots}", font_title, COLOR_ACCENT_AMBER, SCREEN_WIDTH // 2, 42)
                    draw_text(screen, f"Calculating optimal move (1.0s delay)", font_small, COLOR_TEXT_MUTED, SCREEN_WIDTH // 2, 74)
                else:
                    turn_name = game.player_x_name if game.current_turn == SYMBOL_X else game.player_o_name
                    turn_col = COLOR_X_SYMBOL if game.current_turn == SYMBOL_X else COLOR_O_SYMBOL
                    draw_text(screen, f"{turn_name}'s Turn ({game.current_turn})", font_title, turn_col, SCREEN_WIDTH // 2, 42)
                    mode_sub = f"Mode: Solo vs AI ({game.ai_difficulty})" if game.game_mode == "PVC" else "Mode: Player vs Player"
                    draw_text(screen, f"{mode_sub}  ·  Moves: {game.board.move_count}/9", font_small, COLOR_TEXT_MUTED, SCREEN_WIDTH // 2, 74)
            else:
                # GAME OVER BANNER (Explicit Win / Loss / Draw text requested by user)
                if game.board.winner:
                    win_sym = game.board.winner
                    if win_sym == SYMBOL_X:
                        draw_text(screen, f"{game.player_x_name} Wins! (Victorious)", font_title, COLOR_WIN_LINE, SCREEN_WIDTH // 2, 40)
                        draw_text(screen, f"Congratulations! {game.player_o_name} was defeated.", font_regular, COLOR_TEXT_MUTED, SCREEN_WIDTH // 2, 72)
                    else:
                        if game.game_mode == "PVC":
                            draw_text(screen, f"AI Wins! {game.player_x_name} Loses!", font_title, COLOR_O_SYMBOL, SCREEN_WIDTH // 2, 40)
                            draw_text(screen, "The Recursive Minimax algorithm scored a victory.", font_regular, COLOR_TEXT_MUTED, SCREEN_WIDTH // 2, 72)
                        else:
                            draw_text(screen, f"{game.player_o_name} Wins!", font_title, COLOR_WIN_LINE, SCREEN_WIDTH // 2, 40)
                            draw_text(screen, f"{game.player_x_name} was defeated.", font_regular, COLOR_TEXT_MUTED, SCREEN_WIDTH // 2, 72)
                else:
                    draw_text(screen, "Match Ended in a Draw!", font_title, COLOR_ACCENT_AMBER, SCREEN_WIDTH // 2, 40)
                    draw_text(screen, "Well fought tie! No empty squares remain.", font_regular, COLOR_TEXT_MUTED, SCREEN_WIDTH // 2, 72)

            # Draw Board Background Plate
            gx, gy = GRID_OFFSET
            pygame.draw.rect(screen, (20, 29, 47), (gx - 10, gy - 10, CELL_SIZE * 3 + 20, CELL_SIZE * 3 + 20), border_radius=14)

            # Draw Board Grid Lines
            for i in range(1, 3):
                # Vertical
                pygame.draw.line(screen, COLOR_GRID_LINES, (gx + i * CELL_SIZE, gy), (gx + i * CELL_SIZE, gy + CELL_SIZE * 3), 4)
                # Horizontal
                pygame.draw.line(screen, COLOR_GRID_LINES, (gx, gy + i * CELL_SIZE), (gx + CELL_SIZE * 3, gy + i * CELL_SIZE), 4)

            # Draw Cell Marks (X & O)
            for r in range(3):
                for c in range(3):
                    val = game.board.grid[r][c]
                    cx = gx + c * CELL_SIZE + CELL_SIZE // 2
                    cy = gy + r * CELL_SIZE + CELL_SIZE // 2

                    if val == SYMBOL_X:
                        draw_text(screen, "X", font_large_symbol, COLOR_X_SYMBOL, cx, cy)
                    elif val == SYMBOL_O:
                        draw_text(screen, "O", font_large_symbol, COLOR_O_SYMBOL, cx, cy)

            # Draw Animated Winning Line Strike
            if game.board.winning_line and game.is_animating_win:
                start_c = game.board.winning_line[0]
                end_c = game.board.winning_line[2]
                sx = gx + start_c[1] * CELL_SIZE + CELL_SIZE // 2
                sy = gy + start_c[0] * CELL_SIZE + CELL_SIZE // 2
                ex = gx + end_c[1] * CELL_SIZE + CELL_SIZE // 2
                ey = gy + end_c[0] * CELL_SIZE + CELL_SIZE // 2
                cur_x = sx + (ex - sx) * game.strike_progress
                cur_y = sy + (ey - sy) * game.strike_progress
                pygame.draw.line(screen, COLOR_WIN_LINE, (sx, sy), (cur_x, cur_y), 8)

            # --- BOTTOM NAVIGATION BAR (All clickable & keyboard shortcuts) ---
            draw_button(screen, "Restart [R]", font_small, btn_ingame_restart, mouse_pos)
            draw_button(screen, "Menu [ESC]", font_small, btn_ingame_menu, mouse_pos)
            mute_label = "Mute [M]: ON" if game.sound_mgr.muted else "Mute [M]: OFF"
            draw_button(screen, mute_label, font_small, btn_ingame_mute, mouse_pos)
            draw_button(screen, "Exit [X]", font_small, btn_ingame_exit, mouse_pos)

        # ======================================================================
        # 3. RENDER LEADERBOARD SCREEN
        # ======================================================================
        elif game.state == "LEADERBOARD":
            draw_text(screen, "PERSISTENT LEADERBOARD", font_title, COLOR_TEXT_PRIMARY, SCREEN_WIDTH // 2, 50)
            draw_text(screen, "Stored in 'leaderboard.txt' via Text Mode File I/O", font_small, COLOR_TEXT_MUTED, SCREEN_WIDTH // 2, 82)

            pygame.draw.rect(screen, COLOR_PANEL_BG, (100, 115, 600, 445), border_radius=12)
            header_str = f"{'Rank':<6} {'Username':<18} {'Score':<8} {'Wins':<6} {'Draws':<6} {'Losses':<6} {'Win Rate':<8}"
            draw_text(screen, header_str, font_code, COLOR_X_SYMBOL, SCREEN_WIDTH // 2, 140)
            pygame.draw.line(screen, COLOR_GRID_LINES, (120, 160), (680, 160), 2)

            top_players = game.leaderboard.get_top_players(limit=8)
            y_offset = 190
            for rank, profile in top_players:
                line_str = f"#{rank:<5} {profile.username:<18} {profile.score:<8} {profile.wins:<6} {profile.draws:<6} {profile.losses:<6} {profile.win_rate}%"
                draw_text(screen, line_str, font_code, COLOR_TEXT_PRIMARY, SCREEN_WIDTH // 2, y_offset)
                y_offset += 38

            draw_button(screen, "Return to Menu [ESC]", font_regular, pygame.Rect(310, 570, 180, 38), mouse_pos)

        # ======================================================================
        # 4. RENDER ACTIVITY LOGS SCREEN
        # ======================================================================
        elif game.state == "LOGS":
            draw_text(screen, "ACTIVITY LOG INSPECTOR", font_title, COLOR_TEXT_PRIMARY, SCREEN_WIDTH // 2, 50)
            draw_text(screen, "Read from 'player_activity_log.txt' using Python File I/O", font_small, COLOR_TEXT_MUTED, SCREEN_WIDTH // 2, 82)

            pygame.draw.rect(screen, COLOR_PANEL_BG, (60, 115, 680, 435), border_radius=12)
            logs = read_activity_logs(max_entries=11)
            y_offset = 145
            for log_entry in logs:
                display_entry = log_entry[:82]
                draw_text(screen, display_entry, font_code, COLOR_TEXT_PRIMARY, SCREEN_WIDTH // 2, y_offset)
                y_offset += 34

            draw_button(screen, "Return to Menu [ESC]", font_regular, pygame.Rect(310, 570, 180, 38), mouse_pos)

        # ======================================================================
        # 5. RENDER GLITTER PARTICLES (Glowing halos + diamond sparkles)
        # ======================================================================
        for p in game.particles:
            p.draw(screen)

        # ======================================================================
        # 6. RENDER AUTHOR FOOTER ATTRIBUTION (Bottom-Middle on ALL screens)
        # ======================================================================
        draw_footer_attribution(screen, mouse_pos, font_credit)

        pygame.display.flip()

    pygame.quit()
    print("[Shutdown] Pygame cleaned up successfully.")


if __name__ == "__main__":
    main()
