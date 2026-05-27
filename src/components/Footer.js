import { Link } from "react-router-dom";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={styles.footer}>
      <div style={styles.inner}>
        <div style={styles.grid}>
          <div>
            <h3 style={styles.colTitle}>StayEasy</h3>
            <p style={styles.tagline}>
              Discover unique stays and experiences across South Africa.
            </p>
          </div>

          <div>
            <h4 style={styles.colTitle}>Explore</h4>
            <div style={styles.linkList}>
              <Link to="/" style={styles.link}>Home</Link>
              <Link to="/wishlist" style={styles.link}>Wishlist</Link>
              <Link to="/my-reservations" style={styles.link}>My trips</Link>
            </div>
          </div>

          <div>
            <h4 style={styles.colTitle}>Hosting</h4>
            <div style={styles.linkList}>
              <Link to="/host" style={styles.link}>Host dashboard</Link>
              <Link to="/register" style={styles.link}>Create account</Link>
            </div>
          </div>

          <div>
            <h4 style={styles.colTitle}>Support</h4>
            <div style={styles.linkList}>
              <Link to="/login" style={styles.link}>Log in</Link>
              <Link to="/register" style={styles.link}>Contact us</Link>
            </div>
          </div>
        </div>

        <div style={styles.bottom}>
          <p style={styles.copy}>
            © {year} StayEasy. All rights reserved.
          </p>
          <div style={styles.bottomLinks}>
            <Link to="/" style={styles.bottomLink}>Privacy</Link>
            <span style={styles.dot}>·</span>
            <Link to="/" style={styles.bottomLink}>Terms</Link>
            <span style={styles.dot}>·</span>
            <Link to="/" style={styles.bottomLink}>Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    background: "#f7f7f7",
    borderTop: "1px solid #ebebeb",
    marginTop: "60px",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
  },
  inner: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "48px 40px 32px"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: "40px",
    marginBottom: "48px"
  },
  colTitle: {
    fontSize: "14px",
    fontWeight: "700",
    color: "#222",
    margin: "0 0 16px"
  },
  tagline: {
    fontSize: "14px",
    color: "#717171",
    lineHeight: 1.6,
    margin: 0
  },
  linkList: {
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },
  link: {
    textDecoration: "none",
    color: "#717171",
    fontSize: "14px"
  },
  bottom: {
    borderTop: "1px solid #ebebeb",
    paddingTop: "24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "12px"
  },
  copy: {
    fontSize: "14px",
    color: "#717171",
    margin: 0
  },
  bottomLinks: {
    display: "flex",
    alignItems: "center",
    gap: "8px"
  },
  bottomLink: {
    textDecoration: "none",
    fontSize: "14px",
    color: "#717171"
  },
  dot: {
    color: "#717171",
    fontSize: "14px"
  }
};

export default Footer;