import { useState } from "react";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import { searchBuses } from "./api/api";
import BusCard from "./components/BusCard";
import SeatLayout from "./components/SeatLayout";
import Payment from "./components/Payment";
import Ticket from "./components/Ticket";

import MyBookings from "./pages/Booking";
import Track from "./pages/Track";

import LoginPopup from "./components/LoginPopup";
import SignupModal from "./components/SignupModal";

import { useAuth } from "./context/AuthProvider";

import "./styles/style.css";

export default function App() {
  const {
    showLogin,
    showSignup,
    isAuthenticated,
    setShowLogin,
    setShowSignup
  } = useAuth();

  // ================= NAVIGATION =================
  const [page, setPage] = useState("home");

  // ================= SEARCH =================
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [buses, setBuses] = useState([]);

  // ================= FLOW =================
  const [selectedBus, setSelectedBus] = useState(null);
  const [step, setStep] = useState("search");
  const [ticket, setTicket] = useState(null);

  // ================= SEARCH FUNCTION =================
  const handleSearch = async () => {
    if (!isAuthenticated()) {
      alert("Please login first to search buses");
      setShowLogin(true);
      return;
    }

    if (!from || !to) {
      alert("Enter From & To");
      return;
    }

    try {
      const res = await searchBuses(from, to);
      setBuses(res.data.routes || []);
      setStep("search");
    } catch (err) {
      console.error(err);
      alert("Error fetching buses");
    }
  };

  // ================= LOGIN CLOSE RESET =================
  const closeLogin = () => {
    setShowLogin(false);
  };

  const closeSignup = () => {
    setShowSignup(false);
  };

  return (
    <div className="app">

      {/* ================= NAVBAR ================= */}
      <Navbar onNavigate={setPage} />

      {/* ================= HOME ================= */}
      {page === "home" && (
        <>
          {/* SEARCH BOX */}
          <div className="searchBox">

            <input
              placeholder="From"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />

            <input
              placeholder="To"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />

            <button onClick={handleSearch}>
              Search Buses
            </button>
          </div>

          {/* BUS LIST */}
          {step === "search" && (
            <div className="busContainer">
              {buses.length === 0 ? (
                <p>No buses found</p>
              ) : (
                buses.map((bus, i) => (
                  <BusCard
                    key={i}
                    bus={bus}
                    onSelect={(b) => {
                      if (!isAuthenticated()) {
                        alert("Please login first");
                        setShowLogin(true);
                        return;
                      }

                      setSelectedBus(b);
                      setStep("seat");
                    }}
                  />
                ))
              )}
            </div>
          )}

          {/* SEAT */}
          {step === "seat" && (
            <SeatLayout
              bus={selectedBus}
              date={date}
              onNext={() => setStep("payment")}
            />
          )}

          {/* PAYMENT */}
          {step === "payment" && (
            <Payment
              bus={selectedBus}
              date={date}
              onSuccess={(ticketData) => {
                setTicket(ticketData);
                setStep("ticket");
              }}
            />
          )}

          {/* TICKET */}
          {step === "ticket" && <Ticket data={ticket} />}
        </>
      )}

      {/* ================= OTHER PAGES ================= */}
      {page === "bookings" && <MyBookings />}
      {page === "track" && <Track />}

      {/* ================= AUTH MODALS (FIXED) ================= */}
      {showLogin && (
        <LoginPopup onClose={closeLogin} />
      )}

      {showSignup && (
        <SignupModal onClose={closeSignup} />
      )}

      {/* ================= FOOTER ================= */}
      <Footer />
    </div>
  );
}