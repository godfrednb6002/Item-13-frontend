import React from 'react';
import { Home, Sparkles, Compass, ArrowLeft, Search, Popcorn } from 'lucide-react';
import '../styles/pages/not-found.css';

export default function NotFoundPage({ user, onNavigate }) {
  const handleHomeClick = () => {
    if (user) {
      onNavigate('home');
    } else {
      onNavigate('showcase');
    }
  };

  return (
    <div className="not-found-wrapper">
      <div className="not-found-glow-circle circle-1" />
      <div className="not-found-glow-circle circle-2" />

      {/* Floating playful popcorn / kernels */}
      <div className="not-found-floating-item item-1">🍿</div>
      <div className="not-found-floating-item item-2">✨</div>
      <div className="not-found-floating-item item-3">🌽</div>
      <div className="not-found-floating-item item-4">🥤</div>

      <div className="not-found-card glassmorphic">
        {/* Animated 404 Header with popping kernel */}
        <div className="not-found-number-row">
          <span className="not-found-digit">4</span>
          <div className="not-found-popcorn-badge" title="Popped into thin air!">
            <span className="not-found-emoji">🍿</span>
            <span className="not-found-pop-effect">💥</span>
          </div>
          <span className="not-found-digit">4</span>
        </div>

        <div className="not-found-tag">
          <Sparkles size={14} className="sparkle-icon" />
          <span>Page Popped Out of Existence</span>
        </div>

        <h1 className="not-found-title">Whoops! Even Our Kernels Couldn't Find This Page</h1>

        <p className="not-found-description">
          Looks like you wandered into unchartered snacking territory. Don't worry, the crunch hasn't stopped — let's get you back on track!
        </p>

        {/* Action Buttons */}
        <div className="not-found-actions">
          <button
            type="button"
            className="not-found-btn not-found-primary-btn"
            onClick={handleHomeClick}
          >
            <Home size={18} />
            <span>{user ? 'Return to Home' : 'Back to Item 13'}</span>
          </button>

          <button
            type="button"
            className="not-found-btn not-found-secondary-btn"
            onClick={() => onNavigate('menu')}
          >
            <Compass size={18} />
            <span>Explore the Menu</span>
          </button>
        </div>

        {/* Quick links footer */}
        <div className="not-found-quick-links">
          <span>Looking for something specific?</span>
          <div className="quick-links-pills">
            <button type="button" onClick={() => onNavigate('menu')}>Fresh Drops</button>
            <button type="button" onClick={() => onNavigate('events')}>Events & Catering</button>
            <button type="button" onClick={() => onNavigate('contact')}>Get in Touch</button>
          </div>
        </div>
      </div>
    </div>
  );
}
