export interface User {
  id: number;
  role: "customer" | "rider" | "admin";
  name: string;
  username: string;
  email: string;
  phone: string;
}

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

export interface ProfileResponse {
  success: boolean;
  // The API returns { data: { user: User } } — note the nested `user` key
  data: {
    user: User;
  };
  message: string;
}

const BASE_URL = "https://api.icotrix.com";

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("akamoto_token") : null;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  if (response.status === 401) {
    // Clear token on authentication failure
    if (typeof window !== "undefined") {
      localStorage.removeItem("akamoto_token");
      localStorage.removeItem("akamoto_user");
    }
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMessage = data.message || `Request failed with status ${response.status}`;
    const error: any = new Error(errorMessage);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data as T;
}

export const api = {
  async register(
    name: string,
    email: string,
    phone: string,
    role: "customer" | "rider"
  ): Promise<RegisterResponse> {
    let formattedPhone = phone.trim();
    if (formattedPhone.startsWith("+")) {
      formattedPhone = formattedPhone.substring(1);
    }
    if (formattedPhone.startsWith("0")) {
      formattedPhone = "250" + formattedPhone.substring(1);
    } else if (!formattedPhone.startsWith("250") && formattedPhone.length === 9) {
      formattedPhone = "250" + formattedPhone;
    }

    return request<RegisterResponse>("/api/register", {
      method: "POST",
      body: JSON.stringify({ name, email, phone: formattedPhone, role }),
    });
  },

  async login(phone: string, password: string): Promise<LoginResponse> {
    let formattedPhone = phone.trim();
    if (formattedPhone.startsWith("+")) {
      formattedPhone = formattedPhone.substring(1);
    }
    if (formattedPhone.startsWith("0")) {
      formattedPhone = "250" + formattedPhone.substring(1);
    } else if (!formattedPhone.startsWith("250") && formattedPhone.length === 9) {
      formattedPhone = "250" + formattedPhone;
    }

    return request<LoginResponse>("/api/login", {
      method: "POST",
      body: JSON.stringify({ phone: formattedPhone, password }),
    });
  },

  async logout(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await request<{ success: boolean; message: string }>("/api/logout", {
        method: "POST",
      });
      return response;
    } finally {
      if (typeof window !== "undefined") {
        localStorage.removeItem("akamoto_token");
        localStorage.removeItem("akamoto_user");
      }
    }
  },

  async getProfile(): Promise<User> {
    const res = await request<ProfileResponse>("/api/me");
    // The API nests the user under data.user
    return res.data.user;
  },

  async goOnline(): Promise<{ success: boolean; message: string }> {
    return request<{ success: boolean; message: string }>("/api/rider/go-online", {
      method: "POST",
    });
  },

  async goOffline(): Promise<{ success: boolean; message: string }> {
    return request<{ success: boolean; message: string }>("/api/rider/go-offline", {
      method: "POST",
    });
  },

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
    return mockLocations.filter(loc => loc.name.toLowerCase().includes(query.toLowerCase()));
  },

  async createDelivery(payload: any): Promise<{ success: boolean; message: string; data?: any }> {
    console.log("Mock create delivery payload:", payload);
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
          }
        });
      }, 1000);
    });
  },
};
