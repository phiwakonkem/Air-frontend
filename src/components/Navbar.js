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
    WebkitBackdropFilter: "blur(18px)",
    borderBottom: "1px solid rgba(255,255,255,0.2)",
    boxShadow: "0 8px 32px rgba(0,0,0,0.08)"
  },

  logo: {
    fontSize: "28px",
    color: "#ff385c"
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
  },

  logo: {
    fontWeight: "800",
    fontSize: "28px",
    color: "#ff385c",
    letterSpacing: "-1px",
    cursor: "pointer"
  }
};

function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <nav style={styles.nav}>
      <Link to="/"><h2 style={styles.logo}>StayEasy</h2></Link>

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