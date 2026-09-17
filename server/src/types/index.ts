export type UserRole = 'CUSTOMER' | 'ADMIN' | 'STYLIST' | 'CREATOR';

export interface UserRecord {
  id: string;
  email: string;
  password_hash: string;
  full_name: string;
  phone: string | null;
  role: UserRole;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export type ProductType = 'CURATED' | 'REMADE' | 'ARTED' | 'ACCESSORY';
export type ProductStatus = 'DRAFT' | 'PUBLISHED' | 'SOLD' | 'ARCHIVED';

export interface ProductRecord {
  id: string;
  name: string;
  slug: string;
  description: string;
  category_id: string;
  category_name?: string;
  category_slug?: string;
  product_type: ProductType;
  price: string | number;
  currency: string;
  size: string;
  measurements: Record<string, string | number> | null;
  condition: string;
  status: ProductStatus;
  stock_quantity: number;
  one_of_one: boolean;
  materials: string | null;
  care_instructions: string | null;
  transformation_description: string | null;
  original_garment_description: string | null;
  featured: boolean;
  view_count: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  images?: ProductImageRecord[];
}

export interface ProductImageRecord {
  id: string;
  product_id: string;
  url: string;
  alt_text: string | null;
  is_primary: boolean;
  sort_order: number;
  created_at: string;
}

export interface CategoryRecord {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
export type FulfillmentStatus = 'PROCESSING' | 'READY' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface ShippingAddress {
  fullName: string;
  phone: string;
  streetAddress: string;
  estate?: string;
  city: string;
  postalCode?: string;
  country: string;
}

export interface OrderRecord {
  id: string;
  order_number: string;
  user_id: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: ShippingAddress;
  subtotal: string | number;
  shipping_fee: string | number;
  total: string | number;
  currency: string;
  payment_status: PaymentStatus;
  payment_method: string;
  payment_reference: string | null;
  fulfillment_status: FulfillmentStatus;
  delivery_notes: string | null;
  created_at: string;
  updated_at: string;
  items?: OrderItemRecord[];
}

export interface OrderItemRecord {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_type: ProductType;
  price: string | number;
  quantity: number;
  size: string;
  image_url: string | null;
  created_at: string;
}

export type CustomRequestStatus =
  | 'SUBMITTED'
  | 'REVIEWING'
  | 'QUOTED'
  | 'APPROVED'
  | 'IN_PROGRESS'
  | 'READY'
  | 'COMPLETED'
  | 'DECLINED';

export interface CustomRequestRecord {
  id: string;
  user_id: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  garment_type: string;
  service_types: string[];
  budget: string | number | null;
  deadline: string | null;
  description: string;
  garment_photos: string[] | null;
  inspiration_photos: string[] | null;
  status: CustomRequestStatus;
  quote_amount: string | number | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

export type StylingRequestStatus =
  | 'SUBMITTED'
  | 'REVIEWING'
  | 'CURATED'
  | 'COMPLETED'
  | 'DECLINED';

export interface StylingRequestRecord {
  id: string;
  user_id: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  occasion: string;
  event_date: string | null;
  budget: string | number | null;
  preferred_aesthetic: string;
  size: string;
  presentation_preference: string;
  color_preferences: string | null;
  reference_photos: string[] | null;
  additional_notes: string | null;
  status: StylingRequestStatus;
  stylist_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface StoryRecord {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  cover_image: string;
  author: string;
  tags: string[];
  content_type: string;
  published: boolean;
  published_at: string | null;
  read_time_minutes: number;
  created_at: string;
  updated_at: string;
}

export interface TransformationRecord {
  id: string;
  title: string;
  slug: string;
  garment_type: string;
  original_garment_description: string;
  original_garment_image_url: string;
  process_description: string;
  process_image_urls: string[];
  final_garment_description: string;
  final_garment_image_url: string;
  techniques: string[];
  artist_attribution: string | null;
  tailor_attribution: string | null;
  related_product_id: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
}
