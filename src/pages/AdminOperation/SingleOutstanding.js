import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Footer from "../../compenents/footer/Footer";

const SingleOutstanding = () => {
    const containerRef = useRef(null);
    const { id } = useParams();
    const [invoice, setInvoice] = useState(null);
    const [amount, setAmount] = useState(0);
    const [outstanding, setOutstanding] = useState(0);
    const [date, setDate] = useState('');
    const [backName, setBackname] = useState('');
    const [depositedate, setdepositedate] = useState('');
    const [CHnumber, setCHnumber] = useState('');
    const [savedDetails, setSavedDetails] = useState(null);
    const [invoiceNumber, setInvoiceNumber] = useState('');
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

    const handleCalculate = async () => {
        try {
            const parsedAmount = parseFloat(amount);
            if (isNaN(parsedAmount)) throw new Error('Invalid amount value');

            const total = calculateTotal();
            const parsedTotal = parseFloat(total.replace(/,/g, ''));
            if (isNaN(parsedTotal)) throw new Error('Invalid total value');

            const response = await axios.get(`https://nihon-inventory.onrender.com/api/get-last-outstanding/${invoice.invoiceNumber}`);
            const lastOutstanding = parseFloat(response.data.outstanding);

            let newOutstanding;
            if (lastOutstanding === -1) {
                newOutstanding = parsedTotal - parsedAmount;
            } else {
                newOutstanding = lastOutstanding - parsedAmount;
            }

            setOutstanding(newOutstanding.toFixed(2));
        } catch (error) {
            console.error('Failed to calculate outstanding value:', error.message);
        }
    };

    const handleSave = async () => {
        try {
            await axios.post(`https://nihon-inventory.onrender.com/api/create`, {
                invoiceNumber: invoice.invoiceNumber,
                date,
                backName,
                depositedate,
                CHnumber,
                amount,
                outstanding
            });
            toast.success('Data added successfully!');
        } catch (error) {
            toast.error('Failed to add details');
        }
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
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    const bankOptions = ['BOC', 'Commercial', 'HNB'];

    const goback = () => {
        navigate(-1);
    };

    if (!invoice) return <div>Loading...</div>;

    return (
        <div>
            <br /><br />
            <div className="cal-outstanding-container">
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

                <h4 className="h1-out">Invoice code: {invoice.invoiceNumber}</h4>
                <h4 className="h1-out">Customer: {invoice.customer}</h4>
                <h4 className="h1-out">Invoice Date: {invoice.invoiceDate}</h4>
                <h4 className="h1-out">EXE: {invoice.exe}</h4>

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
                    Total: RS/={calculateTotal()}
                </div>

                <br /><br /><hr /> <br /><br />

                <button className="fetch-button" onClick={handleFetchAllOutstandingDetails}>
                    Fetch All Outstanding Details
                </button>

                <br /><br /><hr /> <br />

                {savedDetails && (
                    <div>
                        <h2 className="h1-out">All Outstanding Details:</h2>
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
                                        <td>RS/={detail.amount}</td>
                                        <td>{detail.backName}</td>
                                        <td>RS/={detail.outstanding}</td>
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
