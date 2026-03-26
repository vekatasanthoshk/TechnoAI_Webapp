import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Bot } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
}

// Keyword-based response map for smarter replies
const responses: { keywords: string[]; reply: string }[] = [
  {
    keywords: ["price", "cost", "pricing", "how much", "fee", "charge"],
    reply: "Our pricing is tailored to your business needs. We offer flexible packages for automation, AI agents, and data systems. Book a free consultation and we'll put together a custom quote for you.",
  },
  {
    keywords: ["automation", "automate", "workflow", "process"],
    reply: "Our Business Automation service streamlines your workflows, eliminates repetitive tasks, and integrates seamlessly with your existing tools — saving you time and reducing operational costs.",
  },
  {
    keywords: ["ai agent", "chatbot", "agent", "bot", "assistant"],
    reply: "We build custom AI agents trained on your business data — for sales, support, marketing, and operations. They work 24/7 and continuously improve over time.",
  },
  {
    keywords: ["data", "analytics", "insight", "decision", "report"],
    reply: "Our Data Decision Systems turn raw data into actionable insights. We build dashboards, predictive models, and automated reporting pipelines tailored to your KPIs.",
  },
  {
    keywords: ["ecommerce", "e-commerce", "shop", "store", "product", "inventory"],
    reply: "Our AI eCommerce solutions include intelligent product recommendations, dynamic pricing, automated customer segmentation, and predictive inventory management.",
  },
  {
    keywords: ["marketing", "leads", "campaign", "ads", "seo", "social"],
    reply: "We run AI-optimized marketing campaigns that have delivered 85% lead increases for our clients. Our agents continuously optimize ad spend and targeting in real time.",
  },
  {
    keywords: ["consult", "consultation", "meeting", "call", "demo", "talk"],
    reply: "We'd love to connect! Click the 'Book Consultation' button at the top of the page or fill out the contact form — we'll get back to you within 24 hours.",
  },
  {
    keywords: ["hello", "hi", "hey", "good morning", "good afternoon"],
    reply: "Hi there! 👋 Welcome to TechnoAI. I'm here to answer questions about our AI and automation services. What can I help you with today?",
  },
  {
    keywords: ["who", "about", "company", "technoai", "kvs"],
    reply: "KVS TechnoAI LLC is a Business Automation & AI Solutions company. We help businesses automate workflows, deploy custom AI agents, and make smarter data-driven decisions.",
  },
  {
    keywords: ["result", "roi", "success", "outcome", "impact"],
    reply: "Our clients typically see 85% more leads, 40% cost reduction, and 3.2x ROI improvement. We focus on measurable outcomes, not just technology.",
  },
];

function getBotReply(input: string): string {
  const lower = input.toLowerCase();
  for (const { keywords, reply } of responses) {
    if (keywords.some((kw) => lower.includes(kw))) return reply;
  }
  return "Great question! Our team specializes in AI automation, custom agents, and data systems. Would you like to book a free consultation to discuss your specific needs?";
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: "0", text: "Hi! 👋 Welcome to TechnoAI. Ask me anything about our AI & automation services.", sender: "bot" },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const text = inputValue.trim();
    if (!text) return;

    const userMsg: Message = { id: Date.now().toString(), text, sender: "user" };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    setTimeout(() => {
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotReply(text),
        sender: "bot",
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 700);
  };

  return (
    <>
      {isOpen && (
        <div className="fixed bottom-24 right-5 w-[360px] max-w-[calc(100vw-1.5rem)] z-50 shadow-2xl">
          {/* Window */}
          <div className="flex flex-col rounded-2xl overflow-hidden border border-[rgba(41,98,255,0.2)] shadow-xl"
            style={{ height: "440px", background: "#ffffff" }}>

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 brand-gradient">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">TechnoAI Assistant</p>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00CB53] animate-pulse" />
                    <span className="text-white/70 text-xs">Online</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)}
                className="text-white/70 hover:text-white transition-colors p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-[#f8faff]">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.sender === "bot" && (
                    <div className="w-6 h-6 rounded-full brand-gradient flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                      <Bot className="w-3 h-3 text-white" />
                    </div>
                  )}
                  <div className={`max-w-[75%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-[#2962FF] text-white rounded-br-sm"
                      : "bg-[#112050] text-[#d0dcf8] border border-[rgba(41,98,255,0.2)] rounded-bl-sm"
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="w-6 h-6 rounded-full brand-gradient flex items-center justify-center mr-2 flex-shrink-0">
                    <Bot className="w-3 h-3 text-white" />
                  </div>
                  <div className="bg-[#112050] border border-[rgba(41,98,255,0.2)] px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2962FF] pulse-dot" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2962FF] pulse-dot pulse-dot-2" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2962FF] pulse-dot pulse-dot-3" />
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend}
              className="flex gap-2 px-4 py-3 border-t border-[rgba(41,98,255,0.12)] bg-white">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about our services..."
                disabled={isTyping}
                className="flex-1 px-3 py-2 bg-[#112050] border border-[rgba(41,98,255,0.2)] shadow-xl rounded-xl text-sm text-white placeholder:text-[#7a90c8] focus:outline-none focus:border-[#2962FF] transition-colors"
              />
              <button type="submit" disabled={isTyping || !inputValue.trim()}
                className="w-9 h-9 rounded-xl brand-gradient flex items-center justify-center text-white disabled:opacity-40 transition-opacity flex-shrink-0">
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* FAB */}
      <button onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full brand-gradient text-white shadow-lg glow-blue flex items-center justify-center transition-transform hover:scale-110">
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>
    </>
  );
}
