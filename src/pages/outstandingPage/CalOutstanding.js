import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./CalOutstanding.css";
import Footer from "../../compenents/footer/Footer";
import { IoMdArrowRoundBack } from "react-icons/io";

const CalOutstanding = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const [invoice, setInvoice] = useState(null);
  const [savedDetails, setSavedDetails] = useState(null);
  const [updatingChequeId, setUpdatingChequeId] = useState(null);

  const backoption = ["BOC", "Commercial", "HNB","People's","Sampath","NSB","DFCC","AMANA"];

  // ---------------- FETCH INVOICE ----------------
  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const res = await axios.get(
          `https://nihon-inventory.onrender.com/api/get-invoice/${id}`
        );
        setInvoice(res.data);
      } catch (error) {
        toast.error("Failed to fetch invoice");
        console.error(error);
      }
    };
    fetchInvoice();
  }, [id]);

  // ---------------- CALCULATE TOTAL ----------------
  const calculateTotal = () => {
    if (!invoice?.products) return "0.00";

    return invoice.products
      .reduce(
        (acc, p) =>
          acc + p.labelPrice * (1 - p.discount / 100) * p.quantity,
        0
      )
      .toFixed(2);
  };




  // ---------------- FETCH ALL OUTSTANDING ----------------
  const handleFetchAllOutstandingDetails = async () => {
    try {
      const res = await axios.get(
        `https://nihon-inventory.onrender.com/api/get-all-outstanding/${invoice.invoiceNumber}`
      );

      if (res.data.length === 0) {
        toast.info("No outstanding history");
      } else {
        setSavedDetails(res.data);
      }
    } catch {
      toast.error("Failed to fetch outstanding history");
    }
  };

  // ---------------- UPDATE CHEQUE STATUS ----------------
  const handleUpdateChequeStatus = async (chequeId, status) => {
    try {
      setUpdatingChequeId(chequeId);

      const res = await axios.put(
        `https://nihon-inventory.onrender.com/api/invoices/cheque-status/${invoice.invoiceNumber}`,
        { chequeId, status }
      );

      setInvoice(res.data.invoice); // update UI
      toast.success(res.data.message);
    } catch (error) {
      toast.error("Cheque update failed");
    } finally {
      setUpdatingChequeId(null);
    }
  };

  // ---------------- FORMAT NUMBERS ----------------
  const formatNumbers = (x) =>
    x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  if (!invoice) return <div>Loading...</div>;

  return (
    <div ref={containerRef}>
      <Link onClick={() => navigate(-1)} className="Back-Icon">
        Go Back <IoMdArrowRoundBack size={22} />
      </Link>

      <div className="cal-outstanding-container">
        <h4>Invoice: {invoice.invoiceNumber}</h4>
        <h4>Customer: {invoice.customer}</h4>
        <h4>EXE: {invoice.exe}</h4>
        <h4>Date: {invoice.invoiceDate}</h4>

        <hr />

        {/* PRODUCTS */}
        <h2>Product Details</h2>
        <table>
          <thead>
            <tr>
              <th>Code</th>
              <th>Description</th>
              <th>Qty</th>
              <th>Label Price</th>
              <th>Discount</th>
              <th>unit price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.products.map((p, i) => (
              <tr key={i}>
                <td>{p.productCode}</td>
                <td>{p.productName}</td>
                <td>{p.quantity}</td>
                <td>{p.labelPrice}</td>
                <td>{p.discount}%</td>
                <td>{p.unitPrice}</td>
                <td>
                  {formatNumbers(
                    (
                      p.labelPrice *
                      (1 - p.discount / 100) *
                      p.quantity
                    ).toFixed(2)
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div>Total: RS/= {formatNumbers(calculateTotal())}</div>

        <hr />
        <h2>Invoice date:{invoice.invoiceDate}</h2>
        <h2>Due date:{invoice.Duedate}</h2>

        {/* CHEQUES */}
        {invoice.cheques?.length > 0 && (
          <>
            <h2>Cheque Details</h2>
            <table>
              <thead>
                <tr>
                  <th>Cheque No</th>
                  <th>Bank</th>
                  <th>Deposit Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {invoice.cheques.map((c) => (
                  <tr key={c._id}>
                    <td>{c.chequeNo}</td>
                    <td>{c.bankName}</td>
                    <td>{c.depositDate}</td>
                    <td>RS/= {formatNumbers(c.amount)}</td>
                    <td>{c.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        <button onClick={handleFetchAllOutstandingDetails}>
          Fetch Outstanding History
        </button>

        <hr />

        {/* OUTSTANDING HISTORY */}
        {savedDetails && (
          <>
            <h2>Outstanding History</h2>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Bank</th>
                  <th>Outstanding</th>
                </tr>
              </thead>
              <tbody>
                {savedDetails.map((d, i) => (
                  <tr key={i}>
                    <td>{d.date}</td>
                    <td>RS/= {formatNumbers(d.amount)}</td>
                    <td>{d.backName}</td>
                    <td>RS/= {formatNumbers(d.outstanding)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>

      

      <Footer />
    </div>
  );
};

export default CalOutstanding;
