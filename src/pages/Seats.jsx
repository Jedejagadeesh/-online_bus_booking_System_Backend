import { useEffect, useState } from "react";
import { getBookedSeats } from "../api/api";
import { useNavigate, useParams } from "react-router-dom";

export default function Seats() {
  const { id } = useParams();
  const [booked, setBooked] = useState([]);
  const [selected, setSelected] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getBookedSeats(id).then((res) => setBooked(res.booked_seats));
  }, []);

  const toggleSeat = (seat) => {
    if (booked.includes(seat)) return;

    setSelected((prev) =>
      prev.includes(seat)
        ? prev.filter((s) => s !== seat)
        : [...prev, seat]
    );
  };

  return (
    <div>
      <h2>Select Seats</h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 60px)" }}>
        {[...Array(20)].map((_, i) => {
          const seat = i + 1;

          return (
            <div
              key={i}
              onClick={() => toggleSeat(seat)}
              style={{
                margin: 5,
                padding: 10,
                background: booked.includes(seat)
                  ? "red"
                  : selected.includes(seat)
                  ? "blue"
                  : "lightgray",
                cursor: "pointer"
              }}
            >
              {seat}
            </div>
          );
        })}
      </div>

      <button onClick={() =>
        navigate("/payment", { state: { busId: id, seats: selected } })
      }>
        Proceed to Payment
      </button>
    </div>
  );
}