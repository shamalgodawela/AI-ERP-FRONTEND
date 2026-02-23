import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AllaccCheaue = () => {
  const [cheques, setCheques] = useState([]);
  const [loading, setLoading] = useState(true);

  const [singleDate, setSingleDate] = useState(""); // ✅ new
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCheques = async () => {
      try {
        const res = await axios.get(
          "https://nihon-inventory.onrender.com/api/cheques"
        );
        setCheques(res.data);
      } catch (error) {
        console.error("Failed to load cheque details", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCheques();
  }, []);

  const formatNumber = (num) =>
    Number(num).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
    });

  // ✅ FILTER BY SINGLE DATE OR RANGE + STATUS
  const filteredCheques = cheques.filter((c) => {
    const deposit = new Date(c.depositDate);
    const depositStr = c.depositDate?.split("T")[0];

    let dateMatch = true;

    // Priority: single date
    if (singleDate) {
      dateMatch = depositStr === singleDate;
    } else {
      const from = fromDate ? new Date(fromDate) : null;
      const to = toDate ? new Date(toDate) : null;

      if (from && to) dateMatch = deposit >= from && deposit <= to;
      else if (from) dateMatch = deposit >= from;
      else if (to) dateMatch = deposit <= to;
    }

    const statusMatch =
      statusFilter === "All" || c.status === statusFilter;

    return dateMatch && statusMatch;
  });

  // ✅ TOTAL AMOUNT
  const totalFilteredAmount = filteredCheques.reduce(
    (sum, c) => sum + Number(c.amount || 0),
    0
  );

  if (loading) return <p>Loading cheque details...</p>;

  return (
    <div className="cheque-report-container">
      <h2 className="cheque-report-title">Cheque Report</h2>

      {/* 🔍 SEARCH BAR */}
      <div className="cheque-search-bar">

        <div className="search-group">
          <label>Single Date</label>
          <input
            type="date"
            value={singleDate}
            onChange={(e) => {
              setSingleDate(e.target.value);
              setFromDate("");
              setToDate("");
            }}
          />
        </div>

        <div className="search-group">
          <label>From</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => {
              setFromDate(e.target.value);
              setSingleDate("");
            }}
          />
        </div>

        <div className="search-group">
          <label>To</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => {
              setToDate(e.target.value);
              setSingleDate("");
            }}
          />
        </div>

        <div className="search-group">
          <label>Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="Cleared">Cleared</option>
            <option value="Bounced">Bounced</option>
          </select>
        </div>
      </div>

      {/* ✅ TOTAL BOX */}
      <div className="cheque-total-box">
        Total Amount: <span>Rs {formatNumber(totalFilteredAmount)}</span>
      </div>

      {/* TABLE */}
      <div className="cheque-report-table-wrapper">
        <table className="cheque-report-table">
          <thead>
            <tr>
              <th className="cheque-th">Invoice No</th>
              <th className="cheque-th">Customer</th>
              <th className="cheque-th">Invoice Date</th>
              <th className="cheque-th">Due Date</th>
              <th className="cheque-th">Cheque No</th>
              <th className="cheque-th">Bank</th>
              <th className="cheque-th">Deposit Date</th>
              <th className="cheque-th">Amount (Rs)</th>
              <th className="cheque-th">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredCheques.length === 0 ? (
              <tr>
                <td colSpan="9" className="empty">
                  No cheque records found
                </td>
              </tr>
            ) : (
              filteredCheques.map((c, index) => (
                <tr key={index}>
                  <td>{c.invoiceNumber}</td>
                  <td>{c.customer}</td>
                  <td>{c.invoiceDate}</td>
                  <td>{c.dueDate}</td>
                  <td>{c.chequeNo}</td>
                  <td>{c.bankName}</td>
                  <td>{c.depositDate}</td>
                  <td>{formatNumber(c.amount)}</td>
                  <td className={`status ${c.status.toLowerCase()}`}>
                    {c.status}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <button className="home-btn" onClick={() => navigate("/account-dash")}>
        Home
      </button>
    </div>
  );
};

export default AllaccCheaue;
