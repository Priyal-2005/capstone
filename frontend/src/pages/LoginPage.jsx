import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

axios.defaults.withCredentials = true; 
axios.defaults.baseURL = "http://localhost:8000";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("/auth/login", { email, password });

      // store role + name in localStorage
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("name", res.data.name);

      if (res.data.role === "PATIENT") navigate("/patient");
      if (res.data.role === "DOCTOR") navigate("/doctor");
      if (res.data.role === "ADMIN") navigate("/admin");
    } catch (err) {
      console.log(err)
      alert("Login failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="login-container">
        <div className="login-card">   {/* <-- THIS FIXES THE UI */}
          <h2 className="login-title">Login</h2>
  
          <form onSubmit={submit} className="login-form">
            <input 
              className="login-input"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
  
            <input 
              className="login-input"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
  
            <button className="login-btn">Login</button>
  
            <p className="login-text">
              Don't have an account? <a href="/signup">Sign up</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}