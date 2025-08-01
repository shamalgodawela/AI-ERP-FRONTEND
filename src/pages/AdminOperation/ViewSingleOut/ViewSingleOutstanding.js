import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import './singleout.css'
import { IoMdArrowRoundBack } from "react-icons/io";
import { FaUser, FaFileInvoice, FaCalendarAlt, FaUserTie, FaMapMarkerAlt, FaMoneyBillWave, FaCheckCircle, FaHistory } from 'react-icons/fa';

const ViewSingleOutstanding = () => {
    const containerRef = useRef(null);
    const { id } = useParams();
    const [invoice, setInvoice] = useState(null);
    const [amount, setAmount] = useState(0);
    const [outstanding, setOutstanding] = useState(0);
    const [date, setDate] = useState('');
    const [backName, setBackname]=useState('');
    const [depositedate, setdepositedate]=useState('');
    const [CHnumber, setCHnumber]=useState('');
    const [savedDetails, setSavedDetails] = useState(null); 
    const [invoiceNumber, setInvoiceNumber] = useState(''); 
    const navigate = useNavigate();

    useEffect(() => {
        const fetchInvoice = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/get-invoice/${id}`);
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
            const response = await axios.get(`http://localhost:5000/api/get-last-outstanding/${invoice.invoiceNumber}`);
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
            await axios.post(`http://localhost:5000/api/create`, { invoiceNumber: invoice.invoiceNumber,date ,backName,depositedate,CHnumber, amount, outstanding });
            toast.success('Data added successfully!');
        } catch (error) {
            toast.error('faild to add details...')
        }
    };

    const handleFetchAllOutstandingDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/get-all-outstanding/${invoice.invoiceNumber}`);
            const data = response.data;
            if (data.length === 0) {
                alert('Customer did not pay yet')          
                toast.error('Customer did not pay yet')
            } else {
                setSavedDetails(data);
            }
        } catch (error) {
            toast.error('Customer did not pay yet')
            alert('Customer did not pay yet') 
        }
    };

    if (!invoice) {
        return <div>Loading...</div>;
    }

    const formatNumbers = (x) => {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    const backoption = [ 'BOC', 'Commercial', 'HNB' ];
    const goback = () => { navigate(-1); };

    return (
        <div className="singleout-bg">
            <div className="singleout-header-banner" />
            <div className="singleout-info-card">
                <div className="singleout-info-item">
                    <span className="singleout-info-label"><FaFileInvoice /> Invoice</span>
                    <span className="singleout-info-invoice">{invoice.invoiceNumber}</span>
                </div>
                <div className="singleout-info-item">
                    <span className="singleout-info-label"><FaUser /> Customer</span>
                    <span className="singleout-info-customer">{invoice.customer}</span>
                </div>
                <div className="singleout-info-item">
                    <span className="singleout-info-label"><FaMapMarkerAlt /> Address</span>
                    <span className="singleout-info-value">{invoice.address}</span>
                </div>
                <div className="singleout-info-item">
                    <span className="singleout-info-label"><FaCalendarAlt /> Date</span>
                    <span className="singleout-info-value">{invoice.invoiceDate}</span>
                </div>
                <div className="singleout-info-item">
                    <span className="singleout-info-label"><FaUserTie /> EXE</span>
                    <span className="singleout-info-value">{invoice.exe}</span>
                </div>
                <div className="singleout-summary-card">
                    <FaMoneyBillWave style={{marginRight: 6}} />
                    Total: RS/= {formatNumbers(calculateTotal())}
                    <br />
                </div>
            </div>
            <div className="cal-outstanding-container">
                <Link to="#" onClick={goback} className="Back-Icon5">
                    <IoMdArrowRoundBack size={23} style={{marginRight: 6}} /> Go Back
                </Link>
                <h2 className="h1-out"><FaHistory style={{marginRight: 8}} />Product Details</h2>
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
                <br /><hr /><br />
                
                <button className="fetch-button" onClick={handleFetchAllOutstandingDetails}><FaHistory style={{marginRight: 6}} />Fetch All Outstanding Details</button>
                <br /><br /><hr /> <br />
                {savedDetails && (
                    <div>
                        <h2 className="h1-out"><FaHistory style={{marginRight: 8}} />All Outstanding Details:</h2>
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
                                {savedDetails.map((detail, idx) => (
                                    <tr key={idx}>
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
        </div>
    );
};

export default ViewSingleOutstanding;
