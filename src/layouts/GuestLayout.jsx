import React from 'react';
import FloatingBagButton from '../components/FloatingBagButton';
import CartDrawer from '../features/cart/CartDrawer';

/**
 * GuestLayout:
 * Standard wrapper for all guest storefront views (/ routes).
 * Keeps bottom tabs hidden for unauthenticated guests, provides guest cart access.
 */
export default function GuestLayout({
  children,
  onNavigate,
  isCartOpen,
  setIsCartOpen,
  cartItems,
  cartCount,
  addItemToCart,
  updateCartQuantity,
  removeCartItem,
}) {
  return (
    <div className="guest-layout-wrapper min-h-screen flex flex-col">
      <main className="guest-layout-main flex-grow">{children}</main>

      <FloatingBagButton
        cartCount={cartCount}
        onClick={() => setIsCartOpen(true)}
        isCartOpen={isCartOpen}
      />

      {isCartOpen && (
        <CartDrawer
          items={cartItems}
          onClose={() => setIsCartOpen(false)}
          onNavigate={onNavigate}
          onContinueShopping={() => {
            setIsCartOpen(false);
            onNavigate('menu');
          }}
          onCheckout={() => {
            setIsCartOpen(false);
            onNavigate('checkout');
          }}
          onAddItem={addItemToCart}
          onUpdateQuantity={updateCartQuantity}
          onRemoveItem={removeCartItem}
        />
      )}
    </div>
  );
}
