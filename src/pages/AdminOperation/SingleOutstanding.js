import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify'; 
import Footer from "../../compenents/footer/Footer";
import { IoMdArrowRoundBack } from "react-icons/io";

const SingleOutstanding = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const containerRef = useRef(null);

    const [invoice, setInvoice] = useState(null);
    const [amount, setAmount] = useState(0);
    const [outstanding, setOutstanding] = useState(0);
    const [date, setDate] = useState('');
    const [backName, setBackname] = useState('');
    const [depositedate, setDepositedate] = useState('');
    const [CHnumber, setCHnumber] = useState('');
    const [savedDetails, setSavedDetails] = useState(null); 

    const backoption = ['BOC', 'Commercial', 'HNB'];

    // Fetch invoice data
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

    // Calculate total of products
    const calculateTotal = () => {
        if (!invoice || !invoice.products) return 0;

        const total = invoice.products.reduce((acc, product) => {
            const productTotal = product.labelPrice * (1 - product.discount / 100) * product.quantity;
            return acc + productTotal;
        }, 0);

        return total.toFixed(2);
    };

    // Calculate new outstanding
    const handleCalculate = async () => {
        try {
            const parsedAmount = parseFloat(amount);
            if (isNaN(parsedAmount)) throw new Error('Invalid amount');

            const total = parseFloat(calculateTotal());
            const response = await axios.get(`https://nihon-inventory.onrender.com/api/get-last-outstanding/${invoice.invoiceNumber}`);
            const lastOutstanding = parseFloat(response.data.outstanding);

            let newOutstanding;
            if (lastOutstanding === -1) {
                newOutstanding = total - parsedAmount;
            } else {
                newOutstanding = lastOutstanding - parsedAmount;
            }

            setOutstanding(newOutstanding.toFixed(2));
        } catch (error) {
            console.error('Failed to calculate outstanding:', error.message);
        }
    };

    // Save outstanding payment
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

    // Fetch all outstanding details
    const handleFetchAllOutstandingDetails = async () => {
        try {
            const response = await axios.get(`https://nihon-inventory.onrender.com/api/get-all-outstanding/${invoice.invoiceNumber}`);
            if (response.data.length === 0) {
                toast.error('Customer did not pay yet');
            } else {
                setSavedDetails(response.data);
            }
        } catch (error) {
            toast.error('Customer did not pay yet');
            console.error('Failed to fetch all outstanding details:', error.message);
        }
    };

    const goback = () => navigate(-1);

    const formatNumbers = (x) => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    if (!invoice) return <div>Loading...</div>;

    return (
        <div ref={containerRef}>
            <Link to="#" onClick={goback} className="Back-Icon" style={{ color: 'black' }}>
                Go Back <IoMdArrowRoundBack size={23} />
            </Link>

            <div className="cal-outstanding-container">
                <h4 className="h1-out">Invoice code: {invoice.invoiceNumber}</h4>
                <h4 className="h1-out">Customer: {invoice.customer}</h4>
                <h4 className="h1-out">EXE: {invoice.exe}</h4>
                <h4 className="h1-out">Address: {invoice.address}</h4>
                
                <br /><hr /><br />

                {/* Product Details */}
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

                <div className="info-item-td text-end text-bold1">SubTotal: RS/={calculateTotal()}</div>
                <div className="info-item-td text-end text-bold2">Tax: %{invoice.Tax}</div>
                <div className="info-item-td text-end text-bold3">Total: RS/={calculateTotal()}</div>

                <br /><hr /><br />

                {/* Add Outstanding */}
                

                <br /><hr /><br />

                {/* Display saved outstanding details */}
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

<h2>Invoice date:{invoice.invoiceDate}</h2>
<h2>Due date:{invoice.Duedate}</h2>

                {/* Display Cheque details */}
                {invoice.cheques && invoice.cheques.length > 0 && (
                    <div>
                        <h2 className="h1-out">Cheque Details:</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>Cheque No</th>
                                    <th>Bank Name</th>
                                    <th>Deposit Date</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoice.cheques.map((cheque, index) => (
                                    <tr key={index}>
                                        <td>{cheque.chequeNo}</td>
                                        <td>{cheque.bankName}</td>
                                        <td>{cheque.depositDate}</td>
                                        <td>RS/={cheque.amount}</td>
                                        <td>{cheque.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <br />
                    </div>
                )}
                <button className="fetch-button" onClick={handleFetchAllOutstandingDetails}>Fetch All Outstanding Details</button>

            </div>
            {/* <div className="add-outstanding-container">
                    <h1 className="h1-out">Add Outstanding</h1>

                    <div className="input-container">
                        <label>Deposited Date:</label>
                        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                    </div>
                    <div className="input-container">
                        <label>Bank Name:</label>
                        <select value={backName} onChange={(e) => setBackname(e.target.value)}>
                            <option value="" disabled>Select a Bank</option>
                            {backoption.map((bank, index) => (
                                <option key={index} value={bank}>{bank}</option>
                            ))}
                        </select>
                    </div>
                    <div className="input-container">
                        <label>Date:</label>
                        <input type="date" placeholder="Deposited date" value={depositedate} onChange={(e) => setDepositedate(e.target.value)} />
                    </div>
                    <div className="input-container">
                        <label>Cheque Number/Reference Number:</label>
                        <input type="text" placeholder="Cheque number" value={CHnumber} onChange={(e) => setCHnumber(e.target.value)} required />
                    </div>
                    <div className="input-container">
                        <label>Amount:</label>
                        <input type="number" value={amount} onChange={(e) => setAmount(parseFloat(e.target.value))} />
                    </div>

                    <button className="calculate-button" onClick={handleCalculate}>Calculate</button>
                    <div className="outstanding">Outstanding: RS/={outstanding}</div>
                    <button className="save-button" onClick={handleSave}>Save</button>
                    <hr />
                    
                </div> */}

            <Footer />
        </div>
    );
};

export default SingleOutstanding;
