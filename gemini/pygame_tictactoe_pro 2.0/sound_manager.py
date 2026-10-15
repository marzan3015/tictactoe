"""
Sound and Music Audio Engine
----------------------------
Covers Syllabus Requirements:
  - Library: pygame (pygame.mixer module initialization and Sound playback)
  - Exception Handling: try-catch for audio device failure, missing drivers
  - Functions, Scope, File I/O (procedural synthesis using Python 'wave' module)
  - Modularization: Encapsulated SoundManager class
"""

import math
import os
import struct
import wave
from constants import AUDIO_FREQUENCIES


class SoundManager:
    """Manages game sound effects and synthesized audio."""
    def __init__(self, sound_dir: str = "assets/sounds"):
        self.sound_dir: str = sound_dir
        self.audio_enabled: bool = False
        self.muted: bool = False
        self.sounds: dict[str, any] = {}
        
        os.makedirs(self.sound_dir, exist_ok=True)
        self._initialize_mixer()
        self._ensure_sound_files()
        self._load_sounds()

    def _initialize_mixer(self) -> None:
        """Attempts to initialize pygame.mixer with try-catch block."""
        try:
            import pygame
            pygame.mixer.pre_init(frequency=44100, size=-16, channels=2, buffer=512)
            pygame.mixer.init()
            self.audio_enabled = True
            print("[Audio] Pygame mixer successfully initialized.")
        except Exception as audio_err:
            print(f"[Audio Warning] Sound system disabled (Audio driver error: {audio_err})")
            self.audio_enabled = False

    def _generate_sine_wav(self, filename: str, frequency: float, duration_seconds: float = 0.15, volume: float = 0.5) -> None:
        """Synthesizes a clean audio WAV file using Python standard library (wave & struct)."""
        filepath = os.path.join(self.sound_dir, filename)
        if os.path.exists(filepath):
            return
            
        sample_rate = 44100
        total_samples = int(sample_rate * duration_seconds)
        
        try:
            with wave.open(filepath, "w") as wav_file:
                wav_file.setparams((1, 2, sample_rate, total_samples, "NONE", "not compressed"))
                samples_data = bytearray()
                for i in range(total_samples):
                    t = float(i) / sample_rate
                    envelope = math.exp(-3.0 * (i / total_samples))
                    val = math.sin(2.0 * math.pi * frequency * t) * envelope * volume
                    sample_int = int(max(min(val * 32767.0, 32767.0), -32768.0))
                    samples_data.extend(struct.pack("<h", sample_int))
                wav_file.writeframes(samples_data)
        except Exception as synth_err:
            print(f"[Audio Error] Failed to synthesize {filename}: {synth_err}")

    def _ensure_sound_files(self) -> None:
        self._generate_sine_wav("click.wav", AUDIO_FREQUENCIES["click"], duration_seconds=0.08, volume=0.3)
        self._generate_sine_wav("move_x.wav", AUDIO_FREQUENCIES["move_x"], duration_seconds=0.12, volume=0.45)
        self._generate_sine_wav("move_o.wav", AUDIO_FREQUENCIES["move_o"], duration_seconds=0.12, volume=0.45)
        self._generate_sine_wav("win.wav", AUDIO_FREQUENCIES["win"], duration_seconds=0.45, volume=0.55)
        self._generate_sine_wav("draw.wav", AUDIO_FREQUENCIES["draw"], duration_seconds=0.30, volume=0.4)

    def _load_sounds(self) -> None:
        if not self.audio_enabled:
            return

        try:
            import pygame
            sound_mappings = {
                "click": "click.wav",
                "move_x": "move_x.wav",
                "move_o": "move_o.wav",
                "win": "win.wav",
                "draw": "draw.wav"
            }
            for key, fname in sound_mappings.items():
                full_path = os.path.join(self.sound_dir, fname)
                if os.path.exists(full_path):
                    self.sounds[key] = pygame.mixer.Sound(full_path)
        except Exception as load_err:
            print(f"[Audio Error] Failed to load sound effects: {load_err}")

    def play_sound(self, sound_name: str) -> None:
        if not self.audio_enabled or self.muted:
            return
            
        try:
            sound_obj = self.sounds.get(sound_name)
            if sound_obj:
                sound_obj.play()
        except Exception as play_err:
            print(f"[Audio Warning] Could not play sound '{sound_name}': {play_err}")

    def toggle_mute(self) -> bool:
        self.muted = not self.muted
        return self.muted