import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AdminViewincentive.css';

const AdminViewincentive = () => {
  const navigate = useNavigate();
  const [incentives, setIncentives] = useState([]);
  const [filteredIncentives, setFilteredIncentives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [selectedExe, setSelectedExe] = useState('All');
  const [searchMonth, setSearchMonth] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedSettlement, setSelectedSettlement] = useState('All');
  const [selectedPaymentMode, setSelectedPaymentMode] = useState('All'); // ✅ NEW
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchCustomer, setSearchCustomer] = useState('');

  useEffect(() => {
    axios.get('https://nihon-inventory.onrender.com/api/get-incentive')
      .then(response => {
        setIncentives(response.data);
        setFilteredIncentives(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load incentive data.');
        setLoading(false);
      });
  }, []);

  // Unique values
  const uniqueExecutives = ['All', ...new Set(incentives.map(item => item.exe))];
  const uniqueStatuses = ['All', ...new Set(incentives.map(item => item.IncentiveStatus))];
  const uniqueSettlements = ['All', ...new Set(incentives.map(item => item.Incentivesettlement))];
  const uniquePaymentModes = ['All', ...new Set(incentives.map(item => item.ModeofPayment))]; // ✅ NEW

  const formatNumberWithCommas = (num) => {
    return num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // 🔥 FILTER LOGIC
  const applyFilters = (
    exe,
    month,
    status,
    settlement,
    customer,
    start = startDate,
    end = endDate,
    paymentMode = selectedPaymentMode
  ) => {
    let filtered = incentives;

    if (exe !== 'All') {
      filtered = filtered.filter(item => item.exe === exe);
    }

    if (month) {
      filtered = filtered.filter(item =>
        item.invoiceDate && item.invoiceDate.startsWith(month)
      );
    }

    if (status !== 'All') {
      filtered = filtered.filter(item => item.IncentiveStatus === status);
    }

    if (settlement !== 'All') {
      filtered = filtered.filter(item => item.Incentivesettlement === settlement);
    }

    if (customer && customer.trim() !== '') {
      filtered = filtered.filter(item =>
        item.customer &&
        item.customer.toLowerCase().includes(customer.toLowerCase())
      );
    }

    // ✅ Payment Mode Filter
    if (paymentMode !== 'All') {
      filtered = filtered.filter(item =>
        item.ModeofPayment?.toLowerCase() === paymentMode.toLowerCase()
      );
    }

    if (start) {
      filtered = filtered.filter(item => item.invoiceDate && item.invoiceDate >= start);
    }

    if (end) {
      filtered = filtered.filter(item => item.invoiceDate && item.invoiceDate <= end);
    }

    setFilteredIncentives(filtered);
  };

  // Handlers
  const handleSelectChange = (e) => {
    const val = e.target.value;
    setSelectedExe(val);
    applyFilters(val, searchMonth, selectedStatus, selectedSettlement, searchCustomer);
  };

  const handleMonthChange = (e) => {
    const val = e.target.value;
    setSearchMonth(val);
    applyFilters(selectedExe, val, selectedStatus, selectedSettlement, searchCustomer);
  };

  const handleStatusChange = (e) => {
    const val = e.target.value;
    setSelectedStatus(val);
    applyFilters(selectedExe, searchMonth, val, selectedSettlement, searchCustomer);
  };

  const handleSettlementChange = (e) => {
    const val = e.target.value;
    setSelectedSettlement(val);
    applyFilters(selectedExe, searchMonth, selectedStatus, val, searchCustomer);
  };

  const handlePaymentModeChange = (e) => {
    const val = e.target.value;
    setSelectedPaymentMode(val);
    applyFilters(
      selectedExe,
      searchMonth,
      selectedStatus,
      selectedSettlement,
      searchCustomer,
      startDate,
      endDate,
      val
    );
  };

  const handleCustomerSearch = (e) => {
    const val = e.target.value;
    setSearchCustomer(val);
    applyFilters(selectedExe, searchMonth, selectedStatus, selectedSettlement, val);
  };

  const handleStartDateChange = (e) => {
    const val = e.target.value;
    setStartDate(val);
    applyFilters(selectedExe, searchMonth, selectedStatus, selectedSettlement, searchCustomer, val, endDate);
  };

  const handleEndDateChange = (e) => {
    const val = e.target.value;
    setEndDate(val);
    applyFilters(selectedExe, searchMonth, selectedStatus, selectedSettlement, searchCustomer, startDate, val);
  };

  const totalIncentiveAmount = filteredIncentives.reduce((sum, item) => {
    return sum + (parseFloat(item.incentiveAmount) || 0);
  }, 0);

  const handlePrint = () => window.print();

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <>
      <div className="incentive-container">
        <h2>Executive Incentive Report</h2>

        {/* FILTERS */}
        <div className="no-print">

          {/* Executive */}
          <select value={selectedExe} onChange={handleSelectChange}>
            {uniqueExecutives.map((exe, i) => (
              <option key={i}>{exe}</option>
            ))}
          </select>

          {/* Month */}
          <input type="month" value={searchMonth} onChange={handleMonthChange} />

          {/* Customer */}
          <input
            type="text"
            placeholder="Customer"
            value={searchCustomer}
            onChange={handleCustomerSearch}
          />

          {/* Status */}
          <select value={selectedStatus} onChange={handleStatusChange}>
            {uniqueStatuses.map((s, i) => (
              <option key={i}>{s}</option>
            ))}
          </select>

          {/* Settlement */}
          <select value={selectedSettlement} onChange={handleSettlementChange}>
            {uniqueSettlements.map((s, i) => (
              <option key={i}>{s}</option>
            ))}
          </select>

          {/* ✅ Payment Mode */}
          <select value={selectedPaymentMode} onChange={handlePaymentModeChange}>
            {uniquePaymentModes.map((m, i) => (
              <option key={i}>{m}</option>
            ))}
          </select>

          {/* Date Range */}
          <input type="date" value={startDate} onChange={handleStartDateChange} />
          <input type="date" value={endDate} onChange={handleEndDateChange} />

          <button onClick={handlePrint}>Print</button>
        </div>

        {/* TABLE */}
        <p><strong>Total Incentive: Rs {formatNumberWithCommas(totalIncentiveAmount)}</strong></p>

        <table border="1">
          <thead>
            <tr>
              <th>Invoice</th>
              <th>Customer</th>
              <th>Executive</th>
              <th>Payment</th>
              <th>Date</th>
              <th>Total</th>
              <th>Incentive</th>
            </tr>
          </thead>
          <tbody>
            {filteredIncentives.map((item, i) => (
              <tr key={i}>
                <td>{item.invoiceNumber}</td>
                <td>{item.customer}</td>
                <td>{item.exe}</td>
                <td>{item.ModeofPayment}</td>
                <td>{item.invoiceDate}</td>
                <td>{formatNumberWithCommas(parseFloat(item.invoiceTotal) || 0)}</td>
                <td>{formatNumberWithCommas(parseFloat(item.incentiveAmount) || 0)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <button onClick={() => navigate('/admin-profile')}>
          Home
        </button>
      </div>
    </>
  );
};

export default AdminViewincentive;