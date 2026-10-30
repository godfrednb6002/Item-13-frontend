import React, { useState } from 'react';
import { X, Star, ShoppingBag, Check, Plus, Minus, ShieldCheck, Flame } from 'lucide-react';

export default function ProductDetailModal({ product, onClose, onAddToCart }) {
  if (!product) return null;

  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
  const [extraButter, setExtraButter] = useState(false);
  const [quantity, setQuantity] = useState(1);

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
          </div>
        </div>
      </div>
    </div>
  );
}

