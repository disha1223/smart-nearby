import React, { useState, useEffect, useCallback } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Signup from "./pages/Signup";
import LandingPage from "./pages/landingpage";
import Login from "./pages/Login";

const API_BASE = "http://localhost:5000";
const HISTORY_KEY = "search_history";
const MAX_HISTORY = 5;

const MOODS = [
  { key: "study", emoji: "📚", label: "Study", sub: "Wifi · Quiet", color: "#667eea", bg: "#e0e4ff" },
  { key: "hangout", emoji: "🍔", label: "Hangout", sub: "Cozy · Casual", color: "#ec4899", bg: "#fce7f3" },
  { key: "quick-bite", emoji: "🍕", label: "Quick Bite", sub: "Fast · Easy", color: "#f59e0b", bg: "#fef3c7" },
  { key: "budget", emoji: "🪙", label: "Budget", sub: "Cheap · Value", color: "#10b981", bg: "#d1fae5" },
  { key: "nightlife", emoji: "🎉", label: "Nightlife", sub: "Clubs · Music", color: "#ec4899", bg: "#fdf2f8" },
  { key: "gaming", emoji: "🎮", label: "Gaming", sub: "Arcade · Fun", color: "#8b5cf6", bg: "#f5f3ff" },
  { key: "fitness", emoji: "🏋️", label: "Fitness", sub: "Gym · Active", color: "#06b6d4", bg: "#ecfeff" },
  { key: "rentals", emoji: "🚗", label: "Rentals", sub: "Bikes · Cars", color: "#84cc16", bg: "#f7fee7" },
  { key: "hidden-gems", emoji: "💎", label: "Hidden Gems", sub: "Unique · Local", color: "#14b8a6", bg: "#ecfdf5" },
  { key: "beaches", emoji: "🏖️", label: "Beaches", sub: "Sand · Sun", color: "#0ea5e9", bg: "#e0f2fe" },
  { key: "movies", emoji: "🎬", label: "Movies", sub: "Theatres · Films", color: "#dc2626", bg: "#fee2e2" },
];

const CITIES = [
  { key: "manipal", label: "Manipal", lat: 13.3525, lon: 74.7934 },
  { key: "mangalore", label: "Mangalore", lat: 12.9716, lon: 74.8631 },
  { key: "bangalore", label: "Bangalore", lat: 12.9716, lon: 77.5946 },
  { key: "mumbai", label: "Mumbai", lat: 19.0760, lon: 72.8777 },
  { key: "delhi", label: "Delhi", lat: 28.7041, lon: 77.1025 },
  { key: "hyderabad", label: "Hyderabad", lat: 17.3850, lon: 78.4867 },
  { key: "pune", label: "Pune", lat: 18.5204, lon: 73.8567 },
  { key: "chennai", label: "Chennai", lat: 13.0827, lon: 80.2707 },
];

const RADIUS_OPTIONS = [1, 2, 3, 5, 10, 15];
const SORT_OPTIONS = [
  { label: "⭐ Rating", value: "rating" },
  { label: "💬 Reviews", value: "reviews" },
  { label: "📏 Distance", value: "distance" },
  { label: "🔤 Name", value: "name" },
];

const DAYS_ORDER = ["monday","tuesday","wednesday","thursday","friday","saturday","sunday"];

// ── Navbar ──────────────────────────────────────────────────────────────
function Navbar({ isDark, setIsDark }) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">📍 Smart Nearby</div>
      <div className="navbar-right">
        <button className="theme-btn" onClick={() => setIsDark(!isDark)}>
          {isDark ? "☀️" : "🌙"}
        </button>
        {token ? (
          <>
            <span className="nav-user">👤 {username}</span>
            <button className="nav-logout" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <a href="/login" className="nav-link">Login</a>
            <a href="/signup" className="nav-link nav-link-primary">Sign Up</a>
          </>
        )}
      </div>
    </nav>
  );
}

