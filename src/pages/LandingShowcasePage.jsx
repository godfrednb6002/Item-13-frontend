import React, { useState, useRef, useEffect } from 'react';
import {
  Sun,
  Moon,
  Menu,
  X,
  ArrowRight,
  ShoppingBag,
  Sparkles,
  Bell,
  User,
  LayoutDashboard,
  UtensilsCrossed,
  Package,
  LogOut,
  MapPin,
  Heart,
  Truck,
  Info,
  PartyPopper,
  PhoneCall
} from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';
import '../styles/pages/landing-showcase.css';

export default function LandingShowcasePage({
  user = null,
  setUser,
  onNavigate,
  onOpenCart,
  cartCount = 0,
  onAddToCart,
  showToast
}) {
  const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const navMenuRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navMenuRef.current && !navMenuRef.current.contains(e.target)) {
        setIsNavMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    if (isNavMenuOpen || showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isNavMenuOpen, showNotifications]);

  const handleOrderNow = () => {
    if (onNavigate) {
      onNavigate('menu');
    }
  };

  const handleQuickAddPackage = () => {
    if (onAddToCart) {
      onAddToCart({
        id: 'pop-fresh-package',
        name: 'Item13 Fresh Crunch Package',
        price: 35.00,
        image: '/openedItem13Package.png',
        category: 'Signature Popcorn'
      });
    }
    if (showToast) {
      showToast('Added Fresh Crunch Package to your bag!');
    }
  };

  return (
    <div className="inspo-landing-page">
      {/* Background ambient lighting */}
      <div className="inspo-ambient-glow" />

      {/* Background flying popcorn image with low opacity overlaying the watermark */}
      <div className="inspo-bg-flying-popcorn" aria-hidden="true">
        <img src="/flyingPopcornImage.png" alt="" className="inspo-bg-flying-popcorn-img" />
      </div>

      {/* ================= TOP NAVIGATION BAR (FROM STOREFRONT / WELCOME) ================= */}
      <header className="navbar inspo-top-navbar">
        <a
          href="/"
          className="brand-logo"
          onClick={(e) => {
            e.preventDefault();
            if (onNavigate) onNavigate('home');
          }}
        >
          <img
            src="/item13Logo-trimmed.png"
            alt="Item13 Logo"
            className="brand-logo-img"
          />
          <span className="brand-logo-tagline">
            <span>THE UNEXPECTED</span>
            <span className="brand-tagline-space"> </span>
            <br className="brand-tagline-break" />
            <span>ESSENTIAL</span>
          </span>
        </a>

        <div className="nav-right">
          <div className="nav-links">
            <a
              href="#why"
              className="nav-link"
              onClick={(e) => {
                e.preventDefault();
                if (showToast) showToast('Item13 uses premium ingredients and delivers freshly popped popcorn across Ghana.');
              }}
            >
              Why Item13?
            </a>
            <a
              href="/products"
              className="nav-link"
              onClick={(e) => {
                e.preventDefault();
                if (onNavigate) onNavigate('menu');
              }}
            >
              Menu
            </a>
            <a
              href="/delivery"
              className="nav-link"
              onClick={(e) => {
                e.preventDefault();
                if (onNavigate) onNavigate('delivery');
              }}
            >
              Delivery Coverage
            </a>
            <a
              href="/about"
              className="nav-link"
              onClick={(e) => {
                e.preventDefault();
                if (onNavigate) onNavigate('about');
              }}
            >
              About
            </a>
            <a
              href="/events"
              className="nav-link on-yellow"
              onClick={(e) => {
                e.preventDefault();
                if (onNavigate) onNavigate('events');
              }}
            >
              Party &amp; Weddings
            </a>
            <a
              href="/contact"
              className="nav-link"
              onClick={(e) => {
                e.preventDefault();
                if (onNavigate) onNavigate('contact');
              }}
            >
              Contact
            </a>
          </div>

          <div className="nav-buttons-group">
            {/* Top row: Theme, Cart, Notifications, and Hamburger Menu */}
            <div className="nav-tools-row">
              <ThemeToggle className="nav-theme-toggle" />

              {/* Cart / Bag Button */}
              <button
                type="button"
                className="nav-icon-btn"
                onClick={() => onOpenCart && onOpenCart()}
                aria-label={`Open Bag (${cartCount} items)`}
                title="Open Bag / Cart"
              >
                <ShoppingBag size={18} />
                {cartCount > 0 && <span className="nav-badge-dot" />}
              </button>

              {/* Notification Button */}
              <div ref={notifRef} style={{ position: 'relative' }}>
                <button
                  type="button"
                  className={`nav-icon-btn ${showNotifications ? 'is-active' : ''}`}
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                    setIsNavMenuOpen(false);
                  }}
                  aria-label="Notifications"
                  title="Notifications"
                >
                  <Bell size={18} />
                  <span className="nav-badge-dot" />
                </button>

                {/* Notifications Popover */}
                {showNotifications && (
                  <div className="nav-notifications-popover">
                    <div className="nav-notif-title">
                      <span>Notifications</span>
                      <span style={{ fontSize: '11px', color: 'var(--gold)', fontWeight: 600 }}>1 New</span>
                    </div>
                    <p className="nav-notif-empty">
                      🎉 Welcome to Item13! Fresh batches of Gourmet Popcorn are popping now.
                    </p>
                  </div>
                )}
              </div>

              {/* Hamburger Button that expands to modal menu */}
              <div ref={navMenuRef} style={{ position: 'relative' }}>
                <button
                  type="button"
                  className={`nav-icon-btn ${isNavMenuOpen ? 'is-active' : ''}`}
                  onClick={() => {
                    setIsNavMenuOpen(!isNavMenuOpen);
                    setShowNotifications(false);
                  }}
                  aria-label={isNavMenuOpen ? 'Close Menu' : 'Open Navigation Menu'}
                  title={isNavMenuOpen ? 'Close Menu' : 'Account & Navigation Menu'}
                >
                  {isNavMenuOpen ? <X size={18} /> : <Menu size={18} />}
                </button>

                {/* Hamburger Modal Popover */}
                {isNavMenuOpen && (
                  <div className="nav-menu-popover">
                    {user ? (
                      <div className="nav-menu-header">
                        <span className="nav-menu-user-name">{user.name || user.email.split('@')[0]}</span>
                        <span className="nav-menu-user-role">VIP Snack Member</span>
                      </div>
                    ) : (
                      <div className="nav-menu-header">
                        <span className="nav-menu-user-name">Guest Snack Lover</span>
                        <span className="nav-menu-user-role">Item13 Express</span>
                      </div>
                    )}

                    <a
                      href="/products"
                      className="nav-menu-item"
                      onClick={(e) => {
                        e.preventDefault();
                        setIsNavMenuOpen(false);
                        if (onNavigate) onNavigate('menu');
                      }}
                    >
                      <UtensilsCrossed size={16} />
                      <span>Menu</span>
                    </a>

                    <button
                      type="button"
                      className="nav-menu-item"
                      onClick={() => {
                        setIsNavMenuOpen(false);
                        if (onOpenCart) onOpenCart();
                      }}
                    >
                      <ShoppingBag size={16} />
                      <span>My Bag / Cart ({cartCount})</span>
                    </button>

                    <a
                      href="/dashboard/orders"
                      className="nav-menu-item"
                      onClick={(e) => {
                        e.preventDefault();
                        setIsNavMenuOpen(false);
                        if (onNavigate) onNavigate('dashboard/orders');
                      }}
                    >
                      <Package size={16} />
                      <span>Track Orders</span>
                    </a>

                    {user ? (
                      <button
                        type="button"
                        className="nav-menu-item nav-menu-item-logout"
                        onClick={() => {
                          setIsNavMenuOpen(false);
                          if (setUser) setUser(null);
                          if (showToast) showToast('Signed out of Item13.');
                        }}
                      >
                        <LogOut size={16} />
                        <span>Logout</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="nav-menu-item nav-menu-item-logout"
                        style={{ color: 'var(--gold)', borderColor: 'rgba(244, 182, 39, 0.2)' }}
                        onClick={() => {
                          setIsNavMenuOpen(false);
                          if (onNavigate) onNavigate('login');
                        }}
                      >
                        <User size={16} />
                        <span>Sign in / Sign up</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Bottom row: Sign up, Login and Continue as guest aligned underneath */}
            {!user ? (
              <div className="nav-guest-actions">
                <div className="nav-buttons-row">
                  <a
                    href="/signup"
                    className="btn-pill btn-pill-yellow"
                    onClick={(e) => {
                      e.preventDefault();
                      if (onNavigate) onNavigate('signup');
                    }}
                    style={{ textDecoration: 'none' }}
                  >
                    Sign up
                  </a>
                  <a
                    href="/login"
                    className="btn-pill btn-pill-black"
                    onClick={(e) => {
                      e.preventDefault();
                      if (onNavigate) onNavigate('login');
                    }}
                    style={{ textDecoration: 'none' }}
                  >
                    Login
                  </a>
                </div>
                <a
                  href="/products"
                  className="btn-pill btn-pill-outline"
                  onClick={(e) => {
                    e.preventDefault();
                    if (onNavigate) onNavigate('menu');
                  }}
                  style={{ textDecoration: 'none', textAlign: 'center' }}
                >
                  Continue as guest
                </a>
              </div>
            ) : null}
          </div>
        </div>
      </header>

      {/* ------------------------------------------------------------------
          HERO CONTENT:
          Main text on the left side, sub text under, Order now button
          ------------------------------------------------------------------ */}
      <main className="inspo-hero-container">
        <section className="inspo-hero-left">
          <div className="inspo-eyebrow">
            <span>THE UNEXPECTED</span>
            <span className="brand-tagline-space"> </span>
            <br className="brand-tagline-break" />
            <span>ESSENTIAL</span>
          </div>

          <h1 className="inspo-main-heading">
            Flourished <br />
            <span className="inspo-main-heading-accent">Fantasy Crunch</span>
          </h1>

          <p className="inspo-subtext">
            Item13 creates warm, handcrafted artisan popcorn and chilled gourmet refreshments
            popped upon order in Accra. Every sweet caramel and savory batch turns simple moments
            into memorable, crave-worthy experiences.
          </p>

          <div className="inspo-hero-actions-wrap">
            <button
              type="button"
              className="inspo-btn-order-now"
              onClick={handleOrderNow}
            >
              <span>Order Now</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </section>
      </main>

      {/* ------------------------------------------------------------------
          BOTTOM OF PAGE:
          Big Item 13 text overlayed by the opened package image
          ------------------------------------------------------------------ */}
      <section className="inspo-bottom-showcase">
        {/* Glow behind package */}
        <div className="inspo-bottom-glow" />

        {/* Big Item 13 text overlayed by image */}
        <div className="inspo-big-watermark-title" aria-hidden="true">
          item13
        </div>

        {/* Opened package image container */}
        <div
          className="inspo-package-overlay-wrap"
          onClick={handleQuickAddPackage}
          title="Click to add to bag"
        >
          <img
            src="/openedItem13Package.png"
            alt="Item13 Handcrafted Popcorn Opened Package"
            className="inspo-opened-package-img"
          />
          <div className="inspo-package-tag">
            <Sparkles size={14} />
            <span>Tap to Quick-Add &bull; GH₵ 35.00</span>
          </div>
        </div>
      </section>
    </div>
  );
}
