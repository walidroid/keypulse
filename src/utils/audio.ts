import { SoundProfile } from '../types';

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.35;
  private profile: SoundProfile = 'thock';

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  public getVolume(): number {
    return this.volume;
  }

  public setProfile(profile: SoundProfile) {
    this.profile = profile;
  }

  public getProfile(): SoundProfile {
    return this.profile;
  }

  public playKey(key: string = '') {
    if (this.isMuted || this.profile === 'silent') return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const isSpace = key === ' ' || key === 'Space';

      // Pitch variation based on character code to feel organic like individual keycaps
      const charCode = key.length > 0 ? key.charCodeAt(0) : 65;
      const pitchMod = 1 + ((charCode % 11) - 5) * 0.035;

      switch (this.profile) {
        case 'thock':
          this.playThock(now, isSpace, pitchMod);
          break;
        case 'clicky':
          this.playClicky(now, isSpace, pitchMod);
          break;
        case 'creamy':
          this.playCreamy(now, isSpace, pitchMod);
          break;
        default:
          this.playThock(now, isSpace, pitchMod);
      }
    } catch {
      // Audio playback fails silently in edge environments
    }
  }

  private playThock(now: number, isSpace: boolean, pitchMod: number) {
    if (!this.ctx) return;

    // Resonant low-frequency body
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(isSpace ? 480 : 650, now);
    filter.Q.setValueAtTime(3.5, now);

    osc.type = 'triangle';
    const baseFreq = (isSpace ? 110 : 160) * pitchMod;
    osc.frequency.setValueAtTime(baseFreq * 1.8, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.7, now + 0.045);

    const masterGain = this.volume * 0.55;
    gain.gain.setValueAtTime(masterGain, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + (isSpace ? 0.07 : 0.05));

    // Transient tick noise
    const bufferSize = this.ctx.sampleRate * 0.015;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(masterGain * 0.8, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.015);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.06);
    noise.start(now);
    noise.stop(now + 0.02);
  }

  private playClicky(now: number, isSpace: boolean, pitchMod: number) {
    if (!this.ctx) return;

    // High snap click (Blue switch mechanical snap)
    const masterGain = this.volume * 0.5;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    const freq = (isSpace ? 1200 : 1850) * pitchMod;
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.02);

    gain.gain.setValueAtTime(masterGain * 0.7, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

    // Second bottom-out tick
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(isSpace ? 200 : 280, now + 0.008);
    osc2.frequency.exponentialRampToValueAtTime(80, now + 0.035);

    gain2.gain.setValueAtTime(masterGain * 0.6, now + 0.008);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc2.connect(gain2);
    gain2.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.03);
    osc2.start(now + 0.008);
    osc2.stop(now + 0.045);
  }

  private playCreamy(now: number, isSpace: boolean, pitchMod: number) {
    if (!this.ctx) return;

    // Smooth lubed sound, soft pop
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, now);

    osc.type = 'sine';
    const baseFreq = (isSpace ? 140 : 220) * pitchMod;
    osc.frequency.setValueAtTime(baseFreq * 1.5, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.8, now + 0.035);

    const masterGain = this.volume * 0.5;
    gain.gain.setValueAtTime(masterGain, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.045);
  }

  public playError() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(70, now + 0.07);

      const vol = this.volume * 0.45;
      gain.gain.setValueAtTime(vol, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch {
      // Audio playback fails silently in edge environments
    }
  }

  public playWordComplete() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.06); // A5

      const vol = this.volume * 0.25;
      gain.gain.setValueAtTime(vol, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch {
      // Audio playback fails silently in edge environments
    }
  }

  public playRoundVictory() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const noteTime = now + idx * 0.08;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, noteTime);

        const vol = this.volume * 0.35;
        gain.gain.setValueAtTime(vol, noteTime);
        gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.28);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(noteTime);
        osc.stop(noteTime + 0.3);
      });
    } catch {
      // Audio playback fails silently in edge environments
    }
  }
}

export const sound = new SoundEngine();
