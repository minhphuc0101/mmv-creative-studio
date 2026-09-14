"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  X,
  ArrowRight,
  ArrowLeft,
  Check,
  Sparkles,
  MousePointerClick,
  HelpCircle,
} from "lucide-react";

export interface TourStep {
  targetId: string;
  stepNumber: number;
  badge: string;
  title: string;
  description: string;
  actionHint: string;
  iconText: string;
}

export const TOUR_STEPS: TourStep[] = [
  {
    targetId: "tour-refine-prompt",
    stepNumber: 1,
    badge: "Bước 1 / 5",
    iconText: "1️⃣",
    title: "Chọn Nhu cầu tạo hình (Pick refine prompt)",
    description:
      "Chọn 1 trong 5 mục đích sử dụng (Hình ads, Hình Banner AI, Hình Mascot, Resize hình, Đổi bối cảnh) để hệ thống tự động định hình phong cách, bối cảnh và tỷ lệ ảnh phù hợp.",
    actionHint: "Bấm vào bất kỳ ô nhu cầu nào để tự động thêm vào câu prompt.",
  },
  {
    targetId: "tour-input-prompt",
    stepNumber: 2,
    badge: "Bước 2 / 5",
    iconText: "2️⃣",
    title: "Nhập mô tả ý tưởng (Input prompt)",
    description:
      "Nhập ý tưởng ngắn gọn về bối cảnh bạn muốn thấy (ví dụ: 'xe Xforce màu đỏ leo đèo Đà Lạt ngắm bình minh', 'Triton vượt đồi cát Phan Thiết').",
    actionHint: "Dùng nút 'Extend' hoặc góc kéo ở góc dưới bên phải để mở rộng hộp prompt.",
  },
  {
    targetId: "tour-enhance-btn",
    stepNumber: 3,
    badge: "Bước 3 / 5",
    iconText: "3️⃣",
    title: "Bấm Tinh chỉnh AI (Click Enhance)",
    description:
      "Bấm nút ✨ Enhance để Google Gemini tự động mở rộng và hoàn thiện prompt chuẩn phong cách thương hiệu Mitsubishi Motors (Dynamic Shield, đèn LED T-shape, ánh sáng điện ảnh 8K).",
    actionHint: "Gemini sẽ tối ưu câu prompt của bạn thành ảnh thương mại chuẩn nhất.",
  },
  {
    targetId: "tour-upload-image",
    stepNumber: 4,
    badge: "Bước 4 / 5",
    iconText: "4️⃣",
    title: "Tải ảnh xe thực tế (Upload image)",
    description:
      "Kéo thả hoặc tải lên ảnh chụp xe thực tế tại đại lý (PNG, JPG, WEBP). AI Nano Banana Pro 2 sẽ nhận diện chính xác dòng xe và giữ nguyên màu sơn thực tế của xe vào bối cảnh mới.",
    actionHint: "Nên chụp xe rõ góc 3/4 trước hoặc góc ngang thân để AI nhận diện tốt nhất.",
  },
  {
    targetId: "tour-generate-btn",
    stepNumber: 5,
    badge: "Bước 5 / 5",
    iconText: "5️⃣",
    title: "Bấm Tạo ảnh (Generate)",
    description:
      "Bấm nút Generate (1 Credit). AI Nano Banana Pro 2 sẽ kết xuất hình ảnh hoàn chỉnh chất lượng cao trong vài giây với logo Three Diamonds và thông tin đại lý sẵn sàng tải về.",
    actionHint: "Sau khi tạo xong, bạn có thể tải ảnh về hoặc bấm Re-roll để vẽ lại góc chụp mới.",
  },
];

