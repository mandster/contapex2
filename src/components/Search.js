import React, { useEffect, useState } from 'react';
import {
  addEntryToFirebase,
  updateEntryInFirebase,
  deleteEntryInFirebase,
  getAllEntriesFromFirebase,
  getAllProductsFromFirebase,
  getAllEmployeesFromFirebase,
  formatDate
} from '../_services/firebaseService';

const Search = () => {
  const [entries, setEntries] = useState([]);
  const [products, setProducts] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [quantity, setQuantity] = useState('');
  const [productId, setProductId] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [editingEntryId, setEditingEntryId] = useState(null);
  const [dateAdded, setDateAdded] = useState(new Date().toISOString().split('T')[0]); // Initialize with current date
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

  const handleEmployeeChange = (e) => {
    setEmployeeId(e.target.value);
  };

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
    setDateAdded(new Date().toISOString().split('T')[0]); // Reset date to current date
  };

  const getProductName = (productId) => {
    const product = products.find((p) => p.productId === productId);
    return product ? product.productName : '';
  };

  const getEmployeeName = (employeeId) => {
    const employee = employees.find((e) => e.id === employeeId);
    return employee ? employee.employeeName : '';
  };

  const handleEditEntry = async (entry) => {
    setQuantity(entry.quantity);
    setProductId(entry.productId);
    setEmployeeId(entry.employeeId);
    setEditingEntryId(entry.id);
    setDateAdded(entry.dateAdded); // Set dateAdded state
  };

  const handleEditEntrySubmit = async (e) => {
    e.preventDefault();

    if (!productId || !employeeId || !quantity || !dateAdded) {
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
  };

  const handleAddEntry = async () => {

    const entry = {
      quantity,
      productId,
      employeeId,
      dateAdded,
    };
  
    await addEntryToFirebase(entry);
    clearForm();
  
    // Display success message
    alert('Entry added successfully!');
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

      
      const entryDate = new Date(entry.dateAdded);
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
  const totalQuantity = currentEntries.reduce((total, entry) => total + Number(entry.quantity), 0);
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
        <button className="m-2" onClick={handleGetEntries}>Get Entries</button>
      </div>
      <div className="add-form">
        <h4>Edit Entry</h4>
        <form onSubmit={(e) => { e.preventDefault(); handleEditEntrySubmit(e) }}>
          <label>Date:</label>
          <input className="m-2" type="date" value={dateAdded} onChange={(e) => setDateAdded(e.target.value)} size="30" />
          <select className="m-2 control form-control" value={employeeId} onChange={(e) => setEmployeeId(e.target.value)}>
            <option value="">Select Employee</option>
            {employees.map(employee => (
              <option key={employee.id} value={employee.id}>{employee.employeeName}</option>
            ))}
          </select>
          <select className="m-2  control form-control" value={productId} onChange={(e) => setProductId(e.target.value)}>
            <option value="">Select Product</option>
            {products
              .sort((a, b) => a.productName.localeCompare(b.productName)) // Sort products alphabetically by productName
              .map(product => (
                <option key={product.productId} value={product.productId}>{product.productName}</option>
              ))}
          </select>
          <input className="m-2 control form-control" placeholder="Quantity" type="number" required style={{width:90}} value={quantity} onChange={(e) => setQuantity(e.target.value)} size="30" />
          <button className="m-2" id="add-button" type="submit"> Update Entry</button>
          <button className="m-2" type="button" onClick={() => clearForm()}>Reset</button>
        </form>
      </div>

      {/* Render the entry list with heading row */}
      <div className="a-list-container">
        <ul>
          <li className="a-list-heading">
          <span className="heading-item">Date</span>
            <span className="heading-item">Product</span>
            <span className="heading-item">Employee</span>
            <span className="heading-item">Quantity</span>
            <span className="heading-item">Options</span>
          </li>
          {currentEntries.map((entry) => (
            <li className="a-item" key={entry.id}>
              <span className="a-size">{formatDate(entry.dateAdded)}</span>
              <span className="a-size">{getProductName(entry.productId)}</span>
              <span className="a-size centered-text">{getEmployeeName(entry.employeeId)}</span>
              <span className="a-size centered-text">{entry.quantity}</span>
              <span className="a-size centered-text">
                <button id="edit-button" onClick={() => handleEditEntry(entry)}>Edit</button>
                <button id="delete-button" onClick={() => handleDeleteEntry(entry.id)}>Delete</button>
              </span>
            </li>
          ))}
            <li className="a-item">
           <span className="a-size"></span>
           <span className="a-size centered-text"></span>
           <span className="a-size centered-text"></span>
           <span className="a-size centered-text"><b>{totalQuantity} </b></span>
           <span className="a-size centered-text"></span>
         </li>
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
        <button id="add-button" onClick={() => setEntriesPerPage(9999)}>All entries in single page</button>
      </div>
    </div>
  );
};

export default Search;