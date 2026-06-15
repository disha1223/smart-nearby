import { Link } from "react-router-dom";
import { MapPin, Sparkles, Heart } from "lucide-react";
import "./landingpage.css";

function LandingPage() {
  return (
    <div className="landing">
      <nav className="landing-nav">
        <h1>Smart Nearby</h1>
        <div>
          <Link to="/login">Login</Link>
          <Link to="/signup">Signup</Link>
        </div>
      </nav>

      <div className="hero">
        <div className="hero-decorations">
        </div>

        <div className="hero-content">
          <h1>Find Your Perfect Spot, Every Time</h1>
          <p>Find cafes, restaurants and hangout spots tailored to how you feel.</p>
          <div className="hero-buttons">
            <Link to="/signup" className="primary-btn">
              Get Started
            </Link>
            
          </div>
        </div>
      </div>

      <div className="features">
        <div className="feature-card">
          <div className="feature-icon">
            <MapPin size={32} />
          </div>
          <h3>GPS Based Discovery</h3>
          <p>Find places near you instantly, wherever you are.</p>
          <a href="/signup" className="feature-link">Check it out →</a>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
            <Sparkles size={32} />
          </div>
          <h3>Mood-Based Suggestions</h3>
          <p>Get recommendations that match how you're feeling.</p>
          <a href="/signup" className="feature-link">Check it out →</a>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
            <Heart size={32} />
          </div>
          <h3>Save Favourite Places</h3>
          <p>Bookmark your go-to spots for quick access later.</p>
          <a href="/signup" className="feature-link">Check it out →</a>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;