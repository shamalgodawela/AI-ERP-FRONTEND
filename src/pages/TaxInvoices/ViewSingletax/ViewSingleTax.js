import React, { useEffect, useRef, useState } from "react";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ReactToPrint from 'react-to-print';
import Logo from "../../../assets/Nihon Logo-01.png";
import "./ViewSingleTax.css"; // create this new CSS file for styles

export default function ViewSingleTax() {
  const containerRef = useRef(null);
  const { invoiceNumber } = useParams();
  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const response = await axios.get(
          `https://nihon-inventory.onrender.com/api/get-Taxinvoices/${invoiceNumber}`
        );
        setInvoice(response.data);
      } catch (error) {
        console.error(`Failed to fetch invoice with id ${invoiceNumber}`, error.message);
      }
    };
    fetchInvoice();
  }, [invoiceNumber]);

  const calculateTotal = () => {
    if (!invoice?.products) return 0;
    const total = invoice.products.reduce((acc, product) => {
      const productTotal =
        product.labelPrice * (1 - product.discount / 100) * product.quantity;
      return acc + productTotal;
    }, 0);
    return total.toFixed(2);
  };

  const calculateTaxtot = () => {
    if (!invoice?.products) return 0;
    const taxRate = invoice.Tax || 0;
    const subtotal = parseFloat(calculateTotal());
    const totalTax = subtotal * (taxRate / 100);
    return (subtotal + totalTax).toFixed(2);
  };

  const formatNumbers = (x) =>
    x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  if (!invoice) return <div>Loading...</div>;

  // Generate empty rows to keep table height consistent
  const emptyRowsCount = Math.max(6 - invoice.products.length, 0);
  const allRows = [
    ...invoice.products.map((product, i) => (
      <tr key={i}>
        <td>{product.productCode}</td>
        <td>{product.productName}</td>
        <td className="taxinvoice-qty">{product.quantity}</td>
        <td>{formatNumbers(product.labelPrice.toFixed(2))}</td>
        <td>{product.discount}</td>
        <td>{formatNumbers(product.unitPrice.toFixed(2))}</td>
        <td className="taxinvoice-align-right">
          {formatNumbers(
            (product.labelPrice *
              (1 - product.discount / 100) *
              product.quantity).toFixed(2)
          )}
        </td>
      </tr>
    )),
    ...Array.from({ length: emptyRowsCount }, (_, i) => (
      <tr key={`empty-${i}`}>
        {Array(7)
          .fill("")
          .map((_, j) => (
            <td key={j}>&nbsp;</td>
          ))}
      </tr>
    )),
  ];

  return (
    <div className="taxinvoice-body">
      <div className="taxinvoice-controls">
        <a href="/viewAll-TaxInvoices" className="taxinvoice-btn-back">
          ← Go Back
        </a>
        <ReactToPrint
          trigger={() => <button className="taxinvoice-btn-print">🖨️ Print</button>}
          content={() => containerRef.current}
          documentTitle={`Invoice-${invoice.invoiceNumber}`}
        />
      </div>

      <div ref={containerRef} className="taxinvoice-container">
        {/* Header */}
        <div className="taxinvoice-header">
          <img src={Logo} alt="Nihon Logo" className="taxinvoice-logo" />
          <div className="taxinvoice-company-details">
            <p>No 44, Wawsiri Uyana, Kelepitimulla, Hunumulla</p>
            <p>Web: www.nihonagholdings.com</p>
            <p>Email: info@nihonagholdings.com</p>
            <p>Hotline: 0777666802</p>
          </div>
          <div className="taxinvoice-vat-details">
            <p>VAT Reg No: 102784022-7000</p>
            <p>{invoice.VatNO}</p>
          </div>
        </div>

        {/* Customer & Order Info */}
        <div className="taxinvoice-info-section">
          <div className="taxinvoice-customer">
            <h4>Customer Details</h4>
            <p><strong>Code:</strong> {invoice.code}</p>
            <p><strong>Name:</strong> {invoice.customer}</p>
            <p><strong>Address:</strong> {invoice.address}</p>
            <p><strong>Contact:</strong> {invoice.contact}</p>
          </div>
          <div className="taxinvoice-order">
            <h4>Order Details</h4>
            <p><strong>Order Number:</strong> {invoice.orderNumber}</p>
            <p><strong>Order Date:</strong> {invoice.orderDate}</p>
            <p><strong>Exe:</strong> {invoice.exe}</p>
            <p><strong>Invoice No:</strong> {invoice.invoiceNumber}</p>
            <p><strong>Invoice Date:</strong> {invoice.invoiceDate}</p>
          </div>
        </div>

        {/* Payment Info */}
        <div className="taxinvoice-payment">
          <h4>Payment Details</h4>
          <div className="taxinvoice-payment-row">
            <p><strong>Mode of Payment:</strong> {invoice.ModeofPayment}</p>
            <p><strong>Terms of Payment:</strong> {invoice.TermsofPayment} days</p>
            <p><strong>Due Date:</strong> {invoice.Duedate}</p>
          </div>
        </div>

        {/* Products Table */}
        <table className="taxinvoice-table">
          <thead>
            <tr>
              <th>Product Code</th>
              <th>Description</th>
              <th>Qty</th>
              <th>Label Price</th>
              <th>Discount</th>
              <th>Unit Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>{allRows}</tbody>
        </table>

        {/* Totals */}
        <div className="taxinvoice-summary">
          <p><strong>Subtotal:</strong> {formatNumbers(calculateTotal())}</p>
          <p><strong>Total with Tax:</strong> {formatNumbers(calculateTaxtot())}</p>
        </div>

        {/* Footer */}
        <div className="taxinvoice-footer">
          <div className="taxinvoice-signature-row">
            <p>Security Checked by</p>
            <p>Gate Pass No: {invoice.GatePassNo}</p>
            <p>Vehicle No:</p>
          </div>
          <div className="taxinvoice-signature-row">
            <p>Driver Mobile:</p>
            <p>NIC:</p>
            <p>Name:</p>
          </div>
          <h5>I/We acknowledge receipt of the above-mentioned goods in good condition.</h5>
          <div className="taxinvoice-signature-row">
            <p>Customer Stamp</p>
            <p>Name & NIC</p>
            <p>Signature</p>
            <p>Date</p>
          </div>
          <p className="taxinvoice-note">
            Please draw cheques in favour of <strong>"NIHON AGRICULTURE HOLDINGS (PVT) LTD"</strong> A/C PAYEE ONLY.
          </p>
        </div>
      </div>
    </div>
  );
}
