/* ==========================================================================
   📖 THE STORYBOOK'S QUILL  —  js/content.js
   --------------------------------------------------------------------------
   This is the ONLY file you need to touch to grow the book.
   Every chapter below becomes:
     · a line in the Contents (ToC)
     · a story page   (left)
     · a manual page  (right, "how to use it")
   No build step, no framework. Edit → commit → GitHub Pages rebinds the book.
   ========================================================================== */

window.BOOK = {

  /* ------------------------- the book's cover ------------------------- */
  title    : "OnlyActions",
  subtitle : "a tiny storybook of tools",
  volume   : "vol. I · stardust edition",
  press    : "the OnlyActions press",
  owner    : "onlyactions",
  repo     : "https://github.com/onlyactions",

  /* --------------------------- the chapters ---------------------------
     One block = one chapter. Copy a whole block, change the words,
     push. Fields marked (optional) can simply be deleted.            */
  chapters: [

    /* ================================================================
       CHAPTER I — this very book
       ================================================================ */
    {
      id      : "storybook",
      num     : "I",
      icon    : "📖",                       // any emoji
      color   : "#ff8fa3",                  // the chapter's accent color
      title   : "The Storybook Itself",
      tagline : "in which a website becomes a book — and the book becomes home.",
      status  : "live",                     // "live" | "soon"

      story: [
        "Once upon a commit, OnlyActions needed a home. Not a boring home with dropdown menus — a home with creaky covers, warm paper, and stardust smudged in the margins.",
        "So the website became a storybook, and every tool that joins the workshop gets its own chapter: a story on the left page, a how-to on the right.",
        "You are holding Chapter One. It is about the book you are holding. Doodle finds this extremely funny."
      ],
      aside: {
        label: "field notes",
        text : "genre: interactive fiction, but for software · spreads: 5 · weight: one feather · calories: 0"
      },
      link: { label: "visit the workshop", url: "https://github.com/onlyactions" },

      /* ---- right page: the manual ---- */
      manual: {
        title: "How to Wander This Book",
        steps: [
          { title: "Open the cover",
            text : "Click the bottom-right corner — or the cover itself. It only happens once per visit, so savor it." },
          { title: "Pick a chapter",
            text : "Tap a line in the Contents and the book flips itself there. No paper cuts, promise." },
          { title: "Turn & return",
            text : "Corners, arrow keys, or a little swipe. The ribbon below always brings you back to the Contents." },
          { title: "Follow the worm",
            text : "Golden bubbles in the margins are Doodle's tips. He knows all the shortcuts." },
          { title: "Share a spread",
            text : "The address changes as you read. Send a friend straight to page three." }
        ],
        tip: "Psst — press ← and → right now. See? Magic."
      },

      /* ---- optional bonus page (set to null to remove) ---- */
      extra: {
        icon   : "✚",
        color  : "#b79cff",
        title  : "Grow the Book",
        kicker : "a manual for future chapters",
        intro  : "Every tool deserves a chapter, and chapters live in exactly one friendly file. No frameworks, no build step — just open, paste, push.",
        steps  : [
          { title: "Open js/content.js",
            text : "Every chapter is a small block of plain text. This whole book is one HTML page, one stylesheet, two scripts." },
          { title: "Tell its story",
            text : "Copy a chapter block. Give it a title, an icon, a color, and a few honest sentences." },
          { title: "Push to main",
            text : "GitHub Pages rebinds the book on every push. Your chapter appears in the Contents all by itself." }
        ],
        code:
`// js/content.js — tuck me under "chapters"
{
  id:      "my-tool",
  icon:    "🪄",
  color:   "#7bd8b0",
  title:   "My Tool",
  tagline: "in which things get easier.",
  story:   [ "Once upon a commit…" ],
  steps:   [ { title: "Install", text: "npm i my-tool" } ]
}`,
        button: { label: "open the workshop", url: "https://github.com/onlyactions" }
      }
    },

    /* ================================================================
       CHAPTER II — a seedling, waiting for its tool
       ================================================================ */
    {
      id      : "seedling",
      num     : "II",
      icon    : "🌱",
      color   : "#7bd8b0",
      title   : "Coming Soon",
      tagline : "in which a seed is planted and watered with commits.",
      status  : "soon",
      growing : true,   // draws the dashed "a chapter is growing here" frame

      story: [
        "Past this page, the next chapter is already sprouting. OnlyActions is a tiny workshop: small tools that do one thing well, with buttons that go squish.",
        "When the first tool lands, this spread grows into its full story — with a manual that actually makes sense, tested on real humans."
      ],

      manual: {
        title  : "How Every Chapter Will Look",
        isMold : true,                    // marks steps as the reusable shape
        steps  : [
          { title: "Meet it",       text: "What the tool is, in one friendly breath." },
          { title: "Install it",    text: "Copy-paste commands. Zero trivia, zero homework." },
          { title: "First win",     text: "The smallest useful thing — working in under a minute." },
          { title: "Go further",    text: "Options, flags and little superpowers." },
          { title: "Troubleshoot",  text: "The three most common ouchies, and their plasters." }
        ],
        tip: "This is the mold. Tell me the tool, and I'll pour the chapter."
      },

      extra: null
    }
  ]
};
