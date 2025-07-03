import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { Link } from 'react-router-dom';
import './viewstationery.css'
import NavBar from '../../compenents/sidebar/NavBar';

const ViewStationery = () => {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/get/stationery`);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  // Calculate total
  useEffect(() => {
    let totalAmount = 0;
    products.forEach(product => {
      totalAmount += product.quantity * product.price;
    });
    setTotal(totalAmount);
  }, [products]);

  const formatNumbers = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className="view-stationery">
      <NavBar />
      <br /><br />
      <Link to="/addstationery">
        <button className='btn-office'>add Stationery Items</button>
      </Link>

      <h2 className='product-list-title'>Stationery Items</h2>
      <table className='product-table'>
        <thead>
          <tr>
            <th className='table-header'>Index</th>
            <th className='table-header'>Code</th>
            <th className='table-header'>Name</th>
            <th className='table-header'>Quantity</th>
            <th className='table-header'>Price(RS)</th>
            <th className='table-header'>Value(RS)</th>
          </tr>
        </thead>
        
        <tbody>
          {products.map((product, index) => (
            <tr key={product._id}>
              <td>{index + 1}</td>
              <td>{product.code}</td>
              <td>{product.name}</td>
              <td>{product.quantity}</td>
              <td>{formatNumbers(product.price)}</td>
              <td>{formatNumbers(product.quantity * product.price)}</td>

            </tr>

          ))}
          <tr>
            <td colSpan="3"><h3>Total:</h3></td>
            <td>RS:{formatNumbers(total.toFixed(2))}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ViewStationery;
