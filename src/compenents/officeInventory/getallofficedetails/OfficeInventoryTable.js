import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './OfficeInventory.css';
import { SpinnerImg } from '../../loader/Loader'; // Import loading spinner

const OfficeInventoryTable = () => {
  const [inventoryList, setInventoryList] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // State for loading indicator

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setIsLoading(true); // Set loading to true when fetching starts
        const response = await axios.get('http://localhost:5000/api/alloffice');
        setInventoryList(response.data);
        setIsLoading(false); // Set loading to false when fetching completes
      } catch (error) {
        console.error('Error fetching inventory:', error);
        setIsLoading(false); // Set loading to false in case of error
      }
    };

    fetchInventory();
  }, []);

  return (
   
    <div className="office-inventory-container">
      
      <Link to="/additems">
        <button id='btnaddin'>Add office Inventory</button>
      </Link><br/><br/>
      <Link to="/viewstationery">
        <button id='btnoffice'>view stationery items</button>
      </Link><br/><br/>
      <Link to="/getallusestationery">
        <button id='btnoffice'>items used notes</button>
      </Link>
      <h2 className='h2office'>Office Inventory List</h2>
      {isLoading ? (
        <SpinnerImg />
      ) : (
        <table>
          <thead>
            <tr>
              <th id='thoffice'>Code Number</th>
              <th id='thoffice'>Model</th>
              <th id='thoffice' >Type</th>
              <th id='thoffice'>Date of Purchase</th>
              <th id='thoffice'>Value:</th>
              <th id='thoffice'>Warranty Period</th>
              <th id='thoffice'>Used By</th>
            </tr>
          </thead>
          <tbody>
            {inventoryList.map((item) => (
              <tr key={item._id}>
                <td>{item.codeNumber}</td>
                <td>{item.model}</td>
                <td>{item.type}</td>
                <td>{item.dateOfPurchase}</td>
                <td>{item.value}</td>
                <td>{item.warrantyPeriod}</td>
                <td>{item.usedBy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OfficeInventoryTable;
