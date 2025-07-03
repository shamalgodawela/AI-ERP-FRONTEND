import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './edit.css'
import Footer from '../../../compenents/footer/Footer';
import Menu from '../../../compenents/Menu/Menu';

const EditInvoice = () => {
  const { invoiceNumber } = useParams();
  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: '',
    customer: '',
    address: '',
    contact: '',
    invoiceDate: '',
    orderNumber: '',
    orderDate: '',
    exe: '',
    ModeofPayment: '',
    TermsofPayment: '',
    Duedate: '',
    Tax: '',
    GatePassNo: '',
    VehicleNo: '',
    products: [
      {
        productCode: '',
        productName: '',
        quantity: 0,
        labelPrice: 0,
        discount: 0,
        unitPrice: 0,
        invoiceTotal: 0,
      },
    ],
  });

  useEffect(() => {
    // Fetch the invoice details to populate the form
    axios
              .get(`http://localhost:5000/api/invoices/${invoiceNumber}`)
      .then((response) => {
        setInvoiceData(response.data);
      })
      .catch((error) => {
        console.error('There was an error fetching the invoice!', error);
      });
  }, [invoiceNumber]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInvoiceData({
      ...invoiceData,
      [name]: value,
    });
  };

  const handleProductChange = (index, e) => {
    const { name, value } = e.target;
    const products = [...invoiceData.products];
    products[index][name] = value;
    setInvoiceData({
      ...invoiceData,
      products,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
              .put(`http://localhost:5000/api/invoices/${invoiceNumber}`, invoiceData)
      .then((response) => {
        alert('Invoice updated successfully!');
      })
      .catch((error) => {
        console.error('There was an error updating the invoice!', error);
      });
  };

  return (
    <div>
        <Menu/>
    <div className="edit-invoice-container">
    <h2>Edit Invoice</h2>
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="customer">Customer</label>
        <input
          type="text"
          id="customer"
          name="customer"
          value={invoiceData.customer}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="address">Address</label>
        <input
          type="text"
          id="address"
          name="address"
          value={invoiceData.address}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="contact">Contact</label>
        <input
          type="text"
          id="contact"
          name="contact"
          value={invoiceData.contact}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="invoiceDate">Invoice Date</label>
        <input
          type="text"
          id="invoiceDate"
          name="invoiceDate"
          value={invoiceData.invoiceDate}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="orderNumber">Order Number</label>
        <input
          type="text"
          id="orderNumber"
          name="orderNumber"
          value={invoiceData.orderNumber}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="orderDate">Order Date</label>
        <input
          type="text"
          id="orderDate"
          name="orderDate"
          value={invoiceData.orderDate}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="exe">Exe</label>
        <input
          type="text"
          id="exe"
          name="exe"
          value={invoiceData.exe}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="ModeofPayment">Mode of Payment</label>
        <input
          type="text"
          id="ModeofPayment"
          name="ModeofPayment"
          value={invoiceData.ModeofPayment}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="TermsofPayment">Terms of Payment</label>
        <input
          type="text"
          id="TermsofPayment"
          name="TermsofPayment"
          value={invoiceData.TermsofPayment}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="Duedate">Due Date</label>
        <input
          type="text"
          id="Duedate"
          name="Duedate"
          value={invoiceData.Duedate}
          onChange={handleChange}
        />
      </div>
      
      <div className="form-group">
          <label htmlFor="GatePassNo">Printed or canceled</label>
          <select
            id="GatePassNo"
            name="GatePassNo"
            value={invoiceData.GatePassNo}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option value="Printed">Printed</option>
            <option value="Delivered">Delivered</option>
            <option value="Canceled">Canceled</option>
            <option value="Free Issued">Free Issued</option>
            <option value="Executive Stock">Executive Stock</option>
          </select>
        </div>
      
      <h3>Products</h3>
      {invoiceData.products.map((product, index) => (
        <div className="product-group" key={index}>
          <div className="form-group">
            <label htmlFor={`productCode-${index}`}>Product Code</label>
            <input
              type="text"
              id={`productCode-${index}`}
              name="productCode"
              value={product.productCode}
              onChange={(e) => handleProductChange(index, e)}
            />
          </div>
          <div className="form-group">
            <label htmlFor={`productName-${index}`}>Product Name</label>
            <input
              type="text"
              id={`productName-${index}`}
              name="productName"
              value={product.productName}
              onChange={(e) => handleProductChange(index, e)}
            />
          </div>
          <div className="form-group">
            <label htmlFor={`quantity-${index}`}>Quantity</label>
            <input
              type="number"
              id={`quantity-${index}`}
              name="quantity"
              value={product.quantity}
              onChange={(e) => handleProductChange(index, e)}
              readOnly
            />
          </div>
          <div className="form-group">
            <label htmlFor={`labelPrice-${index}`}>Label Price</label>
            <input
              type="number"
              id={`labelPrice-${index}`}
              name="labelPrice"
              value={product.labelPrice}
              onChange={(e) => handleProductChange(index, e)}
              readOnly
            />
          </div>
          <div className="form-group">
            <label htmlFor={`discount-${index}`}>Discount</label>
            <input
              type="number"
              id={`discount-${index}`}
              name="discount"
              value={product.discount}
              onChange={(e) => handleProductChange(index, e)}
              readOnly
            />
          </div>
          <div className="form-group">
            <label htmlFor={`unitPrice-${index}`}>Unit Price</label>
            <input
              type="number"
              id={`unitPrice-${index}`}
              name="unitPrice"
              value={product.unitPrice}
              onChange={(e) => handleProductChange(index, e)}
              readOnly
            />
          </div>
          <div className="form-group">
            <label htmlFor={`invoiceTotal-${index}`}>Invoice Total</label>
            <input
              type="number"
              id={`invoiceTotal-${index}`}
              name="invoiceTotal"
              value={product.invoiceTotal}
              onChange={(e) => handleProductChange(index, e)}
              readOnly
            />
          </div>
        </div>
      ))}
      <button type="submit">Update Invoice</button>
    </form>
  </div>
  <Footer/>
  </div>
  );
};

export default EditInvoice;
