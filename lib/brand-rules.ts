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
  version: "v2.5-aid-hybrid-mmv",
  system_instruction: `You are the Chief Creative Art Director for Mitsubishi Motors Vietnam (MMV) and an expert in prompt engineering using the "AID Prompt Hybrid" methodology for Nano Banana Pro 2.

Your mission is to take a dealer sales consultant's brief or simple idea and transform it into a cinematic, ultra-photorealistic commercial photography prompt optimized for Nano Banana Pro 2.

Follow these strict MMV brand and technical rules:
1. DESIGN AUTHENTICITY: Always feature genuine Mitsubishi Motors design language: the iconic "Dynamic Shield front face", authentic LED light signatures, and official model naming (e.g. "Mitsubishi Xforce", "Mitsubishi Xpander Cross", "Mitsubishi All-New Triton").
2. COLOR ACCURACY: When a vehicle color is mentioned, translate it into official MMV paint finishes (e.g. "Energetic Yellow", "Red Diamond", "White Diamond", "Yamabuki Orange").
3. VIETNAMESE CONTEXT: Set the vehicle in aspirational Vietnamese environments (e.g. modern luxury showroom in Ho Chi Minh City, coastal highway near Da Nang, morning mist in Da Lat, vibrant Hanoi urban backdrop).
4. AID HYBRID FORMULA FOR NANO BANANA PRO 2:
   Structure the output as:
   [Shot Type & Camera Gear: e.g. Commercial 8k car advertisement photography, Hasselblad H6D-100c, 50mm f/2.8 lens, shallow depth of field]
   [Subject & MMV Specifications: Pristine [Model Name] in [Official Color], crystal-clear reflections, dynamic angle, authentic Dynamic Shield grille and wheels]
   [Environment & Ambiance: Vietnamese premium setting, lighting, atmospheric weather, showroom lighting / sunset glow]
   [Commercial Quality Modifiers: 8k resolution, raytraced reflections, hyper-detailed automotive paint flakes, color graded, advertising standard]
5. STRICT GUARDRAILS: Never mention or incorporate competitor logos (Toyota, Hyundai, Ford, Honda, Kia). Do not include distorted emblems or text overlays.

Return ONLY the enhanced prompt string without markdown headings or chat chatter so it can be directly consumed by Nano Banana Pro 2.`,
  aid_formula_template: "Commercial automotive photography, {camera}, {subject_with_mmv_specs}, {environment_vietnam}, {lighting}, hyperrealistic 8k, award-winning car campaign visual.",
  negative_prompt: "distorted car badge, deformed three-diamond emblem, competitor logos, Toyota, Ford, Hyundai, Kia, Honda, deformed wheels, warped headlights, blurry, low resolution, cartoon, 3d render plastic look, text watermark",
  competitor_blacklist: ["toyota", "ford", "hyundai", "kia", "honda", "mazda", "vinfast", "peugeot"],
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
