import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import Footer from "../components/Footer";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

function ListingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: ""
  });

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const [listingRes, reviewRes] = await Promise.all([
          api.get(`/api/accommodations/${id}`),
          api.get(`/api/reviews/${id}`)
        ]);

        console.log("Listing data:", listingRes.data);
        setListing(listingRes.data);
        setReviews(reviewRes.data);

      } catch (err) {
        console.log(err);
        toast.error("Failed to load listing");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const submitReview = async () => {
    try {
      await api.post("/api/reviews", {
        accommodation: id,
        rating: reviewForm.rating,
        comment: reviewForm.comment
      });

      toast.success("Review added!");
      const reviewRes = await api.get(`/api/reviews/${id}`);
      setReviews(reviewRes.data);
      setReviewForm({ rating: 5, comment: "" });

    } catch (err) {
      toast.error("Failed to add review");
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingPage}>
        <Navbar />
        <div style={styles.loadingCenter}>
          <div style={styles.spinner} />
          <p style={{ color: "#717171", marginTop: "16px" }}>
            Loading listing...
          </p>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div style={styles.loadingPage}>
        <Navbar />
        <div style={styles.loadingCenter}>
          <p style={{ fontSize: "48px" }}>😕</p>
          <h2>Listing not found</h2>
          <button
            onClick={() => navigate("/")}
            style={styles.backBtn}
          >
            Back to home
          </button>
        </div>
      </div>
    );
  }

  const listingId = listing._id?.toString() || id;

  return (
    <div style={styles.page}>
      <Navbar />

      <div style={styles.container}>

        <motion.img
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          src={
            listing.image ||
            "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&auto=format&fit=crop"
          }
          alt={listing.title}
          style={styles.heroImage}
        />

        <div style={styles.content}>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            style={styles.leftCol}
          >
            <h1 style={styles.title}>{listing.title}</h1>
            <p style={styles.location}>📍 {listing.location}</p>
            <p style={styles.guests}>
              👥 Up to {listing.guests} guests
            </p>

            <div style={styles.divider} />

            <p style={styles.description}>
              {listing.description}
            </p>

            <div style={styles.features}>
              {[
                { icon: "🛏️", label: "Comfortable rooms" },
                { icon: "📶", label: "Free WiFi" },
                { icon: "🚿", label: "Private bathroom" },
                { icon: "🍳", label: "Kitchen included" }
              ].map((f) => (
                <motion.div
                  key={f.label}
                  whileHover={{ y: -4 }}
                  style={styles.featureCard}
                >
                  <span style={{ fontSize: "24px" }}>
                    {f.icon}
                  </span>
                  <span style={styles.featureLabel}>
                    {f.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            style={styles.bookingCard}
          >
            <div style={styles.priceRow}>
              <span style={styles.price}>
                R{listing.price}
              </span>
              <span style={styles.perNight}> / night</span>
            </div>

            {listing.rating > 0 && (
              <p style={styles.rating}>
                ⭐ {Number(listing.rating).toFixed(1)} ·{" "}
                {reviews.length} review
                {reviews.length !== 1 ? "s" : ""}
              </p>
            )}

            <div style={styles.divider} />

            <div style={styles.bookingInfo}>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Location</span>
                <span style={styles.infoValue}>
                  {listing.location}
                </span>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Max guests</span>
                <span style={styles.infoValue}>
                  {listing.guests}
                </span>
              </div>
            </div>

            <Link to={`/reservations/${listingId}`}>
              <button style={styles.reserveBtn}>
                Reserve now
              </button>
            </Link>

            <p style={styles.noCharge}>
              You won't be charged yet
            </p>
          </motion.div>
        </div>

        <div style={styles.mapSection}>
          <h2 style={styles.sectionTitle}>Location</h2>
          <MapContainer
            center={[
              listing.latitude || -26.2041,
              listing.longitude || 28.0473
            ]}
            zoom={13}
            style={{
              height: "400px",
              borderRadius: "20px"
            }}
          >
            <TileLayer
              attribution="&copy; OpenStreetMap"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker
              position={[
                listing.latitude || -26.2041,
                listing.longitude || 28.0473
              ]}
            >
              <Popup>{listing.title}</Popup>
            </Marker>
          </MapContainer>
        </div>

        <div style={styles.reviewSection}>
          <h2 style={styles.sectionTitle}>
            Reviews ({reviews.length})
          </h2>

          {reviews.length === 0 ? (
            <p style={{ color: "#717171" }}>
              No reviews yet — be the first!
            </p>
          ) : (
            reviews.map((review) => (
              <motion.div
                whileHover={{ y: -3 }}
                key={review._id}
                style={styles.reviewCard}
              >
                <div style={styles.reviewHeader}>
                  <div style={styles.reviewAvatar}>
                    {review.user?.username?.[0]?.toUpperCase() || "G"}
                  </div>
                  <div>
                    <p style={styles.reviewName}>
                      {review.user?.username || "Guest"}
                    </p>
                    <p style={styles.reviewStars}>
                      {"⭐".repeat(Number(review.rating))}
                    </p>
                  </div>
                </div>
                <p style={styles.reviewComment}>
                  {review.comment}
                </p>
              </motion.div>
            ))
          )}

          <div style={styles.reviewForm}>
            <h3 style={styles.reviewFormTitle}>
              Leave a review
            </h3>

            <select
              value={reviewForm.rating}
              onChange={(e) =>
                setReviewForm({
                  ...reviewForm,
                  rating: e.target.value
                })
              }
              style={styles.select}
            >
              <option value="5">⭐⭐⭐⭐⭐ — Excellent</option>
              <option value="4">⭐⭐⭐⭐ — Great</option>
              <option value="3">⭐⭐⭐ — Good</option>
              <option value="2">⭐⭐ — Fair</option>
              <option value="1">⭐ — Poor</option>
            </select>

            <textarea
              placeholder="Share your experience..."
              value={reviewForm.comment}
              onChange={(e) =>
                setReviewForm({
                  ...reviewForm,
                  comment: e.target.value
                })
              }
              style={styles.textarea}
            />

            <button
              onClick={submitReview}
              style={styles.reviewBtn}
            >
              Submit review
            </button>
          </div>
        </div>
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
  loadingPage: {
    minHeight: "100vh",
    background: "#fff"
  },
  loadingCenter: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "calc(100vh - 72px)",
    gap: "12px"
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "3px solid #ebebeb",
    borderTop: "3px solid #ff385c",
    borderRadius: "50%",
    animation: "spin 1s linear infinite"
  },
  backBtn: {
    marginTop: "16px",
    background: "#222",
    color: "#fff",
    border: "none",
    padding: "12px 24px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "15px"
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "32px 40px 80px"
  },
  heroImage: {
    width: "100%",
    height: "500px",
    objectFit: "cover",
    borderRadius: "24px"
  },
  content: {
    marginTop: "32px",
    display: "grid",
    gridTemplateColumns: "1fr 380px",
    gap: "48px",
    alignItems: "flex-start"
  },
  leftCol: {
    minWidth: 0
  },
  title: {
    fontSize: "36px",
    fontWeight: "700",
    color: "#222",
    marginBottom: "8px"
  },
  location: {
    fontSize: "16px",
    color: "#717171",
    marginBottom: "4px"
  },
  guests: {
    fontSize: "16px",
    color: "#717171",
    marginBottom: "16px"
  },
  divider: {
    height: "1px",
    background: "#ebebeb",
    margin: "24px 0"
  },
  description: {
    fontSize: "16px",
    color: "#444",
    lineHeight: 1.8
  },
  features: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "12px",
    marginTop: "32px"
  },
  featureCard: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "16px",
    border: "1px solid #ebebeb",
    borderRadius: "14px",
    background: "#fff"
  },
  featureLabel: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#222"
  },
  bookingCard: {
    border: "1px solid #ddd",
    borderRadius: "24px",
    padding: "28px",
    position: "sticky",
    top: "100px",
    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
    background: "#fff"
  },
  priceRow: {
    marginBottom: "8px"
  },
  price: {
    fontSize: "26px",
    fontWeight: "700",
    color: "#222"
  },
  perNight: {
    fontSize: "16px",
    color: "#717171"
  },
  rating: {
    fontSize: "14px",
    color: "#222",
    marginBottom: "8px"
  },
  bookingInfo: {
    marginBottom: "20px"
  },
  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 0",
    borderBottom: "1px solid #f0f0f0",
    fontSize: "14px"
  },
  infoLabel: {
    color: "#717171"
  },
  infoValue: {
    fontWeight: "600",
    color: "#222"
  },
  reserveBtn: {
    width: "100%",
    padding: "16px",
    background: "linear-gradient(to right, #ff385c, #e31c5f)",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    fontWeight: "700",
    fontSize: "16px",
    cursor: "pointer",
    marginTop: "4px"
  },
  noCharge: {
    textAlign: "center",
    fontSize: "13px",
    color: "#717171",
    marginTop: "10px"
  },
  mapSection: {
    marginTop: "60px"
  },
  sectionTitle: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#222",
    marginBottom: "20px"
  },
  reviewSection: {
    marginTop: "60px"
  },
  reviewCard: {
    border: "1px solid #ebebeb",
    borderRadius: "16px",
    padding: "20px",
    marginBottom: "16px",
    background: "#fff"
  },
  reviewHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "12px"
  },
  reviewAvatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background: "#717171",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    fontSize: "16px"
  },
  reviewName: {
    fontWeight: "600",
    fontSize: "15px",
    color: "#222",
    margin: 0
  },
  reviewStars: {
    fontSize: "13px",
    margin: "2px 0 0"
  },
  reviewComment: {
    fontSize: "15px",
    color: "#444",
    lineHeight: 1.6,
    margin: 0
  },
  reviewForm: {
    marginTop: "32px",
    padding: "24px",
    border: "1px solid #ebebeb",
    borderRadius: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "14px"
  },
  reviewFormTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#222",
    margin: 0
  },
  select: {
    padding: "12px 16px",
    borderRadius: "10px",
    border: "1px solid #ddd",
    fontSize: "14px",
    color: "#222",
    outline: "none"
  },
  textarea: {
    padding: "14px",
    borderRadius: "12px",
    border: "1px solid #ddd",
    fontSize: "15px",
    minHeight: "120px",
    resize: "vertical",
    fontFamily: "inherit",
    color: "#222",
    outline: "none"
  },
  reviewBtn: {
    background: "#222",
    color: "#fff",
    border: "none",
    padding: "14px 24px",
    borderRadius: "12px",
    fontWeight: "700",
    cursor: "pointer",
    fontSize: "15px",
    alignSelf: "flex-start"
  }
};

export default ListingDetails;