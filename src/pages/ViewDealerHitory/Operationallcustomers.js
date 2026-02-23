import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SpinnerImg } from '../../compenents/loader/Loader';
import { useNavigate } from 'react-router-dom';

const Operationallcustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('https://nihon-inventory.onrender.com/api/customers');
        setCustomers(response.data);
      } catch (error) {
        console.error('Error fetching customers:', error);
        toast.error('Failed to fetch customers');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(customer => {
    const nameMatch = customer.companyName && customer.companyName.toLowerCase().includes(searchQuery.toLowerCase());
    const codeMatch = customer.code && customer.code.toLowerCase().includes(searchQuery.toLowerCase());
    return nameMatch || codeMatch;
  });

  const handlepassdelaercode = (code) => {
    navigate('/opdealerhistory', { state: { code } });
  };

  return (
    <div className='allcustomer-bg'>
      <div className='customer-page'>
        <section className="customer-list-section">
          <h2 className='customer-page-title'>Customer Database</h2>

          <input
            type="text"
            placeholder="Search by name or code"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="customer-search-input"
          />

          {isLoading ? (
            <SpinnerImg />
          ) : (
            <table className="customer-list-table">
              <thead>
                <tr>
                  <th className="customer-table-th">Index</th>
                  <th className="customer-table-th">Name</th>
                  <th className="customer-table-th">Code</th>
                  <th className="customer-table-th">Company Name</th>
                  <th className="customer-table-th">Address</th>
                  <th className="customer-table-th">District</th>
                  <th className="customer-table-th">City</th>
                  <th className="customer-table-th">Phone</th>
                  <th className="customer-table-th">View History</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer, index) => (
                  <tr key={customer._id}>
                    <td className="customer-table-td">{index + 1}</td>
                    <td className="customer-table-td">{customer.name}</td>
                    <td className="customer-table-td">{customer.code}</td>
                    <td className="customer-table-td">{customer.companyName}</td>
                    <td className="customer-table-td">{customer.address}</td>
                    <td className="customer-table-td">{customer.district}</td>
                    <td className="customer-table-td">{customer.city}</td>
                    <td className="customer-table-td">{customer.phone}</td>
                    <td className="customer-table-td">
                    <button
                      type="button"
                      className='btn-dealer-history'
                      onClick={() => handlepassdelaercode(customer.code)}
                    >
                      View Overall Dealer History
                    </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <ToastContainer />
        </section>
        <button className="home-btn" onClick={() => navigate('/Admin-operations-dashboard')}>Home</button>
      </div>
    </div>
  );
}

export default Operationallcustomers;
