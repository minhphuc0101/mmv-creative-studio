"use client";

import React, { useEffect, useState } from "react";
import { X, Clock, Zap, ExternalLink, RefreshCw } from "lucide-react";
import { GenerationAuditRecord } from "@/lib/types";

interface RecentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRecord: (record: GenerationAuditRecord) => void;
}

export const RecentDrawer: React.FC<RecentDrawerProps> = ({
  isOpen,
  onClose,
  onSelectRecord,
}) => {
  const [logs, setLogs] = useState<GenerationAuditRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/recent");
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
      }
    } catch (err) {
      console.error("Failed to fetch recent audit logs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchLogs();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl z-10 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <h3 className="text-sm font-semibold text-gray-900">Recent Generation Audit Logs</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 text-gray-500 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
          {loading ? (
            <div className="text-center py-12 text-xs text-gray-400">Loading audit trail...</div>
          ) : logs.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <p className="text-xs text-gray-500">No generation logs recorded yet.</p>
              <p className="text-[11px] text-gray-400">
                Generate your first marketing visual using Nano Banana Pro 2 to see the audit log.
              </p>
            </div>
          ) : (
            logs.map((log) => (
              <div
                key={log.job_id}
                onClick={() => {
                  onSelectRecord(log);
                  onClose();
                }}
                className="p-3 rounded-xl border border-gray-200 hover:border-blue-400 bg-white hover:bg-blue-50/30 transition cursor-pointer space-y-2 group shadow-2xs"
              >
                <div className="flex items-start justify-between">
                  <div className="text-[11px] text-gray-500">
                    {new Date(log.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    • {log.user.dealer_name}
                  </div>
                  <div className="flex items-center space-x-1 text-[10px] font-semibold bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded border border-amber-200">
                    <Zap className="w-2.5 h-2.5 fill-amber-500 text-amber-600" />
                    <span>-{log.generation.credits_deducted} Credit</span>
                  </div>
                </div>

                <div className="flex space-x-3">
                  {log.generation.image_url && (
                    <img
                      src={log.generation.image_url}
                      alt="Thumbnail"
                      className="w-14 h-14 rounded-lg object-cover border border-gray-200 flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-800 font-medium line-clamp-2 leading-snug group-hover:text-blue-600">
                      {log.inputs.user_prompt}
                    </p>
                    <div className="mt-1 flex items-center space-x-2 text-[10px] text-gray-400">
                      <span className="uppercase font-semibold text-gray-600">
                        {log.inputs.aspect_ratio}
                      </span>
                      <span>•</span>
                      <span>{log.generation.latency_ms}ms</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between text-[11px] text-gray-500">
          <span>Enterprise Audit Trail Active</span>
          <button
            onClick={fetchLogs}
            className="flex items-center space-x-1 text-blue-600 hover:underline font-medium"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Refresh</span>
          </button>
        </div>
      </div>
    </div>
  );
};
