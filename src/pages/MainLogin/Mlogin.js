import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../services/AuthProvider';
import { toast } from 'react-toastify';

const Mlogin=()=>{
    const {setUser}=useAuth();
    const navigate=useNavigate();
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const [loading,setLoading]=useState(false);

    const handleSubmit=async (e)=>{
        e.preventDefault();
        setLoading(true);

        try {
            const response=await axios.post("http://localhost:5000/api/users/login",{email,password});
            const userdata=response.data

            setUser(userdata);
            toast.success("Login successful!");

            if(userdata.role==="admin"){
                navigate("/alloutstanding");
            }else if(userdata.role==="user"){
                navigate("/dashboard");
            }
            else{
                navigate("/Unotherized");
            }
        } catch (error) {
            console.error("Login error:", error);
            toast.error("Login failed. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    }

    const handleEmailChange=(e)=>{
       setEmail(e.target.value);
    }

    const handlePasswordChange=(e)=>{
       setPassword(e.target.value);
    }





    return(
        <div>
            <h1>Main Login</h1>
            <form onSubmit={handleSubmit}>
                <input 
                    type="email" 
                    placeholder="Email" 
                    value={email} 
                    onChange={handleEmailChange}
                    required
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={handlePasswordChange}
                    required
                />
                <button type="submit" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>
        </div>
    )
}

export default Mlogin;