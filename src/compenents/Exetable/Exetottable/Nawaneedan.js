import React, { useState, useEffect } from 'react';
import './ahamed.css';

const Nawaneedan = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
              const response = await fetch('http://localhost:5000/api/getproductbynawaneedan'); // Replace with your API endpoint
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const productsData = await response.json();
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  return (
    <div className="product-table-container">
      <h2 className='ahamed-h2'>Nawaneedan Inventory</h2>
      <table className="product-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Code</th>
            <th>Quantity</th>
            <th>Price</th>
            
          
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product._id}>
              <td>{product.name}</td>
              <td>{product.code}</td>
              <td>{product.quantity}</td>
              <td>{product.price}</td>
              
              
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Nawaneedan;
