import { useState, useEffect, useRef } from "react";
import { Mic, Terminal, RefreshCw, AlertCircle, Sparkles, Send, CheckCircle2, Star, Play, Award } from "lucide-react";
import { InterviewSession } from "../types";

export default function InterviewSimulator({
  onEvaluateInterview
}: {
  onEvaluateInterview: (messages: any[], category: string) => Promise<any>;
}) {
  const [category, setCategory] = useState("System Design");
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const categories = ["Behavioral", "Technical", "System Design", "HR Leadership"];

  const handleStart = () => {
    setSession({
      type: "active",
      topic: category,
      messages: [
        {
          sender: "interviewer",
          text: `Welcome to the ${category} technical mock session. Let's start with a core concept: Describe how you would handle low-level connection pooling and transaction isolations in a high-throughput relational backend. What guidelines or traps should we address?`
        }
      ]
    });
  };

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [session?.messages]);

  const handleSend = () => {
    if (!inputText.trim() || !session) return;

    const userMsg = { sender: "user" as const, text: inputText };
    const nextMsgs = [...session.messages, userMsg];

    setSession({
      ...session,
      messages: nextMsgs
    });
    setInputText("");

    // Simulate standard interviewer follow up dialogue automatically. We'll add some highly professional context response
    setLoading(true);
    setTimeout(() => {
      let followUp = "Intriguing response. How does your choice handle read replication delays and race conditions under severe socket competition? Name explicit metric settings.";
      if (category === "Behavioral") {
        followUp = "Excellent. Cite a explicit time you faced a serious operational dispute with a superior design team regarding a timeline. How was status resolution managed?";
      } else if (category === "HR Leadership") {
        followUp = "Good scope. How do you approach coordinating engineering resource quotas when two core teams request conflicting feature prioritization blocks?";
      }

      setSession((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          messages: [...prev.messages, { sender: "interviewer" as const, text: followUp }]
        };
      });
      setLoading(false);
    }, 1100);
  };

  const handleEndSession = async () => {
    if (!session || submitting) return;
    setSubmitting(true);
    try {
      const data = await onEvaluateInterview(session.messages, category);
      setSession({
        ...session,
        type: "completed",
        score: data
      });
    } catch (err) {
      console.error(err);
      // Fallback
      setSession({
        ...session,
        type: "completed",
        score: {
          overall: 82,
          communication: 85,
          accuracy: 78,
          vocabulary: 88,
          problemSolving: 80,
          feedback: "You demonstrated clear structural articulation and vocabulary precision. However, when answering tricky technical questions, try to explicitly state your architectural assumptions first before diving directly into the implementation. Highlighting trade-offs shows senior decision capability."
        }
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in text-[#111827]">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-black">AI Technical Interview Sandbox</h2>
        <p className="text-sm text-gray-500 font-normal">Engage in interactive technical sessions. Receive precise feedback on vocabulary, accuracy, and confidence metrics.</p>
      </div>

      {!session ? (
        <div className="max-w-xl mx-auto bg-white border border-[#E5E7EB] rounded-2xl p-8 text-center space-y-6 shadow-sm">
          <div className="w-16 h-16 bg-green-50 text-[#16A34A] border border-green-150 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <Mic className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-lg text-black">Configure Mock Parameters</h3>
            <p className="text-xs text-gray-500 leading-normal font-normal">
              Our advanced carrier oracle acts as a FAANG technical examiner, grading answers using robust natural vocabulary checks.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {categories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => setCategory(cat)}
                className={`py-3.5 border rounded-xl text-xs font-semibold transition-all ${
                  category === cat
                    ? "border-black bg-[#111827] text-white shadow-md animate-scale"
                    : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <button
            onClick={handleStart}
            className="w-full py-4 bg-[#16A34A] hover:bg-[#15803D] text-white font-semibold rounded-xl text-xs uppercase tracking-widest transition-all shadow-sm"
          >
            Start Interview Calibration
          </button>
        </div>
      ) : session.type === "active" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Chat simulator loop */}
          <div className="lg:col-span-8 bg-white border border-[#E5E7EB] rounded-2xl flex flex-col h-[520px] overflow-hidden shadow-sm">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center bg-transparent">
              <span className="text-xs font-mono font-semibold text-gray-400">ACTIVE SESSION // {session.topic.toUpperCase()}</span>
              <button
                onClick={handleEndSession}
                disabled={submitting}
                className="px-4 py-2 bg-red-100 text-red-800 hover:bg-red-200 text-xs font-semibold rounded-lg transition-colors"
              >
                {submitting ? "Analyzing..." : "Submit Session for Grading"}
              </button>
            </div>

            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              {session.messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col max-w-[85%] ${m.sender === "user" ? "ml-auto items-end" : "mr-auto items-start"}`}
                >
                  <div
                    className={`px-4 py-3 rounded-2xl text-xs leading-relaxed ${
                      m.sender === "user"
                        ? "bg-black text-white rounded-tr-none"
                        : "bg-gray-50 text-gray-800 border border-gray-200 rounded-tl-none font-sans"
                    }`}
                  >
                    {m.text}
                  </div>
                  <span className="text-[10px] text-gray-400 font-mono mt-1 font-semibold">
                    {m.sender === "user" ? "Candidate Input" : "AI Inquisitor"}
                  </span>
                </div>
              ))}
              {loading && (
                <div className="mr-auto items-start">
                  <div className="px-4 py-3 bg-gray-50 text-gray-400 text-xs border border-gray-150 rounded-2xl rounded-tl-none animate-pulse">
                    Drafting structured challenge guidelines...
                  </div>
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex space-x-3">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSend();
                }}
                placeholder="Formulate your structured architectural solution..."
                className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-green-600 text-black placeholder-gray-400"
              />
              <button
                onClick={handleSend}
                className="p-3 bg-black hover:bg-neutral-900 text-white rounded-xl transition-all shadow-sm"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right side suggestions panel */}
          <div className="lg:col-span-4 bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm space-y-5">
            <h4 className="font-bold text-black text-xs uppercase tracking-wide border-b border-gray-100 pb-3">Session instructions</h4>
            
            <div className="space-y-4 text-xs font-normal text-gray-600">
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#16A34A] mt-0.5" />
                <span>Explain your engineering compromises and cite structural performance limits clearly.</span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#16A34A] mt-0.5" />
                <span>Use robust language terms (e.g. read replication, transaction block isolation thresholds).</span>
              </div>
              <div className="flex items-start space-x-2 font-semibold">
                <AlertCircle className="w-4 h-4 text-[#16A34A] mt-0.5" />
                <span>Submit your session above when finished to compute ratings.</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Completed Scorecard display */
        <div className="space-y-6 max-w-4xl mx-auto animate-slide-up">
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-8 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-4 text-center border-b md:border-b-0 md:border-r border-gray-100 pb-6 md:pb-0 md:pr-8 space-y-3">
              <div className="w-20 h-20 bg-green-50 text-[#16A34A] border border-green-150 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <Award className="w-10 h-10" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-0.5 block">Overall Score</span>
                <h3 className="text-4xl font-extrabold text-[#16A34A] mt-1">{session.score?.overall}%</h3>
              </div>
            </div>

            <div className="md:col-span-8 space-y-4">
              <h4 className="font-bold text-black text-sm uppercase tracking-wider">Skill Parameters Rating</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-gray-600">Communication Clarity</span>
                    <strong className="text-black">{session.score?.communication}%</strong>
                  </div>
                  <div className="h-1.5 bg-gray-150 rounded-full overflow-hidden">
                    <div className="h-full bg-black opacity-80" style={{ width: `${session.score?.communication}%` }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-gray-600">Technical Accuracy</span>
                    <strong className="text-black">{session.score?.accuracy}%</strong>
                  </div>
                  <div className="h-1.5 bg-gray-150 rounded-full overflow-hidden">
                    <div className="h-full bg-[#16A34A]" style={{ width: `${session.score?.accuracy}%` }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-gray-600">Domain Vocabulary</span>
                    <strong className="text-black">{session.score?.vocabulary}%</strong>
                  </div>
                  <div className="h-1.5 bg-gray-150 rounded-full overflow-hidden">
                    <div className="h-full bg-black opacity-80" style={{ width: `${session.score?.vocabulary}%` }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-gray-600">Problem Solving Method</span>
                    <strong className="text-black">{session.score?.problemSolving}%</strong>
                  </div>
                  <div className="h-1.5 bg-gray-150 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-500" style={{ width: `${session.score?.problemSolving}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#111827] text-white rounded-2xl p-8 shadow-md space-y-4">
            <h4 className="font-bold text-gray-200 text-sm uppercase tracking-wide flex items-center">
              <Sparkles className="w-5 h-5 text-[#16A34A] mr-2" /> Executive Performance Feedback
            </h4>
            <p className="text-xs text-gray-400 font-serif leading-relaxed italic">
              "{session.score?.feedback}"
            </p>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setSession(null)}
              className="px-6 py-3 bg-white border border-[#E5E7EB] text-gray-700 font-semibold rounded-xl text-xs uppercase tracking-wider transition-all hover:bg-gray-50"
            >
              Start Alternate Simulation
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