// ── Place Detail Modal ───────────────────────────────────────────────────
function PlaceModal({ place, onClose, isFav, onToggleFav }) {
  if (!place) return null;

  const today = new Date().toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();
  const hours = place.hours && typeof place.hours === "object" ? place.hours : {};
  const hasHours = Object.keys(hours).length > 0;

  const sharePlace = () => {
    if (navigator.share) {
      navigator.share({
        title: place.title,
        text: `📍 ${place.title}\n${place.address}`,
        url: `https://maps.google.com/?q=${place.lat},${place.lon}`,
      });
    } else {
      navigator.clipboard.writeText(`📍 ${place.title}\n${place.address}\nhttps://maps.google.com/?q=${place.lat},${place.lon}`);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        {/* Hero Image */}
        {place.image || place.thumbnail ? (
          <img
            src={place.image || place.thumbnail}
            alt={place.title}
            className="modal-img"
            onError={(e) => { e.target.src = "https://placehold.co/720x240?text=No+Image"; }}
          />
        ) : (
          <div className="modal-img modal-img-placeholder">🏢</div>
        )}

        <div className="modal-body">
          {/* Title + Status */}
          <div className="modal-title-row">
            <div>
              <div className="modal-title">{place.title}</div>
              <div className="modal-type">{place.type}</div>
            </div>
            {place.open_now !== undefined && place.open_now !== null && (
              <div className={`open-badge-pill ${place.open_now ? "open" : "closed"}`}>
                <span className="open-dot" />
                {place.open_now ? "Open Now" : "Closed"}
              </div>
            )}
          </div>

          {/* Rating */}
          {place.rating > 0 && (
            <div className="modal-rating-row">
              <span className="modal-stars">{"★".repeat(Math.floor(place.rating))}{place.rating % 1 >= 0.5 ? "½" : ""}{"☆".repeat(5 - Math.floor(place.rating) - (place.rating % 1 >= 0.5 ? 1 : 0))}</span>
              <span className="modal-rating-num">{place.rating}</span>
              {place.reviews > 0 && <span className="modal-reviews">({Number(place.reviews).toLocaleString()} reviews)</span>}
              {place.price_level && <span className="modal-price">{String(place.price_level)}</span>}
            </div>
          )}

          {/* Quick Actions */}
          <div className="modal-quick-actions">
            {place.phone && (
              <a href={`tel:${place.phone}`} className="quick-action-btn">
                <span className="quick-icon">📞</span>
                <span>Call</span>
              </a>
            )}
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lon}`}
              target="_blank" rel="noreferrer"
              className="quick-action-btn"
            >
              <span className="quick-icon">🧭</span>
              <span>Directions</span>
            </a>
            <button className="quick-action-btn" onClick={() => onToggleFav(place)}>
              <span className="quick-icon">{isFav ? "❤️" : "🤍"}</span>
              <span>{isFav ? "Saved" : "Save"}</span>
            </button>
            <button className="quick-action-btn" onClick={sharePlace}>
              <span className="quick-icon">↗️</span>
              <span>Share</span>
            </button>
          </div>

          <div className="modal-divider" />

          {/* Overview */}
          <div className="modal-section-title">Overview</div>
          <div className="modal-info-list">
            {place.address && (
              <div className="modal-info-row">
                <span className="modal-info-icon">📍</span>
                <span>{place.address}</span>
              </div>
            )}
            {place.phone && (
              <a href={`tel:${place.phone}`} className="modal-info-row modal-info-link">
                <span className="modal-info-icon">📞</span>
                <span>{place.phone}</span>
              </a>
            )}
            {place.city && (
              <div className="modal-info-row">
                <span className="modal-info-icon">🏙️</span>
                <span style={{ textTransform: "capitalize" }}>{place.city}</span>
              </div>
            )}
            {place.distance != null && (
              <div className="modal-info-row">
                <span className="modal-info-icon">🚶</span>
                <span>{Number(place.distance).toFixed(1)} km away</span>
              </div>
            )}
          </div>

          {/* Mood Tags */}
          {Array.isArray(place.mood_tags) && place.mood_tags.length > 0 && (
            <>
              <div className="modal-divider" />
              <div className="modal-section-title">Best For</div>
              <div className="modal-tags">
                {place.mood_tags.map((tag, i) => (
                  <span key={i} className="modal-tag">{String(tag)}</span>
                ))}
              </div>
            </>
          )}

          {/* Hours */}
          <div className="modal-divider" />
          <div className="modal-hours-header">
            <div className="modal-section-title" style={{ marginBottom: 0 }}>Hours</div>
            {place.open_now !== undefined && place.open_now !== null && (
              <span className={`hours-status ${place.open_now ? "open" : "closed"}`}>
                ● {place.open_now ? "Open now" : "Closed now"}
              </span>
            )}
          </div>
          {hasHours ? (
            <div className="modal-hours-table">
              {DAYS_ORDER.map((day) => {
                const time = hours[day];
                if (!time) return null;
                const isToday = today === day;
                return (
                  <div key={day} className={`hours-row ${isToday ? "hours-row-today" : ""}`}>
                    <span className={`hours-day ${isToday ? "hours-today-text" : ""}`}>
                      {day.charAt(0).toUpperCase() + day.slice(1)}
                    </span>
                    <span className={`hours-time ${isToday ? "hours-today-text" : ""} ${String(time).toLowerCase() === "closed" ? "hours-closed" : ""}`}>
                      {String(time)}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="hours-unavailable">Hours not available</div>
          )}

          {/* Directions CTA */}
          <div className="modal-divider" />
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lon}`}
            target="_blank" rel="noreferrer"
            className="directions-cta"
          >
            <div className="directions-cta-left">
              <span style={{ fontSize: 28 }}>🗺️</span>
              <div>
                <div className="directions-cta-title">Get Directions</div>
                {place.distance != null && (
                  <div className="directions-cta-sub">{Number(place.distance).toFixed(1)} km away</div>
                )}
              </div>
            </div>
            <span className="directions-chevron">›</span>
          </a>

          <button className="modal-close-btn" onClick={onClose}>✕ Close</button>
        </div>
      </div>
    </div>
  );
}

