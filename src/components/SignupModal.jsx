import { useState } from "react";
import api from "../api/api";
import { useAuth } from "../context/AuthProvider";

export default function SignupModal() {
  const { setShowSignup, setShowLogin } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ================= REGISTER =================
  const handleRegister = async () => {
    if (!name || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await api.post("/register/", {
        name,
        email,
        password,
      });

      console.log("SUCCESS:", res.data);
      alert("Registered successfully ✅");

      // close modal after success
      setShowSignup(false);

    } catch (err) {
      console.log("ERROR RESPONSE:", err.response?.data);
      alert(err.response?.data?.error || "Register failed ❌");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">

        <h2>Register</h2>

        {/* CLOSE BUTTON */}
        <p
           style={{ cursor: "pointer", color: "black", textAlign: "right" ,fontSize:"30px"}}
          onClick={() => setShowSignup(false)}
        >
            <i class="fa-solid fa-circle-xmark"></i>
        </p>

        {/* INPUTS (CONNECTED) */}
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* BUTTON (FIXED) */}
        <button onClick={handleRegister}>
          Register
        </button>
       <p
           style={{ cursor: "pointer", color: "green", textAlign: "right" ,fontSize:"20px",fontWeight:"bold"}}
          onClick={() => setShowSignup(false)}
        >
            close
        </p>
      </div>
    </div>
  );
}