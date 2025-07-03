import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit } from '@fortawesome/free-solid-svg-icons';
import './getcustomer.css';
import { Link } from 'react-router-dom';
import { SpinnerImg } from '../../../compenents/loader/Loader';
import Navbar3 from '../../../compenents/sidebar/Navbar3';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('http://localhost:5000/api/customers');
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

  // Filter customers based on search query
  const filteredCustomers = customers.filter(customer =>
    customer.code && customer.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className='customer-page'>
      <Navbar3 />
      <section className="customer-list-section">
        <h2 className='customer-page-title'>Customer Database</h2>

        <input
          type="text"
          placeholder="Search by code"
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
                {/* <th className="customer-table-th">Contact</th> */}
                <th className="customer-table-th">Address</th>
                <th className="customer-table-th">District</th>
                <th className="customer-table-th">City</th>
                <th className="customer-table-th">Phone</th>
                {/* <th className="customer-table-th">Fax</th>
                <th className="customer-table-th">Action</th> */}
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer, index) => (
                <tr key={customer._id}>
                  <td className="customer-table-td">{index + 1}</td>
                  <td className="customer-table-td">{customer.name}</td>
                  <td className="customer-table-td">{customer.code}</td>
                  <td className="customer-table-td">{customer.companyName}</td>
                  {/* <td className="customer-table-td">{customer.contact}</td> */}
                  <td className="customer-table-td">{customer.address}</td>
                  <td className="customer-table-td">{customer.district}</td>
                  <td className="customer-table-td">{customer.city}</td>
                  <td className="customer-table-td">{customer.phone}</td>
                  {/* <td className="customer-table-td">{customer.fax}</td>
                  <td>
                    <Link to={`/customer/${customer.code}`}><FontAwesomeIcon icon={faEye} className="customer-action-icon" /></Link>
                    <Link to={`/customer/update/${customer._id}`}><FontAwesomeIcon icon={faEdit} className="customer-action-icon" /></Link>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <ToastContainer />
      </section>
    </div>
  );
}

export default CustomerList;
