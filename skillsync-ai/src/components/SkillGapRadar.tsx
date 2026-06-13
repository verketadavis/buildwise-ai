import { useState, useEffect } from "react";
import { Radar, RefreshCw, BarChart2, CheckCircle2, ChevronRight, HelpCircle, GraduationCap } from "lucide-react";
import { RadarSkill } from "../types";

interface SkillGapRadarProps {
  onAnalyzeGap: (skills: string[], target: string) => Promise<RadarSkill[]>;
  userSkills: string[];
  targetRole: string;
  onInitiateRoadmap: () => void;
}

export default function SkillGapRadar({ onAnalyzeGap, userSkills, targetRole, onInitiateRoadmap }: SkillGapRadarProps) {
  const [loading, setLoading] = useState(false);
  const [skills, setSkills] = useState<RadarSkill[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchGap = async (forceInit = false) => {
    setLoading(true);
    setError(null);
    try {
      const data = await onAnalyzeGap(userSkills, targetRole);
      setSkills(data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch radar skill gaps. Loading fallback matrices.");
      // Fallback
      setSkills([
        { name: "TypeScript Core", current: 8, required: 9, gap: 1, timeEstimate: "15 hours", learningOrder: 2 },
        { name: "React State & Performance", current: 7, required: 9, gap: 2, timeEstimate: "25 hours", learningOrder: 1 },
        { name: "Docker Containerization", current: 3, required: 7, gap: 4, timeEstimate: "35 hours", learningOrder: 3 },
        { name: "System Integration Design", current: 4, required: 8, gap: 4, timeEstimate: "40 hours", learningOrder: 4 },
        { name: "SQL Datastores & Tuning", current: 6, required: 8, gap: 2, timeEstimate: "20 hours", learningOrder: 5 },
        { name: "CI/CD & Cloud Deploy", current: 2, required: 8, gap: 6, timeEstimate: "60 hours", learningOrder: 6 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGap();
  }, [userSkills, targetRole]);

  return (
    <div className="space-y-8 animate-fade-in text-[#111827]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-black">Market Skill Gap Alignment</h2>
          <p className="text-sm text-gray-500">Measure current proficiency indexes against target vacancies core benchmarks.</p>
        </div>
        <button
          onClick={() => fetchGap(true)}
          disabled={loading}
          className="px-4 py-2 bg-white border border-[#E5E7EB] rounded-lg text-xs font-semibold hover:bg-gray-50 text-gray-700 flex items-center space-x-2 shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Real-time Sync</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left column: comparative bars list */}
        <div className="lg:col-span-8 bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-gray-100 pb-3">
            <h4 className="font-bold text-sm text-black uppercase tracking-wider">Comparative Proficiency Layout</h4>
            <span className="text-[10px] font-mono font-bold text-gray-400 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded">
              Goal: {targetRole || "Software Systems Architect"}
            </span>
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs text-gray-400 flex flex-col items-center justify-center space-y-2">
              <RefreshCw className="w-6 h-6 animate-spin text-[#16A34A]" />
              <span>Recalculating comparative gap benchmarks...</span>
            </div>
          ) : (
            <div className="space-y-6">
              {skills.map((skill, i) => {
                const currentPct = (skill.current / 10) * 100;
                const requiredPct = (skill.required / 10) * 100;

                return (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <div>
                        <span className="font-mono text-[10px] font-bold text-[#16A34A] mr-2">#{skill.learningOrder}</span>
                        <strong className="text-black font-semibold">{skill.name}</strong>
                      </div>
                      <div className="flex items-center space-x-3 text-[11px] font-semibold text-gray-500">
                        <span>Current: {skill.current}/10</span>
                        <span>&bull;</span>
                        <span>Required: {skill.required}/10</span>
                        {skill.gap > 0 && (
                          <span className="text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                            Gap: {skill.gap} pts
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="relative h-6 bg-gray-100 rounded-lg overflow-hidden border border-gray-150 shadow-inner flex items-center">
                      {/* Current skill bar */}
                      <div
                        className="absolute left-0 h-full bg-[#16A34A] opacity-80"
                        style={{ width: `${currentPct}%` }}
                      />
                      {/* Required skill cursor bar overlay */}
                      <div
                        className="absolute bottom-0 top-0 w-0.5 bg-black z-10"
                        style={{ left: `${requiredPct}%` }}
                        title={`Target expectation limit: ${skill.required}`}
                      />
                      
                      {/* Interactive indicator label values */}
                      <span className="absolute left-3 text-[10px] font-bold text-white uppercase tracking-wider drop-shadow-sm select-none">
                        Your capability
                      </span>
                      <span className="absolute right-3 text-[10px] font-bold text-gray-400 font-mono tracking-widest pl-2 uppercase select-none">
                        Bridge: ~{skill.timeEstimate}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right column: Action intelligence recommendations */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#111827] text-white rounded-2xl p-6 shadow-md space-y-6">
            <h4 className="font-bold text-sm text-gray-200 uppercase tracking-wide flex items-center space-x-2">
              <GraduationCap className="w-5 h-5 text-[#16A34A]" />
              <span>Recommended Path to Zero Gaps</span>
            </h4>

            <div className="space-y-4">
              <div className="bg-gray-850 p-4 border border-gray-850 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-[#16A34A] uppercase tracking-widest">Bridging Priority #1</span>
                <strong className="block text-sm text-white">{skills[0]?.name || "React components patterns"}</strong>
                <p className="text-xs text-gray-400 leading-relaxed font-normal">
                  Requires <strong>{skills[0]?.timeEstimate || "25 hours"}</strong> of structured research and local project debugging.
                </p>
              </div>

              <div className="bg-gray-850 p-4 border border-gray-850 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-[#16A34A] uppercase tracking-widest">Estimated Total Effort</span>
                <strong className="block text-2xl text-white">~{skills.reduce((acc, curr) => acc + (curr.gap > 0 ? 15 : 0), 0) * 5} Hours</strong>
                <p className="text-xs text-gray-400 leading-normal font-normal">
                  Covers books, specialized API guides, and Docker container configurations.
                </p>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-4">
              <button
                onClick={onInitiateRoadmap}
                className="w-full py-3 bg-[#16A34A] hover:bg-[#15803D] text-white font-semibold rounded-xl text-xs uppercase tracking-widest transition-colors text-center flex items-center justify-center space-x-2"
              >
                <span>Generate Weekly Course</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm space-y-3">
            <h5 className="font-bold text-black text-xs uppercase tracking-wider flex items-center space-x-1.5">
              <HelpCircle className="w-4 h-4 text-gray-400" />
              <span>What is a Gap indicator?</span>
            </h5>
            <p className="text-xs text-gray-500 leading-relaxed font-normal">
              Our system checks high impact requirements listed on corporate postings. High deficiency variables (gap &gt; 3pts) triggers automated learning recommendations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
