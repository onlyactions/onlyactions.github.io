/* ==========================================================================
   TOON TABLE OF CONTENTS — js/content.js
   --------------------------------------------------------------------------
   THE ONLY FILE YOU TOUCH TO GROW THE GRIMOIRE.

   One chapter block becomes, automatically:
     · a rainbow entry in the INDEX (the ToC)
     · a monster card page  (left page  of its spread)
     · a manual page        (right page of its spread)
     · a gold bookmark tab on the edge of the book

   No framework. No build step. Edit -> commit -> GitHub Pages re-binds the book.
   ========================================================================== */

window.BOOK = {

  /* --------------------------- the grimoire --------------------------- */
  brand   : "ONLYACTIONS",
  title   : "TOON TABLE OF CONTENTS",
  tagline : "the living grimoire of every OnlyActions project — a table of contents with teeth.",
  volume  : "VOL. I — POWER EDITION",
  edition : "FIRST EDITION",
  press   : "the toons are watching",
  owner   : "onlyactions",
  repo    : "https://github.com/onlyactions",
  repoSite: "https://onlyactions.github.io",

  /* --------------------------- the chapters ---------------------------
     status: "live"  -> full card + manual, clickable INDEX entry
     status: "sealed"-> silhouette card, ritual reserved             */
  chapters: [

    /* ================================================================
       CHAPTER I — this grimoire itself
       ================================================================ */
    {
      id     : "grimoire",
      num    : "I",
      tab    : "GRIMOIRE",
      name   : "TOON GRIMOIRE",
      type   : "TOON / SPELLBOOK · EFFECT",
      art    : "book",                       // built-in artwork key
      atk    : "9000",
      def    : "9000",
      cap    : "Card art: the original index, first summoned in ToonTableOfContents.png",
      lore   : "The living index of every OnlyActions tool. While this card remains on the field, no chapter is ever lost, every page turns in full 3D, and the whole screen becomes the book. This card cannot be silenced.",
      status : "live",
      color  : "#37d67a",

      manual: {
        title: "How to Wield It",
        summon: [
          { t: "Activate the card",
            d: "You already did. That flash of light was page one — the grimoire opens itself across the entire screen." },
          { t: "Read the INDEX",
            d: "The rainbow page is your table of contents. Every entry is clickable and its page number is real — no fake links in this book." },
          { t: "Move like a duelist",
            d: "Arrow keys, swipes, page corners or the gold tabs on the edge. Four weapons, one hand." }
        ],
        effects: [
          "The book IS the screen — no tiny widget, no boxed section. 96% of your viewport is page.",
          "Gold bookmark tabs on the right edge teleport to any chapter instantly.",
          "Press G for the card gallery: every project rendered as a summonable card.",
          "Every spread has its own URL — copy the address bar mid-book and land a friend exactly there.",
          "Dueling sounds are synthesized live in WebAudio. Zero audio files. Mute with one key."
        ],
        keys: [
          ["→ / ←", "turn pages"], ["G", "card gallery"], ["F", "fullscreen"],
          ["M", "mute / unmute"], ["ESC", "back to the arena"]
        ],
        tip: "Press M right now. Then press it again — the toons get sad when muted."
      },

      link: { label: "inspect the source grimoire", url: "https://github.com/onlyactions/onlyactions.github.io" }
    },

    /* ================================================================
       CHAPTER II — the sealed sigils (future projects live here)
       ================================================================ */
    {
      id     : "unsummoned",
      num    : "II",
      tab    : "UN-SUMMONED",
      name   : "THE UN-SUMMONED",
      type   : "TOON · FIELD SPELL",
      art    : "sigils",                      // silhouette grid artwork
      atk    : "???",
      def    : "???",
      cap    : "Six sigils read straight from the original artwork's index",
      sigils : [
        { name: "DRAGON",   code: "372" },
        { name: "GIANT",    code: "418" },
        { name: "RAT",      code: "492" },
        { name: "GODDESS",  code: "514" },
        { name: "MONSTER",  code: "629" },
        { name: "BEAST",    code: "721" }
      ],
      lore   : "Six sigils sleep in the index — DRAGON, GIANT, RAT, GODDESS, MONSTER, BEAST. Each one is a project waiting for its summoning. Ship a tool, speak its name in js/content.js, and a silhouette becomes a card with your manual printed on its back.",
      status : "sealed",
      color  : "#8f6bff",

      manual: {
        title: "The Summoning Mold",
        intro: "Every future chapter follows one fixed ritual, so every manual in this book reads the same and no reader is ever lost:",
        summon: [
          { t: "MEET IT",      d: "What the tool is, in one hard-hitting breath." },
          { t: "SUMMON IT",    d: "Copy-paste install commands. Zero homework, zero trivia." },
          { t: "FIRST WIN",    d: "The smallest useful thing, working in under a minute." },
          { t: "GO FURTHER",   d: "Flags, options and little superpowers." },
          { t: "TROUBLESHOOT", d: "The three most common ouchies — and their plasters." }
        ],
        effects: [
          "Your project's card gets its own ATK/DEF, its own holo shine and its own tab.",
          "Its INDEX entry lights up in the rainbow and stops being a ghost.",
          "Its manual page is generated from the same five-move mold above."
        ],
        keys: [],
        tip: "Your project could be the one that breaks a seal. Ship it — the index grows a new rainbow word."
      },

      link: { label: "propose a sigil on github", url: "https://github.com/onlyactions/onlyactions.github.io/issues" }
    }
  ]
};
