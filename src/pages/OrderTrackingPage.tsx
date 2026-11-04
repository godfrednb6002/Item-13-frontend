import { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowUpRight,
  Bell,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleHelp,
  Clock3,
  Download,
  MapPin,
  Package,
  Truck,
} from 'lucide-react';
import '../styles/pages/order-tracking.css';

type OrderStatus = 'Order Placed' | 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled';

type OrderItem = {
  id: string;
  name: string;
  variant: string;
  quantity: number;
  price: number;
  image: string;
};

export type Order = {
  id: string;
  customer: { name: string; email: string; phone: string };
  orderDate: string;
  expectedDelivery: string;
  status: OrderStatus;
  carrier: string;
  trackingNumber: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  promoCode: string;
  tax: number;
  total: number;
  paymentMethod: string;
  shippingAddress: string[];
  billingAddress: string[];
  shippingLog: { time: string; date: string; location: string; detail: string; complete: boolean }[];
};

export const mockOrder: Order = {
  id: 'ORD-948271',
  customer: { name: 'John Mensah', email: 'john.mensah@example.com', phone: '+233 24 555 0184' },
  orderDate: 'November 3, 2026 · 10:14 AM',
  expectedDelivery: 'Nov 5 – Nov 6',
  status: 'Shipped',
  carrier: 'FedEx',
  trackingNumber: 'FX-2849-6301-7752',
  items: [
    { id: 'classic-combo', name: 'Classic Popcorn & Drink Combo', variant: 'Buttered · Cola + Fanta', quantity: 2, price: 45, image: '/WhatsApp Image 2026-10-29 at 4.31.43 PM-Photoroom.png' },
    { id: 'bistro-popcorn', name: 'Bistro Popcorn', variant: 'Sea salt · Large', quantity: 1, price: 12.9, image: '/bistro-popcorn.jpg' },
  ],
  subtotal: 102.9,
  shipping: 0,
  discount: 10.29,
  promoCode: 'ITEM13',
  tax: 13.89,
  total: 106.5,
  paymentMethod: 'Visa ending in 4242',
  shippingAddress: ['John Mensah', '14 Osu Badu Street', 'Osu, Accra', 'Greater Accra Region'],
  billingAddress: ['John Mensah', '14 Osu Badu Street', 'Osu, Accra', 'Greater Accra Region'],
  shippingLog: [
    { time: '10:30 AM', date: 'Nov 4', location: 'Accra, Ghana', detail: 'Package arrived at the regional facility', complete: true },
    { time: '8:12 AM', date: 'Nov 4', location: 'Accra, Ghana', detail: 'Your package is on its way to the regional facility', complete: true },
    { time: '4:45 PM', date: 'Nov 3', location: 'Item13 · Accra', detail: 'Package picked up by FedEx', complete: true },
    { time: '10:14 AM', date: 'Nov 3', location: 'Item13 · Accra', detail: 'Order placed and confirmed', complete: true },
  ],
};

