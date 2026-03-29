import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaCheckCircle } from "react-icons/fa"; 
import "./Login.css";

const Login = ({ setAuth }) => {
  const [username, setUsername] = useState(""); // This will be used as the 'email'
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Dynamic API URL logic
    const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || "https://bricks-backend-7wnv.onrender.com";
    const API_URL = rawBaseUrl.endsWith("/") ? rawBaseUrl.slice(0, -1) : rawBaseUrl;

    try {
      const response = await fetch(`${API_URL}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: username, // Mapping the 'username' input to 'email' field for backend
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // 1. Store Auth Info
        localStorage.setItem("isAuthenticated", "true");
        
        if (data.token) {
          localStorage.setItem("token", data.token);
        }
        
        // 2. Store User Info (Useful for displaying "Welcome, Admin" on dashboard)
        if (data.userName) {
          localStorage.setItem("userName", data.userName);
        }

        setLoginSuccess(true);

        // 3. Brief delay for the success animation, then redirect
        setTimeout(() => {
          setAuth(true);
          navigate("/map");
        }, 1500);
      } else {
        // Stop loading so user can try again
        setIsLoading(false);
        alert(data.message || "Invalid credentials. Please try again.");
      }
    } catch (error) {
      console.error("Login Error:", error);
      setIsLoading(false);
      alert("Cannot connect to Bricks server. Please check your connection.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        {loginSuccess && (
          <div className="success-overlay">
            <FaCheckCircle size={50} color="#C19A6B" />
            <h3>Login Successful</h3>
            <p>Redirecting to dashboard...</p>
          </div>
        )}

        <div className="login-header">
          <div className="logo-placeholder">
            <div className="logo-circle">B</div>
          </div>
          <h2>BRICKS BODYCAM</h2>
          <p className="subtitle">Intelligence Management System</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <input
              type="text"
              placeholder="Email Address"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>

          <button type="submit" className="login-btn" disabled={isLoading || loginSuccess}>
            {isLoading ? "AUTHENTICATING..." : "LOGIN"}
          </button>
        </form>

        <div className="login-footer">
          © 2026 BRICKS DIGITAL SOLUTIONS
        </div>
      </div>
    </div>
  );
};

export default Login;