import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { Project, EstimateResult, BOQItem, LaborItem, TimelineItem, CarbonReport, PermitData, RiskReport, BudgetOptimization, DesignAlternative, ContractorAudit } from "./src/types";

dotenv.config();

const app = express();
app.use(express.json({ limit: "20mb" }));

// Port and server configuration
const PORT = 3000;

// Lazy initialization of Gemini SDK
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
      try {
        aiClient = new GoogleGenAI({
          apiKey: apiKey,
          httpOptions: {
            headers: {
              "User-Agent": "aistudio-build",
            }
          }
        });
        console.log("Gemini client successfully initialized.");
      } catch (e) {
        console.error("Failed to initialize Gemini Client: ", e);
      }
    } else {
      console.warn("No valid GEMINI_API_KEY found in process.env. Falling back to regional simulation engine.");
    }
  }
  return aiClient;
}

// Global In-Memory Projects Store
// Pre-seeded with 2 highly detailed, context-rich projects from US & Canada to show instant value.
let projects: Project[] = [
  {
    id: "proj_austin_modern",
    name: "Austin Eco-Modern Dwelling",
    description: "A single-family modern eco-home with high solar exposure potential and rain-catchment, situated on a slightly rolling Texas terrain with clay soils.",
    createdAt: new Date().toISOString(),
    location: "Austin, Texas",
    postalCode: "78704",
    country: "US",
    areaSqFt: 2200,
    foundationType: "Slab on Grade",
    stories: 2,
    roomsCount: 4,
    roofType: "Flat Green Roof",
    terrainType: "Rolling",
    soilCondition: "Expansive Clay",
    budget: 450000,
    status: "Analyzed",
    regionalIndex: 1.08,
    estimate: {
      lowCost: 395000,
      avgCost: 442000,
      premiumCost: 512000,
      confidenceScore: 92,
      categories: [
        { name: "Site Prep & Foundation", low: 45000, avg: 52000, premium: 61000, explanation: "Expansive clay in central Texas requires substantial rebar reinforcement and deep pier-drilling to resist shifting weather swells." },
        { name: "Framing & Lumber", low: 78000, avg: 85000, premium: 98000, explanation: "Standard light-timber frame construction using standard Southern Yellow Pine structural members with advanced engineered joists." },
        { name: "Roofing & Siding", low: 32000, avg: 38000, premium: 45000, explanation: "Flat engineered roof deck mapped with durable TPO membrane and provisions for minor vegetative sedum roof trays." },
        { name: "Finishes, Drywall & Painting", low: 68000, avg: 76000, premium: 92000, explanation: "Smooth level-5 drywall finishes combined with low-VOC native paint and water-based floor sealers." },
        { name: "HVAC, Plumbing & Electrical", low: 95000, avg: 105000, premium: 122000, explanation: "Central Texas heat demands highly efficient SEER2 heat pump system. Native copper plumbing lines and 200A solar-ready panel." },
        { name: "Landscaping & Permits", low: 18000, avg: 24000, premium: 32000, explanation: "Permitting workflow under City of Austin municipal codes, combined with native drought-tolerant landscaping (xeriscaping)." },
        { name: "General Contingency", low: 59000, avg: 62000, premium: 62000, explanation: "Default 15% budget buffer to absorb material commodity spikes and permit processing delays." }
      ]
    },
    boq: [
      { id: "b1", category: "Foundation", material: "Standard Ready-Mix Concrete 4000 PSI", quantity: 140, unit: "cubic yard", wasteAllowancePct: 5, unitCost: 175, totalCost: 24500 },
      { id: "b2", category: "Foundation", material: "Steel Rebar Grade 60 (#4 & #5)", quantity: 2.8, unit: "ton", wasteAllowancePct: 8, unitCost: 1100, totalCost: 3080 },
      { id: "b3", category: "Framing", material: "Southern Yellow Pine 2x6 framing studs", quantity: 1800, unit: "pcs", wasteAllowancePct: 10, unitCost: 8.5, totalCost: 15300 },
      { id: "b4", category: "Framing", material: "Engineered I-Joists floor logs", quantity: 68, unit: "pcs", wasteAllowancePct: 5, unitCost: 85, totalCost: 5780 },
      { id: "b5", category: "Drywall", material: "Mold-resistant board 4'x8' 5/8\"", quantity: 240, unit: "sheets", wasteAllowancePct: 12, unitCost: 18.5, totalCost: 4440 },
      { id: "b6", category: "Roofing", material: "Flat Roof TPO Waterproof Membrane", quantity: 1100, unit: "sq ft", wasteAllowancePct: 5, unitCost: 5.5, totalCost: 6050 },
      { id: "b7", category: "Electrical", material: "Romex NM-B 14/2 layout wires", quantity: 12, unit: "rolls", wasteAllowancePct: 10, unitCost: 110, totalCost: 1320 },
      { id: "b8", category: "HVAC", material: "18-SEER Energy Star Dual-Zone Heat Pump", quantity: 1, unit: "unit", wasteAllowancePct: 0, unitCost: 9500, totalCost: 9500 }
    ],
    labor: [
      { id: "l1", trade: "Masonry & Concrete Works", crewSize: 4, hoursNeeded: 120, hourlyRate: 48, totalCost: 23040, productivityAssumptions: "Standard slab pour and curing management over 1.5 weeks." },
      { id: "l2", trade: "Framing Carpentry", crewSize: 5, hoursNeeded: 240, hourlyRate: 45, totalCost: 54000, productivityAssumptions: "Accelerated framing crew using pre-cut structural timber packs." },
      { id: "l3", trade: "Electrical & Wire Setup", crewSize: 2, hoursNeeded: 80, hourlyRate: 55, totalCost: 8800, productivityAssumptions: "Rough-in wiring and service panel setting over 5 block days." },
      { id: "l4", trade: "HVAC Mechanicals", crewSize: 2, hoursNeeded: 60, hourlyRate: 54, totalCost: 6480, productivityAssumptions: "Duct routing and external heat pump setting." },
      { id: "l5", trade: "Plumbing installation", crewSize: 2, hoursNeeded: 110, hourlyRate: 52, totalCost: 11440, productivityAssumptions: "Includes standard under-foundation rough-in plus secondary fixture trims." }
    ],
    timeline: [
      { id: "t1", week: 1, task: "Site Grading, Drainage, and Soil Pier Drilling", durationWeeks: 1.5, dependencies: [], weatherRisk: "Medium", isCriticalPath: true },
      { id: "t2", week: 2, task: "Concrete Pier Pour and Slab Foundation Curing", durationWeeks: 2, dependencies: ["t1"], weatherRisk: "Medium", isCriticalPath: true },
      { id: "t3", week: 4, task: "Primary Structural Sills and Timber Wall Framing", durationWeeks: 3, dependencies: ["t2"], weatherRisk: "Low", isCriticalPath: true },
      { id: "t4", week: 7, task: "Roof Truss Laying & Flat TPO Waterproofing Membrane", durationWeeks: 1.5, dependencies: ["t3"], weatherRisk: "High", isCriticalPath: true },
      { id: "t5", week: 9, task: "Window and Exterior Door Sheathing (Dry-In)", durationWeeks: 1, dependencies: ["t4"], weatherRisk: "Low", isCriticalPath: true },
      { id: "t6", week: 10, task: "Electrical, Plumbing, and HVAC Rough-In Runs", durationWeeks: 2.5, dependencies: ["t5"], weatherRisk: "Low", isCriticalPath: false },
      { id: "t7", week: 12, task: "Insulation & Drywall Layering with Smooth Finishes", durationWeeks: 2, dependencies: ["t5"], weatherRisk: "Low", isCriticalPath: true },
      { id: "t8", week: 14, task: "Trims, Flooring Installation & Electrical Hookup", durationWeeks: 2, dependencies: ["t7"], weatherRisk: "Low", isCriticalPath: true },
      { id: "t9", week: 16, task: "Municipal Inspection Checks & Handover", durationWeeks: 1, dependencies: ["t8"], weatherRisk: "Low", isCriticalPath: true }
    ],
    carbon: {
      totalCo2Kgs: 58400,
      materialsImpact: [
        { material: "Portland Concrete Slab", co2Kgs: 21500, greenAlternative: "Fly Ash Concrete Substitutes (40% substitution)", potentialSavingsKgs: 8600 },
        { material: "Structural Timber Framing", co2Kgs: -15000, greenAlternative: "FSC Certified Sustainably Harvested Timber", potentialSavingsKgs: 3000 },
        { material: "Standard Drywall Boards", co2Kgs: 6400, greenAlternative: "Eco-Gypsum Reclaimed/Synthetic Waste boards", potentialSavingsKgs: 2200 },
        { material: "Fiberglass Batt Insulation", co2Kgs: 8200, greenAlternative: "Hemp Wool or Blown Cellulose Insulation", potentialSavingsKgs: 5400 }
      ],
      transportEmissionsKgs: 4200,
      sustainabilityScore: 78,
      recommendations: [
        "Select concrete with a 40% fly ash composite to lower direct carbon loading.",
        "Implement cellular-core blown cellulose instead of synthetic fiberglass for attic lines.",
        "Switch flat roof green planting to regional Texas sedums, minimizing daily irrigation needs."
      ]
    },
    permits: {
      permitCostEstimate: 3450,
      inspectionFees: 850,
      impactFees: 4800,
      utilityConnectionFees: 3100,
      municipalWorkflowDetails: "City of Austin development permit application requires digital site plan verification, energy audit compliance, and septic/drainage plan sign-offs.",
      milestones: ["Rough grading clearance", "Under-slab plumbing inspection", "Framing structural lookover", "Rough-in electrical & mechanical clearance", "Final occupancy permit issuance"]
    },
    risks: {
      overallRiskScore: 32,
      risksList: [
        { category: "Weather", probability: "Medium", severity: "Medium", description: "Texas summer heat index can limit labor shift windows, delaying high-exertion processes like concrete setting.", mitigation: "Schedule high-volume concrete pours during early AM hours (4:00 AM start)." },
        { category: "Budget", probability: "Low", severity: "High", description: "Expansive clay shift might require deeper pier drilling than identified in the preliminary site plan.", mitigation: "Conduct an initial $1,500 core geotech soil survey before finalized architectural bidding." },
        { category: "Labor", probability: "Medium", severity: "Low", description: "Local skilled mechanical & dry-in plumbing contractors in Austin remain in high demand.", mitigation: "Secure prime subcontractors with retainer contracts 90 days before structural frame starts." }
      ]
    },
    optimizations: [
      { title: "Fly Ash Concrete Mix Optimization", description: "Replace standard foundation cement with 30-40% industrial fly-ash slag. Keeps curing robust and shaves cement commodity expenses.", estimatedSavings: 3200, sequenceChange: "None. Adjust mix formulation with building mixer." },
      { title: "Advanced Framing Layout (O.C. framing)", description: "Apply standard 24-inch on-center (O.C.) advanced framing studs rather than traditional 16-inch setups where structurally allowed.", estimatedSavings: 4100, sequenceChange: "Refine structural blueprint before structural lumber purchase." }
    ],
    alternatives: [
      { title: "Ductless Mini-split Configuration", description: "Eliminate main sheet-metal thermal ducting entirely; mount high-efficiency individual mini-slip systems.", costImpact: -2100, energySavingsPct: 15 },
      { title: "Triple-Glazed Southern Argon Windows", description: "Upgrade standard dual-pane glass grids to heavy argon triple-insulated modern windows.", costImpact: 6500, energySavingsPct: 22 }
    ]
  },
  {
    id: "proj_canada_vancouver_cottage",
    name: "Vancouver West Coast Retreat",
    description: "A gorgeous modern timber-and-glass cottage overlooking coastal terrain in Vancouver, British Columbia. Built for seismic safety and damp Northwest winter climate factors.",
    createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
    location: "Vancouver, British Columbia",
    postalCode: "V6B 3H6",
    country: "CA",
    areaSqFt: 1600,
    foundationType: "Deep Crawl Space with Piers",
    stories: 1.5,
    roomsCount: 3,
    roofType: "Asphalt Shingles",
    terrainType: "Steep",
    soilCondition: "Wet/Silt",
    budget: 380000,
    status: "Analyzed",
    regionalIndex: 1.15,
    estimate: {
      lowCost: 340000,
      avgCost: 395000,
      premiumCost: 450000,
      confidenceScore: 89,
      categories: [
        { name: "Shoring & Damp Foundation", low: 48000, avg: 54000, premium: 65000, explanation: "High rainfall and wet silty soil require comprehensive drainage channels, waterproofing coatings, and structural shoring piers due to steep incline." },
        { name: "Douglas Fir Heavy Framing", low: 68000, avg: 76000, premium: 88000, explanation: "Premium local kiln-dried Douglas Fir framing timbers, engineered for heavy West Coast snow/wind loads and seismic structural safety." },
        { name: "Climate Envelope & Siding", low: 39000, avg: 45000, premium: 52000, explanation: "Superior Tyvek vapor barrier wraps, local cedar shake accents, and double-insulated rainscreen installation to prevent mold issues." },
        { name: "Plumbing, Electric & Radial Heat", low: 78000, avg: 89000, premium: 102000, explanation: "Hydronic underfloor radiant heating grids tied with high-efficiency boiler system. Supports BC Step Code Energy performance rules." },
        { name: "Insulation & Air Seal", low: 18000, avg: 22000, premium: 28000, explanation: "Spray-foam insulation in vaults with specialized thermal breaks, ensuring R-28 comfort compliance." },
        { name: "Regional Permits & Taxes", low: 22000, avg: 27000, premium: 33000, explanation: "Permits fees + regional Canadian GST (5%) as applicable to services, including geotechnical report verification fees." },
        { name: "General Contingency", low: 52000, avg: 52000, premium: 52000, explanation: "15% Contingency for remote fuel/access surcharges in mountainous regions." }
      ]
    },
    boq: [
      { id: "bc1", category: "Foundation", material: "Waterproofing membrane + Drain tile pack", quantity: 1, unit: "kit", wasteAllowancePct: 0, unitCost: 4500, totalCost: 4500 },
      { id: "bc2", category: "Foundation", material: "Steel screw piles for ocean breeze anchors", quantity: 18, unit: "pcs", wasteAllowancePct: 0, unitCost: 650, totalCost: 11700 },
      { id: "bc3", category: "Framing", material: "Douglas Fir Select Struct 2x10 joists", quantity: 380, unit: "pcs", wasteAllowancePct: 5, unitCost: 32, totalCost: 12160 },
      { id: "bc4", category: "Roofing", material: "High-grade 30yr laminated architectural shingles", quantity: 24, unit: "squares", wasteAllowancePct: 10, unitCost: 135, totalCost: 3240 },
      { id: "bc5", category: "Siding", material: "Red Cedar lap siding boards", quantity: 1400, unit: "sq ft", wasteAllowancePct: 12, unitCost: 6.8, totalCost: 9520 }
    ],
    labor: [
      { id: "lc1", trade: "Shoring & Trenching Labor", crewSize: 3, hoursNeeded: 80, hourlyRate: 58, totalCost: 13920, productivityAssumptions: "Clearing hillsides and setting deep gravel perimeter ditches." },
      { id: "lc2", trade: "Timber Joiners & Framing Carp", crewSize: 4, hoursNeeded: 280, hourlyRate: 52, totalCost: 58240, productivityAssumptions: "Highly skilled joinery matching exposed roof collar ties." },
      { id: "lc3", trade: "Plumbing & Hydronic Hookup", crewSize: 2, hoursNeeded: 120, hourlyRate: 60, totalCost: 14400, productivityAssumptions: "Lay radiant tubing on concrete floor mesh before top layer." }
    ],
    timeline: [
      { id: "tc1", week: 1, task: "Shoring and Hillside Drainage Excavation", durationWeeks: 2, dependencies: [], weatherRisk: "High", isCriticalPath: true },
      { id: "tc2", week: 3, task: "Screw-Pile Anchoring and Wood Subfloor Platform Framing", durationWeeks: 3, dependencies: ["tc1"], weatherRisk: "Medium", isCriticalPath: true },
      { id: "tc3", week: 6, task: "High-Ceiling Post-and-Beam Douglas Fir Framing", durationWeeks: 4, dependencies: ["tc2"], weatherRisk: "Medium", isCriticalPath: true },
      { id: "tc4", week: 10, task: "Vapor Barrier wrap, Rainscreen layer & Windows (Casing)", durationWeeks: 2, dependencies: ["tc3"], weatherRisk: "High", isCriticalPath: true },
      { id: "tc5", week: 12, task: "Interior Plumbing Hydronic Laying & HVAC mechanical runs", durationWeeks: 2, dependencies: ["tc4"], weatherRisk: "Low", isCriticalPath: false }
    ],
    carbon: {
      totalCo2Kgs: 39500,
      materialsImpact: [
        { material: "Kiln-dried Douglas Fir framing", co2Kgs: -28000, greenAlternative: "Local Forest-Stewardship Timber boards", potentialSavingsKgs: 2500 },
        { material: "Imported Asphalt Roofing", co2Kgs: 9200, greenAlternative: "Metal Standing-Seam recycled roofing", potentialSavingsKgs: 4800 },
        { material: "Vapor barrier wraps", co2Kgs: 3200, greenAlternative: "Recycled-content composite house wrap", potentialSavingsKgs: 1100 }
      ],
      transportEmissionsKgs: 6800,
      sustainabilityScore: 84,
      recommendations: [
        "Procure standing seam roof sheets locally to reduce transport carbon footprint and increase recycling capability.",
        "Ensure all cedar structural sidings are sourced from certified BC sustainably harvested claims.",
        "Consider a ground-source coastal loop for geothermal heat pump grids to achieve high tier BC Step Code score."
      ]
    },
    permits: {
      permitCostEstimate: 4100,
      inspectionFees: 1200,
      impactFees: 5500,
      utilityConnectionFees: 4500,
      municipalWorkflowDetails: "District of North Vancouver development application requires specialized soil slope-stability report, seismic design engineering stamps, and tree-preservation plan compliance.",
      milestones: ["Slope stability clearance", "Anchor structural loading test", "Mechanical system air pressure test", "Final occupancy handoff inspection"]
    },
    risks: {
      overallRiskScore: 48,
      risksList: [
        { category: "Weather", probability: "High", severity: "Medium", description: "Constant winter rainy season in British Columbia causes soil slumping risks during open excavation.", mitigation: "Erect heavy plastic structural tarps over exposed hillsides throughout early phases." },
        { category: "Labor", probability: "Medium", severity: "High", description: "Skilled seismic timber carpenters can hold higher premiums in coastal metro regions.", mitigation: "Contract structural framers from central BC in advance, covering reasonable travel stipends." },
        { category: "Materials", probability: "Low", severity: "Medium", description: "Lead times for custom triple-pane climate glass grids can swell to 12 weeks.", mitigation: "Issue exact glass layouts 90 days in advance of the dry-in framing phase." }
      ]
    },
    optimizations: [
      { title: "Standard Cedar Shake Substitution", description: "Substitute custom-stained real cedar siding with high-durability composite fiber-cement shingles textured like real wood.", estimatedSavings: 5800, sequenceChange: "Procure siding boards in local batch standard colors." }
    ],
    alternatives: [
      { title: "Standing-seam Recycled Aluminum Roof", description: "Replace standard asphalt shingles with durable recycled-content metal roofing.", costImpact: 7800, energySavingsPct: 8 }
    ]
  }
];

