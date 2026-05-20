import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import UserNavbar from '../sidebar/UserNavbar/UserNavbar';
import Footer from '../footer/Footer';
import './areaStockReturn.css';

const API_BASE = 'https://nihon-inventory.onrender.com/api';

const initialFormData = {
    invoiceNumber: '',
    productCode: '',
    productName: '',
    price: '',
    quantity: '',
};

const AreaStockReturn = () => {
    const [formData, setFormData] = useState(initialFormData);
    const [returns, setReturns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [invoiceLoading, setInvoiceLoading] = useState(false);
    const [invoiceProducts, setInvoiceProducts] = useState([]);
    const [invoiceInfo, setInvoiceInfo] = useState(null);
    const [selectedProductIndex, setSelectedProductIndex] = useState(null);

    const fetchReturns = useCallback(async () => {
        try {
            const response = await axios.get(`${API_BASE}/area-stock-returns`);
            setReturns(response.data);
        } catch (error) {
            console.error('Error fetching area stock returns:', error);
            toast.error('Failed to load area return details');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchReturns();
    }, [fetchReturns]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (name === 'invoiceNumber') {
            setInvoiceProducts([]);
            setInvoiceInfo(null);
            setSelectedProductIndex(null);
        }
    };

    const handleLoadInvoice = async () => {
        const invoiceNumber = formData.invoiceNumber.trim();
        if (!invoiceNumber) {
            toast.error('Enter invoice number first');
            return;
        }

        setInvoiceLoading(true);
        setInvoiceProducts([]);
        setInvoiceInfo(null);
        setSelectedProductIndex(null);

        try {
            const response = await axios.get(
                `${API_BASE}/invoices/${encodeURIComponent(invoiceNumber)}`
            );
            const invoice = response.data;

            if (!invoice.products || invoice.products.length === 0) {
                toast.warning('Invoice found but has no products');
                setInvoiceInfo({
                    customer: invoice.customer,
                    invoiceDate: invoice.invoiceDate,
                    exe: invoice.exe,
                });
                return;
            }

            setInvoiceProducts(invoice.products);
            setInvoiceInfo({
                customer: invoice.customer,
                invoiceDate: invoice.invoiceDate,
                exe: invoice.exe,
            });

            toast.success(`Loaded ${invoice.products.length} product(s) from invoice`);
        } catch (error) {
            console.error('Failed to fetch invoice:', error);
            const message =
                error.response?.data?.message || 'Invoice not found';
            toast.error(message);
        } finally {
            setInvoiceLoading(false);
        }
    };

    const handleSelectInvoiceProduct = (product, index) => {
        setSelectedProductIndex(index);
        setFormData((prev) => ({
            ...prev,
            productCode: product.productCode || '',
            productName: product.productName || '',
            price: product.unitPrice ?? product.labelPrice ?? '',
            quantity: product.quantity ?? '',
        }));
        toast.info('Product selected — adjust return quantity if needed');
    };

    const handleGetProductDetails = async () => {
        const productCode = formData.productCode.trim();
        if (!productCode) {
            toast.error('Enter product code first');
            return;
        }

        try {
            const response = await axios.get(`${API_BASE}/products/category/${productCode}`);
            const product = response.data;

            setFormData((prev) => ({
                ...prev,
                productName: product.name,
                price: product.price,
            }));
            setSelectedProductIndex(null);

            toast.success('Product details loaded');
        } catch (error) {
            console.error('Failed to fetch product:', error);
            toast.error('Product not found');
        }
    };

    const resetForm = () => {
        setFormData(initialFormData);
        setInvoiceProducts([]);
        setInvoiceInfo(null);
        setSelectedProductIndex(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const response = await axios.post(`${API_BASE}/area-stock-returns`, formData);
            toast.success(response.data.message || 'Area stock return added successfully');
            resetForm();
            await fetchReturns();
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                'Failed to add area stock return';
            toast.error(message);
        } finally {
            setSubmitting(false);
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleString();
    };

    return (
        <div>
            <UserNavbar />
            <div className="area-return-page">
                <h1>Area Stock Return</h1>

                <div className="area-return-form-card area-return-form-card--wide">
                    <form className="area-return-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="invoiceNumber">Invoice Number:</label>
                            <div className="code-row">
                                <input
                                    type="text"
                                    id="invoiceNumber"
                                    name="invoiceNumber"
                                    value={formData.invoiceNumber}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter invoice number"
                                />
                                <button
                                    type="button"
                                    onClick={handleLoadInvoice}
                                    disabled={invoiceLoading}
                                >
                                    {invoiceLoading ? 'Loading...' : 'Load Invoice'}
                                </button>
                            </div>
                        </div>

                        {invoiceInfo && (
                            <div className="invoice-info-banner">
                                <span><strong>Customer:</strong> {invoiceInfo.customer || '-'}</span>
                                <span><strong>Date:</strong> {invoiceInfo.invoiceDate || '-'}</span>
                                <span><strong>Executive:</strong> {invoiceInfo.exe || '-'}</span>
                            </div>
                        )}

                        {invoiceProducts.length > 0 && (
                            <div className="invoice-products-section">
                                <h3>Invoice Products — click a row to fill the form</h3>
                                <div className="invoice-products-table-wrap">
                                    <table className="area-return-table invoice-products-table">
                                        <thead>
                                            <tr>
                                                <th>Product Code</th>
                                                <th>Product Name</th>
                                                <th>Qty</th>
                                                <th>Label Price</th>
                                                <th>Unit Price</th>
                                                <th>Invoice Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {invoiceProducts.map((product, index) => (
                                                <tr
                                                    key={`${product.productCode}-${index}`}
                                                    className={
                                                        selectedProductIndex === index
                                                            ? 'invoice-product-row--selected'
                                                            : 'invoice-product-row'
                                                    }
                                                    onClick={() =>
                                                        handleSelectInvoiceProduct(product, index)
                                                    }
                                                >
                                                    <td>{product.productCode}</td>
                                                    <td>{product.productName}</td>
                                                    <td>{product.quantity}</td>
                                                    <td>{product.labelPrice}</td>
                                                    <td>{product.unitPrice}</td>
                                                    <td>{product.invoiceTotal}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        <div className="form-group">
                            <label htmlFor="productCode">Product Code:</label>
                            <div className="code-row">
                                <input
                                    type="text"
                                    id="productCode"
                                    name="productCode"
                                    value={formData.productCode}
                                    onChange={handleChange}
                                    required
                                />
                                <button type="button" onClick={handleGetProductDetails}>
                                    Get Product Details
                                </button>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="productName">Product Name:</label>
                            <input
                                type="text"
                                id="productName"
                                name="productName"
                                value={formData.productName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="price">Price:</label>
                            <input
                                type="number"
                                id="price"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="quantity">Return Quantity:</label>
                            <input
                                type="number"
                                id="quantity"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleChange}
                                min="1"
                                required
                            />
                        </div>

                        <button className="submit-button" type="submit" disabled={submitting}>
                            {submitting ? 'Adding...' : 'Add Area Return'}
                        </button>
                    </form>
                </div>

                <div className="area-return-table-wrap">
                    <h2>All Area Return Details</h2>
                    {loading ? (
                        <p className="area-return-empty">Loading...</p>
                    ) : returns.length === 0 ? (
                        <p className="area-return-empty">No area return records yet.</p>
                    ) : (
                        <table className="area-return-table">
                            <thead>
                                <tr>
                                    <th>Invoice No</th>
                                    <th>Product Code</th>
                                    <th>Product Name</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                    <th>Added On</th>
                                </tr>
                            </thead>
                            <tbody>
                                {returns.map((row) => (
                                    <tr key={row._id}>
                                        <td>{row.invoiceNumber}</td>
                                        <td>{row.productCode}</td>
                                        <td>{row.productName}</td>
                                        <td>{row.price}</td>
                                        <td>{row.quantity}</td>
                                        <td>{formatDate(row.createdAt)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default AreaStockReturn;
