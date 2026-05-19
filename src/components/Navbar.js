import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 40px",
    flexWrap: "wrap",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    background: "rgba(255,255,255,0.9)",
    backdropFilter: "blur(12px)",
    borderBottom: "1px solid #eee"
  },

  logo: {
    fontWeight: "bold"
  },

  dropdown: {
    position: "absolute",
    top: "50px",
    right: 0,
    background: "#fff",
    padding: "15px",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    minWidth: "180px",
    zIndex: 1000
  },

  userButton: {
    border: "1px solid #ddd",
    borderRadius: "999px",
    padding: "8px 12px",
    cursor: "pointer",
    background: "#fff"
  },

  profileContainer: {
    position: "relative"
  }
};

function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <nav style={styles.nav}>
      <h2 style={styles.logo}>StayEasy</h2>

      <div style={{ position: "relative" }}>
        {user ? (
          <>
            
            <button
              onClick={() => setOpen(!open)}
              style={{
                width: "45px",
                height: "45px",
                borderRadius: "50%",
                border: "none",
                cursor: "pointer",
                fontSize: "20px",
                background: "#f1f1f1"
              }}
            >
            👤
            </button>

            {open && (
              <div style={styles.dropdown}>
                <p>{user.username}</p>

                <Link to="/my-reservations">Bookings</Link>
                <br />

                <Link to="/host">Host</Link>
                <br />

                <Link to="/wishlist">Wishlist</Link>
                <br />

                {user.role === "admin" && (
                  <>
                    <Link to="/admin">Admin</Link>
                    <br />
                  </>
                )}

                <button
                  onClick={() => {
                    logout();
                    window.location.href = "/login";
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </>
        ) : (
        <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;