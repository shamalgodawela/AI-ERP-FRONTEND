import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import './bankStatement.css'; // Optional: your custom styles
import Loader from '../loader/Loader'; // Optional: loading spinner component
import { useNavigate } from 'react-router-dom';
import debounce from 'lodash.debounce';

const BackStatmentop = () => {
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

  return (
    <div className="bank-statement-container">
      <h2>Payment Summary</h2>

      {/* Month & Year Dropdowns */}
      <div style={{ marginBottom: '15px' }}>
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

        <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} style={{ marginLeft: '10px' }}>
          <option value="">All Years</option>
          <option value="2026">2026</option>
          <option value="2025">2025</option>
          <option value="2024">2024</option>
      
        </select>

        <select value={selectbank} onChange={(e)=>setbankname(e.target.value)}style={{ marginLeft: '10px' }}>
        <option value="">Bank Name</option>
        <option value="HNB">HNB</option>
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

      <button className="home-btn" onClick={() => navigate('/Admin-operations-dashboard')}>
        Home
      </button>
    </div>
  );
};

export default BackStatmentop;
