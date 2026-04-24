import { supabase } from '../supabaseConfig';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// ─── PRODUCTS ────────────────────────────────────────────────────────────────

const addProductToFirebase = async (product) => {
  const { data, error } = await supabase
    .from('products')
    .insert([{
      product_name: product.productName,
      description: product.description || '',
      size: product.size || '',
      price: parseFloat(product.price) || 0,
      price2: parseFloat(product.price2) || 0,
      price3: parseFloat(product.price3) || 0,
    }])
    .select('id')
    .single();
  if (error) throw error;
  return data.id;
};

const updateProductInFirebase = async (id, product) => {
  const { error } = await supabase
    .from('products')
    .update({
      product_name: product.productName,
      description: product.description || '',
      size: typeof product.size === 'undefined' ? '' : String(product.size),
      price: parseFloat(product.price) || 0,
      price2: parseFloat(product.price2) || 0,
      price3: parseFloat(product.price3) || 0,
    })
    .eq('id', id);
  if (error) throw error;
};

const deleteProductInFirebase = async (id) => {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
};

// Returns products with { productId, productName, ... } shape (used by Entries, Search, products.js)
const getAllProductsFromFirebase = async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('product_name');
  if (error) throw error;
  return data.map(p => ({
    productId: p.id,
    productName: p.product_name,
    description: p.description,
    size: p.size,
    price: p.price,
    price2: p.price2,
    price3: p.price3,
  }));
};

// Returns products with { id, productName, ... } shape (used by price.js)
const getProductsFromFirebase = async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('product_name');
  if (error) throw error;
  return data.map(p => ({
    id: p.id,
    productName: p.product_name,
    description: p.description,
    size: p.size,
    price: p.price,
    price2: p.price2,
    price3: p.price3,
  }));
};

const getProductByIdFromFirebase = async (productId, employeeId) => {
  const [{ data: product, error: pErr }, { data: employee, error: eErr }] = await Promise.all([
    supabase.from('products').select('*').eq('id', productId).single(),
    supabase.from('employees').select('price_category').eq('id', employeeId).single(),
  ]);
  if (pErr) throw pErr;
  if (eErr) throw eErr;

  const pc = employee.price_category;
  let price;
  if (pc === '1' || pc === '2' || pc === '3') {
    price = product.price;
  } else {
    price = product['price' + pc] ?? product.price;
  }

  return {
    id: product.id,
    productName: product.product_name,
    price: parseFloat(price) || 0,
  };
};

// ─── EMPLOYEES ───────────────────────────────────────────────────────────────

const addEmployeeToFirebase = async (employee) => {
  const { data, error } = await supabase
    .from('employees')
    .insert([{
      employee_name: employee.employeeName,
      price_category: employee.priceCategory || '1',
      definition: employee.definition || '',
    }])
    .select('id')
    .single();
  if (error) throw error;
  return data.id;
};

const updateEmployeeInFirebase = async (id, employee) => {
  const { error } = await supabase
    .from('employees')
    .update({
      employee_name: employee.employeeName,
      price_category: employee.priceCategory,
      definition: employee.definition || '',
    })
    .eq('id', id);
  if (error) throw error;
};

const deleteEmployeeInFirebase = async (id) => {
  const { error } = await supabase.from('employees').delete().eq('id', id);
  if (error) throw error;
};

const getAllEmployeesFromFirebase = async () => {
  const { data, error } = await supabase
    .from('employees')
    .select('*')
    .order('employee_name');
  if (error) throw error;
  return data.map(e => ({
    id: e.id,
    employeeName: e.employee_name,
    priceCategory: e.price_category,
    definition: e.definition,
  }));
};

// ─── ENTRIES ─────────────────────────────────────────────────────────────────

const addEntryToFirebase = async (entry) => {
  const { data, error } = await supabase
    .from('entries')
    .insert([{
      date_added: entry.dateAdded,
      employee_id: entry.employeeId,
      product_id: entry.productId,
      quantity: parseFloat(entry.quantity),
    }])
    .select('id')
    .single();
  if (error) throw error;
  return data.id;
};

const updateEntryInFirebase = async (id, entry) => {
  const { error } = await supabase
    .from('entries')
    .update({
      date_added: entry.dateAdded,
      employee_id: entry.employeeId,
      product_id: entry.productId,
      quantity: parseFloat(entry.quantity),
    })
    .eq('id', id);
  if (error) throw error;
};

