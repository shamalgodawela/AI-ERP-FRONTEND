import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Chart from 'chart.js/auto';
import "./customerDEtails.css"
import Footer from '../../../compenents/footer/Footer';
import NavBar from '../../../compenents/sidebar/NavBar';

const CustomerDetails = () => {
  const { code } = useParams();
  const [customer, setCustomer] = useState(null);
  const [totalInvoiceValue, setTotalInvoiceValue] = useState(0);
  const [monthlyTotalInvoices, setMonthlyTotalInvoices] = useState([]);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await axios.get(`https://nihon-inventory.onrender.com/api/customers/${code}`);
        setCustomer(response.data);
      } catch (error) {
        console.error('Error fetching customer details:', error);
      }
    };

    const fetchTotalInvoiceValue = async () => {
      try {
        const response = await axios.get(`https://nihon-inventory.onrender.com/api/get-total-invoice-value/${code}`);
        setTotalInvoiceValue(response.data.totalInvoiceValue);
      } catch (error) {
        console.error('Error fetching total invoice value:', error);
      }
    };

    const fetchMonthlyTotalInvoices = async () => {
      try {
        const response = await axios.get(`https://nihon-inventory.onrender.com/api/monthly-total-invoice/${code}`);
        setMonthlyTotalInvoices(response.data);
      } catch (error) {
        console.error('Error fetching monthly total invoices:', error);
      }
    };

    fetchCustomer();
    fetchTotalInvoiceValue();
    fetchMonthlyTotalInvoices();
  }, [code]);

  useEffect(() => {
    // Create Bar Graph using Chart.js
    const ctx = document.getElementById('monthlyTotalChart');
    let chartInstance = null;
  
    if (ctx && monthlyTotalInvoices.length > 0) {
      const labels = monthlyTotalInvoices.map(monthlyTotal => `${monthlyTotal._id.year}-${monthlyTotal._id.month}`);
      const values = monthlyTotalInvoices.map(monthlyTotal => monthlyTotal.totalInvoiceValue);
  
      // Destroy previous chart instance if exists
      if (chartInstance) {
        chartInstance.destroy();
      }
  
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Monthly Total sales',
            data: values,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  
    // Cleanup function to ensure the chart instance is destroyed when the component unmounts
    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, [monthlyTotalInvoices]);
  

  if (!customer) {
    return <div>Loading...</div>;
  }

  return (
    <div>
        <NavBar/>
        <br/><br/>
      
    <div className="customer-details">
      <h2>Customer Details</h2>
      <p>Name: {customer.name}</p>
      <p>Code: {customer.code}</p>
      <p>Company Name: {customer.companyName}</p>
      <p>2nd Owner: {customer.contact}</p>
      <p>Address: {customer.address}</p>
      <p>District:{customer.district}</p>
      <p>City: {customer.city}</p>
      <p>Phone: {customer.phone}</p>
      <p>Email: {customer.email}</p>
      <p>2nd Phone: {customer.fax}</p>
      <p>Total sales:${totalInvoiceValue}</p>
      <div className="chart-container">
        <h3>Monthly Total sales</h3>
        <canvas id="monthlyTotalChart"></canvas>
      </div>
    </div>
    <Footer/>
    </div>
  );
};

export default CustomerDetails;
