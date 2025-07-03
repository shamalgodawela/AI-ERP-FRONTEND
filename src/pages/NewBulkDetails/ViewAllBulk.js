import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavBar from '../../compenents/sidebar/NavBar';
import Footer from '../../compenents/footer/Footer';

const ViewAllBulk = () => {

    const [bulk, setbulk]=useState([]);
    const[loading, setloading]=useState(true);


    useEffect(()=>{
        const fetchdetails= async()=>{
            try {

                const response= await axios.get('http://localhost:5000/api/get-allbulk-details');
                setbulk(response.data)
                setloading(false);

                
            } catch (error) {
                console.error(error);
                toast.error('Error fetching data');
                setloading(false);
                
            }
        }
        fetchdetails();

    },[])

    if (loading) {
        return <div>Loading...</div>;
      }



  return (
    <div>
        <NavBar/>

        <h1 className='h1-return'>All Added Bulk details</h1>
      <ToastContainer /> 
      <div className='view-all-product-table'>
        <table>
          <thead>
            <tr>
              <th className='td-return'>Product Name</th>
              <th className='td-return'>Bulk Code</th>
              <th className='td-return'>Quantity</th>
              <th className='td-return'>Inserted Date</th>
              <th className='td-return'>Vehicle No</th>
              <th className='td-return'>Driver Name</th>
              <th className='td-return'>Driver ID</th>
              
            </tr>
          </thead>
          <tbody>
            {bulk.map((bd, index) => (
              <tr key={index}>
                <td className='td-return'>{bd.ProductName}</td>
                <td className='td-return'>{bd.BulkCode}</td>
                <td className='td-return'>{bd.quantity}</td>
                <td className='td-return'>{bd.InsertedDate}</td>
                <td className='td-return'>{bd.VehicleNo}</td>
                <td className='td-return'>{bd.DriverName}</td>
                <td className='td-return'>{bd.DriverId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Footer/>
    </div>
  )
}

export default ViewAllBulk