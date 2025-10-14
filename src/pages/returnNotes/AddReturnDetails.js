import React, { useState } from 'react';
import axios from 'axios';
import './return.css'

import UserNavbar from '../../compenents/sidebar/UserNavbar/UserNavbar';

const AddReturnDetails = () => {
    const [formData, setFormData] = useState({
        products: [{
            productCode: '',
            productName: '',
            quantity: '',
            unitPrice: '',
            returntotal: ''
        }],
        invoiceNumber: '',
        customer: '',
        reason: '',
        date: '',
        remarks: ''
    });

    const handleChange = (e, index) => {
        const { name, value } = e.target;
        if (index === undefined) {
            setFormData({ ...formData, [name]: value });
        } else {
            const products = [...formData.products];
            products[index][name] = value;
            setFormData({ ...formData, products });
        }
    };
    

    const handleAddProduct = () => {
        setFormData({ ...formData, products: [...formData.products, {
            productCode: '',
            productName: '',
            quantity: '',
            unitPrice: '',
            returntotal: ''
        }]});
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const response = await axios.post('https://nihon-inventory.onrender.com/api/addreturndetails', formData);
            console.log('Return details added successfully:', response.data);
            
        } catch (error) {
            console.error('Error adding return details:', error);
            
        }
    };

    return (
        <div>
            <UserNavbar/><br/><br/><br/><br/><br/><br/><br/><br/>
            <h2 className='h2return'>Add Return Details</h2> <br/><br/><br/><br/><br/><br/>
        
        <div className="return-details-container">
    
    
    <form onSubmit={handleSubmit} className="return-details-form">
        {formData.products.map((product, index) => (
            <div key={index} className="product-details">
                <div className="form-group">
                    <label htmlFor={`productCode-${index}`} className="form-label">Product Code:</label>
                    <input type="text" id={`productCode-${index}`} name="productCode" value={product.productCode} onChange={e => handleChange(e, index)} className="form-input" />
                </div>
                <div className="form-group">
                    <label htmlFor={`productName-${index}`} className="form-label">Product Name:</label>
                    <input type="text" id={`productName-${index}`} name="productName" value={product.productName} onChange={e => handleChange(e, index)} className="form-input" />
                </div>
                <div className="form-group">
                    <label htmlFor={`quantity-${index}`} className="form-label">Quantity:</label>
                    <input type="number" id={`quantity-${index}`} name="quantity" value={product.quantity} onChange={e => handleChange(e, index)} className="form-input" />
                </div>
                <div className="form-group">
                    <label htmlFor={`unitPrice-${index}`} className="form-label">Unit Price:</label>
                    <input type="number" id={`unitPrice-${index}`} name="unitPrice" value={product.unitPrice} onChange={e => handleChange(e, index)} className="form-input" />
                </div>
                <div className="form-group">
                    <label htmlFor={`returnTotal-${index}`} className="form-label">Return Total:</label>
                    <input type="number" id={`returnTotal-${index}`} name="returntotal" value={product.returntotal} onChange={e => handleChange(e, index)} className="form-input" />
                </div>
            </div>
        ))}
        <button type="button" onClick={handleAddProduct} className="add-product-btn">Add More Product</button>
        <div className="form-group">
            <label htmlFor="invoiceNumber" className="form-label">Invoice Number:</label>
            <input type="text" id="invoiceNumber" name="invoiceNumber" value={formData.invoiceNumber} onChange={handleChange} className="form-input" />
        </div>
        <div className="form-group">
            <label htmlFor="customer" className="form-label">Customer:</label>
            <input type="text" id="customer" name="customer" value={formData.customer} onChange={handleChange} className="form-input" />
        </div>
        <div className="form-group">
            <label htmlFor="reason" className="form-label">Reason:</label>
            <input type="text" id="reason" name="reason" value={formData.reason} onChange={handleChange} className="form-input" />
        </div>
        <div className="form-group">
            <label htmlFor="date" className="form-label">Date:</label>
            <input type="date" id="date" name="date" value={formData.date} onChange={handleChange} className="form-input" />
        </div>
        <div className="form-group">
            <label htmlFor="remarks" className="form-label">Remarks:</label>
            <input type="text" id="remarks" name="remarks" value={formData.remarks} onChange={handleChange} className="form-input" />
        </div>
        <button type="submit" className="submit-btn">Add Return Details</button>
    </form>
</div>
</div>

    );
};

export default AddReturnDetails;
