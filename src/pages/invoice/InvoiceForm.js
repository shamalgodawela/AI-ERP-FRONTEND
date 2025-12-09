import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./invoice.css"
import { useNavigate } from 'react-router-dom';
import Loader from '../../compenents/loader/Loader';
import UserNavbar from '../../compenents/sidebar/UserNavbar/UserNavbar';
import Footer from '../../compenents/footer/Footer';



const InvoiceForm = () => {
  const navigate = useNavigate();
  const [totalInvoiceAmount, setTotalInvoiceAmount] = useState(0);
  const [finalValue, setFinalValue] = useState(0);

  const [formData, setFormData] = useState({
    products: [
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
    invoiceNumber: '',
    customer: '',
    code: '',
    address: '',
    contact: '',
    invoiceDate: '',
    orderNumber: '',
    orderDate: '',
    exe: '',
    ModeofPayment: '',
    TermsofPayment: '',
    Duedate: '',
    Tax: '',
    GatePassNo: '',
    VehicleNo: '',
    VatRegNo: '',
    VatNO: '',
    TaxNo: '',
    CusVatNo:'',
    IncentiveDueDate:'',
    StockName:'',
    FreeissuedStatus:''
  });



  const [calculatedValues, setCalculatedValues] = useState({
    unitPrice: 0,
    invoiceTotal: 0,
  });

  const handleChange = async (e, index) => {
    const { name, value } = e.target;

    if (name.startsWith('products')) {
      const [field, productField] = name.split('.');
      const updatedProducts = [...formData.products];
      updatedProducts[index] = { ...updatedProducts[index], [productField]: value };

      if (productField === 'productCode') {
        try {
          const response = await axios.get(`https://nihon-inventory.onrender.com/api/products/${value}`);
          const product = response.data;

          setFormData({
            ...formData,
            products: updatedProducts,
          });
        } catch (error) {
          console.error('Failed to fetch product details', error.message);
          toast.error('No matching product found for the provided product code', {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      } else if (productField === 'productName') {
        setFormData({
          ...formData,
          products: updatedProducts,
        });
      } else {
        setFormData({
          ...formData,
          products: updatedProducts,
        });
      }
    } else if (name === 'TermsofPayment') {
      const termOfPaymentDays = parseInt(value, 10);
      if (!isNaN(termOfPaymentDays) && termOfPaymentDays > 0) {
        const invoiceDate = new Date(formData.invoiceDate); 
        const dueDate = new Date(invoiceDate.setDate(invoiceDate.getDate() + termOfPaymentDays));
  

        if (!isNaN(dueDate.getTime())) {
          setFormData({
            ...formData,
            [name]: value,
            Duedate: dueDate.toISOString().split('T')[0],
          });
        } else {
          toast.error('Invalid date');
          console.error('Invalid due date');
        }
      } else {
        toast.error('Invalid date');
        console.error('Invalid terms of payment');
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });

      if (name === 'Tax') {
        calculateFinalValue(totalInvoiceAmount, value);
      }
    }
  };

  const addProduct = () => {
    setFormData({
      ...formData,
      products: [
        ...formData.products,
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



  useEffect(() => {
    let totalUnitPrice = 0;
    let totalInvoiceTotal = 0;

    formData.products.forEach((product) => {
      const calculatedUnitPrice = parseFloat(product.labelPrice) - (parseFloat(product.labelPrice) * parseFloat(product.discount) / 100);
      const calculatedInvoiceTotal = parseFloat(calculatedUnitPrice) * parseFloat(product.quantity);

      totalUnitPrice += isNaN(calculatedUnitPrice) ? 0 : calculatedUnitPrice;
      totalInvoiceTotal += isNaN(calculatedInvoiceTotal) ? 0 : calculatedInvoiceTotal;

      product.unitPrice = isNaN(calculatedUnitPrice) ? 0 : calculatedUnitPrice;
      product.invoiceTotal = isNaN(calculatedInvoiceTotal) ? 0 : calculatedInvoiceTotal;
    });

    setCalculatedValues({
      unitPrice: totalUnitPrice,
      invoiceTotal: totalInvoiceTotal,
    });

    setTotalInvoiceAmount(totalInvoiceTotal);
    calculateFinalValue(totalInvoiceTotal, formData.Tax);
  }, [formData.products]);

  const calculateFinalValue = (totalInvoiceAmount, tax) => {
    const taxRate = parseFloat(tax) || 0;
    const finalValue = totalInvoiceAmount - (totalInvoiceAmount * taxRate / 100);
    setFinalValue(finalValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Frontend validation: ensure each product has a code and quantity > 0
    const hasInvalidProduct = formData.products.some((p) => {
      const qty = Number(p.quantity);
      return !p.productCode || !Number.isFinite(qty) || qty <= 0;
    });

    if (hasInvalidProduct) {
      toast.error('Please ensure all products have a code and quantity > 0', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }

    try {
              const orderCheckResponse = await axios.get(`https://nihon-inventory.onrender.com/api/check/${formData.orderNumber}`);
      const orderExists = orderCheckResponse.data.exists;
  
      if (orderExists) {
        toast.error('Order number already exists', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        return;
      }
  
      
      const updatedFormData = {
        ...formData,
        // taxtotal: finalValue.toFixed(2),
      };
  
              const response = await axios.post(`https://nihon-inventory.onrender.com/api/add-invoice`, updatedFormData);
      console.log('Invoice added successfully', response.data);
  
      toast.success('Invoice added successfully', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
  
      navigate("/all-invoices");
    } catch (error) {
      const serverMsg = (error && error.response && (error.response.data && (error.response.data.error || error.response.data.message))) || error.message || 'Failed to add invoice';
      console.error('Failed to add invoice', serverMsg);

      toast.error(serverMsg, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };
  

  const [isLoading, setIsLoading] = useState(false);

  const handleGetDetails = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.get(`https://nihon-inventory.onrender.com/api/orders/${formData.orderNumber}`);
      const orderData = response.data;
  
      if (orderData.status === "pending") {
        toast.warning('Order is pending', {
          position: 'top-right',
          autoClose: 3000,
        });
      } else if (orderData.status === "Canceled") {
        toast.error('Order was canceled by admin', {
          position: 'top-right',
          autoClose: 3000,
        });
      } else if (orderData.status === "Approved") {
        // Set all order data, EXCLUDING invoiceNumber initially
        setFormData((prev) => ({
          ...prev,
          invoiceNumber: '', // Clear it first
          customer: orderData.customer,
          code: orderData.code,
          address: orderData.address,
          contact: orderData.contact,
          invoiceDate: orderData.invoiceDate,
          orderNumber: orderData.orderNumber,
          orderDate: orderData.orderDate,
          exe: orderData.exe,
          ModeofPayment: orderData.ModeofPayment,
          TermsofPayment: orderData.TermsofPayment,
          Duedate: orderData.Duedate,
          Tax: orderData.Tax,
          GatePassNo: orderData.GatePassNo,
          VehicleNo: orderData.VehicleNo,
          taxtotal: orderData.taxtotal,
          VatRegNo: orderData.VatRegNo,
          VatNO: orderData.VatNO,
          TaxNo: orderData.TaxNo,
          CusVatNo: orderData.CusVatNo,
          IncentiveDueDate: orderData.IncentiveDueDate,
          products: orderData.products.map((product) => ({
            productCode: product.productCode,
            productName: product.productName,
            quantity: product.quantity,
            labelPrice: product.labelPrice,
            discount: product.discount,
            unitPrice: product.unitPrice,
            invoiceTotal: product.invoiceTotal,
          })),
        }));
  
        // Set total and tax
        setTotalInvoiceAmount(orderData.totalInvoiceAmount || 0);
        calculateFinalValue(orderData.totalInvoiceAmount || 0, orderData.Tax || '');
      }
    } catch (error) {
      console.error('Failed to fetch order details', error.message);
  
      toast.error('Failed to fetch order details', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };
  

  useEffect(() => {
    let totalUnitPrice = 0;
    let totalInvoiceTotal = 0;

    formData.products.forEach((product) => {
      const calculatedUnitPrice = parseFloat(product.labelPrice) - (parseFloat(product.labelPrice) * parseFloat(product.discount) / 100);
      const calculatedInvoiceTotal = parseFloat(calculatedUnitPrice) * parseFloat(product.quantity);

      totalUnitPrice += isNaN(calculatedUnitPrice) ? 0 : calculatedUnitPrice;
      totalInvoiceTotal += isNaN(calculatedInvoiceTotal) ? 0 : calculatedInvoiceTotal;

      product.unitPrice = isNaN(calculatedUnitPrice) ? 0 : calculatedUnitPrice;
      product.invoiceTotal = isNaN(calculatedInvoiceTotal) ? 0 : calculatedInvoiceTotal;
    });

    setCalculatedValues({
      unitPrice: totalUnitPrice,
      invoiceTotal: totalInvoiceTotal,
    });

    setTotalInvoiceAmount(totalInvoiceTotal);
    calculateFinalValue(totalInvoiceTotal, formData.Tax);
  }, [formData.products]);


  const handleGetInvoiceNumber = async () => {
    try {
      let url = '';
  
      if (formData.exe === 'Mr.Ahamed') {
        url = 'https://nihon-inventory.onrender.com/api/get-last-invoice-number-EA1';
      } else if (formData.exe === 'Mr.Nayum') {
        url = 'https://nihon-inventory.onrender.com/api/get-last-invoice-number-NUM';
      } else if (formData.exe === 'SOUTH') {
        url = 'https://nihon-inventory.onrender.com/api/get-last-invoice-number-south1';
      } else if (formData.exe === 'Other') {
        url = 'https://nihon-inventory.onrender.com/api/lastorder/other';
      } else if (formData.exe === 'UpCountry') {
        url = 'https://nihon-inventory.onrender.com/api/get-last-invoice-number-other';
      } else if(formData.exe ==='Mr.Arshad')
      {
        url="https://nihon-inventory.onrender.com/ap/get-last-invoice-number-PT1"
      }
      else if(formData.exe ==='Miss.Mubashshahira')
        {
          url="https://nihon-inventory.onrender.com/api/get-last-invoice-number-KU1"
        }
      else if(formData.exe='Mr.Buddhika')
      {
        url="https://nihon-inventory.onrender.com/api/get-last-invoice-number-ncp1"

      }
      else {
        toast.error("Please select a valid Executive before fetching invoice number.");
        return;
      }
  
      const response = await axios.get(url);
      console.log("Invoice API response:", response.data);
  
      let lastInvoice = response.data.lastinvoice; 
      if (lastInvoice) {
 
        const match = lastInvoice.match(/^([a-zA-Z0-9\-]*?)(\d+)$/);

  
        if (match) {
          const prefix = match[1];     
          const numberStr = match[2];
  
         
          let number = parseInt(numberStr, 10) + 1;
  
       
          const newNumberStr = number.toString().padStart(numberStr.length, '0');
  
          const newInvoiceNumber = prefix + newNumberStr;
  
          setFormData(prev => ({
            ...prev,
            invoiceNumber: newInvoiceNumber
          }));
  
          toast.success("Invoice number fetched and incremented: " + newInvoiceNumber);
        } else {
      
          setFormData(prev => ({
            ...prev,
            invoiceNumber: lastInvoice
          }));
          toast.warning("Invoice number format unexpected. Set as is.");
        }
      } else {
        toast.error("Invoice number not found in response");
      }
  
    } catch (error) {
      console.error('Failed to fetch invoice number by executive:', error.message);
      toast.error("Error fetching invoice number");
    }
  };
  
  const fetchNextTaxNo = async () => {
    try {
      const response = await axios.get("https://nihon-inventory.onrender.com/api/get-last-tax-no");
      const lastTaxNo = response.data.nextTaxNo || 0; // assuming your backend returns nextTaxNo
      setFormData(prev => ({
        ...prev,
        TaxNo: lastTaxNo
      }));
    } catch (error) {
      console.error("Failed to fetch last TaxNo", error);
      toast.error("Failed to fetch last TaxNo");
    }
  };
  
  useEffect(() => {
    // Only fetch TaxNo if a specific VAT Reg No is selected
    if (formData.VatRegNo === "VAT Reg No-102784022-7000") {
      fetchNextTaxNo();
    }
  }, [formData.VatRegNo]);
  
  

  return (
    <div>
      <UserNavbar />
      {isLoading && <Loader />}
      <div className={`invoice-form ${isLoading ? "loading" : ""}`}>
        <h2>Create Invoice</h2>
        <form onSubmit={handleSubmit}>
        <div className="form-group">
            <label>Order Number:</label>
            <input
              type="text"
              name="orderNumber"
              value={formData.orderNumber}
              onChange={handleChange}
            />
            <button onClick={handleGetDetails}>Get Details</button>
          </div>
          <div className="form-group">
  <label>Invoice Number:</label>
  <div style={{ display: 'flex', gap: '8px' }}>
    <input
      type="text"
      name="invoiceNumber"
      value={formData.invoiceNumber}
      onChange={handleChange}
     
    />
    <button type="button" onClick={handleGetInvoiceNumber}>
      Get Invoice Number
    </button>
  </div>
</div>

          <div className="form-group">
            <label>Customer:</label>
            <input
              type="text"
              name="customer"
              value={formData.customer}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Code:</label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Address:</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Contact:</label>
            <input
              type="text"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Invoice Date:</label>
            <input
              type="date"
              name="invoiceDate"
              value={formData.invoiceDate}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Dealer Incentive or Black magic free issued status:</label>
            <input
              type="date"
              name="invoiceDate"
              value={formData.FreeissuedStatus}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Order Date:</label>
            <input
              type="date"
              name="orderDate"
              value={formData.orderDate}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
  <label>Vat RegNo:</label>
  <select
    name="VatRegNo"
    value={formData.VatRegNo}
    onChange={handleChange}
  >
    <option value="">Select Vat RegNo:</option>
    <option value="VAT Reg No-102784022-7000">VAT Reg No-102784022-7000</option>
    <option value="">None</option>
  </select>
</div>

          <div className="form-group">
            <label>Tax invoice or not:</label>
              <select
              name="VatNO"
              value={formData.VatNO}
              onChange={handleChange}
            >
              <option value="">Select Option</option>
              <option value="TAX INVOICE">Yes</option>
              <option value="">No</option>
            </select>
          </div>

          <div className="form-group">
           <label>Tax Invoice No:</label>
              <input
              type="text"
              name="TaxNo"
              value={formData.TaxNo}
              onChange={handleChange}
            
              />
          </div>
          <div className="form-group">
           <label>Customer VAT No:</label>
              <input
              type="text"
              name="TaxNo"
              value={formData.CusVatNo}
              onChange={handleChange}
              />
          </div>

          <div className="form-group">
            <label>Executive:</label>
            <input
              type="text"
              name="exe"
              value={formData.exe}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Mode of Payment:</label>
              <select
              name="ModeofPayment"
              value={formData.ModeofPayment}
              onChange={handleChange}
              required
              >
               <option value="">Select mode of payment</option>
               <option value="Cash">Cash</option>
               <option value="Cheque">Cheque</option>
               <option value="Exe_stock">Exe_stock</option>
              </select>
          </div>
          <div className="form-group">
            <label>Terms of Payment (days):</label>
            <input
              type="text"
              name="TermsofPayment"
              value={formData.TermsofPayment}
              onChange={handleChange}
              
            />
          </div>
          <div className="form-group">
            <label>Due Date:</label>
            <input
              type="date"
              name="Duedate"
              value={formData.Duedate}
              readOnly
            />
          </div>
          <div className="form-group">
            <label>Exe Incentive Due Date:</label>
            <input
              type="date"
              name="Duedate"
              value={formData.IncentiveDueDate}
              onChange={handleChange}
          
            />
          </div>
          <div className="form-group">
  <label>Stock Name:</label>
  <select
    name="StockName"
    value={formData.StockName}
    onChange={handleChange}
  >
    <option value="">-- Select Stock --</option>
    <option value="MS">ms</option>
    <option value="Mr.Arshad">Mr.Arshad</option>
    <option value="M.Ahamed">Mr.Ahamed</option>
    <option value="SOUTH">SOUTH</option>
  
  </select>
</div>

          <div className="form-group">
            <label>Tax (%):</label>
            <input
              type="text"
              name="Tax"
              value={formData.Tax}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Invoice Total with Tax:</label>
            <input
              type="text"
              name="GatePassNo"
              value={finalValue.toFixed(2)}
              readOnly
            />
          </div>
      
          <h3>Products</h3>
          {formData.products.map((product, index) => (
            <div key={index} className="product-group">
              <div className="form-group">
                <label>Product Code:</label>
                <input
                  type="text"
                  name={`products.${index}.productCode`}
                  value={product.productCode}
                  onChange={(e) => handleChange(e, index)}
                />
              </div>
              <div className="form-group">
                <label>Product Name:</label>
                <input
                  type="text"
                  name={`products.${index}.productName`}
                  value={product.productName}
                  onChange={(e) => handleChange(e, index)}
                />
              </div>
              <div className="form-group">
                <label>Quantity:</label>
                <input
                  type="number"
                  name={`products.${index}.quantity`}
                  value={product.quantity}
                  onChange={(e) => handleChange(e, index)}
                  min={1}
                />
              </div>
              <div className="form-group">
                <label>Label Price:</label>
                <input
                  type="text"
                  name={`products.${index}.labelPrice`}
                  value={product.labelPrice}
                  onChange={(e) => handleChange(e, index)}
                />
              </div>
              <div className="form-group">
                <label>Discount (%):</label>
                <input
                  type="text"
                  name={`products.${index}.discount`}
                  value={product.discount}
                  onChange={(e) => handleChange(e, index)}
                />
              </div>
              <div className="form-group">
                <label>Unit Price:</label>
                <input
                  type="text"
                  name={`products.${index}.unitPrice`}
                  value={product.unitPrice}
                  readOnly
                />
              </div>
              <div className="form-group">
                <label>Invoice Total:</label>
                <input
                  type="text"
                  name={`products.${index}.invoiceTotal`}
                  value={product.invoiceTotal}
                  readOnly
                />
              </div>
             
            </div>
          ))}
         
          <button type="submit">Create Invoice</button>
        </form>
        <ToastContainer />
      </div>
      <Footer/>
      
    </div>
  );
};

export default InvoiceForm;
