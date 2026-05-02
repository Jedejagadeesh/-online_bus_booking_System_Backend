import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { searchBuses } from "../api/api";
import BusCard from "../components/BusCard";

export default function SearchResults() {
  const [params] = useSearchParams();
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    searchBuses(params.get("from"), params.get("to")).then(setData);
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <div>
      <h2>Search Results</h2>

      {data.routes?.map((item, i) => (
        <div key={i}>
          {item.route ? (
            <>
              <p>Via: {item.via}</p>
              <BusCard bus={item.route[0]} />
              <BusCard bus={item.route[1]} />
            </>
          ) : (
            <BusCard bus={item} />
          )}

          <button
            onClick={() =>
              navigate(`/seats/${item.route ? item.route[0].id : item.id}`)
            }
          >
            Select Bus
          </button>
        </div>
      ))}
    </div>
  );
}