// system.mjs — der einheitliche System-Reiter der Suite (v2, Vorlage: Sales Studio).
// Framework-frei, selbst-enthalten: systemCss() bringt alle Styles mit (gsys-Präfix,
// keine Abhängigkeit von Studio-CSS-Variablen), systemSection() rendert die Trias
// Gesundheit + Feed + Learnings plus Anbindungen/Roadmap und Doku-Link.
//
// Zwei Betriebsarten:
//   server-gerendert : Daten direkt übergeben (health/feed/learnings als Arrays).
//   hydrate          : statische Studios (Finance/Marketing) übergeben URLs; die Sektion
//                      rendert Skelette und holt sich die Zeilen clientseitig. Vertrag:
//                      feedUrl      → { items: [{ ts, art, message }] }
//                      healthUrl    → { checks: [{ name, target, ok, status, checkedAt }] }
//                      learningsUrl → { items: [{ ts, kategorie, statement, meta }] }
import { TOKENS } from './tokens.mjs';
import { icon } from './components.mjs';

const T = TOKENS;
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// Ereignis-Arten des system_log, suite-weit einheitlich beschriftet.
export const ART_LABEL = {
  event: 'Ereignis', change: 'Änderung', deploy: 'Deploy', health: 'Health',
  learning: 'Learning', escalation: 'Eskalation', ingest: 'Eingang', route: 'Routing', fehler: 'Fehler',
};

const ROADMAP_PILL = {
  live: ['#1f9d57', 'live'], 'in-arbeit': ['#C2870A', 'in Arbeit'],
  geplant: ['#8a93a0', 'geplant'], 'später': ['#8a93a0', 'später'],
};

export function fmtDe(d) {
  if (!d) return '—';
  try {
    return new Intl.DateTimeFormat('de-DE', {
      timeZone: 'Europe/Berlin', day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit',
    }).format(new Date(d)).replace(',', ' ·');
  } catch { return String(d); }
}

// Selbst-enthaltenes CSS (Hex statt Variablen, damit es in JEDEM Studio identisch aussieht,
// unabhängig davon, welche :root-Namen dort historisch existieren).
export function systemCss() {
  return `<style>
.gsys{max-width:1100px}
.gsys h1{font-weight:600;letter-spacing:-0.02em;margin:0 0 .3em}
.gsys .gsys-intro{color:${T.fg2};margin:0 0 22px;font-size:14px}
.gsys-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;align-items:start;margin-bottom:20px}
@media(max-width:760px){.gsys-grid{grid-template-columns:1fr}}
.gsys-card{background:${T.surface};border:1px solid ${T.border};border-radius:10px;padding:18px}
.gsys-card h3{display:flex;align-items:center;gap:8px;font-size:14.5px;font-weight:600;margin:0 0 12px;color:${T.fg1}}
.gsys-card h3 .ic{width:17px;height:17px;color:${T.fg2}}
.gsys-hint{color:${T.fg2};margin:0 0 10px;font-size:12.5px}
.gsys-empty{color:${T.fg2};font-size:13px;margin:0}
.gsys-tab-wrap{overflow-x:auto;-webkit-overflow-scrolling:touch}
table.gsys-tab{border-collapse:collapse;width:100%;font-size:13px}
table.gsys-tab th{text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:.04em;color:${T.fg3};padding:6px 10px;border-bottom:1px solid ${T.border};background:none}
table.gsys-tab td{padding:9px 10px;border-bottom:1px solid ${T.surface2};vertical-align:top;border-top:0}
table.gsys-tab tr:last-child td{border-bottom:0}
.gsys-dot{display:inline-block;width:9px;height:9px;border-radius:50%;vertical-align:baseline}
.gsys-feed{max-height:280px;overflow-y:auto;border:1px solid ${T.border};border-radius:8px}
.gsys-frow{display:flex;gap:10px;align-items:baseline;padding:9px 12px;border-bottom:1px solid ${T.surface2};font-size:13px}
.gsys-frow:last-child{border-bottom:0}
.gsys-fa{font-size:11px;font-weight:600;color:${T.fg3};width:80px;flex:none}
.gsys-fm{flex:1;color:${T.fg1}}
.gsys-ft{font-size:11px;color:${T.fg3};white-space:nowrap}
.gsys-badge{display:inline-block;font-size:11px;font-weight:600;border-radius:4px;padding:1px 7px}
.gsys-badge.system{background:#DDF1F6;color:#0E5E72}
.gsys-badge.inhalt{background:#E1F5EE;color:#0a7d4d}
.gsys-meta{font-size:11px;color:${T.fg3};margin-top:3px}
.gsys-pill{display:inline-block;font-size:10.5px;font-weight:700;padding:2px 9px;border-radius:20px;white-space:nowrap}
.gsys-rrow{display:flex;gap:12px;align-items:center;padding:9px 0;border-bottom:1px solid ${T.surface2}}
.gsys-rrow:last-child{border-bottom:0}
.gsys-rrow strong{font-size:13.5px;color:${T.fg1}}
.gsys-rrow .gsys-rdesc{color:${T.fg2};font-size:12px}
.gsys-doc-btn{display:inline-block;background:${T.fg1};color:${T.onDark};padding:9px 16px;border-radius:8px;font-size:13px;font-weight:600;text-decoration:none}
.gsys details.gsys-fold{background:${T.surface};border:1px solid ${T.border};border-radius:10px;margin-bottom:20px}
.gsys details.gsys-fold summary{display:flex;align-items:center;gap:8px;cursor:pointer;list-style:none;padding:14px 18px;font-weight:600;font-size:14.5px;color:${T.fg1}}
.gsys details.gsys-fold summary::-webkit-details-marker{display:none}
.gsys details.gsys-fold summary .ic{width:17px;height:17px;color:${T.fg2}}
.gsys details.gsys-fold summary .gsys-x{margin-left:auto;color:${T.fg3};font-weight:400}
.gsys details.gsys-fold[open] summary .gsys-x{transform:rotate(45deg)}
.gsys details.gsys-fold .gsys-fold-body{padding:0 18px 16px}
</style>`;
}

