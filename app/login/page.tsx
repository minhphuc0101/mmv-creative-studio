"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight, ShieldCheck, Zap, UserCheck, Sparkles } from "lucide-react";
import { MOCK_ACCOUNTS, setStoredUser } from "@/lib/auth";
import { UserSession } from "@/lib/types";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("phuc.tran@testmmv.com");
  const [password, setPassword] = useState("••••••••••••");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (user: UserSession) => {
    setIsLoading(true);
    setStoredUser(user);
    setTimeout(() => {
      router.push("/");
    }, 400);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const existing = MOCK_ACCOUNTS.find((a) => a.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      handleLogin(existing);
    } else {
      // Create user session dynamically
      const dynamicUser: UserSession = {
        id: `usr_${Date.now()}`,
        name: email.split("@")[0].replace(".", " ").toUpperCase(),
        email,
        role: "sales_consultant",
        dealership: {
          id: "dealer_custom_01",
          name: "Mitsubishi Authorized Dealer",
          code: "MMV-DLR-VN",
          monthly_budget_remaining: 1000,
        },
        daily_credits_remaining: 20,
        daily_limit: 20,
      };
      handleLogin(dynamicUser);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-black text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-4">
        {/* Brand Badges */}
        <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3.5 py-1 rounded-full border border-white/15 text-xs text-slate-300">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="font-semibold text-white">Mitsubishi Motors Vietnam</span>
          <span className="text-slate-500">•</span>
          <span>Creative Studio</span>
        </div>

        {/* Logo */}
        <div className="flex items-center justify-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-pink-500 to-amber-400 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <span className="text-white font-black text-lg">✕</span>
          </div>
          <span className="text-2xl font-bold text-white tracking-tight">
            Creative Studio
          </span>
        </div>

        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          AI-Powered Dealer Marketing Visual Generator for Sales Consultants & Marketing Teams
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0 space-y-6">
        {/* Main Login Card */}
        <div className="bg-slate-900/90 backdrop-blur-xl py-8 px-6 shadow-2xl rounded-2xl border border-slate-800 space-y-6">
          <form onSubmit={handleCustomSubmit} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300 flex items-center space-x-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>Corporate Email</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@testmmv.com"
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-slate-300 flex items-center space-x-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Password</span>
                </label>
                <a href="#" className="text-[11px] text-blue-400 hover:underline">
                  Forgot password?
                </a>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-md shadow-blue-600/30 transition flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              <span>{isLoading ? "Signing in..." : "Sign In with Corporate Account"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-800" />
            <span className="flex-shrink mx-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Or 1-Click Quick Demo Login
            </span>
            <div className="flex-grow border-t border-slate-800" />
          </div>

          {/* 3 Quick Mock Accounts */}
          <div className="space-y-2.5">
            {MOCK_ACCOUNTS.map((acc) => (
              <button
                key={acc.id}
                type="button"
                onClick={() => handleLogin(acc)}
                className="w-full p-3 rounded-xl border border-slate-800 hover:border-blue-500/50 bg-slate-950/60 hover:bg-slate-800/60 transition text-left flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center font-bold text-xs text-slate-200 border border-slate-700 group-hover:border-blue-500 transition">
                    {acc.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white group-hover:text-blue-400 transition">
                      {acc.name}
                    </div>
                    <div className="text-[11px] text-slate-400">{acc.dealership.name}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-right">
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                      acc.role === "admin"
                        ? "bg-red-500/10 text-red-400 border-red-500/20"
                        : acc.role === "dealer_manager"
                        ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                        : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                    }`}
                  >
                    {acc.role === "admin"
                      ? "HQ Admin"
                      : acc.role === "dealer_manager"
                      ? "Manager"
                      : "Consultant"}
                  </span>
                  <div className="text-[10px] font-medium text-amber-400 flex items-center space-x-0.5">
                    <Zap className="w-3 h-3 fill-amber-400" />
                    <span>{acc.daily_credits_remaining}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center text-[11px] text-slate-500 space-y-1">
          <p>Mitsubishi Motors Vietnam • Authorized Dealership Network</p>
          <p>Powered by Nano Banana Pro 2 & Google Gemini AI</p>
        </div>
      </div>
    </div>
  );
}
