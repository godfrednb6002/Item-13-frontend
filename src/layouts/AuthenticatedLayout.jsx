import React from 'react';
import FloatingBagButton from '../components/FloatingBagButton';
import CartDrawer from '../features/cart/CartDrawer';
import MobileBottomTabs from '../components/MobileBottomTabs';

/**
 * AuthenticatedLayout:
 * Standard wrapper for all customer storefront views (/a/* routes).
 * Displays customer navigation and bottom tabs, links directly to /a/ paths.
 */
export default function AuthenticatedLayout({
  children,
  user,
  setUser,
  currentPage,
  onNavigate,
  isCartOpen,
  setIsCartOpen,
  cartItems,
  cartCount,
  addItemToCart,
  updateCartQuantity,
  removeCartItem,
  showToast,
}) {
  return (
    <div className="authenticated-layout-wrapper min-h-screen flex flex-col">
      <main className="authenticated-layout-main flex-grow">{children}</main>

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

      <MobileBottomTabs
        currentPage={currentPage}
        onNavigate={onNavigate}
        onOpenCart={() => setIsCartOpen(true)}
        isCartOpen={isCartOpen}
        onCloseCart={() => setIsCartOpen(false)}
        cartCount={cartCount}
        user={user}
        setUser={setUser}
        showToast={showToast}
      />
    </div>
  );
}
