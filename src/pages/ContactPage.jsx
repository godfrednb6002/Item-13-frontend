import React, { useState } from 'react';
import {
  Phone,
  Clock,
  MapPin,
  Mail,
  Send,
  MessageSquare,
  HelpCircle,
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
  ArrowRight,
  Truck,
  Sparkles,
  ExternalLink,
  Flame,
  AlertCircle
} from 'lucide-react';
import Footer from '../components/Footer';
import ThemeToggle from '../components/ThemeToggle';

const HOTLINES = [
  {
    title: 'Customer Care & Dispatch Hotline',
    number: '+233 54 000 1313',
    rawNumber: '233540001313',
    description: 'Instant rider order updates, delivery checks, and general inquiries across Ghana.',
    hours: 'Mon – Sun: 10:00 AM – 11:30 PM',
    isPrimary: true,
  },
  {
    title: 'Bulk & Wedding Event Concierge',
    number: '+233 24 113 1313',
    rawNumber: '233241131313',
    description: 'Dedicated team for party tubs, corporate galas, and customized label mockups.',
    hours: 'Mon – Sat: 9:00 AM – 8:00 PM',
    isPrimary: false,
  },
  {
    title: 'Kumasi Regional Dispatch Line',
    number: '+233 50 113 1313',
    rawNumber: '233501131313',
    description: 'Local support for deliveries across Kumasi, KNUST, and Ashanti Region.',
    hours: 'Mon – Sun: 11:00 AM – 10:30 PM',
    isPrimary: false,
  },
];

const KITCHEN_LOCATIONS = [
  {
    city: 'Greater Accra Hub',
    name: 'East Legon Dispatch & Kitchen',
    address: 'Plot 4, Boundary Road, Near A&C Square, East Legon, Accra',
    gps: 'GA-182-9021',
    hours: 'Mon – Sun: 10:00 AM – 11:30 PM',
  },
  {
    city: 'Tema Metropolis Hub',
    name: 'Sakumono & Spintex Corridor Pod',
    address: 'Spintex Coastal Junction, Near Sakumono Estate, Tema',
    gps: 'GT-048-3190',
    hours: 'Mon – Sun: 10:30 AM – 10:30 PM',
  },
  {
    city: 'Kumasi Metropolis Hub',
    name: 'KNUST Tech Junction Kitchen',
    address: 'Ayeduase Commercial Strip, KNUST Tech Junction, Kumasi',
    gps: 'AK-039-4412',
    hours: 'Mon – Sun: 11:00 AM – 10:30 PM',
  },
];

const FAQS = [
  {
    q: 'How fast will my popcorn tub arrive once ordered?',
    a: 'Orders in core zones (East Legon, Airport, Cantonments, Osu, Sakumono, KNUST) arrive in 25–40 minutes on average. All tubs are freshly popped upon order confirmation and packed warm in thermal kraft buckets.',
  },
  {
    q: 'Can I track my dispatch rider via WhatsApp?',
    a: 'Yes! The instant your order is picked up by our rider, a live WhatsApp message with rider phone number, name, and live GPS map route is sent to you.',
  },
  {
    q: 'What payment methods do you accept at checkout or delivery?',
    a: 'We accept all Ghanaian Mobile Money networks (MTN MoMo, Telecel Cash, AT Money), Visa/Mastercard, and verified Cash-on-Delivery for select zones.',
  },
  {
    q: 'How do I modify or cancel an order that was just placed?',
    a: 'Because our corn is popped hot to order, modifications should be made within 5 minutes of placing your order. Call or WhatsApp our dispatch hotline at +233 54 000 1313 immediately with your order reference number.',
  },
];

