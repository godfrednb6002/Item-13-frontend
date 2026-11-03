import React, { useState, useEffect } from 'react';
import { X, Star, ShoppingBag, Check, Plus, Minus, ShieldCheck, Flame, ExternalLink, Info, Heart } from 'lucide-react';
import { ALLERGEN_DEFINITIONS } from './productsData';
import { getSavedFavorites, toggleFavorite } from './favoritesStorage';

export default function ProductDetailModal({ product, onClose, onAddToCart, onNavigate, onToast }) {
  if (!product) return null;

  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
  const [extraButter, setExtraButter] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isFav, setIsFav] = useState(() => getSavedFavorites().includes(product.id));

  useEffect(() => {
    const handleFavChange = () => {
      setIsFav(getSavedFavorites().includes(product.id));
    };
    window.addEventListener('item13_favorites_changed', handleFavChange);
    return () => window.removeEventListener('item13_favorites_changed', handleFavChange);
  }, [product.id]);

  const handleToggleFav = () => {
    const { isFavorite } = toggleFavorite(product.id);
    setIsFav(isFavorite);
    if (onToast) {
      onToast(isFavorite ? `Added "${product.name}" to Customer Favorites!` : `Removed "${product.name}" from favorites`);
    }
  };

  const sizes = product.sizes || [{ name: 'Standard', priceOffset: 0 }];
  const currentSize = sizes[selectedSizeIndex] || sizes[0];
  const sizeOffset = currentSize.priceOffset || 0;
  const butterCost = extraButter ? 6.0 : 0;
  const unitPrice = product.price + sizeOffset + butterCost;
  const totalPrice = unitPrice * quantity;

  const handleAdd = () => {
    const customizedItem = {
      ...product,
      selectedSize: currentSize.name,
      extraButter,
      quantity,
      finalUnitPrice: unitPrice,
      totalPrice,
    };
    if (onAddToCart) onAddToCart(customizedItem);
    if (onClose) onClose();
  };

  return (
    <div className="pdm-backdrop" onClick={onClose}>
      <div className="pdm-modal" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="pdm-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        <div className="pdm-grid">
          {/* Left Column: Image showcase */}
          <div className="pdm-visual">
            <img
              src={product.image}
              alt={product.name}
              className="pdm-main-image"
              onError={(e) => {
                if (product.fallbackImage) {
                  e.target.src = product.fallbackImage;
                } else {
                  e.target.src =
                    'https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=600&auto=format&fit=crop&q=80';
                }
              }}
            />
            {product.badge && <span className="pdm-badge">{product.badge}</span>}
          </div>

          {/* Right Column: Customization Details */}
          <div className="pdm-info">
            <div className="pdm-rating-row">
              <div className="pdm-stars">
                <Star size={15} fill="#f4b627" color="#f4b627" />
                <span className="pdm-score">{product.rating}</span>
                <span className="pdm-rev-count">({product.reviewsCount} customer reviews)</span>
              </div>
              <span className="pdm-category-pill">{product.category.toUpperCase()}</span>
            </div>

            <h2 className="pdm-title">{product.name}</h2>
            <p className="pdm-description">{product.description}</p>

            {/* Sizes Selection (if available) */}
            {sizes.length > 1 && (
              <div className="pdm-option-group">
                <label className="pdm-option-label">
                  Choose Size <span className="pdm-required">*</span>
                </label>
                <div className="pdm-size-pills">
                  {sizes.map((s, idx) => (
                    <button
                      key={s.name}
                      type="button"
                      className={`pdm-size-pill ${idx === selectedSizeIndex ? 'active' : ''}`}
                      onClick={() => setSelectedSizeIndex(idx)}
                    >
                      <span className="size-name">{s.name}</span>
                      {s.priceOffset > 0 && (
                        <span className="size-offset">+GH₵{s.priceOffset}</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Extra Butter Add-on for Popcorn categories */}
            {product.category !== 'drinks' && (
              <div className="pdm-option-group">
                <label className="pdm-option-label">Gourmet Add-ons</label>
                <div
                  className={`pdm-addon-card ${extraButter ? 'active' : ''}`}
                  onClick={() => setExtraButter(!extraButter)}
                >
                  <div className="pdm-addon-left">
                    <span className="pdm-addon-checkbox">
                      {extraButter && <Check size={14} />}
                    </span>
                    <div>
                      <div className="addon-title">Extra Real Butter Drizzle</div>
                      <div className="addon-sub">Warm golden layer drizzled over kernels</div>
                    </div>
                  </div>
                  <span className="addon-price">+GH₵6.00</span>
                </div>
              </div>
            )}

            {/* Quantity Stepper & Final Add to Bag */}
            <div className="pdm-footer">
              <div className="pdm-qty-picker">
                <button
                  type="button"
                  className="qty-btn"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  aria-label="Decrease quantity"
                >
                  <Minus size={15} />
                </button>
                <span className="qty-value">{quantity}</span>
                <button
                  type="button"
                  className="qty-btn"
                  onClick={() => setQuantity(quantity + 1)}
                  aria-label="Increase quantity"
                >
                  <Plus size={15} />
                </button>
              </div>

              <button
                type="button"
                className="pdm-submit-btn"
                onClick={handleAdd}
              >
                <ShoppingBag size={18} />
                <span>Add to Bag • GH₵{totalPrice.toFixed(2)}</span>
              </button>
            </div>

            <div className="pdm-trust-line">
              <ShieldCheck size={15} />
              <span>Popped fresh on order • Fast delivery across Accra & Tema</span>
            </div>

            {/* Favorite button directly above View Full Product Page button */}
            <div className="pdm-modal-actions-group">
              <button
                type="button"
                className={`pdm-fav-toggle-btn ${isFav ? 'is-favorited' : ''}`}
                onClick={handleToggleFav}
                aria-label={isFav ? 'Remove from favorites' : 'Add to Customer Favorites'}
                title={isFav ? 'Saved in Customer Favorites' : 'Add to Customer Favorites'}
              >
                <Heart size={15} fill={isFav ? 'currentColor' : 'none'} />
                <span>{isFav ? 'Saved to Favorites' : 'Add to Favorites'}</span>
              </button>

              {/* View Full Product Page Link */}
              {onNavigate && (
                <button
                  type="button"
                  className="pdm-full-view-btn"
                  onClick={() => {
                    if (onClose) onClose();
                    onNavigate(`product-${product.id}`);
                  }}
                >
                  <span>View Full Product Page</span>
                  <ExternalLink size={14} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

