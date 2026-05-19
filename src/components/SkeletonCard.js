import React from "react";

function SkeletonCard() {
  return (
    <div style={styles.card}>
      <div style={styles.image}></div>
      <div style={styles.text}></div>
      <div style={styles.textSmall}></div>
    </div>
  );
}

const styles = {
  card: {
    borderRadius: "16px",
    overflow: "hidden",
    background: "#f3f3f3",
    animation: "pulse 1.5s infinite"
  },
  image: {
    height: "200px",
    background: "#ddd"
  },
  text: {
    height: "20px",
    margin: "10px",
    background: "#ddd"
  },
  textSmall: {
    height: "15px",
    margin: "10px",
    background: "#eee"
  }
};

export default SkeletonCard;