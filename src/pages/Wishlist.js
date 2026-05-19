import React, { useEffect, useState } from "react";
import api from "../utils/api";
import ListingCard from "../components/ListingCard";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Wishlist() {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await api.get(
          "/api/wishlist",
          
        );

        setListings(res.data);

      } catch (err) {
        console.log(err);
      }
    };

    fetchWishlist();
  }, []);

  return (
    <div>
      <Navbar />

      <div style={styles.container}>
        <h1>Your Wishlist</h1>

        {listings.length === 0 ? (
          <div style={styles.empty}>
            <h2>No wishlist items yet</h2>
            <p>Save beautiful places here.</p>
          </div>
        ) : (
        <div style={styles.grid}>
          {listings.map(listing => (
            <ListingCard
              key={listing._id}
              listing={listing}
            />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

const styles = {
  container: {
    padding: "30px"
  },

  empty: {
    textAlign: "center",
    padding: "120px 20px"
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "25px"
  }
};

export default Wishlist;