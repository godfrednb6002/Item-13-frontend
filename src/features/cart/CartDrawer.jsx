import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  Check,
  ChevronDown,
  LockKeyhole,
  Minus,
  Plus,
  ShieldCheck,
  Trash2,
  X,
} from 'lucide-react';

const FREE_SHIPPING_THRESHOLD = 80;
const DELIVERY_FEE = 8;
const TAX_RATE = 0.15;

const formatPrice = (amount) =>
  `GH₵${amount.toLocaleString('en-GH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

function getDeliveryDate() {
  const date = new Date();
  date.setDate(date.getDate() + 2);
  return date.toLocaleDateString('en-GH', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

export default function CartDrawer({
  items,
  onClose,
  onContinueShopping,
  onCheckout,
  onAddItem,
  onUpdateQuantity,
  onRemoveItem,
}) {
  const [deliveryMethod, setDeliveryMethod] = useState('delivery');
  const [giftMessageOpen, setGiftMessageOpen] = useState(false);
  const [giftMessage, setGiftMessage] = useState('');
  const [cartNote, setCartNote] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [promoError, setPromoError] = useState('');

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );
  const shipping = deliveryMethod === 'pickup'
    ? 0
    : subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0
      ? 0
      : DELIVERY_FEE;
  const discount = discountApplied ? subtotal * 0.1 : 0;
  const taxableAmount = Math.max(0, subtotal - discount);
  const tax = taxableAmount * TAX_RATE;
  const total = taxableAmount + shipping + tax;
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const upsellInCart = items.some((item) => item.id === 'coca-cola');

  const applyPromo = (event) => {
    event.preventDefault();
    if (promoCode.trim().toUpperCase() === 'ITEM13') {
      setDiscountApplied(true);
      setPromoError('');
      return;
    }

    setDiscountApplied(false);
    setPromoError('That code didn’t work. Try ITEM13.');
  };

  return (
    <div
      className="cart-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <aside
        className="cart-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
      >
        <header className="cart-header">
          <div>
            <p className="cart-eyebrow">ITEM13 · YOUR ORDER</p>
            <h2 id="cart-title">Your bag <span>({items.reduce((sum, item) => sum + item.quantity, 0)})</span></h2>
          </div>
          <button className="cart-icon-button" type="button" onClick={onClose} aria-label="Close bag">
            <X size={21} />
          </button>
        </header>

        <div className="cart-content">
          {items.length > 0 ? (
            <>
              <section className="cart-shipping-progress" aria-live="polite">
                <p>
                  {remainingForFreeShipping > 0
                    ? <>You’re <strong>{formatPrice(remainingForFreeShipping)}</strong> away from free delivery</>
                    : <><Check size={16} /> You’ve unlocked free delivery!</>}
                </p>
                <div
                  className="cart-progress-track"
                  role="progressbar"
                  aria-label="Free delivery progress"
                  aria-valuemin="0"
                  aria-valuemax={FREE_SHIPPING_THRESHOLD}
                  aria-valuenow={Math.min(subtotal, FREE_SHIPPING_THRESHOLD)}
                >
                  <span style={{ width: `${progress}%` }} />
                </div>
              </section>

              <section className="cart-items" aria-label="Items in your bag">
                {items.map((item) => (
                  <article className="cart-item" key={item.id}>
                    <div className="cart-item-image-wrap">
                      <img src={item.image} alt="" className="cart-item-image" />
                    </div>
                    <div className="cart-item-details">
                      <div className="cart-item-heading">
                        <div>
                          <h3>{item.name}</h3>
                          <p className="cart-item-variant">{item.variant}</p>
                        </div>
                        <button
                          className="cart-remove-button"
                          type="button"
                          onClick={() => onRemoveItem(item.id)}
                          aria-label={`Remove ${item.name}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <p className="cart-stock"><span /> In stock · {item.stock} available</p>
                      <div className="cart-item-bottom">
                        <div className="cart-quantity" aria-label={`Quantity for ${item.name}`}>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            aria-label={`Decrease ${item.name} quantity`}
                          >
                            <Minus size={15} />
                          </button>
                          <span aria-live="polite">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.stock}
                            aria-label={`Increase ${item.name} quantity`}
                          >
                            <Plus size={15} />
                          </button>
                        </div>
                        <div className="cart-item-prices">
                          <span>{formatPrice(item.price)} each</span>
                          <strong>{formatPrice(item.price * item.quantity)}</strong>
                        </div>
                      </div>
                      {item.quantity >= item.stock && (
                        <p className="cart-stock-limit">You’ve added all available stock.</p>
                      )}
                    </div>
                  </article>
                ))}
              </section>

              <section className="cart-fulfillment">
                <h3>How would you like it?</h3>
                <div className="cart-fulfillment-options">
                  <button
                    type="button"
                    className={deliveryMethod === 'delivery' ? 'is-selected' : ''}
                    onClick={() => setDeliveryMethod('delivery')}
                  >
                    <span className="cart-radio" />
                    <span><strong>Delivery</strong><small>Est. {getDeliveryDate()}</small></span>
                    <b>{shipping === 0 ? 'Free' : formatPrice(DELIVERY_FEE)}</b>
                  </button>
                  <button
                    type="button"
                    className={deliveryMethod === 'pickup' ? 'is-selected' : ''}
                    onClick={() => setDeliveryMethod('pickup')}
                  >
                    <span className="cart-radio" />
                    <span><strong>Pickup</strong><small>Choose a location at checkout</small></span>
                    <b>Free</b>
                  </button>
                </div>
              </section>

              {!upsellInCart && (
                <section className="cart-upsell">
                  <img src="/coca-cola.jpg" alt="" />
                  <div>
                    <span className="cart-upsell-label">GOES GREAT WITH</span>
                    <strong>Ice-cold Coca-Cola</strong>
                    <span>{formatPrice(7.9)}</span>
                  </div>
                  <button type="button" onClick={() => onAddItem('coca-cola')} aria-label="Add Coca-Cola">
                    <Plus size={16} /> Add
                  </button>
                </section>
              )}

              <section className="cart-extras">
                <button
                  type="button"
                  className="cart-disclosure"
                  aria-expanded={giftMessageOpen}
                  onClick={() => setGiftMessageOpen((open) => !open)}
                >
                  <span>Add a gift message <small>(optional)</small></span>
                  <ChevronDown size={17} className={giftMessageOpen ? 'is-open' : ''} />
                </button>
                {giftMessageOpen && (
                  <label className="cart-field-label">
                    Your message
                    <textarea
                      value={giftMessage}
                      maxLength={180}
                      onChange={(event) => setGiftMessage(event.target.value)}
                      placeholder="Write a little something special…"
                      rows={2}
                    />
                    <small>{giftMessage.length}/180 characters</small>
                  </label>
                )}
                <label className="cart-field-label cart-note-label">
                  Order note <span>(optional)</span>
                  <input
                    value={cartNote}
                    onChange={(event) => setCartNote(event.target.value)}
                    maxLength={180}
                    placeholder="Anything we should know?"
                  />
                </label>
              </section>

              <form className="cart-promo-form" onSubmit={applyPromo}>
                <label htmlFor="cart-promo-code">Discount code</label>
                <div>
                  <input
                    id="cart-promo-code"
                    value={promoCode}
                    onChange={(event) => setPromoCode(event.target.value)}
                    placeholder="Enter code"
                    aria-describedby={promoError ? 'cart-promo-error' : undefined}
                  />
                  <button type="submit">{discountApplied ? 'Applied' : 'Apply'}</button>
                </div>
                {promoError && <p id="cart-promo-error" role="alert">{promoError}</p>}
                {discountApplied && <p className="cart-promo-success"><Check size={14} /> ITEM13 applied — 10% off.</p>}
              </form>

              <section className="cart-totals" aria-label="Order totals">
                <div><span>Subtotal</span><strong>{formatPrice(subtotal)}</strong></div>
                {discount > 0 && <div className="cart-discount-row"><span>Discount (ITEM13)</span><strong>−{formatPrice(discount)}</strong></div>}
                <div><span>Delivery</span><strong>{shipping === 0 ? 'Free' : formatPrice(shipping)}</strong></div>
                <div><span>Estimated tax</span><strong>{formatPrice(tax)}</strong></div>
                <div className="cart-grand-total"><span>Total</span><strong>{formatPrice(total)}</strong></div>
                <p>Tax is estimated; final delivery details and charges are confirmed at checkout.</p>
              </section>

              <div className="cart-trust">
                <p><ShieldCheck size={17} /> Secure checkout <span>·</span> SSL encrypted</p>
                <p><LockKeyhole size={15} /> Visa · Mastercard · Mobile Money</p>
                <small>Easy returns within 14 days. Your snacks are packed fresh and ready to enjoy.</small>
              </div>
            </>
          ) : (
            <div className="cart-empty">
              <div className="cart-empty-icon"><span>13</span></div>
              <h3>Your bag’s taking a breather</h3>
              <p>Freshly popped favourites are just a click away.</p>
              <button type="button" className="cart-empty-cta" onClick={onContinueShopping}>
                Explore the menu <ArrowRight size={17} />
              </button>
            </div>
          )}
        </div>

        {items.length > 0 && (
          <footer className="cart-footer">
            <button type="button" className="cart-checkout-button" onClick={() => onCheckout({ giftMessage, cartNote, deliveryMethod })}>
              <span>Continue to checkout</span>
              <strong>{formatPrice(total)}</strong>
              <ArrowRight size={18} />
            </button>
            <button type="button" className="cart-continue-link" onClick={onContinueShopping}>
              Continue shopping
            </button>
          </footer>
        )}
      </aside>
    </div>
  );
}
