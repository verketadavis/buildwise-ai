import { Brain, TrendingUp, Calendar, AlertTriangle, Sparkles, Trophy, Plus, ChevronRight, Check } from "lucide-react";

interface DashboardOverviewProps {
  onNavigateTab: (tab: string) => void;
  userSkills: string[];
  targetRole: string;
  xp: number;
  level: number;
  streak: number;
}

export default function DashboardOverview({
  onNavigateTab,
  userSkills,
  targetRole,
  xp,
  level,
  streak
}: DashboardOverviewProps) {
  
  const suggestions = [
    { text: "Your CV currently misses 5 critical keywords recommended for Senior UX targets.", action: "Optimize Resume", tab: "resume" },
    { text: "Estimated displacement factor is low. Focus principal prep on high-throughput PostgreSQL Tuning.", action: "Analyze Gaps", tab: "skills" },
    { text: "Complete Week 1 typescript generative quiz pattern to gain +50 XP and elevate to Level 3.", action: "Start Learning", tab: "learning" },
    { text: "Draft specialized presentation slides for your Rust packets dashboard project to prepare for Meta.", action: "Generate Brief", tab: "projects" }
  ];

  return (
    <div className="space-y-8 animate-fade-in text-[#111827]">
      {/* Top Welcome Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-150 pb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-black">Welcome back, Shepard</h2>
          <p className="text-sm text-gray-500 font-normal">Your career intelligence dashboard node is locked and synchronized.</p>
        </div>

        {/* Gamification Level indicators */}
        <div className="flex items-center space-x-3 text-xs">
          <div className="bg-[#111827] text-white px-3.5 py-1.5 rounded-xl flex items-center space-x-1.5 font-semibold shadow-sm">
            <Trophy className="w-3.5 h-3.5 text-[#16A34A]" />
            <span>LVL {level}</span>
          </div>
          <div className="bg-white border border-[#E5E7EB] text-gray-800 px-3.5 py-1.5 rounded-xl font-semibold flex items-center space-x-1.5 shadow-sm">
            <span>{xp} XP</span>
          </div>
          <div className="bg-green-50 text-green-800 border border-green-200 px-3.5 py-1.5 rounded-xl font-semibold flex items-center space-x-1.5 shadow-sm">
            <span>🔥 {streak} Day Streak</span>
          </div>
        </div>
      </div>

      {/* Main bento highlights grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Card 1: Match Score Gauge */}
        <div className="md:col-span-4 bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-6">
          <div>
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Overall Match Index</span>
            <h3 className="text-4xl font-extrabold text-[#16A34A] mt-1">94.2%</h3>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#16A34A] w-[94.2%]"></div>
          </div>
          <p className="text-xs text-gray-400 font-normal leading-relaxed">
            You are securely matched with active vacancy pools for our priority targeted sector: <strong>{targetRole || "Software Systems Architect"}</strong>. Refer to Gaps dashboard to perfect matches.
          </p>
        </div>

        {/* Card 2: Market Alignments */}
        <div className="md:col-span-5 bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex justify-between items-center pb-2">
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Dynamic Competency Alignments</span>
            <span className="text-[9px] bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-bold">Active</span>
          </div>

          <div className="space-y-3 flex-1">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-600 font-medium">TypeScript Design Patterns</span>
              <span className="text-[9px] bg-[#16A34A] text-white px-2 py-0.5 rounded font-bold uppercase tracking-wide">Mastered</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-600 font-medium">PostgreSQL Tuning</span>
              <span className="text-[9px] bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded font-bold uppercase tracking-wide">80% proficiency</span>
            </div>
            <div className="flex justify-between items-center text-xs text-gray-400">
              <span className="font-normal">Docker Containerization</span>
              <span className="text-[9px] bg-red-105 text-red-800 px-2 py-0.5 rounded font-bold uppercase tracking-wide flex items-center space-x-1 font-sans">
                <AlertTriangle className="w-3 h-3 text-red-500" />
                <span>Gap Detected</span>
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
            <span className="text-[11px] text-gray-405">Skill sync updated recently</span>
            <button
              onClick={() => onNavigateTab("skills")}
              className="text-xs text-[#16A34A] font-bold hover:underline flex items-center space-x-0.5"
            >
              <span>Explore All Gaps</span>
              <ChevronRight className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>

        {/* Card 3: Metrics summary */}
        <div className="md:col-span-3 space-y-6">
          <div className="bg-[#111827] text-white rounded-2xl p-6 shadow-md flex flex-col justify-between space-y-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest pl-0.5">Resume ATS score</span>
              <div className="text-3xl font-extrabold text-white mt-1">88<span className="text-xs text-gray-400">/100</span></div>
            </div>
            <p className="text-[10px] text-gray-400 font-normal leading-relaxed">
              +12 points acquired since last action word bullet-points re-optimization scans.
            </p>
          </div>

          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Kanban Pipeline</span>
              <div className="text-2xl font-extrabold text-black mt-1">5 Active Jobs</div>
            </div>
            <div className="flex space-x-1.5 pt-2">
              <div className="h-1.5 flex-1 bg-[#16A34A] rounded-full" />
              <div className="h-1.5 flex-1 bg-[#16A34A] rounded-full" />
              <div className="h-1.5 flex-1 bg-[#16A34A] rounded-full" />
              <div className="h-1.5 flex-1 bg-yellow-500 rounded-full" />
              <div className="h-1.5 flex-1 bg-gray-200 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* AI Strategical Actions Recommendations */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm space-y-5">
        <h4 className="font-bold text-black text-sm uppercase tracking-wide flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-[#16A34A] animate-pulse" />
          <span>Continuous AI Strategic Recommendations</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {suggestions.map((s, idx) => (
            <div
              key={idx}
              className="p-4 border border-gray-100 rounded-xl hover:border-green-600 transition-all flex justify-between items-center space-x-4 bg-gray-50/50 shadow-xs"
            >
              <div className="space-y-1.5 min-w-0">
                <span className="text-[9px] font-bold text-[#16A34A] font-mono tracking-widest uppercase block">ACTION {idx + 1}</span>
                <p className="text-xs text-gray-700 font-medium font-serif leading-relaxed line-clamp-2">"{s.text}"</p>
              </div>

              <button
                onClick={() => onNavigateTab(s.tab)}
                className="px-3 py-1.5 bg-[#111827] text-white hover:bg-black font-semibold text-[10px] rounded hover:shadow-xs transition-shadow flex-shrink-0"
              >
                {s.action}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
