const AudioContext = window.AudioContext || window.webkitAudioContext;
const ctx = new AudioContext();

const waveformSelector = document.getElementById('waveform');

const notes = [
  { note: 'C', freq: 261.63 },
  { note: 'D', freq: 293.66 },
  { note: 'E', freq: 329.63 },
  { note: 'F', freq: 349.23 },
  { note: 'G', freq: 392.00 },
  { note: 'A', freq: 440.00 },
  { note: 'B', freq: 493.88 },
  { note: 'C', freq: 523.25 },
];

function playNote(frequency) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.frequency.value = frequency;
    osc.type = waveformSelector.value;

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 1);

}

const keyboard = document.getElementById('keyboard');

notes.forEach(({note, freq}) => {
    const key = document.createElement('button');
    key.textContent = note;
    key.addEventListener('click', () => playNote(freq));
    keyboard.appendChild(key);
});

