"use client";

import React, { useEffect } from "react";
import {
  X,
  Sparkles,
  Upload,
  Layers,
  Download,
  Lightbulb,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Zap,
  HelpCircle
} from "lucide-react";

interface UserGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserGuideModal: React.FC<UserGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const steps = [
    {
      step: "01",
      title: "Viết ý tưởng ngắn & Bấm Enhance",
      badge: "Gemini AI",
      desc: "Chỉ cần nhập vài từ mô tả ngắn (ví dụ: 'Xforce chạy lên đà lạt' hoặc 'Triton đồi cát Phan Thiết'), sau đó bấm nút ✨ Enhance. Google Gemini sẽ tự động hoàn thiện thành câu prompt chuyên nghiệp, chuẩn phong cách thương hiệu Mitsubishi Motors.",
      tip: "Hộp Prompt có nút Extend và góc kéo ở góc dưới bên phải để mở rộng khung nhìn.",
    },
    {
      step: "02",
      title: "Chọn Nhu cầu tạo hình (Refine Prompt)",
      badge: "Mục đích sử dụng",
      desc: "Chọn 1 trong 5 nhu cầu chuyên biệt: 📢 Hình ads, 🖼️ Hình Banner theo size của AI, 🦊 Hình Mascot, 📐 Resize hình, hoặc 🔄 Hình chụp xe đổi bối cảnh. Hệ thống sẽ tự động cập nhật câu prompt và tỷ lệ khung hình phù hợp.",
      tip: "Bạn có thể bấm 'Đặt lại' để chọn nhu cầu khác bất kỳ lúc nào.",
    },
    {
      step: "03",
      title: "Tải ảnh xe thật (Input Image)",
      badge: "Tùy chọn khuyến nghị",
      desc: "Kéo thả hoặc tải lên ảnh chụp thực tế xe tại đại lý (PNG, JPG, WEBP). AI Nano Banana Pro 2 sẽ nhận diện chính xác dòng xe (Xforce, Xpander, Triton...) và giữ nguyên màu sơn thực tế của xe vào bối cảnh mới.",
      tip: "Nên chụp xe rõ góc 3/4 trước hoặc góc ngang thân để AI nhận diện tốt nhất.",
    },
    {
      step: "04",
      title: "Chọn Tỷ lệ khung hình & Độ phân giải",
      badge: "Đúng kênh đăng tải",
      desc: "Tùy chỉnh tỷ lệ ảnh theo nhu cầu truyền thông:",
      subPoints: [
        "1:1 (Square) - Đăng bài Facebook, Zalo, Instagram Feed",
        "9:16 (Portrait) - Tin Story, Facebook Reels, TikTok",
        "16:9 (Landscape) - Banner Website, Video YouTube, TV Showroom",
        "4:3 (Banner) - Tờ rơi, catalogue giới thiệu xe",
      ],
    },
    {
      step: "05",
      title: "Bấm Generate & Tải ảnh High-Res",
      badge: "1 Credit / lần",
      desc: "Bấm nút Generate (1 Credit). AI Nano Banana Pro 2 sẽ kết xuất ảnh trong vài giây với logo Mitsubishi Motors Three Diamonds và thông tin đại lý. Bấm 'Download High-Res' để tải ảnh chất lượng cao về sử dụng.",
      tip: "Nếu muốn góc nhìn khác, bấm 'Re-roll' để AI vẽ lại phiên bản mới.",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-gray-200 z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-gray-50 via-white to-blue-50/40">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-gray-900">Hướng dẫn sử dụng Creative Studio</h3>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                  Dành cho Tư vấn bán hàng MMV
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                5 bước đơn giản để tạo ảnh quảng cáo xe chuẩn nhận diện Mitsubishi Motors
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Steps List */}
          <div className="space-y-3.5">
            {steps.map((s, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/20 transition space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <span className="text-xs font-black px-2 py-0.5 rounded bg-gray-900 text-white font-mono">
                      {s.step}
                    </span>
                    <h4 className="text-sm font-semibold text-gray-900">{s.title}</h4>
                  </div>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-gray-100 text-gray-600 border border-gray-200">
                    {s.badge}
                  </span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">{s.desc}</p>
                {s.subPoints && (
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1 text-[11px] text-gray-600">
                    {s.subPoints.map((pt, pIdx) => (
                      <li key={pIdx} className="flex items-center space-x-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {s.tip && (
                  <div className="flex items-start space-x-1.5 pt-1 text-[11px] text-amber-800 bg-amber-50/80 px-2.5 py-1.5 rounded-lg border border-amber-200/60">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>Mẹo:</strong> {s.tip}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Brand Compliance Notice */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-red-50 to-amber-50 border border-red-200 space-y-2">
            <div className="flex items-center space-x-2 text-xs font-bold text-red-900">
              <ShieldCheck className="w-4 h-4 text-red-600" />
              <span>Quy chuẩn Thương hiệu Mitsubishi Motors (Brand Compliance)</span>
            </div>
            <ul className="text-xs text-red-800/90 space-y-1 list-disc list-inside">
              <li>Hệ thống tự động bảo vệ thương hiệu: Không sinh logo hay xe của các thương hiệu đối thủ.</li>
              <li>Ảnh tạo ra luôn giữ đúng đường nét Dynamic Shield đặc trưng và cụm đèn LED T-shape.</li>
              <li>Mỗi ngày tài khoản được cấp hạn mức tín dụng (Daily Credits). Xem lại lịch sử tạo ảnh bất cứ lúc nào tại <strong>"Show recent"</strong>.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <Zap className="w-3.5 h-3.5 text-amber-600" />
            <span>Đã hiểu quy trình? Hãy bắt đầu tạo chiến dịch của bạn.</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition flex items-center space-x-1.5 cursor-pointer"
          >
            <span>Bắt đầu tạo ảnh</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
