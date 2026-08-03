import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Loader from '../../../compenents/loader/Loader';
import { useNavigate } from 'react-router-dom';
import debounce from 'lodash.debounce';

const BankAcc = () => {
  const [statements, setStatements] = useState([]);
  const [filteredStatements, setFilteredStatements] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectbank, setbankname] = useState('');
  const [searchAmount, setSearchAmount] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchStatements = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          'https://nihon-inventory.onrender.com/api/get-alldeposite-details'
        );
        setStatements(response.data);
        setFilteredStatements(response.data);
      } catch (err) {
        setError('Failed to fetch bank statements.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatements();
  }, []);

  const debounceFilter = useCallback(
    debounce(() => {
      let filtered = [...statements];

      // Month filter
      if (selectedMonth) {
        filtered = filtered.filter((entry) => {
          const date = new Date(entry.date);
          return String(date.getMonth() + 1).padStart(2, '0') === selectedMonth;
        });
      }

      // Year filter
      if (selectedYear) {
        filtered = filtered.filter((entry) => {
          const date = new Date(entry.date);
          return String(date.getFullYear()) === selectedYear;
        });
      }

      // Bank filter
      if (selectbank) {
        filtered = filtered.filter((entry) =>
          entry.backName?.toLowerCase().includes(selectbank.toLowerCase())
        );
      }

      // Amount filter (partial search)
      if (searchAmount) {
        filtered = filtered.filter((entry) =>
          entry.amount.toString().includes(searchAmount)
        );
      }

      // Sort by newest date
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

      setFilteredStatements(filtered);
    }, 300),
    [statements, selectedMonth, selectedYear, selectbank, searchAmount]
  );

  useEffect(() => {
    debounceFilter();
  }, [selectedMonth, selectedYear, selectbank, searchAmount, debounceFilter]);

  const formatCurrency = (amount) =>
    typeof amount === 'number'
      ? amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      : amount;

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };

  return (
    <div className="bank-statement-container">
      <style>{`
        .bank-statement-container {
          font-family: Arial, sans-serif;
          padding: 20px;
        }

        .print-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 15px;
        }

        .print-btn {
          padding: 8px 12px;
          background: #0d6efd;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .print-btn:hover {
          background: #0b5ed7;
        }

        .print-table-wrapper {
          width: 100%;
          overflow-x: auto;
        }

        .bank-statement-table {
          width: 100%;
          min-width: 900px;
          border-collapse: collapse;
          font-size: 12px;
        }

        .bank-statement-table th,
        .bank-statement-table td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
          white-space: nowrap;
        }

        @media print {
          body {
            background: #fff;
          }

          .no-print {
            display: none !important;
          }

          .bank-statement-container {
            padding: 0;
            width: 100%;
          }

          .print-table-wrapper {
            overflow: visible;
          }

          .bank-statement-table {
            width: 100%;
            min-width: 100%;
            border-collapse: collapse;
            font-size: 9px;
            table-layout: auto;
          }

          .bank-statement-table th,
          .bank-statement-table td {
            border: 1px solid #000;
            padding: 5px;
            white-space: normal;
            word-break: break-word;
          }

          @page {
            size: A4 landscape;
            margin: 10mm;
          }
        }
      `}</style>

      <h2>Payment Summary</h2>

      <div className="print-actions no-print">
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          <option value="">All Months</option>
          <option value="01">January</option>
          <option value="02">February</option>
          <option value="03">March</option>
          <option value="04">April</option>
          <option value="05">May</option>
          <option value="06">June</option>
          <option value="07">July</option>
          <option value="08">August</option>
          <option value="09">September</option>
          <option value="10">October</option>
          <option value="11">November</option>
          <option value="12">December</option>
        </select>

        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          style={{ marginLeft: '10px' }}
        >
          <option value="">All Years</option>
          <option value="2026">2026</option>
          <option value="2025">2025</option>
          <option value="2024">2024</option>
        </select>

        <select
          value={selectbank}
          onChange={(e) => setbankname(e.target.value)}
          style={{ marginLeft: '10px' }}
        >
          <option value="">Bank Name</option>
          <option value="HNB">HNB</option>
          <option value="Sampath">Sampath</option>
          <option value="NDB">NDB</option>
          <option value="NBE">NBE</option>
          <option value="NSB">NSB</option>
          <option value="BOC">BOC</option>
        </select>

        <input
          type="text"
          placeholder="Search Amount"
          value={searchAmount}
          onChange={(e) => setSearchAmount(e.target.value)}
          style={{ marginLeft: '10px', padding: '5px' }}
        />

        <button type="button" className="print-btn" onClick={() => window.print()}>
          Print as PDF
        </button>
      </div>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <p className="error-text">{error}</p>
      ) : (
        <div id="printable-bank-statements" className="print-table-wrapper">
          <table className="bank-statement-table">
            <thead>
              <tr>
                <th>Invoice Number</th>
                <th>Date</th>
                <th>Bank Name</th>
                <th>Cheque Number/reference No</th>
                <th>Amount (LKR)</th>
              </tr>
            </thead>
            <tbody>
              {filteredStatements.map((entry, index) => (
                <tr key={index}>
                  <td>{entry.invoiceNumber}</td>
                  <td>{formatDate(entry.date)}</td>
                  <td>{entry.backName}</td>
                  <td>{entry.CHnumber || '-'}</td>
                  <td>{formatCurrency(entry.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <button className="home-btn no-print" onClick={() => navigate('/account-dash')}>
        Home
      </button>
    </div>
  );
};

export default BankAcc;