import React, { useState } from "react";
import { Project } from "../types";
import { 
  FileText, Upload, Compass, ArrowRight, Eye, RefreshCw, Layers, Sparkles, Building, Check, Edit3 
} from "lucide-react";

interface BlueprintAnalyzerProps {
  project: Project;
  onUpdateProjectDimensions: (dims: { areaSqFt: number; stories: number; roomsCount: number; foundationType: string; roofType: string }) => void;
  onAnalyzeProject: () => Promise<void>;
  isAnalyzing: boolean;
}

export default function BlueprintAnalyzer({ 
  project, 
  onUpdateProjectDimensions, 
  onAnalyzeProject, 
  isAnalyzing 
}: BlueprintAnalyzerProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [scanStep, setScanStep] = useState<string | null>(null);
  
  // Dimensions inputs
  const [area, setArea] = useState(project.areaSqFt);
  const [stories, setStories] = useState(project.stories);
  const [rooms, setRooms] = useState(project.roomsCount);
  const [foundation, setFoundation] = useState(project.foundationType);
  const [roof, setRoof] = useState(project.roofType);
  const [isSaved, setIsSaved] = useState(false);

  const mockPreloadedBlueprints = [
    { name: "Symmetric Ranch Dwelling CAD.dwg", size: "14.2 MB", area: 1800, stories: 1, rooms: 3, foundation: "Slab on Grade", roof: "Asphalt Shingles" },
    { name: "Multi-Storey Mountain Chalet DXF.dxf", size: "22.8 MB", area: 2800, stories: 2.5, rooms: 5, foundation: "Piers with deep tie-ins", roof: "Metal Standing-Seam" },
    { name: "Urban Modern Microhouse PDF.pdf", size: "4.5 MB", area: 950, stories: 2, rooms: 2, foundation: "Slab on Grade", roof: "Flat Green Roof" }
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file.name);
      simulateScanning(file.name, 1750, 2, 4, "Slab on Grade", "Asphalt Shingles");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const name = e.target.files[0].name;
      setSelectedFile(name);
      simulateScanning(name, 1950, 2, 4, "Slab on Grade", "Flat Green Roof");
    }
  };

  const selectPreload = (name: string, pArea: number, pStories: number, pRooms: number, pFound: string, pRoof: string) => {
    setSelectedFile(name);
    simulateScanning(name, pArea, pStories, pRooms, pFound, pRoof);
  };

  const simulateScanning = (fileName: string, pArea: number, pStories: number, pRooms: number, pFound: string, pRoof: string) => {
    setScanStep("Reading CAD Vector Polylines...");
    setTimeout(() => {
      setScanStep("Slicing envelope boundaries & structural studs...");
    }, 1200);
    setTimeout(() => {
      setScanStep("Locating plumbing nodes and central HVAC ventilation ducts...");
    }, 2400);
    setTimeout(() => {
      setScanStep("Completed Blueprint Scan!");
      setArea(pArea);
      setStories(pStories);
      setRooms(pRooms);
      setFoundation(pFound);
      setRoof(pRoof);
      
      // Notify parent to append parameters
      onUpdateProjectDimensions({
        areaSqFt: pArea,
        stories: pStories,
        roomsCount: pRooms,
        foundationType: pFound,
        roofType: pRoof
      });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }, 3600);
  };

  const handleManualSave = () => {
    onUpdateProjectDimensions({
      areaSqFt: Number(area),
      stories: Number(stories),
      roomsCount: Number(rooms),
      foundationType: foundation,
      roofType: roof
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto font-sans">
      <div className="border-b border-gray-200 pb-5 mb-8">
        <h1 className="text-3xl font-extrabold text-black tracking-tight flex items-center gap-2">
          <Eye className="h-7 w-7 text-green-700" />
          AI Blueprint Analyzer
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Upload PDF, DWG (CAD drawings), or image sheets to parse building areas, room structures, roofing specifications, and material constraints.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Interaction Block */}
        <div className="lg:col-span-2 space-y-8">
          {/* File Upload Dropzone */}
          <div 
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all bg-white flex flex-col items-center justify-center ${
              dragActive ? "border-green-700 bg-green-50/10" : "border-gray-300 hover:border-green-700"
            }`}
          >
            <div className="h-12 w-12 rounded-xl bg-green-50 text-green-700 flex items-center justify-center mb-4 shadow-sm">
              <Upload className="h-6 w-6" />
            </div>
            
            <h3 className="text-sm font-bold text-black font-sans mb-1">Drag and drop your project blueprints here</h3>
            <p className="text-xs text-gray-400 font-sans max-w-sm mb-4">
              Supports standard vector PDF, DWG, DXF, PNG, and architectural BIM exports up to 50MB.
            </p>
            
            <label className="cursor-pointer rounded-xl bg-black px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-green-700">
              Browse Local Plans
              <input 
                type="file" 
                className="hidden" 
                accept=".pdf,.dwg,.dxf,.png,.jpg,.jpeg" 
                onChange={handleFileChange}
              />
            </label>

            {selectedFile && (
              <div className="mt-6 p-3 rounded-xl bg-[#F5F5F5] border border-gray-250 text-xs font-mono text-gray-600 flex items-center gap-2">
                <FileText className="h-4.5 w-4.5 text-green-700" />
                <span>Active Plan: {selectedFile}</span>
              </div>
            )}
          </div>

          {/* AI Extraction Progress */}
          {scanStep && (
            <div className="p-5 bg-[#F5F5F5] rounded-xl border border-gray-250 font-sans">
              <div className="flex items-center justify-between text-xs font-bold text-black mb-3">
                <div className="flex items-center gap-2 text-green-700 uppercase tracking-wider">
                  <Sparkles className="h-4 w-4 animate-spin" />
                  <span>{scanStep}</span>
                </div>
                <span>{scanStep.includes("Completed") ? "100%" : "Processing Layout"}</span>
              </div>
              <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                <div 
                  className={`bg-green-700 h-1.5 rounded-full transition-all duration-700 ${
                    scanStep.includes("CAD") ? "w-1/4" : scanStep.includes("envelope") ? "w-1/2" : scanStep.includes("ducts") ? "w-3/4" : "w-full"
                  }`}
                ></div>
              </div>
            </div>
          )}

          {/* Preloaded sample CAD buttons for instant checks */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Sample CAD Schematics - Instant AI Tryout</h3>
            <div className="space-y-3">
              {mockPreloadedBlueprints.map((mockPlan, i) => (
                <button
                  key={i}
                  onClick={() => selectPreload(mockPlan.name, mockPlan.area, mockPlan.stories, mockPlan.rooms, mockPlan.foundation, mockPlan.roof)}
                  className="w-full flex items-center justify-between p-3.5 border border-gray-200 hover:border-green-700 hover:bg-green-50/10 rounded-xl transition-all text-left text-xs bg-white text-gray-600"
                  id={`btn-preload-plan-${i}`}
                >
                  <span className="font-bold text-black flex items-center gap-2">
                    <Layers className="h-4 w-4 text-green-700" />
                    {mockPlan.name}
                  </span>
                  <span className="text-gray-400 font-mono text-[11px]">{mockPlan.size}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Detected Measurements Editor Panel */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm h-fit">
          <div className="border-b border-gray-150 pb-3 mb-4 flex items-center justify-between">
            <h2 className="text-sm font-bold text-black flex items-center gap-2 uppercase tracking-wide">
              <Compass className="h-4.5 w-4.5 text-green-700" />
              Detected Measurements
            </h2>
            <span className="text-[10px] text-gray-400 font-mono">Editable</span>
          </div>

          <p className="text-xs text-gray-500 leading-relaxed mb-4">
            AI automatically extracts coordinates. You can override detected dimensions below before rendering final Bills of Quantity and labor crew structures.
          </p>

          <div className="space-y-4 text-xs font-sans">
            {/* Input 1: Floor Area */}
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Building Area (Sq Ft)</label>
              <div className="relative">
                <input 
                  type="number"
                  value={area}
                  onChange={(e) => setArea(Number(e.target.value))}
                  className="w-full rounded-xl border border-gray-300 p-2.5 outline-none font-mono font-bold text-black bg-white focus:ring-1 focus:ring-green-700"
                  placeholder="Total footprint size"
                />
              </div>
            </div>

            {/* Input 2: Stories */}
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Stories Count</label>
              <input 
                type="number"
                value={stories}
                onChange={(e) => setStories(Number(e.target.value))}
                className="w-full rounded-xl border border-gray-300 p-2.5 outline-none font-mono font-bold text-black bg-white focus:ring-1 focus:ring-green-700"
                step="0.5"
                placeholder="Levels"
              />
            </div>

            {/* Input 3: Rooms Count */}
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Rooms count</label>
              <input 
                type="number"
                value={rooms}
                onChange={(e) => setRooms(Number(e.target.value))}
                className="w-full rounded-xl border border-gray-300 p-2.5 outline-none font-mono font-bold text-black bg-white focus:ring-1 focus:ring-green-700"
                placeholder="Bedrooms + functional rooms"
              />
            </div>

            {/* Input 4: Foundation Type */}
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Foundation Type</label>
              <select
                value={foundation}
                onChange={(e) => setFoundation(e.target.value)}
                className="w-full rounded-xl border border-gray-300 p-2.5 outline-none font-sans font-bold text-black bg-white focus:ring-1 focus:ring-green-700"
              >
                <option value="Slab on Grade">Slab on Grade</option>
                <option value="Deep Crawl Space with Piers">Deep Crawl Space with Piers</option>
                <option value="Concrete Basement Floor">Concrete Basement Floor</option>
                <option value="Slab supported by Helical Screw Piles">Slab with Helical Piles</option>
              </select>
            </div>

            {/* Input 5: Roof Type */}
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Roof Type</label>
              <select
                value={roof}
                onChange={(e) => setRoof(e.target.value)}
                className="w-full rounded-xl border border-gray-300 p-2.5 outline-none font-sans font-bold text-black bg-white focus:ring-1 focus:ring-green-700"
              >
                <option value="Asphalt Shingles">Asphalt Shingles</option>
                <option value="Flat Green Roof">Flat Green Roof</option>
                <option value="Metal Standing-Seam">Metal Standing-Seam</option>
                <option value="Concrete Slabs">Concrete Slabs</option>
              </select>
            </div>

            {/* Actions */}
            <div className="pt-2 space-y-2">
              <button
                onClick={handleManualSave}
                className="w-full rounded-xl border border-black bg-white py-2.5 font-bold text-black hover:bg-[#F5F5F5] transition-all text-xs"
                id="btn-override-save"
              >
                Save Structural Overrides
              </button>

              <button
                onClick={onAnalyzeProject}
                disabled={isAnalyzing}
                className="w-full rounded-xl bg-green-700 py-3 font-bold text-white hover:bg-green-800 transition-all text-xs shadow-sm disabled:opacity-50 inline-flex items-center justify-center gap-1.5"
                id="btn-finalize-estimate"
              >
                {isAnalyzing ? "Refining Cost Structure..." : "Recalculate AI Estimate"}
              </button>

              {isSaved && (
                <div className="flex items-center gap-1 bg-green-50 border border-green-200 text-green-700 font-bold p-2 text-center rounded-xl text-[11px] justify-center">
                  <Check className="h-4 w-4" /> Dimension bounds synchronized!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
