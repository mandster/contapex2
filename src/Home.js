import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="home-container">
      <div className="button-container">
      <Link to="/Products" className="button">
        <div className="home-button "  id="cancel-button">
           <h4> Products </h4>
        </div>

          </Link>
        <Link to="/Employees" className="button " >

        <div className="home-button " id="edit-button">
        <h4>  Employees </h4>
        </div>
        </Link>
        <Link to="/Entries" className="button" >
        <div className="home-button " id="add-button">
        <h4>  Entries </h4>
        </div>
        </Link>
        <Link to="/Calculate" className="button " >
        <div className="home-button " id="delete-button">
        <h4>   Calculate </h4>
      </div>
        </Link>
      </div>
    </div>
  );
};

export default Home;
