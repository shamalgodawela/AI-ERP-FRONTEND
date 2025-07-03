import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./customer.css";
import Footer from '../../compenents/footer/Footer';
import Navbar3 from '../../compenents/sidebar/Navbar3';

const CustomerReg = () => {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
              const response = await axios.post(`http://localhost:5000/api/customers`, formData);
      console.log(response.data);
      toast.success('Customer added successfully');
      setFormData({
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
    } catch (error) {
      console.error('Error adding customer:', error);
      if (error.response && error.response.status === 400) {
        toast.error('Customer already exists');
      } else {
        toast.error('Failed to add customer');
      }
    }
  };

  return (
    <div>
      <Navbar3/>
      <div className="form_wrapper">
        <div className="form_container">
          <div className="title_container">
            <h2>Customer Registration Form</h2>
          </div>
          <div className="row clearfix">
            <div className="">
            <form onSubmit={handleSubmit}>
  <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
  <input type="text" name="code" placeholder="Code" value={formData.code} onChange={handleChange} required />
  {/* Add input fields for other customer details */}
  <input type="text" name="companyName" placeholder="Company Name" value={formData.companyName} onChange={handleChange} required />
  <input type="text" name="contact" placeholder="Contact" value={formData.contact} onChange={handleChange} required />
  <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} required />
  <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} required />
  <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} required/>
  <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange}  />
  <input type="text" name="fax" placeholder="Fax" value={formData.fax} onChange={handleChange} />
  <input type="text" name="district" placeholder="district" value={formData.district} onChange={handleChange} />
  
  <input className="button" type="submit" value="Register" />
</form>

            </div>
          </div>
        </div>
      </div>
      
      <Footer/>
    </div>
  );
}

export default CustomerReg;

