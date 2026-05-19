import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false
    };
  }

  static getDerivedStateFromError() {
    return {
      hasError: true
    };
  }

  componentDidCatch(error, errorInfo) {
    console.log(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={styles.container}>
          <h1 style={styles.title}>
            Something went wrong.
          </h1>

          <p style={styles.text}>
            Please refresh the page.
          </p>

          <button
            style={styles.button}
            onClick={() => window.location.reload()}
          >
            Reload
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "#f7f7f7"
  },

  title: {
    fontSize: "40px",
    marginBottom: "15px"
  },

  text: {
    color: "#666",
    marginBottom: "20px"
  },

  button: {
    background: "#ff385c",
    color: "#fff",
    border: "none",
    padding: "14px 24px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "bold"
  }
};

export default ErrorBoundary;