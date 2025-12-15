import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../api.js';
import { Modal } from '../components/Modal.jsx';

export function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ employeeID: '', name: '', position: '', salary: '' });

  useEffect(() => {
    load().catch(console.error);
  }, []);

  async function load() {
    const res = await api.get('/employees');
    setEmployees(res.data);
  }

  function openCreate() {
    setEditing(null);
    setForm({ employeeID: '', name: '', position: '', salary: '' });
    setModalOpen(true);
  }

  function openEdit(emp) {
    setEditing(emp);
    setForm({
      employeeID: emp.employeeID,
      name: emp.name,
      position: emp.position,
      salary: emp.salary,
    });
    setModalOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const payload = {
      employeeID: Number(form.employeeID),
      name: form.name,
      position: form.position,
      salary: Number(form.salary),
    };
    if (editing) {
      await api.patch(`/employees/${editing._id}`, payload);
    } else {
      await api.post('/employees', payload);
    }
    setModalOpen(false);
    await load();
  }

  async function handleDelete(emp) {
    if (!window.confirm('Delete this employee?')) return;
    await api.delete(`/employees/${emp._id}`);
    await load();
  }

  const filtered = employees.filter((e) => {
    const term = search.toLowerCase();
    return (
      !term ||
      e.name.toLowerCase().includes(term) ||
      e.position.toLowerCase().includes(term)
    );
  });

  return (
    <div className="page">
      <section className="section toolbar">
        <div>
          <h2>Employees</h2>
          <p className="section-subtitle">Manage your Krusty Krab crew.</p>
        </div>
        <div className="toolbar-right">
          <input
            className="search-input"
            placeholder="Search employees..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="btn primary" onClick={openCreate}>
            + Add Employee
          </button>
        </div>
      </section>

      <section className="section">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Position</th>
                <th>Salary</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filtered.map((e) => (
                <motion.tr
                  key={e._id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <td>{e.employeeID}</td>
                  <td>{e.name}</td>
                  <td>{e.position}</td>
                  <td>${e.salary.toFixed(2)}</td>
                  <td className="actions-cell">
                    <button className="icon-btn" onClick={() => openEdit(e)}>
                      ✎
                    </button>
                    <button className="icon-btn danger" onClick={() => handleDelete(e)}>
                      🗑
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Modal
        isOpen={modalOpen}
        title={editing ? 'Edit Employee' : 'Add Employee'}
        onClose={() => setModalOpen(false)}
      >
        <form className="modal-form" onSubmit={handleSubmit}>
          <label>
            Employee ID
            <input
              type="number"
              required
              value={form.employeeID}
              onChange={(e) => setForm({ ...form, employeeID: e.target.value })}
            />
          </label>
          <label>
            Name
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </label>
          <label>
            Position
            <input
              type="text"
              required
              value={form.position}
              onChange={(e) => setForm({ ...form, position: e.target.value })}
            />
          </label>
          <label>
            Salary
            <input
              type="number"
              step="0.01"
              required
              value={form.salary}
              onChange={(e) => setForm({ ...form, salary: e.target.value })}
            />
          </label>
          <div className="modal-footer">
            <button type="button" className="btn ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn primary">
              Save
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}


