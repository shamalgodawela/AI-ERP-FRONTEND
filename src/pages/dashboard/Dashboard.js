import React, { useEffect } from 'react'
import { SET_LOGIN, selectName } from '../../redux/features/auth/authSlice'
import useRedirectLoggedOutUser from '../../customHook/useRedirectLoggedOutUser';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsLoggedIn } from '../../redux/features/auth/authSlice';
import { getProducts } from '../../redux/features/product/productSlice';
import ProductList from '../../compenents/product/productList/ProductList';
import ProductSummary from '../../compenents/product/productSummary/ProductSummary';





const Dashboard = () => {

 
  const name=useSelector(selectName)
  useRedirectLoggedOutUser("/login");

  const dispatch=useDispatch()


  const isLoggedin= useSelector(selectIsLoggedIn)
  const {products, isLoading, isError, message} =useSelector((state)=> state.product)

  useEffect(()=>{
    if(isLoggedin===true){
      dispatch(getProducts())
      
    }
    

    if(isError){
      console.log(message);
    }

  }, [isLoggedin, isError, message, dispatch])


  return (
    <div>
      
    
      
      <ProductSummary products={products}/>
      <ProductList products={products} isLoading={isLoading} />

     

     
        
    </div>
  )
}

export default Dashboard