import React, { useEffect, useState } from 'react'
import NavBar from '../../../compenents/sidebar/NavBar'
import { Link } from 'react-router-dom'
import axios from 'axios';
import './getalluse.css'

const Getalluse = () => {
  const [stationeryUseData, setStationeryUseData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStationeryUseData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/getalluse');
        setStationeryUseData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching stationary usage data:', error);
      }
    };

    fetchStationeryUseData();
  }, []);
  return (
    <div>
        <NavBar/>
        <Link to="/addstationeryUse">
        <button id='btnoffice'>add use notes</button>
        </Link>

        <div className="stationery-usage-container">
  <h2 className="stationery-usage-heading">Stationery Usage Data</h2>
  {loading ? (
    <p>Loading...</p>
  ) : (
    <table className="stationery-usage-table">
      <thead>
        <tr>
          <th className="stationery-usage-table-header">Code</th>
          <th className="stationery-usage-table-header">Name</th>
          <th className="stationery-usage-table-header">Used By</th>
          <th className="stationery-usage-table-header">Quantity</th>
        </tr>
      </thead>
      <tbody>
        {stationeryUseData.map((item, index) => (
          <tr key={index} className="stationery-usage-table-row">
            <td className="stationery-usage-table-data">{item.codeuse}</td>
            <td className="stationery-usage-table-data">{item.name}</td>
            <td className="stationery-usage-table-data">{item.usedBy}</td>
            <td className="stationery-usage-table-data">{item.quantity}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )}
</div>

        


    </div>
  )
}

export default Getalluse