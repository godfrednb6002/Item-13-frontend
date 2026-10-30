import React, { useState } from 'react';
import {
  LayoutDashboard,
  User,
  ShoppingBag,
  Package,
  MapPin,
  CreditCard,
  Settings,
  Bell,
  Heart,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Sparkles,
  ArrowRight,
  Check,
  TrendingUp,
  Clock,
  ExternalLink,
  ShieldCheck,
  Plus
} from 'lucide-react';
import { PRODUCTS } from '../features/catalog/productsData';

export default function WelcomePage({
  user,
  onNavigate,
  onSignOut,
  onToast,
  cartCount = 0
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  const displayName = user?.name || (user?.email ? user.email.split('@')[0] : 'Snack Lover');
  const userEmail = user?.email || 'customer@item13.com';

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'menu', label: 'Order Popcorn', icon: ShoppingBag, badge: 'Hot' },
    { id: 'profile', label: 'My Profile', icon: User, badge: null },
    { id: 'orders', label: 'Orders & Tracking', icon: Package, badge: '1 Active' },
    { id: 'addresses', label: 'Delivery Addresses', icon: MapPin, badge: null },
    { id: 'favorites', label: 'Saved Favorites', icon: Heart, badge: null },
    { id: 'payments', label: 'Payments & MoMo', icon: CreditCard, badge: null },
    { id: 'settings', label: 'Settings', icon: Settings, badge: null },
  ];

  return (
    <div className={`welcome-layout ${collapsed ? 'sidebar-collapsed' : ''}`}>
      {/* ================= LEFT DRAWER ================= */}
      <aside className="welcome-sidebar">
        {/* Brand & Toggle Header */}
        <div className="sidebar-brand-box">
          {!collapsed && (
            <div className="sidebar-brand" onClick={() => onNavigate && onNavigate('home')}>
              <img
                src="/item13Logo-trimmed.png"
                alt="Item13 Logo"
                className="brand-logo-img"
              />
              <span className="brand-logo-tagline">THE UNEXPECTED ESSENTIAL</span>
            </div>
          )}
          {collapsed && (
            <img
              src="/item13Logo-trimmed.png"
              alt="Item13 Logo"
              className="brand-logo-img collapsed-logo"
              onClick={() => onNavigate && onNavigate('home')}
            />
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
        <div className="sidebar-user-box">
          <div className="sidebar-user-avatar">
            {displayName.charAt(0).toUpperCase()}
          </div>
          {!collapsed && (
            <div className="sidebar-user-details">
              <span className="user-name">{displayName}</span>
              <span className="user-status">VIP Member • Ghana</span>
            </div>
          )}
        </div>

        {/* Nav Links */}
        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => {
                  if (item.id === 'menu') {
                    if (onNavigate) onNavigate('menu');
                  } else {
                    setActiveTab(item.id);
                  }
                }}
                title={collapsed ? item.label : ''}
              >
                <Icon size={19} className="nav-icon" />
                {!collapsed && <span className="nav-label">{item.label}</span>}
                {!collapsed && item.badge && (
                  <span className={`nav-badge ${item.badge === 'Hot' ? 'badge-hot' : ''}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Drawer Actions */}
        <div className="sidebar-footer">
          <button
            type="button"
            className="sidebar-footer-btn"
            onClick={() => onNavigate && onNavigate('home')}
            title={collapsed ? 'Back to Storefront' : ''}
          >
            <ExternalLink size={18} />
            {!collapsed && <span>Storefront</span>}
          </button>

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
        {/* Top Bar inside Stage */}
        <header className="welcome-topbar">
          <div className="welcome-breadcrumbs">
            <span className="crumb-root">Account</span>
            <ChevronRight size={14} className="crumb-sep" />
            <span className="crumb-current">
              {navItems.find((n) => n.id === activeTab)?.label || 'Dashboard'}
            </span>
          </div>

          <div className="welcome-topbar-actions">
            <button
              className="topbar-action-btn"
              onClick={() => onNavigate && onNavigate('menu')}
            >
              <ShoppingBag size={16} />
              <span>Browse Menu</span>
            </button>
            {cartCount > 0 && (
              <span className="topbar-bag-chip">Bag: {cartCount}</span>
            )}
          </div>
        </header>

        {/* Dynamic Panel Content based on Active Drawer Button */}
        <div className="welcome-content-scroll">
          {/* 1. DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="dashboard-view-pane">
              {/* Hero Greeting Card */}
              <div className="dash-hero-card">
                <div className="dash-hero-content">
                  <div className="dash-hero-tag">
                    <Sparkles size={14} /> VIP Snack Lounge
                  </div>
                  <h1 className="dash-hero-title">
                    Welcome back, <span className="gold-accent">{displayName}</span>!
                  </h1>
                  <p className="dash-hero-desc">
                    Ready for your next crunch? Fresh buttered, caramel, and suya pepper popcorn are hot and ready to dispatch to your location.
                  </p>
                  <div className="dash-hero-buttons">
                    <button
                      className="btn-dash-primary"
                      onClick={() => onNavigate && onNavigate('menu')}
                    >
                      <ShoppingBag size={16} />
                      <span>Order Popcorn Now</span>
                    </button>
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
                    src="/WhatsApp Image 2026-10-29 at 4.31.43 PM-Photoroom.png"
                    alt="Popcorn and Drinks Duo"
                    className="dash-popcorn-img"
                    onError={(e) => {
                      e.target.src = '/bistro-popcorn.jpg';
                    }}
                  />
                </div>
              </div>

              {/* Stats Overview Grid */}
              <div className="dash-stats-grid">
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

                <div className="stat-card">
                  <div className="stat-icon-wrap purple">
                    <Heart size={20} />
                  </div>
                  <div className="stat-content">
                    <span className="stat-label">Favorite Flavor</span>
                    <span className="stat-value">Double Butter</span>
                    <span className="stat-sub">Ordered 4 times</span>
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
                  onClick={() => setActiveTab('orders')}
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
                  <button
                    className="view-all-link"
                    onClick={() => onNavigate && onNavigate('menu')}
                  >
                    View Full Menu <ArrowRight size={14} />
                  </button>
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
                            onClick={() => onNavigate && onNavigate('menu')}
                          >
                            Order
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 2. PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="welcome-tab-pane">
              <div className="pane-header">
                <h2>Account Profile</h2>
                <p>Manage your personal information and contact details</p>
              </div>

              <div className="pane-card">
                <div className="form-grid-2">
                  <div className="form-field">
                    <label>Full Name</label>
                    <input type="text" defaultValue={displayName} className="dash-input" />
                  </div>
                  <div className="form-field">
                    <label>Email Address</label>
                    <input type="email" defaultValue={userEmail} className="dash-input" />
                  </div>
                  <div className="form-field">
                    <label>Phone Number (Mobile Money & Delivery)</label>
                    <input type="tel" defaultValue="+233 54 123 4567" className="dash-input" />
                  </div>
                  <div className="form-field">
                    <label>Default City</label>
                    <select className="dash-input" defaultValue="accra">
                      <option value="accra">Accra (Greater Accra)</option>
                      <option value="tema">Tema</option>
                      <option value="kumasi">Kumasi</option>
                      <option value="other">Other Region</option>
                    </select>
                  </div>
                </div>
                <div className="pane-action-row">
                  <button
                    className="btn-dash-primary"
                    onClick={() => onToast && onToast('Profile details updated successfully!')}
                  >
                    Save Changes
                  </button>
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
                <div className="order-card active-order">
                  <div className="order-card-header">
                    <div>
                      <span className="order-badge in-progress">In Transit</span>
                      <span className="order-id">#ITM-8921</span>
                    </div>
                    <span className="order-date">Today, 4:15 PM</span>
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
                <div className="order-card">
                  <div className="order-card-header">
                    <div>
                      <span className="order-badge completed">Delivered</span>
                      <span className="order-id">#ITM-8104</span>
                    </div>
                    <span className="order-date">October 24, 2026</span>
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

          {/* 4. ADDRESSES TAB */}
          {activeTab === 'addresses' && (
            <div className="welcome-tab-pane">
              <div className="pane-header">
                <h2>Saved Delivery Locations</h2>
                <p>Saved GhanaPost GPS addresses and landmark instructions for swift delivery</p>
              </div>

              <div className="addresses-grid">
                <div className="address-card default">
                  <div className="address-type-row">
                    <span className="addr-tag">Home (Default)</span>
                    <span className="addr-check"><Check size={14} /></span>
                  </div>
                  <h4 className="addr-title">East Legon Residence</h4>
                  <p className="addr-text">Boundary Road, Near A&amp;C Mall, Accra</p>
                  <p className="addr-gps">GhanaPost GPS: <strong>GA-182-9021</strong></p>
                  <p className="addr-note">"Call on arrival at the gate"</p>
                </div>

                <div className="address-card">
                  <div className="address-type-row">
                    <span className="addr-tag">Office</span>
                  </div>
                  <h4 className="addr-title">Airport City Office</h4>
                  <p className="addr-text">One Airport Square, 4th Floor, Accra</p>
                  <p className="addr-gps">GhanaPost GPS: <strong>GA-054-1102</strong></p>
                </div>

                <button
                  className="add-address-card"
                  onClick={() => onToast && onToast('Address modal will open')}
                >
                  <Plus size={24} />
                  <span>Add New Delivery Address</span>
                </button>
              </div>
            </div>
          )}

          {/* 5. FAVORITES TAB */}
          {activeTab === 'favorites' && (
            <div className="welcome-tab-pane">
              <div className="pane-header">
                <h2>Your Popcorn Wishlist</h2>
                <p>Quickly re-order the flavors you love</p>
              </div>

              <div className="dash-quick-products">
                {PRODUCTS.filter((p) => p.badge).map((item) => (
                  <div key={item.id} className="dash-prod-mini-card">
                    <img src={item.image} alt={item.name} className="mini-prod-img" />
                    <div className="mini-prod-info">
                      <span className="mini-prod-tag">{item.category}</span>
                      <h4 className="mini-prod-name">{item.name}</h4>
                      <div className="mini-prod-bottom">
                        <span className="mini-prod-price">GH₵ {item.price.toFixed(2)}</span>
                        <button
                          className="btn-mini-add"
                          onClick={() => onNavigate && onNavigate('menu')}
                        >
                          Add to Bag
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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
        </div>
      </main>
    </div>
  );
}

