import React, { useState } from 'react';
import axios from 'axios';
import './Inventory.css';
import UserNavbar from '../../compenents/sidebar/UserNavbar/UserNavbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AreaInventory = () => {
  const [formData, setFormData] = useState({
    area: '',
    owner: '',
    products: [
      { productName: '', productCode: '', quantity: 0, labelPrice: '', discount: '', unitPrice: '' }
    ]
  });

  // Handle input change
  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const updatedProducts = [...formData.products];

    if (name === 'area' || name === 'owner') {
      setFormData({ ...formData, [name]: value });
      return;
    }

    updatedProducts[index][name] = name === 'quantity' ? parseInt(value) : value;

    // If discount changes, auto-calculate unitPrice
    if (name === 'discount') {
      const labelPrice = parseFloat(updatedProducts[index].labelPrice) || 0;
      const discount = parseFloat(value) || 0;
      const unitPrice = labelPrice - (labelPrice * discount / 100);
      updatedProducts[index].unitPrice = unitPrice.toFixed(2);
    }

    setFormData({ ...formData, products: updatedProducts });
  };

  // Add new product row
  const addProduct = () => {
    setFormData({
      ...formData,
      products: [...formData.products, { productName: '', productCode: '', quantity: 0, labelPrice: '', discount: '', unitPrice: '' }]
    });
  };

  // Remove product row
  const removeProduct = (index) => {
    const updatedProducts = [...formData.products];
    updatedProducts.splice(index, 1);
    setFormData({ ...formData, products: updatedProducts });
  };

  // Autofill product details by product code
  const handleGetProductDetails = async (index) => {
    const productCode = formData.products[index].productCode.trim();
    if (!productCode) {
      toast.error('Enter product code first');
      return;
    }

    try {
      const response = await axios.get(`https://nihon-inventory.onrender.com/api/products/category/${productCode}`);
      const { name, price } = response.data; // adjust if your API returns different keys

      const updatedProducts = [...formData.products];
      updatedProducts[index].productName = name;
      updatedProducts[index].labelPrice = price;
      // Recalculate unitPrice if discount already exists
      const discount = parseFloat(updatedProducts[index].discount) || 0;
      updatedProducts[index].unitPrice = (price - (price * discount / 100)).toFixed(2);

      setFormData({ ...formData, products: updatedProducts });

      toast.success('Product details fetched successfully');
    } catch (error) {
      console.error('Error fetching product details:', error);
      toast.error('Failed to fetch product details');
    }
  };

  // Submit inventory
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://nihon-inventory.onrender.com/api/inventory/add-inventory', formData);
      toast.success('Inventory added successfully!');
      setFormData({ area: '', owner: '', products: [{ productName: '', productCode: '', quantity: 0, labelPrice: '', discount: '', unitPrice: '' }] });
    } catch (error) {
      console.error(error);
      toast.error('Failed to add inventory.');
    }
  };

  return (
    <div>
      <UserNavbar />
      <div className="inventory-form-container">
        <h2>Add Inventory</h2>
        <form onSubmit={handleSubmit} className="inventory-form">
        <div className="form-group">
  <label>Inventory Area:</label>
  <select
    name="area"
    value={formData.area}
    onChange={handleChange}
    required
  >
    <option value="Kalpitiya">Kalpitiya</option>
    <option value="Main Stock">Mr.Ahamed_kalmunei</option>
    <option value="SOUTH">SOUTH</option>

  </select>
</div>


<div className="form-group">
  <label>Owner:</label>
  <select
    name="owner"
    value={formData.owner}
    onChange={handleChange}
    required
  >
    <option value="">Select owner</option>
    <option value="Mr.Arshad">Mr.Arshad</option>
    <option value="Mr.Ahamed">Mr.Ahamed</option>
    <option value="SOUTH">SOUTH</option>
  </select>
</div>


          <h3>Products</h3>
          {formData.products.map((product, index) => (
            <div key={index} className="product-group">
              <div className="form-group">
                <label>Product Code:</label>
                <input
                  type="text"
                  name="productCode"
                  value={product.productCode}
                  onChange={(e) => handleChange(e, index)}
                  placeholder="Enter product code"
                  required
                />
                <button
                  type="button"
                  className="add-btn"
                  onClick={() => handleGetProductDetails(index)}
                >
                  Get Details
                </button>
              </div>

              <div className="form-group">
                <label>Product Name:</label>
                <input
                  type="text"
                  name="productName"
                  value={product.productName}
                  onChange={(e) => handleChange(e, index)}
                  placeholder="Product Name"
                  readOnly
                />
              </div>

              <div className="form-group">
                <label>Label Price:</label>
                <input
                  type="text"
                  name="labelPrice"
                  value={product.labelPrice}
                  onChange={(e) => handleChange(e, index)}
                  placeholder="Label Price"
                  readOnly
                />
              </div>

              <div className="form-group">
                <label>Discount (%):</label>
                <input
                  type="number"
                  name="discount"
                  value={product.discount}
                  onChange={(e) => handleChange(e, index)}
                  placeholder="Enter discount %"
                />
              </div>

              <div className="form-group">
                <label>Unit Price:</label>
                <input
                  type="text"
                  name="unitPrice"
                  value={product.unitPrice}
                  onChange={(e) => handleChange(e, index)}
                  placeholder="Unit Price"
                  readOnly
                />
              </div>

              <div className="form-group">
                <label>Quantity:</label>
                <input
                  type="number"
                  name="quantity"
                  value={product.quantity}
                  onChange={(e) => handleChange(e, index)}
                  placeholder="Enter quantity"
                  required
                />
              </div>

              <button type="button" className="remove-btn" onClick={() => removeProduct(index)}>
                Remove Product
              </button>
            </div>
          ))}

          <button type="button" className="add-btn" onClick={addProduct}>
            Add Product
          </button>

          <button type="submit" className="submit-btn">
            Submit Inventory
          </button>
        </form>
        <ToastContainer position="top-right" autoClose={2000} />
      </div>
    </div>
  );
};

export default AreaInventory;
