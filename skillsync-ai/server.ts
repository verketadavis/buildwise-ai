import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with telemetry User-Agent
let ai: GoogleGenAI | null = null;
const API_KEY = process.env.GEMINI_API_KEY;

if (API_KEY && API_KEY !== "MY_GEMINI_API_KEY") {
  try {
    ai = new GoogleGenAI({
      apiKey: API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
    console.log("Successfully initialized Gemini API Client.");
  } catch (e) {
    console.warn("Failed to initialize Gemini Client with provided key. Falling back to simulations.", e);
  }
} else {
  console.log("Gemini API key is not configured yet. Server will run on mock fallback mode gracefully.");
}

// Helper to interact with Gemini safely
async function promptGeminiJSON<T>(prompt: string, fallback: T): Promise<T> {
  if (!ai) {
    return fallback;
  }
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.7,
      },
    });
    const parsedText = response.text;
    if (parsedText) {
      return JSON.parse(parsedText) as T;
    }
    return fallback;
  } catch (error) {
    console.error("Gemini request failed, returning mock fallback data:", error);
    return fallback;
  }
}

// 1. HEALTH ENDPOINT
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", aiConfigured: !!ai });
});

// 2. AI RESUME ANALYZER
app.post("/api/analyze-resume", async (req, res) => {
  const { resumeText, targetRole } = req.body;
  if (!resumeText) {
    return res.status(400).json({ error: "Missing resume text" });
  }

  const prompt = `
    You are an expert resume parsing & recruitment specialist.
    Analyze the following resume text relative to the target role "${targetRole || 'Software Engineer'}".
    Provide a detailed evaluation report. Return your output EXACTLY as a JSON object matching this TypeScript interface:
    interface ResumeReport {
      score: number; // 0 to 100 overall resume quality score
      atsScore: number; // 0 to 100 benchmark against automated screening
      atsChecklist: { name: string; score: number; passed: boolean }[]; // name should be like "Contact Information", "Education Section", "Clear Metrics", "Standard Layout"
      weakSections: string[]; // key area sections needing improvement
      improvements: string[]; // detailed text of general enhancements
      bulletRewrites: { original: string; improved: string; verb: string }[]; // bullet points before and after optimization with the key active verb highlighted
      missingKeywords: string[]; // high impact skills or requirements missing based on the target role
      actionVerbsCount: number; // number of action verbs found
    }

    Resume Content:
    """${resumeText}"""
  `;

  const fallbackReport = {
    score: 72,
    atsScore: 68,
    atsChecklist: [
      { name: "Clear Education History", score: 90, passed: true },
      { name: "Action-Oriented Verbs", score: 55, passed: false },
      { name: "Skills Categorization", score: 80, passed: true },
      { name: "Measurable Impact Metrics", score: 45, passed: false }
    ],
    weakSections: ["Work Experience accomplishments", "Quantitative Metrics"],
    improvements: [
      "Add numeric achievements (e.g., 'reduced load time by 40%') rather than listing simple static responsibilities.",
      "Incorporate more domain-specific keywords corresponding to modern system design standard architectures."
    ],
    bulletRewrites: [
      {
        original: "Responsible for writing clean code and testing apps daily.",
        improved: "Engineered scalable React architectures and executed mock coverage suites, lifting framework reliability by 24%.",
        verb: "Engineered"
      },
      {
        original: "Helped manage database migrations and api updates.",
        improved: "Orchestrated PostgreSQL structural migrations and consolidated RESTful microservices, enhancing telemetry by 35%.",
        verb: "Orchestrated"
      }
    ],
    missingKeywords: ["CI/CD pipelines", "System Architecture", "Cloud Infrastructure (AWS/GCP)", "Redis Caching", "Tailwind CSS"],
    actionVerbsCount: 8
  };

  const report = await promptGeminiJSON(prompt, fallbackReport);
  res.json(report);
});

