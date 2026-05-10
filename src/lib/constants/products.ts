export const PRODUCT_CATEGORIES = ['Incense', 'Grocery', 'Cleaning'] as const;

export const PRODUCT_BRANDS = ['GoldLeaf', 'RoyalGrain', 'BrightWash'] as const;

export const PRODUCT_UNITS = ['Box', 'Bag', 'Pkt', 'Pcs'] as const;

export const ALL_CATEGORIES_FILTER = '__all_categories__';

export const ALL_BRANDS_FILTER = '__all_brands__';

export const CATEGORY_FILTER_OPTIONS: { label: string; value: string }[] = [
  { label: 'All categories', value: ALL_CATEGORIES_FILTER },
  ...PRODUCT_CATEGORIES.map((c) => ({ label: c, value: c })),
];

export const BRAND_FILTER_OPTIONS: { label: string; value: string }[] = [
  { label: 'All brands', value: ALL_BRANDS_FILTER },
  ...PRODUCT_BRANDS.map((b) => ({ label: b, value: b })),
];

export const INITIAL_PRODUCT_FORM = {
  name: '',
  category: '',
  brand: '',
  unit: '',
  stock: 0,
  active: true,
} as const;
