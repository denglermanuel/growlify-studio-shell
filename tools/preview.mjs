// preview.mjs — rendert eine Demo-Seite mit der echten Shell, zum Browser-Check.
import { writeFileSync } from 'node:fs';
import { baseCss, suiteTopbar, systemSection } from '../src/index.mjs';

const health = {};
const statusUrl = 'http://sfb9da0vaien08of59th70v7.178.104.27.120.sslip.io/business/api/status';

const page = `<!doctype html><html lang="de"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Suite-Shell Vorschau</title><style>${baseCss()}</style></head>
<body>
${suiteTopbar({ active: 'finance', health, statusUrl })}
<div style="display:flex;align-items:center;gap:18px;padding:13px 18px 0;border-bottom:1px solid var(--border);background:var(--surface2)">
  <span style="font-weight:600;font-size:16px;padding-bottom:11px">Finance</span>
  <span class="muted" style="font-size:13px;padding-bottom:13px">Überblick</span>
  <span class="muted" style="font-size:13px;padding-bottom:13px">Dashboard</span>
  <span class="muted" style="font-size:13px;padding-bottom:13px">Buchhaltung</span>
  <span style="font-size:13px;font-weight:500;padding-bottom:11px;border-bottom:2px solid var(--brand)">System</span>
</div>
<main style="padding:18px;max-width:1120px;margin:0 auto">
${systemSection({
  feed: [
    { message: 'Beleg-Sync · 18 geprüft', meta: 'vor 3 h' },
    { message: 'Zuordnung gelernt: Anthropic → KI Impact', meta: 'vor 5 h' },
    { message: 'Health ans Brain gemeldet', meta: 'vor 3 h' },
  ],
  health: { status: 'ok', checks: [
    { name: 'tx ohne Kategorie', value: '0', ok: true },
    { name: 'tx ohne Entity', value: '0', ok: true },
    { name: 'Learning ohne Quelle', value: '0', ok: true },
    { name: 'Sync-Frische < 36 h', value: 'ok', ok: true },
  ] },
  learnings: [
    { tag: 'liquiditaet', text: 'USt-Topf separat führen' },
    { tag: 'system', text: 'Qonto = primäre Wahrheit' },
    { tag: 'kosten', text: 'Anthropic teils auf marcus@' },
  ],
})}
</main>
</body></html>`;

writeFileSync(new URL('../preview.html', import.meta.url), page);
console.log('preview.html geschrieben (' + page.length + ' Zeichen)');
