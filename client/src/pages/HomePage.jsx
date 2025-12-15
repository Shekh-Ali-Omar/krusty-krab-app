import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../api.js';
import { StatsStrip } from '../components/StatsStrip.jsx';

export function HomePage() {
  const [krusty, setKrusty] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [totals, setTotals] = useState({ employees: 0, customers: 0, orders: 0 });

  useEffect(() => {
    async function load() {
      const [krustyRes, menuRes, empRes, custRes, orderRes] = await Promise.all([
        api.get('/krusty'),
        api.get('/menu-items'),
        api.get('/employees'),
        api.get('/customers'),
        api.get('/orders'),
      ]);
      setKrusty(krustyRes.data[0] || null);
      setMenuItems(menuRes.data || []);
      setTotals({
        employees: empRes.data.length,
        customers: custRes.data.length,
        orders: orderRes.data.length,
      });
    }
    load().catch(console.error);
  }, []);

  return (
    <div className="page">
      <div className="hero">
        <div>
          <h2>Welcome to the Krusty Krab Dashboard</h2>
          {krusty && (
            <p className="hero-text">
              Serving Bikini Bottom from <strong>{krusty.location}</strong>, open{' '}
              {krusty.openingHours}. Call us at <strong>{krusty.phone}</strong>.
            </p>
          )}
        </div>
      </div>

      <StatsStrip
        stats={[
          { label: 'Employees', value: totals.employees },
          { label: 'Customers', value: totals.customers },
          { label: 'Orders', value: totals.orders },
        ]}
      />

      <section className="section">
        <div className="section-header">
          <h3>Featured Menu</h3>
        </div>
        <div className="card-grid">
          {menuItems.map((item) => (
            <motion.article
              key={item._id}
              className="card"
              whileHover={{ y: -4, boxShadow: '0 6px 18px rgba(15,52,96,0.25)' }}
            >
              <div className="card-image-placeholder">
                🍔
              </div>
              <div className="card-header">
                <h4>{item.name}</h4>
                <span className="price-badge">${item.price.toFixed(2)}</span>
              </div>
              <p className="card-description">{item.description}</p>
              <p className="ingredients">
                <strong>Ingredients:</strong> {item.ingredients.join(', ')}
              </p>
            </motion.article>
          ))}
        </div>
      </section>
    </div>
  );
}


