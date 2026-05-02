import { useEffect, useState } from "react";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("bookings")) || [];
    setBookings(data);
  }, []);

  return (
    <div className="booking-container">
      <h2>📖 My Bookings</h2>

      {bookings.length === 0 ? (
        <p>No bookings found</p>
      ) : (
        <div className="booking-list">
          {bookings.map((b, i) => (
            <div key={i} className="booking-card">

              <h3>🎫 {b.ticketNo}</h3>

              <p><b>{b.bus.source}</b> ➜ <b>{b.bus.destination}</b></p>

              <p>💺 Seats: {b.seats}</p>

              <p>💰 ₹{b.total}</p>

              <p>📅 {b.date}</p>

              <p>Status: {b.status}</p>

              <button
                className="track-btn"
                onClick={() => alert(`Bus is on the way to ${b.bus.destination} 🚍`)}
              >
                Track Bus
              </button>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}