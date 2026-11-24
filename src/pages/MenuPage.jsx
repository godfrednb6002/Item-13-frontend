import React, { useState, useMemo, useEffect, useRef } from 'react';
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
  History,
  Trash2,
} from 'lucide-react';
import { CATEGORIES, PRODUCTS } from '../features/catalog/productsData';
import ProductCard from '../features/catalog/ProductCard';
import ProductDetailModal from '../features/catalog/ProductDetailModal';
import Footer from '../components/Footer';
import ThemeToggle from '../components/ThemeToggle';

export default function MenuPage({ onNavigate, onAddToCart, cartCount = 0, onToast, isCartOpen = false }) {
  // Loading & Filter States
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      const saved = localStorage.getItem('item13_recent_searches');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const searchWrapperRef = useRef(null);
  const [maxPrice, setMaxPrice] = useState(150);
  const [sortBy, setSortBy] = useState('featured'); // 'featured' | 'price-asc' | 'price-desc' | 'rating'
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [isCountBumping, setIsCountBumping] = useState(false);

  // Dynamic Typewriter Search Placeholder with items from the menu
  const searchPlaceholderOptions = useMemo(() => {
    const names = PRODUCTS.map((p) => p.name);
    // Add popular drink & flavor keywords
    return [
      ...names,
      'Coca-Cola Original',
      'Fiery Suya Popcorn',
      'Shawarma Crunch',
      'Double Butter Drizzle',
      'Golden Caramel Crunch',
      'White Cheddar Popcorn',
      'Fanta Orange Citrus',
    ];
  }, []);

  const [displayedPlaceholder, setDisplayedPlaceholder] = useState('');
  const [optionIndex, setOptionIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    // If the search bar is focused or has a query, pause animation
    if (isSearchFocused || searchQuery) return;

    const currentOption = searchPlaceholderOptions[optionIndex % searchPlaceholderOptions.length];
    const fullText = `Search "${currentOption}"...`;

    let timer;

    if (!isDeleting) {
      if (charIndex < fullText.length) {
        // Typing
        timer = setTimeout(() => {
          setDisplayedPlaceholder(fullText.slice(0, charIndex + 1));
          setCharIndex((prev) => prev + 1);
        }, 65);
      } else {
        // Finished typing word, pause before deleting
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, 1800);
      }
    } else {
      if (charIndex > 8) { // Keep `Search "` prefix while deleting option name
        timer = setTimeout(() => {
          setDisplayedPlaceholder(fullText.slice(0, charIndex - 1));
          setCharIndex((prev) => prev - 1);
        }, 35);
      } else {
        // Finished deleting, move to next item
        setIsDeleting(false);
        setOptionIndex((prev) => (prev + 1) % searchPlaceholderOptions.length);
        setCharIndex(8);
      }
    }

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, optionIndex, searchPlaceholderOptions, isSearchFocused, searchQuery]);

  // Close search suggestions on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(e.target)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const saveSearchQuery = (term) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    setRecentSearches((prev) => {
      const updated = [trimmed, ...prev.filter((t) => t.toLowerCase() !== trimmed.toLowerCase())].slice(0, 5);
      try {
        localStorage.setItem('item13_recent_searches', JSON.stringify(updated));
      } catch {
        // ignore storage errors
      }
      return updated;
    });
  };

  const handleClearRecentSearches = (e) => {
    e.stopPropagation();
    setRecentSearches([]);
    try {
      localStorage.removeItem('item13_recent_searches');
    } catch {
      // ignore
    }
  };

  const handleRemoveSingleSearch = (e, termToRemove) => {
    e.stopPropagation();
    setRecentSearches((prev) => {
      const updated = prev.filter((t) => t !== termToRemove);
      try {
        localStorage.setItem('item13_recent_searches', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

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

      {/* Top Sticky Header & Breadcrumbs Shell */}
      <div className="pdp-top-nav-shell">
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
              <a
                href="/"
                className="pdp-back-button"
                onClick={(e) => {
                  e.preventDefault();
                  if (onNavigate) onNavigate('home');
                }}
                style={{ textDecoration: 'none' }}
                title="Back to Store"
              >
                <ArrowLeft size={18} />
                <span>Back to Store</span>
              </a>

              <ThemeToggle />

              <button
                type="button"
                className="pdp-bag-chip"
                onClick={() => onNavigate && onNavigate('cart')}
                title="Open Bag"
              >
                <ShoppingBag size={17} />
                <span>Bag ({cartCount})</span>
              </button>
            </div>
          </div>
        </header>

        {/* Breadcrumbs Row */}
        <div className="pdp-breadcrumbs-bar">
          <div className="pdp-breadcrumbs-inner">
            <a href="/" onClick={(e) => { e.preventDefault(); onNavigate && onNavigate('home'); }} className="crumb-link" style={{ textDecoration: 'none' }}>Home</a>
            <span className="crumb-sep">/</span>
            <span className="crumb-current">Menu</span>
          </div>
        </div>
      </div>

      {/* Hero Banner for Menu */}
      <section className="menu-hero-banner">
        <div className="menu-hero-content">
          <div className="menu-badge">
            Freshly Made in Ghana
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
          <div className="menu-search-wrapper" ref={searchWrapperRef}>
            <Search size={18} className="search-icon" />
            <input
              type="text"
              className="menu-search-input"
              placeholder={displayedPlaceholder || 'Search menu...'}
              value={searchQuery}
              onFocus={() => setIsSearchFocused(true)}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  saveSearchQuery(searchQuery);
                  setIsSearchFocused(false);
                }
              }}
            />
            {searchQuery && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => setSearchQuery('')}
                aria-label="Clear current search"
                title="Clear current search"
              >
                <X size={15} />
              </button>
            )}

            {/* Suggestions & Recent Searches Pop-Up Dropdown */}
            {isSearchFocused && (
              <div className="menu-search-dropdown">
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div className="search-dropdown-section">
                    <div className="search-dropdown-header">
                      <span><History size={13} className="inline-icon" /> Recent Searches</span>
                      <button
                        type="button"
                        className="search-clear-all-btn"
                        onClick={handleClearRecentSearches}
                      >
                        Clear All
                      </button>
                    </div>
                    <div className="search-tags-row">
                      {recentSearches.map((term) => (
                        <div key={term} className="search-tag-chip">
                          <button
                            type="button"
                            className="search-tag-text"
                            onClick={() => {
                              setSearchQuery(term);
                              setIsSearchFocused(false);
                            }}
                          >
                            {term}
                          </button>
                          <button
                            type="button"
                            className="search-tag-remove"
                            onClick={(e) => handleRemoveSingleSearch(e, term)}
                            aria-label={`Remove ${term}`}
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Popular sample searches (only visible when user is actively searching) */}
                <div className="search-dropdown-section">
                  <div className="search-dropdown-header">
                    <span>Popular Suggestions</span>
                  </div>
                  <div className="search-tags-row">
                    {['Classic Buttered', 'Salted Caramel', 'Fiery Suya', 'Sharwama Crunch', 'Ice Cold Drinks'].map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        className="search-suggestion-pill"
                        onClick={() => {
                          setSearchQuery(suggestion);
                          saveSearchQuery(suggestion);
                          setIsSearchFocused(false);
                        }}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
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
              <strong>Showing {filteredProducts.length} items</strong>
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
      {cartCount > 0 && !isCartOpen && (
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

