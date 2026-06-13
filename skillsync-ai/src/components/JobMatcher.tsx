import { useState, useMemo } from "react";
import { Search, Briefcase, Filter, Info, CheckCircle2, AlertTriangle, ShieldAlert, Check } from "lucide-react";
import { Job } from "../types";

export default function JobMatcher({ userSkills }: { userSkills: string[] }) {
  const [filterRemote, setFilterRemote] = useState<string>("All");
  const [filterExp, setFilterExp] = useState<string>("All");
  const [filterSponsorship, setFilterSponsorship] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);

  // Robust set of static jobs matching listed profile rules. They'll react dynamically to whatever user has in their skills state!
  const allJobs = useMemo(() => {
    const list: Job[] = [
      {
        id: "job_1",
        title: "Senior UX frontend Engineer",
        company: "Stripe",
        location: "San Francisco, CA",
        type: "Remote",
        experienceLevel: "Senior",
        salaryRange: "$165,000 - $190,000",
        compatibility: 94,
        description: "Orchestrate our modern payments developer layout components, focusing on speed metrics and fluid microinteractions.",
        requirements: ["React", "TypeScript", "Tailwind CSS", "RESTful Pipelines"],
        missingSkills: [],
        sponsorship: true,
        emergingField: true
      },
      {
        id: "job_2",
        title: "Cloud Infrastructure Architect",
        company: "Vercel",
        location: "Remote / Global",
        type: "Remote",
        experienceLevel: "Senior",
        salaryRange: "$150,000 - $185,000",
        compatibility: 72,
        description: "Deploy edge virtualization nodes and maintain system reliability across multi-region edge caches.",
        requirements: ["Docker Containerization", "CI/CD & Cloud Deploy", "TypeScript Core", "WASM Core"],
        missingSkills: ["Docker Containerization", "CI/CD & Cloud Deploy"],
        sponsorship: true,
        emergingField: true
      },
      {
        id: "job_3",
        title: "Senior Frontend Developer",
        company: "Meta Platforms",
        location: "Menlo Park, CA",
        type: "Hybrid",
        experienceLevel: "Senior",
        salaryRange: "$170,000 - $210,000",
        compatibility: 88,
        description: "Refactor core client layout rendering files, ensuring compatibility with massive data queries.",
        requirements: ["React", "TypeScript Core", "React State & Performance", "RESTful Pipelines"],
        missingSkills: ["React State & Performance"],
        sponsorship: true,
        emergingField: false
      },
      {
        id: "job_4",
        title: "Junior fullstack Coder",
        company: "DeltaCorp",
        location: "Austin, TX",
        type: "Onsite",
        experienceLevel: "Junior",
        salaryRange: "$90,000 - $110,000",
        compatibility: 90,
        description: "Provide quick maintenance for web applications and handle database table migrations.",
        requirements: ["React", "TypeScript Core", "SQL Datastores & Tuning"],
        missingSkills: [],
        sponsorship: false,
        emergingField: false
      },
      {
        id: "job_5",
        title: "Web Assembly Prototyper",
        company: "Cloudflare",
        location: "Austin, TX",
        type: "Remote",
        experienceLevel: "Senior",
        salaryRange: "$180,000 - $220,000",
        compatibility: 55,
        description: "Prototype high frequency network packet processing directly in browser engines.",
        requirements: ["WASM Core", "Rust", "WebWorkers", "TypeScript Core"],
        missingSkills: ["WASM Core", "Rust", "WebWorkers"],
        sponsorship: true,
        emergingField: true
      },
      {
        id: "job_6",
        title: "Systems Intern",
        company: "GitHub",
        location: "Seattle, WA",
        type: "Remote",
        experienceLevel: "Internship",
        salaryRange: "$45 - $60 / hr",
        compatibility: 82,
        description: "Assist engineering teams in writing robust, fast status checks and unit suite validations.",
        requirements: ["React", "TypeScript Core", "GitHub Actions"],
        missingSkills: [],
        sponsorship: false,
        emergingField: false
      }
    ];

    // Compute compatibility scores dynamically if user possesses skills
    return list.map(job => {
      const matchCount = job.requirements.filter(req => 
        userSkills.some(skill => skill.toLowerCase().includes(req.toLowerCase()) || req.toLowerCase().includes(skill.toLowerCase()))
      ).length;
      const pct = Math.round((matchCount / job.requirements.length) * 100);
      
      const computedScore = pct === 0 ? Math.floor(Math.random() * 20) + 30 : Math.min(pct, 100);
      const generatedMissing = job.requirements.filter(req => 
        !userSkills.some(skill => skill.toLowerCase().includes(req.toLowerCase()) || req.toLowerCase().includes(skill.toLowerCase()))
      );

      return {
        ...job,
        compatibility: computedScore,
        missingSkills: generatedMissing
      };
    });
  }, [userSkills]);

  // Apply filters
  const filteredJobs = useMemo(() => {
    return allJobs.filter(job => {
      if (filterRemote !== "All" && job.type !== filterRemote) return false;
      if (filterExp !== "All" && job.experienceLevel !== filterExp) return false;
      if (filterSponsorship && !job.sponsorship) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return (
          job.title.toLowerCase().includes(query) ||
          job.company.toLowerCase().includes(query) ||
          job.requirements.some(r => r.toLowerCase().includes(query))
        );
      }
      return true;
    }).sort((a, b) => b.compatibility - a.compatibility);
  }, [allJobs, filterRemote, filterExp, filterSponsorship, searchQuery]);

  const handleApply = (id: string) => {
    if (appliedJobs.includes(id)) return;
    setAppliedJobs((prev) => [...prev, id]);
  };

  return (
    <div className="space-y-8 animate-fade-in text-[#111827]">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-black">Smart Job Compatibility Node</h2>
        <p className="text-sm text-gray-500">Compare listed requirements, evaluate visa criteria, and map out probability percentages.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Filters Side Panel */}
        <div className="lg:col-span-3 bg-white border border-[#E5E7EB] rounded-2xl p-6 space-y-6 shadow-sm">
          <div className="flex items-center space-x-2 border-b border-gray-100 pb-3">
            <Filter className="w-5 h-5 text-[#16A34A]" />
            <span className="font-bold text-sm text-black uppercase tracking-wider">Configure Filter Nodes</span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Arrangement Format</label>
              <select
                value={filterRemote}
                onChange={(e) => setFilterRemote(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#16A34A]"
              >
                <option value="All">All Formats</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Onsite">Onsite</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Seniority Framework</label>
              <select
                value={filterExp}
                onChange={(e) => setFilterExp(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#16A34A]"
              >
                <option value="All">All Categories</option>
                <option value="Internship">Internship</option>
                <option value="Junior">Junior</option>
                <option value="Senior">Senior</option>
              </select>
            </div>

            <div className="pt-2 border-t border-gray-100">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filterSponsorship}
                  onChange={(e) => setFilterSponsorship(e.target.checked)}
                  className="w-4 h-4 rounded text-[#16A34A] focus:ring-[#16A34A] accent-[#16A34A]"
                />
                <span className="text-xs font-semibold text-gray-600">Visa Sponsorship</span>
              </label>
            </div>
          </div>

          {/* Active Skills profile tags summary */}
          <div className="pt-4 border-t border-gray-100 space-y-2">
            <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active Profile Context:</span>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {userSkills.map((tag, i) => (
                <span key={i} className="text-[10px] font-medium bg-green-50 text-green-700 border border-green-100 px-2.5 py-0.5 rounded-md">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Jobs Feed Area */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-4 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search companies, systems roles, or stack requirements..."
              className="w-full pl-11 pr-4 py-3 bg-white border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:border-green-600 shadow-sm text-black"
            />
          </div>

          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
            {filteredJobs.length === 0 ? (
              <div className="bg-white border border-[#E5E7EB] rounded-2xl p-8 text-center text-gray-450 italic text-xs">
                No active requirements matched specified filter constraints. Try expanding criteria.
              </div>
            ) : (
              filteredJobs.map((job) => (
                <div
                  key={job.id}
                  onClick={() => setSelectedJob(job)}
                  className={`p-5 bg-white border rounded-2xl cursor-pointer hover:border-[#16A34A] hover:bg-gray-50/40 transition-all flex justify-between items-start space-x-4 shadow-sm ${selectedJob?.id === job.id ? "border-[#16A34A] bg-green-50/10" : "border-[#E5E7EB]"}`}
                >
                  <div className="space-y-2 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-gray-400 uppercase">{job.company}</span>
                      {job.emergingField && (
                        <span className="text-[9px] bg-red-100 text-red-800 font-extrabold uppercase px-1.5 py-0.5 rounded-full">Emerging Scope</span>
                      )}
                    </div>
                    <h4 className="font-bold text-black text-sm truncate">{job.title}</h4>
                    <p className="text-xs text-gray-500 truncate">{job.location} &bull; {job.salaryRange}</p>
                    
                    <div className="flex flex-wrap gap-1 pt-1">
                      {job.requirements.slice(0, 3).map((r, idx) => (
                        <span key={idx} className="text-[10px] font-mono bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                          {r}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0 flex flex-col items-end justify-between h-[100px]">
                    <div className="text-xs font-semibold text-white bg-[#16A34A] px-2.5 py-1 rounded-full shadow-sm">
                      {job.compatibility}% match
                    </div>
                    <span className="text-[10px] font-mono text-gray-400 font-semibold">{job.type}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Selected Job Detail View */}
        <div className="lg:col-span-4">
          {selectedJob ? (
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm space-y-6 animate-slide-up">
              <div className="border-b border-gray-100 pb-4 space-y-2">
                <span className="text-xs text-[#16A34A] font-bold tracking-widest uppercase">{selectedJob.company}</span>
                <h3 className="text-lg font-bold text-black">{selectedJob.title}</h3>
                <div className="flex flex-wrap gap-2 text-xs text-gray-400">
                  <span>{selectedJob.location}</span>
                  <span>&bull;</span>
                  <span>{selectedJob.type}</span>
                  <span>&bull;</span>
                  <span>{selectedJob.experienceLevel} Tier</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-gray-400">Position Overview</span>
                  <p className="text-xs text-gray-600 leading-relaxed font-normal">{selectedJob.description}</p>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold text-gray-400">Compliance & Compensation</span>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                      <span className="block text-[10px] text-gray-400 font-medium">Est Salary range</span>
                      <strong className="text-black text-xs">{selectedJob.salaryRange}</strong>
                    </div>
                    <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                      <span className="block text-[10px] text-gray-400 font-medium">Visa Sponsorship</span>
                      <strong className="text-black text-xs">{selectedJob.sponsorship ? "Fully Supported" : "Local Residents only"}</strong>
                    </div>
                  </div>
                </div>

                {/* Skill Overlaps & Gaps */}
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold text-gray-400">Skill overlap checks ({selectedJob.requirements.length - selectedJob.missingSkills.length} of {selectedJob.requirements.length})</span>
                  <div className="space-y-1.5">
                    {selectedJob.requirements.map((req, idx) => {
                      const isMissing = selectedJob.missingSkills.includes(req);
                      return (
                        <div key={idx} className="flex justify-between items-center text-xs">
                          <span className="text-gray-700 font-medium">{req}</span>
                          {isMissing ? (
                            <span className="text-[10px] bg-red-50 text-red-750 px-2 py-0.5 rounded border border-red-100 flex items-center space-x-1 font-semibold">
                              <ShieldAlert className="w-3 h-3 text-red-500" />
                              <span>Missing</span>
                            </span>
                          ) : (
                            <span className="text-[10px] bg-green-50 text-green-700 px-2 py-0.5 rounded border border-green-100 flex items-center space-x-1 font-semibold">
                              <Check className="w-3 h-3 text-[#16A34A]" />
                              <span>Overlap matches</span>
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {selectedJob.missingSkills.length > 0 && (
                  <div className="p-3 bg-red-50/50 border border-red-100 rounded-xl flex items-start space-x-2">
                    <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h5 className="text-xs font-bold text-red-800">Gap detected</h5>
                      <p className="text-[11px] text-red-650 leading-relaxed mt-0.5">
                        Your current profile requires updating: <strong>{selectedJob.missingSkills.join(", ")}</strong> prior to filing formal reviews. Use the Radar block to sync learning steps.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-gray-100">
                <button
                  onClick={() => handleApply(selectedJob.id)}
                  disabled={appliedJobs.includes(selectedJob.id)}
                  className="w-full py-3 bg-[#111827] hover:bg-black text-white disabled:bg-gray-200 disabled:text-gray-400 transition-colors font-semibold rounded-xl text-xs uppercase tracking-wider text-center"
                >
                  {appliedJobs.includes(selectedJob.id) ? "Applied Successfully" : "Apply with synchronized profile"}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 text-center text-xs text-gray-500 h-full min-h-[300px] flex flex-col items-center justify-center">
              <Briefcase className="w-10 h-10 text-gray-300 mb-3" />
              <span>Select any career post adjacent to evaluate specific details.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
