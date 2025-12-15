import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import { HomePage } from './pages/HomePage.jsx';
import { EmployeesPage } from './pages/EmployeesPage.jsx';
import { CustomersOrdersPage } from './pages/CustomersOrdersPage.jsx';
import { MenuItemsPage } from './pages/MenuItemsPage.jsx';

export default function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <h1 className="logo-title">The Krusty Krab Console</h1>
          <p className="logo-subtitle">Bikini Bottom restaurant management, made fun.</p>
        </div>
        <nav className="navbar">
          <NavLink to="/" end className="nav-link">
            Home
          </NavLink>
          <NavLink to="/employees" className="nav-link">
            Employees
          </NavLink>
          <NavLink to="/customers-orders" className="nav-link">
            Customers &amp; Orders
          </NavLink>
          <NavLink to="/menu-items" className="nav-link">
            Menu Items
          </NavLink>
        </nav>
      </header>
      <main className="app-main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/employees" element={<EmployeesPage />} />
          <Route path="/customers-orders" element={<CustomersOrdersPage />} />
          <Route path="/menu-items" element={<MenuItemsPage />} />
        </Routes>
      </main>
    </div>
  );
}


