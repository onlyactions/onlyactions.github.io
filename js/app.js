/* ==========================================================================
   TOON TABLE OF CONTENTS — js/app.js
   Binds the book: renders INDEX + spreads from js/content.js, then wires
   the native magic (reveals, progress, deep links, stars).
   No frameworks. No libraries. No jank.
   ========================================================================== */
(() => {
  "use strict";

  const $  = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const esc = s => String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  const el = html => {
    const t = document.createElement("template");
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  };
  const pad3 = n => String(n).padStart(3, "0");

  /* ------------------------------ glyphs ------------------------------ */
  const ICONS = {
    book:     '<path d="M12 6.5C9.4 4.9 6.4 4.8 4 6v13.2c2.4-1.2 5.4-1.1 8 .5 2.6-1.6 5.6-1.7 8-.5V6c-2.4-1.2-5.4-1.1-8 .5Z"/><path d="M12 6.5v13.4"/>',
    spark:    '<path d="M12 3.5 13.9 10 20.5 12 13.9 14 12 20.5 10.1 14 3.5 12 10.1 10Z"/>',
    wand:     '<path d="M5 21 15.5 10.5"/><path d="M17 3v4M15 5h4"/>',
    eye:      '<path d="M2.5 12S6.2 5.8 12 5.8 21.5 12 21.5 12 17.8 18.2 12 18.2 2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="2.6"/>',
    bolt:     '<path d="M13 2.5 4.5 13.5h5.2L8 21.5l8.5-11h-5.2Z"/>',
    gear:     '<circle cx="12" cy="12" r="3.2"/><path d="M12 2.8v3M12 18.2v3M2.8 12h3M18.2 12h3M5.5 5.5l2.1 2.1M16.4 16.4l2.1 2.1M18.5 5.5l-2.1 2.1M7.6 16.4l-2.1 2.1"/>',
    globe:    '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17"/><path d="M12 3.5c2.7 2.3 4 5.2 4 8.5s-1.3 6.2-4 8.5c-2.7-2.3-4-5.2-4-8.5s1.3-6.2 4-8.5Z"/>',
    terminal: '<rect x="3" y="4.5" width="18" height="15" rx="2"/><path d="M7 9.5l3.2 2.9L7 15.3"/><path d="M12.5 15.5H17"/>',
    cards:    '<rect x="4" y="6.5" width="10" height="14" rx="1.6" transform="rotate(-8 9 13.5)"/><rect x="10" y="4" width="10" height="14" rx="1.6" transform="rotate(7 15 11)"/>',
    key:      '<circle cx="8" cy="14.5" r="3.8"/><path d="M11 12 20 3M15.5 7.5 18 10M12.8 9.7l2 2"/>',
    flame:    '<path d="M12 3c.6 3-1.2 4.6-2.5 6.2C8.2 10.8 7 12.4 7 14.5a5 5 0 0 0 10 0c0-3.4-2.6-5-3.5-8-.9 1.6-.6 3 .2 4.3C12 9.4 12.3 5.8 12 3Z"/>',
    star:     '<path d="M12 3.6l2.5 5.2 5.7.7-4.2 3.9 1.1 5.6L12 16.2 6.9 19l1.1-5.6L3.8 9.5l5.7-.7Z"/>'
  };
  const glyph = k =>
    `<svg class="glyph" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[k] || ICONS.spark}</svg>`;

  /* --------------------------- meta & footer -------------------------- */
  function paintMeta(BOOK) {
    const chapters = BOOK.chapters || [];
    const sigils   = (BOOK.sealed && BOOK.sealed.sigils) || [];

    $("#runLeft").textContent  = BOOK.volume || "";
    $("#runRight").textContent = "ONLYACTIONS PRESS · MMXXVI";

    $("#heroMeta").innerHTML = [
      `<span>${esc(BOOK.volume || "")}</span>`,
      `<span>${esc(BOOK.edition || "")}</span>`,
      `<span><b>${chapters.length}</b> CHAPTER${chapters.length === 1 ? "" : "S"} BOUND</span>`,
      `<span><b>${sigils.length}</b> SIGILS SLEEPING</span>`
    ].join("<b>◆</b>");

    $("#footerText").innerHTML =
      `© ${new Date().getFullYear()} <b>OnlyActions</b> · Toon World &amp; Yu-Gi-Oh! are property of Konami; ` +
      `this codex is an unaffiliated fan tribute · <b>${esc(BOOK.press || "")}</b>`;
  }

  /* ------------------------------ INDEX ------------------------------- */
  function buildIndex(BOOK) {
    const list = $("#indexList");
    list.innerHTML = "";
    const frag = document.createDocumentFragment();

    (BOOK.chapters || []).forEach(ch => {
      frag.appendChild(el(
        `<a class="ix" href="#${esc(ch.id)}" aria-label="${esc(ch.name)} — page ${pad3(ch.page)}">
           <span class="ix-name">${esc(ch.name)}</span>
           <span class="ix-leader" aria-hidden="true"></span>
           <span class="ix-status ${ch.status === "live" ? "live" : "sealed"}">${ch.status === "live" ? "LIVE" : "SEALED"}</span>
           <span class="ix-page">${pad3(ch.page)}</span>
         </a>`
      ));
    });

    frag.appendChild(el(
      `<span class="ix-divider" aria-hidden="true">YET UN-SUMMONED</span>`
    ));

    ((BOOK.sealed && BOOK.sealed.sigils) || []).forEach(s => {
      frag.appendChild(el(
        `<a class="ix" href="#${esc(BOOK.sealed.id)}" aria-label="${esc(s.name)} — sealed, page ${pad3(s.code)}">
           <span class="ix-name is-sealed">${esc(s.name)}</span>
           <span class="ix-leader" aria-hidden="true"></span>
           <span class="ix-status sealed">SEALED</span>
           <span class="ix-page">${pad3(s.code)}</span>
         </a>`
      ));
    });

    list.appendChild(frag);
  }

  /* --------------------------- cards & manuals ------------------------ */
  function buildCard(c, dark) {
    const stats = dark
      ? `<span>ATK ?</span><span>DEF ?</span><span class="card-status sealed">SEALED</span>`
      : `<span>ATK ${esc(c.atk)}</span><span>DEF ${esc(c.def)}</span><span class="card-status ${c.status === "live" ? "live" : "sealed"}">${c.status === "live" ? "LIVE" : "SEALED"}</span>`;

    return el(
      `<div class="card-frame">
         <div class="card-face ${dark ? "is-dark" : ""}" style="--art-a:${esc(c.colorA || "#2c8f5c")};--art-b:${esc(c.colorB || "#0d2b1e")}">
           <h4 class="card-name">${esc(c.name)}</h4>
           <div class="card-art">
             ${glyph(c.glyph)}
             <span class="card-attr">${dark ? "FIELD" : "SPELL"}</span>
           </div>
           <p class="card-type">[ ${esc(c.type)} ]</p>
           <p class="card-lore">${esc(c.lore)}</p>
           <div class="card-stats">${stats}</div>
         </div>
       </div>`
    );
  }

  function buildManual(m, page) {
    const intro = m.intro ? `<p class="manual-intro">${esc(m.intro)}</p>` : "";
    const ritual = `<ol class="ritual">${(m.summon || []).map(s =>
      `<li><div><p class="ritual-t">${esc(s.t)}</p><p class="ritual-d">${esc(s.d)}</p></div></li>`).join("")}</ol>`;
    const effects = (m.effects && m.effects.length) ? `
      <div class="m-block"><h4>EFFECTS</h4>
        <ul class="effects">${m.effects.map(x => `<li>${esc(x)}</li>`).join("")}</ul>
      </div>` : "";
    const keys = (m.keys && m.keys.length) ? `
      <div class="m-block"><h4>COMMANDS</h4>
        <div class="keys">${m.keys.map(k =>
          `<div class="key-row"><kbd>${esc(k[0])}</kbd><span>${esc(k[1])}</span></div>`).join("")}</div>
      </div>` : "";
    const tip = m.tip ? `<p class="tip">${esc(m.tip)}</p>` : "";

    return el(
      `<div class="manual-page">
         <div class="manual-head">
           <span class="manual-chip">MANUAL</span>
           <h4 class="manual-title">${esc(m.title || "How to Use It")}</h4>
         </div>
         ${intro}${ritual}${effects}${keys}${tip}
         <p class="manual-foot">— P.&nbsp;${pad3(page)} —</p>
       </div>`
    );
  }

  function buildSpreads(BOOK) {
    const host = $("#spreads");
    host.innerHTML = "";

    (BOOK.chapters || []).forEach(ch => {
      const spread = el(
        `<article class="spread reveal" id="${esc(ch.id)}" aria-labelledby="spread-${esc(ch.id)}">
           <header class="spread-head">
             <span class="spread-num">SPREAD ${esc(ch.num || "")}</span>
             <h3 class="spread-title" id="spread-${esc(ch.id)}">${esc(ch.name)}</h3>
             <span class="spread-rule" aria-hidden="true"></span>
           </header>
           <div class="spread-grid"></div>
         </article>`
      );
      const grid = $(".spread-grid", spread);
      const cardCol = el(`<div class="card-col"></div>`);
      cardCol.appendChild(buildCard(ch, false));
      if (ch.cap) cardCol.appendChild(el(`<p class="card-cap">${esc(ch.cap)}</p>`));
      if (ch.link) cardCol.appendChild(el(
        `<p class="card-link"><a class="btn btn-ink" href="${esc(ch.link.url)}" target="_blank" rel="noopener">${esc(ch.link.label)} ↗</a></p>`
      ));
      grid.appendChild(cardCol);
      grid.appendChild(buildManual(ch.manual || {}, ch.page));
      host.appendChild(spread);
    });
  }

  function buildSealed(BOOK) {
    const host = $("#sealedBody");
    if (!BOOK.sealed) { host.hidden = true; return; }
    const s = BOOK.sealed;
    host.innerHTML = "";

    const grid = el(`<div class="sealed-grid"></div>`);
    const cardCol = el(`<div class="sealed-card-col"></div>`);
    cardCol.appendChild(buildCard(s, true));
    cardCol.appendChild(el(`<p class="card-cap">The six names are legible in the original artwork's index — waiting.</p>`));
    if (s.link) cardCol.appendChild(el(
      `<p class="card-link"><a class="btn btn-ink" href="${esc(s.link.url)}" target="_blank" rel="noopener">${esc(s.link.label)} ↗</a></p>`
    ));
    grid.appendChild(cardCol);
    grid.appendChild(buildManual(s.manual || {}, s.page || 0));
    host.appendChild(grid);

    host.appendChild(el(
      `<div class="sigil-grid">${(s.sigils || []).map(g =>
        `<div class="sigil">
           <span class="sigil-chip">SEALED</span>
           <span class="sigil-rune" aria-hidden="true">${esc(g.name.charAt(0))}</span>
           <p class="sigil-name">${esc(g.name)}</p>
           <p class="sigil-code">p.&nbsp;${pad3(g.code)}</p>
         </div>`).join("")}</div>`
    ));
  }

  /* ------------------------------ stars ------------------------------- */
  function buildStars() {
    const host = $("#stars");
    if (!host || reduceMotion) return;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < 26; i++) {
      const spark = i % 9 === 0;
      const size  = spark ? 12 + Math.random() * 10 : 1.5 + Math.random() * 2;
      const s = document.createElement("span");
      if (spark) s.className = "spark";
      s.style.left   = (Math.random() * 100).toFixed(2) + "%";
      s.style.top    = (Math.random() * 100).toFixed(2) + "%";
      s.style.width  = s.style.height = size.toFixed(1) + "px";
      s.style.setProperty("--tw",  (2.8 + Math.random() * 3.6).toFixed(2) + "s");
      s.style.setProperty("--twd", (-Math.random() * 6).toFixed(2) + "s");
      frag.appendChild(s);
    }
    host.appendChild(frag);
  }

  /* ----------------------------- reveals ------------------------------ */
  function initReveals() {
    $$(".wrap, #spreads, #sealedBody").forEach(parent => {
      $$(".reveal", parent).forEach((n, i) => {
        if (!n.style.getPropertyValue("--rd")) {
          n.style.setProperty("--rd", (Math.min(i, 5) * 0.08).toFixed(2) + "s");
        }
      });
    });

    const nodes = $$(".reveal");
    if (reduceMotion || !("IntersectionObserver" in window)) {
      nodes.forEach(n => n.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: .12, rootMargin: "0px 0px -6% 0px" });
    nodes.forEach(n => io.observe(n));
  }

  /* --------------------------- scroll wire ---------------------------- */
  function initScroll() {
    const progress = $("#progress");
    const toTop    = $("#toTop");
    const navLinks = $$("[data-navlink]");
    const doc = document.documentElement;
    let ticking = false;

    const paint = () => {
      ticking = false;
      const max = doc.scrollHeight - innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
      if (progress) progress.style.transform = `scaleX(${p})`;
      if (toTop) toTop.classList.toggle("show", scrollY > 700);
    };
    addEventListener("scroll", () => {
      if (!ticking) { ticking = true; requestAnimationFrame(paint); }
    }, { passive: true });
    paint();

    if (toTop) toTop.addEventListener("click", () =>
      scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }));

    /* active section → nav underline */
    if ("IntersectionObserver" in window && navLinks.length) {
      const map = new Map(navLinks.map(a => [a.dataset.navlink, a]));
      const io = new IntersectionObserver(entries => {
        entries.forEach(en => {
          const link = map.get(en.target.id);
          if (link && en.isIntersecting) {
            navLinks.forEach(a => a.classList.remove("active"));
            link.classList.add("active");
          }
        });
      }, { rootMargin: "-40% 0px -55% 0px", threshold: 0 });
      ["index", "codex", "unsummoned", "pact"].forEach(id => {
        const sec = document.getElementById(id);
        if (sec) io.observe(sec);
      });
    }
  }

  /* ------------------------- deep links & flash ----------------------- */
  function goTo(id, smooth = !reduceMotion) {
    const target = document.getElementById(id);
    if (!target) return false;
    target.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
    history.replaceState(null, "", "#" + id);
    if (!reduceMotion) {
      target.classList.remove("flash");
      void target.offsetWidth;
      target.classList.add("flash");
    }
    return true;
  }

  function initLinks() {
    document.addEventListener("click", e => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute("href").slice(1);
      if (!id) return;
      if (goTo(id)) e.preventDefault();
    });

    const heroCard = $("#heroCard");
    if (heroCard) heroCard.addEventListener("click", () => {
      heroCard.classList.remove("flash");
      void heroCard.offsetWidth;
      heroCard.classList.add("flash");
      goTo("index");
    });

    /* honor deep links on load (instant, no long smooth scroll) */
    const h = decodeURIComponent(location.hash.slice(1));
    if (h && h !== "top") {
      setTimeout(() => goTo(h, false), 80);
    }

    /* and on any later hash change (back/forward, manual edits) */
    addEventListener("hashchange", () => {
      const id = decodeURIComponent(location.hash.slice(1));
      if (id && id !== "top") goTo(id);
    });
  }

  /* ------------------------------- boot ------------------------------- */
  function boot() {
    const BOOK = window.BOOK;

    if (!BOOK || !Array.isArray(BOOK.chapters)) {
      const list = $("#indexList");
      if (list) list.innerHTML =
        '<p class="manual-intro" style="text-align:center">The grimoire is blank — <code>js/content.js</code> failed to load.</p>';
      return;
    }

    try {
      paintMeta(BOOK);
      buildIndex(BOOK);
      buildSpreads(BOOK);
      buildSealed(BOOK);
    } catch (err) {
      console.error("ToC bind error:", err);
    }

    buildStars();
    initReveals();
    initScroll();
    initLinks();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
