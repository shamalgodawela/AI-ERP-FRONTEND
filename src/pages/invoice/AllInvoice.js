import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import './allInvoice.css';
import { AiOutlineEye } from 'react-icons/ai';
import Footer from '../../compenents/footer/Footer';
import Loader from '../../compenents/loader/Loader';
import Navbar2 from '../../compenents/sidebar/Navbar2';

const AllInvoice = () => {
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [exe, setExe] = useState('');
  const [productCode, setProductCode] = useState(''); 
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
        const response = await axios.get(`http://localhost:5000/api/search-by-productcode/${productCode}`);
        const invoicesWithQuantity = response.data.map(invoice => {
          const product = invoice.products.find(p => p.productCode === productCode);
          return {
            ...invoice,
            productQuantity: product ? product.quantity : 0,
          };
        });
        setInvoices(invoicesWithQuantity);
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
    return total.toFixed(2); 
  };

  return (
    <body className='invoice-body'>
      <div>
        <Navbar2 /><br /><br />
        <div className="search-container" style={{ display: 'flex', marginBottom: '20px' }}>
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
            <option value="Mr.Riyas">Mr.Riyas</option>
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

        <button type="button" className="btn btn-outline-primary" disabled><a href="/add-invoice">Add Invoice</a></button>
        <div className="all-invoice">
          {isLoading ? <Loader /> : (
            <>
              <h2 className='h2-invoice'>All Invoices</h2>
              <table>
                <thead>
                  <tr>
                    <th className='th-invoice'>Invoice Number</th>
                    <th className='th-invoice'>Printed or Canceled</th>
                    <th className='th-invoice'>Customer</th>
                    <th className='th-invoice'>Customer Code</th>
                    <th className='th-invoice'>Invoice Date</th>
                    <th className='th-invoice'>Due Date</th>
                    <th className='th-invoice'>Exe</th>
                    <th className='th-invoice'>CH/C</th>
                    <th className='th-invoice'>Invoice Total</th>
                    <th className='th-invoice'>Quantity</th>
                    <th className='th-invoice'>View</th>
                    <th className='th-invoice'>Vat-Print</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr key={invoice._id}>
                      <td className='td-invoice'>{invoice.invoiceNumber}</td>
                      <td className='td-invoice'>{invoice.GatePassNo}</td>
                      <td className='td-invoice'>{invoice.customer}</td>
                      <td className='td-invoice'>{invoice.code}</td>
                      <td className='td-invoice'>{invoice.invoiceDate}</td>
                      <td className='td-invoice'>{invoice.Duedate}</td>
                      <td className='td-invoice'>{invoice.exe}</td>
                      <td className='td-invoice'>{invoice.ModeofPayment}</td>
                      <td className='td-invoice'>{formatNumbers(calculateTotal(invoice))}</td>
                      <td className='td-invoice'>
  {productCode ? invoice.productQuantity || '-' : '-'}
</td>


                      <td className='td-invoice'>
                        <Link to={`/invoice-temp/${invoice._id}`}>
                          <AiOutlineEye size={20} color={'purple'} />
                        </Link>
                      </td>
                      <td className='td-invoice'>
                        <Link to={`/tax-invoice/${invoice._id}`}>
                          <AiOutlineEye size={20} color={'purple'} />
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

export default AllInvoice;
