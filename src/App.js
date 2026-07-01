import React, { useState, useEffect, useCallback } from "react";
import PlaceCard from "./components/PlaceCard";
import PlaceModal from "./components/PlaceModal";
import "./styles/dashboardStyles.css";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000/api";

const MOODS = ["happy", "relaxed", "adventurous", "romantic", "energetic", "cozy"];

function App() {
  const [mood, setMood] = useState("happy");
  const [coords, setCoords] = useState(null);
  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [radius, setRadius] = useState(3);

  // Get browser geolocation once on mount
  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        });
      },
      (err) => {
        setError("Location access denied. Please enable location to find places near you.");
        console.error(err);
      }
    );
  }, []);

  const fetchPlaces = useCallback(async () => {
    if (!coords) return;
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        mood,
        lat: coords.lat,
        lon: coords.lon,
        radius,
      });
      const res = await fetch(`${API_BASE}/places?${params.toString()}`);
      if (!res.ok) throw new Error(`Server responded ${res.status}`);
      const data = await res.json();
      setPlaces(data.results || []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch places. Is the server running?");
    } finally {
      setLoading(false);
    }
  }, [mood, coords, radius]);

  useEffect(() => {
    fetchPlaces();
  }, [fetchPlaces]);

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Mood Places</h1>
        <p className="subtitle">Find places near you that match your mood</p>
      </header>

      <div className="controls">
        <div className="mood-picker">
          {MOODS.map((m) => (
            <button
              key={m}
              className={`mood-chip ${mood === m ? "active" : ""}`}
              onClick={() => setMood(m)}
            >
              {m}
            </button>
          ))}
        </div>

        <div className="radius-picker">
          <label htmlFor="radius">Radius: {radius} km</label>
          <input
            id="radius"
            type="range"
            min="1"
            max="20"
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
          />
        </div>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {loading && <div className="loading">Loading places...</div>}

      {!loading && !error && places.length === 0 && coords && (
        <div className="empty-state">No places found for "{mood}" nearby. Try a larger radius.</div>
      )}

      <div className="places-grid">
        {places.map((place) => (
          <PlaceCard
            key={place._id}
            place={place}
            onClick={() => setSelectedPlace(place)}
          />
        ))}
      </div>

      {selectedPlace && (
        <PlaceModal place={selectedPlace} onClose={() => setSelectedPlace(null)} />
      )}
    </div>
  );
}

export default App;