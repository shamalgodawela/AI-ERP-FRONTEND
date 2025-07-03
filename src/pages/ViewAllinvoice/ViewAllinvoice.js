import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import './viewallin.css';
import { AiOutlineEye } from 'react-icons/ai';
import Footer from '../../compenents/footer/Footer';
import Loader from '../../compenents/loader/Loader';
import Navbar2 from '../../compenents/sidebar/Navbar2';

const ViewAllinvoice = () => {
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [exe, setExe] = useState('');
  const [productCode, setProductCode] = useState(''); // New state for product code
  const { id } = useParams();
  const [sinvoice, setsinvoice] = useState(null);

  const fetchInvoices = async () => {
    setIsLoading(true);
    try {
              const response = await axios.get(`http://localhost:5000/api/get-all-invoices`);
      const sortedInvoices = response.data.sort((a, b) => new Date(b.invoiceDate) - new Date(a.invoiceDate));
      setInvoices(sortedInvoices);
    } catch (error) {
      console.error('Failed to fetch invoices', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const searchInvoices = async () => {
    setIsLoading(true);
    try {
      if (productCode) {
        // If product code is provided, use the product code search endpoint
        const response = await axios.get(`http://localhost:5000/api/search-by-productcode/${productCode}`);
        setInvoices(response.data);
      } else {
        const formattedStartDate = startDate ? new Date(startDate).toISOString().split('T')[0] : '';
        const formattedEndDate = endDate ? new Date(endDate).toISOString().split('T')[0] : '';

        const response = await axios.get(`http://localhost:5000/api/search-invoices`, {
          params: {
            searchQuery,
            startDate: formattedStartDate,
            endDate: formattedEndDate,
            exe
          }
        });
        setInvoices(response.data);
      }
    } catch (error) {
      console.error('Failed to search invoices', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchSinvoice = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/get-invoice/${id}`);
        setsinvoice(response.data);
      } catch (error) {
        console.log('Error fetching data', error);
      }
    };
    fetchInvoices();
    fetchSinvoice();
  }, []);

  const formatNumbers = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const calculateTotal = (invoice) => {
    let total = 0;
    if (invoice && invoice.products) {
      total = invoice.products.reduce((acc, product) => {
        const productTotal = product.labelPrice * (1 - product.discount / 100) * product.quantity;
        return acc + productTotal;
      }, 0);
    }
    return total.toFixed(2); // Return the total with 2 decimal places
  };

  return (
    <body className='invoice-body'>
  <div>
    <Navbar2 /><br /><br />
    <div className="invoice-page-search-container" style={{ display: 'flex', marginBottom: '20px' }}>
      <input
        type="text"
        placeholder="Search by Invoice Number or Customer"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ marginRight: '10px', padding: '5px' }}
      />
      <select
        value={exe}
        onChange={(e) => setExe(e.target.value)}
        style={{ marginRight: '10px', padding: '5px' }}
      >
        <option value="">Select Exe</option>
        <option value="Mr.Ahamed">Mr.Ahamed</option>
        <option value="Mr.Dasun">Mr.Dasun</option>
        <option value="Mr.Chameera">Mr.Chameera</option>
        <option value="Mr.Sanjeewa">Mr.Sanjeewa</option>
        <option value="Mr.Nayum">Mr.Nayum</option>
        <option value="Mr.Navaneedan">Mr.Navaneedan</option>
        <option value="SOUTH">SOUTH-1</option>
      </select>

      <input
        type="text"
        placeholder="Search by Product Code"
        value={productCode}
        onChange={(e) => setProductCode(e.target.value)}
        style={{ marginRight: '10px', padding: '5px' }}
      />

      <button
        onClick={searchInvoices}
        style={{
          padding: '5px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        Search
      </button>
    </div>

    <button type="button" className="invoice-page-btn" disabled>
      <a href="/add-invoice">Add Invoice</a>
    </button>

    <div className="invoice-page-all-invoice">
      {isLoading ? <Loader /> : (
        <>
          <h2 className='invoice-page-h2-invoice'>All Invoices</h2>
          <table className="invoice-page-table">
            <thead>
              <tr>
                <th className='invoice-page-th-invoice'>Invoice Number</th>
                <th className='invoice-page-th-invoice'>Printed or Canceled</th>
                <th className='invoice-page-th-invoice'>Customer</th>
                <th className='invoice-page-th-invoice'>Customer Code</th>
                <th className='invoice-page-th-invoice'>Invoice Date</th>
                <th className='invoice-page-th-invoice'>Due date</th>
                <th className='invoice-page-th-invoice'>Exe</th>
                <th className='invoice-page-th-invoice'>CH/C</th>
                <th className='invoice-page-th-invoice'>Invoice Total</th>
                <th className='invoice-page-th-invoice'>Action</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice._id}>
                  <td className='invoice-page-td-invoice'>{invoice.invoiceNumber}</td>
                  <td className='invoice-page-td-invoice'>{invoice.GatePassNo}</td>
                  <td className='invoice-page-td-invoice'>{invoice.customer}</td>
                  <td className='invoice-page-td-invoice'>{invoice.code}</td>
                  <td className='invoice-page-td-invoice'>{invoice.invoiceDate}</td>
                  <td className='invoice-page-td-invoice'>{invoice.Duedate}</td>
                  <td className='invoice-page-td-invoice'>{invoice.exe}</td>
                  <td className='invoice-page-td-invoice'>{invoice.ModeofPayment}</td>
                  <td className='invoice-page-td-invoice'>{formatNumbers(calculateTotal(invoice))}</td>
                  <td className='invoice-page-td-invoice'>
                    <Link to={`/view-single-invoice/${invoice._id}`}>
                      <AiOutlineEye size={20} color={"purple"} />
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
</body>
  );
};

export default ViewAllinvoice;
