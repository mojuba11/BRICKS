import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaGlobe } from "react-icons/fa";
import "./Login.css";

const Login = ({ setAuth }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Simple mock logic: admin / 123456
    if (username === "admin" && password === "123456") {
      localStorage.setItem("isAuthenticated", "true");
      setAuth(true);
      navigate("/map");
    } else {
      alert("Invalid credentials. Try: admin / 123456");
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
          <div className="input-container">
            <FaUser className="input-icon" />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="input-container">
            <FaLock className="input-icon" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-options">
            <label className="remember-me">
              <input type="checkbox" /> Remember me
            </label>
            <div className="lang-select">
              <FaGlobe /> <span>English</span>
            </div>
          </div>

          <button type="submit" className="login-btn">LOGIN</button>
        </form>

        <div className="login-footer">
          © 2026 BRICKS MURSTEN MATTONI TECHNOLOGY
        </div>
      </div>
    </div>
  );
};

export default Login;