// 3. AI CAREER COACH CHAT
app.post("/api/coach-chat", async (req, res) => {
  const { messages, userSkills, targetRole } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Messages array is required" });
  }

  // Construct context with chat history
  const context = `
    You are an elite AI Career Mentor & Coach called "SkillSync Coach" who speaks in an encouraging, highly professional, direct Apple-like tone. 
    The user is target-focused on the role of "${targetRole || 'Technology Specialist'}".
    Their known skills are: ${userSkills ? userSkills.join(", ") : "Not specified yet"}.
    Provide actionable, highly strategic suggestions about career paths, interview prep, resumes, promotions, salary negotiations, or general workspace productivity.
    Be concise but extremely insightful. Avoid clichés. Suggest specific frameworks or tips.

    Current Conversation History:
    ${messages.map(m => `${m.sender === "user" ? "User" : "Coach"}: ${m.text}`).join("\n")}
    
    Please provide the next Coach response in natural conversational style. Keep instructions clear and readable using simple carriage returns or list bullet indicators.
  `;

  if (!ai) {
    // Elegant simulated fallback conversation answers based on the last message
    const lastMsg = messages[messages.length - 1]?.text?.toLowerCase() || "";
    let responseText = "That's an excellent question. To successfully stand out, focus on building distinct portfolio projects that demonstrate deep architectural knowledge (such as state machine isolation, distributed caching, and container orchestration). What particular sub-sector do you want to explore first?";
    if (lastMsg.includes("salary") || lastMsg.includes("negotiat") || lastMsg.includes("worth")) {
      responseText = "When navigating salary conversations, never cite personal expenses or generic benchmarks. Instead, present three quantifiable metrics of your business impact—such as latency reductions, feature delivery rates, or revenue enabled. Always aim to get the recruiter to specify the budget range first by asking, 'Could you share the primary compensation range budgeted for this tier?'";
    } else if (lastMsg.includes("resume") || lastMsg.includes("cv") || lastMsg.includes("ats")) {
      responseText = "Your CV should act as a high-density highlight reel, not a job description ledger. Switch your bullet points to follow the STAR methodology: Situation, Task, Action, Result. For example: 'Spearheaded migration (A) by introducing state-driven caching (A) which slashed endpoint latencies by 30% (R).'";
    } else if (lastMsg.includes("burnout") || lastMsg.includes("stress") || lastMsg.includes("productiv")) {
      responseText = "Burnout is rarely a result of working hard; it happens when we work hard on tasks that feel disconnected from tangible progress. Try executing 'Time Blocking' and set clear daily boundaries. Separate your work into Creative Deep blocks (no messaging client open) and Operational chore blocks. Highly structured schedules build protective cognitive boundaries.";
    }
    return res.json({ text: responseText });
  }

  try {
    const chatInstance = ai.chats.create({
      model: "gemini-3.5-flash",
      config: {
        systemInstruction: `You are SkillSync Coach, a world-class executive career intelligence coach. You speak clearly, professionally, and insightfully. Avoid conversational fluff. Support career design, review feedback, and strategic networking plans.`,
        temperature: 0.7,
      },
    });

    const lastMessageObj = messages[messages.length - 1];
    const feedbackResponse = await chatInstance.sendMessage({ message: context });
    res.json({ text: feedbackResponse.text || "I'm analyzing your path. Let's frame down what goals matter most." });
  } catch (error) {
    console.error("Gemini chat failed, falling back:", error);
    res.json({ text: "I'm experiencing a high volume of assessments. Let's focus on defining your core modern workspace skillset. What area do you want to discuss?" });
  }
});

