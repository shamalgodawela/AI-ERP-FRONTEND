import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { AiOutlineEye } from 'react-icons/ai';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
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
  const [isLoading, setIsLoading] = useState(false);

  const location = useLocation();
  const { state } = location;
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize filters from URL or navigation state
  useEffect(() => {
    const customerFromState = state?.customer || searchParams.get("customer") || '';
    const exe = searchParams.get("exe") || '';
    const month = searchParams.get("month") || '';
    const year = searchParams.get("year") || '';
    const outstanding = searchParams.get("outstanding") || '';

    setSelectedCustomer(customerFromState);
    setSelectedExe(exe);
    setSelectedMonth(month);
    setSelectedYear(year);
    setOutstandingSearch(outstanding);
  }, []);

  // Fetch data
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

  // Debounced filter logic
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
          
          // Check for exact matches or partial matches
          if (searchTerm === 'paid') {
            return outstandingStatus === 'paid';
          } else if (searchTerm === 'not paid' || searchTerm === 'notpaid') {
            // Show both "Not Paid" status and numeric values (unpaid amounts)
            return outstandingStatus === 'not paid' || 
                   (!isNaN(invoice.lastOutstanding) && invoice.lastOutstanding > 0);
          } else {
            // For other searches, check if the search term is contained in the outstanding value
            return outstandingStatus.includes(searchTerm);
          }
        });
      }

      setFilteredInvoices(filtered);
    }, 300),
    [invoices, selectedExe, selectedCustomer, selectedMonth, selectedYear, outstandingSearch]
  );

  useEffect(() => {
    debounceFilter();
  }, [selectedExe, selectedCustomer, selectedMonth, selectedYear, outstandingSearch, debounceFilter]);

  // Handle filter change and update URL
  const handleFilterChange = (param, value, setter) => {
    setter(value);
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(param, value);
    } else {
      newParams.delete(param);
    }
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
        const productValue = product.labelPrice * (1 - product.discount / 100) * product.quantity;
        return acc + productValue;
      }, 0);

      if (invoice.Tax && typeof invoice.Tax === 'number') {
        return productTotal - (productTotal * invoice.Tax / 100);
      }

      return productTotal;
    }
    return 0;
  };

  return (
    <div className="outstanding-fullscreen-bg">
      <div className='invoice-body'>
        <div className="filter-section">
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
          </select>

          <input
            type="text"
            value={selectedCustomer}
            onChange={(e) => handleFilterChange('customer', e.target.value, setSelectedCustomer)}
            placeholder="Search by customer name"
          />

          <input
            type="text"
            value={outstandingSearch}
            onChange={(e) => handleFilterChange('outstanding', e.target.value, setOutstandingSearch)}
            placeholder="Search by outstanding (Paid/Not Paid)"
          />

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

          <select
            value={selectedYear}
            onChange={(e) => handleFilterChange('year', e.target.value, setSelectedYear)}
          >
            <option value="">All Years</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
          </select>
        </div>

        <div className="all-invoice">
          <h2 className='h2-invoice'>Outstanding Details</h2>
          {isLoading ? <Loader /> : (
            <table>
              <thead>
                <tr>
                  <th className='th-invoice'>Invoice Number</th>
                  <th className='th-invoice'>Customer</th>
                  <th className='th-invoice'>Customer Code</th>
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
                    <td className='td-invoice'>{invoice.code}</td>
                    <td className='td-invoice'>{invoice.GatePassNo}</td>
                    <td className='td-invoice'>{invoice.invoiceDate}</td>
                    <td className='td-invoice'>{invoice.Duedate}</td>
                    <td className='td-invoice'>{invoice.TaxNo}</td>
                    <td className='td-invoice'>{invoice.exe}</td>
                    <td className={`td-invoice ${invoice.lastOutstanding === "Not Paid" ? 'not-paid' : invoice.lastOutstanding === "Paid" ? 'paid' : ''}`}>
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
