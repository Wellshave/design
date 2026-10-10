-- Elke geclaimde korting. Het e-mailadres staat er alleen zolang Klaviyo het nog niet heeft;
-- daarna blijft alleen de hash over, genoeg om dubbele claims te herkennen.
CREATE TABLE IF NOT EXISTS claims (
  id TEXT PRIMARY KEY,
  email_hash TEXT NOT NULL UNIQUE,
  email TEXT,
  code TEXT NOT NULL UNIQUE,
  answer TEXT,
  variant TEXT,
  page TEXT,
  created_at TEXT NOT NULL,
  shopify_status TEXT NOT NULL DEFAULT 'pending',  -- pending | ok | error
  klaviyo_status TEXT NOT NULL DEFAULT 'pending',  -- pending | ok | error
  last_error TEXT,
  attempts INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS claims_retry ON claims (klaviyo_status, shopify_status);

-- Trechter per dag en variant: hoe vaak de popup opent, welke antwoorden er komen, enz.
CREATE TABLE IF NOT EXISTS daily_stats (
  day TEXT NOT NULL,
  variant TEXT NOT NULL,
  event TEXT NOT NULL,
  detail TEXT NOT NULL DEFAULT '',
  count INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (day, variant, event, detail)
);

CREATE TABLE IF NOT EXISTS rate_limits (
  key TEXT PRIMARY KEY,
  count INTEGER NOT NULL,
  expires_at INTEGER NOT NULL
);

-- Shopify-toegangstoken uit de client credentials grant; geldt 24 uur.
CREATE TABLE IF NOT EXISTS tokens (
  name TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  expires_at INTEGER NOT NULL
);
