"""Pygame sound and music helper; missing audio files are non-fatal."""
from pathlib import Path
import pygame

class AudioManager:
    def __init__(self, project_dir):
        self.sound_enabled = True
        self.music_enabled = True
        self.sounds = {}
        self.available = False
        try:
            if not pygame.mixer.get_init():
                pygame.mixer.init()
            self.available = True
            sound_dir = Path(project_dir) / "assets" / "sounds"
            for name in ("move", "win", "lose", "draw", "hover", "click"):
                try:
                    self.sounds[name] = pygame.mixer.Sound(str(sound_dir / f"{name}.wav"))
                except (pygame.error, OSError):
                    pass
            try:
                pygame.mixer.music.load(str(sound_dir / "background.wav"))
                pygame.mixer.music.set_volume(0.22)
                pygame.mixer.music.play(-1)
            except (pygame.error, OSError):
                pass
        except pygame.error:
            self.available = False

    def play(self, name):
        if self.available and self.sound_enabled:
            sound = self.sounds.get(name)
            if sound is not None:
                try: sound.play()
                except pygame.error: pass

    def toggle(self):
        self.sound_enabled = not self.sound_enabled
        self.music_enabled = self.sound_enabled
        if self.available:
            try:
                if self.music_enabled: pygame.mixer.music.unpause()
                else: pygame.mixer.music.pause()
            except pygame.error: pass
        return self.sound_enabled

    def close(self):
        if self.available:
            try: pygame.mixer.music.stop()
            except pygame.error: pass
