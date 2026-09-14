"use client";

import React, { useState, useRef } from "react";
import { Sparkles, Upload, Car, Loader2, X, Image as ImageIcon } from "lucide-react";
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
  onRefine: (tweakText: string) => void;
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
  onRefine,
  isGenerating,
  isEnhancing,
  catalog,
}) => {
  const [showCatalogPicker, setShowCatalogPicker] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file (PNG, JPG, JPEG, or WEBP).");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setReferenceImage(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  return (
    <aside className="w-80 lg:w-96 border-r border-gray-200 bg-white flex flex-col h-[calc(100vh-4rem)] overflow-y-auto p-5 space-y-5 flex-shrink-0">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-900">Brief</h2>
        <span className="text-xs text-gray-500 font-medium">MMV Studio</span>
      </div>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png,image/jpeg,image/jpg,image/webp"
        className="hidden"
      />

      {/* Prompt Area */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-gray-700">Prompt</label>
          <button
            onClick={onEnhance}
            disabled={!prompt.trim() || isEnhancing || isGenerating}
            className="flex items-center space-x-1 text-xs font-medium text-blue-600 hover:text-blue-700 disabled:text-gray-400 transition cursor-pointer"
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

      {/* Quick Refine Pills in Brief */}
      <div className="space-y-1.5 -mt-2">
        <div className="flex items-center justify-between text-[11px] font-semibold text-gray-500">
          <span>Refine & Quick Styles:</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => onRefine("Ánh sáng hoàng hôn ấm áp và phản chiếu mặt đường")}
            className="text-[11px] bg-gray-50 hover:bg-amber-50 border border-gray-200 hover:border-amber-400 px-2.5 py-1 rounded-full text-gray-700 hover:text-amber-800 font-medium transition cursor-pointer flex items-center space-x-1"
          >
            <span>✨</span>
            <span>Ánh sáng ấm</span>
          </button>
          <button
            type="button"
            onClick={() => onRefine("Đặt xe trong showroom hiện đại sang trọng với sàn đá bóng và đèn chùm")}
            className="text-[11px] bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-400 px-2.5 py-1 rounded-full text-gray-700 hover:text-blue-800 font-medium transition cursor-pointer flex items-center space-x-1"
          >
            <span>✨</span>
            <span>Showroom</span>
          </button>
          <button
            type="button"
            onClick={() => onRefine("Đang chạy trên đường đèo Đà Lạt uốn lượn, rừng thông bạt ngàn và sương sớm")}
            className="text-[11px] bg-gray-50 hover:bg-emerald-50 border border-gray-200 hover:border-emerald-400 px-2.5 py-1 rounded-full text-gray-700 hover:text-emerald-800 font-medium transition cursor-pointer flex items-center space-x-1"
          >
            <span>✨</span>
            <span>Đèo Đà Lạt</span>
          </button>
          <button
            type="button"
            onClick={() => onRefine("Góc chụp chính diện 3/4 phía trước làm nổi bật lưới tản nhiệt Dynamic Shield")}
            className="text-[11px] bg-gray-50 hover:bg-purple-50 border border-gray-200 hover:border-purple-400 px-2.5 py-1 rounded-full text-gray-700 hover:text-purple-800 font-medium transition cursor-pointer flex items-center space-x-1"
          >
            <span>✨</span>
            <span>Góc 3/4</span>
          </button>
        </div>
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
          className="w-full text-xs py-2 px-3 rounded-lg border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium cursor-pointer"
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
          className="w-full text-xs py-2 px-3 rounded-lg border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium cursor-pointer"
        >
          <option value="1K">1K - Standard Social Preview</option>
          <option value="2K">2K - High-Definition Commercial</option>
        </select>
      </div>

      {/* Input Image Reference (Fully Working File Upload & Catalog Picker) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-gray-700">Input Image (MMV Reference)</label>
          <button
            type="button"
            onClick={() => setShowCatalogPicker(!showCatalogPicker)}
            className="text-[11px] font-medium text-blue-600 hover:underline cursor-pointer"
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
                  className="w-full text-left p-2 rounded bg-white hover:bg-blue-50 border border-gray-200 text-gray-800 font-medium flex items-center justify-between cursor-pointer"
                >
                  <span>{car.name}</span>
                  <span className="text-[10px] text-gray-500">{car.segment}</span>
                </button>
              ))}
            </div>
          </div>
        ) : referenceImage ? (
          /* Active Selected / Uploaded Image View */
          <div className="relative border border-gray-200 rounded-xl p-3 bg-gray-50 flex items-center space-x-3">
            {referenceImage.startsWith("data:") || referenceImage.startsWith("http") ? (
              <img
                src={referenceImage}
                alt="Reference Thumbnail"
                className="w-14 h-14 rounded-lg object-cover border border-gray-300 shadow-2xs flex-shrink-0"
              />
            ) : (
              <div className="w-14 h-14 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 font-semibold text-xs flex-shrink-0">
                <Car className="w-6 h-6" />
              </div>
            )}

            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-green-700 flex items-center space-x-1">
                <Car className="w-3.5 h-3.5" />
                <span>Reference Loaded</span>
              </div>
              <p className="text-[11px] text-gray-500 truncate mt-0.5">
                {referenceImage.startsWith("data:") ? "Custom photo uploaded" : referenceImage}
              </p>
              <div className="flex items-center space-x-3 mt-1.5">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-[11px] font-medium text-blue-600 hover:underline cursor-pointer"
                >
                  Change photo
                </button>
                <span className="text-gray-300">|</span>
                <button
                  type="button"
                  onClick={() => {
                    setReferenceImage("");
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="text-[11px] font-medium text-red-600 hover:underline cursor-pointer"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Clickable Dropzone */
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-6 text-center transition cursor-pointer ${
              isDragging
                ? "border-blue-500 bg-blue-50/50"
                : "border-gray-300 hover:border-blue-400 bg-gray-50/50 hover:bg-blue-50/20"
            }`}
          >
            <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
            <div className="text-xs font-medium text-gray-700">
              <span className="text-blue-600 font-semibold hover:underline">Choose files</span> or drag them here
            </div>
            <p className="text-[10px] text-gray-400 mt-1">Accepted formats: png, jpg, jpeg, webp</p>
          </div>
        )}
      </div>

      {/* Generate Button */}
      <div className="pt-2">
        <button
          onClick={onGenerate}
          disabled={!prompt.trim() || isGenerating}
          className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-xs font-semibold rounded-lg shadow-sm transition flex items-center justify-center space-x-2 cursor-pointer disabled:cursor-not-allowed"
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
