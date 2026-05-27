import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../utils/api";
import Footer from "../components/Footer";
import ListingCard, { SkeletonCard } from "../components/ListingCard";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const categories = [
  { label: "Beach", icon: "🏖️" },
  { label: "Mountain", icon: "⛰️" },
  { label: "City", icon: "🏙️" },
  { label: "Countryside", icon: "🌾" },
  { label: "Luxury", icon: "💎" },
  { label: "Cabins", icon: "🪵" },
  { label: "Pools", icon: "🏊" },
  { label: "Camping", icon: "⛺" },
];

const destinations = [
  { name: "Cape Town", image: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=400&auto=format&fit=crop" },
  { name: "Johannesburg", image: "https://images.unsplash.com/photo-1602578984228-c98a9b995f3e?w=400&auto=format&fit=crop" },
  { name: "Durban", image: "https://images.unsplash.com/photo-1550761717-d03b44d9cb33?w=400&auto=format&fit=crop" },
  { name: "Pretoria", image: "https://images.unsplash.com/photo-1614075565833-7d31bb969f71?w=400&auto=format&fit=crop" },
  { name: "Mpumalanga", image: "https://images.unsplash.com/photo-1622397492747-e7b1ff40b8a5?w=400&auto=format&fit=crop" },
  { name: "Limpopo", image: "https://images.unsplash.com/photo-1609052057068-eae83bb9a58d?w=400&auto=format&fit=crop" },
];

function Home() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [guests, setGuests] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await api.get("/api/accommodations");
        setListings(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  const filteredListings = listings.filter((listing) => {
    const matchesSearch = listing.location
      ?.toLowerCase()
      .includes(search.toLowerCase()) ||
      listing.title?.toLowerCase().includes(search.toLowerCase());

    const matchesPrice = maxPrice
      ? listing.price <= Number(maxPrice)
      : true;

    const matchesGuests = guests
      ? listing.guests >= Number(guests)
      : true;

    const matchesCategory = activeCategory
      ? listing.title?.toLowerCase().includes(activeCategory.toLowerCase()) ||
        listing.description?.toLowerCase().includes(activeCategory.toLowerCase())
      : true;

    return matchesSearch && matchesPrice && matchesGuests && matchesCategory;
  });

  const handleSearch = (e) => {
    e.preventDefault();
    const el = document.getElementById("listings-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div style={styles.page}>
      <Navbar />

      {/* HERO */}
      <div style={styles.hero}>
        <div style={styles.heroOverlay} />
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={styles.heroContent}
        >
          <h1 style={styles.heroTitle}>
            Find your next<br />perfect stay
          </h1>
          <p style={styles.heroSubtitle}>
            Discover unique homes, experiences and places around South Africa.
          </p>

          {/* SEARCH BAR */}
          <form onSubmit={handleSearch} style={styles.searchBar}>
            <div style={styles.searchField}>
              <span style={styles.searchLabel}>Where</span>
              <input
                type="text"
                placeholder="Search destinations"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={styles.searchInput}
              />
            </div>

            <div style={styles.searchDivider} />

            <div style={styles.searchField}>
              <span style={styles.searchLabel}>Max Price</span>
              <input
                type="number"
                placeholder="Any price"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                style={styles.searchInput}
              />
            </div>

            <div style={styles.searchDivider} />

            <div style={styles.searchField}>
              <span style={styles.searchLabel}>Guests</span>
              <input
                type="number"
                placeholder="Add guests"
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                style={styles.searchInput}
              />
            </div>

            <button type="submit" style={styles.searchButton}>
              <span style={{ marginRight: "6px" }}>🔍</span>
              Search
            </button>
          </form>
        </motion.div>
      </div>

      {/* CATEGORY PILLS */}
      <div style={styles.categories}>
        <div style={styles.categoryScroll}>
          {categories.map((cat) => (
            <button
              key={cat.label}
              onClick={() =>
                setActiveCategory(
                  activeCategory === cat.label ? null : cat.label
                )
              }
              style={{
                ...styles.categoryPill,
                ...(activeCategory === cat.label
                  ? styles.categoryPillActive
                  : {})
              }}
            >
              <span style={{ fontSize: "20px" }}>{cat.icon}</span>
              <span style={{ fontSize: "13px", marginTop: "4px" }}>
                {cat.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* DESTINATIONS */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Popular destinations</h2>
        <p style={styles.sectionSub}>
          Trending places people are exploring right now
        </p>
        <div style={styles.destinationGrid}>
          {destinations.map((dest, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.2 }}
              style={styles.destinationCard}
              onClick={() => {
                setSearch(dest.name);
                document
                  .getElementById("listings-section")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <img
                loading="lazy"
                src={dest.image}
                alt={dest.name}
                style={styles.destinationImage}
              />
              <div style={styles.destinationOverlay} />
              <p style={styles.destinationName}>{dest.name}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* LISTINGS */}
      <section id="listings-section" style={styles.section}>
        <h2 style={styles.sectionTitle}>
          {search
            ? `Stays in "${search}"`
            : activeCategory
            ? `${activeCategory} stays`
            : "All stays"}
        </h2>
        <p style={styles.sectionSub}>
          {filteredListings.length} place
          {filteredListings.length !== 1 ? "s" : ""} found
        </p>

        <div style={styles.grid}>
          {loading ? (
            [...Array(6)].map((_, i) => <SkeletonCard key={i} />)
          ) : filteredListings.length > 0 ? (
            filteredListings.map((listing) => (
              <motion.div
                key={listing._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ListingCard listing={listing} />
              </motion.div>
            ))
          ) : (
            <div style={styles.empty}>
              <p style={{ fontSize: "48px" }}>🔍</p>
              <h3>No stays found</h3>
              <p style={{ color: "#717171" }}>
                Try adjusting your search or filters
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setMaxPrice("");
                  setGuests("");
                  setActiveCategory(null);
                }}
                style={styles.clearButton}
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* BANNER */}
      <section style={styles.bannerSection}>
        <div style={styles.banner}>
          <div style={styles.bannerOverlay} />
          <div style={styles.bannerContent}>
            <h2 style={styles.bannerTitle}>
              Become a host and earn extra income
            </h2>
            <p style={styles.bannerSub}>
              Share your space and welcome guests from around the world.
            </p>
            <button
              onClick={() => navigate("/host")}
              style={styles.bannerButton}
            >
              Start hosting
            </button>
          </div>
        </div>
      </section>

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

  hero: {
    height: "580px",
    position: "relative",
    backgroundImage:
      "url('https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1600&auto=format&fit=crop')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    alignItems: "center",
    padding: "0 40px"
  },
  heroOverlay: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(to right, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 100%)"
  },
  heroContent: {
    position: "relative",
    zIndex: 2,
    maxWidth: "700px",
    color: "#fff"
  },
  heroTitle: {
    fontSize: "clamp(40px, 6vw, 72px)",
    fontWeight: "800",
    lineHeight: 1.1,
    marginBottom: "16px",
    letterSpacing: "-1px"
  },
  heroSubtitle: {
    fontSize: "18px",
    marginBottom: "36px",
    opacity: 0.9,
    lineHeight: 1.6
  },

  searchBar: {
    display: "flex",
    alignItems: "center",
    background: "#fff",
    borderRadius: "60px",
    padding: "8px 8px 8px 20px",
    boxShadow: "0 4px 30px rgba(0,0,0,0.2)",
    maxWidth: "680px",
    flexWrap: "wrap",
    gap: "0"
  },
  searchField: {
    display: "flex",
    flexDirection: "column",
    padding: "0 16px",
    flex: 1,
    minWidth: "120px"
  },
  searchLabel: {
    fontSize: "11px",
    fontWeight: "700",
    color: "#222",
    letterSpacing: "0.5px"
  },
  searchInput: {
    border: "none",
    outline: "none",
    fontSize: "14px",
    color: "#222",
    background: "transparent",
    padding: "4px 0",
    width: "100%"
  },
  searchDivider: {
    width: "1px",
    height: "32px",
    background: "#ddd"
  },
  searchButton: {
    background: "#ff385c",
    color: "#fff",
    border: "none",
    borderRadius: "60px",
    padding: "14px 24px",
    fontWeight: "700",
    cursor: "pointer",
    fontSize: "15px",
    display: "flex",
    alignItems: "center",
    marginLeft: "8px",
    whiteSpace: "nowrap"
  },

  categories: {
    borderBottom: "1px solid #ebebeb",
    padding: "0 40px",
    background: "#fff",
    position: "sticky",
    top: "72px",
    zIndex: 100
  },
  categoryScroll: {
    display: "flex",
    gap: "32px",
    overflowX: "auto",
    paddingBottom: "0",
    scrollbarWidth: "none"
  },
  categoryPill: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "4px",
    padding: "16px 8px",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    color: "#717171",
    fontWeight: "500",
    borderBottom: "2px solid transparent",
    whiteSpace: "nowrap",
    transition: "all 0.2s"
  },
  categoryPillActive: {
    color: "#222",
    borderBottom: "2px solid #222"
  },

  section: {
    padding: "50px 40px"
  },
  sectionTitle: {
    fontSize: "26px",
    fontWeight: "700",
    color: "#222",
    marginBottom: "6px"
  },
  sectionSub: {
    fontSize: "15px",
    color: "#717171",
    marginBottom: "28px"
  },

  destinationGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: "16px"
  },
  destinationCard: {
    borderRadius: "16px",
    overflow: "hidden",
    cursor: "pointer",
    position: "relative",
    height: "180px"
  },
  destinationImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.3s"
  },
  destinationOverlay: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)"
  },
  destinationName: {
    position: "absolute",
    bottom: "14px",
    left: "16px",
    color: "#fff",
    fontWeight: "700",
    fontSize: "17px",
    margin: 0
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "28px"
  },
  empty: {
    gridColumn: "1 / -1",
    textAlign: "center",
    padding: "80px 20px",
    color: "#222"
  },
  clearButton: {
    marginTop: "16px",
    background: "#222",
    color: "#fff",
    border: "none",
    padding: "14px 28px",
    borderRadius: "12px",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "15px"
  },

  bannerSection: {
    padding: "0 40px 60px"
  },
  banner: {
    borderRadius: "24px",
    overflow: "hidden",
    height: "300px",
    position: "relative",
    backgroundImage:
      "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1400&auto=format&fit=crop')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    alignItems: "center",
    padding: "50px"
  },
  bannerOverlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(0,0,0,0.45)"
  },
  bannerContent: {
    position: "relative",
    zIndex: 2,
    color: "#fff",
    maxWidth: "500px"
  },
  bannerTitle: {
    fontSize: "32px",
    fontWeight: "700",
    marginBottom: "12px"
  },
  bannerSub: {
    fontSize: "16px",
    marginBottom: "24px",
    opacity: 0.9
  },
  bannerButton: {
    background: "#fff",
    color: "#222",
    border: "none",
    padding: "14px 28px",
    borderRadius: "12px",
    fontWeight: "700",
    cursor: "pointer",
    fontSize: "15px"
  }
};

export default Home;