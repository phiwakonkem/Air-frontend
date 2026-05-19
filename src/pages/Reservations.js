import React, { useState, useEffect } from "react";
import api from "../utils/api";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "react-toastify";

function Reservations() {
  const { id } = useParams();

  const [listing, setListing] = useState(null);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [guests, setGuests] = useState(1);

  const [unavailableDates, setUnavailableDates] =
    useState([]);

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

        const reservationsRes = await api.get(
          `/api/reservations/unavailable/${id}`
        );

        const dates = reservationsRes.data.flatMap(r => {
          const range = [];

          let current = new Date(r.startDate);

          while (
            current <= new Date(r.endDate)
          ) {
            range.push(new Date(current));

            current.setDate(
              current.getDate() + 1
            );
          }

          return range;
        });

        setUnavailableDates(dates);

      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [id]);

  const stripePromise = loadStripe(
    process.env.REACT_APP_STRIPE_KEY
  );

  const total =
    startDate && endDate
      ? (
          (endDate - startDate) /
          (1000 * 60 * 60 * 24)
        ) * (listing?.price || 0)
      : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!startDate || !endDate) {
      toast.error("Select dates");
      return;
    }

    if (startDate >= endDate) {
      toast.error(
        "End date must be after start date"
      );
      return;
    }

    try {
      const stripe = await stripePromise;

      const res = await api.post(
        "/api/payments/checkout",
        { totalPrice: total },
        
      );

      await stripe.redirectToCheckout({
        sessionId: res.data.id
      });

    } catch (err) {
      toast.error("Payment failed");
    }
  };

  if (!listing) {
    return <h1>Loading...</h1>;
  }

  return (
    <div style={styles.page}>
      <Navbar />

      <div style={styles.container}>

        <div style={styles.left}>

          <img
            loading="lazy"
            src={listing.image}
            alt={listing.title}
            style={styles.image}
          />

          <h1>{listing.title}</h1>

          <p>{listing.location}</p>

          <p>
            {listing.description}
          </p>

        </div>

        <form
          onSubmit={handleSubmit}
          style={styles.bookingCard}
        >

          <h2>
            R{listing.price}
            <span style={{ fontSize: "16px" }}>
              /night
            </span>
          </h2>

          <label>Check-in</label>

          <DatePicker
            selected={startDate}
            onChange={(date) =>
              setStartDate(date)
            }
            excludeDates={unavailableDates}
            minDate={new Date()}
          />

          <label>Check-out</label>

          <DatePicker
            selected={endDate}
            onChange={(date) =>
              setEndDate(date)
            }
            excludeDates={unavailableDates}
            minDate={new Date()}
          />

          <label>Guests</label>

          <input
            type="number"
            min="1"
            value={guests}
            onChange={(e) =>
              setGuests(e.target.value)
            }
            style={styles.input}
          />

          <div style={styles.total}>
            Total: R{Math.max(0, total)}
          </div>

          <button
            type="submit"
            style={styles.button}
          >
            Reserve Now
          </button>

        </form>

      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f7f7f7",
    padding: "40px"
  },

  container: {
    marginTop: "30px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "40px"
  },

  left: {
    background: "rgba(255,255,255,0.15)",
    backdropFilter: "blur(18px)",
    WebkitBackdropFilter: "blur(18px)",
    border: "1px solid rgba(255,255,255,0.2)",
    padding: "30px",
    borderRadius: "24px",
    boxShadow: "0 8px 32px rgba(31,38,135,0.2)"
  },

  right: {
    background: "rgba(255,255,255,0.15)",
    backdropFilter: "blur(18px)",
    WebkitBackdropFilter: "blur(18px)",
    border: "1px solid rgba(255,255,255,0.2)",
    padding: "30px",
    borderRadius: "24px",
    height: "fit-content",
    boxShadow: "0 8px 32px rgba(31,38,135,0.2)"
  },

  image: {
    width: "100%",
    height: "300px",
    objectFit: "cover",
    borderRadius: "20px"
  },

  input: {
    padding: "14px",
    borderRadius: "12px",
    border: "1px solid #ddd"
  },

  button: {
    marginTop: "20px",
    width: "100%",
    background: "#ff385c",
    color: "#fff",
    border: "none",
    padding: "16px",
    borderRadius: "14px",
    fontWeight: "bold",
    cursor: "pointer"
  }
};

export default Reservations;