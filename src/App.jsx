import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { ShoppingBag, ChevronRight, Search, X, Check, Star } from 'lucide-react';
import AuthPage from './pages/AuthPage';
import ProfilePage from './pages/ProfilePage';
import CartDrawer from './features/cart/CartDrawer';
import CheckoutPage from './pages/CheckoutPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState(
    window.location.pathname.startsWith('/checkout') ? 'checkout' : 'home',
  );
  const [user, setUser] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [activeModal, setActiveModal] = useState(null); // 'signin' | 'login' | 'guest' | 'item' | 'favorites'
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [orderConfirmation, setOrderConfirmation] = useState(null);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPage(window.location.pathname.startsWith('/checkout') ? 'checkout' : 'home');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (page) => {
    const nextPath = page === 'checkout' ? '/checkout' : '/';
    if (window.location.pathname !== nextPath) {
      window.history.pushState({}, '', nextPath);
    }
    setCurrentPage(page);
  };

  const addItemToCart = (productId) => {
    const products = {
      'classic-combo': {
        id: 'classic-combo',
        name: 'Classic Popcorn & Drink Combo',
        image: '/WhatsApp Image 2026-10-29 at 4.31.43 PM-Photoroom.png',
        price: 45,
        variant: 'Buttered popcorn · Cola + Fanta',
        stock: 8,
      },
      'bistro-popcorn': {
        id: 'bistro-popcorn',
        name: 'Bistro Popcorn',
        image: '/bistro-popcorn.jpg',
        price: 12.9,
        variant: 'Freshly popped · Classic',
        stock: 12,
      },
      'coca-cola': {
        id: 'coca-cola',
        name: 'Coca-Cola',
        image: '/coca-cola.jpg',
        price: 7.9,
        variant: 'Chilled · 330 ml',
        stock: 20,
      },
    };
    const product = products[productId];
    if (!product) return;

    setCartItems((currentItems) => {
      const existing = currentItems.find((item) => item.id === productId);
      if (existing) {
        return currentItems.map((item) =>
          item.id === productId
            ? { ...item, quantity: Math.min(item.stock, item.quantity + 1) }
            : item,
        );
      }
      return [...currentItems, { ...product, quantity: 1 }];
    });
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const handleBuyNow = (e) => {
    // Confetti celebration burst
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 60,
      spread: 70,
      origin: { x, y },
      colors: ['#F4B627', '#ffffff', '#FF5722', '#222222']
    });

    addItemToCart('classic-combo');
    showToast("Added 'Classic Popcorn & Drink Combo' to your bag! (GH₵ 45.00)");
  };

  const handleAddMiniItem = (name, price) => {
    const productId = name === 'Bistro Popcorn' ? 'bistro-popcorn' : 'coca-cola';
    addItemToCart(productId);
    showToast(`Added '${name}' to your bag! (${price})`);
  };

  if (currentPage === 'checkout' || currentPage === 'order-confirmation') {
    return (
      <CheckoutPage
        items={cartItems}
        customer={user}
        confirmation={orderConfirmation}
        onBack={() => {
          setOrderConfirmation(null);
          navigateTo('home');
        }}
        onUpdateQuantity={(productId, quantity) => {
          setCartItems((items) => items.map((item) =>
            item.id === productId
              ? { ...item, quantity: Math.max(1, Math.min(item.stock, quantity)) }
              : item,
          ));
        }}
        onPlaceOrder={(order) => {
          setOrderConfirmation({
            ...order,
            orderNumber: `I13-${Date.now().toString().slice(-8)}`,
          });
          setCartItems([]);
          setCurrentPage('order-confirmation');
          window.history.pushState({}, '', '/checkout/confirmation');
        }}
      />
    );
  }

  if (currentPage === 'login' || currentPage === 'signup') {
    return (
      <>
        {toastMessage && (
          <div className="toast-notice">
            <Check size={18} color="var(--gold)" />
            <span>{toastMessage}</span>
          </div>
        )}
        <AuthPage
          initialMode={currentPage === 'signup' ? 'signup' : 'login'}
          onNavigate={navigateTo}
          onAuthSuccess={(userData) => {
            setUser(userData);
            navigateTo('home');
            showToast(`Welcome, ${userData.name || userData.email.split('@')[0]}!`);
          }}
        />
      </>
    );
  }

  if (currentPage === 'profile') {
    return (
      <>
        {toastMessage && (
          <div className="toast-notice">
            <Check size={18} color="var(--gold)" />
            <span>{toastMessage}</span>
          </div>
        )}
        <ProfilePage
          user={user}
          onNavigate={navigateTo}
          onToast={showToast}
          onSignOut={() => {
            setUser(null);
            navigateTo('home');
            showToast('Signed out of Item13.');
          }}
        />
      </>
    );
  }

  return (
    <div className="page-container">
      {/* Background Graphic Elements */}
      <div className="diagonal-bg">
        <svg className="diagonal-svg-canvas" viewBox="0 0 1440 900" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="fastfood-doodles" width="220" height="220" patternUnits="userSpaceOnUse">
              {/* Burger doodle */}
              <g stroke="#6b4c05" strokeWidth="1.5" fill="none" opacity="0.45" transform="translate(20, 20)">
                <path d="M 10 25 Q 35 5 60 25 Z" />
                <path d="M 8 28 L 62 28" strokeLinecap="round" />
                <path d="M 6 34 Q 16 38 26 34 Q 36 38 46 34 Q 56 38 64 34" />
                <rect x="8" y="38" width="54" height="6" rx="3" />
                <path d="M 10 48 Q 35 56 60 48" />
              </g>

              {/* Soda Bottle / Cup doodle */}
              <g stroke="#6b4c05" strokeWidth="1.5" fill="none" opacity="0.45" transform="translate(130, 40)">
                <line x1="25" y1="5" x2="35" y2="0" strokeLinecap="round" />
                <path d="M 15 10 L 45 10 L 40 55 L 20 55 Z" />
                <line x1="16" y1="22" x2="44" y2="22" />
                <line x1="18" y1="36" x2="42" y2="36" />
              </g>

              {/* Fries doodle */}
              <g stroke="#6b4c05" strokeWidth="1.5" fill="none" opacity="0.45" transform="translate(40, 130)">
                <path d="M 10 25 L 14 55 L 42 55 L 46 25 Z" />
                <line x1="16" y1="24" x2="18" y2="10" strokeLinecap="round" />
                <line x1="24" y1="24" x2="26" y2="6" strokeLinecap="round" />
                <line x1="32" y1="24" x2="31" y2="8" strokeLinecap="round" />
                <line x1="40" y1="24" x2="38" y2="12" strokeLinecap="round" />
              </g>

              {/* Popcorn doodle */}
              <g stroke="#6b4c05" strokeWidth="1.5" fill="none" opacity="0.45" transform="translate(140, 140)">
                <circle cx="15" cy="15" r="7" />
                <circle cx="24" cy="12" r="6" />
                <circle cx="21" cy="22" r="7" />
                <circle cx="12" cy="23" r="6" />
              </g>
            </pattern>

            <linearGradient id="yellowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbc63b" />
              <stop offset="60%" stopColor="#f4b627" />
              <stop offset="100%" stopColor="#e8a514" />
            </linearGradient>

            <clipPath id="yellowCurveClip">
              {/* Starts right in front of Sign in button (~X:1120 in 1440 width), sweeps down-left across hero, and rounds smoothly at the bottom-left corner with an organic curve */}
              <path d="M 1120 0 
                       L 1440 0 
                       L 1440 900 
                       L 650 900 
                       C 580 900, 520 860, 520 780 
                       C 520 700, 570 640, 640 570 
                       L 1120 0 Z" />
            </clipPath>
          </defs>

          {/* Yellow curved background shape */}
          <path
            d="M 1120 0 
               L 1440 0 
               L 1440 900 
               L 650 900 
               C 580 900, 520 860, 520 780 
               C 520 700, 570 640, 640 570 
               L 1120 0 Z"
            fill="url(#yellowGradient)"
          />

          {/* Line art doodle overlay within the curved yellow shape */}
          <g clipPath="url(#yellowCurveClip)">
            <rect width="1440" height="900" fill="url(#fastfood-doodles)" className="doodle-overlay-rect" />
          </g>
        </svg>
      </div>

      {/* Top Navigation */}
      <header className="navbar">
        <div className="brand-logo" onClick={() => showToast("Item13 — The Unexpected Essential")}>
          <img
            src="/item13Logo-trimmed.png"
            alt="Item13 Logo"
            className="brand-logo-img"
          />
          <span className="brand-logo-tagline">THE UNEXPECTED ESSENTIAL</span>
        </div>

        <div className="nav-right">
          <div className="nav-links">
            <button className="nav-search-btn" aria-label="Search" onClick={() => showToast("Search our products...")}>
              <Search size={18} />
            </button>
            <a href="#why" className="nav-link" onClick={(e) => { e.preventDefault(); showToast("Item13 uses premium ingredients and delivers freshly popped popcorn across Ghana."); }}>
              Why Item13?
            </a>
            <a href="#about" className="nav-link on-yellow" onClick={(e) => { e.preventDefault(); showToast("Item13 — Ghana's favourite popcorn and snack delivery brand."); }}>
              About
            </a>
            <a href="#menu" className="nav-link on-yellow" onClick={(e) => { e.preventDefault(); showToast("Explore our full popcorn and drinks menu."); }}>
              Menu ▾
            </a>
          </div>

          <div className="nav-buttons-group">
            <button
              className="nav-cart-button"
              type="button"
              onClick={() => setIsCartOpen(true)}
              aria-label={`Open bag, ${cartItems.reduce((sum, item) => sum + item.quantity, 0)} items`}
            >
              <ShoppingBag size={17} />
              <span>Bag</span>
              <b>{cartItems.reduce((sum, item) => sum + item.quantity, 0)}</b>
            </button>
            {user ? (
              <div className="nav-buttons-row" style={{ alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '13px', color: '#111', fontWeight: 700, background: 'var(--gold)', padding: '6px 14px', borderRadius: '20px' }}>
                  Hi, {user.email.split('@')[0]}
                </span>
                <button
                  className="btn-pill btn-pill-black"
                  onClick={() => navigateTo('profile')}
                  style={{ fontSize: '12px', padding: '6px 14px' }}
                >
                  My account
                </button>
                <button
                  className="btn-pill btn-pill-outline"
                  onClick={() => {
                    setUser(null);
                    showToast("Signed out of Item13.");
                  }}
                  style={{ fontSize: '12px', padding: '6px 14px' }}
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <div className="nav-buttons-row">
                  <button className="btn-pill btn-pill-yellow" onClick={() => navigateTo('signup')}>
                    Sign up
                  </button>
                  <button className="btn-pill btn-pill-black" onClick={() => navigateTo('login')}>
                    Login
                  </button>
                </div>
                <button className="btn-pill btn-pill-outline" onClick={() => showToast("Continuing as Guest — welcome!")}>
                  Continue as guest
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Hero Content */}
      <main className="hero-content">
        {/* Left Side (Black Matte Background) */}
        <section className="hero-left">
          {/* Subtle curved line accent */}
          <svg className="decorative-wave" viewBox="0 0 40 16" fill="none">
            <path d="M 2 8 Q 10 0 18 8 T 34 8" stroke="#f4b627" strokeWidth="2.5" strokeLinecap="round" />
          </svg>

          <p className="hero-subtitle-top">
            Ghana's favourite popcorn, freshly popped and delivered straight to your doorstep.
          </p>

          <h1 className="hero-title">
            Classic Popcorn <br />
            <span className="title-accent">& Drinks</span>
          </h1>

          <p className="hero-desc">
            Item13’s signature buttered popcorn paired with ice-cold drinks — a taste you won’t find anywhere else. Order now and we’ll deliver across Ghana.
          </p>

          {/* Pricing & CTA */}
          <div className="hero-action-row">
            <div className="price-container">
              <span className="price-original">GHS14.99</span>
              <span className="price-current">GHS12.90</span>
            </div>

            <button className="btn-buy-now" onClick={handleBuyNow} id="buy-now-btn">
              <span className="bag-icon-badge">
                <ShoppingBag size={15} />
              </span>
              <span>Buy Now</span>
            </button>
          </div>

          {/* Customer Favorites in Bottom Left Corner */}
          <div className="customer-favorites" onClick={() => setActiveModal('favorites')} style={{ cursor: 'pointer' }}>
            <div className="avatar-stack-ring">
              <div className="avatar-group">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                  alt="Customer avatar 1"
                  className="avatar avatar-1"
                />
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                  alt="Customer avatar 2"
                  className="avatar avatar-2"
                />
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"
                  alt="Customer avatar 3"
                  className="avatar avatar-3"
                />
              </div>
            </div>

            <div className="favorites-text">
              <span className="favorites-title">Customer Favorites</span>
              <span className="favorites-link">
                See top rated dishes <ChevronRight size={14} />
              </span>
            </div>
          </div>
        </section>

        {/* Right Side (Yellow Background) */}
        <section className="hero-right">
          {/* Main Hero Visual: Popcorn bowl + Fanta + Coca Cola */}
          <div className="hero-product-showcase">
            <img
              src="/WhatsApp Image 2026-10-29 at 4.31.43 PM-Photoroom.png"
              alt="Classic Popcorn and Soda Duo featuring buttered popcorn, Fanta orange soda, and Coca-Cola"
              className="hero-main-img"
              id="hero-duo-image"
            />
          </div>

          {/* Dashboard Widget: New Menu Items / Latest Additions */}
          <div className="menu-widget">
            <div className="widget-header">
              <span className="widget-title">New Menu Items</span>
              <span className="widget-subtitle">Latest Additions</span>
            </div>

            <div className="widget-cards-grid">
              {/* Product 1: Bistro Popcorn */}
              <div
                className="product-mini-card"
                onClick={() => handleAddMiniItem("Bistro Popcorn", "GHS12.90")}
                title="Click to add Bistro Popcorn"
              >
                <img
                  src="/bistro-popcorn.jpg"
                  alt="Bistro Popcorn"
                  className="mini-card-thumb"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=120&auto=format&fit=crop&q=80";
                  }}
                />
                <div className="mini-card-info">
                  <span className="mini-card-name">Bistro Popcorn</span>
                  <span className="mini-card-price">GHS12.90</span>
                </div>
              </div>

              {/* Product 2: Coca-Cola */}
              <div
                className="product-mini-card"
                onClick={() => handleAddMiniItem("Coca-Cola", "GHS7.90")}
                title="Click to add Coca-Cola"
              >
                <img
                  src="/coca-cola.jpg"
                  alt="Coca-Cola"
                  className="mini-card-thumb"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=120&auto=format&fit=crop&q=80";
                  }}
                />
                <div className="mini-card-info">
                  <span className="mini-card-name">Coca-Cola</span>
                  <span className="mini-card-price">GHS7.90</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {isCartOpen && (
        <CartDrawer
          items={cartItems}
          onClose={() => setIsCartOpen(false)}
          onContinueShopping={() => setIsCartOpen(false)}
          onCheckout={() => {
            setIsCartOpen(false);
            navigateTo('checkout');
          }}
          onAddItem={addItemToCart}
          onUpdateQuantity={(productId, quantity) => {
            setCartItems((items) => items.map((item) =>
              item.id === productId
                ? { ...item, quantity: Math.max(1, Math.min(item.stock, quantity)) }
                : item,
            ));
          }}
          onRemoveItem={(productId) => {
            setCartItems((items) => items.filter((item) => item.id !== productId));
          }}
        />
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-notice">
          <Check size={18} color="var(--gold)" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Interactive Modals */}
      {activeModal && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setActiveModal(null)}>
              <X size={18} />
            </button>

            {activeModal === 'signin' && (
              <div>
                <h3 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--gold)', marginBottom: '8px' }}>
                  Sign in to Item13
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '20px' }}>
                  Access member-only snack bundles, exclusive discounts, and order tracking.
                </p>
                <input
                  type="email"
                  placeholder="Enter your email"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    background: '#0e0f12',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: '#fff',
                    marginBottom: '14px',
                    outline: 'none'
                  }}
                />
                <button
                  className="btn-pill btn-pill-yellow"
                  style={{ width: '100%', padding: '14px' }}
                  onClick={() => {
                    setActiveModal(null);
                    showToast("Welcome back to Item13!");
                  }}
                >
                  Continue with Email
                </button>
              </div>
            )}

            {activeModal === 'login' && (
              <div>
                <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#fff', marginBottom: '8px' }}>
                  Quick Login
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '20px' }}>
                  Enter your credentials to manage your snacks and orders.
                </p>
                <input
                  type="text"
                  placeholder="Username or Phone"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    background: '#0e0f12',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: '#fff',
                    marginBottom: '14px',
                    outline: 'none'
                  }}
                />
                <button
                  className="btn-pill btn-pill-black"
                  style={{ width: '100%', padding: '14px', border: '1px solid var(--gold)' }}
                  onClick={() => {
                    setActiveModal(null);
                    showToast("Logged in successfully!");
                  }}
                >
                  Login
                </button>
              </div>
            )}

            {activeModal === 'favorites' && (
              <div>
                <h3 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--gold)', marginBottom: '14px' }}>
                  Customer Favorites
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}>
                    <div>
                      <div style={{ fontWeight: 600 }}>Classic Buttered Crunch</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Rated 4.9 ★ by 2,400+ popcorn lovers</div>
                    </div>
                    <span style={{ color: 'var(--gold)', fontWeight: 700 }}>GHS12.90</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}>
                    <div>
                      <div style={{ fontWeight: 600 }}>Fanta Citrus Duo Pack</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Rated 4.8 ★ by 1,820+ customers</div>
                    </div>
                    <span style={{ color: 'var(--gold)', fontWeight: 700 }}>GHS8.50</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
