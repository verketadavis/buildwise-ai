import React, { useState } from "react";
import { ContractorAudit } from "../types";
import { 
  Building, Activity, ShieldAlert, Sparkles, FileText, CheckCircle, HelpCircle, DollarSign, RefreshCw 
} from "lucide-react";

export default function QuotesAuditor() {
  const [contractorName, setContractorName] = useState("");
  const [amount, setAmount] = useState("");
  const [scopeSqFt, setScopeSqFt] = useState("2000");
  const [quotedText, setQuotedText] = useState("");
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<ContractorAudit | null>(null);

  // Quick template helpers
  const mockTemplates = [
    {
      name: "Summit Ridge Builders LLC",
      cost: "445000",
      sqft: "2200",
      text: "Bid outline: Grading & excavation prep ($45,000), Readyconcrete foundation core ($65,000 using standard markup), Lumber stud wall frames ($98,000), Cedar custom siding ($54,000), Asphalt shingles ($15,000), Drywall framing assembly and paint level-5 finish ($75,000), Mechanical central HVAC ducts and boiler grid ($35,000), Secondary cleanups ($3,500). Framing administrative supervision fee calculated at ($15,000)."
    },
    {
      name: "Metro Structural Group",
      cost: "310000",
      sqft: "1800",
      text: "Proposaland specs: Excavate & grade clay bed ($24,000), Reinforced foundation slab ($35,000), Douglas Fir Stud structures ($48,000), Cladding damp protection ($22,000), Tile roofing ($38,000), Sheet-rock layouts & level-4 sandings ($52,000), Plumbing & wire bundles trim-out ($41,000), Project superintendent cartages ($18,000)."
    }
  ];

  const applyTemplate = (idx: number) => {
    const t = mockTemplates[idx];
    setContractorName(t.name);
    setAmount(t.cost);
    setScopeSqFt(t.sqft);
    setQuotedText(t.text);
  };

  const handleRunAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contractorName || !amount) return;

    setIsAuditing(true);
    try {
      const response = await fetch("/api/quote-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contractorName,
          quotedText,
          amount: Number(amount),
          scopeSqFt: Number(scopeSqFt)
        })
      });
      const data = await response.json();
      setAuditResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAuditing(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto font-sans">
      <div className="border-b border-gray-200 pb-5 mb-8">
        <h1 className="text-3xl font-extrabold text-black tracking-tight flex items-center gap-2">
          <Activity className="h-7 w-7 text-green-700" />
          AI Fraud & Overpricing Detector
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Upload or paste bid lists from local contractors to run localized fairness pricing checks, highlight duplicate materials fees, and flag potential hidden charges.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Bid Input & Templates */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Input Contractor Bid Details</h2>
            
            <form onSubmit={handleRunAudit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Contractor / Sub-firm Name</label>
                <input 
                  type="text" 
                  value={contractorName}
                  onChange={(e) => setContractorName(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 p-2.5 outline-none font-sans text-xs focus:ring-1 focus:ring-green-700"
                  placeholder="e.g., Summit Ridge Builders"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Total Quote Amount ($)</label>
                  <input 
                    type="number" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 p-2.5 outline-none font-mono font-bold text-xs focus:ring-1 focus:ring-green-700"
                    placeholder="e.g., 450000"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Scope Coverage (Sq Ft)</label>
                  <input 
                    type="number" 
                    value={scopeSqFt}
                    onChange={(e) => setScopeSqFt(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 p-2.5 outline-none font-mono text-xs focus:ring-1 focus:ring-green-700"
                    placeholder="e.g., 2000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Proposal Text / Details (paste lines)</label>
                <textarea 
                  value={quotedText}
                  onChange={(e) => setQuotedText(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 p-2.5 outline-none font-mono text-xs focus:ring-1 focus:ring-green-700"
                  rows={6}
                  placeholder="Paste details of the proposal, material items, labor quotes, or general charges list..."
                />
              </div>

              <button
                type="submit"
                disabled={isAuditing || !contractorName || !amount}
                className="w-full rounded-xl bg-black py-3 text-xs font-bold text-white transition-all hover:bg-green-700 disabled:opacity-50 inline-flex items-center justify-center gap-1.5"
                id="btn-trigger-audit"
              >
                {isAuditing ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Analyzing Quote & Quantities...</span>
                  </>
                ) : (
                  <>
                    <FileText className="h-4.5 w-4.5" />
                    <span>Run AI Fraud & Price Audit</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Templates load card */}
          <div className="bg-[#F5F5F5] border border-gray-250 p-5 rounded-2xl">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2.5">Quick Try: Load Sample Quotes</h3>
            <div className="space-y-2 text-xs">
              {mockTemplates.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => applyTemplate(idx)}
                  className="w-full text-left bg-white border border-gray-200 p-3 rounded-xl hover:border-green-700 transition-colors"
                  id={`btn-load-quote-${idx}`}
                >
                  <span className="font-bold text-black block">{item.name}</span>
                  <span className="text-[11px] text-gray-500 block mt-0.5">Estimated budget: ${Number(item.cost).toLocaleString()} for {item.sqft} Sq Ft</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Audit Outcomes */}
        <div className="lg:col-span-7">
          {auditResult ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-6">
              
              {/* Top Banner Row */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-150 pb-4 mb-4 gap-4">
                <div>
                  <h3 className="text-xl font-extrabold text-black">{auditResult.contractorName}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Audited Bid: <span className="font-mono font-bold text-black">${auditResult.totalAmount.toLocaleString()}</span></p>
                </div>

                {/* Fairness Badge */}
                <div className="text-right">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Fairness Score</span>
                  <span className={`inline-block font-mono text-3xl font-black px-3.5 py-1 rounded-xl bg-[#F5F5F5] border border-gray-250 ${
                    auditResult.overallFairnessScore >= 80 ? "text-green-700" : auditResult.overallFairnessScore >= 65 ? "text-amber-500" : "text-red-500"
                  }`}>
                    {auditResult.overallFairnessScore}%
                  </span>
                </div>
              </div>

              {/* General Analysis explanation */}
              <div className="p-4 bg-[#F5F5F5] rounded-xl border border-gray-250 border-l-4 border-l-green-700 text-xs text-gray-600 leading-relaxed">
                <span className="font-bold text-black block mb-1">AI Audit Overview:</span>
                {auditResult.analysisParagraph}
              </div>

              {/* Pricing Flag Indicators */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-gray-250 bg-white">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Detected Markup</span>
                  <span className="text-2xl font-black text-black font-mono">
                    {auditResult.priceMarkupPct}%
                  </span>
                  <span className="text-[10px] text-gray-400 block mt-1">Above fair market indexes</span>
                </div>
                <div className="p-4 rounded-xl border border-gray-250 bg-white">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Pricing Alert</span>
                  <span className={`text-sm font-bold block mt-1 uppercase ${auditResult.priceGougingDetected ? "text-red-500" : "text-green-700"}`}>
                    {auditResult.priceGougingDetected ? "⚠️ Inflated markup detected" : "✓ Fair market bounds"}
                  </span>
                  <span className="text-[10px] text-gray-400 block mt-1">Review flagged items</span>
                </div>
              </div>

              {/* Table of Audited Item Breakdown */}
              <div>
                <h4 className="text-xs font-bold text-black uppercase tracking-wider mb-2">Itemized Materials & Labor Audit</h4>
                <div className="overflow-x-auto rounded-xl border border-gray-200">
                  <table className="w-full text-xs text-left text-gray-600 bg-white">
                    <thead className="bg-[#F5F5F5] text-black font-bold border-b border-gray-200">
                      <tr>
                        <th className="p-3 text-left">Proposed Item</th>
                        <th className="p-3 text-right">Proposed ($)</th>
                        <th className="p-3 text-right">Fair Market ($)</th>
                        <th className="p-3 text-right">Variance</th>
                        <th className="p-3 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 font-mono">
                      {auditResult.auditedItems.map((item, idx) => (
                        <tr key={idx} className="hover:bg-gray-50/50">
                          <td className="p-3 text-left font-sans font-semibold text-black leading-tight">
                            {item.item}
                            {item.reason && (
                              <span className="block font-sans text-[10px] text-gray-400 font-normal mt-0.5">{item.reason}</span>
                            )}
                          </td>
                          <td className="p-3 text-right text-gray-600">${item.proposedCost.toLocaleString()}</td>
                          <td className="p-3 text-right text-green-700">${item.fairMarketCost.toLocaleString()}</td>
                          <td className={`p-3 text-right font-bold ${item.variancePct > 15 ? 'text-red-500 font-black' : 'text-gray-500'}`}>
                            +{item.variancePct}%
                          </td>
                          <td className="p-3 text-center">
                            <span className={`inline-block h-2 w-2 rounded-full ${item.flagged ? "bg-red-500" : "bg-green-700"}`}></span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Red Flags & Hidden Fees */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl border border-gray-200 bg-white space-y-2">
                  <h4 className="text-xs font-bold text-black uppercase tracking-wider flex items-center gap-1.5 text-red-500">
                    <ShieldAlert className="h-4 w-4" /> Suspicious Red Flags
                  </h4>
                  <ul className="list-disc pl-4 space-y-1 text-[11px] text-gray-500 leading-relaxed font-sans">
                    {auditResult.redFlags.map((flag, i) => (
                      <li key={i}>{flag}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-gray-200 bg-white space-y-2">
                  <h4 className="text-xs font-bold text-black uppercase tracking-wider flex items-center gap-1.5 text-amber-500">
                    <ShieldAlert className="h-4 w-4" /> Sneaky Hidden Fees Found
                  </h4>
                  <ul className="list-disc pl-4 space-y-1 text-[11px] text-gray-500 leading-relaxed font-sans">
                    {auditResult.hiddenFees.map((fee, i) => (
                      <li key={i}>{fee}</li>
                    ))}
                  </ul>
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm text-center flex flex-col items-center justify-center min-h-[400px]">
              <div className="h-14 w-14 rounded-2xl bg-[#F5F5F5] text-gray-400 flex items-center justify-center mb-4">
                <ShieldAlert className="h-7 w-7" />
              </div>
              <h3 className="text-base font-bold text-black">Awaiting Bid Sheets Audit</h3>
              <p className="text-xs text-gray-400 mt-1 max-w-sm">
                Paste the text elements of your local contractor quotes on the left to review material price gouging, labor inflate margins, and hidden surcharge fees automatically.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
