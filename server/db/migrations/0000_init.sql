-- VendorSmart - Migracao inicial (11 tabelas + notifications)

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('admin','manager','vendor','customer')),
  phone TEXT,
  is_active INTEGER NOT NULL DEFAULT 1,
  two_factor_enabled INTEGER NOT NULL DEFAULT 0,
  two_factor_code TEXT,
  two_factor_expires_at TEXT,
  last_login_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS users_role_idx ON users(role);
CREATE INDEX IF NOT EXISTS users_email_idx ON users(email);

CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  parent_id TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS suppliers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  contact_name TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  lead_time_days INTEGER NOT NULL DEFAULT 7,
  rating REAL NOT NULL DEFAULT 0,
  is_active INTEGER NOT NULL DEFAULT 1,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  sku TEXT NOT NULL UNIQUE,
  barcode TEXT,
  name TEXT NOT NULL,
  description TEXT,
  category_id TEXT REFERENCES categories(id) ON DELETE SET NULL,
  supplier_id TEXT REFERENCES suppliers(id) ON DELETE SET NULL,
  unit TEXT NOT NULL DEFAULT 'un',
  current_stock INTEGER NOT NULL DEFAULT 0,
  reorder_point INTEGER NOT NULL DEFAULT 0,
  reorder_quantity INTEGER NOT NULL DEFAULT 0,
  cost_price REAL NOT NULL DEFAULT 0,
  selling_price REAL NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','discontinued','archived')),
  image_url TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS products_category_idx ON products(category_id);
CREATE INDEX IF NOT EXISTS products_supplier_idx ON products(supplier_id);
CREATE INDEX IF NOT EXISTS products_status_idx ON products(status);

CREATE TABLE IF NOT EXISTS stock_movements (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('entry','exit','adjustment','transfer')),
  quantity INTEGER NOT NULL,
  from_location TEXT,
  to_location TEXT,
  reference TEXT,
  notes TEXT,
  performed_by_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS movements_product_idx ON stock_movements(product_id);
CREATE INDEX IF NOT EXISTS movements_type_idx ON stock_movements(type);

CREATE TABLE IF NOT EXISTS shopping_lists (
  id TEXT PRIMARY KEY,
  public_token TEXT NOT NULL UNIQUE,
  customer_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  customer_name TEXT,
  customer_phone TEXT,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','ready','processing','completed','cancelled')),
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS shopping_lists_token_idx ON shopping_lists(public_token);
CREATE INDEX IF NOT EXISTS shopping_lists_status_idx ON shopping_lists(status);

CREATE TABLE IF NOT EXISTS shopping_list_items (
  id TEXT PRIMARY KEY,
  list_id TEXT NOT NULL REFERENCES shopping_lists(id) ON DELETE CASCADE,
  product_id TEXT REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price REAL NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS shopping_items_list_idx ON shopping_list_items(list_id);

CREATE TABLE IF NOT EXISTS sales (
  id TEXT PRIMARY KEY,
  sale_number TEXT NOT NULL UNIQUE,
  vendor_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  customer_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  shopping_list_id TEXT REFERENCES shopping_lists(id) ON DELETE SET NULL,
  items_json TEXT NOT NULL DEFAULT '[]',
  subtotal REAL NOT NULL DEFAULT 0,
  discount REAL NOT NULL DEFAULT 0,
  total REAL NOT NULL DEFAULT 0,
  payment_method TEXT NOT NULL DEFAULT 'cash' CHECK (payment_method IN ('cash','card','transfer','other')),
  status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('pending','completed','cancelled','refunded')),
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS sales_vendor_idx ON sales(vendor_id);
CREATE INDEX IF NOT EXISTS sales_status_idx ON sales(status);
CREATE INDEX IF NOT EXISTS sales_date_idx ON sales(created_at);

CREATE TABLE IF NOT EXISTS purchase_orders (
  id TEXT PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE,
  supplier_id TEXT REFERENCES suppliers(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','submitted','partial','received','cancelled')),
  total_cost REAL NOT NULL DEFAULT 0,
  expected_delivery TEXT,
  received_at TEXT,
  notes TEXT,
  created_by_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS po_supplier_idx ON purchase_orders(supplier_id);
CREATE INDEX IF NOT EXISTS po_status_idx ON purchase_orders(status);

CREATE TABLE IF NOT EXISTS purchase_order_items (
  id TEXT PRIMARY KEY,
  purchase_order_id TEXT NOT NULL REFERENCES purchase_orders(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  quantity_ordered INTEGER NOT NULL,
  quantity_received INTEGER NOT NULL DEFAULT 0,
  unit_cost REAL NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS po_items_po_idx ON purchase_order_items(purchase_order_id);

CREATE TABLE IF NOT EXISTS reports (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('sales','stock','movements','purchases','suppliers','custom')),
  format TEXT NOT NULL DEFAULT 'csv' CHECK (format IN ('csv','xlsx','pdf','json')),
  filters_json TEXT NOT NULL DEFAULT '{}',
  file_path TEXT,
  row_count INTEGER NOT NULL DEFAULT 0,
  generated_by_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS reports_type_idx ON reports(type);
CREATE INDEX IF NOT EXISTS reports_date_idx ON reports(created_at);

CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('low_stock','zero_stock','po_reminder','po_received','new_sale','shopping_list_ready','system')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  reference_id TEXT,
  is_read INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS notif_user_idx ON notifications(user_id);
CREATE INDEX IF NOT EXISTS notif_read_idx ON notifications(is_read);
