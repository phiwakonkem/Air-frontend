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
    marginTop: "100px",

    background: "rgba(15,15,15,0.92)",

    backdropFilter: "blur(20px)",

    color: "#fff",

    padding: "60px 30px 30px"
  },

  top: {
    maxWidth: "1200px",
    margin: "0 auto",

    display: "flex",

    justifyContent: "space-between",

    flexWrap: "wrap",

    gap: "40px"
  },

  links: {
    display: "flex",
    flexDirection: "column",
    gap: "14px"
  },

  bottom: {
    borderTop:
      "1px solid rgba(255,255,255,0.1)",

    marginTop: "40px",

    paddingTop: "25px",

    textAlign: "center",

    color: "#bbb"
  }
};

export default Footer;