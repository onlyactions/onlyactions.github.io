/* ==========================================================================
   TOON TABLE OF CONTENTS — js/app.js
   The deck engine: renders cards from js/data.js, wires search, filters,
   the inspector, and the native magic. No frameworks. No jank.
   ========================================================================== */
(() => {
  "use strict";

  const $  = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const esc = s => String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");

  /* ------------------------------ glyphs ------------------------------ */
  const ICONS = {
    book:  '<path d="M12 6.5C9.4 4.9 6.4 4.8 4 6v13.2c2.4-1.2 5.4-1.1 8 .5 2.6-1.6 5.6-1.7 8-.5V6c-2.4-1.2-5.4-1.1-8 .5Z"/><path d="M12 6.5v13.4"/>',
    eye:   '<path d="M2.5 12S6.2 5.8 12 5.8 21.5 12 21.5 12 17.8 18.2 12 18.2 2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="2.6"/>',
    globe: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17"/><path d="M12 3.5c2.7 2.3 4 5.2 4 8.5s-1.3 6.2-4 8.5c-2.7-2.3-4-5.2-4-8.5s1.3-6.2 4-8.5Z"/>',
    power: '<path d="M12 3v8"/><path d="M6.4 6.6a8 8 0 1 0 11.2 0"/>',
    bolt:  '<path d="M13 2.5 4.5 13.5h5.2L8 21.5l8.5-11h-5.2Z"/>',
    gear:  '<circle cx="12" cy="12" r="3.2"/><path d="M12 2.8v3M12 18.2v3M2.8 12h3M18.2 12h3M5.5 5.5l2.1 2.1M16.4 16.4l2.1 2.1M18.5 5.5l-2.1 2.1M7.6 16.4l-2.1 2.1"/>',
    star:  '<path d="M12 3.6l2.5 5.2 5.7.7-4.2 3.9 1.1 5.6L12 16.2 6.9 19l1.1-5.6L3.8 9.5l5.7-.7Z"/>'
  };
  const glyph = k =>
    `<svg class="glyph" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[k] || ICONS.star}</svg>`;

  const fmtDate = iso => (iso || "").slice(0, 10) || "—";
  const fmtNum = n => (n || 0).toLocaleString("en-US");

  /* --------------------------- meta & footer -------------------------- */
  function paintMeta(D) {
    const langs = [...new Set(D.cards.map(c => c.lang).filter(Boolean))];
    $("#runLeft").textContent  = D.volume || "";
    $("#runRight").textContent = "BOUND " + fmtDate(D.bound).toUpperCase();

    $("#heroMeta").innerHTML = [
      `<span><b>${D.cards.length}</b> CARDS IN THE DECK</span>`,
      `<span><b>${langs.length}</b> LANGUAGES</span>`,
      `<span>LAST BIND <b>${fmtDate(D.bound)}</b></span>`
    ].join("<b>◆</b>");

    $("#footerText").innerHTML =
      `© ${new Date().getFullYear()} <b>OnlyActions</b> · Toon World &amp; Yu-Gi-Oh! are property of Konami; ` +
      `this deck is an unaffiliated fan tribute · stats baked ${fmtDate(D.bound)} · <b>${esc(D.press || "")}</b>`;
  }

  /* ------------------------------ cards ------------------------------- */
  function cardHTML(c) {
    return `
      <div class="card-frame">
        <div class="card-face ${c.here ? "is-dark" : ""}" style="--art-a:${esc(c.colorA)};--art-b:${esc(c.colorB)}">
          <h3 class="card-name">${esc(c.name)}
            <span class="card-tag ${c.here ? "here" : ""}">${esc(c.tag)}</span>
          </h3>
          <div class="card-art">
            ${glyph(c.glyph)}
          </div>
          <p class="card-type">[ ${esc(c.type)} · ${esc(c.lang)} ]</p>
          <p class="card-lore">${esc(c.lore)}</p>
          ${c.statline ? `<p class="card-statline">${esc(c.statline)}</p>` : ""}
          <div class="card-stats">
            <span>ATK ${esc(c.atk)}</span>
            <span>DEF ${esc(c.def)}</span>
          </div>
        </div>
      </div>
      <p class="card-hint" aria-hidden="true">TAP TO INSPECT</p>`;
  }

  function renderDeck(D) {
    const grid = $("#cardGrid");
    grid.innerHTML = "";
    const frag = document.createDocumentFragment();

    D.cards.forEach((c, i) => {
      const card = document.createElement("article");
      card.className = "ygo-card";
      card.id = "card-" + c.id;
      card.tabIndex = 0;
      card.setAttribute("role", "button");
      card.setAttribute("aria-haspopup", "dialog");
      card.setAttribute("aria-label", `Inspect ${c.name}`);
      card.dataset.id = c.id;
      card.dataset.lang = c.lang || "";
      card.dataset.hay = [c.name, c.repo, c.lore, c.type, c.lang, (c.topics || []).join(" ")]
        .join(" ").toLowerCase();
      card.style.setProperty("--dd", (Math.min(i, 5) * 0.09).toFixed(2) + "s");
      card.style.setProperty("--tilt", (i % 2 ? 1 : -1) * 1.2 + "deg");
      card.innerHTML = cardHTML(c);
      frag.appendChild(card);
    });

    grid.appendChild(frag);
    paintCount(D.cards.length);
  }

  /* --------------------------- search & chips ------------------------- */
  let activeLang = "ALL";

  function paintCount(n) {
    const D = window.DECK;
    $("#deckCount").textContent =
      `${n} OF ${D.cards.length} CARDS ON THE FIELD`;
  }

  function applyFilter() {
    const q = ($("#deckSearch").value || "").trim().toLowerCase();
    let shown = 0;
    $$("#cardGrid .ygo-card").forEach(card => {
      const okLang = activeLang === "ALL" || card.dataset.lang === activeLang;
      const okText = !q || card.dataset.hay.includes(q);
      const hit = okLang && okText;
      card.hidden = !hit;
      if (hit) shown++;
    });
    $("#deckEmpty").hidden = shown !== 0;
    paintCount(shown);
  }

  function renderChips(D) {
    const langs = [...new Set(D.cards.map(c => c.lang).filter(Boolean))];
    const row = $("#chipRow");
    row.innerHTML = "";
    ["ALL", ...langs].forEach(lang => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "chip" + (lang === "ALL" ? " on" : "");
      b.textContent = lang;
      b.setAttribute("aria-pressed", lang === "ALL" ? "true" : "false");
      b.addEventListener("click", () => {
        activeLang = lang;
        $$(".chip", row).forEach(x => {
          x.classList.toggle("on", x === b);
          x.setAttribute("aria-pressed", x === b ? "true" : "false");
        });
        applyFilter();
      });
      row.appendChild(b);
    });
  }

  /* ---------------------------- inspector ----------------------------- */
  const inspector = $("#inspector");
  let lastFocus = null;

  function metaRow(t, d) {
    return `<div><dt>${esc(t)}</dt><dd>${esc(d)}</dd></div>`;
  }

  function openInspector(c) {
    lastFocus = document.activeElement;

    $("#insBody").innerHTML = `
      <div class="ins-card-col">
        ${cardHTML(c).replace('<p class="card-hint" aria-hidden="true">TAP TO INSPECT</p>', "")}
        <div class="ins-links">
          ${(c.links || []).map(l =>
            `<a class="ins-link" href="${esc(l.url)}" target="_blank" rel="noopener">
               <span>${esc(l.label)}</span><b>↗</b>
             </a>`).join("")}
        </div>
      </div>
      <div class="ins-doc-col">
        <p class="ins-kicker">◆ ${esc(c.tag)} · ${esc(c.type)} ◆</p>
        <h3 class="ins-title" id="insTitle">${esc(c.name)}</h3>
        <p class="ins-desc">${esc(c.lore)}</p>
        ${c.statline ? `<p class="ins-statline">${esc(c.statline)}</p>` : ""}
        <dl class="ins-meta">
          ${metaRow("REPOSITORY", c.repo)}
          ${metaRow("LANGUAGE", c.lang)}
          ${metaRow("CREATED", fmtDate(c.created))}
          ${metaRow("LAST PUSH", fmtDate(c.pushed))}
        </dl>
        ${(c.topics && c.topics.length) ? `
          <div class="topics">${c.topics.map(t => `<span class="topic">${esc(t)}</span>`).join("")}</div>` : ""}
        <button class="ins-copy" id="insCopy" type="button" data-url="https://github.com/onlyactions/${esc(c.repo)}">
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>
          COPY REPO LINK
        </button>
      </div>`;

    inspector.hidden = false;
    requestAnimationFrame(() => inspector.classList.add("open"));
    document.body.classList.add("locked");
    $("#insClose").focus({ preventScroll: true });
  }

  function closeInspector() {
    const done = () => {
      inspector.hidden = true;
      $("#insBody").innerHTML = "";
    };
    inspector.classList.remove("open");
    document.body.classList.remove("locked");
    if (reduceMotion) done();
    else setTimeout(done, 260);
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }

  function wireInspector() {
    $("#cardGrid").addEventListener("click", e => {
      const card = e.target.closest(".ygo-card");
      if (!card || card.hidden) return;
      const c = window.DECK.cards.find(x => x.id === card.dataset.id);
      if (c) openInspector(c);
    });
    $("#cardGrid").addEventListener("keydown", e => {
      if (e.key !== "Enter" && e.key !== " ") return;
      const card = e.target.closest(".ygo-card");
      if (!card) return;
      e.preventDefault();
      const c = window.DECK.cards.find(x => x.id === card.dataset.id);
      if (c) openInspector(c);
    });

    $$("#inspector [data-close]").forEach(el =>
      el.addEventListener("click", closeInspector));
    $("#insClose").addEventListener("click", closeInspector);

    document.addEventListener("keydown", e => {
      if (e.key === "Escape" && !inspector.hidden) closeInspector();
    });

    document.addEventListener("click", e => {
      const btn = e.target.closest("#insCopy");
      if (!btn) return;
      const url = btn.dataset.url;
      const ok = () => {
        btn.classList.add("ok");
        btn.textContent = "COPIED ✓";
        setTimeout(() => {
          btn.classList.remove("ok");
          btn.innerHTML =
            '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg> COPY REPO LINK';
        }, 1600);
      };
      const fallback = () => {
        try {
          const ta = document.createElement("textarea");
          ta.value = url;
          ta.style.position = "fixed";
          ta.style.opacity = "0";
          document.body.appendChild(ta);
          ta.select();
          document.execCommand("copy");
          ta.remove();
          ok();
        } catch (_) { /* clipboard unavailable — the link is right above */ }
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(ok, fallback);
      } else fallback();
    });
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
    $$(".wrap > .reveal").forEach((n, i) => {
      if (!n.style.getPropertyValue("--rd")) {
        n.style.setProperty("--rd", (Math.min(i, 5) * 0.07).toFixed(2) + "s");
      }
    });

    const nodes = $$(".reveal, .ygo-card");
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
      ["deck", "manual"].forEach(id => {
        const sec = document.getElementById(id);
        if (sec) io.observe(sec);
      });
    }
  }

  /* ------------------------------- links ------------------------------ */
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
      goTo("deck");
    });

    const reset = $("#resetSearch");
    if (reset) reset.addEventListener("click", () => {
      $("#deckSearch").value = "";
      applyFilter();
      $("#deckSearch").focus();
    });

    const search = $("#deckSearch");
    if (search) search.addEventListener("input", applyFilter);
  }

  /* ------------------------------- boot ------------------------------- */
  function boot() {
    const D = window.DECK;
    if (!D || !Array.isArray(D.cards)) {
      $("#cardGrid").innerHTML =
        '<p class="deck-empty">The deck failed to load — <code>js/data.js</code> is missing or broken.</p>';
      return;
    }
    try {
      paintMeta(D);
      renderDeck(D);
      renderChips(D);
    } catch (err) {
      console.error("deck bind error:", err);
    }
    buildStars();
    initReveals();
    initScroll();
    initLinks();
    wireInspector();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
