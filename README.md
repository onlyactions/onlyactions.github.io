# Toon Table of Contents — The Deck

The one-click hub for every **OnlyActions** repository. Each repo is bound as a
Yu-Gi-Oh!-styled card carrying its **real, measured power stats** — and every
link that exists (repo, living report, action runs, releases, subscription
files) is a single click away from the card.

Built around the *Toon Table of Contents* spell card (`ToonTableOfContents.png`):
the great Toon World book, opened to its rainbow INDEX. Cartoon on the outside.
Power on the inside.

## The deck (bind of 2026-11-10)

| Card | ATK / DEF | What the numbers are |
| --- | --- | --- |
| `vpngate-monitor` | **442 / 205** | servers really tunnel-tested / proven alive in the last daily run |
| `proxy-scanner` | **4,511 / 1,052** | proxies really tested through Xray / sing-box / verified working exits |
| `the-button` | **? / ?** | its power cannot be measured, only pressed — v0.0.7 for Linux · Windows · Android · Web |
| `onlyactions.github.io` | **9000 / 9000** | this deck — you are holding it |

## Files

| Piece | File | What it is |
| --- | --- | --- |
| The page | `index.html` | Semantic skeleton: hero → deck → manual → pact |
| The chrome | `css/style.css` | Tokens, nav, hero, paper manual, inspector shell |
| The field | `css/deck.css` | Toolbar, spell cards, inspector panel |
| **The data** | `js/data.js` | **The only file you edit** — one block per card |
| The engine | `js/app.js` | Renders the deck, search, chips, inspector, reveals |

## Add a card (grow the deck)

1. Ship a repository under `onlyactions`.
2. Append one block to `cards` in `js/data.js`:

```js
{
  id    : "my-tool",            // used by the search index
  repo  : "my-tool",            // repository name → one-click links
  name  : "MY TOOL",
  tag   : "SUMMONED ARTIFACT",  // chip on the card
  type  : "EFFECT MONSTER · GO",
  lang  : "Go",
  glyph : "power",              // book | eye | globe | power | bolt | gear | star
  colorA: "#c94040", colorB: "#3a0d18",
  atk   : "?", def : "?",       // real stats, or ? if unknowable
  lore  : "One breath of what it does — printed on the card.",
  topics: ["go", "gui"],
  pushed: "2026-11-10", created: "2026-11-01",
  links : [                     // only links that verifiably exist
    { label: "OPEN REPO", url: "https://github.com/onlyactions/my-tool" },
    { label: "RELEASES",  url: "https://github.com/onlyactions/my-tool/releases/latest" }
  ],
  statline: "v0.0.1 · EVERY PLATFORM"
}
```

3. Push to `main` — GitHub Pages rebinds the deck. No build step.

## Why it stays bug-free

- Normal document flow + `overflow-x: clip` + fluid `min()` / `clamp()` /
  `auto-fit` sizing — nothing can leave the screen at any width.
- Animations only touch `transform` and `opacity`, one calm easing
  (`cubic-bezier(.22,1,.36,1)`), no bounce, no squash, no sound.
- The inspector is a plain fixed panel with internal scroll, `Esc` / scrim /
  button close, focus restore and body scroll lock.
- `prefers-reduced-motion` disables all motion.
- `js/app.js` renders defensively: if `data.js` breaks, the deck says so
  instead of vanishing.

## Stack

Static HTML + CSS + vanilla JS. No frameworks, no build step, no audio.
Hosted on GitHub Pages.

*The toons are watching.*
