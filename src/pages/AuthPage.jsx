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
                        <img
                          src="/googleLogo-trimmed.png"
                          alt="Google logo"
                          className="btn-social-img"
                        />
                        <span>Continue with Google</span>
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
                        <img
                          src="/googleLogo-trimmed.png"
                          alt="Google logo"
                          className="btn-social-img"
                        />
                        <span>Sign up with Google</span>
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

