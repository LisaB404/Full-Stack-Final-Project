import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const useAuth = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [success, setSuccess] = useState("");

  const signup = async (formData) => {
    try {
      const response = await axios.post("/api/signup", formData);
      console.log(response.data);
      setSuccess("Account created successfully!");
      setTimeout(() => navigate("/login"), 2000); // Redirect after registration
    } catch (err) {
      setError(err.response?.data?.message || "Error while signing up");
    }
  };

  const login = async (formData) => {
    try {
      const response = await axios.post("/api/login", formData);
      console.log(response.data);
      // Salva il token JWT e i dati dell'utente nel localStorage
      localStorage.setItem("token", response.data.token);
      // Save user data in local storage
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      navigate("/home"); // Redirect after login
    } catch (err) {
      setError(err.response?.data?.message || "Error while logging in");
    }
  };
  
  const logout = async () => {
    try {
      await axios.post("/api/logout", {}, { withCredentials: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
    // Rimuovi il token e i dati dell'utente dal localStorage
    localStorage.removeItem("token");
    /* localStorage.removeItem("user"); */
    navigate("/login");
  };

  return { signup, success, login, logout, error };
};

export default useAuth;