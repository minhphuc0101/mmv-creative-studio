"use client";

import React from "react";
import Link from "next/link";
import { ChevronDown, History, Sparkles, Shield, User, Zap } from "lucide-react";
import { UserSession } from "@/lib/types";

interface TopNavProps {
  user: UserSession;
  onOpenRecent: () => void;
  onNewImage?: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({ user, onOpenRecent, onNewImage }) => {
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
        {/* Live Quota Badge */}
        <div className="hidden md:flex items-center space-x-2 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full text-xs font-medium text-amber-800">
          <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
          <span>
            <strong>{user.daily_credits_remaining}</strong> / {user.daily_limit} Daily Credits
          </span>
          <span className="text-amber-400">|</span>
          <span className="text-amber-700">Branch: {user.dealership.monthly_budget_remaining} left</span>
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

        {/* Show Recent */}
        <button
          onClick={onOpenRecent}
          className="flex items-center space-x-1.5 text-xs font-medium text-gray-700 hover:text-gray-900 px-2.5 py-1.5 rounded-lg hover:bg-gray-100 transition"
        >
          <History className="w-4 h-4 text-gray-500" />
          <span>Show recent</span>
        </button>

        {/* New images button */}
        {onNewImage && (
          <button
            onClick={onNewImage}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg shadow-sm transition"
          >
            New images
          </button>
        )}

        {/* User profile */}
        <div className="flex items-center space-x-2 pl-2 border-l border-gray-200">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold text-xs border border-gray-300">
            PT
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-semibold text-gray-900 leading-tight">{user.name}</div>
            <div className="text-[10px] text-gray-500 leading-tight">{user.dealership.name}</div>
          </div>
        </div>
      </div>
    </header>
  );
};
