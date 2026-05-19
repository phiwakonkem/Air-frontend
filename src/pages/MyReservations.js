import React, { useEffect, useState } from "react";
import api from "../utils/api";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

function MyReservations() {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(
          "api/reservations/user",
          
        );

        setReservations(res.data);

      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={styles.page}>
      <Navbar />

      <div style={styles.container}>
        <h1 style={styles.heading}>
          My Trips
        </h1>

        {reservations.length === 0 ? (
          <div style={styles.empty}>
            <h2>No reservations yet</h2>
            <p>
              Start exploring amazing stays.
            </p>
          </div>
        ) : (
          <div style={styles.grid}>
            {reservations.map((r) => (
              <div key={r._id} style={styles.card}>

                <img
                  loading="lazy"
                  src={r.accommodation?.image}
                  alt={r.accommodation?.title}
                  style={styles.image}
                />

                <div style={styles.content}>
                  <h2>
                    {r.accommodation?.title}
                  </h2>

                  <p>
                    📍 {r.accommodation?.location}
                  </p>

                  <p>
                    {new Date(r.startDate).toDateString()}
                    {" "}→{" "}
                    {new Date(r.endDate).toDateString()}
                  </p>

                  <h3>
                    R{r.totalPrice}
                  </h3>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

const styles = {
  page: {
    background: "#f7f7f7",
    minHeight: "100vh"
  },

  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "30px"
  },

  heading: {
    fontSize: "42px",
    marginBottom: "30px"
  },

  empty: {
    textAlign: "center",
    marginTop: "100px"
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fill, minmax(320px, 1fr))",
    gap: "24px"
  },

  card: {
    background: "rgba(255,255,255,0.15)",
    backdropFilter: "blur(18px)",
    WebkitBackdropFilter: "blur(18px)",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: "24px",
    overflow: "hidden",
    boxShadow: "0 8px 32px rgba(31,38,135,0.2)"
  },

  image: {
    width: "100%",
    height: "240px",
    objectFit: "cover"
  },

  content: {
    padding: "20px"
  }
};

export default MyReservations;