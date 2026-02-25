import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { AiOutlineEye } from 'react-icons/ai';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPrint } from '@fortawesome/free-solid-svg-icons';
import debounce from 'lodash.debounce';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './allInvoice.css';
import Loader from '../loader/Loader';
import { IoMdArrowRoundBack } from 'react-icons/io';

const WithoutMallout = () => {
  // ====== State variables ======
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [error, setError] = useState(null);

  const [selectedExe, setSelectedExe] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [outstandingSearch, setOutstandingSearch] = useState('');
  const [selectedPaymentMode, setSelectedPaymentMode] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [selectedCode, setSelectedCode] = useState('');
  const [searchCode, setSearchCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const location = useLocation();
  const { state } = location;
  const navigate = useNavigate();

  // ====== Set code from location state if available ======
  useEffect(() => {
    if (state && state.code) {
      setSelectedCode(state.code);
    }
  }, [state]);

  // ====== Fetch all invoices ======
  useEffect(() => {
    const fetchAllInvoices = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          'https://nihon-inventory.onrender.com/api/get-invoicedetails-admin-outstanding'
        );
        setInvoices(response.data);
        setFilteredInvoices(response.data);
      } catch (error) {
        console.error('Failed to fetch invoices', error.message);
        setError('Failed to fetch invoices');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllInvoices();
  }, []);

  // ====== Debounced filtering ======
  const debounceFilter = useCallback(
    debounce(() => {
      let filtered = invoices;

      if (selectedExe) filtered = filtered.filter(i => i.exe === selectedExe);
      if (selectedCustomer)
        filtered = filtered.filter(i =>
          i.customer.toLowerCase().includes(selectedCustomer.toLowerCase())
        );
      if (selectedCode) filtered = filtered.filter(i => i.code === selectedCode);
      if (selectedMonth)
        filtered = filtered.filter(
          i => (new Date(i.invoiceDate).getMonth() + 1).toString().padStart(2, '0') === selectedMonth
        );
      if (selectedYear)
        filtered = filtered.filter(i => new Date(i.invoiceDate).getFullYear().toString() === selectedYear);

      if (outstandingSearch) {
        filtered = filtered.filter(i => {
          const status = String(i.lastOutstanding).toLowerCase();
          const term = outstandingSearch.toLowerCase();
          if (term === 'paid') return status === 'paid';
          if (term === 'not paid' || term === 'notpaid')
            return status === 'not paid' || (!isNaN(i.lastOutstanding) && i.lastOutstanding > 0);
          return status.includes(term);
        });
      }

      if (selectedPaymentMode) {
        filtered = filtered.filter(
          i => i.ModeofPayment && i.ModeofPayment.toLowerCase() === selectedPaymentMode.toLowerCase()
        );
      }

      if (startDate || endDate) {
        filtered = filtered.filter(i => {
          const invoiceDate = new Date(i.invoiceDate);
          const start = startDate ? new Date(startDate) : null;
          const end = endDate ? new Date(endDate) : null;
          if (start && invoiceDate < start) return false;
          if (end && invoiceDate > end) return false;
          return true;
        });
      }

      setFilteredInvoices(filtered);
    }, 300),
    [
      invoices,
      selectedExe,
      selectedCustomer,
      selectedCode,
      selectedMonth,
      selectedYear,
      outstandingSearch,
      selectedPaymentMode,
      startDate,
      endDate,
    ]
  );

  useEffect(() => {
    debounceFilter();
  }, [
    selectedExe,
    selectedCustomer,
    selectedCode,
    selectedMonth,
    selectedYear,
    outstandingSearch,
    selectedPaymentMode,
    startDate,
    endDate,
    debounceFilter,
  ]);

  // ====== Filter change handler ======
  const handleFilterChange = (param, value, setter) => {
    setter(value);
  };

  // ====== Helper functions ======
  const formatNumbers = x =>
    typeof x === 'number' ? x.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') : x;

  const calculateTotal = invoice => {
    if (invoice && Array.isArray(invoice.products)) {
      const productTotal = invoice.products.reduce(
        (acc, product) => acc + product.labelPrice * (1 - product.discount / 100) * product.quantity,
        0
      );
      if (invoice.Tax && typeof invoice.Tax === 'number') return productTotal - (productTotal * invoice.Tax) / 100;
      return productTotal;
    }
    return 0;
  };

  const calculateTotalOutstanding = () => {
    let total = 0;
    filteredInvoices.forEach(i => {
      if (i.GatePassNo === 'Printed') {
        if (i.lastOutstanding === 'Not Paid') total += calculateTotal(i);
        else if (typeof i.lastOutstanding === 'number' && i.lastOutstanding > 0) total += i.lastOutstanding;
      }
    });
    return total;
  };

  const calculateTotalCheque = () => {
    let total = 0;
    filteredInvoices.forEach(i => {
      if (i.GatePassNo === 'Printed') {
        const chequeTotal = typeof i.chequeValues === 'number' ? i.chequeValues : 0;
        total += chequeTotal;
      }
    });
    return total;
  };

  const calculateAmountToBeCollected = () => {
    return calculateTotalOutstanding() - calculateTotalCheque();
  };

  const handlePrint = () => window.print();

  const getPrintHeader = () => {
    let header = 'Outstanding Details';
    const filters = [];
    if (selectedExe) filters.push(`Executive: ${selectedExe}`);
    if (selectedCustomer) filters.push(`Customer: ${selectedCustomer}`);
    if (outstandingSearch) filters.push(`Outstanding: ${outstandingSearch}`);
    if (selectedPaymentMode) filters.push(`Payment Mode: ${selectedPaymentMode}`);
    if (startDate) filters.push(`From: ${startDate}`);
    if (endDate) filters.push(`To: ${endDate}`);
    if (selectedMonth) {
      const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ];
      filters.push(`Month: ${monthNames[parseInt(selectedMonth) - 1]}`);
    }
    if (selectedYear) filters.push(`Year: ${selectedYear}`);
    if (filters.length > 0) header += ` - ${filters.join(', ')}`;
    return header;
  };

  const goback = () => navigate(-1);

  // ====== JSX ======
  return (
    <div>
      <Link to="#" onClick={goback} className="Back-Icon">
        Goback <IoMdArrowRoundBack size={23} />
      </Link>
      <br />
      <br />
      <br />

      <div className="invoice-body">
        {/* ====== Filters ====== */}
        <div className="filter-section">
          <select value={selectedExe} onChange={e => handleFilterChange('exe', e.target.value, setSelectedExe)}>
            <option value="">All Executives</option>
            <option value="Mr.Ahamed">Mr.Ahamed</option>
            <option value="Mr.Safrath">Mr.Safrath</option>
            <option value="Mr.Dasun">Mr.Dasun</option>
            <option value="Mr.Chameera">Mr.Chameera</option>
            <option value="Mr.Riyas">Mr.Riyas</option>
            <option value="Mr.Navaneedan">Mr.Navaneedan</option>
            <option value="Mr.Nayum">Mr.Nayum</option>
            <option value="SOUTH">SOUTH-1</option>
            <option value="Other">Other</option>
            <option value="UpCountry">UpCountry</option>
            <option value="Miss.Mubashshahira">Miss.Mubashshahira</option>
            <option value="Mr.Buddhika">Mr.Buddhika</option>
            <option value="Mr.Arshad">Mr.Arshad</option>
          </select>

          <input
            type="text"
            value={selectedCustomer}
            onChange={e => handleFilterChange('customer', e.target.value, setSelectedCustomer)}
            placeholder="Search by customer name"
          />

          <select
            value={outstandingSearch}
            onChange={e => handleFilterChange('outstanding', e.target.value, setOutstandingSearch)}
          >
            <option value="">Select Outstanding Status</option>
            <option value="Paid">Paid</option>
            <option value="Not Paid">Not Paid</option>
          </select>

          <select
            value={selectedPaymentMode}
            onChange={e => handleFilterChange('paymentMode', e.target.value, setSelectedPaymentMode)}
          >
            <option value="">All Payment Modes</option>
            <option value="Cash">Cash</option>
            <option value="Cheque">Cheque</option>
          </select>

          <select value={selectedMonth} onChange={e => handleFilterChange('month', e.target.value, setSelectedMonth)}>
            <option value="">All Months</option>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={(i + 1).toString().padStart(2, '0')}>
                {new Date(0, i).toLocaleString('default', { month: 'long' })}
              </option>
            ))}
          </select>

          <select value={selectedYear} onChange={e => handleFilterChange('year', e.target.value, setSelectedYear)}>
            <option value="">All Years</option>
            <option value="2026">2026</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
          </select>

          <p>Select Time Period</p>
          <input type="date" value={startDate} onChange={e => handleFilterChange('startDate', e.target.value, setStartDate)} />
          <p>To</p>
          <input type="date" value={endDate} onChange={e => handleFilterChange('endDate', e.target.value, setEndDate)} />

          <button onClick={handlePrint} className="print-button">
            <FontAwesomeIcon icon={faPrint} /> Print
          </button>
        </div>

        {/* ====== Table ====== */}
        <div className="all-invoice">
          <h2 className="h2-invoice">Outstanding Details</h2>
          <h1 className="print-header">{getPrintHeader()}</h1>

          <div className="total-outstanding-summary">
            <h1 className="outstanding-total-header">
              Total Outstanding Amount (Cheques Not Yet Realized):{' '}
              <span className="amount-highlight">Rs. {formatNumbers(calculateTotalOutstanding())}</span>
            </h1>
          </div>

          <div className="total-sales-summary">
            <h1 className="sales-total-header">
              📊 Total Sales Amount:{' '}
              <span className="amount-highlight">
                Rs.
                {formatNumbers(
                  filteredInvoices
                    .filter(i => i.GatePassNo === 'Printed')
                    .reduce((acc, i) => acc + calculateTotal(i), 0)
                )}
              </span>
            </h1>
          </div>

          <div className="total-sales-summary">
            <h1 className="sales-total-header">
              💰 Total Cheque Amount (Pending): <span className="amount-highlight">Rs. {formatNumbers(calculateTotalCheque())}</span>
            </h1>
          </div>

          <div className="total-outstanding-summary">
            <h1 className="outstanding-total-header">
              💵 Amount to be Collected (Outstanding - Cheque Amount):{' '}
              <span className="amount-highlight">{formatNumbers(calculateAmountToBeCollected())}</span>
            </h1>
          </div>

          {isLoading ? (
            <Loader />
          ) : (
            <table>
              <thead>
                <tr>
                  <th className="heading-outstanding">Invoice Number</th>
                  <th className="heading-outstanding">Customer</th>
                  <th className="heading-outstanding">Cheque/Cash</th>
                  <th className="heading-outstanding">Printed or Canceled</th>
                  <th className="heading-outstanding">Invoice Date</th>
                  <th className="heading-outstanding">Due Date</th>
                  <th className="heading-outstanding">Tax Number</th>
                  <th className="heading-outstanding">Exe</th>
                  <th className="heading-outstanding">Outstanding</th>
                  <th className="heading-outstanding">Invoice Total</th>
                  <th className="heading-outstanding">Cheque Total (Pending)</th>
                  <th className="heading-outstanding">Outstanding(with cheque total)</th>
                  <th className="heading-outstanding">Action</th>
                  <th className="heading-outstanding">Add Cheque Details</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map(i => {
                  const invoiceTotal = calculateTotal(i);
                  const chequeTotal = typeof i.chequeValues === 'number' ? i.chequeValues : 0;

                  let outstandingAfterCheque = 0;
                  if (i.lastOutstanding === 'Paid') outstandingAfterCheque = 0;
                  else if (i.lastOutstanding === 'Not Paid') outstandingAfterCheque = invoiceTotal - chequeTotal;
                  else if (typeof i.lastOutstanding === 'number') outstandingAfterCheque = i.lastOutstanding - chequeTotal;

                  return (
                    <tr key={i._id} className={i.GatePassNo === 'Canceled' ? 'canceled-row' : ''}>
                      <td>{i.invoiceNumber}</td>
                      <td>{i.customer}</td>
                      <td>{i.ModeofPayment}</td>
                      <td>{i.GatePassNo}</td>
                      <td>{i.invoiceDate}</td>
                      <td>{i.Duedate}</td>
                      <td>{i.TaxNo}</td>
                      <td>{i.exe}</td>
                      <td className={`td-invoice ${i.lastOutstanding === 'Not Paid' ? 'not-paid' : i.lastOutstanding === 'Paid' ? 'paid' : ''}`}>
                        {formatNumbers(i.lastOutstanding)}
                      </td>
                      <td>{formatNumbers(invoiceTotal)}</td>
                      <td>{chequeTotal ? formatNumbers(chequeTotal) : '-'}</td>
                      <td className={`td-invoice ${outstandingAfterCheque > 0 ? 'not-paid' : 'paid'}`}>
                        {formatNumbers(outstandingAfterCheque)}
                      </td>
                      <td>
                        <Link to={`/caloutStanding/${i._id}`}>
                          <AiOutlineEye size={20} color="purple" />
                        </Link>
                      </td>
                      <td>
                        <Link to={`/invoice/${i.invoiceNumber}`}>
                          <FontAwesomeIcon icon={faEye} className="action-icon" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default WithoutMallout;