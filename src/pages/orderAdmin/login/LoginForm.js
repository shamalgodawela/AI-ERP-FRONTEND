import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './login.css';
import Loader from '../../../compenents/loader/Loader';

const LoginForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault(); 
    setLoading(true);
    try {
              const response = await fetch(`https://nihon-inventory.onrender.com/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      setLoading(false);
      if (response.ok) {
        toast.success('Login successful');
        navigate("/AllOutstanding");
      } else {
        if (response.status === 404) {
          toast.error('User not found. Please check your email.');
        } else if (response.status === 401) {
          toast.error('Incorrect email or password. Please try again.');
        } else {
          toast.error('An error occurred. Please try again later.');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className='backgroud-admin'>
      {loading && <Loader />}
      <br/><br/><br/><br/><br/><br/>
      <div className="login-form-container">
        <h2>Admin Login</h2>
        <form onSubmit={handleLogin} className="login-form">
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit">Login</button>
          <a href='/' className='a-login'>Home</a><br/>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default LoginForm;