// 4. SKILL GAP ANALYSIS
app.post("/api/skill-gap", async (req, res) => {
  const { currentSkills, targetSector } = req.body;
  
  const prompt = `
    Analyze skill gaps for an applicant aiming for target field: "${targetSector || "Full-stack Developer"}".
    Their current skills: ${JSON.stringify(currentSkills || ["React", "HTML", "CSS"])}.
    Generate 5 to 6 essential skills required. Compare current proficiency to expected vacancy target proficiency.
    Provide output EXACTLY as a JSON array of skill items:
    interface RadarSkill {
      name: string; // The skill name
      current: number; // 0 to 10 value representing current capability
      required: number; // 0 to 10 value representing required target capability
      gap: number; // calculated as required - current (clamped to >= 0)
      timeEstimate: string; // hours/days to bridge (e.g. "40 hours", "3 weeks")
      learningOrder: number; // sequential order to learn first (1 being highest)
    }
  `;

  const fallbackRadar = [
    { name: "TypeScript Core", current: 8, required: 9, gap: 1, timeEstimate: "15 hours", learningOrder: 2 },
    { name: "React State & Performance", current: 7, required: 9, gap: 2, timeEstimate: "25 hours", learningOrder: 1 },
    { name: "Docker Containerization", current: 3, required: 7, gap: 4, timeEstimate: "35 hours", learningOrder: 3 },
    { name: "System Integration Design", current: 4, required: 8, gap: 4, timeEstimate: "40 hours", learningOrder: 4 },
    { name: "SQL Datastores & Tuning", current: 6, required: 8, gap: 2, timeEstimate: "20 hours", learningOrder: 5 },
    { name: "CI/CD & Cloud Deploy", current: 2, required: 8, gap: 6, timeEstimate: "60 hours", learningOrder: 6 }
  ];

  const radar = await promptGeminiJSON(prompt, fallbackRadar);
  res.json(radar);
});

// 5. AI LEARNING ROADMAP
app.post("/api/learning-roadmap", async (req, res) => {
  const { targetRole, limitWeeks } = req.body;

  const prompt = `
    You are an elite academic curriculum designer. Create a highly detailed Weekly Learning Roadmap (max 4 weeks) for a professional seeking to transition successfully into the role: "${targetRole || "Tech Architect"}".
    Include specific courses, books, project milestones, and an interactive checkpoint quiz.
    Provide output EXACTLY as a JSON array of Week objects conforming to this:
    interface RoadmapWeek {
      week: number; // index (1, 2, 3, 4)
      objective: string; // what the user will achieve this week
      resources: { 
        name: string; 
        type: "Video" | "Course" | "Book" | "Project"; 
        provider: string; 
        duration: string; 
      }[];
      exercise: string; // practical real-world task to execute
      quiz: { 
        question: string; 
        options: string[]; 
        answer: number; // index of the correct option
      };
    }
  `;

  const fallbackRoadmap = [
    {
      week: 1,
      objective: "Master core state structures and structural typing rules",
      resources: [
        { name: "TypeScript Deep Dive Guide", type: "Book" as const, provider: "Basarat", duration: "10 hours" },
        { name: "Advanced React Patterns Course", type: "Course" as const, provider: "Frontend Masters", duration: "8 hours" }
      ],
      exercise: "Refactor a core Javascript module to use highly structured, recursive generics and custom guard claims.",
      quiz: {
        question: "Which keyword allows checking if a dynamic value conforms to a custom Interface type structure?",
        options: ["instanceof", "typeof", "type guards / is custom parameter predicate", "implements"],
        answer: 2
      }
    },
    {
      week: 2,
      objective: "Deploy local cache architectures and optimize endpoints",
      resources: [
        { name: "Designing Data-Intensive Applications", type: "Book" as const, provider: "O'Reilly", duration: "25 hours" },
        { name: "Redis Caching Best Practices", type: "Video" as const, provider: "Redis University", duration: "4 hours" }
      ],
      exercise: "Configure a local Dockerized Redis instance and layer response caches onto standard Express handlers.",
      quiz: {
        question: "What is the primary benefit of a write-through caching model in transactional storage?",
        options: ["Lowest latency for updates", "Absolute storage consistency directly", "Zero memory consumption", "Automatic cache cluster replication"],
        answer: 1
      }
    },
    {
      week: 3,
      objective: "Containerize web architectures and orchestration configurations",
      resources: [
        { name: "Docker & Kubernetes Mastery", type: "Course" as const, provider: "Udemy", duration: "14 hours" },
        { name: "Creating Production Dockerfiles", type: "Video" as const, provider: "YouTube Tech", duration: "2 hours" }
      ],
      exercise: "Construct a multi-stage Dockerfile utilizing node-alpine to bundle code safely under 100MB.",
      quiz: {
        question: "Why should we prefer multi-stage builds when packaging server-side dependencies?",
        options: ["To maximize CPU performance", "To exclude compilation tools from final production images", "To enable real-time debugging with Source Maps dynamically", "To avoid writing yaml configs entirely"],
        answer: 1
      }
    },
    {
      week: 4,
      objective: "Architect CI/CD automation pipelines and test coverage flows",
      resources: [
        { name: "GitHub Actions Tutorial Guide", type: "Video" as const, provider: "GitHub Devs", duration: "5 hours" },
        { name: "Project Blueprint Building", type: "Project" as const, provider: "SkillSync Enterprise", duration: "16 hours" }
      ],
      exercise: "Implement standard status check workflows running test units on every pull-request submission.",
      quiz: {
        question: "What does the continuous integration metric 'Code Coverage' evaluate directly?",
        options: ["The speed of the production server startup", "The percentage of file pathways executed during test passes", "Security susceptibility coefficients", "Memory footprints"],
        answer: 1
      }
    }
  ];

  const roadmap = await promptGeminiJSON(prompt, fallbackRoadmap);
  res.json(roadmap);
});

