import React from 'react';
import { Star, Plus, Check, Info } from 'lucide-react';

export default function ProductCard({ item, onAddToCart, onQuickView }) {
  const [added, setAdded] = React.useState(false);

  const handleAdd = (e) => {
    e.stopPropagation();
    onAddToCart(item);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  const getBadgeClass = (color) => {
    switch (color) {
      case 'amber':
        return 'badge-amber';
      case 'purple':
        return 'badge-purple';
      case 'emerald':
        return 'badge-emerald';
      case 'rose':
        return 'badge-rose';
      default:
        return 'badge-amber';
    }
  };

  return (
    <article className="glass-card product-card">
      {/* Product Image Media Container */}
      <div className="product-media-container" onClick={() => onQuickView(item)}>
        <img
          src={item.image}
          alt={item.name}
          className="product-image"
          loading="lazy"
        />
        <div className="media-overlay-gradient" />

        {/* Top Floating Badge */}
        <div className="media-badges-bar">
          <span className={`badge-tag ${getBadgeClass(item.badgeColor)}`}>
            {item.flavorBadge}
          </span>
          <span className="calorie-chip glass-pill">{item.calories}</span>
        </div>

        {/* Quick View Button on Hover */}
        <button
          type="button"
          className="btn-quickview glass-pill"
          aria-label={`View details of ${item.name}`}
          onClick={(e) => {
            e.stopPropagation();
            onQuickView(item);
          }}
        >
          <Info size={14} /> Quick View
        </button>
      </div>

      {/* Product Content Details */}
      <div className="product-info-wrap">
        <div className="product-rating-row">
          <div className="stars-cluster">
            <Star size={14} className="star-filled" fill="currentColor" />
            <span className="rating-value">{item.rating}</span>
            <span className="rating-count">({item.reviews})</span>
          </div>
          <span className="category-indicator">
            {item.category === 'popcorn' ? '🍿 Popcorn' : '🥤 Drink'}
          </span>
        </div>

        <h3 className="product-name" onClick={() => onQuickView(item)}>
          {item.name}
        </h3>
        <p className="product-tagline">{item.tagline}</p>

        {/* Tags */}
        <div className="product-tags-cluster">
          {item.tags.map((tag, idx) => (
            <span key={idx} className="mini-tag">
              {tag}
            </span>
          ))}
        </div>

        {/* Footer: Pricing & Action Button */}
        <div className="product-footer-row">
          <div className="product-price">
            <span className="price-currency">$</span>
            <span className="price-digit">{item.price.toFixed(2)}</span>
          </div>

          <button
            type="button"
            className={`btn-add-cart ${added ? 'btn-added' : ''}`}
            onClick={handleAdd}
            aria-label={`Add ${item.name} to cart`}
          >
            {added ? (
              <>
                <Check size={16} />
                <span>Added!</span>
              </>
            ) : (
              <>
                <Plus size={16} />
                <span>Add to Bag</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
