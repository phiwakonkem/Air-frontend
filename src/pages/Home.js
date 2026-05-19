import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../utils/api";
import Footer from "../components/Footer";
import ListingCard, {
  SkeletonCard
} from "../components/ListingCard";

import { motion } from "framer-motion";

function Home() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [guests, setGuests] = useState("");

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await api.get(
          "/api/accommodations"
        );

        setListings(res.data);

      } catch (err) {
        console.log(err);

      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  const filteredListings = listings.filter(
    (listing) => {
      return (
        listing.location
          ?.toLowerCase()
          .includes(search.toLowerCase()) &&

        (maxPrice
          ? listing.price <= Number(maxPrice)
          : true) &&

        (guests
          ? listing.guests >= Number(guests)
          : true)
      );
    }
  );

  return (
    <div style={styles.page}>
      <Navbar />

      {/* HERO SECTION */}

      <motion.div
        initial={{
          opacity: 0,
          y: 40
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        transition={{
          duration: 0.8
        }}
        style={styles.hero}
      >
        <div style={styles.overlay}></div>

        <div style={styles.heroContent}>
          <h1 style={styles.title}>
            Find your perfect stay
          </h1>

          <p style={styles.subtitle}>
            Luxury homes, hotels and unforgettable experiences.
          </p>
        </div>
      </motion.div>

      {/* FILTERS */}

      <form
        style={styles.filters}
        onSubmit={(e) =>
          e.preventDefault()
        }
      >
        <input
          type="text"
          placeholder="Where are you going?"
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          style={styles.input}
        />

        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) =>
            setMaxPrice(e.target.value)
          }
          style={styles.input}
        />

        <input
          type="number"
          placeholder="Guests"
          value={guests}
          onChange={(e) =>
            setGuests(e.target.value)
          }
          style={styles.input}
        />

        <button style={styles.searchButton}>
          Search
        </button>
      </form>

      {/* POPULAR DESTINATIONS */}

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>
          Popular destinations
        </h2>

        <div style={styles.destinations}>
          {destinations.map((item, index) => (
            <motion.div
              key={index}
              whileHover={{
                y: -8
              }}
              transition={{
                duration: 0.25
              }}
              style={styles.destinationCard}
            >
              <img
                loading="lazy"
                src={item.image}
                alt={item.name}
                style={styles.destinationImage}
              />

              <div style={styles.destinationContent}>
                <p style={styles.destinationText}>
                  {item.name}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* LISTINGS */}

      <div style={styles.grid}>
        {loading ? (
          [...Array(6)].map((_, i) => (
            <SkeletonCard key={i} />
          ))
        ) : filteredListings.length > 0 ? (
          filteredListings.map((listing) => (
            <motion.div
              key={listing._id}
              whileHover={{
                y: -8
              }}
              transition={{
                duration: 0.25
              }}
            >
              <ListingCard
                listing={listing}
              />
            </motion.div>
          ))
        ) : (
          <div style={styles.empty}>
            <h2>No listings found.</h2>

            <p>
              Try adjusting your search filters.
            </p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

const destinations = [
  {
    name: "Cape Town",
    image:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267"
  },
  {
    name: "Johannesburg",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85"
  },
  {
    name: "Durban",
    image:
      "https://images.unsplash.com/photo-1494526585095-c41746248156"
  }
];

const styles = {
  page: {
    background: "#f7f7f7",
    minHeight: "100vh"
  },

  hero: {
    height: "420px",
    margin: "20px",
    borderRadius: "30px",
    overflow: "hidden",
    position: "relative",
    display: "flex",
    alignItems: "center",
    padding: "50px",
    backgroundImage:
      "url('https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1600')",
    backgroundSize: "cover",
    backgroundPosition: "center"
  },

  overlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(0,0,0,0.45)"
  },

  heroContent: {
    position: "relative",
    zIndex: 2,
    maxWidth: "650px",
    color: "#fff"
  },

  title: {
    fontSize: "clamp(36px, 7vw, 64px)",
    fontWeight: "700",
    marginBottom: "15px"
  },

  subtitle: {
    fontSize: "20px",
    lineHeight: 1.6
  },

  filters: {
    width: "90%",
    maxWidth: "1000px",
    margin: "-40px auto 30px",
    background: "#fff",
    padding: "20px",
    borderRadius: "20px",
    display: "flex",
    flexWrap: "wrap",
    gap: "14px",
    justifyContent: "center",
    boxShadow:
      "0 8px 30px rgba(0,0,0,0.08)",
    position: "relative",
    zIndex: 5
  },

  input: {
    padding: "14px",
    borderRadius: "12px",
    border: "1px solid #ddd",
    minWidth: "180px",
    fontSize: "15px",
    outline: "none",
    flex: 1
  },

  searchButton: {
    background: "#ff385c",
    color: "#fff",
    border: "none",
    padding: "14px 26px",
    borderRadius: "12px",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "15px"
  },

  section: {
    padding: "30px 20px"
  },

  sectionTitle: {
    fontSize: "32px",
    marginBottom: "24px"
  },

  destinations: {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap"
  },

  destinationCard: {
    width: "280px",
    background: "#fff",
    borderRadius: "22px",
    overflow: "hidden",
    cursor: "pointer",
    boxShadow:
      "0 8px 25px rgba(0,0,0,0.08)"
  },

  destinationImage: {
    width: "100%",
    height: "200px",
    objectFit: "cover"
  },

  destinationContent: {
    padding: "18px"
  },

  destinationText: {
    fontSize: "18px",
    fontWeight: "600"
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "25px",
    padding: "20px"
  },

  empty: {
    gridColumn: "1 / -1",
    textAlign: "center",
    padding: "80px 20px",
    color: "#666"
  }
};

export default Home;