interface InteractiveTourProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InteractiveTour: React.FC<InteractiveTourProps> = ({
  isOpen,
  onClose,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  const step = TOUR_STEPS[currentStepIndex];

  // Update target rect & scroll into view
  const updatePosition = useCallback(() => {
    if (!isOpen || !step) return;
    const element = document.getElementById(step.targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      const rect = element.getBoundingClientRect();
      setTargetRect(rect);
    } else {
      setTargetRect(null);
    }
  }, [isOpen, step]);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStepIndex(0);
      setTargetRect(null);
      return;
    }

    // Short delay to allow DOM/drawer rendering
    const timer = setTimeout(() => {
      updatePosition();
    }, 150);

    const handleResize = () => updatePosition();
    const handleScroll = () => {
      if (step) {
        const el = document.getElementById(step.targetId);
        if (el) setTargetRect(el.getBoundingClientRect());
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll, true);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [isOpen, currentStepIndex, step, updatePosition]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowRight") {
        if (currentStepIndex < TOUR_STEPS.length - 1) {
          setCurrentStepIndex((prev) => prev + 1);
        } else {
          onClose();
        }
      } else if (e.key === "ArrowLeft") {
        if (currentStepIndex > 0) {
          setCurrentStepIndex((prev) => prev - 1);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentStepIndex, onClose]);

  if (!isOpen || !step) return null;

  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === TOUR_STEPS.length - 1;

  // Calculate popover position
  const getPopoverStyle = (): React.CSSProperties => {
    if (!targetRect) {
      return {
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      };
    }

    const cardWidth = 360;
    const cardHeight = 280;
    const padding = 16;
    const windowWidth = typeof window !== "undefined" ? window.innerWidth : 1200;
    const windowHeight = typeof window !== "undefined" ? window.innerHeight : 800;

    // Desktop: Try placing to the right of target (in the canvas area)
    const canPlaceRight = targetRect.right + cardWidth + padding < windowWidth;

    if (canPlaceRight && windowWidth >= 768) {
      const topPos = Math.max(
        padding,
        Math.min(targetRect.top - 10, windowHeight - cardHeight - padding)
      );
      return {
        top: `${topPos}px`,
        left: `${targetRect.right + padding}px`,
      };
    }

    // Fallback: place below target or centered
    const topPos = Math.min(targetRect.bottom + padding, windowHeight - cardHeight - padding);
    const leftPos = Math.max(
      padding,
      Math.min(targetRect.left, windowWidth - cardWidth - padding)
    );

    return {
      top: `${Math.max(padding, topPos)}px`,
      left: `${leftPos}px`,
    };
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden pointer-events-auto">
      {/* Dimmed backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-[2px] transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Target Spotlight Ring Highlight */}
      {targetRect && (
        <div
          style={{
            top: targetRect.top - 6,
            left: targetRect.left - 6,
            width: targetRect.width + 12,
            height: targetRect.height + 12,
          }}
          className="fixed pointer-events-none rounded-xl border-2 border-blue-500 ring-4 ring-blue-500/40 shadow-[0_0_25px_rgba(59,130,246,0.6)] z-50 transition-all duration-300 animate-pulse"
        />
      )}

      {/* Floating Tour Guide Popover Card */}
      <div
        style={getPopoverStyle()}
        className="fixed z-50 w-full max-w-[360px] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden transition-all duration-200 animate-in fade-in zoom-in-95"
      >
        {/* Card Header */}
        <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50/70 via-indigo-50/30 to-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-base">{step.iconText}</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-600 text-white font-mono">
              {step.badge}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition cursor-pointer"
            title="Đóng tour"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Card Content */}
        <div className="p-5 space-y-3.5">
          <div>
            <h3 className="text-sm font-bold text-gray-900 leading-snug">
              {step.title}
            </h3>
            <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">
              {step.description}
            </p>
          </div>

          {/* Action Hint Box */}
          <div className="flex items-start space-x-2 p-2.5 rounded-xl bg-amber-50/90 border border-amber-200/80 text-[11px] text-amber-900">
            <MousePointerClick className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <span className="leading-snug">{step.actionHint}</span>
          </div>

          {/* Step Progress Dots */}
          <div className="flex items-center justify-center space-x-1.5 pt-1">
            {TOUR_STEPS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStepIndex(idx)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  idx === currentStepIndex
                    ? "w-6 bg-blue-600"
                    : "w-1.5 bg-gray-200 hover:bg-gray-300"
                }`}
                title={`Đến bước ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Card Footer Actions */}
        <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="text-xs font-medium text-gray-500 hover:text-gray-800 transition cursor-pointer"
          >
            Bỏ qua
          </button>

          <div className="flex items-center space-x-2">
            {!isFirstStep && (
              <button
                onClick={() => setCurrentStepIndex((prev) => prev - 1)}
                className="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-gray-100 rounded-lg transition flex items-center space-x-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Quay lại</span>
              </button>
            )}

            <button
              onClick={() => {
                if (isLastStep) {
                  onClose();
                } else {
                  setCurrentStepIndex((prev) => prev + 1);
                }
              }}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition flex items-center space-x-1.5 cursor-pointer"
            >
              <span>{isLastStep ? "Hoàn tất & Bắt đầu" : "Tiếp theo"}</span>
              {isLastStep ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <ArrowRight className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
