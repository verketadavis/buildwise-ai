import React, { useState } from "react";
import { Project, LaborItem } from "../types";
import { 
  Users, HardHat, Plus, Check, Trash2, HelpCircle 
} from "lucide-react";

interface LaborEstimatorProps {
  project: Project;
  onAddLaborItem: (item: LaborItem) => void;
  onDeleteLaborItem: (id: string) => void;
}

export default function LaborEstimator({ project, onAddLaborItem, onDeleteLaborItem }: LaborEstimatorProps) {
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Custom trade forms state
  const [trade, setTrade] = useState("Masonry & Concrete Works");
  const [crewSize, setCrewSize] = useState("");
  const [hoursNeeded, setHoursNeeded] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [productivity, setProductivity] = useState("");

  const handleCreateLabor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!crewSize || !hoursNeeded || !hourlyRate) return;

    const size = Number(crewSize);
    const hrs = Number(hoursNeeded);
    const rate = Number(hourlyRate);
    const totalCost = Math.round(size * hrs * rate);

    const newItem: LaborItem = {
      id: "labor_" + Math.random().toString(36).substr(2, 5),
      trade,
      crewSize: size,
      hoursNeeded: hrs,
      hourlyRate: rate,
      totalCost,
      productivityAssumptions: productivity || "Standard crew efficiency under direct supervisor watch."
    };

    onAddLaborItem(newItem);
    setCrewSize("");
    setHoursNeeded("");
    setHourlyRate("");
    setProductivity("");
    setSuccessMsg("Trade labor specifications merged.");
    setTimeout(() => setSuccessMsg(null), 2500);
  };

  const calculateTotalLaborCost = () => {
    return project.labor?.reduce((acc, curr) => acc + curr.totalCost, 0) || 0;
  };

  return (
    <div className="p-8 max-w-5xl mx-auto font-sans">
      <div className="border-b border-gray-200 pb-5 mb-8">
        <h1 className="text-3xl font-extrabold text-black tracking-tight flex items-center gap-2">
          <Users className="h-7 w-7 text-green-700" />
          AI Labor Estimator
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Evaluates crew size dependencies, hourly wages, and regional workforce productivity index. Custom trades are fully adjustable.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: List trades */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden text-xs font-sans">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-gray-600">
                <thead className="bg-[#F5F5F5] font-bold text-black border-b border-gray-250 uppercase tracking-tight">
                  <tr>
                    <th className="p-3">Specialized Trade</th>
                    <th className="p-3 text-right">Crew Size</th>
                    <th className="p-3 text-right">Duration (Hrs)</th>
                    <th className="p-3 text-right">Hourly Rate ($)</th>
                    <th className="p-3 text-right">Trade Cost ($)</th>
                    <th className="p-3 text-center">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 font-mono">
                  {project.labor?.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/50">
                      <td className="p-3 text-left font-sans font-bold text-black leading-tight max-w-[150px] truncate" title={item.trade}>
                        {item.trade}
                        <span className="block text-[10px] text-gray-400 font-normal leading-relaxed mt-0.5">{item.productivityAssumptions}</span>
                      </td>
                      <td className="p-3 text-right text-gray-600 font-sans">{item.crewSize} workers</td>
                      <td className="p-3 text-right text-gray-600">{item.hoursNeeded} hrs</td>
                      <td className="p-3 text-right text-gray-600">${item.hourlyRate.toLocaleString()}</td>
                      <td className="p-3 text-right text-black font-extrabold">${item.totalCost.toLocaleString()}</td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => onDeleteLaborItem(item.id)}
                          className="text-gray-400 hover:text-red-500 p-1 rounded focus:outline-none"
                          title="Delete trade"
                          id={`btn-del-labor-${item.id}`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {(!project.labor || project.labor.length === 0) && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-gray-400 font-sans">
                        No labor crew specifications defined yet. Generate by analyzing blueprints.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {project.labor && project.labor.length > 0 && (
              <div className="p-4 bg-[#F5F5F5] border-t border-gray-200 flex justify-between items-center font-bold text-black">
                <span>Calculated Total Labor Budget:</span>
                <span className="font-mono text-base font-black">
                  ${calculateTotalLaborCost().toLocaleString()}
                </span>
              </div>
            )}
          </div>

          {successMsg && (
            <div className="p-3 bg-green-50 border border-green-200 text-green-700 font-bold rounded-xl text-xs flex items-center gap-1.5 justify-center">
              <Check className="h-4 w-4" /> {successMsg}
            </div>
          )}
        </div>

        {/* Right Column: Custom Trade addition form */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm h-fit">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-150 pb-2">Modify Crew Allocation</h2>

          <form onSubmit={handleCreateLabor} className="space-y-4 text-xs font-sans">
            {/* Trade Select */}
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Crew Specialty</label>
              <select
                value={trade}
                onChange={(e) => setTrade(e.target.value)}
                className="w-full rounded-xl border border-gray-200 p-2 focus:ring-1 focus:ring-green-700 font-semibold"
              >
                <option value="Masonry & Concrete Works">Masonry & Concrete Works</option>
                <option value="Framing Carpentry">Framing Carpentry</option>
                <option value="Roofing Joinery">Roofing Joinery</option>
                <option value="Plumbing Installation">Plumbing Installation</option>
                <option value="Electrical Setup">Electrical Setup</option>
                <option value="HVAC Mechanical Installation">HVAC Mechanical Installation</option>
                <option value="Drywall Splicing & Finishes">Drywall Splicing & Finishes</option>
                <option value="Xeriscaping Landscapers">Xeriscaping Landscapers</option>
              </select>
            </div>

            {/* Crew Size, Hours */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Crew Size (Workers)</label>
                <input 
                  type="number" 
                  value={crewSize}
                  onChange={(e) => setCrewSize(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 p-2 font-mono"
                  placeholder="e.g., 3"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Duration (Hours)</label>
                <input 
                  type="number" 
                  value={hoursNeeded}
                  onChange={(e) => setHoursNeeded(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 p-2 font-mono"
                  placeholder="e.g., 120"
                  required
                />
              </div>
            </div>

            {/* Hourly rates */}
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Hourly Crew Rate ($/Hr/Worker)</label>
              <input 
                type="number" 
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                className="w-full rounded-xl border border-gray-200 p-2 font-mono"
                placeholder="e.g., 48"
                required
              />
            </div>

            {/* Assumptions */}
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Productivity Assumptions / Tools</label>
              <input 
                type="text" 
                value={productivity}
                onChange={(e) => setProductivity(e.target.value)}
                className="w-full rounded-xl border border-gray-200 p-2"
                placeholder="e.g., Uses heavy concrete mixer and standard rebar ties."
              />
            </div>

            <button
              type="submit"
              disabled={!crewSize || !hoursNeeded || !hourlyRate}
              className="w-full rounded-xl bg-black py-2.5 font-bold text-white hover:bg-green-700 transition-colors disabled:opacity-40"
              id="btn-add-labor-form"
            >
              Merge Labor Crew Specs
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
