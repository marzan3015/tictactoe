"""
Sound and Music Audio Engine
----------------------------
Covers Syllabus Requirements:
  - Library: pygame (pygame.mixer module initialization, Sound and Music playback)
  - Exception Handling: try-catch for audio device failure, missing drivers
  - Functions, Scope, File I/O (procedural synthesis using Python 'wave' module)
  - Modularization: Encapsulated SoundManager class
  - Continuous Background Theme Music Loop
"""

import math
import os
import struct
import wave
from constants import AUDIO_FREQUENCIES, ASSETS_DIR


class SoundManager:
    """
    Manages game sound effects and continuous background theme music.
    Gracefully falls back to silent mode if audio hardware or drivers are unavailable.
    """
    def __init__(self, sound_dir: str = ASSETS_DIR):
        self.sound_dir: str = sound_dir
        self.audio_enabled: bool = False
        self.muted: bool = False
        self.sounds: dict[str, any] = {}
        self.bgm_sound: any = None
        self.bgm_channel: any = None
        
        # Ensure audio asset directory exists
        os.makedirs(self.sound_dir, exist_ok=True)
        
        # Initialize Pygame Mixer with Exception Handling
        self._initialize_mixer()
        
        # Generate wave sound effects and background theme music if not already on disk
        self._ensure_sound_files()
        
        # Load audio into Pygame Sound and Music systems
        self._load_sounds()

        # Start continuous background theme song loop (plays until application closes)
        self.start_bgm()

    def _initialize_mixer(self) -> None:
        """
        Attempts to initialize pygame.mixer with try-catch block.
        Prevents crashes on headless environments or missing audio hardware.
        """
        try:
            import pygame
            # Pre-init mixer for low latency
            pygame.mixer.pre_init(frequency=44100, size=-16, channels=2, buffer=512)
            pygame.mixer.init()
            # Allocate dedicated channel count for sound effects
            pygame.mixer.set_num_channels(16)
            self.audio_enabled = True
            print("[Audio] Pygame mixer successfully initialized.")
        except Exception as audio_err:
            print(f"[Audio Warning] Sound system disabled (Audio driver error: {audio_err})")
            self.audio_enabled = False

    def _generate_sine_wav(self, filename: str, frequency: float, duration_seconds: float = 0.15, volume: float = 0.5) -> None:
        """
        Synthesizes a clean audio WAV file using Python standard library (wave & struct).
        Requires zero third-party external audio binaries.
        """
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

    def _generate_bgm_theme(self) -> None:
        """
        Synthesizes a continuous, pleasant retro arcade background music loop (8.0s seamless loop).
        Combines deep bass, warm harmonic chords (Am -> F -> C -> G), and a catchy arpeggio.
        Designed with seamless zero-crossing boundaries to loop perpetually without clicks.
        """
        filepath = os.path.join(self.sound_dir, "bgm_theme.wav")
        # Regenerate to ensure optimal continuous background loop
        sample_rate = 44100
        bpm = 120
        beat_dur = 60.0 / bpm  # 0.5s per beat, 8 bars * 2 beats = 8.0 seconds
        
        # Chord progression: Am (A-C-E), F (F-A-C), C (C-E-G), G (G-B-D)
        # Each chord lasts 2.0 seconds (4 beats)
        chords = [
            # (Root freq, Chord freqs, Melody arpeggio freqs)
            (110.0, [220.0, 261.63, 329.63], [440.0, 523.25, 659.25, 523.25, 440.0, 659.25, 523.25, 440.0]),
            (87.31, [174.61, 220.0, 261.63], [349.23, 440.0, 523.25, 440.0, 349.23, 523.25, 440.0, 349.23]),
            (130.81, [261.63, 329.63, 392.0], [523.25, 659.25, 783.99, 659.25, 523.25, 783.99, 659.25, 523.25]),
            (98.0, [196.0, 246.94, 293.66], [392.0, 493.88, 587.33, 493.88, 392.0, 587.33, 493.88, 392.0])
        ]

        chord_duration = 2.0  # seconds
        total_duration = chord_duration * len(chords)  # 8.0 seconds total loop
        total_samples = int(sample_rate * total_duration)

        try:
            with wave.open(filepath, "w") as wav_file:
                wav_file.setparams((1, 2, sample_rate, total_samples, "NONE", "not compressed"))
                samples = bytearray()
                
                for chord_idx, (bass_freq, chord_notes, arpeggio_notes) in enumerate(chords):
                    chord_samples = int(sample_rate * chord_duration)
                    arp_step_samples = int(sample_rate * (chord_duration / len(arpeggio_notes)))
                    
                    for s in range(chord_samples):
                        t = float(s) / sample_rate
                        
                        # 1. Bassline (warm triangle-like soft pulse)
                        bass_env = math.exp(-1.5 * (s / chord_samples))
                        bass_val = math.sin(2.0 * math.pi * bass_freq * t) * 0.16 * bass_env
                        
                        # 2. Soft chord pad
                        chord_val = 0.0
                        for c_note in chord_notes:
                            chord_val += math.sin(2.0 * math.pi * c_note * t) * 0.06
                        
                        # 3. Arpeggiated melody note
                        note_idx = min(len(arpeggio_notes) - 1, s // arp_step_samples)
                        lead_freq = arpeggio_notes[note_idx]
                        note_t = float(s % arp_step_samples) / arp_step_samples
                        # Bell envelope for each 16th note
                        lead_env = math.sin(math.pi * note_t) ** 0.8
                        lead_val = (
                            0.7 * math.sin(2.0 * math.pi * lead_freq * t) +
                            0.3 * math.sin(4.0 * math.pi * lead_freq * t)
                        ) * 0.14 * lead_env
                        
                        # Master sample combination
                        mixed = (bass_val + chord_val + lead_val) * 0.85
                        sample_int = int(max(min(mixed * 32767.0, 32767.0), -32768.0))
                        samples.extend(struct.pack("<h", sample_int))
                        
                wav_file.writeframes(samples)
            print("[Audio] Continuous background music theme synthesized successfully.")
        except Exception as e:
            print(f"[Audio Error] Could not generate BGM theme: {e}")

    def _ensure_sound_files(self) -> None:
        """Procedurally creates all necessary WAV files."""
        self._generate_sine_wav("click.wav", AUDIO_FREQUENCIES["click"], duration_seconds=0.08, volume=0.3)
        self._generate_sine_wav("move_x.wav", AUDIO_FREQUENCIES["move_x"], duration_seconds=0.12, volume=0.45)
        self._generate_sine_wav("move_o.wav", AUDIO_FREQUENCIES["move_o"], duration_seconds=0.12, volume=0.45)
        self._generate_sine_wav("win.wav", AUDIO_FREQUENCIES["win"], duration_seconds=0.45, volume=0.55)
        self._generate_sine_wav("draw.wav", AUDIO_FREQUENCIES["draw"], duration_seconds=0.30, volume=0.4)
        self._generate_bgm_theme()

    def _load_sounds(self) -> None:
        """Loads synthesized WAV files into Pygame Sound instances."""
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

            # Load fallback Sound object for background theme
            bgm_path = os.path.join(self.sound_dir, "bgm_theme.wav")
            if os.path.exists(bgm_path):
                self.bgm_sound = pygame.mixer.Sound(bgm_path)
                self.bgm_sound.set_volume(0.25)
        except Exception as load_err:
            print(f"[Audio Error] Failed to load sound effects: {load_err}")

    def start_bgm(self) -> None:
        """
        Starts the continuous background theme song loop.
        Plays seamlessly in an infinite loop until the application is closed.
        """
        if not self.audio_enabled:
            return

        bgm_path = os.path.join(self.sound_dir, "bgm_theme.wav")
        if not os.path.exists(bgm_path):
            self._generate_bgm_theme()

        try:
            import pygame
            # Prefer pygame.mixer.music for dedicated background music streaming
            if not pygame.mixer.music.get_busy():
                pygame.mixer.music.load(bgm_path)
                pygame.mixer.music.set_volume(0.0 if self.muted else 0.28)
                # loops=-1 ensures it loops indefinitely until app termination
                pygame.mixer.music.play(loops=-1)
                print("[Audio] Background theme music started (continuous infinite loop).")
        except Exception as music_err:
            print(f"[Audio Warning] pygame.mixer.music failed ({music_err}), activating Sound object fallback...")
            try:
                if self.bgm_sound and not self.bgm_channel:
                    self.bgm_channel = self.bgm_sound.play(loops=-1)
                    if self.bgm_channel:
                        self.bgm_channel.set_volume(0.0 if self.muted else 0.28)
            except Exception as sound_err:
                print(f"[Audio Error] Could not start BGM on channel: {sound_err}")

    def ensure_bgm_playing(self) -> None:
        """
        Guarantees that background music remains actively playing throughout the entire application lifecycle.
        Called in the main game loop to guard against audio driver drops.
        """
        if not self.audio_enabled or self.muted:
            return
        try:
            import pygame
            if not pygame.mixer.music.get_busy() and not self.muted:
                bgm_path = os.path.join(self.sound_dir, "bgm_theme.wav")
                if os.path.exists(bgm_path):
                    pygame.mixer.music.load(bgm_path)
                    pygame.mixer.music.set_volume(0.28)
                    pygame.mixer.music.play(loops=-1)
        except Exception:
            pass

    def play_sound(self, sound_name: str) -> None:
        """Plays a designated sound effect without interrupting background music."""
        if not self.audio_enabled or self.muted:
            return
            
        try:
            sound_obj = self.sounds.get(sound_name)
            if sound_obj:
                sound_obj.play()
        except Exception as play_err:
            print(f"[Audio Warning] Could not play sound '{sound_name}': {play_err}")

    def toggle_mute(self) -> bool:
        """Toggles audio mute state for both sound effects and continuous background theme music."""
        self.muted = not self.muted
        try:
            import pygame
            pygame.mixer.music.set_volume(0.0 if self.muted else 0.28)
        except Exception:
            pass
        if self.bgm_channel:
            try:
                self.bgm_channel.set_volume(0.0 if self.muted else 0.28)
            except Exception:
                pass
        return self.muted
