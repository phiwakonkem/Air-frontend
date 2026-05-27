import React, { useEffect, useState } from "react";
import api from "../utils/api";
import ListingCard, { SkeletonCard } from "../components/ListingCard";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

function Wishlist() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await api.get("/api/wishlist");
        setListings(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, []);

  return (
    <div style={styles.page}>
      <Navbar />

      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Your wishlist</h1>
          <p style={styles.subtitle}>
            {loading
              ? "Loading..."
              : `${listings.length} saved place${listings.length !== 1 ? "s" : ""}`}
          </p>
        </div>

        {loading ? (
          <div style={styles.grid}>
            {[...Array(4)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div style={styles.empty}>
            <div style={styles.emptyIcon}>❤️</div>
            <h2 style={styles.emptyTitle}>No saved places yet</h2>
            <p style={styles.emptyText}>
              As you explore, tap the heart on any listing to save it here.
            </p>
            <Link to="/" style={styles.exploreBtn}>
              Start exploring
            </Link>
          </div>
        ) : (
          <div style={styles.grid}>
            {listings.map((listing) => (
              <ListingCard key={listing._id} listing={listing} />
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
    background: "#fff",
    minHeight: "100vh",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "40px 40px 80px"
  },
  header: {
    marginBottom: "32px"
  },
  title: {
    fontSize: "32px",
    fontWeight: "700",
    color: "#222",
    marginBottom: "6px"
  },
  subtitle: {
    fontSize: "16px",
    color: "#717171"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "28px"
  },
  empty: {
    textAlign: "center",
    padding: "100px 20px"
  },
  emptyIcon: {
    fontSize: "60px",
    marginBottom: "20px"
  },
  emptyTitle: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#222",
    marginBottom: "12px"
  },
  emptyText: {
    fontSize: "16px",
    color: "#717171",
    marginBottom: "28px",
    maxWidth: "380px",
    margin: "0 auto 28px",
    lineHeight: 1.6
  },
  exploreBtn: {
    display: "inline-block",
    background: "#222",
    color: "#fff",
    padding: "14px 28px",
    borderRadius: "12px",
    textDecoration: "none",
    fontWeight: "700",
    fontSize: "15px"
  }
};

export default Wishlist;