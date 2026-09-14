"use client";

import React, { useState } from "react";
import { Sparkles, Upload, Car, Loader2, AlertCircle } from "lucide-react";
import { AspectRatio, Resolution, VehicleModel } from "@/lib/types";

interface BriefPanelProps {
  prompt: string;
  setPrompt: (v: string) => void;
  aspectRatio: AspectRatio;
  setAspectRatio: (v: AspectRatio) => void;
  resolution: Resolution;
  setResolution: (v: Resolution) => void;
  referenceImage: string;
  setReferenceImage: (v: string) => void;
  onGenerate: () => void;
  onEnhance: () => void;
  isGenerating: boolean;
  isEnhancing: boolean;
  catalog: VehicleModel[];
}

export const BriefPanel: React.FC<BriefPanelProps> = ({
  prompt,
  setPrompt,
  aspectRatio,
  setAspectRatio,
  resolution,
  setResolution,
  referenceImage,
  setReferenceImage,
  onGenerate,
  onEnhance,
  isGenerating,
  isEnhancing,
  catalog,
}) => {
  const [showCatalogPicker, setShowCatalogPicker] = useState(false);

  return (
    <aside className="w-80 lg:w-96 border-r border-gray-200 bg-white flex flex-col h-[calc(100vh-4rem)] overflow-y-auto p-5 space-y-5 flex-shrink-0">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-900">Brief</h2>
        <span className="text-xs text-gray-500 font-medium">MMV Studio</span>
      </div>

      {/* Prompt Area */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-gray-700">Prompt</label>
          <button
            onClick={onEnhance}
            disabled={!prompt.trim() || isEnhancing || isGenerating}
            className="flex items-center space-x-1 text-xs font-medium text-blue-600 hover:text-blue-700 disabled:text-gray-400 transition"
            title="Auto-enhance prompt with MMV Brand Guidelines using Gemini"
          >
            {isEnhancing ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Enhancing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Enhance</span>
              </>
            )}
          </button>
        </div>

        <textarea
          rows={5}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe in detail what you want to see in your image (e.g. Red Xforce parked in showroom at dusk with festive lights)..."
          className="w-full text-xs p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 resize-none text-gray-900 shadow-sm"
        />
      </div>

      {/* Model Pill */}
      <div className="flex items-center space-x-2">
        <div className="inline-flex items-center space-x-1.5 bg-amber-50 border border-amber-200 text-amber-900 px-3 py-1 rounded-full text-xs font-medium shadow-2xs">
          <span>🍌</span>
          <span className="font-semibold">Nano Banana Pro 2</span>
          <span>🍌</span>
        </div>
      </div>

      {/* Aspect Ratio */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-gray-700">Aspect Ratio</label>
        <select
          value={aspectRatio}
          onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
          className="w-full text-xs py-2 px-3 rounded-lg border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
        >
          <option value="1:1">Square (1:1) - Social Posts</option>
          <option value="16:9">Landscape (16:9) - Banners & Display</option>
          <option value="9:16">Portrait (9:16) - Stories & Reels</option>
          <option value="4:3">Banner (4:3) - Catalog & Website</option>
        </select>
      </div>

      {/* Resolution */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-gray-700">Resolution</label>
        <select
          value={resolution}
          onChange={(e) => setResolution(e.target.value as Resolution)}
          className="w-full text-xs py-2 px-3 rounded-lg border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
        >
          <option value="1K">1K - Standard Social Preview</option>
          <option value="2K">2K - High-Definition Commercial</option>
        </select>
      </div>

      {/* Input Image Reference */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-gray-700">Input Image (MMV Reference)</label>
          <button
            type="button"
            onClick={() => setShowCatalogPicker(!showCatalogPicker)}
            className="text-[11px] font-medium text-blue-600 hover:underline"
          >
            {showCatalogPicker ? "Custom upload" : "Select MMV model"}
          </button>
        </div>

        {showCatalogPicker ? (
          <div className="space-y-2 border border-gray-200 rounded-lg p-3 bg-gray-50 text-xs">
            <div className="font-medium text-gray-700 mb-1">Pick Official Model Reference:</div>
            <div className="space-y-1.5">
              {catalog.map((car) => (
                <button
                  key={car.id}
                  type="button"
                  onClick={() => {
                    setReferenceImage(car.reference_image || car.name);
                    setPrompt(
                      prompt ||
                        `Commercial shot of pristine ${car.name} in signature finish at modern dealership showroom.`
                    );
                    setShowCatalogPicker(false);
                  }}
                  className="w-full text-left p-2 rounded bg-white hover:bg-blue-50 border border-gray-200 text-gray-800 font-medium flex items-center justify-between"
                >
                  <span>{car.name}</span>
                  <span className="text-[10px] text-gray-500">{car.segment}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-5 text-center hover:border-blue-400 transition bg-gray-50/50 cursor-pointer">
            {referenceImage ? (
              <div className="space-y-2">
                <div className="text-xs font-semibold text-green-700 flex items-center justify-center space-x-1">
                  <Car className="w-3.5 h-3.5" />
                  <span>Reference Selected</span>
                </div>
                <div className="text-[11px] text-gray-600 truncate max-w-[200px] mx-auto">
                  {referenceImage}
                </div>
                <button
                  type="button"
                  onClick={() => setReferenceImage("")}
                  className="text-[10px] text-red-600 hover:underline"
                >
                  Remove reference
                </button>
              </div>
            ) : (
              <div className="space-y-1">
                <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                <div className="text-xs font-medium text-gray-700">
                  <span className="text-blue-600 hover:underline">Choose files</span> or drag them here
                </div>
                <p className="text-[10px] text-gray-400">Accepted formats: png, jpg, jpeg, webp</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Generate Button */}
      <div className="pt-2">
        <button
          onClick={onGenerate}
          disabled={!prompt.trim() || isGenerating}
          className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-xs font-semibold rounded-lg shadow-sm transition flex items-center justify-center space-x-2"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Generating with Nano Banana...</span>
            </>
          ) : (
            <span>Generate (1 Credit)</span>
          )}
        </button>
      </div>
    </aside>
  );
};