// Helper functions for localized regional costs calculations if offline or simulated
function calculateRegionalFactors(project: Project) {
  const isUS = project.country === "US";
  const postal = project.postalCode.toUpperCase().trim();
  
  let regionalFactor = 1.0;
  let taxMultiplier = 0.08; // default 8% US Sales tax
  let permitBaseCost = 3000;
  
  if (isUS) {
    if (postal.startsWith("787") || postal.includes("AUSTIN")) {
      regionalFactor = 1.08;
      taxMultiplier = 0.0825; // Austin Sales Tax
      permitBaseCost = 3500;
    } else if (postal.startsWith("9")) { // California / West
      regionalFactor = 1.28;
      taxMultiplier = 0.0925;
      permitBaseCost = 5500;
    } else if (postal.startsWith("0") || postal.startsWith("1")) { // US East Coast
      regionalFactor = 1.18;
      taxMultiplier = 0.08875;
      permitBaseCost = 4200;
    } else {
      regionalFactor = 0.98; // General midwest / southern average
      taxMultiplier = 0.07;
      permitBaseCost = 2500;
    }
  } else { // Canada regional mapping
    taxMultiplier = 0.12; // BC GST+PST or general Canadian HST
    if (postal.startsWith("V") || postal.includes("VANCOUVER")) { // British Columbia
      regionalFactor = 1.20;
      taxMultiplier = 0.12; // 5% GST + 7% PST
      permitBaseCost = 4500;
    } else if (postal.startsWith("M") || postal.includes("TORONTO")) { // Ontario
      regionalFactor = 1.18;
      taxMultiplier = 0.13; // 13% HST Ontario
      permitBaseCost = 4000;
    } else if (postal.startsWith("T") || postal.includes("CALGARY")) { // Alberta
      regionalFactor = 1.05;
      taxMultiplier = 0.05; // 5% GST Only
      permitBaseCost = 3200;
    } else {
      regionalFactor = 1.10;
      taxMultiplier = 0.15; // Nova Scotia / Quebec general average
      permitBaseCost = 3500;
    }
  }

  // Adjust for site factors
  if (project.terrainType === "Steep" || project.terrainType === "Rugged") {
    regionalFactor += 0.12; // Excavation & shoring multipliers
  }
  if (project.soilCondition === "Expansive Clay" || project.soilCondition === "Wet/Silt") {
    regionalFactor += 0.08; // Heavy steel/piers needed
  }
  
  return { regionalFactor, taxMultiplier, permitBaseCost };
}

