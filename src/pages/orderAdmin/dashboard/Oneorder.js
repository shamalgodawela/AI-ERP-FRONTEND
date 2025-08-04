import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import './oneorder.css';
import Footer from '../../../compenents/footer/Footer';


const Oneorder = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [updatedOrder, setUpdatedOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate= useNavigate();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`https://nihon-inventory.onrender.com/api/orders/${id}`);
        const orderData = response.data;
        
        const updatedOrderData = {
          ...orderData,
          products: orderData.products.map(product => ({
            ...product,
            
            productCode: product.productCode || '',
            productName: product.productName || '',
            labelPrice: product.labelPrice || '',
            quantity: product.quantity || '',
            discount: product.discount || 0, 
            unitPrice: product.unitPrice || '',
            invoiceTotal: product.invoiceTotal || '',
          }))
        };
        setOrder(orderData);
        setUpdatedOrder(updatedOrderData);
        setIsLoading(false); 
      } catch (error) {
        console.error('Error fetching order details:', error);
      }
    };
  
    fetchOrderDetails();
  }, [id]);
  const calculateTotal = () => {
    let total = 0;
  
    if (order && order.products) {
      total = order.products.reduce((acc, product) => {
        const productTotal = product.labelPrice * (1 - product.discount / 100) * product.quantity;
        return acc + productTotal;
      }, 0);
    }
  
    return total.toFixed(2);
  };
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let updatedData;
  

    if (name === 'discount' || name === 'quantity') {
      updatedData = {
        ...updatedOrder,
        [name]: value,
        products: updatedOrder.products.map(product => {
          const labelPrice = parseFloat(product.labelPrice);
          const discount = parseFloat(product.discount);
          const quantity = parseFloat(product.quantity);
          const unitPrice = labelPrice * (1 - discount / 100); 
          const invoiceTotal = unitPrice * quantity; 
          return {
            ...product,
            unitPrice: isNaN(unitPrice) ? '' : unitPrice.toFixed(2),
            invoiceTotal: isNaN(invoiceTotal) ? '' : invoiceTotal.toFixed(2)
          };
        })
      };
    } else {
      updatedData = {
        ...updatedOrder,
        [name]: value
      };
    }
  
    setUpdatedOrder(updatedData);
  };
  
  
  const handleUpdateOrder = async (e) => {
    e.preventDefault();
    try {
              await axios.put(`http://localhost:5000/api/orders/${id}`, updatedOrder);
      
      setOrder(updatedOrder);

      
      toast.success("Order details updated successfully")

      navigate("/Adminallorder", { state: { selectedStatus: "pending" } });

      
    } catch (error) {
      console.error('Error updating order details:', error);
    }
  };
  
  // Handle form input changes for product details
  const handleProductInputChange = (e, index) => {
    const { name, value } = e.target;
    const updatedProducts = [...updatedOrder.products];
    updatedProducts[index] = { ...updatedProducts[index], [name]: value };
  
   
    if (name === 'quantity' || name === 'discount') {
      const labelPrice = parseFloat(updatedProducts[index].labelPrice);
      const discount = parseFloat(updatedProducts[index].discount);
      const quantity = parseFloat(updatedProducts[index].quantity);
      const unitPrice = labelPrice * (1 - discount / 100);
      const invoiceTotal = unitPrice * quantity;
  
      updatedProducts[index].unitPrice = isNaN(unitPrice) ? '' : unitPrice.toFixed(2);
      updatedProducts[index].invoiceTotal = isNaN(invoiceTotal) ? '' : invoiceTotal.toFixed(2);
    }
  
    setUpdatedOrder({
      ...updatedOrder,
      products: updatedProducts,
    });
  };
  const formatNumbers = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handlepassdelaercode=()=>{
    navigate('/view-Delaer-history', { state: { code: updatedOrder.code } });

  }
  const handleInvoiceHistory=()=>{
    navigate('/AllOutstanding-without-Menu', { state: { code: updatedOrder.code } });
  }
  


  return (
    <div className='bodAdmin'>
        <div className="container">
        <div className="order-details-container">
          <h2 className="order-details-header">Order Details</h2>
          {isLoading ? (
            <p>Loading order details...</p>
          ) : (
            <div>
              <form onSubmit={handleUpdateOrder}>
                <div className="form-group">
                  <label className="order-details-label">Order Number:</label>
                  <input
                    type="text"
                    name="orderNumber"
                    value={updatedOrder.orderNumber}
                    onChange={handleInputChange}
                   
                  />
                </div>
                {/* Form inputs */}
                <div className="form-group">
                  <label className="order-details-label">Customer:</label>
                  <input
                    type="text"
                    name="customer"
                    value={updatedOrder.customer}
                    onChange={handleInputChange}
                    
                  />
                </div>
                <div className="form-group">
                  <label className="order-details-label">Code:</label>
                  <input
                    type="text"
                    name="code"
                    value={updatedOrder.code}
                    onChange={handleInputChange}
                    readOnly
                  />
                </div>
                <div className="form-group">
                  <label className="order-details-label">Address:</label>
                  <input
                    type="text"
                    name="address"
                    value={updatedOrder.address}
                    onChange={handleInputChange}
                    
                  />
                </div>
                <div className="form-group">
                  <label className="order-details-label">Contact:</label>
                  <input
                    type="text"
                    name="contact"
                    value={updatedOrder.contact}
                    onChange={handleInputChange}
                    
                  />
                </div>
                <div className="form-group">
                  <label className="order-details-label">Order Date:</label>
                  <input
                    type="date"
                    name="orderDate"
                    value={updatedOrder.orderDate}
                    onChange={handleInputChange}
                    
                  />
                </div>
                <div className="form-group">
                  <label className="order-details-label">Exe:</label>
                  <input
                    type="text"
                    name="exe"
                    value={updatedOrder.exe}
                    onChange={handleInputChange}
                    readOnly
                  />
                </div>
                <div className="form-group">
                  <label className="order-details-label">Terms Of Payment:</label>
                  <input
                    type="text"
                    name="CreditPeriod"
                    value={updatedOrder.CreditPeriod}
                    onChange={handleInputChange}
                    
                  />
                </div>
                <div className="form-group">
                  <label className="order-details-label">Mode of Payment:</label>
                  <input
                    type="text"
                    name="Paymentmethod"
                    value={updatedOrder.Paymentmethod}
                    onChange={handleInputChange}
                    
                  />
                </div>
                <p className="order-details-item">
          <span className="order-details-label">Customer Vat:</span> {updatedOrder.CusVatNo}
        </p>
                <div className="form-group">
                  <label className="order-details-label">Status:</label>
                  <select
                    name="status"
                    value={updatedOrder.status}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Approved or Cancel</option>
                    <option value="Approved">Approved</option>
                    <option value="Canceled">canceled</option>
                    <option value="pending">pending</option>
                  </select>
                </div>
                <h3 className="order-details-product-header">Products</h3>
                <table className="order-details-product-table">
                  <thead>
                    <tr>
                      <th className='th-invoice'>Product Code</th>
                      <th className='th-invoice'>Product Name</th>
                      <th className='th-invoice'>Label Price</th>
                      <th className='th-invoice'>Quantity</th>
                      <th className='th-invoice'>Discount</th>
                      <th className='th-invoice'>Unit Price(RS)</th>
                      <th className='th-invoice'>Invoice Total(RS)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.products.map((product, index) => (
                      <tr key={index} className="order-details-product-item">
                        <td>
                          <input
                            type="text"
                            name="productCode"
                            value={updatedOrder.products[index].productCode}
                            onChange={(e) => handleProductInputChange(e, index)}
                            readOnly
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            name="productName"
                            value={updatedOrder.products[index].productName}
                            onChange={(e) => handleProductInputChange(e, index)}
                            readOnly
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            name="labelPrice"
                            value={updatedOrder.products[index].labelPrice}
                            onChange={(e) => handleProductInputChange(e, index)}
                            
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            name="quantity"
                            value={updatedOrder.products[index].quantity}
                            onChange={(e) => handleProductInputChange(e, index)}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            name="discount"
                            value={updatedOrder.products[index].discount}
                            onChange={(e) => handleProductInputChange(e, index)}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            name="unitPrice"
                            value={updatedOrder.products[index].unitPrice}
                            readOnly
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            name="invoiceTotal"
                            value={updatedOrder.products[index].invoiceTotal}
                            readOnly
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table><br/>
                <h3 className='h3-order-admin'>Order Total :RS/= {formatNumbers(calculateTotal())}</h3>
                <button type="submit" className='btn-dealer-history' onClick={handlepassdelaercode}>View Overall Dealer History</button>
                <button type="submit" className='btn-dealer-history' onClick={handleInvoiceHistory}>Invoice-Wise Dealer History</button>
                <button type="submit">Update Order</button>
                
              </form>
            </div>
          )}
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default Oneorder;
