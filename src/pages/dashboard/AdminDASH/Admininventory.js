import React from 'react';
import AdminnavBar from '../../../compenents/AdminNavbar/AdminnavBar';
import ProductSummary from '../../../compenents/product/productSummary/ProductSummary';
import ProductList from '../../../compenents/product/productList/ProductList';
import Footer from '../../../compenents/footer/Footer';
import Dashboard from '../Dashboard';
import { useNavigate } from 'react-router-dom';


const Admininventory=()=> {
    const navigate = useNavigate();



    return (
        <div>
            <AdminnavBar/>
            <Dashboard/>
      <button className="home-btn" onClick={() => navigate('/admin-profile')}>Home</button>
      <Footer/>
            
        </div>
    );
}

export default Admininventory;