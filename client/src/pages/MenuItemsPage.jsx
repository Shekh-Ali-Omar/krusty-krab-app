import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../api.js';
import { Modal } from '../components/Modal.jsx';

export function MenuItemsPage() {
  const [menuItems, setMenuItems] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    ingredients: '',
  });

  // drag-and-drop order builder
  const [builderOpen, setBuilderOpen] = useState(false);
  const [orderItems, setOrderItems] = useState([]);
  const [builderCustomerID, setBuilderCustomerID] = useState('');
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    load().catch(console.error);
  }, []);

  async function load() {
    const res = await api.get('/menu-items');
    setMenuItems(res.data);
  }

  function openCreate() {
    setEditing(null);
    setForm({ name: '', description: '', price: '', ingredients: '' });
    setModalOpen(true);
  }

  function openEdit(item) {
    setEditing(item);
    setForm({
      name: item.name,
      description: item.description || '',
      price: item.price,
      ingredients: (item.ingredients || []).join(', '),
    });
    setModalOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const payload = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      ingredients: form.ingredients
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean),
    };
    if (editing) {
      await api.patch(`/menu-items/${editing._id}`, payload);
    } else {
      await api.post('/menu-items', payload);
    }
    setModalOpen(false);
    await load();
  }

  async function handleDelete(item) {
    if (!window.confirm('Delete this menu item?')) return;
    await api.delete(`/menu-items/${item._id}`);
    await load();
  }

  function addToBuilder(item) {
    setBuilderOpen(true);
    setOrderItems((prev) => {
      const existing = prev.find((p) => p.name === item.name);
      if (existing) {
        return prev.map((p) =>
          p.name === item.name ? { ...p, qty: p.qty + 1 } : p
        );
      }
      return [...prev, { name: item.name, price: item.price, qty: 1 }];
    });
  }

  function handleDrop(ev) {
    ev.preventDefault();
    setDragOver(false);
    const name = ev.dataTransfer.getData('text/name');
    const price = Number(ev.dataTransfer.getData('text/price'));
    if (!name) return;
    addToBuilder({ name, price });
  }

  function handleDragOver(ev) {
    ev.preventDefault();
    setDragOver(true);
  }

  function handleDragLeave() {
    setDragOver(false);
  }

  async function submitBuiltOrder() {
    if (!builderCustomerID || orderItems.length === 0) return;
    const menuItemIDs = orderItems.map((i) => i.name);
    const quantity = orderItems.map((i) => i.qty);
    const orderID = Date.now();
    const date = new Date().toISOString().slice(0, 10);
    await api.post('/orders', {
      orderID,
      customerID: Number(builderCustomerID),
      menuItemIDs,
      quantity,
      date,
    });
    // Optional: simple "cha-ching" sound placeholder via alert
    // In a real app you'd play an audio file here.
    window.alert('Order placed! Cha-ching 💰');
    setOrderItems([]);
  }

  const total = orderItems.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <div className="page">
      <section className="section toolbar">
        <div>
          <h2>Menu Items</h2>
          <p className="section-subtitle">
            Drag items into an order on the right to build a Krabby combo.
          </p>
        </div>
        <div className="toolbar-right">
          <button className="btn primary" onClick={openCreate}>
            + Add Item
          </button>
        </div>
      </section>

      <section className="section split-layout">
        <div className="split-column">
          <div className="card-grid">
            {menuItems.map((item) => (
              <motion.article
                key={item._id}
                className="card menu-card"
                draggable
                onDragStart={(ev) => {
                  ev.dataTransfer.setData('text/name', item.name);
                  ev.dataTransfer.setData('text/price', String(item.price));
                }}
                whileHover={{ y: -4, boxShadow: '0 6px 18px rgba(15,52,96,0.25)' }}
              >
                <div className="card-image-placeholder">🍔</div>
                <div className="card-header">
                  <h4>{item.name}</h4>
                  <span className="price-badge">${item.price.toFixed(2)}</span>
                </div>
                <p className="card-description">{item.description}</p>
                <p className="ingredients">
                  <strong>Ingredients:</strong> {item.ingredients.join(', ')}
                </p>
                <div className="card-actions">
                  <button className="btn" onClick={() => addToBuilder(item)}>
                    Add to order
                  </button>
                  <button className="icon-btn" onClick={() => openEdit(item)}>
                    ✎
                  </button>
                  <button className="icon-btn danger" onClick={() => handleDelete(item)}>
                    🗑
                  </button>
                </div>
              </motion.article>
            ))}
          </div>
        </div>

        <div className="split-column">
          <div
            className={
              'order-builder-drop ' + (dragOver ? 'order-builder-drop--active' : '')
            }
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDragLeave={handleDragLeave}
          >
            <h3>Order Builder</h3>
            <p className="section-subtitle">
              Drag menu cards here or click &quot;Add to order&quot;.
            </p>
            <label>
              Customer ID
              <input
                type="number"
                value={builderCustomerID}
                onChange={(e) => setBuilderCustomerID(e.target.value)}
                placeholder="e.g. 201"
              />
            </label>
            <ul className="card-list">
              {orderItems.map((i) => (
                <li key={i.name} className="card customer-card">
                  <div className="card-header">
                    <h4>{i.name}</h4>
                    <span className="badge">
                      {i.qty} × ${i.price.toFixed(2)}
                    </span>
                  </div>
                  <div className="order-item-controls">
                    <button
                      className="icon-btn"
                      onClick={() =>
                        setOrderItems((prev) =>
                          prev.map((p) =>
                            p.name === i.name && p.qty > 1
                              ? { ...p, qty: p.qty - 1 }
                              : p
                          )
                        )
                      }
                    >
                      −
                    </button>
                    <button
                      className="icon-btn"
                      onClick={() =>
                        setOrderItems((prev) =>
                          prev.map((p) =>
                            p.name === i.name ? { ...p, qty: p.qty + 1 } : p
                          )
                        )
                      }
                    >
                      +
                    </button>
                    <button
                      className="icon-btn danger"
                      onClick={() =>
                        setOrderItems((prev) => prev.filter((p) => p.name !== i.name))
                      }
                    >
                      🗑
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="order-total-row">
              <span>Total:</span>
              <strong>${total.toFixed(2)}</strong>
            </div>
            <button
              className="btn primary"
              disabled={!builderCustomerID || orderItems.length === 0}
              onClick={submitBuiltOrder}
            >
              Place Order
            </button>
          </div>
        </div>
      </section>

      <Modal
        isOpen={modalOpen}
        title={editing ? 'Edit Menu Item' : 'Add Menu Item'}
        onClose={() => setModalOpen(false)}
      >
        <form className="modal-form" onSubmit={handleSubmit}>
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
            Description
            <textarea
              rows="2"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </label>
          <label>
            Price
            <input
              type="number"
              step="0.01"
              required
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
          </label>
          <label>
            Ingredients (comma separated)
            <input
              type="text"
              value={form.ingredients}
              onChange={(e) => setForm({ ...form, ingredients: e.target.value })}
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


