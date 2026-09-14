import { NextResponse } from "next/server";
import { getCurrentUserSession, getRecentAuditLogs } from "@/lib/audit-logger";

export async function GET() {
  const user = getCurrentUserSession();
  const logs = getRecentAuditLogs(25);

  return NextResponse.json({
    user,
    logs,
  });
}
