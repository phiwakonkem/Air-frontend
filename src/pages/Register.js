import React, { useState } from "react";
import api from "../utils/api";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (form.username.trim().length < 2)
      newErrors.username = "Username must be at least 2 characters";
    if (!form.email.includes("@"))
      newErrors.email = "Enter a valid email address";
    if (form.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    return newErrors;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    try {
      await api.post("/api/users/register", form);
      toast.success("Account created! Please log in.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = () => {
    const p = form.password;
    if (p.length === 0) return null;
    if (p.length < 6) return { label: "Weak", color: "#ff385c", width: "30%" };
    if (p.length < 10) return { label: "Fair", color: "#f5a623", width: "60%" };
    return { label: "Strong", color: "#00a699", width: "100%" };
  };

  const strength = passwordStrength();

  return (
    <div style={styles.page}>
      <div style={styles.left}>
        <img
          src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&auto=format&fit=crop"
          alt="Stay"
          style={styles.heroImage}
        />
        <div style={styles.heroOverlay} />
        <div style={styles.heroText}>
          <h1 style={styles.heroTitle}>Join thousands of happy travellers</h1>
          <p style={styles.heroSub}>Book unique stays across South Africa.</p>
        </div>
      </div>

      <div style={styles.right}>
        <div style={styles.formWrap}>
          <Link to="/" style={styles.logoLink}>
            <span style={styles.logo}>✦ StayEasy</span>
          </Link>

          <h2 style={styles.title}>Create your account</h2>
          <p style={styles.subtitle}>
            Already have an account?{" "}
            <Link to="/login" style={styles.link}>Log in</Link>
          </p>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Username</label>
              <input
                name="username"
                placeholder="John Doe"
                value={form.username}
                onChange={handleChange}
                style={{
                  ...styles.input,
                  ...(errors.username ? styles.inputError : {})
                }}
                required
              />
              {errors.username && (
                <p style={styles.errorMsg}>{errors.username}</p>
              )}
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Email</label>
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                style={{
                  ...styles.input,
                  ...(errors.email ? styles.inputError : {})
                }}
                required
              />
              {errors.email && (
                <p style={styles.errorMsg}>{errors.email}</p>
              )}
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Password</label>
              <input
                name="password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                style={{
                  ...styles.input,
                  ...(errors.password ? styles.inputError : {})
                }}
                required
              />
              {strength && (
                <div style={styles.strengthBar}>
                  <div
                    style={{
                      ...styles.strengthFill,
                      width: strength.width,
                      background: strength.color
                    }}
                  />
                </div>
              )}
              {strength && (
                <p style={{ ...styles.strengthLabel, color: strength.color }}>
                  {strength.label} password
                </p>
              )}
              {errors.password && (
                <p style={styles.errorMsg}>{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              style={{
                ...styles.button,
                opacity: loading ? 0.7 : 1
              }}
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p style={styles.terms}>
            By signing up, you agree to our{" "}
            <span style={styles.link}>Terms</span> and{" "}
            <span style={styles.link}>Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
  },
  left: {
    flex: 1,
    position: "relative",
    overflow: "hidden"
  },
  heroImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    position: "absolute",
    inset: 0
  },
  heroOverlay: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.6))"
  },
  heroText: {
    position: "absolute",
    bottom: "60px",
    left: "40px",
    right: "40px",
    color: "#fff"
  },
  heroTitle: {
    fontSize: "36px",
    fontWeight: "700",
    marginBottom: "12px"
  },
  heroSub: {
    fontSize: "18px",
    opacity: 0.9
  },
  right: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 20px",
    background: "#fff"
  },
  formWrap: {
    width: "100%",
    maxWidth: "400px"
  },
  logoLink: {
    textDecoration: "none",
    display: "block",
    marginBottom: "40px"
  },
  logo: {
    fontSize: "22px",
    fontWeight: "800",
    color: "#ff385c"
  },
  title: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#222",
    marginBottom: "8px"
  },
  subtitle: {
    fontSize: "15px",
    color: "#717171",
    marginBottom: "32px"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px"
  },
  label: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#222"
  },
  input: {
    padding: "14px 16px",
    borderRadius: "12px",
    border: "1.5px solid #ddd",
    fontSize: "15px",
    outline: "none",
    color: "#222"
  },
  inputError: {
    border: "1.5px solid #ff385c"
  },
  errorMsg: {
    fontSize: "13px",
    color: "#ff385c",
    margin: 0
  },
  strengthBar: {
    height: "4px",
    background: "#ebebeb",
    borderRadius: "4px",
    marginTop: "8px",
    overflow: "hidden"
  },
  strengthFill: {
    height: "100%",
    borderRadius: "4px",
    transition: "width 0.3s, background 0.3s"
  },
  strengthLabel: {
    fontSize: "12px",
    fontWeight: "600",
    margin: "4px 0 0"
  },
  button: {
    padding: "16px",
    borderRadius: "12px",
    border: "none",
    background: "#ff385c",
    color: "#fff",
    fontWeight: "700",
    cursor: "pointer",
    fontSize: "16px",
    marginTop: "8px"
  },
  link: {
    color: "#ff385c",
    textDecoration: "none",
    fontWeight: "600"
  },
  terms: {
    fontSize: "13px",
    color: "#717171",
    textAlign: "center",
    lineHeight: 1.6,
    marginTop: "24px"
  }
};

export default Register;