import {
  addEmployeeToFirebase,
  updateEmployeeInFirebase,
  deleteEmployeeInFirebase,
  getAllEmployeesFromFirebase,
} from "../_services/firebaseService";
import { useEffect, useState } from "react";
import "../styles.css";

const normalize = (value) => value.trim().toLowerCase();

const EmployeeForm = ({ onAddEmployee, onCancel }) => {
  const [employeeName, setEmployeeName] = useState("");
  const [priceCategory, setPriceCategory] = useState("");
  const [definition, setDefinition] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddEmployee = async () => {
    if (isSubmitting) return;

    if (!employeeName.trim()) {
      alert("Employee name is required.");
      return;
    }

    setIsSubmitting(true);

    try {
      await onAddEmployee({
        employeeName: employeeName.trim(),
        priceCategory: priceCategory.trim(),
        definition: definition.trim(),
      });

      setEmployeeName("");
      setPriceCategory("");
      setDefinition("");
    } finally {
      setIsSubmitting(false);
    }
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
        <button
          onClick={handleAddEmployee}
          id="add-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Adding..." : "Add Employee"}
        </button>

        <button onClick={onCancel} id="cancel-button" disabled={isSubmitting}>
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
  const [isSaving, setIsSaving] = useState(false);

  const handleUpdateEmployee = async () => {
    if (isSaving) return;

    if (!updatedEmployeeName.trim()) {
      alert("Employee name is required.");
      return;
    }

    setIsSaving(true);

    try {
      await onEditEmployee(employee.id, {
        employeeName: updatedEmployeeName.trim(),
        priceCategory: updatedPriceCategory.trim(),
        definition: updatedDefinition.trim(),
      });

      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setUpdatedEmployeeName(employee.employeeName ?? "");
    setUpdatedPriceCategory(employee.priceCategory ?? "");
    setUpdatedDefinition(employee.definition ?? "");
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

          <button onClick={handleUpdateEmployee} disabled={isSaving}>
            {isSaving ? "Saving..." : "Update"}
          </button>

          <button onClick={handleCancelEdit} disabled={isSaving}>
            Cancel
          </button>
        </>
      ) : (
        <>
          <span className="a-name">{employee.employeeName}</span>
          <span className="a-size">{employee.priceCategory}</span>

          <button onClick={() => setIsEditing(true)}>Edit</button>

          <button id="delete-button" onClick={() => onDeleteEmployee(employee.id)}>
            Delete
          </button>
        </>
      )}
    </li>
  );
};

const EmployeeListView = ({ employees, onEditEmployee, onDeleteEmployee }) => {
  return (
    <>
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
    </>
  );
};

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      const employeesFromFirebase = await getAllEmployeesFromFirebase();

      setEmployees(Array.isArray(employeesFromFirebase) ? employeesFromFirebase : []);
    };

    fetchEmployees();
  }, []);

  const handleAddButton = () => {
    setShowForm(true);
  };

  const handleCancelAdd = () => {
    setShowForm(false);
  };

  const onAddEmployee = async (employee) => {
    const duplicateExists = employees.some(
      (existingEmployee) =>
        normalize(existingEmployee.employeeName ?? "") ===
        normalize(employee.employeeName ?? "")
    );

    if (duplicateExists) {
      alert("Employee already exists.");
      return;
    }

    const employeeId = await addEmployeeToFirebase(employee);

    setEmployees((prevEmployees) => [
      ...prevEmployees,
      {
        id: employeeId,
        ...employee,
      },
    ]);

    setShowForm(false);
  };

  const onEditEmployee = async (id, updatedEmployee) => {
    const duplicateExists = employees.some(
      (existingEmployee) =>
        existingEmployee.id !== id &&
        normalize(existingEmployee.employeeName ?? "") ===
          normalize(updatedEmployee.employeeName ?? "")
    );

    if (duplicateExists) {
      alert("Another employee with this name already exists.");
      return;
    }

    const updatedEmployeeWithId = {
      id,
      ...updatedEmployee,
    };

    await updateEmployeeInFirebase(id, updatedEmployeeWithId);

    setEmployees((prevEmployees) =>
      prevEmployees.map((employee) =>
        employee.id === id ? updatedEmployeeWithId : employee
      )
    );
  };

  const onDeleteEmployee = async (id) => {
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this employee?"
    );

    if (!shouldDelete) return;

    await deleteEmployeeInFirebase(id);

    setEmployees((prevEmployees) =>
      prevEmployees.filter((employee) => employee.id !== id)
    );
  };

  return (
    <div className="a-list-container">
      {!showForm && (
        <button id="add-button" onClick={handleAddButton}>
          + Add new
        </button>
      )}

      {showForm && (
        <EmployeeForm onAddEmployee={onAddEmployee} onCancel={handleCancelAdd} />
      )}

      <EmployeeListView
        employees={employees}
        onEditEmployee={onEditEmployee}
        onDeleteEmployee={onDeleteEmployee}
      />
    </div>
  );
};

export default EmployeeList;