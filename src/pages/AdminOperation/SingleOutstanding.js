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
    const [amount, setAmount] = useState(0);
    const [outstanding, setOutstanding] = useState(0);
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

    // React-to-print handler
    const handlePrint = useReactToPrint({
        content: () => containerRef.current,
        documentTitle: `Invoice_${invoice ? invoice.invoiceNumber : ''}`,
    });

    if (!invoice) return <div>Loading...</div>;

    return (
        <div>
            <br /><br />
            <div className="cal-outstanding-container" ref={containerRef}>
                {/* Back Button */}
                <button onClick={goback} style={{
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    marginBottom: '20px',
                    borderRadius: '4px',
                    cursor: 'pointer'
                }}>← Back</button>

                <button 
                    onClick={handlePrint} 
                    style={{
                        backgroundColor: '#2196F3',
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        marginBottom: '20px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        marginLeft: '10px'
                    }}
                >
                    Print Invoice
                </button>

                <h4 className="h1-out">Invoice code: {invoice.invoiceNumber}</h4>
                <h4 className="h1-out">Customer: {invoice.customer}</h4>
                <h4 className="h1-out">Invoice Date: {invoice.invoiceDate}</h4>
                <h4 className="h1-out">EXE: {invoice.exe}</h4>
                <h4 className="h1-out">Mobile No: {invoice.contact}</h4>
                <h4 className="h1-out">Address: {invoice.address}</h4>
                <h4 className="h1-out">TaxNo: {invoice.TaxNo}</h4>

                <br /><hr /><br />

                <h2 className="h1-out">Product Details</h2>
                <table>
                    <thead>
                        <tr>
                            <td className="text-bold">Product Code</td>
                            <td className="text-bold">Description</td>
                            <td className="text-bold">Quantity</td>
                            <td className="text-bold">Label Price</td>
                            <td className="text-bold">Discount</td>
                            <td className="text-bold">Unit Price</td>
                            <td className="text-bold">Invoice Total</td>
                        </tr>
                    </thead>
                    <tbody>
                        {invoice.products.map((product, index) => (
                            <tr key={index}>
                                <td>{product.productCode}</td>
                                <td>{product.productName}</td>
                                <td>{product.quantity}</td>
                                <td>RS/={product.labelPrice}</td>
                                <td>{product.discount}</td>
                                <td>RS/={product.unitPrice}</td>
                                <td>RS/= {formatNumbers((product.labelPrice * (1 - product.discount / 100) * product.quantity).toFixed(2))}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="info-item-td text-end text-bold3" id="second3">
                    Total: RS/= {formatNumbers(calculateTotal())}
                </div>

                <br /><br /><hr /> <br /><br />
                <button className="fetch-button" >
                    Fetch All Cheque Details(Pending development)
                </button>

                <button className="fetch-button" onClick={handleFetchAllOutstandingDetails}>
                    Fetch All Payment Details
                </button>

                <br /><br /><hr /> <br />

                {savedDetails && (
                    <div>
                        <h2 className="h1-out">All Payment Details:</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Amount</th>
                                    <th>Bank Name</th>
                                    <th>Outstanding</th>
                                </tr>
                            </thead>
                            <tbody>
                                {savedDetails.map((detail, index) => (
                                    <tr key={index}>
                                        <td>{detail.date}</td>
                                        <td>RS/= {formatNumbers(detail.amount)}</td>
                                        <td>{detail.backName}</td>
                                        <td>RS/= {formatNumbers(detail.outstanding)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default SingleOutstanding;
