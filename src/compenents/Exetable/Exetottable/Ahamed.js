import React, { useState, useEffect } from 'react';
import './ahamed.css'; // Import the CSS file for styling

const Ahamed = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
              const response = await fetch('http://localhost:5000/api/getproductallsexe'); // Replace with your API endpoint
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
      <h2 className='ahamed-h2'>Ahamed Inventory</h2>
      <table className="product-table">
        <thead>
          <tr>
            <th>Product name</th>
            <th>Product Code</th>
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

export default Ahamed;
