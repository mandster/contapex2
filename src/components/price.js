import React, { useEffect, useState } from "react";
import {
  addPriceToFirebase,
  updatePriceInFirebase,
  deletePriceInFirebase,
  getAllPricesFromFirebase,
  getProductsFromFirebase,
} from "../_services/firebaseService";

const PriceList = () => {
  const [prices, setPrices] = useState([]);
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state
  const [editingPrice, setEditingPrice] = useState(null); // State for editing price
  const [editedPrice, setEditedPrice] = useState({
    price: "",
    price2: "",
    price3: "",
  }); // State for edited price
  const [newPrice, setNewPrice] = useState({
    product: "",
    price: "",
    price2: "",
    price3: "",
    date: "",
  });

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        setLoading(true);
        const pricesFromFirebase = await getAllPricesFromFirebase();
        setPrices(pricesFromFirebase);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const productsFromFirebase = await getProductsFromFirebase();
        setProducts(productsFromFirebase);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
    fetchProducts();
  }, []);

  const handleEditPrice = (price) => {
    setEditingPrice(price);
    setEditedPrice({
      price: price.price,
      price2: price.price2,
      price3: price.price3,
    });
  };

  const handleCancelEdit = () => {
    setEditingPrice(null);
    setEditedPrice({ price: "", price2: "", price3: "" });
  };

  const handleDeletePrice = async (priceId) => {
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this Price?"
    );

    if (shouldDelete) {
      await deletePriceInFirebase(priceId);

      setPrices((prevPrices) =>
        prevPrices.filter((price) => price.id !== priceId)
      );

      // Display success message
      alert("Price deleted successfully!");
    }
  };

  const getProductName = (productId) => {
   // console.log(productId)
    const product = products.find((p) => p.id === productId);
    return product ? product.productName : "Unknown Product";
  };

  const saveEditedPrice = async () => {
    try {
      const updatedPrice = {
        price: editedPrice.price,
        price2: editedPrice.price2,
        price3: editedPrice.price3,
      };

      await updatePriceInFirebase(editingPrice.id, updatedPrice);
      setPrices((prevPrices) =>
        prevPrices.map((price) =>
          price.id === editingPrice.id ? { ...price, ...updatedPrice } : price
        )
      );
      setEditingPrice(null);
      setEditedPrice({ price: "", price2: "", price3: "" });
    } catch (error) {
      console.error("Error updating price:", error);
    }
  };

  const handleAddButton = () => {
    setShowForm(true);
  };

  const handleCancelAdd = () => {
    setShowForm(false);
    setNewPrice({
      product: "",
      price: "",
      price2: "",
      price3: "",
      date: "",
    });
  };

  const onAddPrice = async () => {
    try {
      if (!newPrice.product || !newPrice.price) {
        alert("Please fill in price field.");
        return;
      }
      console.log(newPrice)
      const addedPrice = {
        productId: newPrice.product,
        price: parseFloat(newPrice.price),
        price2: parseFloat(newPrice.price2) || "",
        price3: parseFloat(newPrice.price3) || "",
      };
      await addPriceToFirebase(addedPrice);
      setPrices([...prices, addedPrice]);
      setShowForm(false);
      setNewPrice({
        product: "",
        price: "",
        price2: "",
        price3: "",
        date: "",
      });
    } catch (error) {
      console.error("Error adding price:", error);
    }
  };

  return (
    <div className="a-list-container">
      {loading && <p>Loading...</p>}
      <button id="add-button" onClick={handleAddButton}>
        + Add new price
      </button>
      {showForm && (
        <div className="a-form-container">
          <select
            className="a-select"
            value={newPrice.product}
            onChange={(e) => setNewPrice({ ...newPrice, product: e.target.value })}
          >
            <option value="" disabled>
              Select a product
            </option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.productName}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Price"
            value={newPrice.price}
            onChange={(e) => setNewPrice({ ...newPrice, price: e.target.value })}
          />
          <input
            type="text"
            placeholder="Price2"
            value={newPrice.price2}
            onChange={(e) => setNewPrice({ ...newPrice, price2: e.target.value })}
          />
          <input
            type="text"
            placeholder="Price3"
            value={newPrice.price3}
            onChange={(e) => setNewPrice({ ...newPrice, price3: e.target.value })}
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
              <span className="a2-name">{getProductName(price.product.id)}</span>
              {editingPrice === price ? (
                <div>
                  <input
                    type="text"
                    value={editedPrice.price}
                    onChange={(e) =>
                      setEditedPrice({ ...editedPrice, price: e.target.value })
                    }
                  />
                  <input
                    type="text"
                    value={editedPrice.price2}
                    onChange={(e) =>
                      setEditedPrice({ ...editedPrice, price2: e.target.value })
                    }
                  />
                  <input
                    type="text"
                    value={editedPrice.price3}
                    onChange={(e) =>
                      setEditedPrice({ ...editedPrice, price3: e.target.value })
                    }
                  />
                  <button onClick={saveEditedPrice}>Save</button>
                  <button onClick={handleCancelEdit}>Cancel</button>
                </div>
              ) : (
                <>
                  <span className="a-size">{price.price}</span>
                  <span className="a-size">{price.price2}</span>
                  <span className="a-size">{price.price3}</span>
                </>
              )}
              <button id="edit-button" onClick={() => handleEditPrice(price)}>
                Edit
              </button>
              <button
                id="delete-button"
                onClick={() => { handleDeletePrice(price.id)}}
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
