import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import './return.css';
import UserNavbar from '../../compenents/sidebar/UserNavbar/UserNavbar';
import Footer from '../../compenents/footer/Footer';

const API_BASE = 'https://nihon-inventory.onrender.com/api';

const emptyProduct = () => ({
    productCode: '',
    productName: '',
    quantity: '',
    unitPrice: '',
    returntotal: '',
});

const initialMeta = {
    invoiceNumber: '',
    customer: '',
    reason: '',
    date: '',
    remarks: '',
};

const AddReturnDetails = () => {
    const [meta, setMeta] = useState(initialMeta);
    const [returnProducts, setReturnProducts] = useState([]);
    const [invoiceLoading, setInvoiceLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [invoiceProducts, setInvoiceProducts] = useState([]);
    const [invoiceInfo, setInvoiceInfo] = useState(null);
    const [selectedCodes, setSelectedCodes] = useState(new Set());

    const handleMetaChange = (e) => {
        const { name, value } = e.target;
        setMeta((prev) => ({ ...prev, [name]: value }));

        if (name === 'invoiceNumber') {
            setInvoiceProducts([]);
            setInvoiceInfo(null);
            setSelectedCodes(new Set());
            setReturnProducts([]);
        }
    };

    const calcReturnTotal = (quantity, unitPrice) => {
        const q = parseFloat(quantity) || 0;
        const p = parseFloat(unitPrice) || 0;
        return q && p ? (q * p).toFixed(2) : '';
    };

    const handleLoadInvoice = async () => {
        const invoiceNumber = meta.invoiceNumber.trim();
        if (!invoiceNumber) {
            toast.error('Enter invoice number first');
            return;
        }

        setInvoiceLoading(true);
        setInvoiceProducts([]);
        setInvoiceInfo(null);
        setSelectedCodes(new Set());
        setReturnProducts([]);

        try {
            const response = await axios.get(
                `${API_BASE}/invoices/${encodeURIComponent(invoiceNumber)}`
            );
            const invoice = response.data;

            setMeta((prev) => ({
                ...prev,
                invoiceNumber: invoice.invoiceNumber || invoiceNumber,
                customer: invoice.customer || prev.customer,
            }));

            setInvoiceInfo({
                customer: invoice.customer,
                invoiceDate: invoice.invoiceDate,
                exe: invoice.exe,
            });

            if (!invoice.products || invoice.products.length === 0) {
                toast.warning('Invoice found but has no products');
                setInvoiceProducts([]);
                return;
            }

            setInvoiceProducts(invoice.products);
            toast.success(`Loaded ${invoice.products.length} product(s) — select items to return`);
        } catch (error) {
            console.error('Failed to fetch invoice:', error);
            toast.error(error.response?.data?.message || 'Invoice not found');
        } finally {
            setInvoiceLoading(false);
        }
    };

    const buildReturnProduct = (product) => {
        const unitPrice = product.unitPrice ?? product.labelPrice ?? '';
        const quantity = product.quantity ?? '';
        return {
            productCode: product.productCode || '',
            productName: product.productName || '',
            quantity: String(quantity),
            unitPrice: String(unitPrice),
            returntotal: calcReturnTotal(quantity, unitPrice),
        };
    };

    const toggleInvoiceProduct = (product) => {
        const code = product.productCode;
        if (!code) return;

        const nextSelected = new Set(selectedCodes);
        let nextProducts = [...returnProducts];

        if (nextSelected.has(code)) {
            nextSelected.delete(code);
            nextProducts = nextProducts.filter((p) => p.productCode !== code);
        } else {
            nextSelected.add(code);
            if (!nextProducts.some((p) => p.productCode === code)) {
                nextProducts.push(buildReturnProduct(product));
            }
        }

        setSelectedCodes(nextSelected);
        setReturnProducts(nextProducts);
    };

    const handleReturnProductChange = (index, e) => {
        const { name, value } = e.target;
        const updated = [...returnProducts];
        updated[index] = { ...updated[index], [name]: value };

        if (name === 'quantity' || name === 'unitPrice') {
            updated[index].returntotal = calcReturnTotal(
                updated[index].quantity,
                updated[index].unitPrice
            );
        }

        setReturnProducts(updated);
    };

    const handleRemoveReturnProduct = (index) => {
        const code = returnProducts[index]?.productCode;
        const updated = returnProducts.filter((_, i) => i !== index);
        setReturnProducts(updated);

        if (code) {
            const nextSelected = new Set(selectedCodes);
            nextSelected.delete(code);
            setSelectedCodes(nextSelected);
        }
    };

    const handleAddManualProduct = () => {
        setReturnProducts((prev) => [...prev, emptyProduct()]);
    };

    const resetForm = () => {
        setMeta(initialMeta);
        setReturnProducts([]);
        setInvoiceProducts([]);
        setInvoiceInfo(null);
        setSelectedCodes(new Set());
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (returnProducts.length === 0) {
            toast.error('Select at least one product to return');
            return;
        }

        const invalid = returnProducts.some(
            (p) => !p.productCode || !p.quantity || !p.unitPrice
        );
        if (invalid) {
            toast.error('Fill product code, quantity, and unit price for all items');
            return;
        }

        setSubmitting(true);
        try {
            const payload = {
                ...meta,
                products: returnProducts,
            };
            await axios.post(`${API_BASE}/addreturndetails`, payload);
            toast.success('Return details added successfully');
            resetForm();
        } catch (error) {
            console.error('Error adding return details:', error);
            toast.error(error.response?.data?.message || 'Failed to add return details');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="add-return-page">
            <UserNavbar />

            <div className="add-return-content">
                <div className="add-return-header-row">
                    <div>
                        <h1 className="add-return-title">Add Return Details</h1>
                        <p className="add-return-subtitle">
                            Load invoice, select products to return, then submit
                        </p>
                    </div>
                    <Link to="/getallreturn" className="add-return-view-link">
                        View All Returns
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="add-return-form">
                    <section className="add-return-card">
                        <h2>Invoice</h2>
                        <div className="add-return-invoice-row">
                            <div className="form-group">
                                <label htmlFor="invoiceNumber">Invoice Number</label>
                                <input
                                    type="text"
                                    id="invoiceNumber"
                                    name="invoiceNumber"
                                    value={meta.invoiceNumber}
                                    onChange={handleMetaChange}
                                    required
                                    placeholder="Enter invoice number"
                                />
                            </div>
                            <button
                                type="button"
                                className="btn-secondary"
                                onClick={handleLoadInvoice}
                                disabled={invoiceLoading}
                            >
                                {invoiceLoading ? 'Loading...' : 'Load Invoice'}
                            </button>
                        </div>

                        {invoiceInfo && (
                            <div className="add-return-invoice-banner">
                                <span><strong>Customer:</strong> {invoiceInfo.customer || '-'}</span>
                                <span><strong>Invoice Date:</strong> {invoiceInfo.invoiceDate || '-'}</span>
                                <span><strong>Executive:</strong> {invoiceInfo.exe || '-'}</span>
                            </div>
                        )}

                        {invoiceProducts.length > 0 && (
                            <div className="add-return-invoice-products">
                                <h3>Select products to return (multiple allowed)</h3>
                                <div className="add-return-table-scroll">
                                    <table className="add-return-table">
                                        <thead>
                                            <tr>
                                                <th>Select</th>
                                                <th>Code</th>
                                                <th>Name</th>
                                                <th>Invoice Qty</th>
                                                <th>Unit Price</th>
                                                <th>Invoice Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {invoiceProducts.map((product, index) => (
                                                <tr
                                                    key={`${product.productCode}-${index}`}
                                                    className={
                                                        selectedCodes.has(product.productCode)
                                                            ? 'add-return-row--selected'
                                                            : ''
                                                    }
                                                >
                                                    <td>
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedCodes.has(product.productCode)}
                                                            onChange={() => toggleInvoiceProduct(product)}
                                                        />
                                                    </td>
                                                    <td>{product.productCode}</td>
                                                    <td>{product.productName}</td>
                                                    <td>{product.quantity}</td>
                                                    <td>{product.unitPrice}</td>
                                                    <td>{product.invoiceTotal}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </section>

                    <section className="add-return-card">
                        <div className="add-return-section-head">
                            <h2>Return Products ({returnProducts.length})</h2>
                            <button type="button" className="btn-secondary" onClick={handleAddManualProduct}>
                                + Add Manual Product
                            </button>
                        </div>

                        {returnProducts.length === 0 ? (
                            <p className="add-return-hint">
                                Load an invoice and tick products above, or add a product manually.
                            </p>
                        ) : (
                            returnProducts.map((product, index) => (
                                <div key={`${product.productCode}-${index}`} className="add-return-product-card">
                                    <div className="add-return-product-card-head">
                                        <span>Product {index + 1}</span>
                                        <button
                                            type="button"
                                            className="btn-remove"
                                            onClick={() => handleRemoveReturnProduct(index)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                    <div className="add-return-product-grid">
                                        <div className="form-group">
                                            <label>Product Code</label>
                                            <input
                                                type="text"
                                                name="productCode"
                                                value={product.productCode}
                                                onChange={(e) => handleReturnProductChange(index, e)}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Product Name</label>
                                            <input
                                                type="text"
                                                name="productName"
                                                value={product.productName}
                                                onChange={(e) => handleReturnProductChange(index, e)}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Return Quantity</label>
                                            <input
                                                type="number"
                                                name="quantity"
                                                value={product.quantity}
                                                onChange={(e) => handleReturnProductChange(index, e)}
                                                min="1"
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Unit Price</label>
                                            <input
                                                type="number"
                                                name="unitPrice"
                                                value={product.unitPrice}
                                                onChange={(e) => handleReturnProductChange(index, e)}
                                                min="0"
                                                step="0.01"
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Return Total</label>
                                            <input
                                                type="number"
                                                name="returntotal"
                                                value={product.returntotal}
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </section>

                    <section className="add-return-card">
                        <h2>Return Information</h2>
                        <div className="add-return-meta-grid">
                            <div className="form-group">
                                <label htmlFor="customer">Customer</label>
                                <input
                                    type="text"
                                    id="customer"
                                    name="customer"
                                    value={meta.customer}
                                    onChange={handleMetaChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="reason">Reason</label>
                                <input
                                    type="text"
                                    id="reason"
                                    name="reason"
                                    value={meta.reason}
                                    onChange={handleMetaChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="date">Date</label>
                                <input
                                    type="date"
                                    id="date"
                                    name="date"
                                    value={meta.date}
                                    onChange={handleMetaChange}
                                    required
                                />
                            </div>
                            <div className="form-group add-return-remarks">
                                <label htmlFor="remarks">Remarks</label>
                                <input
                                    type="text"
                                    id="remarks"
                                    name="remarks"
                                    value={meta.remarks}
                                    onChange={handleMetaChange}
                                />
                            </div>
                        </div>
                    </section>

                    <button type="submit" className="btn-primary" disabled={submitting}>
                        {submitting ? 'Saving...' : 'Add Return Details'}
                    </button>
                </form>
            </div>

            <Footer />
        </div>
    );
};

export default AddReturnDetails;
