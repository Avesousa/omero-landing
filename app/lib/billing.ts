// Cliente de omero-billing-api para el alta desde la landing.
// Contrato: omero-billing/AiBuild/mvp/omero-billing/WIP/technical-spec.md §6

export const BILLING_API_URL = process.env.NEXT_PUBLIC_BILLING_API_URL ?? "http://localhost:8090";

export type PlanCode = "BASICO" | "PRO" | "CADENA";
export type PlanInterval = "MONTHLY" | "ANNUAL";
export type PaymentMode = "CARD" | "MP_CHECKOUT";
export type SubscriptionStatus =
  | "PENDING" | "TRIALING" | "ACTIVE" | "PAST_DUE" | "SUSPENDED" | "CANCELLED" | "EXPIRED" | "FAILED";

export interface BillingPlan {
  id: string;
  code: PlanCode;
  interval: PlanInterval;
  name: string;
  description: string | null;
  price: number;
  currency: string;
  trialDays: number;
  features: string[];
}

export interface SignupResult {
  subscriptionId: string;
  status: SubscriptionStatus;
  planName: string;
  trialEndsAt: string | null;
  omeroAppUrl: string;
  checkoutUrl: string | null;
}

export class BillingError extends Error {
  constructor(message: string, public code: string, public status: number) {
    super(message);
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${BILLING_API_URL}${path}`, {
      ...init,
      headers: { "Content-Type": "application/json", ...(init?.headers as Record<string, string>) },
    });
  } catch {
    throw new BillingError("No pudimos conectarnos. Revisá tu conexión y probá de nuevo.", "NETWORK", 0);
  }
  let body: { success?: boolean; data?: T; error?: string; code?: string } | null = null;
  try {
    body = await res.json();
  } catch {
    /* sin body */
  }
  if (!res.ok || !body?.success) {
    throw new BillingError(body?.error ?? "Algo salió mal. Probá de nuevo.", body?.code ?? "UNKNOWN", res.status);
  }
  return body.data as T;
}

export const billing = {
  plans: () => request<BillingPlan[]>("/api/plans"),
  config: () => request<{ mpPublicKey: string; omeroAppUrl: string }>("/api/config"),
  signup: (input: {
    planId: string;
    businessName: string;
    email: string;
    password: string;
    paymentMode: PaymentMode;
    cardToken?: string;
    payerEmail?: string;
  }) => request<SignupResult>("/api/signup", { method: "POST", body: JSON.stringify(input) }),
  status: (subscriptionId: string) => request<SignupResult>(`/api/signup/${encodeURIComponent(subscriptionId)}/status`),
};

const ars = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });
const date = new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "long", year: "numeric" });
export const formatARS = (n: number) => ars.format(n);
export const formatDate = (iso: string | null | undefined) => (iso ? date.format(new Date(iso)) : "—");
