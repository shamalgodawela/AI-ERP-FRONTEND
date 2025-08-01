import React from 'react'
import Footer from '../../../compenents/footer/Footer'
import OrderDetails from '../../../compenents/HandleOrder/allorder/OrderDetails'
import UserNavbar from '../../../compenents/sidebar/UserNavbar/UserNavbar'


const Allorder = () => {
  return (
    <div>
      <UserNavbar/>

        <OrderDetails/>
        <Footer/>
    </div>
  )
}

export default Allorder