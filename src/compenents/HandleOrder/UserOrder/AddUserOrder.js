import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import UserNavbar from '../../sidebar/UserNavbar/UserNavbar';
import Footer from '../../footer/Footer';

const AddUserOrder = ({ onAddOrder }) => {
  const navigate = useNavigate();
  const [lastOrderNumber, setLastOrderNumber] = useState('');
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
    VatRegNo: '',
    VatNO: '',
    TaxNo: '',
    CreditPeriod: '',
    Paymentmethod: '',
    CusVatNo: '',
    IncentiveDueDate: '',
    products: [
      {
        productCode: '',
        productName: '',
        quantity: '',
        labelPrice: '',
        discount: '',
        unitPrice: '',
        invoiceTotal: '',
      },
    ],
  });

  // Map EXE to endpoint suffix
  const exeEndpointMap = {
    'Mr.Ahamed': 'ea',
    'Mr.Dasun': 'su',
    'Mr.Chameera': 'ncp',
    'Mr.Sanjeewa': 'upc',
    'Mr.Navaneedan': 'upc1',
    'Mr.Nayum': 'NUM',
    'Mr.Riyas': 'EA2',
    'UpCountry':'upcountry',
    'SOUTH':'south1',
    'Other':'other'

  };

  const generateNextOrderNumber = (lastOrderNumber) => {
    if (!lastOrderNumber || !lastOrderNumber.includes('-')) return '';
    const [prefix, number] = lastOrderNumber.split('-');
    const nextNumber = String(parseInt(number, 10) + 1).padStart(3, '0');
    return `${prefix}-${nextNumber}`;
  };

  useEffect(() => {
    const fetchLastOrderNumber = async () => {
      const endpoint = exeEndpointMap[orderData.exe];
      if (!endpoint) {
        setLastOrderNumber('');
        setOrderData((prev) => ({ ...prev, orderNumber: '' }));
        return;
      }

      try {
        const response = await axios.get(
          `https://nihon-inventory.onrender.com/api/lastorder/${endpoint}`
        );
        const last = response.data.lastOrderNumber;
        setLastOrderNumber(last);

        const nextOrder = generateNextOrderNumber(last);
        setOrderData((prev) => ({ ...prev, orderNumber: nextOrder }));
      } catch (error) {
        console.error('Error fetching last order number:', error);
        toast.error('Failed to fetch last order number');
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
      products[index].invoiceTotal = isNaN(invoiceTotal)
        ? ''
        : invoiceTotal.toFixed(2);
    } else if (name === 'labelPrice' || name === 'discount') {
      const labelPrice = parseFloat(products[index].labelPrice);
      const discount = parseFloat(products[index].discount);
      const quantity = parseFloat(products[index].quantity);
      const unitPrice = labelPrice * (1 - discount / 100);
      const invoiceTotal = unitPrice * quantity;
      products[index].unitPrice = isNaN(unitPrice)
        ? ''
        : unitPrice.toFixed(2);
      products[index].invoiceTotal = isNaN(invoiceTotal)
        ? ''
        : invoiceTotal.toFixed(2);
    } else if (name === 'invoiceTotal') {
      products[index].invoiceTotal = value;
    }

    setOrderData({ ...orderData, products });
  };

  const handleAddProduct = () => {
    setOrderData({
      ...orderData,
      products: [
        ...orderData.products,
        {
          productCode: '',
          productName: '',
          quantity: '',
          labelPrice: '',
          discount: '',
          unitPrice: '',
          invoiceTotal: '',
        },
      ],
    });
  };

  const handleGetProductDetails = async (index) => {
    const productCode = orderData.products[index].productCode;
    try {
      const response = await axios.get(
        `https://nihon-inventory.onrender.com/api/products/category/${productCode}`
      );
      const { name, price } = response.data;
      const products = [...orderData.products];
      products[index].productName = name;
      products[index].labelPrice = price;
      setOrderData({ ...orderData, products });
      toast.success('Product details fetched successfully');
    } catch (error) {
      console.error('Error fetching product details:', error);
      toast.error('Error fetching product details');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `https://nihon-inventory.onrender.com/api/orders`,
        orderData
      );
      toast.success('Order is added successfully');
      navigate('/view-all-order');
    } catch (error) {
      console.error('Error adding invoice:', error);
      toast.error('Order Number was already used');
    }
  };

  const handleGetCustomerDetails = async () => {
    const customerCode = orderData.code;
    try {
      const response = await axios.get(
        `https://nihon-inventory.onrender.com/api/customers/${customerCode}`
      );
      const { companyName, address, phone } = response.data;
      setOrderData({
        ...orderData,
        customer: companyName,
        address,
        contact: phone,
      });
    } catch (error) {
      console.error('Error fetching customer details:', error);
      toast.error('Error fetching customer details');
    }
  };

  const removeProduct = (index) => {
    const updatedProducts = [...orderData.products];
    updatedProducts.splice(index, 1);
    setOrderData({ ...orderData, products: updatedProducts });
  };

  return (
    <div>
      <UserNavbar />
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <h1 className="h1order">Order details</h1>

          <div className="form-row">
            <label className="form-label">Exe:</label>
            <select
              className="form-input"
              name="exe"
              value={orderData.exe}
              onChange={(e) =>
                setOrderData({ ...orderData, exe: e.target.value })
              }
            >
              <option value="">Select EXE:</option>
              <option value="Mr.Ahamed">Mr.Ahamed</option>
              <option value="Mr.Nayum">Mr.Nayum</option>
              <option value="SOUTH">SOUTH-1</option>
              <option value="Other">Other</option>
              <option value="UpCountry">UpCountry</option>
            </select>
          </div>

          {lastOrderNumber && (
            <div className="form-row">
              <p className="last-order-number">
                Last Order Number: {lastOrderNumber}
              </p>
            </div>
          )}

          <div className="form-row">
            <label className="form-label">Order Number:</label>
            <input
              type="text"
              className="form-input"
              name="orderNumber"
              value={orderData.orderNumber}
            />
          </div>

          <div className="form-row">
            <label className="form-label">Order Date:</label>
            <input
              type="date"
              className="form-input"
              name="orderDate"
              value={orderData.orderDate}
              onChange={(e) =>
                setOrderData({ ...orderData, orderDate: e.target.value })
              }
            />
          </div>

          <div className="form-row">
            <label className="form-label">Customer Code:</label>
            <input
              type="text"
              className="form-input"
              name="code"
              value={orderData.code}
              onChange={(e) =>
                setOrderData({ ...orderData, code: e.target.value })
              }
              required
            />
            <button
              type="button"
              className="form-button"
              onClick={handleGetCustomerDetails}
            >
              Get Details of Customer
            </button>
          </div>

          {/* More customer info fields */}
          <div className="form-row">
            <label className="form-label">Customer:</label>
            <input
              type="text"
              className="form-input"
              name="customer"
              value={orderData.customer}
              readOnly
            />
          </div>
          <div className="form-row">
            <label className="form-label">Address:</label>
            <input
              type="text"
              className="form-input"
              name="address"
              value={orderData.address}
              readOnly
            />
          </div>
          <div className="form-row">
            <label className="form-label">Contact:</label>
            <input
              type="text"
              className="form-input"
              name="contact"
              value={orderData.contact}
              onChange={(e) =>
                setOrderData({ ...orderData, contact: e.target.value })
              }
            />
          </div>

          <div className="form-row">
            <label className="form-label">Terms of Payment:</label>
            <input
              type="text"
              className="form-input"
              name="CreditPeriod"
              value={orderData.CreditPeriod}
              onChange={(e) =>
                setOrderData({ ...orderData, CreditPeriod: e.target.value })
              }
            />
          </div>

          <div className="form-row">
            <label className="form-label">Mode Of Payment:</label>
            <input
              type="text"
              className="form-input"
              name="Paymentmethod"
              value={orderData.Paymentmethod}
              onChange={(e) =>
                setOrderData({ ...orderData, Paymentmethod: e.target.value })
              }
            />
          </div>

          <div className="form-row">
            <label className="form-label">Customer Vat No:</label>
            <input
              type="text"
              className="form-input"
              name="CusVatNo"
              value={orderData.CusVatNo}
              onChange={(e) =>
                setOrderData({ ...orderData, CusVatNo: e.target.value })
              }
            />
          </div>

          <div className="form-row">
            <label className="form-label">Executive Incentive Due Date:</label>
            <input
              type="date"
              className="form-input"
              name="IncentiveDueDate"
              value={orderData.IncentiveDueDate}
              onChange={(e) =>
                setOrderData({ ...orderData, IncentiveDueDate: e.target.value })
              }
            />
          </div>

          <h1 className="h1order">Product details</h1>

          {orderData.products.map((product, index) => (
            <div key={index} className="product-container">
              <label>Product Code:</label>
              <input
                type="text"
                name="productCode"
                value={product.productCode}
                onChange={(e) => handleChange(e, index)}
              />
              <button
                type="button"
                onClick={() => handleGetProductDetails(index)}
              >
                Get Details
              </button>

              <label>Product Name:</label>
              <input
                type="text"
                name="productName"
                value={product.productName}
                onChange={(e) => handleChange(e, index)}
              />

              <label>Label Price:</label>
              <input
                type="text"
                name="labelPrice"
                value={product.labelPrice}
                onChange={(e) => handleChange(e, index)}
              />

              <label>Quantity:</label>
              <input
                type="text"
                name="quantity"
                value={product.quantity}
                onChange={(e) => handleChange(e, index)}
              />

              <label>Discount (%):</label>
              <input
                type="text"
                name="discount"
                value={product.discount}
                onChange={(e) => handleChange(e, index)}
              />

              <label>Unit Price:</label>
              <input
                type="text"
                name="unitPrice"
                value={product.unitPrice}
                onChange={(e) => handleChange(e, index)}
              />

              <label>Invoice Total:</label>
              <input
                type="text"
                name="invoiceTotal"
                value={product.invoiceTotal}
                onChange={(e) => handleChange(e, index)}
              />

              <button type="button" onClick={() => removeProduct(index)}>
                Remove Product
              </button>
            </div>
          ))}

          <button type="button" onClick={handleAddProduct}>
            Add Product
          </button>
          <br />
          <button type="submit" className="product-button1">
            Add Order
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default AddUserOrder;
