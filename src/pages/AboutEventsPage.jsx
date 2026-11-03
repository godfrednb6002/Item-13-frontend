import React, { useState } from 'react';
import {
  PartyPopper,
  Sparkles,
  Flame,
  Heart,
  Send,
  Calendar,
  Users,
  MapPin,
  Clock,
  Phone,
  Mail,
  Check,
  ShieldCheck,
  Truck,
  ArrowRight,
  Gift,
  Coffee,
  CheckCircle2,
  Award,
  Layers
} from 'lucide-react';
import Footer from '../components/Footer';
import ThemeToggle from '../components/ThemeToggle';

const BULK_TIERS = [
  {
    name: 'Party Starter Kit',
    tubs: '25 – 50 Tubs',
    tag: 'Celebrations & Birthdays',
    discount: '15% Off Menu Price',
    flavors: 'Pick up to 3 custom signature flavors',
    features: [
      'Customized printed event tub labels with celebrant name or logo',
      'Freshly popped on event morning & sealed warm',
      'Complimentary butter drizzle packets included',
      'Accra / Tema direct venue courier delivery',
    ],
    recommendedFor: 'Birthdays, Bridal Showers, Small Private Gatherings',
  },
  {
    name: 'Grand Wedding & Gala',
    tubs: '60 – 200 Tubs',
    tag: 'Most Popular',
    isPopular: true,
    discount: '25% Off Menu Price',
    flavors: 'Full flavor tasting flight + up to 5 custom flavors',
    features: [
      'Bespoke gold-foil customized stickers with couple/brand monogram',
      'Interactive Live Popcorn Cart & Popping Attendant option available',
      'Warm thermal kraft display dispensers provided',
      'Separate chilled drink pairings (Fanta, Coke, Malta Guinness)',
      'Dedicated Event Concierge on WhatsApp for delivery coordination',
    ],
    recommendedFor: 'Weddings, Corporate Galas, Brand Activations, Product Launches',
  },
  {
    name: 'Festival & Stadium Mega Bundle',
    tubs: '250+ Jumbo Tubs',
    tag: 'Enterprise & Festivals',
    discount: 'Custom Wholesale Rate (Up to 35% Off)',
    flavors: 'Unlimited flavor custom curation & exclusive seasonings',
    features: [
      'Industrial batch production with guaranteed simultaneous fresh dispatch',
      'Full branded display booth & on-site popping setups',
      'Temperature-monitored refrigerated beverage supply',
      'Direct coordination with venue event management teams',
    ],
    recommendedFor: 'Conferences, Concerts, School Fairs, Stadium Events',
  },
];

const FLAVORS_LIST = [
  'Signature Real Butter Crunch',
  'Artisan Golden Caramel',
  'Accra Suya Pepper Special',
  'Dark Cocoa Caramel Swirl',
  'Smoked White Cheddar Blast',
  'Double Butter Drizzle',
];

