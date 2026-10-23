import React, { useState } from 'react';
import { Popcorn, Heart, Send, Check } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail('');
      }, 2000);
    }
  };

  return (
    <footer className="footer-wrap">
      <div className="footer-card glass-panel">
        <div className="footer-top-row">
          {/* Brand Info */}
          <div className="footer-brand-col">
            <div className="brand-logo">
              <div className="brand-icon-wrapper">
                <Popcorn className="brand-icon" size={20} />
              </div>
              <span className="brand-name">
                POP<span className="brand-highlight">N</span>SIZZLE
              </span>
            </div>
            <p className="footer-tagline">
              Reinventing the snack experience. Artisan kettle-popped mushroom corn and refreshing cold-pressed botanical sips.
            </p>
            <div className="footer-social-row">
              <span className="social-pill glass-pill">✨ Handcrafted Daily</span>
              <span className="social-pill glass-pill">🌱 Non-GMO Certified</span>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="footer-nav-col">
            <h4 className="footer-title">Menu & Combos</h4>
            <ul className="footer-links-list">
              <li><a href="#menu">Artisan Popcorn Flavors</a></li>
              <li><a href="#menu">Cold Botanical Drinks</a></li>
              <li><a href="#combos">Curated Pairing Duos</a></li>
              <li><a href="#story">Ingredients & Sourcing</a></li>
            </ul>
          </div>

          {/* Newsletter Box */}
          <div className="footer-news-col">
            <h4 className="footer-title">Get Secret Flavor Drops</h4>
            <p className="footer-sub">
              Be the first to sample limited seasonal popcorn batches and experimental fizzy brews.
            </p>
            <form onSubmit={handleSubscribe} className="newsletter-form">
              <div className="input-with-button glass-pill">
                <input
                  type="email"
                  required
                  placeholder="Enter your email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="newsletter-input"
                />
                <button
                  type="submit"
                  className="btn-primary newsletter-btn"
                  aria-label="Subscribe"
                >
                  {subscribed ? <Check size={16} /> : <Send size={16} />}
                </button>
              </div>
              {subscribed && (
                <span className="subscribe-success-msg">
                  🎉 Welcome! 15% off coupon sent to your inbox.
                </span>
              )}
            </form>
          </div>
        </div>

        <div className="footer-bottom-line">
          <p>© {new Date().getFullYear()} POPNSIZZLE Inc. All rights reserved.</p>
          <p className="footer-made-with">
            Designed with modern minimalism & dynamic glassmorphism.
          </p>
        </div>
      </div>
    </footer>
  );
}
