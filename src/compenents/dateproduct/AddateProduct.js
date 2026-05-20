import React, { useState } from 'react';
import './dateproduct.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import UserNavbar from '../sidebar/UserNavbar/UserNavbar';
import Footer from '../footer/Footer';

const initialFormData = {
    GpnDate: '',
    BulkGRN: '',
    productName: '',
    category: '',
    unitPrice: '',
    numberOfUnits: '',
    packsize: ''
};

const AddateProduct = () => {
    const [formData, setFormData] = useState(initialFormData);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`https://nihon-inventory.onrender.com/api/dateProducts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to add product');
            }

            console.log('Product added successfully:', data);
            toast.success(data.message || 'Product added successfully!');
            setFormData(initialFormData);
        } catch (error) {
            console.error('Error adding product:', error.message);
            toast.error(error.message || 'Failed to add product. Please try again.');
        }
    };

    const handleGetProductDetails = async () => {
        const productCode = formData.category;

        try {
            const response = await axios.get(`https://nihon-inventory.onrender.com/api/products/category/${productCode}`);
            const product = response.data;

            setFormData((prevFormData) => ({
                ...prevFormData,
                productName: product.name,
                unitPrice: product.price,
            }));

            toast.success('Product details fetched successfully', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } catch (error) {
            console.error('Failed to fetch product details', error.message);
            toast.error('Product not found', {
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

    return (
        <div>
            <UserNavbar/>
        <div className="add-product-container">
            <h1 className='h1add'>Add daily packing details</h1>
            <form className="add-product-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="GpnDate">GPN Date:</label>
                    <input type="date" id="GpnDate" name="GpnDate" value={formData.GpnDate} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="BulkGRN">Bulk GRN:</label>
                    <input type="text" id="BulkGRN" name="BulkGRN" value={formData.BulkGRN} onChange={handleChange} required placeholder="e.g. BAG992025" />
                </div>
                <div className="form-group">
                    <label htmlFor="category">Product Code:</label>
                    <input type="text" id="category" name="category" value={formData.category} onChange={handleChange} required />
                    <button type="button" onClick={handleGetProductDetails}>Get Product Details</button>
                </div>

                <div className="form-group">
                    <label htmlFor="productName">Product Name:</label>
                    <input type="text" id="productName" name="productName" value={formData.productName} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label htmlFor="packsize">Pack Size:</label>
                    <input type="text" id="packsize" name="packsize" value={formData.packsize} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label htmlFor="unitPrice">Unit Price:</label>
                    <input type="number" id="unitPrice" name="unitPrice" value={formData.unitPrice} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label htmlFor="numberOfUnits">Number of Units:</label>
                    <input type="number" id="numberOfUnits" name="numberOfUnits" value={formData.numberOfUnits} onChange={handleChange} required />
                </div>

                <button className="submit-button" type="submit">Add Product</button>
            </form>
        </div>
        <Footer/>
        </div>
    );
};

export default AddateProduct;
