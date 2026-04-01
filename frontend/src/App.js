import React, { useState } from "react";
import CampaignCard from "./components/CampaignCard";

function App() {
  const [product, setProduct] = useState("");
  const [audience, setAudience] = useState("");
  const [loading, setLoading] = useState(false);
  const [campaign, setCampaign] = useState(null);
  const [error, setError] = useState("");

  const generateAd = async () => {
    // ✅ validation
    if (!product || !audience) {
      setError("Please enter product and audience");
      return;
    }

    setLoading(true);
    setError("");
    setCampaign(null);

    try {
      const response = await fetch("http://localhost:5000/generate-ad", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ product, audience }),
      });

      const data = await response.json();
      setCampaign(data);
    } catch (error) {
      setError("Error generating campaign");
    }

    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>✨ AI Campaign Generator</h1>

        <input
          style={styles.input}
          type="text"
          placeholder="Enter Product"
          value={product}
          onChange={(e) => setProduct(e.target.value)}
        />

        <input
          style={styles.input}
          type="text"
          placeholder="Target Audience"
          value={audience}
          onChange={(e) => setAudience(e.target.value)}
        />

        <button
          style={styles.button}
          onClick={generateAd}
          disabled={loading}
        >
         {loading && <p style={styles.loading}>Generating images and music... 🎨🎶</p>}
        </button>

        {error && <p style={styles.error}>{error}</p>}

        {loading && <p style={styles.loading}>Generating magic...</p>}

        {/* ✅ Component used here */}
        <CampaignCard campaign={campaign} />
      </div>
    </div>
  );
}

const styles = {
 container: {
  minHeight: "100vh",
  padding: "40px 20px",
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
   background: "linear-gradient(135deg, #f5f7fa, #c3cfe2)",
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
},

  card: {
    background: "#ffffff",
    padding: "35px 30px",
    borderRadius: "16px",
    boxShadow: "0 12px 30px rgba(0,0,0,0.15)",
    textAlign: "center",
    width: "380px",
    animation: "fadeIn 0.8s ease-in-out",
  },

  title: {
    marginBottom: "25px",
    fontSize: "22px",
    fontWeight: "600",
    color: "#333",
  },

  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "10px",
    border: "1px solid #ddd",
    fontSize: "14px",
    outline: "none",
  },

  button: {
    width: "100%",
    padding: "12px",
    marginTop: "10px",
    borderRadius: "10px",
    border: "none",
    background: "linear-gradient(135deg, #667eea, #5a67d8)",
    color: "#fff",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
  },

  loading: {
    marginTop: "15px",
    fontSize: "14px",
    color: "#666",
    animation: "pulse 1s infinite",
  },

  error: {
    marginTop: "10px",
    color: "red",
    fontSize: "13px",
  },
};

export default App;