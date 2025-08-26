import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Footer from '../../../compenents/footer/Footer';
import NavBar from '../../../compenents/sidebar/NavBar';

const UpdateCustomerForm = () => {
  const { customerId } = useParams();
  const [customer, setCustomer] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    companyName: '',
    contact: '',
    address: '',
    city: '',
    phone: '',
    email: '',
    fax: '',
    district:'',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await axios.get(`https://nihon-inventory.onrender.com/api/customersn/${customerId}`);
        setCustomer(response.data);
        setFormData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch customer details', error.message);
        setError('Failed to fetch customer details');
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [customerId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
              await axios.patch(`https://nihon-inventory.onrender.com/api/customersup/${customerId}`, formData);
      alert('Customer details updated successfully');
    } catch (error) {
      console.error('Failed to update customer details', error.message);
      alert('Failed to update customer details');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <NavBar/>
      <p>Nihon Customer List</p>
      <h1 className='updatecus'>Edit Customer Details</h1>
      <form onSubmit={handleSubmit} className="update-customer-form">
      <div className="form-group">
        <label htmlFor="name">Name:</label>
        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label htmlFor="code">Code:</label>
        <input type="text" id="code" name="code" value={formData.code} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label htmlFor="companyName">Company Name:</label>
        <input type="text" id="companyName" name="companyName" value={formData.companyName} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label htmlFor="contact">Contact:</label>
        <input type="text" id="contact" name="contact" value={formData.contact} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label htmlFor="address">Address:</label>
        <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label htmlFor="fax">District:</label>
        <input type="text" id="fax" name="district" value={formData.district} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label htmlFor="city">City:</label>
        <input type="text" id="city" name="city" value={formData.city} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label htmlFor="phone">Phone:</label>
        <input type="text" id="phone" name="phone" value={formData.phone} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label htmlFor="email">Email:</label>
        <input type="text" id="email" name="email" value={formData.email} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label htmlFor="fax">Fax:</label>
        <input type="text" id="fax" name="fax" value={formData.fax} onChange={handleChange} />
      </div>
      <button type="submit">Update Customer</button>
    </form>
   
    <Footer/>
    </div>
  );
};

export default UpdateCustomerForm;