// 6. PORTFOLIO EVALUATOR
app.post("/api/evaluate-portfolio", async (req, res) => {
  const { url, description } = req.body;
  if (!url) {
    return res.status(400).json({ error: "Portfolio URL is required" });
  }

  const prompt = `
    You are an elite portfolio reviewer and technical auditor.
    Analyze this professional portfolio submission: URL: "${url}", Description: "${description || 'Web Projects Portfolio'}".
    Provide an engineering quality evaluation card list. Return EXCLUSIVELY a JSON object corresponding to this structure:
    interface PortfolioEvaluation {
      score: number; // 0 to 100 overall score
      quality: number; // 0 to 10 code cleanliness
      complexity: number; // 0 to 10 architecture difficulty
      documentation: number; // 0 to 10 readme and structures
      architecture: number; // 0 to 10 structural layout
      uiUx: number; // 0 to 10 usability layout
      innovation: number; // 0 to 10 unique product thinking
      strengths: string[];
      weaknesses: string[];
      suggestions: string[];
    }
  `;

  const fallbackEval = {
    score: 78,
    quality: 8,
    complexity: 7,
    documentation: 9,
    architecture: 6,
    uiUx: 8,
    innovation: 7,
    strengths: [
      "Excellent technical documentation, clear and robust installation guidelines in the README.",
      "Vibrant visual layout featuring responsive design across high-density devices."
    ],
    weaknesses: [
      "Lack of dynamic error boundaries, leading to potential app crashes on unhandled exceptions.",
      "Absence of quantitative analytical goals or product impact metrics."
    ],
    suggestions: [
      "Introduce TypeScript type safety validations on external network payload returns.",
      "Integrate automated UI end-to-end regression suites via Playwright for core navigation flows."
    ]
  };

  const evalResult = await promptGeminiJSON(prompt, fallbackEval);
  res.json(evalResult);
});

// 7. INTERVIEW SIMULATOR - EVALUATE TRANSCRIPT
app.post("/api/evaluate-interview", async (req, res) => {
  const { messages, category } = req.body;

  const prompt = `
    Analyze this simulated interview session between the interviewer AI and the candidate.
    Category: "${category || 'General'}"
    Transcript:
    ${messages ? messages.map(m => `${m.sender}: ${m.text}`).join("\n") : "None"}

    Provide a professional assessment and scores. Return EXCLUSIVELY a JSON object matching this structure:
    {
      "overall": number, // 0 to 100 overall performance
      "communication": number, // 0 to 100 rating
      "accuracy": number, // 0 to 100 rating on technical content
      "vocabulary": number, // 0 to 100 rating
      "problemSolving": number, // 0 to 100 rating
      "feedback": string // conversational executive feedback summary with improvements
    }
  `;

  const fallbackScores = {
    overall: 82,
    communication: 85,
    accuracy: 78,
    vocabulary: 88,
    problemSolving: 80,
    feedback: "You demonstrated clear structural articulation and vocabulary precision. However, when answering tricky technical questions, try to explicitly state your architectural assumptions first before diving directly into the implementation. Highlighting trade-offs shows senior decision capability."
  };

  const scores = await promptGeminiJSON(prompt, fallbackScores);
  res.json(scores);
});

