-- Migração de Unificação: Adicionar novas tabelas e campos

-- 1. Novas Tabelas
CREATE TABLE IF NOT EXISTS profiles (
  id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_roles (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS user_role_unique_idx ON user_roles(user_id, role);

CREATE TABLE IF NOT EXISTS locations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  parent_id TEXT REFERENCES locations(id) ON DELETE SET NULL,
  description TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS inventory_requests (
  id TEXT PRIMARY KEY,
  requested_by_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending',
  reason TEXT,
  project_reference TEXT,
  reviewed_by_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  reviewed_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS request_items (
  id TEXT PRIMARY KEY,
  request_id TEXT NOT NULL REFERENCES inventory_requests(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS custom_field_definitions (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  field_type TEXT NOT NULL,
  options TEXT,
  category_id TEXT REFERENCES categories(id) ON DELETE SET NULL,
  is_required INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Alterações em Tabelas Existentes (SQLite não suporta ADD COLUMN com constraints complexas em massa, então fazemos um de cada vez)
-- ALTER TABLE suppliers ADD COLUMN payment_terms TEXT;
-- ALTER TABLE suppliers ADD COLUMN min_order_qty INTEGER;

-- ALTER TABLE products ADD COLUMN location_id TEXT REFERENCES locations(id) ON DELETE SET NULL;
-- ALTER TABLE products ADD COLUMN tags TEXT;
-- ALTER TABLE products ADD COLUMN custom_fields TEXT NOT NULL DEFAULT 
-- ALTER TABLE stock_movements ADD COLUMN direction TEXT;
-- ALTER TABLE stock_movements ADD COLUMN from_location_id TEXT REFERENCES locations(id) ON DELETE SET NULL;
-- ALTER TABLE stock_movements ADD COLUMN to_location_id TEXT REFERENCES locations(id) ON DELETE SET NULL;
-- ALTER TABLE stock_movements ADD COLUMN resulting_quantity INTEGER;

-- ALTER TABLE notifications ADD COLUMN reference_type TEXT;
