import React, { useState, FormEvent } from "react";
import { FileText, Shield, ArrowRight, RefreshCw, CheckCircle2, AlertCircle, HelpCircle, Flame } from "lucide-react";
import { ResumeReport } from "../types";

interface ResumeAnalyzerProps {
  onAnalyze: (text: string, role: string) => Promise<any>;
  initialReport?: ResumeReport | null;
  initialText?: string;
}

export default function ResumeAnalyzer({ onAnalyze, initialReport, initialText = "" }: ResumeAnalyzerProps) {
  const [resumeText, setResumeText] = useState(initialText);
  const [targetRole, setTargetRole] = useState("Software Systems Architect");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<ResumeReport | null>(initialReport || null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!resumeText.trim()) {
      setError("Please paste or load your resume content first.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await onAnalyze(resumeText, targetRole);
      setReport(data);
    } catch (err: any) {
      console.error(err);
      setError("Failed to run resume assessment. Let's fallback to simulations.");
    } finally {
      setLoading(false);
    }
  };

  const handlePrepopulate = () => {
    setResumeText(`David Vance - Senior Application Programmer
dvance@career.com | (555) 234-5678

PROFESSIONAL SUMMARY
Dynamic front-end developer with experience in HTML, CSS, JavaScript, and basic React components. Enthusiastic about implementing features and fixing frontend interface bugs.

EXPERIENCE
Systems Coder at CloudSpace Solutions (2023 - Present)
- Responsible for writing CSS and making pages responsive on tablets.
- Cleared up backlog of styling reports by working overtime.
- Assisted backend team with basic migrations.

SKILLS
HTML5, CSS3, JavaScript ES6, React (basic), Git, Scrum`);
    setTargetRole("Senior UX frontend Architect");
  };

  return (
    <div className="space-y-8 animate-fade-in text-[#111827]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-black">AI Resume & ATS Parser</h2>
          <p className="text-sm text-gray-500">Scan layout parameters, grade metrics, and map keywords against modern companies.</p>
        </div>
        <button
          onClick={handlePrepopulate}
          className="text-xs bg-white text-[#16A34A] border border-[#E5E7EB] hover:bg-gray-50 px-3 py-1.5 rounded-lg font-medium shadow-sm"
        >
          Populate Professional Sample CV
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left column: Paste & configure */}
        <div className="lg:col-span-5 bg-white border border-[#E5E7EB] rounded-2xl p-6 space-y-6 shadow-sm">
          <h3 className="text-base font-bold text-black flex items-center space-x-2">
            <FileText className="w-5 h-5 text-[#16A34A]" />
            <span>Developer Resume Details</span>
          </h3>

          <form onSubmit={handleAnalyze} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Target Professional Role
              </label>
              <input
                type="text"
                required
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Lead React Developer"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-600 bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Copy/Paste Resume Text
              </label>
              <textarea
                required
                rows={12}
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste the raw text values of your professional resume, including education, experience bullets, and skills list..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs font-mono focus:outline-none focus:border-green-600 bg-gray-50 leading-relaxed"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600 flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#111827] hover:bg-black disabled:bg-gray-400 text-white font-semibold rounded-xl text-sm transition-all duration-150 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-[#16A34A]" />
                  <span>Parsing credentials data...</span>
                </>
              ) : (
                <>
                  <span>Analyze ATS Compatibility</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right column: Results dashboard */}
        <div className="lg:col-span-7 space-y-6">
          {report ? (
            <div className="space-y-6 animate-slide-up">
              {/* Score card indicators */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-400">ATS Match Index</span>
                    <h3 className="text-4xl font-extrabold text-[#16A34A] mt-1">{report.atsScore}%</h3>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden mt-4">
                    <div className="h-full bg-[#16A34A]" style={{ width: `${report.atsScore}%` }}></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-3 font-medium">Derived from matching candidate experience text against targeted industry criteria keywords.</p>
                </div>

                <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Draft Value Grade</span>
                    <h3 className="text-4xl font-extrabold text-black mt-1">{report.score}/100</h3>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden mt-4">
                    <div className="h-full bg-black" style={{ width: `${report.score}%` }}></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-3 font-medium">Integrated metrics analyzing weak structure density and action verb density ({report.actionVerbsCount} items).</p>
                </div>
              </div>

              {/* ATS checklist */}
              <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm">
                <h4 className="font-bold text-black border-b border-gray-100 pb-3 mb-4 text-sm uppercase tracking-wide">Automated System Audit Checklist</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {report.atsChecklist.map((item, i) => (
                    <div key={i} className="flex items-center justify-between border border-gray-100 p-3 rounded-xl bg-gray-50">
                      <div className="flex items-center space-x-2 text-xs font-semibold text-gray-700">
                        {item.passed ? (
                          <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-amber-500" />
                        )}
                        <span>{item.name}</span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.passed ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-800"}`}>
                        {item.score}/100
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Missing keywords tag clusters */}
              <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm">
                <h4 className="font-bold text-black border-b border-gray-100 pb-3 mb-4 text-sm flex items-center space-x-2 uppercase tracking-wide">
                  <Flame className="w-4 h-4 text-red-500 animate-pulse" />
                  <span>Missing Crucial CV Keywords</span>
                </h4>
                <p className="text-xs text-gray-500 mb-4">Adding these specific keywords to your CV will prevent automatic keyword bypass failures in recruitment software:</p>
                <div className="flex flex-wrap gap-2">
                  {report.missingKeywords.map((tag, i) => (
                    <span key={i} className="text-xs font-mono font-semibold bg-gray-100 text-gray-800 border border-gray-200 px-3 py-1.5 rounded-lg select-none">
                      + {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Weak sections & Improvements */}
              <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm space-y-4">
                <h4 className="font-bold text-black text-sm uppercase tracking-wide">Targeted Area Deficiencies</h4>
                
                <div className="space-y-2">
                  {report.weakSections.map((item, i) => (
                    <div key={i} className="text-xs font-medium bg-red-50/50 border border-red-100 text-red-800 px-3 py-2 rounded-lg flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                      <span><strong>Deficiency:</strong> {item}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-100 pt-4 space-y-2">
                  <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Strategic Recommendations</h5>
                  {report.improvements.map((text, i) => (
                    <p key={i} className="text-xs text-gray-600 leading-relaxed pl-4 relative">
                      <span className="absolute left-0 text-[#16A34A] font-bold">&bull;</span>
                      {text}
                    </p>
                  ))}
                </div>
              </div>

              {/* Bullet points rewrite comparison */}
              <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm">
                <h4 className="font-bold text-black border-b border-gray-100 pb-3 mb-4 text-sm uppercase tracking-wide">Action-Oriented Bullet point Optimizations</h4>
                <div className="space-y-4">
                  {report.bulletRewrites.map((item, i) => (
                    <div key={i} className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                      <div className="bg-gray-50/80 px-4 py-2 border-b border-gray-100 flex justify-between items-center text-[10px] font-mono text-gray-400">
                        <span>SUGGESTION OPTIMIZATION {i + 1}</span>
                        <span className="font-semibold text-green-600">Active verb: {item.verb}</span>
                      </div>
                      <div className="p-4 space-y-3">
                        <div className="space-y-1">
                          <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Before (Low Impact)</span>
                          <p className="text-xs text-gray-500 line-through italic">{item.original}</p>
                        </div>
                        <div className="space-y-1 border-t border-dashed border-gray-100 pt-2">
                          <span className="text-[10px] uppercase font-bold text-[#16A34A] tracking-wider">After (High Impact Metric)</span>
                          <p className="text-xs text-black font-medium">{item.improved}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => handleAnalyze()}
                  disabled={loading}
                  className="px-6 py-3 bg-[#111827] text-white hover:bg-black transition-colors rounded-xl font-medium text-xs flex items-center space-x-2"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  <span>One-click Regenerate Analysis</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-12 text-center flex flex-col items-center justify-center h-full min-h-[350px]">
              <div className="w-16 h-16 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-300 mb-4 shadow-sm">
                <Shield className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-black">Awaiting Analytical Scan</h4>
              <p className="text-xs text-gray-500 max-w-sm mt-1 leading-relaxed">
                Paste your current resume content or populate the sample template to run the structural metrics score audits.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
