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
         
        </header>
      </div>
    </>
  );
}

export default App;
