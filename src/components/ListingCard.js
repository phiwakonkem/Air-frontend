import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../utils/api";
import { toast } from "react-toastify";

function ListingCard({ listing }) {
  const [wishlisted, setWishlisted] = useState(false);

  const toggleWishlist = async (e) => {
    e.preventDefault();

    try {
      await api.post(
        `/api/wishlist/${listing._id}`
      );

      setWishlisted(!wishlisted);

      toast.success(
        wishlisted
          ? "Removed from wishlist"
          : "Added to wishlist"
      );

      } catch (err) {
        toast.error("Login first");
    }
  };

  const averageRating =
    listing.reviews?.length > 0
      ? (
          listing.reviews.reduce(
            (acc, r) => acc + r.rating,
            0
          ) / listing.reviews.length
        ).toFixed(1)
      : "New";

  return (
    <motion.div
      whileHover={{
        y: -10,
        scale: 1.02
      }}
      transition={{ duration: 0.3 }}
      style={styles.card}
    >
      <Link
        to={`/listing/${listing._id}`}
        style={styles.link}
      >
        <div style={styles.imageContainer}>
          <img
            loading="lazy"
            src={listing.image}
            alt={listing.title}
            style={styles.image}
          />

          <button
            onClick={toggleWishlist}
            style={styles.heartButton}
          >
            {wishlisted ? "❤️" : "🤍"}
          </button>
        </div>

        <div style={styles.content}>
          <div style={styles.topRow}>
            <h3>{listing.title}</h3>

            <span>
              ⭐ {averageRating}
            </span>
          </div>

          <p style={styles.location}>
            📍 {listing.location}
          </p>

          <p>
            👥 {listing.guests} guests
          </p>

          <h2 style={styles.price}>
            R{listing.price}
            <span style={styles.night}>
              /night
            </span>
          </h2>
        </div>
      </Link>
    </motion.div>
  );
}

export function SkeletonCard() {
  return (
    <div style={styles.skeletonCard}>
      <div style={styles.skeletonImage}></div>

      <div style={styles.skeletonText}></div>

      <div style={styles.skeletonSmall}></div>
    </div>
  );
}

const styles = {
  link: {
    textDecoration: "none",
    color: "inherit"
  },

  card: {
    borderRadius: "24px",
    overflow: "hidden",
    background: "rgba(255,255,255,0.15)",
    backdropFilter: "blur(18px)",
    WebkitBackdropFilter: "blur(18px)",
    border: "1px solid rgba(255,255,255,0.2)",
    boxShadow: "0 8px 32px rgba(31,38,135,0.2)",
    transition: "0.3s",
    cursor: "pointer"
    
  },

  imageContainer: {
    position: "relative"
  },

  heartButton: {
    position: "absolute",
    top: "15px",
    right: "15px",
    border: "none",
    background: "rgba(255,255,255,0.9)",
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    cursor: "pointer",
    fontSize: "18px"
  },

  image: {
    width: "100%",
    height: "240px",
    objectFit: "cover",
    transition: "0.4s ease"
  },

  content: {
    padding: "18px"
  },

  topRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },

  location: {
    color: "#777",
    marginTop: "6px"
  },

  price: {
    marginTop: "14px"
  },

  night: {
    fontSize: "14px",
    color: "#666"
  },

  skeletonCard: {
    background: "#fff",
    borderRadius: "24px",
    overflow: "hidden",
    paddingBottom: "20px",
    animation: "pulse 1.5s infinite"
  },

  skeletonImage: {
    height: "240px",
    background: "#e5e5e5"
  },

  skeletonText: {
    height: "20px",
    background: "#eee",
    margin: "20px",
    borderRadius: "10px"
  },

  skeletonSmall: {
    height: "14px",
    width: "60%",
    background: "#eee",
    margin: "20px",
    borderRadius: "10px"
  }
};

export default ListingCard;