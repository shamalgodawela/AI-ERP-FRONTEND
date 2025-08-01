import React from 'react';
import './dashboard.css';
import UserNavbar from '../../compenents/sidebar/UserNavbar/UserNavbar';

import Dashboard from '../dashboard/Dashboard';
import Footer from '../../compenents/footer/Footer';



const UserDashboard = () => {
  return (
    <div className="">
        <UserNavbar/>
        <Dashboard/>
        <Footer/>
    
     
     
    </div>
  );
};

export default UserDashboard;
