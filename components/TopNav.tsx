"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, History, Sparkles, Shield, User, Zap, LogOut, BookOpen } from "lucide-react";
import { UserSession } from "@/lib/types";
import { clearStoredUser } from "@/lib/auth";

interface TopNavProps {
  user: UserSession;
  onOpenRecent: () => void;
  onOpenGuide?: () => void;
  onStartTour?: () => void;
  onNewImage?: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  user,
  onOpenRecent,
  onOpenGuide,
  onStartTour,
  onNewImage,
}) => {
  const router = useRouter();

  const handleLogout = () => {
    clearStoredUser();
    router.push("/login");
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-6 sticky top-0 z-30">
      {/* Left branding */}
      <div className="flex items-center space-x-6">
        <Link href="/" className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 via-pink-500 to-amber-400 flex items-center justify-center shadow-sm">
            <span className="text-white font-black text-sm">✕</span>
          </div>
          <span className="font-semibold text-gray-900 text-base tracking-tight">
            Creative Studio
          </span>
          <span className="ml-2 text-xs font-medium px-2 py-0.5 rounded bg-red-100 text-red-700 border border-red-200">
            MMV Dealer Edition
          </span>
        </Link>

        <div className="h-4 w-px bg-gray-200 hidden sm:block" />

        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span className="text-gray-400">‹</span>
          <span className="font-medium text-gray-800">Image generation</span>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center space-x-4">
        {/* Live Quota Badge (5 lượt tạo ảnh / ngày) */}
        <div 
          className="hidden md:flex items-center space-x-2 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 px-3 py-1.5 rounded-full text-xs font-medium text-amber-900 shadow-2xs"
          title={`Hạn mức thử nghiệm: ${user.daily_limit} lượt tạo ảnh/ngày. Còn lại: ${user.daily_credits_remaining} lượt.`}
        >
          <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-500 flex-shrink-0" />
          <span className="font-semibold text-amber-950">
            <strong>{user.daily_credits_remaining}</strong> / {user.daily_limit} lượt tạo/ngày
          </span>
          <span className="text-amber-300">|</span>
          <span className="text-amber-700 text-[11px]">Hạn mức đại lý</span>
        </div>

        {/* Admin Brand Settings Link */}
        {user.role === "admin" && (
          <Link
            href="/admin/brand"
            className="flex items-center space-x-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition"
          >
            <Shield className="w-3.5 h-3.5 text-red-600" />
            <span>Brand Guidelines</span>
          </Link>
        )}

        {/* Interactive Tour Button */}
        {onStartTour && (
          <button
            onClick={onStartTour}
            className="flex items-center space-x-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-2.5 py-1.5 rounded-lg transition cursor-pointer"
            title="Bắt đầu tour hướng dẫn trực quan từng bước"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Tour 5 bước</span>
          </button>
        )}

        {/* User Guide */}
        {onOpenGuide && (
          <button
            onClick={onOpenGuide}
            className="flex items-center space-x-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2.5 py-1.5 rounded-lg transition cursor-pointer"
            title="Xem hướng dẫn sử dụng chi tiết"
          >
            <BookOpen className="w-3.5 h-3.5 text-blue-600" />
            <span>User Guide</span>
          </button>
        )}

        {/* Show Recent */}
        <button
          onClick={onOpenRecent}
          className="flex items-center space-x-1.5 text-xs font-medium text-gray-700 hover:text-gray-900 px-2.5 py-1.5 rounded-lg hover:bg-gray-100 transition cursor-pointer"
        >
          <History className="w-4 h-4 text-gray-500" />
          <span>Show recent</span>
        </button>

        {/* New images button */}
        {onNewImage && (
          <button
            onClick={onNewImage}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg shadow-sm transition cursor-pointer"
          >
            New images
          </button>
        )}

        {/* User profile & Logout */}
        <div className="flex items-center space-x-3 pl-2 border-l border-gray-200">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs border border-blue-200">
            {getInitials(user.name)}
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-semibold text-gray-900 leading-tight">{user.name}</div>
            <div className="text-[10px] text-gray-500 leading-tight">{user.dealership.name}</div>
          </div>
          <button
            onClick={handleLogout}
            title="Log Out"
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-red-600 transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
