/**
 * Web Audio API synthesizer for ambient sounds & meditation chimes.
 * Generates natural brown noise, filtered rain, ocean waves, and singing bowl chimes.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export class AmbientSoundGenerator {
  private ctx: AudioContext | null = null;
  private sourceNode: AudioNode | null = null;
  private gainNode: GainNode | null = null;
  private isRunning = false;

  start(type: 'rain' | 'forest' | 'waves' | 'whitenoise', volume = 0.4) {
    this.stop();
    this.ctx = getAudioContext();
    this.isRunning = true;

    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.setValueAtTime(0.01, this.ctx.currentTime);
    this.gainNode.gain.linearRampToValueAtTime(volume, this.ctx.currentTime + 1.2);
    this.gainNode.connect(this.ctx.destination);

    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      if (type === 'whitenoise') {
        // Brown noise
        output[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5;
      } else {
        // Pink / Rain noise
        output[i] = white * 0.5;
      }
    }

    const whiteNoiseSource = this.ctx.createBufferSource();
    whiteNoiseSource.buffer = noiseBuffer;
    whiteNoiseSource.loop = true;

    if (type === 'rain') {
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(900, this.ctx.currentTime);

      const filter2 = this.ctx.createBiquadFilter();
      filter2.type = 'highpass';
      filter2.frequency.setValueAtTime(150, this.ctx.currentTime);

      whiteNoiseSource.connect(filter);
      filter.connect(filter2);
      filter2.connect(this.gainNode);
    } else if (type === 'forest') {
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(650, this.ctx.currentTime);
      filter.Q.setValueAtTime(1.2, this.ctx.currentTime);

      whiteNoiseSource.connect(filter);
      filter.connect(this.gainNode);
    } else if (type === 'waves') {
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(350, this.ctx.currentTime);

      // Low Frequency Oscillator for wave swell
      const lfo = this.ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.12, this.ctx.currentTime); // 8-second wave period
      const lfoGain = this.ctx.createGain();
      lfoGain.gain.setValueAtTime(250, this.ctx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      lfo.start();

      whiteNoiseSource.connect(filter);
      filter.connect(this.gainNode);
    } else {
      whiteNoiseSource.connect(this.gainNode);
    }

    whiteNoiseSource.start();
    this.sourceNode = whiteNoiseSource;
  }

  stop() {
    if (this.gainNode && this.ctx && this.isRunning) {
      try {
        this.gainNode.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.6);
        setTimeout(() => {
          if (this.sourceNode) {
            try {
              (this.sourceNode as AudioScheduledSourceNode).stop?.();
            } catch {
              // ignore
            }
            this.sourceNode.disconnect();
            this.sourceNode = null;
          }
        }, 700);
      } catch {
        // ignore
      }
    }
    this.isRunning = false;
  }

  setVolume(volume: number) {
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.linearRampToValueAtTime(volume, this.ctx.currentTime + 0.1);
    }
  }

  get active() {
    return this.isRunning;
  }
}

export function playGentleBell(type: 'inhale' | 'exhale' | 'complete' | 'click' = 'inhale') {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const now = ctx.currentTime;

    if (type === 'inhale') {
      osc.frequency.setValueAtTime(392, now); // G4
      osc.frequency.exponentialRampToValueAtTime(523.25, now + 0.8); // C5
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.15, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
    } else if (type === 'exhale') {
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.exponentialRampToValueAtTime(392, now + 0.8); // G4
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.15, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
    } else if (type === 'complete') {
      osc.frequency.setValueAtTime(440, now); // A4
      osc.frequency.setValueAtTime(554.37, now + 0.2); // C#5
      osc.frequency.setValueAtTime(659.25, now + 0.4); // E5
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.2, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 2.0);
    } else {
      osc.frequency.setValueAtTime(600, now);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    }

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 2.1);
  } catch {
    // AudioContext permission or unsupported
  }
}

/**
 * Cyberpunk neon sound effects synthesized purely in Web Audio
 */
export function playNeonSound(type: 'tap' | 'message_in' | 'message_out' | 'ring' | 'haptic' = 'tap') {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    if (type === 'tap') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(920, now);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.04);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === 'message_in') {
      // Futuristic 2-tone neon chime
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc1.type = 'sine';
      osc2.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, now); // D5
      osc1.frequency.setValueAtTime(880, now + 0.08); // A5
      osc2.frequency.setValueAtTime(1174.66, now + 0.08); // D6

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now + 0.08);
      osc1.stop(now + 0.4);
      osc2.stop(now + 0.4);
    } else if (type === 'message_out') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.1);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.13);
    } else if (type === 'ring') {
      // Classic smartphone phone ring chime pattern
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      osc1.type = 'sine';
      osc2.type = 'sine';
      osc1.frequency.setValueAtTime(853, now);
      osc2.frequency.setValueAtTime(960, now);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.setValueAtTime(0.15, now + 0.3);
      gain.gain.setValueAtTime(0.01, now + 0.35);
      gain.gain.setValueAtTime(0.15, now + 0.5);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);
      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.95);
      osc2.stop(now + 0.95);
    }
  } catch {
    // audio context guarded
  }
}

/**
 * Bubble Wrap / Pop-It Synthesizer
 * Generates realistic rubbery silicone pop with satisfying bass transient and pitch variance
 */
export function playBubblePop(pitchVariant = 0) {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // Randomize base frequency slightly around 420Hz - 680Hz
    const baseFreq = 480 + (Math.random() * 160 - 80) + pitchVariant * 40;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq * 2.2, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.5, now + 0.04);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.08);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.085);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.09);

    // Haptic feedback if available on mobile
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(15);
    }
  } catch {
    // ignore
  }
}

/**
 * Relaxing Pentatonic Kalimba / Wind Chime Note
 */
const PENTATONIC_FREQS = [
  261.63, // C4
  293.66, // D4
  329.63, // E4
  392.0,  // G4
  440.0,  // A4
  523.25, // C5
  587.33, // D5
  659.25, // E5
  783.99, // G5
  880.0,  // A5
  1046.5  // C6
];

export function playKalimbaNote(index?: number) {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const noteIndex = typeof index === 'number'
      ? Math.abs(index) % PENTATONIC_FREQS.length
      : Math.floor(Math.random() * PENTATONIC_FREQS.length);

    const freq = PENTATONIC_FREQS[noteIndex];

    const osc = ctx.createOscillator();
    const oscHarmonic = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    oscHarmonic.type = 'triangle';
    oscHarmonic.frequency.setValueAtTime(freq * 2, now);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.6);

    osc.connect(gain);
    oscHarmonic.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    oscHarmonic.start(now);
    osc.stop(now + 1.7);
    oscHarmonic.stop(now + 1.7);
  } catch {
    // ignore
  }
}

/**
 * Zen Sand Garden Rake Sound
 */
export function playSandRakeSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const bufferSize = ctx.sampleRate * 0.12;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.15;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800 + Math.random() * 300, now);
    filter.Q.setValueAtTime(1.5, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    whiteNoise.start(now);
    whiteNoise.stop(now + 0.12);
  } catch {
    // ignore
  }
}


