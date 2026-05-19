import React, { useState } from "react";
import api from "../utils/api";
import { Link } from "react-router-dom";

import { toast } from "react-toastify";

function Register() {
  const [form, setForm] = useState({
    username: "",
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
      await api.post(
        `/api/users/register`,
        form
      );

      toast.success("Login successful");
      window.location.href = "/login";

    } catch (err) {
      toast.error("Login failed");
    }
  };

  return (
    <div style={styles.page}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <h1 style={styles.title}>Create Account</h1>

        <p style={styles.subtitle}>
          Join StayEasy today
        </p>

        <input
          name="username"
          placeholder="Username"
          onChange={handleChange}
          style={styles.input}
          required
        />

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
          Register
        </button>

        <p style={styles.link}>
          Already have an account?
          <Link to="/login"> Login</Link>
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

  link: {
    color: "#fff",
    textAlign: "center"
  }
};

export default Register;