import { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  Download,
  Package,
  RotateCcw,
  Search,
  ShoppingBag,
  Truck,
} from 'lucide-react';
import '../styles/pages/order-history.css';

type OrderStatus = 'In Transit' | 'Delivered' | 'Cancelled' | 'Returned' | 'Processing';
type TimeFilter = 'all' | '30-days' | '6-months' | '2026' | '2025';

export type HistoryOrderItem = {
  id: string;
  name: string;
  variant: string;
  category: string;
  quantity: number;
  price: number;
  image: string;
};

export type HistoryOrder = {
  id: string;
  date: string;
  status: OrderStatus;
  total: number;
  items: HistoryOrderItem[];
};

const products: HistoryOrderItem[] = [
  { id: 'classic-combo', name: 'Classic Popcorn & Drink Combo', variant: 'Buttered · Cola + Fanta', category: 'Combos', quantity: 1, price: 45, image: '/WhatsApp Image 2026-10-29 at 4.31.43 PM-Photoroom.png' },
  { id: 'bistro-popcorn', name: 'Bistro Popcorn', variant: 'Sea salt · Large', category: 'Popcorn', quantity: 1, price: 12.9, image: '/bistro-popcorn.jpg' },
  { id: 'coca-cola', name: 'Coca-Cola', variant: 'Chilled · 330 ml', category: 'Drinks', quantity: 1, price: 7.9, image: '/coca-cola.jpg' },
  { id: 'popcorn-duo', name: 'Popcorn Duo', variant: 'Caramel & classic', category: 'Popcorn', quantity: 1, price: 28, image: '/popcorn_duo.png' },
  { id: 'party-bundle', name: 'Item13 Party Bundle', variant: 'Family size · 4 drinks', category: 'Bundles', quantity: 1, price: 96, image: '/item13bowlandbag1.png' },
];

function createOrder(
  id: string,
  date: string,
  status: OrderStatus,
  entries: Array<[number, number]>,
): HistoryOrder {
  const items = entries.map(([productIndex, quantity]) => ({ ...products[productIndex], quantity }));
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return { id, date, status, total: subtotal + subtotal * 0.15, items };
}

export const mockOrders: HistoryOrder[] = [
  createOrder('I13-948271', '2026-11-03T10:14:00', 'In Transit', [[0, 2], [1, 1]]),
  createOrder('I13-927604', '2026-10-24T16:15:00', 'Delivered', [[0, 1], [2, 2]]),
  createOrder('I13-910382', '2026-10-10T12:40:00', 'Delivered', [[4, 1], [1, 2]]),
  createOrder('I13-899145', '2026-09-18T18:05:00', 'Returned', [[3, 1], [2, 2]]),
  createOrder('I13-876321', '2026-08-06T09:32:00', 'Delivered', [[0, 1], [3, 1]]),
  createOrder('I13-854099', '2026-07-14T14:50:00', 'Cancelled', [[4, 1]]),
  createOrder('I13-840217', '2026-06-22T11:24:00', 'Delivered', [[1, 3], [2, 2]]),
  createOrder('I13-817503', '2026-05-02T17:10:00', 'Delivered', [[0, 1], [1, 1], [2, 1]]),
  createOrder('I13-795460', '2026-03-26T13:18:00', 'Delivered', [[4, 1], [3, 2]]),
  createOrder('I13-774218', '2026-02-11T10:42:00', 'Delivered', [[0, 2]]),
  createOrder('I13-753081', '2026-01-19T15:00:00', 'Delivered', [[1, 2], [2, 1]]),
  createOrder('I13-728844', '2025-12-08T12:16:00', 'Delivered', [[3, 1], [0, 1]]),
  createOrder('I13-704652', '2025-09-17T19:30:00', 'Delivered', [[4, 1], [2, 3]]),
  createOrder('I13-681309', '2025-05-30T08:55:00', 'Delivered', [[1, 2], [3, 1]]),
];

const statusClass: Record<OrderStatus, string> = {
  'In Transit': 'in-transit',
  Delivered: 'delivered',
  Cancelled: 'cancelled',
  Returned: 'returned',
  Processing: 'processing',
};

