import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./Account.css"
import { useNavigate } from 'react-router-dom';
const AccountPage = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    accountId: '',
    name: '',
    type: 'Asset',
    balance: 0
  });
  const navigate = useNavigate();

  const API_URL = 'https://nihon-inventory.onrender.com/api/account'; // adjust backend URL

  // Fetch all accounts
  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setAccounts(res.data.accounts);
    } catch (error) {
      console.error(error);
      alert("Error fetching accounts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.accountId || !formData.name) {
      alert("Please fill all required fields");
      return;
    }
    try {
      await axios.post(API_URL, formData);
      alert("Account added successfully");
      setFormData({ accountId: '', name: '', type: 'Asset', balance: 0 });
      fetchAccounts();
    } catch (error) {
      console.error(error);
      alert("Error adding account");
    }
  };

  return (
    
    <div className="nihon-accounts-page">
      <h1 className="nihon-accounts-title">Chart of Accounts</h1>

      {/* Add Account Form */}
      <form onSubmit={handleSubmit} className="nihon-add-account-form">
        <h2 className="nihon-add-account-title">Add New Account</h2>
        <div className="nihon-add-account-grid">
          <div className="nihon-add-account-field">
            <label>Account ID</label>
            <input
              type="number"
              name="accountId"
              value={formData.accountId}
              onChange={handleChange}
              className="nihon-add-account-input"
              required
            />
          </div>
          <div className="nihon-add-account-field">
            <label>Account Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="nihon-add-account-input"
              required
            />
          </div>
          <div className="nihon-add-account-field">
            <label>Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="nihon-add-account-input"
            >
              <option value="Asset">Asset</option>
              <option value="Liability">Liability</option>
              <option value="Equity">Equity</option>
              <option value="Revenue">Revenue</option>
              <option value="Expense">Expense</option>
            </select>
          </div>
          <div className="nihon-add-account-field">
            <label>Starting Balance</label>
            <input
              type="number"
              name="balance"
              value={formData.balance}
              onChange={handleChange}
              className="nihon-add-account-input"
            />
          </div>
        </div>
        <button type="submit" className="nihon-add-account-btn">Add Account</button>
      </form>

      {/* Accounts Table */}
      {loading ? (
        <div className="nihon-accounts-loading">Loading accounts...</div>
      ) : (
        <div className="nihon-accounts-table-container">
          <table className="nihon-accounts-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Type</th>
                <th>Balance (LKR)</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map(account => (
                <tr key={account.accountId} className="nihon-accounts-row">
                  <td>{account.accountId}</td>
                  <td>{account.name}</td>
                  <td>{account.type}</td>
                  <td>{Number(account.balance).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
       <button
        className="home-btn no-print"
        onClick={() => navigate('/admin-profile')}
      >
        Home
      </button>
    </div>
  );
};

export default AccountPage;