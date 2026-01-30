import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './getallreturn.css';
import UserNavbar from '../../../compenents/sidebar/UserNavbar/UserNavbar';

const GetAllReturnDetails = () => {
    const [returnDetails, setReturnDetails] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReturnDetails = async () => {
            try {
                const response = await axios.get('https://nihon-inventory.onrender.com/api/getreturnd');
                setReturnDetails(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching return details:', error);
            }
        };

        fetchReturnDetails();
    }, []);

    return (
        <div>
            <UserNavbar /><br/>

            <button type="button" className="btn btn-outline-primary" disabled>
                <a href="/addreturn">Add return</a>
            </button>
            <br/><br/>

            <div className="return-details-container">
                <h2 className="return-details-heading">Return Details</h2>

                {loading ? (
                    <p className="return-details-loading">Loading...</p>
                ) : (
                    <table className="return-details-table">
                        <thead>
                            <tr>
                                <th>Invoice Number</th>
                                <th>Customer</th>
                                <th>Date</th>
                                <th>Remarks</th>
                                <th>Products</th> {/* NEW COLUMN */}
                            </tr>
                        </thead>

                        <tbody>
                            {returnDetails.map((detail, index) => (
                                <tr key={index}>
                                    <td>{detail.invoiceNumber}</td>
                                    <td>{detail.customer}</td>
                                    <td>{detail.date}</td>
                                    <td>{detail.remarks}</td>

                                    {/* PRODUCT DETAILS */}
                                    <td>
                                        {detail.products && detail.products.length > 0 ? (
                                            detail.products.map((prod, i) => (
                                                <div key={i} className="product-box">
                                                    <strong>{prod.productName}</strong><br/>
                                                    Code: {prod.productCode}<br/>
                                                    Qty: {prod.quantity}<br/>
                                                    Unit Price: {prod.unitPrice}<br/>
                                                    Total: {prod.returntotal}
                                                    <hr />
                                                </div>
                                            ))
                                        ) : (
                                            <span>No Products</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default GetAllReturnDetails;
