import fs from "fs";
import path from "path";
import { GenerationAuditRecord, UserSession } from "./types";

const LOG_FILE = path.join(process.cwd(), ".audit_logs.json");

// Default mock session for development (Phuc Tran - Dealer Sales Consultant)
let mockUserSession: UserSession = {
  id: "usr_phuctran_01",
  name: "Phuc Tran",
  email: "phuc.tran@testmmv.com",
  role: "admin", // Admin role gives access to both Studio and Brand Governance
  dealership: {
    id: "dealer_hcm_01",
    name: "Mitsubishi Saigon Central",
    code: "MMV-SGN-01",
    monthly_budget_remaining: 850
  },
  daily_credits_remaining: 14,
  daily_limit: 20
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
  return mockUserSession;
}

export function checkAndDeductQuota(creditsNeeded: number = 1): { success: boolean; remaining: number; error?: string } {
  if (mockUserSession.daily_credits_remaining < creditsNeeded) {
    return {
      success: false,
      remaining: mockUserSession.daily_credits_remaining,
      error: `Daily quota limit reached (${mockUserSession.daily_credits_remaining} credits left). Contact your Dealer Manager to request additional budget.`
    };
  }

  if (mockUserSession.dealership.monthly_budget_remaining < creditsNeeded) {
    return {
      success: false,
      remaining: mockUserSession.daily_credits_remaining,
      error: `Dealership branch monthly budget exhausted. Contact HQ Administrator.`
    };
  }

  // Atomic deduction
  mockUserSession.daily_credits_remaining -= creditsNeeded;
  mockUserSession.dealership.monthly_budget_remaining -= creditsNeeded;

  return {
    success: true,
    remaining: mockUserSession.daily_credits_remaining
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
