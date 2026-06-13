import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Project, CountryCode, BOQItem, LaborItem, TimelineItem, ChatMessage 
} from "./types";
import Navbar from "./components/Navbar";
import LandingPage from "./components/LandingPage";
import Sidebar, { SidebarTab } from "./components/Sidebar";
import DashboardOverview from "./components/DashboardOverview";
import BlueprintAnalyzer from "./components/BlueprintAnalyzer";
import MaterialsList from "./components/MaterialsList";
import LaborEstimator from "./components/LaborEstimator";
import TimelineGantt from "./components/TimelineGantt";
import QuotesAuditor from "./components/QuotesAuditor";
import CarbonCalculator from "./components/CarbonCalculator";
import ReportExporter from "./components/ReportExporter";
import AdvisorChat from "./components/AdvisorChat";
import AdminPanel from "./components/AdminPanel";
import { 
  X, Sparkles, Building, Play, HardHat, Compass, FileText, CheckCircle2, ShieldCheck, Mail, LogOut, ArrowRight, ArrowLeft 
} from "lucide-react";

export default function App() {
  // Navigation & View states
  const [viewMode, setViewMode] = useState<"landing" | "workspace">("landing");
  const [activeTab, setActiveTab] = useState<SidebarTab>("dashboard");
  
  // Projects states
  const [projectsList, setProjectsList] = useState<Project[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);

  // Wizard state
  const [showWizard, setShowWizard] = useState(false);
  const [wizardName, setWizardName] = useState("");
  const [wizardDesc, setWizardDesc] = useState("");
  const [wizardLocation, setWizardLocation] = useState("San Francisco, California");
  const [wizardPostalCode, setWizardPostalCode] = useState("94103");
  const [wizardCountry, setWizardCountry] = useState<CountryCode>("US");
  const [wizardArea, setWizardArea] = useState("2000");
  const [wizardFoundation, setWizardFoundation] = useState("Slab on Grade");
  const [wizardStories, setWizardStories] = useState("2");
  const [wizardRooms, setWizardRooms] = useState("4");
  const [wizardRoof, setWizardRoof] = useState("Asphalt Shingles");
  const [wizardTerrain, setWizardTerrain] = useState<"Flat" | "Rolling" | "Steep" | "Rugged">("Flat");
  const [wizardSoil, setWizardSoil] = useState<"Stable Sandy/Clay" | "Expansive Clay" | "Rocky Slab" | "Wet/Silt">("Stable Sandy/Clay");
  const [wizardBudget, setWizardBudget] = useState("350000");

  // Loading indicator states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isChangeOrderRunning, setIsChangeOrderRunning] = useState(false);
  
  // Simple Session State
  const [userEmail, setUserEmail] = useState("richardchegegitau@gmail.com");
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Initialize and load projects list from Node Express Backend
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setIsLoadingProjects(true);
    try {
      const res = await fetch("/api/projects");
      const listData = await res.json();
      setProjectsList(listData);
      // Select the first project by default
      if (listData.length > 0 && !activeProjectId) {
        setActiveProjectId(listData[0].id);
      }
    } catch (e) {
      console.error("Failed to read projects from backend: ", e);
    } finally {
      setIsLoadingProjects(false);
    }
  };

  const getActiveProject = (): Project | undefined => {
    return projectsList.find(p => p.id === activeProjectId);
  };

  // Launch project creation wizard
  const handleStartEstimate = () => {
    setWizardName("My New Home Plan");
    setWizardDesc("A luxury high-comfort family home engineered for modern standards.");
    setWizardBudget("350000");
    setWizardArea("2100");
    setShowWizard(true);
  };

  // Pre-load quick start blueprints from landing buttons
  const handleQuickUpload = () => {
    setWizardName("Blueprint CAD Concept 2026");
    setWizardDesc("CAD dwg vector exports uploaded via architectural scan.");
    setWizardBudget("400000");
    setWizardArea("2400");
    setShowWizard(true);
  };

  const handleFinishWizard = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: wizardName,
          description: wizardDesc,
          location: wizardLocation,
          postalCode: wizardPostalCode,
          country: wizardCountry,
          areaSqFt: Number(wizardArea),
          foundationType: wizardFoundation,
          stories: Number(wizardStories),
          roomsCount: Number(wizardRooms),
          roofType: wizardRoof,
          terrainType: wizardTerrain,
          soilCondition: wizardSoil,
          budget: Number(wizardBudget)
        })
      });

      const newProj = await response.json();
      setProjectsList(prev => [...prev, newProj]);
      setActiveProjectId(newProj.id);
      setShowWizard(false);
      setViewMode("workspace");
      setActiveTab("blueprints"); // Navigate to Blueprint Analyzer to scan/validate or override
    } catch (err) {
      console.error(err);
    }
  };

  // Delete project
  const handleDeleteProject = async (id: string) => {
    try {
      await fetch(`/api/projects/${id}`, { method: "DELETE" });
      setProjectsList(prev => prev.filter(p => p.id !== id));
      if (activeProjectId === id) {
        const remaining = projectsList.filter(p => p.id !== id);
        setActiveProjectId(remaining.length > 0 ? remaining[0].id : null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Run Blueprint Analysis & Estimate trigger (Gemini or simulated fallback)
  const handleAnalyzeProject = async () => {
    if (!activeProjectId) return;
    setIsAnalyzing(true);
    try {
      const response = await fetch(`/api/projects/${activeProjectId}/analyze`, {
        method: "POST"
      });
      const updatedProj = await response.json();
      setProjectsList(prev => prev.map(p => p.id === activeProjectId ? updatedProj : p));
      setActiveTab("dashboard"); // Return to dashboard once fully estimated!
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Update Dimensions Override
  const handleUpdateProjectDimensions = async (dims: { areaSqFt: number; stories: number; roomsCount: number; foundationType: string; roofType: string }) => {
    if (!activeProjectId) return;
    setProjectsList(prev => prev.map(p => {
      if (p.id === activeProjectId) {
        return {
          ...p,
          areaSqFt: dims.areaSqFt,
          stories: dims.stories,
          roomsCount: dims.roomsCount,
          foundationType: dims.foundationType,
          roofType: dims.roofType
        };
      }
      return p;
    }));
  };

  // Apply Change Orders Predictor Live
  const handleChangeOrder = async (modificationType: string, intensity: number) => {
    if (!activeProjectId) return;
    setIsChangeOrderRunning(true);
    try {
      const res = await fetch(`/api/projects/${activeProjectId}/change-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ modificationType, intensity })
      });
      const data = await res.json();
      setProjectsList(prev => prev.map(p => p.id === activeProjectId ? data.project : p));
    } catch (err) {
      console.error(err);
    } finally {
      setIsChangeOrderRunning(false);
    }
  };

  // Custom Items handlers
  const handleAddBOQItem = (item: BOQItem) => {
    setProjectsList(prev => prev.map(p => {
      if (p.id === activeProjectId) {
        const list = p.boq || [];
        return { ...p, boq: [...list, item] };
      }
      return p;
    }));
  };

  const handleDeleteBOQItem = (id: string) => {
    setProjectsList(prev => prev.map(p => {
      if (p.id === activeProjectId) {
        const list = p.boq || [];
        return { ...p, boq: list.filter(item => item.id !== id) };
      }
      return p;
    }));
  };

  const handleAddLaborItem = (item: LaborItem) => {
    setProjectsList(prev => prev.map(p => {
      if (p.id === activeProjectId) {
        const list = p.labor || [];
        return { ...p, labor: [...list, item] };
      }
      return p;
    }));
  };

  const handleDeleteLaborItem = (id: string) => {
    setProjectsList(prev => prev.map(p => {
      if (p.id === activeProjectId) {
        const list = p.labor || [];
        return { ...p, labor: list.filter(item => item.id !== id) };
      }
      return p;
    }));
  };

  const handleAddTimelineItem = (item: TimelineItem) => {
    setProjectsList(prev => prev.map(p => {
      if (p.id === activeProjectId) {
        const list = p.timeline || [];
        return { ...p, timeline: [...list, item] };
      }
      return p;
    }));
  };

  const handleDeleteTimelineItem = (id: string) => {
    setProjectsList(prev => prev.map(p => {
      if (p.id === activeProjectId) {
        const list = p.timeline || [];
        return { ...p, timeline: list.filter(item => item.id !== id) };
      }
      return p;
    }));
  };

  const activeProject = getActiveProject();

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col font-sans selection:bg-green-150 selection:text-green-800">
      
      {/* Session Header / User Email Profile indicator */}
      <div className="bg-[#111827] text-white py-1 px-6 flex justify-between items-center text-[11px] font-sans font-semibold">
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="h-3.5 w-3.5 text-green-700" />
          <span>Active Building Index synchronized directly</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Mail className="h-3 w-3 text-gray-400" />
            {userEmail}
          </span>
          <button 
            onClick={() => { setViewMode("landing"); }}
            className="text-gray-300 hover:text-white bg-white/10 px-2.5 py-1 rounded flex items-center gap-1 focus:outline-none hover:bg-white/15 transition-all text-[10px] cursor-pointer"
            title="Return to Homepage"
          >
            <ArrowLeft className="h-3 w-3 text-brand-crimson shrink-0" />
            <span>Back to Homepage</span>
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {viewMode === "landing" ? (
          <motion.div
            key="landing-group"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col flex-1"
          >
            <Navbar 
              onStartEstimate={handleStartEstimate}
              onNavigateHome={() => setViewMode("landing")}
            />
            
            <LandingPage 
              onStartEstimate={handleStartEstimate}
              onQuickUpload={handleQuickUpload}
              hasProjects={projectsList.length > 0}
              onEnterWorkspace={() => { setViewMode("workspace"); setActiveTab("dashboard"); }}
            />
          </motion.div>
        ) : (
          <motion.div
            key="workspace-group"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex overflow-hidden min-h-[calc(100vh-24px)]"
          >
            {/* Dedicated sidebar */}
            <Sidebar 
              activeTab={activeTab}
              onChangeTab={(tab) => {
                setActiveTab(tab);
              }}
              projectName={activeProject?.name}
              hasAnalyzed={!!activeProject?.estimate}
              onNavigateHome={() => setViewMode("landing")}
            />

            {/* Dynamic Content Grid */}
            <main className="flex-1 overflow-y-auto bg-white flex flex-col">
              {/* Sticky internal top navigation strip */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-3.5 flex justify-between items-center z-10 shrink-0">
                <div className="flex items-center gap-2 text-[11px] font-semibold text-gray-500 font-sans">
                  <span>Active Tab:</span>
                  <span className="text-black font-extrabold bg-green-50 border border-green-200 px-2.5 py-0.5 rounded-lg uppercase text-[10px]">
                    {activeTab}
                  </span>
                </div>
                <button
                  onClick={() => setViewMode("landing")}
                  className="text-xs font-bold text-green-700 hover:text-green-800 transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-green-50/50 border border-green-250/30 cursor-pointer flex items-center"
                  id="btn-workspace-header-back"
                >
                  <ArrowLeft className="h-3.5 w-3.5 mr-1" />
                  <span>Return to Homepage</span>
                </button>
              </div>
              {activeTab === "dashboard" && activeProject && (
                <DashboardOverview 
                  project={activeProject}
                  onChangeOrder={handleChangeOrder}
                  isChangeOrderRunning={isChangeOrderRunning}
                  onNavigateToTab={(tab) => setActiveTab(tab)}
                  onAnalyzeProject={handleAnalyzeProject}
                  isAnalyzing={isAnalyzing}
                />
              )}

              {activeTab === "projects" && (
                <div className="p-8 max-w-4xl mx-auto font-sans text-xs">
                  <div className="flex justify-between items-center border-b border-gray-200 pb-5 mb-8">
                    <div>
                      <h1 className="text-3xl font-extrabold text-black">My Projects Store</h1>
                      <p className="text-sm text-gray-500 mt-1">Manage, select, and review existing building layouts and budgets.</p>
                    </div>
                    
                    <button
                      onClick={handleStartEstimate}
                      className="rounded-xl bg-black px-4 py-2 text-xs font-bold text-white hover:bg-green-700 focus:outline-none"
                      id="btn-create-project-tab"
                    >
                      Create Custom Project
                    </button>
                  </div>

                  {/* Projects list cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {projectsList.map((p) => (
                      <div 
                        key={p.id}
                        onClick={() => { setActiveProjectId(p.id); }}
                        className={`p-6 bg-white border rounded-2xl cursor-pointer transition-all hover:border-green-700 flex flex-col justify-between h-[180px] shadow-sm relative overflow-hidden group ${
                          activeProjectId === p.id ? "border-green-700 ring-2 ring-green-700/15" : "border-gray-200"
                        }`}
                        id={`project-card-${p.id}`}
                      >
                        <div>
                          <div className="flex justify-between items-start gap-4">
                            <h3 className="text-sm font-bold text-black font-sans group-hover:text-green-700 truncate">{p.name}</h3>
                            <span className="font-mono text-[9px] font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">{p.country}</span>
                          </div>
                          
                          <p className="text-[11px] text-gray-500 leading-normal mt-1.5 clamp-2">{p.description}</p>
                        </div>

                        {/* Cost estimates banner */}
                        <div className="mt-4 border-t border-gray-150 pt-3 flex justify-between items-center text-[11px]">
                          <div>
                            <span className="text-gray-400 block mb-0.5">Budget Draft:</span>
                            <span className="font-mono font-bold text-black">${p.budget.toLocaleString()}</span>
                          </div>
                          {p.estimate ? (
                            <div className="text-right">
                              <span className="text-gray-400 block mb-0.5">Estimated Cost:</span>
                              <span className="font-mono font-extrabold text-green-700">${p.estimate.avgCost.toLocaleString()}</span>
                            </div>
                          ) : (
                            <span className="text-amber-500 font-bold uppercase tracking-wider text-[9px] px-1.5 py-0.5 rounded bg-amber-50 animate-pulse">Awaiting Analysis</span>
                          )}
                        </div>

                        {/* Floating quick delete */}
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDeleteProject(p.id); }}
                          className="absolute right-4 top-4 text-gray-300 hover:text-red-500 focus:outline-none outline-none"
                          id={`btn-del-proj-card-${p.id}`}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {projectsList.length === 0 && (
                    <div className="p-8 text-center text-gray-400 text-xs mt-6 border border-dashed rounded-2xl bg-white">
                      You do not have any saved construction blueprints in your workspace yet. Click the "Create Custom Project" button to create one.
                    </div>
                  )}
                </div>
              )}

              {activeTab === "estimator" && activeProject && (
                <div className="p-8 max-w-5xl mx-auto font-sans text-xs">
                  <div className="border-b border-gray-200 pb-5 mb-8">
                    <h1 className="text-3xl font-extrabold text-black">AI Bid & Estimation Matrix</h1>
                    <p className="text-sm text-gray-500 mt-1">Review localized construction costs modeled against low, standard and premium parameters.</p>
                  </div>

                  {/* Display estimates breakdown categories blocks directly */}
                  {activeProject.estimate ? (
                    <div className="space-y-6">
                      <div className="p-5 bg-green-50 rounded-xl border border-green-200 text-green-800 leading-normal flex items-start gap-3">
                        <Sparkles className="h-6 w-6 text-green-700 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-black block text-sm">AI Estimator Assessment Guidelines:</span>
                          Our algorithm matches your floor plan dimensions with city commodity price catalogs. Foundation metrics are verified to sustain sloped, swell-heavy soil conditions.
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-5 border border-gray-200 bg-white rounded-xl text-center">
                          <span className="text-gray-400 font-bold block">FRUGAL RANGE</span>
                          <span className="text-2xl font-black font-mono mt-1 block">${activeProject.estimate.lowCost.toLocaleString()}</span>
                          <p className="text-gray-500 mt-1 font-sans leading-relaxed text-[11px]">Utilizes mass-market builders cabinetry, standard generic shingles, and vinyl panelings.</p>
                        </div>
                        <div className="p-5 border border-green-700 bg-white rounded-xl shadow-sm text-center">
                          <span className="text-green-700 font-bold block">STANDARD RANGE</span>
                          <span className="text-3xl font-black font-mono mt-1 block">${activeProject.estimate.avgCost.toLocaleString()}</span>
                          <p className="text-gray-500 mt-1 font-sans leading-relaxed text-[11px]">Pre-engineered douglas/spruce trusses, mold-resistant fiber drywall wraps, and high-efficiency central pumps.</p>
                        </div>
                        <div className="p-5 border border-gray-200 bg-white rounded-xl text-center">
                          <span className="text-gray-400 font-bold block">PREMIUM CUSTOM</span>
                          <span className="text-2xl font-black font-mono mt-1 block">${activeProject.estimate.premiumCost.toLocaleString()}</span>
                          <p className="text-gray-500 mt-1 font-sans leading-relaxed text-[11px]">Granite countertops, exposed triple-insulated argon windows, cedar shakes, and smart-energy integrations.</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center p-8 text-gray-500">
                      Estimate unavailable. Please analyze your blueprint first.
                    </div>
                  )}
                </div>
              )}

              {activeTab === "blueprints" && activeProject && (
                <BlueprintAnalyzer 
                  project={activeProject}
                  onUpdateProjectDimensions={handleUpdateProjectDimensions}
                  onAnalyzeProject={handleAnalyzeProject}
                  isAnalyzing={isAnalyzing}
                />
              )}

              {activeTab === "materials" && activeProject && (
                <MaterialsList 
                  project={activeProject}
                  onAddBOQItem={handleAddBOQItem}
                  onDeleteBOQItem={handleDeleteBOQItem}
                />
              )}

              {activeTab === "labor" && activeProject && (
                <LaborEstimator 
                  project={activeProject}
                  onAddLaborItem={handleAddLaborItem}
                  onDeleteLaborItem={handleDeleteLaborItem}
                />
              )}

              {activeTab === "timeline" && activeProject && (
                <TimelineGantt 
                  project={activeProject}
                  onAddTimelineItem={handleAddTimelineItem}
                  onDeleteTimelineItem={handleDeleteTimelineItem}
                />
              )}

              {activeTab === "quotes" && (
                <QuotesAuditor />
              )}

              {activeTab === "carbon" && activeProject && (
                <CarbonCalculator project={activeProject} />
              )}

              {activeTab === "reports" && activeProject && (
                <ReportExporter project={activeProject} />
              )}

              {activeTab === "chat" && (
                <AdvisorChat currentProject={activeProject} />
              )}

              {activeTab === "admin" && (
                <AdminPanel />
              )}
            </main>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MULTI_STEP CREATE DESIGN PROJECT WIZARD MODAL */}
      <AnimatePresence>
        {showWizard && (
          <div className="fixed inset-0 z-55 flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-2xl border border-gray-150 p-6 shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto font-sans text-xs"
            >
              {/* Header */}
              <div className="flex justify-between items-center border-b border-gray-150 pb-3 mb-4">
                <h3 className="text-lg font-bold text-black flex items-center gap-1.5">
                  <Building className="h-5 w-5 text-green-700" />
                  Configure BuildWise blueprint Parameters
                </h3>
                <button 
                  onClick={() => setShowWizard(false)}
                  className="p-1 rounded bg-gray-50 text-gray-400 hover:text-black focus:outline-none"
                  id="btn-close-wizard"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              {/* Form body */}
              <form onSubmit={handleFinishWizard} className="space-y-4">
                
                {/* Spec Row 1: Name, Cost draft */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Project Name</label>
                    <input 
                      type="text" 
                      value={wizardName}
                      onChange={(e) => setWizardName(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 p-2.5 outline-none font-sans text-xs text-black font-semibold"
                      placeholder="e.g., California Modern Cabin"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Target Budget ($)</label>
                    <input 
                      type="number"
                      value={wizardBudget}
                      onChange={(e) => setWizardBudget(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 p-2.5 outline-none font-mono text-xs text-black font-bold"
                      placeholder="e.g., 350000"
                      required
                    />
                  </div>
                </div>

                {/* Scope Description */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Scope / Plan Description</label>
                  <input 
                    type="text" 
                    value={wizardDesc}
                    onChange={(e) => setWizardDesc(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 p-2 text-xs"
                    placeholder="Brief highlights about materials or specific custom requirements..."
                  />
                </div>

                {/* Country and location specifications */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Country</label>
                    <select
                      value={wizardCountry}
                      onChange={(e) => {
                        const code = e.target.value as CountryCode;
                        setWizardCountry(code);
                        setWizardLocation(code === "US" ? "Seattle, Washington" : "Victoria, British Columbia");
                        setWizardPostalCode(code === "US" ? "98101" : "V8V 1X4");
                      }}
                      className="w-full rounded-xl border border-gray-200 p-2.5"
                    >
                      <option value="US">🇺🇸 United States</option>
                      <option value="CA">🇨🇦 Canada</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-gray-600 mb-1">Location Coordinates / ZIP Code</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={wizardLocation}
                        onChange={(e) => setWizardLocation(e.target.value)}
                        className="flex-1 rounded-xl border border-gray-200 p-2"
                        placeholder="City, State"
                        required
                      />
                      <input 
                        type="text" 
                        value={wizardPostalCode}
                        onChange={(e) => setWizardPostalCode(e.target.value)}
                        className="w-20 rounded-xl border border-gray-200 p-2 text-center"
                        placeholder="ZIP/Postal"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Dimensions: area, levels, foundation */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Floor Area (Sq Ft)</label>
                    <input 
                      type="number"
                      value={wizardArea}
                      onChange={(e) => setWizardArea(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 p-2 font-mono"
                      placeholder="e.g., 2000"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Stories stories</label>
                    <input 
                      type="number"
                      value={wizardStories}
                      onChange={(e) => setWizardStories(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 p-2 font-mono"
                      step="1"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Rooms count</label>
                    <input 
                      type="number"
                      value={wizardRooms}
                      onChange={(e) => setWizardRooms(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 p-2 font-mono"
                    />
                  </div>
                </div>

                {/* Land physical factors */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Plot Incline Terrain</label>
                    <select
                      value={wizardTerrain}
                      onChange={(e: any) => setWizardTerrain(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 p-2 font-semibold"
                    >
                      <option value="Flat">Flat Incline</option>
                      <option value="Rolling">Rolling swells</option>
                      <option value="Steep">Steep Incline</option>
                      <option value="Rugged">Rugged Peaks</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Earth / Soil Subdivide</label>
                    <select
                      value={wizardSoil}
                      onChange={(e: any) => setWizardSoil(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 p-2 font-semibold"
                    >
                      <option value="Stable Sandy/Clay">Stable Sandy/Clay</option>
                      <option value="Expansive Clay">Expansive Clay Silt</option>
                      <option value="Rocky Slab">Rocky Bedrock Slab</option>
                      <option value="Wet/Silt">Saturated Wet/Silt</option>
                    </select>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-gray-150 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowWizard(false)}
                    className="rounded-xl border border-gray-300 bg-white px-4 py-2 font-bold text-gray-600 hover:text-black"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-black px-6 py-2.5 font-bold text-white hover:bg-green-700 hover:scale-[1.02] transition-colors"
                    id="btn-wizard-submit"
                  >
                    Generate Estimate Template
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
