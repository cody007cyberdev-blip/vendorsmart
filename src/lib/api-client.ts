/**
 * Cliente API para o backend Express. Todas as chamadas usam credentials: 'include'
 * para que o cookie de sessao httpOnly seja enviado.
 */
const BASE = "";

export class ApiError extends Error {
  status: number;
  details?: unknown;
  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) ?? {}),
  };
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });

  let data: unknown = null;
  const text = await res.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }
  if (!res.ok) {
    const msg =
      (data && typeof data === "object" && "error" in data
        ? String((data as { error: unknown }).error)
        : `Erro HTTP ${res.status}`) || `Erro HTTP ${res.status}`;
    throw new ApiError(msg, res.status, data);
  }
  return data as T;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "POST", body: body ? JSON.stringify(body) : undefined }),
  put: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "PUT", body: body ? JSON.stringify(body) : undefined }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};

// ─── Tipos partilhados com o backend ─────────────────────
export type Role = "admin" | "manager" | "vendor" | "customer";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  phone?: string | null;
  twoFactorEnabled?: boolean;
  lastLoginAt?: string | null;
}

export interface Product {
  id: string;
  sku: string;
  barcode: string | null;
  name: string;
  description: string | null;
  categoryId: string | null;
  supplierId: string | null;
  unit: string;
  currentStock: number;
  reorderPoint: number;
  reorderQuantity: number;
  costPrice: number;
  sellingPrice: number;
  status: "active" | "discontinued" | "archived";
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactName: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  leadTimeDays: number;
  rating: number;
  isActive: boolean;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface StockMovement {
  id: string;
  productId: string;
  type: "entry" | "exit" | "adjustment" | "transfer";
  quantity: number;
  fromLocation: string | null;
  toLocation: string | null;
  reference: string | null;
  notes: string | null;
  performedById: string | null;
  createdAt: string;
}

export interface ShoppingList {
  id: string;
  publicToken: string;
  customerId: string | null;
  customerName: string | null;
  customerPhone: string | null;
  status: "open" | "ready" | "processing" | "completed" | "cancelled";
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  items?: ShoppingListItem[];
}

export interface ShoppingListItem {
  id: string;
  listId: string;
  productId: string | null;
  productName: string;
  quantity: number;
  unitPrice: number;
  notes: string | null;
  createdAt: string;
}

export interface Sale {
  id: string;
  saleNumber: string;
  vendorId: string | null;
  customerId: string | null;
  shoppingListId: string | null;
  itemsJson: string;
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: "cash" | "card" | "transfer" | "other";
  status: "pending" | "completed" | "cancelled" | "refunded";
  notes: string | null;
  createdAt: string;
}

export interface PurchaseOrder {
  id: string;
  orderNumber: string;
  supplierId: string | null;
  status: "draft" | "submitted" | "partial" | "received" | "cancelled";
  totalCost: number;
  expectedDelivery: string | null;
  receivedAt: string | null;
  notes: string | null;
  createdById: string | null;
  createdAt: string;
  updatedAt: string;
  items?: PurchaseOrderItem[];
}

export interface PurchaseOrderItem {
  id: string;
  purchaseOrderId: string;
  productId: string;
  quantityOrdered: number;
  quantityReceived: number;
  unitCost: number;
}

export interface Notification {
  id: string;
  userId: string | null;
  type:
    | "low_stock"
    | "zero_stock"
    | "po_reminder"
    | "po_received"
    | "new_sale"
    | "shopping_list_ready"
    | "system";
  title: string;
  message: string;
  link: string | null;
  referenceId: string | null;
  isRead: boolean;
  createdAt: string;
}

export interface DashboardData {
  products: {
    total: number;
    lowStock: number;
    outOfStock: number;
    ok: number;
    totalStockValue: number;
  };
  sales: {
    totalToday: number;
    totalAllTime: number;
    transactionsToday: number;
    transactionsAll: number;
  };
  recentMovements: StockMovement[];
  openShoppingLists: number;
  pendingOrders: number;
}

export interface Report {
  id: string;
  title: string;
  type: "sales" | "stock" | "movements" | "purchases" | "suppliers" | "custom";
  format: "csv" | "xlsx" | "pdf" | "json";
  filtersJson: string;
  filePath: string | null;
  rowCount: number;
  generatedById: string | null;
  createdAt: string;
}
