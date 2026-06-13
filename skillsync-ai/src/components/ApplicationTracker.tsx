import React, { useState, FormEvent } from "react";
import { Plus, Trash2, Calendar, DollarSign, ChevronRight, ChevronLeft, Bell, ClipboardList } from "lucide-react";
import { KanbanTask } from "../types";

export default function ApplicationTracker() {
  const [tasks, setTasks] = useState<KanbanTask[]>([
    { id: "tk_1", title: "Senior UX frontend Lead", company: "Stripe", status: "Offer", salary: "$175,000", date: "2026-06-25", reminder: "Sign contract details" },
    { id: "tk_2", title: "Solutions Developer", company: "Vercel", status: "Interview", salary: "$165,000", date: "2026-06-20", reminder: "Prepare technical slides" },
    { id: "tk_3", title: "Applications Engineer", company: "Meta", status: "Applied", salary: "$195,000", date: "2026-06-15" },
    { id: "tk_4", title: "Junior Web Developer", company: "DeltaCorp", status: "Wishlist", salary: "$100,005", date: "2026-07-01" },
    { id: "tk_5", title: "Product Prototyper", company: "GitHub", status: "Assessment", salary: "$140,000", date: "2026-06-18" }
  ]);

  const [newTitle, setNewTitle] = useState("");
  const [newCompany, setNewCompany] = useState("");
  const [newSalary, setNewSalary] = useState("$120,000");
  const [newStatus, setNewStatus] = useState<KanbanTask["status"]>("Wishlist");
  const [newDate, setNewDate] = useState("");
  const [showForm, setShowForm] = useState(false);

  const columns: KanbanTask["status"][] = ["Wishlist", "Applied", "Assessment", "Interview", "Offer", "Rejected", "Withdrawn"];

  const handleAddTask = (e: FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newCompany) return;
    const task: KanbanTask = {
      id: `tk_${Date.now()}`,
      title: newTitle,
      company: newCompany,
      status: newStatus,
      salary: newSalary,
      date: newDate || new Date().toISOString().split("T")[0]
    };
    setTasks((prev) => [...prev, task]);
    setNewTitle("");
    setNewCompany("");
    setNewSalary("$120,000");
    setNewStatus("Wishlist");
    setNewDate("");
    setShowForm(false);
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleMoveStatus = (id: string, direction: "next" | "prev") => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const currentIdx = columns.indexOf(t.status);
          let nextIdx = currentIdx;
          if (direction === "next" && currentIdx < columns.length - 1) {
            nextIdx += 1;
          } else if (direction === "prev" && currentIdx > 0) {
            nextIdx -= 1;
          }
          return { ...t, status: columns[nextIdx] };
        }
        return t;
      })
    );
  };

  return (
    <div className="space-y-8 animate-fade-in text-[#111827]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-black">Applications Pipeline Tracker</h2>
          <p className="text-sm text-gray-500 font-normal font-sans">Organize current application steps, schedule metrics, and configure interviews pipelines.</p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-[#16A34A] hover:bg-[#15803D] text-white font-semibold text-xs rounded-xl flex items-center space-x-1 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Opportunity</span>
        </button>
      </div>

      {/* Adding opportunity modal style inline dropdown */}
      {showForm && (
        <form onSubmit={handleAddTask} className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm grid grid-cols-1 md:grid-cols-5 gap-4 items-end animate-slide-up">
          <div>
            <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Company</label>
            <input
              type="text"
              required
              value={newCompany}
              onChange={(e) => setNewCompany(e.target.value)}
              placeholder="e.g. Stripe"
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-green-600 font-sans"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Role Title</label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. UX Architect"
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-green-600 font-sans"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Estimated Annual Salary</label>
            <input
              type="text"
              value={newSalary}
              onChange={(e) => setNewSalary(e.target.value)}
              placeholder="e.g. $145,000"
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-green-600 font-sans"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Target Pipeline Stage</label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as any)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold focus:outline-none"
            >
              {columns.map((col, idx) => (
                <option key={idx} value={col}>{col}</option>
              ))}
            </select>
          </div>
          <div className="flex space-x-2">
            <button
              type="submit"
              className="flex-1 py-2 bg-[#111827] text-white hover:bg-black font-semibold text-xs rounded-lg transition-colors text-center"
            >
              Save Job
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-black text-xs font-semibold rounded-lg"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Kanban Board columns wrapper */}
      <div className="overflow-x-auto pb-4">
        <div className="flex space-x-4 min-w-[1000px]">
          {columns.map((col, cIdx) => {
            const colTasks = tasks.filter((t) => t.status === col);
            return (
              <div key={cIdx} className="flex-1 bg-gray-50/50 border border-[#E5E7EB] rounded-2xl p-4 min-h-[420px] max-w-[250px] space-y-4">
                <div className="flex justify-between items-center border-b border-gray-105 pb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-black">{col}</span>
                  <span className="text-[10px] bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full font-bold">
                    {colTasks.length}
                  </span>
                </div>

                <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                  {colTasks.map((t) => (
                    <div key={t.id} className="bg-white border border-[#E5E7EB] rounded-xl p-4 space-y-3 shadow-xs hover:border-[#16A34A] transition-colors relative group">
                      <div>
                        {/* Company & delete buttons */}
                        <div className="flex justify-between items-start">
                          <span className="text-[9px] font-mono font-bold text-[#16A34A] uppercase truncate max-w-[110px]">{t.company}</span>
                          <button
                            onClick={() => handleDeleteTask(t.id)}
                            className="text-gray-300 hover:text-red-500 transition-colors p-0.5"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <h4 className="font-bold text-black text-xs leading-tight truncate mt-1">{t.title}</h4>
                      </div>

                      <div className="flex justify-between items-center text-[10px] text-gray-400 font-semibold font-mono">
                        <span className="text-black font-semibold">{t.salary}</span>
                        <span className="flex items-center space-x-0.5">
                          <Calendar className="w-3 h-3 text-gray-300" />
                          <span>{t.date.slice(5)}</span>
                        </span>
                      </div>

                      {t.reminder && (
                        <div className="p-1 px-2.5 bg-green-50 border border-green-100 rounded text-[9px] font-medium text-green-700 flex items-center space-x-1 font-sans">
                          <Bell className="w-2.5 h-2.5 text-green-600 animate-pulse flex-shrink-0" />
                          <span className="truncate">{t.reminder}</span>
                        </div>
                      )}

                      {/* Move indicators */}
                      <div className="flex justify-between items-center pt-2 border-t border-dashed border-gray-100">
                        <button
                          onClick={() => handleMoveStatus(t.id, "prev")}
                          className="p-1 border border-gray-1 hover:bg-gray-105 rounded text-gray-400 disabled:opacity-20"
                          disabled={cIdx === 0}
                        >
                          <ChevronLeft className="w-3 h-3" />
                        </button>
                        <span className="text-[8px] uppercase tracking-wider text-gray-300 font-bold font-mono">Transition</span>
                        <button
                          onClick={() => handleMoveStatus(t.id, "next")}
                          className="p-1 border border-gray-1 hover:bg-gray-105 rounded text-gray-400 disabled:opacity-20"
                          disabled={cIdx === columns.length - 1}
                        >
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {colTasks.length === 0 && (
                    <div className="text-center py-8 text-[10px] text-gray-400 font-mono italic">
                      Empty tier
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
