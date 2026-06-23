import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import "./landingpage.css";

const MOODS = [
  { emoji: "📚", label: "Study",       sub: "Wifi · Quiet",      color: "purple" },
  { emoji: "🍔", label: "Hangout",     sub: "Cozy · Casual",     color: "pink"   },
  { emoji: "🍕", label: "Quick Bite",  sub: "Fast · Easy",       color: "amber"  },
  { emoji: "🪙", label: "Budget",      sub: "Cheap · Value",     color: "green"  },
  { emoji: "🎉", label: "Nightlife",   sub: "Clubs · Music",     color: "pink"   },
  { emoji: "🎮", label: "Gaming",      sub: "Arcade · Fun",      color: "violet" },
  { emoji: "🏋️", label: "Fitness",    sub: "Gym · Active",      color: "cyan"   },
  { emoji: "🚗", label: "Rentals",     sub: "Bikes · Cars",      color: "lime"   },
  { emoji: "💎", label: "Hidden Gems", sub: "Unique · Local",    color: "teal"   },
  { emoji: "🏖️", label: "Beaches",    sub: "Sand · Sun",        color: "sky"    },
  { emoji: "🎬", label: "Movies",      sub: "Theatres · Films",  color: "red"    },
  { emoji: "☕", label: "Cafes",       sub: "Coffee · Chill",    color: "blue"   },
];

const TESTIMONIALS = [
  { quote: "I used to spend forever scrolling trying to find a quiet cafe to study. Now I just pick Study and I'm there in five minutes.", author: "— Disha, Manipal", cls: "t-purple" },
  { quote: "Found the best rooftop bar for our friend's birthday in minutes. The nightlife filter is a lifesaver on weekends.", author: "— Aroha, Udupi", cls: "t-pink" },
  { quote: "Ratings and 'open now' status saved me from showing up to a closed gym twice. Such a small thing but so useful.", author: "— Rohan, Manipal", cls: "t-green" },
  { quote: "As a student, the budget filter helps me find good food without blowing my monthly allowance. Genuinely use it every week.", author: "— Rashmi, MIT Manipal", cls: "t-amber" },
];

