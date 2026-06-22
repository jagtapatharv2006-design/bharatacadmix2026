"use client";
import { useState, useRef, useEffect } from "react";

interface ChatMessage {
  role: string;
  content: string;
  source?: "gemini" | "offline" | "error";
}

export default function MrPsiChat({
  currentLevel,
}: {
  currentLevel: number;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: `Hello! I am MR.ψ — your quantum guide. Ready to explore Level ${currentLevel}?`,
      source: "gemini",
    },
  ]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg: ChatMessage = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          level: currentLevel,
        }),
      });

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.text, source: data.source || "gemini" },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I lost connection to the quantum network. Try again!",
          source: "error",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-[9999] w-14 h-14 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 border-2"
        style={{
          background: "linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 100%)",
          borderColor: "rgba(0,212,255,0.6)",
          boxShadow: "0 0 25px rgba(0,212,255,0.3), inset 0 0 15px rgba(0,212,255,0.1)",
        }}
        title="Ask MR.ψ"
      >
        <span className="text-2xl" style={{ color: "#00d4ff" }}>ψ</span>
      </button>
    );
  }

  return (
    <div
      className="fixed bottom-0 right-0 sm:bottom-6 sm:right-6 z-[9999] flex flex-col w-full sm:w-80 rounded-none sm:rounded-xl overflow-hidden shadow-2xl"
      style={{
        height: "min(480px, 85dvh)",
        background: "rgba(8,8,24,0.97)",
        border: "1px solid rgba(0,212,255,0.3)",
        boxShadow: "0 0 40px rgba(0,212,255,0.12), 0 20px 60px rgba(0,0,0,0.5)",
        backdropFilter: "blur(20px)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 shrink-0"
        style={{
          background: "linear-gradient(135deg, rgba(0,212,255,0.15) 0%, rgba(176,96,255,0.1) 100%)",
          borderBottom: "1px solid rgba(0,212,255,0.2)",
        }}
      >
        <div className="flex items-center gap-2">
          <span
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
            style={{
              background: "rgba(0,212,255,0.15)",
              border: "1px solid rgba(0,212,255,0.4)",
              color: "#00d4ff",
            }}
          >
            ψ
          </span>
          <div>
            <div className="text-white text-sm font-bold tracking-wide" style={{ fontFamily: "monospace" }}>
              MR.ψ
            </div>
            <div className="text-xs" style={{ color: "rgba(0,212,255,0.6)", fontFamily: "monospace", letterSpacing: "1px" }}>
              LVL {currentLevel} GUIDE
            </div>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="w-7 h-7 rounded-full flex items-center justify-center transition-all hover:scale-110"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "rgba(255,255,255,0.5)",
            fontSize: "14px",
          }}
        >
          ✕
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3" style={{ scrollbarWidth: "thin" }}>
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div>
              <div
                className="max-w-[85%] px-3 py-2 rounded-lg text-sm leading-relaxed"
                style={
                  m.role === "user"
                    ? {
                        background: "rgba(0,212,255,0.15)",
                        border: "1px solid rgba(0,212,255,0.25)",
                        color: "#e0f0ff",
                        borderRadius: "12px 12px 4px 12px",
                      }
                    : {
                        background: "rgba(255,255,255,0.04)",
                        border: `1px solid ${m.source === "offline" ? "rgba(255,235,59,0.15)" : "rgba(255,255,255,0.06)"}`,
                        color: "#c8c8d8",
                        borderRadius: "12px 12px 12px 4px",
                      }
                }
              >
                {m.content}
              </div>
              {m.role === "assistant" && m.source === "offline" && (
                <div className="flex items-center gap-1 mt-1 ml-1">
                  <span
                    className="inline-block w-1.5 h-1.5 rounded-full"
                    style={{ background: "#ffeb3b" }}
                  />
                  <span style={{ fontSize: "9px", color: "rgba(255,235,59,0.5)", fontFamily: "monospace" }}>
                    offline mode
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div
              className="px-3 py-2 rounded-lg text-sm"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.06)",
                color: "rgba(0,212,255,0.6)",
                borderRadius: "12px 12px 12px 4px",
              }}
            >
              <span className="animate-pulse">thinking...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div
        className="flex gap-2 px-3 py-3 shrink-0"
        style={{ borderTop: "1px solid rgba(0,212,255,0.12)" }}
      >
        <input
          className="flex-1 px-3 py-2 rounded-lg text-sm outline-none transition-all"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "#e0e0e0",
          }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={(e) => {
            e.target.style.borderColor = "rgba(0,212,255,0.4)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "rgba(255,255,255,0.08)";
          }}
          placeholder="Ask about quantum..."
          disabled={loading}
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className="px-3 rounded-lg font-bold text-sm transition-all hover:scale-105 disabled:opacity-30 disabled:hover:scale-100"
          style={{
            background: "rgba(0,212,255,0.2)",
            border: "1px solid rgba(0,212,255,0.4)",
            color: "#00d4ff",
          }}
        >
          ↑
        </button>
      </div>
    </div>
  );
}
