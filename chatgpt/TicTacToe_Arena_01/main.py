"""Launch Tic-Tac-Toe Arena."""

from pathlib import Path
import logging

from src.game import run_game


def main():
    project_dir = Path(__file__).resolve().parent
    try:
        run_game(project_dir)
    except SystemExit:
        raise
    except Exception:
        logging.exception("Unexpected application error")
        raise


if __name__ == "__main__":
    main()
