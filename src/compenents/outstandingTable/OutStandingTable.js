import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { AiOutlineEye } from 'react-icons/ai';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPrint } from '@fortawesome/free-solid-svg-icons';
import debounce from 'lodash.debounce';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import './allInvoice.css';
import Loader from '../loader/Loader';

const OutStandingTable = () => {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [error, setError] = useState(null);
  const [selectedExe, setSelectedExe] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [outstandingSearch, setOutstandingSearch] = useState('');
  const [exeNameSearch, setExeNameSearch] = useState('');
  const [selectedPaymentMode, setSelectedPaymentMode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const location = useLocation();
  const { state } = location;
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const customerFromState = state?.customer || searchParams.get("customer") || '';
    const exe = searchParams.get("exe") || '';
    const month = searchParams.get("month") || '';
    const year = searchParams.get("year") || '';
    const outstanding = searchParams.get("outstanding") || '';
    const exeName = searchParams.get("exeName") || '';
    const paymentMode = searchParams.get("paymentMode") || '';
    const startD = searchParams.get("startDate") || '';
    const endD = searchParams.get("endDate") || '';

    setSelectedCustomer(customerFromState);
    setSelectedExe(exe);
    setSelectedMonth(month);
    setSelectedYear(year);
    setOutstandingSearch(outstanding);
    setExeNameSearch(exeName);
    setSelectedPaymentMode(paymentMode);
    setStartDate(startD);
    setEndDate(endD);
  }, []);

  useEffect(() => {
    const fetchAllInvoices = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('https://nihon-inventory.onrender.com/api/get-invoicedetails-admin-outstanding');
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

  const debounceFilter = useCallback(
    debounce(() => {
      let filtered = invoices;

      if (selectedExe) filtered = filtered.filter(i => i.exe === selectedExe);
      if (selectedCustomer) filtered = filtered.filter(i => i.customer.toLowerCase().includes(selectedCustomer.toLowerCase()));
      if (exeNameSearch) filtered = filtered.filter(i => i.exe.toLowerCase().includes(exeNameSearch.toLowerCase()));
      if (selectedMonth) filtered = filtered.filter(i => (new Date(i.invoiceDate).getMonth() + 1).toString().padStart(2,'0') === selectedMonth);
      if (selectedYear) filtered = filtered.filter(i => new Date(i.invoiceDate).getFullYear().toString() === selectedYear);

      if (outstandingSearch) {
        filtered = filtered.filter(i => {
          const status = String(i.lastOutstanding).toLowerCase();
          const term = outstandingSearch.toLowerCase();
          if (term === 'paid') return status === 'paid';
          if (term === 'not paid' || term === 'notpaid') return status === 'not paid' || (!isNaN(i.lastOutstanding) && i.lastOutstanding > 0);
          return status.includes(term);
        });
      }

      if (selectedPaymentMode) {
        filtered = filtered.filter(i =>
          i.ModeofPayment && i.ModeofPayment.toLowerCase() === selectedPaymentMode.toLowerCase()
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
    [invoices, selectedExe, selectedCustomer, exeNameSearch, selectedMonth, selectedYear, outstandingSearch, selectedPaymentMode, startDate, endDate]
  );

  useEffect(() => {
    debounceFilter();
  }, [selectedExe, selectedCustomer, exeNameSearch, selectedMonth, selectedYear, outstandingSearch, selectedPaymentMode, startDate, endDate, debounceFilter]);

  const handleFilterChange = (param, value, setter) => {
    setter(value);
    const newParams = new URLSearchParams(searchParams);
    value ? newParams.set(param, value) : newParams.delete(param);
    setSearchParams(newParams, { replace: true });
  };

  const formatNumbers = x => (typeof x === 'number' ? x.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : x);

  const calculateTotal = invoice => {
    if (invoice && Array.isArray(invoice.products)) {
      const productTotal = invoice.products.reduce((acc, product) =>
        acc + product.labelPrice * (1 - product.discount/100) * product.quantity
      , 0);
      if (invoice.Tax && typeof invoice.Tax === 'number')
        return productTotal - (productTotal * invoice.Tax / 100);
      return productTotal;
    }
    return 0;
  };

  const calculateTotalOutstanding = () => {
    let total = 0;
    filteredInvoices.forEach(i => {
      if (i.GatePassNo === 'Printed') {
        if (i.lastOutstanding === "Not Paid") total += calculateTotal(i);
        else if (typeof i.lastOutstanding === 'number' && i.lastOutstanding > 0)
          total += i.lastOutstanding;
      }
    });
    return total;
  };

  const handlePrint = () => window.print();

  const getPrintHeader = () => {
    let header = "Outstanding Details";
    const filters = [];
    if (selectedExe) filters.push(`Executive: ${selectedExe}`);
    if (selectedCustomer) filters.push(`Customer: ${selectedCustomer}`);
    if (outstandingSearch) filters.push(`Outstanding: ${outstandingSearch}`);
    if (selectedPaymentMode) filters.push(`Payment Mode: ${selectedPaymentMode}`);
    if (startDate) filters.push(`From: ${startDate}`);
    if (endDate) filters.push(`To: ${endDate}`);
    if (selectedMonth) {
      const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
      filters.push(`Month: ${monthNames[parseInt(selectedMonth)-1]}`);
    }
    if (selectedYear) filters.push(`Year: ${selectedYear}`);
    if (filters.length > 0) header += ` - ${filters.join(", ")}`;
    return header;
  };

  return (
    <div className="outstanding-fullscreen-bg">
      <div className='invoice-body'>
        <div className="filter-section">
          <select value={selectedExe} onChange={e => handleFilterChange('exe', e.target.value, setSelectedExe)}>
            <option value="">All Executives</option>
            <option value="Mr.Ahamed">Mr.Ahamed</option>
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

          <input type="text" value={selectedCustomer} onChange={e => handleFilterChange('customer', e.target.value, setSelectedCustomer)} placeholder="Search by customer name" />

          <select value={outstandingSearch} onChange={e => handleFilterChange('outstanding', e.target.value, setOutstandingSearch)}>
            <option value="">Select Outstanding Status</option>
            <option value="Paid">Paid</option>
            <option value="Not Paid">Not Paid</option>
          </select>

          <select value={selectedPaymentMode} onChange={e => handleFilterChange('paymentMode', e.target.value, setSelectedPaymentMode)}>
            <option value="">All Payment Modes</option>
            <option value="Cash">Cash</option>
            <option value="Cheque">Cheque</option>
          </select>

          <select value={selectedMonth} onChange={e => handleFilterChange('month', e.target.value, setSelectedMonth)}>
            <option value="">All Months</option>
            {Array.from({length: 12}, (_, i) => (
              <option key={i} value={(i+1).toString().padStart(2,'0')}>
                {new Date(0,i).toLocaleString('default',{month:'long'})}
              </option>
            ))}
          </select>

          <select value={selectedYear} onChange={e => handleFilterChange('year', e.target.value, setSelectedYear)}>
            <option value="">All Years</option>
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

        <div className="all-invoice">
          <h2 className='h2-invoice'>Outstanding Details</h2>
          <h1 className='print-header'>{getPrintHeader()}</h1>

          <div className="total-outstanding-summary">
            <h1 className="outstanding-total-header">
              RS Total Outstanding Amount: 
              <span className="amount-highlight">
                Rs. {formatNumbers(calculateTotalOutstanding())}
              </span>
            </h1>
          </div>

          {/* ✅ FIXED: Total Sales Amount (only Printed invoices) */}
          <div className="total-sales-summary">
            <h1 className="sales-total-header">
              📊 Rs:Total Sales Amount: 
              <span className="amount-highlight">
                Rs. {
                  formatNumbers(
                    filteredInvoices
                      .filter(i => i.GatePassNo === "Printed")
                      .reduce((acc, i) => acc + calculateTotal(i), 0)
                  )
                }
              </span>
            </h1>
          </div>

          {/* ✅ FIXED: Total Collections Amount (only Printed invoices) */}
          {/* <div className="total-sales-summary">
            <h1 className="sales-total-header">
              Rs: Total Collections Amount: 
              <span className="amount-highlight">
                Rs. {
                  formatNumbers(
                    filteredInvoices
                      .filter(i => i.GatePassNo === "Printed")
                      .reduce((acc, i) => acc + calculateTotal(i), 0) 
                    - calculateTotalOutstanding()
                  )
                }
              </span>
            </h1>
          </div> */}

          {isLoading ? <Loader /> : (
            <table>
              <thead>
                <tr>
                  <th className='heading-outstanding'>Invoice Number</th>
                  <th className='heading-outstanding'>Customer</th>
                  <th className='heading-outstanding'>Cheque/Cash</th>
                  <th className='heading-outstanding'>Printed or Canceled</th>
                  <th className='heading-outstanding'>Invoice Date</th>
                  <th className='heading-outstanding'>Due Date</th>
                  <th className='heading-outstanding'>Tax Number</th>
                  <th className='heading-outstanding'>Exe</th>
                  <th className='heading-outstanding'>Outstanding</th>
                  <th className='heading-outstanding'>Invoice Total</th>
                  <th className='heading-outstanding'>Cheque Details</th>
                  <th className='heading-outstanding'>Action</th>
                  <th className='heading-outstanding'>Edit</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map(i => (
                  <tr key={i._id} className={i.GatePassNo === 'Canceled' ? 'canceled-row' : ''}>
                    <td>{i.invoiceNumber}</td>
                    <td>{i.customer}</td>
                    <td>{i.ModeofPayment}</td>
                    <td>{i.GatePassNo}</td>
                    <td>{i.invoiceDate}</td>
                    <td>{i.Duedate}</td>
                    <td>{i.TaxNo}</td>
                    <td>{i.exe}</td>
                    <td className={`td-invoice ${i.lastOutstanding === "Not Paid" ? 'not-paid' : i.lastOutstanding === "Paid" ? 'paid' : ''}`}>
                      {formatNumbers(i.lastOutstanding)}
                    </td>
                    <td>{formatNumbers(calculateTotal(i))}</td>
                    <td>
                      {Array.isArray(i.chequeValues) && i.chequeValues.length > 0
                        ? i.chequeValues.map((c,j) => <div key={j}>{formatNumbers(c)}</div>)
                        : "No cheque value"}
                    </td>
                    <td><Link to={`/caloutStanding/${i._id}`}><AiOutlineEye size={20} color="purple" /></Link></td>
                    <td><Link to={`/invoice/${i.invoiceNumber}`}><FontAwesomeIcon icon={faEye} className="action-icon" /></Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  );
};

export default OutStandingTable;
