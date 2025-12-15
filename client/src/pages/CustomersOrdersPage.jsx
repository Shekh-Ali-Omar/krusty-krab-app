import React, { useEffect, useState } from 'react';
import api from '../api.js';
import { Modal } from '../components/Modal.jsx';

export function CustomersOrdersPage() {
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customerModalOpen, setCustomerModalOpen] = useState(false);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [customerForm, setCustomerForm] = useState({
    customerID: '',
    name: '',
    contactInfo: '',
  });
  const [orderForm, setOrderForm] = useState({
    orderID: '',
    customerID: '',
    menuItemIDs: '',
    quantity: '',
    date: '',
  });

  useEffect(() => {
    load().catch(console.error);
  }, []);

  async function load() {
    const [custRes, orderRes] = await Promise.all([
      api.get('/customers'),
      api.get('/orders'),
    ]);
    setCustomers(custRes.data);
    setOrders(orderRes.data);
  }

  async function submitCustomer(e) {
    e.preventDefault();
    await api.post('/customers', {
      customerID: Number(customerForm.customerID),
      name: customerForm.name,
      contactInfo: customerForm.contactInfo,
    });
    setCustomerModalOpen(false);
    setCustomerForm({ customerID: '', name: '', contactInfo: '' });
    await load();
  }

  async function submitOrder(e) {
    e.preventDefault();
    const menuNames = orderForm.menuItemIDs
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean);
    const quantities = orderForm.quantity
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean)
      .map((v) => Number(v));
    await api.post('/orders', {
      orderID: Number(orderForm.orderID),
      customerID: Number(orderForm.customerID),
      menuItemIDs: menuNames,
      quantity: quantities,
      date: orderForm.date,
    });
    setOrderModalOpen(false);
    setOrderForm({ orderID: '', customerID: '', menuItemIDs: '', quantity: '', date: '' });
    await load();
  }

  return (
    <div className="page">
      <section className="section toolbar">
        <div>
          <h2>Customers &amp; Orders</h2>
          <p className="section-subtitle">
            See who&apos;s dining and which orders keep Mr. Krabs happy.
          </p>
        </div>
        <div className="toolbar-right">
          <button className="btn" onClick={() => setCustomerModalOpen(true)}>
            + Add Customer
          </button>
          <button className="btn primary" onClick={() => setOrderModalOpen(true)}>
            + New Order
          </button>
        </div>
      </section>

      <section className="section split-layout">
        <div className="split-column">
          <h3>Customers</h3>
          <ul className="card-list">
            {customers.map((c) => (
              <li key={c._id} className="card customer-card">
                <div className="card-header">
                  <h4>{c.name}</h4>
                  <span className="badge">ID: {c.customerID}</span>
                </div>
                <p>{c.contactInfo}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="split-column">
          <h3>Orders</h3>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer ID</th>
                  <th>Items</th>
                  <th>Quantities</th>
                  <th>Total</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o._id}>
                    <td>#{o.orderID}</td>
                    <td>{o.customerID}</td>
                    <td>{o.menuItemIDs.join(', ')}</td>
                    <td>{o.quantity.join(', ')}</td>
                    <td>${(o.totalPrice || 0).toFixed(2)}</td>
                    <td>{new Date(o.date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <Modal
        isOpen={customerModalOpen}
        title="Add Customer"
        onClose={() => setCustomerModalOpen(false)}
      >
        <form className="modal-form" onSubmit={submitCustomer}>
          <label>
            Customer ID
            <input
              type="number"
              required
              value={customerForm.customerID}
              onChange={(e) =>
                setCustomerForm({ ...customerForm, customerID: e.target.value })
              }
            />
          </label>
          <label>
            Name
            <input
              type="text"
              required
              value={customerForm.name}
              onChange={(e) => setCustomerForm({ ...customerForm, name: e.target.value })}
            />
          </label>
          <label>
            Contact Info
            <input
              type="text"
              required
              value={customerForm.contactInfo}
              onChange={(e) =>
                setCustomerForm({ ...customerForm, contactInfo: e.target.value })
              }
            />
          </label>
          <div className="modal-footer">
            <button type="button" className="btn ghost" onClick={() => setCustomerModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn primary">
              Save
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={orderModalOpen}
        title="New Order"
        onClose={() => setOrderModalOpen(false)}
      >
        <form className="modal-form" onSubmit={submitOrder}>
          <label>
            Order ID
            <input
              type="number"
              required
              value={orderForm.orderID}
              onChange={(e) => setOrderForm({ ...orderForm, orderID: e.target.value })}
            />
          </label>
          <label>
            Customer ID
            <input
              type="number"
              required
              value={orderForm.customerID}
              onChange={(e) => setOrderForm({ ...orderForm, customerID: e.target.value })}
            />
          </label>
          <label>
            Menu Item Names (comma separated)
            <input
              type="text"
              placeholder="Krabby Patty, Kelp Fries"
              required
              value={orderForm.menuItemIDs}
              onChange={(e) =>
                setOrderForm({ ...orderForm, menuItemIDs: e.target.value })
              }
            />
          </label>
          <label>
            Quantities (comma separated)
            <input
              type="text"
              placeholder="2,1"
              required
              value={orderForm.quantity}
              onChange={(e) => setOrderForm({ ...orderForm, quantity: e.target.value })}
            />
          </label>
          <label>
            Date
            <input
              type="date"
              required
              value={orderForm.date}
              onChange={(e) => setOrderForm({ ...orderForm, date: e.target.value })}
            />
          </label>
          <div className="modal-footer">
            <button type="button" className="btn ghost" onClick={() => setOrderModalOpen(false)}>
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


