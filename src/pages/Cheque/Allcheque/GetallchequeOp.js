import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AllCheques.css";
import { useNavigate } from "react-router-dom";

const GetallchequeOp = () => {
  const [cheques, setCheques] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchDate, setSearchDate] = useState(""); // ✅ NEW
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

  // ✅ FILTER BY DEPOSIT DATE
  const filteredCheques = cheques.filter((c) => {
    if (!searchDate) return true;
    return c.depositDate === searchDate;
  });

  if (loading) return <p>Loading cheque details...</p>;

  return (
    <div className="cheque-report-container">
      <h2 className="cheque-report-title">Cheque Report</h2>

      {/* 🔍 SEARCH BY DEPOSIT DATE */}
      <div className="cheque-search-bar">
        <label className="cheque-search-label">
          Search by Deposit Date:
        </label>
        <input
          type="date"
          className="cheque-search-input"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
        />
      </div>

      <div className="cheque-report-table-wrapper">
        <table className="cheque-report-table">
          <thead className="cheque-report-thead">
            <tr className="cheque-report-header-row">
              <th className="cheque-th">Invoice No</th>
              <th className="cheque-th">Customer</th>
              <th className="cheque-th">Invoice Date</th>
              <th className="cheque-th">Due Date</th>
              <th className="cheque-th">Cheque No</th>
              <th className="cheque-th">Bank</th>
              <th className="cheque-th">Deposit Date</th>
              <th className="cheque-th amount-col">Amount (Rs)</th>
              <th className="cheque-th">Status</th>
            </tr>
          </thead>

          <tbody className="cheque-report-tbody">
            {filteredCheques.length === 0 ? (
              <tr className="cheque-row">
                <td className="cheque-td empty" colSpan="9">
                  No cheque records found
                </td>
              </tr>
            ) : (
              filteredCheques.map((c, index) => (
                <tr className="cheque-row" key={index}>
                  <td className="cheque-td">{c.invoiceNumber}</td>
                  <td className="cheque-td">{c.customer}</td>
                  <td className="cheque-td">{c.invoiceDate}</td>
                  <td className="cheque-td">{c.dueDate}</td>
                  <td className="cheque-td">{c.chequeNo}</td>
                  <td className="cheque-td">{c.bankName}</td>
                  <td className="cheque-td">{c.depositDate}</td>
                  <td className="cheque-td amount-col">
                    {formatNumber(c.amount)}
                  </td>
                  <td
                    className={`cheque-td cheque-status ${
                      c.status === "Cleared"
                        ? "status-cleared"
                        : c.status === "Bounced"
                        ? "status-bounced"
                        : "status-pending"
                    }`}
                  >
                    {c.status}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <button
        className="home-btn"
        onClick={() => navigate("/admin-profile")}
      >
        Home
      </button>
    </div>
  );
};

export default GetallchequeOp;
