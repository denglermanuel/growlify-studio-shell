// syslog.mjs — der geteilte system_log-Helfer (bisher in jedem Studio dupliziert).
// Kein pg-Import: der Aufrufer übergibt einen offenen DB-Client (node-postgres-kompatibel,
// d.h. ein Objekt mit .query()). Fehler werden geschluckt: das Log darf nie den Hauptpfad brechen.

// Tabelle sicherstellen (idempotent). Einmal beim Studio-Start aufrufen.
export async function ensureSyslog(c) {
  if (!c) return;
  try {
    await c.query(`create table if not exists system_log (
      id bigserial primary key,
      tenant_id text not null,
      ts timestamptz not null default now(),
      art text not null default 'event',
      actor text not null default 'system',
      message text not null,
      detail jsonb
    )`);
    await c.query('create index if not exists system_log_ts on system_log using brin (ts)');
  } catch { /* Log darf nie blockieren */ }
}

// Ein Ereignis schreiben. art: event|change|deploy|health|learning|escalation|ingest|route|fehler
export async function logEvent(c, tenant, { art = 'event', message, actor = 'system', detail = null } = {}) {
  if (!c || !message) return;
  try {
    await c.query(
      'insert into system_log (tenant_id, art, actor, message, detail) values ($1,$2,$3,$4,$5)',
      [tenant, art, actor, message, detail ? JSON.stringify(detail) : null]);
  } catch { /* Log darf nie blockieren */ }
}

// Die letzten Einträge für den Feed lesen ([{ ts, art, actor, message }]).
export async function readFeed(c, tenant, limit = 50) {
  if (!c) return [];
  try {
    const r = await c.query(
      'select ts, art, actor, message from system_log where tenant_id=$1 order by ts desc limit $2',
      [tenant, limit]);
    return r.rows;
  } catch { return []; }
}
