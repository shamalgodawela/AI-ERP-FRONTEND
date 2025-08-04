import axios from 'axios';
import React, { useState } from 'react'
import 'react-toastify/dist/ReactToastify.css';
import NavBar from '../../compenents/sidebar/NavBar';
import Footer from '../../compenents/footer/Footer';
import './NandRprodcut.css'
import { ToastContainer, toast } from 'react-toastify';

const NandRproduct = () => {

  const [formdata, setformdata]= useState({
    invoiceNo:'',
    InvoiceDte:'',
    Customer:'',
    ProductCode:'',
    productName:'',
    quanity:'',
    value:'',
    reason:'',

  })


  const handleChange =(e)=>{
    const {name, value}=e.target;
    setformdata({
      ...formdata,
      [name]:value
    });

  }

  const handleSubmit=async(e)=>{
    e.preventDefault();

    try {

        const addproduct=await axios.post('https://nihon-inventory.onrender.com/api/addRAndNProduct', formdata);
      console.log(addproduct.data)
      toast.success('Customer added successfully');
      
      console.log('added successfully')
      

      setformdata({
        invoiceNo:'',
        InvoiceDte:'',
        Customer:'',
        ProductCode:'',
        productName:'',
        quanity:'',
        value:'',
        reason:'',

      })
      
      
    } catch (error) {
      
      console.error(error);
      toast.error('error adding product')
      
    }
  }
  return (
    <div>
      <NavBar/>

      <h1 className='h1-return'>Add return details or new product inserting details</h1>
    <div className='Form-add-product'>
      <form onSubmit={handleSubmit} className='form-return-new-product'>

        <label>Invoice Number:</label>
        <input type='text' name='invoiceNo'value={formdata.invoiceNo} onChange={handleChange} required/>

        <label>Invoice Date:</label>
        <input type='date' name='InvoiceDte'value={formdata.InvoiceDte} onChange={handleChange} required/>

        <label>Customer:</label>
        <input type='text' name='Customer'value={formdata.Customer} onChange={handleChange}required/>

        <label>Product Code:</label>
        <input type='text' name='ProductCode'value={formdata.ProductCode} onChange={handleChange} required/>

        <label>Product Name:</label>
        <input type='text' name='productName'value={formdata.productName} onChange={handleChange} required/>

        <label>Quantity:</label>
        <input type='text' name='quanity'value={formdata.quanity} onChange={handleChange} required/>

        <label>Value:</label>
        <input type='text' name='value'value={formdata.value} onChange={handleChange} required/>

        <label>Reason:</label>
        <input type='text' name='reason'value={formdata.reason} onChange={handleChange} required/>
        <button type="submit">Add Product</button>



      </form>

    </div>

    <Footer/>
    </div>
  )
}

export default NandRproduct