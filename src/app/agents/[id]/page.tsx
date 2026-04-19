import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getAllAgents, getAgentById, getRelatedAgents } from "@/data/agents";
import {
  Bot, ChevronRight, Clock, Gauge, Wrench, Brain, MessageSquare,
  Code2, Server, Shield, ArrowRight, Play, Download,
  Terminal, Plug, Database, Key,
} from "lucide-react";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import AddToCartButton from "@/components/AddToCartButton";

function getIcon(name: string): LucideIcon {
  return (Icons as unknown as Record<string, LucideIcon>)[name] ?? Bot;
}

export function generateStaticParams() {
  return getAllAgents().map((a) => ({ id: a.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const agent = getAgentById(id);
  if (!agent) return { title: "Agent Not Found" };
  return {
    title: `${agent.name} - AI Agent | AI Skills Hub`,
    description: agent.description,
    openGraph: { title: `${agent.name} | AI Agents`, description: agent.description },
  };
}

export default async function AgentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const agent = getAgentById(id);
  if (!agent) notFound();

  const related = getRelatedAgents(agent.id, 3);
  const Icon = getIcon(agent.avatar);

  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-brand-500/5 blur-3xl dark:bg-brand-500/10" />
      </div>

      <div className="relative mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 sm:py-16">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
          <Link href="/" className="hover:text-brand-600">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href="/agents" className="hover:text-brand-600">Agents</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="font-medium text-gray-900 dark:text-white truncate">{agent.name}</span>
        </nav>

        {/* Hero */}
        <header className="mb-10">
          <div className="mb-4 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-100 text-brand-600 dark:bg-brand-900/40 dark:text-brand-400">
              <Icon className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">{agent.name}</h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 capitalize">{agent.industry} &middot; {agent.category}</p>
            </div>
          </div>
          <p className="max-w-3xl text-lg text-gray-600 dark:text-gray-400 leading-relaxed">{agent.longDescription}</p>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <span className="text-3xl font-extrabold text-gray-900 dark:text-white">${agent.price.toFixed(2)}</span>
            <AddToCartButton
              item={{ id: agent.id, type: "skill" as const, name: agent.name, price: agent.price, industry: agent.industry, category: agent.category, difficulty: agent.difficulty }}
              size="lg"
            />
            <Link
              href={`/agents/${agent.id}/playground`}
              className="inline-flex items-center gap-2 rounded-lg border border-purple-200 bg-purple-50 px-5 py-2.5 text-sm font-semibold text-purple-700 hover:bg-purple-100 dark:border-purple-800 dark:bg-purple-950/30 dark:text-purple-300 dark:hover:bg-purple-950/50"
            >
              <Play className="h-4 w-4" /> Try in Playground
            </Link>
          </div>
        </header>

        {/* Key info */}
        <div className="mb-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <InfoCard icon={<Wrench className="h-5 w-5 text-blue-500" />} label="Tools" value={`${agent.tools.length} tools`} />
          <InfoCard icon={<Gauge className="h-5 w-5 text-orange-500" />} label="Difficulty" value={agent.difficulty} capitalize />
          <InfoCard icon={<Clock className="h-5 w-5 text-green-500" />} label="Setup Time" value={agent.estimatedSetupTime} />
          <InfoCard icon={<Brain className="h-5 w-5 text-purple-500" />} label="Model" value={agent.model.replace("claude-", "")} />
        </div>

        {/* Personality */}
        <Section icon={<MessageSquare className="h-5 w-5" />} title="Agent Personality">
          <p className="text-gray-700 dark:text-gray-300 italic">&ldquo;{agent.personality}&rdquo;</p>
        </Section>

        {/* System Prompt Preview */}
        <Section icon={<Terminal className="h-5 w-5" />} title="System Prompt">
          <div className="relative">
            <pre className="max-h-80 overflow-auto rounded-lg bg-gray-950 p-4 text-sm leading-relaxed text-gray-300">
              <code>{agent.systemPrompt}</code>
            </pre>
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-gray-950 to-transparent rounded-b-lg" />
          </div>
        </Section>

        {/* Tools */}
        <Section icon={<Wrench className="h-5 w-5" />} title={`Tools (${agent.tools.length})`}>
          <div className="space-y-4">
            {agent.tools.map((tool) => (
              <div key={tool.name} className="rounded-lg border border-gray-100 p-4 dark:border-gray-800">
                <div className="flex items-center gap-2 mb-2">
                  <code className="rounded bg-blue-100 px-2 py-0.5 text-sm font-mono font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                    {tool.name}
                  </code>
                </div>
                <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">{tool.description}</p>
                <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">Parameters</div>
                <div className="space-y-1">
                  {tool.parameters.map((p) => (
                    <div key={p.name} className="flex items-center gap-2 text-sm">
                      <code className="text-xs font-mono text-gray-600 dark:text-gray-400">{p.name}</code>
                      <span className="text-xs text-gray-400">({p.type})</span>
                      <span className="text-xs text-gray-500">{p.description}</span>
                      {p.required && <span className="text-[10px] font-bold text-red-500">REQUIRED</span>}
                    </div>
                  ))}
                </div>
                <div className="mt-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Example Output</div>
                <pre className="mt-1 overflow-x-auto rounded bg-gray-100 p-2 text-xs text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                  <code>{tool.exampleOutput}</code>
                </pre>
              </div>
            ))}
          </div>
        </Section>

        {/* Deployment */}
        <Section icon={<Server className="h-5 w-5" />} title="Deployment Configuration">
          <div className="mb-4">
            <h4 className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">Deployment Methods</h4>
            <div className="flex flex-wrap gap-2">
              {agent.deployConfig.methods.map((m) => (
                <span key={m} className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-sm font-medium uppercase text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
                  {m}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">Environment Variables</h4>
            <div className="space-y-2">
              {agent.deployConfig.envVars.map((v) => (
                <div key={v.name} className="flex items-start gap-2 text-sm">
                  <code className="shrink-0 rounded bg-gray-100 px-1.5 py-0.5 text-xs font-mono font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                    {v.name}
                  </code>
                  <span className="text-gray-500 dark:text-gray-400">{v.description}</span>
                  {v.required && <span className="shrink-0 text-[10px] font-bold text-red-500">REQUIRED</span>}
                </div>
              ))}
            </div>
          </div>
          {agent.deployConfig.dockerSupport && (
            <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700 dark:border-green-800 dark:bg-green-950/20 dark:text-green-400">
              <Plug className="mr-1 inline h-4 w-4" /> Docker support available — deploy as a containerized service
            </div>
          )}
        </Section>

        {/* Example Conversation */}
        <Section icon={<MessageSquare className="h-5 w-5" />} title="Example Conversation">
          <div className="space-y-4">
            {agent.examples.map((ex, idx) => (
              <div key={idx} className="space-y-3">
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400">U</div>
                  <div className="rounded-xl rounded-tl-sm bg-gray-100 p-4 text-sm text-gray-700 dark:bg-gray-800 dark:text-gray-300">{ex.userMessage}</div>
                </div>
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-600 dark:bg-brand-900/40 dark:text-brand-400">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="rounded-xl rounded-tl-sm bg-brand-50 p-4 text-sm text-gray-700 dark:bg-brand-950/20 dark:text-gray-300 whitespace-pre-wrap">{ex.agentResponse}</div>
                </div>
                {ex.toolCalls && ex.toolCalls.length > 0 && (
                  <div className="ml-11 space-y-2">
                    {ex.toolCalls.map((tc, tIdx) => (
                      <div key={tIdx} className="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-950/20">
                        <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 dark:text-blue-400">
                          <Wrench className="h-3.5 w-3.5" /> Tool Call: {tc.tool}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Section>

        {/* Use Cases */}
        <Section icon={<Shield className="h-5 w-5" />} title="Use Cases">
          <ul className="space-y-2">
            {agent.useCases.map((uc) => (
              <li key={uc} className="flex items-start gap-3">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-500" />
                <span className="text-gray-700 dark:text-gray-300">{uc}</span>
              </li>
            ))}
          </ul>
        </Section>

        {/* Related Agents */}
        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Related Agents</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {related.map((r) => {
                const RIcon = getIcon(r.avatar);
                return (
                  <Link
                    key={r.id}
                    href={`/agents/${r.id}`}
                    className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md dark:border-gray-700 dark:bg-gray-900"
                  >
                    <RIcon className="mb-2 h-6 w-6 text-brand-500" />
                    <h3 className="font-bold text-gray-900 group-hover:text-brand-600 dark:text-white dark:group-hover:text-brand-400">{r.name}</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{r.description}</p>
                    <p className="mt-2 text-lg font-bold text-gray-900 dark:text-white">${r.price.toFixed(2)}</p>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function InfoCard({ icon, label, value, capitalize }: { icon: React.ReactNode; label: string; value: string; capitalize?: boolean }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <div className="mb-2">{icon}</div>
      <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
      <p className={`mt-0.5 text-sm font-semibold text-gray-900 dark:text-white ${capitalize ? "capitalize" : ""}`}>{value}</p>
    </div>
  );
}

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <div className="mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
        {icon}
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">{children}</div>
    </section>
  );
}
