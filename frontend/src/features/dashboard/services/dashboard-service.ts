import { backendFetch } from "@/lib/backend-api";

export type DashboardHomeData = {
  greeting?: string;
  stats?: {
    careAppointments?: number;
    pendingRequests?: number;
    unreadMessages?: number;
    nextAppointmentLabel?: string;
    pendingDetail?: string;
    messagesDetail?: string;
  };
  [key: string]: unknown;
};

export type DashboardAppointmentsData = {
  weekStart?: string;
  days?: Array<{
    date?: string;
    label?: string;
    count?: number;
    appointments?: Array<Record<string, unknown>>;
  }>;
  [key: string]: unknown;
};

export type DashboardRecommendedData = {
  recipient?: {
    id?: string;
    fullName?: string;
    [key: string]: unknown;
  } | null;
  recommendations?: Array<Record<string, unknown>>;
  [key: string]: unknown;
};

/** GET /dashboard */
export function getDashboardHome() {
  return backendFetch<DashboardHomeData>("/dashboard");
}

/** GET /dashboard/appointments */
export function getDashboardAppointments(query?: { weekStart?: string }) {
  return backendFetch<DashboardAppointmentsData>("/dashboard/appointments", {
    query,
  });
}

/** GET /dashboard/recommended */
export function getDashboardRecommended(query?: { recipientId?: string }) {
  return backendFetch<DashboardRecommendedData>("/dashboard/recommended", {
    query,
  });
}

/** GET /health (via BFF) */
export function getApiHealth() {
  return backendFetch<{
    status: string;
    uptime: number;
    timestamp: string;
  }>("/health");
}

/** GET / (welcome) */
export function getApiWelcome() {
  return backendFetch<unknown>("/");
}
