import React, { useState } from 'react';
import {
  Home,
  UtensilsCrossed,
  ShoppingBag,
  Package,
  User,
  MoreHorizontal,
  X,
  ChevronRight,
  LayoutDashboard,
  MapPin,
  Heart,
  Truck,
  PartyPopper,
  Info,
  PhoneCall,
  LogOut
} from 'lucide-react';
import '../styles/components/mobile-bottom-tabs.css';

export default function MobileBottomTabs({
  currentPage = 'home',
  onNavigate,
  onOpenCart,
  cartCount = 0,
  user = null,
  setUser,
  showToast
}) {
  const [isMoreDrawerOpen, setIsMoreDrawerOpen] = useState(false);

  // Compute active tab based on currentPage
  const getActiveTab = () => {
    if (currentPage === 'showcase' || currentPage === 'home' || currentPage === '') return 'home';
    if (currentPage === 'menu' || currentPage.startsWith('product-')) return 'menu';
    if (currentPage === 'cart' || currentPage === 'bag') return 'bag';
    if (currentPage === 'order-tracking' || currentPage === 'account-orders' || currentPage === 'welcome-orders') return 'orders';
    if (currentPage === 'welcome-profile' || currentPage.startsWith('welcome-profile') || currentPage === 'login' || currentPage === 'signup') return 'profile';
    return '';
  };

  const activeTab = getActiveTab();

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
    <>
      {/* Floating Mobile Capsule Tab Bar */}
      <nav className="mobile-bottom-tabbar" aria-label="Mobile Navigation">
        <button
          type="button"
          className={`mobile-tab-item ${activeTab === 'home' && !isMoreDrawerOpen ? 'active' : ''}`}
          onClick={() => {
            setIsMoreDrawerOpen(false);
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
          className={`mobile-tab-item ${activeTab === 'menu' && !isMoreDrawerOpen ? 'active' : ''}`}
          onClick={() => {
            setIsMoreDrawerOpen(false);
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
          className={`mobile-tab-item ${activeTab === 'bag' && !isMoreDrawerOpen ? 'active' : ''}`}
          onClick={() => {
            setIsMoreDrawerOpen(false);
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
          className={`mobile-tab-item ${activeTab === 'orders' && !isMoreDrawerOpen ? 'active' : ''}`}
          onClick={() => {
            setIsMoreDrawerOpen(false);
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
          className={`mobile-tab-item ${activeTab === 'profile' && !isMoreDrawerOpen ? 'active' : ''}`}
          onClick={() => {
            setIsMoreDrawerOpen(false);
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
          className={`mobile-tab-item ${isMoreDrawerOpen ? 'active' : ''}`}
          onClick={() => setIsMoreDrawerOpen(!isMoreDrawerOpen)}
          aria-label="More Options"
        >
          <div className="mobile-tab-icon-wrap">
            <MoreHorizontal size={21} />
          </div>
          <span className="mobile-tab-label">More</span>
        </button>
      </nav>

      {/* Slide-up "More" Drawer */}
      {isMoreDrawerOpen && (
        <div
          className="mobile-more-drawer-overlay"
          onClick={() => setIsMoreDrawerOpen(false)}
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
                onClick={() => setIsMoreDrawerOpen(false)}
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
                        setIsMoreDrawerOpen(false);
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
                        setIsMoreDrawerOpen(false);
                        if (onNavigate) onNavigate('signup');
                      }}
                    >
                      Sign up for VIP Crunch Perks
                    </button>
                    <button
                      type="button"
                      className="mobile-drawer-auth-btn black"
                      onClick={() => {
                        setIsMoreDrawerOpen(false);
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
                      setIsMoreDrawerOpen(false);
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
    </>
  );
}
