import React from 'react';
import { X, Star, Plus, CheckCircle, Flame, ShieldAlert, Sparkles } from 'lucide-react';

export default function QuickViewModal({ item, onClose, onAddToCart }) {
  if (!item) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="quick-view-card glass-panel"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="btn-icon modal-close-btn"
          onClick={onClose}
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        <div className="modal-grid">
          <div className="modal-image-col">
            <img
              src={item.image}
              alt={item.name}
              className="modal-product-img"
            />
            <div className="modal-category-badge glass-pill">
              {item.category === 'popcorn' ? '🍿 Gourmet Popcorn' : '🥤 Cold Craft Sip'}
            </div>
          </div>

          <div className="modal-info-col">
            <div className="modal-tag-row">
              <span className="badge-tag badge-amber">{item.flavorBadge}</span>
              <div className="rating-pill">
                <Star size={13} fill="currentColor" className="text-amber" />
                <span>{item.rating}</span>
                <span className="text-muted">({item.reviews} reviews)</span>
              </div>
            </div>

            <h3 className="modal-title">{item.name}</h3>
            <p className="modal-tagline">{item.tagline}</p>
            <p className="modal-description">{item.description}</p>

            {/* Ingredients pill list */}
            {item.ingredients && (
              <div className="ingredients-box">
                <span className="ingredients-label">Key Clean Ingredients:</span>
                <div className="ingredients-list">
                  {item.ingredients.map((ing, i) => (
                    <span key={i} className="ingredient-tag glass-pill">
                      ✓ {ing}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="modal-footer-row">
              <div className="modal-price">
                <span className="price-currency">$</span>
                <span className="price-digit">{item.price.toFixed(2)}</span>
                <span className="modal-cal-note">({item.calories})</span>
              </div>

              <button
                type="button"
                className="btn-primary modal-add-btn"
                onClick={() => {
                  onAddToCart(item);
                  onClose();
                }}
              >
                <Plus size={16} />
                <span>Add to Bag</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
