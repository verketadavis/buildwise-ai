import React, { useState, FormEvent } from "react";
import { Sparkles, MessageSquare, Copy, Check, Send, RefreshCw } from "lucide-react";
import { NetworkingDraft } from "../types";

export default function NetworkingAssistant({
  onDraftNetwork
}: {
  onDraftNetwork: (relationshipType: string, targetCompany: string, userBack: string) => Promise<NetworkingDraft>;
}) {
  const [type, setType] = useState("Cold Referral Outreach");
  const [company, setCompany] = useState("Apple Inc.");
  const [background, setBackground] = useState("Experienced Front-end Engineer specializing in sub-100ms state rendering and WebWorkers performance.");
  const [loading, setLoading] = useState(false);
  const [draft, setDraft] = useState<NetworkingDraft | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDraft = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await onDraftNetwork(type, company, background);
      setDraft(data);
    } catch (err) {
      console.error(err);
      setError("Strategic drafting network offline. Loading fallback draft structures.");
      setDraft({
        type: "Cold Referral Outreach",
        subject: "Innovative Systems Query: latency optimization benchmarks",
        body: `Hi [Recipient Name],\n\nI admired your team's structural strategy in implementing system migrations at ${company}. I am an engineer specializing in high-throughput applications and built an isolated worker runtime recently that cuts endpoint delivery by 25%.\n\nI would love to learn more briefly about whether you are seeing similar bottlenecks in Edge frameworks, and if any openings are planned in the coming months.\n\nBest regards,\n[Your Name]`
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!draft) return;
    navigator.clipboard.writeText(draft.body);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const typesList = ["Cold Referral Outreach", "LinkedIn Connection", "Cold Professional Hiring Pitch", "Interview Thank-You", "Transition Advice"];

  return (
    <div className="space-y-8 animate-fade-in text-[#111827]">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-black">AI Strategic Networking Assistant</h2>
        <p className="text-sm text-gray-500 font-normal">Draft high impact cold emails, referral proposals, and LinkedIn thank-you messages in seconds.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Parameter Panel */}
        <div className="lg:col-span-5 bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 border-b border-gray-100 pb-3">
            <MessageSquare className="w-5 h-5 text-[#16A34A]" />
            <span className="font-bold text-sm uppercase tracking-wide">Outbound Strategy Coordinates</span>
          </div>

          <form onSubmit={handleDraft} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Message Intent Category</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-green-600"
              >
                {typesList.map((t, idx) => (
                  <option key={idx} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Target Corporate Node / Entity</label>
              <input
                type="text"
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Stripe, AWS, Vercel"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-green-600 font-normal text-black"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Your Professional Strengths Highlight</label>
              <textarea
                rows={4}
                required
                value={background}
                onChange={(e) => setBackground(e.target.value)}
                placeholder="Write specific achievements or skills to weave seamlessly into your proposal..."
                className="w-full px-4 py-3 bg-gray-50 border border-[#E5E7EB] rounded-xl text-xs focus:outline-none focus:border-green-600 leading-relaxed font-normal text-black"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#111827] hover:bg-black text-white disabled:bg-gray-300 font-semibold rounded-xl text-xs uppercase tracking-wider transition-colors flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#16A34A]" />
                  <span>Configuring outbound draft copy...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-white animate-pulse" />
                  <span>Draft Message Copy</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Output Area */}
        <div className="lg:col-span-7">
          {draft ? (
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm space-y-6 animate-slide-up">
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">AI OUTBOUND DRAFT ELEMENT</span>
                  <p className="text-xs text-[#16A34A] font-semibold">{draft.type}</p>
                </div>

                <button
                  onClick={handleCopy}
                  className="px-4 py-2 bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-600 font-semibold rounded-lg text-xs flex items-center space-x-1"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#16A34A]" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-gray-400" />
                      <span>Copy Template</span>
                    </>
                  )}
                </button>
              </div>

              {draft.subject && (
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-gray-400">Subject coordinate</span>
                  <p className="text-xs text-black font-semibold bg-gray-50 border border-gray-100 p-2.5 rounded-lg">{draft.subject}</p>
                </div>
              )}

              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-gray-400 block">DRAFT TEXT</span>
                <div className="p-4 bg-[#111827] text-gray-205 font-mono text-xs leading-relaxed rounded-xl whitespace-pre-wrap text-white">
                  {draft.body}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-12 text-center text-xs text-gray-500 h-full min-h-[350px] flex flex-col items-center justify-center">
              <MessageSquare className="w-10 h-10 text-gray-300 mb-3 animate-pulse" />
              <span>Awaiting coordinates parameters to structure high-throughput cold pitch templates.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
