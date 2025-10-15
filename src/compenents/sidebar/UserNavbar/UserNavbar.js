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
        <a href="" className="sm-nav-link">Add sample </a>

        <div className="sm-nav-dropdown">
          <div className="sm-nav-link sm-dropdown-toggle">Return details▾</div>
          <div className="sm-dropdown-menu">
            <a href="/addreturn" className="sm-dropdown-item">Add return</a>
            <a href="/getallreturn" className="sm-dropdown-item">All Return Details</a>
          </div>
        </div>

        <div className="sm-nav-dropdown">
          <div className="sm-nav-link sm-dropdown-toggle">Customers▾</div>
          <div className="sm-dropdown-menu">
            <a href="/customerReg" className="sm-dropdown-item">Register Customer</a>
            <a href="/getAllCustomer" className="sm-dropdown-item">All Customers</a>
          </div>
        </div>

        <div className="sm-nav-dropdown">
          <div className="sm-nav-link sm-dropdown-toggle">Orders▾</div>
          <div className="sm-dropdown-menu">
            <a href="/Add-Order-user-role" className="sm-dropdown-item">Add Orders</a>
            <a href="/view-all-order" className="sm-dropdown-item">All orders</a>
          </div>
        </div>

        <div className="sm-nav-dropdown">
          <div className="sm-nav-link sm-dropdown-toggle">Invoices▾</div>
          <div className="sm-dropdown-menu">
            <a href="/all-invoices" className="sm-dropdown-item">View All Invoices</a>
            <a href="/add-invoice" className="sm-dropdown-item">add Invoices</a>
            
          </div>
        </div>


        <div className="sm-nav-dropdown">
          <div className="sm-nav-link sm-dropdown-toggle">Payments▾</div>
          <div className="sm-dropdown-menu">
            <a href="/user-check-outstanding" className="sm-dropdown-item">Outstanding</a>
            <a href="/Add-Cheque" className="sm-dropdown-item">add Cheques details</a>
            <a href="/user-cheque" className="sm-dropdown-item">view Cheques</a>
          </div>
        </div>

     
        <div className="sm-nav-dropdown">
          <div className="sm-nav-link sm-dropdown-toggle">Inventory▾</div>
          <div className="sm-dropdown-menu">
            <a href="/user-Bulk-product-ton" className="sm-dropdown-item">Bulk Inventory</a>
            <a href="/user-finishedProduct" className="sm-dropdown-item">Packing Summary</a>
            <a href="/user-Bulk-product" className="sm-dropdown-item">Import Product Details</a>
            <a href="/area-allinventories" className="sm-dropdown-item">Executives Inventory</a>
            <a href="/add-area-inventory" className="sm-dropdown-item"> Add Executives Inventory</a>
          </div>
        </div>

        <a href="/" className="sm-nav-link">Logout</a>
      </nav>
    </header>
  );
};

export default UserNavbar;
