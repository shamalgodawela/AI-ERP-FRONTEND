import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from '../../compenents/footer/Footer';
import UserNavbar from '../../compenents/sidebar/UserNavbar/UserNavbar';

const UserBulkProduct= () => {

    const [bulk, setbulk]=useState([]);
    const[loading, setloading]=useState(true);
    const [searchYear, setSearchYear] = useState("");
    const [searchMonth, setSearchMonth] = useState("");

    useEffect(()=>{
        const fetchdetails= async()=>{
            try {
                const response= await axios.get('https://nihon-inventory.onrender.com/api/get-allbulk-details');
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

    // Extract unique years and months from InsertedDate
    const years = Array.from(new Set(bulk.map(bd => bd.InsertedDate && bd.InsertedDate.split('-')[0]))).filter(Boolean);
    const months = [
      { value: '', label: 'All Months' },
      { value: '01', label: 'January' },
      { value: '02', label: 'February' },
      { value: '03', label: 'March' },
      { value: '04', label: 'April' },
      { value: '05', label: 'May' },
      { value: '06', label: 'June' },
      { value: '07', label: 'July' },
      { value: '08', label: 'August' },
      { value: '09', label: 'September' },
      { value: '10', label: 'October' },
      { value: '11', label: 'November' },
      { value: '12', label: 'December' },
    ];

    // Filter bulk data by year and month only
    const filteredBulk = bulk.filter(bd => {
      const [year, month] = bd.InsertedDate ? bd.InsertedDate.split('-') : [null, null];
      let matchesYear = true;
      let matchesMonth = true;
      if (searchYear) {
        matchesYear = year === searchYear;
        if (searchMonth) {
          matchesMonth = month === searchMonth;
        }
      } else if (searchMonth) {
        // If year is not selected, ignore month filter
        matchesMonth = true;
      }
      return matchesYear && matchesMonth;
    });

    return (
      <div>
        <UserNavbar/>
        <br/><br/>
        <h1 className='h1-return'> Bulk products details</h1>
        <ToastContainer /> 
        <div className='bulk-search-bar'>
          <select value={searchYear} onChange={e => setSearchYear(e.target.value)} style={{ padding: '10px 14px', borderRadius: '7px', border: '1.5px solid #bdbdbd', fontSize: '1rem', minWidth: '120px' }}>
            <option value="">All Years</option>
            {years.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <select value={searchMonth} onChange={e => setSearchMonth(e.target.value)} style={{ padding: '10px 14px', borderRadius: '7px', border: '1.5px solid #bdbdbd', fontSize: '1rem', minWidth: '120px' }}>
            {months.map(m => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </div>
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
              {filteredBulk.map((bd, index) => (
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

export default UserBulkProduct;