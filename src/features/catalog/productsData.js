export const CATEGORIES = [
  { id: 'all', label: 'All Items' },
  { id: 'buttered', label: 'Classic Buttered' },
  { id: 'caramel', label: 'Caramel & Sweet' },
  { id: 'savory', label: 'Savory & Spicy' },
  { id: 'drinks', label: 'Chilled Drinks' },
  { id: 'combos', label: 'Meal Combos' },
];

export const TUB_SIZES = [
  { id: 'mini', name: 'Mini Tub', volume: '1.5 Liters · Snack size', priceOffset: -10 },
  { id: 'regular', name: 'Regular Tub', volume: '3.0 Liters · Classic standard', priceOffset: 0 },
  { id: 'large', name: 'Large Tub', volume: '5.0 Liters · Great to share', priceOffset: 12 },
  { id: 'jumbo', name: 'Jumbo Tub', volume: '8.5 Liters · Party & movie night', priceOffset: 25 },
];

export const BUTTER_DRIZZLE_OPTIONS = [
  { id: 'none', name: 'Classic (Standard Butter)', desc: 'Tossed in signature melted butter', price: 0 },
  { id: 'single', name: 'Single Butter Drizzle', desc: 'Warm artisanal creamery butter poured on top', price: 4.0 },
  { id: 'double', name: 'Double Butter Drizzle', desc: 'Layered warm butter throughout tub for intense richness', price: 7.0 },
  { id: 'garlic-herb', name: 'Garlic Herb Butter Drizzle', desc: 'Infused roasted garlic & fresh thyme butter', price: 8.0 },
];

export const DRINK_PAIRINGS = [
  {
    id: 'drink-coca-cola',
    name: 'Coca-Cola Original',
    size: '500ml Chilled Bottle',
    price: 12.0,
    image: '/coca-cola.jpg',
  },
  {
    id: 'drink-fanta-orange',
    name: 'Fanta Orange Citrus',
    size: '500ml Chilled Bottle',
    price: 12.0,
    image: 'https://images.unsplash.com/photo-1624517452488-04869289c4ca?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'drink-sprite',
    name: 'Sprite Lemon-Lime',
    size: '500ml Chilled Bottle',
    price: 12.0,
    image: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'drink-malt',
    name: 'Malta Guinness Can',
    size: '330ml Can',
    price: 15.0,
    image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=600&auto=format&fit=crop&q=80',
  },
];

export const ALLERGEN_DEFINITIONS = {
  dairy: { label: 'Contains Dairy', iconKey: 'milk', desc: 'Prepared with real creamery cow milk butter and cheese powders.' },
  nuts: { label: 'Contains Peanuts / Nuts', iconKey: 'nuts', desc: 'Contains peanuts or roasted groundnuts in suya pepper blends.' },
  gluten_free: { label: 'Gluten-Free', iconKey: 'gluten_free', desc: 'Naturally 100% gluten-free non-GMO corn kernels.' },
  vegetarian: { label: 'Vegetarian Friendly', iconKey: 'vegetarian', desc: 'Suitable for lacto-vegetarians.' },
  soy: { label: 'May Contain Soy', iconKey: 'soy', desc: 'Processed in a facility handling soy lecithin oils.' },
};

