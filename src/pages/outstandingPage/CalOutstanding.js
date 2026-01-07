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
  const [amount, setAmount] = useState(0);
  const [outstanding, setOutstanding] = useState(0);
  const [date, setDate] = useState("");
  const [backName, setBackname] = useState("");
  const [depositedate, setDepositedate] = useState("");
  const [CHnumber, setCHnumber] = useState("");
  const [savedDetails, setSavedDetails] = useState(null);
  const [updatingChequeId, setUpdatingChequeId] = useState(null);

  const backoption = ["BOC", "Commercial", "HNB"];

  // ---------------- FETCH INVOICE ----------------
  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const res = await axios.get(
          `https://nihon-inventory.onrender.com/api/get-invoice/${id}`
        );
        setInvoice(res.data);
      } catch (error) {
        console.error("Fetch invoice failed", error);
      }
    };
    fetchInvoice();
  }, [id]);

  // ---------------- CALCULATIONS ----------------
  const calculateTotal = () => {
    if (!invoice?.products) return "0.00";
    return invoice.products
      .reduce(
        (acc, p) =>
          acc +
          p.labelPrice * (1 - p.discount / 100) * p.quantity,
        0
      )
      .toFixed(2);
  };

  const handleCalculate = async () => {
    try {
      const total = parseFloat(calculateTotal());
      const res = await axios.get(
        `https://nihon-inventory.onrender.com/api/get-last-outstanding/${invoice.invoiceNumber}`
      );

      const lastOutstanding = parseFloat(res.data.outstanding);
      const newOutstanding =
        lastOutstanding === -1
          ? total - amount
          : lastOutstanding - amount;

      setOutstanding(newOutstanding.toFixed(2));
    } catch (err) {
      console.error(err);
    }
  };

  // ---------------- SAVE OUTSTANDING ----------------
  const handleSave = async () => {
    try {
      await axios.post(
        `https://nihon-inventory.onrender.com/api/create`,
        {
          invoiceNumber: invoice.invoiceNumber,
          date,
          backName,
          depositedate,
          CHnumber,
          amount,
          outstanding,
        }
      );
      toast.success("Outstanding saved");
    } catch (err) {
      toast.error("Save failed");
    }
  };

  // ---------------- FETCH ALL OUTSTANDING ----------------
  const handleFetchAllOutstandingDetails = async () => {
    try {
      const res = await axios.get(
        `https://nihon-inventory.onrender.com/api/get-all-outstanding/${invoice.invoiceNumber}`
      );
      setSavedDetails(res.data);
    } catch (err) {
      toast.error("No outstanding data");
    }
  };

  // ---------------- UPDATE CHEQUE STATUS ----------------
  const updateChequeStatus = async (chequeId, status) => {
    try {
      setUpdatingChequeId(chequeId);

      await axios.put(
        `https://nihon-inventory.onrender.com/api/invoices/${invoice.invoiceNumber}`,
        { chequeId, status }
      );

      toast.success("Cheque status updated");

      // Update UI immediately
      setInvoice((prev) => ({
        ...prev,
        cheques: prev.cheques.map((c) =>
          c._id === chequeId ? { ...c, status } : c
        ),
      }));
    } catch (err) {
      toast.error("Update failed");
    } finally {
      setUpdatingChequeId(null);
    }
  };

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

        <hr />

        {/* ---------------- PRODUCTS ---------------- */}
        <h2>Product Details</h2>
        <table>
          <thead>
            <tr>
              <th>Code</th>
              <th>Description</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Discount</th>
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
                <td>
                  {(
                    p.labelPrice *
                    (1 - p.discount / 100) *
                    p.quantity
                  ).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div>Total: RS/= {calculateTotal()}</div>

        <hr />

        {/* ---------------- CHEQUES ---------------- */}
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
                    <td>RS/= {c.amount}</td>
                    <td>
                      <select
                        value={c.status}
                        disabled={updatingChequeId === c._id}
                        onChange={(e) =>
                          updateChequeStatus(c._id, e.target.value)
                        }
                      >
                        <option value="Pending">Pending</option>
                        <option value="Cleared">Cleared</option>
                        <option value="Bounced">Bounced</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        <button onClick={handleFetchAllOutstandingDetails}>
          Fetch Outstanding
        </button>
      </div>
      <div className="add-outstanding-container">
                    <h1 className="h1-out">Add Outstanding</h1>

                    <div className="input-container">
                        <label>Deposited Date:</label>
                        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                    </div>
                    <div className="input-container">
                        <label>Bank Name:</label>
                        <select value={backName} onChange={(e) => setBackname(e.target.value)}>
                            <option value="" disabled>Select a Bank</option>
                            {backoption.map((bank, index) => (
                                <option key={index} value={bank}>{bank}</option>
                            ))}
                        </select>
                    </div>
                    <div className="input-container">
                        <label>Date:</label>
                        <input type="date" placeholder="Deposited date" value={depositedate} onChange={(e) => setDepositedate(e.target.value)} />
                    </div>
                    <div className="input-container">
                        <label>Cheque Number/Reference Number:</label>
                        <input type="text" placeholder="Cheque number" value={CHnumber} onChange={(e) => setCHnumber(e.target.value)} required />
                    </div>
                    <div className="input-container">
                        <label>Amount:</label>
                        <input type="number" value={amount} onChange={(e) => setAmount(parseFloat(e.target.value))} />
                    </div>

                    <button className="calculate-button" onClick={handleCalculate}>Calculate</button>
                    <div className="outstanding">Outstanding: RS/={outstanding}</div>
                    <button className="save-button" onClick={handleSave}>Save</button>
                    <hr />
                    
                </div>

      <Footer />
    </div>
  );
};

export default CalOutstanding;
