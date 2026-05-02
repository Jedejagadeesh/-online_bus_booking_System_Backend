import React, { useState } from "react";
import axios from "axios";
import BusCard from "../components/BusCard";
import "../styles/home.css";

export default function Home() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchBuses = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/search/?from=${from}&to=${to}`
      );
      setBuses(res.data.routes || []);
    } catch (err) {
      console.log(err);
      setBuses([]);
    }
    setLoading(false);
  };

  return (
    <div>
      {/* NAVBAR */}
      <div className="navbar">🚌 Bus Booking App</div>

      {/* SEARCH BOX */}
      <div className="search-box">
        <input
          placeholder="From"
          onChange={(e) => setFrom(e.target.value)}
        />
        <input
          placeholder="To"
          onChange={(e) => setTo(e.target.value)}
        />
        <button onClick={searchBuses}>Search</button>
      </div>

      {/* RESULTS */}
      <div className="results">
        {loading && <p>Loading buses...</p>}

        <div className="bus-list">
          {buses.map((bus, i) => (
            <BusCard key={i} bus={bus} onSelect={() => {}} />
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <footer className="footer">
        <p>📞 7093885812</p>
        <p>📧 jagadeshjade490@gmail.com</p>
      </footer>
    </div>
  );
}