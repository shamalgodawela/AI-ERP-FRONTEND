import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Footer from "../../../compenents/footer/Footer";
import { IoMdArrowRoundBack } from "react-icons/io";

const SingleIndetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const [invoice, setInvoice] = useState(null);
  const [amount, setAmount] = useState("");
  const [outstanding, setOutstanding] = useState("0.00");
  const [date, setDate] = useState(""); // Payment date
  const [backName, setBackname] = useState("");
  const [CHnumber, setCHnumber] = useState("");
  const [savedDetails, setSavedDetails] = useState(null);
  const [updatingChequeId, setUpdatingChequeId] = useState(null);
  const [updatingDepositDateId, setUpdatingDepositDateId] = useState(null);
  const [updatingAmountId, setUpdatingAmountId] = useState(null);
  const [depositedate, setDepositedate] = useState(""); // AUTO date

  const backoption = ["BOC", "Commercial", "HNB", "People's", "Sampath", "NSB", "DFCC", "AMANA"];

  // ---------------- AUTO SET TODAY DATE ----------------
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setDate(today);          // Payment date : editable
    setDepositedate(today);  // Deposit date : auto, not editable
  }, []);

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

  // ---------------- CALCULATE OUTSTANDING ----------------
  const handleCalculate = async () => {
    try {
      const parsedAmount = parseFloat(amount);
      if (isNaN(parsedAmount)) {
        toast.error("Enter valid amount");
        return;
      }

      const total = parseFloat(calculateTotal());

      const res = await axios.get(
        `https://nihon-inventory.onrender.com/api/get-last-outstanding/${invoice.invoiceNumber}`
      );

      const lastOutstanding = parseFloat(res.data.outstanding);

      const newOutstanding =
        lastOutstanding === -1
          ? total - parsedAmount
          : lastOutstanding - parsedAmount;

      setOutstanding(newOutstanding.toFixed(2));
    } catch {
      toast.error("Outstanding calculation failed");
    }
  };

  // ---------------- SAVE OUTSTANDING ----------------
  const handleSave = async () => {
    try {
      await axios.post(`https://nihon-inventory.onrender.com/api/create`, {
        invoiceNumber: invoice.invoiceNumber,
        date,
        backName,
        CHnumber,
        depositedate,
        amount,
        outstanding
      });
      toast.success("Outstanding saved successfully");
    } catch {
      toast.error("Failed to save outstanding");
    }
  };

  // ---------------- OTHER FUNCTIONS REMAIN SAME ----------------
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

  const handleUpdateChequeStatus = async (chequeId, status) => {
    try {
      setUpdatingChequeId(chequeId);
      const res = await axios.put(
        `https://nihon-inventory.onrender.com/api/invoices/cheque-status/${invoice.invoiceNumber}`,
        { chequeId, status }
      );
      setInvoice(res.data.invoice);
      toast.success(res.data.message);
    } catch {
      toast.error("Cheque update failed");
    } finally {
      setUpdatingChequeId(null);
    }
  };

  const handleUpdateDepositDate = async (chequeId, depositDate) => {
    try {
      setUpdatingDepositDateId(chequeId);
      const res = await axios.put(
        `https://nihon-inventory.onrender.com/api/invoices/cheque-deposit-date/${invoice.invoiceNumber}`,
        { chequeId, depositDate }
      );
      setInvoice(res.data.invoice);
      toast.success("Deposit date updated");
    } catch {
      toast.error("Deposit date update failed");
    } finally {
      setUpdatingDepositDateId(null);
    }
  };

  const handleUpdateChequeAmount = async (chequeId, amount) => {
    try {
      const parsedAmount = parseFloat(amount);
      if (isNaN(parsedAmount) || parsedAmount < 0) {
        toast.error("Enter valid amount");
        return;
      }

      setUpdatingAmountId(chequeId);
      const res = await axios.put(
        `https://nihon-inventory.onrender.com/api/invoices/cheque-amount/${invoice.invoiceNumber}`,
        { chequeId, amount: parsedAmount }
      );
      setInvoice(res.data.invoice);
      toast.success("Cheque amount updated");
    } catch {
      toast.error("Cheque amount update failed");
    } finally {
      setUpdatingAmountId(null);
    }
  };

  const formatNumbers = (x) =>
    x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  if (!invoice) return <div>Loading...</div>;

  return (
    <div ref={containerRef}>

      {/* ADD OUTSTANDING SECTION */}
      <div style={{
        maxWidth: '900px',
        margin: '40px auto',
        padding: '40px',
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 6px 20px rgba(0,0,0,0.07)'
      }}>

        <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>
          Add Payment
        </h1>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px'
        }}>

          {/* AUTO FILL DEPOSIT DATE */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label>Details update Date</label>
            <input
              type="date"
              value={depositedate}
              readOnly
              disabled
              style={{
                padding: '12px',
                border: '1px solid #ccc',
                borderRadius: '8px',
                background: '#f1f5f9',
                color: '#64748b',
                cursor: 'not-allowed'
              }}
            />
          </div>

          {/* Payment Date - editable */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label>Payment Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={{
                padding: '12px',
                border: '1px solid #ccc',
                borderRadius: '8px'
              }}
            />
          </div>

          {/* BANK NAME */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label>Bank Name</label>
            <select
              value={backName}
              onChange={(e) => setBackname(e.target.value)}
              style={{
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #ccc'
              }}
            >
              <option value="">Select Bank</option>
              {backoption.map((b, i) => (
                <option key={i} value={b}>{b}</option>
              ))}
            </select>
          </div>

          {/* CHEQUE / REFERENCE */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label>Cheque Number / Reference</label>
            <input
              type="text"
              value={CHnumber}
              onChange={(e) => setCHnumber(e.target.value)}
              style={{
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #ccc'
              }}
            />
          </div>

          {/* AMOUNT */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label>Amount (LKR)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={{
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #ccc'
              }}
            />
          </div>

        </div>

        <button
          onClick={handleCalculate}
          style={{
            marginTop: '20px',
            padding: '12px 20px',
            background: '#164d72',
            color: 'white',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Calculate Outstanding
        </button>

        <br />

        <button
          onClick={handleSave}
          style={{
            marginTop: '20px',
            padding: '12px 20px',
            background: '#0f7b31',
            color: 'white',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Save Payment
        </button>
      </div>
    </div>
  );
};

export default SingleIndetails;
