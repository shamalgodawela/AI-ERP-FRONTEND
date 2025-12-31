import React, { useState, useEffect } from 'react';
import './orderdetails.css';
import { SpinnerImg } from '../../loader/Loader';
import { Link } from 'react-router-dom';
import { AiOutlineEye } from 'react-icons/ai';

const OrderDetails = () => {
  const [allOrders, setAllOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedExe, setSelectedExe] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [selectedPeriod, selectedStatus, selectedExe, selectedDate, allOrders]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`https://nihon-inventory.onrender.com/api/allor`);
      const data = await response.json();
      setAllOrders(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...allOrders];

    if (selectedStatus) {
      filtered = filtered.filter(order => order.status === selectedStatus);
    }

    if (selectedExe) {
      filtered = filtered.filter(order => order.exe === selectedExe);
    }

    if (selectedDate) {
      filtered = filtered.filter(order => order.orderDate === selectedDate);
    }

    if (selectedPeriod) {
      const now = new Date();
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.orderDate);
        switch (selectedPeriod) {
          case 'today':
            return orderDate.toDateString() === now.toDateString();
          case 'thisWeek':
            const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
            const endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 6));
            return orderDate >= startOfWeek && orderDate <= endOfWeek;
          case 'thisMonth':
            return (
              orderDate.getMonth() === new Date().getMonth() &&
              orderDate.getFullYear() === new Date().getFullYear()
            );
          case 'last7Days':
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            return orderDate >= sevenDaysAgo;
          case 'last30Days':
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            return orderDate >= thirtyDaysAgo;
          default:
            return true;
        }
      });
    }

    setFilteredOrders(filtered);
  };

  const dateRanges = [
    { label: 'Today', value: 'today' },
    { label: 'This Week', value: 'thisWeek' },
    { label: 'This Month', value: 'thisMonth' },
    { label: 'Last 7 Days', value: 'last7Days' },
    { label: 'Last 30 Days', value: 'last30Days' },
  ];

  return (
    <div>
      <h3 className="h3order">All Order Details</h3>

      <div className="search-form">
        <label>Time Period:</label>
        <select value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value)}>
          <option value="">All</option>
          {dateRanges.map((range) => (
            <option key={range.value} value={range.value}>
              {range.label}
            </option>
          ))}
        </select>

        <label>Status:</label>
        <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
          <option value="">All</option>
          <option value="Approved">Approved</option>
          <option value="Canceled">Canceled</option>
          <option value="pending">pending</option>
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

        <label>Order Date:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      {isLoading ? (
        <SpinnerImg />
      ) : (
        <table className="tordert">
          <thead>
            <tr>
              <th className="thorder">Order Number</th>
              <th className="thorder">Customer</th>
              <th className="thorder">Customer Code</th>
              <th className="thorder">Order Date</th>
              <th className="thorder">Exe</th>
              <th className="thorder">Status</th>
              <th className="thorder">view</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order._id}>
                <td className="tdorder">{order.orderNumber}</td>
                <td className="tdorder">{order.customer}</td>
                <td className="tdorder">{order.code}</td>
                <td className="tdorder">{order.orderDate}</td>
                <td className="tdorder">{order.exe}</td>
                <td className="tdorder">{order.status}</td>
                <td className='tdorder'>
                    <Link to={`/userorder/${order.orderNumber}`}>
                      <AiOutlineEye size={20} className="action-icon" />
                    </Link>
                  </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrderDetails;
