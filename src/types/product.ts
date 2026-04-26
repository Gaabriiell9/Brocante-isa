export type ProductCategory =
  | 'robes'
  | 'hauts'
  | 'bas'
  | 'chaussures'
  | 'accessoires'
  | 'sacs'
  | 'autre';

export type ProductStatus = 'available' | 'reserved' | 'sold';

export type ProductCondition = 'neuf' | 'tres-bon' | 'bon' | 'correct';

export interface Product {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  description: string | null;
  price: number;
  currency: string;
  category: ProductCategory;
  size: string | null;
  brand: string | null;
  color: string | null;
  condition: ProductCondition | null;
  images: string[];
  status: ProductStatus;
  slug: string | null;
}

export interface ProductInput {
  title: string;
  description?: string;
  price: number;
  category: ProductCategory;
  size?: string;
  brand?: string;
  color?: string;
  condition?: ProductCondition;
  images?: string[];
  status?: ProductStatus;
}

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  robes: 'Robes',
  hauts: 'Hauts',
  bas: 'Bas',
  chaussures: 'Chaussures',
  accessoires: 'Accessoires',
  sacs: 'Sacs',
  autre: 'Autre',
};

export const STATUS_LABELS: Record<ProductStatus, string> = {
  available: 'Disponible',
  reserved: 'Réservé',
  sold: 'Vendu',
};

export const CONDITION_LABELS: Record<ProductCondition, string> = {
  neuf: 'Neuf avec étiquette',
  'tres-bon': 'Très bon état',
  bon: 'Bon état',
  correct: 'État correct',
};
