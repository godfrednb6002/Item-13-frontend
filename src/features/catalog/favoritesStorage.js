// Helper to manage customer favorite snack items across the app with localStorage persistence
const FAVORITES_STORAGE_KEY = 'item13_customer_favorites';

// Default curated favorites for instant re-ordering
export const DEFAULT_FAVORITE_IDS = [
  'pop-classic-butter',
  'pop-extra-butter',
  'pop-golden-caramel',
  'combo-classic-duo',
];

export function getSavedFavorites() {
  if (typeof window === 'undefined') return DEFAULT_FAVORITE_IDS;
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(DEFAULT_FAVORITE_IDS));
      return DEFAULT_FAVORITE_IDS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_FAVORITE_IDS;
  } catch (err) {
    return DEFAULT_FAVORITE_IDS;
  }
}

export function saveFavorites(favIds) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favIds));
    window.dispatchEvent(new Event('item13_favorites_changed'));
  } catch (err) {
    console.error('Failed to save favorites to localStorage', err);
  }
}

export function toggleFavorite(productId) {
  const current = getSavedFavorites();
  const exists = current.includes(productId);
  const updated = exists ? current.filter((id) => id !== productId) : [...current, productId];
  saveFavorites(updated);
  return { updated, isFavorite: !exists };
}

