import React, { useEffect } from 'react'
import "./ProductSummary.css"
import { AiFillDollarCircle } from "react-icons/ai";
import { BsCart4, BsCartX } from "react-icons/bs";
import { BiCategory } from "react-icons/bi";
import InfoBox from '../../infoBox/InfoBox';
import { useDispatch, useSelector } from 'react-redux';
import { CALC_OUTOFSTOCK, CALC_STORE_VALUE, selectOutOfStock, selectTotalStoreValue } from '../../../redux/features/product/productSlice';

// Icons
const earningIcon = <AiFillDollarCircle size={25} color="#fff" />;
const productIcon = <BsCart4 size={40} color="#fff" />;
const categoryIcon = <BiCategory size={40} color="#fff" />;
const outOfStockIcon = <BsCartX size={40} color="#fff" />;

// Format Amount
export const formatNumbers = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const ProductSummary = ({products}) => {
  const dispatch=useDispatch();
  const totalStockValue=useSelector(selectTotalStoreValue)
  const outOfStoack=useSelector(selectOutOfStock)

  useEffect(()=>{
    dispatch(CALC_STORE_VALUE(products))
    dispatch(CALC_OUTOFSTOCK(products))
  }, [dispatch, products])

  return (
    <section className='product-summary-container'>
      <h2 className='product-summary-title'>Inventory Summary</h2>
      <div className='product-summary-cards'>
        <div className='product-summary-card'>
          <InfoBox icon={productIcon} title={"Total Products"} count={products ? products.length : 0} bgColor="card1"/>
        </div>
        <div className='product-summary-card'>
          <InfoBox  title={"Total Value"} count={`RS/= ${formatNumbers(totalStockValue.toFixed(2))}`} bgColor="card2"/>
        </div>
        <div className='product-summary-card'>
          <InfoBox icon={outOfStockIcon} title={"Out of stock"} count={outOfStoack} bgColor="card3"/>
        </div>
      </div>
    </section>
  )
}

export default ProductSummary