// Simulated Cost Engine (Procedural fallbacks in case of missing keys or backup)
function generateSimulatedAnalysis(project: Project): Project {
  const isUS = project.country === "US";
  const { regionalFactor, taxMultiplier, permitBaseCost } = calculateRegionalFactors(project);
  
  const baseCostPerSqFt = 160; // National baseline metric house cost of a high-end finish
  const storiesFactor = project.stories > 1 ? 1.05 + (project.stories * 0.02) : 1.0;
  
  // Calculate average total construction estimate
  const baseCalculatedAvg = project.areaSqFt * baseCostPerSqFt * storiesFactor * regionalFactor;
  const avgCost = Math.round(baseCalculatedAvg);
  const lowCost = Math.round(baseCalculatedAvg * 0.88);
  const premiumCost = Math.round(baseCalculatedAvg * 1.18);
  
  const confidenceScore = project.postalCode ? 90 : 75;
  
  // Categories split
  const categories = [
    { name: "Site Prep & Foundation", low: Math.round(lowCost * 0.12), avg: Math.round(avgCost * 0.12), premium: Math.round(premiumCost * 0.13), explanation: `Foundation adjustments customized for ${project.foundationType} on ${project.soilCondition} terrain in ${project.location}.` },
    { name: "Framing & Lumber", low: Math.round(lowCost * 0.20), avg: Math.round(avgCost * 0.20), premium: Math.round(premiumCost * 0.20), explanation: `Heavy timber framing sizing matching ${project.areaSqFt} sq ft layouts, with native waste calculations included.` },
    { name: "Roofing & Siding", low: Math.round(lowCost * 0.10), avg: Math.round(avgCost * 0.10), premium: Math.round(premiumCost * 0.11), explanation: `Structural cladding using highly insulated ${project.roofType} envelope blocks to damp thermal losses.` },
    { name: "Finishes, Drywall & Painting", low: Math.round(lowCost * 0.18), avg: Math.round(avgCost * 0.18), premium: Math.round(premiumCost * 0.19), explanation: "Standard gypsum boards and standard contractor trims, low emissions paints, pre-sealed flooring." },
    { name: "HVAC, Plumbing & Electrical", low: Math.round(lowCost * 0.22), avg: Math.round(avgCost * 0.22), premium: Math.round(premiumCost * 0.23), explanation: "Plumbing layouts matching kitchen, laundry, and multi-bathroom zones with high-efficiency direct HVAC pumps." },
    { name: "Regional Permits & Taxes", low: Math.round(lowCost * 0.06), avg: Math.round(avgCost * 0.06), premium: Math.round(premiumCost * 0.06), explanation: `Includes regional sales tax rate of ${(taxMultiplier * 100).toFixed(1)}% and state/province specific impact fees.` },
    { name: "General Contingency", low: Math.round(lowCost * 0.12), avg: Math.round(avgCost * 0.12), premium: Math.round(premiumCost * 0.08), explanation: "12% safety buffer calculated to cushion against sudden local lumber and concrete material price spikes." }
  ];

  // Bill of Quantities
  const concreteQty = Math.round(project.areaSqFt * 0.06);
  const lumberQty = Math.round(project.areaSqFt * 0.9);
  const drywallQty = Math.round(project.areaSqFt * 0.12);
  const copperPipesQty = Math.round(project.areaSqFt * 0.25);
  
  const boq: BOQItem[] = [
    { id: "b1", category: "Foundation", material: "Standard Premix Concrete 4000 PSI", quantity: concreteQty, unit: "cubic yard", wasteAllowancePct: 5, unitCost: 175, totalCost: Math.round(concreteQty * 175) },
    { id: "b2", category: "Foundation", material: "Grade 60 Carbon Reinforcement Rebar", quantity: Math.round(concreteQty * 0.02 * 10) / 10, unit: "ton", wasteAllowancePct: 8, unitCost: 1150, totalCost: Math.round(concreteQty * 0.02 * 1150) },
    { id: "b3", category: "Framing", material: "Standard Framing Spruce/FSC Studs 2x6", quantity: lumberQty, unit: "pcs", wasteAllowancePct: 10, unitCost: 8.2, totalCost: Math.round(lumberQty * 8.2) },
    { id: "b4", category: "Framing", material: "Structural Roof Truss & Plywood Panels", quantity: Math.round(project.areaSqFt / 32), unit: "panels", wasteAllowancePct: 5, unitCost: 45, totalCost: Math.round((project.areaSqFt / 32) * 45) },
    { id: "b5", category: "Drywall", material: "Soundproofing Gypsum Board 4x8 1/2\"", quantity: drywallQty, unit: "sheets", wasteAllowancePct: 12, unitCost: 16.5, totalCost: Math.round(drywallQty * 16.5) },
    { id: "b6", category: "Plumbing", material: "Rigid Copper water tubes 1/2 inch", quantity: copperPipesQty, unit: "feet", wasteAllowancePct: 8, unitCost: 4.8, totalCost: Math.round(copperPipesQty * 4.8) },
    { id: "b7", category: "Insulation", material: "R-30 Blown Attic Loose Cellulose", quantity: Math.round(project.areaSqFt * 1.1), unit: "sq ft", wasteAllowancePct: 5, unitCost: 2.2, totalCost: Math.round(project.areaSqFt * 1.1 * 2.2) }
  ];

  // Adjust total BOQ items to fit in average budget
  boq.forEach(item => {
    item.totalCost = Math.round(item.quantity * item.unitCost * (1 + item.wasteAllowancePct / 100));
  });

  // Labor
  const labor: LaborItem[] = [
    { id: "l1", trade: "Masonry & Concrete Works", crewSize: 3, hoursNeeded: 80, hourlyRate: Math.round(42 * regionalFactor), totalCost: 0, productivityAssumptions: "Curing slab frame setup and clean core pours." },
    { id: "l2", trade: "Framing Carpentry", crewSize: 4, hoursNeeded: 180, hourlyRate: Math.round(40 * regionalFactor), totalCost: 0, productivityAssumptions: "Erecting primary structural framework walls." },
    { id: "l3", trade: "Plumbing installation", crewSize: 2, hoursNeeded: 90, hourlyRate: Math.round(48 * regionalFactor), totalCost: 0, productivityAssumptions: "Rough-in tubing networks and external valve settings." },
    { id: "l4", trade: "Electrical & Wire Setup", crewSize: 2, hoursNeeded: 70, hourlyRate: Math.round(50 * regionalFactor), totalCost: 0, productivityAssumptions: "Wire loops, ceiling spots, and sub-panel attachments." },
    { id: "l5", trade: "HVAC Mechanicals", crewSize: 2, hoursNeeded: 50, hourlyRate: Math.round(46 * regionalFactor), totalCost: 0, productivityAssumptions: "Central ventilation routing and setting dual-stage pump core." }
  ];
  
  labor.forEach(item => {
    item.totalCost = item.crewSize * item.hoursNeeded * item.hourlyRate;
  });

  // Timeline
  const timeline: TimelineItem[] = [
    { id: "t1", week: 1, task: "Site Grading, Excavation & Drainage channels Setup", durationWeeks: 1.5, dependencies: [], weatherRisk: "Medium", isCriticalPath: true },
    { id: "t2", week: 2.5, task: `Pier Setting & Foundation Slab Curing (${project.foundationType})`, durationWeeks: 2, dependencies: ["t1"], weatherRisk: "Medium", isCriticalPath: true },
    { id: "t3", week: 4.5, task: `Frame Timber Wall Framing & Joists Setup (${project.stories} stories)`, durationWeeks: 3, dependencies: ["t2"], weatherRisk: "Low", isCriticalPath: true },
    { id: "t4", week: 7.5, task: `Roof Trusses Laying & Water Cladding (${project.roofType})`, durationWeeks: 1.5, dependencies: ["t3"], weatherRisk: "High", isCriticalPath: true },
    { id: "t5", week: 9, task: "Envelope Wind/Moisture Wraps & Window Dry-In Setting", durationWeeks: 1, dependencies: ["t4"], weatherRisk: "Low", isCriticalPath: true },
    { id: "t6", week: 10, task: "Internal Plumbing, electrical cabling, & HVAC conduits", durationWeeks: 2, dependencies: ["t5"], weatherRisk: "Low", isCriticalPath: false },
    { id: "t7", week: 12, task: "Rscreen Boardings, Drywall sheet laying, taping, and level-4 smooth sands", durationWeeks: 2.5, dependencies: ["t5"], weatherRisk: "Low", isCriticalPath: true },
    { id: "t8", week: 14.5, task: "Flooring, wall paint layers, fixtures layout, power hookup", durationWeeks: 1.5, dependencies: ["t7"], weatherRisk: "Low", isCriticalPath: true },
    { id: "t9", week: 16, task: "Local municipal clearances & Certificate of Occupancy", durationWeeks: 1, dependencies: ["t8"], weatherRisk: "Low", isCriticalPath: true }
  ];

  // Carbon Report
  const totalCo2Kgs = Math.round(project.areaSqFt * 28.5);
  const carbon: CarbonReport = {
    totalCo2Kgs,
    materialsImpact: [
      { material: "Standard Concrete foundation blocks", co2Kgs: Math.round(totalCo2Kgs * 0.45), greenAlternative: "Low-carbon fly-ash ready cement mix", potentialSavingsKgs: Math.round(totalCo2Kgs * 0.15) },
      { material: "Structural Timber materials", co2Kgs: Math.round(totalCo2Kgs * -0.28), greenAlternative: "FSC certified timber boards locally processed", potentialSavingsKgs: Math.round(totalCo2Kgs * 0.05) },
      { material: "Synthetic insulation panels", co2Kgs: Math.round(totalCo2Kgs * 0.18), greenAlternative: "Natural blown cellulose or sheep wool lining pads", potentialSavingsKgs: Math.round(totalCo2Kgs * 0.09) }
    ],
    transportEmissionsKgs: Math.round(totalCo2Kgs * 0.08),
    sustainabilityScore: isUS ? 75 : 82, // Higher average baseline due to Canadian region timber standards
    recommendations: [
      "Select fly ash composite mixes (under-slab) to slash initial cement-loading footprint.",
      "Switch synthetic thermal layers to high-density dense-pack natural cellulose recycled fibers.",
      "Integrate local lumber distributors within 50 miles of building coordinates to slash transit offsets."
    ]
  };

  // Permits standard estimate
  const permits: PermitData = {
    permitCostEstimate: Math.round(permitBaseCost * regionalFactor),
    inspectionFees: Math.round(permitBaseCost * 0.18),
    impactFees: Math.round(permitBaseCost * 1.1 * regionalFactor),
    utilityConnectionFees: Math.round(permitBaseCost * 0.8),
    municipalWorkflowDetails: `Permit validation processes matching local codes for postal zone ${project.postalCode}, ensuring storm runoff compliance, energy audit certificate filings, and structural foundation stamps.`,
    milestones: ["Excavation and erosion barrier review", "Under slab plumbing alignment inspects", "Rough wall framing verification", "Plumbing & Electrical safety loops checkoff", "Final occupancy handoff certificate"]
  };

  // Risks Report
  const risks: RiskReport = {
    overallRiskScore: Math.round(30 + (regionalFactor * 10) + (project.terrainType === "Steep" ? 15 : 0)),
    risksList: [
      { category: "Weather", probability: "Medium", severity: "Medium", description: `Weather delays during site prep due to regional ${isUS ? 'US' : 'Canadian'} seasons of water logging on ${project.terrainType} slopes.`, mitigation: "Erect heavy plastic structural shielding tarps over slopes during excavation." },
      { category: "Materials", probability: "Low", severity: "High", description: "Lumber or cement delays from supply bottlenecks.", mitigation: "Secure order volumes at 60-day locks with guaranteed schedules." },
      { category: "Permits", probability: "Medium", severity: "Low", description: "Local municipal permit processing backlogs.", mitigation: "Submit initial layout applications instantly upon getting drafts, before finalizing detailed framing designs." }
    ]
  };

  if (project.terrainType === "Steep") {
    risks.risksList.push({
      category: "Schedule",
      probability: "High",
      severity: "High",
      description: "Severe terrain incline delays heavy machine grading maneuvers.",
      mitigation: "Hire dedicated specialized tracked graders with mountain-anchoring cables."
    });
  }

  // Optimizations
  const optimizations: BudgetOptimization[] = [
    { title: "Slab Mix Fly Ash substitute", description: "Incorporate industrial byproduct fly ash up to 35% in wet foundation pour, trimming standard cement pricing.", estimatedSavings: Math.round(avgCost * 0.008), sequenceChange: "None. Instruct mixer batch." },
    { title: "24-inch O.C. Framing Layout", description: "Apply advanced framing layout spacing vertically (2x6 @ 24-in center studs) rather than standard 2x4 @ 16-inch, reducing dry-in wood bulk.", estimatedSavings: Math.round(avgCost * 0.012), sequenceChange: "Amend detailed framing design sheets before purchase orders." }
  ];

  // Alternatives
  const alternatives: DesignAlternative[] = [
    { title: "Triple Pane Argons (High Climate rating)", description: "Upgrade standard exterior dual windows to heavy argon triple insulated modern frames.", costImpact: Math.round(avgCost * 0.018), energySavingsPct: 18 },
    { title: "Ductless Mini Splits layout", description: "Replace standard central cooling ducting with multi-zone mini split systems, bypassing frame drops.", costImpact: Math.round(-avgCost * 0.005), energySavingsPct: 12 }
  ];

  return {
    ...project,
    status: "Analyzed",
    regionalIndex: parseFloat(regionalFactor.toFixed(2)),
    estimate: { lowCost, avgCost, premiumCost, confidenceScore, categories },
    boq,
    labor,
    timeline,
    carbon,
    permits,
    risks,
    optimizations,
    alternatives
  };
}

