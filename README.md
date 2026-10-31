# 📘 onlyactions.github.io

> A tiny, cartoon storybook of tools — the home page of **OnlyActions**.
> Open the cover and flip through: every project gets a *chapter* (its story)
> and a *manual* (how to use it), bound with pure CSS and stardust.

**Live book → <https://onlyactions.github.io/>**

## ✨ What's inside

| File | What it is |
| --- | --- |
| `index.html` | The stage: dreamscape, chrome, and the empty book |
| `css/style.css` | The wardrobe — dusk sky, paper, flip animation, cartoon bits |
| `js/book.js` | The bindery — flips pages, dots, keyboard, swipe, deep links |
| `js/content.js` | **The quill — the only file you edit to grow the book** |
| `assets/` | Favicons & social images |

## 🪄 Add a chapter (a project)

1. Open `js/content.js`.
2. Copy any chapter block under `chapters:` and change its words:

```js
{
  id:      "my-tool",
  icon:    "🪄",
  color:   "#7bd8b0",
  title:   "My Tool",
  tagline: "in which things get easier.",
  status:  "live",
  story:   [ "Once upon a commit…" ],
  manual:  {
    title: "How to Use My Tool",
    steps: [ { title: "Install", text: "npm i my-tool" } ],
    tip:   "a little golden tip for the margins"
  },
  extra:   null
}
```

3. Commit & push to `main` — GitHub Pages rebinds the book automatically.

Every chapter becomes a line in the **Contents**, a story page, and a
how-to page. Set `status: "soon"` to plant a seedling chapter instead.

## 📖 Reading the book

- Turn pages: curled corners, the arrows, `←` `→` keys, or swipe
- Jump: tap any line in the Contents (the 📖 ribbon brings you back)
- Share: every spread has its own address — `#cover`, `#toc`, `#read`,
  `#ch1`, `#end`…

## 🛠 Under the hood

- No framework, no build step, no tracking — three hand-written files
- Desktop: a real flippable spread book (CSS 3D transforms)
- Small screens: the same pages become a swipeable deck
- Respects `prefers-reduced-motion` (flips become instant, ambience rests)
- Keyboard accessible, screen-reader announcements, `inert` on hidden pages

*Set in Baloo 2 & Nunito · bound with pure CSS · dreams supplied by Doodle 🪱*
