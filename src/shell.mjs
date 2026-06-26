// shell.mjs — die sichtbaren Suite-Komponenten. Framework-frei, geben HTML-Strings zurück.
// suiteTopbar ist SELBST-ENTHALTEN (Inline-Styles), passt ohne CSS-Import in jedes Studio.
// systemSection nutzt die baseCss-Klassen (für Studios, die das Fundament adoptieren).
import { MODULES, TOKENS } from './tokens.mjs';

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const dotClass = (s) => (s === 'ok' ? 'dot-ok' : s === 'warn' ? 'dot-warn' : s === 'fail' ? 'dot-fail' : 'dot-still');

const T = TOKENS;
const FONT = "'Plus Jakarta Sans',system-ui,-apple-system,'Segoe UI',sans-serif";
const STILL = '#C7C9C2';
const dotBg = (s) => (s === 'ok' ? T.ok : s === 'warn' ? T.warn : s === 'fail' ? T.fail : STILL);

// Persistente, selbst-enthaltene Suite-Topbar mit Modul-Switcher + Live-Status.
// Drop-in: ${suiteTopbar({ active, statusUrl })} ganz oben in den <body> jedes Studios.
//   active   : key des aktiven Moduls ('brain'|'crm'|'sales'|'finance'|'marketing')
//   statusUrl: URL von /business/api/status — färbt die Punkte clientseitig live
//   health   : optionaler Server-seitiger Startwert { <key>: 'ok'|'warn'|'fail'|'still' }
//   links    : { <key>: 'https://…' } überschreibt die Default-Modul-URLs
//   homeHref : Ziel der Wortmarke. Default: die Brain-Übersicht.
export function suiteTopbar({ active = '', health = {}, links = {}, homeHref = '', statusUrl = '', modules = MODULES } = {}) {
  const home = homeHref || (modules.find((m) => m.key === 'brain') || {}).href || '/';
  const dot = (key, st) => `<span data-mod="${esc(key)}" style="width:7px;height:7px;border-radius:999px;background:${dotBg(st)};display:inline-block"></span>`;
  const pills = modules.map((m) => {
    const cur = m.key === active;
    const st = health[m.key] || 'still';
    const href = links[m.key] || m.href;
    const base = 'display:inline-flex;align-items:center;gap:6px;border-radius:999px;padding:5px 11px;font-size:13px;text-decoration:none;white-space:nowrap;';
    const style = cur ? base + `background:${T.fg1};color:${T.onDark};font-weight:500;` : base + `color:${T.fg2};`;
    return `<a href="${esc(href)}" style="${style}"${cur ? ' aria-current="page"' : ''}>${esc(m.label)}${dot(m.key, st)}</a>`;
  }).join('');
  const summary = modules.map((m) => dot(m.key, health[m.key] || 'still')).join('');
  const live = statusUrl
    ? `<script>(function(){var C={ok:${JSON.stringify(T.ok)},warn:${JSON.stringify(T.warn)},fail:${JSON.stringify(T.fail)}};fetch(${JSON.stringify(statusUrl)}).then(function(r){return r.json()}).then(function(d){if(!d||!d.modules)return;document.querySelectorAll('[data-mod]').forEach(function(e){var s=d.modules[e.getAttribute('data-mod')];e.style.background=C[s]||${JSON.stringify(STILL)}})}).catch(function(){})})();</script>`
    : '';
  return `<header style="display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;padding:10px 16px;background:${T.surface};border-bottom:1px solid ${T.border};font-family:${FONT}">
  <a href="${esc(home)}" style="display:flex;align-items:center;gap:10px;text-decoration:none">
    <span style="width:22px;height:22px;border-radius:6px;background:${T.brand};color:${T.brandInk};display:inline-flex;align-items:center;justify-content:center;font-size:13px;font-weight:600">G</span>
    <span style="font-weight:600;color:${T.fg1};font-size:15px">Growlify</span>
    <span style="font-size:11px;color:${T.fg2};border:1px solid ${T.border};border-radius:999px;padding:1px 8px">Suite</span>
  </a>
  <nav aria-label="Module" style="display:flex;align-items:center;gap:4px;flex-wrap:wrap">${pills}</nav>
  <div style="display:flex;align-items:center;gap:8px;font-size:12px;color:${T.fg2}">
    <span>Gesundheit</span><span style="display:inline-flex;gap:3px">${summary}</span>
  </div>
</header>${live}`;
}

// Einheitliche System-Sektion: Feed + Gesundheit + Learnings. Nutzt baseCss-Klassen.
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
