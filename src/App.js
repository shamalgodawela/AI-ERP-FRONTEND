import {BrowserRouter, Routes, Route} from "react-router-dom"
import Home from "./pages/Home/Home";
import axios from "axios";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { getLoginStatus } from "./services/authService";
import { SET_LOGIN } from "./redux/features/auth/authSlice";
import Mlogin from "./pages/MainLogin/Mlogin";
import AuthError from "./pages/MainLogin/AuthError";
import AdminRoute from "./routes/AdminRoute";
import UserRoute from "./routes/UserRoute";
import AccountRoute from "./routes/AccountRoute";
import OperationRoute from "./routes/OperationRoute";

axios.defaults.withCredentials= true;

function App() {
  const dispatch =useDispatch();

  useEffect(()=>{
    async function loginStatus(){
      const status=await getLoginStatus()
      dispatch(SET_LOGIN(status))
    }
    loginStatus()

  },[dispatch])

  return (
   <BrowserRouter>
   <ToastContainer />
   <Routes>

{/* -----------------------------------common pages---------------------------------- */}
    <Route path="/" element={<Home/>}/>
    <Route path="/All-in-one-Login" element={<Mlogin/>}/>
    <Route path="/Unotherized" element={<AuthError/>}/>

 {/* -----------------------------------Departments---------------------------------- */}
  
  {AdminRoute()}
  {UserRoute()}
  {AccountRoute()}
  {OperationRoute()}

{/* --------------------------------------------------------------------------------- */}
  </Routes>
   </BrowserRouter>
  );
}

export default App;      