import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, User, Phone, ArrowRight, ShieldCheck, Check, Sparkles, Gift } from 'lucide-react';

export default function AuthPage({ initialMode = 'login', onNavigate, onAuthSuccess }) {
  const [mode, setMode] = useState(initialMode); // 'login' | 'signup'
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Login Form States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Signup Form States
  const [fullName, setFullName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Shared States
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Slow, elegant modern transition between Login and Sign Up
  const switchMode = (newMode) => {
    if (newMode === mode || isTransitioning) return;
    setError('');
    setIsTransitioning(true);

    setTimeout(() => {
      setMode(newMode);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 450); // Matches halfway point of the smooth fade/slide curve
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!loginEmail || !loginPassword) {
      setError('Please fill in both email and password.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (onAuthSuccess) {
        onAuthSuccess({ email: loginEmail, name: loginEmail.split('@')[0] });
      }
    }, 900);
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!fullName || !signupEmail || !signupPassword) {
      setError('Please fill in all required fields.');
      return;
    }

    if (signupPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (!agreeTerms) {
      setError('Please accept the terms and conditions.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (onAuthSuccess) {
        onAuthSuccess({ email: signupEmail, name: fullName });
      }
    }, 950);
  };

  const handleSocialAuth = (provider) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (onAuthSuccess) {
        onAuthSuccess({ email: `user@${provider.toLowerCase()}.com`, name: `${provider} User` });
      }
    }, 700);
  };

  const isLogin = mode === 'login';

  return (
    <div className="login-screen-wrapper">
      {/* Background ambient decorative glows */}
      <div className={`login-glow-bg login-glow-gold ${isLogin ? 'glow-pos-right' : 'glow-pos-left'}`} />
      <div className="login-glow-bg login-glow-dark" />

      {/* Top Bar Navigation */}
      <header className="login-header">
        <button
          className="login-brand-logo"
          onClick={() => onNavigate && onNavigate('home')}
          title="Back to home"
        >
          <img
            src="/item13Logo-trimmed.png"
            alt="Item13 Logo"
            className="brand-logo-img"
          />
          <span className="brand-logo-tagline">THE UNEXPECTED ESSENTIAL</span>
        </button>

        <button
          className="login-back-btn"
          onClick={() => onNavigate && onNavigate('home')}
        >
          ← Go Back
        </button>
      </header>

      {/* Main Authentication Card */}
      <main className="login-stage">
        <div className={`auth-card-shell ${isTransitioning ? 'auth-card-transitioning' : ''}`}>
          <div className={`login-card-container ${isLogin ? 'mode-login' : 'mode-signup'}`}>

            {/* Left Visual Banner with dynamic content based on Mode */}
            <div className="login-card-visual">
              <div className="visual-animated-container">
                {isLogin ? (
                  <div className="visual-pane-fade">
                    <div className="login-visual-badge">
                      <Sparkles size={14} /> Exclusive Offers
                    </div>

                    <div className="login-visual-content">
                      <h2 className="login-visual-title">
                        Log into your account.
                      </h2>
                      <p className="login-visual-sub">
                        Sign in to reorder your favorite items, and unlock member-exclusive deals.
                      </p>

                      <div className="login-perks-list">
                        <div className="login-perk-item">
                          <div className="perk-check">
                            <Check size={14} />
                          </div>
                          <span>Insane deals, with affordable pricing</span>
                        </div>
                        <div className="login-perk-item">
                          <div className="perk-check">
                            <Check size={14} />
                          </div>
                          <span>Saved favorites, addresses & quick checkout</span>
                        </div>
                        <div className="login-perk-item">
                          <div className="perk-check">
                            <Check size={14} />
                          </div>
                          <span>Real-time delivery status & order tracking</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="visual-pane-fade">
                    <div className="login-visual-badge signup-badge">
                      <Gift size={14} /> Welcome to Item13!
                    </div>

                    <div className="login-visual-content">
                      <h2 className="login-visual-title">
                        Join the Item13 Club today.
                      </h2>
                      <p className="login-visual-sub">
                        Create your account for exclusive experience and access. Join us today!
                      </p>

                      <div className="login-perks-list">
                        <div className="login-perk-item">
                          <div className="perk-check">
                            <Check size={14} />
                          </div>
                          <span>Insane deals, with affordable pricing</span>
                        </div>
                        <div className="login-perk-item">
                          <div className="perk-check">
                            <Check size={14} />
                          </div>
                          <span>Receive exclusive offers and discounts</span>
                        </div>
                        <div className="login-perk-item">
                          <div className="perk-check">
                            <Check size={14} />
                          </div>
                          <span>Early access to secret seasonal product drops</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="login-visual-footer">
                <ShieldCheck size={18} className="shield-icon" />
                <span>256-bit encrypted secure checkout</span>
              </div>
            </div>

            {/* Right Interactive Form Panel */}
            <div className="login-card-form-wrapper">
              {/* Mode Toggle Switch Header */}
              <div className="auth-tab-switcher">
                <button
                  type="button"
                  className={`auth-tab-btn ${isLogin ? 'active' : ''}`}
                  onClick={() => switchMode('login')}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  className={`auth-tab-btn ${!isLogin ? 'active' : ''}`}
                  onClick={() => switchMode('signup')}
                >
                  Create Account
                </button>
                <div className={`auth-tab-slider ${isLogin ? 'pos-left' : 'pos-right'}`} />
              </div>

              <div className="auth-form-animated-body">
                {isLogin ? (
                  /* ================= LOGIN FORM ================= */
                  <div className="form-pane-fade">
                    <div className="login-form-header">
                      <h1 className="login-form-title">Welcome Back</h1>
                      <p className="login-form-subtitle">
                        Enter your credentials to access your Item13 account
                      </p>
                    </div>

                    {error && (
                      <div className="login-error-alert" role="alert">
                        <span>{error}</span>
                      </div>
                    )}

                    {/* Social Authentication */}
                    <div className="login-social-buttons">
                      <button
                        type="button"
                        className="btn-social"
                        onClick={() => handleSocialAuth('Google')}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24">
                          <path
                            fill="#EA4335"
                            d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.3 8.9 5 12 5z"
                          />
                          <path
                            fill="#4285F4"
                            d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.3 0-.8.2-1.6.4-2.3L1.6 7.2C.6 9.2 0 11.5 0 14s.6 4.8 1.6 6.8l3.7-3.1z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.3-6.7-5.3L1.6 16c1.9 3.8 5.8 6.4 10.4 6.4z"
                          />
                        </svg>
                        <span>Continue with Google</span>
                      </button>

                      <button
                        type="button"
                        className="btn-social"
                        onClick={() => handleSocialAuth('Apple')}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.85c.66-.82 1.11-1.96.99-3.1-.96.04-2.12.64-2.8 1.44-.6.69-1.13 1.83-.99 2.93 1.07.08 2.14-.45 2.8-1.27z" />
                        </svg>
                        <span>Continue with Apple</span>
                      </button>
                    </div>

                    <div className="login-divider">
                      <span>or sign in with email</span>
                    </div>

                    <form onSubmit={handleLoginSubmit} className="login-form">
                      <div className="input-field-group">
                        <label className="input-label" htmlFor="login-email">
                          Email Address
                        </label>
                        <div className="input-container">
                          <Mail size={18} className="input-icon" />
                          <input
                            id="login-email"
                            type="email"
                            className="styled-input"
                            placeholder="name@example.com"
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                            required
                            autoComplete="email"
                          />
                        </div>
                      </div>

                      <div className="input-field-group">
                        <div className="label-with-action">
                          <label className="input-label" htmlFor="login-password">
                            Password
                          </label>
                          <button
                            type="button"
                            className="forgot-password-link"
                            onClick={() => alert("Password reset instructions have been sent.")}
                          >
                            Forgot password?
                          </button>
                        </div>
                        <div className="input-container">
                          <Lock size={18} className="input-icon" />
                          <input
                            id="login-password"
                            type={showLoginPassword ? 'text' : 'password'}
                            className="styled-input"
                            placeholder="Enter your password"
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            required
                            autoComplete="current-password"
                          />
                          <button
                            type="button"
                            className="password-toggle-btn"
                            onClick={() => setShowLoginPassword(!showLoginPassword)}
                            aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                          >
                            {showLoginPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </div>

                      <div className="remember-row">
                        <label className="checkbox-container">
                          <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                          />
                          <span className="checkbox-custom" />
                          <span className="checkbox-label-text">Keep me logged in for 30 days</span>
                        </label>
                      </div>

                      <button
                        type="submit"
                        className="btn-login-submit"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <span className="btn-spinner-content">
                            <span className="login-spinner" />
                            Authenticating...
                          </span>
                        ) : (
                          <>
                            <span>Sign In to Item13</span>
                            <ArrowRight size={18} />
                          </>
                        )}
                      </button>
                    </form>

                    <div className="login-footer-callout">
                      <span>Don't have an account yet?</span>
                      <button
                        type="button"
                        className="signup-link-btn"
                        onClick={() => switchMode('signup')}
                      >
                        Create Account
                      </button>
                    </div>
                  </div>
                ) : (
                  /* ================= SIGN UP FORM ================= */
                  <div className="form-pane-fade">
                    <div className="login-form-header">
                      <h1 className="login-form-title">Create Account</h1>
                      <p className="login-form-subtitle">
                        Unlock perks, order tracking & member discounts
                      </p>
                    </div>

                    {error && (
                      <div className="login-error-alert" role="alert">
                        <span>{error}</span>
                      </div>
                    )}

                    {/* Social Quick Signup */}
                    <div className="login-social-buttons">
                      <button
                        type="button"
                        className="btn-social"
                        onClick={() => handleSocialAuth('Google')}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24">
                          <path
                            fill="#EA4335"
                            d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.3 8.9 5 12 5z"
                          />
                          <path
                            fill="#4285F4"
                            d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.3 0-.8.2-1.6.4-2.3L1.6 7.2C.6 9.2 0 11.5 0 14s.6 4.8 1.6 6.8l3.7-3.1z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.3-6.7-5.3L1.6 16c1.9 3.8 5.8 6.4 10.4 6.4z"
                          />
                        </svg>
                        <span>Sign up with Google</span>
                      </button>

                      <button
                        type="button"
                        className="btn-social"
                        onClick={() => handleSocialAuth('Apple')}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.85c.66-.82 1.11-1.96.99-3.1-.96.04-2.12.64-2.8 1.44-.6.69-1.13 1.83-.99 2.93 1.07.08 2.14-.45 2.8-1.27z" />
                        </svg>
                        <span>Sign up with Apple</span>
                      </button>
                    </div>

                    <div className="login-divider">
                      <span>or register with email</span>
                    </div>

                    <form onSubmit={handleSignupSubmit} className="login-form">
                      <div className="signup-grid-fields">
                        <div className="input-field-group">
                          <label className="input-label" htmlFor="signup-name">
                            Full Name
                          </label>
                          <div className="input-container">
                            <User size={18} className="input-icon" />
                            <input
                              id="signup-name"
                              type="text"
                              className="styled-input"
                              placeholder="Alex Morgan"
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                              required
                              autoComplete="name"
                            />
                          </div>
                        </div>

                        <div className="input-field-group">
                          <label className="input-label" htmlFor="signup-phone">
                            Phone (Optional)
                          </label>
                          <div className="input-container">
                            <Phone size={18} className="input-icon" />
                            <input
                              id="signup-phone"
                              type="tel"
                              className="styled-input"
                              placeholder="+233 00 000 0000"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              autoComplete="tel"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="input-field-group">
                        <label className="input-label" htmlFor="signup-email">
                          Email Address
                        </label>
                        <div className="input-container">
                          <Mail size={18} className="input-icon" />
                          <input
                            id="signup-email"
                            type="email"
                            className="styled-input"
                            placeholder="name@example.com"
                            value={signupEmail}
                            onChange={(e) => setSignupEmail(e.target.value)}
                            required
                            autoComplete="email"
                          />
                        </div>
                      </div>

                      <div className="input-field-group">
                        <label className="input-label" htmlFor="signup-password">
                          Password
                        </label>
                        <div className="input-container">
                          <Lock size={18} className="input-icon" />
                          <input
                            id="signup-password"
                            type={showSignupPassword ? 'text' : 'password'}
                            className="styled-input"
                            placeholder="At least 6 characters"
                            value={signupPassword}
                            onChange={(e) => setSignupPassword(e.target.value)}
                            required
                            autoComplete="new-password"
                          />
                          <button
                            type="button"
                            className="password-toggle-btn"
                            onClick={() => setShowSignupPassword(!showSignupPassword)}
                            aria-label={showSignupPassword ? 'Hide password' : 'Show password'}
                          >
                            {showSignupPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </div>

                      <div className="remember-row">
                        <label className="checkbox-container">
                          <input
                            type="checkbox"
                            checked={agreeTerms}
                            onChange={(e) => setAgreeTerms(e.target.checked)}
                          />
                          <span className="checkbox-custom" />
                          <span className="checkbox-label-text">
                            I agree to Item13's Terms of Service & Privacy Policy
                          </span>
                        </label>
                      </div>

                      <button
                        type="submit"
                        className="btn-login-submit"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <span className="btn-spinner-content">
                            <span className="login-spinner" />
                            Creating Account...
                          </span>
                        ) : (
                          <>
                            <span>Join Item13 Club</span>
                            <ArrowRight size={18} />
                          </>
                        )}
                      </button>
                    </form>

                    <div className="login-footer-callout">
                      <span>Already have an account?</span>
                      <button
                        type="button"
                        className="signup-link-btn"
                        onClick={() => switchMode('login')}
                      >
                        Sign In
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

