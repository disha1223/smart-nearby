import { Link } from "react-router-dom";

import "./landingpage.css";

function LandingPage() {

  return (

    <div className="landing">

      <nav className="landing-nav">

        <h1>MoodSpot 🌃</h1>

        <div>

          <Link to="/login">
            Login
          </Link>

          <Link to="/signup">
            Signup
          </Link>

        </div>

      </nav>


      <div className="hero">

        <div className="hero-content">

          <h1>
            Find places
            <span> based on your mood ✨</span>
          </h1>

          <p>
            Discover cafes, clubs, beaches,
            hidden gems and more around you.
          </p>

          <div className="hero-buttons">

            <Link
              to="/signup"
              className="primary-btn"
            >
              Get Started
            </Link>

            <Link
              to="/login"
              className="secondary-btn"
            >
              Login
            </Link>

          </div>

        </div>

      </div>


      <div className="features">

        <div className="feature-card">
          📍 GPS Based Discovery
        </div>

        <div className="feature-card">
          🌃 Mood-Based Suggestions
        </div>

        <div className="feature-card">
          ⭐ Save Favourite Places
        </div>

      </div>

    </div>
  );
}

export default LandingPage;