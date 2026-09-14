import { NextRequest, NextResponse } from "next/server";
import { enhancePromptWithGemini } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userPrompt } = body;

    if (!userPrompt || typeof userPrompt !== "string") {
      return NextResponse.json(
        { error: "Please enter a prompt brief to enhance." },
        { status: 400 }
      );
    }

    const result = await enhancePromptWithGemini(userPrompt);

    return NextResponse.json({
      success: true,
      enhancedPrompt: result.enhancedPrompt,
      tokens: result.tokens,
      latencyMs: result.latencyMs,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to enhance prompt" },
      { status: 500 }
    );
  }
}
