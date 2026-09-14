"use client";

import React, { useState, useRef, useEffect } from "react";
import { Sparkles, Upload, Car, Loader2, X, Image as ImageIcon, Maximize2, Minimize2 } from "lucide-react";
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
  selectedUseCase?: string;
  setSelectedUseCase?: (v: string) => void;
  isGenerating: boolean;
  isEnhancing: boolean;
  catalog?: VehicleModel[];
}

export interface UseCaseOption {
  id: string;
  label: string;
  icon: string;
  refineText: string;
  defaultRatio?: AspectRatio;
}

export const USE_CASES: UseCaseOption[] = [
  {
    id: "ads",
    label: "Hình ads",
    icon: "📢",
    refineText: "Hình ảnh quảng cáo thương mại (Ads) nổi bật xe và thông điệp bán hàng chuyên nghiệp",
    defaultRatio: "1:1",
  },
  {
    id: "banner",
    label: "Hình Banner theo size của AI",
    icon: "🖼️",
    refineText: "Hình banner ngang góc rộng theo kích thước chuẩn của AI, bố cục có khoảng trống chèn thông điệp quảng cáo",
    defaultRatio: "16:9",
  },
  {
    id: "mascot",
    label: "Hình Mascot",
    icon: "🦊",
    refineText: "Hình ảnh mascot linh vật đại diện thương hiệu 3D phong cách hoạt hình sinh động, mang màu sắc và logo Mitsubishi Motors",
  },
  {
    id: "resize",
    label: "Resize hình",
    icon: "📐",
    refineText: "Resize và mở rộng bố cục ngoại cảnh (outpainting) hài hòa với tỷ lệ khung hình mới",
  },
  {
    id: "change_scene",
    label: "Hình chụp xe đổi bối cảnh",
    icon: "🔄",
    refineText: "Giữ nguyên chính xác 100% chiếc xe từ ảnh chụp thực tế (Input Image) và thay đổi toàn bộ bối cảnh xung quanh",
  },
];

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
  selectedUseCase = "",
  setSelectedUseCase = () => {},
  isGenerating,
  isEnhancing,
  catalog,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-expand prompt textarea if prompt becomes detailed
  useEffect(() => {
    if (prompt.length > 140) {
      setIsExpanded(true);
    }
  }, [prompt]);

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
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center space-x-1 text-xs font-medium text-gray-500 hover:text-gray-800 transition cursor-pointer"
              title={isExpanded ? "Collapse prompt box" : "Extend prompt box"}
            >
              {isExpanded ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5 text-gray-500" />
                  <span>Collapse</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5 text-gray-500" />
                  <span>Extend</span>
                </>
              )}
            </button>
            <span className="text-gray-300">|</span>
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
        </div>

        <textarea
          rows={isExpanded ? 10 : 5}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe in detail what you want to see in your image (e.g. Red Xforce parked in showroom at dusk with festive lights)..."
          className={`w-full text-xs p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 text-gray-900 shadow-sm resize-y transition-all ${
            isExpanded ? "min-h-[220px]" : "min-h-[105px]"
          }`}
        />
      </div>

      {/* Nhu cầu tạo hình / Use Case Options for Prompt Refine */}
      <div className="space-y-1.5 -mt-2">
        <div className="flex items-center justify-between text-[11px] font-semibold text-gray-600">
          <span>Nhu cầu tạo hình (Chọn để refine prompt):</span>
          {selectedUseCase && (
            <button
              type="button"
              onClick={() => setSelectedUseCase("")}
              className="text-[10px] text-gray-400 hover:text-red-500 transition cursor-pointer"
            >
              Đặt lại
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
          {USE_CASES.map((uc) => {
            const isSelected = selectedUseCase === uc.label;
            return (
              <button
                key={uc.id}
                type="button"
                onClick={() => {
                  setSelectedUseCase(uc.label);
                  onRefine(uc.refineText);
                  if (uc.defaultRatio) {
                    setAspectRatio(uc.defaultRatio);
                  }
                }}
                className={`text-left text-xs px-2.5 py-2 rounded-lg border transition cursor-pointer flex items-center space-x-2 ${
                  isSelected
                    ? "bg-blue-50 border-blue-500 text-blue-900 font-semibold shadow-2xs ring-1 ring-blue-500"
                    : "bg-white hover:bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-300"
                } ${uc.id === "change_scene" ? "sm:col-span-2" : ""}`}
              >
                <span className="text-sm">{uc.icon}</span>
                <span className="truncate">{uc.label}</span>
              </button>
            );
          })}
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

      {/* Input Image Reference (Upload) */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-gray-700">Input Image (MMV Reference)</label>

        {referenceImage ? (
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
