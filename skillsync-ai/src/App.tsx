import React, { useState, useEffect, useMemo, FormEvent } from "react";
import { 
  LayoutDashboard, 
  FileText, 
  Brain, 
  Briefcase, 
  Radar, 
  Map, 
  Code, 
  Mic, 
  DollarSign, 
  Layers, 
  MessageSquare, 
  ListTodo, 
  Zap, 
  Activity, 
  Sliders, 
  Search, 
  Bell, 
  User, 
  LogOut, 
  Lock, 
  Globe, 
  Menu, X, Command, AlertCircle, RefreshCw, Star, ArrowUpRight 
} from "lucide-react";

// Components Imports
import LandingPage from "./components/LandingPage";
import AuthModal from "./components/AuthModal";
import DashboardOverview from "./components/DashboardOverview";
import ResumeAnalyzer from "./components/ResumeAnalyzer";
import CareerCoach from "./components/CareerCoach";
import JobMatcher from "./components/JobMatcher";
import SkillGapRadar from "./components/SkillGapRadar";
import LearningRoadmap from "./components/LearningRoadmap";
import PortfolioEvaluator from "./components/PortfolioEvaluator";
import InterviewSimulator from "./components/InterviewSimulator";
import SalaryPredictor from "./components/SalaryPredictor";
import ProjectGenerator from "./components/ProjectGenerator";
import NetworkingAssistant from "./components/NetworkingAssistant";
import ApplicationTracker from "./components/ApplicationTracker";

import { UserState, ChatMessage, PortfolioEvaluation, RadarSkill, RoadmapWeek, SalaryPrediction, FutureCareerPath, PortfolioProject, NetworkingDraft } from "./types";

