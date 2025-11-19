import React, { useState } from 'react';
import axios from 'axios';
import './ProductQuantity.css';
import Loader from '../../../compenents/loader/Loader';
import UserNavbar from '../../../compenents/sidebar/UserNavbar/UserNavbar';
import Footer from '../../../compenents/footer/Footer';
import { FaPrint } from 'react-icons/fa';

const ProductQuantity = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [exe, setExe] = useState('');
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const fetchProductQuantities = async () => {
    if ((startDate && !endDate) || (!startDate && endDate)) {
      setError('Please provide both start date and end date');
      return;
    }

    setIsLoading(true);
    setError('');
    setHasSearched(true);

    try {
      const params = {};
      if (startDate && endDate) {
        params.startDate = startDate;
        params.endDate = endDate;
      }
      if (exe) params.exe = exe;

      const response = await axios.get(
        'https://nihon-inventory.onrender.com/api/get-product-quantity-by-code',
        { params }
      );

      if (response.data && response.data.length > 0) {
        setProducts(response.data);
      } else {
        setProducts([]);
        setError('No products found for the selected criteria');
      }
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 404) {
        setError(err.response.data.message || 'No products found');
      } else if (err.response && err.response.status === 400) {
        setError(err.response.data.error || 'Invalid date format. Use YYYY-MM-DD');
      } else {
        setError('Failed to fetch product quantities. Please try again.');
      }
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setStartDate('');
    setEndDate('');
    setExe('');
    setProducts([]);
    setError('');
    setHasSearched(false);
  };

  const formatNumbers = (x) => {
    if (x === null || x === undefined) return '0';
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const calculateTotalQuantity = () => {
    return products.reduce((sum, product) => sum + (product.totalQuantity || 0), 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const handlePrint = () => {
    window.print();
  };

  const getPrintHeader = () => {
    const filters = [];
    if (startDate && endDate) filters.push(`Period: ${formatDate(startDate)} to ${formatDate(endDate)}`);
    if (exe) filters.push(`Executive: ${exe}`);
    else filters.push('Executive: All Executives');
    return filters.join(' | ');
  };

  return (
    <div className="product-quantity-container">
      
      <UserNavbar/>

      {/* Search & Filter */}
      <div className="search-container no-print">
        <h2 className="h2-invoice">Product Quantity by Code</h2>

        <div className="filter-section">
          <div className="filter-group">
            <label htmlFor="startDate">Start Date:</label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="date-input"
            />
          </div>

          <div className="filter-group">
            <label htmlFor="endDate">End Date:</label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="date-input"
            />
          </div>

          <div className="filter-group">
            <label htmlFor="exe">Executive:</label>
            <select
              id="exe"
              value={exe}
              onChange={(e) => setExe(e.target.value)}
              className="select-input"
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
                      </div>

          <div className="button-group">
            <button
              onClick={fetchProductQuantities}
              className="search-button"
              disabled={isLoading}
            >
              {isLoading ? 'Searching...' : 'Search'}
            </button>
            <button
              onClick={handleReset}
              className="reset-button"
              disabled={isLoading}
            >
              Reset
            </button>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}
      </div>

      {/* Results */}
      <div className="results-container">
        {isLoading ? (
          <Loader />
        ) : hasSearched && products.length > 0 ? (
          <>
            {/* Summary + Print Button */}
            <div className="print-header-section no-print">
              <p className="summary-text">
                Total Products: <strong>{products.length}</strong> | 
                Total Quantity: <strong>{formatNumbers(calculateTotalQuantity().toFixed(2))}</strong>
              </p>
              <button className="print-button" onClick={handlePrint}>
                <FaPrint /> Print
              </button>
            </div>

            {/* Print Content */}
            <div className="print-only">
              <div className="print-header">
                <h1 className="print-company-name">Nihon ERP</h1>
                <p className="print-system-generated">System Generated Report</p>
                <h2 className="print-title">Product Quantity by Code</h2>
                <p className="print-info">{getPrintHeader()}</p>
                <p className="print-summary">
                  Total Products: <strong>{products.length}</strong> | 
                  Total Quantity: <strong>{formatNumbers(calculateTotalQuantity().toFixed(2))}</strong>
                </p>
              </div>

              <div style={{ width: '100%', overflow: 'visible' }}>
                <table className="product-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th className="th-invoice">Product Code</th>
                      <th className="th-invoice">Product Name</th>
                      <th className="th-invoice">Total Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product, index) => (
                      <tr key={product.productCode || index}>
                        <td className="td-invoice">{product.productCode}</td>
                        <td className="td-invoice">{product.productName || '-'}</td>
                        <td className="td-invoice">{formatNumbers(product.totalQuantity?.toFixed(2) || '0')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : hasSearched && products.length === 0 && !error ? (
          <div className="no-results">
            <p>No products found for the selected criteria.</p>
          </div>
        ) : null}
      </div>

      <Footer className="no-print" />
    </div>
  );
};

export default ProductQuantity;
