import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";
import "./Login.css";

const Login = ({ setAuth }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Cleanly handle the API URL to avoid double slashes //
  const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || "https://bricks-backend-7wnv.onrender.com";
  const API_URL = rawBaseUrl.endsWith("/") ? rawBaseUrl.slice(0, -1) : rawBaseUrl;

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // ✅ Using the specific endpoint from your backend
      const response = await fetch(`${API_URL}/api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: username, // Mapping your input 'username' to the backend 'email'
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // ✅ 1. Update browser storage
        localStorage.setItem("isAuthenticated", "true");
        if (data.token) {
          localStorage.setItem("token", data.token);
        }

        // ✅ 2. Update App.js state
        setAuth(true);

        // ✅ 3. Move to the map
        navigate("/map");
      } else {
        // Handle backend errors (401 Unauthorized, etc)
        alert(data.message || "Invalid email or password.");
      }
    } catch (error) {
      console.error("Login Connection Error:", error);
      alert("Cannot reach the server. It may be waking up (Render Free Tier). Please wait 30 seconds and try again.");
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
          <div className="input-group">
            <FaUser className="input-icon" />
            <input
              type="text"
              placeholder="Email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <FaLock className="input-icon" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

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