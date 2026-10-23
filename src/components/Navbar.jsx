import React from 'react';
import { Sun, Moon, ShoppingBag, Sparkles, Menu, X, Popcorn, Coffee } from 'lucide-react';

export default function Navbar({
  theme,
  toggleTheme,
  cartCount,
  onOpenCart,
  activeFilter,
  setActiveFilter,
  mobileMenuOpen,
  setMobileMenuOpen,
}) {
  return (
    <header className="navbar-wrapper">
      <nav className="navbar glass-pill">
        {/* Brand Logo */}
        <a href="#hero" className="brand-logo" aria-label="POPNSIZZLE Home">
          <div className="brand-icon-wrapper">
            <Popcorn className="brand-icon" size={22} />
          </div>
          <span className="brand-name">
            POP<span className="brand-highlight">N</span>SIZZLE
          </span>
        </a>

        {/* Desktop Navigation Links */}
        <div className="nav-links desktop-only">
          <a
            href="#menu"
            onClick={() => setActiveFilter('all')}
            className={`nav-link ${activeFilter === 'all' ? 'active' : ''}`}
          >
            Full Menu
          </a>
          <a
            href="#menu"
            onClick={() => setActiveFilter('popcorn')}
            className={`nav-link ${activeFilter === 'popcorn' ? 'active' : ''}`}
          >
            🍿 Gourmet Popcorn
          </a>
          <a
            href="#menu"
            onClick={() => setActiveFilter('drink')}
            className={`nav-link ${activeFilter === 'drink' ? 'active' : ''}`}
          >
            🥤 Craft Drinks
          </a>
          <a href="#combos" className="nav-link">
            Pairing Combos
          </a>
          <a href="#story" className="nav-link">
            Our Craft
          </a>
        </div>

        {/* Action Controls: Theme Switcher & Cart */}
        <div className="nav-actions">
          {/* Theme Toggle Button */}
          <button
            type="button"
            className="btn-icon theme-toggle-btn"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? (
              <Sun size={19} className="theme-icon sun-icon" />
            ) : (
              <Moon size={19} className="theme-icon moon-icon" />
            )}
          </button>

          {/* Cart Floating Button */}
          <button
            type="button"
            className="btn-primary cart-trigger-btn"
            onClick={onOpenCart}
            aria-label="View shopping bag"
          >
            <ShoppingBag size={18} />
            <span className="cart-text desktop-only">Bag</span>
            <span className="cart-badge">{cartCount}</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            className="btn-icon mobile-only menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Glass Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="mobile-dropdown glass-panel">
          <div className="mobile-links">
            <a
              href="#menu"
              onClick={() => {
                setActiveFilter('all');
                setMobileMenuOpen(false);
              }}
              className="mobile-link"
            >
              All Offerings
            </a>
            <a
              href="#menu"
              onClick={() => {
                setActiveFilter('popcorn');
                setMobileMenuOpen(false);
              }}
              className="mobile-link"
            >
              🍿 Gourmet Popcorn Selection
            </a>
            <a
              href="#menu"
              onClick={() => {
                setActiveFilter('drink');
                setMobileMenuOpen(false);
              }}
              className="mobile-link"
            >
              🥤 Cold Craft Beverages
            </a>
            <a
              href="#combos"
              onClick={() => setMobileMenuOpen(false)}
              className="mobile-link"
            >
              ✨ Curated Pairing Combos
            </a>
            <a
              href="#story"
              onClick={() => setMobileMenuOpen(false)}
              className="mobile-link"
            >
              🌱 Our Story & Ingredients
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
