import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../services/AuthProvider';
import { toast } from 'react-toastify';
import './Mlogin.css';
import logo from '../../assets/nihon.png';

const Mlogin = () => {
    const { setUser } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post("https://nihon-inventory.onrender.com/api/users/login", { email, password });
            const userdata = response.data

            console.log('Mlogin - Setting user data:', userdata);
            setUser(userdata);
            console.log('Mlogin - User data set successfully');
            toast.success("Login successful!");

            if (userdata.role === "admin") {
                navigate("/admin-profile");
            } else if (userdata.role === "user") {
                navigate("/User-dashboard");
            }
            else if (userdata.role === "executive") {
                navigate("/Exedahsboard");
            }
            else if (userdata.role === "Operation") {
                navigate("/Admin-operations-dashboard");
            }
            else if (userdata.role === "account") {
                navigate("/account-dash");
            }
            else {
                navigate("/Unotherized");
            }
        } catch (error) {
            console.error("Login error:", error);
            toast.error("Login failed. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    }

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    }

    return (
        <div className="mlogin-bg">
            <div className="mlogin-container">
                <div className="mlogin-logo-wrap">
                    <img src={logo} alt="ERP Login" className="mlogin-logo" />
                </div>
                <h1 className="mlogin-title">Welcome Back</h1>
                <p className="mlogin-subtitle">Sign in to your ERP account</p>
                <form className="mlogin-form" onSubmit={handleSubmit} autoComplete="off">
                    <input
                        className="mlogin-input"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={handleEmailChange}
                        required
                        autoFocus
                    />
                    <input
                        className="mlogin-input"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={handlePasswordChange}
                        required
                    />
                    <button className="mlogin-btn" type="submit" disabled={loading}>
                        {loading ? <span className="mlogin-loader"></span> : "Agri Login"}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Mlogin;