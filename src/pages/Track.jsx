import { useEffect, useState } from "react";

export default function Track() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("bookings")) || [];
    setBookings(data);
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>📍 Track Buses</h2>

      {bookings.length === 0 ? (
        <p>No active trips</p>
      ) : (
        bookings.map((b, i) => (
          <div key={i} style={{
            background: "white",
            padding: 15,
            margin: 10,
            borderRadius: 10
          }}>
            <p><b>{b.bus.source}</b> ➜ <b>{b.bus.destination}</b></p>
            <p>Status: 🟢 On the way</p>
          </div>
        ))
      )}
    </div>
  );
}