import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Account.css';

const TYPE_META = {
  Asset:     { color: '#0ea5e9', bg: '#f0f9ff', icon: '◈' },
  Liability: { color: '#f59e0b', bg: '#fffbeb', icon: '◉' },
  Equity:    { color: '#8b5cf6', bg: '#f5f3ff', icon: '◆' },
  Revenue:   { color: '#10b981', bg: '#ecfdf5', icon: '◎' },
  Expense:   { color: '#ef4444', bg: '#fef2f2', icon: '◇' },
};

const AccountPage = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [formData, setFormData] = useState({
    accountId: '', name: '', type: 'Asset', balance: 0,
  });
  const navigate = useNavigate();

  const API_URL = 'https://nihon-inventory.onrender.com/api/account';

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setAccounts(res.data.accounts || []);
    } catch {
      showToast('Error fetching accounts', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAccounts(); }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.accountId || !formData.name) {
      showToast('Please fill all required fields', 'error');
      return;
    }
    setSubmitting(true);
    try {
      await axios.post(API_URL, formData);
      showToast('Account added successfully');
      setFormData({ accountId: '', name: '', type: 'Asset', balance: 0 });
      fetchAccounts();
    } catch {
      showToast('Error adding account', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = accounts.filter(a => {
    const matchType = filterType === 'All' || a.type === filterType;
    const matchSearch = a.name?.toLowerCase().includes(search.toLowerCase()) ||
      String(a.accountId).includes(search);
    return matchType && matchSearch;
  });

  const totals = accounts.reduce((acc, a) => {
    acc[a.type] = (acc[a.type] || 0) + Number(a.balance);
    return acc;
  }, {});

  return (
    <div className="coa-root">
      {/* Toast */}
      {toast && (
        <div className={`coa-toast coa-toast--${toast.type}`}>
          <span>{toast.type === 'success' ? '✓' : '✕'}</span>
          {toast.msg}
        </div>
      )}

      {/* Sidebar */}
      <aside className="coa-sidebar">
        <div className="coa-sidebar__brand">
          <div className="coa-sidebar__logo">N</div>
          <span>Nihon ERP</span>
        </div>
        <nav className="coa-sidebar__nav">
          <a className="coa-sidebar__link coa-sidebar__link--active" href="#">
            <span>▤</span> Chart of Accounts
          </a>
          <a className="coa-sidebar__link" href="#" onClick={() => navigate('/admin-profile')}>
            <span>⌂</span> Dashboard
          </a>
        </nav>
        <div className="coa-sidebar__summary">
          <p className="coa-sidebar__summary-title">Balance Overview</p>
          {Object.entries(TYPE_META).map(([type, meta]) => (
            <div key={type} className="coa-sidebar__summary-row">
              <span style={{ color: meta.color }}>{meta.icon} {type}</span>
              <strong style={{ color: meta.color }}>
                {(totals[type] || 0).toLocaleString()}
              </strong>
            </div>
          ))}
        </div>
      </aside>

      {/* Main */}
      <main className="coa-main">
        {/* Header */}
        <header className="coa-header">
          <div>
            <p className="coa-header__eyebrow">Accounting Module</p>
            <h1 className="coa-header__title">Chart of Accounts</h1>
          </div>
          <div className="coa-header__meta">
            <span className="coa-badge">{accounts.length} Accounts</span>
          </div>
        </header>

        {/* Add Account Form */}
        <section className="coa-form-card">
          <div className="coa-form-card__header">
            <h2>Add New Account</h2>
            <p>Define a new ledger account for your chart of accounts</p>
          </div>
          <form onSubmit={handleSubmit} className="coa-form">
            <div className="coa-form__grid">
              <div className="coa-form__field">
                <label>Account ID <span className="coa-required">*</span></label>
                <input
                  type="number"
                  name="accountId"
                  value={formData.accountId}
                  onChange={handleChange}
                  placeholder="e.g. 1001"
                  className="coa-input"
                  required
                />
              </div>
              <div className="coa-form__field">
                <label>Account Name <span className="coa-required">*</span></label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Cash, Bank, Sales"
                  className="coa-input"
                  required
                />
              </div>
              <div className="coa-form__field">
                <label>Account Type</label>
                <select name="type" value={formData.type} onChange={handleChange} className="coa-input coa-select">
                  {Object.keys(TYPE_META).map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="coa-form__field">
                <label>Opening Balance (LKR)</label>
                <input
                  type="number"
                  name="balance"
                  value={formData.balance}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="coa-input"
                />
              </div>
            </div>
            {formData.type && (
              <div className="coa-type-preview" style={{
                background: TYPE_META[formData.type]?.bg,
                borderColor: TYPE_META[formData.type]?.color,
                color: TYPE_META[formData.type]?.color
              }}>
                {TYPE_META[formData.type]?.icon}&nbsp;
                This account will be classified as <strong>{formData.type}</strong> — 
                normal balance: {['Asset','Expense'].includes(formData.type) ? 'Debit' : 'Credit'}
              </div>
            )}
            <div className="coa-form__actions">
              <button type="submit" className="coa-btn coa-btn--primary" disabled={submitting}>
                {submitting ? <span className="coa-spinner" /> : '+ Add Account'}
              </button>
              <button type="button" className="coa-btn coa-btn--ghost"
                onClick={() => setFormData({ accountId: '', name: '', type: 'Asset', balance: 0 })}>
                Clear
              </button>
            </div>
          </form>
        </section>

        {/* Table Section */}
        <section className="coa-table-section">
          <div className="coa-table-toolbar">
            <div className="coa-search-wrap">
              <span className="coa-search-icon">⌕</span>
              <input
                type="text"
                placeholder="Search accounts..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="coa-search"
              />
            </div>
            <div className="coa-filter-tabs">
              {['All', ...Object.keys(TYPE_META)].map(t => (
                <button
                  key={t}
                  className={`coa-filter-tab ${filterType === t ? 'coa-filter-tab--active' : ''}`}
                  style={filterType === t && t !== 'All' ? {
                    background: TYPE_META[t]?.bg,
                    color: TYPE_META[t]?.color,
                    borderColor: TYPE_META[t]?.color
                  } : {}}
                  onClick={() => setFilterType(t)}
                >
                  {t !== 'All' && TYPE_META[t]?.icon + ' '}{t}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="coa-loading">
              <div className="coa-loading__spinner" />
              <p>Loading accounts…</p>
            </div>
          ) : (
            <div className="coa-table-wrap">
              <table className="coa-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Account Name</th>
                    <th>Type</th>
                    <th>Normal Balance</th>
                    <th style={{ textAlign: 'right' }}>Balance (LKR)</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="coa-empty">
                        <div>
                          <span>◻</span>
                          <p>No accounts found</p>
                        </div>
                      </td>
                    </tr>
                  ) : filtered.map((account, i) => {
                    const meta = TYPE_META[account.type] || {};
                    const isDebitNormal = ['Asset', 'Expense'].includes(account.type);
                    return (
                      <tr key={account.accountId} className="coa-row" style={{ '--i': i }}>
                        <td><span className="coa-id">{account.accountId}</span></td>
                        <td className="coa-name">{account.name}</td>
                        <td>
                          <span className="coa-type-badge"
                            style={{ background: meta.bg, color: meta.color }}>
                            {meta.icon} {account.type}
                          </span>
                        </td>
                        <td>
                          <span className={`coa-normal-badge coa-normal-badge--${isDebitNormal ? 'debit' : 'credit'}`}>
                            {isDebitNormal ? 'Dr' : 'Cr'}
                          </span>
                        </td>
                        <td className="coa-balance" style={{ textAlign: 'right' }}>
                          <span style={{ color: Number(account.balance) < 0 ? '#ef4444' : '#0f172a' }}>
                            {Number(account.balance) < 0 ? '(' : ''}
                            {Math.abs(Number(account.balance)).toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                            {Number(account.balance) < 0 ? ')' : ''}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                {filtered.length > 0 && (
                  <tfoot>
                    <tr className="coa-table-foot">
                      <td colSpan={4}>Total ({filtered.length} accounts)</td>
                      <td style={{ textAlign: 'right' }}>
                        <strong>
                          {filtered.reduce((s, a) => s + Number(a.balance), 0)
                            .toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                        </strong>
                      </td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          )}
        </section>
      </main>
      <button className="home-btn" onClick={() => navigate('/account-dash')}>Home</button>
    </div>
  );
};

export default AccountPage;