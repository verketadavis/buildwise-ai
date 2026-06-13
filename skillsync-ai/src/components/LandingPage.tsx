import React, { useState, FormEvent } from "react";
import { Sparkles, Command, ArrowRight, CheckCircle2, ChevronRight, ChevronLeft, ShieldCheck, Star } from "lucide-react";

interface LandingPageProps {
  onGetStarted: () => void;
  onQuickUpload: (text: string) => void;
  onOpenAuth: () => void;
}

export default function LandingPage({ onGetStarted, onQuickUpload, onOpenAuth }: LandingPageProps) {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [quickResumeName, setQuickResumeName] = useState("");
  const [quickResumeText, setQuickResumeText] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  const testimonials = [
    {
      name: "Marcus Vance",
      role: "Lead Product Designer at Stripe",
      avatar: "MV",
      quote: "The ATS scoring system is incredibly precise. I adjusted my action words using the recommendations panel and immediately unlocked top-tier calls from design leadership."
    },
    {
      name: "Elsa Zhang",
      role: "Solutions Developer at Vercel",
      avatar: "EZ",
      quote: "The Skill Gap Radar showed me exactly what API architectures I was lacking. Instead of generic tutorials, I followed a structured 4-week AI custom course roadmap to bridge the gap."
    },
    {
      name: "Devon Aland",
      role: "Junior Systems Engineer at Cloudflare",
      avatar: "DA",
      quote: "I simulated three rigorous technical design interviews with the coach. The conversational feedback on system metrics helped me clear standard FAANG bar questions comfortably."
    }
  ];

  const features = [
    { name: "AI Resume Analyzer", desc: "Automated structural audit checks matching core hiring criteria.", icon: "📄" },
    { name: "AI Career Coach", desc: "Conversational master guidance on promotions, negotiations, and plans.", icon: "🧠" },
    { name: "Smart Job Matching", desc: "Instant skill compatibility ratios filtered by remote preference.", icon: "🎯" },
    { name: "Skill Gap Analysis", desc: "High contrast comparative layout mapping target industry demands.", icon: "📊" },
    { name: "Portfolio Evaluator", desc: "Architecture, UI/UX, documentation, and innovation scorecards.", icon: "💻" },
    { name: "Interview Simulator", desc: "Interactive Mock interviews grading accuracy and strategy with real reports.", icon: "🎙️" },
    { name: "Salary Predictor", desc: "Annualized compensation forecasting grids on 2, 5, and 10-year horizons.", icon: "💰" },
    { name: "Learning Roadmap", desc: "Custom structured courses, projects, and self-testing quizzes.", icon: "🗺️" },
    { name: "ATS Resume Score", desc: "Checks layout parser compatibility against top-tier tech benchmarks.", icon: "✅" },
    { name: "Freelance Finder", desc: "Gigs recommendations aggregated from top global platforms.", icon: "🛰️" },
    { name: "Internship Recommender", desc: "Discovers early-career placements optimized for entry roles.", icon: "🎓" },
    { name: "Career Progress Tracker", desc: "Interactive Kanban pipelines tracking interview states.", icon: "📈" }
  ];

  const handleNextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrevTestimonial = () => {
    setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const loadSampleResume = () => {
    setQuickResumeName("Sample_Resume.txt");
    const sample = `Johnathan Miller - Senior Systems Developer
SUMMARY
Experienced software craftsman with 4 years experience deploying cloud endpoints and database pipelines. Focus on TypeScript, Express, and standard DB architectures.

EXPERIENCE
Software Engineer at DeltaCorp (2024 - Present)
- Maintained legacy databases and wrote API endpoints.
- Helped migrate tables to Postgres but had slow response rates.
- Acted as a general debugger for standard frontends in React.

SKILLS
React, JavaScript, CSS, HTML, Node.js, Express, Basic PostgreSQL`;
    setQuickResumeText(sample);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleQuickSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (quickResumeText) {
      onQuickUpload(quickResumeText);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] font-sans text-[#111827] flex flex-col selection:bg-green-600 selection:text-white">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E5E7EB] px-6 lg:px-16 h-20 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-[#16A34A] rounded-lg flex items-center justify-center text-white font-bold text-sm">S</div>
          <span className="text-xl font-bold tracking-tight text-black">SkillSync AI</span>
        </div>
        <nav className="hidden md:flex space-x-8 text-sm font-medium text-gray-500">
          <a href="#features" className="hover:text-black transition-colors">Features</a>
          <a href="#stats" className="hover:text-black transition-colors">Performance</a>
          <a href="#testimonials" className="hover:text-black transition-colors">Testimonials</a>
          <a href="#pricing" className="hover:text-black transition-colors">Pricing</a>
        </nav>
        <div className="flex items-center space-x-3">
          <button 
            onClick={onOpenAuth}
            className="px-5 py-2.5 text-sm font-medium rounded-full border border-[#E5E7EB] bg-white hover:bg-gray-50 text-black transition-all"
          >
            Access Portal
          </button>
          <button 
            onClick={onGetStarted}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-[#16A34A] rounded-full hover:bg-[#15803D] transition-colors shadow-sm"
          >
            Get Started
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 lg:pt-24 pb-12 px-6 lg:px-16 max-w-7xl mx-auto w-full text-center space-y-8">
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white border border-[#E5E7EB] rounded-full shadow-sm">
          <Sparkles className="w-4 h-4 text-[#16A34A]" />
          <span className="text-xs font-semibold text-[#16A34A] tracking-wide uppercase">Unified Career Intelligence System</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-[72px] font-bold tracking-tight text-black leading-[1.08] max-w-4xl mx-auto">
          Your Skills Deserve the <span className="text-[#16A34A]">Right Opportunity.</span>
        </h1>

        <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto font-normal leading-relaxed">
          AI analyzes your experience, identifies your strengths, predicts your future metrics, and guides you toward the perfect career pathway.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
          <button 
            onClick={onGetStarted}
            className="w-full sm:w-auto px-8 py-4 bg-[#111827] text-white text-base font-semibold rounded-full hover:bg-black transition-all shadow-md flex items-center justify-center space-x-2 group"
          >
            <span>Initialize Assessment</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <a 
            href="#quick-parse" 
            className="w-full sm:w-auto px-8 py-4 bg-white border border-[#E5E7EB] text-gray-800 text-base font-medium rounded-full hover:bg-gray-50 transition-all text-center"
          >
            Upload Mock CV
          </a>
        </div>

        {/* Animated Feature Showcase Container */}
        <div className="pt-8 max-w-5xl mx-auto">
          <div className="relative bg-white rounded-[24px] border border-[#E5E7EB] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[480px]">
            {/* Minimal Mockup Sidebar */}
            <aside className="w-full md:w-20 border-b md:border-b-0 md:border-r border-[#E5E7EB] flex md:flex-col items-center py-4 md:py-8 justify-around md:justify-start md:space-y-8 bg-gray-50/50">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-[#16A34A] font-semibold">SS</div>
              <div className="w-10 h-10 bg-[#16A34A]/10 text-[#16A34A] flex items-center justify-center rounded-xl">
                <Command className="w-5 h-5" />
              </div>
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">📊</div>
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">🧠</div>
              <div className="hidden md:flex mt-auto w-10 h-10 bg-gray-200 rounded-full items-center justify-center font-mono text-xs">JD</div>
            </aside>

            {/* Mockup Dynamic Content Area */}
            <div className="flex-1 p-6 sm:p-10 text-left flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                  <span className="text-xs font-mono text-gray-400 pl-2">Console v1.4 // Live Analysis</span>
                </div>
                <span className="text-xs font-semibold bg-green-50 text-green-700 px-3 py-1 rounded-full border border-green-200">
                  94.2% Match Index
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <div className="space-y-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#16A34A]">Personal Trajectory</span>
                  <h3 className="text-3xl font-bold tracking-tight text-black">Technical Solutions Architect</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Analyzing active profiles at Meta, Vercel, and Stripe. You are currently <strong>85% matched</strong> to top senior criteria. Resolving 2 critical skill gaps completes qualification.
                  </p>
                  <div className="pt-2">
                    <button 
                      onClick={onGetStarted}
                      className="px-5 py-2.5 bg-[#16A34A] text-white text-xs font-semibold rounded-lg hover:bg-[#15803D] transition-colors"
                    >
                      Audit Your Profile
                    </button>
                  </div>
                </div>

                <div className="bg-gray-50 border border-[#E5E7EB] rounded-2xl p-5 space-y-4 shadow-sm">
                  <h4 className="text-sm font-semibold text-black">Active Market Demand Indicator</h4>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-gray-600">TypeScript Design Patterns</span>
                        <span className="text-green-600">Mastered</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-[#16A34A]" style={{ width: "95%" }}></div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-gray-600">PostgreSQL Tuning</span>
                        <span className="text-yellow-600">80% Competency</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-500" style={{ width: "80%" }}></div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-gray-400">Docker Orchestration</span>
                        <span className="text-red-500">Gap Detected</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-red-500" style={{ width: "35%" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6 mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-green-600" />
                  <span>Fully secured with MFA and encrypted data pipelines</span>
                </div>
                <span>Sync speed: 22ms latency</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Upload Sandbox Anchor */}
      <section id="quick-parse" className="bg-white py-16 px-6 border-y border-[#E5E7EB]">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-bold tracking-tight text-black">Quick Resume Parser Sandbox</h2>
          <p className="text-gray-500 max-w-xl mx-auto text-sm">
            Paste your current CV details below or click load sample to initiate the interactive ATS structural optimizer report instantly.
          </p>

          <form onSubmit={handleQuickSubmit} className="space-y-4 max-w-2xl mx-auto">
            <div className="flex justify-between items-center bg-gray-50 px-4 py-2 rounded-t-xl border-t border-x border-gray-200">
              <span className="text-xs font-mono text-gray-500">{quickResumeName || "scratchpad_resume.txt"}</span>
              <button 
                type="button" 
                onClick={loadSampleResume}
                className="text-xs bg-white border border-gray-200 px-3 py-1 rounded hover:bg-gray-100 transition-all font-medium text-[#16A34A]"
              >
                {isCopied ? "Sample Loaded!" : "Load Sample Developer CV"}
              </button>
            </div>
            <textarea
              required
              rows={6}
              value={quickResumeText}
              onChange={(e) => setQuickResumeText(e.target.value)}
              placeholder="Paste text elements representing experience details, projects, listed certifications, etc..."
              className="w-full px-4 py-3 rounded-b-xl border border-gray-200 bg-white text-black text-sm font-mono focus:outline-none focus:border-green-600"
            />
            <button
              type="submit"
              className="w-full py-3 bg-[#16A34A] hover:bg-[#15803D] text-white font-semibold rounded-xl text-sm transition-all shadow-sm"
            >
              Analyze Resume Text Now
            </button>
          </form>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 lg:px-16 max-w-7xl mx-auto w-full space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-bold tracking-tight text-black">Engineered Career Modules</h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Everything you need to successfully audit your worth, simulate real benchmarks, and streamline application processes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div 
              key={i} 
              onClick={onGetStarted}
              className="p-6 bg-white border border-[#E5E7EB] rounded-2xl hover:border-green-600 transition-all duration-200 cursor-pointer group shadow-sm flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <span className="text-2xl">{f.icon}</span>
                <h4 className="text-lg font-bold text-black group-hover:text-green-600 transition-colors">{f.name}</h4>
                <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
              <div className="flex items-center text-xs font-semibold text-green-600 space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Unlock Tool</span>
                <ChevronRight className="w-3 h-3" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Statistics counters section */}
      <section id="stats" className="bg-[#111827] text-white py-16 px-6 border-b border-gray-800">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          <div className="space-y-1">
            <span className="text-[#16A34A] text-4xl font-extrabold tracking-tight">1.2M+</span>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Jobs Analyzed daily</p>
          </div>
          <div className="space-y-1">
            <span className="text-[#16A34A] text-4xl font-extrabold tracking-tight">450K+</span>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Resumes Audited</p>
          </div>
          <div className="space-y-1">
            <span className="text-[#16A34A] text-4xl font-extrabold tracking-tight">98.4%</span>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">ATS Acceptance Ratio</p>
          </div>
          <div className="space-y-1">
            <span className="text-[#16A34A] text-4xl font-extrabold tracking-tight">$12.4K</span>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Average Salary Upgrade</p>
          </div>
        </div>
      </section>

      {/* Testimonials Carousel */}
      <section id="testimonials" className="py-20 bg-white px-6">
        <div className="max-w-4xl mx-auto space-y-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-black">Member Endorsements</h2>
          
          <div className="relative min-h-[180px] flex items-center justify-center px-4">
            <div className="space-y-6">
              <div className="flex justify-center flex-row space-x-1 text-yellow-500">
                <Star className="w-5 h-5 fill-yellow-500" />
                <Star className="w-5 h-5 fill-yellow-500" />
                <Star className="w-5 h-5 fill-yellow-500" />
                <Star className="w-5 h-5 fill-yellow-500" />
                <Star className="w-5 h-5 fill-yellow-500" />
              </div>
              <p className="text-xl italic text-gray-700 leading-relaxed font-serif max-w-2xl mx-auto">
                "{testimonials[activeTestimonial].quote}"
              </p>
              <div>
                <span className="block font-bold text-black text-sm">{testimonials[activeTestimonial].name}</span>
                <span className="block text-xs text-gray-400">{testimonials[activeTestimonial].role}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-center items-center space-x-6">
            <button 
              onClick={handlePrevTestimonial}
              className="p-2 border border-gray-200 rounded-full hover:bg-gray-50 text-gray-600 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex space-x-2">
              {testimonials.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`w-2 h-2 rounded-full ${idx === activeTestimonial ? "bg-[#16A34A] w-5" : "bg-gray-200"} transition-all`} 
                />
              ))}
            </div>
            <button 
              onClick={handleNextTestimonial}
              className="p-2 border border-gray-200 rounded-full hover:bg-gray-50 text-gray-600 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Grids */}
      <section id="pricing" className="bg-[#F5F5F5] py-20 px-6 border-t border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold tracking-tight text-black">Pricing Structures</h2>
            <p className="text-gray-500">Select the plan aligned with your career goals. No hidden fees.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free */}
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-8 flex flex-col justify-between space-y-8 shadow-sm">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Free Sandbox</h4>
                  <div className="text-4xl font-extrabold text-black mt-1">$0</div>
                  <span className="text-xs text-gray-400">Perfect for initial scratch analysis</span>
                </div>
                <div className="border-t border-gray-100 pt-4 space-y-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                    <span>3 Profile resume scans</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                    <span>Basic job match indices</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                    <span>General interview tips</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={onGetStarted}
                className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-black text-sm font-medium rounded-xl transition-all"
              >
                Access Free Sandbox
              </button>
            </div>

            {/* Pro Plan */}
            <div className="bg-[#111827] text-white rounded-2xl p-8 flex flex-col justify-between space-y-8 shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-[#16A34A] text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1 rounded-bl-xl">
                Most Popular
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Professional Pro</h4>
                  <div className="text-4xl font-extrabold text-white mt-1">$19<span className="text-sm font-normal text-gray-400">/mo</span></div>
                  <span className="text-xs text-gray-400">Infinite AI scans, complete roadmap unlocked</span>
                </div>
                <div className="border-t border-gray-800 pt-4 space-y-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-200">
                    <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                    <span>Unlimited AI Resume Parsing</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-200">
                    <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                    <span>Interactive AI Coach & Simulator</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-200">
                    <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                    <span>Full radar skill gap trackers</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-200">
                    <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                    <span>Priority prompt speeds</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={onGetStarted}
                className="w-full py-3 bg-[#16A34A] hover:bg-[#15803D] text-white text-sm font-semibold rounded-xl transition-all"
              >
                Activate Pro
              </button>
            </div>

            {/* Enterprise */}
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-8 flex flex-col justify-between space-y-8 shadow-sm">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Enterprise Hub</h4>
                  <div className="text-4xl font-extrabold text-black mt-1">Custom</div>
                  <span className="text-xs text-gray-400">For universities and recruiting nodes</span>
                </div>
                <div className="border-t border-gray-100 pt-4 space-y-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                    <span>Dedicated organization portals</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                    <span>Advanced talent CRM exports</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                    <span>Unlimited multi-seat invites</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={onGetStarted}
                className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-black text-sm font-medium rounded-xl transition-all"
              >
                Inquire Enterprise
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer bar */}
      <footer className="bg-white border-t border-[#E5E7EB] px-6 lg:px-16 py-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-[#16A34A] rounded-md flex items-center justify-center text-white text-xs font-bold">S</div>
            <span className="text-base font-bold text-black tracking-tight">SkillSync AI</span>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-xs text-gray-400">
            <a href="#" className="hover:text-black">About Dashboard</a>
            <a href="#" className="hover:text-black">Blog Systems</a>
            <a href="#" className="hover:text-black">Privacy Policy</a>
            <a href="#" className="hover:text-black">Terms of Service</a>
            <a href="#" className="hover:text-black">LinkedIn Connector</a>
            <a href="#" className="hover:text-black">Support Nodes</a>
          </div>

          <div className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} SkillSync AI. Made for Apple Human Interface System.
          </div>
        </div>
      </footer>
    </div>
  );
}
