export interface UserState {
  id: string;
  name: string;
  email: string;
  avatar: string;
  xp: number;
  level: number;
  streak: number;
  skills: string[];
  role: string;
  isLoggedIn: boolean;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "coach";
  text: string;
  timestamp: string;
}

export interface ResumeData {
  skills: string[];
  experience: { company: string; role: string; duration: string; details: string[] }[];
  projects: { name: string; description: string; tech: string[] }[];
  education: string;
  certifications: string[];
}

export interface ResumeReport {
  score: number;
  atsScore: number;
  atsChecklist: { name: string; score: number; passed: boolean }[];
  weakSections: string[];
  improvements: string[];
  bulletRewrites: { original: string; improved: string; verb: string }[];
  missingKeywords: string[];
  actionVerbsCount: number;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: "Remote" | "Hybrid" | "Onsite";
  experienceLevel: "Internship" | "Entry" | "Junior" | "Senior";
  salaryRange: string;
  compatibility: number;
  description: string;
  requirements: string[];
  missingSkills: string[];
  sponsorship: boolean;
  emergingField: boolean;
}

export interface RadarSkill {
  name: string;
  current: number;
  required: number;
  gap: number;
  timeEstimate: string;
  learningOrder: number;
}

export interface PortfolioEvaluation {
  score: number;
  quality: number;
  complexity: number;
  documentation: number;
  architecture: number;
  uiUx: number;
  innovation: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}

export interface InterviewSession {
  type: string;
  topic: string;
  messages: { sender: "interviewer" | "user"; text: string; audio?: string }[];
  score?: {
    overall: number;
    communication: number;
    accuracy: number;
    vocabulary: number;
    problemSolving: number;
    feedback: string;
  };
}

export interface RoadmapWeek {
  week: number;
  objective: string;
  resources: { name: string; type: "Video" | "Course" | "Book" | "Project"; provider: string; duration: string; completed?: boolean }[];
  exercise: string;
  quiz: { question: string; options: string[]; answer: number; checked?: boolean; selected?: number };
}

export interface SalaryPrediction {
  currentWorth: number;
  futureWorth2Yr: number;
  futureWorth5Yr: number;
  futureWorth10Yr: number;
  growthRate: number;
  demandScore: number;
  regionalFactors: { region: string; average: number }[];
  promotionTips: string[];
}

export interface FutureCareerPath {
  year2: { jobs: string[]; certs: string[] };
  year5: { jobs: string[]; certs: string[] };
  year10: { jobs: string[]; certs: string[] };
  automationRisk: number;
  aiReplacementProb: number;
  riskMitigation: string[];
  opportunities: string[];
}

export interface PortfolioProject {
  id: string;
  name: string;
  description: string;
  techStack: string[];
  architecture: string;
  timeline: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  folderStructure: string;
  presentationSlideTips: string[];
}

export interface KanbanTask {
  id: string;
  title: string;
  company: string;
  status: "Wishlist" | "Applied" | "Interview" | "Assessment" | "Offer" | "Rejected" | "Withdrawn";
  salary: string;
  date: string;
  reminder?: string;
}

export interface NetworkingDraft {
  type: "LinkedIn Request" | "Cold Email" | "LinkedIn Message" | "Follow-up" | "Thank-you" | "Referral";
  subject?: string;
  body: string;
}

export interface FreelanceGig {
  title: string;
  platform: "Upwork" | "Fiverr" | "Toptal" | "Remote Gigs";
  probability: number;
  suggestedPricing: string;
  clientFit: "Excellent" | "Good" | "Fair";
  proposalHook: string;
}
