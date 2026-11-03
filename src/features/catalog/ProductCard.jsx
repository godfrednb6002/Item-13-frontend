import React, { useState, useEffect } from 'react';
import { Star, ShoppingBag, Eye, Heart } from 'lucide-react';
import { getSavedFavorites, toggleFavorite } from './favoritesStorage';

export default function ProductCard({ product, onAddToCart, onQuickView, onNavigate, onToast }) {
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const [isFav, setIsFav] = useState(() => getSavedFavorites().includes(product.id));

  useEffect(() => {
    const handleFavChange = () => {
      setIsFav(getSavedFavorites().includes(product.id));
    };
    window.addEventListener('item13_favorites_changed', handleFavChange);
    return () => window.removeEventListener('item13_favorites_changed', handleFavChange);
  }, [product.id]);

  const handleToggleFav = (e) => {
    e.stopPropagation();
    const { isFavorite } = toggleFavorite(product.id);
    setIsFav(isFavorite);
    if (onToast) {
      onToast(isFavorite ? `Added "${product.name}" to Customer Favorites!` : `Removed "${product.name}" from favorites`);
    }
  };

  const handleOpenDetail = () => {
    if (onNavigate) {
      onNavigate(`product-${product.id}`);
    } else if (onQuickView) {
      onQuickView(product);
    }
  };

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
          type="button"
          className={`catalog-fav-btn ${isFav ? 'is-favorited' : ''}`}
          onClick={handleToggleFav}
          aria-label={isFav ? 'Remove from favorites' : 'Add to Customer Favorites'}
          title={isFav ? 'Saved in Customer Favorites' : 'Add to Customer Favorites'}
        >
          <Heart size={15} fill={isFav ? 'currentColor' : 'none'} />
        </button>

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
          onClick={handleOpenDetail}
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

