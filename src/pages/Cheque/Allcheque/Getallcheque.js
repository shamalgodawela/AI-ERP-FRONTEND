import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AllCheques.css'; 

const Getallcheque = () => {
  const [cheques, setCheques] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCheques = async () => {
      try {
        const response = await axios.get('https://nihon-inventory.onrender.com/api/getall-cheque'); 
        setCheques(response.data.cheques);
      } catch (error) {
        console.error('Error fetching cheques:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCheques();
  }, []);

  if (loading) return <div className="loader">Loading...</div>;

  return (
    <div className="cheques-container">
      <h2>All Cheque Details</h2>
      <table className="cheques-table">
        <thead>
          <tr>
            <th>Invoice No</th>
            <th>Cheque No</th>
            <th>Value</th>
            <th>Deposit Date</th>
            <th>Bank</th>
            <th>Branch</th>
          </tr>
        </thead>
        <tbody>
          {cheques.map((cheque, index) => (
            <tr key={index}>
              <td>{cheque.invoiceNumber}</td>
              <td>{cheque.ChequeNumber}</td>
              <td>{cheque.ChequeValue}</td>
              <td>{cheque.DepositeDate ? cheque.DepositeDate.substring(0, 10) : 'N/A'}</td>
              <td>{cheque.Bankdetails}</td>
              <td>{cheque.BankBranch}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Getallcheque;
