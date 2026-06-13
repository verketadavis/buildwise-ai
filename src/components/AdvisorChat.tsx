import { useState, useRef, useEffect } from "react";
import { ChatMessage, Project } from "../types";
import { 
  Sparkles, Send, Bot, User, RefreshCw, HelpCircle, AlertOctagon, Info 
} from "lucide-react";

interface AdvisorChatProps {
  currentProject?: Project;
}

export default function AdvisorChat({ currentProject }: AdvisorChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "init",
      role: "model",
      text: "Hello! I am your BuildWise AI Construction Advisor. I am grounded in trusted United States and Canadian building codes, quantity surveying guidelines, and municipal permitting workflows.\n\nHow can I help you optimize your layout, verify localized permit criteria, or evaluate contractor margins today?",
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const quickStartPrompts = [
    { title: "Permit rules & codes", query: "What are the common setback restrictions and permit milestones under IRC building codes?" },
    { title: "Reduce total costs", query: "What material substitutions can I make to shave structural siding and concrete carbon footprint costs?" },
    { title: "Soil geotech risks", query: "Explain foundation and shoring requirements for expansive central Texas clays or soggy Vancouver silt soils." }
  ];

  // Auto scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: "user_" + Math.random().toString(36).substr(2, 5),
      role: "user",
      text,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat-advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          currentProject
        })
      });
      const reply = await response.json();
      setMessages(prev => [...prev, reply]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, {
        id: "err",
        role: "model",
        text: "I experienced a minor connection latency. Let's try again! You can explore details of your estimates, design options, or budget cuts anytime.",
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto font-sans h-[calc(100vh-64px)] flex flex-col">
      {/* Upper header */}
      <div className="flex justify-between items-center pb-4 border-b border-gray-200 mb-6 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-extrabold text-black tracking-tight flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-green-700" />
            AI Construction Advisor
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Grounded in active U.S. and Canadian building codes to assist in quantity estimations.
          </p>
        </div>
        
        {currentProject && (
          <div className="text-right hidden sm:block bg-green-50 px-3 py-1.5 rounded-xl border border-green-200 text-[11px] text-green-800 font-semibold">
            Context: {currentProject.name}
          </div>
        )}
      </div>

      {/* RAG Quick Assist Area */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 flex-shrink-0">
        {quickStartPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(p.query)}
            className="text-left p-3 rounded-xl border border-gray-200 bg-white hover:border-green-700 transition-all text-[11px] text-gray-600 block group outline-none"
            id={`btn-chat-prompt-${idx}`}
          >
            <span className="font-bold text-black block group-hover:text-green-700 transition-colors mb-0.5">{p.title}</span>
            <span className="truncate block text-gray-400">{p.query}</span>
          </button>
        ))}
      </div>

      {/* Messages Scrolling Grid */}
      <div className="flex-1 overflow-y-auto border border-gray-200 rounded-2xl bg-white p-5 space-y-4 mb-4">
        {messages.map((m) => {
          const isBot = m.role === "model";
          return (
            <div key={m.id} className={`flex gap-3.5 max-w-3xl ${isBot ? "" : "ml-auto flex-row-reverse"}`}>
              {/* Avatar circle */}
              <div className={`h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 border ${
                isBot ? "bg-green-700 border-green-800 text-white" : "bg-black border-black text-white"
              }`}>
                {isBot ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
              </div>

              {/* Message Context Bubble */}
              <div className={`p-4 rounded-2xl text-xs font-sans leading-relaxed whitespace-pre-wrap shadow-sm border ${
                isBot 
                  ? "bg-[#F5F5F5] border-gray-250 text-black" 
                  : "bg-black border-black text-white"
              }`}>
                {m.text}
              </div>
            </div>
          );
        })}
        {isLoading && (
          <div className="flex gap-3.5">
            <div className="h-8 w-8 rounded-lg bg-green-700 border border-green-800 text-white flex items-center justify-center">
              <Bot className="h-4 w-4 animate-bounce" />
            </div>
            <div className="p-4 rounded-2xl bg-[#F5F5F5] border border-gray-250 flex items-center gap-1.5 text-xs text-gray-400">
              <span className="h-1.5 w-1.5 rounded-full bg-green-700 animate-ping"></span>
              Advisor is organizing building parameters...
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* User Input row */}
      <form 
        onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputText); }}
        className="flex gap-2 flex-shrink-0"
      >
        <input 
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 rounded-xl border border-gray-300 p-3 outline-none text-xs bg-white focus:ring-1 focus:ring-green-700 text-black font-sans"
          placeholder="Ask about setbacks, material saving substitutions, Canadian GST calculations, or IRC structural codes..."
          required
        />
        <button
          type="submit"
          className="rounded-xl bg-black px-5 py-3 text-white hover:bg-green-700 focus:outline-none transition-colors"
          id="btn-chat-send"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
