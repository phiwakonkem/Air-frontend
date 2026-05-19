import React from "react";

function Admin() {
  return (
    <div style={styles.page}>
      <h1 style={styles.title}>
        Admin Dashboard
      </h1>

      <div style={styles.grid}>
        <div style={styles.card}>
          <h2>Total Users</h2>
          <p>Coming soon</p>
        </div>

        <div style={styles.card}>
          <h2>Total Listings</h2>
          <p>Coming soon</p>
        </div>

        <div style={styles.card}>
          <h2>Total Reservations</h2>
          <p>Coming soon</p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    padding: "40px",
    background: "#f7f7f7",
    minHeight: "100vh"
  },

  title: {
    fontSize: "42px",
    marginBottom: "30px"
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px"
  },

  card: {
    background: "rgba(255,255,255,0.15)",
    backdropFilter: "blur(18px)",
    WebkitBackdropFilter: "blur(18px)",
    border: "1px solid rgba(255,255,255,0.2)",
    padding: "30px",
    borderRadius: "20px",
    boxShadow: "0 8px 32px rgba(31,38,135,0.2)"
  }
};

export default Admin;