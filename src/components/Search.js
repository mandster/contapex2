import React, { useEffect, useState } from 'react';
import {
  addEntryToFirebase,
  updateEntryInFirebase,
  deleteEntryInFirebase,
  getAllEntriesFromFirebase,
  getAllProductsFromFirebase,
  getAllEmployeesFromFirebase,
} from '../_services/firebaseService';

const Search = () => {
  const [entries, setEntries] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [products, setProducts] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [quantity, setQuantity] = useState('');
  const [productId, setProductId] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [dateAdded, setDateAdded] = useState('');
  const [editingEntryId, setEditingEntryId] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Default to current month
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Default to current year
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(60);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsData = await getAllProductsFromFirebase();
        const employeesData = await getAllEmployeesFromFirebase();
        const entriesData = await getEntriesForMonthAndYear(selectedMonth, selectedYear);

        setProducts(productsData);
        setEmployees(employeesData);
        setEntries(entriesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [selectedMonth, selectedYear]);

  // Fetch employees data asynchronously and set the state
useEffect(() => {
  const fetchEmployees = async () => {
    try {
      const employeesData = await getAllEmployeesFromFirebase();
      setEmployees(employeesData);
    } catch (error) {
      console.error('Error fetching employees data:', error);
    }
  };

  fetchEmployees();
}, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const entry = { dateAdded, quantity, productId, employeeId };

    if (editingEntryId) {
      await updateEntryInFirebase(editingEntryId, entry);
    } else {
      await addEntryToFirebase(entry);
    }
    clearForm();
  };

  const clearForm = () => {
    setQuantity('');
    setProductId('');
    setEmployeeId('');
    setEditingEntryId(null);
  };

  const handleAddButton = () => {
    setShowForm(true);
    setAddButton(false);
  };

  const handleCancelAdd = () => {
    setShowForm(false);
    setAddButton(true);
  };

  const getCurrentDate = () => {
    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1; // January is 0
    const year = currentDate.getFullYear();
  
    // Pad single digit day/month with leading zero
    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;
  
    return `${formattedDay}/${formattedMonth}/${year}`;
  };
  
  const getProductName = (productId) => {
    const product = products.find((p) => p.id === productId);
    return product ? product.productName : '';
  };


  const getEmployeeName = (employeeId) => {
    const employee = employees.find((e) => e.id === employeeId);
    return employee ? employee.employeeName : '';
  };

  const handleEditEntry= async (entry) => {
    console.log(entry);
    setQuantity(entry.quantity);
    setProductId(entry.productId);
    setEmployeeId(entry.employeeId);
    setDateAdded(entry.dateAdded)
    setEditingEntryId(entry.id);
    setShowForm(true);

  };

  const handleEditEntrySubmit = async (e) => {
    e.preventDefault();

    if (!productId || !employeeId || !quantity) {
      alert('Please fill in all required fields.');
      return;
    }

    const updatedEntry = { dateAdded, quantity, productId, employeeId };

    await updateEntryInFirebase(editingEntryId, updatedEntry);

    clearForm();

    // Display success message
    alert('Entry updated successfully!');

    // Refresh entries
    handleGetEntries();
    setShowForm(false);
  };



  const handleDeleteEntry = async (entryId) => {
    const shouldDelete = window.confirm('Are you sure you want to delete this entry?');

    if (shouldDelete) {
      await deleteEntryInFirebase(entryId);

      setEntries((prevEntries) => prevEntries.filter((entry) => entry.id !== entryId));

      // Display success message
      alert('Entry deleted successfully!');
    }
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(parseInt(e.target.value));
  };

  
  const handleEmployeeChange = (e) => {
    setEmployeeId(e.target.value);
  };

  const handleYearChange = (e) => {
    setSelectedYear(parseInt(e.target.value));
  };

  const handleGetEntries = async () => {
    const entriesData = await getEntriesForMonthAndYear(selectedMonth, selectedYear, employeeId);
    setEntries(entriesData);
    setCurrentPage(1); // Reset to the first page when fetching new entries
  };

  const getMonthName = (month) => {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return monthNames[month - 1];
  };

  const months = Array.from({ length: 12 }, (_, index) => ({ value: index + 1, label: getMonthName(index + 1) }));
  const years = Array.from({ length: 30 }, (_, index) => ({ value: 2021 + index, label: `${2021 + index}` }));

  const getEntriesForMonthAndYear = async (month, year, employeeId) => {
    const allEntries = await getAllEntriesFromFirebase();
  
    const filteredEntries = allEntries.filter((entry) => {
      const parseDate = (dateString) => {
        const [day, month, year] = dateString.split('/');
        return new Date(`${day}/${month}/${year}`);
      };
      
      const entryDate = parseDate(entry.dateAdded);
      const isSameMonthYear = entryDate.getMonth() + 1 === month && entryDate.getFullYear() === year;
      const belongsToEmployee = entry.employeeId === employeeId;
  
      return isSameMonthYear && belongsToEmployee;
    });
  
    return filteredEntries;
  };
  

  // Pagination
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = entries.slice(indexOfFirstEntry, indexOfLastEntry);

  // Render pagination buttons
  const pageNumbers = Array.from({ length: Math.ceil(entries.length / entriesPerPage) }, (_, index) => index + 1);

  const renderPageNumbers = pageNumbers.map((number) => (
    <button key={number} onClick={() => setCurrentPage(number)}>
      {number}
    </button>
  ));

  return (
    <div>
      <div className="p-2 m-2">
      <label>Employee:</label>
        <select className="m-2" value={employeeId}  onChange={handleEmployeeChange}>
          { <option> Select Employee </ option>}
          {employees.map(employee => (
            <option key={employee.id} value={employee.id}>{employee.employeeName}</option>
          ))}
        </select>
        <label className="">Month:</label>
        <select className="m-2" value={selectedMonth} onChange={handleMonthChange}>
          {months.map(month => (
            <option key={month.value} value={month.value}>{month.label}</option>
          ))}
        </select>
        <label>Year:</label>
        <select className="m-2" value={selectedYear} onChange={handleYearChange}>
          {years.map(year => (
            <option key={year.value} value={year.value}>{year.label}</option>
          ))}
        </select>
        <button className="m-2" id="add-button" onClick={handleGetEntries}>Get Entries</button>
      </div>
      {showForm && (
      <div className="add-form" id="edit-form">
        <h4>{ 'Edit Entry'}</h4>
        <form onSubmit={(e) => { e.preventDefault(); handleEditEntrySubmit(e)  }}>
        <label>Date:</label>
          <input className="m-2" type="string" value={dateAdded} onChange={(e) => setDate(e.target.value)} size="30" />
          <label>Product:</label>
          <select className="m-2" value={productId} onChange={(e) => setProductId(e.target.value)}>
            <option value="">Select Product</option>
            {products.map(product => (
              <option key={product.id} value={product.id}>{product.productName}</option>
            ))}
          </select>

          <label>Employee:</label>
          <select className="m-2" value={ employeeId} onChange={(e) => setEmployeeId(e.target.value)}>
            <option value="">Select Employee</option>
            {employees.map(employee => (
              <option key={employee.id} value={employee.id}>{employee.employeeName}</option>
            ))}
          </select>
          <label>Quantity:</label>
          <input className="m-2" type="number" style={{width:90}} value={quantity} onChange={(e) => setQuantity(e.target.value)} size="30" />
          <button className="m-2" type="submit">{ 'Update Entry' }</button>
          <button className="m-2" type="button" onClick={() => clearForm()}>Reset</button>
        </form>
      </div>
      )}
      {/* Render the entry list with heading row */}
      <div className="a-list-container">
      <ul >
        <li className="a-list-heading">
          <span className="heading-item">Product</span>
          <span className="heading-item">Employee</span>
          <span className="heading-item">Quantity</span>
          <span className="heading-item">Options</span>
        </li>
        {currentEntries.map((entry) => (
         
          <li  className="a-item" key={entry.id}>
            <span className="a-size">{getProductName(entry.productId)}</span>
            <span className="a-size centered-text">{getEmployeeName(entry.employeeId)}</span>
            <span className="a-size centered-text">{entry.quantity}</span>
            <span className="a-size centered-text">
              <button id="edit-button" onClick={() => handleEditEntry(entry)}>Edit</button>
              <button id="delete-button" onClick={() => handleDeleteEntry(entry.id)}>Delete</button>
            </span>
          </li>
        ))}
      </ul>
</div>
      {/* Render pagination buttons */}
      <div>
        <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
          Prev
        </button>
        {renderPageNumbers}
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === pageNumbers.length}
        >
          Next
        </button>
        <button id="add-button"  onClick={() => setEntriesPerPage(9999)} > All entries in single page</button>
      </div>
    </div>
  );
};

export default Search;
