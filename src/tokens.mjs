// tokens.mjs — die einzige Quelle der Design-Tokens für alle Studios.
// Werte sind in DESIGN.md begründet. Studios binden NICHT eigene Hex-Werte ein,
// sondern ziehen baseCss() aus index.mjs (das diese Tokens als :root setzt).

export const TOKENS = {
  bg: '#F8F8F4',
  surface: '#FFFFFF',
  surface2: '#F2F2EC',
  fg1: '#18221B',
  fg2: '#5B6660',
  fg3: '#8A938D',
  border: '#E7E7DF',
  brand: '#13E489',
  brandInk: '#04342C',
  accent: '#23B2CF',
  onDark: '#F8F8F4',
  ok: '#13E489',
  warn: '#EF9F27',
  fail: '#E24B4A',
};

// Als CSS-Custom-Properties (kurze Aliasse, wie in den bestehenden Studios genutzt).
export function tokenVars() {
  const t = TOKENS;
  return `
    --bg:${t.bg}; --surface:${t.surface}; --surface2:${t.surface2};
    --fg1:${t.fg1}; --fg2:${t.fg2}; --fg3:${t.fg3}; --border:${t.border};
    --brand:${t.brand}; --brandInk:${t.brandInk}; --accent:${t.accent}; --onDark:${t.onDark};
    --ok:${t.ok}; --warn:${t.warn}; --fail:${t.fail};
    --radius:10px; --radius-sm:8px;
    --font:'Plus Jakarta Sans',system-ui,-apple-system,'Segoe UI',sans-serif;
    --font-mono:'Spline Sans Mono',ui-monospace,'SF Mono',Menlo,monospace;`;
}

// Die fünf Module der Suite in fester Reihenfolge. Brain ist das Herz (erste Position).
// Default-Links auf die echten Studio-URLs (Stand 2026-06-26). Pro Studio via
// suiteTopbar({ links }) überschreibbar, falls eine sslip-URL sich ändert.
export const MODULES = [
  { key: 'brain',     label: 'Brain',     href: 'http://sfb9da0vaien08of59th70v7.178.104.27.120.sslip.io/business', heart: true },
  { key: 'crm',       label: 'CRM',       href: 'https://crm.growlify.de/crm' },
  { key: 'sales',     label: 'Sales',     href: 'https://sales.growlify.de/sales' },
  { key: 'finance',   label: 'Finance',   href: 'http://r8leuypcokdl0i4trzttdley.178.104.27.120.sslip.io/finance/studio/' },
  { key: 'marketing', label: 'Marketing', href: 'http://llinuw3wwim696zelbsezt24.178.104.27.120.sslip.io/content/studio/' },
];
