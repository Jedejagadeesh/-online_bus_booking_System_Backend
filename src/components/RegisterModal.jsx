import { useState } from "react";
import api from "../api/api";

export default function RegisterModal() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      const res = await api.post("/register/", {
        name,
        email,
        password
      });

      alert("Registered successfully ✅");
      console.log(res.data);

    } catch (err) {
      alert("Registration failed ❌");
      console.log(err);
    }
  };

  return (
    <div className="register-box">

      <h2>Register</h2>

      <input
        placeholder="Name"
        onChange={(e) => setName(e.target.value)}
      />

      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleRegister}>
        Register
      </button>

    </div>
  );
}