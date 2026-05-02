import { useAuth } from "../context/AuthProvider";

export default function Navbar({ onNavigate }) {
  const { setShowLogin, setShowSignup } = useAuth();

  return (
    <div
      className="navbar"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px 25px",
        background:"black",
        color:"white",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        fontSize: "18px",
        fontWeight: "bold"
      }}
    >
      {/* LEFT SIDE LOGO */}
      <div style={{ fontSize: "22px", color: "#007bff" }}>
        🚌 Bus Booking System
      </div>

      {/* RIGHT SIDE BUTTONS */}
      <div
        className="nav-links"
        style={{
          display: "flex",
          gap: "15px",
          alignItems: "center"
        }}
      >
        <button onClick={() => onNavigate("home")} className="nav-btn">
          🏠 Home
        </button>

        <button onClick={() => onNavigate("bookings")} className="nav-btn">
          📖 My Bookings
        </button>

        <button onClick={() => onNavigate("track")} className="nav-btn">
          📍 Track
        </button>

        {/* LOGIN */}
        <button
          onClick={() => setShowLogin(true)}
          className="login-btn"
        >
          Login
        </button>

        {/* REGISTER */}
        <button
          onClick={() => setShowSignup(true)}
          className="register-btn"
        >
          Register
        </button>
      </div>
    </div>
  );
}