import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="home-container">
      <h1>Welcome to Our Imaginative Homepage!</h1>
      <div className="button-container ">
        <div className="home-button ">
          <Link to="/Products" className="button" id="cancel-button">
            Products
          </Link>
        </div>
        <Link to="/Employees" className="button home-button" id="edit-button">
          Employees
        </Link>
        <Link to="/Entries" className="button home-button" id="add-button">
          Entries
        </Link>
        <Link to="/Calculate" className="button home-button" id="delete-button">
          Calculate
        </Link>
      </div>
    </div>
  );
};

export default Home;
