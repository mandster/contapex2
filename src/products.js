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
  const [showForm, setShowForm] = useState(false);
  const [showAddButton, setAddButton] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const productsFromFirebase = await getAllProductsFromFirebase();
      setProducts(productsFromFirebase);
    };
    fetchProducts();
  }, []);

  const [size, setSize] = useState("");
  const handleAddButton = () => {
    setShowForm(true);
    setAddButton(false);
  };
  const handleCancelAdd = () => {
    setShowForm(false);
    setAddButton(true);
  };

  const onAddProduct = async (product) => {
    const productId = await addProductToFirebase(product);
    setProducts([...products, { id: productId, ...product }]);
  };

  const onEditProduct = async (id, updatedProduct) => {
    const updatedProductWithId = { ...updatedProduct, id }; // This assumes id is the document ID

    // Check if products is an array before applying map
    if (Array.isArray(products)) {
      console.log(products);

      setProducts(
        products.map((product) =>
          product.id === id ? updatedProductWithId : product
        )
      );
    } else if (typeof products === "object" && products !== null) {
      // If products is an object, convert it to an array before applying map
      const productsArray = Object.values(products);
      setProducts(
        productsArray.map((product) =>
          product.id === id ? updatedProductWithId : product
        )
      );
    } else {
      console.error("products is not an array or object:", products);
    }

    await updateProductInFirebase(id, updatedProductWithId);
  };

  const onDeleteProduct = async (id) => {
    await deleteProductInFirebase(id);

    // Check if products is an array before applying filter
    if (Array.isArray(products)) {
      setProducts(products.filter((product) => product.id !== id));
    } else {
      console.error("products is not an array:", products);
    }
  };

  const ProductForm = ({ onAddProduct }) => {
    const [productName, setProductName] = useState("");
    const [description, setDescription] = useState("");
    const [size, setSize] = useState("");

    const handleAddProduct = () => {
      const newProduct = {
        productName: productName,
        description: description,
        size: size,
      };

      onAddProduct(newProduct);
      setProductName("");
      setDescription("");
      setSize("");
      setShowForm(false); // Hide the form after submission
    };

    return (
      <>
        <div className="product-form-container">
          {/* Render the form */}
          <input
            type="text"
            placeholder="Product Name"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Size"
            value={size}
            onChange={(e) => setSize(e.target.value)}
          />
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button onClick={handleAddProduct} id="add-button">
            Add
          </button>
          <button onClick={handleCancelAdd} id="cancel-button">
            X
          </button>
        </div>
      </>
    );
  };

  // Extracted component for rendering each product item
  const ProductListItem = ({ product, onEditProduct, onDeleteProduct }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [updatedProductName, setUpdatedProductName] = useState(
      product.productName
    );
    const [updatedSize, setUpdatedSize] = useState(product.size);
    const [updatedDescription, setUpdatedDescription] = useState(
      product.description
    );

    const handleEditProduct = () => {
      setIsEditing(true);
    };

    const handleUpdateProduct = () => {
      const updatedProductDetails = {
        productName: updatedProductName,
        size: updatedSize,
        description: updatedDescription,
      };

      onEditProduct(product.id, updatedProductDetails);
      setIsEditing(false);
    };

    const handleCancelEdit = () => {
      setIsEditing(false);
    };

    return (
      <li className="product-item">
        {isEditing ? (
          <>
            <input
              type="text"
              placeholder="Product Name"
              value={updatedProductName}
              onChange={(e) => setUpdatedProductName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Size"
              value={updatedSize}
              onChange={(e) => setUpdatedSize(e.target.value)}
            />
            <input
              type="text"
              placeholder="Description"
              value={updatedDescription}
              onChange={(e) => setUpdatedDescription(e.target.value)}
            />
            <button onClick={handleUpdateProduct}>Update</button>
            <button onClick={handleCancelEdit}>Cancel</button>
          </>
        ) : (
          <>
            <span className="product-name">{product.productName}</span>
            <span className="product-size">{product.size}</span>
            <button onClick={handleEditProduct}>Edit</button>
            <button
              id="delete-button"
              onClick={() => onDeleteProduct(product.id)}
            >
              Delete
            </button>
          </>
        )}
      </li>
    );
  };

  // Extracted component for rendering the product list
  const ProductListView = ({
    products,
    onAddProduct,
    onEditProduct,
    onDeleteProduct,
  }) => {
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

  return (
    <div className="product-list-container">
      {showAddButton && (
        <button id="add-button" onClick={handleAddButton}>
          + Add new
        </button>
      )}

      {/* Render the form for adding new products conditionally */}
      {showForm && <ProductForm onAddProduct={onAddProduct} />}
      {/* Heading row */}
      <div className="product-list-heading">
        <span className="heading-item">Product Name</span>
        <span className="heading-item">Size</span>
        <span className="heading-item">Options</span>
      </div>
      {/* Render the product list */}
      <ul className="product-list">
        {products.map((product) => (
          <ProductListItem
            key={product.id}
            product={product}
            onEditProduct={onEditProduct}
            onDeleteProduct={onDeleteProduct}
          />
        ))}
      </ul>
    </div>
  );
};
export default ProductList;
