# Toon Table of Contents

The living grimoire of **OnlyActions** — a full-screen, Yu-Gi-Oh! **Toon**-themed table of
contents and manual for every project. Not cute. Powerful.

Built around the *Toon Table of Contents* spell card (`ToonTableOfContents.png`):
a dark duel arena, a spell card you **activate**, and a giant grimoire that takes over
the entire screen with real 3D page turns, rainbow INDEX entries, holo monster cards
and synthesized dueling sounds.

## What's inside

| Piece | File | What it is |
| --- | --- | --- |
| The duel arena + spell card | `index.html` | Landing scene: click the card to activate the grimoire |
| All the magic | `css/style.css` | Arena, 3D book, holo cards, tabs, gallery, mobile mode |
| The engine | `js/app.js` | Page-flip physics, activation, sound synth, routing, tilt |
| **The content** | `js/content.js` | **The only file you need to edit** |

## How to add your project (summon a chapter)

1. Open `js/content.js`
2. Copy a chapter block under `chapters` and fill it in:

```js
{
  id: "my-tool",  num: "III",  tab: "MY TOOL",
  name: "MY TOOL", type: "TOON / CLI · EFFECT",
  atk: "1800",  def: "1200",
  lore: "One breath of what it does.",
  status: "live",            // or "sealed" for a teaser card
  color: "#37d67a",
  manual: {
    title: "How to Wield It",
    summon:  [ { t: "SUMMON IT",  d: "npm i my-tool" } ],
    effects: [ "What it hits with." ],
    keys:    [ ["→", "what the key does"] ],
    tip: "A combo worth knowing."
  },
  link: { label: "open the repo", url: "https://github.com/..." }
}
```

3. Push to `main` — GitHub Pages re-binds the book automatically:
   a new rainbow entry appears in the INDEX, a gold bookmark tab grows on the
   edge of the book, and the card joins the gallery.

## Reading controls

| Input | Action |
| --- | --- |
| Click card / `Enter` | Activate the spell |
| `→` `←` / swipe / page corners | Turn pages |
| Gold tabs on the book's edge | Teleport to a chapter |
| `G` | Card gallery |
| `M` | Mute / unmute |
| `F` | Fullscreen |
| `Esc` | Back to the arena |
| Direct link `…/#spread-3` | Land on any spread |

Every spread has its own URL. Desktop gets the full two-page grimoire;
screens under 1024px get a full-screen flat page runner with swipe support.

## Stack

Static HTML + CSS + vanilla JS. No frameworks, no build step, no audio files
(every sound is synthesized live with WebAudio). Hosted on GitHub Pages.

*The toons are watching.*
