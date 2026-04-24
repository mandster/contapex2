// One-time migration: Firestore → Supabase
// Run with: node migrate.mjs
import { createClient } from '@supabase/supabase-js';

const FIREBASE_PROJECT_ID = 'contractual-e220f';
const FIREBASE_API_KEY    = 'AIzaSyDod4I8TQ_3FX7ScbIkVxkzuJJtxwOP5Mw';
const SUPABASE_URL        = 'https://pkvzyuvzdotoswcyhcqb.supabase.co';
const SUPABASE_ANON_KEY   = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBrdnp5dXZ6ZG90b3N3Y3loY3FiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5Mzk1MDMsImV4cCI6MjA5MjUxNTUwM30.H9wwVuF3B7FZl9zfKMRpzUR5lCCaE-sVVtlATpJaexQ';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ─── Firestore REST API helpers ───────────────────────────────────────────────

function parseField(v) {
  if (!v) return null;
  if ('stringValue'    in v) return v.stringValue;
  if ('integerValue'   in v) return Number(v.integerValue);
  if ('doubleValue'    in v) return v.doubleValue;
  if ('booleanValue'   in v) return v.booleanValue;
  if ('nullValue'      in v) return null;
  if ('timestampValue' in v) return v.timestampValue;
  if ('mapValue'       in v) {
    const obj = {};
    for (const [k, fv] of Object.entries(v.mapValue.fields ?? {})) obj[k] = parseField(fv);
    return obj;
  }
  if ('arrayValue' in v) return (v.arrayValue.values ?? []).map(parseField);
  return null;
}

function parseDoc(doc) {
  const id = doc.name.split('/').pop();
  const data = {};
  for (const [k, fv] of Object.entries(doc.fields ?? {})) data[k] = parseField(fv);
  return { id, ...data };
}

async function fetchCollection(name) {
  const docs = [];
  let pageToken = '';
  do {
    const url =
      `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}` +
      `/databases/(default)/documents/${name}` +
      `?key=${FIREBASE_API_KEY}&pageSize=300` +
      (pageToken ? `&pageToken=${pageToken}` : '');
    const res  = await fetch(url);
    const body = await res.json();
    if (body.error) throw new Error(`Firestore [${name}]: ${body.error.message}`);
    (body.documents ?? []).forEach(d => docs.push(parseDoc(d)));
    pageToken = body.nextPageToken ?? '';
  } while (pageToken);
  return docs;
}

// ─── Migration ────────────────────────────────────────────────────────────────

async function migrate() {
  console.log('═══════════════════════════════════════');
  console.log('  Firestore → Supabase migration');
  console.log('═══════════════════════════════════════\n');

  // ── 1. Products ──────────────────────────────────────────────────────────────
  console.log('1/4  Fetching products from Firestore...');
  const products = await fetchCollection('products');
  console.log(`     Found ${products.length} products — inserting...`);

  const productIdMap = {};
  for (const p of products) {
    const { data, error } = await supabase
      .from('products')
      .insert({
        product_name: p.productName  ?? '',
        description:  p.description  ?? '',
        size:         String(p.size  ?? ''),
        price:        parseFloat(p.price)  || 0,
        price2:       parseFloat(p.price2) || 0,
        price3:       parseFloat(p.price3) || 0,
      })
      .select('id')
      .single();
    if (error) { console.error(`     ✗ product "${p.productName}":`, error.message); continue; }
    productIdMap[p.id] = data.id;
    process.stdout.write('.');
  }
  console.log(`\n     ✓ ${Object.keys(productIdMap).length} products migrated\n`);

  // ── 2. Employees ─────────────────────────────────────────────────────────────
  console.log('2/4  Fetching employees from Firestore...');
  const employees = await fetchCollection('employees');
  console.log(`     Found ${employees.length} employees — inserting...`);

  const employeeIdMap = {};
  for (const e of employees) {
    const { data, error } = await supabase
      .from('employees')
      .insert({
        employee_name:  e.employeeName  ?? '',
        price_category: String(e.priceCategory ?? '1'),
        definition:     e.definition    ?? '',
      })
      .select('id')
      .single();
    if (error) { console.error(`     ✗ employee "${e.employeeName}":`, error.message); continue; }
    employeeIdMap[e.id] = data.id;
    process.stdout.write('.');
  }
  console.log(`\n     ✓ ${Object.keys(employeeIdMap).length} employees migrated\n`);

  // ── 3. Entries ───────────────────────────────────────────────────────────────
  console.log('3/4  Fetching entries from Firestore...');
  const entries = await fetchCollection('entries');
  console.log(`     Found ${entries.length} entries — inserting...`);

  let entryOk = 0, entrySkipped = 0;
  for (const e of entries) {
    const newEmployeeId = employeeIdMap[e.employeeId];
    const newProductId  = productIdMap[e.productId];
    if (!newEmployeeId || !newProductId) {
      console.warn(`\n     ⚠ skip entry ${e.id}: unmapped employee/product`);
      entrySkipped++;
      continue;
    }
    const dateAdded = e.dateAdded ? String(e.dateAdded).split('T')[0] : null;
    if (!dateAdded) { console.warn(`\n     ⚠ skip entry ${e.id}: no date`); entrySkipped++; continue; }

    const { error } = await supabase.from('entries').insert({
      date_added:  dateAdded,
      employee_id: newEmployeeId,
      product_id:  newProductId,
      quantity:    parseFloat(e.quantity) || 0,
    });
    if (error) { console.error(`\n     ✗ entry ${e.id}:`, error.message); entrySkipped++; continue; }
    entryOk++;
    process.stdout.write('.');
  }
  console.log(`\n     ✓ ${entryOk} entries migrated${entrySkipped ? `, ${entrySkipped} skipped` : ''}\n`);

  // ── 4. Prices ─────────────────────────────────────────────────────────────────
  console.log('4/4  Fetching prices from Firestore...');
  const prices = await fetchCollection('prices');
  console.log(`     Found ${prices.length} prices — inserting...`);

  let priceOk = 0, priceSkipped = 0;
  for (const p of prices) {
    const newProductId = productIdMap[p.productId];
    if (!newProductId) { console.warn(`\n     ⚠ skip price ${p.id}: unmapped product`); priceSkipped++; continue; }

    const { error } = await supabase.from('prices').insert({
      product_id: newProductId,
      price:  parseFloat(p.price)  || 0,
      price2: parseFloat(p.price2) || 0,
      price3: parseFloat(p.price3) || 0,
      date:   p.date ? String(p.date).split('T')[0] : null,
    });
    if (error) { console.error(`\n     ✗ price ${p.id}:`, error.message); priceSkipped++; continue; }
    priceOk++;
    process.stdout.write('.');
  }
  console.log(`\n     ✓ ${priceOk} prices migrated${priceSkipped ? `, ${priceSkipped} skipped` : ''}\n`);

  // ── Summary ──────────────────────────────────────────────────────────────────
  console.log('═══════════════════════════════════════');
  console.log('  Migration complete');
  console.log('═══════════════════════════════════════');
  console.log(`  Products:  ${Object.keys(productIdMap).length}`);
  console.log(`  Employees: ${Object.keys(employeeIdMap).length}`);
  console.log(`  Entries:   ${entryOk}`);
  console.log(`  Prices:    ${priceOk}`);
  console.log('═══════════════════════════════════════\n');
}

migrate().catch(err => { console.error('\nFatal:', err.message); process.exit(1); });
