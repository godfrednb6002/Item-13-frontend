import { useState, useEffect, useRef } from 'react';
import ThemeToggle from '../components/ThemeToggle';
import {
  LayoutDashboard,
  User,
  ShoppingBag,
  Package,
  MapPin,
  CreditCard,
  Settings,
  Heart,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  LogOut,
  ArrowRight,
  Check,
  TrendingUp,
  Clock,
  Store,
  Home,
  Plus,
  Trash2,
  Zap,
  Truck,
  Info,
  PartyPopper,
  PhoneCall,
  ExternalLink,
  X,
  Search,
  ArrowUpDown,
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
  onPlaceOrder,
  onViewOrder,
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState(initialTab);
  const [prevInitialTab, setPrevInitialTab] = useState(initialTab);
  const [favoriteIds, setFavoriteIds] = useState(getSavedFavorites);
  const [activeStatPopup, setActiveStatPopup] = useState(null);
  const [isTimelineExpanded, setIsTimelineExpanded] = useState(false);
  const [orderStatusTab, setOrderStatusTab] = useState('all');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [isOrderSearchOpen, setIsOrderSearchOpen] = useState(false);
  const [orderSortBy, setOrderSortBy] = useState('newest'); // 'newest' | 'oldest' | 'price-high' | 'price-low'
  const [isOrderSortOpen, setIsOrderSortOpen] = useState(false);
  const [collapsedOrders, setCollapsedOrders] = useState({ 'ITM-8921': false, 'ITM-8104': false });

  const toggleOrderCollapse = (orderId) => {
    setCollapsedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };
  const statPopupRef = useRef(null);
  const orderSortMenuRef = useRef(null);

  if (initialTab !== prevInitialTab) {
    setPrevInitialTab(initialTab);
    setActiveTab(initialTab);
  }

  // Close stat popup when tapping outside anywhere on screen
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (statPopupRef.current && !statPopupRef.current.contains(e.target)) {
        setActiveStatPopup(null);
      }
    };
    if (activeStatPopup) {
      // Delay listener slightly to prevent the opening tap from immediately triggering closure
      const timer = setTimeout(() => {
        document.addEventListener('click', handleOutsideClick);
        document.addEventListener('touchstart', handleOutsideClick);
      }, 50);
      return () => {
        clearTimeout(timer);
        document.removeEventListener('click', handleOutsideClick);
        document.removeEventListener('touchstart', handleOutsideClick);
      };
    }
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

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'menu', label: 'Menu & Catalog', icon: ShoppingBag, badge: 'Hot' },
    { id: 'cart', label: 'My Bag / Cart', icon: ShoppingBag, badge: cartCount > 0 ? `${cartCount}` : null },
    { id: 'checkout', label: 'Checkout', icon: CreditCard, badge: null },
    { id: 'profile', label: 'My Profile', icon: User, badge: null },
    { id: 'orders', label: 'Orders & Tracking', icon: Package, badge: '1 Active' },
    { id: 'addresses', label: 'Delivery Addresses', icon: MapPin, badge: null },
    { id: 'favorites', label: 'Saved Favorites', icon: Heart, badge: null },
    { id: 'payments', label: 'Payments & MoMo', icon: CreditCard, badge: null },
    { id: 'settings', label: 'Settings', icon: Settings, badge: null },
    { id: 'delivery', label: 'Delivery Coverage', icon: Truck, badge: 'Zones' },
    { id: 'about', label: 'About Item13', icon: Info, badge: null },
    { id: 'events', label: 'Party & Weddings', icon: PartyPopper, badge: 'Bulk' },
    { id: 'contact', label: 'Contact & Support', icon: PhoneCall, badge: null },
  ];

  return (
    <div className={`welcome-layout ${collapsed ? 'sidebar-collapsed' : ''}`}>
      {/* ================= LEFT DRAWER ================= */}
      <aside className="welcome-sidebar">
        {/* Brand & Toggle Header */}
        <div className="sidebar-brand-box">
          {!collapsed && (
            <a
              href="/"
              className="sidebar-brand"
              onClick={(e) => {
                e.preventDefault();
                if (onNavigate) onNavigate('home');
              }}
              style={{ textDecoration: 'none', cursor: 'pointer' }}
            >
              <img
                src="/item13Logo-trimmed.png"
                alt="Item13 Logo"
                className="brand-logo-img"
              />
              <span className="brand-logo-tagline">THE UNEXPECTED ESSENTIAL</span>
            </a>
          )}
          {collapsed && (
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                if (onNavigate) onNavigate('home');
              }}
              style={{ display: 'inline-block' }}
            >
              <img
                src="/item13Logo-trimmed.png"
                alt="Item13 Logo"
                className="brand-logo-img collapsed-logo"
              />
            </a>
          )}

          {/* Collapse / Expand Toggle Button */}
          <button
            type="button"
            className="sidebar-collapse-toggle"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? 'Expand Drawer' : 'Collapse Drawer'}
            title={collapsed ? 'Expand Drawer' : 'Collapse Drawer'}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* User Mini Profile Card */}
        <a
          href="/dashboard/profile"
          className="sidebar-user-box"
          style={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}
          onClick={(e) => {
            e.preventDefault();
            if (onNavigate) onNavigate('dashboard/profile');
          }}
          title="Go to Profile"
        >
          <div className="sidebar-user-avatar">
            {displayName.charAt(0).toUpperCase()}
          </div>
          {!collapsed && (
            <div className="sidebar-user-details">
              <span className="user-name">{displayName}</span>
              <span className="user-status">VIP Member • Ghana</span>
            </div>
          )}
        </a>

        {/* Nav Links */}
        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              activeTab === item.id ||
              (item.id === 'profile' && activeTab.startsWith('profile-'));
            const itemHref =
              item.id === 'dashboard' ? '/dashboard' : `/dashboard/${item.id}`;

            return (
              <a
                key={item.id}
                href={itemHref}
                className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  if (item.id === 'cart') {
                    if (onNavigate) onNavigate('cart');
                  } else {
                    if (window.location.pathname !== itemHref) {
                      window.history.pushState({}, '', itemHref);
                    }
                    setActiveTab(item.id);
                  }
                }}
                title={collapsed ? item.label : ''}
                style={{ textDecoration: 'none' }}
              >
                <Icon size={19} className="nav-icon" />
                {!collapsed && <span className="nav-label">{item.label}</span>}
                {!collapsed && item.badge && (
                  <span
                    className={`nav-badge ${item.badge === 'Hot' ? 'badge-hot' : ''
                      }`}
                  >
                    {item.badge}
                  </span>
                )}
              </a>
            );
          })}
        </nav>

        {/* Bottom Drawer Actions */}
        <div className="sidebar-footer">
          <a
            href="/dashboard"
            className="sidebar-footer-btn"
            onClick={(e) => {
              e.preventDefault();
              if (onNavigate) onNavigate('welcome');
            }}
            title={collapsed ? 'Back to Homepage' : ''}
            style={{ textDecoration: 'none' }}
          >
            <Home size={18} />
            {!collapsed && <span>Homepage</span>}
          </a>

          <button
            type="button"
            className="sidebar-footer-btn logout-btn"
            onClick={onSignOut}
            title={collapsed ? 'Log out' : ''}
          >
            <LogOut size={18} />
            {!collapsed && <span>Log out</span>}
          </button>
        </div>
      </aside>

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
                style={{ textDecoration: 'none', cursor: 'pointer' }}
                title="Go to Homepage"
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
                    {activeTab === 'menu' || activeTab === 'products'
                      ? 'Menu'
                      : (navItems.find((n) => n.id === activeTab)?.label || 'Overview')}
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
                      href="/menu"
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
                  <div className="mobile-stat-popup-portal">
                    <div
                      className="mobile-stat-backdrop"
                      onClick={() => setActiveStatPopup(null)}
                      aria-hidden="true"
                    />
                    <div
                      className="mobile-stat-popup-card"
                      onClick={(e) => e.stopPropagation()}
                    >
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
                  </div>
                )}

                {/* Desktop Grid Layout (Full 4-column cards) */}
                <div className="dash-stats-grid desktop-only-stats">
                  <div
                    className={`stat-card stat-clickable ${activeStatPopup === 'orders' ? 'active-stat-card' : ''}`}
                    onClick={() => setActiveStatPopup(activeStatPopup === 'orders' ? null : 'orders')}
                    title="View Active Orders details"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setActiveStatPopup(activeStatPopup === 'orders' ? null : 'orders');
                      }
                    }}
                  >
                    <div className="stat-icon-wrap gold">
                      <Package size={20} />
                    </div>
                    <div className="stat-content">
                      <span className="stat-label">Active Orders</span>
                      <span className="stat-value">1 In Transit</span>
                      <span className="stat-sub">Arriving in ~25 mins</span>
                    </div>
                  </div>

                  <div
                    className={`stat-card stat-clickable ${activeStatPopup === 'points' ? 'active-stat-card' : ''}`}
                    onClick={() => setActiveStatPopup(activeStatPopup === 'points' ? null : 'points')}
                    title="View Loyalty Points details"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setActiveStatPopup(activeStatPopup === 'points' ? null : 'points');
                      }
                    }}
                  >
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
                    className={`stat-card stat-clickable ${activeStatPopup === 'favorites' ? 'active-stat-card' : ''}`}
                    onClick={() => setActiveStatPopup(activeStatPopup === 'favorites' ? null : 'favorites')}
                    title="View Saved Favorites details"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setActiveStatPopup(activeStatPopup === 'favorites' ? null : 'favorites');
                      }
                    }}
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

                  <div
                    className={`stat-card stat-clickable ${activeStatPopup === 'zones' ? 'active-stat-card' : ''}`}
                    onClick={() => setActiveStatPopup(activeStatPopup === 'zones' ? null : 'zones')}
                    title="View Delivery Zone details"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setActiveStatPopup(activeStatPopup === 'zones' ? null : 'zones');
                      }
                    }}
                  >
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
                          href="/menu"
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

                      {/* Desktop Grid (< 4 items) / Mobile Horizontal Slow Rolling Carousel when items exceed 1 row */}
                      <div className="dash-quick-products-wrapper">
                        <div className="dash-quick-products dash-quick-products-track">
                          {[...PRODUCTS.slice(0, 6), ...PRODUCTS.slice(0, 6)].map((item, idx) => (
                            <div key={`${item.id}-${idx}`} className={`dash-prod-mini-card ${idx >= 6 ? 'marquee-duplicate' : ''}`}>
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
                  </div>
          )}

                  {/* 3. ORDERS TAB */}
                  {activeTab === 'orders' && (
                    <div className="welcome-tab-pane">
                      <div className="pane-header pane-header-with-tools">
                        <div className="pane-header-titles">
                          <h2>Orders &amp; Tracking</h2>
                          <p>Track live deliveries and view past popcorn cravings</p>
                        </div>

                        {/* Search and Sort Toolbar aligned on same row as heading */}
                        <div className="order-tools-cluster">
                          <button
                            type="button"
                            className={`order-tool-btn ${isOrderSearchOpen || orderSearchQuery ? 'active' : ''}`}
                            onClick={() => setIsOrderSearchOpen((prev) => !prev)}
                            aria-label="Search orders"
                            title="Search orders"
                          >
                            <Search size={15} />
                          </button>

                          <div className="order-sort-wrap" ref={orderSortMenuRef}>
                            <button
                              type="button"
                              className={`order-tool-btn ${isOrderSortOpen ? 'active' : ''}`}
                              onClick={() => setIsOrderSortOpen((prev) => !prev)}
                              aria-label="Sort orders"
                              title="Sort orders"
                            >
                              <ArrowUpDown size={15} />
                            </button>

                            {isOrderSortOpen && (
                              <div className="order-sort-menu" role="menu">
                                <span className="sort-menu-header">Sort orders by</span>
                                <button
                                  type="button"
                                  className={`sort-option-btn ${orderSortBy === 'newest' ? 'selected' : ''}`}
                                  onClick={() => { setOrderSortBy('newest'); setIsOrderSortOpen(false); }}
                                >
                                  <span>Newest first</span>
                                  {orderSortBy === 'newest' && <Check size={13} />}
                                </button>
                                <button
                                  type="button"
                                  className={`sort-option-btn ${orderSortBy === 'oldest' ? 'selected' : ''}`}
                                  onClick={() => { setOrderSortBy('oldest'); setIsOrderSortOpen(false); }}
                                >
                                  <span>Oldest first</span>
                                  {orderSortBy === 'oldest' && <Check size={13} />}
                                </button>
                                <button
                                  type="button"
                                  className={`sort-option-btn ${orderSortBy === 'price-high' ? 'selected' : ''}`}
                                  onClick={() => { setOrderSortBy('price-high'); setIsOrderSortOpen(false); }}
                                >
                                  <span>Price: High to Low</span>
                                  {orderSortBy === 'price-high' && <Check size={13} />}
                                </button>
                                <button
                                  type="button"
                                  className={`sort-option-btn ${orderSortBy === 'price-low' ? 'selected' : ''}`}
                                  onClick={() => { setOrderSortBy('price-low'); setIsOrderSortOpen(false); }}
                                >
                                  <span>Price: Low to High</span>
                                  {orderSortBy === 'price-low' && <Check size={13} />}
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Expandable Order Search Input */}
                      {isOrderSearchOpen && (
                        <div className="order-search-expandable">
                          <Search size={15} className="order-search-icon" />
                          <input
                            type="search"
                            value={orderSearchQuery}
                            onChange={(e) => setOrderSearchQuery(e.target.value)}
                            placeholder="Search by order ID or item..."
                            autoFocus
                            className="order-search-input"
                          />
                          {orderSearchQuery && (
                            <button
                              type="button"
                              className="order-search-clear"
                              onClick={() => setOrderSearchQuery('')}
                              aria-label="Clear search"
                            >
                              <X size={14} />
                            </button>
                          )}
                        </div>
                      )}

                      {/* Order Status Tabs Bar */}
                      <div className="order-status-tabs-bar" role="tablist" aria-label="Filter orders by status">
                        <button
                          type="button"
                          role="tab"
                          aria-selected={orderStatusTab === 'all'}
                          className={`order-status-tab-btn ${orderStatusTab === 'all' ? 'active' : ''}`}
                          onClick={() => setOrderStatusTab('all')}
                        >
                          All
                        </button>
                        <button
                          type="button"
                          role="tab"
                          aria-selected={orderStatusTab === 'in-transit'}
                          className={`order-status-tab-btn ${orderStatusTab === 'in-transit' ? 'active' : ''}`}
                          onClick={() => setOrderStatusTab('in-transit')}
                        >
                          <span className="status-tab-dot in-transit" />
                          In Transit
                        </button>
                        <button
                          type="button"
                          role="tab"
                          aria-selected={orderStatusTab === 'delivered'}
                          className={`order-status-tab-btn ${orderStatusTab === 'delivered' ? 'active' : ''}`}
                          onClick={() => setOrderStatusTab('delivered')}
                        >
                          <span className="status-tab-dot delivered" />
                          Delivered
                        </button>
                        <button
                          type="button"
                          role="tab"
                          aria-selected={orderStatusTab === 'canceled'}
                          className={`order-status-tab-btn ${orderStatusTab === 'canceled' ? 'active' : ''}`}
                          onClick={() => setOrderStatusTab('canceled')}
                        >
                          <span className="status-tab-dot canceled" />
                          Canceled
                        </button>
                      </div>

                      <div className="order-history-list">
                        {/* Active Order Card */}
                        {(orderStatusTab === 'all' || orderStatusTab === 'in-transit') && (
                        <div
                          className={`order-card active-order ${collapsedOrders['ITM-8921'] ? 'is-collapsed' : ''}`}
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleTrackOrder('ITM-8921')}
                          title="Click to view live order tracking"
                        >
                          <div className="order-card-header">
                            <div className="order-header-primary">
                              <span className="order-badge in-progress">In Transit</span>
                              {collapsedOrders['ITM-8921'] ? (
                                <div className="order-collapsed-summary-inline">
                                  <span className="order-collapsed-prod-name">Classic Popcorn &amp; Soda Duo</span>
                                  <span className="order-id">#ITM-8921</span>
                                </div>
                              ) : (
                                <span className="order-id">#ITM-8921</span>
                              )}
                            </div>
                            <div className="order-header-actions">
                              {!collapsedOrders['ITM-8921'] && (
                                <>
                                  <span className="order-date">Today, 4:15 PM</span>
                                  <button
                                    type="button"
                                    className="btn-track-order"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleTrackOrder('ITM-8921');
                                    }}
                                  >
                                    <Truck size={14} />
                                    <span>Track Live</span>
                                  </button>
                                </>
                              )}
                              <button
                                type="button"
                                className={`order-arrow-collapse-btn ${collapsedOrders['ITM-8921'] ? 'is-collapsed' : ''}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleOrderCollapse('ITM-8921');
                                }}
                                aria-label={collapsedOrders['ITM-8921'] ? "Expand order details" : "Collapse order details"}
                                title={collapsedOrders['ITM-8921'] ? "Expand details" : "Collapse details"}
                              >
                                <ChevronDown size={18} className={`arrow-collapse-icon ${collapsedOrders['ITM-8921'] ? 'rotated' : ''}`} />
                              </button>
                            </div>
                          </div>

                          {!collapsedOrders['ITM-8921'] && (
                            <>
                              <div className="order-items-summary">
                                <div className="order-item-line">
                                  <span className="item-qty">1x</span>
                                  <span className="item-name">Classic Popcorn &amp; Soda Duo (Large Tub, Extra Butter)</span>
                                  <span className="item-price">GH₵ 51.00</span>
                                </div>
                                <button
                                  type="button"
                                  className="btn-toggle-timeline"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setIsTimelineExpanded((prev) => !prev);
                                  }}
                                >
                                  <span>{isTimelineExpanded ? 'Hide progress steps' : 'View progress steps'}</span>
                                  <ChevronDown size={14} className={`timeline-toggle-chevron ${isTimelineExpanded ? 'open' : ''}`} />
                                </button>
                              </div>

                              <div className={`order-tracker-timeline ${isTimelineExpanded ? 'is-visible' : 'is-collapsed-mobile'}`}>
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
                            </>
                          )}
                        </div>
                        )}

                        {/* Past Order Card */}
                        {(orderStatusTab === 'all' || orderStatusTab === 'delivered') && (
                        <div
                          className={`order-card ${collapsedOrders['ITM-8104'] ? 'is-collapsed' : ''}`}
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleTrackOrder('ITM-8104')}
                          title="Click to view order delivery details"
                        >
                          <div className="order-card-header">
                            <div className="order-header-primary">
                              <span className="order-badge completed">Delivered</span>
                              {collapsedOrders['ITM-8104'] ? (
                                <div className="order-collapsed-summary-inline">
                                  <span className="order-collapsed-prod-name">Artisan Golden Caramel Crunch</span>
                                  <span className="order-id">#ITM-8104</span>
                                </div>
                              ) : (
                                <span className="order-id">#ITM-8104</span>
                              )}
                            </div>
                            <div className="order-header-actions">
                              {!collapsedOrders['ITM-8104'] && (
                                <>
                                  <span className="order-date">October 24, 2026</span>
                                  <button
                                    type="button"
                                    className="btn-track-order btn-track-delivered"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleTrackOrder('ITM-8104');
                                    }}
                                  >
                                    <Package size={14} />
                                    <span>View Details</span>
                                  </button>
                                </>
                              )}
                              <button
                                type="button"
                                className={`order-arrow-collapse-btn ${collapsedOrders['ITM-8104'] ? 'is-collapsed' : ''}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleOrderCollapse('ITM-8104');
                                }}
                                aria-label={collapsedOrders['ITM-8104'] ? "Expand order details" : "Collapse order details"}
                                title={collapsedOrders['ITM-8104'] ? "Expand details" : "Collapse details"}
                              >
                                <ChevronDown size={18} className={`arrow-collapse-icon ${collapsedOrders['ITM-8104'] ? 'rotated' : ''}`} />
                              </button>
                            </div>
                          </div>

                          {!collapsedOrders['ITM-8104'] && (
                            <>
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
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (onNavigate) onNavigate('menu');
                                  }}
                                >
                                  Re-order in 1-Click
                                </button>
                                <span className="order-total-label">Total: <strong>GH₵ 90.00</strong></span>
                              </div>
                            </>
                          )}
                        </div>
                        )}

                        {/* Empty state for Canceled */}
                        {orderStatusTab === 'canceled' && (
                          <div className="order-status-empty">
                            <Package size={36} className="empty-icon" />
                            <h4>No Canceled Orders</h4>
                            <p>You do not have any canceled orders at this time.</p>
                          </div>
                        )}
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
                            href="/menu"
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
                        isEmbedded={true}
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

