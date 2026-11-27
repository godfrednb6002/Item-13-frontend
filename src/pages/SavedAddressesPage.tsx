import { useEffect, useState, type FormEvent } from 'react';
import {
  ArrowLeft,
  BriefcaseBusiness,
  Building2,
  Check,
  ChevronDown,
  Home,
  Loader2,
  MapPin,
  Pencil,
  Plus,
  Trash2,
  X,
} from 'lucide-react';
import '../styles/pages/saved-addresses.css';

type AddressType = 'Home' | 'Hostel' | 'Office' | 'Other';

export type SavedAddress = {
  id: string;
  type: AddressType;
  name: string;
  phone: string;
  street: string;
  details: string;
  city: string;
  region: string;
  country: string;
  gps_location: string;
  isDefault: boolean;
};

const mockAddresses: SavedAddress[] = [
  {
    id: 'addr-home',
    type: 'Home',
    name: 'Ama Mensah',
    phone: '+233 24 555 0184',
    street: '14 Osu Badu Street',
    details: 'House 6, near Oxford Street',
    city: 'Accra',
    region: 'Greater Accra',
    country: 'Ghana',
    gps_location: 'GA-184-6021',
    isDefault: true,
  },
  {
    id: 'addr-office',
    type: 'Office',
    name: 'Ama Mensah',
    phone: '+233 24 555 0184',
    street: '32 Independence Avenue',
    details: '3rd Floor, Meridian House',
    city: 'Accra',
    region: 'Greater Accra',
    country: 'Ghana',
    gps_location: 'GA-102-4438',
    isDefault: false,
  },
  {
    id: 'addr-hostel',
    type: 'Hostel',
    name: 'Ama Mensah',
    phone: '+233 24 555 0184',
    street: 'University of Ghana, Legon',
    details: 'Volta Hall · Room B12',
    city: 'Legon',
    region: 'Greater Accra',
    country: 'Ghana',
    gps_location: 'GA-381-7742',
    isDefault: false,
  },
];

const emptyAddress: Omit<SavedAddress, 'id'> = {
  type: 'Home',
  name: '',
  phone: '',
  street: '',
  details: '',
  city: '',
  region: 'Greater Accra',
  country: 'Ghana',
  gps_location: '',
  isDefault: false,
};

const typeIcons = {
  Home,
  Hostel: Building2,
  Office: BriefcaseBusiness,
  Other: MapPin,
};

const regions = [
  'Ahafo', 'Ashanti', 'Bono', 'Bono East', 'Central', 'Eastern', 'Greater Accra',
  'North East', 'Northern', 'Oti', 'Savannah', 'Upper East', 'Upper West',
  'Volta', 'Western', 'Western North',
];

