import React from 'react';

import { useNavigate } from 'react-router-dom';
import { FaMoneyCheckAlt, FaClipboardList, FaChartLine, FaUserTie, FaUsers, FaSignOutAlt, FaBoxes, FaUniversity } from 'react-icons/fa';
import bannerImg from '../../../assets/agri.jpeg';
import Footer from '../../../compenents/footer/Footer';
import { useAuth } from '../../../services/AuthProvider';


const actions = [
  {
    label: 'Payment Details',
    icon: <FaMoneyCheckAlt size={32} />, 
    route: '/operationsPayment',
  },
  {
    label: 'View cheques',
    icon: <FaMoneyCheckAlt size={32} />,
    route: '',
  },
  {
    label: 'Sales & Collection Details',
    icon: <FaChartLine size={32} />, 
    route: '',
  },
  {
    label: 'View Dealer History',
    icon: <FaUserTie size={32} />, 
    route: '',
  },
  {
    label: 'Executives Incentive',
    icon: <FaUniversity size={32} />, 
    route: '',
  },
];

const OprationsDashboard = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/All-in-one-Login');
  };

  if (!user || user.role !== 'Operation') {
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
    <Footer/>
    </div>
  );
};

export default OprationsDashboard;
