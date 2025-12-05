export type CategoryType = 
  | 'chambres' 
  | 'salons' 
  | 'cuisines' 
  | 'bureaux' 
  | 'salles-a-manger' 
  | 'decorations' 
  | 'electromenagers';

export type StyleType = 'moderne' | 'classique' | 'scandinave' | 'industriel';

export interface Product {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  category: CategoryType;
  subcategory?: string;
  price: number;
  discountPrice?: number;
  images: string[];
  video?: string;
  dimensions: {
    length: number;
    width: number;
    height: number;
    unit: 'cm' | 'm';
  };
  weight: number;
  material: string[];
  color: string[];
  style: StyleType;
  brand: string;
  stock: number;
  assemblyRequired: boolean;
  warranty: string;
  careInstructions: string;
  featured: boolean;
  rating: number;
  reviewCount: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Bundle {
  id: string;
  name: string;
  description: string;
  products: {
    productId: string;
    quantity: number;
  }[];
  totalPrice: number;
  discountedPrice: number;
  savings: number;
  image: string;
}
