import {
  addProductToFirebase,
  updateProductInFirebase,
  deleteProductInFirebase,
  getAllProductsFromFirebase,
} from "./_services/firebaseService";
import { useEffect, useState } from "react";

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const productsFromFirebase = await getAllProductsFromFirebase();
      setProducts(productsFromFirebase);
    };

    fetchProducts();
  }, []);

  const addProduct = async (product) => {
    const productId = await addProductToFirebase(product);
    setProducts([...products, { id: productId, ...product }]);
  };
  const handleEditProduct = (id, updatedProduct) => {
    onEditProduct(id, updatedProductWithId);
  };

  const editProduct = async (id, updatedProduct) => {
    const updatedProductWithId = { ...updatedProduct, id };

    await updateProductInFirebase(id, updatedProductWithId);
    setProducts(
      products.map((product) => (product.id === id ? updatedProduct : product))
    );
  };

  const deleteProduct = async (id) => {
    await deleteProductInFirebase(id);
    setProducts(products.filter((product) => product.id !== id));
  };
  return (
    <div>
      {/* Render the product list and include functionality for adding, editing, and deleting products */}
      <ProductListView
        products={products}
        onAddProduct={addProduct}
        onEditProduct={editProduct}
        onDeleteProduct={deleteProduct}
      />
    </div>
  );
};

// Extracted component for rendering the product list
const ProductListView = ({
  products,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
}) => {
  const handleEditProduct = (id, updatedProduct) => {
    onEditProduct(id, updatedProduct);
  };

  return (
    <div>
      {/* Render the product list */}
      <ul>
        {products.map((product) => (
          <ProductListItem
            key={product.id}
            product={product}
            onEditProduct={handleEditProduct}
            onDeleteProduct={onDeleteProduct}
          />
        ))}
      </ul>

      {/* Render the form for adding new products */}
      <ProductForm onAddProduct={onAddProduct} />
    </div>
  );
};

// Extracted component for rendering each product item
const ProductListItem = ({ product, onEditProduct, onDeleteProduct }) => {
  return (
    <li>
      {product.name} - {product.price}
      <button onClick={() => onEditProduct(product.id, updatedProduct)}>
        Edit
      </button>
      <button onClick={() => onDeleteProduct(product.id)}>Delete</button>
    </li>
  );
};

// Extracted component for the product form
const ProductForm = ({ onAddProduct }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const handleAddProduct = () => {
    const newProduct = {
      id: Date.now(),
      name: name,
      price: price,
    };

    onAddProduct(newProduct);
    setName("");
    setPrice("");
  };

  return (
    <div>
      {/* Render the form */}
      <input
        type="text"
        placeholder="Product Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Product Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <button onClick={handleAddProduct}>Add Product</button>
    </div>
  );
};

export default ProductList;
