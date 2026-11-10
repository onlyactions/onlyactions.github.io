/* ==========================================================================
   TOON TABLE OF CONTENTS — js/data.js
   --------------------------------------------------------------------------
   THE DECK — one card per repository, baked from the live GitHub API.

   Every number below is REAL, measured by the projects' own daily pipelines
   (bind of 2026-11-10). The ATK / DEF printed on a card are the project's
   actual power stats:
     · vpngate-monitor  ATK = servers really tunnel-tested · DEF = proven alive
     · proxy-scanner    ATK = proxies really tested        · DEF = verified exits
     · the-button       ATK ?  DEF ?  — unknowable, like the gods
     · this deck        ATK 9000 · DEF 9000

   The links objects hold only links that verifiably exist.
   ========================================================================== */

window.DECK = {

  brand    : "ONLYACTIONS",
  title    : "TOON TABLE OF CONTENTS",
  tagline  : "every repository, bound as a summonable card — real numbers, real links, one click from card to code.",
  volume   : "VOL. I — POWER EDITION",
  edition  : "DECK BUILD 2",
  bound    : "2026-11-10",
  press    : "the toons are watching",
  owner    : "onlyactions",
  repo     : "https://github.com/onlyactions",
  repoSite : "https://onlyactions.github.io",
  issues   : "https://github.com/onlyactions/onlyactions.github.io/issues",

  cards: [

    /* ---------------- THE DECK ITSELF ---------------- */
    {
      id    : "toc",
      repo  : "onlyactions.github.io",
      name  : "TOON TABLE OF CONTENTS",
      tag   : "YOU ARE HERE",
      type  : "FIELD SPELL",
      lang  : "CSS",
      glyph : "book",
      colorA: "#2c8f5c",
      colorB: "#0d2b1e",
      atk   : "9000",
      def   : "9000",
      lore  : "The deck itself. Every repository in the set bound as a card — searchable, inspectable, one click from card to code. While this card is on the field, nothing is more than one click away.",
      topics: ["github-pages", "table-of-contents", "vanilla-js"],
      pushed: "2026-11-10",
      created: "2026-10-31",
      links : [
        { label: "OPEN REPO",    url: "https://github.com/onlyactions/onlyactions.github.io" },
        { label: "ISSUES",       url: "https://github.com/onlyactions/onlyactions.github.io/issues" }
      ],
      statline: "YOU ARE HOLDING IT",
      here: true
    },

    /* ---------------- THE WATCHER ---------------- */
    {
      id    : "vpngate-monitor",
      repo  : "vpngate-monitor",
      name  : "VPN GATE MONITOR",
      tag   : "DAILY RITUAL",
      type  : "CONTINUOUS TRAP · OPENVPN",
      lang  : "Python",
      glyph : "eye",
      colorA: "#1f6f8b",
      colorB: "#0b1f2e",
      atk   : "442",
      def   : "205",
      lore  : "Once a day it fetches the complete public VPN Gate server list, then does the part that matters: opens a REAL OpenVPN tunnel to every single listed server, proves the traffic exits through it, checks where, and measures real throughput. A living report — no hand-edited numbers.",
      topics: ["vpn", "openvpn", "vpngate", "monitor", "security-audit", "github-actions"],
      pushed: "2026-11-10",
      created: "2026-11-06",
      links : [
        { label: "OPEN REPO",     url: "https://github.com/onlyactions/vpngate-monitor" },
        { label: "LIVING REPORT", url: "https://github.com/onlyactions/vpngate-monitor#latest-results" },
        { label: "ACTION RUNS",   url: "https://github.com/onlyactions/vpngate-monitor/actions/workflows/vpngate.yml" },
        { label: "ISSUES",        url: "https://github.com/onlyactions/vpngate-monitor/issues" }
      ],
      statline: "442 TESTED · 205 ALIVE · 68.4% USABLE · 12.6 Mbps AVG"
    },

    /* ---------------- THE HARVESTER ---------------- */
    {
      id    : "proxy-scanner",
      repo  : "proxy-scanner",
      name  : "PROXY SCANNER",
      tag   : "DAILY RITUAL",
      type  : "CONTINUOUS SPELL · XRAY",
      lang  : "Python",
      glyph : "globe",
      colorA: "#7a5cff",
      colorB: "#1d1240",
      atk   : "4511",
      def   : "1052",
      lore  : "Harvests 178,555 unique proxies a day from 173 URL subscriptions + 81 Telegram channels across 9 protocols, loads every one into a real Xray / sing-box tunnel, and keeps only the exits whose egress IP verifiably changes — ranked subscriptions, published fresh.",
      topics: ["proxy", "xray", "sing-box", "hysteria2", "v2ray", "trojan", "clash", "free-proxy", "github-actions"],
      pushed: "2026-11-10",
      created: "2026-11-06",
      links : [
        { label: "OPEN REPO",      url: "https://github.com/onlyactions/proxy-scanner" },
        { label: "SUBSCRIPTIONS",  url: "https://github.com/onlyactions/proxy-scanner/tree/main/subs" },
        { label: "LIVING REPORT",  url: "https://github.com/onlyactions/proxy-scanner#what-this-is" },
        { label: "ACTION RUNS",    url: "https://github.com/onlyactions/proxy-scanner/actions" },
        { label: "ISSUES",         url: "https://github.com/onlyactions/proxy-scanner/issues" }
      ],
      statline: "178,555 HARVESTED · 4,511 TESTED · 1,052 WORKING · 51 COUNTRIES"
    },

    /* ---------------- THE ARTIFACT ---------------- */
    {
      id    : "the-button",
      repo  : "the-button",
      name  : "THE BUTTON",
      tag   : "SUMMONED ARTIFACT",
      type  : "EFFECT MONSTER · GIO",
      lang  : "Go",
      glyph : "power",
      colorA: "#c94040",
      colorB: "#3a0d18",
      atk   : "?",
      def   : "?",
      lore  : "A button. It is a circle, with a power symbol. Click it: it turns from red (off) to green (on) and back. That is all. One pure-Go codebase for Linux, Windows, Android and the Web — damped-spring press, breathing halo, engraved glyph.",
      topics: ["go", "gio", "gui", "wasm"],
      pushed: "2026-11-04",
      created: "2026-11-01",
      links : [
        { label: "OPEN REPO",   url: "https://github.com/onlyactions/the-button" },
        { label: "RELEASES",    url: "https://github.com/onlyactions/the-button/releases/latest" },
        { label: "ISSUES",      url: "https://github.com/onlyactions/the-button/issues" }
      ],
      statline: "v0.0.7 · LINUX · WINDOWS · ANDROID · WEB"
    }
  ]
};
