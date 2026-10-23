import React from 'react';
import { COMBOS } from '../data';
import { Sparkles, ArrowRight, Check, HeartHandshake } from 'lucide-react';

export default function ComboPairings({ onAddCombo }) {
  const [addedId, setAddedId] = React.useState(null);

  const handleAddCombo = (combo) => {
    onAddCombo(combo);
    setAddedId(combo.id);
    setTimeout(() => setAddedId(null), 1400);
  };

  return (
    <section id="combos" className="combos-section">
      <div className="section-head-wrap text-center">
        <div className="glass-pill section-chip">
          <Sparkles size={14} className="text-purple" />
          <span>Sommelier-Approved Pairings</span>
        </div>
        <h2 className="section-heading">Curated Popcorn & Drink Duos</h2>
        <p className="section-subtext">
          Engineered flavor chemistry. When the crisp salt & crunch of our kettle pop
          meets the fizzy botanical profile of craft sips.
        </p>
      </div>

      <div className="combos-grid">
        {COMBOS.map((combo) => (
          <div key={combo.id} className="combo-card glass-panel">
            <div className="combo-top-bar">
              <span className="badge-tag badge-purple">{combo.badge}</span>
              <span className="combo-savings-tag">{combo.savings}</span>
            </div>

            <h3 className="combo-name">{combo.name}</h3>
            <p className="combo-desc">{combo.description}</p>

            <div className="combo-pairing-visual glass-pill">
              <div className="pairing-item">
                <span className="combo-item-icon">🍿</span>
                <span className="combo-item-title">{combo.popcorn}</span>
              </div>
              <span className="pairing-plus">+</span>
              <div className="pairing-item">
                <span className="combo-item-icon">🥤</span>
                <span className="combo-item-title">{combo.drink}</span>
              </div>
            </div>

            <div className="combo-footer">
              <div className="combo-pricing">
                <span className="combo-original-price">
                  ${combo.originalPrice.toFixed(2)}
                </span>
                <span className="combo-current-price">
                  ${combo.price.toFixed(2)}
                </span>
              </div>

              <button
                type="button"
                className={`btn-primary combo-add-btn ${
                  addedId === combo.id ? 'combo-btn-success' : ''
                }`}
                onClick={() => handleAddCombo(combo)}
              >
                {addedId === combo.id ? (
                  <>
                    <Check size={16} />
                    <span>Added Duo!</span>
                  </>
                ) : (
                  <>
                    <span>Add Duo to Bag</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