const dot = (ok) => `<span class="gsys-dot" style="background:${ok ? T.ok : T.fail}"></span>`;

export function healthRows(checks, fmt = fmtDe) {
  return checks.map((c) => `<tr><td>${esc(c.name)}</td><td style="color:${T.fg2}">${esc(c.target ?? '—')}</td><td>${dot(!!c.ok)} ${esc(c.status ?? (c.ok ? 'ok' : 'Fehler'))}</td><td style="color:${T.fg2};white-space:nowrap">${esc(c.checkedAt ? fmt(c.checkedAt) : fmt(new Date()))}</td></tr>`).join('');
}

export function feedRows(items, fmt = fmtDe) {
  return items.map((e) => `<div class="gsys-frow"><span class="gsys-fa">${esc(ART_LABEL[e.art] || e.art || 'Ereignis')}</span><span class="gsys-fm">${esc(e.message)}</span><span class="gsys-ft">${esc(fmt(e.ts))}</span></div>`).join('');
}

export function learningRows(items, fmt = fmtDe) {
  return items.map((l) => `<tr><td style="color:${T.fg2};white-space:nowrap">${esc(fmt(l.ts))}</td><td><span class="gsys-badge ${l.kategorie === 'system' ? 'system' : 'inhalt'}">${esc(l.kategorie || 'inhalt')}</span></td><td>${esc(l.statement)}${l.meta ? `<div class="gsys-meta">${esc(l.meta)}</div>` : ''}</td></tr>`).join('');
}

const foldWrap = (title, body, ic = 'bulb', open = false) =>
  `<details class="gsys-fold"${open ? ' open' : ''}><summary>${icon(ic)}<span>${esc(title)}</span><span class="gsys-x" aria-hidden="true">+</span></summary><div class="gsys-fold-body">${body}</div></details>`;

