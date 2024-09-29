import React, { useState } from 'react';

function AddColumnModal({ setShowModal, addColumn }) {
  const [columnName, setColumnName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (columnName.trim() === '') return;
    addColumn(columnName);
    setShowModal(false);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Add New Column</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={columnName}
            onChange={(e) => setColumnName(e.target.value)}
            placeholder="Column Name"
          />
          <button type="submit">Add</button>
          <button onClick={() => setShowModal(false)}>Cancel</button>
        </form>
      </div>
    </div>
  );
}

export default AddColumnModal;
