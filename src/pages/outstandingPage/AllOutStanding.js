import React from 'react'
import Footer from '../../compenents/footer/Footer'
import OutStandingTable from '../../compenents/outstandingTable/OutStandingTable'
import { useNavigate } from 'react-router-dom'


const AllOutStanding = () => {
  const navigate = useNavigate();
  return (
    <div>
      
    
      
        <OutStandingTable/>

        <button className="home-btn" onClick={() => navigate('/account-dash')}>Home</button>
        
        <Footer/>

    </div>
  )
}

export default AllOutStanding