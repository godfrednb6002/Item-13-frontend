import { useState } from 'react';
import {
  ArrowDownToLine,
  ArrowLeft,
  ArrowRight,
  Bell,
  BookOpen,
  Check,
  ChevronRight,
  CircleHelp,
  CreditCard,
  Gift,
  Heart,
  Lock,
  MapPin,
  Package,
  Pencil,
  Plus,
  Save,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  UserRound,
  X,
} from 'lucide-react';

const navigation = [
  { id: 'overview', label: 'Overview', icon: UserRound },
  { id: 'orders', label: 'Orders & returns', icon: Package },
  { id: 'addresses', label: 'Addresses', icon: MapPin },
  { id: 'payments', label: 'Payments', icon: CreditCard },
  { id: 'preferences', label: 'Preferences', icon: Heart },
  { id: 'security', label: 'Security', icon: ShieldCheck },
  { id: 'support', label: 'Help & support', icon: CircleHelp },
];

const recentOrder = {
  number: 'I13-20481',
  date: 'October 24, 2026',
  status: 'On its way',
  items: 'Classic Popcorn & Drink Combo',
  total: 'GH₵ 45.00',
};

function SectionHeading({ eyebrow, title, description, action, onAction }) {
  return (
    <div className="profile-section-heading">
      <div>
        {eyebrow && <span className="profile-eyebrow">{eyebrow}</span>}
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {action && (
        <button className="profile-text-button" onClick={onAction}>
          {action} <ArrowRight size={15} />
        </button>
      )}
    </div>
  );
}

