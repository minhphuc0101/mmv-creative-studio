"use client";

import React from "react";
import Image from "next/image";
import { Download, RefreshCw, Sparkles, Layers, ShieldCheck } from "lucide-react";
import { AspectRatio } from "@/lib/types";

interface CanvasAreaProps {
  currentImage: string | null;
  prompt: string;
  aspectRatio: AspectRatio;
  onSelectExample: (promptText: string) => void;
  onRefine: (tweakText: string) => void;
  onRegenerate: () => void;
  isGenerating: boolean;
}

export const CanvasArea: React.FC<CanvasAreaProps> = ({
  currentImage,
  prompt,
  aspectRatio,
  onSelectExample,
  onRefine,
  onRegenerate,
  isGenerating,
}) => {
  const exampleCards = [
    {
      title: "Xforce Showroom Elegance",
      text: "Create a sophisticated and elegant commercial visual showcasing 2025 Mitsubishi Xforce in Energetic Yellow outside a premier dealership showroom at dusk.",
    },
    {
      title: "Xpander Coastal Road Trip",
      text: "Create an inclusive and uplifting image promoting Mitsubishi Xpander Cross on a scenic family road trip along the Da Nang coastline at golden hour.",
    },
    {
      title: "All-New Triton Mountain Trail",
      text: "Visualize a sleek, rugged All-New Triton pickup tackling a misty mountain pass in northern Vietnam overlooking terraced fields at sunset.",
    },
  ];

  const getAspectClass = (ratio: AspectRatio) => {
    switch (ratio) {
      case "16:9":
        return "aspect-video max-w-3xl";
      case "9:16":
        return "aspect-[9/16] max-w-sm";
      case "4:3":
        return "aspect-[4/3] max-w-2xl";
      case "1:1":
      default:
        return "aspect-square max-w-xl";
    }
  };

  return (
    <main className="flex-1 bg-[#F8FAFC] flex flex-col items-center justify-center p-6 sm:p-10 overflow-y-auto">
      {!currentImage && !isGenerating ? (
        <div className="max-w-2xl text-center space-y-8 my-auto">
          {/* Central icon matching screenshot */}
          <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100">
              <div className="grid grid-cols-3 gap-1 p-2 bg-blue-600 rounded-lg shadow-sm">
                <div className="w-3 h-4 bg-white/30 rounded-xs" />
                <div className="w-3 h-4 bg-white/70 rounded-xs" />
                <div className="w-3 h-4 bg-white/40 rounded-xs" />
              </div>
            </div>
            <span className="absolute top-1 right-2 text-blue-400 text-xs">✦</span>
            <span className="absolute bottom-2 left-2 text-blue-300 text-sm">✦</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-xl font-semibold text-gray-900 tracking-tight">
              Generate images in various styles
            </h1>
            <p className="text-xs text-gray-500 max-w-md mx-auto">
              Use the form on the left to begin or try out this tool by selecting an MMV campaign example below.
            </p>
          </div>

          {/* 3 Starter Example Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-left pt-2">
            {exampleCards.map((card, idx) => (
              <button
                key={idx}
                onClick={() => onSelectExample(card.text)}
                className="p-4 rounded-xl border border-gray-200 bg-white hover:border-blue-400 hover:shadow-md transition text-left group flex flex-col justify-between space-y-3"
              >
                <p className="text-xs text-gray-700 group-hover:text-blue-600 font-medium line-clamp-4 leading-relaxed">
                  {card.text}
                </p>
                <div className="text-[10px] text-gray-400 font-medium group-hover:text-blue-500 flex items-center space-x-1">
                  <span>Use template</span>
                  <span>→</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="w-full flex flex-col items-center justify-center space-y-5 my-auto">
          {/* Active Generation Image Card */}
          <div
            className={`relative w-full ${getAspectClass(
              aspectRatio
            )} rounded-2xl overflow-hidden shadow-xl border border-gray-200 bg-gray-900 group`}
          >
            {isGenerating ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/90 text-white space-y-3 p-6 text-center">
                <div className="w-12 h-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
                <div className="space-y-1">
                  <div className="text-sm font-semibold">Nano Banana Pro 2 Synthesizing...</div>
                  <p className="text-xs text-gray-400 max-w-sm">
                    Rendering authentic MMV vehicle details, Dynamic Shield geometry, and atmospheric lighting.
                  </p>
                </div>
              </div>
            ) : (
              currentImage && (
                <>
                  <img
                    src={currentImage}
                    alt="Generated MMV Marketing Visual"
                    className="w-full h-full object-cover"
                  />

                  {/* MMV Brand Overlay Banner (Logo & Clearspace compliance) */}
                  <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg flex items-center space-x-2 border border-white/20">
                    <div className="w-4 h-4 rounded-full bg-red-600 flex items-center justify-center font-bold text-[9px] text-white">
                      ◆
                    </div>
                    <span className="text-white text-[11px] font-semibold tracking-wide">
                      MITSUBISHI MOTORS
                    </span>
                  </div>

                  {/* Dealer watermark badge */}
                  <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-md px-3 py-1 rounded-md text-[10px] text-white/90 border border-white/10 font-medium">
                    Drive your Ambition | Saigon Central
                  </div>
                </>
              )
            )}
          </div>

          {/* Post-generation Toolbar & Refinement Loop */}
          {!isGenerating && currentImage && (
            <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-3 w-full max-w-xl justify-between">
              {/* Refinement Pills */}
              <div className="flex items-center space-x-2 overflow-x-auto py-1">
                <span className="text-[11px] font-semibold text-gray-500">Refine:</span>
                <button
                  onClick={() => onRefine("Enhance with warmer golden hour lighting and wet showroom floor reflections")}
                  className="text-xs bg-white border border-gray-200 hover:border-blue-400 px-2.5 py-1 rounded-full text-gray-700 font-medium shadow-2xs transition"
                >
                  ✨ Warmer lighting
                </button>
                <button
                  onClick={() => onRefine("Set vehicle inside a brightly illuminated modern glass dealership showroom")}
                  className="text-xs bg-white border border-gray-200 hover:border-blue-400 px-2.5 py-1 rounded-full text-gray-700 font-medium shadow-2xs transition"
                >
                  ✨ Showroom setting
                </button>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={onRegenerate}
                  className="flex items-center space-x-1.5 text-xs font-semibold px-3 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 transition"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-gray-500" />
                  <span>Re-roll</span>
                </button>
                <a
                  href={currentImage}
                  download="MMV_Marketing_Campaign.jpg"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center space-x-1.5 text-xs font-semibold px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download High-Res</span>
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
};