export default function LandingPage() {
  const revealRefs = useRef([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); } }),
      { threshold: 0.12 }
    );
    revealRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const r = (delay = 0) => (el) => {
    if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el);
    if (el) el.style.transitionDelay = `${delay}s`;
  };

  return (
    <div className="lp-root">

      {/* ── NAV ── */}
      <nav className="lp-nav">
        <Link to="/" className="lp-logo">
          <span className="lp-dot" /> Smart Nearby
        </Link>
        <div className="lp-nav-links">
          <a href="#moods">Moods</a>
          <a href="#how">How it works</a>
          <a href="#features">Features</a>
          <Link to="/signup" className="lp-nav-cta">Get Started</Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="lp-hero">
        <div className="lp-hero-floats" aria-hidden="true">
          <div className="lp-float-card fc1"><span>📚</span><div><strong>Study Spot found</strong><br /><small>0.4 km · Open now</small></div></div>
          <div className="lp-float-card fc2"><span>🎉</span><div><strong>Nightlife vibes</strong><br /><small>12 places nearby</small></div></div>
          <div className="lp-float-card fc3"><span>⭐</span><div><strong>4.8 · Cafe Mocha</strong><br /><small>Budget-friendly</small></div></div>
          <div className="lp-float-card fc4"><span>📍</span><div><strong>GPS detected</strong><br /><small>Manipal, KA</small></div></div>
        </div>

        <div className="lp-hero-badge">✨ Discover places that match your mood</div>
        <h1 className="lp-hero-title">Find the right place,<br />for how you feel right now.</h1>
        <p className="lp-hero-sub">From quiet cafes to buzzing nightlife — Smart Nearby discovers spots near you that precisely match your mood, budget, and schedule.</p>
        <div className="lp-hero-actions">
          <Link to="/signup" className="lp-btn-primary">Start Exploring Free →</Link>
          <a href="#how" className="lp-btn-secondary">See how it works</a>
        </div>
      </section>

      {/* ── MOODS ── */}
      <section id="moods" className="lp-moods-section">
        <div className="lp-inner">
          <p className="lp-label reveal" ref={r(0)}>Pick a Mood</p>
          <h2 className="lp-section-title reveal" ref={r(0.1)}>Every mood gets its own shortcut.</h2>
          <p className="lp-section-sub reveal" ref={r(0.2)}>Tap what you're in the mood for and we'll surface places built for exactly that feeling.</p>

          <div className="lp-mood-grid">
            {MOODS.map((m, i) => (
              <div key={m.label} className={`lp-mood-chip mc-${m.color} reveal`} ref={r(i * 0.04)}>
                <span className="mc-emoji">{m.emoji}</span>
                <span className="mc-label">{m.label}</span>
                <span className="mc-sub">{m.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <div className="lp-stats">
        {[
          { num: "11+", label: "Mood Categories" },
          { num: "6+",  label: "Cities covered" },
          { num: "5km", label: "Max search radius" },
          { num: "Real", label: "Time ratings & hours" },
        ].map((s, i) => (
          <div key={s.label} className="lp-stat reveal" ref={r(i * 0.1)}>
            <div className="lp-stat-num">{s.num}</div>
            <div className="lp-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── HOW IT WORKS ── */}
      <section id="how" className="lp-how">
        <div className="lp-inner">
          <p className="lp-label lp-label-amber reveal" ref={r(0)}>How it works</p>
          <h2 className="lp-section-title lp-title-white reveal" ref={r(0.1)}>Less searching, more doing.</h2>
          <p className="lp-section-sub lp-sub-muted reveal" ref={r(0.2)}>Three steps and you're out the door.</p>

          <div className="lp-steps">
            {[
              { num: "01", icon: "🎯", bg: "#1e1f3a", title: "Pick your mood", text: "Tell us what you're in the mood for — study session, quick bite, nightlife, gym, or anything else. We filter out everything that doesn't fit." },
              { num: "02", icon: "📍", bg: "#2d2410", title: "We find what's nearby", text: "Your GPS or a city you choose. Real places, real ratings, real open-now status — sorted by relevance, not ads." },
              { num: "03", icon: "⭐", bg: "#0d2a1e", title: "Go, save, repeat", text: "Navigate with one tap. Save favourites to revisit later. Call ahead. Your history and saved spots stick around across sessions." },
            ].map((step, i) => (
              <div key={step.num} className="lp-step reveal" ref={r(i * 0.15)}>
                <span className="lp-step-num">{step.num}</span>
                <div className="lp-step-icon" style={{ background: step.bg }}>{step.icon}</div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="lp-features">
        <div className="lp-inner">
          <p className="lp-label reveal" ref={r(0)}>Features</p>
          <h2 className="lp-section-title reveal" ref={r(0.1)}>Built for how you actually explore.</h2>
          <p className="lp-section-sub reveal" ref={r(0.2)}>Every feature started as a real frustration.</p>

          <div className="lp-feat-grid">
            <div className="lp-feat-card lp-feat-wide reveal" ref={r(0)}>
              <div>
                <div className="lp-feat-icon" style={{ background: "#e0e4ff" }}>🎯</div>
                <h3>Mood-based discovery</h3>
                <p>Not just keyword search. Pick a mood and we surface places filtered by type, vibe, price, and what's actually open — so you only see options worth considering.</p>
                <span className="lp-feat-tag">11 moods &amp; counting</span>
              </div>
              <div className="lp-feat-visual lp-fv-purple">🎯</div>
            </div>

            <div className="lp-feat-card lp-feat-amber reveal" ref={r(0.1)}>
              <div className="lp-feat-icon" style={{ background: "#fde68a" }}>📍</div>
              <h3>GPS location detection</h3>
              <p>Finds places from where you actually are — or toggle between Manipal, Mangalore, Bangalore, Mumbai, and more.</p>
              <span className="lp-feat-tag lp-tag-amber">Instant &amp; accurate</span>
            </div>

            <div className="lp-feat-card lp-feat-green reveal" ref={r(0.2)}>
              <div className="lp-feat-icon" style={{ background: "#a7f3d0" }}>⭐</div>
              <h3>Ratings, hours &amp; prices</h3>
              <p>Know before you go. See Google ratings, open-now status, price level, address, and photos — right in the results list.</p>
              <span className="lp-feat-tag lp-tag-green">No more surprises</span>
            </div>

            <div className="lp-feat-card lp-feat-pink reveal" ref={r(0.1)}>
              <div className="lp-feat-icon" style={{ background: "#fbcfe8" }}>❤️</div>
              <h3>Favourites that stick</h3>
              <p>Bookmark places you love — saved to your account in MongoDB so they follow you across devices and sessions.</p>
              <span className="lp-feat-tag lp-tag-pink">Persists across sessions</span>
            </div>

            <div className="lp-feat-card lp-feat-violet reveal" ref={r(0.2)}>
              <div className="lp-feat-icon" style={{ background: "#ddd6fe" }}>🔐</div>
              <h3>Secure JWT login</h3>
              <p>Sign up and your favourites, history, and preferences are tied to your account — protected with JWT and bcrypt.</p>
              <span className="lp-feat-tag lp-tag-violet">Auth you can trust</span>
            </div>

            <div className="lp-feat-card lp-feat-wide reveal" ref={r(0)}>
              <div>
                <div className="lp-feat-icon" style={{ background: "#a5f3fc" }}>📞</div>
                <h3>One-tap call &amp; navigate</h3>
                <p>Call a place directly from the app. Open directions in Google Maps with one tap. No switching between apps.</p>
                <span className="lp-feat-tag lp-tag-cyan">Tap to go</span>
              </div>
              <div className="lp-feat-visual lp-fv-cyan">🗺️</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="lp-social">
        <div className="lp-inner">
          <p className="lp-label lp-label-amber reveal" ref={r(0)}>What people say</p>
          <h2 className="lp-section-title lp-title-white reveal" ref={r(0.1)}>Loved by people on the go.</h2>
          <p className="lp-section-sub lp-sub-muted reveal" ref={r(0.2)}>Students and explorers across Manipal, Udupi, and beyond.</p>
          <div className="lp-testimonials">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className={`lp-tcard ${t.cls} reveal`} ref={r(i * 0.1)}>
                <div className="lp-quote-mark">"</div>
                <p className="lp-quote">{t.quote}</p>
                <p className="lp-author">{t.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="lp-cta">
        <h2 className="reveal" ref={r(0)}>Ready to find your spot?</h2>
        <p className="reveal" ref={r(0.1)}>Join Smart Nearby and start exploring places made for how you feel — free, fast, and always nearby.</p>
        <div className="lp-cta-btns reveal" ref={r(0.2)}>
          <Link to="/signup" className="lp-btn-white">Create Free Account →</Link>
          <Link to="/login" className="lp-btn-ghost">I already have an account</Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="lp-footer">
        <div className="lp-inner">
          <div className="lp-footer-top">
            <div className="lp-footer-brand">
              <div className="lp-footer-logo"><span className="lp-dot lp-dot-sm" /> Smart Nearby</div>
              <p>Discover cafes, restaurants, gyms, and more — filtered by your mood, location, and budget.</p>
            </div>
            <div className="lp-footer-col">
              <h4>Product</h4>
              <ul>
                <li><a href="#moods">Moods</a></li>
                <li><a href="#how">How it works</a></li>
                <li><a href="#features">Features</a></li>
              </ul>
            </div>
            <div className="lp-footer-col">
              <h4>Account</h4>
              <ul>
                <li><Link to="/signup">Sign up</Link></li>
                <li><Link to="/login">Login</Link></li>
              </ul>
            </div>
            <div className="lp-footer-col">
              <h4>Cities</h4>
              <ul>
                {["Manipal","Mangalore","Bangalore","Mumbai","Hyderabad","Pune"].map(c => <li key={c}><a href="#moods">{c}</a></li>)}
              </ul>
            </div>
          </div>
          <div className="lp-footer-bottom">
            <p>© 2025 Smart Nearby. Built with ❤️ in Manipal.</p>
            <div className="lp-badges">
              <span>React Native</span><span>Node.js</span><span>MongoDB</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