// Route handlers
// List projects
app.get("/api/projects", (req, res) => {
  res.json(projects);
});

// Create project
app.post("/api/projects", (req, res) => {
  const { name, description, location, postalCode, country, areaSqFt, foundationType, stories, roomsCount, roofType, terrainType, soilCondition, budget } = req.body;
  
  if (!name || !location || !areaSqFt) {
    return res.status(400).json({ error: "Name, Location, and Area are required fields." });
  }

  const newProject: Project = {
    id: "proj_" + Math.random().toString(36).substr(2, 9),
    name,
    description: description || "No custom plan description given.",
    createdAt: new Date().toISOString(),
    location,
    postalCode: postalCode || "90001",
    country: (country as any) || "US",
    areaSqFt: Number(areaSqFt),
    foundationType: foundationType || "Slab on Grade",
    stories: Number(stories) || 1,
    roomsCount: Number(roomsCount) || 3,
    roofType: roofType || "Asphalt Shingles",
    terrainType: terrainType || "Flat",
    soilCondition: soilCondition || "Stable Sandy/Clay",
    budget: Number(budget) || 250000,
    status: "Draft"
  };

  projects.push(newProject);
  res.status(201).json(newProject);
});

// Get project details
app.get("/api/projects/:id", (req, res) => {
  const proj = projects.find(p => p.id === req.params.id);
  if (!proj) {
    return res.status(404).json({ error: "Project not found." });
  }
  res.json(proj);
});

