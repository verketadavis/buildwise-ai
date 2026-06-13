import { 
  LayoutDashboard, FolderKanban, Calculator, ScanEye, Layers, Compass, Calendar, Sparkles, FileSpreadsheet, Settings, UserCheck, Shield, ArrowLeft
} from "lucide-react";

export type SidebarTab = 
  | "dashboard"
  | "projects"
  | "estimator"
  | "blueprints"
  | "materials"
  | "labor"
  | "timeline"
  | "quotes"
  | "carbon"
  | "reports"
  | "chat"
  | "admin";

interface SidebarProps {
  activeTab: SidebarTab;
  onChangeTab: (tab: SidebarTab) => void;
  projectName?: string;
  hasAnalyzed?: boolean;
  onNavigateHome?: () => void;
}

export default function Sidebar({ activeTab, onChangeTab, projectName, hasAnalyzed, onNavigateHome }: SidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Overview Dashboard", icon: LayoutDashboard, requiresAnalysis: false },
    { id: "projects", label: "My Projects", icon: FolderKanban, requiresAnalysis: false },
    { id: "estimator", label: "AI Cost Estimator", icon: Calculator, requiresAnalysis: true },
    { id: "blueprints", label: "Blueprint Analyzer", icon: ScanEye, requiresAnalysis: false },
    { id: "materials", label: "Material quantity", icon: Layers, requiresAnalysis: true },
    { id: "labor", label: "Labor Forecast", icon: Compass, requiresAnalysis: true },
    { id: "timeline", label: "Timeline Gantt", icon: Calendar, requiresAnalysis: true },
    { id: "quotes", label: "Quote Auditor & Fraud", icon: Compass, requiresAnalysis: false },
    { id: "carbon", label: "Carbon & CO₂ Tracker", icon: Compass, requiresAnalysis: true },
    { id: "reports", label: "Report Exports", icon: FileSpreadsheet, requiresAnalysis: true },
    { id: "chat", label: "AI Advisor Chat", icon: Sparkles, requiresAnalysis: false },
    { id: "admin", label: "System Admin Panel", icon: Shield, requiresAnalysis: false }
  ];

  return (
    <aside className="w-64 border-r border-gray-200 bg-white flex flex-col h-screen sticky top-0 font-sans z-10">
      {/* Brand */}
      <div className="p-6 border-b border-gray-150 flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-700 text-white shadow-sm">
          <LayoutDashboard className="h-4.5 w-4.5" />
        </div>
        <span className="font-extrabold text-lg text-black tracking-tight">BuildWise <span className="text-sm font-semibold text-green-700">WORKSPACE</span></span>
      </div>

      {/* Back to Home Action Button */}
      {onNavigateHome && (
        <div className="px-4 pt-3 pb-0">
          <button
            onClick={onNavigateHome}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl bg-green-50/70 border border-green-200/50 hover:bg-green-100/80 transition-all text-green-700 font-sans text-xs font-bold focus:outline-none cursor-pointer"
            id="btn-sidebar-back-home"
          >
            <ArrowLeft className="h-4 w-4 text-green-700 shrink-0" />
            <span>← Back to Homepage</span>
          </button>
        </div>
      )}

      {/* Active Project Card */}
      {projectName && (
        <div className="p-4 mx-4 mt-4 rounded-xl bg-[#F5F5F5] border border-gray-250">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Active Project</span>
          <span className="text-xs font-bold text-black truncate block mt-0.5" title={projectName}>{projectName}</span>
          <span className="text-[9px] font-semibold text-green-700 mt-1 flex items-center gap-1">
            <span className={`h-1.5 w-1.5 rounded-full ${hasAnalyzed ? 'bg-green-700' : 'bg-amber-400 animate-pulse'}`}></span>
            {hasAnalyzed ? 'Analyzed Engine Ready' : 'Awaiting Blueprint Sync'}
          </span>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const isDisabled = item.requiresAnalysis && !hasAnalyzed;
          
          return (
            <button
              key={item.id}
              onClick={() => !isDisabled && onChangeTab(item.id as SidebarTab)}
              disabled={isDisabled}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-sans text-xs font-semibold tracking-tight transition-all text-left focus:outline-none ${
                isActive 
                  ? "bg-black text-white" 
                  : isDisabled
                    ? "opacity-40 cursor-not-allowed text-gray-400"
                    : "text-gray-600 hover:bg-[#F5F5F5] hover:text-black"
              }`}
              id={`sidebar-item-${item.id}`}
            >
              <Icon className={`h-4.5 w-4.5 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-black'}`} />
              <span className="flex-1 truncate">{item.label}</span>
              {isDisabled && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-gray-100 text-gray-500 uppercase tracking-wider scale-90">Locked</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Workspace Footer */}
      <div className="p-4 border-t border-gray-150 text-[10px] text-gray-400 font-mono text-center">
        v1.0.4 • Built in Cloud Environment
      </div>
    </aside>
  );
}
