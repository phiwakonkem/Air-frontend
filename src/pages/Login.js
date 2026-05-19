import React, { useState } from "react";
import api from "../utils/api";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import {
  toast
} from "react-toastify";

import 'react-toastify/dist/ReactToastify.css';

function Login() {
  const { login } = useAuth();
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post(
        "/api/users/login",
        form
      );

      login(res.data.user, res.data.token);

      toast.success("Login successful!");

      window.location.href = "/";
    } catch (err) {
      toast.error("Login failed");
    }
  };

  return (
    <div style={styles.page}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <h1 style={styles.title}>Welcome Back</h1>

        <p style={styles.subtitle}>Login to your account</p>

        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          style={styles.input}
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          style={styles.input}
          required
        />

        <button type="submit" style={styles.button}>
          Login
        </button>

        <p style={styles.link}>
          Don’t have an account?
          <Link to="/register"> Register</Link>
        </p>
      </form>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(to right, #141e30, #243b55)",
    padding: "20px"  
  },

  card: {
    width: "380px",
    padding: "40px",
    borderRadius: "20px",
    background: "rgba(255,255,255,0.1)",
    backdropFilter: "blur(12px)",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.3)"
  },

  title: {
    color: "#fff",
    margin: 0
  },

  subtitle: {
    color: "#ddd",
    marginBottom: "10px"
  },

  input: {
    padding: "14px",
    borderRadius: "12px",
    border: "none",
    outline: "none",
    fontSize: "15px"
  },

  button: {
    padding: "14px",
    borderRadius: "12px",
    border: "none",
    background: "#ff385c",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "16px"
  },

  form: {
    background: "white",
    padding: "40px",
    borderRadius: "20px",
    width: "380px",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    boxShadow: "0 8px 30px rgba(0,0,0,0.1)"
  },

  link: {
    color: "#fff",
    textAlign: "center"
  }
};

export default Login;