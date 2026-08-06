import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import './bankStatement.css'; // Optional: your custom styles
import Loader from '../loader/Loader'; // Optional: loading spinner component
import { useNavigate } from 'react-router-dom';
import debounce from 'lodash.debounce';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const BankStatement = () => {
  const [statements, setStatements] = useState([]);
  const [filteredStatements, setFilteredStatements] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectbank,setbankname]=useState('');
  const navigate = useNavigate();


  useEffect(() => {
    const fetchStatements = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('https://nihon-inventory.onrender.com/api/get-alldeposite-details');
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

      if (selectedMonth) {
        filtered = filtered.filter((entry) => {
          const date = new Date(entry.date);
          return String(date.getMonth() + 1).padStart(2, '0') === selectedMonth;
        });
      }

      if (selectedYear) {
        filtered = filtered.filter((entry) => {
          const date = new Date(entry.date);
          return String(date.getFullYear()) === selectedYear;
        });
      }
      if (selectbank) {
        filtered = filtered.filter((entry) =>
          entry.backName?.toLowerCase().includes(selectbank.toLowerCase())
        );
      }

      // ✅ Sort by date (newest first)
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

      setFilteredStatements(filtered);
    }, 300),
    [statements, selectedMonth, selectedYear,selectbank]
  );

  useEffect(() => {
    debounceFilter();
  }, [selectedMonth, selectedYear,selectbank, debounceFilter]);

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
      doc.text('Professional Bank Statement', 14, 12);
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
      <div className="bank-statement-header">
        <div className="bank-statement-brand">
          <h1>Bank Statement</h1>
          <p>Professional record of payment activity and bank deposits</p>
        </div>
        <div className="bank-statement-details">
          <div>
            <strong>Statement Date</strong>
            <span>{new Date().toLocaleDateString('en-GB')}</span>
          </div>
          <div>
            <strong>Record Count</strong>
            <span>{filteredStatements.length}</span>
          </div>
        </div>
      </div>

      <div className="bank-statement-summary">
        <div>
          <span>Selected Period</span>
          <p>
            {selectedMonth || selectedYear
              ? `${selectedMonth || 'All Months'} / ${selectedYear || 'All Years'}`
              : 'All Periods'}
          </p>
        </div>
        <div>
          <span>Bank Filter</span>
          <p>{selectbank || 'All Banks'}</p>
        </div>
        <div>
          <span>Total Amount</span>
          <p>LKR {formattedTotal}</p>
        </div>
      </div>

      <div className="bank-statement-filters no-print">
        <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
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

        <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
          <option value="">All Years</option>
          <option value="2026">2026</option>
          <option value="2025">2025</option>
          <option value="2024">2024</option>
        </select>

        <select value={selectbank} onChange={(e) => setbankname(e.target.value)}>
          <option value="">All Banks</option>
          <option value="HNB">HNB</option>
          <option value="Commercial">Commercial</option>
          <option value="Sampath">Sampath</option>
          <option value="NDB">NDB</option>
          <option value="NBE">NBE</option>
          <option value="NSB">NSB</option>
          <option value="BOC">BOC</option>
        </select>
      </div>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <p className="error-text">{error}</p>
      ) : (
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
      )}

      <div className="print-actions no-print">
        <button type="button" className="print-btn" onClick={handleDownloadPDF}>
          Download Bank Statement PDF
        </button>
        <button className="home-btn" onClick={() => navigate('/admin-profile')}>
          Home
        </button>
      </div>
    </div>
  );
};

export default BankStatement;
