import { BrandConfig, VehicleModel } from "./types";

export const DEFAULT_VEHICLE_CATALOG: VehicleModel[] = [
  {
    id: "xforce",
    name: "Mitsubishi Xforce",
    segment: "Compact SUV (B-SUV)",
    design_cues: "Signature Dynamic Shield front grille, distinctive T-shape LED headlights and taillights, 18-inch geometric alloy wheels, 222mm high ground clearance, modern sculpted athletic body",
    official_colors: [
      "Energetic Yellow (Signature)",
      "Red Diamond",
      "White Diamond",
      "Blade Silver",
      "Graphite Gray",
      "Jet Black"
    ],
    reference_image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "xpander-cross",
    name: "Mitsubishi Xpander Cross",
    segment: "Crossover MPV",
    design_cues: "Robust Dynamic Shield front bumper with squared protective cladding, T-shape LED headlights, roof rails, high riding stance, 17-inch two-tone alloy wheels",
    official_colors: [
      "Green Bronze Metallic (Signature)",
      "Sunrise Orange",
      "White Diamond",
      "Blade Silver",
      "Jet Black"
    ]
  },
  {
    id: "triton",
    name: "Mitsubishi All-New Triton",
    segment: "Double Cab Pickup",
    design_cues: "Beast Mode design concept, bold three-dimensional Dynamic Shield grille with integrated LED signature, wide aggressive flared fenders, robust sports bar",
    official_colors: [
      "Yamabuki Orange (Signature)",
      "Blade Silver",
      "White Diamond",
      "Graphite Gray",
      "Jet Black"
    ]
  },
  {
    id: "outlander",
    name: "Mitsubishi Outlander",
    segment: "Premium 5+2 C-SUV",
    design_cues: "Sophisticated Dynamic Shield with chrome accent louvers, multi-beam LED headlights, elegant elongated roofline, 18-inch diamond cut alloy wheels",
    official_colors: [
      "Red Diamond",
      "White Diamond",
      "Titanium Gray",
      "Black Mica"
    ]
  }
];

export const DEFAULT_BRAND_CONFIG: BrandConfig = {
  version: "v2.6-aid-hybrid-mmv",
  system_instruction: `You are an expert AI image prompt engineer for Mitsubishi Motors Vietnam (MMV).
Your ONLY task is to convert a dealer sales consultant's brief into a single, highly detailed, photorealistic IMAGE GENERATION PROMPT for Nano Banana Pro.

STRICT RULES:
1. LANGUAGE MATCHING: The enhanced prompt MUST be written in the EXACT SAME LANGUAGE as the user's input.
   - If the user writes in Vietnamese, write the entire prompt in natural, evocative, professional Vietnamese.
   - If the user writes in English, write in English.
2. OUTPUT FORMAT: Output ONLY ONE single continuous paragraph of descriptive prompt text. Never output TV commercial scripts, scene breakdowns, conversation filler, quotes, or markdown headers.
3. VEHICLE AUTHENTICITY: Always feature an authentic Mitsubishi Motors vehicle (e.g. 2025 Mitsubishi Xforce, Mitsubishi Xpander Cross, Mitsubishi All-New Triton). Emphasize signature design cues: the iconic Dynamic Shield front face, razor-sharp T-shape LED headlights, and authentic geometric alloy wheels. If a reference car photo is attached, identify the exact model and color and preserve that vehicle.
4. ENVIRONMENT & VIETNAMESE CONTEXT: Accurately capture any requested scenario (e.g. "chạy lên đèo đà lạt" -> cung đường đèo uốn lượn tại Đà Lạt, rừng thông bạt ngàn, sương mù sớm mai và ánh nắng vàng; "showroom" -> đại lý hiện đại Mitsubishi; "biển" -> cung đường ven biển).
5. CAMERA & CINEMATICS: Commercial automotive advertising photography, 8k resolution, 50mm lens, raytraced reflections on the lustrous car body, realistic motion blur on wheels if in motion, award-winning automotive campaign.
6. STRICT GUARDRAILS: Never mention or generate competitor brands (Toyota, Ford, Hyundai, Kia, Honda, Mercedes, BMW).`,
  aid_formula_template: "Commercial automotive photography, {camera}, {subject_with_mmv_specs}, {environment_vietnam}, {lighting}, hyperrealistic 8k, award-winning car campaign visual.",
  negative_prompt: "distorted car badge, deformed three-diamond emblem, competitor logos, Toyota, Ford, Hyundai, Kia, Honda, Mercedes, BMW, deformed wheels, warped headlights, blurry, low resolution, cartoon, 3d render plastic look, text watermark",
  competitor_blacklist: ["toyota", "ford", "hyundai", "kia", "honda", "mercedes", "bmw", "mazda", "vinfast", "peugeot"],
  is_active: true,
  updated_at: new Date().toISOString()
};

// Runtime in-memory storage for dynamic brand config
let currentBrandConfig: BrandConfig = { ...DEFAULT_BRAND_CONFIG };
let currentVehicleCatalog: VehicleModel[] = [...DEFAULT_VEHICLE_CATALOG];

export function getActiveBrandConfig(): BrandConfig {
  return currentBrandConfig;
}

export function updateBrandConfig(newConfig: Partial<BrandConfig>): BrandConfig {
  currentBrandConfig = {
    ...currentBrandConfig,
    ...newConfig,
    updated_at: new Date().toISOString()
  };
  return currentBrandConfig;
}

export function getVehicleCatalog(): VehicleModel[] {
  return currentVehicleCatalog;
}

export function addVehicleModel(model: VehicleModel): void {
  currentVehicleCatalog.push(model);
}
