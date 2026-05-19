import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { Link } from "react-router-dom";

function Success() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const createReservation = async () => {

      if (sessionStorage.getItem("bookingDone")) {
        setLoading(false);
        return;
      }

      const bookingData = JSON.parse(
        localStorage.getItem("bookingData")
      );

      if (!bookingData) {
        setLoading(false);
        return;
      }

      try {
        await api.post(
          `/api/reservations`,
          bookingData,
          
        );

        sessionStorage.setItem(
          "bookingDone",
          "true"
        );

        localStorage.removeItem("bookingData");

      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    createReservation();
  }, []);

  if (loading) {
    return (
      <div style={styles.loading}>
        <h1>Processing payment...</h1>
      </div>
    );
  }

  return (
    <div style={styles.page}>

      <div style={styles.card}>
        <div style={styles.icon}>
          ✓
        </div>

        <h1>
          Booking Confirmed
        </h1>

        <p>
          Your stay has been successfully reserved.
        </p>

        <Link
          to="/my-reservations"
          style={styles.button}
        >
          View My Trips
        </Link>
      </div>

    </div>
  );
}

const styles = {
  page: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f7f7f7"
  },

  loading: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },

  card: {
    background: "#fff",
    padding: "50px",
    borderRadius: "30px",
    textAlign: "center",
    boxShadow: "0 10px 40px rgba(0,0,0,0.08)"
  },

  icon: {
    width: "90px",
    height: "90px",
    borderRadius: "50%",
    background: "#ff385c",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "42px",
    margin: "0 auto 20px"
  },

  button: {
    display: "inline-block",
    marginTop: "20px",
    background: "#ff385c",
    color: "#fff",
    padding: "14px 24px",
    borderRadius: "14px",
    textDecoration: "none",
    fontWeight: "bold"
  }
};

export default Success;