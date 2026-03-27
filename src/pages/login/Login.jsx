import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaEye, FaEyeSlash, FaCheckCircle } from "react-icons/fa"; // Added CheckCircle
import "./Login.css";

const Login = ({ setAuth }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false); // ✅ New state for success message
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || "https://bricks-backend-7wnv.onrender.com";
    const API_URL = rawBaseUrl.endsWith("/") ? rawBaseUrl.slice(0, -1) : rawBaseUrl;

    try {
      const response = await fetch(`${API_URL}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: username, 
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("isAuthenticated", "true");
        if (data.token) localStorage.setItem("token", data.token);
        
        // ✅ Show Success Message
        setLoginSuccess(true);

        // ✅ Wait 1.5 seconds then redirect
        setTimeout(() => {
          setAuth(true);
          navigate("/map");
        }, 1500);

      } else {
        alert(data.message || "Invalid username or password.");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Login Error:", error);
      alert("Cannot reach the server. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        
        {/* Success Overlay */}
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
            <FaUser className="input-icon" />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <FaLock className="input-icon" />
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