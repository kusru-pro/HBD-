// Web Audio API Music Box Synthesizer
// Zero external MP3 dependencies - plays a dreamy, gentle music-box chime rendition of Happy Birthday

class MusicBoxSynthesizer {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.loopTimeout = null;
    this.scheduledNotes = [];
    this.volume = 0.35;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Frequency mapping for notes
  getFreq(note) {
    const notes = {
      'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23, 'G4': 392.00, 'A4': 440.00, 'B4': 493.88,
      'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'F5': 698.46, 'G5': 783.99, 'A5': 880.00, 'B5': 987.77,
      'C6': 1046.50, 'D6': 1174.66, 'E6': 1318.51, 'F6': 1396.91, 'G6': 1567.98
    };
    return notes[note] || 440;
  }

  // Play a single delicate bell/tine chime
  playTine(freq, time, duration = 1.2) {
    if (!this.ctx) return;

    // Master chime gain
    const chimeGain = this.ctx.createGain();
    chimeGain.gain.setValueAtTime(0, time);
    chimeGain.gain.linearRampToValueAtTime(this.volume, time + 0.008);
    chimeGain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    // Fundamental Sine (Pure tone)
    const osc1 = this.ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, time);

    // Harmonic Overtones for metallic music-box chime ring
    const osc2 = this.ctx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2.76, time); // Non-integer metallic tine overtone

    const osc2Gain = this.ctx.createGain();
    osc2Gain.gain.setValueAtTime(this.volume * 0.25, time);
    osc2Gain.gain.exponentialRampToValueAtTime(0.0001, time + (duration * 0.4));

    // High shimmer overtone
    const osc3 = this.ctx.createOscillator();
    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(freq * 5.4, time);

    const osc3Gain = this.ctx.createGain();
    osc3Gain.gain.setValueAtTime(this.volume * 0.1, time);
    osc3Gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.25);

    // Connect nodes
    osc1.connect(chimeGain);
    osc2.connect(osc2Gain);
    osc2Gain.connect(chimeGain);
    osc3.connect(osc3Gain);
    osc3Gain.connect(chimeGain);

    chimeGain.connect(this.ctx.destination);

    osc1.start(time);
    osc2.start(time);
    osc3.start(time);

    osc1.stop(time + duration);
    osc2.stop(time + duration);
    osc3.stop(time + duration);

    this.scheduledNotes.push(osc1, osc2, osc3);
  }

  // Melody arrangement: Happy Birthday with lilting music-box rhythm
  getMelody() {
    // Note, duration in beats (1 beat = 0.5s approx at 120bpm)
    return [
      // Phrase 1: Happy birthday to you
      { note: 'G4', beats: 0.75 },
      { note: 'G4', beats: 0.25 },
      { note: 'A4', beats: 1.0 },
      { note: 'G4', beats: 1.0 },
      { note: 'C5', beats: 1.0 },
      { note: 'B4', beats: 2.0 },

      // Phrase 2: Happy birthday to you
      { note: 'G4', beats: 0.75 },
      { note: 'G4', beats: 0.25 },
      { note: 'A4', beats: 1.0 },
      { note: 'G4', beats: 1.0 },
      { note: 'D5', beats: 1.0 },
      { note: 'C5', beats: 2.0 },

      // Phrase 3: Happy birthday dear [Name]
      { note: 'G4', beats: 0.75 },
      { note: 'G4', beats: 0.25 },
      { note: 'G5', beats: 1.0 },
      { note: 'E5', beats: 1.0 },
      { note: 'C5', beats: 1.0 },
      { note: 'B4', beats: 1.0 },
      { note: 'A4', beats: 1.5 },

      // Phrase 4: Happy birthday to you
      { note: 'F5', beats: 0.75 },
      { note: 'F5', beats: 0.25 },
      { note: 'E5', beats: 1.0 },
      { note: 'C5', beats: 1.0 },
      { note: 'D5', beats: 1.0 },
      { note: 'C5', beats: 2.5 }
    ];
  }

  start() {
    this.init();
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.playLoop();
  }

  playLoop() {
    if (!this.isPlaying || !this.ctx) return;

    const melody = this.getMelody();
    const beatDuration = 0.55; // Gentle dreamy tempo
    let currentTime = this.ctx.currentTime + 0.1;

    melody.forEach((item) => {
      this.playTine(this.getFreq(item.note), currentTime, item.beats * beatDuration + 0.8);
      currentTime += item.beats * beatDuration;
    });

    // Schedule next loop with a pleasant breath interval
    const totalDuration = (currentTime - this.ctx.currentTime) * 1000 + 1200;
    this.loopTimeout = setTimeout(() => {
      if (this.isPlaying) {
        this.playLoop();
      }
    }, totalDuration);
  }

  stop() {
    this.isPlaying = false;
    if (this.loopTimeout) {
      clearTimeout(this.loopTimeout);
      this.loopTimeout = null;
    }
    // Cancel scheduled notes
    this.scheduledNotes.forEach(osc => {
      try {
        osc.stop();
      } catch (e) {
        // Already stopped
      }
    });
    this.scheduledNotes = [];
  }

  toggle() {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }
}

export const musicBox = new MusicBoxSynthesizer();
