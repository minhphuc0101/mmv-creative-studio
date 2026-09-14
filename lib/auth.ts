import { UserSession } from "./types";

export const MOCK_ACCOUNTS: UserSession[] = [
  {
    id: "usr_phuctran_01",
    name: "Phuc Tran",
    email: "phuc.tran@mitsubishi-saigon.vn",
    role: "sales_consultant",
    dealership: {
      id: "dealer_hcm_01",
      name: "Mitsubishi Saigon Central",
      code: "MMV-SGN-01",
      monthly_budget_remaining: 850,
    },
    daily_credits_remaining: 14,
    daily_limit: 20,
  },
  {
    id: "usr_admin_01",
    name: "Minh Nguyen (HQ Admin)",
    email: "minh.admin@mmv.com.vn",
    role: "admin",
    dealership: {
      id: "dealer_hq_01",
      name: "Mitsubishi Motors Vietnam HQ",
      code: "MMV-HQ-VN",
      monthly_budget_remaining: 5000,
    },
    daily_credits_remaining: 50,
    daily_limit: 50,
  },
  {
    id: "usr_manager_01",
    name: "Hieu Le (Dealer Manager)",
    email: "hieu.le@dealer-hanoi.vn",
    role: "dealer_manager",
    dealership: {
      id: "dealer_han_02",
      name: "Mitsubishi Hanoi West",
      code: "MMV-HAN-02",
      monthly_budget_remaining: 1200,
    },
    daily_credits_remaining: 30,
    daily_limit: 30,
  },
];

const AUTH_KEY = "mmv_creative_studio_user";

export function getStoredUser(): UserSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

export function setStoredUser(user: UserSession): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  } catch {}
}

export function clearStoredUser(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(AUTH_KEY);
  } catch {}
}
