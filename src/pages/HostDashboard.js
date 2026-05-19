import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { toast } from "react-toastify";

function HostDashboard() {
  const [form, setForm] = useState({
    title: "",
    location: "",
    description: "",
    guests: 1,
    price: ""
  });

  const [file, setFile] = useState(null);
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(
          "/api/reservations/host",
          
        );

        setReservations(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();

      data.append("title", form.title);
      data.append("location", form.location);
      data.append("description", form.description);
      data.append("guests", form.guests);
      data.append("price", form.price);

      if (file) {
        data.append("image", file);
      }

      await api.post(
        `/api/accommodations`,
        data,
        
      );

      toast.success("Listing created!");

      window.location.reload();
    } catch (err) {
      console.log(err);
      toast.error("Failed to create listing");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.heading}>Host Dashboard</h1>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            style={styles.input}
            placeholder="Listing title"
            onChange={(e) =>
              setForm({
                ...form,
                title: e.target.value
              })
            }
          />

          <input
            style={styles.input}
            placeholder="Location"
            onChange={(e) =>
              setForm({
                ...form,
                location: e.target.value
              })
            }
          />

          <textarea
            style={styles.textarea}
            placeholder="Description"
            onChange={(e) =>
              setForm({
                ...form,
                description: e.target.value
              })
            }
          />

          <input
            style={styles.input}
            type="number"
            placeholder="Guests"
            onChange={(e) =>
              setForm({
                ...form,
                guests: e.target.value
              })
            }
          />

          <input
            style={styles.input}
            type="number"
            placeholder="Price per night"
            onChange={(e) =>
              setForm({
                ...form,
                price: e.target.value
              })
            }
          />

          <input
            type="file"
            onChange={(e) =>
              setFile(e.target.files[0])
            }
          />

          {file && (
            <img
              loading="lazy"
              src={URL.createObjectURL(file)}
              alt="preview"
              style={styles.preview}
            />
          )}

          <button style={styles.button}>
            Create Listing
          </button>
        </form>

        <h2 style={styles.subheading}>Reservations</h2>

        <div style={styles.grid}>
          {reservations.map((r) => (
            <div key={r._id} style={styles.card}>
              <h3>{r.accommodation?.title}</h3>

              <p>
                {new Date(r.startDate).toDateString()}
              </p>

              <p>Guest ID: {r.user}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    background: "#f7f7f7",
    minHeight: "100vh",
    padding: "40px"
  },

  container: {
    maxWidth: "1200px",
    margin: "0 auto"
  },

  heading: {
    fontSize: "clamp(32px, 6vw, 56px)",
    marginBottom: "30px"
  },

  subheading: {
    marginTop: "50px",
    marginBottom: "20px"
  },

  form: {
    background: "#fff",
    padding: "30px",
    borderRadius: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)"
  },

  input: {
    padding: "14px",
    borderRadius: "12px",
    border: "1px solid #ddd",
    fontSize: "15px"
  },

  textarea: {
    padding: "14px",
    borderRadius: "12px",
    border: "1px solid #ddd",
    minHeight: "120px"
  },

  button: {
    background: "#ff385c",
    color: "white",
    border: "none",
    padding: "16px",
    borderRadius: "14px",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "16px"
  },

  preview: {
    width: "100%",
    maxHeight: "300px",
    objectFit: "cover",
    borderRadius: "20px"
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: "20px"
  },

  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "20px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)"
  }
};

export default HostDashboard;