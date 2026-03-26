import React, { useEffect } from 'react';
import './dashboard.css';
import UserNavbar from '../../compenents/sidebar/UserNavbar/UserNavbar';


import Footer from '../../compenents/footer/Footer';
import ProductSummary from '../../compenents/product/productSummary/ProductSummary';
import ProductList from '../../compenents/product/productList/ProductList';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../../redux/features/product/productSlice';



const UserDashboard = () => {
  const dispatch = useDispatch();
  const { products, isLoading } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  return (
    <div className="">
        <UserNavbar/>
        <ProductSummary products={products || []} />
        <ProductList
          products={products || []}
          isLoading={isLoading}
          inventoryLinksBase="/user-inventory"
        />
        
        <Footer/>
    
     
     
    </div>
  );
};

export default UserDashboard;
