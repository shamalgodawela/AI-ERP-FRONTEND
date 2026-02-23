import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './viewallin.css';
import { AiOutlineEye } from 'react-icons/ai';
import Footer from '../../compenents/footer/Footer';
import Loader from '../../compenents/loader/Loader';
import UserNavbar from '../../compenents/sidebar/UserNavbar/UserNavbar';

const ViewAllinvoice = () => {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');

  const fetchInvoices = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`https://nihon-inventory.onrender.com/api/get-all-invoices`);
      const sortedInvoices = response.data.sort((a, b) => new Date(b.invoiceDate) - new Date(a.invoiceDate));
      setInvoices(sortedInvoices);
      setFilteredInvoices(sortedInvoices);
    } catch (error) {
      console.error('Failed to fetch invoices', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    let filtered = invoices;

    if (selectedYear) {
      filtered = filtered.filter(
        (inv) => new Date(inv.invoiceDate).getFullYear().toString() === selectedYear
      );
    }

    if (selectedMonth) {
      filtered = filtered.filter((inv) => {
        const month = (new Date(inv.invoiceDate).getMonth() + 1).toString().padStart(2, '0');
        return month === selectedMonth;
      });
    }

    setFilteredInvoices(filtered);
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const formatNumbers = (x) => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const calculateTotal = (invoice) => {
    let total = 0;
    if (invoice && invoice.products) {
      total = invoice.products.reduce((acc, product) => {
        const productTotal =
          product.labelPrice * (1 - product.discount / 100) * product.quantity;
        return acc + productTotal;
      }, 0);
    }
    return total.toFixed(2);
  };

  return (
    <div>
      <UserNavbar />
      <div className="invoice-body">
        <div className="invoice-page-search-container">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="invoice-select"
          >
            <option value="">Select Year</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
          </select>

          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="invoice-select"
          >
            <option value="">Select Month</option>
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

          <button onClick={handleSearch} className="invoice-search-btn">
            Search
          </button>
        </div>

        <div className="invoice-page-all-invoice">
          {isLoading ? (
            <Loader />
          ) : (
            <>
              <h2 className="invoice-page-h2-invoice">All Invoices</h2>
              <table className="invoice-page-table">
                <thead>
                  <tr>
                    <th>Invoice Number</th>
                    <th>Customer</th>
                    <th>Invoice Date</th>
                    <th>Exe</th>
                    <th>Invoice Total</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.map((invoice) => (
                    <tr key={invoice._id}>
                      <td>{invoice.invoiceNumber}</td>
                      <td>{invoice.customer}</td>
                      <td>{invoice.invoiceDate}</td>
                      <td>{invoice.exe}</td>
                      <td>{formatNumbers(calculateTotal(invoice))}</td>
                      <td>
                        <Link to={`/view-single-invoice/${invoice._id}`}>
                          <AiOutlineEye size={20} color="purple" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default ViewAllinvoice;