export const PRODUCTS = [
  // Buttered Category
  {
    id: 'pop-classic-butter',
    name: 'Item13 Signature Buttered Popcorn',
    category: 'buttered',
    price: 35.0,
    originalPrice: 40.0,
    rating: 4.9,
    reviewsCount: 342,
    badge: 'Bestseller',
    description:
      'Golden, fluffy butterfly kernels tossed in rich melted creamery butter and seasoned with micro-fine sea salt.',
    longDescription:
      'Crafted with premium non-GMO butterfly kernels popped fresh to order in small batches. Every tub is drenched in pure creamy dairy butter and dusted with sea salt for that unmistakable Item13 crunch that melts in your mouth.',
    image: '/bistro-popcorn.jpg',
    fallbackImage:
      'https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=600&auto=format&fit=crop&q=80',
    tags: ['Fresh Popped', 'Vegetarian', 'Gluten Free'],
    allergens: ['dairy', 'gluten_free', 'vegetarian'],
    sizes: TUB_SIZES,
  },
  {
    id: 'pop-extra-butter',
    name: 'Double Butter Drizzle Tub',
    category: 'buttered',
    price: 42.0,
    originalPrice: 48.0,
    rating: 4.8,
    reviewsCount: 189,
    badge: 'Staff Pick',
    description:
      'Extra indulgent warm butter poured layer-by-layer throughout the entire tub for intense gourmet flavor in every handful.',
    longDescription:
      'For true butter enthusiasts: we layer warm, velvety creamery butter at the base, middle, and crowning top of each tub. No dry kernels at the bottom, just pure golden buttery bliss from first crunch to last.',
    image:
      'https://images.unsplash.com/photo-1512149177596-f817c7ef5d4c?w=600&auto=format&fit=crop&q=80',
    tags: ['Extra Rich', 'Signature'],
    allergens: ['dairy', 'gluten_free', 'vegetarian'],
    sizes: TUB_SIZES,
  },

  // Caramel & Sweet
  {
    id: 'pop-golden-caramel',
    name: 'Artisan Golden Caramel Crunch',
    category: 'caramel',
    price: 45.0,
    originalPrice: 50.0,
    rating: 4.95,
    reviewsCount: 512,
    badge: 'Customer Fav',
    description:
      'Slow-cooked brown sugar and creamy butter candy coating glazed evenly over oversized mushroom popcorn kernels.',
    longDescription:
      'Slow-cooked copper-kettle caramel made with natural cane sugar, Madagascar vanilla extract, and farm butter. Each mushroom popcorn puff is glazed with a glassy, shatteringly crisp sweet crunch that keeps for days.',
    image:
      'https://images.unsplash.com/photo-1585652616655-3882a201b2c4?w=600&auto=format&fit=crop&q=80',
    fallbackImage: '/bistro-popcorn.jpg',
    tags: ['Sweet & Crunchy', 'Mushroom Corn'],
    allergens: ['dairy', 'vegetarian', 'soy'],
    sizes: TUB_SIZES,
  },
  {
    id: 'pop-choc-drizzle',
    name: 'Dark Cocoa & Caramel Swirl',
    category: 'caramel',
    price: 48.0,
    originalPrice: 55.0,
    rating: 4.78,
    reviewsCount: 140,
    badge: 'New',
    description:
      'Golden caramel popcorn laced with silky dark Ghanaian chocolate drizzle and a pinch of pink Himalayan rock salt.',
    longDescription:
      'A celebration of world-famous Ghanaian cocoa. Hand-crafted sweet caramel popcorn drizzled with 65% rich dark chocolate ribbons and finished with pink Himalayan sea salt flakes.',
    image:
      'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=600&auto=format&fit=crop&q=80',
    tags: ['Chocolate', 'Decadent', 'Ghana Cocoa'],
    allergens: ['dairy', 'vegetarian', 'soy'],
    sizes: TUB_SIZES,
  },

  // Savory & Spicy
  {
    id: 'pop-cheddar-blast',
    name: 'Smoked White Cheddar Blast',
    category: 'savory',
    price: 38.0,
    originalPrice: 42.0,
    rating: 4.85,
    reviewsCount: 220,
    badge: 'Popular',
    description:
      'Coated generously with aged sharp white cheddar cheese powder. Bold, savory, and intensely cheesy.',
    longDescription:
      'Real aged white cheddar cheese cured to sharp perfection, dried, and micro-ground into a velvety cheese dust that clings to every crevice of our hot popped corn.',
    image:
      'https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=600&auto=format&fit=crop&q=80',
    tags: ['Cheesy', 'Savory'],
    allergens: ['dairy', 'gluten_free', 'vegetarian'],
    sizes: TUB_SIZES,
  },
  {
    id: 'pop-suya-spice',
    name: 'Accra Suya Pepper Popcorn',
    category: 'savory',
    price: 40.0,
    originalPrice: 45.0,
    rating: 4.9,
    reviewsCount: 304,
    badge: 'Local Special',
    description:
      'Infused with authentic West African kankankan & suya spice blend with roasted groundnuts, ginger, and chili heat.',
    longDescription:
      'An authentic Ghanaian street flavor innovation. Fresh popcorn tossed in roasted peanut kankankan powder, ginger, smoked paprika, dried onion, and fiery chili pepper. Unbelievably addictive with cold drinks!',
    image:
      'https://images.unsplash.com/photo-1512149177596-f817c7ef5d4c?w=600&auto=format&fit=crop&q=80',
    tags: ['Spicy', 'Accra Flavor', 'Bold'],
    allergens: ['nuts', 'gluten_free', 'vegetarian'],
    sizes: TUB_SIZES,
  },

  // Meal Combos
  {
    id: 'combo-classic-duo',
    name: 'Classic Popcorn & Drink Combo',
    category: 'combos',
    price: 45.0,
    originalPrice: 55.0,
    rating: 4.98,
    reviewsCount: 680,
    badge: 'Best Value',
    description:
      'Our signature buttered popcorn paired with an ice-cold 500ml Coca-Cola or Fanta bottle. The ultimate snack duo.',
    longDescription:
      'The classic Ghana movie & snack pairing: a generous freshly popped butter tub alongside an ice-cold chilled bottle of your choice. Ready for instant enjoyment.',
    image: '/WhatsApp Image 2026-10-29 at 4.31.43 PM-Photoroom.png',
    fallbackImage: '/popcorn_duo.png',
    tags: ['Popcorn + Soda', 'Savings Bundle'],
    allergens: ['dairy', 'gluten_free', 'vegetarian'],
    sizes: [
      { id: 'mini', name: 'Mini Combo (330ml Drink)', volume: 'Mini Tub + Drink', priceOffset: -10 },
      { id: 'regular', name: 'Regular Combo (500ml Drink)', volume: 'Regular Tub + Drink', priceOffset: 0 },
      { id: 'large', name: 'Large Combo (500ml Drink)', volume: 'Large Tub + Drink', priceOffset: 12 },
      { id: 'jumbo', name: 'Jumbo Combo (2x 500ml Drinks)', volume: 'Jumbo Tub + 2 Drinks', priceOffset: 25 },
    ],
  },
  {
    id: 'combo-movie-night',
    name: 'Family & Friends Mega Bundle',
    category: 'combos',
    price: 110.0,
    originalPrice: 135.0,
    rating: 4.95,
    reviewsCount: 194,
    badge: 'Mega Deal',
    description:
      '2x Jumbo tubs (1 Buttered + 1 Caramel), plus 3 chilled sodas of your choice. Feeds 3-5 people generously.',
    longDescription:
      'Everything you need for family movie night or weekend hangouts: 2 massive tubs of our top 2 flavours plus 3 ice-cold beverages packed insulated for crisp delivery.',
    image: '/popcorn_duo.png',
    tags: ['Family Size', 'Party Ready'],
    allergens: ['dairy', 'vegetarian', 'soy'],
    sizes: [
      { id: 'regular', name: 'Standard Pack (3 Drinks)', volume: '2x Large Tubs + 3 Sodas', priceOffset: 0 },
      { id: 'jumbo', name: 'Feast Pack (5 Drinks)', volume: '2x Jumbo Tubs + 5 Sodas', priceOffset: 30 },
    ],
  },

  // Chilled Drinks
  {
    id: 'drink-coca-cola',
    name: 'Coca-Cola Original (500ml Bottle)',
    category: 'drinks',
    price: 12.0,
    rating: 4.9,
    reviewsCount: 450,
    badge: 'Ice Cold',
    description:
      'Chilled 500ml plastic bottle. Delivered cold straight to your doorstep.',
    longDescription:
      'The timeless, iconic taste of Coca-Cola served chilled cold. The crisp sparkle is the perfect refreshment with savory or sweet snacks.',
    image: '/coca-cola.jpg',
    tags: ['Chilled', 'Cold Soda'],
    allergens: ['gluten_free', 'vegetarian'],
    sizes: [
      { id: 'regular', name: '500ml Bottle', volume: 'Chilled bottle', priceOffset: 0 },
    ],
  },
  {
    id: 'drink-fanta-orange',
    name: 'Fanta Orange Citrus (500ml Bottle)',
    category: 'drinks',
    price: 12.0,
    rating: 4.85,
    reviewsCount: 310,
    badge: 'Ice Cold',
    description:
      'Crisp, refreshing, tangy orange soda in a chilled 500ml bottle.',
    longDescription:
      'Vibrant citrus orange flavor with fine carbonation that pairs delightfully with buttered kernels and salty snacks.',
    image:
      'https://images.unsplash.com/photo-1624517452488-04869289c4ca?w=600&auto=format&fit=crop&q=80',
    tags: ['Chilled', 'Fruity'],
    allergens: ['gluten_free', 'vegetarian'],
    sizes: [
      { id: 'regular', name: '500ml Bottle', volume: 'Chilled bottle', priceOffset: 0 },
    ],
  },
  {
    id: 'drink-sprite',
    name: 'Sprite Lemon-Lime (500ml Bottle)',
    category: 'drinks',
    price: 12.0,
    rating: 4.8,
    reviewsCount: 215,
    badge: 'Ice Cold',
    description:
      'Crisp and clean lemon-lime sparkle to cut through rich buttery popcorn.',
    longDescription:
      'Clean, crisp lemon and lime essence with 100% natural flavors. Light, refreshing and caffeine-free.',
    image:
      'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=600&auto=format&fit=crop&q=80',
    tags: ['Chilled', 'Refreshing'],
    allergens: ['gluten_free', 'vegetarian'],
    sizes: [
      { id: 'regular', name: '500ml Bottle', volume: 'Chilled bottle', priceOffset: 0 },
    ],
  },
  {
    id: 'drink-malt',
    name: 'Malta Guinness Can (330ml)',
    category: 'drinks',
    price: 15.0,
    rating: 4.92,
    reviewsCount: 388,
    badge: 'Ghana Favorite',
    description:
      'Rich, nutritious non-alcoholic brewed malt drink packed with vitamins B1, B2, B3, B5 and B6.',
    longDescription:
      'Ghana’s favorite premium malt beverage. Brewed with natural barley, malt, and enriched with vital B-complex vitamins for good energy and deep caramelized flavor.',
    image:
      'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=600&auto=format&fit=crop&q=80',
    tags: ['Non-Alcoholic', 'Malt'],
    allergens: ['vegetarian'],
    sizes: [
      { id: 'regular', name: '330ml Can', volume: 'Chilled can', priceOffset: 0 },
    ],
  },
];
