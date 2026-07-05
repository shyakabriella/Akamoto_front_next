import {
  ApiResponse,
  PaginatedResponse,
  PricingQuote,
  PricingRule,
  PricingRulePayload,
  QuotePayload,
  RiderProfile,
  RiderProfilePayload,
  User,
  UserProfile,
  Order,
  OrderPayload,
  Dispute,
  DisputePayload,
  Payment,
  TopUpPayload,
  Notification,
} from "./types";

export type {
  ApiResponse,
  PaginatedResponse,
  PricingQuote,
  PricingRule,
  PricingRulePayload,
  QuotePayload,
  RiderProfile,
  RiderProfilePayload,
  User,
  UserProfile,
  UserRole,
  VehicleType,
  RiderStatus,
  Order,
  OrderPayload,
  Dispute,
  DisputePayload,
  Payment,
  TopUpPayload,
  Notification,
} from "./types";

export interface GeneratedCredentials {
  username: string;
  phone: string;
  password: string;
}

export interface RegisterResponse {
  success: boolean;
  data: {
    token: string;
    credentials_sent: boolean;
    generated_credentials: GeneratedCredentials;
    user: User;
  };
  message: string;
}

export interface LoginResponse {
  success: boolean;
  data: {
    token: string;
    user: User;
  };
  message: string;
}

const BASE_URL = "https://api.icotrix.com";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("akamoto_token");
}

function unwrapData<T>(payload: unknown): T {
  if (!payload || typeof payload !== "object") return payload as T;
  const obj = payload as Record<string, unknown>;
  if ("data" in obj && obj.data !== undefined) return obj.data as T;
  return payload as T;
}

function unwrapList<T>(payload: unknown): T[] {
  const data = unwrapData<unknown>(payload);
  if (Array.isArray(data)) return data as T[];
  if (data && typeof data === "object" && "data" in (data as object)) {
    const inner = (data as PaginatedResponse<T>).data;
    return Array.isArray(inner) ? inner : [];
  }
  return [];
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();

  const isFormData = options.body instanceof FormData;
  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });

  if (response.status === 401 && typeof window !== "undefined") {
    localStorage.removeItem("akamoto_token");
    localStorage.removeItem("akamoto_user");
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMessage =
      (data as { message?: string }).message || `Request failed with status ${response.status}`;
    const error = new Error(errorMessage) as Error & { status?: number; data?: unknown };
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data as T;
}

