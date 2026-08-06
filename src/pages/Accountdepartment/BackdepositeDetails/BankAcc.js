import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Loader from '../../../compenents/loader/Loader';
import { useNavigate } from 'react-router-dom';
import debounce from 'lodash.debounce';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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

  const totalAmount = filteredStatements.reduce((sum, entry) => {
    const value = Number(entry.amount) || 0;
    return sum + value;
  }, 0);

  const formattedTotal = formatCurrency(totalAmount);

  // NEW: builds the PDF directly in JS instead of relying on the browser's
  // print dialog. This guarantees every column always appears, because
  // jspdf-autotable calculates column widths itself to fit the page —
  // it never depends on print orientation, scale settings, or @media print
  // support, which is what was causing columns to go missing before.
  const handleDownloadPDF = () => {
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

    const monthNames = {
      '01': 'January',
      '02': 'February',
      '03': 'March',
      '04': 'April',
      '05': 'May',
      '06': 'June',
      '07': 'July',
      '08': 'August',
      '09': 'September',
      '10': 'October',
      '11': 'November',
      '12': 'December',
    };

    const monthLabel = selectedMonth ? monthNames[selectedMonth] : 'All Months';
    const yearLabel = selectedYear ? ` ${selectedYear}` : '';
    const bankLabel = selectbank || 'All Banks';
    const periodLabel = `${monthLabel}${yearLabel}`;
    const pdfFilename = `BankStatement_${monthLabel.replace(/\s+/g, '-')}${selectedYear ? `-${selectedYear}` : ''}_${bankLabel.replace(/\s+/g, '-')}.pdf`;

    doc.setFontSize(14);
    doc.text('Payment Summary', 14, 12);
    doc.setFontSize(11);
    doc.text(`Bank: ${bankLabel}`, 14, 20);
    doc.text(`Period: ${periodLabel}`, 14, 26);
    doc.text(`Total Amount: LKR ${formattedTotal}`, 14, 32);

    const tableColumn = [
      'Invoice Number',
      'Date',
      'Bank Name',
      'Cheque Number/Reference No',
      'Amount (LKR)',
    ];

    const tableRows = filteredStatements.map((entry) => [
      entry.invoiceNumber ?? '-',
      formatDate(entry.date),
      entry.backName ?? '-',
      entry.CHnumber || '-',
      formatCurrency(entry.amount),
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 38,
      theme: 'grid',
      styles: {
        fontSize: 8,
        cellPadding: 2,
        overflow: 'linebreak', // wraps long text instead of clipping it
      },
      headStyles: {
        fillColor: [13, 110, 253],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
      columnStyles: {
        0: { cellWidth: 45 }, // Invoice Number
        1: { cellWidth: 30 }, // Date
        2: { cellWidth: 45 }, // Bank Name
        3: { cellWidth: 90 }, // Cheque Number/Reference No
        4: { cellWidth: 45, halign: 'right' }, // Amount (LKR)
      },
    });

    doc.save(pdfFilename);
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
          <option value="Commercial">Commercial</option>
          <option value="Sampath">Sampath</option>
          <option value="NDB">NDB</option>
          <option value="NBE">NBE</option>
          <option value="NSB">NSB</option>
          <option value="BOC">BOC</option>
          <option value="Other">Other</option>
          <option value="DFCC">DFCC</option>
          <option value="People's">People's</option>
        </select>

        <input
          type="text"
          placeholder="Search Amount"
          value={searchAmount}
          onChange={(e) => setSearchAmount(e.target.value)}
          style={{ marginLeft: '10px', padding: '5px' }}
        />

        <button type="button" className="print-btn" onClick={handleDownloadPDF}>
          Download PDF
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
