import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import './CalOutstanding.css'; 
import Footer from "../../compenents/footer/Footer";
import { IoMdArrowRoundBack } from "react-icons/io";

const CalOutstanding = () => {
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
                const response = await axios.get(`https://nihon-inventory.onrender.com/api/get-invoice/${id}`);
                setInvoice(response.data);
            } catch (error) {
                console.error(`Failed to fetch invoice with id ${id}`, error.message);
                // Handle error
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
    

    // const calculateTaxtot = () => {
    //     if (invoice && invoice.products) {
    //         const taxRate = invoice.Tax || 0;

    //         const totalTax = invoice.products.reduce((acc, product) => {
    //             const productTax = parseFloat(product.invoiceTotal) * (taxRate / 100);
    //             return acc + productTax;
    //         }, 0);

    //         const subtotal = calculateTotal();
    //         const totalWithTax = subtotal + totalTax;

    //         return totalWithTax.toFixed(2);
    //     }

    //     return 0;
    // };
    const handleCalculate = async () => {
        try {
            const parsedAmount = parseFloat(amount);
            if (isNaN(parsedAmount)) {
                throw new Error('Invalid amount value');
            }
    
            const total = calculateTotal();
            const parsedTotal = parseFloat(total.replace(/,/g, ''));
            if (isNaN(parsedTotal)) {
                throw new Error('Invalid total value');
            }
    
            console.log('Amount:', parsedAmount);
            console.log('Total:', parsedTotal);
    
            const response = await axios.get(`https://nihon-inventory.onrender.com/api/get-last-outstanding/${invoice.invoiceNumber}`);
            const lastOutstanding = parseFloat(response.data.outstanding);
            
    
            console.log('Last Outstanding:', lastOutstanding);
    
            let newOutstanding;
            if (lastOutstanding === -1) {
                newOutstanding = parsedTotal - parsedAmount;
                console.log('New Outstanding (from last outstanding):', newOutstanding);
            } 
            else{
                newOutstanding = lastOutstanding - parsedAmount;
                console.log('New Outstanding (last outstanding is 0):', newOutstanding);
            }

            setOutstanding(newOutstanding.toFixed(2));
        } catch (error) {
            console.error('Failed to calculate outstanding value:', error.message);
            // Handle error case if needed
        }
    };
    
    
    const handleSave = async () => {
        try {
            await axios.post(`https://nihon-inventory.onrender.com/api/create`, { invoiceNumber: invoice.invoiceNumber,date ,backName,depositedate,CHnumber, amount, outstanding });
            // Display success message
            toast.success('Data added successfully!');
        } catch (error) {
            toast.error('faild to add details...')
            // Handle error
        }
    };
    

    const handleFetchAllOutstandingDetails = async () => {
        try {
            const response = await axios.get(`https://nihon-inventory.onrender.com/api/get-all-outstanding/${invoice.invoiceNumber}`);
            const data = response.data;
            if (data.length === 0) {
                alert('Customer did not pay yet')          
                toast.error('Customer did not pay yet')
                
            }
            else{
                setSavedDetails(data);

            }
            
        } catch (error) {
            toast.error('Customer did not pay yet')
            alert('Customer did not pay yet') 
            console.error('Failed to fetch all outstanding details:', error.message);
            // Handle error
        }
    };
    
    

    if (!invoice) {
        return <div>Loading...</div>;
    }

    const formatNumbers = (x) => {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      };


      const backoption =[
        'BOC',
        'Commercial',
        'HNB'
      ]

      const goback=()=>{
        navigate(-1);
      }

    return (
        <div>
           

            <Link to="#" onClick={goback} className="Back-Icon" style={{ color: 'black' }}>
  Go Back
  <IoMdArrowRoundBack size={23} />
</Link>

            <br/><br/>

        <div className="cal-outstanding-container">
        <h4 className="h1-out">Invoice code: {invoice.invoiceNumber}</h4>
        <h4 className="h1-out">Customer:{invoice.customer}</h4>
        <h4 className="h1-out">Invoice Date:{invoice.invoiceDate}</h4>
        <h4 className="h1-out">EXE: {invoice.exe}</h4>
        <h4 className="h1-out">Address: {invoice.address}</h4>
        
        <br/><hr/><br/>

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
       

        {/* <div className="info-item-td text-end text-bold1" id="second1">SubTotal: RS/={calculateTotal()}</div>
        <div className="info-item-td text-end text-bold2" id="second2">Tax: %{invoice.Tax}</div> */}
        <div className="info-item-td text-end text-bold3" id="second3">Total: RS/={calculateTotal()}
</div>
        <br/><br/><hr/> <br/><br/>
        <div className="add-outstanding-container">
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
                    <option key={index} value={bank}>
                        {bank}
                    </option>
            ))}

        </select>
    </div>
    <div className="input-container">
        <label>Date:</label>
        <input type="date" placeholder="Deposited date" value={depositedate} onChange={(e)=>setdepositedate(e.target.value)}/>
    </div>
    <div className="input-container">
        <label>Cheque Number/Reference Number:</label>
        <input type="text" placeholder="Cheque number" value={CHnumber} onChange={(e)=>setCHnumber(e.target.value)} required/>
    </div>
    <div className="input-container">
        <label>Amount:</label>
        <input type="number" value={amount} onChange={(e) => setAmount(parseFloat(e.target.value))} />
    </div>
    <button className="calculate-button" onClick={handleCalculate}>Calculate</button>
    <div className="outstanding">Outstanding:RS/={outstanding}</div>
    <button className="save-button" onClick={handleSave}>Save</button>
    <hr/>
    <button className="fetch-button" onClick={handleFetchAllOutstandingDetails}>Fetch All Outstanding Details</button>
</div>
 <br/><br/><hr/> <br/>

        {/* Display saved details */}
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
    <Footer/>
    </div>
    );
}

export default CalOutstanding;
