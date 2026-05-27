import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function Cancel() {
  return (
    <div style={styles.page}>
      <Navbar />

      <div style={styles.center}>
        <div style={styles.card}>
          <div style={styles.iconCircle}>✕</div>

          <h1 style={styles.title}>
            Payment cancelled
          </h1>

          <p style={styles.text}>
            Your booking was not completed.
            No charges were made — you can
            try again whenever you're ready.
          </p>

          <div style={styles.buttons}>
            <Link to="/" style={styles.primaryBtn}>
              Explore stays
            </Link>
            <Link
              to="/my-reservations"
              style={styles.secondaryBtn}
            >
              My trips
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f7f7f7",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
  },
  center: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "calc(100vh - 72px)",
    padding: "40px 20px"
  },
  card: {
    background: "#fff",
    borderRadius: "24px",
    padding: "60px 48px",
    textAlign: "center",
    maxWidth: "480px",
    width: "100%",
    boxShadow: "0 4px 40px rgba(0,0,0,0.08)"
  },
  iconCircle: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    background: "#ff385c",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "32px",
    fontWeight: "700",
    margin: "0 auto 24px"
  },
  title: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#222",
    marginBottom: "12px"
  },
  text: {
    fontSize: "16px",
    color: "#717171",
    lineHeight: 1.7,
    marginBottom: "32px"
  },
  buttons: {
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },
  primaryBtn: {
    display: "block",
    background: "#ff385c",
    color: "#fff",
    padding: "16px 28px",
    borderRadius: "12px",
    textDecoration: "none",
    fontWeight: "700",
    fontSize: "15px"
  },
  secondaryBtn: {
    display: "block",
    background: "#fff",
    color: "#222",
    border: "1px solid #ddd",
    padding: "16px 28px",
    borderRadius: "12px",
    textDecoration: "none",
    fontWeight: "600",
    fontSize: "15px"
  }
};

export default Cancel;