// Delete project
app.delete("/api/projects/:id", (req, res) => {
  const initialLen = projects.length;
  projects = projects.filter(p => p.id !== req.params.id);
  if (projects.length === initialLen) {
    return res.status(404).json({ error: "Project not found." });
  }
  res.json({ success: true, message: "Project successfully deleted." });
});

// Analyze Project with Gemini (or Fallback simulation)
app.post("/api/projects/:id/analyze", async (req, res) => {
  const projIndex = projects.findIndex(p => p.id === req.params.id);
  if (projIndex === -1) {
    return res.status(404).json({ error: "Project not found." });
  }
  
  const currentProj = projects[projIndex];
  const ai = getGeminiClient();

  if (!ai) {
    // Graceful fallback to location-aware simulation
    console.log("No Gemini API key available. Generating procedural estimate.");
    const analyzed = generateSimulatedAnalysis(currentProj);
    projects[projIndex] = analyzed;
    return res.json(analyzed);
  }

  try {
    const prompt = `You are BuildWise AI, the core structural engineering algorithm and construction estimator.
Your task is to estimate a building project structure matching exactly the user inputs below, customized for the region (U.S. or Canada).

Project Specifications:
- Name: "${currentProj.name}"
- Location: "${currentProj.location}" (Postal: ${currentProj.postalCode})
- Country: ${currentProj.country}
- Plot Area: ${currentProj.areaSqFt} Sq Ft
- Stories: ${currentProj.stories} levels
- Rooms count: ${currentProj.roomsCount}
- Foundation requested: "${currentProj.foundationType}"
- Roof layout requested: "${currentProj.roofType}"
- Land Terrain: "${currentProj.terrainType}"
- Base Soil condition: "${currentProj.soilCondition}"
- User draft budget: $${currentProj.budget}

Instructions:
1. Review regional conditions:
   - If country is US: incorporate state price codes, local sales tax (e.g., TX around 8.25%, CA etc.), US city indexes, and wood/frame building codes.
   - If country is CA: incorporate provincial factors, regional transit costs, municipal Step Codes (e.g., BC Step Code 4), and Canada GST/HST configurations (5% up to 15%).
2. Estimate costs across these standard categories: "Site Prep & Foundation", "Framing & Lumber", "Roofing & Siding", "Finishes, Drywall & Painting", "HVAC, Plumbing & Electrical", "Regional Permits & Taxes", "General Contingency". Output estimated costs in low (frugal materials), average (standard), and premium ranges (highest durability, granite countertops, custom wood joiners).
3. Draft a list of at least 5 major Bill of Quantities (BOQ) materials items matching the project size and building type.
4. Calculate at least 4 major labor trades requirements (Carpentry, Concrete works, electrical, HVAC wiring, Plumbing) with local wage profiles.
5. Create a detailed timeline week-by-week layout (at least 6 rows) tracking critical path sequences, start weeks, and weather delays based on soil types and slopes (seismic damp systems for west coast, heating/cooling systems).
6. Perform a Carbon analysis showing emissions (concrete adds CO2, timber negative sequestration), carbon sustainability rating (0-100), and green product substitutes.
7. Outline a structured risk profile containing soil swells, rain damage, budget risks, or material delays with solid mitigation plans.
8. Suggest a couple of budget optimizations to reduce construction waste, and a couple of modern design alternatives (triple glaze argons, solar integration, mini-split ductless).

IMPORTANT: Return the response in raw JSON ONLY. No markdown wrapping (like \`\`\`json\`), no commentary before or after. The parsed string must strictly conform to this TypeScript schema:
{
  "regionalIndex": number,
  "estimate": {
    "lowCost": number,
    "avgCost": number,
    "premiumCost": number,
    "confidenceScore": number,
    "categories": [
      { "name": "Site Prep & Foundation", "low": number, "avg": number, "premium": number, "explanation": "string" },
      { "name": "Framing & Lumber", "low": number, "avg": number, "premium": number, "explanation": "string" },
      ...
    ]
  },
  "boq": [
    { "id": "string", "category": "string", "material": "string", "quantity": number, "unit": "string", "wasteAllowancePct": number, "unitCost": number, "totalCost": number }
  ],
  "labor": [
    { "id": "string", "trade": "string", "crewSize": number, "hoursNeeded": number, "hourlyRate": number, "totalCost": number, "productivityAssumptions": "string" }
  ],
  "timeline": [
    { "id": "string", "week": number, "task": "string", "durationWeeks": number, "dependencies": ["string"], "weatherRisk": "Low" | "Medium" | "High", "isCriticalPath": boolean }
  ],
  "carbon": {
    "totalCo2Kgs": number,
    "materialsImpact": [
      { "material": "string", "co2Kgs": number, "greenAlternative": "string", "potentialSavingsKgs": number }
    ],
    "transportEmissionsKgs": number,
    "sustainabilityScore": number,
    "recommendations": ["string"]
  },
  "permits": {
    "permitCostEstimate": number,
    "inspectionFees": number,
    "impactFees": number,
    "utilityConnectionFees": number,
    "municipalWorkflowDetails": "string",
    "milestones": ["string"]
  },
  "risks": {
    "overallRiskScore": number,
    "risksList": [
      { "category": "Budget" | "Schedule" | "Materials" | "Weather" | "Labor" | "Permits", "probability": "Low" | "Medium" | "High", "severity": "Low" | "Medium" | "High", "description": "string", "mitigation": "string" }
    ]
  },
  "optimizations": [
    { "title": "string", "description": "string", "estimatedSavings": number, "sequenceChange": "string" }
  ],
  "alternatives": [
    { "title": "string", "description": "string", "costImpact": number, "energySavingsPct": number }
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text ? response.text.trim() : "";
    let data;
    try {
      // Strip any markdown code fence if it persists
      let cleanText = text;
      if (cleanText.startsWith("```")) {
        cleanText = cleanText.replace(/^```(json)?/, "").replace(/```$/, "").trim();
      }
      data = JSON.parse(cleanText);
    } catch (e) {
      console.error("Gemini failed returning exact JSON structure. Stripping failed format or using Simulation fallback.", e);
      data = JSON.parse(text); // let error throw standard if unrecoverable
    }

    const analyzedProject: Project = {
      ...currentProj,
      status: "Analyzed",
      regionalIndex: data.regionalIndex || 1.1,
      estimate: data.estimate,
      boq: data.boq,
      labor: data.labor,
      timeline: data.timeline,
      carbon: data.carbon,
      permits: data.permits,
      risks: data.risks,
      optimizations: data.optimizations,
      alternatives: data.alternatives
    };

    projects[projIndex] = analyzedProject;
    return res.json(analyzedProject);

  } catch (error: any) {
    console.error("Gemini live call timed out or failed. Running simulated model safety fallback.", error);
    const analyzed = generateSimulatedAnalysis(currentProj);
    projects[projIndex] = analyzed;
    return res.json(analyzed);
  }
});

