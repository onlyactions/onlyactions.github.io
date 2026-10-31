# Toon Table of Contents

The living grimoire of **OnlyActions** — a full-page, Yu-Gi-Oh! **Toon**-themed table of
contents and manual for every project. Not cute. **Powerful.**

Built around the *Toon Table of Contents* spell card (`ToonTableOfContents.png`):
the great Toon World book, opened to its rainbow INDEX. This site **is** that book —
a dark dream sky above, cream paper below, one spread per project.

## The architecture (built to never break)

A normal scrolling document. No fullscreen takeovers, no 3D page-flip physics,
no tilt, no sound — just fast, native CSS animation over real text.

| Piece | File | What it is |
| --- | --- | --- |
| The page | `index.html` | Semantic skeleton: hero → paper (INDEX, chapters, sigils) → pact |
| The dream | `css/style.css` | Tokens, nav, hero, buttons, reduced-motion switch |
| The paper | `css/book.css` | INDEX entries, spreads, spell cards, manuals, sigils |
| The engine | `js/app.js` | Renders everything from data; reveals, progress, deep links |
| **The content** | `js/content.js` | **The only file you need to edit** |

## How to add your project (break a seal)

1. Open `js/content.js`
2. Append one chapter block under `chapters`:

```js
{
  id    : "my-tool",              // becomes the deep link  #my-tool
  num   : "II",                   // spread number
  name  : "MY TOOL",              // INDEX entry + card name
  type  : "TOON / CLI · EFFECT",
  glyph : "bolt",                 // book | spark | wand | eye | bolt | gear |
                                  // globe | terminal | cards | key | flame | star
  page  : 42,                     // printed in the INDEX — keep unique & ascending
  atk   : "1800",  def : "1200",
  colorA: "#7a5cff",  colorB: "#241a3d",
  cap   : "Caption under the card.",
  lore  : "One breath of what it does — printed on the card.",
  status: "live",
  manual: {
    title : "How to Wield It",
    summon: [ { t: "SUMMON IT", d: "npm i my-tool" } ],   // numbered ritual steps
    effects: [ "What it hits with." ],                    // ✦ list
    keys:    [ ["--flag", "what it does"] ],              // optional
    tip: "A combo worth knowing."
  },
  link: { label: "open the repo", url: "https://github.com/..." }
}
```

3. Push to `main` — GitHub Pages rebinds the book automatically: a new green
   entry in the INDEX (with its real page number), a new spell card, a new
   manual page, a new deep link. No build step, nothing else to touch.

The six sealed sigils (**DRAGON 372 · GIANT 418 · RAT 492 · GODDESS 514 ·
MONSTER 629 · BEAST 721**) are read straight from the original artwork's
index — each one wakes up the day a real project speaks its name.

## Reading the book

| Input | Action |
| --- | --- |
| Click any INDEX entry | Turn to its spread (with a gold ripple) |
| Header links | Jump to Index / Chapters / Sigils / Pact |
| `#grimoire`, `#my-tool`, … | Deep-link straight to any spread — URLs are real |
| `Ctrl / Cmd + F` | Find-in-page reads every line (it's all real text) |
| System reduced-motion | The whole grimoire goes still |

## Why it stays bug-free

- Everything lives in normal document flow — `overflow-x: clip` + fluid
  `min()` / `clamp()` / `auto-fit` sizing means nothing can leave the screen.
- Animations only touch `transform` and `opacity`, with one calm easing
  (`cubic-bezier(.22,1,.36,1)`). No bounce, no squash, no jank.
- `prefers-reduced-motion` disables all of it.
- `js/app.js` renders defensively: if `content.js` is broken, the book says so
  instead of vanishing.

## Stack

Static HTML + CSS + vanilla JS. No frameworks, no build step, no audio files.
Hosted on GitHub Pages.

*The toons are watching.*
