// shell.mjs — die sichtbaren Suite-Komponenten. Framework-frei, geben HTML-Strings zurück.
// Styles kommen aus baseCss() (index.mjs), hier nur Markup mit den Shell-Klassen.
import { MODULES } from './tokens.mjs';

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const dotClass = (s) => (s === 'ok' ? 'dot-ok' : s === 'warn' ? 'dot-warn' : s === 'fail' ? 'dot-fail' : 'dot-still');

// Persistente Suite-Topbar mit Modul-Switcher + Live-Status.
//   active : key des aktiven Moduls ('brain'|'crm'|'sales'|'finance'|'marketing')
//   health : { <key>: 'ok'|'warn'|'fail'|'still' } aus system_health (fehlt = 'still')
//   links  : { <key>: 'https://…' } absolute Modul-URLs (Cross-Domain). Fehlt = relativer href.
//   homeHref : Ziel der Wortmarke (Suite-Übersicht). Default '/'.
export function suiteTopbar({ active = '', health = {}, links = {}, homeHref = '/', modules = MODULES } = {}) {
  const pills = modules.map((m) => {
    const cur = m.key === active;
    const st = health[m.key] || 'still';
    const href = links[m.key] || m.href;
    return `<a class="pill" href="${esc(href)}"${cur ? ' aria-current="page"' : ''}>`
      + `${esc(m.label)}<span class="dot ${dotClass(st)}" aria-hidden="true"></span>`
      + `<span class="sr-only"> Status ${esc(st)}</span></a>`;
  }).join('');
  const ok = modules.filter((m) => (health[m.key] || 'still') === 'ok').length;
  const dots = modules.map((m) => `<span class="dot ${dotClass(health[m.key] || 'still')}"></span>`).join('');
  return `<header class="suite-topbar">
  <a class="suite-brand" href="${esc(homeHref)}" style="text-decoration:none">
    <span class="mark">G</span><span>Growlify</span><span class="tag">Suite</span>
  </a>
  <nav class="suite-switch" aria-label="Module">${pills}</nav>
  <div class="suite-health" title="${ok} von ${modules.length} Modulen gesund">
    <span>Gesundheit</span><span style="display:inline-flex;gap:3px">${dots}</span>
  </div>
</header>`;
}

// Einheitliche System-Sektion: Feed (system_log) + Gesundheit (eigene Checks) + Learnings/Insights.
//   feed      : [{ message, meta }]
//   health    : { status:'ok'|'warn'|'fail', checks:[{name, value, ok}] }
//   learnings : [{ tag, text }]
export function systemSection({ feed = [], health = { status: 'still', checks: [] }, learnings = [] } = {}) {
  const feedRows = feed.length
    ? feed.map((f) => `<div class="sys-row"><span style="color:var(--fg1)">${esc(f.message)}</span><span>${esc(f.meta || '')}</span></div>`).join('')
    : `<div class="sys-row">Noch keine Ereignisse. Sobald das Studio läuft, erscheinen sie hier.</div>`;
  const hb = health.status === 'ok' ? 'ok' : health.status === 'warn' ? 'warn' : health.status === 'fail' ? 'fail' : 'still';
  const healthBadge = `<span class="pill" style="margin-left:auto;cursor:default"><span class="dot ${dotClass(hb)}"></span>${esc(health.status)} · ${health.checks.length} Checks</span>`;
  const checkRows = health.checks.length
    ? health.checks.map((c) => `<div class="sys-row"><span>${esc(c.name)}</span><span class="num" style="color:${c.ok ? 'var(--brandInk)' : 'var(--fail)'}">${esc(c.value)}</span></div>`).join('')
    : `<div class="sys-row">Health-Reporter noch nicht aktiv.</div>`;
  const learnRows = learnings.length
    ? learnings.map((l) => `<div class="sys-row" style="display:block">${l.tag ? `<span style="font-size:11px;color:var(--brandInk);background:#E1F5EE;border-radius:4px;padding:0 6px;margin-right:6px">${esc(l.tag)}</span>` : ''}<span style="color:var(--fg1)">${esc(l.text)}</span></div>`).join('')
    : `<div class="sys-row">Noch keine Erkenntnisse erfasst.</div>`;
  return `<section class="sys-grid">
  <div class="sys-card"><div class="sys-head">Feed</div>${feedRows}</div>
  <div class="sys-card"><div class="sys-head">Gesundheit${healthBadge}</div>${checkRows}</div>
  <div class="sys-card"><div class="sys-head">Learnings</div>${learnRows}</div>
</section>`;
}
