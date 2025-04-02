import React, { useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import './signup-login.css'

function Login() {
    const { login, error } = useAuth()
    const [formData, setFormData] = useState({
        name: "",
        password: ""
    });

    const handleChange = (e) => {
        setFormData({
        ...formData,
        [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        login(formData); // Chiama il hook per login
      };

    return (
        <div className="container">
        <div className="form-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Name:</label>
                    <input type="name" id="name" name="name" placeholder="Enter your name" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" name="password" placeholder="Choose a password" value={formData.password} onChange={handleChange} required />
                </div>
                {error && <p className="error">{error}</p>}
                <button type="submit" className="submit-btn">Login</button>
            </form>
            <p className="form-text">Don't have an account? <Link to="/signup">Sign Up</Link></p>
        </div>
        </div>
    )
}

export default Login;