// 8. SALARY INTELLIGENCE
app.post("/api/salary-intelligence", async (req, res) => {
  const { currentSkills, targetSector } = req.body;

  const prompt = `
    You are an executive compensation and global labor market analyst.
    Evaluate the salary worth of a professional specializing in target sector "${targetSector || 'Software Engineering'}" with skills: ${JSON.stringify(currentSkills || ["React", "TypeScript"])}.
    Predict future worth based on real-world market scaling trends.
    Return EXCLUSIVELY a JSON object matches:
    interface SalaryPrediction {
      currentWorth: number; // annual USD salary baseline (e.g. 115000)
      futureWorth2Yr: number; // forecasted USD salary in 2 years
      futureWorth5Yr: number; // forecasted USD salary in 5 years
      futureWorth10Yr: number; // forecasted USD salary in 10 years
      growthRate: number; // annualized growth rate percentage (e.g. 8.5)
      demandScore: number; // 0 to 100 market density/demand
      regionalFactors: { region: string; average: number }[]; // national/global averages
      promotionTips: string[]; // clear operational steps to increase compensation
    }
  `;

  const fallbackSalary = {
    currentWorth: 120000,
    futureWorth2Yr: 138000,
    futureWorth5Yr: 175000,
    futureWorth10Yr: 240000,
    growthRate: 9.3,
    demandScore: 88,
    regionalFactors: [
      { region: "North America / SF", average: 165000 },
      { region: "Europe / Remote", average: 105000 },
      { region: "APAC Hubs", average: 85000 }
    ],
    promotionTips: [
      "Gain proficiency in cloud databases and infrastructure design to command full-cycle product delivery responsibilities.",
      "Lead cross-functional engineering initiatives, taking ownership of company-level feature metrics."
    ]
  };

  const compensation = await promptGeminiJSON(prompt, fallbackSalary);
  res.json(compensation);
});

// 9. CAREER PATH PATHWAY PREDICTOR
app.post("/api/career-predictor", async (req, res) => {
  const { skills } = req.body;

  const prompt = `
    Project future trajectory based on current competencies: ${JSON.stringify(skills || ["Development"])}.
    Predict likely roles, emerging focus opportunities, and AI Automation risks for: 2, 5, and 10 year horizons.
    Return EXCLUSIVELY a JSON object matching this structure:
    interface FutureCareerPath {
      year2: { jobs: string[]; certs: string[] };
      year5: { jobs: string[]; certs: string[] };
      year10: { jobs: string[]; certs: string[] };
      automationRisk: number; // percentage confidence e.g. 15
      aiReplacementProb: number; // percentage confidence e.g. 10
      riskMitigation: string[]; // steps to stay ahead of AI obsolescence
      opportunities: string[]; // emerging unique sectors to leverage
    }
  `;

  const fallbackCareer = {
    year2: {
      jobs: ["Senior Frontend Engineer", "Product Solutions Architect"],
      certs: ["AWS Certified Developer", "Google Cloud Lead Engineer"]
    },
    year5: {
      jobs: ["Principal Software Architect", "Engineering Director"],
      certs: ["TOGAF Enterprise Architect Certification"]
    },
    year10: {
      jobs: ["VP of Engineering", "Chief Technology Officer (CTO)"],
      certs: ["Stanford Executive Leadership Program Certificate"]
    },
    automationRisk: 14,
    aiReplacementProb: 8,
    riskMitigation: [
      "Focus intensely on high-level system architecture, component integrations, and business strategy alignment.",
      "Refine collaborative leadership, mentorship capabilities, and product-market expansion visions."
    ],
    opportunities: [
      "AI Engineering orchestration frameworks.",
      "Secure Edge Computing and data localized architectures for compliant banking models."
    ]
  };

  const pathResult = await promptGeminiJSON(prompt, fallbackCareer);
  res.json(pathResult);
});

