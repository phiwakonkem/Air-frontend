import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function Success() {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const createReservation = async () => {
      if (sessionStorage.getItem("bookingDone")) {
        setStatus("success");
        return;
      }

      const bookingData = JSON.parse(
        localStorage.getItem("bookingData")
      );

      if (!bookingData) {
        setStatus("success");
        return;
      }

      try {
        await api.post("/api/reservations", bookingData);
        sessionStorage.setItem("bookingDone", "true");
        localStorage.removeItem("bookingData");
        setStatus("success");
      } catch (err) {
        console.log(err);
        setStatus("error");
      }
    };

    createReservation();
  }, []);

  return (
    <div style={styles.page}>
      <Navbar />

      <div style={styles.center}>
        {status === "loading" && (
          <div style={styles.card}>
            <div style={styles.spinner} />
            <h2 style={styles.heading}>Confirming your booking...</h2>
            <p style={styles.sub}>Please don't close this page.</p>
          </div>
        )}

        {status === "success" && (
          <div style={styles.card}>
            <div style={{ ...styles.iconCircle, background: "#00a699" }}>
              ✓
            </div>
            <h1 style={styles.heading}>You're all booked!</h1>
            <p style={styles.sub}>
              Your reservation has been confirmed. Get ready for an amazing stay.
            </p>
            <div style={styles.actions}>
              <Link to="/my-reservations" style={styles.primaryBtn}>
                View my trips
              </Link>
              <Link to="/" style={styles.secondaryBtn}>
                Explore more stays
              </Link>
            </div>
          </div>
        )}

        {status === "error" && (
          <div style={styles.card}>
            <div style={{ ...styles.iconCircle, background: "#ff385c" }}>
              ✕
            </div>
            <h1 style={styles.heading}>Something went wrong</h1>
            <p style={styles.sub}>
              Your payment was processed but we couldn't save your booking. Please contact support.
            </p>
            <Link to="/" style={styles.primaryBtn}>
              Go home
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f7f7f7",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
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
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "36px",
    fontWeight: "700",
    margin: "0 auto 24px"
  },
  heading: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#222",
    marginBottom: "12px"
  },
  sub: {
    fontSize: "16px",
    color: "#717171",
    lineHeight: 1.6,
    marginBottom: "32px"
  },
  actions: {
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
    padding: "16px 28px",
    borderRadius: "12px",
    textDecoration: "none",
    fontWeight: "600",
    fontSize: "15px",
    border: "1px solid #ddd"
  },
  spinner: {
    width: "48px",
    height: "48px",
    border: "4px solid #ebebeb",
    borderTop: "4px solid #ff385c",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    margin: "0 auto 24px"
  }
};

export default Success;