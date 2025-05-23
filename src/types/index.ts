// src/types/index.ts or src/types.ts
export interface Profile {
  id: string;
  created_at?: string;
  updated_at?: string;
  full_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  role?: string;
  settings?: any; // Add this line
}
// Product types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  created_at: string;
  updated_at: string;
  stock: number;
  discount_percent?: number;
  original_price?: number;
  additional_images?: string[];
  ingredients?: string;
  how_to_use?: string;
  benefits?: string[];
}

// Review/Feedback types
export interface Review {
  id: string;
  user_id?: string;
  product_id: string;
  rating: number;
  comment: string;
  created_at: string;
  approved: boolean;
}

// User types
export interface UserProfile {
  id: string;
  full_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  role?: string;
}

// Cart Item type
export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

// Wishlist Item type
export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
}

// Order types
export interface Order {
  id: string;
  user_id?: string;
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  created_at: string;
  updated_at?: string;
  payment_method?: string;
  shipping_address?: string;
  shipping_city?: string;
  shipping_state?: string;
  shipping_zip?: string;
  shipping_country?: string;
  phone?: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_name: string;
  quantity: number;
  price: number;
}