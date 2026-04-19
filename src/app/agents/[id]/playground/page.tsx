"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Bot, Send, ArrowLeft, Wrench, Sparkles, User, RotateCcw, ShoppingCart } from "lucide-react";
import { getAgentById } from "@/data/agents";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Agent, AgentExample } from "@/lib/agent-types";

function getIcon(name: string): LucideIcon {
  return (Icons as unknown as Record<string, LucideIcon>)[name] ?? Bot;
}

interface Message {
  role: "user" | "agent" | "system";
  content: string;
  toolCalls?: { tool: string; input: string; output: string }[];
}

function simulateAgentResponse(agent: Agent, userMessage: string, history: Message[]): { content: string; toolCalls?: Message["toolCalls"] } {
  const lower = userMessage.toLowerCase();

  // Check if the message matches any example
  for (const ex of agent.examples) {
    const exWords = ex.userMessage.toLowerCase().split(/\s+/).filter((w) => w.length > 3);
    const matchCount = exWords.filter((w) => lower.includes(w)).length;
    if (matchCount >= Math.ceil(exWords.length * 0.3)) {
      return { content: ex.agentResponse, toolCalls: ex.toolCalls };
    }
  }

  // Generate a contextual response based on agent personality
  const responses = [
    `Based on my analysis of your request, here's what I recommend:\n\nAs a ${agent.category} specialist in the ${agent.industry} industry, I can help with this. Let me break it down:\n\n1. **Understanding your situation**: ${userMessage.slice(0, 50)}...\n2. **My assessment**: This falls within my core capabilities\n3. **Recommended approach**: I'd start by using my ${agent.tools[0]?.name ?? "analysis"} capabilities to gather more context\n\nWould you like me to proceed with a detailed analysis? I can also use my ${agent.tools.length} specialized tools to provide more specific insights.`,
    `Great question! Let me apply my expertise here.\n\n${agent.personality.split(".")[0]}. Given that, here's my take:\n\n**Initial Analysis:**\nYour request touches on ${agent.useCases[0]?.toLowerCase() ?? "a core use case"} — this is exactly what I'm built for.\n\n**Next Steps:**\n- I'll need a bit more detail to give you a precise answer\n- Specifically: What's the context? What outcome are you hoping for?\n- I have ${agent.tools.length} tools at my disposal including \`${agent.tools.map((t) => t.name).join("`, `")}\`\n\nLet me know and I'll dive deeper.`,
    `I understand what you're looking for. As an AI agent specialized in ${agent.category}, here's how I'd approach this:\n\n**Step 1**: Gather relevant data using my \`${agent.tools[0]?.name ?? "primary"}\` tool\n**Step 2**: Analyze the situation against my trained knowledge base\n**Step 3**: Provide you with actionable recommendations\n\nI'm configured with a temperature of ${agent.temperature} for ${agent.temperature < 0.3 ? "maximum precision" : "a good balance of creativity and accuracy"}, using ${agent.model}.\n\nCan you provide more specifics so I can give you a thorough response?`,
  ];

  const idx = (userMessage.length + history.length) % responses.length;
  return { content: responses[idx] };
}

export default function PlaygroundPage() {
  const { id } = useParams<{ id: string }>();
  const agent = getAgentById(id);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!agent) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Agent not found</p>
      </div>
    );
  }

  const Icon = getIcon(agent.avatar);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg: Message = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate typing delay
    await new Promise((r) => setTimeout(r, 800 + Math.random() * 1200));

    const response = simulateAgentResponse(agent, userMsg.content, messages);
    const agentMsg: Message = { role: "agent", content: response.content, toolCalls: response.toolCalls };
    setMessages((prev) => [...prev, agentMsg]);
    setIsTyping(false);
  };

  const handleReset = () => {
    setMessages([]);
    setInput("");
  };

  const trySuggestion = (text: string) => {
    setInput(text);
  };

  return (
    <div className="flex h-[calc(100vh-64px)] flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-900">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href={`/agents/${agent.id}`} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-100 text-brand-600 dark:bg-brand-900/40 dark:text-brand-400">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-gray-900 dark:text-white">{agent.name}</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Playground &middot; {agent.model}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleReset} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300" title="Reset conversation">
              <RotateCcw className="h-4 w-4" />
            </button>
            <Link
              href={`/agents/${agent.id}`}
              className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-700"
            >
              <ShoppingCart className="h-3.5 w-3.5" /> ${agent.price.toFixed(2)}
            </Link>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950">
        <div className="mx-auto max-w-3xl px-4 py-6">
          {messages.length === 0 && (
            <div className="py-12 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-100 dark:bg-brand-900/40">
                <Icon className="h-8 w-8 text-brand-600 dark:text-brand-400" />
              </div>
              <h2 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">
                Try {agent.name}
              </h2>
              <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                {agent.personality.split(".")[0]}. Ask me anything related to {agent.category.toLowerCase()}.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {agent.examples.slice(0, 3).map((ex, idx) => (
                  <button
                    key={idx}
                    onClick={() => trySuggestion(ex.userMessage)}
                    className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 hover:border-brand-300 hover:bg-brand-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:hover:border-brand-700 text-left max-w-xs truncate"
                  >
                    &ldquo;{ex.userMessage.slice(0, 60)}...&rdquo;
                  </button>
                ))}
              </div>

              <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700 dark:border-amber-800 dark:bg-amber-950/20 dark:text-amber-400 max-w-md mx-auto">
                <Sparkles className="mr-1 inline h-4 w-4" />
                <strong>Playground Mode:</strong> Responses are simulated to demonstrate agent behavior. Purchase the agent to deploy with real AI.
              </div>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div key={idx} className={`mb-4 flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
              {msg.role === "agent" && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-600 dark:bg-brand-900/40 dark:text-brand-400">
                  <Icon className="h-4 w-4" />
                </div>
              )}
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "rounded-tr-sm bg-brand-600 text-white"
                  : "rounded-tl-sm bg-white text-gray-700 shadow-sm border border-gray-200 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700"
              }`}>
                <div className="whitespace-pre-wrap">{msg.content}</div>
              </div>
              {msg.role === "user" && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          ))}

          {/* Tool calls */}
          {messages.length > 0 && messages[messages.length - 1].toolCalls && (
            <div className="mb-4 ml-11 space-y-2">
              {messages[messages.length - 1].toolCalls!.map((tc, idx) => (
                <div key={idx} className="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-950/20">
                  <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 dark:text-blue-400">
                    <Wrench className="h-3.5 w-3.5" /> {tc.tool}
                  </div>
                </div>
              ))}
            </div>
          )}

          {isTyping && (
            <div className="mb-4 flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-600 dark:bg-brand-900/40 dark:text-brand-400">
                <Icon className="h-4 w-4" />
              </div>
              <div className="rounded-2xl rounded-tl-sm border border-gray-200 bg-white px-4 py-3 shadow-sm dark:border-gray-700 dark:bg-gray-900">
                <div className="flex gap-1">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: "0ms" }} />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: "150ms" }} />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-900">
        <form
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="mx-auto flex max-w-3xl items-center gap-3"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask ${agent.name} anything...`}
            className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600 text-white transition-colors hover:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
