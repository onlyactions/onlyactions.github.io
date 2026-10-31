/* ==========================================================================
   🪱 js/book.js — the storybook engine
   Binds window.BOOK into a flippable paper book (spreads on desktop,
   a sliding page deck on small screens). Vanilla JS, zero dependencies.
   ========================================================================== */
(function () {
  'use strict';

  var B = window.BOOK;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var mqMobile = window.matchMedia('(max-width: 899px)');
  var mode = mqMobile.matches ? 'deck' : 'book';

  /* ------------------------------------------------------------ helpers */
  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function worm(cls) {
    return '' +
'<svg class="worm ' + (cls || '') + '" viewBox="0 0 120 96" aria-hidden="true" focusable="false">' +
  '<path d="M12 84 Q14 56 34 56 Q56 56 56 36" fill="none" stroke="#67c99a" stroke-width="17" stroke-linecap="round"/>' +
  '<path d="M12 84 Q14 56 34 56" fill="none" stroke="#59b98a" stroke-width="17" stroke-linecap="round" opacity=".35"/>' +
  '<circle cx="58" cy="33" r="20" fill="#7bd8b0"/>' +
  '<circle cx="51" cy="31" r="7.5" fill="#fffdf5" stroke="#43325e" stroke-width="2.6"/>' +
  '<circle cx="67" cy="31" r="7.5" fill="#fffdf5" stroke="#43325e" stroke-width="2.6"/>' +
  '<path d="M58.5 31 h1" stroke="#43325e" stroke-width="2.6"/>' +
  '<circle class="worm__eye" cx="53" cy="32" r="2.6" fill="#43325e"/>' +
  '<circle class="worm__eye" cx="65" cy="32" r="2.6" fill="#43325e"/>' +
  '<path d="M54 43 Q59 47.5 64 43" fill="none" stroke="#43325e" stroke-width="2.4" stroke-linecap="round"/>' +
  '<circle cx="45" cy="41" r="3.4" fill="#ff9fb0" opacity=".55"/>' +
  '<path d="M58 12 Q60 4 68 4" fill="none" stroke="#67c99a" stroke-width="3" stroke-linecap="round"/>' +
  '<path d="M68 4 l2.6 3.4 4-1 -1.4 3.9 2.4 3.2 -4.2.2 -1.9 3.7 -1.7-3.8 -4.1-.6 2.6-3.1 z" fill="#f7c873"/>' +
'</svg>';
  }

  /* ------------------------------------------------- page html builders */
  function pageShell(side, accent) {
    var p = el('article', 'page page--' + side);
    p.style.setProperty('--accent', accent || 'var(--gold)');
    return p;
  }

  function coverPage() {
    var p = pageShell('cover');
    p.setAttribute('data-role', 'open');
    p.innerHTML =
      '<div class="cover__frame">' +
        '<p class="cover__press">✦ ' + esc(B.press) + ' presents ✦</p>' +
        '<h1 class="cover__title rainbow-text">' + esc(B.title) + '</h1>' +
        '<p class="cover__sub">' + esc(B.subtitle) + '</p>' +
        worm('worm--cover') +
        '<p class="cover__hint">✦ open me ✦</p>' +
        '<p class="cover__vol">' + esc(B.volume) + '</p>' +
      '</div>';
    return p;
  }

  function endpaperPage(stamp) {
    var p = pageShell('end', '#b79cff');
    p.classList.add('page--endpaper');
    p.innerHTML = stamp
      ? '<div class="exlibris">' +
          '<p class="exlibris__k">this book belongs to</p>' +
          '<p class="exlibris__name">' + esc(B.owner) + '</p>' +
          '<p class="exlibris__note">if lost, return to the dream shelf</p>' +
          '<p class="exlibris__no">📌 copy no. 000001</p>' +
        '</div>'
      : '<div class="endpaper-doodle" aria-hidden="true">✦ · ✧ · ✦ · ✧<br>· ✧ the very end ✧ ·<br>✧ · ✦ · ✧ ·</div>';
    return p;
  }

  function guidePage() {
    var p = pageShell('left', '#7cc4ff');
    p.innerHTML =
      '<header class="page__head"><h2 class="page__title u-doodle">How to Read This Book</h2>' +
      '<p class="page__kicker">ten seconds, that’s all</p></header>' +
      '<div class="guide__worm">' + worm('worm--page') +
        '<p class="hand">Hi! I’m <b>Doodle</b> — I live in the spine.<br>Nobody has ever dusted me.</p>' +
      '</div>' +
      '<ul class="guide__list">' +
        '<li>Turn pages — click a <b>curled corner</b>, the arrows below, or press <b>← →</b>.</li>' +
        '<li>Jump — tap any line in the <b>Contents</b>. The ribbon 📖 brings you back.</li>' +
        '<li>Share — every spread has its <b>own address</b>. Watch the bar change as you read.</li>' +
      '</ul>' +
      '<div class="guide__poke"><button type="button" class="btn btn--poke" id="pokeBtn">poke me</button>' +
      '<span class="hand hand--small">squishy buttons squish.</span></div>';
    return p;
  }

  function tocPage(entries) {
    var p = pageShell('right', '#f7c873');
    var rows = entries.map(function (r) {
      var inner =
        (r.icon ? '<span class="toc__medal" style="background:' + r.color + '22;border-color:' + r.color + '">' + r.icon + '</span>' : '<span class="toc__dash" style="color:' + r.color + '">—</span>') +
        '<span class="toc__label">' + (r.kicker ? '<em class="toc__kicker" style="color:' + r.color + '">' + esc(r.kicker) + '</em>' : '') +
        '<span class="toc__name">' + esc(r.name) + '</span></span>' +
        '<span class="toc__dots" aria-hidden="true"></span>' +
        '<span class="toc__pg" style="border-color:' + r.color + ';color:' + r.color + '">' + r.pg + '</span>';
      var b = el('button', 'toc__row' + (r.sub ? ' toc__row--sub' : ''), inner);
      b.type = 'button';
      b.setAttribute('data-anchor', r.anchor);
      b.style.setProperty('--accent', r.color);
      return b;
    });
    var list = el('nav', 'toc__list', '');
    list.setAttribute('aria-label', 'Table of contents');
    rows.forEach(function (r) { list.appendChild(r); });
    p.innerHTML = '<header class="page__head"><h2 class="page__title rainbow-text">Contents</h2>' +
      '<p class="page__kicker">every chapter, one tap away</p></header>';
    p.appendChild(list);
    p.appendChild(el('p', 'toc__foot hand', 'more chapters are being dreamed…'));
    return p;
  }

  function storyPage(ch) {
    var p = pageShell('right', ch.color);
    p.setAttribute('data-chapter', ch.id);
    var paras = (ch.story || []).map(function (t) { return '<p class="story__p">' + esc(t) + '</p>'; }).join('');
    p.innerHTML =
      '<header class="chap__head">' +
        '<span class="chap__badge" style="border-color:' + ch.color + ';color:' + ch.color + '">' + esc(ch.num) + '</span>' +
        '<span class="chap__icon" style="background:' + ch.color + '26">' + ch.icon + '</span>' +
      '</header>' +
      '<h2 class="page__title u-doodle" style="--accent:' + ch.color + '">' + esc(ch.title) + '</h2>' +
      '<p class="story__tag hand" style="color:' + ch.color + '">' + esc(ch.tagline) + '</p>' +
      (ch.status === 'soon' ? '<p class="chap__soon">· a seedling chapter ·</p>' : '');
    var body = el('div', 'story__body', paras);
    p.appendChild(body);
    if (ch.growing) {
      p.appendChild(el('div', 'growing hand', '🌱 a chapter is growing here…<br><small>(water with commits)</small>'));
    }
    if (ch.aside) {
      p.appendChild(el('p', 'story__aside', '<b>' + esc(ch.aside.label) + ' ·</b> ' + esc(ch.aside.text)));
    }
    if (ch.link) {
      p.appendChild(el('a', 'btn btn--chapter', esc(ch.link.label) + ' ↗'));
      p.lastChild.href = ch.link.url; p.lastChild.target = '_blank'; p.lastChild.rel = 'noopener';
    }
    return p;
  }

  function stepList(steps, accent, mold) {
    var ol = el('ol', 'steps');
    ol.style.setProperty('--accent', accent);
    steps.forEach(function (s, i) {
      ol.appendChild(el('li', 'step',
        '<span class="step__n" aria-hidden="true">' + (i + 1) + '</span>' +
        '<span class="step__t">' + esc(s.title) + '</span>' +
        '<span class="step__x">' + esc(s.text) + '</span>'));
    });
    return ol;
  }

  function manualPage(ch) {
    var p = pageShell('left', ch.color);
    p.setAttribute('data-chapter', ch.id);
    p.innerHTML = '<header class="page__head"><p class="page__kicker" style="color:' + ch.color + '">' +
      ch.icon + ' chapter ' + esc(ch.num) + ' · the manual</p>' +
      '<h2 class="page__title u-doodle" style="--accent:' + ch.color + '">' + esc(ch.manual.title) + '</h2></header>';
    p.appendChild(stepList(ch.manual.steps, ch.color, ch.manual.isMold));
    if (ch.manual.isMold) {
      p.appendChild(el('p', 'hand hand--mold', '(the reusable shape — placeholders for now)'));
    }
    if (ch.manual.tip) {
      p.appendChild(el('div', 'tip', '<span class="tip__who">' + worm('worm--tip') + ' <b>Doodle says</b></span>' + esc(ch.manual.tip)));
    }
    return p;
  }

  function extraPage(ch) {
    var x = ch.extra, p = pageShell('right', x.color);
    p.setAttribute('data-chapter', ch.id);
    p.innerHTML = '<header class="page__head"><p class="page__kicker" style="color:' + x.color + '">' +
      x.icon + ' ' + esc(x.kicker) + '</p>' +
      '<h2 class="page__title u-doodle" style="--accent:' + x.color + '">' + esc(x.title) + '</h2></header>' +
      '<p class="story__p story__p--tight">' + esc(x.intro) + '</p>';
    p.appendChild(stepList(x.steps, x.color, false));
    if (x.code) {
      p.appendChild(el('pre', 'code', esc(x.code)));
    }
    if (x.button) {
      p.appendChild(el('a', 'btn btn--chapter btn--small', esc(x.button.label) + ' ↗'));
      p.lastChild.href = x.button.url; p.lastChild.target = '_blank'; p.lastChild.rel = 'noopener';
    }
    return p;
  }

  function endPage() {
    var p = pageShell('right', '#f7c873');
    p.innerHTML =
      '<div class="theend">' +
        '<p class="theend__stars" aria-hidden="true">✦ ⋆ ✦</p>' +
        '<h2 class="page__title theend__title">The End</h2>' +
        '<p class="hand theend__hand">(for now…)</p>' +
        '<p class="story__p theend__p">This book grows one commit at a time.<br>Bring a tool, leave a story — the next chapter is yours.</p>' +
        '<a class="btn btn--chapter" href="' + esc(B.repo) + '" target="_blank" rel="noopener">⭐ star the workshop</a>' +
        '<p class="theend__colophon">set in Baloo 2 &amp; Nunito · bound with pure CSS ·<br>dreams supplied by ' + esc(B.title) + '</p>' +
      '</div>';
    p.setAttribute('data-role', 'end');
    return p;
  }

  /* ------------------------------------------- assemble the page list S */
  var S = [];
  S.push({ id: 'cover', anchor: 'cover', label: 'Cover', el: coverPage() });
  S.push({ id: 'endpaper', anchor: '', label: 'Endpaper', el: endpaperPage(true) });
  S.push({ id: 'toc', anchor: 'toc', label: 'Contents', el: null }); // filled below
  S.push({ id: 'guide', anchor: 'read', label: 'How to read this book', el: guidePage() });

  B.chapters.forEach(function (ch) {
    S.push({ id: ch.id + '-story', anchor: ch.id, label: 'Chapter ' + ch.num + ' — ' + ch.title, chapter: ch, el: storyPage(ch) });
    S.push({ id: ch.id + '-manual', anchor: ch.id + '-manual', label: ch.title + ' — the manual', chapter: ch, el: manualPage(ch) });
    if (ch.extra) {
      S.push({ id: ch.id + '-extra', anchor: 'grow', label: ch.extra.title, chapter: ch, el: extraPage(ch) });
    }
  });

  S.push({ id: 'end', anchor: 'end', label: 'The End', el: endPage() });
  if (S.length % 2 !== 0) S.push({ id: 'endpaper2', anchor: '', label: 'Endpaper', el: endpaperPage(false) });

  var SPREADS = S.length / 2;             // desktop spreads (leaf count)
  function spreadOf(i) { return Math.ceil(i / 2); }
  function spreadFirstPage(t) { return t === 0 ? 0 : 2 * t - 1; }
  var ANCHORS = {};
  S.forEach(function (pg, i) { if (pg.anchor) ANCHORS[pg.anchor] = i; });

  /* the Contents rows — page numbers are spread numbers */
  var tocEntries = [{ name: 'How to Read This Book', icon: '🧭', color: '#7cc4ff', kicker: '', anchor: 'read', sub: false, pg: spreadOf(ANCHORS.read) }];
  B.chapters.forEach(function (ch) {
    tocEntries.push({ name: ch.title, icon: ch.icon, color: ch.color, kicker: 'chapter ' + ch.num.toLowerCase(), anchor: ch.id, sub: false, pg: spreadOf(ANCHORS[ch.id]) });
    tocEntries.push({ name: ch.manual.title, icon: '', color: ch.color, kicker: '', anchor: ch.id + '-manual', sub: true, pg: spreadOf(ANCHORS[ch.id + '-manual']) });
    if (ch.extra) {
      tocEntries.push({ name: ch.extra.title, icon: '', color: ch.extra.color, kicker: '', anchor: 'grow', sub: true, pg: spreadOf(ANCHORS.grow) });
    }
  });
  S[2].el = tocPage(tocEntries);

  /* ------------------------------------------------------------- chrome */
  var book = document.getElementById('book');
  var wrap = document.getElementById('bookWrap');
  var dotsBox = document.getElementById('dots');
  var announcer = document.getElementById('announcer');

  (function buildDots() {
    for (var t = 0; t <= SPREADS; t++) {
      var d = el('button', 'dot');
      d.type = 'button';
      d.setAttribute('aria-label', 'Go to spread ' + (t + 1));
      d.setAttribute('data-t', t);
      dotsBox.appendChild(d);
    }
  })();

  /* stars & fireflies (JS-generated, CSS-animated) */
  (function sprinkle() {
    var stars = document.getElementById('stars');
    var fire = document.getElementById('fireflies');
    var i, s;
    if (!reduceMotion) {
      for (i = 0; i < 70; i++) {
        s = el('i', 'star');
        s.style.left = (Math.random() * 100) + '%';
        s.style.top = (Math.random() * 100) + '%';
        s.style.setProperty('--sz', (Math.random() * 2 + 1).toFixed(1) + 'px');
        s.style.setProperty('--d', (Math.random() * 4).toFixed(2) + 's');
        stars.appendChild(s);
      }
      for (i = 0; i < 9; i++) {
        s = el('i', 'fly');
        s.style.left = (5 + Math.random() * 90) + '%';
        s.style.top = (15 + Math.random() * 75) + '%';
        s.style.setProperty('--d', (6 + Math.random() * 9).toFixed(1) + 's');
        s.style.setProperty('--dl', (-Math.random() * 12).toFixed(1) + 's');
        fire.appendChild(s);
      }
    }
  })();

  /* ------------------------------------------------------ spread engine */
  var leaves = [], flipped = 0, lock = false, curPage = 0;

  function buildSpread() {
    book.innerHTML = '';
    book.className = 'book book--instant';
    wrap.classList.add('is-bookmode');
    book.appendChild(el('div', 'book__base book__base--left',
      '<div class="endpaper-doodle endpaper-doodle--bg" aria-hidden="true">✦ · ✧ · ✦</div>'));
    book.appendChild(el('div', 'book__base book__base--right',
      '<div class="endpaper-doodle endpaper-doodle--bg" aria-hidden="true">✧ · ✦ · ✧</div>'));
    leaves = [];
    for (var k = 0; k < SPREADS; k++) {
      var leaf = el('div', 'leaf');
      var front = el('div', 'leaf__face leaf__face--front');
      var back = el('div', 'leaf__face leaf__face--back');
      front.appendChild(S[2 * k].el);
      back.appendChild(S[2 * k + 1].el);
      leaf.appendChild(front); leaf.appendChild(back);
      book.appendChild(leaf);
      leaves.push(leaf);
    }
    restack(); syncA11y(); syncChrome();
  }

  function restack() {
    for (var i = 0; i < leaves.length; i++) {
      leaves[i].style.zIndex = i < flipped ? (10 + i) : (100 + (leaves.length - i));
    }
  }

  function syncA11y() {
    if (mode === 'book') {
      leaves.forEach(function (lf, k) {
        var vis = (k === flipped - 1) || (k === flipped);
        if (vis) { lf.removeAttribute('inert'); lf.setAttribute('aria-hidden', 'false'); }
        else { lf.setAttribute('inert', ''); lf.setAttribute('aria-hidden', 'true'); }
      });
    } else {
      pages.forEach(function (pg, i) {
        var vis = i === curPage;
        pg.el.toggleAttribute('inert', !vis);
        pg.el.setAttribute('aria-hidden', vis ? 'false' : 'true');
        pg.el.setAttribute('data-pos', i < curPage ? '-1' : i > curPage ? '1' : '0');
      });
    }
  }

  function syncChrome() {
    var t = mode === 'book' ? flipped : spreadOf(curPage);
    document.querySelectorAll('.dot').forEach(function (d) {
      d.classList.toggle('is-on', Number(d.getAttribute('data-t')) === t);
    });
    document.getElementById('btnPrev').disabled = (mode === 'book') ? (flipped === 0) : (curPage === 0);
    document.getElementById('btnNext').disabled = (mode === 'book') ? (flipped >= SPREADS) : (curPage >= S.length - 1);
    wrap.classList.toggle('is-closed', mode === 'book' && flipped === 0);
    var cPrev = document.querySelector('.corner--prev');
    var cNext = document.querySelector('.corner--next');
    if (cPrev) cPrev.style.visibility = (mode === 'book' && flipped > 0) ? 'visible' : 'hidden';
    if (cNext) cNext.style.visibility = (mode === 'book' && flipped < SPREADS) ? 'visible' : 'hidden';
    /* chapter ambience: glow + scene tint */
    var leftIdx = mode === 'book' ? spreadFirstPage(flipped) : curPage;
    var rightIdx = mode === 'book' ? spreadFirstPage(flipped) + 1 : curPage;
    var isEnd = (S[rightIdx] && S[rightIdx].id === 'end') || (S[leftIdx] && S[leftIdx].id === 'end');
    var chp = (S[rightIdx] && S[rightIdx].chapter) || (S[leftIdx] && S[leftIdx].chapter) || null;
    var glow = chp ? chp.color : '#b79cff';
    document.documentElement.style.setProperty('--glow', glow);
    document.body.setAttribute('data-chapter', chp ? chp.id : 'none');
    var rightPg = S[spreadFirstPage(flipped) + 1];
    var lbl = (mode === 'book')
      ? (flipped === 0 ? S[0].label : (rightPg ? rightPg.label : S[S.length - 1].label))
      : S[curPage].label;
    announcer.textContent = 'Storybook — ' + lbl;
    if (mode === 'book' && isEnd && !wrap.dataset.burstDone) {
      wrap.dataset.burstDone = '1';
      setTimeout(burstStars, reduceMotion ? 0 : 500);
    }
  }

  function afterFlip() {
    lock = false;
    restack(); syncA11y(); syncChrome();
  }

  function next() {
    if (lock) return;
    if (mode === 'deck') { deckGo(curPage + 1); return; }
    if (flipped >= SPREADS) return;
    lock = true;
    var lf = leaves[flipped];
    lf.style.zIndex = 200;
    flipped++;
    lf.classList.add('flipped');
    try { syncChrome(); } catch (err) { /* never strand a flip */ }
    if (reduceMotion) { setTimeout(afterFlip, 60); }
    else {
      lf.classList.add('is-flipping');
      var done = false;
      var fin = function () { if (done) return; done = true; lf.classList.remove('is-flipping'); afterFlip(); };
      lf.addEventListener('transitionend', fin, { once: true });
      setTimeout(fin, 1100);
    }
  }

  function prev() {
    if (lock) return;
    if (mode === 'deck') { deckGo(curPage - 1); return; }
    if (flipped <= 0) return;
    lock = true;
    flipped--;
    var lf = leaves[flipped];
    lf.style.zIndex = 200;
    lf.classList.remove('flipped');
    try { syncChrome(); } catch (err) { /* never strand a flip */ }
    if (reduceMotion) { setTimeout(afterFlip, 60); }
    else {
      lf.classList.add('is-flipping');
      var done = false;
      var fin = function () { if (done) return; done = true; lf.classList.remove('is-flipping'); afterFlip(); };
      lf.addEventListener('transitionend', fin, { once: true });
      setTimeout(fin, 1100);
    }
  }

  function goToSpread(t, instant) {
    if (mode === 'deck') { deckGo(spreadFirstPage(t)); return; }
    if (t === flipped) return;
    if (instant || reduceMotion) {
      flipped = t;
      leaves.forEach(function (lf, i) { lf.classList.toggle('flipped', i < t); });
      restack(); syncA11y(); syncChrome();
      return;
    }
    /* staggered flutter */
    var dir = t > flipped ? 1 : -1;
    var stepsToMove = Math.abs(t - flipped);
    var delay = Math.max(90, 420 / stepsToMove);
    lock = true;
    (function step() {
      if (dir === 1) nextSilent(); else prevSilent();
      stepsToMove--;
      if (stepsToMove > 0) setTimeout(step, delay);
      else setTimeout(function () { lock = false; syncChrome(); }, 700);
    })();
    function nextSilent() {
      var lf = leaves[flipped]; lf.style.zIndex = 200; flipped++;
      lf.classList.add('is-flipping', 'flipped');
      setTimeout(function () { lf.classList.remove('is-flipping'); restack(); }, 720);
      syncA11y();
    }
    function prevSilent() {
      flipped--; var lf = leaves[flipped]; lf.style.zIndex = 200;
      lf.classList.add('is-flipping'); lf.classList.remove('flipped');
      setTimeout(function () { lf.classList.remove('is-flipping'); restack(); }, 720);
      syncA11y();
    }
  }

  /* -------------------------------------------------------- deck engine */
  var deck = el('div', 'deck');
  var pages = [];

  function buildDeck() {
    book.innerHTML = '';
    book.className = 'book book--deck';
    wrap.classList.remove('is-bookmode');
    deck = el('div', 'deck');
    deck.classList.add('no-anim');
    pages = [];
    S.forEach(function (pg) { deck.appendChild(pg.el); pages.push(pg); });
    var bc = endpaperPage(false); bc.classList.add('page--deckend');
    deck.appendChild(bc);
    pages.push({ id: 'backcover', anchor: '', label: 'Back cover', el: bc });
    book.appendChild(deck);
    deckGo(Math.min(curPage, pages.length - 1), true);
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { deck.classList.remove('no-anim'); });
    });
    syncA11y(); syncChrome();
  }

  function deckGo(i, instant) {
    i = Math.max(0, Math.min(i, pages.length - 1));
    curPage = i;
    pages.forEach(function (pg, k) {
      pg.el.setAttribute('data-pos', k < i ? '-1' : k > i ? '1' : '0');
      var vis = k === i;
      pg.el.toggleAttribute('inert', !vis);
      pg.el.setAttribute('aria-hidden', vis ? 'false' : 'true');
    });
    syncChrome();
  }

  /* ------------------------------------------------------------ routing */
  function anchorToState(anchor) {
    if (!(anchor in ANCHORS)) return null;
    var i = ANCHORS[anchor];
    return mode === 'book' ? { spread: spreadOf(i) } : { page: i };
  }
  function stateToAnchor() {
    var i = mode === 'book' ? (flipped === 0 ? 0 : spreadFirstPage(flipped) + 1) : curPage;
    if (i >= S.length) i = S.length - 1;
    for (var k = i; k >= 0; k--) { if (S[k] && S[k].anchor) return S[k].anchor; }
    return 'cover';
  }
  function applyHash() {
    var a = (location.hash || '').replace('#', '');
    var st = anchorToState(a);
    if (!st) { st = mode === 'book' ? { spread: 0 } : { page: 0 }; }
    if (mode === 'book') goToSpread(st.spread, true);
    else { curPage = st.page; deckGo(st.page, true); }
  }
  function writeHash() {
    var a = stateToAnchor();
    if (('#' + a) !== location.hash) history.replaceState(null, '', '#' + a);
  }

  /* --------------------------------------------------------- star burst */
  function burstStars() {
    var host = document.querySelector('.book-wrap') || wrap;
    for (var i = 0; i < 26; i++) {
      (function () {
        var st = el('i', 'burst-star', ['✦', '⋆', '✧'][i % 3]);
        st.style.left = '50%';
        st.style.top = '46%';
        st.style.color = ['#f7c873', '#ff8fa3', '#7bd8b0', '#b79cff', '#7cc4ff'][i % 5];
        host.appendChild(st);
        var ang = Math.random() * Math.PI * 2;
        var dist = 90 + Math.random() * 190;
        var dx = Math.cos(ang) * dist, dy = Math.sin(ang) * dist - 60;
        st.animate(
          [{ transform: 'translate(-50%,-50%) scale(.4) rotate(0deg)', opacity: 1 },
           { transform: 'translate(calc(-50% + ' + dx + 'px), calc(-50% + ' + dy + 'px)) scale(' + (0.7 + Math.random()) + ') rotate(' + (Math.random() * 260 - 130) + 'deg)', opacity: 0 }],
          { duration: 900 + Math.random() * 700, easing: 'cubic-bezier(.17,.67,.35,1)' }
        ).onfinish = function () { st.remove(); };
      })();
    }
  }

  /* ------------------------------------------------------------ events */
  book.addEventListener('click', function (e) {
    var open = e.target.closest && e.target.closest('[data-role="open"]');
    if (open) { next(); setTimeout(writeHash, 1000); return; }
    var tocRow = e.target.closest && e.target.closest('[data-anchor]');
    if (tocRow) {
      var st = anchorToState(tocRow.getAttribute('data-anchor'));
      if (st) {
        if (mode === 'book') goToSpread(st.spread, false);
        else deckGo(st.page);
        writeHash();
      }
    }
  });

  document.getElementById('btnNext').addEventListener('click', function () { next(); writeHash(); });
  document.getElementById('btnPrev').addEventListener('click', function () { prev(); writeHash(); });
  document.getElementById('btnToC').addEventListener('click', function () {
    var st = anchorToState('toc');
    if (mode === 'book') goToSpread(st.spread, false); else deckGo(st.page);
    writeHash();
  });
  dotsBox.addEventListener('click', function (e) {
    var d = e.target.closest('.dot');
    if (d) { goToSpread(Number(d.getAttribute('data-t')), false); writeHash(); }
  });
  document.querySelector('.corner--next').addEventListener('click', function () { next(); writeHash(); });
  document.querySelector('.corner--prev').addEventListener('click', function () { prev(); writeHash(); });

  document.addEventListener('keydown', function (e) {
    if (e.target && /input|textarea|select/i.test(e.target.tagName)) return;
    if (e.key === 'ArrowRight') { next(); writeHash(); }
    else if (e.key === 'ArrowLeft') { prev(); writeHash(); }
    else if (e.key === 'Home') { goToSpread(0, false); writeHash(); }
    else if (e.key === 'End') { goToSpread(SPREADS, false); writeHash(); }
  });

  /* swipe (touch) */
  var tx = null, ty = null;
  book.addEventListener('touchstart', function (e) {
    if (e.touches.length === 1) { tx = e.touches[0].clientX; ty = e.touches[0].clientY; }
  }, { passive: true });
  book.addEventListener('touchend', function (e) {
    if (tx === null) return;
    var dx = e.changedTouches[0].clientX - tx;
    var dy = e.changedTouches[0].clientY - ty;
    if (Math.abs(dx) > 46 && Math.abs(dx) > Math.abs(dy) * 1.4) {
      if (dx < 0) { next(); } else { prev(); }
      writeHash();
    }
    tx = null;
  }, { passive: true });

  /* poke button */
  document.addEventListener('click', function (e) {
    var poke = e.target.closest && e.target.closest('#pokeBtn');
    if (poke) {
      poke.classList.remove('is-poked');
      void poke.offsetWidth;
      poke.classList.add('is-poked');
      burstStars();
    }
  });

  /* parallax */
  if (!reduceMotion && window.matchMedia('(pointer:fine)').matches) {
    window.addEventListener('pointermove', function (e) {
      var x = e.clientX / window.innerWidth - 0.5;
      var y = e.clientY / window.innerHeight - 0.5;
      document.documentElement.style.setProperty('--px', x.toFixed(3));
      document.documentElement.style.setProperty('--py', y.toFixed(3));
    }, { passive: true });
  }

  window.addEventListener('hashchange', applyHash);

  /* mode switching */
  /* builders map by page id (simple & explicit) */
  var BUILDERS = {};
  BUILDERS['cover'] = coverPage;
  BUILDERS['endpaper'] = function () { return endpaperPage(true); };
  BUILDERS['endpaper2'] = function () { return endpaperPage(false); };
  BUILDERS['toc'] = function () { return tocPage(tocEntries); };
  BUILDERS['guide'] = guidePage;
  BUILDERS['end'] = endPage;
  B.chapters.forEach(function (ch) {
    BUILDERS[ch.id + '-story'] = function () { return storyPage(ch); };
    BUILDERS[ch.id + '-manual'] = function () { return manualPage(ch); };
    if (ch.extra) BUILDERS[ch.id + '-extra'] = function () { return extraPage(ch); };
  });
  function rebuildPages() {
    S.forEach(function (pg) { pg.el = BUILDERS[pg.id](); });
  }

  var lastMode = mode;
  mqMobile.addEventListener ? mqMobile.addEventListener('change', maybeSwitch)
                            : mqMobile.addListener(maybeSwitch);
  var switchTimer = null;
  function maybeSwitch() {
    clearTimeout(switchTimer);
    switchTimer = setTimeout(function () {
      if ((mqMobile.matches ? 'deck' : 'book') === lastMode) return;
      lastMode = mqMobile.matches ? 'deck' : 'book';
      var keepAnchor = stateToAnchor();
      rebuildPages();
      mode = lastMode;
      if (mode === 'book') buildSpread(); else buildDeck();
      var st = anchorToState(keepAnchor);
      if (st) { if (mode === 'book') { flipped = st.spread; leaves.forEach(function (lf, i) { lf.classList.toggle('flipped', i < st.spread); }); restack(); syncA11y(); syncChrome(); } else { curPage = st.page; deckGo(st.page, true); } }
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          book.classList.remove('book--instant');
          if (deck.classList) deck.classList.remove('no-anim');
        });
      });
      writeHash();
    }, 220);
  }

  /* ------------------------------------------------------------ launch */
  if (mode === 'book') buildSpread(); else buildDeck();
  applyHash();
  writeHash();
  setTimeout(function () {
    book.classList.remove('book--instant');
    wrap.classList.add('is-ready');
  }, 120);

})();
