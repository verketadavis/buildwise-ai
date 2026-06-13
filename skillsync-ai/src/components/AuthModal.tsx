import React, { useState, FormEvent } from "react";
import { X, Mail, Shield, Check, Command, Lock, Key } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (name: string, email: string) => void;
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [mfaCode, setMfaCode] = useState("");
  const [step, setStep] = useState<"auth" | "mfa" | "forgot">("auth");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleAuthSubmit = (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep("mfa"); // Require MFA as the premium default standard
    }, 900);
  };

  const handleMfaSubmit = (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        onSuccess(name || "John Doe", email || "user@example.com");
        onClose();
        // Reset states
        setStep("auth");
        setIsSignUp(false);
        setSuccess(false);
        setEmail("");
        setPassword("");
        setName("");
        setMfaCode("");
      }, 1000);
    }, 800);
  };

  const handleSocialClick = (provider: string) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSuccess(`${provider} Professional`, `pro.${provider.toLowerCase()}@career.com`);
      onClose();
    }, 1100);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md overflow-hidden bg-white rounded-2xl border border-gray-200 shadow-2xl p-8">
        {/* Header bar */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center text-white">
              <Command className="w-4 h-4" />
            </div>
            <span className="font-sans font-semibold text-lg text-black">SkillSync Auth</span>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 rounded-full text-gray-400 hover:text-black transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <AnimatePresence mode="wait">
          {success ? (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-200">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-sans font-semibold text-xl text-black">Authentication Approved</h3>
              <p className="text-gray-500 mt-2 text-sm">Synchronizing your professional intelligence profile...</p>
            </motion.div>
          ) : step === "mfa" ? (
            <motion.div 
              key="mfa"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h3 className="font-sans font-semibold text-xl text-black mb-2 flex items-center">
                <Shield className="w-5 h-5 text-green-600 mr-2" /> Double Authentication
              </h3>
              <p className="text-gray-500 text-sm mb-6">
                To guarantee account privacy, we have simulated a Multi-Factor token send to {email || "your address"}.
              </p>

              <form onSubmit={handleMfaSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                    Enter Verification Code
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="123456"
                    value={mfaCode}
                    onChange={(e) => setMfaCode(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-black placeholder-gray-400 focus:outline-none focus:border-green-600 font-mono text-center tracking-widest text-lg"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium rounded-xl transition-all duration-200 flex justify-center items-center"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    "Verify & Unlock Profile"
                  )}
                </button>

                <p className="text-center text-xs text-gray-500 mt-4">
                  Need a code? Use any 6 digits to bypass in preview mode.
                </p>
              </form>
            </motion.div>
          ) : step === "forgot" ? (
            <motion.div 
              key="forgot"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h3 className="font-sans font-semibold text-xl text-black mb-2 flex items-center">
                <Key className="w-5 h-5 text-green-600 mr-2" /> Recover Access
              </h3>
              <p className="text-gray-500 text-sm mb-6">
                Submit your registered email address and we will forward recovery credentials.
              </p>

              <form onSubmit={(e) => { e.preventDefault(); setStep("auth"); }} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="account@career.com"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-black placeholder-gray-400 focus:outline-none focus:border-green-600"
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setStep("auth")}
                    className="w-1/2 py-3 bg-gray-100 hover:bg-gray-200 text-black font-medium rounded-xl transition-all duration-200 text-sm"
                  >
                    Back to Log in
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl transition-all duration-200 text-sm"
                  >
                    Send Recovery
                  </button>
                </div>
              </form>
            </motion.div>
          ) : (
            <motion.div 
              key="auth"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <div className="text-center mb-6">
                <h3 className="font-sans font-semibold text-2xl text-black">
                  {isSignUp ? "Begin Your Career Jump" : "Welcome Back"}
                </h3>
                <p className="text-gray-500 text-sm mt-1">
                  {isSignUp ? "Setup secure intelligence details." : "Enter your coordinates to access dashboards."}
                </p>
              </div>

              {/* Social Login Cluster */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <button
                  type="button"
                  onClick={() => handleSocialClick("Google")}
                  className="py-2.5 px-3 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 transition-colors flex items-center justify-center text-xs font-medium text-gray-700 space-x-1"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"></span>
                  <span>Google</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSocialClick("GitHub")}
                  className="py-2.5 px-3 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 transition-colors flex items-center justify-center text-xs font-medium text-gray-700 space-x-1"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-neutral-900 inline-block"></span>
                  <span>GitHub</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSocialClick("LinkedIn")}
                  className="py-2.5 px-3 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 transition-colors flex items-center justify-center text-xs font-medium text-gray-700 space-x-1"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block"></span>
                  <span>LinkedIn</span>
                </button>
              </div>

              <div className="relative flex items-center justify-center my-6">
                <div className="absolute inset-0 bg-gray-200 h-[1px]" />
                <span className="relative px-3 bg-white text-xs text-gray-400 uppercase tracking-widest font-medium">Or email coordinate</span>
              </div>

              <form onSubmit={handleAuthSubmit} className="space-y-4">
                {isSignUp && (
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Jane Shepard"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-black placeholder-gray-400 focus:outline-none focus:border-green-600 text-sm"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="jane@career.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-black placeholder-gray-400 focus:outline-none focus:border-green-600 text-sm"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Secret Password
                    </label>
                    {!isSignUp && (
                      <button
                        type="button"
                        onClick={() => setStep("forgot")}
                        className="text-xs text-green-600 hover:underline"
                      >
                        Reset password?
                      </button>
                    )}
                  </div>
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-black placeholder-gray-400 focus:outline-none focus:border-green-600 text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium rounded-xl transition-all duration-200 flex justify-center items-center mt-6 text-sm"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    isSignUp ? "Generate Secure Account" : "Access Personal Platform"
                  )}
                </button>
              </form>

              <div className="text-center mt-6">
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-xs text-gray-500 hover:text-black transition-colors"
                >
                  {isSignUp ? "Hold an account? Sign in here" : "Don't hold an authorized account? Draft one"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
