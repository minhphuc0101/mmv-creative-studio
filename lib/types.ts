export type Role = "admin" | "dealer_manager" | "sales_consultant";

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: Role;
  dealership: {
    id: string;
    name: string;
    code: string;
    monthly_budget_remaining: number;
  };
  daily_credits_remaining: number;
  daily_limit: number;
  daily_budget_vnd?: number;
  daily_spent_vnd?: number;
  daily_remaining_vnd?: number;
}

export interface VehicleModel {
  id: string;
  name: string;
  segment: string;
  design_cues: string;
  official_colors: string[];
  reference_image?: string;
}

export type AspectRatio = "1:1" | "16:9" | "9:16" | "4:3";
export type Resolution = "1K" | "2K";

export interface BrandConfig {
  version: string;
  system_instruction: string;
  aid_formula_template: string;
  negative_prompt: string;
  competitor_blacklist: string[];
  is_active: boolean;
  updated_at: string;
}

export interface GenerationAuditRecord {
  job_id: string;
  timestamp: string;
  user: {
    id: string;
    name: string;
    email: string;
    dealer_name: string;
  };
  inputs: {
    user_prompt: string;
    aspect_ratio: AspectRatio;
    resolution: Resolution;
    has_reference_image: boolean;
  };
  gemini_enhancement: {
    enhanced_prompt: string;
    prompt_tokens: number;
    completion_tokens: number;
    latency_ms: number;
  };
  generation: {
    model: string; // "Nano Banana Pro 2"
    status: "completed" | "failed" | "processing";
    image_url: string;
    credits_deducted: number;
    latency_ms: number;
  };
}
