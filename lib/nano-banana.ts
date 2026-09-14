import { AspectRatio, Resolution } from "./types";

// Real, authentic Mitsubishi Motors Vietnam vehicle assets ONLY.
// Zero competitor vehicles, zero foreign car links.
const MMV_OFFICIAL_ASSETS: Record<string, string[]> = {
  xforce: [
    "/cars/xforce_blue_gray.jpg",
    "/cars/xforce_white.jpg",
  ],
  xpander: [
    "/cars/xforce_blue_gray.jpg",
    "/cars/xforce_white.jpg",
  ],
  triton: [
    "/cars/xforce_blue_gray.jpg",
  ],
};

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
  const nanoBananaUrl = process.env.NANO_BANANA_API_URL;
  const nanoBananaKey = process.env.NANO_BANANA_API_KEY;

  // 1. Direct Nano Banana endpoint if custom server URL & Key configured
  if (nanoBananaUrl && nanoBananaKey && nanoBananaKey !== "your_nano_banana_api_key_here") {
    try {
      const response = await fetch(nanoBananaUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${nanoBananaKey}`,
        },
        body: JSON.stringify({
          model: "nano-banana-pro-2",
          prompt: params.prompt,
          aspect_ratio: params.aspectRatio,
          resolution: params.resolution,
          reference_image: params.referenceImage,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const outputUrl = data.image_url || data.output?.[0];
        if (outputUrl) {
          return {
            imageUrl: outputUrl,
            latencyMs: Date.now() - startTime,
            seed: data.seed || Math.floor(Math.random() * 1000000),
          };
        }
      } else {
        const errText = await response.text();
        throw new Error(`Nano Banana API responded with status ${response.status}: ${errText}`);
      }
    } catch (err: any) {
      console.error("Nano Banana API call failed:", err);
      throw err;
    }
  }

  // 2. Google Imagen 3 via GEMINI_API_KEY
  if (geminiKey && geminiKey !== "your_gemini_api_key_here") {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${geminiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            instances: [
              {
                prompt: params.prompt,
              },
            ],
            parameters: {
              sampleCount: 1,
              aspectRatio: params.aspectRatio,
              outputOptions: {
                mimeType: "image/jpeg",
              },
            },
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const base64 = data.predictions?.[0]?.bytesBase64Encoded;
        const mimeType = data.predictions?.[0]?.mimeType || "image/jpeg";

        if (base64) {
          return {
            imageUrl: `data:${mimeType};base64,${base64}`,
            latencyMs: Date.now() - startTime,
            seed: Math.floor(Math.random() * 899999) + 100000,
          };
        }
      } else {
        const errorText = await response.text();
        let parsedMessage = errorText;
        try {
          const parsed = JSON.parse(errorText);
          parsedMessage = parsed.error?.message || errorText;
        } catch {}
        console.error("Google Imagen 3 API error:", response.status, parsedMessage);
        throw new Error(`Google Imagen 3 API Error (${response.status}): ${parsedMessage}`);
      }
    } catch (err: any) {
      console.error("Image generation failed:", err);
      throw err;
    }
  }

  // 3. If GEMINI_API_KEY is not configured at all
  if (process.env.NODE_ENV === "production" || process.env.VERCEL) {
    throw new Error(
      "GEMINI_API_KEY is not configured in Vercel. Please add your GEMINI_API_KEY in Vercel Settings > Environment Variables, then redeploy."
    );
  }

  // 4. Local Development Fallback (Only authentic MMV cars from public/cars)
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const pool = MMV_OFFICIAL_ASSETS.xforce;
  const selectedImage = pool[Math.floor(Math.random() * pool.length)];

  return {
    imageUrl: selectedImage,
    latencyMs: Date.now() - startTime,
    seed: Math.floor(Math.random() * 899999) + 100000,
  };
}
