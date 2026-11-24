/* A tiny music box that plays traditional (public-domain) carols,
   synthesised in the browser so no audio files are needed.
   If CALENDAR.config.musicFile is set, that file is looped instead. */
(function () {
  // "Note:beats" – beats default to 1. R = rest.
  const SONGS = [
    {
      name: "Jingle Bells", bpm: 190,
      melody:
        "E5 E5 E5:2 E5 E5 E5:2 E5 G5 C5:1.5 D5:.5 E5:4 " +
        "F5 F5 F5:1.5 F5:.5 F5 E5 E5 E5:.5 E5:.5 E5 D5 D5 E5 D5:2 G5:2 " +
        "E5 E5 E5:2 E5 E5 E5:2 E5 G5 C5:1.5 D5:.5 E5:4 " +
        "F5 F5 F5:1.5 F5:.5 F5 E5 E5 E5:.5 E5:.5 G5 G5 F5 D5 C5:4 R:2",
      bass:
        "C3:4 C3:4 C3:4 C3:4 F3:4 C3:4 D3:4 G3:4 " +
        "C3:4 C3:4 C3:4 C3:4 F3:4 C3:4 G3:4 C3:4 R:2"
    },
    {
      name: "Silent Night", bpm: 96,
      melody:
        "G5:1.5 A5:.5 G5 E5:3 G5:1.5 A5:.5 G5 E5:3 " +
        "D6:2 D6 B5:3 C6:2 C6 G5:3 " +
        "A5:2 A5 C6:1.5 B5:.5 A5 G5:1.5 A5:.5 G5 E5:3 " +
        "A5:2 A5 C6:1.5 B5:.5 A5 G5:1.5 A5:.5 G5 E5:3 " +
        "D6:2 D6 F6:1.5 D6:.5 B5 C6:3 E6:3 " +
        "C6 G5 E5 G5:1.5 F5:.5 D5 C5:3 R:3",
      bass:
        "C4:3 C4:3 C4:3 C4:3 G3:3 G3:3 C4:3 C4:3 " +
        "F3:3 F3:3 C4:3 C4:3 F3:3 F3:3 C4:3 C4:3 " +
        "G3:3 G3:3 C4:3 C4:3 C4:3 G3:3 C4:3 R:3"
    },
    {
      name: "Deck the Halls", bpm: 176,
      melody:
        "G5:1.5 F5:.5 E5 D5 C5 D5 E5 C5 D5:.5 E5:.5 F5:.5 D5:.5 E5:1.5 D5:.5 C5 B4 C5:2 " +
        "G5:1.5 F5:.5 E5 D5 C5 D5 E5 C5 D5:.5 E5:.5 F5:.5 D5:.5 E5:1.5 D5:.5 C5 B4 C5:2 " +
        "D5:1.5 E5:.5 F5 D5 E5:1.5 F5:.5 G5 D5 E5:.5 F#5:.5 G5 A5:.5 B5:.5 C6 B5 A5 G5:2 " +
        "G5:1.5 F5:.5 E5 D5 C5 D5 E5 C5 A5:.5 A5:.5 A5:.5 A5:.5 G5:1.5 F5:.5 E5 D5 C5:2 R:2"
    },
    {
      name: "We Wish You a Merry Christmas", bpm: 168,
      melody:
        "D5 G5 G5:.5 A5:.5 G5:.5 F#5:.5 E5 E5 E5 " +
        "A5 A5:.5 B5:.5 A5:.5 G5:.5 F#5 D5 D5 " +
        "B5 B5:.5 C6:.5 B5:.5 A5:.5 G5 E5 D5:.5 D5:.5 E5 A5 F#5 G5:2 " +
        "D5 G5 G5 G5 F#5:2 F#5 G5 F#5 E5 D5:2 " +
        "A5 B5 A5 G5 D6 D5 D5:.5 D5:.5 E5 A5 F#5 G5:3 R:3"
    }
  ];

  const SEMI = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  function freq(note) {
    const m = /^([A-G])(#|b)?(\d)$/.exec(note);
    if (!m) return 0;
    const n = SEMI[m[1]] + (m[2] === "#" ? 1 : m[2] === "b" ? -1 : 0) + (Number(m[3]) + 1) * 12;
    return 440 * Math.pow(2, (n - 69) / 12);
  }
  function parse(str) {
    return str.trim().split(/\s+/).map(tok => {
      const [n, d] = tok.split(":");
      return { f: n === "R" ? 0 : freq(n), d: d ? parseFloat(d) : 1 };
    });
  }

  let ctx, master, timer, file;
  let playing = false;
  let songIdx = 0, tracks = [], beatLen = 0.3;

  function voice(f, t, vol, decay) {
    // sine + a couple of bright partials = music-box "plink"
    [[1, 1, decay], [2, .28, decay * .6], [5.4, .06, .15]].forEach(([mult, g, dec]) => {
      const o = ctx.createOscillator(), a = ctx.createGain();
      o.frequency.value = f * mult;
      a.gain.setValueAtTime(0, t);
      a.gain.linearRampToValueAtTime(vol * g, t + .006);
      a.gain.exponentialRampToValueAtTime(.0001, t + dec);
      o.connect(a).connect(master);
      o.start(t); o.stop(t + dec + .05);
    });
  }

  function loadSong(i, startAt) {
    const s = SONGS[i % SONGS.length];
    beatLen = 60 / s.bpm;
    tracks = [
      { notes: parse(s.melody), i: 0, t: startAt, vol: .5, decay: 1.4 },
    ];
    if (s.bass) tracks.push({ notes: parse(s.bass), i: 0, t: startAt, vol: .32, decay: 2.2 });
  }

  function schedule() {
    const horizon = ctx.currentTime + 1.5; // generous, so background tabs don't stutter
    let done = true, end = 0;
    for (const tr of tracks) {
      while (tr.i < tr.notes.length && tr.t < horizon) {
        const n = tr.notes[tr.i++];
        if (n.f) voice(n.f, tr.t, tr.vol, tr.decay);
        tr.t += n.d * beatLen;
      }
      if (tr.i < tr.notes.length) done = false;
      end = Math.max(end, tr.t);
    }
    if (done) { songIdx++; loadSong(songIdx, end + .6); }
  }

  function initSynth() {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    master = ctx.createGain();
    master.gain.value = .22;
    // soft echo for sparkle
    const delay = ctx.createDelay(), fb = ctx.createGain();
    delay.delayTime.value = .28; fb.gain.value = .25;
    master.connect(ctx.destination);
    master.connect(delay); delay.connect(fb); fb.connect(delay); fb.connect(ctx.destination);
    loadSong(songIdx, ctx.currentTime + .15);
  }

  window.Music = {
    get playing() { return playing; },
    play() {
      const src = window.CALENDAR && window.CALENDAR.config.musicFile;
      if (src) {
        if (!file) { file = new Audio(src); file.loop = true; file.volume = .5; }
        file.play().catch(() => {});
      } else {
        if (!ctx) initSynth();
        ctx.resume();
        clearInterval(timer);
        timer = setInterval(schedule, 200);
        schedule();
      }
      playing = true;
    },
    pause() {
      if (file) file.pause();
      if (ctx) { ctx.suspend(); clearInterval(timer); }
      playing = false;
    },
    toggle() { playing ? this.pause() : this.play(); return playing; },
    // little sound effects
    chime(notes) {
      if (!ctx || !playing || file) return;
      notes.forEach((n, i) => voice(freq(n), ctx.currentTime + i * .09, .45, 1.2));
    }
  };
})();
