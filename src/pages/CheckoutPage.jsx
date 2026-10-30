import { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  LockKeyhole,
  MapPin,
  ShieldCheck,
  ShoppingBag,
} from 'lucide-react';

const FREE_SHIPPING_THRESHOLD = 80;
const TAX_RATE = 0.15;
const DELIVERY_FEES = { standard: 8, express: 20, pickup: 0 };

const formatPrice = (amount) =>
  `GH₵${amount.toLocaleString('en-GH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

function getDeliveryDate(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toLocaleDateString('en-GH', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

function Field({ label, name, value, onChange, onBlur, error, ...props }) {
  const id = `checkout-${name}`;
  return (
    <label className={`checkout-field${error ? ' has-error' : ''}`} htmlFor={id}>
      <span>{label}</span>
      <input
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      />
      {error && <small id={`${id}-error`} role="alert">{error}</small>}
    </label>
  );
}

export default function CheckoutPage({
  items,
  onBack,
  onUpdateQuantity,
  onPlaceOrder,
  customer,
  confirmation,
}) {
  const [values, setValues] = useState({
    name: customer?.name || '',
    email: customer?.email || '',
    phone: '',
    billingAddress: '',
    billingCity: '',
    billingRegion: '',
    billingPostal: '',
    shippingAddress: '',
    shippingCity: '',
    shippingRegion: '',
    shippingPostal: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    mobileMoneyNumber: '',
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [sameAsBilling, setSameAsBilling] = useState(true);
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoFeedback, setPromoFeedback] = useState('');
  const [faqOpen, setFaqOpen] = useState(false);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );
  const discount = promoApplied ? subtotal * 0.1 : 0;
  const shipping = shippingMethod === 'standard' && subtotal >= FREE_SHIPPING_THRESHOLD
    ? 0
    : DELIVERY_FEES[shippingMethod];
  const tax = Math.max(0, subtotal - discount) * TAX_RATE;
  const total = subtotal - discount + shipping + tax;

  const requiredFields = [
    'name', 'email', 'phone',
    ...(shippingMethod === 'pickup'
      ? []
      : [
        'billingAddress', 'billingCity', 'billingRegion',
        ...(sameAsBilling ? [] : ['shippingAddress', 'shippingCity', 'shippingRegion']),
      ]),
    ...(paymentMethod === 'card' ? ['cardNumber', 'cardExpiry', 'cardCvc'] : []),
    ...(paymentMethod === 'mobile-money' ? ['mobileMoneyNumber'] : []),
  ];

  const validateField = (name, value) => {
    if (requiredFields.includes(name) && !value.trim()) return 'This field is required.';
    if (name === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return 'Enter a valid email address.';
    }
    if (name === 'phone' && value && value.replace(/\D/g, '').length < 9) {
      return 'Enter a valid phone number.';
    }
    if (name === 'cardNumber' && value && value.replace(/\D/g, '').length < 12) {
      return 'Enter a valid card number.';
    }
    if (name === 'cardExpiry' && value && !/^(0[1-9]|1[0-2])\/\d{2}$/.test(value)) {
      return 'Use MM/YY format.';
    }
    if (name === 'cardCvc' && value && !/^\d{3,4}$/.test(value)) {
      return 'Enter a valid security code.';
    }
    return '';
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    let nextValue = value;
    if (name === 'cardNumber') {
      nextValue = value.replace(/\D/g, '').slice(0, 19).replace(/(.{4})/g, '$1 ').trim();
    } else if (name === 'cardExpiry') {
      const digits = value.replace(/\D/g, '').slice(0, 4);
      nextValue = digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
    } else if (name === 'cardCvc') {
      nextValue = value.replace(/\D/g, '').slice(0, 4);
    }

    setValues((current) => ({ ...current, [name]: nextValue }));
    if (touched[name]) {
      setErrors((current) => ({ ...current, [name]: validateField(name, nextValue) }));
    }
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;
    setTouched((current) => ({ ...current, [name]: true }));
    setErrors((current) => ({ ...current, [name]: validateField(name, value) }));
  };

  const updateDelivery = (method) => {
    setShippingMethod(method);
    setErrors({});
    setTouched({});
  };

  const applyPromo = (event) => {
    event.preventDefault();
    if (promoCode.trim().toUpperCase() === 'ITEM13') {
      setPromoApplied(true);
      setPromoFeedback('ITEM13 applied — 10% off your items.');
    } else {
      setPromoApplied(false);
      setPromoFeedback('That code didn’t work. Check it and try again.');
    }
  };

  const submitOrder = (event) => {
    event.preventDefault();
    const nextErrors = {};
    for (const name of requiredFields) {
      const error = validateField(name, values[name] || '');
      if (error) nextErrors[name] = error;
    }
    setErrors(nextErrors);
    setTouched((current) => ({
      ...current,
      ...Object.fromEntries(requiredFields.map((name) => [name, true])),
    }));
    if (Object.keys(nextErrors).length > 0) {
      document.getElementById(`checkout-${Object.keys(nextErrors)[0]}`)?.focus();
      return;
    }

    onPlaceOrder({
      customer: {
        name: values.name,
        email: values.email,
        phone: values.phone,
      },
      shippingMethod,
      paymentMethod,
      subtotal,
      discount,
      shipping,
      tax,
      total,
      items,
      deliveryEstimate: shippingMethod === 'pickup' ? 'Ready for pickup soon' : getDeliveryDate(shippingMethod === 'express' ? 1 : 2),
      address: shippingMethod === 'pickup'
        ? 'Pickup location selected at checkout'
        : sameAsBilling
          ? `${values.billingAddress}, ${values.billingCity}, ${values.billingRegion}`
          : `${values.shippingAddress}, ${values.shippingCity}, ${values.shippingRegion}`,
    });
  };

  if (confirmation) {
    return (
      <main className="checkout-page checkout-confirmation-page">
        <header className="checkout-topbar">
          <button type="button" className="checkout-brand" onClick={onBack}>
            <img src="/item13Logo-trimmed.png" alt="Item13" />
            <span>ITEM13 <small>THE UNEXPECTED ESSENTIAL</small></span>
          </button>
          <span className="checkout-secure-label"><LockKeyhole size={14} /> Secure checkout</span>
        </header>
        <section className="checkout-confirmation">
          <div className="checkout-confirmation-mark"><Check size={30} /></div>
          <p className="checkout-kicker">ORDER RECEIVED</p>
          <h1>Thanks, {confirmation.customer.name.split(' ')[0]}!</h1>
          <p className="checkout-confirmation-lede">
            Your order is confirmed in this demo checkout. No payment was collected.
          </p>
          <div className="checkout-order-number">
            <span>ORDER NUMBER</span>
            <strong>{confirmation.orderNumber}</strong>
          </div>
          <div className="checkout-confirmation-card">
            <h2>Order summary</h2>
            {confirmation.items.map((item) => (
              <div className="checkout-confirmation-item" key={item.id}>
                <img src={item.image} alt="" />
                <span><strong>{item.name}</strong><small>{item.variant} · Qty {item.quantity}</small></span>
                <b>{formatPrice(item.price * item.quantity)}</b>
              </div>
            ))}
            <div className="checkout-confirmation-delivery">
              <span><MapPin size={16} /> {confirmation.shippingMethod === 'pickup' ? 'Pickup' : 'Delivery'} · {confirmation.deliveryEstimate}</span>
              <strong>{confirmation.address}</strong>
            </div>
            <div className="checkout-confirmation-total"><span>Total</span><strong>{formatPrice(confirmation.total)}</strong></div>
          </div>
          <p className="checkout-email-note">
            <Check size={16} /> A confirmation email would be sent to <strong>{confirmation.customer.email}</strong> after live checkout is connected.
          </p>
          <button type="button" className="checkout-place-order" onClick={onBack}>
            Back to Item13 <ArrowRight size={17} />
          </button>
          <p className="checkout-security-copy"><ShieldCheck size={15} /> Thanks for supporting a local favourite.</p>
        </section>
      </main>
    );
  }

  if (!items.length) {
    return (
      <main className="checkout-page">
        <header className="checkout-topbar">
          <button type="button" className="checkout-brand" onClick={onBack}>
            <img src="/item13Logo-trimmed.png" alt="Item13" />
            <span>ITEM13 <small>THE UNEXPECTED ESSENTIAL</small></span>
          </button>
        </header>
        <section className="checkout-empty">
          <ShoppingBag size={36} />
          <h1>Your bag is empty</h1>
          <p>Add something freshly popped before heading to checkout.</p>
          <button className="checkout-place-order" type="button" onClick={onBack}>Return to the menu</button>
        </section>
      </main>
    );
  }

  return (
    <main className="checkout-page">
      <header className="checkout-topbar">
        <button type="button" className="checkout-brand" onClick={onBack} aria-label="Return to Item13">
          <img src="/item13Logo-trimmed.png" alt="Item13" />
          <span>ITEM13 <small>THE UNEXPECTED ESSENTIAL</small></span>
        </button>
        <div className="checkout-progress">
          <span className="is-current"><b>1</b> Details</span>
          <i />
          <span><b>2</b> Payment</span>
          <i />
          <span><b>3</b> Confirmation</span>
        </div>
        <span className="checkout-secure-label"><LockKeyhole size={14} /> Secure checkout</span>
      </header>

      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={submitOrder} noValidate>
          <div className="checkout-title-row">
            <div>
              <p className="checkout-kicker">ALMOST YOURS</p>
              <h1>Checkout</h1>
            </div>
            <button type="button" className="checkout-back-link" onClick={onBack}>
              <ArrowLeft size={15} /> Back to bag
            </button>
          </div>
          <div className="checkout-demo-notice">
            <ShieldCheck size={17} />
            <span><strong>Demo checkout</strong> — payment is not processed or collected here.</span>
          </div>

          <section className="checkout-section">
            <div className="checkout-section-heading">
              <span className="checkout-step-number">01</span>
              <div><h2>Contact information</h2><p>We’ll send your order updates here.</p></div>
            </div>
            <div className="checkout-field-grid">
              <Field label="Full name" name="name" autoComplete="name" value={values.name} onChange={handleChange} onBlur={handleBlur} error={errors.name} placeholder="Ama Mensah" />
              <Field label="Email address" name="email" type="email" autoComplete="email" value={values.email} onChange={handleChange} onBlur={handleBlur} error={errors.email} placeholder="ama@example.com" />
              <Field label="Phone number" name="phone" type="tel" autoComplete="tel" value={values.phone} onChange={handleChange} onBlur={handleBlur} error={errors.phone} placeholder="+233 24 000 0000" />
            </div>
            {!customer && (
              <p className="checkout-guest-note"><Check size={14} /> Guest checkout — no account needed.</p>
            )}
          </section>

          <section className="checkout-section">
            <div className="checkout-section-heading">
              <span className="checkout-step-number">02</span>
              <div><h2>Delivery details</h2><p>Where should we bring the good stuff?</p></div>
            </div>
            <div className="checkout-delivery-choices">
              {[
                ['standard', 'Standard delivery', subtotal >= FREE_SHIPPING_THRESHOLD ? 'Free' : formatPrice(DELIVERY_FEES.standard), `Est. ${getDeliveryDate(2)}`],
                ['express', 'Express delivery', formatPrice(DELIVERY_FEES.express), `Est. ${getDeliveryDate(1)}`],
                ['pickup', 'Pick up in person', 'Free', 'Choose a location next'],
              ].map(([method, name, price, estimate]) => (
                <label key={method} className={`checkout-choice-card${shippingMethod === method ? ' is-selected' : ''}`}>
                  <input type="radio" name="shipping-method" value={method} checked={shippingMethod === method} onChange={() => updateDelivery(method)} />
                  <span className="checkout-radio-mark" />
                  <span className="checkout-choice-copy"><strong>{name}</strong><small>{estimate}</small></span>
                  <b>{price}</b>
                </label>
              ))}
            </div>
            {shippingMethod !== 'pickup' && (
              <>
                <div className="checkout-address-subheading"><MapPin size={16} /><h3>Billing address</h3></div>
                <div className="checkout-field-grid">
                  <Field label="Street address" name="billingAddress" autoComplete="billing street-address" value={values.billingAddress} onChange={handleChange} onBlur={handleBlur} error={errors.billingAddress} placeholder="House number and street" />
                  <Field label="City / town" name="billingCity" autoComplete="billing address-level2" value={values.billingCity} onChange={handleChange} onBlur={handleBlur} error={errors.billingCity} placeholder="Accra" />
                  <Field label="Region" name="billingRegion" autoComplete="billing address-level1" value={values.billingRegion} onChange={handleChange} onBlur={handleBlur} error={errors.billingRegion} placeholder="Greater Accra" />
                  <Field label="Postal code (optional)" name="billingPostal" autoComplete="billing postal-code" value={values.billingPostal} onChange={handleChange} onBlur={handleBlur} error={errors.billingPostal} placeholder="Postal code" />
                </div>
                <label className="checkout-same-address">
                  <input type="checkbox" checked={sameAsBilling} onChange={(event) => setSameAsBilling(event.target.checked)} />
                  <span className="checkout-checkbox-mark"><Check size={12} /></span>
                  <span>Delivery address is the same as billing</span>
                </label>
                {!sameAsBilling && (
                  <div className="checkout-shipping-address">
                    <h3>Delivery address</h3>
                    <div className="checkout-field-grid">
                      <Field label="Street address" name="shippingAddress" autoComplete="shipping street-address" value={values.shippingAddress} onChange={handleChange} onBlur={handleBlur} error={errors.shippingAddress} placeholder="House number and street" />
                      <Field label="City / town" name="shippingCity" autoComplete="shipping address-level2" value={values.shippingCity} onChange={handleChange} onBlur={handleBlur} error={errors.shippingCity} placeholder="Accra" />
                      <Field label="Region" name="shippingRegion" autoComplete="shipping address-level1" value={values.shippingRegion} onChange={handleChange} onBlur={handleBlur} error={errors.shippingRegion} placeholder="Greater Accra" />
                      <Field label="Postal code (optional)" name="shippingPostal" autoComplete="shipping postal-code" value={values.shippingPostal} onChange={handleChange} onBlur={handleBlur} error={errors.shippingPostal} placeholder="Postal code" />
                    </div>
                  </div>
                )}
              </>
            )}
            {shippingMethod === 'pickup' && (
              <div className="checkout-pickup-note"><MapPin size={16} /> You’ll choose an Item13 pickup point after placing your demo order.</div>
            )}
            <button type="button" className="checkout-faq-toggle" aria-expanded={faqOpen} onClick={() => setFaqOpen((open) => !open)}>
              Shipping & returns FAQ <ChevronDown size={16} className={faqOpen ? 'is-open' : ''} />
            </button>
            {faqOpen && <p className="checkout-faq-copy">Standard delivery is estimated in 2 days and express delivery in 1 day. Eligible orders receive free standard delivery. For real orders, delivery coverage and return eligibility are confirmed by the store.</p>}
          </section>

          <section className="checkout-section">
            <div className="checkout-section-heading">
              <span className="checkout-step-number">03</span>
              <div><h2>Payment</h2><p>Choose your preferred secure payment method.</p></div>
            </div>
            {customer && (
              <p className="checkout-saved-method-note">
                Saved payment methods will appear here when connected to your account. Choose a method below to continue.
              </p>
            )}
            <div className="checkout-payment-options">
              {[
                ['card', 'Credit or debit card', 'Visa · Mastercard'],
                ['mobile-money', 'Mobile Money', 'MTN MoMo · Telecel Cash'],
                ['paypal', 'PayPal', 'Provider integration required'],
              ].map(([method, label, caption]) => (
                <label key={method} className={`checkout-payment-option${paymentMethod === method ? ' is-selected' : ''}`}>
                  <input type="radio" name="payment-method" value={method} checked={paymentMethod === method} onChange={() => setPaymentMethod(method)} />
                  <span className="checkout-radio-mark" />
                  <span><strong>{label}</strong><small>{caption}</small></span>
                </label>
              ))}
            </div>
            {paymentMethod === 'card' && (
              <div className="checkout-card-fields">
                <Field label="Card number" name="cardNumber" inputMode="numeric" autoComplete="cc-number" value={values.cardNumber} onChange={handleChange} onBlur={handleBlur} error={errors.cardNumber} placeholder="1234  5678  9012  3456" />
                <div className="checkout-field-grid checkout-two-fields">
                  <Field label="Expiry date" name="cardExpiry" inputMode="numeric" autoComplete="cc-exp" value={values.cardExpiry} onChange={handleChange} onBlur={handleBlur} error={errors.cardExpiry} placeholder="MM/YY" />
                  <Field label="Security code" name="cardCvc" inputMode="numeric" autoComplete="cc-csc" value={values.cardCvc} onChange={handleChange} onBlur={handleBlur} error={errors.cardCvc} placeholder="CVC" />
                </div>
                <p className="checkout-demo-warning">Demo only: never enter real payment details here. Connect a PCI-compliant payment provider before accepting orders.</p>
              </div>
            )}
            {paymentMethod === 'mobile-money' && (
              <div className="checkout-card-fields">
                <Field label="Mobile Money number" name="mobileMoneyNumber" type="tel" inputMode="tel" autoComplete="tel" value={values.mobileMoneyNumber} onChange={handleChange} onBlur={handleBlur} error={errors.mobileMoneyNumber} placeholder="+233 24 000 0000" />
                <p className="checkout-demo-warning">Demo only: no Mobile Money prompt will be sent.</p>
              </div>
            )}
            {paymentMethod === 'paypal' && (
              <p className="checkout-demo-warning checkout-payment-warning">PayPal is shown as a design option. A PayPal integration is required before this method can be used.</p>
            )}
          </section>

          <section className="checkout-review-section">
            <div className="checkout-section-heading">
              <span className="checkout-step-number">04</span>
              <div><h2>Review your order</h2><p>Check everything before placing your order.</p></div>
            </div>
            <div className="checkout-review-meta">
              <p><span>Delivery</span><strong>{shippingMethod === 'pickup' ? 'Pickup' : `${shippingMethod === 'express' ? 'Express' : 'Standard'} · ${getDeliveryDate(shippingMethod === 'express' ? 1 : 2)}`}</strong></p>
              <p><span>Payment</span><strong>{paymentMethod === 'card' ? 'Credit / debit card' : paymentMethod === 'paypal' ? 'PayPal' : 'Mobile Money'}</strong></p>
            </div>
            <div className="checkout-trust-box">
              <ShieldCheck size={18} />
              <span><strong>Secure, straightforward checkout</strong><small>Protected payment processing, easy returns, and no account required.</small></span>
            </div>
          </section>

          <button className="checkout-place-order checkout-mobile-cta" type="submit">
            <span>Place Order</span><strong>{formatPrice(total)}</strong><ArrowRight size={18} />
          </button>
          <p className="checkout-terms">By placing your order, you agree to the store’s terms and returns policy.</p>
        </form>

        <aside className="checkout-summary">
          <div className="checkout-summary-heading">
            <h2>Your order</h2>
            <span>{items.reduce((sum, item) => sum + item.quantity, 0)} items</span>
          </div>
          <div className="checkout-summary-items">
            {items.map((item) => (
              <article className="checkout-summary-item" key={item.id}>
                <div className="checkout-summary-image">
                  <img src={item.image} alt="" />
                  <span>{item.quantity}</span>
                </div>
                <div className="checkout-summary-copy">
                  <strong>{item.name}</strong>
                  <small>{item.variant}</small>
                  <div className="checkout-summary-quantity">
                    <button type="button" onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1} aria-label={`Decrease ${item.name} quantity`}>−</button>
                    <span>{item.quantity}</span>
                    <button type="button" onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} disabled={item.quantity >= item.stock} aria-label={`Increase ${item.name} quantity`}>+</button>
                  </div>
                </div>
                <b>{formatPrice(item.price * item.quantity)}</b>
              </article>
            ))}
          </div>
          <form className="checkout-promo" onSubmit={applyPromo}>
            <label htmlFor="checkout-promo-code">Discount code</label>
            <div><input id="checkout-promo-code" value={promoCode} onChange={(event) => setPromoCode(event.target.value)} placeholder="Enter code" /><button type="submit">{promoApplied ? 'Applied' : 'Apply'}</button></div>
            {promoFeedback && <small className={promoApplied ? 'is-success' : 'is-error'} role="status">{promoFeedback}</small>}
          </form>
          <div className="checkout-costs">
            <p><span>Subtotal</span><strong>{formatPrice(subtotal)}</strong></p>
            {discount > 0 && <p className="is-discount"><span>Discount (ITEM13)</span><strong>−{formatPrice(discount)}</strong></p>}
            <p><span>Shipping</span><strong>{shipping === 0 ? 'Free' : formatPrice(shipping)}</strong></p>
            <p><span>Estimated tax</span><strong>{formatPrice(tax)}</strong></p>
            <p className="checkout-final-total"><span>Total <small>· GHS</small></span><strong>{formatPrice(total)}</strong></p>
            <small className="checkout-tax-note">Tax is estimated and shown before you place your order.</small>
          </div>
          <button className="checkout-place-order checkout-desktop-cta" type="button" onClick={() => document.querySelector('.checkout-form')?.requestSubmit()}>
            <span>Place Order</span><strong>{formatPrice(total)}</strong><ArrowRight size={18} />
          </button>
          <div className="checkout-payment-logos" aria-label="Payment methods">
            <span>VISA</span><span>mastercard</span><span>PayPal</span><span>MoMo</span>
          </div>
          <p className="checkout-side-reassurance"><LockKeyhole size={14} /> SSL/TLS encrypted checkout. No payment is collected in this demo.</p>
          <p className="checkout-returns-reassurance">Easy returns within 14 days. Your snacks are packed fresh and ready to enjoy.</p>
        </aside>
      </div>
      <footer className="checkout-footer">
        <span><ShieldCheck size={15} /> Safe checkout</span><span>Item13 · Ghana</span><button type="button" onClick={onBack}>Continue shopping</button>
      </footer>
    </main>
  );
}
