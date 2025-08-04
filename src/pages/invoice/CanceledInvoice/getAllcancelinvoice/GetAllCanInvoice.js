import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavBar from '../../../../compenents/sidebar/NavBar';
import './Caancelinvoice.css'
import { AiOutlineEye } from 'react-icons/ai';
import { Link } from 'react-router-dom';

const GetAllCanInvoice = () => {
  const [cancelInvoices, setCancelInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCancelInvoices = async () => {
      try {
        const response = await axios.get('https://nihon-inventory.onrender.com/api/getallCancelInvoice');
        setCancelInvoices(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch cancel invoices:', error.message);
        setIsLoading(false);
      }
    };

    fetchCancelInvoices();
  }, []);

  return (
    <div>
        <NavBar/>
      <h2 className='h2-cancel-invoice'>Cancelled Invoices</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>INVOICE NUMBER</th>
              <th>CUSTOMER</th>
              <th>CUSTOMER CODE</th>
              <th>CUSTOMER ADDRESS</th>
              <th>INVOICE DATE</th>
              <th>EXE</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {cancelInvoices.map((invoice) => (
              <tr key={invoice._id}>
                <td>{invoice.invoiceNumber}</td>
                <td>{invoice.customer}</td>
                <td>{invoice.code}</td>
                <td>{invoice.address}</td>
                <td>{invoice.invoiceDate}</td>
                <td>{invoice.exe}</td>
                <td>
                <Link to={`/gesinglecancelInvoice/${invoice.invoiceNumber}`}>
                  <AiOutlineEye size={20} color={"purple"} />
                </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default GetAllCanInvoice;
