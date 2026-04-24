import {
  addProductToFirebase,
  updateProductInFirebase,
  deleteProductInFirebase,
  getAllProductsFromFirebase,
} from "../_services/firebaseService";
import { useEffect, useState } from "react";
import "../styles.css";

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

  const handleEditProduct = async (id, updatedProduct) => {
    await updateProductInFirebase(id, updatedProduct);
    setProducts(products.map((product) => (product.id === id ? updatedProduct : product)));
  };

  const handleDeleteProduct = async (id) => {
    const shouldDelete = window.confirm("Are you sure you want to delete this product?");
  
    if (shouldDelete) {
      await deleteProductInFirebase(id);
      setProducts(products.filter((product) => product.productId !== id));
      alert('Product deleted successfully!');
    }
  };

  const ProductForm = ({ onAddProduct }) => {
    const [productName, setProductName] = useState("");
    const [size, setSize] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [price2, setPrice2] = useState("");
    const [price3, setPrice3] = useState("");

    const handleAddProduct = () => {
      const newProduct = {
        productName,
        size,
        description,
        price,
        price2,
        price3,
      };

      onAddProduct(newProduct);
      setProductName("");
      setSize("");
      setDescription("");
      setPrice("");
      setPrice2("");
      setPrice3("");
      setShowForm(false); // Hide the form after submission
    };

    return (
      <>
      <div className="add-form">
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
            style={{width:90}}
            onChange={(e) => setSize(e.target.value)}
          />

          <input
            type="text"
            placeholder="Price"
            value={price}
            style={{width:90}}
            onChange={(e) => setPrice(e.target.value)}
          />
          <input
            type="text"
            placeholder="Price2"
            style={{width:90}}
            value={price2}
            onChange={(e) => setPrice2(e.target.value)}
          />
          <input
            type="text"
            style={{width:90}}
            placeholder="Price3"
            value={price3}
            onChange={(e) => setPrice3(e.target.value)}
          />
                    <input
style={{width:300}}
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

  const ProductListItem = ({ product, onEditProduct, onDeleteProduct }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [updatedProduct, setUpdatedProduct] = useState({ ...product });

    const handleUpdateProduct = () => {
      onEditProduct(product.productId, updatedProduct);
      setIsEditing(false);
    };

    const handleCancelEdit = () => {
      setIsEditing(false);
      setUpdatedProduct({ ...product });
    };

    return (
      <li className="a-item">
        {isEditing ? (
          <>
            <input
              type="text"
              placeholder="Product Name"
              value={updatedProduct.productName}
              onChange={(e) => setUpdatedProduct({ ...updatedProduct, productName: e.target.value })}
            />
            <input
              type="text"
              placeholder="Size"
              value={updatedProduct.size}
              onChange={(e) => setUpdatedProduct({ ...updatedProduct, size: e.target.value })}
            />
            <input
              type="text"
              placeholder="Price"
              value={updatedProduct.price}
              onChange={(e) => setUpdatedProduct({ ...updatedProduct, price: e.target.value })}
            />
            <input
              type="text"
              placeholder="Price2"
              value={updatedProduct.price2}
              onChange={(e) => setUpdatedProduct({ ...updatedProduct, price2: e.target.value })}
            />
            <input
              type="text"
              placeholder="Price3"
              value={updatedProduct.price3}
              onChange={(e) => setUpdatedProduct({ ...updatedProduct, price3: e.target.value })}
            />
            <input
              type="text"
              placeholder="Description"
              value={updatedProduct.description}
              onChange={(e) => setUpdatedProduct({ ...updatedProduct, description: e.target.value })}
            />
            <button onClick={handleUpdateProduct}>Update</button>
            <button onClick={handleCancelEdit}>Cancel</button>
          </>
        ) : (
          <>
            <span className="a-name">{product.productName}</span>
            <span className="a-size">{product.size}</span>
            <span className="a-size">{product.price}</span>
            <span className="a-size">{product.price2}</span>
            <span className="a-size">{product.price3}</span>
            <button onClick={() => setIsEditing(true)}>Edit</button>
            <button
              id="delete-button"
              onClick={() => onDeleteProduct(product.productId)}
            >
              Delete
            </button>
          </>
        )}
      </li>
    );
  };

  return (
    <>
      {showAddButton && (
        <button id="add-button" onClick={handleAddButton}>
          + Add new
        </button>
      )}
  
      {showForm && <ProductForm onAddProduct={onAddProduct} />}
      
      <div className="a-list-container">
        <div className="a-list-heading">
          <span className="heading-item">Product Name</span>
          <span className="heading-item">Size</span>
          <span className="heading-item">Price</span>
          <span className="heading-item">Price2</span>
          <span className="heading-item">Price3</span>
          <span className="heading-item">Options</span>
        </div>
  
        <ul>
          {products.map((product) => ( 
            <ProductListItem
              key={product.productId}
              product={product}
              onEditProduct={handleEditProduct}
              onDeleteProduct={handleDeleteProduct}
            />
          ))}
        </ul>
      </div>
    </>
  );
};

export default ProductList;
