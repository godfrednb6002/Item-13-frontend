import React from 'react';
import { Star, ShoppingBag, Eye } from 'lucide-react';

export default function ProductCard({ product, onAddToCart, onQuickView }) {
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;

  return (
    <div className="catalog-card">
      {/* Thumbnail + Badges */}
      <div className="catalog-card-image-wrapper">
        <img
          src={product.image}
          alt={product.name}
          className="catalog-card-img"
          loading="lazy"
          onError={(e) => {
            if (product.fallbackImage) {
              e.target.src = product.fallbackImage;
            } else {
              e.target.src =
                'https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=600&auto=format&fit=crop&q=80';
            }
          }}
        />

        {product.badge && (
          <span className="catalog-card-badge">{product.badge}</span>
        )}

        {hasDiscount && (
          <span className="catalog-card-discount">
            -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
          </span>
        )}

        <button
          className="catalog-quickview-btn"
          onClick={() => onQuickView && onQuickView(product)}
          aria-label="Quick view product"
          title="Quick preview"
        >
          <Eye size={16} />
        </button>
      </div>

      {/* Body Details */}
      <div className="catalog-card-body">
        <div className="catalog-card-meta">
          <div className="catalog-card-rating">
            <Star size={13} fill="#f4b627" color="#f4b627" />
            <span>{product.rating}</span>
            <span className="rating-count">({product.reviewsCount})</span>
          </div>

          {product.tags && product.tags[0] && (
            <span className="catalog-card-tag">{product.tags[0]}</span>
          )}
        </div>

        <h3
          className="catalog-card-title"
          onClick={() => onQuickView && onQuickView(product)}
        >
          {product.name}
        </h3>

        <p className="catalog-card-desc">{product.description}</p>

        {/* Pricing + Add to Bag */}
        <div className="catalog-card-footer">
          <div className="catalog-price-group">
            <span className="catalog-currency">GH₵</span>
            <span className="catalog-price-val">{product.price.toFixed(2)}</span>
            {hasDiscount && (
              <span className="catalog-price-original">
                GH₵{product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          <button
            className="catalog-add-btn"
            onClick={() => onAddToCart && onAddToCart(product)}
            aria-label={`Add ${product.name} to Bag`}
          >
            <ShoppingBag size={15} />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
}