function ProfilePage({ user, onNavigate, onSignOut, onToast }) {
  const [activeSection, setActiveSection] = useState('overview');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [smsUpdates, setSmsUpdates] = useState(false);

  // Editable Profile States
  const [isEditing, setIsEditing] = useState(false);
  const initialName = user?.name || (user?.email
    ? user.email
        .split('@')[0]
        .split(/[._-]/)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ')
    : 'Kofi Mensah');
  
  const [fullName, setFullName] = useState(initialName);
  const [email, setEmail] = useState(user?.email || 'customer@item13.com');
  const [phoneNumber, setPhoneNumber] = useState('+233 54 123 4567');
  const [city, setCity] = useState('Accra (Greater Accra)');

  // Temporary edit buffer
  const [tempFullName, setTempFullName] = useState(fullName);
  const [tempEmail, setTempEmail] = useState(email);
  const [tempPhoneNumber, setTempPhoneNumber] = useState(phoneNumber);
  const [tempCity, setTempCity] = useState(city);

  const initials = fullName
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'IM';

  const notify = (message) => onToast && onToast(message);

  const handleStartEdit = () => {
    setTempFullName(fullName);
    setTempEmail(email);
    setTempPhoneNumber(phoneNumber);
    setTempCity(city);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSaveProfile = (e) => {
    if (e) e.preventDefault();
    setFullName(tempFullName);
    setEmail(tempEmail);
    setPhoneNumber(tempPhoneNumber);
    setCity(tempCity);
    setIsEditing(false);
    notify('Profile details updated successfully!');
  };

  const renderOverview = () => (
    <>
      <section className="profile-welcome-card">
        <div className="profile-welcome-copy">
          <span className="profile-eyebrow">YOUR ITEM13 ACCOUNT</span>
          <h2>Good to see you, {fullName.split(' ')[0]}.</h2>
          <p>Your unexpected essential is hot, fresh, and ready for delivery.</p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '12px' }}>
            <button className="profile-gold-button" onClick={() => onNavigate('menu')}>
              <ShoppingBag size={16} /> Order popcorn now
            </button>
            <button
              className="profile-outline-button"
              onClick={() => onNavigate('welcome')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <ArrowLeft size={15} /> Back to dashboard
            </button>
          </div>
        </div>
        <div className="profile-welcome-art" aria-hidden="true">
        </div>
      </section>

      <div className="profile-stat-grid">
        <button className="profile-stat-card" onClick={() => setActiveSection('orders')}>
          <span className="profile-stat-icon"><Package size={18} /></span>
          <span className="profile-stat-value">3</span>
          <span className="profile-stat-label">Orders placed</span>
          <ChevronRight size={16} className="profile-stat-arrow" />
        </button>
        <button className="profile-stat-card" onClick={() => notify('You have 280 VIP loyalty points (GH₵ 15 voucher available).')}>
          <span className="profile-stat-icon"><Gift size={18} /></span>
          <span className="profile-stat-value">280</span>
          <span className="profile-stat-label">VIP points</span>
          <ChevronRight size={16} className="profile-stat-arrow" />
        </button>
        <button className="profile-stat-card" onClick={() => setActiveSection('preferences')}>
          <span className="profile-stat-icon"><Heart size={18} /></span>
          <span className="profile-stat-value">4</span>
          <span className="profile-stat-label">Saved favorites</span>
          <ChevronRight size={16} className="profile-stat-arrow" />
        </button>
      </div>

      <section className="profile-panel">
        <SectionHeading
          eyebrow="THE LATEST"
          title="Your recent order"
          action="View all orders"
          onAction={() => setActiveSection('orders')}
        />
        <div className="profile-order-row">
          <div className="profile-order-icon"><ShoppingBag size={20} /></div>
          <div className="profile-order-main">
            <div className="profile-order-title-line">
              <strong>{recentOrder.items}</strong>
              <span className="profile-status-pill"><span />{recentOrder.status}</span>
            </div>
            <span>Order {recentOrder.number} <i /> {recentOrder.date}</span>
          </div>
          <strong className="profile-order-total">{recentOrder.total}</strong>
          <button
            className="profile-icon-button"
            aria-label="View order details"
            onClick={() => notify(`Order ${recentOrder.number} is on its way.`)}
          >
            <ChevronRight size={18} />
          </button>
        </div>
        <div className="profile-tracking">
          <div className="profile-tracking-line"><span /></div>
          <div className="profile-tracking-labels">
            <span className="is-complete">Order confirmed</span>
            <span className="is-current">On its way</span>
            <span>Delivered</span>
          </div>
        </div>
      </section>

      <div className="profile-two-column">
        {/* Personal Information with Pencil Edit Icon */}
        <section className="profile-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div>
              <span className="profile-eyebrow">ACCOUNT DETAILS</span>
              <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#ffffff', margin: 0 }}>
                Personal information
              </h2>
            </div>
            {!isEditing && (
              <button
                className="profile-outline-button"
                onClick={handleStartEdit}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  borderColor: 'var(--gold)',
                  color: 'var(--gold)',
                  cursor: 'pointer'
                }}
                title="Edit your details"
              >
                <Pencil size={15} />
                <span>Edit</span>
              </button>
            )}
          </div>

          {!isEditing ? (
            <>
              <div className="profile-info-list">
                <div>
                  <span>Full name</span>
                  <strong>{fullName}</strong>
                </div>
                <div>
                  <span>Email address</span>
                  <strong>{email}</strong>
                </div>
                <div>
                  <span>Phone number (MoMo &amp; Delivery)</span>
                  <strong>{phoneNumber}</strong>
                </div>
                <div>
                  <span>Default City</span>
                  <strong>{city}</strong>
                </div>
              </div>
              <button
                className="profile-outline-button"
                onClick={handleStartEdit}
                style={{ marginTop: '16px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                <Pencil size={14} /> Edit details
              </button>
            </>
          ) : (
            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#a0a3ad', marginBottom: '6px', textTransform: 'uppercase' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={tempFullName}
                  onChange={(e) => setTempFullName(e.target.value)}
                  className="dash-input"
                  style={{ width: '100%' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#a0a3ad', marginBottom: '6px', textTransform: 'uppercase' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  value={tempEmail}
                  onChange={(e) => setTempEmail(e.target.value)}
                  className="dash-input"
                  style={{ width: '100%' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#a0a3ad', marginBottom: '6px', textTransform: 'uppercase' }}>
                  Phone Number (Mobile Money &amp; Delivery)
                </label>
                <input
                  type="tel"
                  value={tempPhoneNumber}
                  onChange={(e) => setTempPhoneNumber(e.target.value)}
                  className="dash-input"
                  style={{ width: '100%' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#a0a3ad', marginBottom: '6px', textTransform: 'uppercase' }}>
                  Default City
                </label>
                <select
                  value={tempCity}
                  onChange={(e) => setTempCity(e.target.value)}
                  className="dash-input"
                  style={{ width: '100%' }}
                >
                  <option value="Accra (Greater Accra)">Accra (Greater Accra)</option>
                  <option value="Tema">Tema</option>
                  <option value="Kumasi">Kumasi</option>
                  <option value="Takoradi">Takoradi</option>
                  <option value="Other Region">Other Region</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                <button
                  type="submit"
                  className="profile-gold-button"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <Save size={15} /> Save Changes
                </button>
                <button
                  type="button"
                  className="profile-outline-button"
                  onClick={handleCancelEdit}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <X size={15} /> Cancel
                </button>
              </div>
            </form>
          )}
        </section>

        <section className="profile-panel">
          <SectionHeading eyebrow="READY FOR CHECKOUT" title="Your defaults" />
          <div className="profile-default-item">
            <MapPin size={18} />
            <div><strong>Delivery address</strong><span>East Legon, Accra (GA-182-9021)</span></div>
            <button aria-label="Add delivery address" onClick={() => setActiveSection('addresses')}><Plus size={17} /></button>
          </div>
          <div className="profile-default-item">
            <CreditCard size={18} />
            <div><strong>Payment method</strong><span>MTN Mobile Money (*4567)</span></div>
            <button aria-label="Add payment method" onClick={() => setActiveSection('payments')}><Plus size={17} /></button>
          </div>
        </section>
      </div>
    </>
  );

  const renderOrders = () => (
    <>
      <SectionHeading eyebrow="YOUR PURCHASES" title="Orders & returns" description="Track deliveries, review past orders, and manage returns." />
      <section className="profile-panel">
        <div className="profile-order-row">
          <div className="profile-order-icon"><ShoppingBag size={20} /></div>
          <div className="profile-order-main">
            <div className="profile-order-title-line">
              <strong>{recentOrder.items}</strong>
              <span className="profile-status-pill"><span />{recentOrder.status}</span>
            </div>
            <span>Order {recentOrder.number} <i /> {recentOrder.date}</span>
          </div>
          <strong className="profile-order-total">{recentOrder.total}</strong>
          <button className="profile-icon-button" aria-label="Track order" onClick={() => notify(`Order ${recentOrder.number} is on its way.`)}>
            <ChevronRight size={18} />
          </button>
        </div>
        <div className="profile-order-actions">
          <button className="profile-outline-button" onClick={() => notify('Your order tracking details are up to date.')}>Track order</button>
          <button className="profile-outline-button" onClick={() => notify('Your receipt is ready to download.')}>
            <ArrowDownToLine size={15} /> Receipt
          </button>
          <button className="profile-outline-button" onClick={() => notify('This order is not currently eligible for a return.')}>Start a return</button>
        </div>
      </section>
      <div className="profile-empty-order">
        <Check size={17} /> You’re all caught up. Your earlier orders will show here.
      </div>
    </>
  );

  const renderAddresses = () => (
    <>
      <SectionHeading eyebrow="DELIVERY DETAILS" title="Your addresses" description="Save delivery locations for a quicker checkout." action="Add address" onAction={() => notify('Address form opened.')} />
      <section className="profile-panel profile-empty-panel">
        <div className="profile-empty-icon"><MapPin size={22} /></div>
        <h3>Saved addresses</h3>
        <p>East Legon, Accra (GA-182-9021) • Primary</p>
        <button className="profile-gold-button" onClick={() => notify('Address form opened.')}><Plus size={16} /> Add another address</button>
      </section>
    </>
  );

  const renderPayments = () => (
    <>
      <SectionHeading eyebrow="SECURE CHECKOUT" title="Payment methods" description="Manage your saved cards and MoMo accounts." action="Add payment" onAction={() => notify('Secure payment setup is active.')} />
      <section className="profile-panel profile-empty-panel">
        <div className="profile-empty-icon"><CreditCard size={22} /></div>
        <h3>MTN Mobile Money</h3>
        <p>Linked number: {phoneNumber} • Instant Popcorn Checkout</p>
        <button className="profile-gold-button" onClick={() => notify('Payment method setup opened.')}><Plus size={16} /> Add another payment method</button>
      </section>
      <p className="profile-security-note"><ShieldCheck size={16} /> Payment information is securely protected.</p>
    </>
  );

  const renderPreferences = () => (
    <>
      <SectionHeading eyebrow="MAKE IT YOURS" title="Preferences" description="Choose how Item13 keeps you in the loop and personalizes your store." />
      <section className="profile-panel profile-settings-panel">
        <div className="profile-setting-row">
          <div className="profile-setting-icon"><Bell size={18} /></div>
          <div className="profile-setting-copy"><strong>Email updates</strong><span>Offers, new menu items, and member-only perks.</span></div>
          <button className={`profile-toggle ${emailUpdates ? 'is-on' : ''}`} role="switch" aria-checked={emailUpdates} aria-label="Email updates" onClick={() => setEmailUpdates(!emailUpdates)}><span /></button>
        </div>
        <div className="profile-setting-row">
          <div className="profile-setting-icon"><Bell size={18} /></div>
          <div className="profile-setting-copy"><strong>SMS notifications</strong><span>Order updates and delivery alerts by text.</span></div>
          <button className={`profile-toggle ${smsUpdates ? 'is-on' : ''}`} role="switch" aria-checked={smsUpdates} aria-label="SMS notifications" onClick={() => setSmsUpdates(!smsUpdates)}><span /></button>
        </div>
        <div className="profile-setting-row">
          <div className="profile-setting-icon"><Heart size={18} /></div>
          <div className="profile-setting-copy"><strong>Saved favorites</strong><span>Double Butter, Suya Pepper, Salted Caramel Popcorn.</span></div>
          <button className="profile-text-button" onClick={() => notify('Your saved favorites are ready to explore.')}>View favorites <ArrowRight size={15} /></button>
        </div>
      </section>
    </>
  );

  const renderSecurity = () => (
    <>
      <SectionHeading eyebrow="PROTECT YOUR ACCOUNT" title="Security" description="Review your sign-in settings and keep your account safe." />
      <section className="profile-panel profile-settings-panel">
        <div className="profile-setting-row">
          <div className="profile-setting-icon"><ShieldCheck size={18} /></div>
          <div className="profile-setting-copy"><strong>Two-factor authentication</strong><span>Add an extra layer of protection when you sign in.</span></div>
          <button className={`profile-toggle ${twoFactorEnabled ? 'is-on' : ''}`} role="switch" aria-checked={twoFactorEnabled} aria-label="Two-factor authentication" onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}><span /></button>
        </div>
        <div className="profile-setting-row">
          <div className="profile-setting-icon"><Lock size={18} /></div>
          <div className="profile-setting-copy"><strong>Password</strong><span>Last updated recently. Change it regularly to stay secure.</span></div>
          <button className="profile-outline-button" onClick={() => notify('Password reset instructions will be sent to your email.')}>Change</button>
        </div>
        <div className="profile-setting-row">
          <div className="profile-setting-icon"><UserRound size={18} /></div>
          <div className="profile-setting-copy"><strong>Recent sign-in</strong><span>This device · Current session</span></div>
          <span className="profile-current-session">Current</span>
        </div>
      </section>
      <p className="profile-security-note"><ShieldCheck size={16} /> If you don’t recognize an activity, change your password and contact support.</p>
    </>
  );

  const renderSupport = () => (
    <>
      <SectionHeading eyebrow="WE’RE HERE TO HELP" title="Help & support" description="Find answers or get a hand from our customer care team." />
      <div className="profile-support-grid">
        <button className="profile-support-card" onClick={() => notify('Support chat: We are available Monday to Sunday, 9am - 10pm.')}>
          <span className="profile-support-icon"><CircleHelp size={20} /></span>
          <strong>Chat with us</strong><span>Get help with an order or account.</span><ArrowRight size={16} />
        </button>
        <button className="profile-support-card" onClick={() => notify('Opening the Item13 help center.')}>
          <span className="profile-support-icon"><BookOpen size={20} /></span>
          <strong>Visit help center</strong><span>Shipping, returns, and account FAQs.</span><ArrowRight size={16} />
        </button>
      </div>
      <section className="profile-panel profile-ticket-panel">
        <h3>Recent support requests</h3>
        <p>You don’t have any open support tickets.</p>
        <button className="profile-text-button" onClick={() => notify('A support request form will be available soon.')}>Contact customer care <ArrowRight size={15} /></button>
      </section>
    </>
  );

  const content = {
    overview: renderOverview,
    orders: renderOrders,
    addresses: renderAddresses,
    payments: renderPayments,
    preferences: renderPreferences,
    security: renderSecurity,
    support: renderSupport,
  }[activeSection];

  return (
    <div className="profile-page">
      <header className="profile-topbar">
        <button className="profile-brand" onClick={() => onNavigate('home')} aria-label="Item13 home">
          <img src="/item13Logo-trimmed.png" alt="Item13" />
          <span>THE UNEXPECTED ESSENTIAL</span>
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button className="profile-back-link" onClick={() => onNavigate('welcome')}>
            <ArrowLeft size={16} /> Back to dashboard
          </button>
          <button className="profile-back-link" onClick={() => onNavigate('home')}>
            Storefront
          </button>
        </div>
      </header>

      <main className="profile-layout">
        <div className="profile-page-intro">
          <div>
            <span className="profile-eyebrow">VIP SNACK CLUB MEMBER</span>
            <h1>My account</h1>
          </div>
          <button className="profile-logout-button" onClick={onSignOut}>Sign out</button>
        </div>

        <div className="profile-dashboard">
          <aside className="profile-sidebar">
            <div className="profile-member-card">
              <div className="profile-avatar">{initials}</div>
              <div className="profile-member-copy">
                <strong>{fullName}</strong>
                <span>{email}</span>
              </div>
              <span className="profile-member-badge"><Sparkles size={12} /> VIP MEMBER</span>
            </div>
            <nav className="profile-nav" aria-label="Account sections">
              {navigation.map(({ id, label, icon: Icon }) => (
                <button key={id} className={`profile-nav-item ${activeSection === id ? 'is-active' : ''}`} onClick={() => setActiveSection(id)}>
                  <Icon size={17} /><span>{label}</span>{activeSection === id && <ChevronRight size={15} />}
                </button>
              ))}
            </nav>
            <div className="profile-sidebar-help">
              <CircleHelp size={17} />
              <div><strong>Need a hand?</strong><span>We’re here for you.</span></div>
              <button onClick={() => setActiveSection('support')} aria-label="Go to support"><ArrowRight size={15} /></button>
            </div>
          </aside>

          <div className="profile-content" key={activeSection}>
            {content()}
          </div>
        </div>
        <footer className="profile-footer">© 2026 Item13 <span>·</span> The Unexpected Essential</footer>
      </main>
    </div>
  );
}

export default ProfilePage;
