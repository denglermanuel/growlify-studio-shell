// index.mjs — öffentliche API der Suite-Shell.
// Framework-frei: jede Funktion gibt einen HTML-String zurück. Studios rendern server-seitig.
//
// Stand 0.1.0: Tokens + baseCss sind final (Design-Spec freigegeben-fähig).
// suiteTopbar() / systemSection() folgen nach Freigabe der visuellen Richtung (siehe DESIGN.md §5).

import { tokenVars, MODULES } from './tokens.mjs';

export { TOKENS, MODULES } from './tokens.mjs';

// Das gemeinsame CSS-Fundament: Tokens als :root + ruhiger Reset + Basistypo.
// Studios binden das EINMAL im <head> ein, statt eigene <style>-Blöcke zu pflegen.
export function baseCss() {
  return `:root{${tokenVars()}}
*{box-sizing:border-box}
html,body{margin:0}
body{background:var(--bg);color:var(--fg1);font-family:var(--font);font-size:15px;line-height:1.6;-webkit-font-smoothing:antialiased}
a{color:var(--accent);text-decoration:none}
a:hover{text-decoration:underline}
h1,h2,h3{font-weight:600;letter-spacing:-0.02em;line-height:1.15;margin:0 0 .4em}
.card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:20px}
.muted{color:var(--fg2)}
.dot{width:8px;height:8px;border-radius:999px;display:inline-block}
.dot-ok{background:var(--ok)} .dot-warn{background:var(--warn)} .dot-fail{background:var(--fail)}
:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}`;
}

// Platzhalter-Export, damit Consumer schon importieren können. Implementierung nach Design-Freigabe.
export function suiteTopbar() {
  throw new Error('suiteTopbar() folgt nach Freigabe der visuellen Richtung (DESIGN.md §5).');
}
export { MODULES as modules };
