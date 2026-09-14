import { NextRequest, NextResponse } from "next/server";
import { getActiveBrandConfig, getVehicleCatalog, updateBrandConfig, addVehicleModel } from "@/lib/brand-rules";

export async function GET() {
  const config = getActiveBrandConfig();
  const catalog = getVehicleCatalog();

  return NextResponse.json({
    config,
    catalog,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.config) {
      updateBrandConfig(body.config);
    }

    if (body.newModel) {
      addVehicleModel(body.newModel);
    }

    return NextResponse.json({
      success: true,
      config: getActiveBrandConfig(),
      catalog: getVehicleCatalog(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update brand rules" },
      { status: 500 }
    );
  }
}
