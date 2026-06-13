import { useState, useEffect } from "react";
import { BookOpen, RefreshCw, CheckCircle2, ChevronRight, HelpCircle, Award, PlayCircle, ExternalLink } from "lucide-react";
import { RoadmapWeek } from "../types";

interface LearningRoadmapProps {
  onGenerateRoadmap: (role: string) => Promise<RoadmapWeek[]>;
  targetRole: string;
  onAwardXP: (xp: number) => void;
}

export default function LearningRoadmap({ onGenerateRoadmap, targetRole, onAwardXP }: LearningRoadmapProps) {
  const [loading, setLoading] = useState(false);
  const [weeks, setWeeks] = useState<RoadmapWeek[]>([]);
  const [activeWeekIdx, setActiveWeekIdx] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const fetchRoadmap = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await onGenerateRoadmap(targetRole);
      setWeeks(data);
      setActiveWeekIdx(0);
    } catch (err) {
      console.error(err);
      setError("Failed to generate dynamic curriculum. Loading offline course guide.");
      setWeeks([
        {
          week: 1,
          objective: "Master core state structures and structural typing rules",
          resources: [
            { name: "TypeScript Deep Dive Guide", type: "Book", provider: "Basarat", duration: "10 hours", completed: false },
            { name: "Advanced React Patterns Course", type: "Course", provider: "Frontend Masters", duration: "8 hours", completed: false }
          ],
          exercise: "Refactor a core Javascript module to use highly structured, recursive generics and custom guard claims.",
          quiz: {
            question: "Which keyword allows checking if a dynamic value conforms to a custom Interface type structure?",
            options: ["instanceof", "typeof", "type guards / is custom parameter predicate", "implements"],
            answer: 2
          }
        },
        {
          week: 2,
          objective: "Deploy local cache architectures and optimize endpoints",
          resources: [
            { name: "Designing Data-Intensive Applications", type: "Book", provider: "O'Reilly", duration: "25 hours", completed: false },
            { name: "Redis Caching Best Practices", type: "Video", provider: "Redis University", duration: "4 hours", completed: false }
          ],
          exercise: "Configure a local Dockerized Redis instance and layer response caches onto standard Express handlers.",
          quiz: {
            question: "What is the primary benefit of a write-through caching model in transactional storage?",
            options: ["Lowest latency for updates", "Absolute storage consistency directly", "Zero memory consumption", "Automatic cache cluster replication"],
            answer: 1
          }
        },
        {
          week: 3,
          objective: "Containerize web architectures and orchestration configurations",
          resources: [
            { name: "Docker & Kubernetes Mastery", type: "Course", provider: "Udemy", duration: "14 hours", completed: false },
            { name: "Creating Production Dockerfiles", type: "Video", provider: "YouTube Tech", duration: "2 hours", completed: false }
          ],
          exercise: "Construct a multi-stage Dockerfile utilizing node-alpine to bundle code safely under 100MB.",
          quiz: {
            question: "Why should we prefer multi-stage builds when packaging server-side dependencies?",
            options: ["To maximize CPU performance", "To exclude compilation tools from final production images", "To enable real-time debugging dynamically", "To avoid writing yaml configs entirely"],
            answer: 1
          }
        },
        {
          week: 4,
          objective: "Architect CI/CD automation pipelines and test coverage flows",
          resources: [
            { name: "GitHub Actions Tutorial Guide", type: "Video", provider: "GitHub Devs", duration: "5 hours", completed: false },
            { name: "Project Blueprint Building", type: "Project", provider: "SkillSync Enterprise", duration: "16 hours", completed: false }
          ],
          exercise: "Implement standard status check workflows running test units on every pull-request submission.",
          quiz: {
            question: "What does the continuous integration metric 'Code Coverage' evaluate directly?",
            options: ["The speed of the production server startup", "The percentage of file pathways executed during test passes", "Security susceptibility coefficients", "Memory footprints"],
            answer: 1
          }
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmap();
  }, [targetRole]);

  const activeWeek = weeks[activeWeekIdx];

  const handleToggleResource = (resIdx: number) => {
    setWeeks((prev) => {
      const copy = [...prev];
      const res = copy[activeWeekIdx].resources[resIdx];
      res.completed = !res.completed;
      if (res.completed) {
        onAwardXP(15);
      } else {
        onAwardXP(-15);
      }
      return copy;
    });
  };

  const handleSelectQuizOption = (optIdx: number) => {
    setWeeks((prev) => {
      const copy = [...prev];
      copy[activeWeekIdx].quiz.selected = optIdx;
      copy[activeWeekIdx].quiz.checked = true;
      if (optIdx === copy[activeWeekIdx].quiz.answer) {
        onAwardXP(50);
      }
      return copy;
    });
  };

  return (
    <div className="space-y-8 animate-fade-in text-[#111827]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-black">AI Learning Roadmap Core</h2>
          <p className="text-sm text-gray-500 font-normal">Custom structured technical weekly curriculum to successfully transition roles.</p>
        </div>
        <button
          onClick={fetchRoadmap}
          disabled={loading}
          className="px-4 py-2 bg-[#111827] text-white hover:bg-black font-semibold text-xs rounded-xl flex items-center space-x-2 shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Regenerate Roadmap</span>
        </button>
      </div>

      {loading ? (
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-16 text-center text-xs text-gray-400 flex flex-col items-center justify-center space-y-3">
          <BookOpen className="w-8 h-8 text-[#16A34A] animate-pulse" />
          <span>Generating multi-week roadmap for "{targetRole}" custom syllabus parameters...</span>
        </div>
      ) : activeWeek ? (
        <div className="space-y-6">
          {/* Week tabs selectors */}
          <div className="flex border-b border-gray-200 overflow-x-auto">
            {weeks.map((wk, idx) => {
              const completedCount = wk.resources.filter(r => r.completed).length;
              const isQuizPassed = wk.quiz.checked && wk.quiz.selected === wk.quiz.answer;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveWeekIdx(idx)}
                  className={`px-6 py-4 text-xs font-semibold uppercase tracking-wider border-b-2 whitespace-nowrap flex items-center space-x-2 transition-all ${
                    idx === activeWeekIdx
                      ? "border-[#16A34A] text-black bg-white font-bold"
                      : "border-transparent text-gray-400 hover:text-black"
                  }`}
                >
                  <span>Week {wk.week}</span>
                  {completedCount === wk.resources.length && isQuizPassed ? (
                    <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
                  ) : (
                    <span className="text-[10px] text-gray-400">({completedCount}/{wk.resources.length})</span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left side: week resources + practical task */}
            <div className="lg:col-span-8 space-y-6">
              {/* Objective */}
              <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm space-y-2">
                <span className="text-[10px] font-bold text-[#16A34A] uppercase tracking-widest block">Objective Goal</span>
                <h3 className="text-lg font-bold text-black font-sans leading-snug">{activeWeek.objective}</h3>
              </div>

              {/* Resources Checklist */}
              <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm space-y-4">
                <h4 className="font-bold text-sm text-black uppercase tracking-wide border-b border-gray-100 pb-3">Educational Course resources (+15 XP each)</h4>
                
                <div className="space-y-3">
                  {activeWeek.resources.map((res, rIdx) => (
                    <div
                      key={rIdx}
                      onClick={() => handleToggleResource(rIdx)}
                      className={`p-4 border rounded-xl cursor-pointer transition-all flex items-center justify-between shadow-sm hover:border-[#16A34A] ${
                        res.completed ? "border-green-250 bg-green-50/10" : "border-gray-150 bg-white"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={!!res.completed}
                          onChange={() => {}} // handled by parent onClick
                          className="w-4 h-4 text-[#16A34A] focus:ring-[#16A34A] accent-[#16A34A]"
                        />
                        <div>
                          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">{res.type} &bull; {res.provider}</span>
                          <h5 className="text-xs font-bold text-black mt-0.5">{res.name}</h5>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 text-xs text-gray-400 font-medium font-mono">
                        <span>{res.duration}</span>
                        <PlayCircle className="w-4 h-4 text-gray-300" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Practical Exercise */}
              <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm space-y-3">
                <h4 className="font-bold text-sm text-black uppercase tracking-wide flex items-center space-x-2">
                  <Award className="w-4 h-4 text-[#16A34A]" />
                  <span>Interactive Hands-On task</span>
                </h4>
                <p className="text-xs text-gray-650 leading-relaxed font-normal bg-gray-50 p-4 rounded-xl border border-gray-150 font-mono">
                  {activeWeek.exercise}
                </p>
              </div>
            </div>

            {/* Right side: Week checkpoint quiz */}
            <div className="lg:col-span-4 bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm space-y-6">
              <div className="border-b border-gray-100 pb-3">
                <span className="text-[10px] font-bold uppercase text-gray-450 tracking-widest block">Level Checkpoint</span>
                <h4 className="font-bold text-sm text-black uppercase tracking-wide">Week {activeWeek.week} Quiz (+50 XP)</h4>
              </div>

              <div className="space-y-4">
                <p className="text-xs font-semibold text-gray-700 leading-relaxed">
                  {activeWeek.quiz.question}
                </p>

                <div className="space-y-2">
                  {activeWeek.quiz.options.map((opt, oIdx) => {
                    const isSelected = activeWeek.quiz.selected === oIdx;
                    const isPassedAndCorrect = activeWeek.quiz.checked && oIdx === activeWeek.quiz.answer;
                    const isPassedAndWrong = activeWeek.quiz.checked && isSelected && oIdx !== activeWeek.quiz.answer;

                    let btnClass = "border-gray-200 bg-white hover:border-[#16A34A] text-gray-700";
                    if (isPassedAndCorrect) {
                      btnClass = "border-green-600 bg-green-50/50 text-green-800";
                    } else if (isPassedAndWrong) {
                      btnClass = "border-red-400 bg-red-50/50 text-red-800";
                    } else if (isSelected) {
                      btnClass = "border-black bg-black text-white";
                    }

                    return (
                      <button
                        key={oIdx}
                        disabled={!!activeWeek.quiz.checked}
                        onClick={() => handleSelectQuizOption(oIdx)}
                        className={`w-full p-3 border rounded-xl text-xs font-medium text-left transition-all flex justify-between items-center ${btnClass}`}
                      >
                        <span>{opt}</span>
                        {isPassedAndCorrect && <CheckCircle2 className="w-4 h-4 text-[#16A34A] flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {activeWeek.quiz.checked && (
                <div className="p-3.5 rounded-xl text-xs leading-relaxed font-medium">
                  {activeWeek.quiz.selected === activeWeek.quiz.answer ? (
                    <div className="text-green-800 bg-green-50 p-3 rounded-lg border border-green-150">
                      <strong>Excellent!</strong> Correct option. You have added <strong>+50 XP</strong> to your score ledger. Keep moving!
                    </div>
                  ) : (
                    <div className="text-red-800 bg-red-50 p-3 rounded-lg border border-red-150">
                      <strong>Incorrect choice.</strong> Target answer was: <strong>{activeWeek.quiz.options[activeWeek.quiz.answer]}</strong>. Try reviewing the book resources.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-gray-150 rounded-2xl p-12 text-center text-xs text-gray-500">
          Enter a role context to view structured roadmaps.
        </div>
      )}
    </div>
  );
}
