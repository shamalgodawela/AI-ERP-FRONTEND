import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit } from '@fortawesome/free-solid-svg-icons';
import './getcustomer.css';
import { Link } from 'react-router-dom';
import { SpinnerImg } from '../../../compenents/loader/Loader';
import UserNavbar from '../../../compenents/sidebar/UserNavbar/UserNavbar';
import { FaOtter } from 'react-icons/fa';
import Footer from '../../../compenents/footer/Footer';

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

  const filteredCustomers = customers.filter(customer => {
    const query = searchQuery.toLowerCase();
    return (
      (customer.code && customer.code.toLowerCase().includes(query)) ||
      (customer.name && customer.companyName.toLowerCase().includes(query))
    );
  });
  
  

  return (
    <div>
      <UserNavbar/>
    <div className='customer-page'>
     
      <section className="customer-list-section">
        <h2 className='customer-page-title'>Customer Database</h2>

        <input
  type="text"
  placeholder="Search by code or name"
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
    <Footer/>
    </div>
  );
}

export default CustomerList;
