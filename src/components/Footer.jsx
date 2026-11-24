import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Heart,
  ArrowRight,
  ShieldCheck,
  Truck,
  Flame,
  Sparkles
} from 'lucide-react';

export default function Footer({ onNavigate, onToast }) {
  const currentYear = new Date().getFullYear();
  const [activeMobilePerk, setActiveMobilePerk] = useState(null);

  const perksData = [
    {
      id: 'fresh',
      icon: Flame,
      label: 'Fresh',
      title: 'Popped Hot to Order',
      desc: 'Never pre-bagged or stale. Handcrafted on demand.'
    },
    {
      id: 'delivery',
      icon: Truck,
      label: 'Speedy',
      title: 'Speedy Local Delivery',
      desc: 'Accra, Tema, Kumasi & beyond delivered warm and crunchy.'
    },
    {
      id: 'momo',
      icon: ShieldCheck,
      label: 'MoMo',
      title: 'Mobile Money Ready',
      desc: 'Instant MTN MoMo, Telecel Cash & secure card checkout.'
    },
    {
      id: 'events',
      icon: Sparkles,
      label: 'Events',
      title: 'Event & Party Tubs',
      desc: 'Custom bulk sizes for birthdays, movie nights & celebrations.'
    }
  ];

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (onToast) {
      onToast("You're subscribed! You'll receive our secret weekend flavor drops.");
    }
  };

  return (
    <footer className="site-footer">
      {/* Top Value Propositions Banner */}
      <div className="footer-perks-strip">
        {/* Desktop grid */}
        <div className="footer-perks-container footer-perks-desktop">
          {perksData.map((perk) => {
            const Icon = perk.icon;
            return (
              <div key={perk.id} className="footer-perk-item">
                <div className="perk-icon-bubble">
                  <Icon size={20} />
                </div>
                <div className="perk-text-block">
                  <span className="perk-title">{perk.title}</span>
                  <span className="perk-desc">{perk.desc}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile: Row of icons with tap pop-up */}
        <div className="footer-perks-mobile">
          <div className="footer-perks-mobile-row">
            {perksData.map((perk, idx) => {
              const Icon = perk.icon;
              const isActive = activeMobilePerk === idx;
              return (
                <button
                  key={perk.id}
                  type="button"
                  className={`footer-perk-icon-btn ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveMobilePerk(prev => prev === idx ? null : idx)}
                  aria-label={perk.title}
                >
                  <div className="footer-perk-icon-wrapper">
                    <Icon size={20} />
                  </div>
                  <span className="footer-perk-icon-label">{perk.label}</span>
                </button>
              );
            })}
          </div>

          {/* Pop-up dialog on tap */}
          {activeMobilePerk !== null && (
            <div className="footer-perk-popup" role="dialog" aria-live="polite">
              <div className="footer-perk-popup-bubble">
                {(() => {
                  const perk = perksData[activeMobilePerk];
                  const Icon = perk.icon;
                  return (
                    <>
                      <div className="footer-perk-popup-icon">
                        <Icon size={18} />
                      </div>
                      <div className="footer-perk-popup-text">
                        <strong>{perk.title}</strong>
                        <p>{perk.desc}</p>
                      </div>
                      <button
                        type="button"
                        className="footer-perk-popup-close"
                        onClick={() => setActiveMobilePerk(null)}
                        aria-label="Close"
                      >
                        ×
                      </button>
                    </>
                  );
                })()}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Multi-Column Footer Body */}
      <div className="footer-main-section">
        <div className="footer-main-container">
          {/* Column 1: Brand & Bio */}
          <div className="footer-col footer-col-brand">
            <a
              href="/"
              className="footer-brand-logo"
              onClick={(e) => {
                e.preventDefault();
                onNavigate && onNavigate('home');
              }}
              style={{ textDecoration: 'none' }}
            >
              <img
                src="/item13Logo-trimmed.png"
                alt="Item13 Logo"
                className="brand-logo-img"
              />
              <span className="brand-logo-tagline">THE UNEXPECTED ESSENTIAL</span>
            </a>

            <p className="footer-brand-bio">
              Ghana's premier artisan popcorn and refreshments brand. Freshly popped butterfly kernels with rich real butter, artisan sweet caramel, and fiery suya spices delivered to your home, office, or event.
            </p>

            {/* Social Icons with SVG */}
            <div className="footer-social-links">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="social-circle-btn"
                aria-label="Instagram"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="social-circle-btn"
                aria-label="Facebook"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="social-circle-btn"
                aria-label="Twitter / X"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="footer-col">
            <h4 className="footer-heading">Menu &amp; Combos</h4>
            <ul className="footer-link-list">
              <li>
                <a
                  href="/products/pop-classic-butter"
                  className="footer-text-link"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate && onNavigate('product-pop-classic-butter');
                  }}
                  style={{ textDecoration: 'none' }}
                >
                  Classic Buttered Popcorn
                </a>
              </li>
              <li>
                <a
                  href="/products/pop-golden-caramel"
                  className="footer-text-link"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate && onNavigate('product-pop-golden-caramel');
                  }}
                  style={{ textDecoration: 'none' }}
                >
                  Artisan Golden Caramel
                </a>
              </li>
              <li>
                <a
                  href="/products/pop-accra-suya"
                  className="footer-text-link"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate && onNavigate('product-pop-accra-suya');
                  }}
                  style={{ textDecoration: 'none' }}
                >
                  Accra Suya Pepper Crunch
                </a>
              </li>
              <li>
                <a
                  href="/products"
                  className="footer-text-link"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate && onNavigate('menu');
                  }}
                  style={{ textDecoration: 'none' }}
                >
                  Chilled Sodas &amp; Malta
                </a>
              </li>
              <li>
                <a
                  href="/products"
                  className="footer-text-link"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate && onNavigate('menu');
                  }}
                  style={{ textDecoration: 'none' }}
                >
                  Meal Combos
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care */}
          <div className="footer-col">
            <h4 className="footer-heading">Help &amp; Delivery</h4>
            <ul className="footer-link-list">
              <li>
                <a
                  href="/delivery"
                  className="footer-text-link"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate && onNavigate('delivery');
                  }}
                  style={{ textDecoration: 'none' }}
                >
                  Delivery Zones &amp; Fees (/delivery)
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="footer-text-link"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate && onNavigate('contact');
                  }}
                  style={{ textDecoration: 'none' }}
                >
                  Contact &amp; Support (/contact)
                </a>
              </li>
              <li>
                <a
                  href="/events"
                  className="footer-text-link"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate && onNavigate('events');
                  }}
                  style={{ textDecoration: 'none' }}
                >
                  Bulk Event &amp; Party Orders (/events)
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="footer-text-link"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate && onNavigate('about');
                  }}
                  style={{ textDecoration: 'none' }}
                >
                  Our Story &amp; Heritage (/about)
                </a>
              </li>
              <li>
                <a
                  href="/login"
                  className="footer-text-link"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate && onNavigate('login');
                  }}
                  style={{ textDecoration: 'none' }}
                >
                  Track My Order
                </a>
              </li>
              <li>
                <button
                  type="button"
                  className="footer-text-link"
                  onClick={() => onToast && onToast('Item13 kernels are 100% gluten-free and non-GMO.')}
                >
                  Allergen &amp; Nutrition Info
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="footer-text-link"
                  onClick={() => onToast && onToast('Orders can be modified within 5 minutes of placement.')}
                >
                  Refund &amp; Return Policy
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Location, Hours & WhatsApp Newsletter */}
          <div className="footer-col">
            <h4 className="footer-heading">Get in Touch</h4>
            <div className="footer-contact-items">
              <div className="contact-item">
                <MapPin size={16} className="contact-icon" />
                <span>East Legon / Spintex Road, Greater Accra, Ghana</span>
              </div>
              <div
                className="contact-item"
                style={{ cursor: 'pointer' }}
                onClick={() => onNavigate && onNavigate('contact')}
              >
                <Phone size={16} className="contact-icon" />
                <span>+233 54 000 1313 (WhatsApp &amp; Calls)</span>
              </div>
              <div className="contact-item">
                <Clock size={16} className="contact-icon" />
                <span>Mon – Sun: 10:00 AM – 11:00 PM</span>
              </div>
            </div>

            <div className="footer-newsletter-box">
              <span className="newsletter-title">Weekend Drops &amp; Discounts</span>
              <p className="newsletter-desc">
                Subscribe for exclusive discounts &amp; free tub upgrade alerts.
              </p>
              <form onSubmit={handleSubscribe} className="footer-newsletter-form">
                <input
                  type="email"
                  placeholder="Enter your email"
                  required
                  className="newsletter-input"
                />
                <button type="submit" className="newsletter-btn" aria-label="Subscribe">
                  <ArrowRight size={16} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Copyright & Legal */}
      <div className="footer-bottom-bar">
        <div className="footer-bottom-container">
          <span className="footer-copy">
            &copy; {currentYear} Item13. All rights reserved.
          </span>

          <div className="footer-legal-links">
            <button
              type="button"
              className="legal-link"
              onClick={() => onToast && onToast('Item13 Privacy Policy')}
            >
              Privacy Policy
            </button>
            <span className="legal-dot">•</span>
            <button
              type="button"
              className="legal-link"
              onClick={() => onToast && onToast('Item13 Terms of Service')}
            >
              Terms of Service
            </button>
            <span className="legal-dot">•</span>
            <button
              type="button"
              className="legal-link"
              onClick={() => onToast && onToast('Licensed by FDA Ghana')}
            >
              FDA Certified
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
