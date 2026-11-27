import React, { useEffect } from 'react';

/**
 * ProtectedRoute:
 * - Allows authenticated customers to access /a/* routes.
 * - If an unauthenticated user visits /a/*, redirects them to /login and
 *   preserves their originally requested destination in query string or state.
 */
export default function ProtectedRoute({ isAuthenticated, isLoading, children, onRedirectToLogin }) {
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const destination = window.location.pathname + window.location.search;
      const loginUrl = `/login?redirect=${encodeURIComponent(destination)}`;
      if (window.location.pathname !== '/login') {
        window.history.replaceState({}, '', loginUrl);
        if (onRedirectToLogin) {
          onRedirectToLogin(destination);
        }
      }
    }
  }, [isAuthenticated, isLoading, onRedirectToLogin]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-center p-8">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm opacity-70">Securing customer session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return children;
}
