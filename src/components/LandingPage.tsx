import { motion } from "motion/react";
import { 
  FileText, Activity, Layers, Users, Calendar, BarChart3, Leaf, KeyRound, CheckSquare, Sparkles, Building, TrendingDown, ChevronRight, Upload, Hammer 
} from "lucide-react";

interface LandingPageProps {
  onStartEstimate: () => void;
  onQuickUpload: () => void;
  hasProjects?: boolean;
  onEnterWorkspace?: () => void;
}

export default function LandingPage({ onStartEstimate, onQuickUpload, hasProjects, onEnterWorkspace }: LandingPageProps) {
  const features = [
    {
      icon: FileText,
      title: "AI Blueprint Analysis",
      desc: "Instantly parse blueprint files (PDF, JPG, CAD) to map floor areas, room dimensions, foundation spans, and framing specs."
    },
    {
      icon: Layers,
      title: "AI Cost Estimator",
      desc: "Obtain accurate construction budgets calculated globally and locally across low, standard, and custom-level finish categories."
    },
    {
      icon: BarChart3,
      title: "AI Material Quantity Calculator",
      desc: "Instant breakdown of direct materials (concrete yards, steel tons, timber stud count) with structural waste allowance buffers."
    },
    {
      icon: Users,
      title: "AI Labor Forecast",
      desc: "Estimates specialized framing joiners, masonry layers, electricians, and plumbers shifts and crew capacities by region."
    },
    {
      icon: Calendar,
      title: "Construction Timeline Generator",
      desc: "Develop structural week-by-week schedules, mapping key dependent check-points, and identifying weather delay buffers."
    },
    {
      icon: Activity,
      title: "Contractor Quote Comparison",
      desc: "Upload contractor proposals to run algorithmic side-by-side audits, instantly detecting double charges or high premiums."
    },
    {
      icon: Leaf,
      title: "Carbon Footprint Calculator",
      desc: "Track building concrete & transit CO₂ loading, benchmark performance scores, and receive low-emissions substitutions advice."
    },
    {
      icon: Building,
      title: "Regional Pricing Intelligence",
      desc: "Adjusts building indexes dynamically under state multipliers, local municipal sales tax, and Canadian GST/HST provincial tables."
    },
    {
      icon: KeyRound,
      title: "Permit Cost Estimator",
      desc: "Plan cost expectations for local applications, connection fees, and county water buffers across US & Canadian borders."
    },
    {
      icon: CheckSquare,
      title: "Budget Risk Detection",
      desc: "Evaluates project exposures to extreme soils shifting, steep mountain incline complications, or subcontractor sourcing voids."
    },
    {
      icon: TrendingDown,
      title: "Change Order Predictor",
      desc: "Calculate instant modified quotes for late-stage revisions, such as bedroom additions or metal roofing deck switches."
    },
    {
      icon: Sparkles,
      title: "AI Construction Advisor",
      desc: "Conversational consultant trained on local building standards, providing responsive code assistance and design guidance."
    }
  ];

  return (
    <div className="bg-brand-cream/15 min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-cream/50 via-white to-brand-cream/10 py-16 px-6 sm:py-28 lg:px-8 border-b border-brand-sky/15">
        <div className="mx-auto max-w-5xl text-center">

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-8 text-4xl font-extrabold tracking-tight text-brand-dark-navy sm:text-6xl md:text-7xl font-sans leading-tight"
          >
            Know the Real Cost <br />
            <span className="text-brand-crimson">Before You Build.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed font-sans"
          >
            Upload your plans, choose your location, and let AI generate an accurate construction estimate, material schedules, labor hours, and local building permit requirements in minutes.
          </motion.p>

          {/* CTA Buttons - Optimally Reduced for Mobile Screens */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex flex-row flex-wrap sm:flex-nowrap justify-center items-center gap-3 w-full max-w-xl mx-auto px-4"
          >
            {hasProjects && onEnterWorkspace && (
              <button
                onClick={onEnterWorkspace}
                className="w-full sm:w-auto rounded-xl bg-brand-dark-navy px-5 py-3 sm:px-8 sm:py-4 text-xs sm:text-base font-bold text-white transition-all hover:bg-black hover:scale-[1.03] shadow-md focus:outline-none flex items-center justify-center gap-1.5"
                id="btn-hero-workspace-direct"
              >
                <span>Enter Active Workspace</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={onStartEstimate}
              className="w-full sm:w-auto rounded-xl bg-brand-crimson px-5 py-3 sm:px-8 sm:py-4 text-xs sm:text-base font-semibold text-white transition-all hover:bg-brand-maroon hover:scale-[1.03] shadow-md hover:shadow-brand-crimson/15 focus:outline-none"
              id="btn-hero-start"
            >
              Start Free Estimate
            </button>
            <button
              onClick={onQuickUpload}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 rounded-xl border border-brand-sky/30 bg-white/90 px-5 py-3 sm:px-8 sm:py-4 text-xs sm:text-base font-semibold text-brand-dark-navy transition-all hover:bg-brand-cream hover:scale-[1.01] focus:outline-none"
              id="btn-hero-upload"
            >
              <Upload className="h-4 w-4 sm:h-5 sm:w-5 text-brand-dark-navy" />
              Upload House Plans
            </button>
          </motion.div>
        </div>

        {/* Dynamic Static Preview Frame / Dashboard Teaster */}
        <div className="mx-auto mt-16 max-w-6xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="overflow-hidden rounded-2xl border border-brand-sky/20 bg-white p-4 shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-brand-sky/10 pb-3 mb-4">
              <div className="flex gap-2">
                <span className="h-3 w-3 rounded-full bg-brand-crimson"></span>
                <span className="h-3 w-3 rounded-full bg-brand-sky"></span>
                <span className="h-3 w-3 rounded-full bg-brand-cream border border-brand-sky/30"></span>
              </div>
              <div className="rounded bg-brand-cream/40 px-6 py-1 text-center font-sans text-xs text-brand-dark-navy font-semibold">
                buildwise.ai/workspaces/austin_modern_dwelling
              </div>
              <div className="text-xs text-gray-400">Preview Mode</div>
            </div>

            {/* Simulated mini dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-xl border border-brand-sky/15 bg-brand-cream/25 p-5 text-left">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Estimated Total Cost</span>
                <div className="mt-2 text-3xl font-extrabold text-brand-dark-navy font-mono">$442,000</div>
                <div className="mt-1 flex items-center gap-1.5 text-xs text-brand-crimson font-semibold font-sans">
                  <span>Standard localized finish specs</span>
                </div>
              </div>
              <div className="rounded-xl border border-brand-sky/15 bg-brand-cream/25 p-5 text-left">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Confidence Level</span>
                <div className="mt-2 text-3xl font-extrabold text-brand-dark-navy font-mono">92%</div>
                <div className="mt-1 text-xs text-brand-sky font-sans font-semibold">Anchored via city-level indexes</div>
              </div>
              <div className="rounded-xl border border-brand-sky/15 bg-brand-cream/25 p-5 text-left">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Regional Index Factor</span>
                <div className="mt-2 text-3xl font-extrabold text-brand-dark-navy font-mono">1.08x</div>
                <div className="mt-1 text-xs text-brand-maroon font-semibold font-sans">Austin Central multi-multiplier</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Grid Features Highlights Section - Beautiful Dark Contrast */}
      <section id="features" className="py-24 px-6 sm:py-32 lg:px-8 bg-brand-dark-navy">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl font-sans">
              End-to-End Artificial Intelligence for Builders and Investors
            </h2>
            <p className="mt-4 text-base text-gray-300 font-sans">
              Deploy modular, location-aware estimators configured under U.S. building schedules and Canadian municipal directives.
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-5xl sm:mt-20 lg:mt-24">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feat, idx) => {
                const Icon = feat.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.05 }}
                    className="flex flex-col rounded-2xl border border-brand-sky/20 bg-brand-navy-darker/60 p-6 shadow-sm hover:border-brand-crimson hover:shadow-lg transition-all group"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-dark-navy text-brand-sky group-hover:bg-brand-crimson group-hover:text-white transition-colors duration-200 shadow-inner">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-4 font-sans text-lg font-bold text-white group-hover:text-brand-sky transition-colors">{feat.title}</h3>
                    <p className="mt-2 flex-grow font-sans text-sm text-gray-300 leading-relaxed">{feat.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Geography Section */}
      <section id="about" className="py-20 px-6 bg-brand-cream/20 border-t border-b border-brand-sky/15">
        <div className="mx-auto max-w-4xl text-center">
          <div className="flex justify-center mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-cream border border-brand-sky/35 text-brand-crimson shadow-md">
              <Building className="h-6 w-6" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-brand-dark-navy font-sans">Regional Pricing Engines: Made for U.S. and Canadian Workflows</h2>
          <p className="mt-4 text-sm sm:text-base text-gray-650 leading-relaxed font-sans max-w-3xl mx-auto">
            BuildWise AI utilizes distinct algorithms to map your location data. In the United States, it parses city labor multipliers and regional sales tax rules. In Canada, it incorporates provincial pricing variations, cold climate structural requirements, and precise Goods and Services Tax (GST) or Harmonized Sales Tax (HST) considerations—ensuring your planning conforms perfectly before you break ground.
          </p>
        </div>
      </section>

      {/* Exquisite Footer */}
      <footer className="bg-brand-navy-darker border-t border-brand-sky/15 text-white font-sans mt-auto">
        <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
            
            {/* Column 1: Brand Info */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-2.5 text-white">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-crimson text-white shadow-md">
                  <Hammer className="h-5 w-5" />
                </div>
                <span className="font-sans text-xl font-bold tracking-tight">
                  BuildWise<span className="text-brand-crimson">.AI</span>
                </span>
              </div>
              <p className="text-sm text-gray-300 max-w-md leading-relaxed">
                Precision construction intelligence for developers, general contractors, and residential coordinators across North America. Benchmark and audit blueprint material parameters dynamically.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-brand-sky/10 border border-brand-sky/20 px-2.5 py-1 text-[10px] font-semibold text-brand-sky">
                  🛡️ SOC-2 Compliance
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-brand-crimson/10 border border-brand-crimson/20 px-2.5 py-1 text-[10px] font-semibold text-brand-crimson">
                  🇨🇦 🇺🇸 Cross-Border Matrix
                </span>
              </div>
            </div>

            {/* Column 2: Features Directory */}
            <div>
              <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Features</h3>
              <ul className="mt-4 space-y-2 text-xs text-gray-400">
                <li><a href="#features" className="hover:text-brand-sky transition-colors">AI Blueprint Analysis</a></li>
                <li><a href="#features" className="hover:text-brand-sky transition-colors">AI Materials Calculator</a></li>
                <li><a href="#features" className="hover:text-brand-sky transition-colors">Contractor Audit Panel</a></li>
                <li><a href="#features" className="hover:text-brand-sky transition-colors">Carbon Index Engine</a></li>
              </ul>
            </div>

            {/* Column 3: Regional Scope */}
            <div>
              <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Regional Schedules</h3>
              <ul className="mt-4 space-y-2 text-xs text-gray-400 font-sans">
                <li><span className="text-gray-300 font-semibold block">US Estimators</span> Municipal building regulations & tax multipliers.</li>
                <li><span className="text-gray-300 font-semibold block">CA Estimators</span> Provincial schedules & cold weather rating grids.</li>
              </ul>
            </div>

          </div>

          <div className="mt-12 border-t border-brand-sky/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
            <p>© 2026 BuildWise AI Technologies Inc. All rights reserved.</p>
            <div className="flex gap-4 sm:gap-6">
              <span className="hover:text-brand-sky cursor-pointer transition-colors">Privacy Policy</span>
              <span className="hover:text-brand-sky cursor-pointer transition-colors">Terms of Service</span>
              <span className="hover:text-brand-sky cursor-pointer transition-colors">Security Audit Log</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

