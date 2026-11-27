import React, { useEffect } from 'react';
import { toAuthenticatedUrl } from '../../services/urlMapper';

/**
 * GuestRoute:
 * - Allows unauthenticated guests to access guest routes (/).
 * - If an authenticated customer visits a guest route, automatically redirects
 *   them to the equivalent /a route, preserving path, query params, and state.
 */
export default function GuestRoute({ isAuthenticated, isLoading, children, onRedirect }) {
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      const currentPath = window.location.pathname;
      const currentSearch = window.location.search;
      const equivalentAuthPath = toAuthenticatedUrl(currentPath, currentSearch);

      if (window.location.pathname !== equivalentAuthPath) {
        window.history.replaceState({}, '', equivalentAuthPath);
        if (onRedirect) {
          onRedirect(equivalentAuthPath);
        }
      }
    }
  }, [isAuthenticated, isLoading, onRedirect]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-center p-8">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm opacity-70">Verifying session...</p>
      </div>
    );
  }

  // If authenticated and awaiting redirect, avoid flickering guest page
  if (isAuthenticated) {
    return null;
  }

  return children;
}
