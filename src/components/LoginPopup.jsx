import { useAuth } from "../context/AuthProvider";
import { useState, useEffect } from "react";

export default function LoginPopup() {
  const { setShowLogin, setShowSignup, login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 🔥 RESET FIELDS EVERY TIME POPUP OPENS
  useEffect(() => {
    setEmail("");
    setPassword("");
  }, []);

  // ================= LOGIN HANDLER =================
  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter email & password");
      return;
    }

    try {
      await login(email, password);   // 🔥 IMPORTANT
      alert("Login successful ✅");
      setShowLogin(false);            // close modal after success
    } catch (err) {
      alert("Login failed ❌");
      console.log(err);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">

        <h2>Login</h2>
<p
           style={{ cursor: "pointer", color: "black", textAlign: "right" ,fontSize:"30px"}}
          onClick={() => setShowLogin(false)}
        >
          <i class="fa-solid fa-circle-xmark"></i>
        </p>
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

        <button onClick={handleLogin}>
          Login
        </button>

        <p>
          New user?{" "}
          <span onClick={() => {
            setShowLogin(false);
            setShowSignup(true);
          }}>
            Register
          </span>
        </p>

        <p
          style={{ cursor: "pointer", color: "red" }}
          onClick={() => setShowLogin(false)}
        >
          Close
        </p>

      </div>
    </div>
  );
}