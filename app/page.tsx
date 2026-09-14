"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TopNav } from "@/components/TopNav";
import { BriefPanel } from "@/components/BriefPanel";
import { CanvasArea } from "@/components/CanvasArea";
import { RecentDrawer } from "@/components/RecentDrawer";
import { UserGuideModal } from "@/components/UserGuideModal";
import { InteractiveTour } from "@/components/InteractiveTour";
import { AspectRatio, GenerationAuditRecord, Resolution, UserSession, VehicleModel } from "@/lib/types";
import { getStoredUser, MOCK_ACCOUNTS } from "@/lib/auth";

export default function CreativeStudioPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserSession | null>(null);

  const [prompt, setPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("1:1");
  const [resolution, setResolution] = useState<Resolution>("1K");
  const [referenceImage, setReferenceImage] = useState("");
  const [currentImage, setCurrentImage] = useState<string | null>(null);

  const [isGenerating, setIsGenerating] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isRecentOpen, setIsRecentOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [selectedUseCase, setSelectedUseCase] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [catalog, setCatalog] = useState<VehicleModel[]>([]);

  // Auto-prompt interactive tour for first-time visitors
  useEffect(() => {
    try {
      const hasCompleted = localStorage.getItem("mmv_tour_completed");
      if (!hasCompleted) {
        const timer = setTimeout(() => {
          setIsTourOpen(true);
        }, 800);
        return () => clearTimeout(timer);
      }
    } catch {}
  }, []);

  const handleCloseTour = () => {
    setIsTourOpen(false);
    try {
      localStorage.setItem("mmv_tour_completed", "true");
    } catch {}
  };

  // Check auth and fetch vehicle catalog
  useEffect(() => {
    const stored = getStoredUser();
    if (!stored) {
      router.push("/login");
      return;
    }
    setUser(stored);

    async function loadInitialData() {
      try {
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
  }, [router]);

  // Handle Gemini Prompt Enhancement
  const handleEnhance = async () => {
    if (!prompt.trim()) return;
    setIsEnhancing(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/enhance-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userPrompt: prompt, referenceImage, selectedUseCase }),
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
      if (typeof data.remainingCredits === "number" && user) {
        setUser((prev) => (prev ? { ...prev, daily_credits_remaining: data.remainingCredits } : prev));
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to generate image with Nano Banana Pro 2");
    } finally {
      setIsGenerating(false);
    }
  };

  // One-click refinement loop
  const handleRefine = (tweak: string) => {
    if (!prompt.trim()) {
      setPrompt(tweak);
    } else {
      const trimmed = prompt.trim();
      const separator = trimmed.endsWith(".") ? " " : ". ";
      setPrompt(`${trimmed}${separator}${tweak}`);
    }
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

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center space-y-3">
        <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
        <span className="text-xs font-semibold text-gray-500">Checking corporate authorization...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#F8FAFC]">
      {/* Top Header */}
      <TopNav
        user={user}
        onOpenRecent={() => setIsRecentOpen(true)}
        onOpenGuide={() => setIsGuideOpen(true)}
        onStartTour={() => setIsTourOpen(true)}
        onNewImage={handleNewImage}
      />

      {/* Error / Quota Notification Banner */}
      {errorMessage && (
        <div className="bg-red-50 border-b border-red-200 px-6 py-2.5 flex items-center justify-between text-xs text-red-700">
          <span>{errorMessage}</span>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-red-500 hover:text-red-700 font-semibold cursor-pointer"
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
          onRefine={handleRefine}
          selectedUseCase={selectedUseCase}
          setSelectedUseCase={setSelectedUseCase}
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
          onOpenGuide={() => setIsGuideOpen(true)}
          onStartTour={() => setIsTourOpen(true)}
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

      {/* First-Time User Guide Modal */}
      <UserGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        onStartTour={() => setIsTourOpen(true)}
      />

      {/* Interactive 5-Step Element Tour */}
      <InteractiveTour
        isOpen={isTourOpen}
        onClose={handleCloseTour}
      />
    </div>
  );
}
