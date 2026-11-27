/**
 * Utility functions for URL mapping between guest (/) and authenticated (/a/*) customer routes.
 */

// Mapping of canonical page names to guest and authenticated paths
export const ROUTE_MAP = {
  home: { guest: '/', auth: '/a' },
  landing: { guest: '/', auth: '/a' },
  menu: { guest: '/menu', auth: '/a/menu' },
  search: { guest: '/search', auth: '/a/search' },
  cart: { guest: '/cart', auth: '/a/cart' },
  checkout: { guest: '/checkout', auth: '/a/checkout' },
  'track-order': { guest: '/track-order', auth: '/a/track-order' },
  orders: { guest: '/track-order', auth: '/a/track-order' },
  delivery: { guest: '/delivery', auth: '/a/delivery' },
  about: { guest: '/about', auth: '/a/about' },
  events: { guest: '/events', auth: '/a/events' },
  contact: { guest: '/contact', auth: '/a/contact' },
  login: { guest: '/login', auth: '/a' },
  signup: { guest: '/signup', auth: '/a' },
  account: { guest: '/login', auth: '/a/account' },
  'account-orders': { guest: '/track-order', auth: '/a/account/orders' },
  'account-profile': { guest: '/login', auth: '/a/account/profile' },
  'account-addresses': { guest: '/login', auth: '/a/account/addresses' },
  favorites: { guest: '/favorites', auth: '/a/favorites' },
  payment: { guest: '/payment', auth: '/a/payment' },
};

/**
 * Checks if a pathname is an authenticated route (starting with /a/ or exactly /a)
 */
export const isAuthenticatedRoute = (pathname) => {
  if (!pathname) return false;
  return pathname === '/a' || pathname.startsWith('/a/');
};

/**
 * Converts a guest URL path to its equivalent authenticated URL (/a/...)
 */
export const toAuthenticatedUrl = (pathname = '/', search = '') => {
  if (!pathname || pathname === '/' || pathname === '') {
    return `/a${search}`;
  }

  // If already prefixed with /a, return as-is
  if (pathname === '/a' || pathname.startsWith('/a/')) {
    return `${pathname}${search}`;
  }

  // Handle specific alias transformations if needed
  if (pathname === '/home') {
    return `/a${search}`;
  }
  if (pathname === '/login' || pathname === '/signup') {
    return `/a${search}`;
  }

  // Prefix cleanly
  const cleanPath = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `/a${cleanPath}${search}`;
};

/**
 * Converts an authenticated URL path (/a/...) to its equivalent guest URL
 */
export const toGuestUrl = (pathname = '/a', search = '') => {
  if (!pathname || pathname === '/a' || pathname === '/a/') {
    return `/${search}`;
  }

  if (!isAuthenticatedRoute(pathname)) {
    return `${pathname}${search}`;
  }

  // Strip leading /a/
  let guestPath = pathname.slice(2);
  if (!guestPath.startsWith('/')) {
    guestPath = `/${guestPath}`;
  }

  // Protected-only routes that have no public counterpart map to guest fallback
  if (guestPath.startsWith('/account')) {
    guestPath = '/track-order';
  } else if (guestPath.startsWith('/dashboard')) {
    // '/dashboard' -> '/'
    const sub = guestPath.replace('/dashboard', '');
    if (sub === '/orders') guestPath = '/track-order';
    else if (sub === '/profile' || sub === '/addresses') guestPath = '/';
    else guestPath = sub || '/';
  }

  return `${guestPath}${search}`;
};

/**
 * Builds the appropriate path for an action based on customer authentication state
 */
export const getRouteFor = (page, isAuthenticated = false, param = null) => {
  if (page.startsWith('product-')) {
    const id = page.replace('product-', '');
    return isAuthenticated ? `/a/menu/${id}` : `/menu/${id}`;
  }
  if (page.startsWith('order-tracking/')) {
    const orderId = page.replace('order-tracking/', '');
    return isAuthenticated ? `/a/track-order/${encodeURIComponent(orderId)}` : `/track-order/${encodeURIComponent(orderId)}`;
  }
  if (page.startsWith('dashboard/profile/')) {
    const section = page.replace('dashboard/profile/', '');
    return isAuthenticated ? `/a/account/profile/${section}` : '/login';
  }

  const mapping = ROUTE_MAP[page];
  if (mapping) {
    let base = isAuthenticated ? mapping.auth : mapping.guest;
    if (param) {
      base = `${base}/${encodeURIComponent(param)}`;
    }
    return base;
  }

  return isAuthenticated ? '/a' : '/';
};
