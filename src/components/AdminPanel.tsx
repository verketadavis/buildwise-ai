import React, { useState } from "react";
import { 
  Shield, Server, Key, TrendingUp, Info, Activity, Database, CheckSquare, Sparkles 
} from "lucide-react";

export default function AdminPanel() {
  const [usIndex, setUsIndex] = useState("1.08");
  const [caIndex, setCaIndex] = useState("1.15");
  const [isSaved, setIsSaved] = useState(false);

  const auditLogs = [
    { timestamp: "2026-06-13T09:12:00Z", service: "Gemini API", event: "Project 'Austin Modern Dwelling' analysis. Structured JSON returned successfully." },
    { timestamp: "2026-06-13T09:10:45Z", service: "Pricing Engine", event: "Calculated sales tax multiplier of 8.25% for central Austin ZIP code 78704." },
    { timestamp: "2026-06-13T09:08:32Z", service: "Payments", event: "MFA session check: verified user token status RichardsChegeGitau." },
    { timestamp: "2026-06-13T09:05:11Z", service: "Audit Logs", event: "Full-stack server.ts compiled on port 3000 behind NGINX reverse-proxy." }
  ];

  const handleUpdateDatabase = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto font-sans text-xs">
      <div className="border-b border-gray-200 pb-5 mb-8">
        <h1 className="text-3xl font-extrabold text-black tracking-tight flex items-center gap-2">
          <Shield className="h-7 w-7 text-green-700" />
          System Admin Panel
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Monitor container server health, customize global regional material cost indexes, audit user API logs, and review payment subscription pipelines.
        </p>
      </div>

      {/* Stats container health row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <span className="text-gray-400 font-bold block mb-1">SYSTEM INSTANCES</span>
          <span className="text-2xl font-black text-black">Cloud Run Container</span>
          <div className="flex items-center gap-1.5 text-green-700 text-[10px] font-bold mt-1">
            <span className="h-1.5 w-1.5 rounded-full bg-green-700 animate-ping"></span>
            ACTIVE PORT 3000 OK
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <span className="text-gray-400 font-bold block mb-1">AI MODEL RESPONSE</span>
          <span className="text-2xl font-black text-black font-mono">220 ms</span>
          <p className="text-gray-400 mt-1">gemini-3.5-flash latency</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <span className="text-gray-400 font-bold block mb-1">STRIPE GATEWAY</span>
          <span className="text-2xl font-black text-green-700 font-mono">Live Demo</span>
          <p className="text-gray-400 mt-1">Single-seat subscription OK</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <span className="text-gray-400 font-bold block mb-1">PERSISTING STORES</span>
          <span className="text-2xl font-black text-black">In-Memory Engine</span>
          <p className="text-gray-400 mt-1">State buffer cached safely</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 7 cols: Indexes and update forms */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h3 className="text-sm font-bold text-black uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Database className="h-4.5 w-4.5 text-green-700" />
              Adjust Regional Pricing References
            </h3>
            <p className="text-gray-500 mb-4 font-sans leading-relaxed">
              Tweak standard material commodity overhead indexes. Values of 1.0 represents baseline national averages, while high-demand metropolitan zones scale upwards.
            </p>

            <form onSubmit={handleUpdateDatabase} className="space-y-4 font-sans text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">United States Central Index</label>
                  <input 
                    type="number" 
                    value={usIndex}
                    onChange={(e) => setUsIndex(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 p-2 font-mono font-bold text-black focus:ring-1 focus:ring-green-700"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Canadian British Columbia Index</label>
                  <input 
                    type="number" 
                    value={caIndex}
                    onChange={(e) => setCaIndex(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 p-2 font-mono font-bold text-black focus:ring-1 focus:ring-green-700"
                    step="0.01"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="rounded-xl bg-black px-4 py-2 font-bold text-white hover:bg-green-700 transition-colors"
                id="btn-admin-update"
              >
                Apply Index Overrides
              </button>

              {isSaved && (
                <div className="p-3 bg-green-50 border border-green-200 text-green-800 rounded-xl font-bold font-sans">
                  Adjustment saved successfully. Local estimated tables synchronizing...
                </div>
              )}
            </form>
          </div>

          {/* Audit Logs table */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h3 className="text-sm font-bold text-black uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Activity className="h-4.5 w-4.5 text-green-700" />
              Platform Transaction Audit Logs
            </h3>
            
            <div className="space-y-3 font-mono">
              {auditLogs.map((log, i) => (
                <div key={i} className="p-3 bg-[#F5F5F5] rounded-xl border border-gray-250 flex items-start gap-4">
                  <div className="text-[10px] text-gray-400 font-bold whitespace-nowrap min-w-[75px]">{log.timestamp.substr(11, 8)}</div>
                  <div className="flex-1 text-[11px] text-gray-600 leading-normal">
                    <span className="font-bold text-black border-r border-gray-300 pr-2 mr-2">{log.service}</span>
                    {log.event}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 5 cols: Developer diagnostics / Credentials checks */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm h-fit space-y-4">
          <h3 className="text-sm font-bold text-black uppercase tracking-wider border-b border-gray-150 pb-2 flex items-center gap-1.5">
            <Server className="h-4.5 w-4.5 text-green-700" />
            Vite Server Environment
          </h3>

          <div className="space-y-3">
            <div className="p-3.5 bg-[#F5F5F5] border border-gray-250 rounded-xl flex items-center justify-between">
              <div>
                <span className="font-sans font-bold text-black block text-xs">Vite Hot Module Reload (HMR)</span>
                <span className="text-[10px] text-gray-400 font-sans block mt-0.5">Control plane setting configuration</span>
              </div>
              <span className="text-[10px] font-bold font-mono px-2 py-0.5 bg-gray-200 rounded text-gray-600 uppercase tracking-wilder">Disabled</span>
            </div>

            <div className="p-3.5 bg-[#F5F5F5] border border-gray-250 rounded-xl flex items-center justify-between">
              <div>
                <span className="font-sans font-bold text-black block text-xs">Credential API Keys Injection</span>
                <span className="text-[10px] text-gray-400 font-sans block mt-0.5">Google GenAI Platform validation</span>
              </div>
              <span className="text-[10px] font-bold font-mono px-2 py-0.5 bg-green-50 rounded text-green-700 uppercase tracking-wilder">Resolved</span>
            </div>

            <div className="p-3.5 bg-[#F5F5F5] border border-gray-250 rounded-xl flex items-center justify-between">
              <div>
                <span className="font-sans font-bold text-black block text-xs">Container Port Bindings</span>
                <span className="text-[10px] text-gray-400 font-sans block mt-0.5">Single-Ingress mapped NGINX port</span>
              </div>
              <span className="text-[10px] font-bold font-mono px-2 py-0.5 bg-black rounded text-white font-mono uppercase tracking-wilder">Port 3000 Only</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
