import React, { useState, useMemo } from 'react';
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

export default function MenuPage({ onNavigate, onAddToCart, cartCount = 0 }) {
  // Filter States
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [maxPrice, setMaxPrice] = useState(150);
  const [sortBy, setSortBy] = useState('featured'); // 'featured' | 'price-asc' | 'price-desc' | 'rating'
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

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
          <button
            className="menu-brand-logo"
            onClick={() => onNavigate && onNavigate('home')}
            title="Back to Item13 Home"
          >
            <img
              src="/item13Logo-trimmed.png"
              alt="Item13 Logo"
              className="brand-logo-img"
            />
            <span className="brand-logo-tagline">THE UNEXPECTED ESSENTIAL</span>
          </button>

          <div className="menu-header-actions">
            <button
              className="menu-nav-home-btn"
              onClick={() => onNavigate && onNavigate('home')}
            >
              <ArrowLeft size={16} />
              <span>Back to Store</span>
            </button>

            {cartCount > 0 && (
              <div
                className="menu-bag-pill"
                onClick={() => onNavigate && onNavigate('cart')}
              >
                <ShoppingBag size={16} />
                <span>Bag: {cartCount}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Banner for Menu */}
      <section className="menu-hero-banner">
        <div className="menu-hero-content">
          <div className="menu-badge">
            <Sparkles size={14} /> Freshly Popped in Ghana
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
            >
              <option value="featured">Featured / Popular</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

          {/* Mobile Filter Toggle */}
          <button
            className="mobile-filter-trigger"
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
          >
            <SlidersHorizontal size={16} />
            <span>Filters</span>
          </button>
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
        <aside className={`menu-sidebar-filters ${mobileFilterOpen ? 'mobile-open' : ''}`}>
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

            {mobileFilterOpen && (
              <button
                className="mobile-apply-btn"
                onClick={() => setMobileFilterOpen(false)}
              >
                Apply Filters ({filteredProducts.length} items)
              </button>
            )}
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

          {filteredProducts.length === 0 ? (
            <div className="menu-empty-state">
              <div className="empty-icon-wrap">🍿</div>
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
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Product Detail Customization Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={(customizedItem) => {
            if (onAddToCart) onAddToCart(customizedItem);
          }}
        />
      )}
    </div>
  );
}

