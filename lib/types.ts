export type UserRole = "customer" | "rider" | "admin";
export type RiderStatus = "pending" | "approved" | "rejected" | "suspended";
export type VehicleType = "moto" | "bicycle" | "car" | "van";

export interface User {
  id: number;
  role: UserRole;
  name: string;
  username: string;
  email: string;
  phone: string;
}

export interface UserProfile {
  id?: number;
  user_id?: number;
  image_url?: string | null;
  location_address?: string | null;
  street_code?: string | null;
}

export interface RiderProfile {
  id: number;
  user_id: number;
  vehicle_type: VehicleType;
  vehicle_plate_number?: string | null;
  vehicle_color?: string | null;
  national_id?: string | null;
  driving_license_number?: string | null;
  status: RiderStatus;
  is_online?: boolean;
  rejection_reason?: string | null;
  admin_notes?: string | null;
  current_latitude?: number | null;
  current_longitude?: number | null;
  current_address?: string | null;
  user?: User;
  total_orders?: number;
  rating?: number;
  total_earnings?: number;
  created_at?: string;
  updated_at?: string;
}

export interface PricingRule {
  id: number;
  name: string;
  vehicle_type: VehicleType;
  base_distance_km: number;
  base_price: number;
  extra_price_per_km: number;
  minimum_price: number;
  commission_percentage: number;
  currency: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface PricingQuote {
  distance_km: number;
  base_price: number;
  extra_cost: number;
  total_price: number;
  commission_percentage?: number;
  commission_amount?: number;
  rider_earning?: number;
  currency?: string;
}

export interface PaginatedMeta {
  current_page?: number;
  last_page?: number;
  per_page?: number;
  total?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page?: number;
  last_page?: number;
  per_page?: number;
  total?: number;
}

export interface RiderProfilePayload {
  vehicle_type: VehicleType;
  vehicle_plate_number?: string;
  vehicle_color?: string;
  national_id?: string;
  driving_license_number?: string;
}

export interface PricingRulePayload {
  name: string;
  vehicle_type: VehicleType;
  base_distance_km: number;
  base_price: number;
  extra_price_per_km: number;
  minimum_price: number;
  commission_percentage: number;
  currency: string;
  is_active: boolean;
}

export interface QuotePayload {
  pickup_latitude?: number;
  pickup_longitude?: number;
  dropoff_latitude?: number;
  dropoff_longitude?: number;
  distance_km?: number;
  vehicle_type: VehicleType;
}

export type OrderStatus = "pending" | "searching_rider" | "rider_assigned" | "rider_to_pickup" | "at_pickup" | "in_transit" | "delivered" | "cancelled" | "failed";

export interface Order {
  id: number;
  customer_id: number;
  rider_id?: number | null;
  status: OrderStatus;
  vehicle_type: VehicleType;
  pickup_address: string;
  pickup_latitude: number;
  pickup_longitude: number;
  dropoff_address: string;
  dropoff_latitude: number;
  dropoff_longitude: number;
  distance_km: number;
  base_price: number;
  extra_cost: number;
  total_price: number;
  commission_percentage: number;
  commission_amount: number;
  rider_earning: number;
  currency: string;
  item_description?: string | null;
  item_value?: number | null;
  receiver_name?: string | null;
  receiver_phone?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
  customer?: User;
  rider?: RiderProfile;
}

export interface OrderPayload {
  pickup_address: string;
  pickup_latitude: number;
  pickup_longitude: number;
  dropoff_address: string;
  dropoff_latitude: number;
  dropoff_longitude: number;
  vehicle_type: VehicleType;
  item_description?: string;
  item_value?: number;
  receiver_name?: string;
  receiver_phone?: string;
  notes?: string;
}

export type DisputeStatus = "open" | "investigating" | "resolved" | "closed";

export interface Dispute {
  id: number;
  order_id: number;
  user_id: number;
  status: DisputeStatus;
  type: string;
  description: string;
  resolution?: string | null;
  admin_notes?: string | null;
  created_at: string;
  updated_at: string;
  order?: Order;
  user?: User;
}

export interface DisputePayload {
  order_id: number;
  type: string;
  description: string;
}

export type PaymentStatus = "pending" | "completed" | "failed" | "refunded";
export type PaymentMethod = "mobile_money" | "cash" | "wallet" | "card";

export interface Payment {
  id: number;
  user_id: number;
  order_id?: number | null;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method: PaymentMethod;
  transaction_id?: string | null;
  description?: string | null;
  created_at: string;
  updated_at: string;
  user?: User;
  order?: Order;
}

export interface TopUpPayload {
  amount: number;
  method: PaymentMethod;
  transaction_id?: string;
}

export type NotificationType = "order_created" | "rider_assigned" | "order_delivered" | "order_cancelled" | "dispute_created" | "payment_received";

export interface Notification {
  id: number;
  user_id: number;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown> | null;
  is_read: boolean;
  created_at: string;
  user?: User;
}
