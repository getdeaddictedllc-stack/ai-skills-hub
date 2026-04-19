import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  getAllWorkflows,
  getWorkflowById,
  getRelatedWorkflows,
  getAllIndustries,
} from "@/lib/data-service";
import { generateWorkflowDetailContent } from "@/lib/detail-content";
import { getWorkflowPrice, getWorkflowOriginalPrice, PAID_MODE } from "@/lib/pricing";
import Badge from "@/components/Badge";
import WorkflowCard from "@/components/WorkflowCard";
import EmbedCodeBlock from "@/components/EmbedCodeBlock";
import AddToCartButton from "@/components/AddToCartButton";
import { WorkflowJsonLd } from "@/components/JsonLd";
import { StepFlow } from "./StepFlow";
import {
  Clock,
  GitBranch,
  Layers,
  Factory,
  Home,
  ChevronRight,
  Tag,
  ArrowLeft,
  BookOpen,
  ListChecks,
  Shield,
  DollarSign,
  Target,
  Code2,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Static params & metadata
// ---------------------------------------------------------------------------

export function generateStaticParams() {
  return getAllWorkflows().map((w) => ({ id: w.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const workflow = getWorkflowById(id);
  if (!workflow) {
    return { title: "Workflow Not Found | AI Skills Hub" };
  }
  return {
    title: `${workflow.name} | AI Workflows | AI Skills Hub`,
    description: workflow.description,
    keywords: [
      ...workflow.tags,
      workflow.industry,
      workflow.category,
      "AI workflow",
    ],
  };
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function WorkflowDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const workflow = getWorkflowById(id);
  if (!workflow) notFound();

  const related = getRelatedWorkflows(workflow.id, 3);
  const industries = getAllIndustries();
  const industry = industries.find((i) => i.id === workflow.industry);
  const detail = generateWorkflowDetailContent(workflow);
  const price = getWorkflowPrice(workflow);
  const originalPrice = getWorkflowOriginalPrice(workflow);

  const infoItems = [
    {
      icon: Clock,
      label: "Estimated Time",
      value: workflow.estimatedTime,
    },
    {
      icon: GitBranch,
      label: "Steps",
      value: `${workflow.steps.length} steps`,
    },
    {
      icon: Layers,
      label: "Complexity",
      value: workflow.complexity,
      capitalize: true,
    },
    {
      icon: Factory,
      label: "Industry",
      value: industry?.name ?? workflow.industry,
      capitalize: true,
    },
  ];

  return (
    <div className="relative min-h-screen">
      <WorkflowJsonLd workflow={workflow} industryName={industry?.name ?? workflow.industry} />
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[600px] w-[900px] rounded-full bg-brand-500/5 blur-3xl dark:bg-brand-500/10" />
      </div>

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pb-24 pt-8">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
          <Link
            href="/"
            className="inline-flex items-center gap-1 transition-colors hover:text-brand-600 dark:hover:text-brand-400"
          >
            <Home className="h-3.5 w-3.5" />
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link
            href="/workflows"
            className="transition-colors hover:text-brand-600 dark:hover:text-brand-400"
          >
            Workflows
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="font-medium text-gray-900 dark:text-white">
            {workflow.name}
          </span>
        </nav>

        {/* Back link */}
        <Link
          href="/workflows"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 transition-colors hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
        >
          <ArrowLeft className="h-4 w-4" />
          All Workflows
        </Link>

        {/* Hero */}
        <section className="mb-10 animate-in">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <Badge label={workflow.complexity} variant="complexity" size="md" />
            <span className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium capitalize text-gray-600 dark:bg-gray-800 dark:text-gray-400">
              {industry?.name ?? workflow.industry}
            </span>
            <span className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
              {workflow.category}
            </span>
          </div>

          <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
            {workflow.name}
          </h1>

          <p className="max-w-3xl text-lg leading-relaxed text-gray-600 dark:text-gray-400">
            {workflow.description}
          </p>

          {/* Price & Actions */}
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <div className="flex items-baseline gap-2">
              {!PAID_MODE ? (
                <>
                  <span className="text-3xl font-extrabold text-green-600 dark:text-green-400">Free</span>
                  <span className="text-lg text-gray-400 line-through">${originalPrice.toFixed(2)}</span>
                </>
              ) : (
                <>
                  <span className="text-3xl font-extrabold text-gray-900 dark:text-white">${price.toFixed(2)}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">one-time purchase</span>
                </>
              )}
            </div>
            <AddToCartButton
              item={{
                id: workflow.id,
                type: "workflow",
                name: workflow.name,
                price,
                industry: workflow.industry,
                category: workflow.category,
                complexity: workflow.complexity,
              }}
              size="lg"
            />
          </div>
        </section>

        {/* Key info grid */}
        <section
          className="mb-12 grid grid-cols-2 gap-4 sm:grid-cols-4 animate-in"
          style={{ animationDelay: "0.1s" }}
        >
          {infoItems.map((item) => (
            <div
              key={item.label}
              className="glass-card rounded-xl p-4 text-center"
            >
              <item.icon className="mx-auto mb-2 h-5 w-5 text-brand-500 dark:text-brand-400" />
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                {item.label}
              </p>
              <p
                className={`mt-1 text-lg font-bold text-gray-900 dark:text-white ${
                  item.capitalize ? "capitalize" : ""
                }`}
              >
                {item.value}
              </p>
            </div>
          ))}
        </section>

        {/* Prerequisites */}
        <DetailSection
          icon={<BookOpen className="h-5 w-5" />}
          title="Prerequisites"
          delay="0.15s"
        >
          <ul className="space-y-2">
            {detail.prerequisites.map((prereq, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-amber-500" />
                <span className="text-gray-700 dark:text-gray-300">
                  {prereq}
                </span>
              </li>
            ))}
          </ul>
        </DetailSection>

        {/* Visual Step Flow */}
        <section
          className="mb-14 animate-in"
          style={{ animationDelay: "0.2s" }}
        >
          <h2 className="mb-8 text-2xl font-bold text-gray-900 dark:text-white">
            Workflow Steps
          </h2>
          <StepFlow steps={workflow.steps} />
        </section>

        {/* Implementation Guide */}
        <DetailSection
          icon={<ListChecks className="h-5 w-5" />}
          title="Implementation Guide"
          delay="0.25s"
        >
          <p className="text-gray-700 leading-relaxed dark:text-gray-300">
            {detail.implementationGuide}
          </p>
        </DetailSection>

        {/* Cost Estimate */}
        <DetailSection
          icon={<DollarSign className="h-5 w-5" />}
          title="Estimated Cost"
          delay="0.28s"
        >
          <p className="text-gray-700 dark:text-gray-300">
            {detail.estimatedCosts}
          </p>
        </DetailSection>

        {/* Best Practices */}
        <DetailSection
          icon={<Shield className="h-5 w-5" />}
          title="Best Practices"
          delay="0.3s"
        >
          <ul className="space-y-2">
            {detail.bestPractices.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-green-500" />
                <span className="text-gray-700 dark:text-gray-300">{tip}</span>
              </li>
            ))}
          </ul>
        </DetailSection>

        {/* Success Criteria */}
        <DetailSection
          icon={<Target className="h-5 w-5" />}
          title="Success Criteria"
          delay="0.33s"
        >
          <ul className="space-y-2">
            {detail.successCriteria.map((criteria, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-500" />
                <span className="text-gray-700 dark:text-gray-300">
                  {criteria}
                </span>
              </li>
            ))}
          </ul>
        </DetailSection>

        {/* Tags */}
        {workflow.tags.length > 0 && (
          <section
            className="mb-14 animate-in"
            style={{ animationDelay: "0.35s" }}
          >
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
              <Tag className="h-5 w-5 text-brand-500" />
              Tags
            </h2>
            <div className="flex flex-wrap gap-2">
              {workflow.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Embed Code */}
        <DetailSection
          icon={<Code2 className="h-5 w-5" />}
          title="Embed This Workflow"
          delay="0.38s"
        >
          <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
            Copy the code below to embed this workflow card on your website.
          </p>
          <EmbedCodeBlock
            type="workflow"
            id={workflow.id}
            name={workflow.name}
            description={workflow.description}
            complexity={workflow.complexity}
            industry={industry?.name ?? workflow.industry}
            category={workflow.category}
            estimatedTime={workflow.estimatedTime}
            steps={workflow.steps.length}
          />
        </DetailSection>

        {/* Related Workflows */}
        {related.length > 0 && (
          <section className="animate-in" style={{ animationDelay: "0.4s" }}>
            <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
              Related Workflows
            </h2>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {related.map((w) => (
                <WorkflowCard key={w.id} workflow={w} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function DetailSection({
  icon,
  title,
  children,
  delay,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  delay?: string;
}) {
  return (
    <section
      className="mb-10 animate-in"
      style={delay ? { animationDelay: delay } : undefined}
    >
      <div className="mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
        {icon}
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        {children}
      </div>
    </section>
  );
}
