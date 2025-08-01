import React from 'react';
import './user-navbar-sm.css';

const UserNavbar = () => {
  return (
    <header className="sm-navbar">
      <div className="sm-navbar-logo">
        <h1>User Dashboard</h1>
      </div>

      <nav className="sm-navbar-links">
        <a href="/User-dashboard" className="sm-nav-link">Dashboard</a>
        <a href="/view-all-order" className="sm-nav-link">Orders</a>
        <a href="/all-invoices" className="sm-nav-link">Invoices</a>
        <a href="/user-check-outstanding" className="sm-nav-link">Payments</a>

        {/* LSO Dropdown */}
        <div className="sm-nav-dropdown">
          <div className="sm-nav-link sm-dropdown-toggle">Inventory▾</div>
          <div className="sm-dropdown-menu">
            <a href="/user-Bulk-product-ton" className="sm-dropdown-item">Bulk Inventory</a>
            <a href="/user-finishedProduct" className="sm-dropdown-item">Packing Summary</a>
            <a href="/user-Bulk-product" className="sm-dropdown-item">Import Product Details</a>
          </div>
        </div>

        <a href="/" className="sm-nav-link">Logout</a>
      </nav>
    </header>
  );
};

export default UserNavbar;
