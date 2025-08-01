import React from 'react'
import ProductdateList from '../../../compenents/product/productList/ProductdateList'

import Footer from '../../../compenents/footer/Footer'
import AdminnavBar from '../../../compenents/AdminNavbar/AdminnavBar'

const ProductdateDetails = () => {
  return (
    <div>
        <AdminnavBar/>
        
        <br/><br/><br/>
        <ProductdateList/>
        <br/><br/>
        <Footer/>
    </div>
  )
}

export default ProductdateDetails