const steps: OrderStatus[] = ['Order Placed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];

function formatPrice(amount: number) {
  return `GH₵${amount.toFixed(2)}`;
}

function ProgressTracker({ status }: { status: OrderStatus }) {
  const activeStep = steps.indexOf(status);

  return (
    <ol className="order-progress" aria-label="Order progress">
      {steps.map((step, index) => {
        const complete = activeStep >= 0 && index < activeStep;
        const current = step === status;
        return (
          <li className={`order-progress-step${complete ? ' is-complete' : ''}${current ? ' is-current' : ''}`} key={step}>
            <span className="order-progress-marker" aria-hidden="true">
              {complete ? <Check size={14} /> : index + 1}
            </span>
            <span className="order-progress-label">{step}</span>
          </li>
        );
      })}
    </ol>
  );
}

function SectionTitle({ eyebrow, title, id }: { eyebrow: string; title: string; id: string }) {
  return (
    <div className="order-section-title">
      <span>{eyebrow}</span>
      <h2 id={id}>{title}</h2>
    </div>
  );
}

export default function OrderTrackingPage({
  order = mockOrder,
  onBack,
}: {
  order?: Order;
  onBack?: () => void;
}) {
  const [shippingLogOpen, setShippingLogOpen] = useState(false);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [whatsappAlerts, setWhatsappAlerts] = useState(false);
  const [status, setStatus] = useState<OrderStatus>(order.status);
  const [notice, setNotice] = useState('');
  const purchaseEventSent = useRef(false);

  useEffect(() => {
    if (purchaseEventSent.current) return;
    purchaseEventSent.current = true;
    // TODO: Fire the GA4 purchase event here once, after initial order confirmation; never from tracker polling or rerenders.
  }, []);

  const canCancel = status === 'Order Placed' || status === 'Processing';
  const firstName = order.customer.name.split(' ')[0];

  const copyTrackingNumber = async () => {
    try {
      await navigator.clipboard.writeText(order.trackingNumber);
      setNotice('Tracking number copied.');
    } catch {
      setNotice(`Tracking number: ${order.trackingNumber}`);
    }
  };

  const cancelOrder = () => {
    setStatus('Cancelled');
    setNotice('Your order has been cancelled.');
  };

  return (
    <main className="order-page">
      <header className="order-topbar">
        <button className="order-back-button" type="button" onClick={onBack ?? (() => { window.location.href = '/'; })}>
          <ArrowLeft size={17} aria-hidden="true" />
          <span>Back to shop</span>
        </button>
        <a className="order-brand" href="/" aria-label="Item13 home">
          <img src="/item13Logo-trimmed.png" alt="" />
          <span>ITEM13 <small>ORDER CARE</small></span>
        </a>
        <a className="order-help-link" href="mailto:support@item13.com">
          <CircleHelp size={17} aria-hidden="true" />
          <span>Help</span>
        </a>
      </header>

      <div className="order-layout">
        <section className="order-intro" aria-labelledby="order-heading">
          <div className="order-confirmation-icon"><CheckCircle2 size={26} aria-hidden="true" /></div>
          <p className="order-eyebrow">ORDER CONFIRMED</p>
          <h1 id="order-heading">Thank you, {firstName}!</h1>
          <p className="order-intro-copy">We’ve got your order and we’ll keep you posted every step of the way.</p>
          <div className="order-meta">
            <span>Order <strong>#{order.id}</strong></span>
            <span className="order-meta-dot" aria-hidden="true" />
            <span>Placed {order.orderDate}</span>
          </div>
          <div className="order-delivery-banner">
            <div className="order-delivery-icon"><Truck size={21} aria-hidden="true" /></div>
            <div>
              <span>YOUR ESTIMATED DELIVERY</span>
              <strong>{order.expectedDelivery}</strong>
            </div>
            <span className="order-delivery-status"><span aria-hidden="true" /> {status === 'Cancelled' ? 'Cancelled' : 'On the way'}</span>
          </div>
        </section>

        <div className="order-content-grid">
          <div className="order-primary-column">
            <section className="order-card order-tracking-card" aria-labelledby="tracking-heading">
              <div className="order-card-heading">
                <SectionTitle eyebrow="THE JOURNEY" title="Track your order" id="tracking-heading" />
                <span className="order-status-badge"><span aria-hidden="true" /> {status}</span>
              </div>
              <ProgressTracker status={status} />
              <div className="order-carrier-row">
                <div className="order-carrier-icon"><Package size={18} aria-hidden="true" /></div>
                <div className="order-carrier-copy">
                  <span>DELIVERED BY</span>
                  <strong>{order.carrier}</strong>
                </div>
                <button className="order-tracking-number" type="button" onClick={copyTrackingNumber} aria-label={`Copy tracking number ${order.trackingNumber}`}>
                  {order.trackingNumber}<ArrowUpRight size={14} aria-hidden="true" />
                </button>
              </div>
              <button
                className="order-log-toggle"
                type="button"
                aria-expanded={shippingLogOpen}
                aria-controls="order-shipping-log"
                onClick={() => setShippingLogOpen((open) => !open)}
              >
                <span><Clock3 size={16} aria-hidden="true" /> Detailed shipping log</span>
                <ChevronDown className={shippingLogOpen ? 'is-rotated' : ''} size={17} aria-hidden="true" />
              </button>
              {shippingLogOpen && (
                <ol className="order-shipping-log" id="order-shipping-log">
                  {order.shippingLog.map((event, index) => (
                    <li className={event.complete ? 'is-complete' : ''} key={`${event.date}-${event.time}-${index}`}>
                      <span className="order-log-marker" aria-hidden="true" />
                      <div>
                        <strong>{event.detail}</strong>
                        <span>{event.location}</span>
                      </div>
                      <time>{event.date} · {event.time}</time>
                    </li>
                  ))}
                </ol>
              )}
            </section>

            <section className="order-card" aria-labelledby="items-heading">
              <div className="order-card-heading">
                <SectionTitle eyebrow="IN THE BAG" title="Your items" id="items-heading" />
                <span className="order-item-count">{order.items.reduce((sum, item) => sum + item.quantity, 0)} items</span>
              </div>
              <ul className="order-items-list">
                {order.items.map((item) => (
                  <li className="order-item" key={item.id}>
                    <div className="order-item-image"><img src={item.image} alt="" /></div>
                    <div className="order-item-copy">
                      <strong>{item.name}</strong>
                      <span>{item.variant}</span>
                      <span>Qty {item.quantity}</span>
                    </div>
                    <strong className="order-item-price">{formatPrice(item.price * item.quantity)}</strong>
                  </li>
                ))}
              </ul>
            </section>

            <section className="order-card" aria-labelledby="addresses-heading">
              <div className="order-card-heading">
                <SectionTitle eyebrow="DELIVERY DETAILS" title="Addresses" id="addresses-heading" />
              </div>
              <div className="order-address-grid">
                <address className="order-address">
                  <span><MapPin size={16} aria-hidden="true" /> SHIPPING ADDRESS</span>
                  {order.shippingAddress.map((line) => <strong key={line}>{line}</strong>)}
                </address>
                <address className="order-address">
                  <span><MapPin size={16} aria-hidden="true" /> BILLING ADDRESS</span>
                  {order.billingAddress.map((line) => <strong key={line}>{line}</strong>)}
                </address>
              </div>
              <div className="order-contact-details">
                <span>Updates sent to</span>
                <a href={`mailto:${order.customer.email}`}>{order.customer.email}</a>
                <a href={`tel:${order.customer.phone.replace(/\s/g, '')}`}>{order.customer.phone}</a>
              </div>
            </section>
          </div>

          <aside className="order-side-column" aria-label="Order payment and actions">
            <section className="order-card order-total-card" aria-labelledby="total-heading">
              <SectionTitle eyebrow="YOUR ORDER" title="Payment summary" id="total-heading" />
              <dl className="order-cost-breakdown">
                <div><dt>Subtotal</dt><dd>{formatPrice(order.subtotal)}</dd></div>
                <div><dt>Shipping</dt><dd>{order.shipping === 0 ? 'Free' : formatPrice(order.shipping)}</dd></div>
                <div><dt>Discount <span>{order.promoCode}</span></dt><dd className="order-discount">−{formatPrice(order.discount)}</dd></div>
                <div><dt>Tax</dt><dd>{formatPrice(order.tax)}</dd></div>
              </dl>
              <div className="order-grand-total"><span>Total paid</span><strong>{formatPrice(order.total)}</strong></div>
              <div className="order-payment-method">
                <span className="order-payment-card-icon">▰</span>
                <div><span>PAID WITH</span><strong>{order.paymentMethod}</strong></div>
                <CheckCircle2 size={17} aria-label="Payment confirmed" />
              </div>
            </section>

            <section className="order-card order-alerts-card" aria-labelledby="alerts-heading">
              <div className="order-alerts-title"><Bell size={17} aria-hidden="true" /><h2 id="alerts-heading">Delivery updates</h2></div>
              <p>Choose how you’d like to hear from us.</p>
              <label className="order-alert-option">
                <input type="checkbox" checked={smsAlerts} onChange={(event) => setSmsAlerts(event.target.checked)} />
                <span className="order-checkbox" aria-hidden="true"><Check size={12} /></span>
                <span>SMS alerts <small>{order.customer.phone}</small></span>
              </label>
              <label className="order-alert-option">
                <input type="checkbox" checked={whatsappAlerts} onChange={(event) => setWhatsappAlerts(event.target.checked)} />
                <span className="order-checkbox" aria-hidden="true"><Check size={12} /></span>
                <span>WhatsApp alerts <small>Same number as above</small></span>
              </label>
            </section>

            <div className="order-actions">
              <button type="button" className="order-action-primary" onClick={() => window.print()}>
                <Download size={17} aria-hidden="true" /> Download invoice
              </button>
              <a className="order-action-secondary" href="mailto:support@item13.com?subject=Help%20with%20order">
                <CircleHelp size={17} aria-hidden="true" /> Need help?
              </a>
              {canCancel && (
                <button type="button" className="order-cancel-button" onClick={cancelOrder}>
                  Cancel order
                </button>
              )}
            </div>
          </aside>
        </div>
        <p className="order-footer-note">Made with care, packed with joy. <span>♥</span></p>
      </div>
      <div className="order-live-notice" role="status" aria-live="polite">{notice}</div>
      <div className="order-mobile-bar" aria-label={`Order total ${formatPrice(order.total)}`}>
        <span>Total paid <strong>{formatPrice(order.total)}</strong></span>
        <button type="button" onClick={() => window.print()}><Download size={16} aria-hidden="true" /> Invoice</button>
      </div>
    </main>
  );
}