function formatPrice(amount: number) {
  return `GH₵${amount.toFixed(2)}`;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('en-GH', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function OrderCard({
  order,
  onViewOrder,
  onReorder,
  onReceipt,
}: {
  order: HistoryOrder;
  onViewOrder: (id: string) => void;
  onReorder: (order: HistoryOrder) => void;
  onReceipt: (order: HistoryOrder) => void;
}) {
  const visibleItems = order.items.slice(0, 3);
  const hiddenCount = Math.max(0, order.items.length - visibleItems.length);

  return (
    <article className="history-order-card" aria-labelledby={`order-title-${order.id}`}>
      <header className="history-order-header">
        <div className="history-order-primary">
          <div className="history-order-id">
            <span>ORDER</span>
            <h2 id={`order-title-${order.id}`}>#{order.id}</h2>
          </div>
          <span className={`history-status ${statusClass[order.status]}`}>
            <span aria-hidden="true" />{order.status}
          </span>
        </div>
        <div className="history-order-facts">
          <div><span>ORDER DATE</span><strong>{formatDate(order.date)}</strong></div>
          <div><span>TOTAL</span><strong>{formatPrice(order.total)}</strong></div>
        </div>
      </header>

      <ul className="history-products" aria-label={`Items in order ${order.id}`}>
        {visibleItems.map((item) => (
          <li className="history-product" key={item.id}>
            <div className="history-product-image">
              <img src={item.image} alt="" />
              {item.quantity > 1 && <span className="history-quantity">×{item.quantity}</span>}
            </div>
            <div className="history-product-info">
              <strong>{item.name}</strong>
              <span>{item.variant}</span>
              <small>{item.category} · Qty {item.quantity}</small>
            </div>
          </li>
        ))}
        {hiddenCount > 0 && (
          <li className="history-more-items" aria-label={`${hiddenCount} more items`}>
            +{hiddenCount}<span>more</span>
          </li>
        )}
      </ul>

      <footer className="history-order-actions">
        <a
          className="history-details-link"
          href={`/orders/${encodeURIComponent(order.id)}`}
          onClick={(event) => {
            event.preventDefault();
            onViewOrder(order.id);
          }}
        >
          View order details <ChevronRight size={16} aria-hidden="true" />
        </a>
        <div className="history-secondary-actions">
          <button type="button" onClick={() => onReceipt(order)}>
            <Download size={15} aria-hidden="true" /> Receipt
          </button>
          <button className="history-reorder-button" type="button" onClick={() => onReorder(order)}>
            <RotateCcw size={15} aria-hidden="true" /> Buy it again
          </button>
        </div>
      </footer>
    </article>
  );
}

export default function OrderHistoryPage({
  orders = mockOrders,
  onBack,
  onViewOrder,
  onReorder,
  onViewCart,
  onCheckout,
  onExplore,
}: {
  orders?: HistoryOrder[];
  onBack: () => void;
  onViewOrder: (id: string) => void;
  onReorder: (order: HistoryOrder) => void;
  onViewCart: () => void;
  onCheckout: () => void;
  onExplore: () => void;
}) {
  const [query, setQuery] = useState('');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [visibleCount, setVisibleCount] = useState(5);
  const [loadingMore, setLoadingMore] = useState(false);
  const [reorderNotice, setReorderNotice] = useState('');
  const [receiptNotice, setReceiptNotice] = useState('');
  const [reorderCount, setReorderCount] = useState(0);

  const filteredOrders = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const now = new Date();
    const sixMonthsAgo = new Date(now);
    sixMonthsAgo.setMonth(now.getMonth() - 6);
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(now.getDate() - 30);

    return [...orders]
      .filter((order) => {
        const orderDate = new Date(order.date);
        const matchesQuery = !normalizedQuery
          || order.id.toLowerCase().includes(normalizedQuery)
          || order.items.some((item) =>
            item.name.toLowerCase().includes(normalizedQuery)
            || item.category.toLowerCase().includes(normalizedQuery),
          );
        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
        const matchesTime = timeFilter === 'all'
          || (timeFilter === '30-days' && orderDate >= thirtyDaysAgo)
          || (timeFilter === '6-months' && orderDate >= sixMonthsAgo)
          || (timeFilter === '2026' && orderDate.getFullYear() === 2026)
          || (timeFilter === '2025' && orderDate.getFullYear() === 2025);
        return matchesQuery && matchesStatus && matchesTime;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [orders, query, statusFilter, timeFilter]);

  const visibleOrders = filteredOrders.slice(0, visibleCount);

  const handleReorder = (order: HistoryOrder) => {
    const count = order.items.reduce((sum, item) => sum + item.quantity, 0);
    onReorder(order);
    setReorderCount(count);
    setReorderNotice(`Added ${count} ${count === 1 ? 'item' : 'items'} to your cart.`);
    setReceiptNotice('');
  };

  const handleReceipt = (order: HistoryOrder) => {
    // TODO: Request the receipt PDF from the order API or generate it with a PDF library such as jsPDF.
    setReceiptNotice(`Receipt for ${order.id} is being prepared.`);
    setReorderNotice('');
  };

  const handleLoadMore = () => {
    setLoadingMore(true);
    window.setTimeout(() => {
      setVisibleCount((count) => count + 5);
      setLoadingMore(false);
    }, 250);
  };

  return (
    <main className="history-page">
      <header className="history-topbar">
        <button className="history-back-link" type="button" onClick={onBack}>
          <ArrowLeft size={17} aria-hidden="true" /> Storefront
        </button>
        <a className="history-brand" href="/" aria-label="Item13 home">
          <img src="/item13Logo-trimmed.png" alt="" />
          <span>ITEM13 <small>YOUR ACCOUNT</small></span>
        </a>
        <button className="history-cart-link" type="button" onClick={onViewCart} aria-label={`Open cart, ${reorderCount} recently added`}>
          <ShoppingBag size={18} aria-hidden="true" /><span>Bag</span>
        </button>
      </header>

      <div className="history-layout">
        <section className="history-heading" aria-labelledby="history-title">
          <div>
            <span className="history-eyebrow">YOUR ITEM13 ACCOUNT</span>
            <h1 id="history-title">Order History</h1>
            <p>Every good snack run, all in one place.</p>
          </div>
          <span className="history-count">{orders.length} orders</span>
        </section>

        <section className="history-controls" aria-label="Search and filter orders">
          <label className="history-search">
            <Search size={18} aria-hidden="true" />
            <span className="history-sr-only">Search orders by order number, product, or category</span>
            <input
              type="search"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setVisibleCount(5);
              }}
              placeholder="Search orders, items, or categories"
            />
          </label>
          <label className="history-select">
            <CalendarDays size={16} aria-hidden="true" />
            <span className="history-sr-only">Filter by time frame</span>
            <select value={timeFilter} onChange={(event) => { setTimeFilter(event.target.value as TimeFilter); setVisibleCount(5); }}>
              <option value="all">Any time</option>
              <option value="30-days">Last 30 days</option>
              <option value="6-months">Past 6 months</option>
              <option value="2026">2026</option>
              <option value="2025">2025</option>
            </select>
          </label>
          <label className="history-select">
            <Package size={16} aria-hidden="true" />
            <span className="history-sr-only">Filter by order status</span>
            <select value={statusFilter} onChange={(event) => { setStatusFilter(event.target.value); setVisibleCount(5); }}>
              <option value="all">All statuses</option>
              <option value="In Transit">In transit</option>
              <option value="Processing">Processing</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Returned">Returned</option>
            </select>
          </label>
        </section>

        <div className="history-results-row" aria-live="polite">
          <span>{filteredOrders.length} {filteredOrders.length === 1 ? 'order' : 'orders'} found</span>
          {(query || timeFilter !== 'all' || statusFilter !== 'all') && (
            <button type="button" onClick={() => { setQuery(''); setTimeFilter('all'); setStatusFilter('all'); setVisibleCount(5); }}>
              Clear filters
            </button>
          )}
        </div>

        {visibleOrders.length ? (
          <section className="history-order-list" aria-label="Past orders">
            {visibleOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onViewOrder={onViewOrder}
                onReorder={handleReorder}
                onReceipt={handleReceipt}
              />
            ))}
            {visibleCount < filteredOrders.length && (
              <div className="history-load-more">
                <button type="button" onClick={handleLoadMore} disabled={loadingMore}>
                  {loadingMore ? <><Clock3 size={16} /> Loading orders…</> : <>Load more orders <ArrowRight size={16} /></>}
                </button>
              </div>
            )}
          </section>
        ) : (
          <section className="history-empty" aria-labelledby="history-empty-title">
            <div className="history-empty-icon"><Package size={29} aria-hidden="true" /></div>
            <span>NOTHING IN THE BAG YET</span>
            <h2 id="history-empty-title">{orders.length ? 'No orders match those filters' : 'Your next favourite is waiting'}</h2>
            <p>{orders.length ? 'Try another search or clear your filters to see your past orders.' : 'Explore the menu and make your first Item13 order.'}</p>
            <button type="button" onClick={orders.length ? () => { setQuery(''); setStatusFilter('all'); setTimeFilter('all'); } : onExplore}>
              {orders.length ? 'Clear filters' : 'Explore products'} <ArrowRight size={16} aria-hidden="true" />
            </button>
          </section>
        )}
        <p className="history-footer-note"><Truck size={14} aria-hidden="true" /> Need a hand with an order? <a href="mailto:support@item13.com">Our team is here to help.</a></p>
      </div>

      {(reorderNotice || receiptNotice) && (
        <div className="history-toast" role="status" aria-live="polite">
          <span className="history-toast-check"><Check size={15} aria-hidden="true" /></span>
          <span>{reorderNotice || receiptNotice}</span>
          {reorderNotice && (
            <span className="history-toast-actions">
              <button type="button" onClick={onViewCart}>View cart</button>
              <button type="button" onClick={onCheckout}>Checkout <ChevronRight size={14} aria-hidden="true" /></button>
            </span>
          )}
          <button className="history-toast-dismiss" type="button" onClick={() => { setReorderNotice(''); setReceiptNotice(''); }} aria-label="Dismiss notification">×</button>
        </div>
      )}
    </main>
  );
}