// ── Dashboard ────────────────────────────────────────────────────────────
function Dashboard({ isDark, setIsDark }) {
  const [mood, setMood] = useState("");

  const [radius, setRadius] = useState(3);
  const [openNow, setOpenNow] = useState(false);
  const [sortBy, setSortBy] = useState("rating");
  const [searchQuery, setSearchQuery] = useState("");
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [favourites, setFavourites] = useState([]);
  const [activeTab, setActiveTab] = useState("explore");
  const [searchHistory, setSearchHistory] = useState([]);

  useEffect(() => {
   
    loadFavourites();
    loadHistory();
  }, []);

  const getLocation = () => ({
  lat: 13.3525,
  lon: 74.7934,
});
  const loadHistory = () => {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      if (raw) setSearchHistory(JSON.parse(raw));
    } catch (e) {}
  };

  const saveToHistory = (moodKey) => {
    const moodObj = MOODS.find((m) => m.key === moodKey);
    if (!moodObj) return;
    const label = `${moodObj.emoji} ${moodObj.label}`;
    const raw = localStorage.getItem(HISTORY_KEY);
    let history = raw ? JSON.parse(raw) : [];
    history = [label, ...history.filter((h) => h !== label)].slice(0, MAX_HISTORY);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    setSearchHistory(history);
  };

  const clearHistory = () => {
    localStorage.removeItem(HISTORY_KEY);
    setSearchHistory([]);
  };

  const moodKeyFromLabel = (label) => {
    const found = MOODS.find((m) => `${m.emoji} ${m.label}` === label);
    return found?.key || "";
  };

  const loadFavourites = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/api/user/favourites`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (Array.isArray(data)) setFavourites(data);
      else if (Array.isArray(data.favourites)) setFavourites(data.favourites);
    } catch (e) {}
  };



  const handleSearch = async (moodKey) => {
    const selectedMood = moodKey || mood;
    if (!selectedMood) return;
    if (moodKey) setMood(moodKey);
    const loc = getLocation();
    setLoading(true);
    setError("");
    setPlaces([]);
    setSearched(true);
    setActiveTab("explore");
    saveToHistory(selectedMood);

    try {
      const params = new URLSearchParams({ mood: selectedMood, lat: loc.lat, lon: loc.lon, radius });
      const res = await fetch(`${API_BASE}/api/places?${params}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setPlaces(data.results || []);
    } catch (err) {
      setError(err.message || "Failed to fetch places");
    } finally {
      setLoading(false);
    }
  };

  const toggleFav = async (place) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const exists = favourites.find((p) => p.title === place.title);
    if (exists) {
      setFavourites((prev) => prev.filter((p) => p.title !== place.title));
      await fetch(`${API_BASE}/api/user/favourites`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ place }),
      });
    } else {
      setFavourites((prev) => [...prev, place]);
      await fetch(`${API_BASE}/api/user/favourites`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ place }),
      });
    }
  };

  const isFav = (place) => favourites.some((p) => p.title === place.title);

  const filterAndSort = (list) => {
    let result = [...list];
    if (openNow) result = result.filter((p) => p.open_now === true);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.type?.toLowerCase().includes(q) ||
          p.address?.toLowerCase().includes(q)
      );
    }
    result.sort((a, b) => {
      if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
      if (sortBy === "reviews") return (b.reviews || 0) - (a.reviews || 0);
      if (sortBy === "distance") return (a.distance || 0) - (b.distance || 0);
      if (sortBy === "name") return (a.title || "").localeCompare(b.title || "");
      return 0;
    });
    return result;
  };

  const displayPlaces = activeTab === "favourites"
    ? filterAndSort(favourites)
    : filterAndSort(places);


