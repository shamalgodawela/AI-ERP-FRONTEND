import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './getallreturn.css';
import UserNavbar from '../../../compenents/sidebar/UserNavbar/UserNavbar';
import { useNavigate } from 'react-router-dom';

const Getallreturnop = () => {
    const [returnDetails, setReturnDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedYear, setSelectedYear] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchReturnDetails = async () => {
            try {
                const response = await axios.get('https://nihon-inventory.onrender.com/api/getreturnd');
                setReturnDetails(response.data);
            } catch (error) {
                console.error('Error fetching return details:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchReturnDetails();
    }, []);

    const filteredReturns = selectedYear
        ? returnDetails.filter(detail => new Date(detail.date).getFullYear() === parseInt(selectedYear))
        : returnDetails;

    const availableYears = [...new Set(returnDetails.map(d => new Date(d.date).getFullYear()))].sort();

    return (
        <div className="unique-return-page-wrapper">
            <UserNavbar />

            <div className="unique-return-main-content">

                {/* Header */}
                <h2 className="unique-return-header">Return Details</h2>

                {/* Search/Filter Box */}
                <div className="unique-return-filter-box">
                    <button className="unique-return-add-btn">
                        <a href="/addreturn">Add Return</a>
                    </button>

                    <div className="unique-return-year-filter">
                        <label htmlFor="unique-year-select">Filter by Year:</label>
                        <select
                            id="unique-year-select"
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                            className="unique-year-select-input"
                        >
                            <option value="">All</option>
                            {availableYears.map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Table */}
                <div className="unique-return-table-container">
                    {loading ? (
                        <p className="unique-return-loading">Loading...</p>
                    ) : (
                        <table className="unique-return-table">
                            <thead>
                                <tr>
                                    <th>Invoice Number</th>
                                    <th>Customer</th>
                                    <th>Date</th>
                                    <th>Remarks</th>
                                    <th>Products</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredReturns.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                                            No return details found for selected year.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredReturns.map((detail, index) => (
                                        <tr key={index}>
                                            <td>{detail.invoiceNumber}</td>
                                            <td>{detail.customer}</td>
                                            <td>{new Date(detail.date).toLocaleDateString()}</td>
                                            <td>{detail.remarks}</td>
                                            <td className="unique-return-product-cell">
                                                {detail.products && detail.products.length > 0 ? (
                                                    detail.products.map((prod, i) => (
                                                        <div key={i} className="unique-return-product-box">
                                                            <strong>{prod.productName}</strong><br/>
                                                            Code: {prod.productCode}<br/>
                                                            Qty: {prod.quantity}<br/>
                                                            Unit Price: {prod.unitPrice}<br/>
                                                            Total: {prod.returntotal}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <span>No Products</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    )}
                </div>

            </div>
            <button className="home-btn" onClick={() => navigate('/Admin-operations-dashboard')}>Home</button>
        </div>
    );
};

export default Getallreturnop ;