export default function ContactPage({ onNavigate, onToast }) {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    topic: 'Order Dispatch Update',
    orderNumber: '',
    message: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.message) {
      if (onToast) onToast('Please fill in your name, phone number, and message.');
      return;
    }
    setFormSubmitted(true);
    if (onToast) onToast('Support message submitted! We will respond on WhatsApp/phone promptly.');
  };

  const getWhatsAppLink = (number, text = 'Hello Item13, I have an inquiry about popcorn orders.') => {
    return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="contact-page-wrapper">
      {/* Top Header */}
      <header className="contact-header">
        <div className="contact-header-inner">
          <div
            className="contact-brand-wrap"
            onClick={() => onNavigate && onNavigate('home')}
            style={{ cursor: 'pointer' }}
          >
            <img src="/item13Logo-trimmed.png" alt="Item13 Logo" className="contact-brand-logo" />
            <span className="brand-logo-tagline">THE UNEXPECTED ESSENTIAL</span>
          </div>

          <div className="contact-header-actions">
            <ThemeToggle />
            <button
              type="button"
              className="btn-header-menu"
              onClick={() => onNavigate && onNavigate('menu')}
            >
              Browse Menu
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="contact-hero-section">
        <div className="contact-hero-container">
          <span className="contact-hero-badge">
            <Phone size={13} />
            DIRECT GHANA SUPPORT &amp; HOTLINE
          </span>
          <h1 className="contact-hero-title">
            We’re Here for Your Crunch: <br />
            <span className="gold-accent">Hotlines, WhatsApp &amp; Hours</span>
          </h1>
          <p className="contact-hero-lead">
            Have a question about a live order, rider tracking, flavor pairings, or wedding catering? Contact our Ghanaian customer care team directly via our dispatch hotlines or tap below to WhatsApp us instantly.
          </p>

          {/* Quick Direct WhatsApp CTA Banner */}
          <div className="hero-whatsapp-strip">
            <div className="wa-icon-col">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="wa-svg-icon">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.698c.969.584 1.761.884 2.802.884l.006.001c3.18 0 5.766-2.587 5.767-5.766.001-3.181-2.584-5.772-5.779-5.772zm3.385 8.204c-.14.394-.78.74-1.087.77-.306.03-.701.144-2.316-.525-1.939-.803-3.17-2.779-3.266-2.906-.096-.128-.779-1.036-.779-1.975 0-.94.49-1.401.664-1.593.174-.192.38-.24.507-.24.127 0 .254.001.365.006.118.006.275-.045.431.328.16.383.548 1.336.596 1.433.048.096.08.208.016.335-.064.128-.096.208-.191.32-.096.112-.202.25-.288.336-.096.096-.196.2-.084.393.112.192.498.822 1.07 1.332.736.656 1.357.86 1.55.956.192.096.304.08.416-.048.112-.128.48-.56.608-.752.128-.192.256-.16.432-.096.176.064 1.118.528 1.31.624.192.096.32.144.368.224.048.08.048.464-.096.856zM12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.176L2 22l4.975-1.39A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.062c-1.637 0-3.15-.494-4.417-1.341l-.317-.213-2.964.827.839-2.887-.215-.33A7.994 7.994 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8.062-8 8.062z" />
              </svg>
            </div>
            <div className="wa-text-col">
              <strong>Need Immediate Assistance? Chat on WhatsApp</strong>
              <span>Direct rider tracking, order changes, and swift support right on your phone.</span>
            </div>
            <a
              href={getWhatsAppLink('233540001313', 'Hello Item13 Dispatch, I need assistance with an order.')}
              target="_blank"
              rel="noreferrer"
              className="btn-hero-wa"
            >
              <span>Chat on WhatsApp</span>
              <ExternalLink size={15} />
            </a>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <main className="contact-main-stage">
        {/* Hotlines Cards Grid */}
        <section className="hotlines-section">
          <div className="section-title-wrap">
            <span className="eyebrow-gold">DIRECT TELEPHONE LINES</span>
            <h2>Dispatch &amp; Order Hotlines</h2>
            <p>Our phone lines are staffed by real snack concierges ready to help.</p>
          </div>

          <div className="hotlines-grid">
            {HOTLINES.map((line, idx) => (
              <div key={idx} className={`hotline-card ${line.isPrimary ? 'primary-card' : ''}`}>
                {line.isPrimary && <span className="hotline-badge">Main Hotline</span>}
                <div className="hotline-icon-wrap">
                  <Phone size={22} />
                </div>
                <h3>{line.title}</h3>
                <a href={`tel:${line.rawNumber}`} className="hotline-number-link">
                  {line.number}
                </a>
                <p className="hotline-desc">{line.description}</p>
                <div className="hotline-hours">
                  <Clock size={14} className="clock-icon" />
                  <span>{line.hours}</span>
                </div>
                <div className="hotline-actions">
                  <a href={`tel:${line.rawNumber}`} className="btn-call-direct">
                    <span>Call Now</span>
                  </a>
                  <a
                    href={getWhatsAppLink(line.rawNumber, `Hello Item13, I'm reaching out regarding ${line.title}.`)}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-wa-direct"
                    title="Open in WhatsApp"
                  >
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Form & Operating Hours Grid */}
        <section className="contact-split-section">
          <div className="split-grid">
            {/* Left: Message Support Form */}
            <div className="support-form-card">
              <div className="card-header">
                <h3>Send Us a Direct Message</h3>
                <p>Submit inquiries regarding orders, refunds, press, or feedback. We respond within 30 minutes.</p>
              </div>

              {formSubmitted ? (
                <div className="form-success-box">
                  <CheckCircle2 size={38} className="success-icon" />
                  <h4>Message Received!</h4>
                  <p>
                    Thank you, <strong>{formData.name}</strong>. A support manager has been notified and will reach out to <strong>{formData.phone}</strong> shortly.
                  </p>
                  <button
                    type="button"
                    className="btn-another-msg"
                    onClick={() => {
                      setFormSubmitted(false);
                      setFormData({
                        name: '',
                        phone: '',
                        email: '',
                        topic: 'Order Dispatch Update',
                        orderNumber: '',
                        message: '',
                      });
                    }}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="support-form">
                  <div className="form-group">
                    <label>Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kwabena Mensah"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="support-input"
                    />
                  </div>

                  <div className="form-row-2">
                    <div className="form-group">
                      <label>Phone / WhatsApp Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. +233 54 000 0000"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="support-input"
                      />
                    </div>

                    <div className="form-group">
                      <label>Email Address</label>
                      <input
                        type="email"
                        placeholder="e.g. kwabena@gmail.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="support-input"
                      />
                    </div>
                  </div>

                  <div className="form-row-2">
                    <div className="form-group">
                      <label>Inquiry Topic</label>
                      <select
                        value={formData.topic}
                        onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                        className="support-input support-select"
                      >
                        <option value="Order Dispatch Update">Order Dispatch / Rider Location</option>
                        <option value="Flavor Ingredients / Allergens">Flavor Ingredients &amp; Allergens</option>
                        <option value="Event Catering Inquiry">Event &amp; Wedding Party Tubs</option>
                        <option value="Feedback or Refund">Order Feedback &amp; Quality Check</option>
                        <option value="Other">Other Question</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Order Number (If applicable)</label>
                      <input
                        type="text"
                        placeholder="e.g. #ITM-8921"
                        value={formData.orderNumber}
                        onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
                        className="support-input"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>How Can We Help You? *</label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Please share any details or questions..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="support-input support-textarea"
                    />
                  </div>

                  <button type="submit" className="btn-support-submit">
                    <Send size={15} />
                    <span>Send Support Request</span>
                  </button>
                </form>
              )}
            </div>

            {/* Right: Operating Hours & Kitchen Locations */}
            <div className="locations-hours-card">
              <div className="card-header">
                <h3>Kitchen Hubs &amp; Operating Hours</h3>
                <p>Fresh popcorn batches are popped continuously during operating hours at these central distribution kitchens.</p>
              </div>

              <div className="locations-list">
                {KITCHEN_LOCATIONS.map((loc, idx) => (
                  <div key={idx} className="location-item">
                    <div className="loc-city-tag">{loc.city}</div>
                    <h4 className="loc-title">{loc.name}</h4>
                    <p className="loc-address">
                      <MapPin size={14} className="loc-pin" />
                      <span>{loc.address}</span>
                    </p>
                    <p className="loc-gps">
                      GhanaPost Digital Address: <strong>{loc.gps}</strong>
                    </p>
                    <div className="loc-time">
                      <Clock size={13} className="loc-clock" />
                      <span>{loc.hours}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Delivery info callout */}
              <div className="delivery-callout-banner">
                <Truck size={20} className="callout-icon" />
                <div>
                  <strong>Looking for our transparent delivery rate table?</strong>
                  <p>Check standard dispatch fees and express priority delivery speeds across Accra, Tema &amp; Kumasi.</p>
                  <button
                    type="button"
                    className="btn-callout-link"
                    onClick={() => onNavigate && onNavigate('delivery')}
                  >
                    <span>View Delivery Coverage Table (/delivery)</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Frequently Asked Questions Accordion */}
        <section className="faq-section">
          <div className="section-title-wrap text-center">
            <span className="eyebrow-gold">QUICK ANSWERS</span>
            <h2>Frequently Asked Questions</h2>
            <p>Everything you need to know about our dispatch times, popcorn warmth, and ordering process.</p>
          </div>

          <div className="faq-accordion-container">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className={`faq-card ${isOpen ? 'is-open' : ''}`}>
                  <button
                    type="button"
                    className="faq-question-btn"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                  >
                    <span>{faq.q}</span>
                    <ChevronDown size={18} className="faq-chevron" />
                  </button>
                  {isOpen && (
                    <div className="faq-answer-content">
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer onNavigate={onNavigate} onToast={onToast} />
    </div>
  );
}

