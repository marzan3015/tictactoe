"""
Persistent Leaderboard & Stats Manager Module
---------------------------------------------
Covers Syllabus Requirements:
  - Python OOP: Class and Object encapsulation
  - File I/O: Text mode file operations ('r', 'w')
  - Built-in data types: Dictionary, List, Tuple, Set, String
  - Exception Handling: FileNotFoundError, ValueError, general Exception
  - Nested conditionals & nested loops
"""

import os
from datetime import datetime
from constants import LEADERBOARD_FILE_PATH, SCORE_REWARDS


class PlayerProfile:
    """Represents an individual player's statistical record."""
    def __init__(self, username: str, wins: int = 0, draws: int = 0, losses: int = 0, score: int = 0):
        self.username: str = str(username).strip()
        self.wins: int = int(wins)
        self.draws: int = int(draws)
        self.losses: int = int(losses)
        self.score: int = int(score)
        self.last_played: str = datetime.now().strftime("%Y-%m-%d %H:%M")

    @property
    def total_games(self) -> int:
        return self.wins + self.draws + self.losses

    @property
    def win_rate(self) -> float:
        if self.total_games == 0:
            return 0.0
        return round((self.wins / self.total_games) * 100, 1)

    def to_text_line(self) -> str:
        """Serializes player stats into a pipe-delimited text record."""
        return f"{self.username}|{self.wins}|{self.draws}|{self.losses}|{self.score}|{self.last_played}\n"

    def __str__(self) -> str:
        return f"{self.username}: Score {self.score} (W:{self.wins} D:{self.draws} L:{self.losses} - {self.win_rate}%)"


class LeaderboardManager:
    """
    Manages persistent high scores and leaderboard storage using text files.
    Demonstrates Python Class, Object lifecycle, Dictionaries, Sets, Tuples, and File I/O.
    """
    def __init__(self, storage_path: str = LEADERBOARD_FILE_PATH):
        self.storage_path: str = storage_path
        # Dictionary mapping username (str) -> PlayerProfile object
        self.players: dict[str, PlayerProfile] = {}
        # Set maintaining unique player usernames
        self.unique_usernames: set[str] = set()
        
        # Load existing scores upon object initialization
        self.load_from_file()

    def record_match_result(self, username: str, result: str, difficulty: str = "Medium") -> None:
        """
        Updates player statistics based on match outcome.
        Demonstrates nested conditional statements and dictionary manipulation.
        """
        clean_name: str = username.strip() or "Player 1"
        
        # Ensure player exists in dictionary
        if clean_name not in self.players:
            self.players[clean_name] = PlayerProfile(clean_name)
            self.unique_usernames.add(clean_name)
            
        profile: PlayerProfile = self.players[clean_name]
        
        # ----------------------------------------------------------------------
        # NESTED CONDITIONAL STATEMENTS
        # ----------------------------------------------------------------------
        if result == "win":
            profile.wins += 1
            # Nested conditional: reward based on game mode / AI difficulty
            if "Hard" in difficulty or "Unbeatable" in difficulty:
                profile.score += SCORE_REWARDS["win_hard_ai"]
            elif "Medium" in difficulty:
                profile.score += SCORE_REWARDS["win_medium_ai"]
            elif "Easy" in difficulty:
                profile.score += SCORE_REWARDS["win_easy_ai"]
            else:
                profile.score += SCORE_REWARDS["win_pvp"]
        elif result == "draw":
            profile.draws += 1
            profile.score += SCORE_REWARDS["draw"]
        else:  # "loss"
            profile.losses += 1
            if profile.score > 0:
                # Deduct small penalty, never drop below zero
                profile.score = max(0, profile.score - 10)
                
        profile.last_played = datetime.now().strftime("%Y-%m-%d %H:%M")
        
        # Save updated data to text file
        self.save_to_file()

    def load_from_file(self) -> bool:
        """
        Reads persistent leaderboard records from text file.
        Demonstrates Text File I/O and Exception Handling (try-catch).
        """
        if not os.path.exists(self.storage_path):
            # Seed default high scores if no file exists yet
            self._seed_default_scores()
            return True

        self.players.clear()
        self.unique_usernames.clear()

        try:
            # File I/O in Text Mode ('r')
            with open(self.storage_path, mode="r", encoding="utf-8") as file:
                lines: list[str] = file.readlines()
                
                # Nested loop over lines and record parts
                for line in lines:
                    line = line.strip()
                    if not line or line.startswith("#"):
                        continue  # Skip comments/empty lines
                        
                    parts: list[str] = line.split("|")
                    if len(parts) >= 5:
                        try:
                            name: str = parts[0]
                            w: int = int(parts[1])
                            d: int = int(parts[2])
                            l: int = int(parts[3])
                            s: int = int(parts[4])
                            
                            profile = PlayerProfile(name, w, d, l, s)
                            if len(parts) >= 6:
                                profile.last_played = parts[5]
                                
                            self.players[name] = profile
                            self.unique_usernames.add(name)
                        except ValueError as parse_err:
                            # Catch data conversion issues
                            print(f"[Leaderboard Warning] Corrupted line skipped: '{line}': {parse_err}")
                            continue
            return True
        except FileNotFoundError:
            self._seed_default_scores()
            return False
        except (IOError, OSError) as io_err:
            print(f"[Leaderboard Error] Could not read leaderboard file: {io_err}")
            return False

    def save_to_file(self) -> bool:
        """
        Saves all player records to persistent text file.
        Demonstrates Text File I/O ('w') and Exception Handling.
        """
        try:
            with open(self.storage_path, mode="w", encoding="utf-8") as file:
                file.write("# Username|Wins|Draws|Losses|Score|LastPlayed\n")
                # Loop through all player profile objects
                for profile in self.players.values():
                    file.write(profile.to_text_line())
            return True
        except (IOError, OSError) as write_error:
            print(f"[Leaderboard Error] Failed to write leaderboard: {write_error}")
            return False

    def get_top_players(self, limit: int = 10) -> list[tuple[int, PlayerProfile]]:
        """
        Returns a sorted list of Tuples (rank, PlayerProfile), sorted by score and win rate.
        Demonstrates Tuples, Lists, and lambda sorting.
        """
        # Sort profiles by score (descending), then wins (descending)
        sorted_profiles: list[PlayerProfile] = sorted(
            self.players.values(),
            key=lambda p: (p.score, p.wins, p.win_rate),
            reverse=True
        )
        
        # Construct list of Tuples: (rank, profile)
        top_list: list[tuple[int, PlayerProfile]] = []
        for index, profile in enumerate(sorted_profiles[:limit], start=1):
            top_list.append((index, profile))
            
        return top_list

    def _seed_default_scores(self) -> None:
        """Seeds initial default player benchmark records."""
        default_seed = [
            ("Grandmaster_AI", 15, 3, 0, 1545),
            ("CodeNinja", 10, 2, 2, 980),
            ("RetroGamer", 7, 4, 3, 680),
            ("Challenger_One", 4, 1, 4, 385),
            ("Novice_Player", 1, 1, 3, 115)
        ]
        for name, w, d, l, s in default_seed:
            self.players[name] = PlayerProfile(name, w, d, l, s)
            self.unique_usernames.add(name)
        self.save_to_file()
