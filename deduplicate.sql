-- Run this in Supabase SQL Editor to remove duplicate employees and products.
-- Uses DISTINCT ON (works with UUID primary keys).

-- 1. Re-point entries to the surviving employee record
WITH survivors AS (
  SELECT DISTINCT ON (employee_name) id AS keep_id, employee_name
  FROM employees
  ORDER BY employee_name, id
)
UPDATE entries e
SET employee_id = s.keep_id
FROM employees emp
JOIN survivors s ON s.employee_name = emp.employee_name
WHERE e.employee_id = emp.id AND emp.id != s.keep_id;

-- 2. Delete duplicate employees
DELETE FROM employees
WHERE id NOT IN (
  SELECT DISTINCT ON (employee_name) id
  FROM employees
  ORDER BY employee_name, id
);

-- 3. Re-point entries to the surviving product record
WITH survivors AS (
  SELECT DISTINCT ON (product_name, size) id AS keep_id, product_name, size
  FROM products
  ORDER BY product_name, size, id
)
UPDATE entries e
SET product_id = s.keep_id
FROM products p
JOIN survivors s ON s.product_name = p.product_name AND s.size = p.size
WHERE e.product_id = p.id AND p.id != s.keep_id;

-- 4. Re-point prices to the surviving product record
WITH survivors AS (
  SELECT DISTINCT ON (product_name, size) id AS keep_id, product_name, size
  FROM products
  ORDER BY product_name, size, id
)
UPDATE prices pr
SET product_id = s.keep_id
FROM products p
JOIN survivors s ON s.product_name = p.product_name AND s.size = p.size
WHERE pr.product_id = p.id AND p.id != s.keep_id;

-- 5. Delete duplicate products
DELETE FROM products
WHERE id NOT IN (
  SELECT DISTINCT ON (product_name, size) id
  FROM products
  ORDER BY product_name, size, id
);
