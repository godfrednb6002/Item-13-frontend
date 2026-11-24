import React, { useState, useEffect, useRef } from 'react';
import ThemeToggle from '../components/ThemeToggle';
import {
  ShoppingBag,
  Package,
  MapPin,
  Heart,
  ChevronRight,
  LogOut,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  TrendingUp,
  Clock,
  Store,
  ShieldCheck,
  Plus,
  Trash2,
  Zap,
  Truck,
  CircleHelp,
} from 'lucide-react';
import { PRODUCTS } from '../features/catalog/productsData';
import { getSavedFavorites, toggleFavorite } from '../features/catalog/favoritesStorage';
import DeliveryPage from './DeliveryPage';
import AboutEventsPage from './AboutEventsPage';
import ContactPage from './ContactPage';
import CheckoutPage from './CheckoutPage';
import MenuPage from './MenuPage';
import ProfilePage from './ProfilePage';
import SavedAddressesPage from './SavedAddressesPage';

export default function WelcomePage({
  user,
  onNavigate,
  onSignOut,
  onToast,
  onAddToCart,
  initialTab = 'dashboard',
  cartCount = 0,
  cartItems = [],
  onUpdateCartQuantity,
  onRemoveCartItem,
  onPlaceOrder,
  onViewOrder,
}) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [favoriteIds, setFavoriteIds] = useState(getSavedFavorites);
  const [activeStatPopup, setActiveStatPopup] = useState(null);
  const statPopupRef = useRef(null);

  // Close stat popup when tapping outside anywhere on screen
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (statPopupRef.current && !statPopupRef.current.contains(e.target)) {
        setActiveStatPopup(null);
      }
    };
    if (activeStatPopup) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('touchstart', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [activeStatPopup]);

  const handleTrackOrder = (orderId = 'ITM-8921') => {
    const cleanId = orderId.replace(/^#/, '');
    if (onViewOrder) {
      onViewOrder(cleanId);
    } else if (onNavigate) {
      onNavigate('order-tracking/' + cleanId);
    } else {
      window.location.href = '/orders/' + encodeURIComponent(cleanId);
    }
  };

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    const handleFavChange = () => {
      setFavoriteIds(getSavedFavorites());
    };
    window.addEventListener('item13_favorites_changed', handleFavChange);
    return () => window.removeEventListener('item13_favorites_changed', handleFavChange);
  }, []);

  const favoriteProducts = PRODUCTS.filter((p) => favoriteIds.includes(p.id));

  const handleQuickReorder = (item) => {
    if (onAddToCart) {
      onAddToCart(item);
    } else if (onToast) {
      onToast(`Added '${item.name}' to bag!`);
    }
  };

  const handleRemoveFavorite = (e, productId, name) => {
    e.stopPropagation();
    const { updated } = toggleFavorite(productId);
    setFavoriteIds(updated);
    if (onToast) onToast(`Removed '${name}' from favorites`);
  };

  const displayName = user?.name || (user?.email ? user.email.split('@')[0] : 'Snack Lover');
  const userEmail = user?.email || 'customer@item13.com';

  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'menu', label: 'Menu & Catalog' },
    { id: 'cart', label: 'My Bag / Cart' },
    { id: 'checkout', label: 'Checkout' },
    { id: 'profile', label: 'My Profile' },
    { id: 'orders', label: 'Orders & Tracking' },
    { id: 'addresses', label: 'Delivery Addresses' },
    { id: 'favorites', label: 'Saved Favorites' },
    { id: 'payments', label: 'Payments & MoMo' },
    { id: 'settings', label: 'Settings' },
    { id: 'delivery', label: 'Delivery Coverage' },
    { id: 'about', label: 'About Item13' },
    { id: 'events', label: 'Party & Weddings' },
    { id: 'contact', label: 'Contact & Support' },
  ];

  return (
    <div className="welcome-layout">
      {/* ================= RIGHT MAIN STAGE ================= */}
      <main className="welcome-main">
        {/* Top Sticky Header & Breadcrumbs Shell (static format matching Menu / PDP) */}
        <div className="pdp-top-nav-shell welcome-top-nav-shell">
          <header className="pdp-header">
            <div className="pdp-header-inner">
              <a
                href="/"
                className="pdp-header-brand"
                onClick={(e) => {
                  e.preventDefault();
                  if (onNavigate) onNavigate('home');
                }}
                style={{ textDecoration: 'none' }}
                title="Back to Item13 Home"
              >
                <img src="/item13Logo-trimmed.png" alt="Item13 Logo" className="brand-logo-img pdp-brand-logo" />
                <span className="brand-logo-tagline">
                  THE UNEXPECTED<span className="brand-tagline-space"> </span><br className="brand-tagline-break" />ESSENTIAL
                </span>
              </a>

              <div className="pdp-header-actions">
                <ThemeToggle />

                <button
                  type="button"
                  className="welcome-utility-btn"
                  data-tooltip="Storefront"
                  aria-label="Storefront"
                  onClick={(e) => {
                    e.preventDefault();
                    if (onNavigate) onNavigate('home');
                  }}
                  title="Storefront"
                >
                  <Store size={19} />
                </button>

                <button
                  type="button"
                  className="welcome-utility-btn logout"
                  data-tooltip="Log out"
                  aria-label="Log out"
                  onClick={onSignOut}
                  title="Log out"
                >
                  <LogOut size={19} />
                </button>
              </div>
            </div>
          </header>

          {/* Breadcrumbs Row */}
          <div className="pdp-breadcrumbs-bar">
            <div className="pdp-breadcrumbs-inner">
              <a href="/" onClick={(e) => { e.preventDefault(); onNavigate && onNavigate('home'); }} className="crumb-link" style={{ textDecoration: 'none' }}>Home</a>
              <span className="crumb-sep">/</span>
              {activeTab === 'dashboard' ? (
                <span className="crumb-current">Dashboard</span>
              ) : (
                <>
                  <a href="/dashboard" onClick={(e) => { e.preventDefault(); setActiveTab('dashboard'); }} className="crumb-link" style={{ textDecoration: 'none' }}>Dashboard</a>
                  <span className="crumb-sep">/</span>
                  <span className="crumb-current">
                    {navItems.find((n) => n.id === activeTab)?.label || 'Overview'}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Dynamic Panel Content based on the Active Dashboard Tab */}
        <div className="welcome-content-scroll">
          {/* 1. DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="dashboard-view-pane">
              {/* Hero Greeting Card */}
              <div className="dash-hero-card">
                <div className="dash-hero-content">
                  <div className="dash-hero-tag">
                    Snack Lounge
                  </div>
                  <h1 className="dash-hero-title">
                    Welcome back, <span className="gold-accent">{displayName}</span>!
                  </h1>
                  <p className="dash-hero-desc">
                    Ready for your next crunch? Fresh buttered, caramel, and suya pepper popcorn are hot and ready to dispatch to your location.
                  </p>
                  <div className="dash-hero-buttons">
                    <a
                      href="/products"
                      className="btn-dash-primary"
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab('menu');
                        if (window.location.pathname !== '/dashboard/menu') {
                          window.history.pushState({}, '', '/dashboard/menu');
                        }
                        if (onNavigate) onNavigate('menu');
                      }}
                      style={{ textDecoration: 'none' }}
                    >
                      <ShoppingBag size={16} />
                      <span>Order Popcorn Now</span>
                    </a>
                    <button
                      className="btn-dash-secondary"
                      onClick={() => setActiveTab('orders')}
                    >
                      <span>Track Active Order</span>
                      <ArrowRight size={15} />
                    </button>
                  </div>
                </div>

                <div className="dash-hero-illustration">
                  <img
                    src="/item13BagBGremoved.png"
                    alt="Popcorn and Drinks Duo"
                    className="dash-popcorn-img"
                    onError={(e) => {
                      e.target.src = '/bistro-popcorn.jpg';
                    }}
                  />
                </div>
              </div>

              {/* Stats Overview Grid (Collapsible into single tap row on mobile with small pop-up) */}
              <div className="dash-stats-section" ref={statPopupRef}>
                {/* Mobile Collapsed Capsule Row */}
                <div className="mobile-stats-row-pills">
                  <button
                    type="button"
                    className={`mobile-stat-pill ${activeStatPopup === 'orders' ? 'active' : ''}`}
                    onClick={() => setActiveStatPopup(activeStatPopup === 'orders' ? null : 'orders')}
                  >
                    <div className="stat-pill-icon gold">
                      <Package size={16} />
                    </div>
                    <div className="stat-pill-text">
                      <span className="stat-pill-label">Orders</span>
                      <strong className="stat-pill-val">1 Active</strong>
                    </div>
                  </button>

                  <button
                    type="button"
                    className={`mobile-stat-pill ${activeStatPopup === 'points' ? 'active' : ''}`}
                    onClick={() => setActiveStatPopup(activeStatPopup === 'points' ? null : 'points')}
                  >
                    <div className="stat-pill-icon green">
                      <TrendingUp size={16} />
                    </div>
                    <div className="stat-pill-text">
                      <span className="stat-pill-label">Points</span>
                      <strong className="stat-pill-val">280 Pts</strong>
                    </div>
                  </button>

                  <button
                    type="button"
                    className={`mobile-stat-pill ${activeStatPopup === 'favorites' ? 'active' : ''}`}
                    onClick={() => setActiveStatPopup(activeStatPopup === 'favorites' ? null : 'favorites')}
                  >
                    <div className="stat-pill-icon purple">
                      <Heart size={16} fill="currentColor" />
                    </div>
                    <div className="stat-pill-text">
                      <span className="stat-pill-label">Favorites</span>
                      <strong className="stat-pill-val">{favoriteProducts.length}</strong>
                    </div>
                  </button>

                  <button
                    type="button"
                    className={`mobile-stat-pill ${activeStatPopup === 'zones' ? 'active' : ''}`}
                    onClick={() => setActiveStatPopup(activeStatPopup === 'zones' ? null : 'zones')}
                  >
                    <div className="stat-pill-icon blue">
                      <MapPin size={16} />
                    </div>
                    <div className="stat-pill-text">
                      <span className="stat-pill-label">Zone</span>
                      <strong className="stat-pill-val">Accra</strong>
                    </div>
                  </button>
                </div>

                {/* Mobile Small Pop-up Window (dismisses on tapping anywhere) */}
                {activeStatPopup && (
                  <>
                    <div
                      className="mobile-stat-backdrop"
                      onClick={() => setActiveStatPopup(null)}
                      aria-hidden="true"
                    />
                    <div className="mobile-stat-popup-card">
                      <button
                        type="button"
                        className="stat-popup-close-btn"
                        onClick={() => setActiveStatPopup(null)}
                        aria-label="Close"
                      >
                        <X size={15} />
                      </button>

                      {activeStatPopup === 'orders' && (
                        <div className="stat-popup-content">
                          <div className="stat-popup-header">
                            <div className="stat-icon-wrap gold">
                              <Package size={18} />
                            </div>
                            <div>
                              <span className="stat-label">Active Orders</span>
                              <h4 className="stat-popup-title">1 Order In Transit</h4>
                              <p className="stat-popup-sub">Dispatched with rider Kofi • ~25-35 mins</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            className="btn-stat-action"
                            onClick={() => {
                              setActiveStatPopup(null);
                              handleTrackOrder('ITM-8921');
                            }}
                          >
                            Track Live Order #ITM-8921 <ArrowRight size={13} />
                          </button>
                        </div>
                      )}

                      {activeStatPopup === 'points' && (
                        <div className="stat-popup-content">
                          <div className="stat-popup-header">
                            <div className="stat-icon-wrap green">
                              <TrendingUp size={18} />
                            </div>
                            <div>
                              <span className="stat-label">Popcorn Loyalty Points</span>
                              <h4 className="stat-popup-title">280 Reward Points</h4>
                              <p className="stat-popup-sub">You have a GH₵15 voucher ready to apply</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            className="btn-stat-action"
                            onClick={() => {
                              setActiveStatPopup(null);
                              setActiveTab('menu');
                              if (onNavigate) onNavigate('menu');
                            }}
                          >
                            Redeem on Menu <ArrowRight size={13} />
                          </button>
                        </div>
                      )}

                      {activeStatPopup === 'favorites' && (
                        <div className="stat-popup-content">
                          <div className="stat-popup-header">
                            <div className="stat-icon-wrap purple">
                              <Heart size={18} fill="currentColor" />
                            </div>
                            <div>
                              <span className="stat-label">Saved Favorites</span>
                              <h4 className="stat-popup-title">{favoriteProducts.length} Saved Snacks</h4>
                              <p className="stat-popup-sub">Quick 1-tap re-order from your favorites list</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            className="btn-stat-action"
                            onClick={() => {
                              setActiveStatPopup(null);
                              setActiveTab('favorites');
                              if (onNavigate) onNavigate('favorites');
                            }}
                          >
                            Open Saved Favorites <ArrowRight size={13} />
                          </button>
                        </div>
                      )}

                      {activeStatPopup === 'zones' && (
                        <div className="stat-popup-content">
                          <div className="stat-popup-header">
                            <div className="stat-icon-wrap blue">
                              <MapPin size={18} />
                            </div>
                            <div>
                              <span className="stat-label">Primary Delivery Zone</span>
                              <h4 className="stat-popup-title">East Legon, Accra</h4>
                              <p className="stat-popup-sub">Digital Code: GH-GA-182-9021</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            className="btn-stat-action"
                            onClick={() => {
                              setActiveStatPopup(null);
                              setActiveTab('addresses');
                              if (onNavigate) onNavigate('dashboard/addresses');
                            }}
                          >
                            Change Saved Address <ArrowRight size={13} />
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* Desktop Grid Layout (Full 4-column cards) */}
                <div className="dash-stats-grid desktop-only-stats">
                  <div className="stat-card">
                    <div className="stat-icon-wrap gold">
                      <Package size={20} />
                    </div>
                    <div className="stat-content">
                      <span className="stat-label">Active Orders</span>
                      <span className="stat-value">1 In Transit</span>
                      <span className="stat-sub">Arriving in ~25 mins</span>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon-wrap green">
                      <TrendingUp size={20} />
                    </div>
                    <div className="stat-content">
                      <span className="stat-label">Popcorn Loyalty Points</span>
                      <span className="stat-value">280 Pts</span>
                      <span className="stat-sub">GH₵15 voucher available</span>
                    </div>
                  </div>

                  <div
                    className="stat-card"
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      setActiveTab('favorites');
                      if (onNavigate) onNavigate('favorites');
                    }}
                    title="View Saved Favorites"
                  >
                    <div className="stat-icon-wrap purple">
                      <Heart size={20} fill="currentColor" />
                    </div>
                    <div className="stat-content">
                      <span className="stat-label">Saved Favorites</span>
                      <span className="stat-value">{favoriteProducts.length} Snacks</span>
                      <span className="stat-sub">1-Click Fast Re-order</span>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon-wrap blue">
                      <MapPin size={20} />
                    </div>
                    <div className="stat-content">
                      <span className="stat-label">Primary Zone</span>
                      <span className="stat-value">East Legon, Accra</span>
                      <span className="stat-sub">GH-GA-182-9021</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Live Tracking Banner */}
              <div className="live-order-banner">
                <div className="live-banner-left">
                  <div className="pulse-dot-wrap">
                    <span className="pulse-dot" />
                  </div>
                  <div>
                    <span className="live-order-badge">Active Delivery: #ITM-8921</span>
                    <h3 className="live-order-title">Classic Popcorn &amp; Chilled Fanta Duo</h3>
                    <p className="live-order-meta">
                      Dispatched with rider Kofi • Estimated arrival: 25-35 mins
                    </p>
                  </div>
                </div>
                <button
                  className="btn-track-order"
                  onClick={() => handleTrackOrder('ITM-8921')}
                >
                  <span>View Live Tracker</span>
                  <ArrowRight size={15} />
                </button>
              </div>

              {/* Popular quick re-order shelf */}
              <div className="dash-section">
                <div className="section-head-row">
                  <div>
                    <h2 className="section-title">Popular Items to Add</h2>
                    <p className="section-desc">Ghana’s best-selling popcorn flavors and chilled sodas</p>
                  </div>
                  <a
                    href="/products"
                    className="view-all-link"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab('menu');
                      if (window.location.pathname !== '/dashboard/menu') {
                        window.history.pushState({}, '', '/dashboard/menu');
                      }
                      if (onNavigate) onNavigate('menu');
                    }}
                    style={{ textDecoration: 'none' }}
                  >
                    View Full Menu <ArrowRight size={14} />
                  </a>
                </div>

                <div className="dash-quick-products">
                  {PRODUCTS.slice(0, 3).map((item) => (
                    <div key={item.id} className="dash-prod-mini-card">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="mini-prod-img"
                        onError={(e) => {
                          e.target.src = '/bistro-popcorn.jpg';
                        }}
                      />
                      <div className="mini-prod-info">
                        <span className="mini-prod-tag">{item.category}</span>
                        <h4 className="mini-prod-name">{item.name}</h4>
                        <div className="mini-prod-bottom">
                          <span className="mini-prod-price">GH₵ {item.price.toFixed(2)}</span>
                          <button
                            className="btn-mini-add"
                            onClick={() => handleQuickReorder(item)}
                          >
                            + Add to Bag
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 3. ORDERS TAB */}
          {activeTab === 'orders' && (
            <div className="welcome-tab-pane">
              <div className="pane-header">
                <h2>Orders &amp; Tracking</h2>
                <p>Track live deliveries and view past popcorn cravings</p>
              </div>

              <div className="order-history-list">
                {/* Active Order Card */}
                <div
                  className="order-card active-order"
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleTrackOrder('ITM-8921')}
                  title="Click to view live order tracking"
                >
                  <div className="order-card-header">
                    <div>
                      <span className="order-badge in-progress">In Transit</span>
                      <span className="order-id">#ITM-8921</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span className="order-date">Today, 4:15 PM</span>
                      <button
                        type="button"
                        className="btn-track-order"
                        style={{ padding: '4px 12px', fontSize: '12px' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTrackOrder('ITM-8921');
                        }}
                      >
                        <Truck size={14} />
                        <span>Track Live</span>
                      </button>
                    </div>
                  </div>

                  <div className="order-items-summary">
                    <div className="order-item-line">
                      <span className="item-qty">1x</span>
                      <span className="item-name">Classic Popcorn &amp; Soda Duo (Large Tub, Extra Butter)</span>
                      <span className="item-price">GH₵ 51.00</span>
                    </div>
                  </div>

                  <div className="order-tracker-timeline">
                    <div className="track-step done">
                      <div className="step-bullet"><Check size={12} /></div>
                      <span>Order Placed</span>
                    </div>
                    <div className="track-step done">
                      <div className="step-bullet"><Check size={12} /></div>
                      <span>Popping Fresh</span>
                    </div>
                    <div className="track-step current">
                      <div className="step-bullet"><Clock size={12} /></div>
                      <span>With Dispatch Rider</span>
                    </div>
                    <div className="track-step">
                      <div className="step-bullet" />
                      <span>Delivered</span>
                    </div>
                  </div>
                </div>

                {/* Past Order Card */}
                <div
                  className="order-card"
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleTrackOrder('ITM-8104')}
                  title="Click to view order delivery details"
                >
                  <div className="order-card-header">
                    <div>
                      <span className="order-badge completed">Delivered</span>
                      <span className="order-id">#ITM-8104</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span className="order-date">October 24, 2026</span>
                      <button
                        type="button"
                        className="btn-track-order"
                        style={{ padding: '4px 12px', fontSize: '12px', background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.14)', color: '#ffffff' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTrackOrder('ITM-8104');
                        }}
                      >
                        <Package size={14} />
                        <span>View Details</span>
                      </button>
                    </div>
                  </div>

                  <div className="order-items-summary">
                    <div className="order-item-line">
                      <span className="item-qty">2x</span>
                      <span className="item-name">Artisan Golden Caramel Crunch (Jumbo Tubs)</span>
                      <span className="item-price">GH₵ 90.00</span>
                    </div>
                  </div>

                  <div className="order-card-actions">
                    <button
                      className="btn-reorder"
                      onClick={() => onNavigate && onNavigate('menu')}
                    >
                      Re-order in 1-Click
                    </button>
                    <span className="order-total-label">Total: <strong>GH₵ 90.00</strong></span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4. ADDRESSES TAB (Full SavedAddressesPage component) */}
          {activeTab === 'addresses' && (
            <div className="welcome-tab-pane embedded-pane">
              <SavedAddressesPage
                onBack={() => {
                  if (window.location.pathname !== '/dashboard/profile') {
                    window.history.pushState({}, '', '/dashboard/profile');
                  }
                  setActiveTab('profile');
                }}
                isEmbedded={true}
              />
            </div>
          )}

          {/* 5. FAVORITES TAB */}
          {activeTab === 'favorites' && (
            <div className="welcome-tab-pane">
              <div className="pane-header fav-header-flex">
                <div>
                  <div className="fav-title-row">
                    <h2>Customer Favorites &amp; Wishlist</h2>
                    <span className="fav-count-pill">{favoriteProducts.length} Saved</span>
                  </div>
                  <p>Fast 1-click re-order snack wishlist. Pop your all-time favorites into your bag in a tap!</p>
                </div>
                <button
                  type="button"
                  className="btn-browse-more-fav"
                  onClick={() => onNavigate && onNavigate('menu')}
                >
                  <Plus size={16} />
                  <span>Discover More Snacks</span>
                </button>
              </div>

              {favoriteProducts.length === 0 ? (
                <div className="fav-empty-state">
                  <div className="fav-empty-icon">
                    <Heart size={36} />
                  </div>
                  <h3>Your snack wishlist is waiting!</h3>
                  <p>Browse our gourmet menu and save your favorite freshly popped corn &amp; drinks for instant 1-click re-ordering.</p>
                  <a
                    href="/products"
                    className="btn-fav-explore"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab('menu');
                      if (window.location.pathname !== '/dashboard/menu') {
                        window.history.pushState({}, '', '/dashboard/menu');
                      }
                      if (onNavigate) onNavigate('menu');
                    }}
                    style={{ textDecoration: 'none' }}
                  >
                    <ShoppingBag size={16} />
                    <span>Explore Gourmet Menu</span>
                  </a>
                </div>
              ) : (
                <div className="dash-quick-products fav-products-grid">
                  {favoriteProducts.map((item) => (
                    <div key={item.id} className="dash-prod-mini-card fav-card">
                      <div className="fav-card-image-wrap">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="mini-prod-img"
                          onError={(e) => {
                            e.target.src = '/bistro-popcorn.jpg';
                          }}
                        />
                        <button
                          type="button"
                          className="fav-remove-btn"
                          onClick={(e) => handleRemoveFavorite(e, item.id, item.name)}
                          title="Remove from favorites"
                          aria-label={`Remove ${item.name} from favorites`}
                        >
                          <Trash2 size={15} />
                        </button>
                        {item.badge && (
                          <span className="fav-badge">{item.badge}</span>
                        )}
                      </div>

                      <div className="mini-prod-info">
                        <div className="fav-meta-row">
                          <span className="mini-prod-tag">{item.category}</span>
                          {item.rating && (
                            <span className="fav-rating-pill">★ {item.rating}</span>
                          )}
                        </div>

                        <h4
                          className="mini-prod-name fav-clickable-title"
                          onClick={() => onNavigate && onNavigate(`product-${item.id}`)}
                          title="View product details"
                        >
                          {item.name}
                        </h4>

                        <div className="mini-prod-bottom">
                          <div className="fav-price-box">
                            <span className="mini-prod-price">GH₵ {item.price.toFixed(2)}</span>
                            {item.originalPrice && item.originalPrice > item.price && (
                              <span className="fav-old-price">GH₵ {item.originalPrice.toFixed(2)}</span>
                            )}
                          </div>

                          <button
                            type="button"
                            className="btn-1click-reorder"
                            onClick={() => handleQuickReorder(item)}
                            title="Instant 1-Click Re-order"
                          >
                            <Zap size={14} className="reorder-bolt" />
                            <span>1-Click Re-order</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 6. PAYMENTS TAB */}
          {activeTab === 'payments' && (
            <div className="welcome-tab-pane">
              <div className="pane-header">
                <h2>Mobile Money &amp; Payments</h2>
                <p>Manage your preferred checkout payment options in Ghana</p>
              </div>

              <div className="pane-card">
                <div className="payment-method-row active">
                  <div className="momo-badge mtn">MTN</div>
                  <div className="pm-details">
                    <span className="pm-name">MTN Mobile Money</span>
                    <span className="pm-number">+233 54 ••• 4567 (Default)</span>
                  </div>
                  <span className="pm-check"><Check size={16} /></span>
                </div>

                <div className="payment-method-row">
                  <div className="momo-badge telecel">TC</div>
                  <div className="pm-details">
                    <span className="pm-name">Telecel Cash</span>
                    <span className="pm-number">Not linked</span>
                  </div>
                  <button
                    className="pm-action-link"
                    onClick={() => onToast && onToast('Link Mobile Money prompt')}
                  >
                    Link Account
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 7. SETTINGS TAB */}
          {activeTab === 'settings' && (
            <div className="welcome-tab-pane">
              <div className="pane-header">
                <h2>Preferences &amp; Notifications</h2>
                <p>Customize notifications and your snack experience</p>
              </div>

              <div className="pane-card">
                <div className="settings-toggle-row">
                  <div>
                    <span className="setting-title">WhatsApp Order Status Alerts</span>
                    <p className="setting-sub">Receive instant dispatch rider location updates via WhatsApp</p>
                  </div>
                  <input type="checkbox" defaultChecked className="setting-checkbox" />
                </div>

                <div className="settings-toggle-row">
                  <div>
                    <span className="setting-title">Weekend Promo &amp; Flavor Drop Alerts</span>
                    <p className="setting-sub">Be the first to hear about free size upgrades and new seasonal tastes</p>
                  </div>
                  <input type="checkbox" defaultChecked className="setting-checkbox" />
                </div>
              </div>
            </div>
          )}

          {/* 8. EMBEDDED DELIVERY COVERAGE VIEW */}
          {activeTab === 'delivery' && (
            <div className="welcome-tab-pane embedded-pane">
              <DeliveryPage
                onNavigate={onNavigate}
                onToast={onToast}
                cartCount={cartCount}
                isEmbedded={true}
              />
            </div>
          )}

          {/* 9. EMBEDDED ABOUT VIEW */}
          {activeTab === 'about' && (
            <div className="welcome-tab-pane embedded-pane">
              <AboutEventsPage
                initialTab="about"
                onNavigate={onNavigate}
                onToast={onToast}
                isEmbedded={true}
              />
            </div>
          )}

          {/* 10. EMBEDDED EVENTS VIEW */}
          {activeTab === 'events' && (
            <div className="welcome-tab-pane embedded-pane">
              <AboutEventsPage
                initialTab="events"
                onNavigate={onNavigate}
                onToast={onToast}
                isEmbedded={true}
              />
            </div>
          )}

          {/* 11. EMBEDDED CONTACT & SUPPORT VIEW */}
          {(activeTab === 'contact' || activeTab === 'support') && (
            <div className="welcome-tab-pane embedded-pane">
              <ContactPage
                onNavigate={onNavigate}
                onToast={onToast}
                isEmbedded={true}
              />
            </div>
          )}

          {/* 12. EMBEDDED MENU & CATALOG VIEW */}
          {(activeTab === 'menu' || activeTab === 'products') && (
            <div className="welcome-tab-pane embedded-pane">
              <MenuPage
                onNavigate={onNavigate}
                onAddToCart={onAddToCart}
                cartCount={cartCount}
                onToast={onToast}
              />
            </div>
          )}

          {/* 13. EMBEDDED CHECKOUT VIEW */}
          {activeTab === 'checkout' && (
            <div className="welcome-tab-pane embedded-pane">
              <CheckoutPage
                items={cartItems}
                onNavigate={onNavigate}
                onBack={() => {
                  window.history.pushState({}, '', '/dashboard/menu');
                  setActiveTab('menu');
                }}
                onUpdateQuantity={onUpdateCartQuantity}
                onPlaceOrder={onPlaceOrder}
              />
            </div>
          )}

          {/* 14. EMBEDDED PROFILE VIEW */}
          {(activeTab === 'profile' || activeTab.startsWith('profile-')) && (
            <div className="welcome-tab-pane embedded-pane">
              <ProfilePage
                user={user}
                onNavigate={onNavigate}
                onToast={onToast}
                onAddToCart={onAddToCart}
                initialSection={activeTab.startsWith('profile-') ? activeTab.replace('profile-', '') : 'overview'}
                onSignOut={onSignOut}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

