import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";

function SearchBar() {
  const { isAuthenticated, setShowLogin } = useAuth();
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!isAuthenticated()) {
      alert("Please login first to search buses");
      setShowLogin(true);
      return;
    }

    navigate("/search");
  };

  return (
    <div>
      <input placeholder="From" />
      <input placeholder="To" />
      <button onClick={handleSearch}>Search Buses</button>
    </div>
  );
}

export default SearchBar;