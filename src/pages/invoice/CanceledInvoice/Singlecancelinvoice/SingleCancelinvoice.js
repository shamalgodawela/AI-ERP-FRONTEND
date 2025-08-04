import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SingleCancelinvoice = ({ invoiceNumber }) => {
  const [cancelInvoice, setCancelInvoice] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCancelInvoice = async () => {
      try {
        const response = await axios.get(`https://nihon-inventory.onrender.com/api/getcancelbyid/${invoiceNumber}`);
        setCancelInvoice(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch cancel invoice:', error.message);
        setIsLoading(false);
      }
    };

    fetchCancelInvoice();
  }, [invoiceNumber]);

  return (
    <div>
      <h2>Cancel Invoice Details</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : cancelInvoice ? (
        <div>
          <p>INVOICE NUMBER: {cancelInvoice.invoiceNumber}</p>
          <p>CUSTOMER: {cancelInvoice.customer}</p>
          <p>CUSTOMER CODE: {cancelInvoice.code}</p>
          <p>CUSTOMER ADDRESS: {cancelInvoice.address}</p>
          <p>INVOICE DATE: {cancelInvoice.invoiceDate}</p>
          <p>EXE: {cancelInvoice.exe}</p>
          <h3>Product Details</h3>
          <table>
            <thead>
              <tr>
                <th>Product Code</th>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Label Price</th>
                <th>Discount (%)</th>
                <th>Unit Price</th>
                <th>Invoice Total</th>
              </tr>
            </thead>
            <tbody>
              {cancelInvoice.products.map((product, index) => (
                <tr key={index}>
                  <td>{product.productCode}</td>
                  <td>{product.productName}</td>
                  <td>{product.quantity}</td>
                  <td>{product.labelPrice}</td>
                  <td>{product.discount}</td>
                  <td>{product.unitPrice}</td>
                  <td>{product.invoiceTotal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>Cancel invoice not found</p>
      )}
    </div>
  );
};

export default SingleCancelinvoice
