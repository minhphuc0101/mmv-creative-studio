"use client";

import React, { useState, useEffect } from "react";
import { TopNav } from "@/components/TopNav";
import { BriefPanel } from "@/components/BriefPanel";
import { CanvasArea } from "@/components/CanvasArea";
import { RecentDrawer } from "@/components/RecentDrawer";
import { AspectRatio, GenerationAuditRecord, Resolution, UserSession, VehicleModel } from "@/lib/types";

export default function CreativeStudioPage() {
  const [prompt, setPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("1:1");
  const [resolution, setResolution] = useState<Resolution>("1K");
  const [referenceImage, setReferenceImage] = useState("");
  const [currentImage, setCurrentImage] = useState<string | null>(null);

  const [isGenerating, setIsGenerating] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isRecentOpen, setIsRecentOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [catalog, setCatalog] = useState<VehicleModel[]>([]);
  const [user, setUser] = useState<UserSession>({
    id: "usr_phuctran_01",
    name: "Phuc Tran",
    email: "phuc.tran@mitsubishi-saigon.vn",
    role: "admin",
    dealership: {
      id: "dealer_hcm_01",
      name: "Mitsubishi Saigon Central",
      code: "MMV-SGN-01",
      monthly_budget_remaining: 850,
    },
    daily_credits_remaining: 14,
    daily_limit: 20,
  });

  // Fetch initial user and vehicle catalog
  useEffect(() => {
    async function loadInitialData() {
      try {
        const recentRes = await fetch("/api/recent");
        if (recentRes.ok) {
          const recentData = await recentRes.json();
          if (recentData.user) setUser(recentData.user);
        }

        const brandRes = await fetch("/api/admin/brand");
        if (brandRes.ok) {
          const brandData = await brandRes.json();
          if (brandData.catalog) setCatalog(brandData.catalog);
        }
      } catch (err) {
        console.error("Failed to load initial data:", err);
      }
    }
    loadInitialData();
  }, []);

  // Handle Gemini Prompt Enhancement
  const handleEnhance = async () => {
    if (!prompt.trim()) return;
    setIsEnhancing(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/enhance-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userPrompt: prompt }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Enhancement failed");
      }

      setPrompt(data.enhancedPrompt);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to enhance prompt with Gemini");
    } finally {
      setIsEnhancing(false);
    }
  };

  // Handle Nano Banana Pro 2 Image Generation
  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;
    setIsGenerating(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          aspectRatio,
          resolution,
          referenceImage,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Generation failed");
      }

      setCurrentImage(data.imageUrl);

      // Update remaining credit balance
      if (typeof data.remainingCredits === "number") {
        setUser((prev) => ({
          ...prev,
          daily_credits_remaining: data.remainingCredits,
        }));
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to generate image with Nano Banana Pro 2");
    } finally {
      setIsGenerating(false);
    }
  };

  // One-click refinement loop
  const handleRefine = (tweak: string) => {
    const updated = `${prompt}. Note: ${tweak}.`;
    setPrompt(updated);
  };

  // Select a past audit log from Recent drawer
  const handleSelectRecord = (record: GenerationAuditRecord) => {
    setPrompt(record.inputs.user_prompt);
    setAspectRatio(record.inputs.aspect_ratio);
    setResolution(record.inputs.resolution);
    setCurrentImage(record.generation.image_url);
  };

  const handleNewImage = () => {
    setPrompt("");
    setReferenceImage("");
    setCurrentImage(null);
    setErrorMessage(null);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#F8FAFC]">
      {/* Top Header */}
      <TopNav
        user={user}
        onOpenRecent={() => setIsRecentOpen(true)}
        onNewImage={handleNewImage}
      />

      {/* Error / Quota Notification Banner */}
      {errorMessage && (
        <div className="bg-red-50 border-b border-red-200 px-6 py-2.5 flex items-center justify-between text-xs text-red-700">
          <span>{errorMessage}</span>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-red-500 hover:text-red-700 font-semibold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Studio View */}
      <div className="flex flex-1 overflow-hidden">
        <BriefPanel
          prompt={prompt}
          setPrompt={setPrompt}
          aspectRatio={aspectRatio}
          setAspectRatio={setAspectRatio}
          resolution={resolution}
          setResolution={setResolution}
          referenceImage={referenceImage}
          setReferenceImage={setReferenceImage}
          onGenerate={handleGenerate}
          onEnhance={handleEnhance}
          isGenerating={isGenerating}
          isEnhancing={isEnhancing}
          catalog={catalog}
        />

        <CanvasArea
          currentImage={currentImage}
          prompt={prompt}
          aspectRatio={aspectRatio}
          onSelectExample={(text) => setPrompt(text)}
          onRefine={handleRefine}
          onRegenerate={handleGenerate}
          isGenerating={isGenerating}
        />
      </div>

      {/* Recent History Drawer */}
      <RecentDrawer
        isOpen={isRecentOpen}
        onClose={() => setIsRecentOpen(false)}
        onSelectRecord={handleSelectRecord}
      />
    </div>
  );
}