const activeLocation = "📍 Manipal";
  return (
    <div className={`app-root ${isDark ? "dark" : ""}`}>
      <Navbar isDark={isDark} setIsDark={setIsDark} />

      <div className="hero-banner">
        <h1>Discover Spots Made for Right Now</h1>
        <p>Find cafes, restaurants and hangout spots tailored to how you feel.</p>
      </div>

      <div className="container">
        {/* Tabs */}
        <div className="tabs">
          <button className={`tab ${activeTab === "explore" ? "active" : ""}`} onClick={() => setActiveTab("explore")}>
            🔍 Explore
          </button>
          <button className={`tab ${activeTab === "favourites" ? "active" : ""}`} onClick={() => { setActiveTab("favourites"); loadFavourites(); }}>
            ❤️ Favourites ({favourites.length})
          </button>
        </div>

        {activeTab === "explore" && (
          <>
            {/* Location Bar */}
            

            {/* Search History */}
            {searchHistory.length > 0 && (
              <div className="history-section">
                <div className="history-header">
                  <span className="section-title">🕐 Recent Searches</span>
                  <button className="clear-btn" onClick={clearHistory}>Clear</button>
                </div>
                <div className="history-chips">
                  {searchHistory.map((item, i) => (
                    <button key={i} className="history-chip" onClick={() => handleSearch(moodKeyFromLabel(item))}>
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Mood Grid */}
            <p className="section-title">What's your mood?</p>
            <div className="mood-grid">
              {MOODS.map((m) => (
                <button
                  key={m.key}
                  className={`mood-btn ${mood === m.key ? "active" : ""}`}
                  style={{ "--color": m.color, "--bg": m.bg }}
                  onClick={() => setMood(m.key)}
                >
                  <span className="emoji">{m.emoji}</span>
                  <span className="label">{m.label}</span>
                  <span className="sub">{m.sub}</span>
                </button>
              ))}
            </div>

            {/* Filters */}
            <div className="filters">
              <div>
                <p className="section-title">Radius</p>
                <div className="filter-pills">
                  {RADIUS_OPTIONS.map((r) => (
                    <button key={r} className={`pill ${radius === r ? "active" : ""}`} onClick={() => setRadius(r)}>
                      {r} km
                    </button>
                  ))}
                </div>
              </div>
              <div className="toggle-row">
                <label className="toggle">
                  <input type="checkbox" checked={openNow} onChange={(e) => setOpenNow(e.target.checked)} />
                  <span className="toggle-slider" />
                </label>
                <span className="toggle-label">🕐 Open Now only</span>
              </div>
            </div>

            <button className="search-btn" onClick={() => handleSearch()} disabled={!mood || loading}>
              {loading ? "Searching..." : "🔍 Find Places Near Me"}
            </button>
          </>
        )}

        {/* Search + Sort */}
        {(places.length > 0 || activeTab === "favourites") && (
          <>
            <div className="search-bar-wrap">
              <span className="search-icon">🔎</span>
              <input
                type="text"
                placeholder="Search by name, type, area..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="sort-row">
              <span>Sort by:</span>
              {SORT_OPTIONS.map((s) => (
                <button key={s.value} className={`pill ${sortBy === s.value ? "active" : ""}`} onClick={() => setSortBy(s.value)}>
                  {s.label}
                </button>
              ))}
            </div>
          </>
        )}

        {loading && <div className="loading"><div className="loading-spinner" />Finding places for you...</div>}
        {error && <div className="error">❌ {error}</div>}
        {searched && !loading && displayPlaces.length === 0 && !error && (
          <div className="empty">
            {activeTab === "favourites" ? "❤️ No favourites yet — start exploring!" : "😕 No places found. Try increasing the radius!"}
          </div>
        )}

        {/* Results Grid */}
        {displayPlaces.length > 0 && (
          <>
            <p className="results-header">
              {activeTab === "favourites" ? `❤️ ${displayPlaces.length} saved places` : `🎯 ${displayPlaces.length} places found`}
            </p>
            <div className="results-grid">
              {displayPlaces.map((place, i) => (
                <div
                  key={i}
                  className="place-card"
                  style={{ animationDelay: `${i * 40}ms` }}
                  onClick={() => setSelectedPlace(place)}
                >
                  <div className="place-img-wrap">
                    <img
                      src={place.image || place.thumbnail}
                      alt={place.title}
                      className="place-img"
                      onError={(e) => { e.target.src = "https://placehold.co/400x200?text=No+Image"; }}
                    />
                    <div className="place-img-overlay">
                      <span className="place-name-overlay">{place.title}</span>
                      {place.rating > 0 && <span className="rating-overlay">⭐ {place.rating}</span>}
                    </div>
                    <button
                      className="card-fav-btn"
                      onClick={(e) => { e.stopPropagation(); toggleFav(place); }}
                    >
                      {isFav(place) ? "❤️" : "🤍"}
                    </button>
                  </div>
                  <div className="place-info">
                    <div className="place-type">{place.type}</div>
                    <div className="place-address">📍 {place.address}</div>
                    <div className="place-meta">
                      {place.reviews > 0 && <span className="reviews">({Number(place.reviews).toLocaleString()} reviews)</span>}
                      {place.distance != null && <span className="distance-badge">🚶 {Number(place.distance).toFixed(1)} km</span>}
                      {place.open_now !== undefined && place.open_now !== null && (
                        <span className={`open-badge ${place.open_now ? "open" : "closed"}`}>
                          {place.open_now ? "Open" : "Closed"}
                        </span>
                      )}
                      {place.price_level && <span className="price-badge">{String(place.price_level)}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Place Detail Modal */}
      <PlaceModal
        place={selectedPlace}
        onClose={() => setSelectedPlace(null)}
        isFav={selectedPlace ? isFav(selectedPlace) : false}
        onToggleFav={toggleFav}
      />
    </div>
  );
}

// ── App Root ─────────────────────────────────────────────────────────────
export default function App() {
  const [isDark, setIsDark] = useState(false);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard isDark={isDark} setIsDark={setIsDark} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}