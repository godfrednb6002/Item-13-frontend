import React, { useState } from 'react';
import ProductCard from './ProductCard';
import { POPCORN_ITEMS, DRINK_ITEMS } from '../data';
import { Sparkles, SlidersHorizontal, Popcorn, Coffee, Zap } from 'lucide-react';

export default function CatalogSection({
  activeFilter,
  setActiveFilter,
  onAddToCart,
  onQuickView,
}) {
  const [searchQuery, setSearchQuery] = useState('');

  // Combined product list
  const allItems = [...POPCORN_ITEMS, ...DRINK_ITEMS];

  // Filtering logic
  const filteredItems = allItems.filter((item) => {
    const matchesCategory =
      activeFilter === 'all' || item.category === activeFilter;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tagline.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="menu" className="catalog-section">
      {/* Section Header */}
      <div className="section-head-wrap text-center">
        <div className="glass-pill section-chip">
          <Sparkles size={14} className="text-amber" />
          <span>Curated Flavor Library</span>
        </div>
        <h2 className="section-heading">Our Handcrafted Menu</h2>
        <p className="section-subtext">
          Crisp air-popped butterfly & mushroom corn tossed in artisanal seasonings,
          plus micro-crafted sparkling coolers brewed for refreshingly clean sips.
        </p>
      </div>

      {/* Control Bar: Filter Tabs + Search Input */}
      <div className="catalog-filter-bar glass-panel">
        <div className="filter-tabs-group">
          <button
            type="button"
            className={`tab-btn ${activeFilter === 'all' ? 'tab-active' : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            <Zap size={16} />
            <span>All Offerings ({allItems.length})</span>
          </button>
          <button
            type="button"
            className={`tab-btn ${activeFilter === 'popcorn' ? 'tab-active' : ''}`}
            onClick={() => setActiveFilter('popcorn')}
          >
            <Popcorn size={16} />
            <span>Artisan Popcorn ({POPCORN_ITEMS.length})</span>
          </button>
          <button
            type="button"
            className={`tab-btn ${activeFilter === 'drink' ? 'tab-active' : ''}`}
            onClick={() => setActiveFilter('drink')}
          >
            <Coffee size={16} />
            <span>Craft Beverages ({DRINK_ITEMS.length})</span>
          </button>
        </div>

        {/* Quick Search Field */}
        <div className="catalog-search-wrap">
          <input
            type="text"
            className="search-input glass-pill"
            placeholder="Search flavor, e.g. 'Caramel' or 'Yuzu'..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Products Grid */}
      {filteredItems.length > 0 ? (
        <div className="products-grid">
          {filteredItems.map((item) => (
            <ProductCard
              key={item.id}
              item={item}
              onAddToCart={onAddToCart}
              onQuickView={onQuickView}
            />
          ))}
        </div>
      ) : (
        <div className="empty-catalog-state glass-panel">
          <p>No matching snacks or drinks found for "{searchQuery}".</p>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              setSearchQuery('');
              setActiveFilter('all');
            }}
          >
            Clear Filters
          </button>
        </div>
      )}
    </section>
  );
}