// 10. AI PROJECT GENERATOR
app.post("/api/generate-project", async (req, res) => {
  const { primaryGoal, difficulty } = req.body;

  const prompt = `
    Suggest a highly premium, industry-demanded resume-building Portfolio Project based on goals: "${primaryGoal || 'Frontend Mastery'}" and difficulty: "${difficulty || 'Intermediate'}".
    Provide high-quality system architecture planning.
    Return EXCLUSIVELY a JSON object matching:
    interface PortfolioProject {
      id: string; // unique short uuid
      name: string; // title of the built system
      description: string; // concise high impact summary
      techStack: string[]; // modern frontend/backend languages
      architecture: string; // detailed paragraphs of layout
      timeline: string; // e.g. "3 weeks, 10 hrs/week"
      difficulty: "Beginner" | "Intermediate" | "Advanced";
      folderStructure: string; // ASCII visual subdirectory layout
      presentationSlideTips: string[]; // tips for describing this in job interviews
    }
  `;

  const fallbackProj = {
    id: "proj_993a",
    name: "Subzero: Optimized Edge Analytical Dashboard",
    description: "A lightning-fast client-side dashboard utilizing WebAssembly to parse high-frequency network packets completely in-browser without server roundtrips.",
    techStack: ["TypeScript", "Rust", "WebAssembly", "ChartJS", "WebWorkers"],
    architecture: "WebWorkers offload processing into an independent parallel thread running compiled Rust. Raw binary telemetry packets undergo structural decompression instantly and post to a reactive React UI layer.",
    timeline: "3 Weeks",
    difficulty: "Advanced" as const,
    folderStructure: `/src\n  /wasm-core\n    - src/lib.rs\n  /components\n    - PacketView.tsx\n    - AlertConsole.tsx\n  /workers\n    - parser.worker.ts`,
    presentationSlideTips: [
      "Explain clearly how WebWorkers solved main-thread UI stutter by establishing secondary render-loops.",
      "Quantify your performance savings: 'Achieved 60fps telemetry updating by passing ArrayBuffers directly without structured cloning fees.'"
    ]
  };

  const project = await promptGeminiJSON(prompt, fallbackProj);
  res.json(project);
});

// 11. NETWORKING ASSISTANT
app.post("/api/draft-network", async (req, res) => {
  const { relationshipType, targetCompany, userBack } = req.body;

  const prompt = `
    Draft a highly strategic, short, and customized cold message / email copy for professional networking.
    Relationship type goal: "${relationshipType || "Cold Referral Outreach"}"
    Target Company: "${targetCompany || "FAANG"}"
    Candidate details: "${userBack || "React developer with 3 years experience"}"
    Return EXCLUSIVELY a JSON object matching:
    interface NetworkingDraft {
      type: string; // e.g. "Cold Email", "LinkedIn Request"
      subject?: string; // email subject line if applicable
      body: string; // the precise template message copy
    }
  `;

  const fallbackDraft = {
    type: "LinkedIn Request" as const,
    subject: "Innovative Systems Query",
    body: "Hi [Recipient Name],\n\nI admired your team's structural strategy in implementing system migrations at [Company]. I am an engineer specializing in high-throughput applications and built an isolated worker runtime recently that cuts endpoint delivery by 25%.\n\nI would love to learn more briefly about whether you are seeing similar bottlenecks in Edge frameworks, and if any openings are planned in the coming months.\n\nBest regards,\n[Your Name]"
  };

  const draftResult = await promptGeminiJSON(prompt, fallbackDraft);
  res.json(draftResult);
});

// VITE MIDDLEWARE SETUP & STATIC SERVING
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Setting up Vite Express development server middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production: serve built static files from /dist
    const distPath = path.join(process.cwd(), "dist");
    console.log(`Serving static production build from: ${distPath}`);
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[SkillSync Server] Running on http://localhost:${PORT}`);
  });
}

startServer();
