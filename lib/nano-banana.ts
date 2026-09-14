import { AspectRatio, Resolution } from "./types";

export async function generateWithNanoBananaPro2(params: {
  prompt: string;
  aspectRatio: AspectRatio;
  resolution: Resolution;
  referenceImage?: string;
}): Promise<{
  imageUrl: string;
  latencyMs: number;
  seed: number;
}> {
  const startTime = Date.now();
  const geminiKey = process.env.GEMINI_API_KEY;

  if (!geminiKey || geminiKey === "your_gemini_api_key_here") {
    throw new Error(
      "GEMINI_API_KEY is not configured in Vercel. Please add your GEMINI_API_KEY in Vercel Settings > Environment Variables, then redeploy."
    );
  }

  try {
    const parts: any[] = [
      {
        text: params.prompt,
      },
    ];

    // If reference image provided as base64 data url, send directly to Nano Banana Pro
    if (params.referenceImage && params.referenceImage.startsWith("data:image/")) {
      const match = params.referenceImage.match(/^data:([^;]+);base64,(.+)$/);
      if (match) {
        parts.push({
          inlineData: {
            mimeType: match[1],
            data: match[2],
          },
        });
      }
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/nano-banana-pro-preview:generateContent?key=${geminiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts,
            },
          ],
          generationConfig: {
            responseModalities: ["IMAGE"],
          },
        }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      const parts = data.candidates?.[0]?.content?.parts || [];
      const imagePart = parts.find((p: any) => p.inlineData?.data);

      if (imagePart && imagePart.inlineData?.data) {
        const mimeType = imagePart.inlineData.mimeType || "image/jpeg";
        return {
          imageUrl: `data:${mimeType};base64,${imagePart.inlineData.data}`,
          latencyMs: Date.now() - startTime,
          seed: Math.floor(Math.random() * 899999) + 100000,
        };
      }
      throw new Error("Nano Banana Pro did not return image data in the response.");
    } else {
      const errorText = await response.text();
      let parsedMessage = errorText;
      try {
        const parsed = JSON.parse(errorText);
        parsedMessage = parsed.error?.message || errorText;
      } catch {}
      throw new Error(`Nano Banana Pro API Error (${response.status}): ${parsedMessage}`);
    }
  } catch (err: any) {
    console.error("Image generation failed:", err);
    throw err;
  }
}
