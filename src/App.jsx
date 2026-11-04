import React, { useEffect, useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { ShoppingBag, ChevronRight, Search, X, Check, Star, Heart, Zap, ArrowRight, Trash2, Bell, Menu, User, LayoutDashboard, UtensilsCrossed, Package, LogOut } from 'lucide-react';
import AuthPage from './pages/AuthPage';
import ProfilePage from './pages/ProfilePage';
import WelcomePage from './pages/WelcomePage';
import MenuPage from './pages/MenuPage';
import Footer from './components/Footer';
import ThemeToggle from './components/ThemeToggle';
import CheckoutPage from './pages/CheckoutPage';
import CartDrawer from './features/cart/CartDrawer';
import ProductDetailPage from './pages/ProductDetailPage';
import DeliveryPage from './pages/DeliveryPage';
import AboutEventsPage from './pages/AboutEventsPage';
import ContactPage from './pages/ContactPage';
import { PRODUCTS } from './features/catalog/productsData';
import { getSavedFavorites, toggleFavorite } from './features/catalog/favoritesStorage';
import MomoPaymentPage from './pages/MomoPaymentPage';
import OrderTrackingPage, { mockOrder } from './pages/OrderTrackingPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import SavedAddressesPage from './pages/SavedAddressesPage';

export default function App() {
  const getInitialPage = () => {
    const path = window.location.pathname;
    if (path.startsWith('/checkout/confirmation')) return 'order-confirmation';
    if (path.startsWith('/checkout')) return 'checkout';
    if (path.startsWith('/payment')) return 'payment';
    if (path.startsWith('/orders/')) return 'order-tracking';
    if (path === '/account/orders') return 'account-orders';
    if (path === '/account/addresses') return 'account-addresses';
    if (path.startsWith('/cart') || path.startsWith('/bag')) return 'cart';
    if (path.startsWith('/dashboard/profile/') || path.startsWith('/profile/')) {
      const section = path.replace('/dashboard/profile/', '').replace('/profile/', '');
      return 'welcome-profile-' + section;
    }
    if (path.startsWith('/dashboard/')) {
      const sub = path.replace('/dashboard/', '');
      return 'welcome-' + sub;
    }
    if (path === '/dashboard' || path.startsWith('/welcome')) return 'welcome';
    if (path.startsWith('/delivery')) return 'delivery';
    if (path.startsWith('/about')) return 'about';
    if (path.startsWith('/events')) return 'events';
    if (path.startsWith('/contact')) return 'contact';
    if (path.startsWith('/login')) return 'login';
    if (path.startsWith('/signup')) return 'signup';
    if (path.startsWith('/account/favorites') || path.startsWith('/favorites')) return 'favorites';
    if (path.startsWith('/profile') || path.startsWith('/account')) return 'profile';
    if (path === '/products' || path === '/products/' || path.startsWith('/menu')) return 'menu';
    if (path.startsWith('/products/')) {
      const id = path.replace('/products/', '');
      return 'product-' + id;
    }
    return 'home';
  };

  const [currentPage, setCurrentPage] = useState(getInitialPage);
  const [trackedOrderId, setTrackedOrderId] = useState(
    window.location.pathname.startsWith('/orders/')
      ? decodeURIComponent(window.location.pathname.split('/')[2] || mockOrder.id)
      : mockOrder.id,
  );
  const [user, setUser] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [activeModal, setActiveModal] = useState(null); // 'signin' | 'login' | 'guest' | 'item' | 'favorites'
  const [cartItems, setCartItems] = useState([]);
  const [momoCheckout, setMomoCheckout] = useState(null);
  const cartCount = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [orderConfirmation, setOrderConfirmation] = useState(null);
  const [modalFavorites, setModalFavorites] = useState(getSavedFavorites);
  const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const navMenuRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navMenuRef.current && !navMenuRef.current.contains(e.target)) {
        setIsNavMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    if (isNavMenuOpen || showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isNavMenuOpen, showNotifications]);

  useEffect(() => {
    const handleFavChange = () => {
      setModalFavorites(getSavedFavorites());
    };
    window.addEventListener('item13_favorites_changed', handleFavChange);
    return () => window.removeEventListener('item13_favorites_changed', handleFavChange);
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path.startsWith('/checkout/confirmation')) {
        setCurrentPage('order-confirmation');
      } else if (path.startsWith('/checkout')) {
        setCurrentPage('checkout');
      } else if (path.startsWith('/payment')) {
        setCurrentPage('payment');
      } else if (path.startsWith('/orders/')) {
        setCurrentPage('order-tracking');
        setTrackedOrderId(decodeURIComponent(path.split('/')[2] || mockOrder.id));
      } else if (path === '/account/orders') {
        setCurrentPage('account-orders');
      } else if (path === '/account/addresses') {
        setCurrentPage('account-addresses');
      } else if (path.startsWith('/cart') || path.startsWith('/bag')) {
        setCurrentPage('cart');
        setIsCartOpen(true);
      } else if (path.startsWith('/dashboard/profile/') || path.startsWith('/profile/')) {
        const section = path.replace('/dashboard/profile/', '').replace('/profile/', '');
        setCurrentPage('welcome-profile-' + section);
      } else if (path.startsWith('/dashboard/')) {
        const sub = path.replace('/dashboard/', '');
        setCurrentPage('welcome-' + sub);
      } else if (path === '/dashboard' || path.startsWith('/welcome')) {
        setCurrentPage('welcome');
      } else if (path.startsWith('/delivery')) {
        setCurrentPage('delivery');
      } else if (path.startsWith('/about')) {
        setCurrentPage('about');
      } else if (path.startsWith('/events')) {
        setCurrentPage('events');
      } else if (path.startsWith('/contact')) {
        setCurrentPage('contact');
      } else if (path.startsWith('/login')) {
        setCurrentPage('login');
      } else if (path.startsWith('/signup')) {
        setCurrentPage('signup');
      } else if (path.startsWith('/account/favorites') || path.startsWith('/favorites')) {
        setCurrentPage('favorites');
      } else if (path.startsWith('/profile') || path.startsWith('/account')) {
        setCurrentPage('profile');
      } else if (path === '/products' || path === '/products/' || path.startsWith('/menu')) {
        setCurrentPage('menu');
      } else if (path.startsWith('/products/')) {
        const id = path.replace('/products/', '');
        setCurrentPage('product-' + id);
      } else {
        setCurrentPage('home');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (page) => {
    let nextPath = '/';
    if (page === 'cart' || page === 'bag') {
      setIsCartOpen(true);
      return;
    }
    if (page === 'checkout') {
      nextPath = '/checkout';
      setOrderConfirmation(null);
    }
    else if (page === 'order-confirmation') nextPath = '/checkout/confirmation';
    else if (page === 'payment') nextPath = '/payment';
    else if (page === 'account-orders') nextPath = '/account/orders';
    else if (page === 'account-addresses') nextPath = '/account/addresses';
    else if (page === 'delivery') nextPath = '/delivery';
    else if (page === 'about') nextPath = '/about';
    else if (page === 'events') nextPath = '/events';
    else if (page === 'contact') nextPath = '/contact';
    else if (page === 'login') nextPath = '/login';
    else if (page === 'signup') nextPath = '/signup';
    else if (page === 'dashboard' || page === 'welcome') nextPath = '/dashboard';
    else if (page.startsWith('dashboard/profile/')) nextPath = '/' + page;
    else if (page.startsWith('dashboard/')) nextPath = '/' + page;
    else if (page.startsWith('welcome-profile-')) nextPath = '/dashboard/profile/' + page.replace('welcome-profile-', '');
    else if (page.startsWith('welcome-')) nextPath = '/dashboard/' + page.replace('welcome-', '');
    else if (page === 'favorites') nextPath = '/account/favorites';
    else if (page === 'profile') nextPath = '/profile';
    else if (page === 'menu' || page === 'products') nextPath = '/products';
    else if (page.startsWith('product-')) {
      const prodId = page.replace('product-', '');
      nextPath = '/products/' + prodId;
    } else if (page === 'home') nextPath = '/';
    if (window.location.pathname !== nextPath) {
      window.history.pushState({}, '', nextPath);
    }
    
    if (page.startsWith('dashboard/')) {
      const sub = page.replace('dashboard/', '');
      setCurrentPage(`welcome-${sub}`);
    } else {
      setCurrentPage(page === 'dashboard' ? 'welcome' : (page === 'products' ? 'menu' : page));
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (currentPage === 'order-tracking') {
    const confirmedValues = orderConfirmation?.checkoutValues?.values;
    const confirmedOrder = orderConfirmation && trackedOrderId === orderConfirmation.orderNumber
      ? {
          ...mockOrder,
          id: orderConfirmation.orderNumber,
          customer: {
            ...orderConfirmation.customer,
            phone: orderConfirmation.customer.phone || mockOrder.customer.phone,
          },
          orderDate: new Date().toLocaleString('en-GH', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
          }),
          expectedDelivery: orderConfirmation.deliveryEstimate,
          status: 'Processing',
          carrier: 'Item13 delivery',
          trackingNumber: 'Tracking updates available after dispatch',
          items: orderConfirmation.items,
          subtotal: orderConfirmation.subtotal,
          shipping: orderConfirmation.shipping,
          discount: orderConfirmation.discount,
          promoCode: confirmedValues?.promoCode || '—',
          tax: orderConfirmation.tax,
          total: orderConfirmation.total,
          paymentMethod: confirmedValues?.cardNumber
            ? `Visa ending in ${confirmedValues.cardNumber.replace(/\D/g, '').slice(-4)}`
            : orderConfirmation.paymentMethod === 'mobile-money'
              ? 'Mobile Money'
              : orderConfirmation.paymentMethod,
          shippingAddress: orderConfirmation.address.split(', '),
          billingAddress: confirmedValues?.billingAddress
            ? [
                orderConfirmation.customer.name,
                confirmedValues.billingAddress,
                confirmedValues.billingCity,
                confirmedValues.billingRegion,
              ].filter(Boolean)
            : orderConfirmation.address.split(', '),
          shippingLog: [
            {
              time: new Date().toLocaleTimeString('en-GH', { hour: 'numeric', minute: '2-digit' }),
              date: new Date().toLocaleDateString('en-GH', { month: 'short', day: 'numeric' }),
              location: 'Item13',
              detail: 'Order placed and confirmed',
              complete: true,
            },
          ],
        }
      : { ...mockOrder, id: trackedOrderId };

    return (
      <OrderTrackingPage
        order={confirmedOrder}
        onBack={() => {
          window.history.pushState({}, '', '/');
          setCurrentPage('home');
        }}
      />
    );
  }

  if (currentPage === 'payment') {
    return (
      <MomoPaymentPage
        checkoutOrder={momoCheckout}
        onBack={() => navigateTo(momoCheckout ? 'checkout' : 'home')}
      />
    );
  }

  const addItemToCart = (productId) => {
    const products = {
      'classic-combo': {
        id: 'classic-combo',
        name: 'Classic Popcorn & Drink Combo',
        image: '/WhatsApp Image 2026-10-29 at 4.31.43 PM-Photoroom.png',
        price: 45,
        variant: 'Buttered popcorn · Cola + Fanta',
        stock: 8,
      },
      'bistro-popcorn': {
        id: 'bistro-popcorn',
        name: 'Bistro Popcorn',
        image: '/bistro-popcorn.jpg',
        price: 12.9,
        variant: 'Freshly popped · Classic',
        stock: 12,
      },
      'coca-cola': {
        id: 'coca-cola',
        name: 'Coca-Cola',
        image: '/coca-cola.jpg',
        price: 7.9,
        variant: 'Chilled · 330 ml',
        stock: 20,
      },
    };
    const product = products[productId];
    if (!product) return;

    setCartItems((currentItems) => {
      const existing = currentItems.find((item) => item.id === productId);
      if (existing) {
        return currentItems.map((item) =>
          item.id === productId
            ? { ...item, quantity: Math.min(item.stock, item.quantity + 1) }
            : item,
        );
      }
      return [...currentItems, { ...product, quantity: 1 }];
    });
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const handleBuyNow = (e) => {
    // Confetti celebration burst
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 60,
      spread: 70,
      origin: { x, y },
      colors: ['#F4B627', '#ffffff', '#FF5722', '#222222']
    });

    addItemToCart('classic-combo');
    showToast("Added 'Classic Popcorn & Drink Combo' to your bag! (GH₵ 45.00)");
  };

  const handleAddMiniItem = (name, price) => {
    const productId = name === 'Bistro Popcorn' ? 'bistro-popcorn' : 'coca-cola';
    addItemToCart(productId);
    showToast(`Added '${name}' to your bag! (${price})`);
  };

  const handleAddDirectItem = (item) => {
    const addedQty = item.quantity || 1;
    const itemPrice = item.totalPrice || item.price || 35;
    const sizeLabel = item.selectedSize ? ' (' + item.selectedSize + ')' : '';
    setCartItems((prev) => {
      const existing = prev.find((p) => p.id === item.id);
      if (existing) {
        return prev.map((p) => p.id === item.id ? { ...p, quantity: p.quantity + addedQty } : p);
      }
      return [...prev, {
        id: item.id || ('prod-' + Date.now()),
        name: item.name + sizeLabel,
        price: itemPrice,
        quantity: addedQty,
        image: item.image || '/bistro-popcorn.jpg',
        variant: item.category || 'Popcorn Snack',
        stock: 20
      }];
    });
    showToast('Added \'' + item.name + sizeLabel + '\' to your bag! (GH₵ ' + itemPrice.toFixed(2) + ')');
  };

  if (currentPage === 'account-orders') {
    const addOrderToCart = (order) => {
      setCartItems((currentItems) => {
        const nextItems = [...currentItems];
        order.items.forEach((item) => {
          const existingIndex = nextItems.findIndex((cartItem) => cartItem.id === item.id);
          if (existingIndex >= 0) {
            const existing = nextItems[existingIndex];
            nextItems[existingIndex] = {
              ...existing,
              quantity: Math.min(existing.stock || 20, existing.quantity + item.quantity),
            };
          } else {
            nextItems.push({ ...item, stock: 20 });
          }
        });
        return nextItems;
      });
    };

    return (
      <OrderHistoryPage
        onBack={() => navigateTo('home')}
        onViewOrder={(orderId) => {
          setTrackedOrderId(orderId);
          setCurrentPage('order-tracking');
          window.history.pushState({}, '', '/orders/' + encodeURIComponent(orderId));
        }}
        onReorder={addOrderToCart}
        onViewCart={() => {
          navigateTo('home');
          setIsCartOpen(true);
        }}
        onCheckout={() => navigateTo('checkout')}
        onExplore={() => navigateTo('menu')}
      />
    );
  }

  if (currentPage === 'account-addresses') {
    return <SavedAddressesPage onBack={() => navigateTo('profile')} />;
  }

  if (currentPage === 'checkout' || currentPage === 'order-confirmation') {
    return (
      <CheckoutPage
        items={cartItems}
        customer={user}
        initialValues={momoCheckout?.checkoutValues}
        confirmation={orderConfirmation}
        onNavigate={navigateTo}
        onBack={() => {
          setOrderConfirmation(null);
          navigateTo('menu');
        }}
        onViewCheckout={() => {
          setOrderConfirmation(null);
          navigateTo('checkout');
        }}
        onTrackOrder={() => {
          const orderId = orderConfirmation?.orderNumber || mockOrder.id;
          setTrackedOrderId(orderId);
          setCurrentPage('order-tracking');
          window.history.pushState({}, '', `/orders/${encodeURIComponent(orderId)}`);
        }}
        onUpdateQuantity={(productId, quantity) => {
          setCartItems((items) => items.map((item) =>
            item.id === productId
              ? { ...item, quantity: Math.max(1, Math.min(item.stock, quantity)) }
              : item,
          ));
        }}
        onPlaceOrder={(order) => {
          setOrderConfirmation({
            ...order,
            orderNumber: `I13-${Date.now().toString().slice(-8)}`,
          });
          setCartItems([]);
          setCurrentPage('order-confirmation');
          window.history.pushState({}, '', '/checkout/confirmation');
        }}
        onMomoPayment={(order) => {
          setMomoCheckout(order);
          navigateTo('payment');
        }}
      />
    );
  }

  if (currentPage === 'login' || currentPage === 'signup') {
    return (
      <>
        {toastMessage && (
          <div className="toast-notice">
            <Check size={18} color="var(--gold)" />
            <span>{toastMessage}</span>
          </div>
        )}
        <AuthPage
          initialMode={currentPage === 'signup' ? 'signup' : 'login'}
          onNavigate={navigateTo}
          onAuthSuccess={(userData) => {
            setUser(userData);
            navigateTo('dashboard');
            showToast(`Welcome, ${userData.name || userData.email.split('@')[0]}!`);
          }}
        />
      </>
    );
  }

    if (currentPage === 'welcome' || currentPage === 'favorites' || currentPage.startsWith('welcome-')) {
    const welcomeInitialTab = currentPage.startsWith('welcome-')
      ? currentPage.replace('welcome-', '')
      : (currentPage === 'favorites' ? 'favorites' : 'dashboard');

    return (
      <>
        {toastMessage && (
          <div className="toast-notice">
            <Check size={18} color="var(--gold)" />
            <span>{toastMessage}</span>
          </div>
        )}
        <WelcomePage
          user={user}
          cartCount={cartCount}
          cartItems={cartItems}
          initialTab={welcomeInitialTab}
          onNavigate={navigateTo}
          onToast={showToast}
          onAddToCart={handleAddDirectItem}
          onUpdateCartQuantity={(productId, quantity) => {
            setCartItems((items) => items.map((item) =>
              item.id === productId
                ? { ...item, quantity: Math.max(1, Math.min(item.stock, quantity)) }
                : item,
            ));
          }}
          onRemoveCartItem={(productId) => {
            setCartItems((items) => items.filter((item) => item.id !== productId));
          }}
          onPlaceOrder={(order) => {
            setOrderConfirmation({
              ...order,
              orderNumber: `I13-${Date.now().toString().slice(-8)}`,
            });
            setCartItems([]);
            setCurrentPage('order-confirmation');
            window.history.pushState({}, '', '/checkout/confirmation');
          }}
          onSignOut={() => {
            setUser(null);
            navigateTo('home');
            showToast('Signed out of Item13.');
          }}
        />
        {isCartOpen && (
          <CartDrawer
            items={cartItems}
            onClose={() => setIsCartOpen(false)}
            onNavigate={navigateTo}
            onContinueShopping={() => {
              setIsCartOpen(false);
              navigateTo('menu');
            }}
            onCheckout={() => {
              setIsCartOpen(false);
              navigateTo('checkout');
            }}
            onAddItem={addItemToCart}
            onUpdateQuantity={(productId, quantity) => {
              setCartItems((items) => items.map((item) =>
                item.id === productId
                  ? { ...item, quantity: Math.max(1, Math.min(item.stock, quantity)) }
                  : item,
              ));
            }}
            onRemoveItem={(productId) => {
              setCartItems((items) => items.filter((item) => item.id !== productId));
            }}
          />
        )}
      </>
    );
  }

    if (currentPage === 'menu') {
    return (
      <>
        {toastMessage && (
          <div className="toast-notice">
            <Check size={18} color="var(--gold)" />
            <span>{toastMessage}</span>
          </div>
        )}
        <MenuPage
          onNavigate={navigateTo}
          cartCount={cartCount}
          onToast={showToast}
          onAddToCart={handleAddDirectItem}
        />
        {isCartOpen && (
          <CartDrawer
            items={cartItems}
            onClose={() => setIsCartOpen(false)}
            onNavigate={navigateTo}
            onContinueShopping={() => {
              setIsCartOpen(false);
              navigateTo('menu');
            }}
            onCheckout={() => {
              setIsCartOpen(false);
              navigateTo('checkout');
            }}
            onAddItem={addItemToCart}
            onUpdateQuantity={(productId, quantity) => {
              setCartItems((items) => items.map((item) =>
                item.id === productId
                  ? { ...item, quantity: Math.max(1, Math.min(item.stock, quantity)) }
                  : item,
              ));
            }}
            onRemoveItem={(productId) => {
              setCartItems((items) => items.filter((item) => item.id !== productId));
            }}
          />
        )}
      </>
    );
  }

  if (currentPage.startsWith('product-')) {
    const prodId = currentPage.replace('product-', '');
    return (
      <>
        {toastMessage && (
          <div className="toast-notice">
            <Check size={18} color="var(--gold)" />
            <span>{toastMessage}</span>
          </div>
        )}
        <ProductDetailPage
          productId={prodId}
          onNavigate={navigateTo}
          cartCount={cartCount}
          onToast={showToast}
          onAddToCart={(item) => {
            const addedQty = item.quantity || 1;
            const itemPrice = item.totalPrice || item.price || 35;
            setCartItems((prev) => {
              const existing = prev.find((p) => p.id === item.id);
              if (existing) {
                return prev.map((p) => p.id === item.id ? { ...p, quantity: p.quantity + addedQty } : p);
              }
              return [...prev, {
                id: item.id || ('prod-' + Date.now()),
                name: item.name + (item.selectedSize ? ` (${item.selectedSize})` : ''),
                price: item.price || (itemPrice / addedQty),
                quantity: addedQty,
                image: item.image || '/bistro-popcorn.jpg',
                variant: item.variant || item.category || 'Popcorn Snack',
                stock: 20
              }];
            });
            showToast(`Added ${addedQty}x '${item.name}' to your bag!`);
          }}
        />
        {isCartOpen && (
          <CartDrawer
            items={cartItems}
            onClose={() => setIsCartOpen(false)}
            onNavigate={navigateTo}
            onContinueShopping={() => {
              setIsCartOpen(false);
              navigateTo('menu');
            }}
            onCheckout={() => {
              setIsCartOpen(false);
              navigateTo('checkout');
            }}
            onAddItem={addItemToCart}
            onUpdateQuantity={(productId, quantity) => {
              setCartItems((items) => items.map((item) =>
                item.id === productId
                  ? { ...item, quantity: Math.max(1, Math.min(item.stock, quantity)) }
                  : item,
              ));
            }}
            onRemoveItem={(productId) => {
              setCartItems((items) => items.filter((item) => item.id !== productId));
            }}
          />
        )}
      </>
    );
  }

  if (currentPage === 'delivery') {
    return (
      <>
        {toastMessage && (
          <div className="toast-notice">
            <Check size={18} color="var(--gold)" />
            <span>{toastMessage}</span>
          </div>
        )}
        <DeliveryPage
          onNavigate={navigateTo}
          onToast={showToast}
          cartCount={cartCount}
        />
        {isCartOpen && (
          <CartDrawer
            items={cartItems}
            onClose={() => setIsCartOpen(false)}
            onNavigate={navigateTo}
            onContinueShopping={() => {
              setIsCartOpen(false);
              navigateTo('menu');
            }}
            onCheckout={() => {
              setIsCartOpen(false);
              navigateTo('checkout');
            }}
            onAddItem={addItemToCart}
            onUpdateQuantity={(productId, quantity) => {
              setCartItems((items) => items.map((item) =>
                item.id === productId
                  ? { ...item, quantity: Math.max(1, Math.min(item.stock, quantity)) }
                  : item,
              ));
            }}
            onRemoveItem={(productId) => {
              setCartItems((items) => items.filter((item) => item.id !== productId));
            }}
          />
        )}
      </>
    );
  }

  if (currentPage === 'about' || currentPage === 'events') {
    return (
      <>
        {toastMessage && (
          <div className="toast-notice">
            <Check size={18} color="var(--gold)" />
            <span>{toastMessage}</span>
          </div>
        )}
        <AboutEventsPage
          initialTab={currentPage === 'events' ? 'events' : 'about'}
          onNavigate={navigateTo}
          onToast={showToast}
        />
        {isCartOpen && (
          <CartDrawer
            items={cartItems}
            onClose={() => setIsCartOpen(false)}
            onNavigate={navigateTo}
            onContinueShopping={() => {
              setIsCartOpen(false);
              navigateTo('menu');
            }}
            onCheckout={() => {
              setIsCartOpen(false);
              navigateTo('checkout');
            }}
            onAddItem={addItemToCart}
            onUpdateQuantity={(productId, quantity) => {
              setCartItems((items) => items.map((item) =>
                item.id === productId
                  ? { ...item, quantity: Math.max(1, Math.min(item.stock, quantity)) }
                  : item,
              ));
            }}
            onRemoveItem={(productId) => {
              setCartItems((items) => items.filter((item) => item.id !== productId));
            }}
          />
        )}
      </>
    );
  }

  if (currentPage === 'contact') {
    return (
      <>
        {toastMessage && (
          <div className="toast-notice">
            <Check size={18} color="var(--gold)" />
            <span>{toastMessage}</span>
          </div>
        )}
        <ContactPage
          onNavigate={navigateTo}
          onToast={showToast}
        />
        {isCartOpen && (
          <CartDrawer
            items={cartItems}
            onClose={() => setIsCartOpen(false)}
            onNavigate={navigateTo}
            onContinueShopping={() => {
              setIsCartOpen(false);
              navigateTo('menu');
            }}
            onCheckout={() => {
              setIsCartOpen(false);
              navigateTo('checkout');
            }}
            onAddItem={addItemToCart}
            onUpdateQuantity={(productId, quantity) => {
              setCartItems((items) => items.map((item) =>
                item.id === productId
                  ? { ...item, quantity: Math.max(1, Math.min(item.stock, quantity)) }
                  : item,
              ));
            }}
            onRemoveItem={(productId) => {
              setCartItems((items) => items.filter((item) => item.id !== productId));
            }}
          />
        )}
      </>
    );
  }

  if (currentPage === 'profile') {
    return (
      <>
        {toastMessage && (
          <div className="toast-notice">
            <Check size={18} color="var(--gold)" />
            <span>{toastMessage}</span>
          </div>
        )}
        <ProfilePage
          user={user}
          onNavigate={navigateTo}
          onToast={showToast}
          onAddToCart={handleAddDirectItem}
          initialSection="overview"
          onSignOut={() => {
            setUser(null);
            navigateTo('home');
            showToast('Signed out of Item13.');
          }}
        />
      </>
    );
  }

  return (
    <div className="page-container">
      {/* Background Graphic Elements */}
      <div className="diagonal-bg">
        <svg className="diagonal-svg-canvas" viewBox="0 0 1440 900" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="fastfood-doodles" width="220" height="220" patternUnits="userSpaceOnUse">
              {/* Burger doodle */}
              <g stroke="#6b4c05" strokeWidth="1.5" fill="none" opacity="0.45" transform="translate(20, 20)">
                <path d="M 10 25 Q 35 5 60 25 Z" />
                <path d="M 8 28 L 62 28" strokeLinecap="round" />
                <path d="M 6 34 Q 16 38 26 34 Q 36 38 46 34 Q 56 38 64 34" />
                <rect x="8" y="38" width="54" height="6" rx="3" />
                <path d="M 10 48 Q 35 56 60 48" />
              </g>

              {/* Soda Bottle / Cup doodle */}
              <g stroke="#6b4c05" strokeWidth="1.5" fill="none" opacity="0.45" transform="translate(130, 40)">
                <line x1="25" y1="5" x2="35" y2="0" strokeLinecap="round" />
                <path d="M 15 10 L 45 10 L 40 55 L 20 55 Z" />
                <line x1="16" y1="22" x2="44" y2="22" />
                <line x1="18" y1="36" x2="42" y2="36" />
              </g>

              {/* Fries doodle */}
              <g stroke="#6b4c05" strokeWidth="1.5" fill="none" opacity="0.45" transform="translate(40, 130)">
                <path d="M 10 25 L 14 55 L 42 55 L 46 25 Z" />
                <line x1="16" y1="24" x2="18" y2="10" strokeLinecap="round" />
                <line x1="24" y1="24" x2="26" y2="6" strokeLinecap="round" />
                <line x1="32" y1="24" x2="31" y2="8" strokeLinecap="round" />
                <line x1="40" y1="24" x2="38" y2="12" strokeLinecap="round" />
              </g>

              {/* Popcorn doodle */}
              <g stroke="#6b4c05" strokeWidth="1.5" fill="none" opacity="0.45" transform="translate(140, 140)">
                <circle cx="15" cy="15" r="7" />
                <circle cx="24" cy="12" r="6" />
                <circle cx="21" cy="22" r="7" />
                <circle cx="12" cy="23" r="6" />
              </g>
            </pattern>

            <linearGradient id="yellowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbc63b" />
              <stop offset="60%" stopColor="#f4b627" />
              <stop offset="100%" stopColor="#e8a514" />
            </linearGradient>

            <clipPath id="yellowCurveClip">
              {/* Starts right in front of Sign in button (~X:1120 in 1440 width), sweeps down-left across hero, and rounds smoothly at the bottom-left corner with an organic curve */}
              <path d="M 1120 0 
                       L 1440 0 
                       L 1440 900 
                       L 650 900 
                       C 580 900, 520 860, 520 780 
                       C 520 700, 570 640, 640 570 
                       L 1120 0 Z" />
            </clipPath>
          </defs>

          {/* Yellow curved background shape */}
          <path
            d="M 1120 0 
               L 1440 0 
               L 1440 900 
               L 650 900 
               C 580 900, 520 860, 520 780 
               C 520 700, 570 640, 640 570 
               L 1120 0 Z"
            fill="url(#yellowGradient)"
          />

          {/* Line art doodle overlay within the curved yellow shape */}
          <g clipPath="url(#yellowCurveClip)">
            <rect width="1440" height="900" fill="url(#fastfood-doodles)" className="doodle-overlay-rect" />
          </g>
        </svg>
      </div>

      {/* Top Navigation */}
      <header className="navbar">
        <a href="/" className="brand-logo" onClick={(e) => { e.preventDefault(); navigateTo('home'); }}>
          <img
            src="/item13Logo-trimmed.png"
            alt="Item13 Logo"
            className="brand-logo-img"
          />
          <span className="brand-logo-tagline">THE UNEXPECTED ESSENTIAL</span>
        </a>

        <div className="nav-right">
          <div className="nav-links">
            <a href="#why" className="nav-link" onClick={(e) => { e.preventDefault(); showToast("Item13 uses premium ingredients and delivers freshly popped popcorn across Ghana."); }}>
              Why Item13?
            </a>
            <a href="/products" className="nav-link" onClick={(e) => { e.preventDefault(); navigateTo('menu'); }}>
              Menu
            </a>
            <a href="/delivery" className="nav-link" onClick={(e) => { e.preventDefault(); navigateTo('delivery'); }}>
              Delivery Coverage
            </a>
            <a href="/about" className="nav-link" onClick={(e) => { e.preventDefault(); navigateTo('about'); }}>
              About
            </a>
            <a href="/events" className="nav-link on-yellow" onClick={(e) => { e.preventDefault(); navigateTo('events'); }}>
              Party &amp; Weddings
            </a>
            <a href="/contact" className="nav-link" onClick={(e) => { e.preventDefault(); navigateTo('contact'); }}>
              Contact
            </a>
          </div>

          <div className="nav-buttons-group">
            {/* Top row: Theme, Notifications, and Hamburger Menu */}
            <div className="nav-tools-row">
              {/* Theme Toggle Button */}
              <ThemeToggle className="nav-theme-toggle" />

              {/* Cart / Bag Button */}
              <button
                type="button"
                className={`nav-icon-btn ${isCartOpen ? 'is-active' : ''}`}
                onClick={() => setIsCartOpen(true)}
                aria-label={`Open Bag (${cartCount} items)`}
                title="Open Bag / Cart"
              >
                <ShoppingBag size={18} />
                {cartCount > 0 && <span className="nav-badge-dot" />}
              </button>

              {/* Notification Button */}
              <div ref={notifRef} style={{ position: 'relative' }}>
                <button
                  type="button"
                  className={`nav-icon-btn ${showNotifications ? 'is-active' : ''}`}
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                    setIsNavMenuOpen(false);
                  }}
                  aria-label="Notifications"
                  title="Notifications"
                >
                  <Bell size={18} />
                  <span className="nav-badge-dot" />
                </button>

                {/* Notifications Popover */}
                {showNotifications && (
                  <div className="nav-notifications-popover">
                    <div className="nav-notif-title">
                      <span>Notifications</span>
                      <span style={{ fontSize: '11px', color: 'var(--gold)', fontWeight: 600 }}>1 New</span>
                    </div>
                    <p className="nav-notif-empty">
                      🎉 Welcome to Item13! Fresh batches of Gourmet Popcorn are popping now.
                    </p>
                  </div>
                )}
              </div>

              {/* Hamburger Button that expands to modal menu */}
              <div ref={navMenuRef} style={{ position: 'relative' }}>
                <button
                  type="button"
                  className={`nav-icon-btn ${isNavMenuOpen ? 'is-active' : ''}`}
                  onClick={() => {
                    setIsNavMenuOpen(!isNavMenuOpen);
                    setShowNotifications(false);
                  }}
                  aria-label={isNavMenuOpen ? 'Close Menu' : 'Open Navigation Menu'}
                  title={isNavMenuOpen ? 'Close Menu' : 'Account & Navigation Menu'}
                >
                  {isNavMenuOpen ? <X size={18} /> : <Menu size={18} />}
                </button>

                {/* Hamburger Modal Popover */}
                {isNavMenuOpen && (
                  <div className="nav-menu-popover">
                    {user ? (
                      <div className="nav-menu-header">
                        <span className="nav-menu-user-name">{user.name || user.email.split('@')[0]}</span>
                        <span className="nav-menu-user-role">VIP Snack Member</span>
                      </div>
                    ) : (
                      <div className="nav-menu-header">
                        <span className="nav-menu-user-name">Guest Snack Lover</span>
                        <span className="nav-menu-user-role">Item13 Express</span>
                      </div>
                    )}

                    <a
                      href="/dashboard/profile"
                      className="nav-menu-item"
                      onClick={(e) => {
                        e.preventDefault();
                        setIsNavMenuOpen(false);
                        navigateTo('dashboard/profile');
                      }}
                    >
                      <User size={16} />
                      <span>Profile</span>
                    </a>

                    <a
                      href="/dashboard"
                      className="nav-menu-item"
                      onClick={(e) => {
                        e.preventDefault();
                        setIsNavMenuOpen(false);
                        navigateTo('dashboard');
                      }}
                    >
                      <LayoutDashboard size={16} />
                      <span>Dashboard</span>
                    </a>

                    <a
                      href="/products"
                      className="nav-menu-item"
                      onClick={(e) => {
                        e.preventDefault();
                        setIsNavMenuOpen(false);
                        navigateTo('menu');
                      }}
                    >
                      <UtensilsCrossed size={16} />
                      <span>Menu</span>
                    </a>

                    <button
                      type="button"
                      className="nav-menu-item"
                      onClick={() => {
                        setIsNavMenuOpen(false);
                        setIsCartOpen(true);
                      }}
                    >
                      <ShoppingBag size={16} />
                      <span>My Bag / Cart ({cartCount})</span>
                    </button>

                    <a
                      href="/dashboard/orders"
                      className="nav-menu-item"
                      onClick={(e) => {
                        e.preventDefault();
                        setIsNavMenuOpen(false);
                        navigateTo('dashboard/orders');
                      }}
                    >
                      <Package size={16} />
                      <span>Track Orders</span>
                    </a>

                    {user ? (
                      <button
                        type="button"
                        className="nav-menu-item nav-menu-item-logout"
                        onClick={() => {
                          setIsNavMenuOpen(false);
                          setUser(null);
                          showToast('Signed out of Item13.');
                        }}
                      >
                        <LogOut size={16} />
                        <span>Logout</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="nav-menu-item nav-menu-item-logout"
                        style={{ color: 'var(--gold)', borderColor: 'rgba(244, 182, 39, 0.2)' }}
                        onClick={() => {
                          setIsNavMenuOpen(false);
                          navigateTo('login');
                        }}
                      >
                        <User size={16} />
                        <span>Sign in / Sign up</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Bottom row: Sign up, Login and Continue as guest aligned underneath */}
            {!user ? (
              <div className="nav-guest-actions">
                <div className="nav-buttons-row">
                  <a
                    href="/signup"
                    className="btn-pill btn-pill-yellow"
                    onClick={(e) => {
                      e.preventDefault();
                      navigateTo('signup');
                    }}
                    style={{ textDecoration: 'none' }}
                  >
                    Sign up
                  </a>
                  <a
                    href="/login"
                    className="btn-pill btn-pill-black"
                    onClick={(e) => {
                      e.preventDefault();
                      navigateTo('login');
                    }}
                    style={{ textDecoration: 'none' }}
                  >
                    Login
                  </a>
                </div>
                <a
                  href="/products"
                  className="btn-pill btn-pill-outline"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo('menu');
                  }}
                  style={{ textDecoration: 'none', textAlign: 'center' }}
                >
                  Continue as guest
                </a>
              </div>
            ) : null}
          </div>
        </div>
      </header>

      {/* Main Hero Content */}
      <main className="hero-content">
        {/* Left Side (Black Matte Background) */}
        <section className="hero-left">
          {/* Subtle curved line accent */}
          <svg className="decorative-wave" viewBox="0 0 40 16" fill="none">
            <path d="M 2 8 Q 10 0 18 8 T 34 8" stroke="#f4b627" strokeWidth="2.5" strokeLinecap="round" />
          </svg>

          <p className="hero-subtitle-top">
            Ghana's favourite popcorn, freshly popped and delivered straight to your doorstep.
          </p>

          <h1 className="hero-title">
            Classic Popcorn <br />
            <span className="title-accent">& Drinks</span>
          </h1>

          <p className="hero-desc">
            Item13’s signature buttered popcorn paired with ice-cold drinks — a taste you won’t find anywhere else. Order now and we’ll deliver across Ghana.
          </p>

          {/* Pricing & CTA */}
          <div className="hero-action-row">
            <div className="price-container">
              <span className="price-original">GHS14.99</span>
              <span className="price-current">GHS12.90</span>
            </div>

            <button className="btn-buy-now" onClick={handleBuyNow} id="buy-now-btn">
              <span className="bag-icon-badge">
                <ShoppingBag size={15} />
              </span>
              <span>Buy Now</span>
            </button>
          </div>

          {/* Customer Favorites in Bottom Left Corner */}
          <a
            href="/account/favorites"
            className="customer-favorites"
            onClick={(e) => {
              e.preventDefault();
              setActiveModal('favorites');
            }}
            style={{ cursor: 'pointer', textDecoration: 'none' }}
          >
            <div className="avatar-stack-ring">
              <div className="avatar-group">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                  alt="Customer avatar 1"
                  className="avatar avatar-1"
                />
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                  alt="Customer avatar 2"
                  className="avatar avatar-2"
                />
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"
                  alt="Customer avatar 3"
                  className="avatar avatar-3"
                />
              </div>
            </div>

            <div className="favorites-text">
              <span className="favorites-title">Customer Favorites</span>
              <span className="favorites-link">
                See top rated dishes <ChevronRight size={14} />
              </span>
            </div>
          </a>
        </section>

        {/* Right Side (Yellow Background) */}
        <section className="hero-right">
          {/* Main Hero Visual: Popcorn bowl + Fanta + Coca Cola */}
          <div className="hero-product-showcase">
            <img
              src="/WhatsApp Image 2026-10-29 at 4.31.43 PM-Photoroom.png"
              alt="Classic Popcorn and Soda Duo featuring buttered popcorn, Fanta orange soda, and Coca-Cola"
              className="hero-main-img"
              id="hero-duo-image"
            />
          </div>

          {/* Dashboard Widget: New Menu Items / Latest Additions */}
          <div className="menu-widget">
            <div className="widget-header">
              <span className="widget-title">New Menu Items</span>
              <a
                href="/products"
                className="widget-subtitle"
                onClick={(e) => { e.preventDefault(); navigateTo('menu'); }}
                style={{ cursor: 'pointer', textDecoration: 'none' }}
              >
                Latest Additions
              </a>
            </div>

            <div className="widget-cards-grid">
              {/* Product 1: Bistro Popcorn */}
              <a
                href="/products/pop-classic-butter"
                className="product-mini-card"
                onClick={(e) => {
                  e.preventDefault();
                  handleAddMiniItem("Bistro Popcorn", "GHS12.90");
                }}
                title="Click to add Bistro Popcorn"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <img
                  src="/bistro-popcorn.jpg"
                  alt="Bistro Popcorn"
                  className="mini-card-thumb"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=120&auto=format&fit=crop&q=80";
                  }}
                />
                <div className="mini-card-info">
                  <span className="mini-card-name">Bistro Popcorn</span>
                  <span className="mini-card-price">GHS12.90</span>
                </div>
              </a>

              {/* Product 2: Coca-Cola */}
              <a
                href="/products/drink-coca-cola"
                className="product-mini-card"
                onClick={(e) => {
                  e.preventDefault();
                  handleAddMiniItem("Coca-Cola", "GHS7.90");
                }}
                title="Click to add Coca-Cola"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <img
                  src="/coca-cola.jpg"
                  alt="Coca-Cola"
                  className="mini-card-thumb"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=120&auto=format&fit=crop&q=80";
                  }}
                />
                <div className="mini-card-info">
                  <span className="mini-card-name">Coca-Cola</span>
                  <span className="mini-card-price">GHS7.90</span>
                </div>
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Global Footer */}
      <Footer onNavigate={(page) => setCurrentPage(page)} onToast={showToast} />

      {isCartOpen && (
        <CartDrawer
          items={cartItems}
          onClose={() => setIsCartOpen(false)}
          onNavigate={navigateTo}
          onContinueShopping={() => {
            setIsCartOpen(false);
            navigateTo('menu');
          }}
          onCheckout={() => {
            setIsCartOpen(false);
            navigateTo('checkout');
          }}
          onAddItem={addItemToCart}
          onUpdateQuantity={(productId, quantity) => {
            setCartItems((items) => items.map((item) =>
              item.id === productId
                ? { ...item, quantity: Math.max(1, Math.min(item.stock, quantity)) }
                : item,
            ));
          }}
          onRemoveItem={(productId) => {
            setCartItems((items) => items.filter((item) => item.id !== productId));
          }}
        />
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-notice">
          <Check size={18} color="var(--gold)" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Interactive Modals */}
      {activeModal && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setActiveModal(null)}>
              <X size={18} />
            </button>

            {activeModal === 'signin' && (
              <div>
                <h3 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--gold)', marginBottom: '8px' }}>
                  Sign in to Item13
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '20px' }}>
                  Access member-only snack bundles, exclusive discounts, and order tracking.
                </p>
                <input
                  type="email"
                  placeholder="Enter your email"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    background: '#0e0f12',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: '#fff',
                    marginBottom: '14px',
                    outline: 'none'
                  }}
                />
                <button
                  className="btn-pill btn-pill-yellow"
                  style={{ width: '100%', padding: '14px' }}
                  onClick={() => {
                    setActiveModal(null);
                    showToast("Welcome back to Item13!");
                  }}
                >
                  Continue with Email
                </button>
              </div>
            )}

            {activeModal === 'login' && (
              <div>
                <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#fff', marginBottom: '8px' }}>
                  Quick Login
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '20px' }}>
                  Enter your credentials to manage your snacks and orders.
                </p>
                <input
                  type="text"
                  placeholder="Username or Phone"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    background: '#0e0f12',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: '#fff',
                    marginBottom: '14px',
                    outline: 'none'
                  }}
                />
                <button
                  className="btn-pill btn-pill-black"
                  style={{ width: '100%', padding: '14px', border: '1px solid var(--gold)' }}
                  onClick={() => {
                    setActiveModal(null);
                    showToast("Logged in successfully!");
                  }}
                >
                  Login
                </button>
              </div>
            )}

            {activeModal === 'favorites' && (
              <div className="favorites-modal-content">
                <div className="fav-modal-header">
                  <div>
                    <h3 className="fav-modal-title">
                      Customer Favorites
                    </h3>
                    <p className="fav-modal-sub">
                      Fast 1-click re-order snack wishlist
                    </p>
                  </div>
                  <a
                    href="/account/favorites"
                    className="modal-goto-full-btn"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveModal(null);
                      navigateTo('favorites');
                    }}
                  >
                    <span>View All</span>
                    <ArrowRight size={13} />
                  </a>
                </div>

                <div className="fav-modal-list">
                  {PRODUCTS.filter((p) => modalFavorites.includes(p.id)).slice(0, 5).map((item) => (
                    <div
                      key={item.id}
                      className="fav-modal-item-row"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="fav-modal-item-thumb"
                        onError={(e) => { e.target.src = '/bistro-popcorn.jpg'; }}
                      />
                      <a
                        href={`/products/${item.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          setActiveModal(null);
                          navigateTo(`product-${item.id}`);
                        }}
                        className="fav-modal-item-link"
                      >
                        <div className="fav-modal-item-name">
                          {item.name}
                        </div>
                        <div className="fav-modal-item-meta">
                          GH₵ {item.price.toFixed(2)} • {item.category}
                        </div>
                      </a>
                      <button
                        className="btn-1click-reorder"
                        onClick={() => {
                          handleAddDirectItem(item);
                          setActiveModal(null);
                        }}
                      >
                        <Zap size={13} />
                        <span>Re-order</span>
                      </button>
                    </div>
                  ))}
                </div>

                <div className="fav-modal-footer">
                  <a
                    href="/account/favorites"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveModal(null);
                      navigateTo('favorites');
                    }}
                    className="fav-modal-footer-link"
                  >
                    <span>Manage all favorites in your account (/account/favorites)</span>
                    <ArrowRight size={14} />
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
