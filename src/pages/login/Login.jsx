import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaGlobe } from "react-icons/fa";
import "./Login.css";

const Login = ({ setAuth }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false); // New: Loading state
  const navigate = useNavigate();

  // Get the URL from your Vercel Environment Variables
  const API_URL = import.meta.env.VITE_API_BASE_URL || "https://bricks-backend-7wnv.onrender.com";

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Successful login
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("token", data.token); // Store your JWT if you have one
        setAuth(true);
        navigate("/map");
      } else {
        // Error from backend (e.g., wrong password)
        alert(data.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login Error:", error);
      alert("Server is waking up or unreachable. Please try again in 30 seconds.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <div className="login-logo">
          <div className="logo-circle">B</div>
          <h2>BRICKS BODYCAM</h2>
          <p>Intelligence Management System</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          {/* ... User and Password Inputs stay the same ... */}
          
          <button type="submit" className="login-btn" disabled={isLoading}>
            {isLoading ? "AUTHENTICATING..." : "LOGIN"}
          </button>
        </form>

        <div className="login-footer">
          © 2026 BRICKS MURSTEN MATTONI TECHNOLOGY
        </div>
      </div>
    </div>
  );
};

export default Login;