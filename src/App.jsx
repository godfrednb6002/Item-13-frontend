import React, { useState, useEffect } from 'react';
import DynamicBackground from './components/DynamicBackground';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CatalogSection from './components/CatalogSection';
import ComboPairings from './components/ComboPairings';
import StoryCraft from './components/StoryCraft';
import Testimonials from './components/Testimonials';
import CartDrawer from './components/CartDrawer';
import QuickViewModal from './components/QuickViewModal';
import Footer from './components/Footer';
import { POPCORN_ITEMS, DRINK_ITEMS } from './data';
import './App.css';

function App() {
  // Theme state: dark / light with persistent storage & system preference fallback
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('popnsizzle-theme');
    if (saved) return saved;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  });

  // Filter state for catalog
  const [activeFilter, setActiveFilter] = useState('all');

  // Cart state
  const [cartItems, setCartItems] = useState([
    {
      id: 'pop-1',
      name: 'Artisan Salted Caramel',
      price: 6.50,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?auto=format&fit=crop&w=700&q=80',
    },
    {
      id: 'drk-1',
      name: 'Sparkling Yuzu Blossom',
      price: 5.50,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=700&q=80',
    },
  ]);

  const [cartOpen, setCartOpen] = useState(false);
  const [quickViewItem, setQuickViewItem] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Sync theme attribute to document root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('popnsizzle-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Add individual product
  const handleAddToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          image: product.image,
        },
      ];
    });
  };

  // Add combo pairing
  const handleAddCombo = (combo) => {
    setCartItems((prev) => {
      const comboId = combo.id;
      const existing = prev.find((item) => item.id === comboId);
      if (existing) {
        return prev.map((item) =>
          item.id === comboId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          id: comboId,
          name: `${combo.name} (Pairing Duo)`,
          price: combo.price,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?auto=format&fit=crop&w=700&q=80',
        },
      ];
    });
  };

  // Quick add duo from Hero
  const handleHeroQuickAdd = () => {
    handleAddCombo({
      id: 'combo-hero',
      name: 'Salted Caramel & Yuzu Sparkler Duo',
      price: 10.00,
    });
    setCartOpen(true);
  };

  const handleUpdateQty = (id, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: newQty } : item))
    );
  };

  const handleRemoveItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const totalCartCount = cartItems.reduce((acc, it) => acc + it.quantity, 0);

  return (
    <div className="app-container">
      {/* Interactive Mobile & Desktop Dynamic Background */}
      <DynamicBackground />

      {/* Sticky Glass Navbar */}
      <Navbar
        theme={theme}
        toggleTheme={toggleTheme}
        cartCount={totalCartCount}
        onOpenCart={() => setCartOpen(true)}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {/* Main Home Page Content */}
      <main className="main-content">
        {/* Hero Section */}
        <Hero
          onExploreClick={() => setActiveFilter('all')}
          onQuickAddCombo={handleHeroQuickAdd}
        />

        {/* Catalog Section with Category Filter & Search */}
        <CatalogSection
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          onAddToCart={handleAddToCart}
          onQuickView={(item) => setQuickViewItem(item)}
        />

        {/* Sommelier Combos */}
        <ComboPairings onAddCombo={handleAddCombo} />

        {/* Quality Story & Micro-batch Craft */}
        <StoryCraft />

        {/* Reviews & Social Proof */}
        <Testimonials />
      </main>

      {/* Footer */}
      <Footer />

      {/* Slide-out Cart Drawer with Glassmorphism */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />

      {/* Quick View Modal */}
      <QuickViewModal
        item={quickViewItem}
        onClose={() => setQuickViewItem(null)}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
}

export default App;
