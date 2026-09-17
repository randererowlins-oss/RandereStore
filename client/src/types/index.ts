export type ProductType = 'CURATED' | 'REMADE' | 'ARTED' | 'ACCESSORY';
export type ProductStatus = 'DRAFT' | 'PUBLISHED' | 'SOLD' | 'ARCHIVED';

export interface ProductImage {
  id: string;
  url: string;
  altText?: string | null;
  isPrimary: boolean;
  sortOrder: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  category_id: string;
  category_name?: string;
  category_slug?: string;
  product_type: ProductType;
  price: number | string;
  currency: string;
  size: string;
  measurements?: Record<string, string | number> | null;
  condition: string;
  status: ProductStatus;
  stock_quantity: number;
  one_of_one: boolean;
  materials?: string | null;
  care_instructions?: string | null;
  transformation_description?: string | null;
  original_garment_description?: string | null;
  featured: boolean;
  view_count: number;
  published_at?: string | null;
  created_at: string;
  updated_at: string;
  images?: ProductImage[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  sort_order: number;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  slug: string;
  price: number;
  currency: string;
  size: string;
  oneOfOne: boolean;
  stockQuantity: number;
  status: string;
  quantity: number;
  imageUrl?: string | null;
}

export interface Cart {
  id: string;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  currency: string;
  itemCount: number;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string | null;
  role: 'CUSTOMER' | 'ADMIN' | 'STYLIST' | 'CREATOR';
  avatarUrl?: string | null;
  createdAt?: string;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  streetAddress: string;
  estate?: string;
  city: string;
  postalCode?: string;
  country: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productType: ProductType;
  price: number;
  quantity: number;
  size: string;
  imageUrl?: string | null;
}

export interface Order {
  id: string;
  order_number: string;
  user_id?: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: ShippingAddress;
  subtotal: number;
  shipping_fee: number;
  total: number;
  currency: string;
  payment_status: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  payment_method: string;
  payment_reference?: string | null;
  fulfillment_status: 'PROCESSING' | 'READY' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  delivery_notes?: string | null;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export interface CustomRequest {
  id: string;
  userId?: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  garmentType: string;
  serviceTypes: string[];
  budget?: number | null;
  deadline?: string | null;
  description: string;
  garmentPhotos?: string[];
  inspirationPhotos?: string[];
  status: 'SUBMITTED' | 'REVIEWING' | 'QUOTED' | 'APPROVED' | 'IN_PROGRESS' | 'READY' | 'COMPLETED' | 'DECLINED';
  quoteAmount?: number | null;
  adminNotes?: string | null;
  created_at: string;
}

export interface StylingRequest {
  id: string;
  userId?: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  occasion: string;
  eventDate?: string | null;
  budget?: number | null;
  preferredAesthetic: string;
  size: string;
  presentationPreference: string;
  colorPreferences?: string | null;
  referencePhotos?: string[];
  additionalNotes?: string | null;
  status: 'SUBMITTED' | 'REVIEWING' | 'CURATED' | 'COMPLETED' | 'DECLINED';
  stylistNotes?: string | null;
  created_at: string;
}

export interface Story {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  coverImage: string;
  author: string;
  tags: string[];
  contentType: string;
  published: boolean;
  publishedAt?: string | null;
  readTimeMinutes: number;
  created_at: string;
}

export interface Transformation {
  id: string;
  title: string;
  slug: string;
  garmentType: string;
  originalGarmentDescription: string;
  originalGarmentImageUrl: string;
  processDescription: string;
  processImageUrls: string[];
  finalGarmentDescription: string;
  finalGarmentImageUrl: string;
  techniques: string[];
  artistAttribution?: string | null;
  tailorAttribution?: string | null;
  relatedProductId?: string | null;
  published: boolean;
  created_at: string;
}
