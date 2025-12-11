import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Footer from "../../compenents/footer/Footer";
import { useReactToPrint } from 'react-to-print';

const SingleOutstanding = () => {
    const containerRef = useRef(null);
    const { id } = useParams();
    const [invoice, setInvoice] = useState(null);
    const [savedDetails, setSavedDetails] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchInvoice = async () => {
            try {
                const response = await axios.get(`https://nihon-inventory.onrender.com/api/get-invoice/${id}`);
                setInvoice(response.data);
            } catch (error) {
                console.error(`Failed to fetch invoice with id ${id}`, error.message);
            }
        };
        fetchInvoice();
    }, [id]);

    const calculateTotal = () => {
        let total = 0;
        if (invoice && invoice.products) {
            total = invoice.products.reduce((acc, product) => {
                const productTotal = product.labelPrice * (1 - product.discount / 100) * product.quantity;
                return acc + productTotal;
            }, 0);
        }
        return total.toFixed(2);
    };

    const handleFetchAllOutstandingDetails = async () => {
        try {
            const response = await axios.get(`https://nihon-inventory.onrender.com/api/get-all-outstanding/${invoice.invoiceNumber}`);
            const data = response.data;
            if (data.length === 0) {
                toast.error('Customer did not pay yet');
                alert('Customer did not pay yet');
            } else {
                setSavedDetails(data);
            }
        } catch (error) {
            toast.error('Customer did not pay yet');
            console.error('Failed to fetch all outstanding details:', error.message);
        }
    };

    const formatNumbers = (x) => {
        const num = parseFloat(x);
        if (isNaN(num)) return x;
        return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };
    
    const goback = () => {
        navigate(-1);
    };

    const handlePrint = useReactToPrint({
        content: () => containerRef.current,
        documentTitle: `Invoice_${invoice ? invoice.invoiceNumber : ''}`,
    });

    if (!invoice) return <div>Loading...</div>;

    // Inline styles
    const styles = {
        container: { padding: "20px" },
        headerButton: { backgroundColor: "#4CAF50", color: "white", border: "none", padding: "8px 16px", marginBottom: "20px", borderRadius: "4px", cursor: "pointer" },
        printButton: { backgroundColor: "#2196F3", color: "white", border: "none", padding: "8px 16px", marginBottom: "20px", marginLeft: "10px", borderRadius: "4px", cursor: "pointer" },
        fetchButton: { backgroundColor: "#f0ad4e", color: "white", border: "none", padding: "8px 16px", margin: "10px 5px", borderRadius: "4px", cursor: "pointer" },
        table: { width: "100%", borderCollapse: "collapse", marginTop: "10px" },
        thtd: { border: "1px solid #000", padding: "8px", textAlign: "left" },
        paymentBlock: { pageBreakInside: "avoid", marginTop: "20px", padding: "10px", border: "1px solid #ccc", borderRadius: "8px", backgroundColor: "#f9f9f9" },
        totalText: { textAlign: "right", fontWeight: "bold", marginTop: "10px" },
    };

    return (
        <div>
            <div ref={containerRef} style={styles.container}>
                {/* Header Buttons */}
                <button onClick={goback} style={styles.headerButton}>← Back</button>
                <button onClick={handlePrint} style={styles.printButton}>Print Invoice</button>

                {/* Invoice Info */}
                <h4>Invoice code: {invoice.invoiceNumber}</h4>
                <h4>Customer: {invoice.customer}</h4>
                <h4>Invoice Date: {invoice.invoiceDate}</h4>
                <h4>EXE: {invoice.exe}</h4>
                <h4>Mobile No: {invoice.contact}</h4>
                <h4>Address: {invoice.address}</h4>

                <hr style={{ margin: "20px 0" }} />

                {/* Product Details */}
                <h2>Product Details</h2>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.thtd}>Product Code</th>
                            <th style={styles.thtd}>Description</th>
                            <th style={styles.thtd}>Quantity</th>
                            <th style={styles.thtd}>Label Price</th>
                            <th style={styles.thtd}>Discount</th>
                            <th style={styles.thtd}>Unit Price</th>
                            <th style={styles.thtd}>Invoice Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoice.products.map((product, index) => (
                            <tr key={index}>
                                <td style={styles.thtd}>{product.productCode}</td>
                                <td style={styles.thtd}>{product.productName}</td>
                                <td style={styles.thtd}>{product.quantity}</td>
                                <td style={styles.thtd}>RS/={product.labelPrice}</td>
                                <td style={styles.thtd}>{product.discount}</td>
                                <td style={styles.thtd}>RS/={product.unitPrice}</td>
                                <td style={styles.thtd}>RS/= {formatNumbers((product.labelPrice * (1 - product.discount / 100) * product.quantity).toFixed(2))}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div style={styles.totalText}>
                    Total: RS/= {formatNumbers(calculateTotal())}
                </div>

                <hr style={{ margin: "20px 0" }} />

                {/* Fetch Payment Details */}
                <button style={styles.fetchButton}>Fetch All Cheque Details(Pending development)</button>
                <button style={styles.fetchButton} onClick={handleFetchAllOutstandingDetails}>Fetch All Payment Details</button>

                {/* Payment Details Block */}
                {savedDetails && savedDetails.length > 0 && (
                    <div style={styles.paymentBlock}>
                        <h2>All Payment Details:</h2>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.thtd}>Date</th>
                                    <th style={styles.thtd}>Amount</th>
                                    <th style={styles.thtd}>Bank Name</th>
                                    <th style={styles.thtd}>Outstanding</th>
                                </tr>
                            </thead>
                            <tbody>
                                {savedDetails.map((detail, index) => (
                                    <tr key={index}>
                                        <td style={styles.thtd}>{detail.date}</td>
                                        <td style={styles.thtd}>RS/= {formatNumbers(detail.amount)}</td>
                                        <td style={styles.thtd}>{detail.backName}</td>
                                        <td style={styles.thtd}>RS/= {formatNumbers(detail.outstanding)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <Footer />

            {/* Inline print styles */}
            <style>
                {`
                @media print {
                    body * { visibility: hidden; }
                    div[ref] , div[ref] * { visibility: visible; }
                    div[ref] { position: absolute; left: 0; top: 0; width: 100%; }
                    button { display: none !important; }
                    table, tr, td, th { page-break-inside: avoid !important; }
                }
                `}
            </style>
        </div>
    );
};

export default SingleOutstanding;
