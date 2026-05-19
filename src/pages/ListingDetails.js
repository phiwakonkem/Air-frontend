import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import Footer from "../components/Footer";
import useResponsive from "../hooks/useResponsive";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

function ListingDetails() {
  const { id } = useParams();
  const mobile = useResponsive();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);

  const [reviews, setReviews] = useState([]);

  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      try {

        const listingRes = await api.get(
          "/api/accommodations"
        );

        const found = listingRes.data.find(
          item => item._id === id
        );

        setListing(found);

        const reviewRes = await api.get(
          `/api/reviews/${id}`
        );

        setReviews(reviewRes.data);

      } catch (err) {
        console.log(err);

      } finally {
        setLoading(false);
      }
    };

    fetchData();

  }, [id]);

  const submitReview = async () => {
    try {

      await api.post(
        `/api/reviews`,
        {
          accommodation: id,
          rating: reviewForm.rating,
          comment: reviewForm.comment
        },
        
      );

      toast.success("Review added!");

      const reviewRes = await api.get(
        `/api/reviews/${id}`
      );

      setReviews(reviewRes.data);

      setReviewForm({
        rating: 5,
        comment: ""
      });

    } catch (err) {
      toast.error("Failed to add review");
    }
  };

  if (loading) {
    return (
      <div style={styles.loading}>
        <h1>Loading listing...</h1>
      </div>
    );
  }

  if (!listing) {
    return (
      <div style={styles.loading}>
        <h1>Listing not found</h1>
      </div>
    );
  }

  return (
    <div style={styles.page}>

      <Navbar />

      <div style={styles.container}>

        <motion.img
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          src={listing.image}
          alt={listing.title}
          style={styles.image}
        />

        <div style={styles.content}>

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
          >

            <h1 style={styles.title}>
              {listing.title}
            </h1>

            <p style={styles.location}>
              📍 {listing.location}
            </p>

            <p style={styles.guests}>
              👥 {listing.guests} guests
            </p>

            <p style={styles.description}>
              {listing.description}
            </p>

            <div style={styles.features}>

              <motion.div
                whileHover={{ y: -8 }}
                style={styles.featureCard}
              >
                🛏️ Comfortable Rooms
              </motion.div>

              <motion.div
                whileHover={{ y: -8 }}
                style={styles.featureCard}
              >
                📶 Free WiFi
              </motion.div>

              <motion.div
                whileHover={{ y: -8 }}
                style={styles.featureCard}
              >
                🚿 Private Bathroom
              </motion.div>

              <motion.div
                whileHover={{ y: -8 }}
                style={styles.featureCard}
              >
                🍳 Kitchen Included
              </motion.div>

            </div>

          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            style={styles.bookingCard}
          >

            <h2 style={styles.price}>
              R{listing.price}
            </h2>

            <p>per night</p>

            <Link to={`/reservations/${listing._id}`}>
              <button style={styles.button}>
                Reserve Now
              </button>
            </Link>

          </motion.div>

        </div>

        <div style={styles.mapSection}>

          <h2>Location</h2>

          <MapContainer
            center={[-25.865, 29.233]}
            zoom={13}
            style={{
              height: "400px",
              borderRadius: "20px"
            }}
          >

            <TileLayer
              attribution='&copy; OpenStreetMap'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker position={[-25.865, 29.233]}>
              <Popup>
                {listing.title}
              </Popup>
            </Marker>

          </MapContainer>

        </div>

        <div style={styles.reviewSection}>

          <h2>Reviews</h2>

          {reviews.map((review) => (
            <motion.div
              whileHover={{ y: -5 }}
              key={review._id}
              style={styles.reviewCard}
            >

              <h4>
                {review.user?.username}
              </h4>

              <p>
                {"⭐".repeat(review.rating)}
              </p>

              <p>{review.comment}</p>

            </motion.div>
          ))}

          <div style={styles.reviewForm}>

            <select
              value={reviewForm.rating}
              onChange={(e) =>
                setReviewForm({
                  ...reviewForm,
                  rating: e.target.value
                })
              }
            >
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>

            <textarea
              placeholder="Write your review..."
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
              style={styles.button}
            >
              Submit Review
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
    background: "#f7f7f7",
    minHeight: "100vh"
  },

  loading: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },

  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "20px"
  },

  image: {
    width: "100%",
    height: "500px",
    objectFit: "cover",
    borderRadius: "24px"
  },

  content: {
    marginTop: "30px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "40px"
  },

  title: {
    fontSize: "48px",
    fontWeight: "700"
  },

  location: {
    color: "#666",
    marginTop: "10px"
  },

  guests: {
    marginTop: "10px",
    fontWeight: "600"
  },

  description: {
    marginTop: "20px",
    lineHeight: 1.8
  },

  features: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(200px,1fr))",
    gap: "15px",
    marginTop: "35px"
  },

  featureCard: {
    background: "#fff",
    padding: "18px",
    borderRadius: "18px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.06)"
  },

  bookingCard: {
    background: "#fff",
    padding: "30px",
    borderRadius: "24px",
    height: "fit-content",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)"
  },

  price: {
    fontSize: "36px"
  },

  button: {
    width: "100%",
    marginTop: "20px",
    background: "#ff385c",
    color: "#fff",
    border: "none",
    padding: "16px",
    borderRadius: "14px",
    fontWeight: "bold",
    cursor: "pointer"
  },

  mapSection: {
    marginTop: "60px"
  },

  reviewSection: {
    marginTop: "60px"
  },

  reviewCard: {
    background: "#fff",
    padding: "20px",
    borderRadius: "16px",
    marginBottom: "15px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)"
  },

  reviewForm: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginTop: "20px"
  },

  textarea: {
    minHeight: "120px",
    padding: "14px",
    borderRadius: "12px",
    border: "1px solid #ddd"
  }
};

export default ListingDetails;