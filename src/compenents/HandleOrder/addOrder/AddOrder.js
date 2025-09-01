import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import './addorder.css'
import { useNavigate } from 'react-router-dom';
const AddOrder = ({ onAddOrder }) => {
    const navigate = useNavigate();
    const [orderData, setOrderData] = useState({
        invoiceNumber: '',
        customer: '',
        code: '',
        address: '',
        contact: '',
        invoiceDate: '',
        orderNumber: '',
        orderDate: '',
        exe: '',
        VatRegNo:'',
        VatNO:'',
        TaxNo:'',
        CreditPeriod:'',
        Paymentmethod:'',
        CusVatNo:'',
        IncentiveDueDate: '',
        products: [{ productCode: '', productName: '', quantity: '', labelPrice: '', discount: '', unitPrice: '', invoiceTotal: '' }]
    });
    const [lastOrderNumber, setLastOrderNumber] = useState('');

    useEffect(() => {
        const fetchLastOrderNumber = async () => {
            if (!orderData.exe) {
                setLastOrderNumber('');
                return;
            }

            const executiveEndpoints = {
                'Mr.Ahamed': 'ea',
                'Mr.Dasun': 'su',
                'Mr.Chameera': 'ncp',
                'Mr.Sanjeewa': 'upc',
                'Mr.Navaneedan': 'upc1',
                'Mr.Nayum': 'NUM',
                'Mr.Riyas': 'EA2'
            };

            const endpoint = executiveEndpoints[orderData.exe];
            
            if (endpoint) {
                try {
                    const response = await axios.get(`https://nihon-inventory.onrender.com/api/lastorder/${endpoint}`);
                    setLastOrderNumber(response.data.lastOrderNumber);
                } catch (error) {
                    console.error('Error fetching last order number:', error);
                    setLastOrderNumber('');
                }
            } else {
                setLastOrderNumber('');
            }
        };

        fetchLastOrderNumber();
    }, [orderData.exe]);
   

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const products = [...orderData.products];
    products[index][name] = value;

   
    if (name === 'unitPrice') {
        const labelPrice = parseFloat(products[index].labelPrice);
        const unitPrice = parseFloat(value);
        const quantity = parseFloat(products[index].quantity);
        
        if (!isNaN(labelPrice)) {
            const discount = ((labelPrice - unitPrice) / labelPrice) * 100; 
            products[index].discount = isNaN(discount) ? '' : discount.toFixed(2); 
        }

        const invoiceTotal = unitPrice * quantity; 
        products[index].invoiceTotal = isNaN(invoiceTotal) ? '' : invoiceTotal.toFixed(2);
    } 

    else if (name === 'labelPrice' || name === 'discount') {
        const labelPrice = parseFloat(products[index].labelPrice);
        const discount = parseFloat(products[index].discount);
        const quantity = parseFloat(products[index].quantity);
        const unitPrice = labelPrice * (1 - discount / 100); // Calculate unit price
        const invoiceTotal = unitPrice * quantity; // Calculate invoice total
        products[index].unitPrice = isNaN(unitPrice) ? '' : unitPrice.toFixed(2); // Set unit price
        products[index].invoiceTotal = isNaN(invoiceTotal) ? '' : invoiceTotal.toFixed(2); // Set invoice total
    } 
    // Update invoice total directly if edited
    else if (name === 'invoiceTotal') {
        products[index].invoiceTotal = value;
    }

    setOrderData({ ...orderData, products });
};

    const handleAddProduct = () => {
        setOrderData({ ...orderData, products: [...orderData.products, { productCode: '', productName: '', quantity: '', labelPrice: '', discount: '', unitPrice: '', invoiceTotal: '' }] });
    };

    const handleGetProductDetails = async (index) => {
        const productCode = orderData.products[index].productCode;
        try {
            const response = await axios.get(`http://localhost:5000/api/products/category/${productCode}`);
            const { name, price } = response.data; // Assuming the response contains name and price
            const products = [...orderData.products];
            products[index].productName = name;
            products[index].labelPrice = price;
            setOrderData({ ...orderData, products });
            toast.success('Product details fetched successfully')
        } catch (error) {
            console.error('Error fetching product details:', error);
            toast.error('Error fetching product details');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Send POST request to backend API to add the order
            const response = await axios.post(`http://localhost:5000/api/orders`, orderData);
            console.log('order added successfully', response.data);
            toast.success('Order is added sucessfully');
            navigate('/Exedahsboard')

            // Optionally, you can perform additional actions upon successful addition of the order
        } catch (error) {
            console.error('Error adding invoice:', error);
            toast.error('Order Number was already used:')
            // Optionally, handle error states such as displaying an error message to the user
        }
    };
    const handleGetCustomerDetails = async () => {
        const customerCode = orderData.code;
        try {
            const response = await axios.get(`http://localhost:5000/api/customers/${customerCode}`);
            const { companyName, address, phone } = response.data; // Assuming the response contains name, address, and contact
            setOrderData({ ...orderData, customer: companyName, address, contact:phone });
        } catch (error) {
            console.error('Error fetching customer details:', error);
            toast.error('Error fetching customer details');
        }
    };
    const addProduct = () => {
        setOrderData({
          ...orderData,
          products: [
            ...orderData.products,
            {
              productCode: '',
              productName: '',
              quantity: 0,
              labelPrice: 0,
              discount: 0,
              unitPrice: 0,
              invoiceTotal: 0,
            },
          ],
        });
      };
    
      const removeProduct = (index) => {
        const updatedProducts = [...orderData.products];
        updatedProducts.splice(index, 1);
    
        setOrderData({
          ...orderData,
          products: updatedProducts,
        });
      };
    return (
        <div className="form-container">
        <form onSubmit={handleSubmit}>

            <div className="form-row">
                <h1 className='h1order'>Order details..........................</h1>
                <div className="form-row">
  <label className="form-label">Exe:</label>
  <select className="form-input" name="exe" value={orderData.exe} onChange={(e) => setOrderData({ ...orderData, exe: e.target.value })} >
    <option value="">Select EXE:</option> 
    <option value="Mr.Ahamed">Mr.Ahamed</option> 
    <option value="SOUTH">SOUTH</option> 
    <option value="Mr.Chameera">Mr.Chameera</option> 
    <option value="Mr.Navaneedan">Mr.Navaneedan</option> 
    <option value="Mr.Nayum">Mr.Nayum</option>
    <option value="Mr.Riyas">Mr.Riyas</option>
    <option value="Other">Other</option>
  </select>
            {orderData.exe && lastOrderNumber && (
                <div className="form-row">
                    <p className="last-order-number">
                        Last Order Number: {lastOrderNumber}
                    </p>
                </div>
            )}
                                                                                                                                                                
</div>
  <label className="form-label">Order Number:</label>
  <input type="text" className="form-input" name="orderNumber" value={orderData.orderNumber} onChange={(e) => setOrderData({ ...orderData, orderNumber: e.target.value })} />
</div>

<div className="form-row">
  <label className="form-label">Order Date:</label>
  <input type="date" className="form-input" name="orderDate" value={orderData.orderDate} onChange={(e) => setOrderData({ ...orderData, orderDate: e.target.value })} />
</div>
<div className="form-row">
  <label className="form-label">Customer Code:</label>
  <input type="text" className="form-input" name="code" value={orderData.code} onChange={(e) => setOrderData({ ...orderData, code: e.target.value })} required/>
  <button type="button" className="form-button" onClick={handleGetCustomerDetails}>Get Details of Customer</button>
</div>
<div className="form-row">
  <label className="form-label">Customer:</label>
  <input type="text" className="form-input" name="customer" value={orderData.customer} onChange={(e) => setOrderData({ ...orderData, customer: e.target.value })}readOnly />
</div>
<div className="form-row">
  <label className="form-label">Address:</label>
  <input type="text" className="form-input" name="address" value={orderData.address} onChange={(e) => setOrderData({ ...orderData, address: e.target.value })} readOnly />
</div>
<div className="form-row">
  <label className="form-label">Contact:</label>
  <input type="text" className="form-input" name="contact" value={orderData.contact} onChange={(e) => setOrderData({ ...orderData, contact: e.target.value })} />
</div>
<div className="form-row">
  <label className="form-label">Terms of Payment:</label>
  <input type="text" className="form-input" name="CreditPeriod" value={orderData.CreditPeriod} onChange={(e) => setOrderData({ ...orderData, CreditPeriod: e.target.value })} />
</div>
<div className="form-row">
  <label className="form-label">Mode Of Payment:</label>
  <input type="text" className="form-input" name="Paymentmethod" value={orderData.Paymentmethod} onChange={(e) => setOrderData({ ...orderData, Paymentmethod: e.target.value })} />
</div>
<div className="form-row">
  <label className="form-label">Customer Vat No</label>
  <input type="text" className="form-input" name="CusVatNo" value={orderData.CusVatNo} onChange={(e) => setOrderData({ ...orderData, CusVatNo: e.target.value })} />
</div>
<div className="form-row">
  <label className="form-label">Executive Incentive Due Date</label>
  <input type="date" className="form-input" name="IncentiveDueDate" value={orderData.IncentiveDueDate} onChange={(e) => setOrderData({ ...orderData, CusVatNo: e.target.value })} />
</div>


<h1 className='h1order'>Product details</h1>
          
            <div className="product-container">
  {orderData.products.map((product, index) => (
    <div key={index}>
      <label className="product-label">Product Code:</label>
      <input
        type="text"
        name="productCode"
        value={product.productCode}
        onChange={(e) => handleChange(e, index)}
        className="product-input"
      />
      <button type="button" onClick={() => handleGetProductDetails(index)} className="product-button">Get Details</button>

      <label className="product-label">Product Name:</label>
      <input
        type="text"
        name="productName"
        value={product.productName}
        onChange={(e) => handleChange(e, index)}
        className="product-input"
        
      />

      <label className="product-label">Label Price:</label>
      <input
        type="text"
        name="labelPrice"
        value={product.labelPrice}
        onChange={(e) => handleChange(e, index)}
        className="product-input"
        
      />

      <label className="product-label">Quantity:</label>
      <input
        type="text"
        name="quantity"
        value={product.quantity}
        onChange={(e) => handleChange(e, index)}
        className="product-input"
      />

      <label className="product-label">Discount (%):</label>
      <input
        type="text"
        name="discount"
        value={product.discount}
        onChange={(e) => handleChange(e, index)}
        className="product-input"
      />

<label className="product-label">Unit Price:</label>
<input
    type="text"
    name="unitPrice"
    value={product.unitPrice}
    onChange={(e) => handleChange(e, index)}
    className="product-input"
/>
      
<label className="product-label">invoice total:</label>
      <input
  type="text"
  name="invoiceTotal"
  value={product.invoiceTotal}
  onChange={(e) => handleChange(e, index)}
  className="product-input"
/>


      <button type="button" onClick={() => removeProduct(index)} className="product-button">
        Remove Product
      </button>
    </div>
  ))}
</div><br/>

            <button type="button" onClick={handleAddProduct}>Add Product</button><br/>
            <button type="submit" className="product-button1">Add Order</button>
        </form>
        </div>
    );
};

export default AddOrder;
