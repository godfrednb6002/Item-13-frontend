import React from 'react';
import { Home, Compass } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';
import '../styles/pages/not-found.css';

export default function NotFoundPage({ user, onNavigate }) {
  const { isDark } = useTheme();

  const handleHomeClick = () => {
    if (user) {
      onNavigate('home');
    } else {
      onNavigate('landing');
    }
  };

  return (
    <div className={`not-found-page-wrapper ${isDark ? 'dark-mode' : 'light-mode'}`}>
      {/* Top Floating Controls Bar */}
      <header className="not-found-header">
        <div className="not-found-header-right">
          <ThemeToggle className="not-found-theme-toggle" />
        </div>
      </header>

      {/* Main split composition replicating the design exactly */}
      <main className="not-found-stage">
        {/* Left Side: Text and Actions */}
        <section className="not-found-content-side">
          <div className="not-found-badge-num">404</div>
          <h1 className="not-found-headline">
            Oops! This Popcorn<br />
            Bag is Empty.
          </h1>
          <p className="not-found-subtext">
            Looks like the page you are looking doesn't exist.
          </p>

          <div className="not-found-actions-group">
            <button
              type="button"
              className="not-found-primary-cta"
              onClick={handleHomeClick}
            >
              <Home size={18} />
              <span>{user ? 'Return to Home' : 'Back to Item 13'}</span>
            </button>

            <button
              type="button"
              className="not-found-secondary-cta"
              onClick={() => onNavigate('menu')}
            >
              <Compass size={18} />
              <span>Explore the Menu</span>
            </button>
          </div>
        </section>

        {/* Right Side: Popcorn Bag with Gold Diagonal & watermark icons */}
        <section className="not-found-graphic-side">
          {/* Yellow angled background block with subtle food patterns */}
          <div className="not-found-diagonal-backdrop">
            <svg className="not-found-svg-pattern" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
              <defs>
                <pattern id="foodIconsPattern" width="140" height="140" patternUnits="userSpaceOnUse">
                  {/* Drink cup */}
                  <path d="M25 25 L45 25 L41 62 L29 62 Z" fill="none" stroke="rgba(0, 0, 0, 0.1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <line x1="35" y1="14" x2="35" y2="25" stroke="rgba(0, 0, 0, 0.1)" strokeWidth="2" strokeLinecap="round" />
                  <line x1="23" y1="32" x2="47" y2="32" stroke="rgba(0, 0, 0, 0.1)" strokeWidth="1.5" />
                  
                  {/* Burger */}
                  <path d="M80 34 Q96 20 112 34 Z" fill="none" stroke="rgba(0, 0, 0, 0.1)" strokeWidth="2" strokeLinecap="round" />
                  <rect x="78" y="37" width="36" height="4" rx="2" fill="none" stroke="rgba(0, 0, 0, 0.1)" strokeWidth="1.8" />
                  <path d="M78 44 Q96 52 114 44 Z" fill="none" stroke="rgba(0, 0, 0, 0.1)" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="88" cy="27" r="1" fill="rgba(0, 0, 0, 0.1)" />
                  <circle cx="96" cy="25" r="1" fill="rgba(0, 0, 0, 0.1)" />
                  <circle cx="104" cy="28" r="1" fill="rgba(0, 0, 0, 0.1)" />

                  {/* Fries */}
                  <path d="M30 92 L36 122 L54 122 L60 92 Z" fill="none" stroke="rgba(0, 0, 0, 0.1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <line x1="38" y1="80" x2="40" y2="92" stroke="rgba(0, 0, 0, 0.1)" strokeWidth="2" strokeLinecap="round" />
                  <line x1="45" y1="74" x2="45" y2="92" stroke="rgba(0, 0, 0, 0.1)" strokeWidth="2.2" strokeLinecap="round" />
                  <line x1="52" y1="82" x2="50" y2="92" stroke="rgba(0, 0, 0, 0.1)" strokeWidth="2" strokeLinecap="round" />

                  {/* Popcorn container icon */}
                  <path d="M92 98 L97 124 L113 124 L118 98 Z" fill="none" stroke="rgba(0, 0, 0, 0.1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="98" cy="92" r="3.5" fill="none" stroke="rgba(0, 0, 0, 0.1)" strokeWidth="1.5" />
                  <circle cx="105" cy="89" r="4" fill="none" stroke="rgba(0, 0, 0, 0.1)" strokeWidth="1.5" />
                  <circle cx="112" cy="93" r="3.5" fill="none" stroke="rgba(0, 0, 0, 0.1)" strokeWidth="1.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#foodIconsPattern)" />
            </svg>
          </div>

          {/* The high-res spilled popcorn bag png */}
          <div className="not-found-bag-container">
            <img
              src="/spilledPopcorn.png"
              alt="Item 13 Popcorn Bag Spilled and Empty"
              className="not-found-spilled-bag-img"
              loading="eager"
            />
          </div>
        </section>
      </main>
    </div>
  );
}