export const api = {
  // ── Authentication ──────────────────────────────────────────
  async register(
    name: string,
    email: string,
    phone: string,
    role: "customer" | "rider"
  ): Promise<RegisterResponse> {
    let formattedPhone = formatPhone(phone);
    return request<RegisterResponse>("/api/register", {
      method: "POST",
      body: JSON.stringify({ name, email, phone: formattedPhone, role }),
    });
  },

  async login(phone: string, password: string): Promise<LoginResponse> {
    return request<LoginResponse>("/api/login", {
      method: "POST",
      body: JSON.stringify({ phone: formatPhone(phone), password }),
    });
  },

  async logout(): Promise<{ success: boolean; message: string }> {
    try {
      return await request<{ success: boolean; message: string }>("/api/logout", {
        method: "POST",
      });
    } finally {
      if (typeof window !== "undefined") {
        localStorage.removeItem("akamoto_token");
        localStorage.removeItem("akamoto_user");
      }
    }
  },

  // ── Profile ─────────────────────────────────────────────────
  async getMe(): Promise<User> {
    const res = await request<ApiResponse<{ user: User }>>("/api/me");
    return res.data.user;
  },

  async getProfileDetails(): Promise<UserProfile | null> {
    const res = await request<ApiResponse<UserProfile | { profile: UserProfile }>>("/api/profile");
    const data = res.data;
    if (data && typeof data === "object" && "profile" in data) {
      return (data as { profile: UserProfile }).profile;
    }
    return data as UserProfile;
  },

  async updateProfile(payload: {
    image?: File;
    location_address?: string;
    street_code?: string;
  }): Promise<UserProfile> {
    const form = new FormData();
    if (payload.image) form.append("image", payload.image);
    if (payload.location_address) form.append("location_address", payload.location_address);
    if (payload.street_code) form.append("street_code", payload.street_code);

    const res = await request<ApiResponse<UserProfile | { profile: UserProfile }>>("/api/profile", {
      method: "POST",
      body: form,
    });
    const data = res.data;
    if (data && typeof data === "object" && "profile" in data) {
      return (data as { profile: UserProfile }).profile;
    }
    return data as UserProfile;
  },

  async deleteProfileImage(): Promise<void> {
    await request("/api/profile/image", { method: "DELETE" });
  },

  /** @deprecated use getMe */
  async getProfile(): Promise<User> {
    return this.getMe();
  },

  // ── Rider ───────────────────────────────────────────────────
  async getRiderProfile(): Promise<RiderProfile | null> {
    const res = await request<ApiResponse<RiderProfile | { rider: RiderProfile }>>("/api/rider/profile");
    const data = res.data;
    if (data && typeof data === "object" && "rider" in data) {
      return (data as { rider: RiderProfile }).rider;
    }
    return data as RiderProfile;
  },

  async saveRiderProfile(payload: RiderProfilePayload): Promise<RiderProfile> {
    const res = await request<ApiResponse<RiderProfile | { rider: RiderProfile }>>("/api/rider/profile", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    const data = res.data;
    if (data && typeof data === "object" && "rider" in data) {
      return (data as { rider: RiderProfile }).rider;
    }
    return data as RiderProfile;
  },

  async updateRiderProfile(payload: RiderProfilePayload): Promise<RiderProfile> {
    return this.saveRiderProfile(payload);
  },

  async goOnline(): Promise<{ success: boolean; message: string }> {
    return request("/api/rider/go-online", { method: "POST" });
  },

  async goOffline(): Promise<{ success: boolean; message: string }> {
    return request("/api/rider/go-offline", { method: "POST" });
  },

  async updateRiderLocation(payload: {
    current_latitude: number;
    current_longitude: number;
    current_address?: string;
  }): Promise<{ success: boolean; message: string }> {
    return request("/api/rider/location", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  // ── Admin Riders ────────────────────────────────────────────
  async listRiders(params?: {
    status?: string;
    is_online?: boolean;
    search?: string;
    per_page?: number;
  }): Promise<RiderProfile[]> {
    const qs = new URLSearchParams();
    if (params?.status) qs.set("status", params.status);
    if (params?.is_online !== undefined) qs.set("is_online", String(params.is_online));
    if (params?.search) qs.set("search", params.search);
    if (params?.per_page) qs.set("per_page", String(params.per_page));
    const query = qs.toString();
    const res = await request<ApiResponse<unknown>>(`/api/admin/riders${query ? `?${query}` : ""}`);
    return unwrapList<RiderProfile>(res);
  },

  async getRider(id: number): Promise<RiderProfile> {
    const res = await request<ApiResponse<RiderProfile | { rider: RiderProfile }>>(
      `/api/admin/riders/${id}`
    );
    const data = res.data;
    if (data && typeof data === "object" && "rider" in data) {
      return (data as { rider: RiderProfile }).rider;
    }
    return data as RiderProfile;
  },

  async approveRider(id: number, admin_notes?: string): Promise<RiderProfile> {
    const res = await request<ApiResponse<RiderProfile | { rider: RiderProfile }>>(
      `/api/admin/riders/${id}/approve`,
      { method: "POST", body: JSON.stringify({ admin_notes }) }
    );
    return unwrapData<RiderProfile>(res);
  },

  async rejectRider(id: number, rejection_reason: string, admin_notes?: string): Promise<RiderProfile> {
    const res = await request<ApiResponse<RiderProfile | { rider: RiderProfile }>>(
      `/api/admin/riders/${id}/reject`,
      { method: "POST", body: JSON.stringify({ rejection_reason, admin_notes }) }
    );
    return unwrapData<RiderProfile>(res);
  },

  async suspendRider(id: number, admin_notes?: string): Promise<RiderProfile> {
    const res = await request<ApiResponse<RiderProfile | { rider: RiderProfile }>>(
      `/api/admin/riders/${id}/suspend`,
      { method: "POST", body: JSON.stringify({ admin_notes }) }
    );
    return unwrapData<RiderProfile>(res);
  },

  // ── Pricing ─────────────────────────────────────────────────
  async getQuote(payload: QuotePayload): Promise<PricingQuote> {
    const res = await request<ApiResponse<PricingQuote>>("/api/pricing/quote", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return res.data;
  },

  // ── Admin Pricing Rules ─────────────────────────────────────
  async listPricingRules(params?: {
    vehicle_type?: string;
    is_active?: boolean;
    search?: string;
    per_page?: number;
  }): Promise<PricingRule[]> {
    const qs = new URLSearchParams();
    if (params?.vehicle_type) qs.set("vehicle_type", params.vehicle_type);
    if (params?.is_active !== undefined) qs.set("is_active", String(params.is_active));
    if (params?.search) qs.set("search", params.search);
    if (params?.per_page) qs.set("per_page", String(params.per_page));
    const query = qs.toString();
    const res = await request<ApiResponse<unknown>>(
      `/api/admin/pricing-rules${query ? `?${query}` : ""}`
    );
    return unwrapList<PricingRule>(res);
  },

  async getPricingRule(id: number): Promise<PricingRule> {
    const res = await request<ApiResponse<PricingRule | { pricing_rule: PricingRule }>>(
      `/api/admin/pricing-rules/${id}`
    );
    const data = res.data;
    if (data && typeof data === "object" && "pricing_rule" in data) {
      return (data as { pricing_rule: PricingRule }).pricing_rule;
    }
    return data as PricingRule;
  },

  async createPricingRule(payload: PricingRulePayload): Promise<PricingRule> {
    const res = await request<ApiResponse<PricingRule | { pricing_rule: PricingRule }>>(
      "/api/admin/pricing-rules",
      { method: "POST", body: JSON.stringify(payload) }
    );
    return unwrapData<PricingRule>(res);
  },

  async updatePricingRule(id: number, payload: PricingRulePayload): Promise<PricingRule> {
    const res = await request<ApiResponse<PricingRule | { pricing_rule: PricingRule }>>(
      `/api/admin/pricing-rules/${id}`,
      { method: "PUT", body: JSON.stringify(payload) }
    );
    return unwrapData<PricingRule>(res);
  },

  async patchPricingRule(id: number, payload: Partial<PricingRulePayload>): Promise<PricingRule> {
    const res = await request<ApiResponse<PricingRule | { pricing_rule: PricingRule }>>(
      `/api/admin/pricing-rules/${id}`,
      { method: "PATCH", body: JSON.stringify(payload) }
    );
    return unwrapData<PricingRule>(res);
  },

  async deletePricingRule(id: number): Promise<void> {
    await request(`/api/admin/pricing-rules/${id}`, { method: "DELETE" });
  },

  async activatePricingRule(id: number): Promise<PricingRule> {
    const res = await request<ApiResponse<PricingRule | { pricing_rule: PricingRule }>>(
      `/api/admin/pricing-rules/${id}/activate`,
      { method: "POST" }
    );
    return unwrapData<PricingRule>(res);
  },

  /** Stub until order API is available */
  async createDelivery(payload: Record<string, unknown>): Promise<{
    success: boolean;
    message: string;
    data?: Record<string, unknown>;
  }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: "Delivery request created and searching for nearby riders.",
          data: {
            id: `DEL-${Math.floor(100 + Math.random() * 900)}`,
            status: "searching_rider",
            ...payload,
            createdAt: "Just now",
          },
        });
      }, 1000);
    });
  },

  // ── Orders ─────────────────────────────────────────────────
  async listOrders(params?: {
    status?: string;
    per_page?: number;
  }): Promise<Order[]> {
    const qs = new URLSearchParams();
    if (params?.status) qs.set("status", params.status);
    if (params?.per_page) qs.set("per_page", String(params.per_page));
    const query = qs.toString();
    const res = await request<ApiResponse<unknown>>(`/api/orders${query ? `?${query}` : ""}`);
    return unwrapList<Order>(res);
  },

  async getOrder(id: number): Promise<Order> {
    const res = await request<ApiResponse<Order | { order: Order }>>(`/api/orders/${id}`);
    const data = res.data;
    if (data && typeof data === "object" && "order" in data) {
      return (data as { order: Order }).order;
    }
    return data as Order;
  },

  async createOrder(payload: OrderPayload): Promise<Order> {
    const res = await request<ApiResponse<Order | { order: Order }>>("/api/orders", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return unwrapData<Order>(res);
  },

  async updateOrder(id: number, payload: Partial<OrderPayload>): Promise<Order> {
    const res = await request<ApiResponse<Order | { order: Order }>>(`/api/orders/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    return unwrapData<Order>(res);
  },

  async cancelOrder(id: number): Promise<Order> {
    const res = await request<ApiResponse<Order | { order: Order }>>(`/api/orders/${id}/cancel`, {
      method: "POST",
    });
    return unwrapData<Order>(res);
  },

  async acceptOrder(id: number): Promise<Order> {
    const res = await request<ApiResponse<Order | { order: Order }>>(`/api/orders/${id}/accept`, {
      method: "POST",
    });
    return unwrapData<Order>(res);
  },

  async completeOrder(id: number): Promise<Order> {
    const res = await request<ApiResponse<Order | { order: Order }>>(`/api/orders/${id}/complete`, {
      method: "POST",
    });
    return unwrapData<Order>(res);
  },

  // ── Customer Orders ───────────────────────────────────────
  async getCustomerOrders(params?: {
    status?: string;
    per_page?: number;
  }): Promise<Order[]> {
    const qs = new URLSearchParams();
    if (params?.status) qs.set("status", params.status);
    if (params?.per_page) qs.set("per_page", String(params.per_page));
    const query = qs.toString();
    const res = await request<ApiResponse<unknown>>(`/api/customer/orders${query ? `?${query}` : ""}`);
    return unwrapList<Order>(res);
  },

  async getCustomerActiveOrders(): Promise<Order[]> {
    const res = await request<ApiResponse<unknown>>("/api/customer/active-orders");
    return unwrapList<Order>(res);
  },

  // ── Disputes ──────────────────────────────────────────────
  async listDisputes(params?: {
    status?: string;
    per_page?: number;
  }): Promise<Dispute[]> {
    const qs = new URLSearchParams();
    if (params?.status) qs.set("status", params.status);
    if (params?.per_page) qs.set("per_page", String(params.per_page));
    const query = qs.toString();
    const res = await request<ApiResponse<unknown>>(`/api/disputes${query ? `?${query}` : ""}`);
    return unwrapList<Dispute>(res);
  },

  async getDispute(id: number): Promise<Dispute> {
    const res = await request<ApiResponse<Dispute | { dispute: Dispute }>>(`/api/disputes/${id}`);
    const data = res.data;
    if (data && typeof data === "object" && "dispute" in data) {
      return (data as { dispute: Dispute }).dispute;
    }
    return data as Dispute;
  },

  async createDispute(payload: DisputePayload): Promise<Dispute> {
    const res = await request<ApiResponse<Dispute | { dispute: Dispute }>>("/api/disputes", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return unwrapData<Dispute>(res);
  },

  async updateDispute(id: number, payload: {
    status?: string;
    resolution?: string;
    admin_notes?: string;
  }): Promise<Dispute> {
    const res = await request<ApiResponse<Dispute | { dispute: Dispute }>>(`/api/disputes/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    return unwrapData<Dispute>(res);
  },

  // ── Payments ───────────────────────────────────────────────
  async listPayments(params?: {
    status?: string;
    per_page?: number;
  }): Promise<Payment[]> {
    const qs = new URLSearchParams();
    if (params?.status) qs.set("status", params.status);
    if (params?.per_page) qs.set("per_page", String(params.per_page));
    const query = qs.toString();
    const res = await request<ApiResponse<unknown>>(`/api/payments${query ? `?${query}` : ""}`);
    return unwrapList<Payment>(res);
  },

  async topUpWallet(payload: TopUpPayload): Promise<Payment> {
    const res = await request<ApiResponse<Payment | { payment: Payment }>>("/api/payments/top-up", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return unwrapData<Payment>(res);
  },

  // ── Notifications ───────────────────────────────────────────
  async listNotifications(params?: {
    per_page?: number;
  }): Promise<Notification[]> {
    const qs = new URLSearchParams();
    if (params?.per_page) qs.set("per_page", String(params.per_page));
    const query = qs.toString();
    const res = await request<ApiResponse<unknown>>(`/api/notifications${query ? `?${query}` : ""}`);
    return unwrapList<Notification>(res);
  },

  async markNotificationAsRead(id: number): Promise<Notification> {
    const res = await request<ApiResponse<Notification | { notification: Notification }>>(
      `/api/notifications/${id}/read`,
      { method: "PUT" }
    );
    return unwrapData<Notification>(res);
  },

  // ── Location search (client-side until maps API) ────────────
  async searchLocations(query: string): Promise<Array<{ name: string; lat: number; lng: number }>> {
    const mockLocations = [
      { name: "Nyabugogo Bus Terminal, Kigali", lat: -1.9392, lng: 30.0449 },
      { name: "Kigali Heights, Kacyiru", lat: -1.9489, lng: 30.0898 },
      { name: "Remera Giporoso, Kigali", lat: -1.9612, lng: 30.1224 },
      { name: "Downtown Kigali (CBD)", lat: -1.9441, lng: 30.0619 },
      { name: "Kimironko Market, Kigali", lat: -1.9365, lng: 30.1262 },
      { name: "Nyamirambo Stadium, Kigali", lat: -1.9706, lng: 30.0444 },
      { name: "Kanombe Airport, Kigali", lat: -1.9648, lng: 30.1345 },
      { name: "Gisozi Sector, Kigali", lat: -1.9189, lng: 30.0754 },
      { name: "Kicukiro Centre, Kigali", lat: -1.9782, lng: 30.1042 },
    ];
    if (!query) return [];
    return mockLocations.filter((loc) => loc.name.toLowerCase().includes(query.toLowerCase()));
  },
};

function formatPhone(phone: string): string {
  let formattedPhone = phone.trim();
  if (formattedPhone.startsWith("+")) formattedPhone = formattedPhone.substring(1);
  if (formattedPhone.startsWith("0")) formattedPhone = "250" + formattedPhone.substring(1);
  else if (!formattedPhone.startsWith("250") && formattedPhone.length === 9) {
    formattedPhone = "250" + formattedPhone;
  }
  return formattedPhone;
}
