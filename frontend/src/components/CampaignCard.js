// import React from "react";

// function CampaignCard({ campaign }) {
//   if (!campaign) return null;

//   return (
//     <div style={styles.output}>
//       <h2 style={styles.heading}>{campaign.headline}</h2>

//       <p style={styles.text}>
//         <span style={styles.label}>Ad:</span> {campaign.ad_copy}
//       </p>

//       <p style={styles.text}>
//         <span style={styles.label}>CTA:</span> {campaign.cta}
//       </p>

//       <p style={styles.text}>
//         <span style={styles.label}>Platform:</span> {campaign.platform}
//       </p>

//       <p style={styles.text}>
//         <span style={styles.label}>Best Time:</span> {campaign.best_time}
//       </p>

//       <p style={styles.text}>
//         <span style={styles.label}>Audience Insight:</span> {campaign.audience_insight}
//       </p>

//       <p style={styles.text}>
//         <span style={styles.label}>Performance:</span> {campaign.performance}
//       </p>
//     </div>
//   );
// }

// const styles = {
//   output: {
//     marginTop: "25px",
//     padding: "20px",
//     borderRadius: "12px",
//     background: "#f8f9fc",
//     textAlign: "left",
//     border: "1px solid #eee",
//     animation: "slideUp 0.5s ease",
//   },
//   heading: {
//     marginBottom: "15px",
//     fontSize: "18px",
//     fontWeight: "600",
//     color: "#333",
//   },
//   text: {
//     marginBottom: "10px",
//     fontSize: "14px",
//     color: "#555",
//   },
//   label: {
//     fontWeight: "600",
//     color: "#222",
//   },
// };

// export default CampaignCard;
import React from "react";

const CampaignCard = ({ campaign }) => {
  if (!campaign) return null;

  return (
    <div style={cardStyles.container}>
      {/* 1. Headline */}
      <h2 style={cardStyles.headline}>{campaign.headline}</h2>
      
      {/* 2. 🖼️ AI Generated Image */}
      {campaign.image_data ? (
        <div style={cardStyles.imageWrapper}>
           <img 
            src={`data:image/png;base64,${campaign.image_data}`} 
            alt="AI Generated Ad" 
            style={cardStyles.image} 
          />
        </div>
      ) : (
        <div style={cardStyles.imagePlaceholder}>
          <p>Generating visual... 🎨</p>
        </div>
      )}

      {/* 3. Ad Content & Strategy */}
      <div style={cardStyles.contentSection}>
        <p style={cardStyles.copy}>
          <strong>Ad Copy:</strong> {campaign.ad_copy}
        </p>
        
        {campaign.audience_insight && (
          <p style={cardStyles.insight}>
            💡 <strong>Insight:</strong> {campaign.audience_insight}
          </p>
        )}
      </div>
      
      {/* 4. Logistics Footer */}
      <div style={cardStyles.footer}>
        <div style={cardStyles.footerItem}>
          <strong>Platform:</strong> {campaign.platform || "Social Media"}
        </div>
        <div style={cardStyles.footerItem}>
          <strong>Best Time:</strong> {campaign.best_time || "Morning"}
        </div>
      </div>

      {/* 5. Call to Action Button */}
      <button 
        style={cardStyles.cta}
        onClick={() => alert(`Redirecting to: ${campaign.cta}`)}
      >
        {campaign.cta || "Learn More"}
      </button>
    </div>
  );
};

const cardStyles = {
  container: {
    marginTop: "25px",
    padding: "25px",
    border: "1px solid #e0e4e8",
    borderRadius: "16px",
    textAlign: "left",
    background: "#ffffff",
    boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
    width: "100%",
    maxWidth: "400px",
    animation: "fadeIn 0.6s ease-in-out"
  },
  headline: { 
    fontSize: "20px", 
    color: "#1a202c", 
    marginBottom: "15px",
    fontWeight: "700" 
  },
  imageWrapper: {
    width: "100%",
    borderRadius: "12px",
    overflow: "hidden",
    marginBottom: "20px",
    background: "#f7fafc"
  },
  image: { 
    width: "100%", 
    display: "block",
    transition: "transform 0.3s ease" 
  },
  imagePlaceholder: {
    width: "100%",
    height: "200px",
    borderRadius: "12px",
    background: "#edf2f7",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#718096",
    marginBottom: "20px"
  },
  contentSection: {
    marginBottom: "20px"
  },
  copy: { 
    fontSize: "15px", 
    color: "#4a5568", 
    lineHeight: "1.6",
    marginBottom: "10px" 
  },
  insight: {
    fontSize: "13px",
    color: "#718096",
    fontStyle: "italic",
    padding: "10px",
    background: "#f8fafc",
    borderRadius: "8px"
  },
  footer: { 
    display: "flex", 
    flexDirection: "column",
    gap: "5px",
    fontSize: "12px", 
    color: "#a0aec0", 
    marginBottom: "20px",
    borderTop: "1px solid #edf2f7",
    paddingTop: "15px"
  },
  footerItem: {
    display: "flex",
    justifyContent: "space-between"
  },
  cta: { 
    width: "100%", 
    padding: "12px", 
    borderRadius: "10px", 
    border: "none", 
    background: "linear-gradient(135deg, #48bb78, #38a169)", 
    color: "#fff", 
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "16px",
    boxShadow: "0 4px 12px rgba(56, 161, 105, 0.2)"
  }
};

export default CampaignCard;