import {
  addEmployeeToFirebase,
  updateEmployeeInFirebase,
  deleteEmployeeInFirebase,
  getAllEmployeesFromFirebase,
} from "./_services/firebaseService";
import { useEffect, useState } from "react";
import "./styles.css";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showAddButton, setAddButton] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      const employeesFromFirebase = await getAllEmployeesFromFirebase();
      setEmployees(employeesFromFirebase);
    };
    fetchEmployees();
  }, []);

  const handleAddButton = () => {
    setShowForm(true);
    setAddButton(false);
  };

  const handleCancelAdd = () => {
    setShowForm(false);
    setAddButton(true);
  };

  const onAddEmployee = async (employee) => {
    const employeeId = await addEmployeeToFirebase(employee);
    setEmployees([...employees, { id: employeeId, ...employee }]);
  };

  const onEditEmployee = async (id, updatedEmployee) => {
    const updatedEmployeeWithId = { ...updatedEmployee, id };

    if (Array.isArray(employees)) {
      setEmployees(
        employees.map((employee) =>
          employee.id === id ? updatedEmployeeWithId : employee
        )
      );
    } else if (typeof employees === "object" && employees !== null) {
      const employeesArray = Object.values(employees);
      setEmployees(
        employeesArray.map((employee) =>
          employee.id === id ? updatedEmployeeWithId : employee
        )
      );
    } else {
      console.error("employees is not an array or object:", employees);
    }

    await updateEmployeeInFirebase(id, updatedEmployeeWithId);
  };

  const onDeleteEmployee = async (id) => {
    await deleteEmployeeInFirebase(id);

    if (Array.isArray(employees)) {
      setEmployees(employees.filter((employee) => employee.id !== id));
    } else {
      console.error("employees is not an array:", employees);
    }
  };

  const EmployeeForm = ({ onAddEmployee }) => {
    const [employeeName, setEmployeeName] = useState("");
    const [priceCategory, setPriceCategory] = useState("");
    const [definition, setDefinition] = useState("");

    const handleAddEmployee = () => {
      const newEmployee = {
        employeeName: employeeName,
        priceCategory: priceCategory,
        definition: definition,
      };

      onAddEmployee(newEmployee);
      setEmployeeName("");
      setPriceCategory("");
      setDefinition("");
      setShowForm(false);
    };

    return (
      <div className="a-form-container">
        <input
          type="text"
          placeholder="Employee Name"
          value={employeeName}
          onChange={(e) => setEmployeeName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Price Category"
          value={priceCategory}
          onChange={(e) => setPriceCategory(e.target.value)}
        />
        <input
          type="text"
          placeholder="Definition"
          value={definition}
          onChange={(e) => setDefinition(e.target.value)}
        />
      <div className="button-container">
        <button onClick={handleAddEmployee} id="add-button">
          Add Employee
        </button>
        <button onClick={handleCancelAdd} id="cancel-button">
          Cancel
        </button>
      </div>
      </div>
    );
  };

  const EmployeeListItem = ({ employee, onEditEmployee, onDeleteEmployee }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [updatedEmployeeName, setUpdatedEmployeeName] = useState(
      employee.employeeName ?? ""
    );
    const [updatedPriceCategory, setUpdatedPriceCategory] = useState(
      employee.priceCategory ?? ""
    );
    const [updatedDefinition, setUpdatedDefinition] = useState(
      employee.definition ?? ""
    );
    const handleEditEmployee = () => {
      setIsEditing(true);
    };

    const handleUpdateEmployee = () => {
      const updatedEmployeeDetails = {
        employeeName: updatedEmployeeName,
        priceCategory: updatedPriceCategory,
        definition: updatedDefinition,
      };

      onEditEmployee(employee.id, updatedEmployeeDetails);
      setIsEditing(false);
    };

    const handleCancelEdit = () => {
      setIsEditing(false);
    };

    return (
      <li className="a-item">
        {isEditing ? (
          <>
            <input
              type="text"
              placeholder="Employee Name"
              value={updatedEmployeeName}
              onChange={(e) => setUpdatedEmployeeName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Price Category"
              value={updatedPriceCategory}
              onChange={(e) => setUpdatedPriceCategory(e.target.value)}
            />
            <input
              type="text"
              placeholder="Definition"
              value={updatedDefinition}
              onChange={(e) => setUpdatedDefinition(e.target.value)}
            />
            <button onClick={handleUpdateEmployee}>Update</button>
            <button onClick={handleCancelEdit}>Cancel</button>
          </>
        ) : (
          <>
            <span className="a-name">{employee.employeeName}</span>
            <span className="a-size">{employee.priceCategory}</span>
            <button onClick={handleEditEmployee}>Edit</button>
            <button
              id="delete-button"
              onClick={() => onDeleteEmployee(employee.id)}
            >
              Delete
            </button>
          </>
        )}
      </li>
    );
  };

  const EmployeeListView = ({
    employees,
    onAddEmployee,
    onEditEmployee,
    onDeleteEmployee,
  }) => {
    return (
      <div>
        {/* Heading row */}
        <div className="a-list-heading">
          <span className="heading-item">Employee Name</span>
          <span className="heading-item">Price Category</span>
          <span className="heading-item">Options</span>
        </div>
        <ul className="a-list">
          {employees.map((employee) => (
            <EmployeeListItem
              key={employee.id}
              employee={employee}
              onEditEmployee={onEditEmployee}
              onDeleteEmployee={onDeleteEmployee}
            />
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="a-list-container">
      {showAddButton && (
        <button id="add-button" onClick={handleAddButton}>
          + Add new
        </button>
      )}

      {showForm && <EmployeeForm onAddEmployee={onAddEmployee} />}
      <EmployeeListView
        employees={employees}
        onAddEmployee={onAddEmployee}
        onEditEmployee={onEditEmployee}
        onDeleteEmployee={onDeleteEmployee}
      />
    </div>
  );
};

export default EmployeeList;
