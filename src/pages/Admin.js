import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { toast } from "react-toastify";
import {
  BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";

const TABS = ["Overview", "Listings", "Reservations", "Users"];

function Admin() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [stats, setStats] = useState({ users: 0, listings: 0, reservations: 0, revenue: 0 });
  const [listings, setListings] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [editingListing, setEditingListing] = useState(null);
  const [form, setForm] = useState({ title: "", location: "", description: "", price: "", guests: 1 });

  useEffect(() => {
    fetchStats();
    fetchListings();
    fetchReservations();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get("/api/admin/stats");
      setStats(res.data);
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

  const fetchReservations = async () => {
    try {
      const res = await api.get("/api/reservations/host");
      setReservations(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this listing?")) return;
    try {
      await api.delete(`/api/accommodations/${id}`);
      toast.success("Listing deleted");
      fetchListings();
      fetchStats();
    } catch {
      toast.error("Failed to delete listing");
    }
  };

  const handleEdit = (listing) => {
    setEditingListing(listing._id);
    setForm({
      title: listing.title,
      location: listing.location,
      description: listing.description || "",
      price: listing.price,
      guests: listing.guests
    });
    setActiveTab("Listings");
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/api/accommodations/${editingListing}`, form);
      toast.success("Listing updated!");
      setEditingListing(null);
      setForm({ title: "", location: "", description: "", price: "", guests: 1 });
      fetchListings();
    } catch {
      toast.error("Failed to update listing");
    }
  };

  const cancelEdit = () => {
    setEditingListing(null);
    setForm({ title: "", location: "", description: "", price: "", guests: 1 });
  };

  const bookingData = [
    { month: "Jan", bookings: 12 },
    { month: "Feb", bookings: 18 },
    { month: "Mar", bookings: 24 },
    { month: "Apr", bookings: 30 },
    { month: "May", bookings: stats.reservations || 0 }
  ];

  const pieData = [
    { name: "Revenue", value: stats.revenue || 0 },
    { name: "Target", value: Math.max(0, 50000 - (stats.revenue || 0)) }
  ];

  return (
    <div style={styles.page}>
      {/* HEADER */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Admin Dashboard</h1>
          <p style={styles.subtitle}>Manage your StayEasy platform</p>
        </div>
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

      {/* OVERVIEW */}
      {activeTab === "Overview" && (
        <div style={styles.content}>
          <div style={styles.statsGrid}>
            {[
              { label: "Total Users", value: stats.users, icon: "👥", color: "#e8f4fd" },
              { label: "Total Listings", value: stats.listings, icon: "🏠", color: "#fdf0e8" },
              { label: "Reservations", value: stats.reservations, icon: "📅", color: "#e8fdf0" },
              { label: "Revenue", value: `R${(stats.revenue || 0).toLocaleString()}`, icon: "💰", color: "#fdf8e8" }
            ].map((stat) => (
              <div key={stat.label} style={{ ...styles.statCard, background: stat.color }}>
                <div style={styles.statIcon}>{stat.icon}</div>
                <div>
                  <p style={styles.statLabel}>{stat.label}</p>
                  <p style={styles.statValue}>{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={styles.chartsGrid}>
            <div style={styles.chartCard}>
              <h3 style={styles.chartTitle}>Bookings over time</h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={bookingData}>
                  <XAxis dataKey="month" tick={{ fontSize: 13 }} />
                  <YAxis tick={{ fontSize: 13 }} />
                  <Tooltip />
                  <Bar dataKey="bookings" fill="#ff385c" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div style={styles.chartCard}>
              <h3 style={styles.chartTitle}>Revenue progress</h3>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    outerRadius={100}
                    innerRadius={60}
                    label
                  >
                    <Cell fill="#ff385c" />
                    <Cell fill="#ebebeb" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <p style={{ textAlign: "center", color: "#717171", fontSize: "14px" }}>
                Target: R50,000
              </p>
            </div>
          </div>
        </div>
      )}

      {/* LISTINGS */}
      {activeTab === "Listings" && (
        <div style={styles.content}>
          {editingListing && (
            <div style={styles.editCard}>
              <h3 style={styles.editTitle}>Edit Listing</h3>
              <form onSubmit={handleUpdate} style={styles.editForm}>
                {[
                  { name: "title", placeholder: "Title", type: "text" },
                  { name: "location", placeholder: "Location", type: "text" },
                  { name: "price", placeholder: "Price per night", type: "number" },
                  { name: "guests", placeholder: "Max guests", type: "number" }
                ].map((field) => (
                  <input
                    key={field.name}
                    name={field.name}
                    type={field.type}
                    placeholder={field.placeholder}
                    value={form[field.name]}
                    onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
                    style={styles.editInput}
                    required
                  />
                ))}
                <textarea
                  name="description"
                  placeholder="Description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  style={styles.editTextarea}
                />
                <div style={styles.editButtons}>
                  <button type="submit" style={styles.saveBtn}>Save changes</button>
                  <button type="button" onClick={cancelEdit} style={styles.cancelBtn}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHead}>
                  <th style={styles.th}>Listing</th>
                  <th style={styles.th}>Location</th>
                  <th style={styles.th}>Price</th>
                  <th style={styles.th}>Guests</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {listings.map((listing) => (
                  <tr key={listing._id} style={styles.tr}>
                    <td style={styles.td}>
                      <div style={styles.listingCell}>
                        <img
                          src={listing.image || "https://via.placeholder.com/60"}
                          alt={listing.title}
                          style={styles.listingThumb}
                        />
                        <span style={styles.listingTitle}>{listing.title}</span>
                      </div>
                    </td>
                    <td style={styles.td}>{listing.location}</td>
                    <td style={styles.td}>R{listing.price}/night</td>
                    <td style={styles.td}>{listing.guests}</td>
                    <td style={styles.td}>
                      <div style={styles.actionBtns}>
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* RESERVATIONS */}
      {activeTab === "Reservations" && (
        <div style={styles.content}>
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHead}>
                  <th style={styles.th}>Listing</th>
                  <th style={styles.th}>Guest</th>
                  <th style={styles.th}>Check-in</th>
                  <th style={styles.th}>Check-out</th>
                  <th style={styles.th}>Total</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((r) => (
                  <tr key={r._id} style={styles.tr}>
                    <td style={styles.td}>{r.accommodation?.title || "N/A"}</td>
                    <td style={styles.td}>{r.user?.username || r.user?.email || "Guest"}</td>
                    <td style={styles.td}>{new Date(r.startDate).toDateString()}</td>
                    <td style={styles.td}>{new Date(r.endDate).toDateString()}</td>
                    <td style={styles.td}>R{r.totalPrice}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* USERS */}
      {activeTab === "Users" && (
        <div style={styles.content}>
          <div style={styles.emptyState}>
            <p style={{ fontSize: "48px" }}>👥</p>
            <h3 style={{ color: "#222", marginBottom: "8px" }}>
              {stats.users} registered users
            </h3>
            <p style={{ color: "#717171" }}>
              User management coming soon.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    background: "#fff",
    minHeight: "100vh",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
  },
  header: {
    padding: "40px 40px 0",
    borderBottom: "1px solid #ebebeb",
    paddingBottom: "24px"
  },
  title: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#222",
    marginBottom: "4px"
  },
  subtitle: {
    fontSize: "15px",
    color: "#717171"
  },
  tabs: {
    display: "flex",
    gap: "0",
    padding: "0 40px",
    borderBottom: "1px solid #ebebeb",
    overflowX: "auto"
  },
  tab: {
    padding: "16px 24px",
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
  content: {
    padding: "32px 40px"
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: "16px",
    marginBottom: "32px"
  },
  statCard: {
    padding: "24px",
    borderRadius: "16px",
    display: "flex",
    alignItems: "center",
    gap: "16px"
  },
  statIcon: {
    fontSize: "32px"
  },
  statLabel: {
    fontSize: "13px",
    color: "#717171",
    margin: "0 0 4px"
  },
  statValue: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#222",
    margin: 0
  },
  chartsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "24px"
  },
  chartCard: {
    background: "#fafafa",
    border: "1px solid #ebebeb",
    borderRadius: "16px",
    padding: "24px"
  },
  chartTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#222",
    marginBottom: "20px"
  },
  tableWrap: {
    overflowX: "auto",
    border: "1px solid #ebebeb",
    borderRadius: "16px"
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
  listingCell: {
    display: "flex",
    alignItems: "center",
    gap: "12px"
  },
  listingThumb: {
    width: "48px",
    height: "48px",
    borderRadius: "8px",
    objectFit: "cover"
  },
  listingTitle: {
    fontWeight: "600",
    fontSize: "14px"
  },
  actionBtns: {
    display: "flex",
    gap: "8px"
  },
  editBtn: {
    padding: "7px 16px",
    background: "#222",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600"
  },
  deleteBtn: {
    padding: "7px 16px",
    background: "#fff",
    color: "#ff385c",
    border: "1px solid #ff385c",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600"
  },
  editCard: {
    background: "#fafafa",
    border: "1px solid #ebebeb",
    borderRadius: "16px",
    padding: "28px",
    marginBottom: "28px"
  },
  editTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#222",
    marginBottom: "20px"
  },
  editForm: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "14px"
  },
  editInput: {
    padding: "12px 16px",
    borderRadius: "10px",
    border: "1.5px solid #ddd",
    fontSize: "14px",
    outline: "none",
    color: "#222"
  },
  editTextarea: {
    padding: "12px 16px",
    borderRadius: "10px",
    border: "1.5px solid #ddd",
    fontSize: "14px",
    gridColumn: "1 / -1",
    minHeight: "100px",
    outline: "none",
    color: "#222",
    resize: "vertical"
  },
  editButtons: {
    gridColumn: "1 / -1",
    display: "flex",
    gap: "12px"
  },
  saveBtn: {
    padding: "12px 24px",
    background: "#ff385c",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontWeight: "700",
    cursor: "pointer",
    fontSize: "14px"
  },
  cancelBtn: {
    padding: "12px 24px",
    background: "#fff",
    color: "#222",
    border: "1px solid #ddd",
    borderRadius: "10px",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "14px"
  },
  emptyState: {
    textAlign: "center",
    padding: "80px 20px"
  }
};

export default Admin;