import React from 'react'
import { Link } from 'react-router-dom';
import "./Home.css"
import heroImg from "../../assets/inv3.png"
import Logo from "../../assets/Nihon Logo-03.png"


export const Home = () => {
  return (
    <div className='home'>
      <nav className='container --flex-between'>
        <div className='logo'>
          <img src={Logo} alt='Logo' width={100} height={50} className='logo-c'/>
          <h4 className='c-name'>Nihon Agriculture Holdings (Pvt)Ltd</h4>
        
         

        </div>
        <ul className='home-links'>
            {/* <li>
            <Link to="/register">Register</Link>
          </li>  */}
          <li>
          <button widt="20px" className='--btn --btn-primary'>
             <Link to="/login">Login</Link>
            </button> 
          </li>
            <li>
          <button className='--btn --btn-primary'>
             <Link to="/All-in-one-Login">Main Login</Link>
            </button> 
          </li> 
          <li>
          <button className='--btn --btn-primary'>
             <Link to="/admin-operation-loginpage">Operations Login</Link>
            </button> 
          </li>
          <li>
          <button className='--btn --btn-primary'>
             <Link to="/ExeLogin">Executive Login</Link>
            </button> 
          </li> 


        </ul>
      </nav>
      {/* HERO SECTION */}

      <section className='container hero'>
        <div className='hero-text'>
          <h2>Nihon Agriculture ERP Management System</h2>

          <p className='--color-white'>Inventory system to control and manage products in the warehouse in real time
           and integrate it to make it easier to develop your business.....
        </p>
        <div className='--flex-start'>
          <NumberText num="50+" text="Employees"/>
          <NumberText num="80+" text="Active users"/>
          <NumberText num="200+" text="Dealers"/>
        </div>

        </div>

        
    
        <div className='hero-image'>
          <img src={heroImg} alt="Inventory"/>
          
        </div>
      
      </section>
    </div>
  )
}

const NumberText=({num, text})=>{
  return(
    <div className='--mr'>
      <h3 className='--color-white'>{num}</h3>
      <p className='--color-white'>{text}</p>
    </div>
  )

}


export default Home;