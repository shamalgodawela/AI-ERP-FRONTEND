import React from 'react';
import { useAuth } from '../../../services/AuthProvider';
import { useNavigate } from 'react-router-dom';
import {
  FaMoneyCheckAlt,
  FaClipboardCheck,
  FaClock,
  FaUserTie,
  FaChartLine,
  FaBoxes,
  FaUniversity,
  FaGift,
  FaMapMarkedAlt,
  FaSignOutAlt
} from 'react-icons/fa';

import bannerImg from '../../../assets/account.jpg';
import './Account.css';
import Footer from '../../../compenents/footer/Footer';


const actions = [
    {
      label: 'Payment Details',
      icon: <FaMoneyCheckAlt size={32} />, 
      route: '/account-payment',
    },
    {
      label: 'Cheques Details',
      icon: <FaClipboardCheck size={32} />, // ✔ cheque tracking
      route: '/All-accCheaue',
    },
    // {
    //   label: 'Pending Orders',
    //   icon: <FaClock size={32} />, // ⏳ pending
    //   route: '/Adminallorder',
    // },
    // {
    //   label: 'View Dealer History',
    //   icon: <FaUserTie size={32} />, // 👔 dealer
    //   route: '/AllcustomerWiseHistory',
    // },
    // {
    //   label: 'Sales & Collection Details',
    //   icon: <FaChartLine size={32} />, // 📈 sales
    //   route: '/sales',
    // },
    {
      label: 'Payment Breakdown Monthly',
      icon: <FaUniversity size={32} />, // 🏦 bank
      route: '/BankAcc',
    },

  ];
  


const AccountProfile = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/All-in-one-Login');
  };

  if (!user || user.role !== 'account') {
    return <div className="admin-access-denied">Access denied. Admins only.</div>;

   
  }

  return (
    <div>
    <div className="admin-fullscreen-bg">
      <div className="admin-profile-banner" style={{ backgroundImage: `url(${bannerImg})` }}>
        <button className="admin-logout-btn" onClick={handleLogout} title="Logout">
          <FaSignOutAlt size={22} style={{ marginRight: 8 }} /> Logout
        </button>
        <div className="admin-avatar-overlap">
          {user.photo ? (
            <img src={user.photo} alt="Admin" className="admin-avatar-img" />
          ) : (
            user.userName?.charAt(0) || user.name?.charAt(0) || 'A'
          )}
        </div>
      </div>
      <div className="admin-profile-content">
        <div className="admin-actions-grid">
          {actions.map((action, idx) => (
            <div className="admin-action-glass-card" key={action.label} onClick={() => navigate(action.route)}>
              <div className="admin-action-icon">{action.icon}</div>
              <div className="admin-action-label">{action.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
    <Footer />
    </div>
  );
};

export default AccountProfile;
