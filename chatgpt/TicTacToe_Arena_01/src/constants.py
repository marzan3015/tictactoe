"""Shared display constants and color palette."""

WIDTH = 1000
HEIGHT = 760
FPS = 60
TITLE = "Tic-Tac-Toe Arena"

BG = (15, 18, 30)
PANEL = (25, 30, 47)
PANEL_LIGHT = (35, 42, 63)
GRID = (73, 85, 111)
TEXT = (239, 243, 255)
MUTED = (157, 169, 194)
CYAN = (67, 221, 239)
ORANGE = (255, 171, 91)
GREEN = (93, 225, 160)
RED = (255, 105, 125)
PURPLE = (173, 137, 255)

BOARD_SIZE = 3
CELL_COUNT = BOARD_SIZE * BOARD_SIZE
WIN_LINES = (
    (0, 1, 2), (3, 4, 5), (6, 7, 8),
    (0, 3, 6), (1, 4, 7), (2, 5, 8),
    (0, 4, 8), (2, 4, 6),
)

DATA_DIR_NAME = "data"
ASSET_DIR_NAME = "assets"
SOUND_DIR_NAME = "sounds"
