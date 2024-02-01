import React from "react";

const nav = () => {
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className="collapse navbar-collapse justify-content-end"
            id="navbarNav"
          >
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className="nav-link" href="/">
                  Home
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="Products">
                  Products
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="Employees">
                  Employees
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="Entries">
                  Entries
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="Search">
                  Search
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="Calculate">
                  Calculate
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default nav;
