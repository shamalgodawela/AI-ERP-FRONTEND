import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UserNavbar from '../../../compenents/sidebar/UserNavbar/UserNavbar';
import Footer from '../../../compenents/footer/Footer';


const UserAllcheque = () => {
  const [cheques, setCheques] = useState([]);
  const [filteredCheques, setFilteredCheques] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search filters
  const [invoiceSearch, setInvoiceSearch] = useState('');
  const [chequeNumberSearch, setChequeNumberSearch] = useState('');
  const [dateSearch, setDateSearch] = useState('');

  useEffect(() => {
    const fetchCheques = async () => {
      try {
        const response = await axios.get('https://nihon-inventory.onrender.com/api/getall-cheque');
        setCheques(response.data.cheques);
        setFilteredCheques(response.data.cheques); 
      } catch (error) {
        console.error('Error fetching cheques:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCheques();
  }, []);

  useEffect(() => {
    const filtered = cheques.filter((cheque) => {
      const invoiceMatch = cheque.invoiceNumber.toLowerCase().includes(invoiceSearch.toLowerCase());
      const chequeNumberMatch = cheque.ChequeNumber.toLowerCase().includes(chequeNumberSearch.toLowerCase());
      const dateMatch = cheque.DepositeDate
        ? cheque.DepositeDate.substring(0, 10).includes(dateSearch)
        : false;

      return invoiceMatch && chequeNumberMatch && dateMatch;
    });

    setFilteredCheques(filtered);
  }, [invoiceSearch, chequeNumberSearch, dateSearch, cheques]);

  if (loading) return <div className="loader">Loading...</div>;

  return (
    <div>
        <UserNavbar/>
    <div className="cheques-container">
      <h2>All Cheque Details</h2>

      {/* Search Inputs */}
      <div className="search-filters">
        <input
          type="text"
          placeholder="Search by Invoice Number"
          value={invoiceSearch}
          onChange={(e) => setInvoiceSearch(e.target.value)}
        />
        <input
          type="text"
          placeholder="Search by Cheque Number"
          value={chequeNumberSearch}
          onChange={(e) => setChequeNumberSearch(e.target.value)}
        />
        <input
          type="date"
          placeholder="Search by Date"
          value={dateSearch}
          onChange={(e) => setDateSearch(e.target.value)}
        />
      </div>

      <table className="cheques-table">
        <thead>
          <tr>
            <th>Invoice No</th>
            <th>Cheque No</th>
            <th>Value</th>
            <th>Deposit Date</th>
            <th>Bank</th>
            <th>Branch</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredCheques.length > 0 ? (
            filteredCheques.map((cheque, index) => (
              <tr key={index}>
                <td>{cheque.invoiceNumber}</td>
                <td>{cheque.ChequeNumber}</td>
                <td>{cheque.ChequeValue}</td>
                <td>{cheque.DepositeDate ? cheque.DepositeDate.substring(0, 10) : 'N/A'}</td>
                <td>{cheque.Bankdetails}</td>
                <td>{cheque.BankBranch}</td>
                <td>{cheque.status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No cheques found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
    <Footer/>
    </div>

  );
};

export default UserAllcheque;
