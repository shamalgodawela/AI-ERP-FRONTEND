import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AllCheques.css';
import UserNavbar from '../../../compenents/sidebar/UserNavbar/UserNavbar';

const Getallcheque = () => {
  const [cheques, setCheques] = useState([]);
  const [filteredCheques, setFilteredCheques] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [areaSearch, setAreaSearch] = useState('');
  const [bankName, setBankName] = useState('');
  const [chequeNumberSearch, setChequeNumberSearch] = useState('');
  const [dateSearch, setDateSearch] = useState('');
  const [areas, setAreas] = useState([]);

  useEffect(() => {
    const fetchCheques = async () => {
      try {
        const response = await axios.get('https://nihon-inventory.onrender.com/api/getall-cheque');
        const allCheques = response.data.cheques;

        setCheques(allCheques);
        setFilteredCheques(allCheques);

        // Extract unique areas (first 3 digits of invoice number)
        const uniqueAreas = Array.from(
          new Set(
            allCheques
              .map(c => c.invoiceNumber?.substring(0, 3)) // take first 3 characters
              .filter(Boolean)
              .sort() // sort alphabetically
          )
        );
        setAreas(uniqueAreas);

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
      const areaMatch = areaSearch
        ? cheque.invoiceNumber?.substring(0, 3) === areaSearch
        : true;

      const bankMatch = bankName
        ? cheque.Bankdetails?.toLowerCase().includes(bankName.toLowerCase())
        : true;

      const chequeNumberMatch = chequeNumberSearch
        ? cheque.ChequeNumber?.toLowerCase().includes(chequeNumberSearch.toLowerCase())
        : true;

      const dateMatch = dateSearch
        ? cheque.DepositeDate?.substring(0, 10) === dateSearch
        : true;

      return areaMatch && bankMatch && chequeNumberMatch && dateMatch;
    });

    setFilteredCheques(filtered);
  }, [areaSearch, bankName, chequeNumberSearch, dateSearch, cheques]);

  if (loading) return <div className="loader">Loading...</div>;

  return (
    <div>
      <UserNavbar/>
    <div className="cheques-container">
      <h2>All Cheque Details</h2>

      {/* Search Filters */}
      <div className="search-filters">
      
        <select
          value={areaSearch}
          onChange={(e) => setAreaSearch(e.target.value)}
        >
          <option value="">Search by Area</option>
          {areas.map((area, idx) => (
            <option key={idx} value={area}>
              {area}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Search by Bank Name"
          value={bankName}
          onChange={(e) => setBankName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Search by Cheque Number"
          value={chequeNumberSearch}
          onChange={(e) => setChequeNumberSearch(e.target.value)}
        />
        <input
          type="date"
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
    </div>
  );
};

export default Getallcheque;
