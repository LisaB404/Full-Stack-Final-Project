import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const useAuth = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const signup = async (formData) => {
    setLoading(true);
    try {
      await axios.post(`${BACKEND_URL}/api/signup`, formData);
      setSuccess("Account created successfully!");
      setTimeout(() => navigate("/login"), 1000); // Redirect after registration
    } catch (err) {
      setError(err.response?.data?.message || "Error while signing up");
    } finally {
      setLoading(false);
    }
  };

  const login = async (formData) => {
    setLoading(true);
    try {
      const response = await axios.post(`${BACKEND_URL}/api/login`, formData);
      // Save token JWT and user data in localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      navigate("/home"); // Redirect after login
    } catch (err) {
      setError(err.response?.data?.message || "Error while logging in");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${BACKEND_URL}/api/logout`, {}, { withCredentials: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
    // Remove token JWT and user data from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return { signup, success, login, logout, error, loading };
};

export default useAuth;