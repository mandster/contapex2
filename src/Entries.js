import { useEffect, useState } from "react";

const [editedDate, setEditedDate] = useState("");

<p>
  Date:
  {editingEntryId === entry.id ? (
    <input
      type="date"
      value={editedDate}
      onChange={(e) => setEditedDate(e.target.value)}
    />
  ) : (
    entry.date
  )}
</p>;

useEffect(() => {
  if (editedDate && editingEntryId) {
    updateEntry(editingEntryId, { date: editedDate });
    setEditedDate("");
  }
}, [editedDate, editingEntryId]);

const entriesRef = firebase.database().ref("entries");

function addEntry(entry) {
  entriesRef.push(entry);
}

function updateEntry(entryId, updates) {
  entriesRef.child(entryId).update(updates);
}

function removeEntry(entryId) {
  entriesRef.child(entryId).remove();
}

function getEntries() {
  return entriesRef.orderByChild("date").once("value");
}

const [date, setDate] = useState("");
const [quantity, setQuantity] = useState("");

<form
  onSubmit={(e) => {
    e.preventDefault();
    addEntry({ date, quantity, productId, employeeId });
    setDate("");
    setQuantity("");
  }}
>
  <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
  <input
    type="number"
    value={quantity}
    onChange={(e) => setQuantity(e.target.value)}
  />
  <button type="submit">Add Entry</button>
</form>;
const Entries = () => {
  return (
    <>
      <select id="product-dropdown">
        {products.map((product) => (
          <option key={product.id} value={product.id}>
            {product.name}
          </option>
        ))}
      </select>
      <select id="employee-dropdown">
        {employees.map((employee) => (
          <option key={employee.id} value={employee.id}>
            {employee.name}
          </option>
        ))}
      </select>
    </>
  );
};

export default Entries;
