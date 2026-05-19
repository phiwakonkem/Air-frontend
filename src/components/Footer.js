import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.top}>

        <div>
          <h2>StayEasy</h2>

          <p>
            Luxury stays and unforgettable experiences.
          </p>
        </div>

        <div style={styles.links}>
          <Link to="/">Home</Link>
          <Link to="/wishlist">Wishlist</Link>
          <Link to="/my-reservations">
            Trips
          </Link>
        </div>

      </div>

      <div style={styles.bottom}>
        © 2026 StayEasy. All rights reserved.
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    marginTop: "80px",
    background: "#111",
    color: "#fff",
    padding: "50px 20px 20px"
  },

  top: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "30px"
  },

  links: {
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },

  bottom: {
    borderTop: "1px solid #333",
    marginTop: "30px",
    paddingTop: "20px",
    textAlign: "center",
    color: "#aaa"
  }
};

export default Footer;