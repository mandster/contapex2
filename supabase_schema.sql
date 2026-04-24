-- Run this entire script in your Supabase project's SQL Editor
-- Dashboard → SQL Editor → New query → paste → Run

CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_name TEXT NOT NULL DEFAULT '',
  description TEXT DEFAULT '',
  size TEXT DEFAULT '',
  price DECIMAL(10,2) DEFAULT 0,
  price2 DECIMAL(10,2) DEFAULT 0,
  price3 DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_name TEXT NOT NULL DEFAULT '',
  price_category TEXT DEFAULT '1',
  definition TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date_added DATE NOT NULL,
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  price DECIMAL(10,2) DEFAULT 0,
  price2 DECIMAL(10,2) DEFAULT 0,
  price3 DECIMAL(10,2) DEFAULT 0,
  date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE products  ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE entries   ENABLE ROW LEVEL SECURITY;
ALTER TABLE prices    ENABLE ROW LEVEL SECURITY;

-- Allow full access with the anon key (no login required, matching current app behavior)
-- Update these policies when you add authentication later.
CREATE POLICY "public_all" ON products  FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_all" ON employees FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_all" ON entries   FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_all" ON prices    FOR ALL USING (true) WITH CHECK (true);
