import React, { useState, useEffect } from 'react';
import { AiOutlineEye } from 'react-icons/ai';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Footer from '../../../compenents/footer/Footer';
import { SpinnerImg } from '../../../compenents/loader/Loader';
import './vieworder.css'

const ViewallOrder = () => {
  const [orders, setOrders] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true); 
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [selectedStatus, setSelectedStatus] = useState(location.state?.selectedStatus || 'pending');
  const [selectedExe, setSelectedExe] = useState('');

  useEffect(() => {
    fetchOrders();
  }, [selectedPeriod, selectedStatus, selectedExe]);

  useEffect(() => {
    if (location.state?.selectedStatus === "pending") {
      setSelectedStatus("pending");
    }
  }, [location.state]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true); 
      const queryParams = new URLSearchParams();
      if (selectedPeriod) queryParams.append('period', selectedPeriod);
      if (selectedStatus) queryParams.append('status', selectedStatus);
      if (selectedExe) queryParams.append('exe', selectedExe);
      const response = await fetch(`http://localhost:5000/api/allor?${queryParams}`); // Update the URL with your backend endpoint
      const data = await response.json();
      setOrders(data);
      setIsLoading(false); 
    } catch (error) {
      console.error('Error fetching orders:', error);
      setIsLoading(false);
    }
  };

  const dateRanges = [
    { label: 'Today', value: 'today' },
    { label: 'This Week', value: 'thisWeek' },
    { label: 'This Month', value: 'thisMonth' },
    { label: 'Last 7 Days', value: 'last7Days' },
    { label: 'Last 30 Days', value: 'last30Days' },
  ];

  return (
    <div className="page-container">
      <div className="order-card">
        <h3 className="h3order">All Order Details</h3>
        <div className="search-form">
          <label>Status:</label>
          <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
            <option value="pending">pending</option>
            <option value="Approved">Approved</option>
            <option value="Canceled">Canceled</option>
          </select>
          <label>Exe:</label>
          <select value={selectedExe} onChange={(e) => setSelectedExe(e.target.value)}>
            <option value="">All</option>
            <option value="Mr.Ahamed">Mr.Ahamed</option> 
            <option value="Mr.Dasun">Mr.Dasun</option> 
            <option value="Mr.Chameera">Mr.Chameera</option> 
            <option value="Mr.Sanjeewa">Mr.Sanjeewa</option> 
            <option value="Mr.Navaneedan">Mr.Navaneedan</option>
            <option value="Mr.Nayum">Mr.Nayum</option>
          </select>
        </div>
        {isLoading ? (
          <SpinnerImg />
        ) : (
          <table className='tordert'>
            <thead>
              <tr>
                <th className='thorder'>Order Number</th>
                <th className='thorder'>Customer</th>
                <th className='thorder'>Customer Code</th>
                <th className='thorder'>Order Date</th>
                <th className='thorder'>Exe</th>
                <th className='thorder'>Status</th>
                <th className='thorder'>Action</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(orders) && orders.map((order) => (
                <tr key={order._id}>
                  <td className='tdorder'>{order.orderNumber}</td>
                  <td className='tdorder'>{order.customer}</td>
                  <td className='tdorder'>{order.code}</td>
                  <td className='tdorder'>{order.orderDate}</td>
                  <td className='tdorder'>{order.exe}</td>
                  <td className='tdorder'>{order.status}</td>
                  <td className='tdorder'>
                    <Link to={`/adminorder/${order.orderNumber}`}>
                      <AiOutlineEye size={20} className="action-icon" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <button className="home-btn" onClick={() => navigate('/admin-profile')}>Home</button>
      <Footer/>
    </div>
  );
};

export default ViewallOrder;
