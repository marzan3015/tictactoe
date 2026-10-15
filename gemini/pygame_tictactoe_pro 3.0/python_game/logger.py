"""
Activity Logger Module
----------------------
Covers Syllabus Requirements:
  - Files (File I/O) in Text Mode ('w', 'a', 'r' with encoding='utf-8')
  - Exception Handling (try-except-else-finally blocks, handling IOError/OSError)
  - Functions: Calls, default/keyword parameters, return values
  - Scope of Variables: Local vs Module-level / Global scope
"""

import os
from datetime import datetime
from constants import LOG_FILE_PATH

# ------------------------------------------------------------------------------
# Module-level variable to demonstrate Variable Scope & the 'global' keyword
# ------------------------------------------------------------------------------
_TOTAL_LOG_OPERATIONS: int = 0


def get_log_operations_count() -> int:
    """Demonstrates local variable returning module-level variable."""
    return _TOTAL_LOG_OPERATIONS


def log_activity(event_type: str, details: str, username: str = "Anonymous") -> bool:
    """
    Appends an activity entry to a persistent text file.
    
    Demonstrates:
      - Function parameters: Positional and default arguments
      - Variable scope: Local variables (timestamp, entry_line) and 'global' keyword
      - File I/O: Text mode appending ('a') with UTF-8 encoding
      - Exception Handling: try-except-else-finally construct
    """
    global _TOTAL_LOG_OPERATIONS  # Demonstrating scope modification of global/module var
    
    # Local scope variables
    timestamp: str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    entry_line: str = f"[{timestamp}] [{event_type.upper()}] Player: {username} | {details}\n"
    
    file_handle = None
    success: bool = False
    
    try:
        # File I/O: Opening file in text mode ('a' = append)
        file_handle = open(LOG_FILE_PATH, mode="a", encoding="utf-8")
        file_handle.write(entry_line)
        file_handle.flush()
        success = True
        _TOTAL_LOG_OPERATIONS += 1
    except (IOError, OSError) as file_error:
        # Exception Handling: Catching I/O related runtime errors
        print(f"[Logger Error] Failed to write to {LOG_FILE_PATH}: {file_error}")
        success = False
    except Exception as unexpected_error:
        print(f"[Logger Error] Unexpected error occurred: {unexpected_error}")
        success = False
    else:
        # 'else' executes only if no exception was raised in try block
        pass
    finally:
        # 'finally' executes unconditionally to ensure resources are cleaned up
        if file_handle is not None and not file_handle.closed:
            file_handle.close()
            
    return success


def read_activity_logs(max_entries: int = 50) -> list[str]:
    """
    Reads recent activity log entries from text file.
    
    Demonstrates:
      - File I/O: Reading text mode ('r')
      - Handling FileNotFoundError gracefully
      - List slicing and data transformations
    """
    logs: list[str] = []
    
    # Nested check for file existence
    if not os.path.exists(LOG_FILE_PATH):
        return ["No activity logs recorded yet. Play a game to record logs!"]
        
    try:
        with open(LOG_FILE_PATH, mode="r", encoding="utf-8") as file:
            # File I/O: readlines reads lines as list of strings
            all_lines: list[str] = file.readlines()
            # Return the last 'max_entries' in reverse-chronological order
            recent_lines: list[str] = [line.strip() for line in all_lines[-max_entries:]]
            recent_lines.reverse()
            logs = recent_lines
    except FileNotFoundError:
        logs = ["Log file was not found."]
    except (IOError, OSError) as read_error:
        logs = [f"Error reading activity log: {read_error}"]
        
    return logs


def clear_activity_logs() -> bool:
    """Clears all logged history in text mode ('w' truncates existing content)."""
    try:
        with open(LOG_FILE_PATH, mode="w", encoding="utf-8") as file:
            file.write(f"=== Activity Log Reset at {datetime.now()} ===\n")
        return True
    except (IOError, OSError) as e:
        print(f"Error resetting logs: {e}")
        return False
