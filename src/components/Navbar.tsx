import { Hammer, Calculator, Briefcase, HelpCircle, ShieldAlert } from "lucide-react";

interface NavbarProps {
  onStartEstimate: () => void;
  onNavigateHome: () => void;
}

export default function Navbar({ onStartEstimate, onNavigateHome }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-brand-sky/20 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-2.5 text-brand-dark-navy hover:opacity-90 transition-opacity focus:outline-none"
          id="btn-nav-logo"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-crimson text-white shadow-md">
            <Hammer className="h-5 w-5" />
          </div>
          <span className="font-sans text-xl font-bold tracking-tight text-brand-dark-navy">
            BuildWise<span className="text-brand-crimson">.AI</span>
          </span>
        </button>

        {/* Action Links */}
        <div className="hidden md:flex items-center gap-8 font-sans text-sm font-medium text-gray-600">
          <button onClick={onNavigateHome} className="hover:text-brand-crimson transition-colors" id="btn-nav-home">
            Overview
          </button>
          <a href="#features" className="hover:text-brand-crimson transition-colors" id="btn-nav-features">
            Features
          </a>
          <a href="#about" className="hover:text-brand-crimson transition-colors" id="btn-nav-regions">
            US & Canadian Cost Index
          </a>
        </div>

        {/* CTA Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={onStartEstimate}
            className="rounded-xl bg-brand-dark-navy px-4 py-2 font-sans text-sm font-medium text-white transition-all hover:bg-brand-crimson hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-brand-crimson"
            id="btn-nav-cta"
          >
            Start Free Estimate
          </button>
        </div>
      </div>
    </header>
  );
}
