/* ==========================================================================
   TOON TABLE OF CONTENTS — js/content.js
   --------------------------------------------------------------------------
   THE ONLY FILE YOU TOUCH TO GROW THE GRIMOIRE.

   One chapter block becomes, automatically:
     · a green entry in the INDEX (the ToC) with a real page number
     · a spell card      (left page  of its spread)
     · a manual page     (right page of its spread)
     · a deep link       (#your-id works anywhere, even from other sites)

   No framework. No build step. Edit -> push -> GitHub Pages rebinds the book.
   ========================================================================== */

window.BOOK = {

  /* --------------------------- the grimoire --------------------------- */
  brand   : "ONLYACTIONS",
  title   : "TOON TABLE OF CONTENTS",
  tagline : "the living grimoire of every OnlyActions project — a table of contents with teeth.",
  volume  : "VOL. I — POWER EDITION",
  edition : "THIRD PRINTING",
  press   : "the toons are watching",
  owner   : "onlyactions",
  repo    : "https://github.com/onlyactions",
  repoSite: "https://onlyactions.github.io",
  issues  : "https://github.com/onlyactions/onlyactions.github.io/issues",

  /* --------------------------- the chapters ---------------------------
     status : "live"  -> full card + manual, clickable INDEX entry
     glyph  : book | spark | wand | eye | bolt | gear | globe | terminal |
              cards | key | flame | star
     page   : the number printed in the INDEX — keep them unique, ascending
     colorA / colorB : the two stops of the card-art gradient                     */
  chapters: [

    /* ================================================================
       SPREAD I — the grimoire itself
       ================================================================ */
    {
      id    : "grimoire",
      num   : "I",
      name  : "TOON GRIMOIRE",
      type  : "TOON / SPELLBOOK · EFFECT",
      glyph : "book",
      page  : 1,
      atk   : "9000",
      def   : "9000",
      colorA: "#2c8f5c",
      colorB: "#0d2b1e",
      cap   : "Card art: the original index — first summoned as ToonTableOfContents.png",
      lore  : "The living index of every OnlyActions tool. While this card remains on the field, no project is ever lost: every entry in the INDEX is real, every page number is real, and the book grows each time a new power ships. This card cannot be silenced.",
      status: "live",

      manual: {
        title : "How to Wield It",
        summon: [
          { t: "READ THE INDEX",
            d: "The green page up top is the table of contents. Every entry is clickable and carries a real page number — no dead links in this book." },
          { t: "TURN THE SPREADS",
            d: "Each project owns one spread: its spell card on the left page, its manual on the right. Scroll, or use the chapter links in the header." },
          { t: "LINK TO ANY PAGE",
            d: "Every spread has a true anchor — try #grimoire — so you can copy the address bar and land any duelist exactly on that spread." }
        ],
        effects: [
          "The book is the site. No widgets, no pop-ups, no boxed section — the whole page is the grimoire.",
          "Native magic only: CSS scrolling, CSS animation, zero frameworks, zero jank.",
          "Honors your system's reduced-motion setting — the whole grimoire goes still if you ask it to.",
          "Grow the book by editing one file (js/content.js): the INDEX, the card and the manual bind themselves."
        ],
        keys: [
          ["CLICK / TAP",    "follow any INDEX entry to its spread"],
          ["#grimoire",      "deep-link straight to any spread"],
          ["CTRL / CMD + F", "find-in-page reads every line of paper"]
        ],
        tip: "Nothing here is a picture of text — your browser's find-in-page reads the whole grimoire. Try searching “sigil”."
      },

      link: { label: "inspect the source grimoire", url: "https://github.com/onlyactions/onlyactions.github.io" }
    }
  ],

  /* --------------------------- the sealed sigils ----------------------
     Read straight from the original artwork's index. Each becomes a full
     chapter the day a real project speaks its name in js/content.js.      */
  sealed: {
    id    : "unsummoned",
    name  : "THE UN-SUMMONED",
    type  : "TOON · FIELD SPELL",
    glyph : "eye",
    page  : 0,
    colorA: "#5b4a86",
    colorB: "#171030",
    lore  : "Six sigils sleep in the index — each one a project waiting for its summoning. Ship a tool, speak its name in js/content.js, and a silhouette becomes a card with your manual printed on its back.",
    status: "sealed",

    sigils: [
      { name: "DRAGON",  code: 372 },
      { name: "GIANT",   code: 418 },
      { name: "RAT",     code: 492 },
      { name: "GODDESS", code: 514 },
      { name: "MONSTER", code: 629 },
      { name: "BEAST",   code: 721 }
    ],

    manual: {
      title : "The Summoning Mold",
      intro : "Every future chapter follows one fixed ritual, so every manual in this book reads the same and no reader is ever lost:",
      summon: [
        { t: "I · MEET IT",      d: "What the tool is, in one hard-hitting breath." },
        { t: "II · SUMMON IT",   d: "Copy-paste install commands. Zero homework, zero trivia." },
        { t: "III · FIRST WIN",  d: "The smallest useful thing, working in under a minute." },
        { t: "IV · GO FURTHER",  d: "Flags, options and little superpowers." },
        { t: "V · TROUBLESHOOT", d: "The most common ouchies — and their plasters." }
      ],
      effects: [
        "A sealed sigil becomes a full spread: spell card, manual, page number and deep link.",
        "Its INDEX entry stops being a ghost and lights up in green.",
        "The book's chapter count grows — and the pact continues."
      ],
      keys: [],
      tip: "Your project could be the one that breaks a seal. Propose it on GitHub — the index grows a new word."
    },

    link: { label: "propose a sigil on github", url: "https://github.com/onlyactions/onlyactions.github.io/issues" }
  }
};
