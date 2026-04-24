import React, { useEffect, useState } from "react";
import {
  getAllEmployeesFromFirebase,
  getAllEntriesFromFirebase,
  formatDate,
} from "../_services/firebaseService";


const Calculate = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Initialize with current month
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [entries, setEntries] = useState([]);
  const [totalMonthAmount, setTotalMonthAmount] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [employees, setEmployees] = useState([]);
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc"); // Default sort order
  

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const employeesData = await getAllEmployeesFromFirebase();
        setEmployees(employeesData);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };
    fetchEmployees();
  }, []);

  const handleMonthChange = (e) => {
    setSelectedMonth(parseInt(e.target.value)); // Ensure the value is parsed to an integer
  };

  const handleYearChange = (e) => {
    setSelectedYear(parseInt(e.target.value));
  };


const sortEntries = (field) => {
  if (sortBy === field) {
    // If already sorting by the same field, toggle the sort order
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  } else {
    // If sorting by a different field, set the new field and reset the sort order to ascending
    setSortBy(field);
    setSortOrder("asc");
  }
};

// Sort entries based on selected field and order
let sortedEntries = [...entries];
if (sortBy) {
  sortedEntries.sort((a, b) => {
    if (a[sortBy] < b[sortBy]) {
      return sortOrder === "asc" ? -1 : 1;
    }
    if (a[sortBy] > b[sortBy]) {
      return sortOrder === "asc" ? 1 : -1;
    }
    return 0;
  });
}

// Function to toggle sort icon based on current sorting field and order
const getSortIcon = (field) => {
  if (sortBy === field) {
    return sortOrder === "asc" ? "▲" : "▼";
  }
  return "";
};


  const handleGetRecords = async () => {
    if (!selectedMonth || !selectedYear || !selectedEmployeeId) {
      alert("Please select month, year, and employee");
      return;
    }

    try {
      const allEntries = await getAllEntriesFromFirebase();
      const filteredEntries = allEntries.filter((entry) => {
        const [entryYear, entryMonth] = String(entry.dateAdded).split('T')[0].split('-').map(Number);
        return entryMonth === selectedMonth && entryYear === selectedYear && entry.employeeId === selectedEmployeeId;
      });

      let total = 0;
      let totalQty = 0;

      // Entries already carry price tiers and price_category from the DB JOIN —
      // no extra API calls needed per entry.
      const updatedEntries = filteredEntries.map((entry) => {
        const pc = entry.priceCategory;
        const price = (pc === '1' || pc === '2' || pc === '3')
          ? entry.price
          : (entry['price' + pc] ?? entry.price);
        const rowTotal = entry.quantity * (parseFloat(price) || 0);
        total += rowTotal;
        totalQty += parseFloat(entry.quantity);
        return { ...entry, price: parseFloat(price) || 0, rowTotal };
      });

      setEntries(updatedEntries);
      setTotalMonthAmount(total);
      setTotalQuantity(totalQty);
    } catch (error) {
      console.error("Error fetching records:", error);
    }
  };

  return (
    <div>
      <div className="add-form">
        <h3 className="p-2 m-2">Choose date and Employee</h3>
        <div className="p-2 m-2">
          <label>Month:</label>
          <select
            className="m-2"
            value={selectedMonth}
            onChange={handleMonthChange}
          >
            {Array.from({ length: 12 }, (_, index) => (
              <option key={index + 1} value={index + 1}>
                {getMonthName(index + 1)}
              </option>
            ))}
          </select>

          <label>Year:</label>
          <select
  className="m-2"
  value={selectedYear}
  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
>
  {Array.from({ length: 30 }, (_, index) => (
    <option key={index + 2021} value={index + 2021}>
      {index + 2021}
    </option>
  ))}
</select>

          <label>Employee:</label>
          <select
            className="m-2"
            value={selectedEmployeeId}
            onChange={(e) => setSelectedEmployeeId(e.target.value)}
          >
            <option value="">Select Employee</option>
            {employees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.employeeName}
              </option>
            ))}
          </select>
          <button className="m-2 " id="add-button" onClick={handleGetRecords}>
            Get Records
          </button>
        </div>
      </div>
      <div className="a-list-container">
  <ul>
    <li className="a-list-heading">
      <span className="heading-item" onClick={() => sortEntries("dateAdded")}>
        Date {getSortIcon("dateAdded")}
      </span>
      <span className="heading-item" onClick={() => sortEntries("productName")}>
        Product {getSortIcon("productName")}
      </span>
      <span className="heading-item" onClick={() => sortEntries("quantity")}>
        Quantity {getSortIcon("quantity")}
      </span>
      <span className="heading-item" onClick={() => sortEntries("price")}>
        Price {getSortIcon("price")}
      </span>
      <span className="heading-item" onClick={() => sortEntries("rowTotal")}>
        Row Total {getSortIcon("rowTotal")}
      </span>
    </li>
    {sortedEntries.map((entry) => (
      <li className="a-item" key={entry.id}>              <span className="a-size">{formatDate(entry.dateAdded)}</span>
              <span className="a-size centered-text">{entry.productName}</span>
              <span className="a-size centered-text">{entry.quantity}</span>
              <span className="a-size centered-text">{entry.price}</span>
              <span className="a-size centered-text">
                {entry.rowTotal.toFixed(2)}
              </span>
            </li>

         
          ))}
                     <li className="a-item">
           <span className="a-size"></span>
           <span className="a-size centered-text"></span>
           <span className="a-size centered-text"><b>{totalQuantity.toFixed(0)} </b></span>
           <span className="a-size centered-text"></span>
           <span className="a-size centered-text"></span>
         </li>
        </ul>
      </div>
      <div className="total">
        <strong>Total Month Amount: Rs.</strong> {totalMonthAmount.toFixed(2)}
      </div>
    </div>
  );
};

export default Calculate;

const getMonthName = (month) => {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return monthNames[month - 1];
};
