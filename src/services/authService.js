import axios from "axios"
import {toast} from "react-toastify"

export const BACKEND_URL=process.env.REACT_APP_BACKEND_URL

export const validateEmail=(email)=>{
    return email.match( /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
}
// Register user
export const registerUser =async (userData)=>{
    try {
        const response =await axios.post(`${BACKEND_URL}/api/users/register`, userData, {withCredentials:true})
        if(response.statusText==="OK"){
            toast.success("user registered successfully")
        }
        return response.data
    } catch (error) {
        const message=(
            error.response && error.response.data && error.response.data.message
        ) || error.message || error.toString();
        toast.error(message)
        console.log(error);
        
    }

}
//login user
export const loginUser =async (userData)=>{
    try {
        const response =await axios.post(`${BACKEND_URL}/api/users/login`, userData, {withCredentials:true})
        if(response.statusText==="OK"){
            toast.success("Login Successfull...")
        }
        return response.data
    } catch (error) {
        const message=(
            error.response && error.response.data && error.response.data.message
        ) || error.message || error.toString();
        toast.error(message)
        console.log(error);
        
    }

}
//logout user
export const logoutUser =async ()=>{
    try {
        await axios.get(`${BACKEND_URL}/api/users/logout`,);
     
   
    } catch (error) {
        const message=(
            error.response && error.response.data && error.response.data.message
        ) || error.message || error.toString();
        toast.error(message)
        console.log(error);
        
    }

}
//forgot password
export const forgotPassword =async (userData)=>{
    try {
        const response=await axios.post(`${BACKEND_URL}/api/users/fogotPassword`,userData);
        toast.success(response.data.message);
     
   
    } catch (error) {
        const message=(
            error.response && error.response.data && error.response.data.message
        ) || error.message || error.toString();
        toast.error(message)
        console.log(error);
        
    }

}
////reset password
export const resetPassword =async (userData,resetToken)=>{
    try {
        const response=await axios.put(`${BACKEND_URL}/api/users/resetpassword/${resetToken}`,userData);
        return response.data
   
    } catch (error) {
        const message=(
            error.response && error.response.data && error.response.data.message
        ) || error.message || error.toString();
        toast.error(message)
        console.log(error);
        
    }

}
//get login status
export const getLoginStatus =async ()=>{
    try {
        const response=await axios.get(`${BACKEND_URL}/api/users/loggedin`,);
        return response.data
   
    } catch (error) {
        const message=(
            error.response && error.response.data && error.response.data.message
        ) || error.message || error.toString();
        toast.error(message)
        console.log(error);
        
    }

}