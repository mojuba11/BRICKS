import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";
import "./Login.css";

const Login = ({ setAuth }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // ... logic ...
    setAuth(true);
    navigate("/map");
  };

  return (
    <div className="login-page">
      <div className="login-box">
        
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
              placeholder="Username / Email"
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