export type OrderStatus =
  | "received"
  | "pending"
  | "requested"
  | "searching"
  | "accepted"
  | "on_the_way"
  | "delivered"
  | "failed"
  | "cancelled";

export interface AdminOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  riderName?: string;
  pickup: string;
  dropoff: string;
  itemType: string;
  price: number;
  status: OrderStatus;
  payee: "sender" | "receiver";
  createdAt: string;
  updatedAt: string;
}

export interface AdminClient {
  id: number;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  status: "active" | "suspended";
  joinedAt: string;
}

export interface AdminDispute {
  id: string;
  orderId: string;
  customerName: string;
  riderName?: string;
  type: string;
  message: string;
  status: "open" | "investigating" | "resolved";
  priority: "low" | "medium" | "high";
  createdAt: string;
}

export interface EmergencyAlert {
  id: string;
  orderId: string;
  callerName: string;
  callerRole: "customer" | "rider";
  phone: string;
  location: string;
  reason: string;
  createdAt: string;
  resolved: boolean;
}

export const MOCK_ADMIN_ORDERS: AdminOrder[] = [
  {
    id: "ORD-1042",
    customerName: "Aline Uwase",
    customerPhone: "250788123456",
    riderName: "Eric Manzi",
    pickup: "Nyabugogo Bus Terminal",
    dropoff: "Remera Giporoso",
    itemType: "Laptop",
    price: 2400,
    status: "on_the_way",
    payee: "sender",
    createdAt: "Today, 14:30",
    updatedAt: "Today, 14:45",
  },
  {
    id: "ORD-1041",
    customerName: "Jean Paul",
    customerPhone: "250788998877",
    pickup: "Kigali Heights",
    dropoff: "Kimironko Market",
    itemType: "Document",
    price: 1800,
    status: "requested",
    payee: "receiver",
    createdAt: "Today, 13:10",
    updatedAt: "Today, 13:10",
  },
  {
    id: "ORD-1040",
    customerName: "Grace Mukamana",
    customerPhone: "250788554433",
    riderName: "Aline Umuhoza",
    pickup: "Downtown CBD",
    dropoff: "Kicukiro Centre",
    itemType: "Parcel",
    price: 3200,
    status: "pending",
    payee: "sender",
    createdAt: "Today, 12:00",
    updatedAt: "Today, 12:05",
  },
  {
    id: "ORD-1039",
    customerName: "Patrick Habimana",
    customerPhone: "250788112233",
    riderName: "Eric Manzi",
    pickup: "Kanombe Airport",
    dropoff: "Nyamirambo Stadium",
    itemType: "Electronics",
    price: 4500,
    status: "delivered",
    payee: "sender",
    createdAt: "Jul 2, 2026",
    updatedAt: "Jul 2, 2026",
  },
  {
    id: "ORD-1038",
    customerName: "Marie Claire",
    customerPhone: "250788667788",
    pickup: "Gisozi Sector",
    dropoff: "King Faisal Hospital",
    itemType: "Phone",
    price: 2000,
    status: "failed",
    payee: "receiver",
    createdAt: "Jul 1, 2026",
    updatedAt: "Jul 1, 2026",
  },
  {
    id: "ORD-1037",
    customerName: "David Nkurunziza",
    customerPhone: "250788445566",
    riderName: "Jean Claude",
    pickup: "Remera Giporoso",
    dropoff: "Nyabugogo",
    itemType: "Parcel",
    price: 1600,
    status: "received",
    payee: "sender",
    createdAt: "Jun 30, 2026",
    updatedAt: "Jun 30, 2026",
  },
];

export const MOCK_ADMIN_CLIENTS: AdminClient[] = [
  { id: 1, name: "Aline Uwase", email: "aline@example.com", phone: "250788123456", totalOrders: 12, totalSpent: 28400, status: "active", joinedAt: "May 2026" },
  { id: 2, name: "Jean Paul", email: "jean@example.com", phone: "250788998877", totalOrders: 5, totalSpent: 9200, status: "active", joinedAt: "Jun 2026" },
  { id: 3, name: "Grace Mukamana", email: "grace@example.com", phone: "250788554433", totalOrders: 8, totalSpent: 15600, status: "active", joinedAt: "Apr 2026" },
  { id: 4, name: "Patrick Habimana", email: "patrick@example.com", phone: "250788112233", totalOrders: 3, totalSpent: 6100, status: "suspended", joinedAt: "Jun 2026" },
  { id: 5, name: "Marie Claire", email: "marie@example.com", phone: "250788667788", totalOrders: 2, totalSpent: 4000, status: "active", joinedAt: "Jul 2026" },
];

export const MOCK_DISPUTES: AdminDispute[] = [
  { id: "DSP-001", orderId: "ORD-1038", customerName: "Marie Claire", riderName: "Patrick H.", type: "Late delivery", message: "Package arrived 2 hours late.", status: "open", priority: "high", createdAt: "Today, 11:00" },
  { id: "DSP-002", orderId: "ORD-1035", customerName: "David N.", riderName: "Eric Manzi", type: "Package damaged", message: "Box was wet on arrival.", status: "investigating", priority: "medium", createdAt: "Yesterday" },
  { id: "DSP-003", orderId: "ORD-1030", customerName: "Aline Uwase", type: "Payment issue", message: "Charged twice for same delivery.", status: "resolved", priority: "low", createdAt: "Jul 1, 2026" },
];

export const MOCK_EMERGENCIES: EmergencyAlert[] = [
  { id: "EMG-001", orderId: "ORD-1042", callerName: "Eric Manzi", callerRole: "rider", phone: "250788654321", location: "Remera Giporoso", reason: "Traffic accident — need assistance", createdAt: "Today, 14:50", resolved: false },
];

export function getActiveOrders() {
  return MOCK_ADMIN_ORDERS.filter((o) =>
    ["requested", "pending", "searching", "accepted", "on_the_way"].includes(o.status)
  );
}

export function getOrderHistory() {
  return MOCK_ADMIN_ORDERS.filter((o) =>
    ["delivered", "failed", "cancelled"].includes(o.status)
  );
}
