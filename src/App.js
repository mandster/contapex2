import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/css/bootstrap.css";
import logo from "./images/logo.jpg";
import Products from "./products";
import Employees from "./employees";
import Header from "./header";

function App() {
  return (
    <>
      <header className="App-header">
        <Header />
      </header>
      <BrowserRouter>
        <Routes>
          <Route path="/Products" element={<Products />} />
          <Route path="/Employees" element={<Employees />} />
        </Routes>
      </BrowserRouter>

      <div className="App"></div>
    </>
  );
}

export default App;
