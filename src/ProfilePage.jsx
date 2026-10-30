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
  Plus,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  UserRound,
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
  total: 'GHS45.00',
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

  const email = user?.email || 'alex.morgan@example.com';
  const accountName = email
    .split('@')[0]
    .split(/[._-]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
  const initials = accountName
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('');

  const notify = (message) => onToast(message);

  const renderOverview = () => (
    <>
      <section className="profile-welcome-card">
        <div className="profile-welcome-copy">
          <span className="profile-eyebrow">YOUR ITEM13 ACCOUNT</span>
          <h2>Good to see you, {accountName.split(' ')[0]}.</h2>
          <p>Your unexpected essential is just a few clicks away.</p>
          <button className="profile-gold-button" onClick={() => onNavigate('home')}>
            <ShoppingBag size={16} /> Explore the menu
          </button>
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
        <button className="profile-stat-card" onClick={() => notify('You have 240 VIP points to use on your next order.')}>
          <span className="profile-stat-icon"><Gift size={18} /></span>
          <span className="profile-stat-value">240</span>
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
        <section className="profile-panel">
          <SectionHeading eyebrow="ACCOUNT DETAILS" title="Personal information" />
          <div className="profile-info-list">
            <div><span>Full name</span><strong>{accountName}</strong></div>
            <div><span>Email address</span><strong>{email}</strong></div>
            <div><span>Phone number</span><strong className="profile-not-set">Not added yet</strong></div>
          </div>
          <button className="profile-outline-button" onClick={() => notify('Profile editing will be available soon.')}>
            Edit details
          </button>
        </section>
        <section className="profile-panel">
          <SectionHeading eyebrow="READY FOR CHECKOUT" title="Your defaults" />
          <div className="profile-default-item">
            <MapPin size={18} />
            <div><strong>Delivery address</strong><span>Add an address for faster checkout</span></div>
            <button aria-label="Add delivery address" onClick={() => setActiveSection('addresses')}><Plus size={17} /></button>
          </div>
          <div className="profile-default-item">
            <CreditCard size={18} />
            <div><strong>Payment method</strong><span>No saved payment methods</span></div>
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
        <h3>No saved addresses yet</h3>
        <p>Add your home or work address and we’ll have it ready for your next order.</p>
        <button className="profile-gold-button" onClick={() => notify('Address form opened.')}><Plus size={16} /> Add your first address</button>
      </section>
    </>
  );

  const renderPayments = () => (
    <>
      <SectionHeading eyebrow="SECURE CHECKOUT" title="Payment methods" description="Manage your saved cards and billing preferences." action="Add payment" onAction={() => notify('Secure payment setup is not connected in this demo.')} />
      <section className="profile-panel profile-empty-panel">
        <div className="profile-empty-icon"><CreditCard size={22} /></div>
        <h3>No saved payment methods</h3>
        <p>Your payment details are encrypted and never shown in full.</p>
        <button className="profile-gold-button" onClick={() => notify('Secure payment setup is not connected in this demo.')}><Plus size={16} /> Add a payment method</button>
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
          <div className="profile-setting-copy"><strong>Saved favorites</strong><span>Four delicious picks saved for your next movie night.</span></div>
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
        <button className="profile-support-card" onClick={() => notify('A support chat will be available soon.')}>
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
        <button className="profile-back-link" onClick={() => onNavigate('home')}><ArrowLeft size={16} /> Back to store</button>
      </header>

      <main className="profile-layout">
        <div className="profile-page-intro">
          <div>
            <span className="profile-eyebrow">VIP CINEMA CLUB MEMBER</span>
            <h1>My account</h1>
          </div>
          <button className="profile-logout-button" onClick={onSignOut}>Sign out</button>
        </div>

        <div className="profile-dashboard">
          <aside className="profile-sidebar">
            <div className="profile-member-card">
              <div className="profile-avatar">{initials}</div>
              <div className="profile-member-copy"><strong>{accountName}</strong><span>{email}</span></div>
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
        <footer className="profile-footer">© 2026 Item13 <span>·</span> The unexpected esscential</footer>
      </main>
    </div>
  );
}

export default ProfilePage;
