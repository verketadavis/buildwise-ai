import { useState } from "react";
import { Project, EstimateResult } from "../types";
import { 
  DollarSign, Sliders, ArrowUpRight, ShieldCheck, Leaf, Compass, Plus, Lightbulb, AlertTriangle, HelpCircle, HardHat, FileText 
} from "lucide-react";

interface DashboardOverviewProps {
  project: Project;
  onChangeOrder: (type: string, intensity: number) => Promise<void>;
  isChangeOrderRunning: boolean;
  onNavigateToTab: (tab: any) => void;
  onAnalyzeProject: () => Promise<void>;
  isAnalyzing: boolean;
}

export default function DashboardOverview({ 
  project, 
  onChangeOrder, 
  isChangeOrderRunning,
  onNavigateToTab,
  onAnalyzeProject,
  isAnalyzing
}: DashboardOverviewProps) {
  const [selectedCostTier, setSelectedCostTier] = useState<"low" | "avg" | "premium">("avg");
  const [customRoomCount, setCustomRoomCount] = useState<number>(1);
  const [changeMsg, setChangeMsg] = useState<{ text: string; cost: number } | null>(null);

  if (!project.estimate) {
    return (
      <div className="p-8 max-w-5xl mx-auto text-center font-sans">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-50 text-gray-400 mb-6">
          <HardHat className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold text-black tracking-tight">Awaiting Blueprint & Geo-Data Analysis</h2>
        <p className="mt-2 text-sm text-gray-500 max-w-lg mx-auto">
          Your project <span className="font-bold text-black">"{project.name}"</span> is currently in Draft. Let our AI cost prediction engine analyze your blueprints, soil profiles, and localized regional variables.
        </p>

        <div className="mt-8 p-6 bg-[#F5F5F5] rounded-2xl border border-gray-250 max-w-lg mx-auto text-left">
          <h3 className="text-xs font-bold text-black uppercase tracking-wider mb-2">Project Outline</h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-gray-600">
            <div><span className="text-gray-400">Location:</span> {project.location} ({project.country})</div>
            <div><span className="text-gray-400">Footprint Size:</span> {project.areaSqFt} Sq Ft</div>
            <div><span className="text-gray-400">Stories Count:</span> {project.stories} ({project.roomsCount} rooms)</div>
            <div><span className="text-gray-400">Soil Condition:</span> {project.soilCondition}</div>
            <div><span className="text-gray-400">Plot Incline:</span> {project.terrainType} slope</div>
            <div><span className="text-gray-400">Target Budget:</span> ${project.budget.toLocaleString()}</div>
          </div>
        </div>

        <button
          onClick={onAnalyzeProject}
          disabled={isAnalyzing}
          className="mt-8 rounded-xl bg-green-700 px-6 py-3 font-semibold text-white hover:bg-green-800 transition-colors focus:ring-4 focus:ring-green-150 inline-flex items-center gap-2 shadow-sm disabled:opacity-50"
          id="btn-trigger-analysis"
        >
          {isAnalyzing ? (
            <>
              <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Generating detailed project estimates...
            </>
          ) : (
            <>
              Analyze Blueprint & Estimate Now
            </>
          )}
        </button>
      </div>
    );
  }

  const { lowCost, avgCost, premiumCost, confidenceScore, categories } = project.estimate;
  const currentTotal = selectedCostTier === "low" ? lowCost : selectedCostTier === "avg" ? avgCost : premiumCost;
  const confidenceColor = confidenceScore > 85 ? "text-green-700" : confidenceScore > 70 ? "text-amber-500" : "text-red-500";
  
  const handleTriggerChangeOrder = async (type: string, multiplier: number) => {
    setChangeMsg(null);
    await onChangeOrder(type, multiplier);
    const cost = type === "add_room" ? 28500 * multiplier * (project.regionalIndex || 1.0) : type === "roof_upgrade" ? 12500 : 16000;
    setChangeMsg({
      text: type === "add_room" ? `Successfully attached Change Order. Appended ${multiplier} finished bedroom(s) to specifications.` : type === "roof_upgrade" ? "Shed specs switched to premium Recycled Aluminum sheets." : "Foundation anchors bolted with helical reinforcement.",
      cost: Math.round(cost)
    });
  };

  return (
    <div className="p-8 max-w-7xl mx-auto font-sans">
      {/* Upper Title Row */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-6 border-b border-gray-200 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-black tracking-tight">{project.name}</h1>
          <p className="mt-1 text-sm text-gray-500">
            Location-based cost intelligence configured for <span className="font-semibold text-black">{project.location}</span>
          </p>
        </div>

        {/* Cost Tier Toggles */}
        <div className="mt-4 md:mt-0 flex p-1.5 bg-[#F5F5F5] rounded-xl border border-gray-250">
          <button 
            onClick={() => setSelectedCostTier("low")}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all focus:outline-none ${selectedCostTier === "low" ? "bg-black text-white" : "text-gray-500 hover:text-black"}`}
            id="tier-low"
          >
            Frugal Materials
          </button>
          <button 
            onClick={() => setSelectedCostTier("avg")}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all focus:outline-none ${selectedCostTier === "avg" ? "bg-black text-white" : "text-gray-500 hover:text-black"}`}
            id="tier-avg"
          >
            Standard Finish
          </button>
          <button 
            onClick={() => setSelectedCostTier("premium")}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all focus:outline-none ${selectedCostTier === "premium" ? "bg-black text-white" : "text-gray-500 hover:text-black"}`}
            id="tier-premium"
          >
            Premium Grade
          </button>
        </div>
      </div>

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Card 1: Estimated Cost */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Estimated Total Cost</span>
            <div className="h-8 w-8 rounded-lg bg-green-50 text-green-700 flex items-center justify-center">
              <DollarSign className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-black text-black font-mono">
            ${currentTotal.toLocaleString()}
          </div>
          <div className="mt-2 text-xs text-gray-500 flex items-center justify-between">
            <span>Target budget: ${project.budget.toLocaleString()}</span>
            <span className={`font-bold ${currentTotal <= project.budget ? "text-green-700" : "text-red-500"}`}>
              {Math.abs(currentTotal - project.budget) === 0 ? "On Target" : currentTotal <= project.budget ? "Under Target" : "Over Target"}
            </span>
          </div>
        </div>

        {/* Card 2: Confidence Score */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Confidence Rating</span>
            <div className="h-8 w-8 rounded-lg bg-[#F5F5F5] text-black flex items-center justify-center">
              <ShieldCheck className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-black text-black font-mono">
            {confidenceScore}%
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Backed by local municipal tax and labor indexes.
          </p>
        </div>

        {/* Card 3: Regional Cost Factor */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Regional Cost Factor</span>
            <div className="h-8 w-8 rounded-lg bg-[#F5F5F5] text-black flex items-center justify-center">
              <Compass className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-black text-black font-mono">
            {project.regionalIndex || 1.0}x
          </div>
          <p className="mt-2 text-xs text-green-700 font-semibold">
            {project.country === "US" ? "State price standard applied" : "Provincial tax structure applied"}
          </p>
        </div>

        {/* Card 4: Environmental Carbon Rating */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Sustainability Score</span>
            <div className="h-8 w-8 rounded-lg bg-green-50 text-green-700 flex items-center justify-center">
              <Leaf className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-black text-black font-mono">
            {project.carbon?.sustainabilityScore || 70}/100
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Estimated emissions: {project.carbon?.totalCo2Kgs.toLocaleString() || "0"} Kgs CO₂
          </p>
        </div>
      </div>

      {/* Two Columns Grid: Estimates Categories Breakdown + Change Order Predictor */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Left Col: Categories pricing allocation list */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4 border-b border-gray-150 pb-3">
            <h2 className="text-lg font-bold text-black flex items-center gap-2">
              <HardHat className="h-5 w-5 text-green-700" />
              Category Cost Breakdown
            </h2>
            <span className="text-xs text-gray-400">Calculated Allocation</span>
          </div>

          <div className="space-y-5">
            {categories.map((cat, i) => {
              const val = selectedCostTier === "low" ? cat.low : selectedCostTier === "avg" ? cat.avg : cat.premium;
              const percent = Math.min(100, Math.round((val / currentTotal) * 100));
              
              return (
                <div key={i} className="text-xs">
                  <div className="flex justify-between font-semibold text-black mb-1">
                    <span>{cat.name}</span>
                    <span className="font-mono">${val.toLocaleString()} ({percent}%)</span>
                  </div>
                  {/* Progress Flat Bar */}
                  <div className="w-full bg-[#F5F5F5] h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-green-700 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                  <p className="mt-1 text-[11px] text-gray-500 font-sans leading-relaxed">{cat.explanation}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Change Order Predictor & Design Alternatives */}
        <div className="space-y-8">
          {/* Change Order Predictor */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-150 pb-3 mb-4">
              <h2 className="text-lg font-bold text-black flex items-center gap-2">
                <Sliders className="h-5 w-5 text-green-700" />
                Change Order Predictor
              </h2>
              <span className="text-[10px] uppercase font-bold text-green-700 px-2 py-0.5 rounded bg-green-50">On-the-fly</span>
            </div>

            <p className="text-xs text-gray-500 leading-relaxed mb-4">
              Acknowledge and predict cost variance before amending structural parameters. Modify parameters dynamically to append bedrooms, upgrade structural shingle layouts, or reinforce soil piles on sloped grading.
            </p>

            <div className="space-y-4">
              {/* Option 1: Add a bedroom */}
              <div className="p-4 bg-[#F5F5F5] border border-gray-250 rounded-xl flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-black">Append Guest Bedroom (+150 Sq Ft)</h3>
                  <p className="text-[11px] text-gray-500 mt-0.5">Appends wood framing packs, trims, level-4 drywall sheets.</p>
                </div>
                <div className="flex items-center gap-2">
                  <select 
                    value={customRoomCount}
                    onChange={(e) => setCustomRoomCount(Number(e.target.value))}
                    className="bg-white border border-gray-300 rounded px-2 py-1 text-xs focus:ring-green-700 font-semibold"
                    id="select-rooms-count"
                  >
                    <option value={1}>1 Room</option>
                    <option value={2}>2 Rooms</option>
                    <option value={3}>3 Rooms</option>
                  </select>
                  <button
                    onClick={() => handleTriggerChangeOrder("add_room", customRoomCount)}
                    disabled={isChangeOrderRunning}
                    className="p-1.5 bg-black text-white rounded hover:bg-green-700 focus:outline-none transition-colors"
                    title="Append Bedroom"
                    id="btn-add-room-order"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Option 2: Roof Upgrade */}
              <div className="p-4 bg-[#F5F5F5] border border-gray-250 rounded-xl flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-black">Upgrade to standing-seam Recycled Aluminum Roof</h3>
                  <p className="text-[11px] text-gray-500 mt-0.5">Heavy gauge metal panel grids resist storm loads up to 140mph.</p>
                </div>
                <button
                  onClick={() => handleTriggerChangeOrder("roof_upgrade", 1)}
                  disabled={isChangeOrderRunning || project.roofType.toLowerCase().includes("aluminum") || project.roofType.toLowerCase().includes("metal")}
                  className="p-1.5 bg-black text-white rounded hover:bg-green-700 focus:outline-none transition-colors disabled:opacity-30 disabled:bg-gray-400"
                  id="btn-roof-order"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              {/* Option 3: Soil/Foundation upgrade */}
              <div className="p-4 bg-[#F5F5F5] border border-gray-250 rounded-xl flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-black">Reinforce Base Slab with Helical Piles</h3>
                  <p className="text-[11px] text-gray-500 mt-0.5">Bolts slab corners into deep bedrock to isolate from soil swells.</p>
                </div>
                <button
                  onClick={() => handleTriggerChangeOrder("foundation_upgrade", 1)}
                  disabled={isChangeOrderRunning || project.foundationType.toLowerCase().includes("pile")}
                  className="p-1.5 bg-black text-white rounded hover:bg-green-700 focus:outline-none transition-colors disabled:opacity-30 disabled:bg-gray-400"
                  id="btn-foundation-order"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {changeMsg && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 text-green-800 text-xs rounded-xl flex items-center justify-between">
                <span>{changeMsg.text}</span>
                <span className="font-mono font-bold">+${changeMsg.cost.toLocaleString()}</span>
              </div>
            )}
          </div>

          {/* Design Alternatives */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-black flex items-center gap-2 border-b border-gray-150 pb-3 mb-4">
              <Lightbulb className="h-5 w-5 text-green-700" />
              Design & Efficiency Alternatives
            </h2>
            <div className="space-y-4">
              {project.alternatives?.map((alt, idx) => (
                <div key={idx} className="p-4 border border-gray-200 bg-white rounded-xl">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xs font-bold text-black">{alt.title}</h3>
                    <span className={`text-[10px] font-mono font-extrabold px-1.5 py-0.5 rounded ${alt.costImpact < 0 ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-500'}`}>
                      {alt.costImpact < 0 ? `Saves $${Math.abs(alt.costImpact).toLocaleString()}` : `+$${alt.costImpact.toLocaleString()} Upgrade`}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 leading-relaxed mt-1">{alt.description}</p>
                  <div className="mt-2 text-[10px] font-semibold text-green-700">
                    Expected Seasonal Heat Retention: {alt.energySavingsPct}% improvement
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Geographic Site Conditions banner */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm mb-8">
        <h2 className="text-base font-bold text-black flex items-center gap-2 mb-3">
          <Compass className="h-5 w-5 text-green-700" />
          US & Canada Local Soil Incline Assessment
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="p-3 bg-[#F5F5F5] border border-gray-250 rounded-xl">
            <span className="text-gray-400 block mb-0.5">Terrain Profiler:</span>
            <span className="font-bold text-black">{project.terrainType} slope</span>
          </div>
          <div className="p-3 bg-[#F5F5F5] border border-gray-250 rounded-xl">
            <span className="text-gray-400 block mb-0.5">Soil Quality:</span>
            <span className="font-bold text-black">{project.soilCondition} Swells</span>
          </div>
          <div className="p-3 bg-[#F5F5F5] border border-gray-250 rounded-xl">
            <span className="text-gray-400 block mb-0.5">Excavation Index:</span>
            <span className="font-bold text-black">
              {project.terrainType === "Steep" || project.terrainType === "Rugged" ? "High (Piers required)" : "Standard grading"}
            </span>
          </div>
          <div className="p-3 bg-[#F5F5F5] border border-gray-250 rounded-xl">
            <span className="text-gray-400 block mb-0.5">Active Region Rules:</span>
            <span className="font-bold text-black">
              {project.country === "US" ? "IRC Code, State Tax rules" : "NBC, Provincial GST rules active"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
