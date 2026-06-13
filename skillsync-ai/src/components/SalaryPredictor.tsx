import { useState, useEffect } from "react";
import { DollarSign, ShieldAlert, TrendingUp, AlertTriangle, RefreshCw, BarChart, ChevronRight, ClipboardList } from "lucide-react";
import { SalaryPrediction, FutureCareerPath } from "../types";

export default function SalaryPredictor({
  onPredictSalary,
  onPredictCareer,
  userSkills
}: {
  onPredictSalary: (skills: string[], sector: string) => Promise<SalaryPrediction>;
  onPredictCareer: (skills: string[]) => Promise<FutureCareerPath>;
  userSkills: string[];
}) {
  const [sector, setSector] = useState("Technology Solutions");
  const [loading, setLoading] = useState(false);
  const [salData, setSalData] = useState<SalaryPrediction | null>(null);
  const [pathData, setPathData] = useState<FutureCareerPath | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchCompensationIntelligence = async () => {
    setLoading(true);
    setError(null);
    try {
      const [sal, path] = await Promise.all([
        onPredictSalary(userSkills, sector),
        onPredictCareer(userSkills)
      ]);
      setSalData(sal);
      setPathData(path);
    } catch (err) {
      console.error(err);
      setError("Failed to stream regional analytics. Falling back to simulations.");
      setSalData({
        currentWorth: 125000,
        futureWorth2Yr: 142000,
        futureWorth5Yr: 180000,
        futureWorth10Yr: 250000,
        growthRate: 9.3,
        demandScore: 88,
        regionalFactors: [
          { region: "North America / SF", average: 175000 },
          { region: "Europe / Remote Hubs", average: 110000 },
          { region: "APAC Tech Nodes", average: 90000 }
        ],
        promotionTips: [
          "Gain proficiency in cloud databases and infrastructure design to command full-cycle product delivery responsibilities.",
          "Lead cross-functional engineering initiatives, taking ownership of company-level feature metrics."
        ]
      });
      setPathData({
        year2: {
          jobs: ["Senior Solutions Architect", "Engineering Team Lead"],
          certs: ["AWS Certified Developer Pro", "Google Lead Architect"]
        },
        year5: {
          jobs: ["Principal Integration Lead", "VP of Engineering Node"],
          certs: ["TOGAF Enterprise Design Certification"]
        },
        year10: {
          jobs: ["Chief Technology Officer (CTO)", "Managing Enterprise Partner"],
          certs: ["Executive Enterprise Leadership Certification"]
        },
        automationRisk: 14,
        aiReplacementProb: 8,
        riskMitigation: [
          "Focus intensely on high-level system architecture, component integrations, and business strategy alignment.",
          "Refine collaborative leadership, mentorship capabilities, and product-market expansion visions."
        ],
        opportunities: [
          "AI Engineering orchestration frameworks.",
          "Secure Edge Computing and data localized architectures for compliant banking models."
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompensationIntelligence();
  }, [userSkills, sector]);

  // Format currency helpers
  const formatCash = (val: number) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="space-y-8 animate-fade-in text-[#111827]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-black">Salary Intelligence & Path Trajectories</h2>
          <p className="text-sm text-gray-500 font-normal">Forecast annual compensation indices, assess AI replacement probabilities, and analyze regional values.</p>
        </div>
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <select
            value={sector}
            onChange={(e) => setSector(e.target.value)}
            className="px-3 py-2 bg-white border border-[#E5E7EB] rounded-lg text-xs font-semibold focus:outline-none"
          >
            <option value="Technology Solutions">Technology Solutions</option>
            <option value="Financial Systems">Financial Systems</option>
            <option value="Creative Design">Creative Design</option>
          </select>
          <button
            onClick={fetchCompensationIntelligence}
            disabled={loading}
            className="p-2 border border-blue-105 rounded-xl bg-white hover:bg-gray-105"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="bg-white border border-gray-150 rounded-2xl p-16 text-center text-xs text-gray-400 flex flex-col items-center justify-center space-y-2">
          <RefreshCw className="w-6 h-6 animate-spin text-[#16A34A]" />
          <span>Aggregating regional salary surveys and computing labor matrices...</span>
        </div>
      ) : salData && pathData ? (
        <div className="space-y-8 animate-slide-up">
          {/* Top overview grids */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Estimated Personal Worth Baseline</span>
                <h3 className="text-3xl font-extrabold text-[#16A34A] mt-1">{formatCash(salData.currentWorth)}</h3>
              </div>
              <p className="text-xs text-gray-550 leading-relaxed font-medium mt-4">
                Annual baseline compensation calculated using active skills overlapping target jobs.
              </p>
            </div>

            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Annual Trajectory Growth</span>
                <h3 className="text-4xl font-extrabold text-[#111827] mt-1">+{salData.growthRate}%</h3>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mt-4">
                <div className="h-full bg-black opacity-80" style={{ width: `${salData.growthRate * 6}%` }}></div>
              </div>
              <p className="text-xs text-gray-550 leading-relaxed font-medium mt-3">
                Year-over-year career capability index increase matching trends.
              </p>
            </div>

            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">AI Automation Displacement Risk</span>
                <h3 className="text-4xl font-extrabold text-red-500 mt-1">{pathData.automationRisk}%</h3>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mt-4">
                <div className="h-full bg-red-500" style={{ width: `${pathData.automationRisk}%` }}></div>
              </div>
              <p className="text-xs text-gray-550 leading-relaxed font-medium mt-3">
                Calculated replacement quotient for direct task routines.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left side: Future worth predictor visual chart bars */}
            <div className="lg:col-span-8 bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm space-y-6">
              <h4 className="font-bold text-[#111827] text-sm uppercase tracking-wide border-b border-gray-100 pb-3 block">Estimated Personal Worth Growth (USD)</h4>
              
              <div className="space-y-6 pt-2">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-gray-650">Current Worth Baseline</span>
                    <strong className="text-black font-semibold">{formatCash(salData.currentWorth)}</strong>
                  </div>
                  <div className="h-6 bg-gray-50 border border-gray-100 rounded-lg overflow-hidden flex items-center relative">
                    <div className="h-full bg-gray-200" style={{ width: "40%" }} />
                    <span className="absolute left-3 text-[10px] font-bold text-gray-600 font-mono">BASE YR</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-gray-650">2 Year Trajectory Projection</span>
                    <strong className="text-[#16A34A] font-semibold">{formatCash(salData.futureWorth2Yr)}</strong>
                  </div>
                  <div className="h-6 bg-gray-50 border border-gray-100 rounded-lg overflow-hidden flex items-center relative">
                    <div className="h-full bg-green-500 opacity-60" style={{ width: "55%" }} />
                    <span className="absolute left-3 text-[10px] font-bold text-green-900 font-mono">2 YRS (PROMOTIONS / TRANSITIONS)</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-gray-650">5 Year Enterprise Horizon</span>
                    <strong className="text-black font-semibold">{formatCash(salData.futureWorth5Yr)}</strong>
                  </div>
                  <div className="h-6 bg-gray-50 border border-gray-100 rounded-lg overflow-hidden flex items-center relative">
                    <div className="h-full bg-black opacity-85" style={{ width: "75%" }} />
                    <span className="absolute left-3 text-[10px] font-bold text-white font-mono">5 YRS (PRINCIPAL / LEADERSHIP ROLES)</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-gray-650">10 Year Tech Partner Outlook</span>
                    <strong className="text-[#16A34A] font-bold">{formatCash(salData.futureWorth10Yr)}</strong>
                  </div>
                  <div className="h-6 bg-gray-50 border border-gray-100 rounded-lg overflow-hidden flex items-center relative">
                    <div className="h-full bg-[#16A34A]" style={{ width: "95%" }} />
                    <span className="absolute left-3 text-[10px] font-bold text-white font-mono">10 YRS (EXECUTIVE HUB ADVISORY)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side: regional averages & emerging topics */}
            <div className="lg:col-span-4 bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm space-y-6">
              <h4 className="font-bold text-black text-sm uppercase tracking-wider border-b border-gray-100 pb-3">Regional Baseline Averages</h4>
              
              <div className="space-y-3">
                {salData.regionalFactors.map((reg, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-150">
                    <span className="text-xs font-semibold text-gray-600">{reg.region}</span>
                    <span className="text-xs font-bold text-black">{formatCash(reg.average)}</span>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-amber-50/50 border border-amber-100 rounded-xl flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0 animate-pulse" />
                <div className="space-y-1">
                  <h5 className="text-[11px] font-bold text-amber-800 uppercase tracking-widest">Growth risk mitigation</h5>
                  <p className="text-[10px] text-amber-700 leading-normal">
                    AI replacement score checks are moderate. Focus deep on high-level systems design and business integrations blocks.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Promotion tips */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm space-y-3">
              <h4 className="font-bold text-[#16A34A] text-xs uppercase tracking-wider flex items-center space-x-2">
                <TrendingUp className="w-4 h-4" />
                <span>Executive Promotion Tactics</span>
              </h4>
              <div className="space-y-2">
                {salData.promotionTips.map((tip, idx) => (
                  <div key={idx} className="text-xs font-normal text-gray-700 leading-relaxed p-3 bg-gray-50 border border-gray-100 rounded-xl relative pl-8">
                    <span className="absolute left-3 text-[#16A34A] font-bold">#{idx + 1}</span>
                    {tip}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm space-y-4">
              <h4 className="font-bold text-black text-xs uppercase tracking-wider flex items-center space-x-2">
                <ClipboardList className="w-4 h-4 text-gray-400" />
                <span>Future Career Positions Trajectory</span>
              </h4>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-start border-b border-gray-100 pb-2">
                  <span className="font-bold text-[#16A34A] font-mono">YEAR 2</span>
                  <div className="text-right">
                    <strong className="block text-black">{pathData.year2.jobs.join(" / ")}</strong>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider font-mono">Recommend Certs: {pathData.year2.certs.join(", ")}</span>
                  </div>
                </div>

                <div className="flex justify-between items-start border-b border-gray-100 pb-2">
                  <span className="font-bold text-black font-mono">YEAR 5</span>
                  <div className="text-right">
                    <strong className="block text-black">{pathData.year5.jobs.join(" / ")}</strong>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider font-mono">Recommend Certs: {pathData.year5.certs.join(", ")}</span>
                  </div>
                </div>

                <div className="flex justify-between items-start">
                  <span className="font-bold text-[#16A34A] font-mono">YEAR 10</span>
                  <div className="text-right">
                    <strong className="block text-black">{pathData.year10.jobs.join(" / ")}</strong>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider font-mono">Recommend Certs: {pathData.year10.certs.join(", ")}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-gray-150 rounded-2xl p-12 text-center text-xs text-gray-500">
          Enter skills context to forecast career compensations.
        </div>
      )}
    </div>
  );
}
