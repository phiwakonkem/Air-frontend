import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <nav style={styles.nav}>
      {/* LOGO */}
      <Link to="/" style={styles.logoLink}>
        <span style={styles.logoIcon}>✦</span>
        <span style={styles.logoText}>StayEasy</span>
      </Link>

      {/* NAV LINKS — desktop */}
      <div style={styles.navLinks}>
        <Link to="/" style={styles.navLink}>Explore</Link>
        <Link to="/my-reservations" style={styles.navLink}>Trips</Link>
        <Link to="/wishlist" style={styles.navLink}>Wishlist</Link>
      </div>

      {/* RIGHT */}
      <div style={styles.right} ref={dropdownRef}>
        {!user && (
          <Link to="/host" style={styles.hostLink}>
            Become a host
          </Link>
        )}

        <button
          onClick={() => setOpen(!open)}
          style={styles.profileBtn}
          aria-label="Open menu"
        >
          <span style={styles.menuIcon}>☰</span>
          <div style={styles.avatar}>
            {user
              ? user.username?.[0]?.toUpperCase()
              : "👤"}
          </div>
        </button>

        {open && (
          <div style={styles.dropdown}>
            {user ? (
              <>
                <div style={styles.dropdownHeader}>
                  <p style={styles.dropdownName}>{user.username}</p>
                  <p style={styles.dropdownEmail}>{user.email}</p>
                </div>
                <div style={styles.dropdownDivider} />
                <Link
                  to="/my-reservations"
                  style={styles.dropdownItem}
                  onClick={() => setOpen(false)}
                >
                  🧳 My trips
                </Link>
                <Link
                  to="/wishlist"
                  style={styles.dropdownItem}
                  onClick={() => setOpen(false)}
                >
                  ❤️ Wishlist
                </Link>
                <Link
                  to="/host"
                  style={styles.dropdownItem}
                  onClick={() => setOpen(false)}
                >
                  🏠 Host dashboard
                </Link>
                {user.role === "admin" && (
                  <Link
                    to="/admin"
                    style={styles.dropdownItem}
                    onClick={() => setOpen(false)}
                  >
                    ⚙️ Admin panel
                  </Link>
                )}
                <div style={styles.dropdownDivider} />
                <button
                  onClick={() => {
                    logout();
                    setOpen(false);
                    navigate("/login");
                  }}
                  style={styles.dropdownLogout}
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  style={{ ...styles.dropdownItem, fontWeight: "700" }}
                  onClick={() => setOpen(false)}
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  style={styles.dropdownItem}
                  onClick={() => setOpen(false)}
                >
                  Sign up
                </Link>
                <div style={styles.dropdownDivider} />
                <Link
                  to="/host"
                  style={styles.dropdownItem}
                  onClick={() => setOpen(false)}
                >
                  Host your home
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 40px",
    height: "72px",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    background: "rgba(255,255,255,0.95)",
    backdropFilter: "blur(12px)",
    borderBottom: "1px solid #ebebeb",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
  },
  logoLink: {
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    gap: "8px"
  },
  logoIcon: {
    color: "#ff385c",
    fontSize: "22px"
  },
  logoText: {
    fontWeight: "800",
    fontSize: "22px",
    color: "#ff385c",
    letterSpacing: "-0.5px"
  },
  navLinks: {
    display: "flex",
    gap: "8px",
    alignItems: "center"
  },
  navLink: {
    textDecoration: "none",
    color: "#222",
    fontWeight: "500",
    fontSize: "15px",
    padding: "8px 14px",
    borderRadius: "24px",
    transition: "background 0.2s"
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    position: "relative"
  },
  hostLink: {
    textDecoration: "none",
    color: "#222",
    fontWeight: "600",
    fontSize: "14px",
    padding: "8px 14px",
    borderRadius: "24px"
  },
  profileBtn: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    background: "#fff",
    border: "1px solid #ddd",
    borderRadius: "60px",
    padding: "6px 8px 6px 14px",
    cursor: "pointer",
    boxShadow: "0 1px 4px rgba(0,0,0,0.1)"
  },
  menuIcon: {
    fontSize: "16px",
    color: "#222"
  },
  avatar: {
    width: "34px",
    height: "34px",
    borderRadius: "50%",
    background: "#717171",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
    fontWeight: "600"
  },
  dropdown: {
    position: "absolute",
    top: "54px",
    right: 0,
    background: "#fff",
    borderRadius: "16px",
    boxShadow: "0 8px 40px rgba(0,0,0,0.16)",
    minWidth: "220px",
    overflow: "hidden",
    border: "1px solid #ebebeb",
    zIndex: 2000
  },
  dropdownHeader: {
    padding: "16px 20px 12px"
  },
  dropdownName: {
    fontWeight: "700",
    fontSize: "15px",
    color: "#222",
    margin: 0
  },
  dropdownEmail: {
    fontSize: "13px",
    color: "#717171",
    margin: "2px 0 0"
  },
  dropdownDivider: {
    height: "1px",
    background: "#ebebeb",
    margin: "4px 0"
  },
  dropdownItem: {
    display: "block",
    textDecoration: "none",
    color: "#222",
    padding: "12px 20px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer"
  },
  dropdownLogout: {
    display: "block",
    width: "100%",
    textAlign: "left",
    background: "none",
    border: "none",
    color: "#222",
    padding: "12px 20px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer"
  }
};

export default Navbar;