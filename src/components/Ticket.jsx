import React from "react";
// import "../style.css";   // ✅

export default function Ticket({ data }) {
  return (
    <div className="ticket-container">
      <div className="ticket-card">

        <h2 className="ticket-title">🎫 Booking Confirmed</h2>

        <div className="ticket-row">
          <span>Ticket No:</span>
          <strong>{data.ticketNo}</strong>
        </div>

        <hr />

        <div className="ticket-row">
          <span>🚌 Bus Name:</span>
          <strong>{data.bus.bus_name || "Express Bus"}</strong>
        </div>

        <div className="ticket-row">
          <span>📍 From:</span>
          <strong>{data.bus.source}</strong>
        </div>

        <div className="ticket-row">
          <span>📍 To:</span>
          <strong>{data.bus.destination}</strong>
        </div>

        <div className="ticket-row">
          <span>⏰ Departure:</span>
          <strong>{data.bus.departure || "06:00 AM"}</strong>
        </div>

        <div className="ticket-row">
          <span>⏰ Arrival:</span>
          <strong>{data.bus.arrival || "10:00 AM"}</strong>
        </div>

        <div className="ticket-row">
          <span>💰 Price:</span>
          <strong>₹{data.bus.price}</strong>
        </div>

        <div className="ticket-row">
          <span>💺 Seats:</span>
          <strong>{data.seats}</strong>
        </div>

        <div className="ticket-footer">
          🚍 Have a Safe Journey
        </div>

      </div>
    </div>
  );
}