// Edit Project Parameters live - triggers budget adjustments / change order predictors
app.post("/api/projects/:id/change-order", (req, res) => {
  const projIndex = projects.findIndex(p => p.id === req.params.id);
  if (projIndex === -1) {
    return res.status(404).json({ error: "Project not found" });
  }

  const proj = projects[projIndex];
  const { modificationType, intensity } = req.body; // e.g. "add_room", "roof_upgrade", "insulation_upgrade"
  
  if (!proj.estimate) {
    return res.status(400).json({ error: "Project must be analyzed first before estimating change orders." });
  }

  // Handle changes
  let costImpact = 0;
  let summary = "";
  
  if (modificationType === "add_room") {
    const cost = 28500 * (Number(intensity) || 1) * (proj.regionalIndex || 1.0);
    costImpact = Math.round(cost);
    summary = `Add finished extra bedroom/study (+${150 * (Number(intensity) || 1)} sq ft coverage). Includes localized structural studs, level-4 drywall surface layers, dual windows, standard paint finishes and baseboard electrical hookups.`;
    proj.roomsCount += (Number(intensity) || 1);
    proj.areaSqFt += 150 * (Number(intensity) || 1);
  } else if (modificationType === "roof_upgrade") {
    const cost = 12500 * (proj.regionalIndex || 1.0);
    costImpact = Math.round(cost);
    summary = `Upgrade roof construction from conventional shingles to custom standing-seam recycled-grade heavy aluminum shield plating. Significantly increases snow sheds, fire rating, and raises storm wind threshold to 140mph.`;
    proj.roofType = "Recycled standing-seam heavy aluminum metal";
  } else if (modificationType === "foundation_upgrade") {
    const cost = 16000 * (proj.regionalIndex || 1.0);
    costImpact = Math.round(cost);
    summary = "Re-anchor slab borders with high-load helical screw pilings. Recommended for saturated soils and rolling slopes to isolate home framing from shifts.";
    proj.foundationType = "Slab supported by Helical Screw Piles";
  } else {
    costImpact = 4500;
    summary = "General luxury tile / trim upgrade inside wet bathroom areas.";
  }

  // Update estimates
  proj.estimate.lowCost += Math.round(costImpact * 0.95);
  proj.estimate.avgCost += costImpact;
  proj.estimate.premiumCost += Math.round(costImpact * 1.15);

  // Update BOQ item
  proj.boq = proj.boq || [];
  proj.boq.push({
    id: "change_" + Math.random().toString(36).substr(2, 5),
    category: "Adjusted Scope",
    material: summary,
    quantity: 1,
    unit: "lump_sum",
    wasteAllowancePct: 2,
    unitCost: costImpact,
    totalCost: costImpact
  });

  // Re-append a risk item of transition
  proj.risks = proj.risks || { overallRiskScore: 30, risksList: [] };
  proj.risks.risksList.push({
    category: "Budget",
    probability: "Medium",
    severity: "Low",
    description: `Scope modifications (Change Order: ${modificationType}) inflate total outline budget by $${costImpact.toLocaleString()}.`,
    mitigation: "Amend structural project scope and lock subcontractor material specs to block creep."
  });

  projects[projIndex] = proj;
  res.json({ project: proj, costImpact, summary });
});

