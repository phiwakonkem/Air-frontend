import React, { useState, useEffect } from "react";
import api from "../utils/api";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "react-toastify";

const stripePromise = loadStripe(
  process.env.REACT_APP_STRIPE_KEY
);

function Reservations() {
  const { id } = useParams();

  const [listing, setListing] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [guests, setGuests] = useState(1);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [unavailableDates, setUnavailableDates] = useState([]);

  useEffect(() => {
    if (!id) return;

    const fetchAll = async () => {
      try {
        const [listingRes, datesRes] = await Promise.all([
          api.get(`/api/accommodations/${id}`),
          api.get(`/api/reservations/unavailable/${id}`)
        ]);
        setListing(listingRes.data);
        setUnavailableDates(datesRes.data);
      } catch (err) {
        console.log(err);
        toast.error("Failed to load listing");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [id]);

  const nights =
    startDate && endDate
      ? Math.round(
          (endDate - startDate) / (1000 * 60 * 60 * 24)
        )
      : 0;

  const total = nights * (listing?.price || 0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!startDate || !endDate) {
      toast.error("Please select your dates");
      return;
    }
    if (startDate >= endDate) {
      toast.error("Check-out must be after check-in");
      return;
    }
    if (nights < 1) {
      toast.error("Minimum 1 night required");
      return;
    }

    setPaying(true);
    try {
      localStorage.setItem(
        "bookingData",
        JSON.stringify({
          accommodation: id,
          startDate,
          endDate,
          guests,
          totalPrice: total
        })
      );

      const res = await api.post(
        "/api/payments/checkout",
        { totalPrice: total }
      );

      window.location.href = res.data.url;

    } catch (err) {
      console.log(err);
      toast.error("Payment failed. Please try again.");
      setPaying(false);
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
          <h2 style={{ color: "#222" }}>Listing not found</h2>
          <Link to="/" style={styles.backBtn}>
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <Navbar />

      <div style={styles.container}>

        {/* BREADCRUMB */}
        <div style={styles.breadcrumb}>
          <Link to="/" style={styles.breadLink}>Home</Link>
          <span style={styles.breadSep}>›</span>
          <Link
            to={`/listing/${id}`}
            style={styles.breadLink}
          >
            {listing.title}
          </Link>
          <span style={styles.breadSep}>›</span>
          <span style={{ color: "#222" }}>Reserve</span>
        </div>

        <h1 style={styles.pageTitle}>Confirm and pay</h1>

        <div style={styles.grid}>

          {/* LEFT — listing info */}
          <div style={styles.left}>
            <img
              loading="lazy"
              src={
                listing.image ||
                "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&auto=format&fit=crop"
              }
              alt={listing.title}
              style={styles.image}
            />

            <div style={styles.listingInfo}>
              <h2 style={styles.listingTitle}>
                {listing.title}
              </h2>
              <p style={styles.listingLocation}>
                📍 {listing.location}
              </p>
              <p style={styles.listingGuests}>
                👥 Up to {listing.guests} guests
              </p>
              {listing.description && (
                <p style={styles.listingDesc}>
                  {listing.description}
                </p>
              )}
            </div>

            <div style={styles.divider} />

            <div style={styles.priceBreakdown}>
              <h3 style={styles.breakdownTitle}>
                Price details
              </h3>
              <div style={styles.breakdownRow}>
                <span style={styles.breakdownLabel}>
                  R{listing.price} × {nights || 0} night
                  {nights !== 1 ? "s" : ""}
                </span>
                <span style={styles.breakdownValue}>
                  R{total}
                </span>
              </div>
              <div style={styles.breakdownRow}>
                <span style={styles.breakdownLabel}>
                  Service fee
                </span>
                <span style={styles.breakdownValue}>
                  R0
                </span>
              </div>
              <div style={styles.divider} />
              <div style={styles.breakdownRow}>
                <span style={styles.totalLabel}>Total</span>
                <span style={styles.totalValue}>
                  R{total}
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT — booking form */}
          <div style={styles.right}>
            <div style={styles.priceHeader}>
              <span style={styles.priceAmount}>
                R{listing.price}
              </span>
              <span style={styles.priceNight}> / night</span>
            </div>

            <form onSubmit={handleSubmit} style={styles.form}>

              <div style={styles.dateGrid}>
                <div style={styles.dateField}>
                  <label style={styles.dateLabel}>
                    CHECK-IN
                  </label>
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    excludeDates={unavailableDates}
                    minDate={new Date()}
                    placeholderText="Add date"
                    className="datepicker-input"
                  />
                </div>

                <div style={styles.dateField}>
                  <label style={styles.dateLabel}>
                    CHECK-OUT
                  </label>
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    excludeDates={unavailableDates}
                    minDate={startDate || new Date()}
                    placeholderText="Add date"
                    className="datepicker-input"
                  />
                </div>
              </div>

              <div style={styles.guestsField}>
                <label style={styles.dateLabel}>GUESTS</label>
                <div style={styles.guestsRow}>
                  <button
                    type="button"
                    onClick={() =>
                      setGuests(Math.max(1, guests - 1))
                    }
                    style={styles.guestBtn}
                  >
                    −
                  </button>
                  <span style={styles.guestCount}>
                    {guests} guest{guests !== 1 ? "s" : ""}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setGuests(
                        Math.min(
                          listing.guests || 10,
                          guests + 1
                        )
                      )
                    }
                    style={styles.guestBtn}
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                type="submit"
                style={{
                  ...styles.reserveBtn,
                  opacity: paying ? 0.7 : 1
                }}
                disabled={paying}
              >
                {paying ? "Redirecting..." : "Reserve now"}
              </button>

              <p style={styles.noCharge}>
                You won't be charged yet
              </p>

              {nights > 0 && (
                <div style={styles.summaryBox}>
                  <div style={styles.summaryRow}>
                    <span style={styles.summaryLabel}>
                      R{listing.price} × {nights} night
                      {nights !== 1 ? "s" : ""}
                    </span>
                    <span style={styles.summaryValue}>
                      R{total}
                    </span>
                  </div>
                  <div style={styles.divider} />
                  <div style={styles.summaryRow}>
                    <strong>Total</strong>
                    <strong>R{total}</strong>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#fff",
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
    gap: "16px"
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
    display: "inline-block",
    marginTop: "16px",
    background: "#222",
    color: "#fff",
    padding: "12px 24px",
    borderRadius: "10px",
    textDecoration: "none",
    fontWeight: "600"
  },
  container: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "32px 40px 80px"
  },
  breadcrumb: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    marginBottom: "24px"
  },
  breadLink: {
    color: "#717171",
    textDecoration: "none"
  },
  breadSep: {
    color: "#717171"
  },
  pageTitle: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#222",
    marginBottom: "32px"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 400px",
    gap: "60px",
    alignItems: "flex-start"
  },
  left: {
    minWidth: 0
  },
  image: {
    width: "100%",
    height: "320px",
    objectFit: "cover",
    borderRadius: "20px",
    marginBottom: "24px"
  },
  listingInfo: {
    marginBottom: "24px"
  },
  listingTitle: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#222",
    marginBottom: "6px"
  },
  listingLocation: {
    fontSize: "15px",
    color: "#717171",
    marginBottom: "4px"
  },
  listingGuests: {
    fontSize: "15px",
    color: "#717171",
    marginBottom: "12px"
  },
  listingDesc: {
    fontSize: "15px",
    color: "#444",
    lineHeight: 1.7
  },
  divider: {
    height: "1px",
    background: "#ebebeb",
    margin: "20px 0"
  },
  priceBreakdown: {
    marginTop: "8px"
  },
  breakdownTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#222",
    marginBottom: "16px"
  },
  breakdownRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "12px"
  },
  breakdownLabel: {
    fontSize: "15px",
    color: "#222"
  },
  breakdownValue: {
    fontSize: "15px",
    color: "#222"
  },
  totalLabel: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#222"
  },
  totalValue: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#222"
  },
  right: {
    border: "1px solid #ddd",
    borderRadius: "24px",
    padding: "28px",
    position: "sticky",
    top: "100px",
    boxShadow: "0 4px 24px rgba(0,0,0,0.08)"
  },
  priceHeader: {
    marginBottom: "24px"
  },
  priceAmount: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#222"
  },
  priceNight: {
    fontSize: "16px",
    color: "#717171"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px"
  },
  dateGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    border: "1px solid #ddd",
    borderRadius: "12px",
    overflow: "hidden"
  },
  dateField: {
    padding: "12px 14px",
    borderRight: "1px solid #ddd"
  },
  dateLabel: {
    fontSize: "10px",
    fontWeight: "700",
    letterSpacing: "0.8px",
    color: "#222",
    display: "block",
    marginBottom: "4px"
  },
  guestsField: {
    border: "1px solid #ddd",
    borderRadius: "12px",
    padding: "12px 14px"
  },
  guestsRow: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginTop: "6px"
  },
  guestBtn: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    border: "1px solid #ddd",
    background: "#fff",
    cursor: "pointer",
    fontSize: "18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "400"
  },
  guestCount: {
    fontSize: "15px",
    fontWeight: "500",
    color: "#222",
    flex: 1,
    textAlign: "center"
  },
  reserveBtn: {
    background: "linear-gradient(to right, #ff385c, #e31c5f)",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    padding: "18px",
    fontWeight: "700",
    fontSize: "16px",
    cursor: "pointer",
    width: "100%"
  },
  noCharge: {
    textAlign: "center",
    fontSize: "13px",
    color: "#717171",
    margin: 0
  },
  summaryBox: {
    background: "#f7f7f7",
    borderRadius: "12px",
    padding: "16px"
  },
  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "14px",
    color: "#222",
    marginBottom: "4px"
  },
  summaryLabel: {
    color: "#717171"
  },
  summaryValue: {
    color: "#222"
  }
};

export default Reservations;