import { Project } from "../types";
import { 
  Leaf, Info, Check, Sparkles, Footprints, TrendingDown, HelpCircle 
} from "lucide-react";

interface CarbonCalculatorProps {
  project: Project;
}

export default function CarbonCalculator({ project }: CarbonCalculatorProps) {
  const carbon = project.carbon;

  if (!carbon) {
    return (
      <div className="p-8 text-center text-gray-500 font-sans max-w-lg mx-auto">
        <Leaf className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-base font-bold text-black">Awaiting Carbon Metrics</h3>
        <p className="text-xs text-gray-400 mt-1">
          Perform a blueprint and site factors analysis first to construct carbon material footprint schedules.
        </p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto font-sans text-xs">
      <div className="border-b border-gray-200 pb-5 mb-8">
        <h1 className="text-3xl font-extrabold text-black tracking-tight flex items-center gap-2">
          <Leaf className="h-7 w-7 text-green-700" />
          Carbon Footprint & Environmental Index
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Evaluates material-loading CO₂ footprint, transit emissions, and maps sustainability ranks.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Card 1 */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <span className="text-gray-400 font-bold block mb-1">AGGREGATED CO₂ FOOTPRINT</span>
          <span className="text-3xl font-black text-black font-mono">
            {carbon.totalCo2Kgs.toLocaleString()} Kgs
          </span>
          <p className="text-gray-500 mt-1 text-[11px]">Includes foundation slabs and heavy lumber framing transit cycles.</p>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <span className="text-gray-400 font-bold block mb-1">SUSTAINABILITY INDEX</span>
          <span className={`text-3xl font-black font-mono block ${
            carbon.sustainabilityScore >= 80 ? "text-green-700" : "text-amber-500"
          }`}>
            {carbon.sustainabilityScore}/100
          </span>
          <span className="text-[10px] text-green-700 font-bold">Standard BC/US insulation rating compliant</span>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <span className="text-gray-400 font-bold block mb-1">TRANSPORT EMISSIONS</span>
          <span className="text-3xl font-black text-black font-mono">
            {carbon.transportEmissionsKgs.toLocaleString()} Kgs
          </span>
          <p className="text-gray-500 mt-1 text-[11px]">Estimated based on typical 50-mile supply distances.</p>
        </div>
      </div>

      {/* Material Impact Breakdown table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Table list left */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-sm font-bold text-black uppercase tracking-wider mb-4">CO₂ Emissions by Material Class</h3>
          
          <div className="space-y-4">
            {carbon.materialsImpact.map((item, idx) => {
              const isCarbonSink = item.co2Kgs < 0;
              return (
                <div key={idx} className="p-4 rounded-xl border border-gray-200 bg-white">
                  <div className="flex justify-between items-center font-bold text-black">
                    <span>{item.material}</span>
                    <span className={`font-mono ${isCarbonSink ? "text-green-700" : "text-gray-600"}`}>
                      {isCarbonSink ? "" : "+"}{item.co2Kgs.toLocaleString()} Kgs CO₂
                    </span>
                  </div>

                  <div className="mt-3 bg-[#F5F5F5] border border-gray-250 p-2.5 rounded-lg text-[11px] text-gray-600">
                    <span className="font-bold text-green-700 block mb-0.5">Green Alternative product:</span>
                    <span>{item.greenAlternative}</span>
                    <span className="block font-bold text-black font-mono mt-1 text-[10px]">
                      Potential Savings: {item.potentialSavingsKgs.toLocaleString()} Kgs CO₂
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recommendations block right */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm h-fit">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-150 pb-2 flex items-center gap-1.5">
            <Sparkles className="h-4.5 w-4.5 text-green-700" />
            AI Sustainability Advisor
          </h3>
          <p className="text-gray-500 leading-relaxed mb-4">
            Implement clean-energy alternatives below to qualify for active regional building tax credits and elevate your project value.
          </p>
          
          <div className="space-y-3.5">
            {carbon.recommendations.map((rec, i) => (
              <div key={i} className="flex gap-2 p-1 text-gray-600 leading-relaxed">
                <Check className="h-4 w-4 text-green-700 flex-shrink-0 mt-0.5" />
                <span>{rec}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
