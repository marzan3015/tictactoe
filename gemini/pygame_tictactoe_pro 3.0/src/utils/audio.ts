/**
 * Procedural Web Audio Sound Synthesizer
 * Generates arcade-style sound effects matching the Pygame frequencies:
 *   - Move X: 587.33 Hz (D5)
 *   - Move O: 659.25 Hz (E5)
 *   - Win: 880.0 Hz triumphant arpeggio
 *   - Draw: 330.0 Hz low chord
 *   - Click: 440.0 Hz short blip
 */

class SoundSynth {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private getContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public playMove(symbol: "X" | "O") {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;

    osc.type = symbol === "X" ? "triangle" : "sine";
    const freq = symbol === "X" ? 587.33 : 659.25;

    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.25, now + 0.12);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.12);
  }

  public playWin() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const notes = [440, 554.37, 659.25, 880]; // A major arpeggio
    notes.forEach((freq, idx) => {
      const startTime = ctx.currentTime + idx * 0.08;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.25, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.35);
    });
  }

  public playDraw() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const notes = [330, 311.13, 293.66];
    notes.forEach((freq, idx) => {
      const startTime = ctx.currentTime + idx * 0.1;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.12, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.2);
    });
  }

  public playClick() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;

    osc.type = "sine";
    osc.frequency.setValueAtTime(440, now);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  }

  private bgmInterval: number | null = null;
  public bgmActive: boolean = false;

  public startBgm() {
    if (!this.enabled || this.bgmActive) return;
    const ctx = this.getContext();
    if (!ctx) return;

    this.bgmActive = true;
    const stepDuration = 0.25; // 120 BPM 16th notes

    // Harmonic sequence matching Pygame's sound_manager.py: Am -> F -> C -> G
    const notesSequence = [
      // Am
      220.0, 261.63, 329.63, 440.0, 329.63, 261.63, 329.63, 440.0,
      // F
      174.61, 220.0, 261.63, 349.23, 261.63, 220.0, 261.63, 349.23,
      // C
      130.81, 196.0, 261.63, 329.63, 261.63, 196.0, 261.63, 329.63,
      // G
      196.0, 246.94, 293.66, 392.0, 293.66, 246.94, 293.66, 392.0
    ];

    let currentStep = 0;
    const playStep = () => {
      if (!this.bgmActive || !this.enabled) return;
      const freq = notesSequence[currentStep];
      currentStep = (currentStep + 1) % notesSequence.length;

      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const now = ctx.currentTime;

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now);

        // Soft ambient volume so it never overpowers effects
        gain.gain.setValueAtTime(0.045, now);
        gain.gain.exponentialRampToValueAtTime(0.0005, now + stepDuration * 0.92);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + stepDuration * 0.92);
      } catch (e) {
        // Fallback for suspended context
      }
    };

    playStep();
    this.bgmInterval = window.setInterval(playStep, stepDuration * 1000);
  }

  public stopBgm() {
    this.bgmActive = false;
    if (this.bgmInterval !== null) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }

  public setEnabled(val: boolean) {
    this.enabled = val;
    if (!val) {
      this.stopBgm();
    } else {
      this.startBgm();
    }
  }
}

export const soundSynth = new SoundSynth();