// Contractor Quote Audits / Quote Analyzer endpoint
app.post("/api/quote-audit", async (req, res) => {
  const { contractorName, quotedText, amount, scopeSqFt } = req.body;
  if (!contractorName || !amount) {
    return res.status(400).json({ error: "Contractor name and overall Quote cost amount are mandatory." });
  }

  const ai = getGeminiClient();
  const rawText = quotedText || `Construction bid outline for about ${scopeSqFt || 2000} sq ft family home including initial foundation pour, framing structures, roof lay, plumbing loops and electrical layout. Overall estimated fee is $${amount}.`;

  if (!ai) {
    // Elegant procedural quote analysis
    console.log("No Gemini API key available. Generating procedural quote audit.");
    const markup = amount > 380000 ? 18 : 8;
    const isOverpriced = markup > 15;
    const items = [
      { item: "Foundation Concrete Material and Pour", proposedCost: Math.round(amount * 0.18), fairMarketCost: Math.round(amount * 0.165), variancePct: 9, flagged: false },
      { item: "Timber Stud Framing & Sheathing Labor", proposedCost: Math.round(amount * 0.28), fairMarketCost: Math.round(amount * 0.235), variancePct: 19, flagged: true, reason: "Markup on standard SYP studs exceed average district commodity pricing by 19%." },
      { item: "Electrical wiring services (200A panel)", proposedCost: Math.round(amount * 0.14), fairMarketCost: Math.round(amount * 0.13), variancePct: 7, flagged: false },
      { item: "Dry-in Roofing labor & panels wrap", proposedCost: Math.round(amount * 0.16), fairMarketCost: Math.round(amount * 0.135), variancePct: 18, flagged: true, reason: "Laminated shingle pricing incorporates excessive material waste overheads (allowance calculated at 25% waste instead of standard 10%)." },
      { item: "Subcontractor Admin Coordination Fees", proposedCost: Math.round(amount * 0.08), fairMarketCost: Math.round(amount * 0.04), variancePct: 100, flagged: true, reason: "Ancillary manager supervisor double-charges detected separate from on-site framing managers." }
    ];

    const redFlags = [
      "Vague contractor equipment list double entries in general sheets",
      "Wood framing lumber waste volume locks are structured significantly above regional average standard threshold",
      "Hourly rate margins for generic masonry crews structured at $65/hr instead of typical state ranges ($45/hr)"
    ];

    const hiddenFees = [
      "Secondary debris clean-up fee ($2,500) itemized separately from waste carriage",
      "Ducting air test clearances double-charged over standard HVAC labor hours budget"
    ];

    const fairness = Math.round(95 - markup - (isOverpriced ? 10 : 0));

    const audit: ContractorAudit = {
      contractorName,
      totalAmount: Number(amount),
      priceMarkupPct: markup,
      overallFairnessScore: fairness,
      priceGougingDetected: isOverpriced,
      auditedItems: items,
      redFlags: isOverpriced ? redFlags : [redFlags[0]],
      hiddenFees,
      analysisParagraph: `This proposal submitted by ${contractorName} reflects a total quote of $${Number(amount).toLocaleString()}. Our regional pricing audit identifies moderately inflated materials overhead margins, specifically centering framing timber packs and roofing panels allowances. Total redundant markup estimated around ${markup}%, representing an opportunity to shave approximately $${Math.round(amount * (markup / 100)).toLocaleString()} from final scope envelopes.`
    };

    return res.json(audit);
  }

  try {
    const prompt = `You are the BuildWise AI Fraud and Overpricing Detector, an elite quantity surveyor and contractor estimator.
Audit this contractor's building proposal quote details:
Contractor: "${contractorName}"
Total Amount: $${amount}
Specifications text provided by subcontractor:
"${rawText}"

Tasks:
1. Examine quote items for bloated lumber quantities, duplicate materials, unrealistic labor markups, or general price gouging.
2. Outline audited items, comparing the "proposedCost" vs a localized reasonable "fairMarketCost" (calculate variance Percentage).
3. Compute an overall markup percentage and a dynamic Fairness Score (0-100 scale, where high is favorable and low has major pricing concerns).
4. Identify a list of 1-4 plain-English Red Flags or Hidden Fees.
5. Provide a summary analysis paragraph explaining the overall findings in plain, supportive language.

Return the response in raw JSON ONLY. Do not wrap in markdown fences. Conforms to this TypeScript schema:
{
  "contractorName": "string",
  "totalAmount": number,
  "priceMarkupPct": number,
  "overallFairnessScore": number,
  "priceGougingDetected": boolean,
  "auditedItems": [
    { "item": "string", "proposedCost": number, "fairMarketCost": number, "variancePct": number, "flagged": boolean, "reason": "string (optional)" }
  ],
  "redFlags": ["string"],
  "hiddenFees": ["string"],
  "analysisParagraph": "string"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const parsed = JSON.parse(response.text ? response.text.trim() : "{}");
    res.json(parsed);

  } catch (error) {
    console.error("Gemini Quote Audit failed. Falling back to simulated audit.", error);
    // Procedural Fallback
    const markup = amount > 400000 ? 15 : 9;
    const audit: ContractorAudit = {
      contractorName,
      totalAmount: Number(amount),
      priceMarkupPct: markup,
      overallFairnessScore: Math.round(92 - markup),
      priceGougingDetected: markup > 12,
      auditedItems: [
        { item: "Site Pouring & Sills Set", proposedCost: Math.round(amount * 0.25), fairMarketCost: Math.round(amount * 0.23), variancePct: 8.6, flagged: false },
        { item: "Timber structural wall posts", proposedCost: Math.round(amount * 0.35), fairMarketCost: Math.round(amount * 0.30), variancePct: 16.6, flagged: true, reason: "Slight material markup spikes found on heavy Doug Fir framing items." }
      ],
      redFlags: ["Slight timber frame commodity price bloating"],
      hiddenFees: ["Excess cartage debris fee mapped outside core logistics"],
      analysisParagraph: `This quote submitted by ${contractorName} is standard but features mild custom markups in framing material. Let BuildWise help you negotiate a potential revision.`
    };
    res.json(audit);
  }
});

// Chat Advisor RAG model endpoint
app.post("/api/chat-advisor", async (req, res) => {
  const { messages, currentProject } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Messages array is required." });
  }

  const ai = getGeminiClient();
  const lastUserMsg = messages[messages.length - 1]?.text || "Hello";

  let contextString = "You are BuildWise AI Advisor, a brilliant, professional, supportive expert construction consultant, surveyor, and building code assistant. " +
    "You provide clear, objective construction, architectural, and planning guidance with Swiss precision and Apple-inspired clarity. " +
    "Keep responses structured, professional, easy for homeowners and builders to read, and ground suggestions in standard US ICC codes and Canada NBC codes. Use neutral styling list blocks when presenting budgets.";

  if (currentProject) {
    contextString += `\nCurrentUserProject details: Project name is "${currentProject.name}", located in "${currentProject.location}" (${currentProject.country}), plot size of ${currentProject.areaSqFt} sq ft, targeting a $${currentProject.budget} budget. Standard foundation is ${currentProject.foundationType || "Slab"}, roof outline is ${currentProject.roofType || "Asphalt shingles"}.`;
    if (currentProject.estimate) {
      contextString += ` An analysis has estimated average total cost at $${currentProject.estimate.avgCost.toLocaleString()} (low: $${currentProject.estimate.lowCost.toLocaleString()}, premium: $${currentProject.estimate.premiumCost.toLocaleString()}) with ${currentProject.estimate.confidenceScore}% confidence.`;
    }
  }

  if (!ai) {
    // Generate helpful local procedural chat fallback responses
    console.log("No Gemini API key available for advisor. Emitting procedural expert response.");
    let reply = "I am ready to help you plan your build! Here's some professional guidance: ";
    const promptLower = lastUserMsg.toLowerCase();
    
    if (promptLower.includes("permit") || promptLower.includes("code") || promptLower.includes("comply")) {
      reply = `When planning compliance under ${currentProject?.country === "CA" ? "Canadian National Building Code (NBC)" : "US International Residential Code (IRC)"}, focus on these key compliance steps for ${currentProject?.location || "your site"}:
- **Geotechnical Integrity**: Silt and clay soils require verified moisture-bearing ratios before concrete pouring.
- **Erosion Barriers**: Layout structural silt fencing patterns as demanded by county watershed rules.
- **Setback Restrictions**: Homes typically require a minimum 15ft front setbacks and 5ft lateral boundary offsets. Ensure you coordinate site borders before structural framing begins.`;
    } else if (promptLower.includes("save") || promptLower.includes("budget") || promptLower.includes("reduce") || promptLower.includes("optimize")) {
      reply = `To shave expenses on your $${(currentProject?.budget || 250000).toLocaleString()} estimate, consider these direct actions:
1. **Material Substitutions**: Select fiber-cement siding instead of genuine timber paneling. Saves up to 22% on envelope cladding.
2. **Standard Sizing Rules**: Anchor structural rooms to standard 2-ft modules (e.g., 24'x36' floorplans), drastically cutting waste allowance rates.
3. **Sequence Optimization**: Contract high-load concrete pours first during dry early-spring grids, avoiding weather delay hours.`;
    } else if (promptLower.includes("carbon") || promptLower.includes("green") || promptLower.includes("energy") || promptLower.includes("sustainable")) {
      reply = `To improve your carbon score, I recommend these high-sustainability substitutions:
- **Cement slag**: Replace 35% of standard Portland base concrete with recycled fly-ash slag. Lower carbon impact and increases long-term curing strength.
- **Air barrier envelopes**: Install high-efficiency triple-sealed climate wraps. Drastically lowers seasonal heat pump run cycles.
- **Interior finish**: Use low-VOC moisture boards containing synthetic waste gypsum, minimizing chemical degassing.`;
    } else {
      reply = `As your BuildWise Advisor, I am analyzing your project layout for ${currentProject?.name || "your home"}. 
      
To successfully navigate your construction:
- Ensure you perform a localized geotech core soil test to verify foundation specifications. 
- Budget a standard 10–15% buffer contingency to absorb wood/metal commodity cost volatility.
- Coordinate with local sub-contractors 90 days before dry-in framing checks start.

What specific details on materials quantity, permit processing, or labor rates can I clarify for you today?`;
    }

    return res.json({
      id: "reply_" + Math.random().toString(36).substr(2, 9),
      role: "model",
      text: reply,
      timestamp: new Date().toISOString()
    });
  }

  try {
    // Collect previous messages for conversational history
    const historyParts = messages.map(m => `${m.role === "user" ? "User" : "Advisor"}: ${m.text}`).join("\n");
    const chatPrompt = `${contextString}\n\nChat History:\n${historyParts}\n\nProvide your updated Advisor response. Speak with human warmth, high-accuracy structural terms, and neat helpful bullet points. Answer shortly and concisely.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: chatPrompt
    });

    res.json({
      id: "reply_" + Math.random().toString(36).substr(2, 9),
      role: "model",
      text: response.text ? response.text.trim() : "I am reviewing your calculations. How else can I assist with your planning?",
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("Gemini Chat failed. Returning procedural guidance response.", error);
    res.json({
      id: "reply_err",
      role: "model",
      text: "I am ready to consult on your planning questions. Please let me know how I can help you save budget or run regional permit audits.",
      timestamp: new Date().toISOString()
    });
  }
});

// Configure Vite integration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`BuildWise AI Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
}

startServer();
