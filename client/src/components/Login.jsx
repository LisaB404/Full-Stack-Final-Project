import React, { useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { Alert } from "antd";
import "./signup-login.css";

function Login() {
  const { login, error, loading } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    login(formData); // Hook for login
  };

  return (
    <div className="container">
      <div className="form-container">
        <h2>Login</h2>
        
        {loading && (
          <Alert
            message="Logging in..."
            description="Please wait while we log you in."
            type="info"
            showIcon
            style={{ marginBottom: "1rem" }}
          />
        )}
        {error && (
          <Alert
            message="Login failed"
            description={error}
            type="error"
            showIcon
            style={{ marginBottom: "1rem" }}
          />
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="name"
              id="name"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Choose a password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit" className="submit-btn" disabled={loading}>
            Login
          </button>
        </form>
        <p className="form-text">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
