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
    background: "#fff",
    padding: "30px",
    borderRadius: "20px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.08)"
  }
};

export default Admin;