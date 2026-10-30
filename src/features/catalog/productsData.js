export const CATEGORIES = [
  { id: 'all', label: 'All Items' },
  { id: 'buttered', label: 'Classic Buttered' },
  { id: 'caramel', label: 'Caramel & Sweet' },
  { id: 'savory', label: 'Savory & Spicy' },
  { id: 'drinks', label: 'Chilled Drinks' },
  { id: 'combos', label: 'Meal Combos' },
];

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
    image: '/bistro-popcorn.jpg',
    fallbackImage:
      'https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=600&auto=format&fit=crop&q=80',
    tags: ['Fresh Popped', 'Vegetarian', 'Gluten Free'],
    sizes: [
      { name: 'Regular Tub', priceOffset: 0 },
      { name: 'Large Tub', priceOffset: 12 },
      { name: 'Jumbo Party Tub', priceOffset: 25 },
    ],
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
    image:
      'https://images.unsplash.com/photo-1512149177596-f817c7ef5d4c?w=600&auto=format&fit=crop&q=80',
    tags: ['Extra Rich', 'Signature'],
    sizes: [
      { name: 'Regular Tub', priceOffset: 0 },
      { name: 'Large Tub', priceOffset: 12 },
      { name: 'Jumbo Party Tub', priceOffset: 25 },
    ],
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
    badge: 'Fan Favorite',
    description:
      'Glazed in small copper kettles with real brown sugar, butter, and Madagascar vanilla for a shatteringly crisp crunch.',
    image:
      'https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?w=600&auto=format&fit=crop&q=80',
    tags: ['Sweet', 'Crispy', 'Nut-Free'],
    sizes: [
      { name: 'Regular Tub', priceOffset: 0 },
      { name: 'Large Tub', priceOffset: 15 },
      { name: 'Jumbo Party Tub', priceOffset: 30 },
    ],
  },
  {
    id: 'pop-choc-drizzle',
    name: 'Dark Cocoa & Caramel Swirl',
    category: 'caramel',
    price: 48.0,
    originalPrice: 55.0,
    rating: 4.7,
    reviewsCount: 128,
    badge: 'Limited',
    description:
      'Sweet caramel popcorn hand-drizzled with rich Ghanaian dark chocolate. A decadent sweet-salty delight.',
    image:
      'https://images.unsplash.com/photo-1585647347384-2593bc35786b?w=600&auto=format&fit=crop&q=80',
    tags: ['Ghana Cocoa', 'Sweet'],
    sizes: [
      { name: 'Regular Tub', priceOffset: 0 },
      { name: 'Large Tub', priceOffset: 15 },
    ],
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
    image:
      'https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=600&auto=format&fit=crop&q=80',
    tags: ['Cheesy', 'Savory'],
    sizes: [
      { name: 'Regular Tub', priceOffset: 0 },
      { name: 'Large Tub', priceOffset: 12 },
      { name: 'Jumbo Party Tub', priceOffset: 25 },
    ],
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
    image:
      'https://images.unsplash.com/photo-1512149177596-f817c7ef5d4c?w=600&auto=format&fit=crop&q=80',
    tags: ['Spicy', 'Accra Flavor', 'Bold'],
    sizes: [
      { name: 'Regular Tub', priceOffset: 0 },
      { name: 'Large Tub', priceOffset: 12 },
      { name: 'Jumbo Party Tub', priceOffset: 25 },
    ],
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
    image: '/WhatsApp Image 2026-10-29 at 4.31.43 PM-Photoroom.png',
    fallbackImage: '/popcorn_duo.png',
    tags: ['Popcorn + Soda', 'Savings Bundle'],
    sizes: [
      { name: 'Regular Combo (500ml Drink)', priceOffset: 0 },
      { name: 'Jumbo Combo (2x 500ml Drinks)', priceOffset: 20 },
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
    image: '/popcorn_duo.png',
    tags: ['Family Size', 'Party Ready'],
    sizes: [
      { name: 'Party Pack (3 Drinks)', priceOffset: 0 },
      { name: 'Feast Pack (5 Drinks)', priceOffset: 30 },
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
    image: '/coca-cola.jpg',
    tags: ['Chilled', 'Cold Soda'],
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
    image:
      'https://images.unsplash.com/photo-1624517452488-04869289c4ca?w=600&auto=format&fit=crop&q=80',
    tags: ['Chilled', 'Fruity'],
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
    image:
      'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=600&auto=format&fit=crop&q=80',
    tags: ['Chilled', 'Refreshing'],
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
    image:
      'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=600&auto=format&fit=crop&q=80',
    tags: ['Non-Alcoholic', 'Malt'],
  },
];

