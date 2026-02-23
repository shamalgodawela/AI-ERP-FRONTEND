import React, { useState } from 'react';
import axios from 'axios';
import './addbulk.css';
import { toast } from 'react-toastify';
import UserNavbar from '../../sidebar/UserNavbar/UserNavbar';

const AddbulkProduct = () => {
  const [productData, setProductData] = useState({
    bulkCode: '',
    quantity: '',
    weight: '',
    weightsh:'',
    name:'',
    
    products: [{ productCode: '', weight: '', totweight: '' }]
  });
  const [showProductFields, setShowProductFields] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData({
      ...productData,
      [name]: value
    });
  };

  const handleProductChange = (index, e) => {
    const { name, value } = e.target;
    const updatedProducts = [...productData.products];
    updatedProducts[index] = { ...updatedProducts[index], [name]: value };
    setProductData({
      ...productData,
      products: updatedProducts
    });
  };

  const handleAddProduct = () => {
    setProductData({
      ...productData,
      products: [...productData.products, { productCode: '', weight: '', totweight: '' }]
    });
    setShowProductFields(true);
  };
  
  const handleRemoveProduct = (index) => {
    const updatedProducts = [...productData.products];
    updatedProducts.splice(index, 1);
    setProductData({ ...productData, products: updatedProducts });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      await axios.post('https://nihon-inventory.onrender.com/api/addbulkproduct', productData);
      toast.success('Product added successfully!');
 
      setProductData({
        bulkCode: '',
        quantity: '',
        weight: '',
        weightsh:'',
        name:'',
        
        products: [{ productCode: '', weight: '', totweight: '' }]
      });
      setShowProductFields(false);
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Failed to add product');
    }
  };

  return (
    <div>
      <UserNavbar/><br/><br/><br/>
    <div className="add-product-form">
      <h2>Add Product</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Bulk Code:
          <input
            type="text"
            name="bulkCode"
            value={productData.bulkCode}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Bulk Name:
          <input
            type="text"
            name="name"
            value={productData.name}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Quantity:
          <input
            type="number"
            name="quantity"
            value={productData.quantity}
            onChange={handleChange}
            required
          />
        </label>
        
        <label>
          weight:
          <input
            type="text"
            name="weightsh"
            value={productData.weightsh}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Weight Size: in grams(g)
          <input
            type="number"
            name="weight"
            value={productData.weight}
            onChange={handleChange}
            required
          />
        </label>
        
        {showProductFields && (
          <>
            {productData.products.map((product, index) => (
              <div key={index}>
                <label>
                  Product Code:
                  <input
                    type="text"
                    name="productCode"
                    value={product.productCode}
                    onChange={(e) => handleProductChange(index, e)}
                    required
                  />
                </label>
                
                {index > 0 && <button type="button" onClick={() => handleRemoveProduct(index)}>Remove Product</button>}
              </div>
            ))}
            
            <button type="button" onClick={handleAddProduct}>Add finished product cde belong to This bulk</button>
          </>
        )}
        {!showProductFields && (
          <button type="button" onClick={() => setShowProductFields(true)}>Add finished product code belong to This bulk</button>
        )}
        <button type="submit">Add Products</button>
      </form>
    </div>
    </div>
  );
};

export default AddbulkProduct;
