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

  // Filter states
  const [selectedExe, setSelectedExe] = useState('All');
  const [searchMonth, setSearchMonth] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedSettlement, setSelectedSettlement] = useState('All');
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

  const uniqueExecutives = ['All', ...Array.from(new Set(incentives.map(item => item.exe)))];
  const uniqueStatuses = ['All', ...Array.from(new Set(incentives.map(item => item.IncentiveStatus)))];
  const uniqueSettlements = ['All', ...Array.from(new Set(incentives.map(item => item.Incentivesettlement)))];

  const formatNumberWithCommas = (num) => {
    return num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const applyFilters = (exe, month, IncentiveStatus, Incentivesettlement, customer, start = startDate, end = endDate) => {
    let filtered = incentives;

    if (exe !== 'All') {
      filtered = filtered.filter(item => item.exe === exe);
    }

    if (month) {
      filtered = filtered.filter(item =>
        item.invoiceDate &&
        item.invoiceDate.startsWith(month)
      );
    }

    if (IncentiveStatus !== 'All') {
      filtered = filtered.filter(item => item.IncentiveStatus === IncentiveStatus);
    }

    if (Incentivesettlement !== 'All') {
      filtered = filtered.filter(item => item.Incentivesettlement === Incentivesettlement);
    }

    // Filter by customer (case-insensitive search)
    if (customer && customer.trim() !== '') {
      filtered = filtered.filter(item => 
        item.customer && 
        item.customer.toLowerCase().includes(customer.toLowerCase())
      );
    }

    // Filter by invoiceDate range
    if (start) {
      filtered = filtered.filter(item => item.invoiceDate && item.invoiceDate >= start);
    }
    if (end) {
      filtered = filtered.filter(item => item.invoiceDate && item.invoiceDate <= end);
    }
    setFilteredIncentives(filtered);
  };

  // Handlers for each filter change
  const handleSelectChange = (e) => {
    const exe = e.target.value;
    setSelectedExe(exe);
    applyFilters(exe, searchMonth, selectedStatus, selectedSettlement, searchCustomer);
  };

  const handleMonthChange = (e) => {
    const month = e.target.value;
    setSearchMonth(month);
    applyFilters(selectedExe, month, selectedStatus, selectedSettlement, searchCustomer);
  };

  const handleStatusChange = (e) => {
    const status = e.target.value;
    setSelectedStatus(status);
    applyFilters(selectedExe, searchMonth, status, selectedSettlement, searchCustomer);
  };

  const handleSettlementChange = (e) => {
    const settlement = e.target.value;
    setSelectedSettlement(settlement);
    applyFilters(selectedExe, searchMonth, selectedStatus, settlement, searchCustomer);
  };

  const handleCustomerSearch = (e) => {
    const customer = e.target.value;
    setSearchCustomer(customer);
    applyFilters(selectedExe, searchMonth, selectedStatus, selectedSettlement, customer);
  };

  // New handlers for start/end date
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

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <>
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printableArea, #printableArea * {
            visibility: visible;
          }
          #printableArea {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
          .signature-section {
            page-break-inside: avoid;
            margin-top: 50px !important;
          }
          .signature-field {
            border-top: 1px solid #000 !important;
            page-break-inside: avoid;
          }
          .signature-field div {
            border: 1px dashed #000 !important;
            background-color: transparent !important;
          }
        }
      `}</style>

      <div>
        <div className="incentive-container">
          <h2>Executive Incentive Report</h2>

          {/* Filter Controls */}
          <div className="no-print" style={{ marginBottom: '10px' }}>
            <label htmlFor="exe-select" style={{ marginRight: '8px' }}>Filter by Executive:</label>
            <select
              id="exe-select"
              value={selectedExe}
              onChange={handleSelectChange}
              style={{ padding: '5px', width: '180px', marginRight: '10px' }}
            >
              {uniqueExecutives.map((exe, idx) => (
                <option key={idx} value={exe}>{exe}</option>
              ))}
            </select>

            <label htmlFor="month-filter" style={{ marginRight: '8px' }}>Filter by Month:</label>
            <input
              type="month"
              id="month-filter"
              value={searchMonth}
              onChange={handleMonthChange}
              style={{ padding: '5px', marginRight: '10px' }}
            />

            <label htmlFor="customer-search" style={{ marginRight: '8px' }}>Search by Customer:</label>
            <input
              type="text"
              id="customer-search"
              placeholder="Enter customer name"
              value={searchCustomer}
              onChange={handleCustomerSearch}
              style={{ padding: '5px', width: '180px', marginRight: '10px' }}
            />

            <label htmlFor="status-select" style={{ marginRight: '8px' }}>Payment Settlement:</label>
            <select
              id="status-select"
              value={selectedStatus}
              onChange={handleStatusChange}
              style={{ padding: '5px', width: '180px', marginRight: '10px' }}
            >
              {uniqueStatuses.map((status, idx) => (
                <option key={idx} value={status}>{status}</option>
              ))}
            </select>

            <label htmlFor="settlement-select" style={{ marginRight: '8px' }}>Executive Incentive received or not:</label>
            <select
              id="settlement-select"
              value={selectedSettlement}
              onChange={handleSettlementChange}
              style={{ padding: '5px', width: '180px', marginRight: '10px' }}
            >
              {uniqueSettlements.map((settlement, idx) => (
                <option key={idx} value={settlement}>{settlement}</option>
              ))}
            </select>

            <div style={{display:"inline-block", marginRight:'10px'}}>
              <label htmlFor="start-date">Start Date: </label>
              <input type="date" id="start-date" value={startDate} onChange={handleStartDateChange} style={{padding:'5px',marginRight:'10px'}} />
            </div>
            <div style={{display:"inline-block", marginRight:'10px'}}>
              <label htmlFor="end-date">End Date: </label>
              <input type="date" id="end-date" value={endDate} onChange={handleEndDateChange} style={{padding:'5px',marginRight:'10px'}} />
            </div>

            <button onClick={handlePrint} style={{ padding: '5px 10px' }}>
              Print Report
            </button>
          </div>

          {/* Printable Area */}
          <div id="printableArea">
            {selectedExe !== 'All' && (
              <h1 style={{ 
                textAlign: 'center', 
                marginBottom: '20px', 
                color: '#333',
                fontSize: '24px',
                fontWeight: 'bold'
              }}>
                Executive Incentive Report - {selectedExe}
              </h1>
            )}
            <p><strong>Total Incentive Amount : Rs {formatNumberWithCommas(totalIncentiveAmount)}</strong></p>

            <table
              className="incentive-table"
              border="1"
              cellPadding="5"
              cellSpacing="0"
              style={{ borderCollapse: 'collapse', width: '100%' }}
            >
              <thead>
                <tr>
                  <th>Invoice Number</th>
                  <th>Customer</th>
                  <th>Executive</th>
                  <th>Payment Mode</th>
                  <th>Invoice date</th>
                  <th>Invoice Total (Rs)</th>
                  <th>Incentive Amount (Rs)</th>
                  <th>Invoice Settled Date</th>
                  <th>Invoice Due Date</th>
                  <th>Incentive Status</th>
                  <th>Incentive Settlement</th>
                </tr>
              </thead>
              <tbody>
                {filteredIncentives.map((item, index) => (
                  <tr key={index}>
                    <td>{item.invoiceNumber}</td>
                    <td>{item.customer}</td>
                    <td>{item.exe}</td>
                    <td>{item.ModeofPayment}</td>
                    <td>{item.invoiceDate}</td>
                    <td>{formatNumberWithCommas(parseFloat(item.invoiceTotal) || 0)}</td>
                    <td>{formatNumberWithCommas(parseFloat(item.incentiveAmount) || 0)}</td>
                    <td>{item.IncentiveDueDate}</td>
                    <td>{item.Duedate}</td>
                    <td>{item.IncentiveStatus}</td>
                    <td>{item.Incentivesettlement}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Signature Section */}
            <div className="signature-section" style={{ 
              marginTop: '50px', 
              display: 'flex', 
              justifyContent: 'space-between',
              pageBreakInside: 'avoid'
            }}>
              <div className="signature-field" style={{
                width: '45%',
                textAlign: 'center',
                borderTop: '1px solid #000',
                paddingTop: '10px',
                marginTop: '30px'
              }}>
                <p style={{ margin: '0', fontWeight: 'bold', fontSize: '14px' }}>System Validity</p>
                <div style={{
                  height: '60px',
                  border: '1px dashed #ccc',
                  marginTop: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#f9f9f9'
                }}>
                  <span style={{ color: '#999', fontSize: '12px' }}>Signature Area</span>
                </div>
                <p style={{ margin: '5px 0 0 0', fontSize: '12px' }}>Date: _________________</p>
              </div>

              <div className="signature-field" style={{
                width: '45%',
                textAlign: 'center',
                borderTop: '1px solid #000',
                paddingTop: '10px',
                marginTop: '30px'
              }}>
                <p style={{ margin: '0', fontWeight: 'bold', fontSize: '14px' }}>Incentive Approval</p>
                <div style={{
                  height: '60px',
                  border: '1px dashed #ccc',
                  marginTop: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#f9f9f9'
                }}>
                  <span style={{ color: '#999', fontSize: '12px' }}>Signature Area</span>
                </div>
                <p style={{ margin: '5px 0 0 0', fontSize: '12px' }}>Date: _________________</p>
              </div>
            </div>
          </div>
        </div>

        <button
          className="home-btn no-print"
          onClick={() => navigate('/admin-profile')}
          style={{ marginTop: '15px' }}
        >
          Home
        </button>
      </div>
    </>
  );
};

export default AdminViewincentive;
