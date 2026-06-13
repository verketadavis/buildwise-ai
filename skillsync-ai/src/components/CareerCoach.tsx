import { useState, useEffect, useRef } from "react";
import { Send, Sparkles, Brain, PlusCircle, AlertCircle, RefreshCw } from "lucide-react";
import { ChatMessage } from "../types";

interface CareerCoachProps {
  onSendMessage: (messages: ChatMessage[], skills: string[], role: string) => Promise<any>;
  userSkills: string[];
  targetRole: string;
}

export default function CareerCoach({ onSendMessage, userSkills, targetRole }: CareerCoachProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "init_1",
      sender: "coach",
      text: "Hello! My name is SkillSync Coach, your career intelligence mentor. I can help guide your workspace objectives, refine your resume STAR metrics, draft high-density networking copy, or plan strategic compensation reviews. Ask me anything to begin.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (customPrompt?: string) => {
    const promptToSend = customPrompt || inputText;
    if (!promptToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      sender: "user",
      text: promptToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputText("");
    setLoading(true);
    setError(null);

    try {
      const data = await onSendMessage(updatedMessages, userSkills, targetRole);
      const coachMsg: ChatMessage = {
        id: `msg_coach_${Date.now()}`,
        sender: "coach",
        text: data.text || "I'm keeping track of your career progress. Let's detail what objectives matter most to you.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, coachMsg]);
    } catch (err) {
      console.error(err);
      setError("Strategic coach link dropped. Re-routing fallback conversation...");
      // provide elegant custom fallback response
      setTimeout(() => {
        const fallbackMsg: ChatMessage = {
          id: `msg_fallback_${Date.now()}`,
          sender: "coach",
          text: "I want you to target quantifiable goals. Focus on outlining high-throughput business metrics, like latency reductions or deployment frequency. What parameters should we plan to highlight next?",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages((prev) => [...prev, fallbackMsg]);
        setError(null);
      }, 1000);
    } finally {
      setLoading(false);
    }
  };

  const instantPrompts = [
    { title: "Salary Negotiator", query: "Give me actionable negotiation metrics and scripts to raise my compensation baseline." },
    { title: "Resume STAR Bullets", query: "Can you help me rewrite a work accomplishment using STAR framework (Situation, Task, Action, Result)?" },
    { title: "Preventing Burnout", query: "I feel exhausted matching daily tasks. Provide strategies to block deep work versus chores." },
    { title: "Networking Message", query: "Draft a cold LinkedIn outreach copy for a Senior Engineering manager at Apple." }
  ];

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl shadow-sm flex flex-col h-[600px] overflow-hidden text-[#111827] animate-fade-in">
      {/* Coach Top Bar */}
      <div className="px-6 py-4 border-b border-[#E5E7EB] bg-gray-50 flex justify-between items-center bg-transparent">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-[#16A34A] border border-green-200">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-black text-sm">SkillSync Career Coach</h3>
            <div className="flex items-center space-x-1.5 text-xs text-gray-400">
              <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse"></span>
              <span>Online // RAG Career Oracle</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => setMessages([messages[0]])}
          className="text-xs text-gray-400 hover:text-black transition-colors"
        >
          Reset Logs
        </button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col max-w-[85%] ${m.sender === "user" ? "ml-auto items-end" : "mr-auto items-start"}`}
          >
            <div
              className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                m.sender === "user"
                  ? "bg-black text-white rounded-tr-none"
                  : "bg-gray-100 text-black border border-gray-200 rounded-tl-none"
              }`}
            >
              {m.text.split("\n").map((line, lineIdx) => (
                <p key={lineIdx} className={lineIdx > 0 ? "mt-2" : ""}>{line}</p>
              ))}
            </div>
            <span className="text-[10px] text-gray-450 mt-1 font-mono">{m.timestamp}</span>
          </div>
        ))}
        {loading && (
          <div className="mr-auto items-start max-w-[80%] flex flex-col">
            <div className="px-4 py-3 rounded-2xl bg-gray-100 text-gray-400 border border-gray-200 rounded-tl-none text-xs flex items-center space-x-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#16A34A]" />
              <span>Analyzing dynamic memory logs...</span>
            </div>
          </div>
        )}
        {error && (
          <div className="mx-auto text-center py-2 px-4 bg-yellow-50 border border-yellow-200 text-yellow-800 text-xs rounded-xl flex items-center space-x-2 max-w-sm">
            <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Instant Prompts Pills */}
      <div className="px-6 py-2 bg-gray-50/50 border-t border-gray-100 overflow-x-auto whitespace-nowrap flex items-center space-x-3 scrollbar-none">
        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 flex items-center space-x-1">
          <Sparkles className="w-3 h-3 text-[#16A34A]" />
          <span>Quick Prompts:</span>
        </span>
        {instantPrompts.map((p, i) => (
          <button
            key={i}
            disabled={loading}
            onClick={() => handleSend(p.query)}
            className="inline-block px-3 py-1 bg-white border border-[#E5E7EB] rounded-lg text-xs font-semibold hover:border-green-600 hover:text-green-600 transition-colors cursor-pointer text-gray-700 shadow-sm"
          >
            {p.title}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <div className="p-4 border-t border-[#E5E7EB] bg-gray-50 flex items-center space-x-3">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !loading) {
              handleSend();
            }
          }}
          disabled={loading}
          placeholder="Ask about promotions, mock interview reviews, strategic learning blocks..."
          className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm bg-white text-black placeholder-gray-400 focus:outline-none focus:border-green-600"
        />
        <button
          onClick={() => handleSend()}
          disabled={loading}
          className="p-3 bg-[#16A34A] hover:bg-[#15803D] disabled:bg-gray-300 text-white rounded-xl transition-colors shadow-sm"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
