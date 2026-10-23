import React, { useState } from 'react';
import { ShoppingBag, X, Plus, Minus, Trash2, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
}) {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 20 || subtotal === 0 ? 0 : 3.50;
  const total = subtotal + shipping;

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      setOrderComplete(true);
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (err) {
        // Confetti fallback
      }
    }, 1200);
  };

  const handleReset = () => {
    setOrderComplete(false);
    onClearCart();
    onClose();
  };

  return (
    <div className="cart-backdrop" onClick={onClose}>
      <div
        className="cart-drawer glass-panel"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cart Header */}
        <div className="cart-header">
          <div className="cart-title-row">
            <ShoppingBag size={20} className="text-amber" />
            <h2 className="cart-title">Your Flavor Bag</h2>
            <span className="cart-item-count">
              ({cartItems.reduce((acc, it) => acc + it.quantity, 0)} items)
            </span>
          </div>
          <button
            type="button"
            className="btn-icon"
            onClick={onClose}
            aria-label="Close cart"
          >
            <X size={18} />
          </button>
        </div>

        {orderComplete ? (
          /* Order Success Message */
          <div className="cart-success-view">
            <div className="success-icon-wrap">
              <CheckCircle2 size={48} className="text-emerald" />
            </div>
            <h3>Order Received Fresh!</h3>
            <p>
              Your gourmet batch is queued in our copper kettle! Warm crunch and chilled craft drinks are on their way.
            </p>
            <div className="glass-pill success-order-badge">
              <span>Order #POP-{Math.floor(1000 + Math.random() * 9000)}</span>
            </div>
            <button
              type="button"
              className="btn-primary w-full"
              onClick={handleReset}
            >
              Explore More Flavors
            </button>
          </div>
        ) : cartItems.length === 0 ? (
          /* Empty Bag State */
          <div className="cart-empty-view">
            <div className="empty-cart-icon">🍿</div>
            <h3>Your Bag is Empty</h3>
            <p>Ready to indulge? Add freshly popped kernels or icy craft botanicals.</p>
            <button
              type="button"
              className="btn-primary"
              onClick={onClose}
            >
              Browse Offerings
            </button>
          </div>
        ) : (
          /* Cart Items List */
          <>
            <div className="cart-items-scroll">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item glass-pill">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="cart-item-thumb"
                  />
                  <div className="cart-item-details">
                    <h4 className="cart-item-name">{item.name}</h4>
                    <span className="cart-item-unit-price">
                      ${item.price.toFixed(2)} each
                    </span>

                    <div className="cart-item-actions">
                      <div className="qty-counter-control">
                        <button
                          type="button"
                          className="qty-btn"
                          onClick={() => onUpdateQty(item.id, item.quantity - 1)}
                          aria-label="Decrease quantity"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="qty-number">{item.quantity}</span>
                        <button
                          type="button"
                          className="qty-btn"
                          onClick={() => onUpdateQty(item.id, item.quantity + 1)}
                          aria-label="Increase quantity"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <button
                        type="button"
                        className="btn-remove-item"
                        onClick={() => onRemoveItem(item.id)}
                        aria-label="Remove item"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="cart-item-line-total">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            {/* Free Shipping Progress bar */}
            <div className="shipping-progress-box glass-pill">
              <Sparkles size={14} className="text-amber" />
              <span>
                {subtotal >= 20
                  ? '🎉 Qualified for FREE expedited shipping!'
                  : `Add $${(20 - subtotal).toFixed(2)} more for FREE shipping!`}
              </span>
            </div>

            {/* Cart Footer Breakdown */}
            <div className="cart-footer">
              <div className="cart-summary-line">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="cart-summary-line">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="cart-summary-line total-line">
                <span>Total Due</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <button
                type="button"
                className="btn-primary w-full checkout-btn"
                disabled={isCheckingOut}
                onClick={handleCheckout}
              >
                {isCheckingOut ? (
                  <span>Preparing order...</span>
                ) : (
                  <>
                    <span>Proceed to Checkout</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
