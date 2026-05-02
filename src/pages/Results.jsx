import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { searchBuses } from "../api/api";
import "../styles/global.css";

export default function Results() {
  const [data, setData] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  const from = params.get("from");
  const to = params.get("to");

  useEffect(() => {
    searchBuses(from, to).then((res) => {
      setData(res.data.routes || []);
    });
  }, [from, to]);

  return (
    <div>
      <div className="navbar">Search Results</div>

      {data.length === 0 ? (
        <h3 style={{ textAlign: "center" }}>No buses found</h3>
      ) : (
        data.map((bus, index) => (
          <div key={index} className="bus-card">
            <h3>{bus.name || "Bus"}</h3>
            <p>{bus.source} → {bus.destination}</p>
            <p>₹ {bus.price}</p>
            <button onClick={() => navigate(`/booking/${bus.id}`)}>
              Book Now
            </button>
          </div>
        ))
      )}
    </div>
  );
}