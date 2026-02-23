import React, { useState, useEffect } from 'react';
import axios from 'axios';


import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminnavBar from '../../AdminNavbar/AdminnavBar';

const EXEincentory = () => {
  const [inventories, setInventories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInventories = async () => {
    try {
      const response = await axios.get('https://nihon-inventory.onrender.com/api/inventory/all-inventories');
      setInventories(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error('❌ Failed to fetch inventories.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventories();
  }, []);

  return (
   
     
     <div>
            <AdminnavBar/>
      <div className="inventory-view-container">
        <h2>All Inventories</h2>

        {loading ? (
          <p>Loading inventories...</p>
        ) : inventories.length === 0 ? (
          <p>No inventories found.</p>
        ) : (
          inventories.map((inventory, idx) => (
            <div key={idx} className="inventory-card">
              <h3>Area: {inventory.area}</h3>
              <p><strong>Owner:</strong> {inventory.owner}</p>
              <h4>Products:</h4>
              <table className="inventory-table">
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>Product Code</th>
                    <th>Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.products.map((product, index) => (
                    <tr key={index}>
                      <td>{product.productName}</td>
                      <td>{product.productCode}</td>
                      <td>{product.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))
        )}
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default EXEincentory;
