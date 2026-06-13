import React, { useState, FormEvent } from "react";
import { Sparkles, Terminal, RefreshCw, Layers, Calendar, ListTodo, Copy, Check } from "lucide-react";
import { PortfolioProject } from "../types";

export default function ProjectGenerator({
  onGenerateProject
}: {
  onGenerateProject: (goal: string, diff: string) => Promise<PortfolioProject>;
}) {
  const [goal, setGoal] = useState("Frontend Speed Systems");
  const [difficulty, setDifficulty] = useState<"Beginner" | "Intermediate" | "Advanced">("Advanced");
  const [loading, setLoading] = useState(false);
  const [project, setProject] = useState<PortfolioProject | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await onGenerateProject(goal, difficulty);
      setProject(data);
    } catch (err) {
      console.error(err);
      setError("AI generation paused. Displaying simulated project blueprints.");
      setProject({
        id: "proj_f612",
        name: "Subzero: Optimized Edge Analytical Dashboard",
        description: "A lightning-fast client-side dashboard utilizing WebAssembly to parse high-frequency network packets completely in-browser without server roundtrips.",
        techStack: ["TypeScript", "Rust", "WebAssembly", "ChartJS", "WebWorkers"],
        architecture: "WebWorkers offload processing into an independent parallel thread running compiled Rust. Raw binary telemetry packets undergo structural decompression instantly and post to a reactive React UI layer.",
        timeline: "3 Weeks",
        difficulty: "Advanced",
        folderStructure: `/src\n  /wasm-core\n    - src/lib.rs\n  /components\n    - PacketView.tsx\n    - AlertConsole.tsx\n  /workers\n    - parser.worker.ts`,
        presentationSlideTips: [
          "Explain clearly how WebWorkers solved main-thread UI stutter by establishing secondary render-loops.",
          "Quantify your performance savings: 'Achieved 60fps telemetry updating by passing ArrayBuffers directly without structured cloning fees.'"
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopyFolder = () => {
    if (!project) return;
    navigator.clipboard.writeText(project.folderStructure);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-fade-in text-[#111827]">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-black">AI Portfolio Project Synthesizer</h2>
        <p className="text-sm text-gray-500 font-normal">Generate custom tailored portfolio blueprints designed to instantly clear interview technical bar standards.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left config parameters */}
        <div className="lg:col-span-4 bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 border-b border-gray-100 pb-3">
            <Layers className="w-5 h-5 text-[#16A34A]" />
            <span className="font-bold text-sm uppercase tracking-wide">Target Project Milestones</span>
          </div>

          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Core Competency Focus</label>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-green-600"
              >
                <option value="Frontend Speed Systems">Frontend Speed Systems</option>
                <option value="High-Throughput Databases & SQL">High-Throughput Databases & SQL</option>
                <option value="Serverless microservices & Docker">Serverless microservices & Docker</option>
                <option value="AI Orchestration pipelines with RAG">AI Orchestration pipelines with RAG</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Architectural Complexity</label>
              <div className="grid grid-cols-3 gap-2">
                {(["Beginner", "Intermediate", "Advanced"] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setDifficulty(lvl)}
                    className={`py-2 border text-[11px] font-bold rounded-lg transition-all uppercase tracking-wide ${
                      difficulty === lvl
                        ? "border-black bg-[#111827] text-white"
                        : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#16A34A] hover:bg-[#15803D] text-white disabled:bg-gray-300 font-semibold rounded-xl text-xs uppercase tracking-widest transition-colors flex items-center justify-center space-x-1.5"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
                  <span>Synthesizing repository model...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-white animate-pulse" />
                  <span>Generate Code Blueprint</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right generated details blueprint */}
        <div className="lg:col-span-8">
          {project ? (
            <div className="space-y-6 animate-slide-up">
              {/* Header metrics summary */}
              <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">{project.difficulty} Level Portfolio Master</span>
                  <h3 className="text-xl font-bold text-black font-sans leading-tight">{project.name}</h3>
                </div>

                <div className="flex space-x-3 text-xs bg-gray-50 border border-gray-150 py-1.5 px-3 rounded-xl">
                  <Calendar className="w-4 h-4 text-[#16A34A] mt-0.5" />
                  <span className="font-semibold text-gray-700">Timeline: {project.timeline}</span>
                </div>
              </div>

              {/* Stack and descriptions */}
              <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Concept Abstract</span>
                  <p className="text-xs text-gray-600 leading-relaxed font-normal">{project.description}</p>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">Recommended Stack Integration</span>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {project.techStack.map((tech, idx) => (
                      <span key={idx} className="text-xs font-mono font-semibold bg-gray-100 text-gray-800 border border-gray-200 px-3 py-1 rounded-lg">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-3 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-gray-450 tracking-wider block">Structural Design Flow</span>
                  <p className="text-xs text-gray-650 leading-relaxed font-normal font-serif italic">"{project.architecture}"</p>
                </div>
              </div>

              {/* Subdirectory code layout ASCII */}
              <div className="bg-white border border-[#E5E7EB] rounded-2xl shadow-sm overflow-hidden border border-gray-250">
                <div className="px-5 py-3/5 border-b border-gray-100 bg-gray-50 flex justify-between items-center bg-transparent">
                  <div className="flex items-center space-x-2 text-xs font-mono text-gray-405">
                    <Terminal className="w-4 h-4 text-[#16A34A]" />
                    <span>Project File Directory Layout</span>
                  </div>
                  <button
                    onClick={handleCopyFolder}
                    className="p-1 px-3 border border-gray-200 rounded bg-white text-xs hover:bg-gray-50 transition-all font-medium text-gray-500 flex items-center space-x-1"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#16A34A]" />
                        <span>Copied ASCII Structure!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-gray-400" />
                        <span>Copy Structure</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="bg-[#111827] text-white p-5 font-mono text-xs leading-relaxed overflow-x-auto whitespace-pre">
                  {project.folderStructure}
                </div>
              </div>

              {/* Presentation tips */}
              <div className="bg-[#111827] text-white rounded-2xl p-6 shadow-md space-y-4">
                <h4 className="font-bold text-[#16A34A] text-xs uppercase tracking-wider">Interview Speech Highlight Slides Tips</h4>
                <div className="space-y-3">
                  {project.presentationSlideTips.map((tip, idx) => (
                    <div key={idx} className="flex items-start space-x-3 text-xs leading-relaxed text-gray-300">
                      <span className="font-bold text-[#16A34A] font-mono">0{idx + 1}.</span>
                      <p className="font-serif italic">"{tip}"</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-12 text-center text-xs text-gray-500 min-h-[350px] flex flex-col items-center justify-center">
              <Layers className="w-10 h-10 text-gray-300 mb-3 animate-pulse" />
              <span>Awaiting parameter settings to compile bespoke software architectures models.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
