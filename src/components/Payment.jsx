import { useState } from "react";
import api from "../api/api";
import { useAuth } from "../context/AuthProvider";

export default function Payment({ bus, date, onSuccess }) {
  const { user } = useAuth(); // 🔥 GET LOGGED USER

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const selectedSeats = JSON.parse(localStorage.getItem("seats")) || [];
  const totalPrice = selectedSeats.length * bus.price;

  // 🔥 FINAL PAYMENT + BOOKING API CALL
  const handlePayment = async () => {
    if (!name || !email) {
      alert("Enter name & email");
      return;
    }

    if (selectedSeats.length === 0) {
      alert("No seats selected");
      return;
    }

    try {
      setLoading(true);

      // 🔥 SEND TO DJANGO BACKEND
      const res = await api.post("/book/", {
        bus: bus.id,
        seats: selectedSeats.join(","),   // IMPORTANT FIX
        journey_date: date,
        user_id: user?.id   // 🔥 from login user
      });

      console.log(res.data);

      // 🎫 CREATE TICKET
      const ticketData = {
        ticketNo: "TKT" + Date.now(),
        user: { name, email },
        bus,
        seats: selectedSeats.join(","),
        total: totalPrice,
        date: date,
        status: "Booked"
      };

      // 💾 SAVE LOCAL BOOKING HISTORY
      const oldBookings =
        JSON.parse(localStorage.getItem("bookings")) || [];

      localStorage.setItem(
        "bookings",
        JSON.stringify([...oldBookings, ticketData])
      );

      // 🧹 CLEANUP
      localStorage.removeItem("seats");

      alert("Booking successful ✅");

      // 🚀 MOVE TO TICKET PAGE
      onSuccess(ticketData);

    } catch (error) {
      console.log(error.response?.data || error.message);
      alert("Booking failed ❌");
    }

    setLoading(false);
  };

  return (
    <div className="paymentBox">

      <h2>💳 Payment</h2>

      <input
        placeholder="Enter Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        placeholder="Enter Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <p>📅 Date: {date}</p>
      <p>💺 Seats: {selectedSeats.join(", ")}</p>
      <p>💰 Total: ₹{totalPrice}</p>

      <button onClick={handlePayment}>
        {loading ? "Processing..." : "Pay Now"}
      </button>

    </div>
  );
}