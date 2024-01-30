import React, { useEffect, useState } from "react";
import {
  getAllEmployeesFromFirebase,
  getAllEntriesFromFirebase,
  getProductByIdFromFirebase,
  formatDate
} from "../_services/firebaseService";

const Calculate = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Initialize with current month
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [entries, setEntries] = useState([]);
  const [totalMonthAmount, setTotalMonthAmount] = useState(0);
  const [employees, setEmployees] = useState([]);

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

  const handleGetRecords = async () => {
    console.log(
      selectedMonth + " ss " + selectedYear + " cc " + selectedEmployeeId
    );
    if (!selectedMonth || !selectedYear || !selectedEmployeeId) {
      alert("Please select month, year, and employee");
      return;
    }

    try {
      // Fetch entries for the selected employee and month/year
      const allEntries = await getAllEntriesFromFirebase();
      const filteredEntries = allEntries.filter((entry) => {
        const entryDate = new Date(entry.dateAdded);
        const month = entryDate.getMonth() + 1;
        const year = entryDate.getFullYear();
        const entryEmployeeId = entry.employeeId; // Rename to avoid conflict
        //   console.log(entryEmployeeId + " " + selectedEmployeeId);
        return (
          month === selectedMonth &&
          year === selectedYear &&
          entryEmployeeId === selectedEmployeeId // Use selectedEmployeeId or any variable holding the selected employee ID
        );
      });
      let total = 0;
      console.log(filteredEntries);
      const updatedEntries = await Promise.all(
        filteredEntries.map(async (entry) => {
          // console.log(entry.productId + " dsds " + entry.employeeId)
          const product = await getProductByIdFromFirebase(
            entry.productId,
            entry.employeeId
          );
          const rowTotal = entry.quantity * (product.price || 0); // Use 0 if price is not available
          total += parseFloat(rowTotal);
          return {
            ...entry,
            productName: product.productName,
            price: product.price,
            rowTotal,
          };
        })
      );
      setEntries(updatedEntries);
      setTotalMonthAmount(total);
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
            <option value="">Select Year</option>
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
            <span className="heading-item">Date</span>
            <span className="heading-item">Product</span>
            <span className="heading-item">Quantity</span>
            <span className="heading-item">Price</span>
            <span className="heading-item">Row Total</span>
          </li>
          {entries.map((entry) => (
            <li className="a-item" key={entry.id}>
              <span className="a-size">{formatDate(entry.dateAdded)}</span>
              <span className="a-size centered-text">{entry.productName}</span>
              <span className="a-size centered-text">{entry.quantity}</span>
              <span className="a-size centered-text">{entry.price}</span>
              <span className="a-size centered-text">
                {entry.rowTotal.toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="total">
        <strong>Total Month Amount:</strong> {totalMonthAmount.toFixed(2)}
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
