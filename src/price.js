// PriceList.js
import React, { useEffect, useState } from "react";
import {
  addPriceToFirebase,
  updatePriceInFirebase,
  deletePriceInFirebase,
  getAllPricesFromFirebase,
  getProductsFromFirebase,
} from "./_services/firebaseService";

const PriceList = () => {
  const [prices, setPrices] = useState([]);
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        setLoading(true);
        const pricesFromFirebase = await getAllPricesFromFirebase();
        setPrices(pricesFromFirebase);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        // Set loading to false when data fetching is complete (whether successful or not)
        setLoading(false);
      }
    };

    const fetchProducts = async () => {
      try {
        // Set loading to true when data fetching starts
        setLoading(true);
        const productsFromFirebase = await getProductsFromFirebase();
        setProducts(productsFromFirebase);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        // Set loading to false when data fetching is complete (whether successful or not)
        setLoading(false);
      }
    };

    fetchPrices();
    fetchProducts();
  }, []);

  const getProductName = (productId) => {
    const product = products.find((p) => p.id === productId);
    return product ? product.productName : "Unknown Product";
  };

  const [selectedProduct, setSelectedProduct] = useState("");
  const [price, setPrice] = useState("");
  const [price2, setPrice2] = useState("");
  const [price3, setPrice3] = useState("");
  const [date, setDate] = useState("");

  const handleAddButton = () => {
    setShowForm(true);
  };

  const handleCancelAdd = () => {
    setShowForm(false);
  };

  const onAddPrice = async () => {
    const selectedProductData = products.find(
      (product) => product.productName === selectedProduct
    );

    const newPrice = {
      product: selectedProductData,
      price: price,
      price2: price2,
      price3: price3,
      date: date || new Date().toISOString(),
    };

    await addPriceToFirebase(newPrice);
    setPrices([...prices, newPrice]);
    setShowForm(false);
  };

  const onEditPrice = async (id, updatedPrice) => {
    console.log(id);
    await updatePriceInFirebase(id, updatedPrice);
    setPrices(prices.map((p) => (p.id === id ? updatedPrice : p)));
  };

  const onDeletePrice = async (id) => {
    console.log(id);

    await deletePriceInFirebase(id);
    setPrices(prices.filter((p) => p.id !== id));
  };

  return (
    <div className="a-list-container">
      {loading && <p>Loading...</p>} {/* Show loading indicator */}
      <button id="add-button" onClick={handleAddButton}>
        + Add new price
      </button>
      {showForm && (
        <div className="a-form-container">
          <select
            className="a-select"
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
          >
            <option value="" disabled>
              Select a product
            </option>
            {products.map((product) => (
              <option key={product.id} value={product.productName}>
                {product.productName}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <input
            type="text"
            placeholder="Price2"
            value={price2}
            onChange={(e) => setPrice2(e.target.value)}
          />
          <input
            type="text"
            placeholder="Price3"
            value={price3}
            onChange={(e) => setPrice3(e.target.value)}
          />
          <input
            type="text"
            placeholder="Date (optional)"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <button onClick={onAddPrice} id="add-button">
            Add Price
          </button>
          <button onClick={handleCancelAdd} id="cancel-button">
            Cancel
          </button>
        </div>
      )}
      <div className="a-list">
        <div className="a-list-heading">
          <span className="heading-item">Product</span>
          <span className="heading-item">Price</span>
          <span className="heading-item">Price2</span>
          <span className="heading-item">Price3</span>
          <span className="heading-item">Date</span>
          <span className="heading-item">Options</span>
        </div>

        <ul className="a-list">
          {prices.map((price) => (
            <li className="a-item" key={price.id}>
              <span className="a2-name">
                {getProductName(price.product.id)}
              </span>
              <span className="a-size">{price.id}</span>
              <span className="a-size">{price.price}</span>
              <span className="a-size">{price.price2}</span>
              <span className="a-size">{price.price3}</span>
              <span className="a-size">{price.date}</span>
              <button
                id="edit-button"
                onClick={() => onEditPrice(price.id, price)}
              >
                Edit
              </button>
              <button
                id="delete-button"
                onClick={() => onDeletePrice(price.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PriceList;
