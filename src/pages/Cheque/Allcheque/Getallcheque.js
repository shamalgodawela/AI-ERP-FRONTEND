import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AllCheques.css';

const Getallcheque = () => {
  const [cheques, setCheques] = useState([]);
  const [filteredCheques, setFilteredCheques] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [invoicePrefix, setInvoicePrefix] = useState('');
  const [bankName, setBankName] = useState('');
  const [chequeNumberSearch, setChequeNumberSearch] = useState('');
  const [dateSearch, setDateSearch] = useState('');
  const [invoicePrefixes, setInvoicePrefixes] = useState([]);

  useEffect(() => {
    const fetchCheques = async () => {
      try {
        const response = await axios.get('https://nihon-inventory.onrender.com/api/getall-cheque');
        const allCheques = response.data.cheques;

        setCheques(allCheques);
        setFilteredCheques(allCheques);

        // Extract unique prefixes before the first dash
        const prefixes = Array.from(
          new Set(
            allCheques
              .map(c => c.invoiceNumber?.split('-')[0]) // take part before "-"
              .filter(Boolean)
          )
        );
        setInvoicePrefixes(prefixes);

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
      const invoiceMatch = invoicePrefix
        ? cheque.invoiceNumber?.startsWith(invoicePrefix)
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

      return invoiceMatch && bankMatch && chequeNumberMatch && dateMatch;
    });

    setFilteredCheques(filtered);
  }, [invoicePrefix, bankName, chequeNumberSearch, dateSearch, cheques]);

  if (loading) return <div className="loader">Loading...</div>;

  return (
    <div className="cheques-container">
      <h2>All Cheque Details</h2>

      {/* Search Filters */}
      <div className="search-filters">
        {/* Invoice Prefix Dropdown */}
        <select
          value={invoicePrefix}
          onChange={(e) => setInvoicePrefix(e.target.value)}
        >
          <option value="">All Invoice Prefixes</option>
          {invoicePrefixes.map((prefix, idx) => (
            <option key={idx} value={prefix}>
              {prefix}
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
  );
};

export default Getallcheque;
