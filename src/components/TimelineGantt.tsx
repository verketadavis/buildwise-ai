import React, { useState } from "react";
import { Project, TimelineItem } from "../types";
import { 
  Calendar, CheckCircle, AlertTriangle, Plus, Trash2, ArrowRight, Activity, CloudSun 
} from "lucide-react";

interface TimelineGanttProps {
  project: Project;
  onAddTimelineItem: (item: TimelineItem) => void;
  onDeleteTimelineItem: (id: string) => void;
}

export default function TimelineGantt({ project, onAddTimelineItem, onDeleteTimelineItem }: TimelineGanttProps) {
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Custom task form state
  const [task, setTask] = useState("");
  const [week, setWeek] = useState("");
  const [duration, setDuration] = useState("");
  const [dependencies, setDependencies] = useState("");
  const [weatherRisk, setWeatherRisk] = useState<"Low" | "Medium" | "High">("Low");
  const [isCritical, setIsCritical] = useState(false);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!task || !week || !duration) return;

    const dependencyList = dependencies ? dependencies.split(",").map(s => s.trim()) : [];

    const newItem: TimelineItem = {
      id: "t_" + Math.random().toString(36).substr(2, 5),
      week: Number(week),
      task,
      durationWeeks: Number(duration),
      dependencies: dependencyList,
      weatherRisk,
      isCriticalPath: isCritical
    };

    onAddTimelineItem(newItem);
    setTask("");
    setWeek("");
    setDuration("");
    setDependencies("");
    setIsCritical(false);
    setSuccessMsg("Timeline sequence registered.");
    setTimeout(() => setSuccessMsg(null), 2500);
  };

  const sortedTimeline = project.timeline?.sort((a,b) => a.week - b.week) || [];

  return (
    <div className="p-8 max-w-5xl mx-auto font-sans">
      <div className="border-b border-gray-200 pb-5 mb-8">
        <h1 className="text-3xl font-extrabold text-black tracking-tight flex items-center gap-2">
          <Calendar className="h-7 w-7 text-green-700" />
          AI Construction Schedule & Gantt
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Pre-structures milestone sequences, handles dependencies, and calculates weather risk weights dynamically based on region factors.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Visual Gantt List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-1">
              <CloudSun className="h-4 w-4 text-green-700 animate-pulse" />
              Week-by-week Progress Chart
            </h2>

            <div className="space-y-4">
              {sortedTimeline.map((item) => (
                <div key={item.id} className="p-4 rounded-xl border border-gray-200 bg-white hover:border-green-700 hover:shadow-sm transition-all group">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-black text-white">
                          Week {item.week}
                        </span>
                        <h3 className="text-xs font-bold text-black font-sans leading-tight">{item.task}</h3>
                        {item.isCriticalPath && (
                          <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-red-50 text-red-500 uppercase tracking-wider">Critical Path</span>
                        )}
                      </div>
                      
                      {item.dependencies.length > 0 && (
                        <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                          <span>Awaits tasks:</span>
                          <span className="font-mono bg-gray-100 px-1.5 rounded text-gray-600">{item.dependencies.join(", ")}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <div className="text-right">
                        <span className="text-[10px] text-gray-400 block">Duration:</span>
                        <span className="font-mono font-bold text-black text-xs">{item.durationWeeks} weeks</span>
                      </div>
                      
                      <div className="border-l border-gray-200 h-8"></div>

                      <div className="text-center">
                        <span className="text-[10px] text-gray-400 block">Weather Risk:</span>
                        <span className={`text-[10px] font-semibold ${
                          item.weatherRisk === "High" ? "text-red-500" : item.weatherRisk === "Medium" ? "text-amber-500" : "text-green-700"
                        }`}>{item.weatherRisk}</span>
                      </div>

                      <button
                        onClick={() => onDeleteTimelineItem(item.id)}
                        className="text-gray-300 hover:text-red-500 p-1.5 rounded transition-all focus:outline-none"
                        title="Delete checkpoint"
                        id={`btn-del-timeline-${item.id}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Horizontal progress representation Bar */}
                  <div className="mt-3.5 grid grid-cols-16 h-1.5 bg-[#F5F5F5] rounded-full overflow-hidden">
                    <div 
                      className={`h-1.5 rounded-full ${item.isCriticalPath ? 'bg-red-500' : 'bg-green-700'}`}
                      style={{ 
                        gridColumnStart: Math.max(1, Math.round(item.week)), 
                        gridColumnEnd: Math.min(17, Math.round(item.week) + Math.max(1, Math.round(item.durationWeeks)))
                      }}
                    ></div>
                  </div>
                </div>
              ))}

              {sortedTimeline.length === 0 && (
                <div className="p-8 text-center text-gray-400 text-xs">
                  No timeline sequence created. Try analyzing blueprint CAD plans to lay weekly tasks automatically.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Add Timeline Item form */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm h-fit">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-150 pb-2">Modify Schedule Parameters</h2>

          <form onSubmit={handleCreateTask} className="space-y-4 text-xs font-sans">
            {/* Task Name */}
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Task Descriptor</label>
              <input 
                type="text" 
                value={task}
                onChange={(e) => setTask(e.target.value)}
                className="w-full rounded-xl border border-gray-200 p-2.5 outline-none focus:ring-1 focus:ring-green-700 text-black font-semibold"
                placeholder="e.g., Pour slabs curing concrete foundation"
                required
              />
            </div>

            {/* Week & Duration */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Start Week</label>
                <input 
                  type="number" 
                  value={week}
                  onChange={(e) => setWeek(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 p-2 font-mono"
                  placeholder="e.g., 2"
                  min="1"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Duration (Weeks)</label>
                <input 
                  type="number" 
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 p-2 font-mono"
                  placeholder="e.g., 1.5"
                  step="0.5"
                  required
                />
              </div>
            </div>

            {/* Dependencies */}
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Dependencies (Comma separated list)</label>
              <input 
                type="text" 
                value={dependencies}
                onChange={(e) => setDependencies(e.target.value)}
                className="w-full rounded-xl border border-gray-200 p-2 text-xs"
                placeholder="e.g., t1, t2"
              />
            </div>

            {/* Weather Risk */}
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Weather Delay Exposure</label>
              <select
                value={weatherRisk}
                onChange={(e) => setWeatherRisk(e.target.value as any)}
                className="w-full rounded-xl border border-gray-200 p-2 font-semibold"
              >
                <option value="Low">Low Risk</option>
                <option value="Medium">Medium Risk</option>
                <option value="High">High Surcharge Risk</option>
              </select>
            </div>

            {/* Critical Path toggle */}
            <div className="flex items-center gap-2">
              <input 
                type="checkbox"
                checked={isCritical}
                onChange={(e) => setIsCritical(e.target.checked)}
                className="rounded border-gray-300 active:ring-green-700 h-4 w-4"
                id="checkbox-critical"
              />
              <label htmlFor="checkbox-critical" className="block text-xs font-bold text-gray-600">
                Mark task as Critical Path item
              </label>
            </div>

            <button
              type="submit"
              disabled={!task || !week || !duration}
              className="w-full rounded-xl bg-black py-2.5 font-bold text-white hover:bg-green-700 transition-all text-xs"
              id="btn-add-timeline-form"
            >
              Merge Schedule Task
            </button>
          </form>

          {successMsg && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 text-green-700 font-bold rounded-xl text-center text-xs">
              {successMsg}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