export default function AboutEventsPage({ onNavigate, onToast, initialTab = 'about' }) {
  const [activeTab, setActiveTab] = useState(initialTab); // 'about' | 'events'
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    eventType: 'Wedding',
    eventDate: '',
    guestCount: '100 - 200 guests',
    estimatedTubs: '100',
    selectedFlavors: ['Signature Real Butter Crunch', 'Artisan Golden Caramel'],
    venueLocation: '',
    customBranding: true,
    liveAttendant: false,
    specialNotes: '',
  });

  const handleFlavorToggle = (flavor) => {
    setFormData((prev) => {
      const exists = prev.selectedFlavors.includes(flavor);
      const updated = exists
        ? prev.selectedFlavors.filter((f) => f !== flavor)
        : [...prev.selectedFlavors, flavor];
      return { ...prev, selectedFlavors: updated };
    });
  };

  const handleSubmitInquiry = (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone) {
      if (onToast) onToast('Please enter your name and phone number.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      if (onToast) {
        onToast(`Inquiry sent! Our Event Concierge will contact ${formData.phone} shortly.`);
      }
    }, 1000);
  };

  return (
    <div className="about-events-page">
      {/* Top Header */}
      <header className="about-header">
        <div className="about-header-inner">
          <div
            className="about-brand-wrap"
            onClick={() => onNavigate && onNavigate('home')}
            style={{ cursor: 'pointer' }}
          >
            <img src="/item13Logo-trimmed.png" alt="Item13 Logo" className="about-brand-logo" />
            <span className="brand-logo-tagline">THE UNEXPECTED ESSENTIAL</span>
          </div>

          <div className="about-header-tabs">
            <button
              type="button"
              className={`header-tab-btn ${activeTab === 'about' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('about');
                window.history.pushState({}, '', '/about');
              }}
            >
              Our Story &amp; Brand
            </button>
            <button
              type="button"
              className={`header-tab-btn ${activeTab === 'events' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('events');
                window.history.pushState({}, '', '/events');
              }}
            >
              <PartyPopper size={15} />
              <span>Bulk Party &amp; Weddings</span>
            </button>
          </div>

          <div className="about-header-right">
            <ThemeToggle />
            <button
              type="button"
              className="about-nav-menu-btn"
              onClick={() => onNavigate && onNavigate('menu')}
            >
              Browse Menu
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Pane */}
      {activeTab === 'about' ? (
        <div className="about-content-view">
          {/* Brand Hero */}
          <section className="about-hero">
            <div className="about-hero-container">
              <span className="about-badge">
                <Sparkles size={13} />
                THE STORY OF ITEM13
              </span>
              <h1 className="about-hero-title">
                "The Unexpected Essential" <br />
                <span className="gold-accent">Crafted with Pride in Ghana</span>
              </h1>
              <p className="about-hero-lead">
                In Ghanaian tradition and event culture, <strong>"Item 13"</strong> is the unofficial, highly anticipated highlight of every gathering: <em>the refreshments, the snacks, the treat you came for</em>. We founded Item13 to elevate that moment into an unforgettable gourmet snacking experience.
              </p>
            </div>
          </section>

          {/* Pillars Grid */}
          <section className="about-pillars-section">
            <div className="pillars-container">
              <div className="pillar-card">
                <div className="pillar-icon">
                  <Flame size={24} />
                </div>
                <h3>Popped Fresh to Order</h3>
                <p>
                  We never pre-bag kernels weeks in advance to sit in humid store aisles. Every single tub is popped fresh on the day of dispatch so that crunch is crisp, warm, and unmistakable.
                </p>
              </div>

              <div className="pillar-card">
                <div className="pillar-icon">
                  <Award size={24} />
                </div>
                <h3>Creamery Butter &amp; Pure Cane</h3>
                <p>
                  No artificial palm oil shortcuts. We use genuine cow milk creamery butter, slow-simmered caramelized sugars, and authentic local suya spice powders milled right in Accra.
                </p>
              </div>

              <div className="pillar-card">
                <div className="pillar-icon">
                  <Truck size={24} />
                </div>
                <h3>Dedicated Hot Courier Fleet</h3>
                <p>
                  Our thermal kraft buckets and motorbike dispatch network span Greater Accra, Tema, Kumasi, and surrounding zones, keeping popcorn crunchy and paired drinks ice-cold.
                </p>
              </div>
            </div>
          </section>

          {/* Narrative Story Block */}
          <section className="about-story-section">
            <div className="story-container">
              <div className="story-text-column">
                <span className="story-eyebrow">OUR HERITAGE</span>
                <h2>Why We Call It Item13</h2>
                <p>
                  At every Ghanaian wedding, party, conference, or family sunday hangout, everyone quietly asks: <em>"Has Item 13 started yet?"</em>
                </p>
                <p>
                  Popcorn is the world's most joyful communal snack, but for years in Ghana, people were stuck with stale plastic bags from street corners. We set out to change that standard completely:
                </p>
                <ul className="story-check-list">
                  <li>
                    <CheckCircle2 size={16} className="check-icon" />
                    <span>Non-GMO premium butterfly corn kernels that blossom with maximum crunch surface.</span>
                  </li>
                  <li>
                    <CheckCircle2 size={16} className="check-icon" />
                    <span>Locally inspired flavours — like spicy smoky suya pepper alongside traditional sweet salted caramel.</span>
                  </li>
                  <li>
                    <CheckCircle2 size={16} className="check-icon" />
                    <span>Recyclable, grease-resistant thermal kraft buckets that look stunning at corporate desks and bridal tables.</span>
                  </li>
                </ul>

                <div className="story-cta-row">
                  <button
                    type="button"
                    className="btn-story-order"
                    onClick={() => onNavigate && onNavigate('menu')}
                  >
                    <span>Taste The Crunch</span>
                    <ArrowRight size={16} />
                  </button>
                  <button
                    type="button"
                    className="btn-story-events"
                    onClick={() => {
                      setActiveTab('events');
                      window.history.pushState({}, '', '/events');
                    }}
                  >
                    <span>Cater Your Next Event</span>
                    <PartyPopper size={16} />
                  </button>
                </div>
              </div>

              <div className="story-visual-column">
                <div className="story-image-card">
                  <img
                    src="/item13BagBGremoved.png"
                    alt="Item13 Snack Bags and Popcorn"
                    className="story-main-img"
                    onError={(e) => { e.target.src = '/bistro-popcorn.jpg'; }}
                  />
                  <div className="story-floating-stat">
                    <strong>100%</strong>
                    <span>Non-GMO &amp; Gluten-Free Corn</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      ) : (
        /* Event Catering View */
        <div className="events-content-view">
          {/* Events Hero */}
          <section className="events-hero">
            <div className="events-hero-container">
              <span className="about-badge">
                <PartyPopper size={14} />
                EVENT &amp; PARTY CATERING
              </span>
              <h1 className="about-hero-title">
                Custom Party Tubs <br />
                <span className="gold-accent">Weddings, Birthdays &amp; Corporate Galas</span>
              </h1>
              <p className="about-hero-lead">
                Make your celebration unforgettable with custom-branded popcorn tubs, live gourmet popping carts, and curated flavor stations delivered directly to your venue in Accra, Tema, or Kumasi.
              </p>
            </div>
          </section>

          {/* Bulk Tier Packages */}
          <section className="bulk-tiers-section">
            <div className="tiers-container">
              <div className="section-head text-center">
                <h2>Catering &amp; Bulk Packages</h2>
                <p>Choose your event scale or request a tailored wholesale quote below</p>
              </div>

              <div className="tiers-grid">
                {BULK_TIERS.map((tier, idx) => (
                  <div key={idx} className={`tier-card ${tier.isPopular ? 'popular-tier' : ''}`}>
                    {tier.isPopular && <span className="tier-pop-badge">Most Requested</span>}
                    <div className="tier-head">
                      <span className="tier-tag">{tier.tag}</span>
                      <h3 className="tier-name">{tier.name}</h3>
                      <div className="tier-volume">{tier.tubs}</div>
                      <div className="tier-discount">{tier.discount}</div>
                    </div>

                    <div className="tier-flavor-highlight">
                      <Sparkles size={14} className="flavor-icon" />
                      <span>{tier.flavors}</span>
                    </div>

                    <ul className="tier-features-list">
                      {tier.features.map((feat, fIdx) => (
                        <li key={fIdx}>
                          <Check size={14} className="feat-check" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      type="button"
                      className="btn-select-tier"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          estimatedTubs: tier.tubs.split(' ')[0],
                          eventType: tier.name.includes('Wedding') ? 'Wedding' : 'Birthday / Party',
                        }));
                        const formEl = document.getElementById('inquiry-form-section');
                        if (formEl) formEl.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      <span>Inquire for {tier.name}</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Inquiry Form Section */}
          <section className="inquiry-form-section" id="inquiry-form-section">
            <div className="inquiry-container">
              <div className="inquiry-header text-center">
                <span className="subhead-gold">LET'S POP TOGETHER</span>
                <h2>Bulk Party &amp; Wedding Inquiry Form</h2>
                <p>Tell us about your event date, theme, and tub count. Our team responds within 2-4 hours with a digital quote and sample tasting details.</p>
              </div>

              {submitted ? (
                <div className="inquiry-success-card">
                  <div className="success-icon-wrap">
                    <CheckCircle2 size={42} />
                  </div>
                  <h3>We Received Your Event Inquiry!</h3>
                  <p>
                    Thank you, <strong>{formData.fullName}</strong>. Our Event Concierge is reviewing your date (<strong>{formData.eventDate || 'Upcoming'}</strong>) and will reach out to <strong>{formData.phone}</strong> via WhatsApp and call with a custom quote and sticker mockup.
                  </p>
                  <div className="success-actions">
                    <button
                      type="button"
                      className="btn-reset-inquiry"
                      onClick={() => {
                        setSubmitted(false);
                      }}
                    >
                      Submit Another Inquiry
                    </button>
                    <button
                      type="button"
                      className="btn-view-menu-back"
                      onClick={() => onNavigate && onNavigate('menu')}
                    >
                      Browse Retail Menu
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmitInquiry} className="catering-form-grid">
                  {/* Left Column: Personal & Event Details */}
                  <div className="form-column">
                    <div className="form-group">
                      <label>Contact Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ama Osei / Kwabena Mensah"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="cat-input"
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
                          className="cat-input"
                        />
                      </div>

                      <div className="form-group">
                        <label>Email Address</label>
                        <input
                          type="email"
                          placeholder="e.g. ama@gmail.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="cat-input"
                        />
                      </div>
                    </div>

                    <div className="form-row-2">
                      <div className="form-group">
                        <label>Event Type</label>
                        <select
                          value={formData.eventType}
                          onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                          className="cat-input cat-select"
                        >
                          <option value="Wedding">Wedding Reception / Traditional Marriage</option>
                          <option value="Birthday Party">Birthday / Milestone Celebration</option>
                          <option value="Corporate Event">Corporate Conference / Brand Launch</option>
                          <option value="School / Church Fair">School / Church / Sports Fair</option>
                          <option value="Movie Night">Private Outdoor Movie Night</option>
                          <option value="Other">Other Special Occasion</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Event Date</label>
                        <input
                          type="date"
                          value={formData.eventDate}
                          onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                          className="cat-input"
                        />
                      </div>
                    </div>

                    <div className="form-row-2">
                      <div className="form-group">
                        <label>Estimated Guest Count</label>
                        <select
                          value={formData.guestCount}
                          onChange={(e) => setFormData({ ...formData, guestCount: e.target.value })}
                          className="cat-input cat-select"
                        >
                          <option value="Under 50 guests">Under 50 guests</option>
                          <option value="50 - 100 guests">50 - 100 guests</option>
                          <option value="100 - 200 guests">100 - 200 guests</option>
                          <option value="200 - 500 guests">200 - 500 guests</option>
                          <option value="500+ guests">500+ guests (Mega Gala)</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Desired Number of Tubs</label>
                        <input
                          type="number"
                          placeholder="e.g. 100"
                          min="20"
                          value={formData.estimatedTubs}
                          onChange={(e) => setFormData({ ...formData, estimatedTubs: e.target.value })}
                          className="cat-input"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Venue Location / Landmark (City &amp; Area)</label>
                      <input
                        type="text"
                        placeholder="e.g. Kempinski Hotel, Accra / Silicon House, East Legon"
                        value={formData.venueLocation}
                        onChange={(e) => setFormData({ ...formData, venueLocation: e.target.value })}
                        className="cat-input"
                      />
                    </div>
                  </div>

                  {/* Right Column: Customization & Flavors */}
                  <div className="form-column">
                    <div className="form-group">
                      <label className="section-label">Select Preferred Flavors (Pick any):</label>
                      <div className="flavor-checkbox-grid">
                        {FLAVORS_LIST.map((flv) => {
                          const isChecked = formData.selectedFlavors.includes(flv);
                          return (
                            <label
                              key={flv}
                              className={`flavor-check-pill ${isChecked ? 'selected' : ''}`}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => handleFlavorToggle(flv)}
                              />
                              <span>{flv}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    <div className="form-addons-box">
                      <label className="addon-toggle-row">
                        <input
                          type="checkbox"
                          checked={formData.customBranding}
                          onChange={(e) => setFormData({ ...formData, customBranding: e.target.checked })}
                        />
                        <div>
                          <strong>Custom Monogram &amp; Photo Tub Stickers</strong>
                          <p>We print your custom couple's initials, birthday photo, or brand logo on every tub lid.</p>
                        </div>
                      </label>

                      <label className="addon-toggle-row">
                        <input
                          type="checkbox"
                          checked={formData.liveAttendant}
                          onChange={(e) => setFormData({ ...formData, liveAttendant: e.target.checked })}
                        />
                        <div>
                          <strong>Live Popping Cart Attendant at Venue</strong>
                          <p>A uniformed Item13 popping attendant serving warm popcorn directly to guests.</p>
                        </div>
                      </label>
                    </div>

                    <div className="form-group">
                      <label>Special Instructions or Color Theme</label>
                      <textarea
                        rows={3}
                        placeholder="e.g. Emerald Green & Gold ribbon theme, specific delivery time at 2:00 PM before church service..."
                        value={formData.specialNotes}
                        onChange={(e) => setFormData({ ...formData, specialNotes: e.target.value })}
                        className="cat-input cat-textarea"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-submit-inquiry"
                    >
                      <Send size={16} />
                      <span>{isSubmitting ? 'Sending Request...' : 'Send Catering Inquiry'}</span>
                    </button>
                    <span className="form-sub-note">
                      No immediate payment required. We will send a formal quote and proof preview first.
                    </span>
                  </div>
                </form>
              )}
            </div>
          </section>
        </div>
      )}

      {/* Shared Footer */}
      <Footer onNavigate={onNavigate} onToast={onToast} />
    </div>
  );
}

