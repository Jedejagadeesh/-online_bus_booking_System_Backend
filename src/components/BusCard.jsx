import React from "react";
// import "../styles/busCard.css";

export default function BusCard({ bus, onSelect }) {
  return (
    <div className="bus-card">
      <div className="bus-header">
        <h3>{bus.bus_name || "Express Bus"}</h3>
        <span className="price">₹{bus.price}</span>
      </div>

      <div className="bus-route">
        <p>
          <b>{bus.source}</b> ➜ <b>{bus.destination}</b>
        </p>
      </div>

      <div className="bus-info">
        <p>Departure: {bus.departure_time}</p>
        <p>Arrival: {bus.arrival_time}</p>
      </div>

      <button className="select-btn" onClick={() => onSelect(bus)}>
        Select Seats
      </button>
    </div>
  );
}