"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Shield, Plus, Save, CheckCircle2, Car, Sparkles, Ban } from "lucide-react";
import { BrandConfig, UserSession, VehicleModel } from "@/lib/types";
import { getStoredUser } from "@/lib/auth";

export default function AdminBrandPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [activeTab, setActiveTab] = useState<"catalog" | "prompt" | "guardrails">("catalog");
  const [config, setConfig] = useState<BrandConfig | null>(null);
  const [catalog, setCatalog] = useState<VehicleModel[]>([]);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // New model form state
  const [newModelName, setNewModelName] = useState("");
  const [newModelSegment, setNewModelSegment] = useState("");
  const [newModelCues, setNewModelCues] = useState("");
  const [newModelColors, setNewModelColors] = useState("");

  useEffect(() => {
    const user = getStoredUser();
    if (!user) {
      router.push("/login");
      return;
    }
    if (user.role !== "admin") {
      alert("Access Denied: Only HQ Marketing Admins have permission to manage brand guidelines.");
      router.push("/");
      return;
    }
    setCurrentUser(user);

    async function loadConfig() {
      try {
        const res = await fetch("/api/admin/brand");
        if (res.ok) {
          const data = await res.json();
          setConfig(data.config);
          setCatalog(data.catalog);
        }
      } catch (err) {
        console.error("Failed to load brand config:", err);
      }
    }
    loadConfig();
  }, [router]);

  const handleSaveConfig = async () => {
    if (!config) return;
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const res = await fetch("/api/admin/brand", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ config }),
      });

      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Failed to save brand config:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddModel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModelName.trim()) return;

    const newModel: VehicleModel = {
      id: newModelName.toLowerCase().replace(/\s+/g, "-"),
      name: newModelName,
      segment: newModelSegment || "Automotive",
      design_cues: newModelCues || "Dynamic Shield front face",
      official_colors: newModelColors ? newModelColors.split(",").map((c) => c.trim()) : ["White Diamond", "Black Mica"],
    };

    try {
      const res = await fetch("/api/admin/brand", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newModel }),
      });

      if (res.ok) {
        setCatalog((prev) => [...prev, newModel]);
        setNewModelName("");
        setNewModelSegment("");
        setNewModelCues("");
        setNewModelColors("");
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Failed to add model:", err);
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center space-y-3">
        <div className="w-8 h-8 rounded-full border-2 border-red-600 border-t-transparent animate-spin" />
        <span className="text-xs font-semibold text-gray-500">Verifying Admin Access...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Top Bar */}
      <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-6 sticky top-0 z-30">
        <div className="flex items-center space-x-4">
          <Link
            href="/"
            className="flex items-center space-x-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Studio</span>
          </Link>
          <div className="h-4 w-px bg-gray-200" />
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-red-600" />
            <span className="font-semibold text-gray-900 text-sm">
              HQ Brand Governance & MMV Guidelines
            </span>
          </div>
        </div>

        {saveSuccess && (
          <div className="flex items-center space-x-1 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-3 py-1 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Brand rules published live!</span>
          </div>
        )}
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto py-8 px-6 space-y-6">
        {/* Tabs */}
        <div className="flex items-center space-x-2 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("catalog")}
            className={`pb-3 px-4 text-xs font-semibold flex items-center space-x-1.5 border-b-2 transition cursor-pointer ${
              activeTab === "catalog"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            <Car className="w-4 h-4" />
            <span>Vehicle & Color Catalog</span>
          </button>
          <button
            onClick={() => setActiveTab("prompt")}
            className={`pb-3 px-4 text-xs font-semibold flex items-center space-x-1.5 border-b-2 transition cursor-pointer ${
              activeTab === "prompt"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>AID Prompt Hybrid Formula (Gemini)</span>
          </button>
          <button
            onClick={() => setActiveTab("guardrails")}
            className={`pb-3 px-4 text-xs font-semibold flex items-center space-x-1.5 border-b-2 transition cursor-pointer ${
              activeTab === "guardrails"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            <Ban className="w-4 h-4" />
            <span>Negative Guardrails & Blacklist</span>
          </button>
        </div>

        {/* Tab 1: Vehicle & Color Catalog */}
        {activeTab === "catalog" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-2xs space-y-4">
              <h2 className="text-sm font-semibold text-gray-900">
                Active MMV Vehicle Lineup ({catalog.length} Models)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {catalog.map((car) => (
                  <div
                    key={car.id}
                    className="p-4 rounded-lg border border-gray-200 bg-gray-50/50 space-y-2 text-xs"
                  >
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-gray-900 text-sm">{car.name}</h3>
                      <span className="text-[10px] font-medium bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                        {car.segment}
                      </span>
                    </div>
                    <p className="text-gray-600 text-[11px] leading-relaxed">
                      <strong>Design Cues:</strong> {car.design_cues}
                    </p>
                    <div className="space-y-1 pt-1">
                      <span className="text-[11px] font-semibold text-gray-700">Official Colors:</span>
                      <div className="flex flex-wrap gap-1">
                        {car.official_colors.map((c, i) => (
                          <span
                            key={i}
                            className="bg-white border border-gray-200 px-1.5 py-0.5 rounded text-[10px] text-gray-700"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Add Model Form */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-2xs space-y-4">
              <h2 className="text-sm font-semibold text-gray-900 flex items-center space-x-1.5">
                <Plus className="w-4 h-4 text-blue-600" />
                <span>Add New Vehicle Model</span>
              </h2>
              <form onSubmit={handleAddModel} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-gray-700">Model Name</label>
                  <input
                    type="text"
                    value={newModelName}
                    onChange={(e) => setNewModelName(e.target.value)}
                    placeholder="e.g. Mitsubishi Destinator 2026"
                    className="w-full p-2 rounded-lg border border-gray-300 text-gray-900"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-gray-700">Segment</label>
                  <input
                    type="text"
                    value={newModelSegment}
                    onChange={(e) => setNewModelSegment(e.target.value)}
                    placeholder="e.g. 7-Seater Premium SUV"
                    className="w-full p-2 rounded-lg border border-gray-300 text-gray-900"
                  />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="font-semibold text-gray-700">Signature Design Cues</label>
                  <input
                    type="text"
                    value={newModelCues}
                    onChange={(e) => setNewModelCues(e.target.value)}
                    placeholder="e.g. Dynamic Shield grille, sharp LED matrix headlights, floating roof design"
                    className="w-full p-2 rounded-lg border border-gray-300 text-gray-900"
                  />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="font-semibold text-gray-700">
                    Official Colors (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={newModelColors}
                    onChange={(e) => setNewModelColors(e.target.value)}
                    placeholder="e.g. Energetic Yellow, Red Diamond, White Diamond, Jet Black"
                    className="w-full p-2 rounded-lg border border-gray-300 text-gray-900"
                  />
                </div>
                <div className="md:col-span-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm transition cursor-pointer"
                  >
                    Add Model to Catalog
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Tab 2: AID Prompt Hybrid Formula */}
        {activeTab === "prompt" && config && (
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-2xs space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-gray-900">
                  Gemini System Instructions & AID Hybrid Formula
                </h2>
                <p className="text-[11px] text-gray-500">
                  Version: {config.version} • Last updated: {new Date(config.updated_at).toLocaleString()}
                </p>
              </div>
              <button
                onClick={handleSaveConfig}
                disabled={isSaving}
                className="flex items-center space-x-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm transition cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? "Publishing..." : "Publish Live"}</span>
              </button>
            </div>

            <div className="space-y-2">
              <label className="font-semibold text-gray-700">Master System Prompt (MMV Art Director)</label>
              <textarea
                rows={12}
                value={config.system_instruction}
                onChange={(e) => setConfig({ ...config, system_instruction: e.target.value })}
                className="w-full p-3 rounded-lg border border-gray-300 text-gray-900 font-mono text-[11px] leading-relaxed resize-y"
              />
            </div>
          </div>
        )}

        {/* Tab 3: Guardrails */}
        {activeTab === "guardrails" && config && (
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-2xs space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-gray-900">Negative Prompt & Brand Safety</h2>
                <p className="text-[11px] text-gray-500">
                  Silent negative guardrails automatically injected into every Nano Banana Pro 2 generation.
                </p>
              </div>
              <button
                onClick={handleSaveConfig}
                disabled={isSaving}
                className="flex items-center space-x-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm transition cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? "Publishing..." : "Publish Live"}</span>
              </button>
            </div>

            <div className="space-y-2">
              <label className="font-semibold text-gray-700">Negative Prompt String</label>
              <textarea
                rows={4}
                value={config.negative_prompt}
                onChange={(e) => setConfig({ ...config, negative_prompt: e.target.value })}
                className="w-full p-3 rounded-lg border border-gray-300 text-gray-900 font-mono text-[11px]"
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