// Der einheitliche System-Reiter. Gibt die komplette Sektion inkl. CSS zurück; das Studio
// setzt sie in sein Layout (unter den eigenen Header) und liefert die Daten.
export function systemSection({
  intro = 'Gesundheit der Anbindungen, der Feed (was passiert) und die Learnings dieses Studios.',
  health = [],
  feed = [],
  learnings = null,       // { items, note, href, hrefLabel } — note+href statt items, wenn Learnings woanders leben
  roadmap = [],
  docs = null,            // { href, label }
  hydrate = null,         // { feedUrl, healthUrl, learningsUrl }
  fmt = fmtDe,
  heading = 'System',
} = {}) {
  const h = hydrate || {};

  const healthBody = health.length || h.healthUrl
    ? `<div class="gsys-tab-wrap"><table class="gsys-tab"><thead><tr><th>Dienst</th><th>Ziel</th><th>Status</th><th>Geprüft</th></tr></thead><tbody data-gsys="health">${healthRows(health, fmt)}</tbody></table></div>`
    : `<p class="gsys-empty">Health-Checks noch nicht angebunden.</p>`;
  const healthHtml = `<div class="gsys-card"><h3>${icon('check')}Systemgesundheit · Anbindungen</h3>${healthBody}</div>`;

  const feedBody = feed.length
    ? `<div class="gsys-feed" data-gsys="feed">${feedRows(feed, fmt)}</div>`
    : `<div class="gsys-feed" data-gsys="feed" ${h.feedUrl ? '' : 'hidden '}></div>${h.feedUrl ? '' : '<p class="gsys-empty">Noch keine Einträge.</p>'}`;
  const feedHtml = `<div class="gsys-card"><h3>${icon('activity')}Feed · was passiert</h3>${feedBody}</div>`;

  let lrnHtml = '';
  if (learnings && (learnings.note || learnings.href) && !(learnings.items || []).length && !h.learningsUrl) {
    lrnHtml = `<div class="gsys-card" style="margin-bottom:20px"><h3>${icon('bulb')}Learnings</h3><p class="gsys-hint" style="margin:0">${esc(learnings.note || '')}${learnings.href ? ` <a href="${esc(learnings.href)}">${esc(learnings.hrefLabel || 'Zu den Learnings →')}</a>` : ''}</p></div>`;
  } else if (learnings || h.learningsUrl) {
    const items = (learnings && learnings.items) || [];
    const body = `<div class="gsys-tab-wrap"><table class="gsys-tab"><thead><tr><th>Datum</th><th>Kategorie</th><th>Learning</th></tr></thead><tbody data-gsys="learnings">${learningRows(items, fmt)}</tbody></table></div>`;
    lrnHtml = foldWrap(`Learnings · System und Inhalt${items.length ? ' · ' + items.length : ''}`, items.length || h.learningsUrl ? body : '<p class="gsys-empty">Noch keine Learnings.</p>', 'bulb');
  }

  const pill = (s) => { const m = ROADMAP_PILL[s] || ['#8a93a0', s]; return `<span class="gsys-pill" style="background:${m[0]}1a;color:${m[0]}">${esc(m[1])}</span>`; };
  const roadmapHtml = roadmap.length
    ? `<div class="gsys-card"><h3>${icon('share')}Anbindungen &amp; Roadmap</h3><p class="gsys-hint">Was angebunden ist und was als Nächstes kommt.</p>${roadmap.map((r) => `<div class="gsys-rrow"><div style="flex:1"><strong>${esc(r.name)}</strong><div class="gsys-rdesc">${esc(r.desc || '')}</div></div>${pill(r.status)}</div>`).join('')}</div>`
    : '';
  const docsHtml = docs
    ? `<div class="gsys-card"><h3>${icon('book')}Dokumentation</h3><p class="gsys-hint">Wie dieses Studio funktioniert, technisch und aus Nutzersicht.</p><a class="gsys-doc-btn" href="${esc(docs.href)}">📖 ${esc(docs.label || 'Handbuch öffnen')} →</a></div>`
    : '';
  const bottom = roadmapHtml || docsHtml ? `<div class="gsys-grid">${roadmapHtml}${docsHtml}</div>` : '';

  const hydrateScript = (h.feedUrl || h.healthUrl || h.learningsUrl) ? `<script>(function(){
var esc=function(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})};
var AL=${JSON.stringify(ART_LABEL)};
var fmt=function(d){try{return new Intl.DateTimeFormat('de-DE',{timeZone:'Europe/Berlin',day:'2-digit',month:'2-digit',year:'2-digit',hour:'2-digit',minute:'2-digit'}).format(new Date(d)).replace(',',' ·')}catch(e){return String(d||'—')}};
var q=function(k){return document.querySelector('[data-gsys="'+k+'"]')};
${h.feedUrl ? `fetch(${JSON.stringify(h.feedUrl)}).then(function(r){return r.json()}).then(function(d){var el=q('feed');if(!el||!d||!d.items)return;el.hidden=false;el.innerHTML=d.items.map(function(e){return '<div class="gsys-frow"><span class="gsys-fa">'+esc(AL[e.art]||e.art||'Ereignis')+'</span><span class="gsys-fm">'+esc(e.message)+'</span><span class="gsys-ft">'+esc(fmt(e.ts))+'</span></div>'}).join('')||'<div class="gsys-frow"><span class="gsys-fm">Noch keine Einträge.</span></div>'}).catch(function(){});` : ''}
${h.healthUrl ? `fetch(${JSON.stringify(h.healthUrl)}).then(function(r){return r.json()}).then(function(d){var el=q('health');if(!el||!d||!d.checks)return;el.innerHTML=d.checks.map(function(c){return '<tr><td>'+esc(c.name)+'</td><td style="color:${T.fg2}">'+esc(c.target||'—')+'</td><td><span class="gsys-dot" style="background:'+(c.ok?${JSON.stringify(T.ok)}:${JSON.stringify(T.fail)})+'"></span> '+esc(c.status||(c.ok?'ok':'Fehler'))+'</td><td style="color:${T.fg2};white-space:nowrap">'+esc(fmt(c.checkedAt||Date.now()))+'</td></tr>'}).join('')}).catch(function(){});` : ''}
${h.learningsUrl ? `fetch(${JSON.stringify(h.learningsUrl)}).then(function(r){return r.json()}).then(function(d){var el=q('learnings');if(!el||!d||!d.items)return;el.innerHTML=d.items.map(function(l){return '<tr><td style="color:${T.fg2};white-space:nowrap">'+esc(fmt(l.ts))+'</td><td><span class="gsys-badge '+(l.kategorie==='system'?'system':'inhalt')+'">'+esc(l.kategorie||'inhalt')+'</span></td><td>'+esc(l.statement)+(l.meta?'<div class="gsys-meta">'+esc(l.meta)+'</div>':'')+'</td></tr>'}).join('')}).catch(function(){});` : ''}
})();</script>` : '';

  return `<div class="gsys">${systemCss()}
<h1>${esc(heading)}</h1><p class="gsys-intro">${esc(intro)}</p>
<div class="gsys-grid">${healthHtml}${feedHtml}</div>
${lrnHtml}
${bottom}
${hydrateScript}</div>`;
}
