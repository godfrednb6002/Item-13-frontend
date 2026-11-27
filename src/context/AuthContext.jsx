import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { useCartStore } from './cartStore';
import { toAuthenticatedUrl, toGuestUrl } from '../services/urlMapper';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(() => {
    try {
      const raw = localStorage.getItem('item13_user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [isLoading, setIsLoading] = useState(true);
  const mergeCart = useCartStore((s) => s.mergeCart);

  // Initial session verification
  useEffect(() => {
    let mounted = true;
    async function verify() {
      try {
        const verifiedUser = await authService.verifySession();
        if (mounted) {
          if (verifiedUser) {
            setUserState(verifiedUser);
            try {
              localStorage.setItem('item13_user', JSON.stringify(verifiedUser));
            } catch {
              // ignore
            }
          } else {
            setUserState(null);
            try {
              localStorage.removeItem('item13_user');
            } catch {
              // ignore
            }
          }
        }
      } catch (err) {
        if (mounted) {
          setUserState(null);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    verify();

    const handleSessionExpired = () => {
      setUserState(null);
    };
    window.addEventListener('item13_session_expired', handleSessionExpired);

    return () => {
      mounted = false;
      window.removeEventListener('item13_session_expired', handleSessionExpired);
    };
  }, []);

  const login = async (credentials, preservedGuestPath) => {
    setIsLoading(true);
    try {
      const authenticatedUser = await authService.login(credentials);
      setUserState(authenticatedUser);
      localStorage.setItem('item13_user', JSON.stringify(authenticatedUser));

      // Redirect guest to equivalent authenticated route
      const destination = preservedGuestPath
        ? toAuthenticatedUrl(preservedGuestPath, window.location.search)
        : '/a';
      
      window.history.pushState({}, '', destination);
      return authenticatedUser;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData, preservedGuestPath) => {
    setIsLoading(true);
    try {
      const authenticatedUser = await authService.register(userData);
      setUserState(authenticatedUser);
      localStorage.setItem('item13_user', JSON.stringify(authenticatedUser));

      const destination = preservedGuestPath
        ? toAuthenticatedUrl(preservedGuestPath, window.location.search)
        : '/a';

      window.history.pushState({}, '', destination);
      return authenticatedUser;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUserState(null);
      localStorage.removeItem('item13_user');

      // Convert current authenticated route to guest route
      const guestDest = toGuestUrl(window.location.pathname, window.location.search);
      window.history.pushState({}, '', guestDest);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    setUser: (u) => {
      setUserState(u);
      if (u) {
        localStorage.setItem('item13_user', JSON.stringify(u));
      } else {
        localStorage.removeItem('item13_user');
      }
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
