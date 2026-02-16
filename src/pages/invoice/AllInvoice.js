import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import './allInvoice.css';
import { AiOutlineEye } from 'react-icons/ai';
import Footer from '../../compenents/footer/Footer';
import Loader from '../../compenents/loader/Loader';
import Navbar2 from '../../compenents/sidebar/Navbar2';
import { useAuth } from '../../services/AuthProvider';
import UserNavbar from '../../compenents/sidebar/UserNavbar/UserNavbar';

const AllInvoice = () => {
  const [allInvoices, setAllInvoices] = useState([]); // Store all invoices
  const [invoices, setInvoices] = useState([]); // Filtered invoices to display
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [exe, setExe] = useState('');
  const [productCode, setProductCode] = useState('');
  const [totalPrintedQuantity, setTotalPrintedQuantity] = useState(0); 
  const { id } = useParams();
  const [sinvoice, setsinvoice] = useState(null);
  const { user } = useAuth();

  // Debug authentication state
  useEffect(() => {
    console.log('AllInvoice - Current user state:', user);
    console.log('AllInvoice - User role:', user?.role);
  }, [user]);

  const fetchInvoices = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`https://nihon-inventory.onrender.com/api/get-all-invoices`);
      const sortedInvoices = response.data.sort((a, b) => new Date(b.invoiceDate) - new Date(a.invoiceDate));
      setAllInvoices(sortedInvoices);
      setInvoices(sortedInvoices);
      setTotalPrintedQuantity(0);
    } catch (error) {
      console.error('Failed to fetch invoices', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Frontend filtering function
  const filterInvoices = (invoicesToFilter) => {
    let filtered = [...invoicesToFilter];

    // Filter by search query (Invoice Number or Customer)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(invoice => 
        (invoice.invoiceNumber && invoice.invoiceNumber.toLowerCase().includes(query)) ||
        (invoice.customer && invoice.customer.toLowerCase().includes(query))
      );
    }

    // Filter by executive
    if (exe) {
      filtered = filtered.filter(invoice => invoice.exe === exe);
    }

    // Filter by date range
    if (startDate) {
      filtered = filtered.filter(invoice => {
        if (!invoice.invoiceDate) return false;
        const invoiceDate = new Date(invoice.invoiceDate);
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        return invoiceDate >= start;
      });
    }

    if (endDate) {
      filtered = filtered.filter(invoice => {
        if (!invoice.invoiceDate) return false;
        const invoiceDate = new Date(invoice.invoiceDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        return invoiceDate <= end;
      });
    }

    return filtered;
  };

  const searchInvoices = async () => {
    setIsLoading(true);
    try {
      if (productCode) {
        // Use API for product code search
        const response = await axios.get(`https://nihon-inventory.onrender.com/api/search-by-productcode/${productCode}`);
        const invoicesWithQuantity = response.data.map(invoice => {
          const product = invoice.products.find(p => p.productCode === productCode);
          return {
            ...invoice,
            productQuantity: product ? product.quantity : 0,
          };
        });
        
        // Apply frontend filters (date range, searchQuery, exe) to the product code results
        let filteredInvoices = filterInvoices(invoicesWithQuantity);
        setInvoices(filteredInvoices);
        
        // Calculate total quantity for invoices with GatePassNo="Printed"
        const printedInvoices = filteredInvoices.filter(invoice => invoice.GatePassNo === "Printed");
        const totalQuantity = printedInvoices.reduce((sum, invoice) => {
          return sum + (invoice.productQuantity || 0);
        }, 0);
        setTotalPrintedQuantity(totalQuantity);
      } else {
        // Use frontend filtering for all other searches
        // If no search criteria, show all invoices
        if (!searchQuery && !exe && !startDate && !endDate) {
          setInvoices(allInvoices);
          setTotalPrintedQuantity(0);
          setIsLoading(false);
          return;
        }

        // Filter invoices on frontend
        const filteredInvoices = filterInvoices(allInvoices);
        setInvoices(filteredInvoices);
        
        // Calculate total quantity for all products in invoices with GatePassNo="Printed"
        const printedInvoices = filteredInvoices.filter(invoice => invoice.GatePassNo === "Printed");
        const totalQuantity = printedInvoices.reduce((sum, invoice) => {
          if (invoice.products && invoice.products.length > 0) {
            const invoiceTotalQuantity = invoice.products.reduce((productSum, product) => {
              return productSum + (product.quantity || 0);
            }, 0);
            return sum + invoiceTotalQuantity;
          }
          return sum;
        }, 0);
        setTotalPrintedQuantity(totalQuantity);
      }
    } catch (error) {
      console.error('Failed to search invoices', error.message);
      setTotalPrintedQuantity(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchSinvoice = async () => {
      try {
        const response = await axios.get(`https://nihon-inventory.onrender.com/api/get-invoice/${id}`);
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
    <body>
       <UserNavbar/>
      <div>
        <div className="search-container" style={{ display: 'flex', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
          <input
            type="text"
            placeholder="Search by Invoice Number or Customer"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ padding: '5px', minWidth: '220px' }}
          />
          <select
            value={exe}
            onChange={(e) => setExe(e.target.value)}
            style={{ padding: '5px', minWidth: '160px' }}
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
            type="date"
            placeholder="Start Date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={{ padding: '5px', minWidth: '170px' }}
          />
          <input
            type="date"
            placeholder="End Date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={{ padding: '5px', minWidth: '170px' }}
          />

          <input
            type="text"
            placeholder="Search by Product Code"
            value={productCode}
            onChange={(e) => setProductCode(e.target.value)}
            style={{ padding: '5px', minWidth: '200px' }}
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
        <div className="all-invoice">
          {isLoading ? <Loader /> : (
            <>
              <h2 className='h2-invoice'>All Invoices</h2>
              {totalPrintedQuantity > 0 && (
                <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#e7f3ff', borderRadius: '5px', fontWeight: 'bold' }}>
                  {productCode ? (
                    <>Total Quantity (Printed): {formatNumbers(totalPrintedQuantity)}</>
                  ) : (
                    <>Total Quantity (All Products - Printed): {formatNumbers(totalPrintedQuantity)}</>
                  )}
                </div>
              )}
              <table>
                <thead>
                  <tr>
                    <th className='th-invoice'>Invoice Number</th>
                    <th className='th-invoice'>Order Number</th>
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
                      <td className='td-invoice'>{invoice.orderNumber}</td>
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
