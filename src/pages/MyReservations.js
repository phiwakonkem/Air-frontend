import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { SkeletonCard } from "../components/ListingCard";

function MyReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/api/reservations/user");
        setReservations(res.data);
      } catch (err) {
        console.log(err);
        toast.error(
          err.response?.data?.message ||
          "Failed to load reservations"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const nights = (start, end) => {
    const diff =
      new Date(end) - new Date(start);
    return Math.max(
      1,
      Math.round(diff / (1000 * 60 * 60 * 24))
    );
  };

  return (
    <div style={styles.page}>
      <Navbar />

      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>My trips</h1>
          <p style={styles.subtitle}>
            {loading
              ? "Loading..."
              : `${reservations.length} trip${reservations.length !== 1 ? "s" : ""}`}
          </p>
        </div>

        {loading ? (
          <div style={styles.grid}>
            {[...Array(3)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : reservations.length === 0 ? (
          <div style={styles.empty}>
            <div style={styles.emptyIcon}>🧳</div>
            <h2 style={styles.emptyTitle}>
              No trips booked yet
            </h2>
            <p style={styles.emptyText}>
              Time to dust off your bags and explore your next stay.
            </p>
            <Link to="/" style={styles.exploreBtn}>
              Start exploring
            </Link>
          </div>
        ) : (
          <div style={styles.grid}>
            {reservations.map((r) => (
              <div key={r._id} style={styles.card}>
                <div style={styles.imageWrap}>
                  <img
                    loading="lazy"
                    src={
                      r.accommodation?.image ||
                      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&auto=format&fit=crop"
                    }
                    alt={r.accommodation?.title}
                    style={styles.image}
                  />
                  <div style={styles.badge}>
                    ✓ Confirmed
                  </div>
                </div>

                <div style={styles.content}>
                  <h2 style={styles.cardTitle}>
                    {r.accommodation?.title || "Listing removed"}
                  </h2>
                  <p style={styles.location}>
                    📍 {r.accommodation?.location}
                  </p>

                  <div style={styles.dateRow}>
                    <div style={styles.dateBox}>
                      <span style={styles.dateLabel}>
                        Check-in
                      </span>
                      <span style={styles.dateValue}>
                        {new Date(r.startDate).toDateString()}
                      </span>
                    </div>
                    <div style={styles.dateDivider}>→</div>
                    <div style={styles.dateBox}>
                      <span style={styles.dateLabel}>
                        Check-out
                      </span>
                      <span style={styles.dateValue}>
                        {new Date(r.endDate).toDateString()}
                      </span>
                    </div>
                  </div>

                  <div style={styles.priceRow}>
                    <span style={styles.nights}>
                      {nights(r.startDate, r.endDate)} nights
                    </span>
                    <span style={styles.price}>
                      R{r.totalPrice}
                    </span>
                  </div>

                  {r.accommodation?._id && (
                    <Link
                      to={`/listing/${r.accommodation._id}`}
                      style={styles.viewBtn}
                    >
                      View listing
                    </Link>
                  )}
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
    background: "#fff",
    minHeight: "100vh",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
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
    gridTemplateColumns:
      "repeat(auto-fill, minmax(340px, 1fr))",
    gap: "28px"
  },
  card: {
    border: "1px solid #ebebeb",
    borderRadius: "20px",
    overflow: "hidden",
    background: "#fff",
    transition: "box-shadow 0.2s"
  },
  imageWrap: {
    position: "relative"
  },
  image: {
    width: "100%",
    height: "220px",
    objectFit: "cover",
    display: "block"
  },
  badge: {
    position: "absolute",
    top: "14px",
    left: "14px",
    background: "#00a699",
    color: "#fff",
    fontSize: "12px",
    fontWeight: "700",
    padding: "5px 12px",
    borderRadius: "20px"
  },
  content: {
    padding: "20px"
  },
  cardTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#222",
    marginBottom: "4px"
  },
  location: {
    fontSize: "14px",
    color: "#717171",
    marginBottom: "16px"
  },
  dateRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    background: "#f7f7f7",
    borderRadius: "12px",
    padding: "14px",
    marginBottom: "16px"
  },
  dateBox: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
    flex: 1
  },
  dateLabel: {
    fontSize: "11px",
    fontWeight: "700",
    color: "#717171",
    letterSpacing: "0.5px",
    textTransform: "uppercase"
  },
  dateValue: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#222"
  },
  dateDivider: {
    color: "#717171",
    fontSize: "16px"
  },
  priceRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px"
  },
  nights: {
    fontSize: "14px",
    color: "#717171"
  },
  price: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#222"
  },
  viewBtn: {
    display: "block",
    textAlign: "center",
    background: "#fff",
    color: "#222",
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "11px",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "600"
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

export default MyReservations;