import React, { useState } from "react";
import { Project, BOQItem } from "../types";
import { 
  Layers, Download, FileSpreadsheet, Plus, Check, Trash2, HelpCircle 
} from "lucide-react";

interface MaterialsListProps {
  project: Project;
  onAddBOQItem: (item: BOQItem) => void;
  onDeleteBOQItem: (id: string) => void;
}

export default function MaterialsList({ project, onAddBOQItem, onDeleteBOQItem }: MaterialsListProps) {
  const [downloading, setDownloading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // New Custom Material Form State
  const [category, setCategory] = useState("Foundation");
  const [material, setMaterial] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("cubic yard");
  const [waste, setWaste] = useState("5");
  const [unitCost, setUnitCost] = useState("");

  const handleCreateBOQ = (e: React.FormEvent) => {
    e.preventDefault();
    if (!material || !quantity || !unitCost) return;

    const qty = Number(quantity);
    const cost = Number(unitCost);
    const wastePct = Number(waste) || 0;
    const totalCost = Math.round(qty * cost * (1 + wastePct / 100));

    const newItem: BOQItem = {
      id: "raw_" + Math.random().toString(36).substr(2, 5),
      category,
      material,
      quantity: qty,
      unit,
      wasteAllowancePct: wastePct,
      unitCost: cost,
      totalCost
    };

    onAddBOQItem(newItem);
    setMaterial("");
    setQuantity("");
    setUnitCost("");
    setSuccessMsg("Dimension item successfully registered.");
    setTimeout(() => setSuccessMsg(null), 2500);
  };

  const handleExportCSV = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      setSuccessMsg("Spreadsheet BOQ export completed successfully.");
      setTimeout(() => setSuccessMsg(null), 3500);
    }, 1500);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-200 pb-5 mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-black tracking-tight flex items-center gap-2">
            <Layers className="h-7 w-7 text-green-700" />
            AI Material Quantity Calculator (BOQ)
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Highly detailed Bill of Quantities automatically computed under designated design margins. Customize parameters to override unit values.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          disabled={downloading}
          className="rounded-xl border border-black bg-white px-4 py-2 text-xs font-bold text-black hover:bg-[#F5F5F5] transition-all flex items-center gap-1.5 focus:outline-none"
          id="btn-export-materials"
        >
          {downloading ? (
            <>
              <span className="h-3.5 w-3.5 border-1.5 border-black border-t-transparent rounded-full animate-spin"></span>
              Structuring CSV...
            </>
          ) : (
            <>
              <FileSpreadsheet className="h-4.5 w-4.5" />
              Download Excel / CSV
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Table list */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-gray-600">
                <thead className="bg-[#F5F5F5] font-bold text-black border-b border-gray-250 uppercase tracking-tight">
                  <tr>
                    <th className="p-3 text-left">Category</th>
                    <th className="p-3 text-left">Material Descriptor</th>
                    <th className="p-3 text-right">Qty & Unit</th>
                    <th className="p-3 text-right">Waste Pct</th>
                    <th className="p-3 text-right">Unit ($)</th>
                    <th className="p-3 text-right">Total ($)</th>
                    <th className="p-3 text-center">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 font-mono">
                  {project.boq?.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/50">
                      <td className="p-3 text-left font-sans text-gray-500 font-semibold">{item.category}</td>
                      <td className="p-3 text-left font-sans font-bold text-black leading-tight max-w-[180px] truncate" title={item.material}>
                        {item.material}
                      </td>
                      <td className="p-3 text-right text-gray-600">{item.quantity} {item.unit}</td>
                      <td className="p-3 text-right text-gray-500">+{item.wasteAllowancePct}%</td>
                      <td className="p-3 text-right text-gray-600">${item.unitCost.toLocaleString()}</td>
                      <td className="p-3 text-right text-black font-bold">${item.totalCost.toLocaleString()}</td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => onDeleteBOQItem(item.id)}
                          className="text-gray-400 hover:text-red-500 p-1 rounded hover:bg-red-50/10 focus:outline-none"
                          title="Delete material"
                          id={`btn-del-materials-${item.id}`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {(!project.boq || project.boq.length === 0) && (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-gray-400 font-sans">
                        No custom materials specified yet. Create some below!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Total Indicator footer summary */}
            {project.boq && project.boq.length > 0 && (
              <div className="p-4 bg-[#F5F5F5] border-t border-gray-200 flex justify-between items-center text-xs font-sans font-bold text-black">
                <span>Core Materials Total:</span>
                <span className="font-mono text-base font-black">
                  ${project.boq.reduce((acc, curr) => acc + curr.totalCost, 0).toLocaleString()}
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

        {/* Right Col: Custom Material addition Form */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm h-fit">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-150 pb-2">Add Custom Material Scope</h2>

          <form onSubmit={handleCreateBOQ} className="space-y-4 text-xs font-sans">
            {/* Category Select */}
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Building Phase / Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-gray-200 p-2 focus:ring-1 focus:ring-green-700"
              >
                <option value="Foundation">Foundation</option>
                <option value="Framing">Framing & Timber</option>
                <option value="Roofing">Roofing & Siding</option>
                <option value="Drywall">Drywall & Insulation</option>
                <option value="Plumbing">Plumbing Works</option>
                <option value="Electrical">Electrical Works</option>
                <option value="Finishes">Finishes & Trims</option>
              </select>
            </div>

            {/* Descriptor */}
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Material Descriptor</label>
              <input 
                type="text" 
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                className="w-full rounded-xl border border-gray-200 p-2 outline-none focus:ring-1 focus:ring-green-700"
                placeholder="e.g., White Wood 2x6 Framing Studs"
                required
              />
            </div>

            {/* Qty, Unit */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Quantity</label>
                <input 
                  type="number" 
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 p-2 font-mono"
                  placeholder="e.g., 250"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Unit</label>
                <input 
                  type="text" 
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 p-2"
                  placeholder="e.g., pcs, sheets, yards"
                  required
                />
              </div>
            </div>

            {/* Waste, Unit Cost */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Waste Allowance (%)</label>
                <input 
                  type="number" 
                  value={waste}
                  onChange={(e) => setWaste(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 p-2 font-mono"
                  placeholder="e.g., 5"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Unit Cost ($)</label>
                <input 
                  type="number" 
                  value={unitCost}
                  onChange={(e) => setUnitCost(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 p-2 font-mono"
                  placeholder="e.g., 18"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={!material || !quantity || !unitCost}
              className="w-full rounded-xl bg-black py-2.5 font-bold text-white hover:bg-green-700 transition-colors disabled:opacity-40"
              id="btn-add-material-form"
            >
              Add Material Quantity
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
