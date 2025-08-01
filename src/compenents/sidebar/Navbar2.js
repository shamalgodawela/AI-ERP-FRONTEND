// import React, { useState } from 'react';
// import * as FaIcons from 'react-icons/fa';
// import * as AiIcons from 'react-icons/ai';
// import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
// import { SidebarData2 } from './SidebarData2';
// import './Navbar.css';
// import { IconContext } from 'react-icons';
// import { logoutUser } from '../../services/authService';
// import { SET_LOGIN, selectName } from '../../redux/features/auth/authSlice';
// import { useDispatch, useSelector } from 'react-redux';
// import { LuRefreshCw } from "react-icons/lu";
// import { IoMdArrowRoundBack } from "react-icons/io";
// import { FaHome } from "react-icons/fa";

// // Action type
// const NAVIGATE_BACK = 'NAVIGATE_BACK';

// function Navbar2() {
//   const RefreshButton = () => {
//     const handleRefresh = () => {
//       window.location.reload();
//     };

//     return (
//       <Link onClick={handleRefresh} className="refresh-button"><LuRefreshCw size={23} /></Link>
//     );
//   };

//   const dispatch=useDispatch()
//   const navigate=useNavigate() // Initialize useNavigate instead of useHistory
//   const name=useSelector(selectName)

//   const logout=async()=>{
//     await logoutUser();
//     await dispatch(SET_LOGIN(false));
//     navigate("/login");
//   }

//   const [sidebar, setSidebar] = useState(false);

//   const showSidebar = () => setSidebar(!sidebar);

//   const goBack = () => {
//     // Use navigate(-1) to navigate back
//     navigate(-1);
//   };
  

//   return (
//     <div>
//       <IconContext.Provider value={{ color: '#fff' }}>
//         <div className='navbar'>
//           <Link to='#' className='menu-bars'>
//             <FaIcons.FaBars onClick={showSidebar} />
//           </Link>
//         </div>
//         <nav className={`nav-menu ${sidebar ? 'nav-menu-open' : 'nav-menu-closed'}`}>
//           <ul className='nav-menu-items' onClick={showSidebar}>
//             <li className='navbar-toggle'>
//               <Link to='#' className='menu-bars'>
//                 <AiIcons.AiOutlineClose />
//               </Link>
//             </li>
//             {SidebarData2.map((item, index) => {
//               return (
//                 <li key={index} className={item.cName}>
//                   <Link to={item.path}>
//                     {item.icon}
//                     <span>{item.title}</span>
//                   </Link>
//                 </li>
//               );
//             })}
//           </ul>
//         </nav>
      
//         <div className="buttons-container">
//           <button id='btnnav' onClick={logout} className='--btn --btn-danger'>Logout</button>
          
//         </div>
//       </IconContext.Provider><br/><br/>
//       <Link to="#" onClick={goBack}><IoMdArrowRoundBack size={23}/></Link>&nbsp;&nbsp;
//       <Link to="/Maindashboard"><FaHome  size={23}/></Link>&nbsp;&nbsp;
    
//       <RefreshButton/>
//     </div>
//   );
// }

// export default Navbar2;
