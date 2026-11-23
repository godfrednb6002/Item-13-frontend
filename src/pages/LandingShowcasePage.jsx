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
  Home,
  MapPin,
  Heart,
  Truck,
  Info,
  PartyPopper,
  PhoneCall,
  MoreHorizontal,
  ChevronRight
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
  const [isMobileMoreDrawerOpen, setIsMobileMoreDrawerOpen] = useState(false);
  const [activeMobileTab, setActiveMobileTab] = useState('home');
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

  const drawerNavLinks = [
    { label: 'Dashboard', icon: LayoutDashboard, action: () => onNavigate && onNavigate('dashboard') },
    { label: 'Menu & Catalog', icon: UtensilsCrossed, action: () => onNavigate && onNavigate('menu'), badge: 'Hot' },
    { label: 'Orders & Tracking', icon: Package, action: () => onNavigate && onNavigate('dashboard/orders') },
    { label: 'My Profile', icon: User, action: () => onNavigate && onNavigate('dashboard/profile') },
    { label: 'Delivery Addresses', icon: MapPin, action: () => onNavigate && onNavigate('dashboard/addresses') },
    { label: 'Saved Favorites', icon: Heart, action: () => onNavigate && onNavigate('dashboard/favorites') },
    { label: 'Delivery Coverage', icon: Truck, action: () => onNavigate && onNavigate('delivery'), badge: 'Zones' },
    { label: 'Party & Weddings', icon: PartyPopper, action: () => onNavigate && onNavigate('events'), badge: 'Bulk' },
    { label: 'About Item13', icon: Info, action: () => onNavigate && onNavigate('about') },
    { label: 'Contact & Support', icon: PhoneCall, action: () => onNavigate && onNavigate('contact') },
  ];

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
          <span className="brand-logo-tagline">THE UNEXPECTED ESSENTIAL</span>
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
                      href="/dashboard/profile"
                      className="nav-menu-item"
                      onClick={(e) => {
                        e.preventDefault();
                        setIsNavMenuOpen(false);
                        if (onNavigate) onNavigate('dashboard/profile');
                      }}
                    >
                      <User size={16} />
                      <span>Profile</span>
                    </a>

                    <a
                      href="/dashboard"
                      className="nav-menu-item"
                      onClick={(e) => {
                        e.preventDefault();
                        setIsNavMenuOpen(false);
                        if (onNavigate) onNavigate('dashboard');
                      }}
                    >
                      <LayoutDashboard size={16} />
                      <span>Dashboard</span>
                    </a>

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
            <span>THE UNEXPECTED ESSENTIAL</span>
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

      {/* ================= MOBILE BOTTOM TAB BAR ================= */}
      <nav className="mobile-bottom-tabbar" aria-label="Mobile Navigation">
        <button
          type="button"
          className={`mobile-tab-item ${activeMobileTab === 'home' && !isMobileMoreDrawerOpen ? 'active' : ''}`}
          onClick={() => {
            setActiveMobileTab('home');
            setIsMobileMoreDrawerOpen(false);
            if (onNavigate) onNavigate('home');
          }}
          aria-label="Home"
        >
          <div className="mobile-tab-icon-wrap">
            <Home size={21} />
          </div>
          <span className="mobile-tab-label">Home</span>
        </button>

        <button
          type="button"
          className={`mobile-tab-item ${activeMobileTab === 'menu' && !isMobileMoreDrawerOpen ? 'active' : ''}`}
          onClick={() => {
            setActiveMobileTab('menu');
            setIsMobileMoreDrawerOpen(false);
            if (onNavigate) onNavigate('menu');
          }}
          aria-label="Menu"
        >
          <div className="mobile-tab-icon-wrap">
            <UtensilsCrossed size={21} />
          </div>
          <span className="mobile-tab-label">Menu</span>
        </button>

        <button
          type="button"
          className={`mobile-tab-item ${activeMobileTab === 'bag' && !isMobileMoreDrawerOpen ? 'active' : ''}`}
          onClick={() => {
            setActiveMobileTab('bag');
            setIsMobileMoreDrawerOpen(false);
            if (onOpenCart) onOpenCart();
          }}
          aria-label="Bag"
        >
          <div className="mobile-tab-icon-wrap">
            <ShoppingBag size={21} />
            {cartCount > 0 && <span className="mobile-tab-badge">{cartCount}</span>}
          </div>
          <span className="mobile-tab-label">Bag</span>
        </button>

        <button
          type="button"
          className={`mobile-tab-item ${activeMobileTab === 'orders' && !isMobileMoreDrawerOpen ? 'active' : ''}`}
          onClick={() => {
            setActiveMobileTab('orders');
            setIsMobileMoreDrawerOpen(false);
            if (onNavigate) onNavigate('dashboard/orders');
          }}
          aria-label="Orders"
        >
          <div className="mobile-tab-icon-wrap">
            <Package size={21} />
          </div>
          <span className="mobile-tab-label">Orders</span>
        </button>

        <button
          type="button"
          className={`mobile-tab-item ${activeMobileTab === 'profile' && !isMobileMoreDrawerOpen ? 'active' : ''}`}
          onClick={() => {
            setActiveMobileTab('profile');
            setIsMobileMoreDrawerOpen(false);
            if (onNavigate) onNavigate('dashboard/profile');
          }}
          aria-label="Profile"
        >
          <div className="mobile-tab-icon-wrap">
            <User size={21} />
          </div>
          <span className="mobile-tab-label">Profile</span>
        </button>

        <button
          type="button"
          className={`mobile-tab-item ${isMobileMoreDrawerOpen ? 'active' : ''}`}
          onClick={() => {
            setActiveMobileTab('more');
            setIsMobileMoreDrawerOpen(!isMobileMoreDrawerOpen);
          }}
          aria-label="More Options"
        >
          <div className="mobile-tab-icon-wrap">
            <MoreHorizontal size={21} />
          </div>
          <span className="mobile-tab-label">More</span>
        </button>
      </nav>

      {/* ================= MOBILE "MORE" DRAWER MODAL ================= */}
      {isMobileMoreDrawerOpen && (
        <div
          className="mobile-more-drawer-overlay"
          onClick={() => setIsMobileMoreDrawerOpen(false)}
        >
          <div
            className="mobile-more-drawer"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mobile-drawer-handle-bar" />
            <div className="mobile-drawer-header">
              <div className="mobile-drawer-user-info">
                <div className="mobile-drawer-avatar">
                  {user ? (user.name || user.email || 'U').charAt(0).toUpperCase() : 'I'}
                </div>
                <div className="mobile-drawer-user-text">
                  <strong>{user ? (user.name || user.email.split('@')[0]) : 'Item13 Express Snack'}</strong>
                  <span>{user ? 'VIP Member • Ghana' : 'Guest Snacker'}</span>
                </div>
              </div>
              <button
                type="button"
                className="mobile-drawer-close-btn"
                onClick={() => setIsMobileMoreDrawerOpen(false)}
                aria-label="Close Drawer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mobile-drawer-scroll-body">
              <div className="mobile-drawer-section-title">Navigation &amp; Services</div>
              <div className="mobile-drawer-links-grid">
                {drawerNavLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.label}
                      type="button"
                      className="mobile-drawer-nav-card"
                      onClick={() => {
                        setIsMobileMoreDrawerOpen(false);
                        item.action();
                      }}
                    >
                      <div className="drawer-nav-card-icon">
                        <Icon size={19} />
                      </div>
                      <span className="drawer-nav-card-label">{item.label}</span>
                      {item.badge && (
                        <span className={`drawer-badge ${item.badge === 'Hot' ? 'badge-hot' : ''}`}>
                          {item.badge}
                        </span>
                      )}
                      <ChevronRight size={15} className="drawer-card-arrow" />
                    </button>
                  );
                })}
              </div>

              {/* Guest Auth / Sign In buttons if guest, else logout */}
              <div className="mobile-drawer-auth-box">
                {!user ? (
                  <>
                    <button
                      type="button"
                      className="mobile-drawer-auth-btn yellow"
                      onClick={() => {
                        setIsMobileMoreDrawerOpen(false);
                        if (onNavigate) onNavigate('signup');
                      }}
                    >
                      Sign up for VIP Crunch Perks
                    </button>
                    <button
                      type="button"
                      className="mobile-drawer-auth-btn black"
                      onClick={() => {
                        setIsMobileMoreDrawerOpen(false);
                        if (onNavigate) onNavigate('login');
                      }}
                    >
                      Login to Existing Account
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    className="mobile-drawer-auth-btn logout"
                    onClick={() => {
                      setIsMobileMoreDrawerOpen(false);
                      if (setUser) setUser(null);
                      if (showToast) showToast('Signed out of Item13.');
                    }}
                  >
                    <LogOut size={16} />
                    <span>Sign Out of Account</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