export default function App() {
  const [view, setView] = useState<"landing" | "dashboard">("landing");
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // RAG / AI Status Monitoring
  const [aiStatus, setAiStatus] = useState({ ok: true, aiConfigured: false });
  const [polling, setPolling] = useState(false);

  // User State Store
  const [user, setUser] = useState<UserState>({
    id: "usr_shepard",
    name: "John Shepard",
    email: "shepard@career.com",
    avatar: "JS",
    xp: 320,
    level: 2,
    streak: 4,
    skills: ["React", "JavaScript", "HTML5", "CSS3", "RESTful Pipelines"],
    role: "Senior UX frontend Architect",
    isLoggedIn: false
  });

  const [initialResumeText, setInitialResumeText] = useState("");

  const checkHealth = async () => {
    setPolling(true);
    try {
      const res = await fetch("/api/health");
      const data = await res.json();
      setAiStatus({ ok: data.status === "ok", aiConfigured: data.aiConfigured });
    } catch (e) {
      console.warn("Express backend health diagnostics offline. Utilizing client simulations.", e);
      setAiStatus({ ok: true, aiConfigured: false });
    } finally {
      setPolling(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  const awardXP = (amount: number) => {
    setUser((prev) => {
      const nextXP = Math.max(0, prev.xp + amount);
      const calculatedLevel = Math.floor(nextXP / 500) + 1;
      return {
        ...prev,
        xp: nextXP,
        level: calculatedLevel
      };
    });
  };

  // 1. ANALYZE RESUME HOOK
  const handleAnalyzeResume = async (resumeText: string, targetRole: string) => {
    try {
      const res = await fetch("/api/analyze-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, targetRole })
      });
      const data = await res.json();
      awardXP(80);
      setUser((prev) => {
        // extract skills dynamic from report missing or listed words if available
        const currentSkills = [...prev.skills];
        if (data.missingKeywords) {
          data.missingKeywords.slice(0, 2).forEach((kw: string) => {
            if (!currentSkills.includes(kw)) {
              currentSkills.push(kw);
            }
          });
        }
        return {
          ...prev,
          skills: currentSkills,
          role: targetRole
        };
      });
      return data;
    } catch (e) {
      throw new Error("Resume parse pipeline failure");
    }
  };

  // 2. COACH CHAT HOOK
  const handleCoachSendMessage = async (messages: ChatMessage[], userSkills: string[], targetRole: string) => {
    const res = await fetch("/api/coach-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages, userSkills, targetRole })
    });
    awardXP(20);
    return res.json();
  };

  // 3. SKILL GAP HOOK
  const handleAnalyzeGap = async (currentSkills: string[], targetSector: string) => {
    const res = await fetch("/api/skill-gap", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentSkills, targetSector })
    });
    return res.json();
  };

  // 4. GENERATE LEARNING ROADMAP HOOK
  const handleGenerateRoadmap = async (targetRole: string) => {
    const res = await fetch("/api/learning-roadmap", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetRole, limitWeeks: 4 })
    });
    awardXP(50);
    return res.json();
  };

  // 5. EVALUATE PORTFOLIO HOOK
  const handleEvaluatePortfolio = async (url: string, description: string) => {
    const res = await fetch("/api/evaluate-portfolio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, description })
    });
    awardXP(90);
    return res.json();
  };

  // 6. EVALUATE INTERVIEW HOOK
  const handleEvaluateInterview = async (messages: any[], category: string) => {
    const res = await fetch("/api/evaluate-interview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages, category })
    });
    awardXP(100);
    return res.json();
  };

  // 7. PREDICT COMPENSATIONS HOOK
  const handlePredictSalary = async (currentSkills: string[], targetSector: string) => {
    const res = await fetch("/api/salary-intelligence", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentSkills, targetSector })
    });
    return res.json();
  };

  // 8. PREDICT PATH TRAJECTORY HOOK
  const handlePredictCareer = async (skills: string[]) => {
    const res = await fetch("/api/career-predictor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ skills })
    });
    return res.json();
  };

  // 9. GENERATE PORTFOLIO PROJECT HOOK
  const handleGenerateProject = async (primaryGoal: string, difficulty: string) => {
    const res = await fetch("/api/generate-project", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ primaryGoal, difficulty })
    });
    awardXP(70);
    return res.json();
  };

  // 10. GENERATE OUTBOUND NETWORKING HOOK
  const handleDraftNetwork = async (relationshipType: string, targetCompany: string, userBack: string) => {
    const res = await fetch("/api/draft-network", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ relationshipType, targetCompany, userBack })
    });
    awardXP(30);
    return res.json();
  };

  // Handle mock quick resume upload from Landing Page Scratchpad
  const handleQuickUpload = (text: string) => {
    setInitialResumeText(text);
    setUser((prev) => ({ ...prev, isLoggedIn: true }));
    setView("dashboard");
    setActiveTab("resume");
  };

  const handleLoginSuccess = (name: string, email: string) => {
    setUser((prev) => ({
      ...prev,
      name,
      email,
      isLoggedIn: true
    }));
    setView("dashboard");
  };

  const handleLogout = () => {
    setUser((prev) => ({ ...prev, isLoggedIn: false }));
    setView("landing");
    setActiveTab("overview");
  };

  // Simulated notifications feed
  const systemNotifications = [
    { title: "Matched Vacancy", desc: "Stripe match index recalculated to 94.2% based on JavaScript edits.", time: "1 hr ago" },
    { title: "Level Calibration", desc: "You advanced to Level 2! Check week 1 testing challenges.", time: "3 hrs ago" },
    { title: "Compensation Alert", desc: "Average Edge Architecture compensation baselines raised by 4.2% globally.", time: "1 day ago" }
  ];

  // Sidebar Menu Toggles List
  const sidebarItems = [
    { id: "overview", label: "Dashboard Overview", icon: LayoutDashboard },
    { id: "resume", label: "ATS Resume Scan", icon: FileText },
    { id: "coach", label: "Mentor Coach", icon: Brain },
    { id: "jobs", label: "Smart Job Match", icon: Briefcase },
    { id: "skills", label: "Skill Gap Radar", icon: Radar },
    { id: "learning", label: "Course Roadmaps", icon: Map },
    { id: "portfolio", label: "Repository Auditor", icon: Code },
    { id: "interview", label: "Interview Sandbox", icon: Mic },
    { id: "salary", label: "Salary Trajectory", icon: DollarSign },
    { id: "projects", label: "Project Synthesizer", icon: Layers },
    { id: "networking", label: "Outreach Assistant", icon: MessageSquare },
    { id: "tracker", label: "Kanban Pipeline", icon: ListTodo },
    { id: "freelance", label: "Freelance Finder", icon: Globe },
    { id: "admin", label: "Admin Diagnostics", icon: Activity },
    { id: "settings", label: "Platform Settings", icon: Sliders }
  ];

  const currentTabDetails = sidebarItems.find(item => item.id === activeTab);

  // Simple global search handler - triggers tabs navigations if querying matching variables
  const handleGlobalSearch = (e: FormEvent) => {
    e.preventDefault();
    const q = searchQuery.toLowerCase();
    if (q.includes("resume") || q.includes("cv") || q.includes("ats")) {
      setActiveTab("resume");
    } else if (q.includes("coach") || q.includes("guidance") || q.includes("negotiat")) {
      setActiveTab("coach");
    } else if (q.includes("job") || q.includes("stripe") || q.includes("meta")) {
      setActiveTab("jobs");
    } else if (q.includes("gap") || q.includes("radar") || q.includes("skill")) {
      setActiveTab("skills");
    } else if (q.includes("course") || q.includes("roadmap") || q.includes("week")) {
      setActiveTab("learning");
    } else if (q.includes("port") || q.includes("github") || q.includes("repo")) {
      setActiveTab("portfolio");
    } else if (q.includes("interview") || q.includes("mock") || q.includes("mic")) {
      setActiveTab("interview");
    } else if (q.includes("salary") || q.includes("worth") || q.includes("cash")) {
      setActiveTab("salary");
    } else if (q.includes("project") || q.includes("rust") || q.includes("build")) {
      setActiveTab("projects");
    } else if (q.includes("network") || q.includes("cold") || q.includes("linked")) {
      setActiveTab("networking");
    } else if (q.includes("track") || q.includes("kanban") || q.includes("pipeline")) {
      setActiveTab("tracker");
    } else if (q.includes("gigs") || q.includes("upwork") || q.includes("free")) {
      setActiveTab("freelance");
    } else if (q.includes("admin") || q.includes("health") || q.includes("cpu")) {
      setActiveTab("admin");
    } else {
      setActiveTab("overview");
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] font-sans antialiased text-[#111827]">
      {view === "landing" ? (
        <LandingPage 
          onGetStarted={() => {
            setUser((prev) => ({ ...prev, isLoggedIn: true }));
            setView("dashboard");
            setActiveTab("overview");
          }} 
          onQuickUpload={handleQuickUpload}
          onOpenAuth={() => setIsAuthOpen(true)}
        />
      ) : (
        /* Workspace Active Dashboard Page holding sidebar and top node elements */
        <div className="flex h-screen overflow-hidden">
          
          {/* Static Sidebar: Large screens */}
          <aside className="hidden lg:flex lg:flex-shrink-0 lg:w-64 bg-white border-r border-[#E5E7EB] flex-col justify-between">
            <div className="flex flex-col h-full overflow-y-auto">
              {/* Brand Header */}
              <div className="px-6 h-20 flex items-center space-x-2 border-b border-gray-100 flex-shrink-0 cursor-pointer" onClick={() => setView("landing")}>
                <div className="w-8 h-8 rounded-lg bg-[#16A34A] flex items-center justify-center text-white font-bold text-sm shadow-sm select-none">
                  S
                </div>
                <span className="text-lg font-bold tracking-tight text-black">SkillSync AI</span>
              </div>

              {/* Navigation lists */}
              <nav className="flex-1 px-4 py-6 space-y-1.5 scrollbar-thin">
                {sidebarItems.map((item) => {
                  const Icon = item.icon;
                  const isCur = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all select-none ${
                        isCur 
                          ? "bg-[#111827] text-white shadow-md font-bold"
                          : "text-gray-500 hover:bg-gray-50 hover:text-black"
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isCur ? 'text-[#16A34A]' : 'text-gray-400'}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Logout bottom coordinate */}
            <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex-shrink-0">
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Terminate Session</span>
              </button>
            </div>
          </aside>

          {/* Core Content Layout Area */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#F5F5F5]">
            
            {/* Top Workspace Header Bar */}
            <header className="h-20 bg-white border-b border-[#E5E7EB] px-4 sm:px-8 flex items-center justify-between flex-shrink-0 select-none z-10">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-50"
                >
                  <Menu className="w-5 h-5" />
                </button>
                
                {/* Global Search Block */}
                <form onSubmit={handleGlobalSearch} className="relative max-w-xs sm:max-w-md hidden sm:block">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search tools, resume, coach, salary worth..."
                    className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#16A34A] w-[260px] lg:w-[320px] text-black"
                  />
                </form>
              </div>

              {/* Status & Notifications indicators */}
              <div className="flex items-center space-x-4">
                {/* RAG Diagnostics check line */}
                <span className="hidden md:flex items-center space-x-1 px-3 py-1 bg-green-50 text-green-700 rounded-full border border-green-250 text-[10px] font-bold uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] inline-block animate-pulse"></span>
                  <span>{polling ? 'Polling RAG...' : aiStatus.aiConfigured ? 'Live Gemini RAG' : 'Simulated RAG'}</span>
                </span>

                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2.5 text-gray-400 hover:text-black hover:bg-gray-50 rounded-full transition-colors relative"
                  >
                    <Bell className="w-4 h-4" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-[#16A34A] rounded-full" />
                  </button>

                  {showNotifications && (
                    <div className="absolute right-0 mt-3 w-[290px] bg-white border border-gray-205 rounded-2xl shadow-xl p-4 space-y-3 z-50 text-left animate-slide-up text-black text-sm">
                      <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                        <strong className="text-xs uppercase font-extrabold text-gray-400 tracking-wider">Strategic Advisories</strong>
                        <button onClick={() => setShowNotifications(false)} className="text-[10px] text-gray-450 hover:underline">Dismiss</button>
                      </div>
                      <div className="space-y-3">
                        {systemNotifications.map((notif, idx) => (
                          <div key={idx} className="border-b border-gray-50 pb-2 last:border-b-0">
                            <span className="block text-xs font-bold">{notif.title}</span>
                            <span className="block text-[10px] text-gray-500 mt-0.5 leading-snug">{notif.desc}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile coordinate */}
                <div className="flex items-center space-x-3 pl-2 border-l border-gray-100">
                  <div className="w-9 h-9 bg-black rounded-lg flex items-center justify-center text-white text-xs font-bold">
                    {user.avatar}
                  </div>
                  <div className="hidden md:block text-left text-xs">
                    <strong className="block text-black font-semibold">{user.name}</strong>
                    <span className="text-[10px] text-gray-450 font-medium truncate max-w-[120px] inline-block">{user.email}</span>
                  </div>
                </div>
              </div>
            </header>

            {/* Mobile Sidebar Overlay Drawer */}
            {isMobileMenuOpen && (
              <div className="fixed inset-0 z-50 flex lg:hidden bg-black/50 backdrop-blur-sm animate-fade-in">
                <div className="w-64 bg-white h-full p-4 flex flex-col justify-between shadow-2xl relative animate-slide-right">
                  <button onClick={() => setIsMobileMenuOpen(false)} className="absolute top-4 right-4 p-1 text-gray-400 hover:text-black">
                    <X className="w-5 h-5" />
                  </button>
                  <div className="flex flex-col h-full overflow-y-auto">
                    <div className="flex items-center space-x-2 py-4 border-b border-gray-100 mb-4 font-bold text-black text-base cursor-pointer" onClick={() => { setView("landing"); setIsMobileMenuOpen(false); }}>
                      <div className="w-8 h-8 rounded-lg bg-[#16A34A] flex items-center justify-center text-white text-sm">S</div>
                      <span>SkillSync AI</span>
                    </div>
                    
                    <nav className="flex-1 space-y-1.5 scrollbar-thin">
                      {sidebarItems.map((item) => {
                        const Icon = item.icon;
                        const isCur = activeTab === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => {
                              setActiveTab(item.id);
                              setIsMobileMenuOpen(false);
                            }}
                            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                              isCur 
                                ? "bg-[#111827] text-white shadow-sm font-bold"
                                : "text-gray-500 hover:bg-gray-50 hover:text-black"
                            }`}
                          >
                            <Icon className={`w-4 h-4 ${isCur ? 'text-[#16A34A]' : 'text-gray-400'}`} />
                            <span>{item.label}</span>
                          </button>
                        );
                      })}
                    </nav>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-100 flex-shrink-0">
                    <button onClick={handleLogout} className="w-full flex items-center space-x-3 px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-red-650 hover:bg-red-50">
                      <LogOut className="w-4 h-4" />
                      <span>Log Out Session</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Active module dynamic loader view container */}
            <main className="flex-1 overflow-y-auto p-4 sm:p-8">
              <div className="max-w-5xl mx-auto">
                {activeTab === "overview" && (
                  <DashboardOverview 
                    onNavigateTab={setActiveTab} 
                    userSkills={user.skills}
                    targetRole={user.role}
                    xp={user.xp}
                    level={user.level}
                    streak={user.streak}
                  />
                )}
                
                {activeTab === "resume" && (
                  <ResumeAnalyzer 
                    onAnalyze={handleAnalyzeResume} 
                    initialText={initialResumeText} 
                    initialReport={null}
                  />
                )}

                {activeTab === "coach" && (
                  <CareerCoach 
                    onSendMessage={handleCoachSendMessage} 
                    userSkills={user.skills}
                    targetRole={user.role}
                  />
                )}

                {activeTab === "jobs" && <JobMatcher userSkills={user.skills} />}

                {activeTab === "skills" && (
                  <SkillGapRadar 
                    onAnalyzeGap={handleAnalyzeGap} 
                    userSkills={user.skills}
                    targetRole={user.role}
                    onInitiateRoadmap={() => setActiveTab("learning")}
                  />
                )}

                {activeTab === "learning" && (
                  <LearningRoadmap 
                    onGenerateRoadmap={handleGenerateRoadmap} 
                    targetRole={user.role}
                    onAwardXP={awardXP}
                  />
                )}

                {activeTab === "portfolio" && <PortfolioEvaluator onEvaluate={handleEvaluatePortfolio} />}

                {activeTab === "interview" && <InterviewSimulator onEvaluateInterview={handleEvaluateInterview} />}

                {activeTab === "salary" && (
                  <SalaryPredictor 
                    onPredictSalary={handlePredictSalary} 
                    onPredictCareer={handlePredictCareer} 
                    userSkills={user.skills}
                  />
                )}

                {activeTab === "projects" && <ProjectGenerator onGenerateProject={handleGenerateProject} />}

                {activeTab === "networking" && <NetworkingAssistant onDraftNetwork={handleDraftNetwork} />}

                {activeTab === "tracker" && <ApplicationTracker />}

                {/* 13. FREELANCE MODULE SUB PANEL VIEW */}
                {activeTab === "freelance" && (
                  <div className="space-y-8 animate-fade-in text-[#111827]">
                    <div>
                      <h2 className="text-2xl font-bold tracking-tight text-black">Smart Freelance Gigs Matcher</h2>
                      <p className="text-sm text-gray-500 font-normal">Extract winning Upwork, Fiverr, and remote contract tasks matched to your competence rating.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm space-y-4">
                        <span className="text-[10px] font-bold text-green-700 uppercase tracking-widest block bg-green-50 border border-green-150 py-1 px-2.5 rounded-lg w-max">Excellent Match</span>
                        <h4 className="font-bold text-black text-sm">Full-Cycle Latency Optimization (Stripe Middleware)</h4>
                        <p className="text-xs text-gray-500 leading-relaxed font-normal">
                          Client needs a consultant to refactor standard Express server endpoints with custom generic type structures, reducing main thread blocked threads ratios under 20ms.
                        </p>
                        <div className="border-t border-gray-100 pt-3 flex justify-between text-xs text-gray-450">
                          <span>Suggested rate: <strong>$80 - $110 / hr</strong></span>
                          <span>Winning Rate probability: <strong>92%</strong></span>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-150 text-[10px] font-mono leading-relaxed font-semibold">
                          <strong>Outbound Proposal Pitch Hook:</strong> "I reviewed your middleware block cycles at Stripe. I recently implemented a Redis cached ArrayBuffer worker structure that slashes latency blocks safely under 12ms."
                        </div>
                      </div>

                      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm space-y-4">
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block bg-gray-50 border border-gray-150 py-1 px-2.5 rounded-lg w-max">Good Overlap</span>
                        <h4 className="font-bold text-black text-sm">Deploy Multistage Docker containerization specs</h4>
                        <p className="text-xs text-gray-500 leading-relaxed font-normal">
                          Optimize legacy development structures, deploying clean multi-stage alpine node files to cut image payloads down to 100MB constraints.
                        </p>
                        <div className="border-t border-gray-100 pt-3 flex justify-between text-xs text-gray-455">
                          <span>Suggested rate: <strong>$450 - $700 / Fixed</strong></span>
                          <span>Winning Rate probability: <strong>78%</strong></span>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-150 text-[10px] font-mono leading-relaxed font-semibold">
                          <strong>Outbound Proposal Pitch Hook:</strong> "I package full stack node systems safely utilizing alpine, excluding deep builds dependencies from final production files to maintain fast pull speeds."
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 14. ADMIN DIAGNOSTIC PANEL */}
                {activeTab === "admin" && (
                  <div className="space-y-8 animate-fade-in text-[#111827]">
                    <div>
                      <h2 className="text-2xl font-bold tracking-tight text-black">Admin Intelligence Diagnostic Console</h2>
                      <p className="text-sm text-gray-400 font-normal">Systems status metrics, telemetry files, and model prompt performance logs.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="bg-white border border-gray-200 p-5 rounded-2xl shadow-sm text-center">
                        <span className="text-[10px] font-bold uppercase text-gray-400">REST API Status</span>
                        <div className="text-xl font-bold text-green-600 mt-2">● COMPLIANT / OK</div>
                      </div>
                      <div className="bg-white border border-gray-200 p-5 rounded-2xl shadow-sm text-center">
                        <span className="text-[10px] font-bold uppercase text-gray-400">Gemini model key</span>
                        <div className="text-xl font-bold text-black mt-2">{aiStatus.aiConfigured ? "Authorized" : "Simulated Offline"}</div>
                      </div>
                      <div className="bg-white border border-gray-200 p-5 rounded-2xl shadow-sm text-center">
                        <span className="text-[10px] font-bold uppercase text-gray-400">Active Licenses</span>
                        <div className="text-2xl font-bold text-[#111827] mt-1">1,245 Nodes</div>
                      </div>
                      <div className="bg-white border border-gray-200 p-5 rounded-2xl shadow-sm text-center">
                        <span className="text-[10px] font-bold uppercase text-gray-400">Server Latency</span>
                        <div className="text-2xl font-bold text-black mt-1">14ms</div>
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
                      <h4 className="font-bold text-xs uppercase tracking-wider text-black border-b border-gray-100 pb-3">Systems telemetry indicators (Vercel, AWS Edge nodes orchestration)</h4>
                      <div className="space-y-2 text-xs font-mono bg-[#111827] text-white p-5 rounded-xl">
                        <p className="text-gray-400">[info] 22:34:01 initialized system metrics checking...</p>
                        <p className="text-green-500">[success] 22:34:01 loaded RAG model weights successfully.</p>
                        <p className="text-gray-400">[info] 22:34:02 synchronizing multi-user session locks...</p>
                        <p className="text-yellow-600">[warning] 22:34:03 Docker orchestrations logs exceed standard buffers thresholds. Recalibrating.</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 15. SETTINGS MODULE */}
                {activeTab === "settings" && (
                  <div className="space-y-8 animate-fade-in text-[#111827]">
                    <div>
                      <h2 className="text-2xl font-bold tracking-tight text-black">Platform Settings / Multi-Factor Auth</h2>
                      <p className="text-sm text-gray-500">Configure profile authorizations, reset local metrics, or configure double MFA bypass parameters.</p>
                    </div>

                    <div className="max-w-2xl bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm space-y-6">
                      <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                        <div className="space-y-1">
                          <h4 className="text-sm font-bold text-black">Require Double Multi-Factor Verification (MFA)</h4>
                          <p className="text-xs text-gray-400 leading-normal">Always require a 6-digit authorized token bypass during personal login sessions.</p>
                        </div>
                        <span className="text-xs bg-[#16A34A] text-white font-bold px-3 py-1 rounded-full border border-green-200">
                          Active Premium
                        </span>
                      </div>

                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-black">Reset Analytical Metrics</h4>
                        <p className="text-xs text-gray-400 leading-relaxed mb-3">Clear all cached history, resume parsing logs, and level XP milestone states.</p>
                        <button
                          onClick={() => {
                            setUser({
                              id: "usr_shepard",
                              name: "John Shepard",
                              email: "shepard@career.com",
                              avatar: "JS",
                              xp: 0,
                              level: 1,
                              streak: 1,
                              skills: ["React", "JavaScript", "HTML5", "CSS3"],
                              role: "Senior UX frontend Architect",
                              isLoggedIn: true
                            });
                            alert("Metrics cache purged.");
                          }}
                          className="px-4 py-2 bg-red-100 text-red-800 hover:bg-red-200 font-semibold text-xs rounded-lg transition-colors border border-red-200"
                        >
                          Clear Cached Analytics
                        </button>
                      </div>

                      <div className="border-t border-gray-100 pt-5 space-y-4">
                        <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">Linked User Nodes (Security Checks)</span>
                        <div className="flex justify-between items-center text-xs bg-gray-50 p-3 rounded-lg border border-gray-100 font-mono text-gray-600">
                          <span>Apple MacBook Pro Node (Vercel login)</span>
                          <span className="text-green-700 font-extrabold">Active Now</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </main>
          </div>
        </div>
      )}

      {/* Auth verification Modal */}
      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        onSuccess={handleLoginSuccess}
      />
    </div>
  );
}
