import React from 'react';
import { Sparkles, ArrowRight, Flame, ShieldCheck, Clock, Award } from 'lucide-react';

export default function Hero({ onExploreClick, onQuickAddCombo }) {
  return (
    <section id="hero" className="hero-section">
      <div className="hero-content">
        {/* Modern Pill Tag */}
        <div className="hero-badge-wrapper">
          <div className="glass-pill hero-badge">
            <span className="pulsing-dot" />
            <Sparkles size={14} className="badge-sparkle-icon" />
            <span>Handcrafted in Micro-Batches Daily</span>
          </div>
        </div>

        {/* Hero Title */}
        <h1 className="hero-title">
          Elevate your crunch. <br />
          <span className="gradient-text">Sip the extraordinary.</span>
        </h1>

        {/* Hero Subtitle */}
        <p className="hero-description">
          Where mushroom-kernel artisanal popcorn meets cold-pressed craft botanicals.
          Crafted with pure whole ingredients, zero artificial flavoring, and maximum flavor punch.
        </p>

        {/* Hero Actions */}
        <div className="hero-cta-group">
          <a href="#menu" onClick={onExploreClick} className="btn-primary hero-btn-main">
            <span>Explore Menu</span>
            <ArrowRight size={18} />
          </a>
          <a href="#combos" className="btn-secondary hero-btn-sub">
            <span>Signature Pairings</span>
          </a>
        </div>

        {/* Hero Quick Perks Bar */}
        <div className="hero-features-bar glass-panel">
          <div className="feature-item">
            <Flame className="feature-icon text-amber" size={20} />
            <div className="feature-text">
              <strong>Kettle Fresh</strong>
              <span>Popped every 2 hours</span>
            </div>
          </div>
          <div className="feature-divider" />
          <div className="feature-item">
            <ShieldCheck className="feature-icon text-purple" size={20} />
            <div className="feature-text">
              <strong>100% Organic</strong>
              <span>Non-GMO & gluten-free</span>
            </div>
          </div>
          <div className="feature-divider" />
          <div className="feature-item">
            <Clock className="feature-icon text-emerald" size={20} />
            <div className="feature-text">
              <strong>Rapid Delivery</strong>
              <span>Warm to your doorstep</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Visual Glass Showcase */}
      <div className="hero-visual-wrapper">
        <div className="hero-card-stack">
          {/* Main Showcase Glass Card */}
          <div className="hero-main-card glass-panel">
            <div className="card-media-wrap">
              <img
                src="https://images.unsplash.com/photo-1578849278619-e73505e9610f?auto=format&fit=crop&w=800&q=80"
                alt="Artisan Popcorn with Sea Salt Caramel"
                className="hero-img-popcorn"
                loading="eager"
              />
              <div className="floating-price-tag glass-pill">
                <span className="price-label">Pairing Duo</span>
                <span className="price-amount">$10.00</span>
              </div>
            </div>

            <div className="hero-card-details">
              <div className="hero-card-header">
                <div>
                  <span className="badge-tag badge-amber">Chef's Choice</span>
                  <h3 className="hero-card-title">Salted Caramel & Yuzu Sparkler</h3>
                </div>
                <div className="rating-pill">
                  ⭐ <span>4.9</span>
                </div>
              </div>
              <p className="hero-card-sub">
                Buttery crunch with Fleur de Sel paired with ice-cold aromatic Japanese Yuzu.
              </p>
              <button
                type="button"
                className="btn-primary w-full add-hero-duo-btn"
                onClick={onQuickAddCombo}
              >
                + Quick Add Duo to Bag
              </button>
            </div>
          </div>

          {/* Floating Beverage Mini Glass Widget */}
          <div className="hero-floating-drink-card glass-panel">
            <img
              src="https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=300&q=80"
              alt="Sparkling Yuzu Blossom"
              className="drink-mini-thumb"
            />
            <div className="drink-mini-info">
              <span className="drink-mini-title">Cold Craft Soda</span>
              <span className="drink-mini-temp">🧊 Served at 38°F</span>
            </div>
          </div>

          {/* Floating Organic Quality Seal */}
          <div className="hero-floating-badge glass-pill">
            <Award size={16} className="text-amber" />
            <span>Gold Standard Taste 2026</span>
          </div>
        </div>
      </div>
    </section>
  );
}
