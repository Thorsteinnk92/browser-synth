const AudioContext = window.AudioContext || window.webkitAudioContext;
const ctx = new AudioContext();

const waveformSelector = document.getElementById('waveform');
const attackKnob = document.getElementById('attack');
const decayKnob = document.getElementById('decay');
const sustainKnob = document.getElementById('sustain');
const releaseKnob = document.getElementById('release');
const keyboard = document.getElementById('keyboard');

let octave = 4;
const octaveDisplay = document.getElementById('octave-display');
const octaveUp = document.getElementById('octave-up');
const octaveDown = document.getElementById('octave-down');

const baseNotes = [
  { note: 'C',  freq: 261.63 },
  { note: 'C#', freq: 277.18 },
  { note: 'D',  freq: 293.66 },
  { note: 'D#', freq: 311.13 },
  { note: 'E',  freq: 329.63 },
  { note: 'F',  freq: 349.23 },
  { note: 'F#', freq: 369.99 },
  { note: 'G',  freq: 392.00 },
  { note: 'G#', freq: 415.30 },
  { note: 'A',  freq: 440.00 },
  { note: 'A#', freq: 466.16 },
  { note: 'B',  freq: 493.88 },
  { note: 'C',  freq: 523.25 },
];

function playNote(frequency) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.frequency.value = frequency;
  osc.type = waveformSelector.value;

  const attack = parseFloat(attackKnob.value);
  const decay = parseFloat(decayKnob.value);
  const sustain = parseFloat(sustainKnob.value);
  const release = parseFloat(releaseKnob.value);

  const now = ctx.currentTime;

  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(1, now + attack);
  gain.gain.linearRampToValueAtTime(sustain, now + attack + decay);
  gain.gain.setValueAtTime(sustain, now + attack + decay);
  gain.gain.linearRampToValueAtTime(0, now + attack + decay + release);

  osc.start(now);
  osc.stop(now + attack + decay + release);
}

function renderKeys() {
  keyboard.innerHTML = '';
  const multiplier = Math.pow(2, octave - 4);
  baseNotes.forEach(({ note, freq }) => {
    const key = document.createElement('button');
    key.textContent = note;
    key.addEventListener('click', () => playNote(freq * multiplier));
    keyboard.appendChild(key);
  });
}

octaveUp.addEventListener('click', () => {
  if (octave < 8) {
    octave++;
    octaveDisplay.textContent = octave;
    renderKeys();
  }
});

octaveDown.addEventListener('click', () => {
  if (octave > 1) {
    octave--;
    octaveDisplay.textContent = octave;
    renderKeys();
  }
});

renderKeys();