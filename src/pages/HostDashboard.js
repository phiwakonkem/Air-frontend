import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const TABS = ["Create Listing", "My Listings", "Reservations"];

function HostDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Create Listing");

  const [form, setForm] = useState({
    title: "",
    location: "",
    description: "",
    guests: 1,
    price: "",
    latitude: "",
    longitude: ""
  });

  const [file, setFile] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchReservations();
    fetchListings();
  }, []);

  const fetchReservations = async () => {
    try {
      const res = await api.get("/api/reservations/host");
      setReservations(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchListings = async () => {
    try {
      const res = await api.get("/api/accommodations");
      setListings(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.location || !form.price) {
      toast.error("Title, location and price are required");
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      data.append("title", form.title);
      data.append("location", form.location);
      data.append("description", form.description);
      data.append("guests", form.guests);
      data.append("price", form.price);
      data.append("latitude", form.latitude || -26.2041);
      data.append("longitude", form.longitude || 28.0473);

      if (file) data.append("image", file);

      if (editingId) {
        await api.put(`/api/accommodations/${editingId}`, {
          title: form.title,
          location: form.location,
          description: form.description,
          guests: form.guests,
          price: form.price,
          latitude: form.latitude,
          longitude: form.longitude
        });
        toast.success("Listing updated!");
        setEditingId(null);
      } else {
        await api.post("/api/accommodations", data);
        toast.success("Listing created!");
      }

      setForm({
        title: "",
        location: "",
        description: "",
        guests: 1,
        price: "",
        latitude: "",
        longitude: ""
      });
      setFile(null);
      fetchListings();
      setActiveTab("My Listings");

    } catch (err) {
      console.log(err);
      toast.error(
        err.response?.data?.message || "Failed to save listing"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (listing) => {
    setEditingId(listing._id);
    setForm({
      title: listing.title,
      location: listing.location,
      description: listing.description || "",
      guests: listing.guests,
      price: listing.price,
      latitude: listing.latitude || "",
      longitude: listing.longitude || ""
    });
    setActiveTab("Create Listing");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this listing?")) return;
    try {
      await api.delete(`/api/accommodations/${id}`);
      toast.success("Listing deleted");
      fetchListings();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({
      title: "",
      location: "",
      description: "",
      guests: 1,
      price: "",
      latitude: "",
      longitude: ""
    });
  };

  return (
    <div style={styles.page}>
      <Navbar />

      <div style={styles.hero}>
        <div style={styles.heroOverlay} />
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>Host Dashboard</h1>
          <p style={styles.heroSub}>
            Manage your listings, track reservations and grow your income.
          </p>
        </div>
      </div>

      <div style={styles.container}>

        {/* STATS ROW */}
        <div style={styles.statsRow}>
          {[
            {
              label: "Total listings",
              value: listings.length,
              icon: "🏠"
            },
            {
              label: "Total reservations",
              value: reservations.length,
              icon: "📅"
            },
            {
              label: "Total earned",
              value: `R${reservations
                .reduce((acc, r) => acc + (r.totalPrice || 0), 0)
                .toLocaleString()}`,
              icon: "💰"
            }
          ].map((stat) => (
            <div key={stat.label} style={styles.statCard}>
              <span style={styles.statIcon}>{stat.icon}</span>
              <div>
                <p style={styles.statValue}>{stat.value}</p>
                <p style={styles.statLabel}>{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* TABS */}
        <div style={styles.tabs}>
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                ...styles.tab,
                ...(activeTab === tab ? styles.tabActive : {})
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* CREATE / EDIT LISTING */}
        {activeTab === "Create Listing" && (
          <div style={styles.formSection}>
            <div style={styles.formHeader}>
              <h2 style={styles.sectionTitle}>
                {editingId ? "Edit listing" : "Create a new listing"}
              </h2>
              {editingId && (
                <button onClick={cancelEdit} style={styles.cancelBtn}>
                  Cancel edit
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.formGrid}>
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Title *</label>
                  <input
                    style={styles.input}
                    placeholder="Beautiful beachfront villa"
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                    required
                  />
                </div>

                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Location *</label>
                  <input
                    style={styles.input}
                    placeholder="Cape Town, South Africa"
                    value={form.location}
                    onChange={(e) =>
                      setForm({ ...form, location: e.target.value })
                    }
                    required
                  />
                </div>

                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Price per night (R) *</label>
                  <input
                    style={styles.input}
                    type="number"
                    placeholder="1500"
                    value={form.price}
                    onChange={(e) =>
                      setForm({ ...form, price: e.target.value })
                    }
                    required
                  />
                </div>

                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Max guests</label>
                  <input
                    style={styles.input}
                    type="number"
                    min="1"
                    placeholder="4"
                    value={form.guests}
                    onChange={(e) =>
                      setForm({ ...form, guests: e.target.value })
                    }
                  />
                </div>

                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Latitude</label>
                  <input
                    style={styles.input}
                    type="number"
                    placeholder="-26.2041"
                    value={form.latitude}
                    onChange={(e) =>
                      setForm({ ...form, latitude: e.target.value })
                    }
                  />
                </div>

                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Longitude</label>
                  <input
                    style={styles.input}
                    type="number"
                    placeholder="28.0473"
                    value={form.longitude}
                    onChange={(e) =>
                      setForm({ ...form, longitude: e.target.value })
                    }
                  />
                </div>
              </div>

              <div style={styles.fieldGroup}>
                <label style={styles.label}>Description</label>
                <textarea
                  style={styles.textarea}
                  placeholder="Describe your space — what makes it special?"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </div>

              {!editingId && (
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Listing photo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files[0])}
                    style={styles.fileInput}
                  />
                  {file && (
                    <img
                      src={URL.createObjectURL(file)}
                      alt="preview"
                      style={styles.preview}
                    />
                  )}
                </div>
              )}

              <button
                type="submit"
                style={{
                  ...styles.submitBtn,
                  opacity: loading ? 0.7 : 1
                }}
                disabled={loading}
              >
                {loading
                  ? "Saving..."
                  : editingId
                  ? "Save changes"
                  : "Create listing"}
              </button>
            </form>
          </div>
        )}

        {/* MY LISTINGS */}
        {activeTab === "My Listings" && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>
              Your listings ({listings.length})
            </h2>

            {listings.length === 0 ? (
              <div style={styles.empty}>
                <p style={{ fontSize: "48px" }}>🏠</p>
                <h3>No listings yet</h3>
                <p style={{ color: "#717171" }}>
                  Create your first listing to start hosting.
                </p>
                <button
                  onClick={() => setActiveTab("Create Listing")}
                  style={styles.submitBtn}
                >
                  Create listing
                </button>
              </div>
            ) : (
              <div style={styles.listingsGrid}>
                {listings.map((listing) => (
                  <div key={listing._id} style={styles.listingCard}>
                    <img
                      src={
                        listing.image ||
                        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&auto=format&fit=crop"
                      }
                      alt={listing.title}
                      style={styles.listingImage}
                    />
                    <div style={styles.listingInfo}>
                      <h3 style={styles.listingTitle}>{listing.title}</h3>
                      <p style={styles.listingLocation}>
                        📍 {listing.location}
                      </p>
                      <p style={styles.listingPrice}>
                        R{listing.price}/night
                      </p>
                      <div style={styles.listingActions}>
                        <Link
                          to={`/listing/${listing._id}`}
                          style={styles.viewBtn}
                        >
                          View
                        </Link>
                        <button
                          onClick={() => handleEdit(listing)}
                          style={styles.editBtn}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(listing._id)}
                          style={styles.deleteBtn}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* RESERVATIONS */}
        {activeTab === "Reservations" && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>
              Guest reservations ({reservations.length})
            </h2>

            {reservations.length === 0 ? (
              <div style={styles.empty}>
                <p style={{ fontSize: "48px" }}>📅</p>
                <h3>No reservations yet</h3>
                <p style={{ color: "#717171" }}>
                  Reservations will appear here once guests book your listings.
                </p>
              </div>
            ) : (
              <div style={styles.tableWrap}>
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.tableHead}>
                      <th style={styles.th}>Listing</th>
                      <th style={styles.th}>Guest</th>
                      <th style={styles.th}>Check-in</th>
                      <th style={styles.th}>Check-out</th>
                      <th style={styles.th}>Total</th>
                      <th style={styles.th}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservations.map((r) => (
                      <tr key={r._id} style={styles.tr}>
                        <td style={styles.td}>
                          {r.accommodation?.title || "N/A"}
                        </td>
                        <td style={styles.td}>
                          {r.user?.username || r.user?.email || "Guest"}
                        </td>
                        <td style={styles.td}>
                          {new Date(r.startDate).toDateString()}
                        </td>
                        <td style={styles.td}>
                          {new Date(r.endDate).toDateString()}
                        </td>
                        <td style={styles.td}>R{r.totalPrice}</td>
                        <td style={styles.td}>
                          <span style={styles.badge}>Confirmed</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
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
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
  },
  hero: {
    height: "260px",
    position: "relative",
    backgroundImage:
      "url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1400&auto=format&fit=crop')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    alignItems: "center",
    padding: "0 40px"
  },
  heroOverlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(0,0,0,0.5)"
  },
  heroContent: {
    position: "relative",
    zIndex: 2,
    color: "#fff"
  },
  heroTitle: {
    fontSize: "42px",
    fontWeight: "800",
    marginBottom: "8px"
  },
  heroSub: {
    fontSize: "16px",
    opacity: 0.9
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "40px 40px 80px"
  },
  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px",
    marginBottom: "40px"
  },
  statCard: {
    background: "#f7f7f7",
    borderRadius: "16px",
    padding: "24px",
    display: "flex",
    alignItems: "center",
    gap: "16px"
  },
  statIcon: {
    fontSize: "32px"
  },
  statValue: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#222",
    margin: 0
  },
  statLabel: {
    fontSize: "13px",
    color: "#717171",
    margin: "2px 0 0"
  },
  tabs: {
    display: "flex",
    borderBottom: "1px solid #ebebeb",
    marginBottom: "32px",
    gap: "0",
    overflowX: "auto"
  },
  tab: {
    padding: "14px 24px",
    background: "none",
    border: "none",
    borderBottom: "2px solid transparent",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "500",
    color: "#717171",
    whiteSpace: "nowrap"
  },
  tabActive: {
    color: "#222",
    borderBottom: "2px solid #222"
  },
  formSection: {
    maxWidth: "800px"
  },
  formHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px"
  },
  sectionTitle: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#222",
    margin: 0
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "16px"
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px"
  },
  label: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#222"
  },
  input: {
    padding: "13px 16px",
    borderRadius: "12px",
    border: "1.5px solid #ddd",
    fontSize: "15px",
    outline: "none",
    color: "#222"
  },
  textarea: {
    padding: "13px 16px",
    borderRadius: "12px",
    border: "1.5px solid #ddd",
    fontSize: "15px",
    minHeight: "120px",
    outline: "none",
    color: "#222",
    resize: "vertical",
    fontFamily: "inherit"
  },
  fileInput: {
    fontSize: "14px",
    color: "#222"
  },
  preview: {
    width: "100%",
    maxHeight: "280px",
    objectFit: "cover",
    borderRadius: "16px",
    marginTop: "10px"
  },
  submitBtn: {
    background: "#ff385c",
    color: "#fff",
    border: "none",
    padding: "16px 32px",
    borderRadius: "12px",
    fontWeight: "700",
    cursor: "pointer",
    fontSize: "16px",
    alignSelf: "flex-start"
  },
  cancelBtn: {
    background: "#fff",
    color: "#222",
    border: "1px solid #ddd",
    padding: "10px 20px",
    borderRadius: "10px",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "14px"
  },
  section: {
    width: "100%"
  },
  empty: {
    textAlign: "center",
    padding: "80px 20px"
  },
  listingsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "24px",
    marginTop: "24px"
  },
  listingCard: {
    border: "1px solid #ebebeb",
    borderRadius: "16px",
    overflow: "hidden",
    background: "#fff"
  },
  listingImage: {
    width: "100%",
    height: "200px",
    objectFit: "cover"
  },
  listingInfo: {
    padding: "16px"
  },
  listingTitle: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#222",
    margin: "0 0 4px"
  },
  listingLocation: {
    fontSize: "14px",
    color: "#717171",
    margin: "0 0 4px"
  },
  listingPrice: {
    fontSize: "15px",
    fontWeight: "600",
    color: "#222",
    margin: "0 0 14px"
  },
  listingActions: {
    display: "flex",
    gap: "8px"
  },
  viewBtn: {
    padding: "8px 16px",
    background: "#f7f7f7",
    color: "#222",
    border: "1px solid #ddd",
    borderRadius: "8px",
    textDecoration: "none",
    fontSize: "13px",
    fontWeight: "600"
  },
  editBtn: {
    padding: "8px 16px",
    background: "#222",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600"
  },
  deleteBtn: {
    padding: "8px 16px",
    background: "#fff",
    color: "#ff385c",
    border: "1px solid #ff385c",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600"
  },
  tableWrap: {
    overflowX: "auto",
    border: "1px solid #ebebeb",
    borderRadius: "16px",
    marginTop: "24px"
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "14px"
  },
  tableHead: {
    background: "#fafafa"
  },
  th: {
    padding: "14px 20px",
    textAlign: "left",
    fontWeight: "600",
    color: "#222",
    borderBottom: "1px solid #ebebeb",
    whiteSpace: "nowrap"
  },
  tr: {
    borderBottom: "1px solid #ebebeb"
  },
  td: {
    padding: "14px 20px",
    color: "#222",
    verticalAlign: "middle"
  },
  badge: {
    background: "#e6f9f0",
    color: "#00a047",
    padding: "4px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600"
  }
};

export default HostDashboard;