import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './single.css'
import Footer from '../footer/Footer';
import NavBar from '../sidebar/NavBar';
const SingleOrder = () => {
  const { orderNumber } = useParams();
    const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/orders/${orderNumber}`);
        setOrder(response.data);
      } catch (error) {
        console.error('Error fetching order details:', error);
      }
    };
  
    fetchOrderDetails();
  }, [id]);
  

  return (
    <div>
        <NavBar/>
    <div className="order-details-container">
    <h2 className="order-details-header">Order Details</h2>
    {order ? (
      <div>
        <p className="order-details-item">
          <span className="order-details-label">Order Number:</span> {order.orderNumber}
        </p>
        <p className="order-details-item">
          <span className="order-details-label">Invoice Number:</span> {order.invoiceNumber}
        </p>
        <p className="order-details-item">
          <span className="order-details-label">Customer:</span> {order.customer}
        </p>
        <p className="order-details-item">
          <span className="order-details-label">Code:</span> {order.code}
        </p>
        <p className="order-details-item">
          <span className="order-details-label">Address:</span> {order.address}
        </p>
        <p className="order-details-item">
          <span className="order-details-label">Contact:</span> {order.contact}
        </p>
        <p className="order-details-item">
          <span className="order-details-label">Invoice Date:</span> {order.invoiceDate}
        </p>
        <p className="order-details-item">
          <span className="order-details-label">Order Date:</span> {order.orderDate}
        </p>
        <p className="order-details-item">
          <span className="order-details-label">Exe:</span> {order.exe}
        </p>
        <p className="order-details-item">
          <span className="order-details-label">Status:</span> {order.status}
        </p>
      
        <h3 className="order-details-product-header">Products</h3>
        <table className="order-details-product-table">
          <thead>
            <tr>
              <th>Product Code</th>
              <th>Product Name</th>
              <th>Label Price</th>
              <th>Quantity</th>
              <th>Discount</th>
              <th>Unit Price</th>
              <th>Invoice Total</th>
            </tr>
          </thead>
          <tbody>
            {order.products.map((product, index) => (
              <tr key={index} className="order-details-product-item">
                <td>{product.productCode}</td>
                <td>{product.productName}</td>
                <td>{product.labelPrice}</td>
                <td>{product.quantity}</td>
                <td>{product.discount}</td>
                <td>{product.unitPrice}</td>
                <td>{product.invoiceTotal}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : (
      <p>Loading order details...</p>
    )}
  </div>
  <Footer/>
  </div>
  );
};

export default SingleOrder;