const deleteEntryInFirebase = async (id) => {
  const { error } = await supabase.from('entries').delete().eq('id', id);
  if (error) throw error;
};

// Returns entries with employee_name, product_name, and all price tiers embedded via JOIN.
// Components can display names directly without a separate lookup array.
const getAllEntriesFromFirebase = async () => {
  const { data, error } = await supabase
    .from('entries')
    .select(`
      id,
      date_added,
      quantity,
      employee_id,
      product_id,
      employees ( employee_name, price_category ),
      products ( product_name, price, price2, price3 )
    `)
    .order('date_added', { ascending: false });
  if (error) throw error;

  return data.map(e => ({
    id: e.id,
    dateAdded: e.date_added,
    quantity: e.quantity,
    employeeId: e.employee_id,
    productId: e.product_id,
    // Names embedded from JOIN — no client-side lookup needed
    employeeName: e.employees?.employee_name || '',
    productName: e.products?.product_name || '',
    // Price data for Calculate page
    priceCategory: e.employees?.price_category || '1',
    price: e.products?.price || 0,
    price2: e.products?.price2 || 0,
    price3: e.products?.price3 || 0,
  }));
};

// ─── PRICES ──────────────────────────────────────────────────────────────────

const addPriceToFirebase = async (price) => {
  const { data, error } = await supabase
    .from('prices')
    .insert([{
      product_id: price.productId,
      price: parseFloat(price.price) || 0,
      price2: parseFloat(price.price2) || 0,
      price3: parseFloat(price.price3) || 0,
      date: price.date || null,
    }])
    .select('id')
    .single();
  if (error) throw error;
  return data.id;
};

const updatePriceInFirebase = async (id, price) => {
  const { error } = await supabase
    .from('prices')
    .update({
      price: parseFloat(price.price) || 0,
      price2: parseFloat(price.price2) || 0,
      price3: parseFloat(price.price3) || 0,
    })
    .eq('id', id);
  if (error) throw error;
};

const deletePriceInFirebase = async (id) => {
  const { error } = await supabase.from('prices').delete().eq('id', id);
  if (error) throw error;
};

const getAllPricesFromFirebase = async () => {
  const { data, error } = await supabase
    .from('prices')
    .select(`
      id,
      price,
      price2,
      price3,
      date,
      product_id,
      products ( id, product_name )
    `)
    .order('created_at', { ascending: false });
  if (error) throw error;

  return data.map(p => ({
    id: p.id,
    price: p.price,
    price2: p.price2,
    price3: p.price3,
    date: p.date,
    product: {
      id: p.product_id,
      productName: p.products?.product_name || '',
    },
  }));
};

const copyPriceDataToProd = async () => {
  const { data: prices, error } = await supabase.from('prices').select('*');
  if (error) throw error;

  for (const price of prices) {
    if (!price.product_id) continue;
    await supabase
      .from('products')
      .update({ price: price.price, price2: price.price2, price3: price.price3 })
      .eq('id', price.product_id);
  }
};

// ─── UTILS ───────────────────────────────────────────────────────────────────

// Handles both "YYYY-MM-DD" (Supabase DATE) and full ISO strings safely
const formatDate = (dateString) => {
  if (!dateString) return '';
  const datePart = String(dateString).split('T')[0];
  const [year, month, day] = datePart.split('-');
  return `${day}/${month}/${year}`;
};

const presentToast = (message) => {
  toast.success(message, { position: toast.POSITION.TOP_RIGHT });
};

export {
  addProductToFirebase,
  updateProductInFirebase,
  deleteProductInFirebase,
  getAllProductsFromFirebase,
  addEmployeeToFirebase,
  updateEmployeeInFirebase,
  deleteEmployeeInFirebase,
  getAllEmployeesFromFirebase,
  addPriceToFirebase,
  updatePriceInFirebase,
  deletePriceInFirebase,
  getAllPricesFromFirebase,
  getProductsFromFirebase,
  addEntryToFirebase,
  updateEntryInFirebase,
  deleteEntryInFirebase,
  getAllEntriesFromFirebase,
  getProductByIdFromFirebase,
  copyPriceDataToProd,
  formatDate,
  presentToast,
};
