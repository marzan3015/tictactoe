"""Text-mode file I/O for logs, match history, and leaderboard JSON."""

import json
import logging
from datetime import datetime
from pathlib import Path


class Storage:
    def __init__(self, base_dir):
        self.base_dir = Path(base_dir)
        self.data_dir = self.base_dir / "data"
        self.data_dir.mkdir(parents=True, exist_ok=True)
        self.leaderboard_path = self.data_dir / "leaderboard.json"
        self.history_path = self.data_dir / "match_history.txt"
        self.activity_path = self.data_dir / "activity.log"
        self.logger = logging.getLogger("tictactoe")
        self._configure_logger()

    def _configure_logger(self):
        if not self.logger.handlers:
            self.logger.setLevel(logging.INFO)
            try:
                handler = logging.FileHandler(self.activity_path, encoding="utf-8")
                handler.setFormatter(logging.Formatter(
                    "%(asctime)s | %(levelname)s | %(message)s"
                ))
                self.logger.addHandler(handler)
            except OSError:
                # The game should remain playable if the log file cannot be opened.
                self.logger.addHandler(logging.NullHandler())

    def log_event(self, message):
        self.logger.info("%s", message)

    def log_error(self, message):
        self.logger.error("%s", message)

    def load_leaderboard(self):
        """Read JSON in text mode; safely recover from missing/bad files."""
        if not self.leaderboard_path.exists():
            return {}
        try:
            with open(self.leaderboard_path, "r", encoding="utf-8") as file:
                data = json.load(file)
            if isinstance(data, dict):
                return data
            self.log_error("Leaderboard file did not contain a dictionary.")
        except (OSError, json.JSONDecodeError) as error:
            self.log_error(f"Could not load leaderboard: {error}")
        return {}

    def save_leaderboard(self, leaderboard):
        try:
            with open(self.leaderboard_path, "w", encoding="utf-8") as file:
                json.dump(leaderboard, file, indent=2, ensure_ascii=False)
        except OSError as error:
            self.log_error(f"Could not save leaderboard: {error}")
            return False
        return True

    def record_match(self, mode, player_x, player_o, result, moves, duration):
        """Append a readable match summary and update cumulative scores."""
        now = datetime.now().astimezone().isoformat(timespec="seconds")
        winner_name = "Draw"
        if result == "X":
            winner_name = player_x
        elif result == "O":
            winner_name = player_o

        # Text-mode append: each match remains readable in a text editor.
        try:
            with open(self.history_path, "a", encoding="utf-8") as file:
                file.write(
                    f"{now} | mode={mode} | X={player_x} | O={player_o} | "
                    f"result={result} | winner={winner_name} | "
                    f"moves={len(moves)} | duration={duration:.1f}s\n"
                )
        except OSError as error:
            self.log_error(f"Could not append match history: {error}")

        board_data = self.load_leaderboard()
        # A set is used to identify distinct display names in this match.
        distinct_names = {player_x, player_o}
        for name in distinct_names:
            if name not in board_data:
                board_data[name] = {
                    "wins": 0, "losses": 0, "draws": 0,
                    "matches": 0, "points": 0
                }
            stats = board_data[name]
            stats["matches"] = int(stats.get("matches", 0)) + 1
            if result == "draw":
                stats["draws"] = int(stats.get("draws", 0)) + 1
                stats["points"] = int(stats.get("points", 0)) + 1
            elif (result == "X" and name == player_x) or (
                result == "O" and name == player_o
            ):
                stats["wins"] = int(stats.get("wins", 0)) + 1
                stats["points"] = int(stats.get("points", 0)) + 3
            else:
                stats["losses"] = int(stats.get("losses", 0)) + 1

        self.save_leaderboard(board_data)
        self.log_event(
            f"Match saved: mode={mode}, X={player_x}, O={player_o}, "
            f"result={result}, moves={len(moves)}"
        )

    def read_history(self, limit=18):
        try:
            with open(self.history_path, "r", encoding="utf-8") as file:
                lines = file.readlines()
            return [line.rstrip("\n") for line in lines[-limit:]][::-1]
        except FileNotFoundError:
            return ["No matches have been saved yet."]
        except OSError as error:
            self.log_error(f"Could not read match history: {error}")
            return ["Could not read match history. Check activity.log."]

    def read_activity(self, limit=22):
        try:
            with open(self.activity_path, "r", encoding="utf-8") as file:
                lines = file.readlines()
            return [line.rstrip("\n") for line in lines[-limit:]][::-1]
        except FileNotFoundError:
            return ["No activity has been logged yet."]
        except OSError:
            return ["Could not read the activity log."]
