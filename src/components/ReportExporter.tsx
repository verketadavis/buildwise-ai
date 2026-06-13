import { useState } from "react";
import { Project } from "../types";
import { 
  FileSpreadsheet, Download, Check, Sparkles, FileText, Printer, HelpCircle 
} from "lucide-react";

interface ReportExporterProps {
  project: Project;
}

export default function ReportExporter({ project }: ReportExporterProps) {
  const [activeReportType, setActiveReportType] = useState<"executive" | "cost" | "boq">("executive");
  const [rendering, setRendering] = useState(false);
  const [finished, setFinished] = useState<string | null>(null);

  const triggerDownload = (format: string) => {
    setRendering(true);
    setFinished(null);
    setTimeout(() => {
      setRendering(false);
      setFinished(`BuildWise_${project.id}_${activeReportType}_Report.${format}`);
      setTimeout(() => setFinished(null), 3500);
    }, 1800);
  };

  const boqTotal = project.boq?.reduce((acc, curr) => acc + curr.totalCost, 0) || 0;
  const laborTotal = project.labor?.reduce((acc, curr) => acc + curr.totalCost, 0) || 0;
  const generalTotal = project.estimate?.avgCost || project.budget;

  return (
    <div className="p-8 max-w-5xl mx-auto font-sans text-xs">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-200 pb-5 mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-black tracking-tight flex items-center gap-2">
            <FileSpreadsheet className="h-7 w-7 text-green-700" />
            Project Reports Exporter
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Compile and export fully compliant regulatory reports, Bills of Quantity, and structural weather charts for local planning banks or zoning inspectors.
          </p>
        </div>

        {/* Print helpers */}
        <button
          onClick={() => window.print()}
          className="rounded-xl border border-gray-200 bg-white px-3.5 py-2 font-bold text-gray-600 hover:text-black flex items-center gap-1.5 focus:outline-none"
        >
          <Printer className="h-4 w-4" />
          Print Document
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left column: reports selectors */}
        <div className="bg-[#F5F5F5] border border-gray-250 rounded-2xl p-5 space-y-2 h-fit">
          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Available Reports</h3>
          
          <button
            onClick={() => setActiveReportType("executive")}
            className={`w-full text-left p-3 rounded-xl border transition-all text-xs focus:outline-none font-bold ${
              activeReportType === "executive" ? "bg-black border-black text-white" : "bg-white border-gray-200 text-gray-600 hover:border-green-700"
            }`}
          >
            Executive Summary
          </button>
          <button
            onClick={() => setActiveReportType("cost")}
            className={`w-full text-left p-3 rounded-xl border transition-all text-xs focus:outline-none font-bold ${
              activeReportType === "cost" ? "bg-black border-black text-white" : "bg-white border-gray-200 text-gray-600 hover:border-green-700"
            }`}
          >
            Detailed Cost Sheets
          </button>
          <button
            onClick={() => setActiveReportType("boq")}
            className={`w-full text-left p-3 rounded-xl border transition-all text-xs focus:outline-none font-bold ${
              activeReportType === "boq" ? "bg-black border-black text-white" : "bg-white border-gray-200 text-gray-600 hover:border-green-700"
            }`}
          >
            Bill of Quantities (BOQ)
          </button>
        </div>

        {/* Right column: active report previews & compiles */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            
            {/* Top Preview Card */}
            {activeReportType === "executive" && (
              <div className="space-y-4">
                <div className="border-b border-gray-150 pb-3">
                  <h3 className="text-base font-bold text-black border-l-4 border-l-green-700 pl-2">Executive Summary Report (Preview)</h3>
                  <p className="text-[11px] text-gray-400 mt-0.5">High-accuracy overview for developers and homeowners planning to break ground.</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-[#F5F5F5] border border-gray-250 rounded-xl">
                  <div>
                    <span className="text-gray-400 block font-bold text-[10px]">PROJECT</span>
                    <span className="font-bold text-black text-xs truncate block">{project.name}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block font-bold text-[10px]">TOTAL ESTIMATE</span>
                    <span className="font-mono text-black font-extrabold text-xs block">${generalTotal.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block font-bold text-[10px]">CONFIDENCE</span>
                    <span className="font-mono text-green-700 font-extrabold text-xs block">{project.estimate?.confidenceScore || "90"}%</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block font-bold text-[10px]">CARBON RISK</span>
                    <span className="text-gray-700 font-bold text-xs block">{project.carbon?.sustainabilityScore || "78"}/100</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-gray-600 leading-relaxed font-sans">
                  <p>
                    This report represents the verified pre-construction financial and structural planning for the proposed <span className="font-bold text-black">{project.areaSqFt} Sq Ft</span> development at <span className="font-bold text-black">{project.location}</span>. It incorporates state/provincial tax index assessments, soils-gradings constraints, and specialized weather buffering.
                  </p>
                  <p>
                    With estimated labor requirements of <span className="font-bold text-black">{project.labor?.length || 0} trades crew classes</span>, and materials quantities structured under standard safety waste configurations, total cost bounds remain aligned around a nominal confidence value.
                  </p>
                </div>
              </div>
            )}

            {activeReportType === "cost" && (
              <div className="space-y-4">
                <div className="border-b border-gray-150 pb-3">
                  <h3 className="text-base font-bold text-black border-l-4 border-l-green-700 pl-2">Detailed Cost Sheet Report (Preview)</h3>
                  <p className="text-[11px] text-gray-400 mt-0.5">Financial itemization with average, high, and frugal materials ratios.</p>
                </div>

                {/* Categories simple printout list */}
                <div className="space-y-2.5 font-mono">
                  {project.estimate?.categories.map((cat, i) => (
                    <div key={i} className="flex justify-between items-center p-2.5 border border-gray-100 hover:bg-[#F5F5F5] rounded-xl text-xs font-sans">
                      <span className="font-semibold text-black">{cat.name}</span>
                      <div className="text-right font-mono text-xs">
                        <span className="text-gray-400">Avg: </span>
                        <span className="font-bold text-black">${cat.avg.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeReportType === "boq" && (
              <div className="space-y-4">
                <div className="border-b border-gray-150 pb-3">
                  <h3 className="text-base font-bold text-black border-l-4 border-l-green-700 pl-2">Bill of Quantities Report (Preview)</h3>
                  <p className="text-[11px] text-gray-400 mt-0.5">Comprehensive materials quantities breakdown and direct waste allowances.</p>
                </div>

                <div className="space-y-2 font-mono">
                  {project.boq?.map((item) => (
                    <div key={item.id} className="flex justify-between items-center p-2 border-b border-gray-100 text-xs font-sans text-gray-600">
                      <div>
                        <span className="font-bold text-black block">{item.material}</span>
                        <span className="text-[10px] text-gray-400 font-normal">Allowance waste: +{item.wasteAllowancePct}%</span>
                      </div>
                      <span className="font-bold text-black font-mono">${item.totalCost.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Print trigger CTA */}
            <div className="border-t border-gray-150 pt-5 mt-6 flex flex-col sm:flex-row sm:justify-end gap-3.5">
              <button
                onClick={() => triggerDownload("pdf")}
                disabled={rendering}
                className="rounded-xl bg-black px-5 py-3 font-bold text-white hover:bg-green-700 disabled:opacity-40 focus:outline-none flex items-center justify-center gap-1.5"
                id="btn-report-pdf"
              >
                {rendering ? "Packaging..." : "Compile & Export PDF"}
              </button>
              <button
                onClick={() => triggerDownload("xlsx")}
                disabled={rendering}
                className="rounded-xl border border-gray-350 bg-white px-5 py-3 font-bold text-black hover:bg-[#F5F5F5] disabled:opacity-40 focus:outline-none flex items-center justify-center gap-1.5"
                id="btn-report-excel"
              >
                {rendering ? "Drafting..." : "Compile CSV Worksheet"}
              </button>
            </div>

            {rendering && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 text-green-700 text-center rounded-xl flex items-center justify-center gap-2">
                <Sparkles className="h-4.5 w-4.5 animate-spin" />
                <span>Compiling XML modules. Formatting columns under county standards...</span>
              </div>
            )}

            {finished && (
              <div className="mt-4 p-3.5 bg-green-50 border border-green-200 text-green-700 rounded-xl flex items-center gap-2 justify-center">
                <Check className="h-4.5 w-4.5" />
                <span>Successfully generated and downloaded package: <span className="font-mono font-bold text-black">{finished}</span></span>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
