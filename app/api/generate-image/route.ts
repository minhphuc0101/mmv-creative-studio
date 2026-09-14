import { NextRequest, NextResponse } from "next/server";
import { checkAndDeductQuota, getCurrentUserSession, recordAuditLog } from "@/lib/audit-logger";
import { generateWithNanoBananaPro2 } from "@/lib/nano-banana";
import { enhancePromptWithGemini } from "@/lib/gemini";
import { GenerationAuditRecord } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, aspectRatio = "1:1", resolution = "1K", referenceImage } = body;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Prompt is required to generate an image." },
        { status: 400 }
      );
    }

    // 1. Quota & Credit check
    const quotaResult = checkAndDeductQuota(1);
    if (!quotaResult.success) {
      return NextResponse.json(
        { error: quotaResult.error },
        { status: 429 }
      );
    }

    // 2. Automatically translate & enhance prompt with Gemini to strictly follow MMV brand rules and context
    let finalPrompt = prompt;
    let geminiTokens = { prompt: 150, completion: 80 };
    let geminiLatency = 0;

    try {
      const enhanced = await enhancePromptWithGemini(prompt, referenceImage, undefined, aspectRatio);
      if (enhanced && enhanced.enhancedPrompt) {
        finalPrompt = enhanced.enhancedPrompt;
        geminiTokens = enhanced.tokens;
        geminiLatency = enhanced.latencyMs;
      }
    } catch (enhanceErr) {
      console.warn("Auto-enhancement warning:", enhanceErr);
    }

    // 3. Call Image Generation Engine (Imagen 3 / Nano Banana Pro 2)
    const generationResult = await generateWithNanoBananaPro2({
      prompt: finalPrompt,
      aspectRatio,
      resolution,
      referenceImage,
    });

    const user = getCurrentUserSession();
    const jobId = `gen_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    // 4. Record Audit Log
    const auditRecord: GenerationAuditRecord = {
      job_id: jobId,
      timestamp: new Date().toISOString(),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        dealer_name: user.dealership.name,
      },
      inputs: {
        user_prompt: prompt,
        aspect_ratio: aspectRatio,
        resolution: resolution,
        has_reference_image: !!referenceImage,
      },
      gemini_enhancement: {
        enhanced_prompt: finalPrompt,
        prompt_tokens: geminiTokens.prompt,
        completion_tokens: geminiTokens.completion,
        latency_ms: geminiLatency,
      },
      generation: {
        model: "Nano Banana Pro 2",
        status: "completed",
        image_url: generationResult.imageUrl,
        credits_deducted: 1,
        latency_ms: generationResult.latencyMs,
      },
    };

    recordAuditLog(auditRecord);

    return NextResponse.json({
      success: true,
      jobId,
      imageUrl: generationResult.imageUrl,
      enhancedPrompt: finalPrompt,
      remainingCredits: quotaResult.remaining,
      dailyBudget: {
        remainingCredits: quotaResult.remaining,
        remainingVnd: quotaResult.remainingVnd,
        spentVnd: quotaResult.spentVnd,
        totalVnd: quotaResult.totalVnd,
      },
      latencyMs: generationResult.latencyMs,
    });
  } catch (error: any) {
    console.error("API /api/generate-image error:", error);
    return NextResponse.json(
      { error: error.message || "Image generation failed" },
      { status: 500 }
    );
  }
}
