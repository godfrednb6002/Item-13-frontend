import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  ShoppingBag,
  Sparkles,
  ArrowLeft,
  X,
  Check,
  Flame,
} from 'lucide-react';
import { CATEGORIES, PRODUCTS } from '../features/catalog/productsData';
import ProductCard from '../features/catalog/ProductCard';
import ProductDetailModal from '../features/catalog/ProductDetailModal';
import Footer from '../components/Footer';
import ThemeToggle from '../components/ThemeToggle';

export default function MenuPage({ onNavigate, onAddToCart, cartCount = 0, onToast }) {
  // Loading & Filter States
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [maxPrice, setMaxPrice] = useState(150);
  const [sortBy, setSortBy] = useState('featured'); // 'featured' | 'price-asc' | 'price-desc' | 'rating'
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [isCountBumping, setIsCountBumping] = useState(false);

  // Trigger pulse/bump effect when cartCount increases
  useEffect(() => {
    if (cartCount > 0) {
      setIsCountBumping(true);
      const timer = setTimeout(() => setIsCountBumping(false), 300);
      return () => clearTimeout(timer);
    }
  }, [cartCount]);

  // Initial skeleton loading timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, []);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((item) => {
      // Category match
      if (activeCategory !== 'all' && item.category !== activeCategory) {
        return false;
      }
      // Search match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesTags = item.tags && item.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesName && !matchesDesc && !matchesTags) return false;
      }
      // Price filter (GH₵)
      if (item.price > maxPrice) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // featured default
    });
  }, [activeCategory, searchQuery, maxPrice, sortBy]);

  const clearFilters = () => {
    setActiveCategory('all');
    setSearchQuery('');
    setMaxPrice(150);
    setSortBy('featured');
  };

  return (
    <div className="menu-page-wrapper">
      {/* Background ambient lighting */}
      <div className="menu-ambient-glow" />

      {/* Top Bar Header */}
      <header className="menu-header">
        <div className="menu-header-inner">
          <a
            href="/"
            className="menu-brand-logo"
            onClick={(e) => {
              e.preventDefault();
              if (onNavigate) onNavigate('home');
            }}
            title="Back to Item13 Home"
            style={{ textDecoration: 'none', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <img
              src="/item13Logo-trimmed.png"
              alt="Item13 Logo"
              className="brand-logo-img"
            />
            <span className="brand-logo-tagline">THE UNEXPECTED ESSENTIAL</span>
          </a>

          <div className="menu-header-actions">
            <ThemeToggle />
            <a
              href="/"
              className="menu-nav-home-btn"
              onClick={(e) => {
                e.preventDefault();
                if (onNavigate) onNavigate('home');
              }}
              style={{ textDecoration: 'none' }}
            >
              <ArrowLeft size={16} />
              <span>Back to Store</span>
            </a>

            <button
              type="button"
              className="menu-bag-pill"
              onClick={() => onNavigate && onNavigate('cart')}
              style={{ border: 'none', cursor: 'pointer' }}
              title="View Bag / Cart"
            >
              <ShoppingBag size={16} />
              <span>Bag ({cartCount})</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Banner for Menu */}
      <section className="menu-hero-banner">
        <div className="menu-hero-content">
          <div className="menu-badge">
            Freshly Popped in Ghana
          </div>
          <h1 className="menu-hero-title">
            Our Popcorn &amp; <span className="title-gold">Refreshments Menu</span>
          </h1>
          <p className="menu-hero-desc">
            Handcrafted artisan popcorn popped hot to order, ice-cold drinks, and snack meal combos delivered straight to your door across Accra, Tema, and beyond.
          </p>
        </div>
      </section>

      {/* Search & Category Pills Navigation */}
      <section className="menu-controls-bar">
        <div className="menu-controls-inner">
          {/* Search Box */}
          <div className="menu-search-wrapper">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              className="menu-search-input"
              placeholder="Search popcorn, caramel, suya spice, sodas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className="search-clear-btn"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="menu-sort-wrapper">
            <ArrowUpDown size={15} className="sort-icon" />
            <select
              className="menu-sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort snacks"
              title="Sort snacks"
            >
              <option value="featured">Featured / Popular</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

          {/* Mobile Filter Toggle */}
          <div className="mobile-filter-wrapper">
            <button
              type="button"
              className="mobile-filter-trigger"
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              aria-label="Filter snacks"
              title="Filter snacks"
            >
              <SlidersHorizontal size={16} />
              <span className="mobile-filter-text">Filters</span>
            </button>

            {/* Mobile Filter Small Pop-Up Modal */}
            {mobileFilterOpen && (
              <>
                <div
                  className="mobile-filter-backdrop"
                  onClick={() => setMobileFilterOpen(false)}
                />
                <div className="mobile-filter-popup">
                  <div className="mobile-filter-popup-header">
                    <span className="mobile-filter-popup-title">Filter by Price</span>
                    <button
                      type="button"
                      className="mobile-filter-close-btn"
                      onClick={() => setMobileFilterOpen(false)}
                      aria-label="Close filter"
                    >
                      <X size={15} />
                    </button>
                  </div>

                  <div className="filter-group" style={{ marginBottom: '14px' }}>
                    <div className="filter-price-labels">
                      <span className="price-min">GH₵ 10</span>
                      <span className="price-current-tag">Max: GH₵ {maxPrice}</span>
                    </div>
                    <input
                      type="range"
                      min="12"
                      max="150"
                      step="2"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      className="gold-range-slider"
                    />
                    <div className="price-scale-helper" style={{ fontSize: '10px', marginTop: '4px' }}>
                      <span>Under GH₵30: Quick Drinks</span>
                      <span>Under GH₵50: Regular Tubs</span>
                    </div>
                  </div>

                  <div className="mobile-filter-popup-actions">
                    {(activeCategory !== 'all' || searchQuery || maxPrice < 150) && (
                      <button
                        type="button"
                        className="mobile-filter-reset-btn"
                        onClick={clearFilters}
                      >
                        Reset
                      </button>
                    )}
                    <button
                      type="button"
                      className="mobile-filter-apply-btn"
                      onClick={() => setMobileFilterOpen(false)}
                    >
                      Apply ({filteredProducts.length})
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Category Horizontal Tab List */}
        <div className="menu-category-tabs-container">
          <div className="menu-category-tabs">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  className={`category-pill ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat.id)}
                >
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Catalog Layout: Sidebar Filters + Products Grid */}
      <main className="menu-catalog-layout">
        {/* Desktop Sidebar Filters */}
        <aside className="menu-sidebar-filters">
          <div className="sidebar-inner">
            <div className="sidebar-header-row">
              <h2 className="sidebar-heading">Filter by Price</h2>
              {(activeCategory !== 'all' || searchQuery || maxPrice < 150) && (
                <button className="clear-filters-link" onClick={clearFilters}>
                  Reset All
                </button>
              )}
            </div>

            {/* Price Slider in GH₵ */}
            <div className="filter-group">
              <div className="filter-price-labels">
                <span className="price-min">GH₵ 10</span>
                <span className="price-current-tag">Max: GH₵ {maxPrice}</span>
              </div>
              <input
                type="range"
                min="12"
                max="150"
                step="2"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="gold-range-slider"
              />
              <div className="price-scale-helper">
                <span>Under GH₵30: Quick Drinks</span>
                <span>Under GH₵50: Regular Tubs</span>
              </div>
            </div>

            {/* Quick Benefits Banner */}
            <div className="sidebar-perk-box">
              <div className="perk-row">
                <Flame size={16} className="perk-icon" />
                <div>
                  <div className="perk-title">Hot &amp; Fresh Popped</div>
                  <div className="perk-desc">Popped upon order placement</div>
                </div>
              </div>
              <div className="perk-row">
                <Sparkles size={16} className="perk-icon" />
                <div>
                  <div className="perk-title">Chilled Delivery</div>
                  <div className="perk-desc">Cold drinks packed insulated</div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Products Grid Content Area */}
        <section className="menu-products-section">
          {/* Active summary */}
          <div className="menu-results-bar">
            <span className="results-count">
              Showing <strong>{filteredProducts.length}</strong> items
              {activeCategory !== 'all' && (
                <span className="results-badge">
                  Category: {CATEGORIES.find((c) => c.id === activeCategory)?.label}
                </span>
              )}
            </span>
          </div>

          {isLoading ? (
            <div className="menu-products-grid">
              {[1, 2, 3, 4, 5, 6].map((idx) => (
                <div key={idx} className="catalog-card-skeleton">
                  <div className="skeleton-img skeleton-shimmer" />
                  <div className="skeleton-body">
                    <div className="skeleton-row">
                      <div className="skeleton-line sm skeleton-shimmer" />
                      <div className="skeleton-line sm skeleton-shimmer" style={{ width: '25%' }} />
                    </div>
                    <div className="skeleton-line md skeleton-shimmer" />
                    <div className="skeleton-row" style={{ marginTop: 'auto', paddingTop: '10px' }}>
                      <div className="skeleton-line sm skeleton-shimmer" style={{ width: '35%', height: '18px' }} />
                      <div className="skeleton-line btn skeleton-shimmer" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="menu-empty-state">
              <div className="empty-icon-wrap">
                <ShoppingBag size={38} className="empty-state-svg" />
              </div>
              <h3>No snacks found matching your filter</h3>
              <p>Try clearing your search query or expanding the price range slider.</p>
              <button className="btn-empty-reset" onClick={clearFilters}>
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="menu-products-grid">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={(item) => {
                    if (onAddToCart) onAddToCart(item);
                  }}
                  onQuickView={(item) => setSelectedProduct(item)}
                  onNavigate={onNavigate}
                  onToast={onToast}
                />
              ))}
            </div>
          )}
        </section>
      </main>


      {/* Floating Bottom Bag Notification Bar */}
      {cartCount > 0 && (
        <div className="menu-floating-cart-bar">
          <div className="floating-cart-inner">
            <div className="floating-cart-info">
              <ShoppingBag size={18} />
              <span>
                <strong className={`floating-cart-count ${isCountBumping ? 'bump' : ''}`}>
                  {cartCount}
                </strong>{' '}
                {cartCount === 1 ? 'snack in cart' : 'snacks in cart'}
              </span>
            </div>
            <button
              type="button"
              className="btn-floating-view-bag"
              onClick={() => onNavigate && onNavigate('cart')}
            >
              <span>View Bag &amp; Checkout</span>
              <ArrowLeft size={16} style={{ transform: 'rotate(180deg)' }} />
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer onNavigate={onNavigate} />

      {/* Product Detail Customization Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onNavigate={onNavigate}
          onToast={onToast}
          onAddToCart={(customizedItem) => {
            if (onAddToCart) onAddToCart(customizedItem);
          }}
        />
      )}
    </div>
  );
}

