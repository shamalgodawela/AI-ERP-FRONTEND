import React, { useEffect, useMemo, useState } from 'react';
import Footer from '../../../compenents/footer/Footer';
import useRedirectLoggedOutUser from '../../../customHook/useRedirectLoggedOutUser';
import { getAllUsers } from '../../../services/userService';
import { useNavigate } from 'react-router-dom';

const ViewAllusers = () => {
  useRedirectLoggedOutUser('/All-in-one-Login');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
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

  const goBack = () => navigate(-1);

  const filteredUsers = useMemo(() => {
    if (!search.trim()) return users;
    const q = search.toLowerCase();
    return users.filter(
      (u) =>
        (u.name || u.userName || '').toLowerCase().includes(q) ||
        (u.email || '').toLowerCase().includes(q) ||
        (u.role || '').toLowerCase().includes(q)
    );
  }, [users, search]);

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  const roleColors = {
    admin: { bg: '#fde8e8', text: '#c0392b' },
    user: { bg: '#e8f4fd', text: '#2980b9' },
    default: { bg: '#eee', text: '#555' },
  };

  const formatDate = (u) =>
    new Date(u.createdAt || Date.now()).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.headerRow}>
          <div>
            <h2 style={styles.title}>Registered Users</h2>
            <p style={styles.subtitle}>
              {loading ? 'Loading…' : `${filteredUsers.length} of ${users.length} user${users.length !== 1 ? 's' : ''}`}
            </p>
          </div>
          <div style={styles.headerActions}>
            <input
              type="text"
              placeholder="Search by name, email, or role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={styles.search}
            />
            <button style={styles.backBtn} onClick={goBack}>
              ← Back
            </button>
          </div>
        </div>

        {loading && (
          <div style={styles.stateBox}>
            <div style={styles.spinner} />
            <p>Loading users...</p>
          </div>
        )}

        {error && (
          <div style={{ ...styles.stateBox, color: '#c0392b' }}>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && filteredUsers.length === 0 && (
          <div style={styles.stateBox}>
            <p>No users found{search ? ' matching your search' : ''}.</p>
          </div>
        )}

        {!loading && !error && filteredUsers.length > 0 && (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>User</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Role</th>
                  <th style={styles.th}>Joined</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => {
                  const name = u.name || u.userName || 'Unknown';
                  const role = (u.role || 'user').toLowerCase();
                  const colors = roleColors[role] || roleColors.default;
                  return (
                    <tr
                      key={u._id}
                      style={styles.row}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#f9fafb')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <td style={styles.td}>
                        <div style={styles.userCell}>
                          <div style={styles.avatar}>{getInitials(name)}</div>
                          <span style={styles.userName}>{name}</span>
                        </div>
                      </td>
                      <td style={styles.td}>
                        <span style={styles.emailText}>{u.email}</span>
                      </td>
                      <td style={styles.td}>
                        <span
                          style={{
                            ...styles.badge,
                            background: colors.bg,
                            color: colors.text,
                          }}
                        >
                          {role}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <span style={styles.dateText}>{formatDate(u)}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    background: '#f4f6f8',
    display: 'flex',
    flexDirection: 'column',
  },
  container: {
    flex: 1,
    maxWidth: 1100,
    margin: '0 auto',
    width: '100%',
    padding: '32px 20px',
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
  },
  title: {
    margin: 0,
    fontSize: 26,
    fontWeight: 700,
    color: '#1f2937',
  },
  subtitle: {
    margin: '4px 0 0',
    color: '#6b7280',
    fontSize: 14,
  },
  headerActions: {
    display: 'flex',
    gap: 10,
    alignItems: 'center',
  },
  search: {
    padding: '9px 14px',
    borderRadius: 8,
    border: '1px solid #d1d5db',
    fontSize: 14,
    minWidth: 260,
    outline: 'none',
  },
  backBtn: {
    padding: '9px 16px',
    borderRadius: 8,
    border: '1px solid #d1d5db',
    background: '#fff',
    color: '#374151',
    fontSize: 14,
    cursor: 'pointer',
    fontWeight: 500,
  },
  tableWrapper: {
    background: '#fff',
    borderRadius: 12,
    boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
    overflow: 'hidden',
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    textAlign: 'left',
    padding: '14px 18px',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: '#6b7280',
    background: '#f9fafb',
    borderBottom: '1px solid #e5e7eb',
    fontWeight: 600,
  },
  row: {
    transition: 'background 0.15s ease',
  },
  td: {
    padding: '14px 18px',
    borderBottom: '1px solid #f1f1f1',
    fontSize: 14,
    color: '#374151',
  },
  userCell: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: '50%',
    background: '#4f46e5',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 12,
    fontWeight: 600,
    flexShrink: 0,
  },
  userName: {
    fontWeight: 500,
    color: '#111827',
  },
  emailText: {
    color: '#4b5563',
  },
  badge: {
    padding: '4px 10px',
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 600,
    textTransform: 'capitalize',
  },
  dateText: {
    color: '#6b7280',
    fontSize: 13,
  },
  stateBox: {
    background: '#fff',
    borderRadius: 12,
    padding: '40px 20px',
    textAlign: 'center',
    color: '#6b7280',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
  },
  spinner: {
    width: 28,
    height: 28,
    border: '3px solid #e5e7eb',
    borderTopColor: '#4f46e5',
    borderRadius: '50%',
    margin: '0 auto 12px',
    animation: 'spin 0.8s linear infinite',
  },
};

export default ViewAllusers;