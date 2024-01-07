import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import logo from "./images/logo.jpg";
import Products from "./products";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/Products" element={<Products />} />
        </Routes>
      </BrowserRouter>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            <a href="/Products">Product</a> <code>src/App.js</code> and save to
            reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    </>
  );
}

export default App;
