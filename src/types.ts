export type CountryCode = "US" | "CA";

export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  location: string;
  postalCode: string;
  country: CountryCode;
  areaSqFt: number;
  foundationType: string;
  stories: number;
  roomsCount: number;
  roofType: string;
  terrainType: "Flat" | "Rolling" | "Steep" | "Rugged";
  soilCondition: "Stable Sandy/Clay" | "Expansive Clay" | "Rocky Slab" | "Wet/Silt";
  budget: number;
  status: "Draft" | "Analyzed" | "Active";
  
  // AI Generated / Filled Fields
  regionalIndex?: number; // 1.0 is national avg
  estimate?: EstimateResult;
  boq?: BOQItem[];
  labor?: LaborItem[];
  timeline?: TimelineItem[];
  carbon?: CarbonReport;
  permits?: PermitData;
  risks?: RiskReport;
  optimizations?: BudgetOptimization[];
  alternatives?: DesignAlternative[];
}

export interface EstimateResult {
  lowCost: number;
  avgCost: number;
  premiumCost: number;
  confidenceScore: number; // 0 - 100
  categories: {
    name: string;
    low: number;
    avg: number;
    premium: number;
    explanation: string;
  }[];
}

export interface BOQItem {
  id: string;
  category: string;
  material: string;
  quantity: number;
  unit: string;
  wasteAllowancePct: number;
  unitCost: number;
  totalCost: number;
}

export interface LaborItem {
  id: string;
  trade: string; // Plumbing, Masonry, etc.
  crewSize: number;
  hoursNeeded: number;
  hourlyRate: number;
  totalCost: number;
  productivityAssumptions: string;
}

export interface TimelineItem {
  id: string;
  week: number;
  task: string;
  durationWeeks: number;
  dependencies: string[];
  weatherRisk: "Low" | "Medium" | "High";
  isCriticalPath: boolean;
}

export interface ContractorAudit {
  contractorName: string;
  totalAmount: number;
  priceMarkupPct: number;
  overallFairnessScore: number; // 0 - 100
  priceGougingDetected: boolean;
  auditedItems: {
    item: string;
    proposedCost: number;
    fairMarketCost: number;
    variancePct: number;
    flagged: boolean;
    reason?: string;
  }[];
  redFlags: string[];
  hiddenFees: string[];
  analysisParagraph: string;
}

export interface CarbonReport {
  totalCo2Kgs: number;
  materialsImpact: {
    material: string;
    co2Kgs: number;
    greenAlternative: string;
    potentialSavingsKgs: number;
  }[];
  transportEmissionsKgs: number;
  sustainabilityScore: number; // 0 - 100
  recommendations: string[];
}

export interface PermitData {
  permitCostEstimate: number;
  inspectionFees: number;
  impactFees: number;
  utilityConnectionFees: number;
  municipalWorkflowDetails: string;
  milestones: string[];
}

export interface RiskReport {
  overallRiskScore: number; // 0 - 100
  risksList: {
    category: "Budget" | "Schedule" | "Materials" | "Weather" | "Labor" | "Permits";
    probability: "Low" | "Medium" | "High";
    severity: "Low" | "Medium" | "High";
    description: string;
    mitigation: string;
  }[];
}

export interface BudgetOptimization {
  title: string;
  description: string;
  estimatedSavings: number;
  sequenceChange: string;
}

export interface DesignAlternative {
  title: string;
  description: string;
  costImpact: number; // negative is savings, positive is upgrade cost
  energySavingsPct: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: string;
}

export interface QuoteComparisonRequest {
  contractorName: string;
  quotedText?: string;
  amount: number;
}
