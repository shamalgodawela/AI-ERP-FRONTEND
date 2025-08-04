import axios from 'axios';
import React, { useState } from 'react'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import './BulkNew.css'
import NavBar from '../../compenents/sidebar/NavBar';
import Footer from '../../compenents/footer/Footer';

const AddNewBulk = () => {

    const [formdata,setformdata]=useState({
        ProductName:'',
        BulkCode:'',
        quantity:'',
        VehicleNo:'',
        DriverName:'',
        DriverId:'',
        InsertedDate:'',
    })

    const handleChange=(e)=>{
        const{name,value}=e.target;
        setformdata({
            ...formdata,
            [name]:value
        
        });

    }

    const handleSubmit=async(e)=>{

        e.preventDefault();

        try {

            const addBulk=await axios.post('https://nihon-inventory.onrender.com/api/addNewBulk',formdata)
            console.log(addBulk.data);
            toast.success('Bulk Product added successfully');

            setformdata({
                ProductName:'',
                BulkCode:'',
                quantity:'',
                VehicleNo:'',
                DriverName:'',
                DriverId:'',
                InsertedDate:'',

            })
            
        } catch (error) {
            toast.error('Error adding data')
            console.log(error)
        }

    }



  return (
    <div>

        <NavBar/>
        <div className='Form-data-bulk'>
            <h1 className='h1-add-bulk'>Add New Bulk Product</h1>
            <form onSubmit={handleSubmit} className='form-bulk'>
                <label className='label-bulk-new'>Product Name:</label>
                <input type='text' name='ProductName' value={formdata.ProductName} onChange={handleChange} required/>

                <label className='label-bulk-new'>Bulk Code:</label>
                <input type='text' name='BulkCode' value={formdata.BulkCode} onChange={handleChange} required/>

                <label className='label-bulk-new'>Quantity:</label>
                <input type='text' name='quantity' value={formdata.quantity} onChange={handleChange} required/>

                <label className='label-bulk-new'>Inserted Date:</label>
                <input type='date' name='InsertedDate' value={formdata.InsertedDate} onChange={handleChange} required/>

                <label className='label-bulk-new'>Vehicle No:</label>
                <input type='text' name='VehicleNo' value={formdata.VehicleNo} onChange={handleChange} required/>

                <label className='label-bulk-new'>Driver Name:</label>
                <input type='text' name='DriverName' value={formdata.DriverName} onChange={handleChange} required/>

                <label className='label-bulk-new'>Driver ID:</label>
                <input type='text' name='DriverId' value={formdata.DriverId} onChange={handleChange} required/>

                <button type="submit">Add Product</button>

          
                
          

            </form>




        </div>
        <Footer/>
    </div>
  )
}

export default AddNewBulk