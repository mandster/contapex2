import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/css/bootstrap.css";
import logo from "./images/logo.jpg";
import Products from "./components/products";
import Employees from "./components/employees";
import Header from "./header";
import Home from "./Home";
import Entries from "./components/Entries";
import Calculate from "./components/Calculate";

function App() {
  return (
    <>
      <header className="App-header">
        <Header />
      </header>
      <div className="container">
        <BrowserRouter>
          <Routes>
            <Route path="/Products" element={<Products />} />
            <Route path="/Employees" element={<Employees />} />
            <Route path="/" element={<Home />} />
            <Route path="/Entries" element={<Entries />} />
            <Route path="/Calculate" element={<Calculate />} />
          </Routes>
        </BrowserRouter>
      </div>
      <div className="App"></div>
    </>
  );
}

export default App;
