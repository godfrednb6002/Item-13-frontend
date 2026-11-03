import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Star,
  ShoppingBag,
  Check,
  Plus,
  Minus,
  ShieldCheck,
  Truck,
  Sparkles,
  Flame,
  Info,
  Droplet,
  Coffee,
  Share2,
  Heart,
  Milk,
  Nut,
  Wheat,
  Leaf,
  Bean,
  Zap,
  Smartphone,
  CreditCard
} from 'lucide-react';
import {
  PRODUCTS,
  TUB_SIZES,
  BUTTER_DRIZZLE_OPTIONS,
  DRINK_PAIRINGS,
  ALLERGEN_DEFINITIONS,
  CATEGORIES
} from '../features/catalog/productsData';
import { getSavedFavorites, toggleFavorite } from '../features/catalog/favoritesStorage';
import Footer from '../components/Footer';
import ThemeToggle from '../components/ThemeToggle';

const renderAllergenIcon = (iconKey, size = 15) => {
  switch (iconKey) {
    case 'milk':
      return <Milk size={size} />;
    case 'nuts':
      return <Nut size={size} />;
    case 'gluten_free':
      return <Wheat size={size} />;
    case 'vegetarian':
      return <Leaf size={size} />;
    case 'soy':
      return <Bean size={size} />;
    default:
      return <Info size={size} />;
  }
};

