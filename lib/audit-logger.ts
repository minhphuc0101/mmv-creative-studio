import fs from "fs";
import path from "path";
import { GenerationAuditRecord, UserSession } from "./types";

const LOG_FILE = path.join(process.cwd(), ".audit_logs.json");
const BUDGET_FILE = path.join(process.cwd(), ".daily_budget.json");

// Daily limit for testing tool: 5 generations per day
export const DAILY_LIMIT_CREDITS = 5;
// Cost per image generation (~$0.032 USD = ~800 VND)
export const COST_PER_IMAGE_VND = 800;
export const DAILY_BUDGET_VND = DAILY_LIMIT_CREDITS * COST_PER_IMAGE_VND;

export interface DailyBudgetState {
  date: string; // YYYY-MM-DD
  daily_budget_vnd: number;
  spent_vnd: number;
  remaining_vnd: number;
  cost_per_image_vnd: number;
  daily_limit_credits: number;
  remaining_credits: number;
  used_credits: number;
}

function getTodayString(): string {
  return new Date().toISOString().split("T")[0];
}

export function readDailyBudget(): DailyBudgetState {
  const today = getTodayString();
  const defaultState: DailyBudgetState = {
    date: today,
    daily_budget_vnd: DAILY_BUDGET_VND,
    spent_vnd: 0,
    remaining_vnd: DAILY_BUDGET_VND,
    cost_per_image_vnd: COST_PER_IMAGE_VND,
    daily_limit_credits: DAILY_LIMIT_CREDITS,
    remaining_credits: DAILY_LIMIT_CREDITS,
    used_credits: 0,
  };

  try {
    if (fs.existsSync(BUDGET_FILE)) {
      const data = fs.readFileSync(BUDGET_FILE, "utf-8");
      const state: DailyBudgetState = JSON.parse(data);
      if (state.date === today) {
        return state;
      }
    }
  } catch (err) {
    console.error("Failed to read daily budget file:", err);
  }

  // New day or first run: initialize with 200,000 VND
  writeDailyBudget(defaultState);
  return defaultState;
}

export function writeDailyBudget(state: DailyBudgetState): void {
  try {
    fs.writeFileSync(BUDGET_FILE, JSON.stringify(state, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write daily budget file:", err);
  }
}

// Default mock session for development
let mockUserSession: UserSession = {
  id: "usr_phuctran_01",
  name: "Phuc Tran",
  email: "phuc.tran@testmmv.com",
  role: "admin",
  dealership: {
    id: "dealer_hcm_01",
    name: "Mitsubishi Saigon Central",
    code: "MMV-SGN-01",
    monthly_budget_remaining: 5000,
  },
  daily_credits_remaining: DAILY_LIMIT_CREDITS,
  daily_limit: DAILY_LIMIT_CREDITS,
  daily_budget_vnd: DAILY_BUDGET_VND,
  daily_spent_vnd: 0,
  daily_remaining_vnd: DAILY_BUDGET_VND,
};

function readLogsFromFile(): GenerationAuditRecord[] {
  try {
    if (fs.existsSync(LOG_FILE)) {
      const data = fs.readFileSync(LOG_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch {
    // ignore error
  }
  return [];
}

function writeLogsToFile(logs: GenerationAuditRecord[]) {
  try {
    fs.writeFileSync(LOG_FILE, JSON.stringify(logs, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write audit logs:", err);
  }
}

export function getCurrentUserSession(): UserSession {
  const budget = readDailyBudget();
  return {
    ...mockUserSession,
    daily_credits_remaining: budget.remaining_credits,
    daily_limit: budget.daily_limit_credits,
    daily_budget_vnd: budget.daily_budget_vnd,
    daily_spent_vnd: budget.spent_vnd,
    daily_remaining_vnd: budget.remaining_vnd,
  };
}

export function checkAndDeductQuota(creditsNeeded: number = 1): {
  success: boolean;
  remaining: number;
  remainingVnd: number;
  spentVnd: number;
  totalVnd: number;
  error?: string;
} {
  const budget = readDailyBudget();
  const costVnd = creditsNeeded * COST_PER_IMAGE_VND;

  if (budget.remaining_credits < creditsNeeded) {
    return {
      success: false,
      remaining: budget.remaining_credits,
      remainingVnd: budget.remaining_vnd,
      spentVnd: budget.spent_vnd,
      totalVnd: budget.daily_budget_vnd,
      error: `Hạn mức thử nghiệm hôm nay (5 lượt tạo ảnh / ngày) đã đạt giới hạn. Đã sử dụng hết ${budget.used_credits} / 5 lượt. Hệ thống sẽ tự động làm mới vào 00:00 ngày mai.`,
    };
  }

  // Deduct
  budget.spent_vnd += costVnd;
  budget.remaining_vnd = Math.max(0, budget.daily_budget_vnd - budget.spent_vnd);
  budget.used_credits += creditsNeeded;
  budget.remaining_credits = Math.max(0, budget.daily_limit_credits - budget.used_credits);

  writeDailyBudget(budget);

  // Sync mock session
  mockUserSession.daily_credits_remaining = budget.remaining_credits;
  mockUserSession.daily_limit = budget.daily_limit_credits;
  mockUserSession.daily_budget_vnd = budget.daily_budget_vnd;
  mockUserSession.daily_spent_vnd = budget.spent_vnd;
  mockUserSession.daily_remaining_vnd = budget.remaining_vnd;

  return {
    success: true,
    remaining: budget.remaining_credits,
    remainingVnd: budget.remaining_vnd,
    spentVnd: budget.spent_vnd,
    totalVnd: budget.daily_budget_vnd,
  };
}

export function recordAuditLog(record: GenerationAuditRecord): void {
  const existing = readLogsFromFile();
  existing.unshift(record);
  // Keep latest 100 logs
  writeLogsToFile(existing.slice(0, 100));
}

export function getRecentAuditLogs(limit: number = 20): GenerationAuditRecord[] {
  const logs = readLogsFromFile();
  return logs.slice(0, limit);
}
