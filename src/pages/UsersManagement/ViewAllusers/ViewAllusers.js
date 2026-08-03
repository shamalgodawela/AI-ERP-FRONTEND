import React, { useEffect, useState } from 'react';
import AdminnavBar from '../../../compenents/AdminNavbar/AdminnavBar';
import Footer from '../../../compenents/footer/Footer';
import useRedirectLoggedOutUser from '../../../customHook/useRedirectLoggedOutUser';
import { getAllUsers } from '../../../services/userService';
import { Navigate, useNavigate } from 'react-router-dom';

const ViewAllusers = () => {
  useRedirectLoggedOutUser('/All-in-one-Login');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const data = await getAllUsers();
        setUsers(data || []);
      } catch (err) {
        setError('Failed to load users');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

    const goback = () => {
    navigate(-1);
  };

  return (
    <div>
      <AdminnavBar />
      <div style={{ padding: 18 }}>
        <h2>Registered Users</h2>

        {loading && <p>Loading users...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {!loading && !error && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #ddd' }}>Name</th>
                  <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #ddd' }}>Email</th>
                  <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #ddd' }}>Role</th>
                  <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #ddd' }}>Created</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td style={{ padding: 8, borderBottom: '1px solid #f1f1f1' }}>{u.name || u.userName || '-'}</td>
                    <td style={{ padding: 8, borderBottom: '1px solid #f1f1f1' }}>{u.email}</td>
                    <td style={{ padding: 8, borderBottom: '1px solid #f1f1f1' }}>{u.role || '-'}</td>
                    <td style={{ padding: 8, borderBottom: '1px solid #f1f1f1' }}>{new Date(u.createdAt || u._id?.getTimestamp?.() || Date.now()).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Footer />
      <button
        className="home-btn no-print"
        onClick={() => Navigate('/admin-profile')}
      >
        Home
      </button>
    </div>
  );
};

export default ViewAllusers;