export default function ProductDetailPage({
  productId,
  onNavigate,
  onAddToCart,
  cartCount = 0,
  onToast
}) {
  const product = PRODUCTS.find((p) => p.id === productId) || PRODUCTS[0];

  const availableSizes = product.sizes && product.sizes.length > 0 ? product.sizes : TUB_SIZES;
  const isPopcornOrCombo = product.category !== 'drinks';

  // Selection States
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(() => {
    // Default to 'regular' if present
    const regIdx = availableSizes.findIndex((s) => s.id === 'regular');
    return regIdx >= 0 ? regIdx : 0;
  });
  const [selectedButterId, setSelectedButterId] = useState('none');
  const [selectedDrinkId, setSelectedDrinkId] = useState(null); // Optional drink pairing
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('details'); // 'details' | 'allergens' | 'delivery'

  // Pricing calculations
  const currentSize = availableSizes[selectedSizeIndex] || availableSizes[0];
  const sizeOffset = currentSize.priceOffset || 0;

  const butterOption = BUTTER_DRIZZLE_OPTIONS.find((b) => b.id === selectedButterId) || BUTTER_DRIZZLE_OPTIONS[0];
  const butterPrice = isPopcornOrCombo ? butterOption.price : 0;

  const drinkPairing = DRINK_PAIRINGS.find((d) => d.id === selectedDrinkId);
  const drinkPrice = drinkPairing ? drinkPairing.price : 0;

  const baseUnitPrice = product.price + sizeOffset + butterPrice + drinkPrice;
  const totalPrice = baseUnitPrice * quantity;

  const handleAddToCart = () => {
    const itemToAdd = {
      id: `${product.id}-${currentSize.id || currentSize.name}-${selectedButterId}${selectedDrinkId ? '-' + selectedDrinkId : ''}`,
      name: product.name,
      price: baseUnitPrice,
      totalPrice: totalPrice,
      quantity,
      image: product.image,
      selectedSize: currentSize.name,
      butterDrizzle: isPopcornOrCombo && selectedButterId !== 'none' ? butterOption.name : null,
      drinkPairing: drinkPairing ? drinkPairing.name : null,
      variant: [
        currentSize.name,
        isPopcornOrCombo && selectedButterId !== 'none' ? butterOption.name : null,
        drinkPairing ? `+ ${drinkPairing.name}` : null
      ].filter(Boolean).join(' · ')
    };

    if (onAddToCart) onAddToCart(itemToAdd);
    if (onToast) onToast(`Added ${quantity}x "${product.name}" (${currentSize.name}) to your bag!`);
  };

  const [isFav, setIsFav] = useState(() => getSavedFavorites().includes(product.id));

  useEffect(() => {
    setIsFav(getSavedFavorites().includes(product.id));
  }, [product.id]);

  const handleToggleFav = () => {
    const { isFavorite } = toggleFavorite(product.id);
    setIsFav(isFavorite);
    if (onToast) {
      onToast(isFavorite ? `Added "${product.name}" to Customer Favorites!` : `Removed "${product.name}" from favorites`);
    }
  };

  // Related snacks (same category or popular)
  const relatedProducts = PRODUCTS.filter((p) => p.id !== product.id && (p.category === product.category || p.badge)).slice(0, 3);

  return (
    <div className="pdp-page-wrapper">
      {/* Top Sticky Header */}
      <header className="pdp-header">
        <div className="pdp-header-inner">
          <button
            type="button"
            className="pdp-back-button"
            onClick={() => onNavigate && onNavigate('menu')}
          >
            <ArrowLeft size={18} />
            <span>Back to Menu</span>
          </button>

          <div className="pdp-header-brand" onClick={() => onNavigate && onNavigate('home')}>
            <img src="/item13Logo-trimmed.png" alt="Item13 Logo" className="pdp-brand-logo" />
            <span className="brand-logo-tagline">THE UNEXPECTED ESSENTIAL</span>
          </div>

          <div className="pdp-header-actions">
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
          <button onClick={() => onNavigate && onNavigate('home')} className="crumb-link">Home</button>
          <span className="crumb-sep">/</span>
          <button onClick={() => onNavigate && onNavigate('menu')} className="crumb-link">Menu</button>
          <span className="crumb-sep">/</span>
          <span className="crumb-current">{product.name}</span>
        </div>
      </div>

      {/* Main PDP Grid Layout */}
      <main className="pdp-stage">
        <div className="pdp-main-grid">
          {/* Left Column: Product Showcase Visuals */}
          <div className="pdp-visual-column">
            <div className="pdp-main-image-card">
              {product.badge && <span className="pdp-badge-pill">{product.badge}</span>}
              <div className="pdp-actions-overlay">
                <button
                  type="button"
                  className={`pdp-overlay-btn ${isFav ? 'is-favorited' : ''}`}
                  onClick={handleToggleFav}
                  title={isFav ? 'Remove from favorites' : 'Add to Customer Favorites'}
                  aria-label={isFav ? 'Remove from favorites' : 'Add to Customer Favorites'}
                >
                  <Heart size={16} fill={isFav ? 'currentColor' : 'none'} />
                </button>
                <button
                  type="button"
                  className="pdp-overlay-btn pdp-share-btn"
                  onClick={() => {
                    if (navigator.clipboard) {
                      navigator.clipboard.writeText(window.location.href);
                      if (onToast) onToast('Product link copied to clipboard!');
                    }
                  }}
                  title="Share product link"
                  aria-label="Share product link"
                >
                  <Share2 size={16} />
                </button>
              </div>

              <img
                src={product.image}
                alt={product.name}
                className="pdp-hero-image"
                onError={(e) => {
                  e.target.src = product.fallbackImage || '/bistro-popcorn.jpg';
                }}
              />
            </div>

            {/* Quality Perks Strip */}
            <div className="pdp-perks-strip">
              <div className="pdp-perk">
                <Flame size={18} className="perk-gold-icon" />
                <div>
                  <strong>Popped Fresh to Order</strong>
                  <p>Never sitting in plastic bags</p>
                </div>
              </div>
              <div className="pdp-perk">
                <Truck size={18} className="perk-gold-icon" />
                <div>
                  <strong>Fast Delivery in Ghana</strong>
                  <p>Arrives warm &amp; crunchy</p>
                </div>
              </div>
              <div className="pdp-perk">
                <ShieldCheck size={18} className="perk-gold-icon" />
                <div>
                  <strong>Premium Ingredients</strong>
                  <p>100% Non-GMO corn &amp; real butter</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Customizer & Ordering Panel */}
          <div className="pdp-customizer-column">
            {/* Title & Rating */}
            <div className="pdp-intro">
              <div className="pdp-rating-row">
                <div className="pdp-stars">
                  <Star size={15} fill="#f4b627" color="#f4b627" />
                  <span className="pdp-score">{product.rating}</span>
                  <span className="pdp-reviews-count">({product.reviewsCount} customer reviews)</span>
                </div>
                <span className="pdp-category-tag">{product.category.toUpperCase()}</span>
              </div>

              <h1 className="pdp-product-title">{product.name}</h1>
              <p className="pdp-product-desc">{product.description}</p>
            </div>

            {/* 1. TUB SIZE SELECTOR */}
            <section className="pdp-section pdp-size-section">
              <div className="pdp-section-header">
                <label className="pdp-section-title">
                  1. Select Tub Size <span className="pdp-required">*</span>
                </label>
                <span className="pdp-selection-current">{currentSize.name}</span>
              </div>

              <div className="pdp-size-grid">
                {availableSizes.map((s, idx) => {
                  const isSelected = idx === selectedSizeIndex;
                  return (
                    <button
                      key={s.id || s.name}
                      type="button"
                      className={`pdp-size-card ${isSelected ? 'is-selected' : ''}`}
                      onClick={() => setSelectedSizeIndex(idx)}
                    >
                      <div className="size-card-radio">
                        <span className="radio-dot" />
                      </div>
                      <div className="size-card-info">
                        <div className="size-card-name">{s.name}</div>
                        {s.volume && <div className="size-card-volume">{s.volume}</div>}
                      </div>
                      <div className="size-card-price">
                        {s.priceOffset > 0 ? (
                          `+GH₵${s.priceOffset.toFixed(2)}`
                        ) : s.priceOffset < 0 ? (
                          `-GH₵${Math.abs(s.priceOffset).toFixed(2)}`
                        ) : (
                          'Standard'
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* 2. BUTTER DRIZZLE OPTIONS (For popcorn & combos) */}
            {isPopcornOrCombo && (
              <section className="pdp-section pdp-butter-section">
                <div className="pdp-section-header">
                  <label className="pdp-section-title">
                    <Droplet size={15} className="title-inline-icon" />
                    2. Butter Drizzle Options
                  </label>
                  <span className="pdp-selection-current">{butterOption.name}</span>
                </div>

                <div className="pdp-drizzle-grid">
                  {BUTTER_DRIZZLE_OPTIONS.map((opt) => {
                    const isSelected = selectedButterId === opt.id;
                    return (
                      <div
                        key={opt.id}
                        className={`pdp-drizzle-card ${isSelected ? 'is-selected' : ''}`}
                        onClick={() => setSelectedButterId(opt.id)}
                      >
                        <div className="drizzle-card-left">
                          <span className={`pdp-radio-indicator ${isSelected ? 'checked' : ''}`}>
                            {isSelected && <Check size={12} />}
                          </span>
                          <div>
                            <div className="drizzle-name">{opt.name}</div>
                            <div className="drizzle-desc">{opt.desc}</div>
                          </div>
                        </div>
                        <div className="drizzle-price">
                          {opt.price === 0 ? 'Included' : `+GH₵${opt.price.toFixed(2)}`}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* 3. DRINK PAIRINGS SELECTOR */}
            <section className="pdp-section pdp-drink-section">
              <div className="pdp-section-header">
                <label className="pdp-section-title">
                  <Coffee size={15} className="title-inline-icon" />
                  3. Recommended Drink Pairings <span className="pdp-optional">(Optional)</span>
                </label>
                {selectedDrinkId && (
                  <button
                    type="button"
                    className="pdp-clear-pairing-btn"
                    onClick={() => setSelectedDrinkId(null)}
                  >
                    Remove drink
                  </button>
                )}
              </div>

              <div className="pdp-drinks-grid">
                {DRINK_PAIRINGS.map((drink) => {
                  const isSelected = selectedDrinkId === drink.id;
                  return (
                    <div
                      key={drink.id}
                      className={`pdp-drink-card ${isSelected ? 'is-selected' : ''}`}
                      onClick={() => setSelectedDrinkId(isSelected ? null : drink.id)}
                    >
                      <img src={drink.image} alt={drink.name} className="drink-card-thumb" />
                      <div className="drink-card-content">
                        <div className="drink-card-name">{drink.name}</div>
                        <div className="drink-card-size">{drink.size}</div>
                        <div className="drink-card-price">+GH₵{drink.price.toFixed(2)}</div>
                      </div>
                      <div className={`drink-add-tag ${isSelected ? 'added' : ''}`}>
                        {isSelected ? 'Selected' : '+ Add'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* 4. ALLERGEN & INGREDIENT TAGS */}
            {product.allergens && product.allergens.length > 0 && (
              <section className="pdp-section pdp-allergen-section">
                <label className="pdp-section-title">
                  <Info size={15} className="title-inline-icon" />
                  Allergen &amp; Dietary Information
                </label>
                <div className="pdp-allergen-tags-row">
                  {product.allergens.map((key) => {
                    const info = ALLERGEN_DEFINITIONS[key];
                    if (!info) return null;
                    return (
                      <div key={key} className="pdp-allergen-chip" title={info.desc}>
                        <span className="allergen-icon">{renderAllergenIcon(info.iconKey, 14)}</span>
                        <span className="allergen-label">{info.label}</span>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* 5. QUANTITY STEPPER & ADD TO CART CTA */}
            <div className="pdp-order-action-bar">
              <div className="pdp-qty-stepper">
                <button
                  type="button"
                  className="pdp-qty-btn"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  aria-label="Decrease quantity"
                >
                  <Minus size={16} />
                </button>
                <span className="pdp-qty-display">{quantity}</span>
                <button
                  type="button"
                  className="pdp-qty-btn"
                  onClick={() => setQuantity(quantity + 1)}
                  aria-label="Increase quantity"
                >
                  <Plus size={16} />
                </button>
              </div>

              <button
                type="button"
                className="pdp-add-to-cart-cta"
                onClick={handleAddToCart}
              >
                <ShoppingBag size={18} />
                <span>Add to Bag • GH₵{totalPrice.toFixed(2)}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Product Details & Story Tabs */}
        <div className="pdp-info-tabs-block">
          <div className="pdp-tabs-nav">
            <button
              className={`pdp-tab-btn ${activeTab === 'details' ? 'active' : ''}`}
              onClick={() => setActiveTab('details')}
            >
              Description &amp; Origin
            </button>
            <button
              className={`pdp-tab-btn ${activeTab === 'allergens' ? 'active' : ''}`}
              onClick={() => setActiveTab('allergens')}
            >
              Ingredients &amp; Nutrition
            </button>
            <button
              className={`pdp-tab-btn ${activeTab === 'delivery' ? 'active' : ''}`}
              onClick={() => setActiveTab('delivery')}
            >
              Fresh Dispatch Guarantee
            </button>
          </div>

          <div className="pdp-tab-pane">
            {activeTab === 'details' && (
              <div className="tab-pane-content">
                <h3>About {product.name}</h3>
                <p>{product.longDescription || product.description}</p>
                <p>
                  Popped locally in Accra with non-GMO corn kernels. We don't pre-bag our popcorn weeks in advance;
                  each order is popped and seasoned on demand so you enjoy the crunch at peak crispness.
                </p>
              </div>
            )}

            {activeTab === 'allergens' && (
              <div className="tab-pane-content">
                <h3>Nutritional &amp; Allergen Statement</h3>
                <p>
                  Item13 operates dedicated popping batches for sweet, buttery, and spicy savory items.
                  All corn is naturally 100% gluten-free and cholesterol-free before seasonings are added.
                </p>
                <div className="tab-allergen-grid">
                  {product.allergens && product.allergens.map((key) => {
                    const info = ALLERGEN_DEFINITIONS[key];
                    if (!info) return null;
                    return (
                      <div key={key} className="allergen-detail-card">
                        <span className="card-icon">{renderAllergenIcon(info.iconKey, 18)}</span>
                        <div>
                          <strong>{info.label}</strong>
                          <p>{info.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'delivery' && (
              <div className="tab-pane-content">
                <h3>Thermal Insulated Delivery in Accra &amp; Tema</h3>
                <p>
                  Popcorn tubs are packaged in grease-resistant, recyclable thermal kraft buckets that lock in warmth and aromatics.
                  Chilled drinks are packed in separate insulated ice-cooler bags to ensure ice-cold refreshment on arrival.
                </p>
                <ul className="pdp-delivery-list">
                  <li>
                    <Zap size={16} className="text-primary inline-icon" />
                    <span><strong>Express Delivery:</strong> 25-45 minutes across East Legon, Cantonments, Osu, Airport, Dzorwulu &amp; Tema.</span>
                  </li>
                  <li>
                    <Smartphone size={16} className="text-primary inline-icon" />
                    <span><strong>Live Tracking:</strong> WhatsApp live rider tracking sent instantly upon dispatch.</span>
                  </li>
                  <li>
                    <CreditCard size={16} className="text-primary inline-icon" />
                    <span><strong>Secure Payment:</strong> Mobile money (MTN MoMo, Telecel Cash) and Card checkout accepted.</span>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* You May Also Like Shelf */}
        {relatedProducts.length > 0 && (
          <section className="pdp-related-shelf">
            <div className="pdp-related-head">
              <h2>Complete Your Crunch Experience</h2>
              <p>Ghana's favourite popcorn combinations and pairings</p>
            </div>
            <div className="pdp-related-grid">
              {relatedProducts.map((rel) => (
                <div
                  key={rel.id}
                  className="pdp-related-card"
                  onClick={() => onNavigate && onNavigate(`product-${rel.id}`)}
                >
                  <img src={rel.image} alt={rel.name} className="rel-card-img" />
                  <div className="rel-card-info">
                    <span className="rel-card-tag">{rel.category}</span>
                    <h4 className="rel-card-name">{rel.name}</h4>
                    <div className="rel-card-bottom">
                      <span className="rel-card-price">GH₵{rel.price.toFixed(2)}</span>
                      <button
                        type="button"
                        className="rel-card-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigate && onNavigate(`product-${rel.id}`);
                        }}
                      >
                        Customize
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={onNavigate} onToast={onToast} />
    </div>
  );
}

