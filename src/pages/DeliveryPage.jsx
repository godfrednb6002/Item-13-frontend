import React, { useState, useMemo } from 'react';
import {
  MapPin,
  Truck,
  Clock,
  Search,
  Zap,
  ShieldCheck,
  Check,
  ArrowRight,
  ArrowLeft,
  ShoppingBag,
  Sparkles,
  Phone,
  HelpCircle,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { DELIVERY_ZONES, DISPATCH_HOURS, PACKAGING_PROMISES } from '../features/delivery/deliveryData';
import Footer from '../components/Footer';
import ThemeToggle from '../components/ThemeToggle';

const CITIES = ['All Zones', 'Accra', 'Tema', 'Kumasi', 'Surrounding Zones'];

export default function DeliveryPage({ onNavigate, onToast, cartCount = 0 }) {
  const [selectedCity, setSelectedCity] = useState('All Zones');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSpeedTab, setActiveSpeedTab] = useState('standard'); // 'standard' | 'express'
  const [calculatedZone, setCalculatedZone] = useState(null);
  const [feeCalculatorInput, setFeeCalculatorInput] = useState('');

  // Filtered zones
  const filteredZones = useMemo(() => {
    return DELIVERY_ZONES.filter((zone) => {
      const matchCity = selectedCity === 'All Zones' || zone.city === selectedCity;
      const matchSearch =
        searchQuery === '' ||
        zone.zoneName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        zone.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        zone.coverage.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCity && matchSearch;
    });
  }, [selectedCity, searchQuery]);

  // Handle instant fee estimate check
  const handleCheckArea = (e) => {
    e.preventDefault();
    if (!feeCalculatorInput.trim()) return;
    const q = feeCalculatorInput.trim().toLowerCase();
    const found = DELIVERY_ZONES.find((z) =>
      z.coverage.some((c) => c.toLowerCase().includes(q)) ||
      z.zoneName.toLowerCase().includes(q) ||
      z.city.toLowerCase().includes(q)
    );

    if (found) {
      setCalculatedZone(found);
      if (onToast) onToast(`Coverage found for "${feeCalculatorInput}": GH₵ ${found.fee.toFixed(2)} delivery fee.`);
    } else {
      setCalculatedZone({ notFound: true, query: feeCalculatorInput });
      if (onToast) onToast(`Custom courier dispatch available for "${feeCalculatorInput}". Contact us via WhatsApp.`);
    }
  };

  return (
    <div className="delivery-page-wrapper">
      {/* Top Sticky Header */}
      <header className="delivery-header">
        <div className="delivery-header-inner">
          <button
            type="button"
            className="delivery-back-btn"
            onClick={() => onNavigate && onNavigate('home')}
            aria-label="Back to home"
          >
            <ArrowLeft size={18} />
            <span>Storefront</span>
          </button>

          <div
            className="delivery-brand"
            onClick={() => onNavigate && onNavigate('home')}
            title="Item13 — The Unexpected Essential"
          >
            <img src="/item13Logo-trimmed.png" alt="Item13 Logo" className="delivery-brand-logo" />
            <span className="brand-logo-tagline">THE UNEXPECTED ESSENTIAL</span>
          </div>

          <div className="delivery-header-actions">
            <ThemeToggle />
            <button
              type="button"
              className="delivery-nav-menu-btn"
              onClick={() => onNavigate && onNavigate('menu')}
            >
              <ShoppingBag size={16} />
              <span>Browse Menu</span>
            </button>
            {cartCount > 0 && (
              <button
                type="button"
                className="delivery-bag-chip"
                onClick={() => onNavigate && onNavigate('cart')}
              >
                Bag: {cartCount}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="delivery-hero-section">
        <div className="delivery-hero-container">
          <div className="delivery-hero-badge">
            <Truck size={14} className="hero-badge-icon" />
            <span>TRANSPARENT COURIER RATES &amp; SCHEDULES</span>
          </div>
          <h1 className="delivery-hero-title">
            Delivery Coverage <span className="gold-accent">&amp; Dispatch Zones</span>
          </h1>
          <p className="delivery-hero-desc">
            Hot, crunchy popcorn doesn't like waiting. We maintain dedicated motorbike fleets and thermal insulated couriers across <strong>Accra, Tema, Kumasi, and surrounding regional hubs</strong> with flat, transparent fees and live WhatsApp rider GPS tracking.
          </p>

          {/* Quick Area Lookup Card */}
          <div className="delivery-calculator-box">
            <form onSubmit={handleCheckArea} className="calculator-form">
              <div className="calc-input-wrap">
                <MapPin size={18} className="calc-pin-icon" />
                <input
                  type="text"
                  placeholder="Enter suburb, landmark, or GPS (e.g. East Legon, Sakumono, KNUST, Kasoa)..."
                  value={feeCalculatorInput}
                  onChange={(e) => setFeeCalculatorInput(e.target.value)}
                  className="calc-input"
                />
              </div>
              <button type="submit" className="btn-calc-submit">
                <Search size={16} />
                <span>Estimate Fee &amp; Speed</span>
              </button>
            </form>

            {/* Calculated Area Result Card */}
            {calculatedZone && !calculatedZone.notFound && (
              <div className="calc-result-card">
                <div className="result-left">
                  <div className="result-badge-row">
                    <span className="result-city-badge">{calculatedZone.city}</span>
                    <span className="result-status-badge"><Check size={12} /> {calculatedZone.status}</span>
                  </div>
                  <h3 className="result-zone-title">{calculatedZone.zoneName}</h3>
                  <p className="result-coverage-summary">
                    Includes: {calculatedZone.coverage.slice(0, 4).join(', ')}...
                  </p>
                </div>
                <div className="result-rates">
                  <div className="rate-box">
                    <span className="rate-label">Standard (30-45m)</span>
                    <strong className="rate-price">GH₵ {calculatedZone.fee.toFixed(2)}</strong>
                  </div>
                  <div className="rate-box express">
                    <span className="rate-label">Express Priority</span>
                    <strong className="rate-price">GH₵ {calculatedZone.expressFee.toFixed(2)}</strong>
                  </div>
                  <button
                    type="button"
                    className="btn-order-zone-now"
                    onClick={() => onNavigate && onNavigate('menu')}
                  >
                    <span>Order to this zone</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            )}

            {calculatedZone && calculatedZone.notFound && (
              <div className="calc-result-card not-found">
                <AlertCircle size={24} className="calc-warning-icon" />
                <div className="not-found-copy">
                  <h4>Area: "{calculatedZone.query}"</h4>
                  <p>
                    This location is serviced by our dedicated regional courier. Orders over GH₵150 qualify for subsidized transport.
                  </p>
                </div>
                <button
                  type="button"
                  className="btn-calc-whatsapp"
                  onClick={() => onToast && onToast('WhatsApp dispatch support: +233 54 000 1313')}
                >
                  <Phone size={14} />
                  <span>WhatsApp Rider Line</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Table & Filter Stage */}
      <main className="delivery-main-stage">
        {/* Filter Navigation & Search Bar */}
        <div className="delivery-controls-row">
          <div className="city-pill-tabs">
            {CITIES.map((c) => (
              <button
                key={c}
                type="button"
                className={`city-pill-btn ${selectedCity === c ? 'active' : ''}`}
                onClick={() => setSelectedCity(c)}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="delivery-search-box">
            <Search size={16} className="search-box-icon" />
            <input
              type="text"
              placeholder="Filter by suburb name or town..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="delivery-search-input"
            />
          </div>
        </div>

        {/* Speed Toggle Switcher */}
        <div className="speed-switcher-bar">
          <div className="speed-toggle-group">
            <button
              type="button"
              className={`speed-btn ${activeSpeedTab === 'standard' ? 'active' : ''}`}
              onClick={() => setActiveSpeedTab('standard')}
            >
              <Clock size={15} />
              <span>Standard Warm Dispatch</span>
            </button>
            <button
              type="button"
              className={`speed-btn ${activeSpeedTab === 'express' ? 'active' : ''}`}
              onClick={() => setActiveSpeedTab('express')}
            >
              <Zap size={15} />
              <span>VIP Priority Express (Direct Motorbike)</span>
            </button>
          </div>
          <span className="free-shipping-note">
            <strong>Free Standard Delivery</strong> on all orders meeting the zone threshold!
          </span>
        </div>

        {/* Coverage Fee Table */}
        <div className="table-responsive-wrapper">
          <table className="delivery-fee-table">
            <thead>
              <tr>
                <th>Zone &amp; Covered Areas</th>
                <th>City Hub</th>
                <th>Estimated Speed</th>
                <th>
                  {activeSpeedTab === 'standard' ? 'Standard Fee' : 'Express Priority Fee'}
                </th>
                <th>Free Delivery Threshold</th>
                <th>Dispatch Hours</th>
                <th className="th-action">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredZones.map((zone) => {
                const activeFee = activeSpeedTab === 'standard' ? zone.fee : zone.expressFee;
                const activeSpeed = activeSpeedTab === 'standard' ? zone.standardTime : zone.expressTime;
                return (
                  <tr key={zone.id} className="zone-table-row">
                    <td className="td-zone-info">
                      <strong className="zone-name">{zone.zoneName}</strong>
                      <div className="zone-coverage-pills">
                        {zone.coverage.map((suburb) => (
                          <span key={suburb} className="suburb-chip">
                            {suburb}
                          </span>
                        ))}
                      </div>
                      <span className="zone-highlight-text">{zone.highlights}</span>
                    </td>
                    <td className="td-city">
                      <span className={`city-tag ${zone.city.toLowerCase().replace(/\s+/g, '-')}`}>
                        {zone.city}
                      </span>
                    </td>
                    <td className="td-speed">
                      <div className="speed-cell">
                        <Clock size={14} className="speed-icon" />
                        <strong>{activeSpeed}</strong>
                      </div>
                    </td>
                    <td className="td-fee">
                      <div className="fee-display">
                        <span className="currency">GH₵</span>
                        <span className="amount">{activeFee.toFixed(2)}</span>
                      </div>
                    </td>
                    <td className="td-threshold">
                      <span className="threshold-pill">
                        Orders ≥ GH₵{zone.freeThreshold.toFixed(0)}
                      </span>
                    </td>
                    <td className="td-hours">
                      <span className="hours-text">{zone.dailyWindow}</span>
                    </td>
                    <td className="td-action">
                      <button
                        type="button"
                        className="btn-table-order"
                        onClick={() => onNavigate && onNavigate('menu')}
                      >
                        Order Now
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredZones.length === 0 && (
          <div className="delivery-empty-state">
            <MapPin size={42} className="empty-icon-pin" />
            <h3>No coverage zones matched your search</h3>
            <p>We deliver nationwide across Ghana! Try searching for a neighboring hub or reach out on WhatsApp.</p>
            <button
              type="button"
              className="btn-clear-delivery-filters"
              onClick={() => {
                setSelectedCity('All Zones');
                setSearchQuery('');
              }}
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Packaging & Quality Dispatch Promises Grid */}
        <section className="delivery-promises-section">
          <div className="promises-head">
            <span className="subhead-gold">FRESH TO YOUR DOOR</span>
            <h2>Our Delivery &amp; Packaging Promise</h2>
            <p>Every bucket is treated like a fragile delicacy so it arrives warm, crisp, and never crushed.</p>
          </div>

          <div className="promises-grid">
            {PACKAGING_PROMISES.map((item, idx) => (
              <div key={idx} className="promise-card">
                <div className="promise-icon-bubble">
                  {idx === 0 && <Sparkles size={22} />}
                  {idx === 1 && <ShieldCheck size={22} />}
                  {idx === 2 && <Zap size={22} />}
                  {idx === 3 && <MapPin size={22} />}
                </div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Hub Dispatch Schedules & Operating Windows */}
        <section className="dispatch-schedules-section">
          <div className="schedule-card">
            <div className="schedule-info">
              <h3>Operating Kitchen Hours</h3>
              <p>Popcorn popping machines and caramel boilers operate continuously throughout these windows:</p>
              <div className="schedule-hours-grid">
                <div className="hour-item">
                  <strong>Greater Accra &amp; Suburbs</strong>
                  <span>{DISPATCH_HOURS.accra}</span>
                </div>
                <div className="hour-item">
                  <strong>Tema Metropolis &amp; Kpone</strong>
                  <span>{DISPATCH_HOURS.tema}</span>
                </div>
                <div className="hour-item">
                  <strong>Kumasi Hub &amp; KNUST</strong>
                  <span>{DISPATCH_HOURS.kumasi}</span>
                </div>
                <div className="hour-item">
                  <strong>Surrounding &amp; Regional Couriers</strong>
                  <span>{DISPATCH_HOURS.surrounding}</span>
                </div>
              </div>
            </div>

            <div className="schedule-cta">
              <h4>Planning a movie night or party?</h4>
              <p>Schedule your snack tub delivery in advance to guarantee exact arrival time down to the minute.</p>
              <button
                type="button"
                className="btn-schedule-order"
                onClick={() => onNavigate && onNavigate('menu')}
              >
                <span>Browse Popcorn Menu</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer onNavigate={onNavigate} onToast={onToast} />
    </div>
  );
}

