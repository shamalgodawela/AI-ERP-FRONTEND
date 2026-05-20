import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../../../compenents/footer/Footer';

const Getallreturnadmin = () => {
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

    const availableYears = useMemo(() => {
        return [...new Set(
            returnDetails
                .map((d) => new Date(d.date).getFullYear())
                .filter((y) => !isNaN(y))
        )].sort((a, b) => b - a);
    }, [returnDetails]);

    const filteredReturns = useMemo(() => {
        if (!selectedYear) return returnDetails;
        return returnDetails.filter(
            (detail) => new Date(detail.date).getFullYear() === parseInt(selectedYear, 10)
        );
    }, [returnDetails, selectedYear]);

    const tableRows = useMemo(() => {
        return filteredReturns.flatMap((detail) => {
            const products =
                detail.products && detail.products.length > 0 ? detail.products : [null];
            return products.map((prod, i) => ({
                detail,
                prod,
                rowKey: `${detail._id || detail.invoiceNumber}-${i}`,
                isFirst: i === 0,
                rowSpan: products.length,
            }));
        });
    }, [filteredReturns]);

    return (
        <div className="return-details-page">

            <div className="return-details-content">
                <div className="return-details-toolbar">
                    <div>
                        <h1 className="return-details-title">Return Details</h1>
                        <p className="return-details-subtitle">
                            {loading
                                ? 'Loading records...'
                                : `Showing ${filteredReturns.length} return${filteredReturns.length !== 1 ? 's' : ''}`}
                        </p>
                    </div>

                    <div className="return-details-actions">
                        <div className="return-details-year-filter">
                            <label htmlFor="year-select">Year</label>
                            <select
                                id="year-select"
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(e.target.value)}
                            >
                                <option value="">All years</option>
                                {availableYears.map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <Link to="/addreturn" className="return-details-add-btn">
                            + Add Return
                        </Link>
                    </div>
                </div>

                <div className="return-details-card">
                    {loading ? (
                        <p className="return-details-loading">Loading return details...</p>
                    ) : tableRows.length === 0 ? (
                        <p className="return-details-empty">
                            No return details found{selectedYear ? ` for ${selectedYear}` : ''}.
                        </p>
                    ) : (
                        <div className="return-details-table-scroll">
                            <table className="return-details-table">
                                <thead>
                                    <tr>
                                        <th>Invoice No</th>
                                        <th>Customer</th>
                                        <th>Date</th>
                                        <th>Remarks</th>
                                        <th>Product Code</th>
                                        <th>Product Name</th>
                                        <th>Qty</th>
                                        <th>Unit Price</th>
                                        <th>Return Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tableRows.map(({ detail, prod, rowKey, isFirst, rowSpan }) => (
                                        <tr key={rowKey}>
                                            {isFirst && (
                                                <>
                                                    <td rowSpan={rowSpan}>{detail.invoiceNumber}</td>
                                                    <td rowSpan={rowSpan}>{detail.customer}</td>
                                                    <td rowSpan={rowSpan}>
                                                        {detail.date
                                                            ? new Date(detail.date).toLocaleDateString()
                                                            : '-'}
                                                    </td>
                                                    <td rowSpan={rowSpan} className="return-details-remarks">
                                                        {detail.remarks || '-'}
                                                    </td>
                                                </>
                                            )}
                                            {prod ? (
                                                <>
                                                    <td>{prod.productCode}</td>
                                                    <td>{prod.productName}</td>
                                                    <td className="return-details-num">{prod.quantity}</td>
                                                    <td className="return-details-num">{prod.unitPrice}</td>
                                                    <td className="return-details-num return-details-total">
                                                        {prod.returntotal}
                                                    </td>
                                                </>
                                            ) : (
                                                <td colSpan={5} className="return-details-no-products">
                                                    No products
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
            <button className="home-btn" onClick={() => navigate("/admin-profile")}>Home</button>

            <Footer />
        </div>
    );
};

export default Getallreturnadmin;
