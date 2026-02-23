import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Logo from "../../../assets/Nihon Logo-01.png";
import "./taxinvoicetemp.css";
import ReactToPrint from "react-to-print";

export default function Taxinvoice() {
  const containerRef = useRef(null);
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const response = await axios.get(
          `https://nihon-inventory.onrender.com/api/get-invoice/${id}`
        );
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
        const productTotal =
          product.labelPrice * (1 - product.discount / 100) * product.quantity;
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
    <tr key={index}>
      <td className="fontcolor-invoice">{product.productCode}</td>
      <td className="fontcolor-invoice">{product.productName}</td>
      <td className="tdquantity">{product.quantity}</td>
      <td className="fontcolor-invoice"></td>
      <td className="tddiscount"></td>
      <td id="td_unit-tax" className="fontcolor-invoice">
        {formatNumbers(((product.unitPrice * 100) / 118).toFixed(2))}
      </td>
      <td className="tdtot">
        {formatNumbers(
          (((product.unitPrice * 100) / 118) * product.quantity).toFixed(2)
        )}
      </td>
    </tr>
  ));

  const emptyRows = Array.from({ length: emptyRowsCount }, (_, index) => (
    <tr key={`empty-${index}`}>
      <td className="td-invoictemp">&nbsp;</td>
      <td className="td-invoictemp">&nbsp;</td>
      <td className="td-invoictemp">&nbsp;</td>
      <td className="td-invoictemp">&nbsp;</td>
      <td className="td-invoictemp">&nbsp;</td>
      <td className="td-invoictemp">&nbsp;</td>
      <td className="td-invoictemp">&nbsp;</td>
    </tr>
  ));

  const allRows = [...filledRows, ...emptyRows];

  const subtotal = invoice.products.reduce((acc, product) => {
    const discountedUnitPrice = (product.unitPrice * 100) / 118;
    return acc + discountedUnitPrice * product.quantity;
  }, 0);

  const formattedSubtotal = formatNumbers(subtotal.toFixed(2));

  return (
    <div>
      <a href="/all-invoices">Go Back</a>
      <br />
      <ReactToPrint
        trigger={() => <button type="button">Print this out!</button>}
        content={() => containerRef.current}
        documentTitle=" "
        pageStyle="print"
      />

      <div ref={containerRef}>
        <div className="invoice-wrapper" id="print-area">
          <div className="image">
            <img src={Logo} width="270px" height="100px" alt="Nihon Logo" />
          </div>
          <div className="textheader">
            <h6>No 44, Wawsiri Uyana, Kelepitimulla , Hunumulla</h6>
            <h6>Web: www.nihonagholdings.com</h6>
            <h6>Email: info@nihonagholdings.com</h6>
            <h6>Hotline: 0777666802</h6>
          </div>
          <p id="tax-invoice-text">{invoice.VatNO}</p>
          <p id="vat-reg">{invoice.VatRegNo}</p>

          <div className="invoice-container">
            <div className="invoice-head">
              <div className="invoice-head-top">
                <div className="invoice-head-top-left text-start"></div>
                <div className="invoice-head-top-right text-end"></div>
              </div>
              <div className="invoice-head-bottom">
                <div className="invoice-head-bottom-left">
                  <ul>
                    <li className="text-bold1">Customer Details</li>
                    <li className="licus">
                      <span className="label">Code:</span>
                      {invoice.code}
                    </li>
                    <li className="cusd1">
                      <span className="label">Name:</span>
                      {invoice.customer}
                    </li>
                    <li className="cusd2">
                      <span className="label">Address:</span>
                      {invoice.address}
                    </li>
                    <li className="cusd3">
                      <span className="label">Contact:</span>
                      {invoice.contact}
                    </li>
                    <li className="cus-Vat-no">
                      Cus Vat-No :{invoice.CusVatNo}
                    </li>
                    <li className="tax-Vat-no">
                      Tax Invoice No :{invoice.TaxNo}
                    </li>
                  </ul>
                </div>
                <div className="invoice-head-bottom-right">
                  <ul>
                    <li className="text-boldorder">Order Details</li>
                    <li className="cusd45">
                      <span id="ornumber">Order Number:</span>
                      {invoice.orderNumber}
                    </li>
                    <li className="cusd4">
                      <span id="ordate">Date:</span>
                      {invoice.orderDate}
                    </li>
                    <li className="cusd44">
                      <span id="orexe">Exe:</span>
                      {invoice.exe}
                    </li>
                    <li className="ordt">
                      <span id="orinvoice">Invoice No:</span>
                    </li>
                    <li className="cusd46">
                      <span id="oridate">Date:</span>
                      {invoice.invoiceDate}
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <h4 className="table-cell-pay">
              <span className="label">Payment Details</span>
            </h4>
            <div className="table-container">
              <div className="table-row">
                <div className="table-cell" id="mod">
                  <span className="label">Mode of Payment:</span>
                  {invoice.ModeofPayment}
                </div>
                <div className="table-cell">
                  <span className="label" id="mod1">
                    Terms of Payment:
                  </span>
                  {invoice.TermsofPayment} days
                </div>
                <div className="table-cell with-space">
                  <span className="label" id="mod2">
                    Due date:
                  </span>
                  {invoice.Duedate}
                </div>
              </div>
            </div>

            <div className="overflow-view">
              <div className="invoice-body">
                <table className="thead-invoicetemp">
                  <thead className="thead-invoicetemp">
                    <tr>
                      <td id="tdtext">Product Code</td>
                      <td id="tdtext">Description</td>
                      <td id="tdtext">Quantity</td>
                      <td id="tdtext">Label Price</td>
                      <td id="tdtext">Discount</td>
                      <td id="tdtext">Unit Price</td>
                      <td id="tdtext">Invoice Total</td>
                    </tr>
                  </thead>
                  <tbody>{allRows}</tbody>
                </table>

                <div className="invoice-body-bottom">
                  <div className="invoice-body-info-item border-bottom">
                    <div className="info-container">
                      <div className="info-item">
                        <p className="subject">Invoiced by</p>
                      </div>
                      <div
                        className="info-item-td text-end text-bold"
                        id="second"
                      >
                        <span className="label">SubTotal:</span>
                        {formattedSubtotal}
                      </div>
                    </div>
                  </div>

                  <div className="invoice-body-info-item border-bottom">
                    <div className="info-container">
                      <div className="info-item">
                        <p className="subject">Checked and Approved by</p>
                      </div>
                      <div
                        className="info-item-td text-end text-bold"
                        id="tax"
                      >
                        <span className="label">Tax:%</span>
                        {formatNumbers(
                          (calculateTaxtot() -
                            parseFloat(formattedSubtotal.replace(/,/g, ""))) // fallback if needed
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="invoice-body-info-item">
                    <div className="info-container">
                      <div className="info-item">
                        <p className="subject">Goods issued by</p>
                      </div>
                      <div className="info-item-tot" id="second2">
                        <span className="label">Total</span>
                        {formatNumbers(calculateTaxtot())}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="table-container">
              <div className="table-row">
                <div className="table-cell2">Security Checked by</div>
                <div className="table-cell2">
                  Gate Pass No:{invoice.GatePassNo}
                </div>
                <div className="table-cell2 with-space">Vehicle No:</div>
              </div>
            </div>

            <div className="table-container">
              <div className="table-row">
                <div className="table-cell2">Driver Mobile:</div>
                <div className="table-cell2">Nic:</div>
                <div className="table-cell2 with-space">Name:</div>
              </div>
            </div>

            <h5 className="table-cell-pay">
              I/We acknowledge receipt of the above mentioned goods in good
              condition
            </h5>

            <div className="table-container">
              <div className="table-row">
                <div className="table-cell2">Customer stamp</div>
                <div className="table-cell2">Name and NIC</div>
                <div className="table-cell2">Signature</div>
                <div className="table-cell2 with-space">Date:</div>
              </div>
            </div>

            <div className="table-container">
              <div className="table-row">
                <div className="table-cell1"></div>
                <div className="table-cell1"></div>
                <div className="table-cell1"></div>
                <div className="table-cell1 with-space"></div>
              </div>
            </div>

            <h5 className="table-cell-final">
              Please draw the cheques in favour of "NIHON AGRICULTURE
              HOLDINGS (PVT)LTD " A/C PAYEE ONLY
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
}
