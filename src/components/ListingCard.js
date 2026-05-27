import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../utils/api";
import { toast } from "react-toastify";

function ListingCard({ listing }) {
  const [wishlisted, setWishlisted] = useState(false);
  const [imgIndex] = useState(0);

  const images = listing.image
    ? [listing.image]
    : ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&auto=format&fit=crop"];

  const toggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await api.post(`/api/wishlist/${listing._id}`);
      setWishlisted(!wishlisted);
      toast.success(wishlisted ? "Removed from wishlist" : "Saved to wishlist");
    } catch {
      toast.error("Please log in to save listings");
    }
  };

  return (
    <Link to={`/listing/${listing._id}`} style={styles.link}>
      <motion.div
        whileHover="hover"
        style={styles.card}
      >
        {/* IMAGE */}
        <div style={styles.imageWrap}>
          <motion.img
            variants={{ hover: { scale: 1.05 } }}
            transition={{ duration: 0.4 }}
            loading="lazy"
            src={images[imgIndex]}
            alt={listing.title}
            style={styles.image}
          />

          {/* WISHLIST */}
          <button
            onClick={toggleWishlist}
            style={styles.heartBtn}
            aria-label={wishlisted ? "Remove from wishlist" : "Save to wishlist"}
          >
            {wishlisted ? (
              <span style={{ color: "#ff385c", fontSize: "20px" }}>♥</span>
            ) : (
              <span style={{ color: "#fff", fontSize: "20px", textShadow: "0 1px 4px rgba(0,0,0,0.4)" }}>♡</span>
            )}
          </button>

          {/* BADGE */}
          {listing.rating >= 4.8 && (
            <div style={styles.badge}>Guest favourite</div>
          )}
        </div>

        {/* CONTENT */}
        <div style={styles.content}>
          <div style={styles.topRow}>
            <p style={styles.title}>{listing.title}</p>
            <div style={styles.rating}>
              <span style={{ fontSize: "13px" }}>★</span>
              <span style={{ fontSize: "13px", fontWeight: "500" }}>
                {listing.rating > 0
                  ? Number(listing.rating).toFixed(1)
                  : "New"}
              </span>
            </div>
          </div>

          <p style={styles.location}>📍 {listing.location}</p>

          <p style={styles.guests}>Up to {listing.guests} guests</p>

          <p style={styles.price}>
            <strong>R{listing.price}</strong>
            <span style={styles.perNight}> / night</span>
          </p>
        </div>
      </motion.div>
    </Link>
  );
}

export function SkeletonCard() {
  return (
    <div style={skeletonStyles.card}>
      <div style={skeletonStyles.image} />
      <div style={{ padding: "12px" }}>
        <div style={skeletonStyles.line} />
        <div style={{ ...skeletonStyles.line, width: "60%", marginTop: "8px" }} />
        <div style={{ ...skeletonStyles.line, width: "40%", marginTop: "8px" }} />
      </div>
    </div>
  );
}

const styles = {
  link: {
    textDecoration: "none",
    color: "inherit",
    display: "block"
  },
  card: {
    borderRadius: "16px",
    overflow: "hidden",
    background: "#fff",
    cursor: "pointer"
  },
  imageWrap: {
    position: "relative",
    overflow: "hidden",
    borderRadius: "16px"
  },
  image: {
    width: "100%",
    height: "260px",
    objectFit: "cover",
    display: "block"
  },
  heartBtn: {
    position: "absolute",
    top: "14px",
    right: "14px",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    padding: "4px",
    lineHeight: 1
  },
  badge: {
    position: "absolute",
    top: "14px",
    left: "14px",
    background: "#fff",
    color: "#222",
    fontSize: "11px",
    fontWeight: "700",
    padding: "5px 10px",
    borderRadius: "20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
  },
  content: {
    padding: "12px 4px"
  },
  topRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "8px"
  },
  title: {
    fontSize: "15px",
    fontWeight: "600",
    color: "#222",
    margin: 0,
    flex: 1
  },
  rating: {
    display: "flex",
    alignItems: "center",
    gap: "3px",
    color: "#222",
    flexShrink: 0
  },
  location: {
    fontSize: "14px",
    color: "#717171",
    margin: "4px 0 2px",
    fontWeight: "400"
  },
  guests: {
    fontSize: "14px",
    color: "#717171",
    margin: "2px 0"
  },
  price: {
    fontSize: "15px",
    color: "#222",
    marginTop: "8px"
  },
  perNight: {
    fontWeight: "400",
    color: "#717171",
    fontSize: "14px"
  }
};

const skeletonStyles = {
  card: {
    borderRadius: "16px",
    overflow: "hidden",
    background: "#fff"
  },
  image: {
    height: "260px",
    background: "linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.5s infinite",
    borderRadius: "16px"
  },
  line: {
    height: "14px",
    background: "#f0f0f0",
    borderRadius: "8px",
    width: "100%"
  }
};

export default ListingCard;