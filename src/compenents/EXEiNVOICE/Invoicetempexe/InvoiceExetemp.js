import React, { useEffect, useRef, useState } from "react";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Logo from "../../../assets/Nihon Logo-01.png"
import ReactToPrint from 'react-to-print';
import './exeinvoicetemp.css'; // Import the external CSS file

export default function InvoiceExetemp() {
  const containerRef = useRef(null);

  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/get-invoice/${id}`);
        setInvoice(response.data);
      } catch (error) {
        console.error(`Failed to fetch invoice with id ${id}`, error.message);
      }
    };

    fetchInvoice();
  }, [id]);

  const calculateTotal = () => {
    let total = 0;

    if (invoice && invoice.products) {
        total = invoice.products.reduce((acc, product) => {
            const productTotal = product.labelPrice * (1 - product.discount / 100) * product.quantity;
            return acc + productTotal;
        }, 0);
    }

    return total.toFixed(2);
  };

  const formatNumbers = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const calculateTaxtot = () => {
    if (invoice && invoice.products) {
        const taxRate = invoice.Tax || 0;

        const totalTax = invoice.products.reduce((acc, product) => {
            const productTax = parseFloat(product.invoiceTotal) * (taxRate / 100);
            return acc + productTax;
        }, 0);

        const subtotal = parseFloat(calculateTotal());
        const totalWithTax = subtotal - totalTax;

        return totalWithTax.toFixed(2);
    }

    return 0;
  };

  if (!invoice) {
    return <div>Loading...</div>;
  }

  const productsCount = invoice.products.length;
  const emptyRowsCount = Math.max(6 - productsCount, 0);
  const filledRows = invoice.products.map((product, index) => (
    <tr key={index} className="exeinvoiceTemp-product-row">
      <td className="exeinvoiceTemp-product-code">{product.productCode}</td>
      <td className="exeinvoiceTemp-product-name">{product.productName}</td>
      <td className="exeinvoiceTemp-quantity">{product.quantity}</td>
      <td className="exeinvoiceTemp-label-price">{formatNumbers(product.labelPrice.toFixed(2))}</td>
      <td className="exeinvoiceTemp-discount">{product.discount}</td>
      <td className="exeinvoiceTemp-unit-price">{formatNumbers(product.unitPrice.toFixed(2))}</td>
      <td className="exeinvoiceTemp-total" style={{ textAlign: 'end' }}>
        {formatNumbers((product.labelPrice * (1 - product.discount / 100) * product.quantity).toFixed(2))}
      </td>
    </tr>
  ));

  const emptyRows = Array.from({ length: emptyRowsCount }, (_, index) => (
    <tr key={`empty-${index}`} className="exeinvoiceTemp-empty-row">
      <td className="exeinvoiceTemp-empty-cell">&nbsp;</td>
      <td className="exeinvoiceTemp-empty-cell">&nbsp;</td>
      <td className="exeinvoiceTemp-empty-cell">&nbsp;</td>
      <td className="exeinvoiceTemp-empty-cell">&nbsp;</td>
      <td className="exeinvoiceTemp-empty-cell">&nbsp;</td>
      <td className="exeinvoiceTemp-empty-cell">&nbsp;</td>
      <td className="exeinvoiceTemp-empty-cell">&nbsp;</td>
    </tr>
  ));

  const allRows = [...filledRows, ...emptyRows];

  return (
    <div className="exeinvoiceTemp-container">
      <a href="/exeinvoices" className="exeinvoiceTemp-back-link">Go Back</a><br />
      <ReactToPrint
        trigger={() => (
          <a href="#" className="exeinvoiceTemp-print-link">Print this out!</a>
        )}
        content={() => containerRef.current}
        documentTitle="Invoice"
        pageStyle="print"
      />
      <div ref={containerRef} className="exeinvoiceTemp-printable-area">
        <div className="exeinvoiceTemp">
          <div className="exeinvoiceTemp-wrapper">
            <div className="exeinvoiceTemp-logo"><img src={Logo} width="270px" height="100px" alt="Nihon Logo" /></div>
            <div className="exeinvoiceTemp-header">
              <h6 className="exeinvoiceTemp-address">No 44, Wawsiri Uyana, Kelepitimulla , Hunumulla</h6>
              <h6 className="exeinvoiceTemp-website">Web: www.nihonagholdings.com</h6>
              <h6 className="exeinvoiceTemp-email">Email: info@nihonagholdings.com</h6>
              <h6 className="exeinvoiceTemp-hotline">Hotline: 0777666802</h6>
            </div>
            <p className='exeinvoiceTemp-tax-text'>{invoice.VatNO}</p>
            <p className='exeinvoiceTemp-vat-reg'>{invoice.VatRegNo}</p>

            <div className="exeinvoiceTemp-details">
              <div className="exeinvoiceTemp-customer-details">
                <ul>
                  <li className="exeinvoiceTemp-customer-code"><span className="exeinvoiceTemp-label">Code:</span>{invoice.code}</li>
                  <li className="exeinvoiceTemp-customer-name"><span className="exeinvoiceTemp-label">Name:</span>{invoice.customer}</li>
                  <li className="exeinvoiceTemp-customer-address"><span className="exeinvoiceTemp-label">Address:</span>{invoice.address}</li>
                  <li className="exeinvoiceTemp-customer-contact"><span className="exeinvoiceTemp-label">Contact:</span>{invoice.contact}</li>
                </ul>
              </div>
              <div className="exeinvoiceTemp-order-details">
                <ul>
                  <li className="exeinvoiceTemp-order-number"><span className="exeinvoiceTemp-label">Order Number:</span>{invoice.orderNumber}</li>
                  <li className="exeinvoiceTemp-order-date"><span className="exeinvoiceTemp-label">Date:</span>{invoice.orderDate}</li>
                  <li className="exeinvoiceTemp-order-exe"><span className="exeinvoiceTemp-label">Exe:</span>{invoice.exe}</li>
                  <li className="exeinvoiceTemp-invoice-number"><span className="exeinvoiceTemp-label">Invoice No:</span>{invoice.invoiceNumber}</li>
                  <li className="exeinvoiceTemp-invoice-date"><span className="exeinvoiceTemp-label">Date:</span>{invoice.invoiceDate}</li>
                </ul>
              </div>
              <p className='exeinvoiceTemp-tax-number'>-{invoice.TaxNo}</p>
            </div>

            <h4 className="exeinvoiceTemp-payment-details-title"><span className="exeinvoiceTemp-label">Payment Details</span></h4>
            <div className="exeinvoiceTemp-payment-details">
              <div className="exeinvoiceTemp-payment-detail">
                <span className="exeinvoiceTemp-label">Mode of Payment:</span>{invoice.ModeofPayment}
              </div>
              <div className="exeinvoiceTemp-payment-detail">
                <span className="exeinvoiceTemp-label">Terms of Payment:</span>{invoice.TermsofPayment} days
              </div>
              <div className="exeinvoiceTemp-payment-detail">
                <span className="exeinvoiceTemp-label">Due date:</span>{invoice.Duedate}
              </div>
            </div>

            <div className="exeinvoiceTemp-table">
              <table className="exeinvoiceTemp-table-head">
                <thead>
                  <tr>
                    <td className="tdinvoice-exe-sample">Product Code</td>
                    <td className="tdinvoice-exe-sample">Description</td>
                    <td className="tdinvoice-exe-sample">Quantity</td>
                    <td className="tdinvoice-exe-sample">Label Price</td>
                    <td className="tdinvoice-exe-sample">Discount</td>
                    <td className="tdinvoice-exe-sample">Unit Price</td>
                    <td className="tdinvoice-exe-sample">Invoice Total</td>
                  </tr>
                </thead>
                <tbody>
                  {allRows}
                </tbody>
              </table>

              <div className="exeinvoiceTemp-summary">
                <div className="exeinvoiceTemp-summary-item">
                  <span className="exeinvoiceTemp-label">SubTotal:</span>{formatNumbers(calculateTotal())}
                </div>
                <div className="exeinvoiceTemp-summary-item">
                  <span className="exeinvoiceTemp-label">Total:</span>{formatNumbers(calculateTaxtot())}
                </div>
              </div>
            </div>

            {/* <div className="exeinvoiceTemp-footer">
              <div className="exeinvoiceTemp-footer-section">
                <span className="exeinvoiceTemp-footer-label">Security Checked by</span>
              </div>
              <div className="exeinvoiceTemp-footer-section">
                <span className="exeinvoiceTemp-footer-label">Gate Pass No:</span>{invoice.GatePassNo}
              </div>
              <div className="exeinvoiceTemp-footer-section">
                <span className="exeinvoiceTemp-footer-label">Driver Mobile:</span>
              </div>
            </div> */}

            {/* <h5 className="exeinvoiceTemp-footer-acknowledgment">I/We acknowledge receipt of the above mentioned goods in good condition</h5> */}

            {/* <div className="exeinvoiceTemp-signature">
              <div className="exeinvoiceTemp-signature-section">Customer stamp</div>
              <div className="exeinvoiceTemp-signature-section">Name and NIC</div>
              <div className="exeinvoiceTemp-signature-section">Signature</div>
              <div className="exeinvoiceTemp-signature-section">Date:</div>
            </div> */}

            {/* <h5 className="exeinvoiceTemp-final-note">Please draw the cheques in favour of "NIHON AGRICULTURE HOLDINGS (PVT) LTD" A/C PAYEE ONLY</h5> */}
          </div>
        </div>
      </div>
    </div>
  );
}