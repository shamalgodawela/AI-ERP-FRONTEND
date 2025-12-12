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

  // NEW STATES FOR DATE RANGE FILTER
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

  // Fetch all invoices
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

  // Debounce Filter Logic
  const debounceFilter = useCallback(
    debounce(() => {
      let filtered = invoices;

      if (selectedExe) {
        filtered = filtered.filter(invoice => invoice.exe === selectedExe);
      }
      if (selectedCustomer) {
        filtered = filtered.filter(invoice =>
          invoice.customer.toLowerCase().includes(selectedCustomer.toLowerCase())
        );
      }
      if (exeNameSearch) {
        filtered = filtered.filter(invoice =>
          invoice.exe.toLowerCase().includes(exeNameSearch.toLowerCase())
        );
      }
      if (selectedMonth) {
        filtered = filtered.filter(invoice => {
          const date = new Date(invoice.invoiceDate);
          return String(date.getMonth() + 1).padStart(2, '0') === selectedMonth;
        });
      }
      if (selectedYear) {
        filtered = filtered.filter(invoice => {
          const date = new Date(invoice.invoiceDate);
          return String(date.getFullYear()) === selectedYear;
        });
      }
      if (outstandingSearch) {
        filtered = filtered.filter(invoice => {
          const outstandingStatus = String(invoice.lastOutstanding).toLowerCase();
          const searchTerm = outstandingSearch.toLowerCase();

          if (searchTerm === 'paid') return outstandingStatus === 'paid';

          if (searchTerm === 'not paid' || searchTerm === 'notpaid') {
            return outstandingStatus === 'not paid' ||
              (!isNaN(invoice.lastOutstanding) && invoice.lastOutstanding > 0);
          }
          return outstandingStatus.includes(searchTerm);
        });
      }

      if (selectedPaymentMode) {
        filtered = filtered.filter(
          (invoice) =>
            invoice.ModeofPayment &&
            invoice.ModeofPayment.toLowerCase() === selectedPaymentMode.toLowerCase()
        );
      }

      // ⭐ NEW DATE RANGE FILTER ⭐
      if (startDate || endDate) {
        filtered = filtered.filter((invoice) => {
          const invDate = new Date(invoice.invoiceDate);
          const start = startDate ? new Date(startDate) : null;
          const end = endDate ? new Date(endDate) : null;

          if (start && invDate < start) return false;
          if (end && invDate > end) return false;

          return true;
        });
      }

      setFilteredInvoices(filtered);
    }, 300),
    [
      invoices,
      selectedExe,
      selectedCustomer,
      selectedMonth,
      selectedYear,
      outstandingSearch,
      exeNameSearch,
      selectedPaymentMode,
      startDate,
      endDate
    ]
  );

  useEffect(() => {
    debounceFilter();
  }, [
    selectedExe,
    selectedCustomer,
    selectedMonth,
    selectedYear,
    outstandingSearch,
    exeNameSearch,
    selectedPaymentMode,
    startDate,
    endDate,
    debounceFilter
  ]);

  // Update URL + State
  const handleFilterChange = (param, value, setter) => {
    setter(value);
    const newParams = new URLSearchParams(searchParams);
    value ? newParams.set(param, value) : newParams.delete(param);
    setSearchParams(newParams, { replace: true });
  };

  const formatNumbers = (x) => {
    if (typeof x === 'number') {
      return x.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    return x;
  };

  const calculateTotal = (invoice) => {
    if (invoice && Array.isArray(invoice.products)) {
      const productTotal = invoice.products.reduce((acc, product) => {
        const productValue = (product.labelPrice *
          (1 - product.discount / 100)) * product.quantity;
        return acc + productValue;
      }, 0);

      if (invoice.Tax && typeof invoice.Tax === 'number') {
        return productTotal - (productTotal * invoice.Tax / 100);
      }
      return productTotal;
    }
    return 0;
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
      const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
      filters.push(`Month: ${monthNames[parseInt(selectedMonth) - 1]}`);
    }
    if (selectedYear) filters.push(`Year: ${selectedYear}`);

    if (filters.length > 0) header += ` - ${filters.join(", ")}`;

    return header;
  };

  const calculateTotalOutstanding = () => {
    let total = 0;
    filteredInvoices.forEach(invoice => {
      if (invoice.GatePassNo === 'Printed') {
        if (invoice.lastOutstanding === "Not Paid") {
          total += calculateTotal(invoice);
        } else if (typeof invoice.lastOutstanding === 'number' && invoice.lastOutstanding > 0) {
          total += invoice.lastOutstanding;
        }
      }
    });
    return total;
  };

  const calculateTotalSales = () => {
    let total = 0;
    filteredInvoices.forEach(invoice => {
      if (invoice.GatePassNo === 'Printed') {
        total += calculateTotal(invoice);
      }
    });
    return total;
  };

  return (
    <div className="outstanding-fullscreen-bg">
      <div className='invoice-body'>
        <div className="filter-section">

          {/* EXECUTIVE */}
          <select
            value={selectedExe}
            onChange={(e) => handleFilterChange('exe', e.target.value, setSelectedExe)}
          >
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

          {/* CUSTOMER SEARCH */}
          <input
            type="text"
            value={selectedCustomer}
            onChange={(e) => handleFilterChange('customer', e.target.value, setSelectedCustomer)}
            placeholder="Search by customer name"
          />

          {/* OUTSTANDING */}
          <select
            value={outstandingSearch}
            onChange={(e) => handleFilterChange('outstanding', e.target.value, setOutstandingSearch)}
          >
            <option value="">Select Outstanding Status</option>
            <option value="Paid">Paid</option>
            <option value="Not Paid">Not Paid</option>
          </select>

          {/* PAYMENT MODE */}
          <select
            value={selectedPaymentMode}
            onChange={(e) => handleFilterChange('paymentMode', e.target.value, setSelectedPaymentMode)}
          >
            <option value="">All Payment Modes</option>
            <option value="Cash">Cash</option>
            <option value="Cheque">Cheque</option>
          </select>

          {/* MONTH */}
          <select
            value={selectedMonth}
            onChange={(e) => handleFilterChange('month', e.target.value, setSelectedMonth)}
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

          {/* YEAR */}
          <select
            value={selectedYear}
            onChange={(e) => handleFilterChange('year', e.target.value, setSelectedYear)}
          >
            <option value="">All Years</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
          </select>

          {/* ⭐ START DATE FILTER ⭐ */}
          <input
            type="date"
            value={startDate}
            onChange={(e) => handleFilterChange("startDate", e.target.value, setStartDate)}
          />

          {/* ⭐ END DATE FILTER ⭐ */}
          <input
            type="date"
            value={endDate}
            onChange={(e) => handleFilterChange("endDate", e.target.value, setEndDate)}
          />

          {/* PRINT */}
          <button onClick={handlePrint} className="print-button" title="Print Outstanding Details">
            <FontAwesomeIcon icon={faPrint} />
            Print
          </button>
        </div>

        {/* TABLE */}
        <div className="all-invoice">
          <h2 className='h2-invoice'>Outstanding Details</h2>
          <h1 className='print-header'>{getPrintHeader()}</h1>

          <div className="total-outstanding-summary">
            <h1 className="outstanding-total-header">
              RS Total Outstanding Amount:
              <span className="amount-highlight">Rs. {formatNumbers(calculateTotalOutstanding())}</span>
            </h1>
          </div>

          <div className="total-sales-summary">
            <h1 className="sales-total-header">
              📊 Total Sales Amount:
              <span className="amount-highlight">
                Rs. {formatNumbers(calculateTotalSales())}
              </span>
            </h1>
          </div>

          {isLoading ? <Loader /> : (
            <table>
              <thead>
                <tr>
                  <th className='th-invoice'>Invoice Number</th>
                  <th className='th-invoice'>Customer</th>
                  <th className='th-invoice'>Cheque/Cash</th>
                  <th className='th-invoice'>Printed or Canceled</th>
                  <th className='th-invoice'>Invoice Date</th>
                  <th className='th-invoice'>Due Date</th>
                  <th className='th-invoice'>Tax Number</th>
                  <th className='th-invoice'>Exe</th>
                  <th className='th-invoice'>Outstanding</th>
                  <th className='th-invoice'>Invoice Total</th>
                  <th className='th-invoice'>Cheque Details</th>
                  <th className='th-invoice'>Action</th>
                  <th className='th-invoice'>Edit</th>
                </tr>
              </thead>

              <tbody>
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice._id} className={invoice.GatePassNo === 'Canceled' ? 'canceled-row' : ''}>
                    <td className='td-invoice'>{invoice.invoiceNumber}</td>
                    <td className='td-invoice'>{invoice.customer}</td>
                    <td className='td-invoice'>{invoice.ModeofPayment}</td>
                    <td className='td-invoice'>{invoice.GatePassNo}</td>
                    <td className='td-invoice'>{invoice.invoiceDate}</td>
                    <td className='td-invoice'>{invoice.Duedate}</td>
                    <td className='td-invoice'>{invoice.TaxNo}</td>
                    <td className='td-invoice'>{invoice.exe}</td>

                    <td className={`td-invoice ${
                      invoice.lastOutstanding === "Not Paid" ? 'not-paid' :
                      invoice.lastOutstanding === "Paid" ? 'paid' : ''}`}>
                      {formatNumbers(invoice.lastOutstanding)}
                    </td>

                    <td className='td-invoice'>{formatNumbers(calculateTotal(invoice))}</td>

                    <td className='td-invoice'>
                      {Array.isArray(invoice.chequeValues) && invoice.chequeValues.length > 0 ? (
                        invoice.chequeValues.map((cheque, index) => (
                          <div key={index}>{formatNumbers(cheque)}</div>
                        ))
                      ) : (
                        "No cheque value"
                      )}
                    </td>

                    <td className='td-invoice'>
                      <Link to={`/caloutStanding/${invoice._id}`}>
                        <AiOutlineEye size={20} color={"purple"} />
                      </Link>
                    </td>

                    <td className='td-invoice'>
                      <Link to={`/invoice/${invoice.invoiceNumber}`}>
                        <FontAwesomeIcon icon={faEye} className="action-icon" />
                      </Link>
                    </td>
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
