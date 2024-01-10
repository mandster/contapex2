import {
  addProductToFirebase,
  updateProductInFirebase,
  deleteProductInFirebase,
  getAllProductsFromFirebase,
} from "./_services/firebaseService";
import { useEffect, useState } from "react";
import "./styles.css";

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const productsFromFirebase = await getAllProductsFromFirebase();
      setProducts(productsFromFirebase);
    };

    fetchProducts();
  }, []);

  const onAddProduct = async (product) => {
    const productId = await addProductToFirebase(product);
    setProducts([...products, { id: productId, ...product }]);
  };

  const onEditProduct = async (id, updatedProduct) => {
    const updatedProductWithId = { ...updatedProduct, id };

    await updateProductInFirebase(id, updatedProductWithId);
    setProducts(
      products.map((product) => (product.id === id ? updatedProduct : product))
    );
  };

  const onDeleteProduct = async (id) => {
    await deleteProductInFirebase(id);
  
    // Check if products is an array before applying filter
    if (Array.isArray(products)) {
      setProducts(products.filter((product) => product.id !== id));
    } else {
      console.error('products is not an array:', products);
    }
  };
  
  return (
    <div>
      {/* Render the product list and include functionality for adding, editing, and deleting products */}
      <ProductListView
        products={products}
        onAddProduct={onAddProduct}
        onEditProduct={onEditProduct}
        onDeleteProduct={onDeleteProduct}
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
    <div className="product-list-container">
      {/* Render the product list */}
      <ul className="product-list">
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
    <li className="product-item">
      <span className="product-name">{product.productName}</span>
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
