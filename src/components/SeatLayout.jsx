import { useEffect, useState } from "react";
import { getBookedSeats } from "../api/api";

export default function SeatLayout({ bus, date, onNext }) {
  const [booked, setBooked] = useState([]);
  const [selected, setSelected] = useState([]);
const selectedDate = localStorage.getItem("journey_date");
 useEffect(() => {
  if (!selectedDate) return;

  getBookedSeats(bus.id, selectedDate)
    .then(res => {
      setBooked(res.data.booked_seats || []);
    })
    .catch(err => {
      console.error("Seat fetch error:", err);
    });
}, [bus, selectedDate]);

  const toggleSeat = (seat) => {
    if (booked.includes(seat)) return;

    setSelected((prev) =>
      prev.includes(seat)
        ? prev.filter((s) => s !== seat)
        : [...prev, seat]
    );
  };

  return (
    <div className="seat_main">
      <h2>Select Seats</h2>

      <div className="seatGrid">
        {[...Array(20)].map((_, i) => {
          const seat = i + 1;   // ✅ seat defined HERE

          const isBooked = booked.includes(String(seat));
          const isSelected = selected.includes(String(seat));

          return (
            <div key={seat} className="Seat_booking">
              <div
                onClick={() => toggleSeat(String(seat))}
                className={`seat ${
                  isBooked
                    ? "booked"
                    : isSelected
                    ? "selected"
                    : ""
                }`}
              >
                {seat}
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={() => {
          if (selected.length === 0) {
            alert("Please select seats");
            return;
          }

          localStorage.setItem("seats", JSON.stringify(selected));
          onNext();
        }}
        className="seat_payment"
      >
        Continue to Payment
      </button>
    </div>
  );
}