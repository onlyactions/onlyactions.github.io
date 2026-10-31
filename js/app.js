/* ==========================================================================
   TOON TABLE OF CONTENTS — js/app.js
   --------------------------------------------------------------------------
   The living engine: arena -> spell activation -> a full-screen grimoire
   with real 3D page turns, holo cards, tabs, gallery, synth sound, routing.
   Vanilla JS. No dependencies. Reduced-motion aware.
   ========================================================================== */
(function () {
  'use strict';

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var FLATMQ  = window.matchMedia('(max-width: 1023px)');
  var BOOK = window.BOOK;

  /* =====================================================  RAINBOW PALETTE */
  var RAINBOW = ['#ff3d68', '#ff8a2a', '#ffd23d', '#3dff6e', '#2ad8ff', '#6a5bff', '#c44dff'];

  function rainbowize(text, offset) {
    var out = '';
    for (var i = 0; i < text.length; i++) {
      var ch = text[i];
      if (ch === ' ') { out += '<span class="rb-sp"> </span>'; continue; }
      var c = RAINBOW[(i + (offset || 0)) % RAINBOW.length];
      var rot = ((i % 3) - 1) * 3;
      out += '<span class="rb-l" style="color:' + c + ';transform:rotate(' + rot + 'deg)">' + ch + '</span>';
    }
    return out;
  }

  /* ==============================================================  ARTWORK */
  var ART = {
    book:
      '<svg viewBox="0 0 300 220" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="The Toon Table of Contents book">' +
      '<defs>' +
        '<radialGradient id="ttcVoid" cx="50%" cy="42%" r="75%">' +
          '<stop offset="0%" stop-color="#7a2fd0"/><stop offset="55%" stop-color="#4a1670"/><stop offset="100%" stop-color="#1c0630"/>' +
        '</radialGradient>' +
        '<linearGradient id="ttcCover" x1="0" y1="0" x2="1" y2="1">' +
          '<stop offset="0%" stop-color="#2fae66"/><stop offset="100%" stop-color="#0c6b3c"/>' +
        '</linearGradient>' +
      '</defs>' +
      '<rect width="300" height="220" fill="url(#ttcVoid)"/>' +
      '<circle cx="52" cy="34" r="17" fill="#b778ff" opacity=".45"/>' +
      '<circle cx="256" cy="150" r="23" fill="#ff8ae0" opacity=".35"/>' +
      '<circle cx="222" cy="30" r="10" fill="#8ad7ff" opacity=".5"/>' +
      /* rainbow */
      '<g fill="none" stroke-linecap="round">' +
        '<path d="M18 150 A 132 132 0 0 1 282 150" stroke="#ff3d68" stroke-width="9"/>' +
        '<path d="M26 150 A 124 124 0 0 1 274 150" stroke="#ff8a2a" stroke-width="9"/>' +
        '<path d="M34 150 A 116 116 0 0 1 266 150" stroke="#ffd23d" stroke-width="9"/>' +
        '<path d="M42 150 A 108 108 0 0 1 258 150" stroke="#3dff6e" stroke-width="9"/>' +
        '<path d="M50 150 A 100 100 0 0 1 250 150" stroke="#2ad8ff" stroke-width="9"/>' +
        '<path d="M58 150 A 92 92 0 0 1 242 150" stroke="#c44dff" stroke-width="9"/>' +
      '</g>' +
      /* stars */
      '<g stroke="#1c1030" stroke-width="2" stroke-linejoin="round">' +
        '<path d="M96 52 l6 12 13 2 -9 9 2 13 -12 -6 -12 6 2 -13 -9 -9 13 -2 z" fill="#ffe94d"/>' +
        '<path d="M196 20 l4.6 9.4 10.4 1.6 -7.5 7.2 1.8 10.4 -9.3 -4.9 -9.3 4.9 1.8 -10.4 -7.5 -7.2 10.4 -1.6 z" fill="#8dff4d"/>' +
        '<path d="M236 74 l3.8 7.8 8.6 1.3 -6.2 6 1.5 8.6 -7.7 -4 -7.7 4 1.5 -8.6 -6.2 -6 8.6 -1.3 z" fill="#ffb64d"/>' +
      '</g>' +
      /* the book */
      '<g transform="rotate(-7 150 165)">' +
        '<rect x="62" y="98" width="180" height="98" rx="12" fill="url(#ttcCover)" stroke="#062d18" stroke-width="4"/>' +
        '<rect x="74" y="90" width="160" height="88" rx="6" fill="#f6ecd4" stroke="#1c1030" stroke-width="4"/>' +
        '<path d="M74 90 Q154 74 234 90 L234 178 Q154 162 74 178 Z" fill="#fbf3de" stroke="#1c1030" stroke-width="4"/>' +
        '<path d="M154 82 L154 170" stroke="#d9c99b" stroke-width="3"/>' +
        '<g fill="#1f9e5f" font-family="' + "'Comic Sans MS','Segoe Print',sans-serif" + '" font-weight="bold">' +
          '<text x="84"  y="114" font-size="12.5">TOON ..7</text>' +
          '<text x="84"  y="132" font-size="12.5">ANIME ..87</text>' +
          '<text x="84"  y="150" font-size="12.5">BONDS..215</text>' +
          '<text x="162" y="114" font-size="12.5" fill="#7bd84d">DRAGON..372</text>' +
          '<text x="162" y="132" font-size="12.5" fill="#7bd84d">GIANT..418</text>' +
          '<text x="162" y="150" font-size="12.5" fill="#7bd84d">RAT....492</text>' +
        '</g>' +
      '</g>' +
      /* INDEX letters */
      '<g font-family="' + "'Bangers','Comic Sans MS',sans-serif" + '" stroke="#1c1030" stroke-width="2.5" paint-order="stroke">' +
        '<text x="66"  y="72" font-size="46" fill="#ff3d68" transform="rotate(-14 66 72)">I</text>' +
        '<text x="100" y="60" font-size="46" fill="#ff8a2a" transform="rotate(-8 100 60)">N</text>' +
        '<text x="140" y="54" font-size="46" fill="#ffd23d" transform="rotate(-2 140 54)">D</text>' +
        '<text x="180" y="56" font-size="46" fill="#3dff6e" transform="rotate(5 180 56)">E</text>' +
        '<text x="216" y="66" font-size="46" fill="#2ad8ff" transform="rotate(12 216 66)">X</text>' +
      '</g>' +
      '</svg>',

    sigil: function (name, code) {
      return '<div class="sigil"><div class="sigil__card"><span class="sigil__q">?</span>' +
             '<span class="sigil__ring"></span></div>' +
             '<div class="sigil__name">' + name + '</div>' +
             '<div class="sigil__code">&#8230;' + code + '</div></div>';
    }
  };

  /* =================================================================  SOUND */
  var Sound = (function () {
    var ctx = null, master = null, noise = null;
    var muted = false;
    try { muted = localStorage.getItem('ttoc-muted') === '1'; } catch (e) {}

    function ensure() {
      if (muted) return null;
      if (!ctx) {
        var AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return null;
        ctx = new AC();
        master = ctx.createGain();
        master.gain.value = 0.4;
        master.connect(ctx.destination);
        var len = ctx.sampleRate;
        noise = ctx.createBuffer(1, len, ctx.sampleRate);
        var d = noise.getChannelData(0);
        for (var i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
      }
      if (ctx.state === 'suspended') ctx.resume();
      return ctx;
    }
    function sweep(f0, f1, dur, type, vol) {
      var c = ensure(); if (!c) return;
      var o = c.createOscillator(), g = c.createGain(), t = c.currentTime;
      o.type = type || 'sawtooth';
      o.frequency.setValueAtTime(f0, t);
      o.frequency.exponentialRampToValueAtTime(f1, t + dur);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(vol || 0.18, t + dur * 0.2);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g); g.connect(master);
      o.start(t); o.stop(t + dur + 0.02);
    }
    function chord(freqs, dur, vol, type) {
      var c = ensure(); if (!c) return;
      var t = c.currentTime;
      freqs.forEach(function (f, i) {
        var o = c.createOscillator(), g = c.createGain();
        o.type = type || 'triangle'; o.frequency.value = f;
        var t0 = t + i * 0.06;
        g.gain.setValueAtTime(0.0001, t0);
        g.gain.exponentialRampToValueAtTime(vol || 0.12, t0 + 0.03);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
        o.connect(g); g.connect(master);
        o.start(t0); o.stop(t0 + dur + 0.02);
      });
    }
    function swish(dur, f, vol) {
      var c = ensure(); if (!c) return;
      var src = c.createBufferSource(); src.buffer = noise;
      var bp = c.createBiquadFilter(); bp.type = 'bandpass';
      bp.frequency.value = f; bp.Q.value = 0.7;
      var g = c.createGain(), t = c.currentTime;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(vol || 0.35, t + 0.04);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      src.connect(bp); bp.connect(g); g.connect(master);
      src.start(t); src.stop(t + dur + 0.02);
    }
    return {
      activate: function () { if (muted) return; sweep(90, 720, 0.55, 'sawtooth', 0.16); chord([523, 659, 784, 1046], 0.9, 0.1); swish(0.5, 2400, 0.2); },
      open    : function () { if (muted) return; swish(0.4, 900, 0.4); chord([392, 523, 659], 0.5, 0.08); },
      flip    : function () { if (muted) return; swish(0.22, 700 + Math.random() * 500, 0.32); },
      summon  : function () { if (muted) return; chord([262, 330, 392], 0.35, 0.14, 'square'); swish(0.3, 1800, 0.18); },
      ping    : function () { if (muted) return; chord([1318], 0.12, 0.08, 'sine'); },
      deny    : function () { if (muted) return; sweep(180, 70, 0.22, 'square', 0.12); },
      toggle  : function () {
        muted = !muted;
        try { localStorage.setItem('ttoc-muted', muted ? '1' : '0'); } catch (e) {}
        if (!muted) { ensure(); chord([659, 880], 0.2, 0.1); }
        return muted;
      },
      muted: function () { return muted; }
    };
  })();

  /* ===========================================================  TEMPLATES */
  function el(html) {
    var t = document.createElement('template');
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  function runHead(chapterName) {
    return '<div class="page__run"><span>TOON TABLE OF CONTENTS</span>' +
           (chapterName ? '<span>' + esc(chapterName) + '</span>' : '<span>ONLYACTIONS</span>') + '</div>';
  }
  function folio(n) { return '<div class="page__folio">&#183; ' + String(n).padStart(3, '0') + ' &#183;</div>'; }

  var T = {

    cover: function () {
      return el(
        '<div class="page page--cover"><div class="cover">' +
          '<div class="cover__frame">' +
            '<div class="cover__seal">&#10022;</div>' +
            '<div class="cover__brand">' + esc(BOOK.brand) + '</div>' +
            '<h2 class="cover__title">TOON<br>TABLE OF<br>CONTENTS</h2>' +
            '<div class="cover__rule"></div>' +
            '<div class="cover__vol">' + esc(BOOK.volume) + '</div>' +
            '<div class="cover__hint">click to open the grimoire</div>' +
          '</div>' +
        '</div></div>');
    },

    inside: function () {
      return el(
        '<div class="page page--inside"><div class="inside">' +
          '<div class="inside__brand">' + esc(BOOK.brand) + ' PRESENTS</div>' +
          '<h2 class="inside__title">' + rainbowize('TOON TABLE') + '<br>' + rainbowize('OF CONTENTS', 3) + '</h2>' +
          '<p class="inside__sub">' + esc(BOOK.tagline) + '</p>' +
          '<div class="inside__seal"><span>&#10022; ' + esc(BOOK.edition) + ' &#10022;</span></div>' +
          '<p class="inside__hint">the index awaits on the right page &#8594;</p>' +
        '</div></div>');
    },

    index: function (spreadOf) {
      var chs = BOOK.chapters;
      var rows = '';
      chs.forEach(function (ch, i) {
        rows += '<li><button class="idx idx--live" data-action="jump" data-spread="' + spreadOf.chapter(i) + '">' +
          '<span class="idx__num">' + ch.num + '.</span>' +
          '<span class="idx__name" style="color:' + RAINBOW[(i * 2 + 1) % RAINBOW.length] + '">' + esc(ch.name) + '</span>' +
          '<span class="idx__dots"></span><span class="idx__page">&#8230;' + (spreadOf.chapter(i)) + '</span>' +
          '</button></li>';
      });
      rows += '<li><button class="idx idx--live" data-action="jump" data-spread="' + spreadOf.rules + '">' +
        '<span class="idx__num">III.</span><span class="idx__name" style="color:' + RAINBOW[5] + '">HOUSE RULES</span>' +
        '<span class="idx__dots"></span><span class="idx__page">&#8230;' + spreadOf.rules + '</span></button></li>';
      rows += '<li><button class="idx idx--live" data-action="jump" data-spread="' + spreadOf.workshop + '">' +
        '<span class="idx__num">IV.</span><span class="idx__name" style="color:' + RAINBOW[4] + '">THE WORKSHOP</span>' +
        '<span class="idx__dots"></span><span class="idx__page">&#8230;' + spreadOf.workshop + '</span></button></li>';

      var ghosts = '';
      (chs[chs.length - 1].sigils || []).forEach(function (g) {
        ghosts += '<li><button class="idx idx--ghost" data-action="ghost" title="This sigil is not summoned yet.">' +
          '<span class="idx__name">' + esc(g.name) + '</span>' +
          '<span class="idx__dots"></span><span class="idx__page">&#8230;' + esc(g.code) + '</span></button></li>';
      });

      return el(
        '<div class="page page--index"><div class="page__scroll">' +
          runHead('THE INDEX') +
          '<h3 class="index__title" aria-label="Index">' + rainbowize('INDEX') + '</h3>' +
          '<ol class="index__list">' + rows + '</ol>' +
          '<div class="index__ghosts"><div class="index__ghosts-head">reserved sigils &#8212; un-summoned</div>' +
          '<ol class="index__list index__list--ghost">' + ghosts + '</ol></div>' +
          '<p class="index__note">Entries marked with page numbers are real. Ghost sigils are read straight from the original card artwork and wait for their chapter.</p>' +
          folio(2) +
        '</div></div>');
    },

    card: function (ch) {
      var art = ch.art === 'sigils'
        ? '<div class="sigils">' + ch.sigils.map(function (s) { return ART.sigil(s.name, s.code); }).join('') + '</div>'
        : '<div class="mcard__art-in" data-art="book"></div>';
      return el(
        '<div class="page page--card"><div class="page__scroll cardstage">' +
          '<div class="mcard ' + (ch.status === 'sealed' ? 'mcard--sealed' : '') + '" data-tilt>' +
            '<div class="mcard__inner">' +
              '<div class="mcard__namebar"><h3 class="mcard__name">' + esc(ch.name) + '</h3>' +
                '<span class="mcard__attr">&#10022;</span></div>' +
              '<div class="mcard__art">' + art + '</div>' +
              '<div class="mcard__type">&#10022; ' + esc(ch.type) + '</div>' +
              '<p class="mcard__lore">' + esc(ch.lore) + '</p>' +
              '<div class="mcard__stats"><span>ATK <b>' + esc(ch.atk) + '</b></span><span>DEF <b>' + esc(ch.def) + '</b></span></div>' +
            '</div>' +
            '<span class="mcard__holo"></span>' +
          '</div>' +
          '<p class="cardstage__cap">' + esc(ch.cap) + (ch.status === 'sealed' ? ' &#8212; <b>status: un-summoned</b>' : '') + '</p>' +
        '</div></div>');
    },

    manual: function (ch) {
      var m = ch.manual;
      var steps = (m.summon || []).map(function (s, i) {
        return '<li><span class="step__n">' + (i + 1) + '</span><div><b>' + esc(s.t) + '</b><p>' + esc(s.d) + '</p></div></li>';
      }).join('');
      var fx = (m.effects || []).map(function (f) { return '<li>' + esc(f) + '</li>'; }).join('');
      var keys = (m.keys || []).map(function (k) {
        return '<span class="key"><kbd>' + esc(k[0]) + '</kbd>' + esc(k[1]) + '</span>';
      }).join('');
      var intro = m.intro ? '<p class="manual__intro">' + esc(m.intro) + '</p>' : '';
      return el(
        '<div class="page page--manual"><div class="page__scroll">' +
          runHead('MANUAL \u2014 CHAPTER ' + ch.num) +
          '<header class="manual__head"><span class="manual__kicker">CHAPTER ' + esc(ch.num) + ' &#183; MANUAL</span>' +
          '<h3>' + esc(m.title) + '</h3></header>' +
          intro +
          '<section class="manual__sec"><h4>SUMMONING</h4><ol class="steps">' + steps + '</ol></section>' +
          '<section class="manual__sec"><h4>ATTACK EFFECTS</h4><ul class="fxlist">' + fx + '</ul></section>' +
          (keys ? '<section class="manual__sec"><h4>FIELD COMMANDS</h4><div class="keys">' + keys + '</div></section>' : '') +
          '<div class="manual__tip"><b>COMBO TIP</b><span>' + esc(m.tip) + '</span></div>' +
          (ch.link ? '<a class="btn-gold" href="' + esc(ch.link.url) + '" target="_blank" rel="noopener noreferrer">' + esc(ch.link.label) + ' &#8599;</a>' : '') +
        '</div></div>');
    },

    rules: function (spread) {
      return el(
        '<div class="page page--rules"><div class="page__scroll">' +
          runHead('HOUSE RULES') +
          '<header class="manual__head"><span class="manual__kicker">THE GENERAL MANUAL</span><h3>House Rules of the Toon Kingdom</h3></header>' +
          '<ol class="laws">' +
            '<li><span class="law__n">1</span><div><b>One tool, one job, done loud.</b><p>Small utilities that hit hard. If it needs a wiki, it gets split.</p></div></li>' +
            '<li><span class="law__n">2</span><div><b>Every tool ships with a chapter.</b><p>No manual, no summon. A project without its page here is not considered released.</p></div></li>' +
            '<li><span class="law__n">3</span><div><b>Copy-paste must work.</b><p>Every command printed in this book is real, or it does not get printed.</p></div></li>' +
            '<li><span class="law__n">4</span><div><b>Bugs are reported as duels.</b><p>Open an issue, state the board state, expect a fast counterattack.</p></div></li>' +
            '<li><span class="law__n">5</span><div><b>The toons are watching.</b><p>If it is not both fun and powerful, it does not ship.</p></div></li>' +
          '</ol>' +
          '<section class="manual__sec"><h4>RULINGS</h4><div class="rulings">' +
            '<div class="ruling"><b>Where are the real projects?</b><p>The first sigils are being forged right now. This edition proves the ritual &#8212; the next tool fills the next card.</p></div>' +
            '<div class="ruling"><b>Can I link someone to a page?</b><p>Yes. The address bar follows your reading; every spread has its own URL and lands mid-book.</p></div>' +
          '</div></section>' +
          folio(2 * spread - 1) +
        '</div></div>');
    },

    workshop: function (spread) {
      var code =
        '// js/content.js — tuck a block under "chapters"\n' +
        '{\n' +
        '  id: "my-tool",  num: "III",  tab: "MY TOOL",\n' +
        '  name: "MY TOOL", type: "TOON / CLI · EFFECT",\n' +
        '  atk: "1800",  def: "1200",\n' +
        '  lore: "One breath of what it does.",\n' +
        '  status: "live",\n' +
        '  manual: { title: "How to Wield It",\n' +
        '    summon: [ { t: "SUMMON IT", d: "npm i my-tool" } ],\n' +
        '    effects: [ "What it hits with." ],\n' +
        '    keys: [],  tip: "A combo worth knowing." },\n' +
        '  link: { label: "open the repo", url: "https://github.com/..." }\n' +
        '}';
      return el(
        '<div class="page page--workshop"><div class="page__scroll">' +
          runHead('THE WORKSHOP') +
          '<header class="manual__head"><span class="manual__kicker">FORGE A CHAPTER</span><h3>Summon Your Own Project</h3></header>' +
          '<ol class="steps">' +
            '<li><span class="step__n">1</span><div><b>Fork the grimoire</b><p>github.com/onlyactions/onlyactions.github.io &#8212; the whole site is static files.</p></div></li>' +
            '<li><span class="step__n">2</span><div><b>Open js/content.js</b><p>One chapter = one plain block. No framework, no build step, no&#160;mercy for complexity.</p></div></li>' +
            '<li><span class="step__n">3</span><div><b>Push to main</b><p>GitHub Pages re-binds the book. A new card materializes in the INDEX all by itself.</p></div></li>' +
          '</ol>' +
          '<pre class="scroll-code">' + esc(code) + '</pre>' +
          '<a class="btn-gold" href="' + esc(BOOK.repo) + '" target="_blank" rel="noopener noreferrer">open the workshop on github &#8599;</a>' +
          folio(2 * spread) +
        '</div></div>');
    },

    colophon: function (spread) {
      return el(
        '<div class="page page--colophon"><div class="page__scroll">' +
          runHead('COLOPHON') +
          '<div class="colophon">' +
            '<div class="colophon__seal">&#10022;</div>' +
            '<h3>TOON TABLE OF CONTENTS</h3>' +
            '<p class="colophon__ed">' + esc(BOOK.edition) + ' &#183; ' + esc(BOOK.volume) + '</p>' +
            '<p>Forged for <b>' + esc(BOOK.owner) + '</b>. Pure HTML, CSS and JavaScript &#8212; no frameworks, no build step. Dueling sounds synthesized on the fly with WebAudio. Book physics performed live by your GPU.</p>' +
            '<p class="colophon__watch">' + esc(BOOK.press).toUpperCase() + '</p>' +
            '<a class="btn-gold btn-gold--ghost" href="' + esc(BOOK.repo) + '" target="_blank" rel="noopener noreferrer">github.com/' + esc(BOOK.owner) + ' &#8599;</a>' +
          '</div>' +
          folio(2 * spread - 1) +
        '</div></div>');
    },

    back: function () {
      return el(
        '<div class="page page--back"><div class="backcover">' +
          '<div class="backcover__seal">&#10022;</div>' +
          '<div class="backcover__brand">' + esc(BOOK.brand) + '</div>' +
        '</div></div>');
    },

    blank: function () { return el('<div class="page page--blank"></div>'); }
  };

  /* ==========================================================  PAGE TREES */
  var N = BOOK.chapters.length;
  var SPREADS = {                       // spread numbers for fixed pages
    rules: N + 2,
    workshop: N + 2,
    colophon: N + 3,
    chapter: function (i) { return i + 2; }
  };
  var MAX_SPREAD = N + 3;

  var SPREAD_META = [{ label: 'THE COVER' }, { label: 'INSIDE COVER &#183; THE INDEX' }];
  BOOK.chapters.forEach(function (ch) {
    SPREAD_META.push({ label: 'CH. ' + esc(ch.num) + ' &#8212; ' + esc(ch.name) });
  });
  SPREAD_META.push({ label: 'HOUSE RULES &#183; THE WORKSHOP' });
  SPREAD_META.push({ label: 'COLOPHON &#183; BACK COVER' });

  var TABS = [{ label: 'INDEX', spread: 1 }];
  BOOK.chapters.forEach(function (ch) {
    TABS.push({ label: ch.tab || ch.name, spread: SPREADS.chapter(BOOK.chapters.indexOf(ch)) });
  });
  TABS.push({ label: 'RULES', spread: SPREADS.rules });
  TABS.push({ label: 'WORKSHOP', spread: SPREADS.workshop });
  TABS.push({ label: 'THE END', spread: SPREADS.colophon });

  /* Build the 3D leaves and the flat deck from the same templates. */
  function buildLeaves() {
    var seq = [];                       // [frontNode, backNode] pairs
    seq.push([T.cover(), T.inside()]);
    seq.push([T.index(SPREADS), T.card(BOOK.chapters[0])]);
    for (var i = 0; i < N; i++) {
      var back = (i < N - 1) ? T.card(BOOK.chapters[i + 1]) : T.rules(SPREADS.rules);
      seq.push([T.manual(BOOK.chapters[i]), back]);
    }
    seq.push([T.workshop(SPREADS.workshop), T.colophon(SPREADS.colophon)]);
    seq.push([T.back(), T.blank()]);

    var book = $('#book');
    book.appendChild(el('<div class="board board--left"></div>'));
    seq.forEach(function (pair, i) {
      var leaf = el('<div class="leaf" data-leaf="' + i + '">' +
        '<div class="leaf__face leaf__face--front"></div>' +
        '<div class="leaf__face leaf__face--back"></div></div>');
      $('.leaf__face--front', leaf).appendChild(pair[0]);
      $('.leaf__face--back', leaf).appendChild(pair[1]);
      book.appendChild(leaf);
    });
    book.appendChild(el('<div class="board board--right"></div>'));
    book.appendChild(el('<div class="corner corner--br" data-action="flip" data-dir="next" title="Turn page"></div>'));
    book.appendChild(el('<div class="corner corner--bl" data-action="flip" data-dir="prev" title="Turn back"></div>'));
  }

  function buildFlat() {
    var order = [];
    order.push(function () { return T.cover(); });
    order.push(function () { return T.inside(); });
    order.push(function () { return T.index(SPREADS); });
    BOOK.chapters.forEach(function (ch) {
      order.push(function () { return T.card(ch); });
      order.push(function () { return T.manual(ch); });
    });
    order.push(function () { return T.rules(SPREADS.rules); });
    order.push(function () { return T.workshop(SPREADS.workshop); });
    order.push(function () { return T.colophon(SPREADS.colophon); });
    order.push(function () { return T.back(); });

    var flat = $('#flat');
    order.forEach(function (fn, i) {
      var holder = el('<div class="flatpage" data-page="' + i + '"><div class="flatpage__in"></div></div>');
      $('.flatpage__in', holder).appendChild(fn());
      flat.appendChild(holder);
    });
    flat.appendChild(el('<button class="fnav fnav--prev" data-action="flip" data-dir="prev" aria-label="Previous page">&#8592;</button>'));
    flat.appendChild(el('<button class="fnav fnav--next" data-action="flip" data-dir="next" aria-label="Next page">&#8594;</button>'));
    flat.appendChild(el('<div class="flatlabel" id="flatLabel"></div>'));
  }

  /* ==========================================================  BOOK ENGINE */
  var spread = 0;            // 0 = closed cover
  var flatIndex = 0;
  var busy = false;

  function isFlat() { return FLATMQ.matches; }

  function syncVisual() {
    if (isFlat()) {
      document.body.classList.add('is-flat');
      $$('#flat .flatpage').forEach(function (p) {
        p.classList.toggle('is-current', Number(p.dataset.page) === flatIndex);
      });
      var lbl = $('#flatLabel');
      if (lbl) {
        var meta = SPREAD_META[Math.min(SPREAD_META.length - 1, Math.ceil(flatIndex / 2))];
        lbl.innerHTML = 'PAGE ' + (flatIndex + 1) + ' / ' + (MAX_SPREAD * 2 + 1) + ' &#8212; ' + meta.label;
      }
      syncTabs(Math.ceil(flatIndex / 2));
    } else {
      document.body.classList.remove('is-flat');
      document.body.classList.toggle('book-closed', spread === 0);
      $$('#book .leaf').forEach(function (leaf, i) {
        var flipped = i < spread;
        leaf.classList.toggle('is-flipped', flipped);
        leaf.style.zIndex = flipped ? (10 + i) : (100 - i);
      });
      var foot = $('#spreadLabel');
      if (foot) foot.innerHTML = 'SPREAD ' + spread + ' / ' + MAX_SPREAD + ' &#8212; ' + SPREAD_META[spread].label;
      syncTabs(spread);
    }
  }

  function syncTabs(pos) {
    $$('.tab').forEach(function (t) {
      t.classList.toggle('is-active', Number(t.dataset.spread) === pos);
    });
  }

  function goTo(s, opts) {
    s = Math.max(0, Math.min(MAX_SPREAD, s));
    opts = opts || {};
    if (busy) return;
    if (s === spread && !isFlat()) { syncVisual(); return; }
    if (s > spread && !REDUCED) busy = true;

    if (isFlat()) { flatIndex = Math.max(0, Math.min(MAX_SPREAD * 2, s * 2)); syncVisual(); }
    else { spread = s; syncVisual(); }

    if (opts.sound !== false && s !== 0) Sound.flip();
    setHash(s);
    setTimeout(function () { busy = false; }, REDUCED ? 50 : 620);
  }
  function next() { goTo(spread + 1); }
  function prev() { goTo(spread - 1); }
  function flatNext() { flatIndex = Math.min(MAX_SPREAD * 2, flatIndex + 1); Sound.flip(); syncVisual(); setHash(Math.ceil(flatIndex / 2)); }
  function flatPrev() { flatIndex = Math.max(0, flatIndex - 1); Sound.flip(); syncVisual(); setHash(Math.ceil(flatIndex / 2)); }

  function renderTabs() {
    var edge = $('#tabs'), chips = $('#tabChips');
    TABS.forEach(function (t) {
      edge.insertAdjacentHTML('beforeend',
        '<button class="tab" data-action="tab" data-spread="' + t.spread + '"><span>' + esc(t.label) + '</span></button>');
      chips.insertAdjacentHTML('beforeend',
        '<button class="chip" data-action="tab" data-spread="' + t.spread + '">' + esc(t.label) + '</button>');
    });
  }

  /* ================================================================  FLASH */
  function flash() {
    var f = $('#flash');
    f.classList.remove('go'); void f.offsetWidth; f.classList.add('go');
  }

  /* ==============================================================  GALLERY */
  function buildGallery() {
    var g = $('#galleryGrid');
    var html = '<div class="gcell gcell--spell" data-action="jump" data-spread="1" title="Open the index">' +
      '<div class="spellcard spellcard--mini"><div class="spellcard__frame">' +
      '<div class="spellcard__name">TOON TABLE OF CONTENTS</div>' +
      '<div class="spellcard__art spellcard__art--mini" data-art="book"></div>' +
      '<div class="spellcard__text">NORMAL SPELL &#8212; Add 1 Toon chapter from your Deck to your screen.</div>' +
      '</div><span class="mcard__holo"></span></div><span class="gcell__cap">the grimoire card</span></div>';

    BOOK.chapters.forEach(function (ch, i) {
      html += '<div class="gcell" data-action="jump" data-spread="' + SPREADS.chapter(i) + '">' +
        '<div class="mcard mcard--mini' + (ch.status === 'sealed' ? ' mcard--sealed' : '') + '">' +
        '<div class="mcard__inner">' +
        '<div class="mcard__namebar"><h3 class="mcard__name">' + esc(ch.name) + '</h3><span class="mcard__attr">&#10022;</span></div>' +
        '<div class="mcard__art mcard__art--mini">' + (ch.art === 'sigils'
          ? '<div class="sigils sigils--mini">' + ch.sigils.map(function (s) { return ART.sigil(s.name, s.code); }).join('') + '</div>'
          : '<div class="mcard__art-in" data-art="book"></div>') + '</div>' +
        '<div class="mcard__type">&#10022; ' + esc(ch.type) + '</div>' +
        '<div class="mcard__stats mcard__stats--mini"><span>ATK <b>' + esc(ch.atk) + '</b></span><span>DEF <b>' + esc(ch.def) + '</b></span></div>' +
        '</div><span class="mcard__holo"></span></div>' +
        '<span class="gcell__cap">chapter ' + esc(ch.num) + '</span></div>';
    });
    g.innerHTML = html;
  }
  function galleryOpen() {
    $('#gallery').classList.add('is-open');
    Sound.ping();
  }
  function galleryClose() { $('#gallery').classList.remove('is-open'); }

  /* ================================================================  ARENA */
  var activated = false;
  function activate() {
    if (activated) return;
    activated = true;
    Sound.activate();
    flash();
    $('#heroCard').classList.add('is-activating');
    document.body.classList.add('is-shaking');
    setTimeout(function () {
      document.body.classList.remove('is-shaking');
      $('#arena').classList.add('is-gone');
      openBook(false);
    }, REDUCED ? 150 : 700);
  }

  function openBook(instant) {
    var stage = $('#stage');
    stage.hidden = false;
    document.body.classList.add('book-open');
    if (instant || REDUCED) {
      goTo(Math.min(1, MAX_SPREAD), { sound: false });
    } else {
      stage.classList.add('is-materializing');
      requestAnimationFrame(function () { requestAnimationFrame(function () {
        stage.classList.remove('is-materializing');
      }); });
      Sound.open();
      setTimeout(function () { goTo(1, { sound: true }); Sound.summon(); }, 850);
    }
    setHash(1);
  }

  function toArena() {
    activated = false;
    $('#gallery').classList.remove('is-open');
    $('#stage').hidden = true;
    document.body.classList.remove('book-open');
    $('#arena').classList.remove('is-gone');
    $('#heroCard').classList.remove('is-activating');
    goTo(0, { sound: false });
    setHash('arena');
  }

  /* =================================================================  HASH */
  var internalNav = false;
  function setHash(v) {
    internalNav = true;
    var h = (v === 'arena') ? '#arena' : (v === 0 ? '#book' : '#spread-' + v);
    try { history.replaceState(null, '', h); } catch (e) { location.hash = h; }
    setTimeout(function () { internalNav = false; }, 0);
  }
  function applyHash() {
    if (internalNav) return;
    var h = location.hash;
    var m = h.match(/^#spread-(\d+)$/);
    if (m) {
      activated = true;
      $('#arena').classList.add('is-gone');
      $('#stage').hidden = false;
      document.body.classList.add('book-open');
      goTo(Math.min(MAX_SPREAD, Number(m[1])), { sound: false });
    } else if (h === '#book') {
      activated = true;
      $('#arena').classList.add('is-gone');
      $('#stage').hidden = false;
      document.body.classList.add('book-open');
      goTo(1, { sound: false });
    } else {
      toArena();
    }
  }

  /* =============================================================  PARTICLES */
  function particles(host, count, palette) {
    if (REDUCED || !host) return;
    var frag = document.createDocumentFragment();
    for (var i = 0; i < count; i++) {
      var s = document.createElement('span');
      var size = 2 + Math.random() * 5;
      s.className = 'pt';
      s.style.cssText = 'left:' + (Math.random() * 100) + '%;width:' + size + 'px;height:' + size + 'px;' +
        'background:' + palette[i % palette.length] + ';' +
        'animation-duration:' + (7 + Math.random() * 9) + 's;animation-delay:-' + (Math.random() * 12) + 's;' +
        'opacity:' + (0.25 + Math.random() * 0.55);
      frag.appendChild(s);
    }
    host.appendChild(frag);
  }

  /* ==================================================================  TILT */
  function bindTilt() {
    $$('.spellcard:not(.spellcard--mini), .mcard:not(.mcard--mini)').forEach(function (card) {
      card.addEventListener('pointermove', function (e) {
        if (REDUCED) return;
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        card.style.setProperty('--ry', ((px - 0.5) * 14).toFixed(2) + 'deg');
        card.style.setProperty('--rx', ((0.5 - py) * 12).toFixed(2) + 'deg');
        card.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
        card.style.setProperty('--my', (py * 100).toFixed(1) + '%');
      });
      card.addEventListener('pointerleave', function () {
        card.style.setProperty('--ry', '0deg');
        card.style.setProperty('--rx', '0deg');
      });
    });
  }

  /* =================================================================  WIRING */
  function onAction(btn) {
    var act = btn.dataset.action;
    if (act === 'activate') activate();
    else if (act === 'skip') { activated = true; $('#arena').classList.add('is-gone'); openBook(true); }
    else if (act === 'arena') toArena();
    else if (act === 'flip') { isFlat() ? (btn.dataset.dir === 'next' ? flatNext() : flatPrev()) : (btn.dataset.dir === 'next' ? next() : prev()); }
    else if (act === 'jump') { galleryClose(); goTo(Number(btn.dataset.spread)); Sound.ping(); }
    else if (act === 'tab') goTo(Number(btn.dataset.spread));
    else if (act === 'ghost') { btn.classList.remove('is-deny'); void btn.offsetWidth; btn.classList.add('is-deny'); Sound.deny(); }
    else if (act === 'gallery') galleryOpen();
    else if (act === 'gallery-close') galleryClose();
    else if (act === 'sound') {
      var mutedNow = Sound.toggle();
      $('#soundBtn').classList.toggle('is-muted', mutedNow);
      $('#soundBtn').setAttribute('aria-label', mutedNow ? 'Unmute' : 'Mute');
    }
    else if (act === 'fullscreen') {
      if (document.fullscreenElement) document.exitFullscreen();
      else document.documentElement.requestFullscreen && document.documentElement.requestFullscreen();
    }
  }

  function bindEvents() {
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-action]');
      if (btn) { onAction(btn); return; }
      /* click a page edge to turn */
      var page = e.target.closest('.page');
      if (page && !isFlat() && !e.target.closest('a,button,pre,.idx')) {
        var r = page.getBoundingClientRect();
        if (e.clientX - r.left > r.width * 0.92) next();
        else if (r.right - e.clientX > r.width * 0.92) prev();
      }
    });

    document.addEventListener('keydown', function (e) {
      var k = e.key;
      if (k === 'Escape') {
        if ($('#gallery').classList.contains('is-open')) galleryClose();
        else if (document.body.classList.contains('book-open')) toArena();
        return;
      }
      if (!document.body.classList.contains('book-open')) {
        if (k === 'Enter' || k === ' ') { e.preventDefault(); activate(); }
        return;
      }
      if (k === 'ArrowRight' || k === 'PageDown' || k === ' ') { e.preventDefault(); isFlat() ? flatNext() : next(); }
      else if (k === 'ArrowLeft' || k === 'PageUp') { e.preventDefault(); isFlat() ? flatPrev() : prev(); }
      else if (k === 'g' || k === 'G') { $('#gallery').classList.contains('is-open') ? galleryClose() : galleryOpen(); }
      else if (k === 'm' || k === 'M') { $('#soundBtn').classList.toggle('is-muted', Sound.toggle()); }
      else if (k === 'f' || k === 'F') { onAction({ dataset: { action: 'fullscreen' } }); }
    });

    /* swipe in flat mode */
    var tx = null;
    document.addEventListener('touchstart', function (e) {
      if (isFlat() && document.body.classList.contains('book-open')) tx = e.touches[0].clientX;
    }, { passive: true });
    document.addEventListener('touchend', function (e) {
      if (tx === null) return;
      var dx = e.changedTouches[0].clientX - tx; tx = null;
      if (Math.abs(dx) < 42) return;
      if (dx < 0) flatNext(); else flatPrev();
    }, { passive: true });

    FLATMQ.addEventListener ? FLATMQ.addEventListener('change', syncVisual)
                            : FLATMQ.addListener(syncVisual);
    window.addEventListener('hashchange', applyHash);
  }

  /* ==================================================================  INIT */
  function init() {
    buildLeaves();
    buildFlat();
    renderTabs();
    buildGallery();
    $$('[data-art="book"]').forEach(function (n) { n.innerHTML = ART.book; });
    particles($('#arenaStars'), 34, ['#ffd34d', '#8ad7ff', '#c78bff', '#ff8ae0', '#3dff6e']);
    particles($('#stageStars'), 22, ['#ffd34d', '#8ad7ff', '#c78bff']);
    bindTilt();
    bindEvents();
    $('#soundBtn').classList.toggle('is-muted', Sound.muted());
    if (location.hash && location.hash !== '#arena') applyHash();
    else setHash('arena');
    syncVisual();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
