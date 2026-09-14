import { NextResponse } from "next/server";
import { readDailyBudget } from "@/lib/audit-logger";

export async function GET() {
  const budget = readDailyBudget();
  return NextResponse.json(budget);
}