function AddressForm({
  address,
  onClose,
  onSave,
}: {
  address: SavedAddress | null;
  onClose: () => void;
  onSave: (value: Omit<SavedAddress, 'id'>) => void;
}) {
  const [values, setValues] = useState<Omit<SavedAddress, 'id'>>(
    address ? { ...address } : { ...emptyAddress },
  );
  const [phoneError, setPhoneError] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [locationStatus, setLocationStatus] = useState('');

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const update = (field: keyof Omit<SavedAddress, 'id'>, value: string | boolean) => {
    setValues((current) => ({ ...current, [field]: value }));
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setLocationStatus('Locating...');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const coordsFormatted = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;

        // Update GPS coordinates immediately
        setValues((current) => ({
          ...current,
          gps_location: coordsFormatted,
        }));

        try {
          // Attempt reverse geocoding to auto-populate street, city, region if available
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
          );
          if (response.ok) {
            const data = await response.json();
            const addr = data.address || {};
            const city = addr.city || addr.town || addr.suburb || addr.village || addr.county || '';
            const road = addr.road || addr.pedestrian || addr.footway || '';
            const houseNumber = addr.house_number ? `${addr.house_number} ` : '';
            const state = addr.state || '';

            setValues((current) => ({
              ...current,
              gps_location: coordsFormatted,
              city: current.city || city,
              street: current.street || (road ? `${houseNumber}${road}` : ''),
              region: regions.find((r) => state.toLowerCase().includes(r.toLowerCase())) || current.region,
            }));
            setLocationStatus('Current location captured!');
          } else {
            setLocationStatus('Location captured!');
          }
        } catch {
          setLocationStatus('Location captured!');
        } finally {
          setIsLocating(false);
          setTimeout(() => setLocationStatus(''), 4000);
        }
      },
      (error) => {
        setIsLocating(false);
        if (error.code === error.PERMISSION_DENIED) {
          setLocationStatus('Location permission was denied.');
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          setLocationStatus('Location information is unavailable.');
        } else if (error.code === error.TIMEOUT) {
          setLocationStatus('Location request timed out.');
        } else {
          setLocationStatus('Unable to retrieve location.');
        }
        setTimeout(() => setLocationStatus(''), 4000);
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 10000,
      }
    );
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (values.phone.replace(/\D/g, '').length < 9) {
      setPhoneError('Enter a valid phone number.');
      return;
    }
    setPhoneError('');
    onSave(values);
  };

  return (
    <div
      className="address-modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="address-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="address-modal-title"
      >
        <header className="address-modal-header">
          <div>
            <span>DELIVERY DETAILS</span>
            <h2 id="address-modal-title">{address ? 'Edit address' : 'Add a new address'}</h2>
            <p>Save a location for a smooth, reliable delivery.</p>
          </div>
          <button type="button" className="address-modal-close" onClick={onClose} aria-label="Close address form">
            <X size={20} />
          </button>
        </header>

        <form className="address-form" onSubmit={submit}>
          <fieldset className="address-type-fieldset">
            <legend>Address label</legend>
            <div className="address-type-options">
              {(['Home', 'Hostel', 'Office', 'Other'] as AddressType[]).map((type) => {
                const Icon = typeIcons[type];
                return (
                  <label className={`address-type-option${values.type === type ? ' is-selected' : ''}`} key={type}>
                    <input type="radio" name="addressType" value={type} checked={values.type === type} onChange={() => update('type', type)} />
                    <Icon size={16} aria-hidden="true" /><span>{type}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <div className="address-form-grid">
            <label className="address-field">
              <span>Full name</span>
              <input autoFocus name="name" autoComplete="name" value={values.name} onChange={(event) => update('name', event.target.value)} required placeholder="Name of recipient" />
            </label>
            <label className="address-field">
              <span>Phone number</span>
              <input name="phone" type="tel" autoComplete="tel" value={values.phone} onChange={(event) => { update('phone', event.target.value); setPhoneError(''); }} required aria-invalid={Boolean(phoneError)} aria-describedby={phoneError ? 'address-phone-error' : undefined} placeholder="+233 24 000 0000" />
              {phoneError && <small id="address-phone-error" role="alert">{phoneError}</small>}
            </label>
            <label className="address-field address-field-wide">
              <span>Street address</span>
              <input name="street" autoComplete="address-line1" value={values.street} onChange={(event) => update('street', event.target.value)} required placeholder="House number and street name" />
            </label>
            <label className="address-field address-field-wide">
              <span>Apartment, suite, room <small>Optional</small></span>
              <input name="details" autoComplete="address-line2" value={values.details} onChange={(event) => update('details', event.target.value)} placeholder="Apartment, hostel room, floor, or landmark" />
            </label>
            <label className="address-field">
              <span>City / town</span>
              <input name="city" autoComplete="address-level2" value={values.city} onChange={(event) => update('city', event.target.value)} required placeholder="e.g. Accra" />
            </label>
            <label className="address-field">
              <span>Region</span>
              <select name="region" autoComplete="address-level1" value={values.region} onChange={(event) => update('region', event.target.value)} required>
                {regions.map((region) => <option key={region}>{region}</option>)}
              </select>
            </label>
            <label className="address-field address-field-wide">
              <span>GPS / digital address <small>Recommended</small></span>
              <div className="address-gps-control">
                <MapPin size={16} aria-hidden="true" />
                <input
                  name="gps_location"
                  value={values.gps_location}
                  onChange={(event) => update('gps_location', event.target.value)}
                  placeholder="Enter GPS coordinates or digital address"
                />
                <button
                  type="button"
                  className="address-use-location-btn"
                  onClick={handleGetCurrentLocation}
                  disabled={isLocating}
                  title="Use my current location"
                >
                  {isLocating ? (
                    <>
                      <Loader2 size={12} className="address-location-spinner" aria-hidden="true" />
                      <span>Locating...</span>
                    </>
                  ) : (
                    <span>Use my current location</span>
                  )}
                </button>
              </div>
              {locationStatus && (
                <small className="address-location-feedback" role="status">
                  {locationStatus}
                </small>
              )}
            </label>
          </div>

          <label className="address-default-toggle">
            <input type="checkbox" checked={values.isDefault} onChange={(event) => update('isDefault', event.target.checked)} />
            <span className="address-toggle-track" aria-hidden="true"><span /></span>
            <span>Set as default shipping address<small>Use this address automatically at checkout.</small></span>
          </label>

          <footer className="address-form-actions">
            <button type="button" className="address-cancel-button" onClick={onClose}>Cancel</button>
            <button type="submit" className="address-save-button"><Check size={16} /> Save address</button>
          </footer>
        </form>
      </section>
    </div>
  );
}

export default function SavedAddressesPage({
  onBack,
  addresses = mockAddresses,
  isEmbedded = false,
}: {
  onBack: () => void;
  addresses?: SavedAddress[];
  isEmbedded?: boolean;
}) {
  const [savedAddresses, setAddresses] = useState<SavedAddress[]>(addresses);
  const [editingAddress, setEditingAddress] = useState<SavedAddress | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [notice, setNotice] = useState('');
  const [collapsedAddresses, setCollapsedAddresses] = useState<Record<string, boolean>>({});

  const isAddressCollapsed = (id: string) => {
    // Default to true (collapsed)
    return collapsedAddresses[id] === undefined ? true : collapsedAddresses[id];
  };

  const toggleAddressCollapse = (id: string) => {
    setCollapsedAddresses((prev) => ({
      ...prev,
      [id]: !isAddressCollapsed(id),
    }));
  };

  const setDefault = (id: string) => {
    setAddresses((current) => current.map((address) => ({ ...address, isDefault: address.id === id })));
    setNotice('Default delivery address updated.');
  };

  const deleteAddress = (address: SavedAddress) => {
    if (!window.confirm(`Delete the ${address.type.toLowerCase()} address for ${address.name}?`)) return;
    setAddresses((current) => {
      const remaining = current.filter((entry) => entry.id !== address.id);
      if (address.isDefault && remaining.length) remaining[0] = { ...remaining[0], isDefault: true };
      return remaining;
    });
    setNotice('Address deleted.');
  };

  const saveAddress = (value: Omit<SavedAddress, 'id'>) => {
    setAddresses((current) => {
      const id = editingAddress?.id || `address-${Date.now()}`;
      const next = editingAddress
        ? current.map((entry) => entry.id === editingAddress.id ? { ...value, id } : entry)
        : [...current, { ...value, id }];
      if (value.isDefault || next.length === 1) {
        return next.map((entry) => ({ ...entry, isDefault: entry.id === id }));
      }
      return next;
    });
    setIsAdding(false);
    setEditingAddress(null);
    setNotice(editingAddress ? 'Address updated.' : 'New address saved.');
  };

  return (
    <main className="addresses-page">
      {!isEmbedded && (
        <header className="addresses-topbar">
          <button type="button" className="addresses-back-link" onClick={onBack}>
            <ArrowLeft size={17} aria-hidden="true" /> My account
          </button>
          <a className="addresses-brand" href="/" aria-label="Item13 home">
            <img src="/item13Logo-trimmed.png" alt="" />
            <span>ITEM13 <small>YOUR ACCOUNT</small></span>
          </a>
          <span className="addresses-topbar-spacer" aria-hidden="true" />
        </header>
      )}

      <div className="addresses-layout">
        <section className="addresses-page-heading" aria-labelledby="addresses-title">
          <div>
            <span className="addresses-eyebrow">READY WHEN YOU ARE</span>
            <h1 id="addresses-title">Saved Addresses</h1>
            <p>Manage your delivery locations for instant, one-click checkouts.</p>
          </div>
          <button className="addresses-add-button" type="button" onClick={() => { setEditingAddress(null); setIsAdding(true); }}>
            <Plus size={18} aria-hidden="true" /> Add new address
          </button>
        </section>

        {savedAddresses.length ? (
          <section className="addresses-grid" aria-label="Your saved delivery addresses">
            {savedAddresses.map((address) => {
              const Icon = typeIcons[address.type];
              const isCollapsed = isAddressCollapsed(address.id);
              return (
                <article
                  className={`address-card${address.isDefault ? ' is-default' : ''}${isCollapsed ? ' is-collapsed' : ''}`}
                  key={address.id}
                >
                  <header
                    className="address-card-header address-card-header-clickable"
                    onClick={() => toggleAddressCollapse(address.id)}
                    role="button"
                    tabIndex={0}
                    aria-expanded={!isCollapsed}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleAddressCollapse(address.id);
                      }
                    }}
                  >
                    <div className={`address-category-icon address-category-${address.type.toLowerCase()}`}>
                      <Icon size={19} aria-hidden="true" />
                    </div>
                    <div className="address-card-label">
                      <span>DELIVERY LOCATION</span>
                      <h2>{address.type}</h2>
                    </div>
                    {address.isDefault && (
                      <span className="address-default-badge">
                        <Check size={12} aria-hidden="true" /> Default address
                      </span>
                    )}
                    <button
                      type="button"
                      className={`address-collapse-btn ${isCollapsed ? 'is-collapsed' : 'is-expanded'}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleAddressCollapse(address.id);
                      }}
                      aria-label={isCollapsed ? `Expand ${address.type} address` : `Collapse ${address.type} address`}
                    >
                      <ChevronDown size={18} className={`address-collapse-icon ${isCollapsed ? '' : 'rotated'}`} />
                    </button>
                  </header>

                  {/* Summary preview row shown when collapsed */}
                  {isCollapsed && (
                    <div
                      className="address-collapsed-summary"
                      onClick={() => toggleAddressCollapse(address.id)}
                    >
                      <span className="address-summary-name">{address.name}</span>
                      <span className="address-summary-separator">•</span>
                      <span className="address-summary-street">{address.street}, {address.city}</span>
                    </div>
                  )}

                  {!isCollapsed && (
                    <div className="address-card-body">
                      <div className="address-card-recipient">
                        <strong>{address.name}</strong>
                        <a href={`tel:${address.phone.replace(/\s/g, '')}`}>{address.phone}</a>
                      </div>
                      <address className="address-card-lines">
                        <span>{address.street}</span>
                        {address.details && <span>{address.details}</span>}
                        <span>{address.city}, {address.region}</span>
                        <span>{address.country}</span>
                      </address>
                      {address.gps_location && (
                        <a
                          className="address-gps-link"
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address.gps_location)}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <MapPin size={15} aria-hidden="true" />
                          <span>GPS / Digital Address <strong>{address.gps_location}</strong></span>
                        </a>
                      )}

                      <footer className="address-card-actions">
                        <button type="button" onClick={() => { setEditingAddress(address); setIsAdding(true); }}>
                          <Pencil size={14} aria-hidden="true" /> Edit
                        </button>
                        <button className="address-delete-action" type="button" onClick={() => deleteAddress(address)}>
                          <Trash2 size={14} aria-hidden="true" /> Delete
                        </button>
                        {!address.isDefault && (
                          <button className="address-set-default-action" type="button" onClick={() => setDefault(address.id)}>
                            Set as default
                          </button>
                        )}
                      </footer>
                    </div>
                  )}
                </article>
              );
            })}
          </section>
        ) : (
          <section className="addresses-empty" aria-labelledby="addresses-empty-title">
            <div><MapPin size={28} aria-hidden="true" /></div>
            <h2 id="addresses-empty-title">No saved addresses yet</h2>
            <p>Add your home, office, or another delivery location for a faster checkout next time.</p>
            <button type="button" onClick={() => setIsAdding(true)}><Plus size={17} /> Add your first address</button>
          </section>
        )}

        <p className="addresses-footnote"><MapPin size={15} aria-hidden="true" /> Your digital address helps our delivery team find you faster.</p>
      </div>

      <div className="addresses-live-notice" role="status" aria-live="polite">{notice}</div>
      {isAdding && (
        <AddressForm
          address={editingAddress}
          onClose={() => { setIsAdding(false); setEditingAddress(null); }}
          onSave={saveAddress}
        />
      )}
    </main>
  );
}
