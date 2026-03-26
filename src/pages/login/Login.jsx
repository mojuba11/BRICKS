import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";
import "./Login.css";

const Login = ({ setAuth }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Backend URL (from Vercel env or fallback)
  const API_URL =
    import.meta.env.VITE_API_BASE_URL ||
    "https://bricks-backend-7wnv.onrender.com";

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: username, // map username → email
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // ✅ Save auth state
        localStorage.setItem("isAuthenticated", "true");

        if (data.token) {
          localStorage.setItem("token", data.token);
        }

        setAuth(true);
        navigate("/map");
      } else {
        alert(data.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login Error:", error);
      alert("Server is waking up or unreachable. Please try again shortly.");
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
          {/* Username / Email */}
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

          {/* Password */}
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

          {/* Submit */}
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