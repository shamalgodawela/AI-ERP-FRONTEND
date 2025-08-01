import React from "react";
import { Link } from "react-router-dom";
import "./AdminnavBar.css";

const AdminnavBar = () => {
  return (
    <nav className="admin-navbar">
  <div className="admin-navbar-logo">
    <h2>Admin Pannel</h2>
  </div>
  <ul className="admin-navbar-links">
    <li>
      <Link to="/dashboard" className="active">Inventory</Link>
    </li>
    <li>
      <Link to="/dateproductDetails">Packing Summary</Link>
    </li>
    <li>
      <Link to="/view-current-bulk">View Bulk Product</Link>
      
    </li>
    <li>
      <Link to="/Allexetable">Executives Inventory</Link>
      
    </li>
    <li>
      <Link to="/view-all-bulk">Imported Product details</Link>
      
    </li>
   
  </ul>
</nav>
  );
};

export default AdminnavBar;