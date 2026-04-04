import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import {
  ChevronRight,
  Clock,
  TrendingUp,
  BarChart3,
  Briefcase,
  ArrowRight,
  Lightbulb,
  Tag,
  Cpu,
  Plug,
  ArrowRightLeft,
  BookOpen,
  ListChecks,
  Shield,
  MessageSquareCode,
  DollarSign,
  Code2,
  Download,
} from "lucide-react";
import {
  getAllSkills,
  getSkillById,
  getRelatedSkills,
  getAllIndustries,
} from "@/lib/data-service";
import { generateSkillDetailContent } from "@/lib/detail-content";
import { getSkillPrice, getSkillOriginalPrice, PAID_MODE } from "@/lib/pricing";
import type { Skill } from "@/lib/types";
import Badge from "@/components/Badge";
import SkillCard from "@/components/SkillCard";
import EmbedCodeBlock from "@/components/EmbedCodeBlock";
// DownloadSkillButton removed — downloads available after purchase only
import AddToCartButton from "@/components/AddToCartButton";

// ---------------------------------------------------------------------------
// Static generation
// ---------------------------------------------------------------------------

export function generateStaticParams() {
  return getAllSkills().map((skill) => ({ id: skill.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const skill = getSkillById(id);
  if (!skill) {
    return { title: "Skill Not Found | AI Skills Hub" };
  }
  return {
    title: `${skill.name} | AI Skills Hub`,
    description: skill.description,
    openGraph: {
      title: `${skill.name} - AI Skills Hub`,
      description: skill.description,
    },
  };
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function SkillDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const skill = getSkillById(id);
  if (!skill) notFound();

  const related = getRelatedSkills(skill.id, 6);
  const industries = getAllIndustries();
  const industry = industries.find((i) => i.id === skill.industry);
  const detail = generateSkillDetailContent(skill);
  const price = getSkillPrice(skill);
  const originalPrice = getSkillOriginalPrice(skill);

  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-brand-500/5 blur-3xl dark:bg-brand-500/10" />
      </div>

      <div className="relative mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 sm:py-16">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
          <Link
            href="/"
            className="transition-colors hover:text-brand-600 dark:hover:text-brand-400"
          >
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link
            href="/skills"
            className="transition-colors hover:text-brand-600 dark:hover:text-brand-400"
          >
            Skills
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="font-medium text-gray-900 dark:text-white truncate max-w-[200px] sm:max-w-none">
            {skill.name}
          </span>
        </nav>

        {/* Hero */}
        <header className="mb-10">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Badge label={skill.difficulty} variant="difficulty" size="md" />
            {industry && (
              <span className="inline-flex items-center rounded-lg bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                {industry.name}
              </span>
            )}
            <span className="inline-flex items-center rounded-lg bg-brand-50 px-3 py-1 text-sm font-medium text-brand-700 dark:bg-brand-950/40 dark:text-brand-300">
              {skill.category}
            </span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">
            {skill.name}
          </h1>

          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-gray-600 dark:text-gray-400">
            {skill.description}
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
                id: skill.id,
                type: "skill",
                name: skill.name,
                price,
                industry: skill.industry,
                category: skill.category,
                difficulty: skill.difficulty,
              }}
              size="lg"
            />
          </div>
        </header>

        {/* Key info grid */}
        <div className="mb-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <InfoCard
            icon={<Clock className="h-5 w-5 text-brand-500" />}
            label="Estimated Time"
            value={skill.estimatedTime}
          />
          <InfoCard
            icon={<TrendingUp className="h-5 w-5 text-green-500" />}
            label="Popularity"
            value={`${skill.popularity}/100`}
          />
          <InfoCard
            icon={<BarChart3 className="h-5 w-5 text-orange-500" />}
            label="Difficulty"
            value={skill.difficulty}
            capitalize
          />
          <InfoCard
            icon={<Briefcase className="h-5 w-5 text-purple-500" />}
            label="Industry"
            value={industry?.name ?? skill.industry}
          />
        </div>

        {/* Prerequisites */}
        <DetailSection
          icon={<BookOpen className="h-5 w-5" />}
          title="Prerequisites"
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

        {/* Implementation Steps */}
        <DetailSection
          icon={<ListChecks className="h-5 w-5" />}
          title="Implementation Guide"
        >
          <ol className="space-y-4">
            {detail.implementationSteps.map((step, idx) => (
              <li key={idx} className="flex gap-4">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
                  {idx + 1}
                </span>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {step.title}
                  </h4>
                  <p className="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </DetailSection>

        {/* AI Models */}
        <DetailSection icon={<Cpu className="h-5 w-5" />} title="AI Models & Recommendations">
          <div className="space-y-3">
            {detail.modelRecommendations.map((rec) => (
              <div
                key={rec.model}
                className="flex flex-col gap-1 rounded-lg border border-gray-100 bg-gray-50/50 p-3 dark:border-gray-800 dark:bg-gray-800/30"
              >
                <div className="flex items-center gap-2">
                  <Badge label={rec.model} variant="model" size="md" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {rec.fullName}
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {rec.note}
                </p>
              </div>
            ))}
          </div>
        </DetailSection>

        {/* Integration Types */}
        <DetailSection
          icon={<Plug className="h-5 w-5" />}
          title="Integration Methods"
        >
          <div className="space-y-3">
            {detail.integrationDetails.map((integ) => (
              <div
                key={integ.type}
                className="flex flex-col gap-1 rounded-lg border border-gray-100 bg-gray-50/50 p-3 dark:border-gray-800 dark:bg-gray-800/30"
              >
                <Badge label={integ.type} variant="integration" size="md" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {integ.description}
                </p>
              </div>
            ))}
          </div>
        </DetailSection>

        {/* Input/Output Types */}
        <DetailSection
          icon={<ArrowRightLeft className="h-5 w-5" />}
          title="Input & Output Types"
        >
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Input
              </p>
              <div className="flex flex-wrap gap-2">
                {skill.inputType.map((type) => (
                  <span
                    key={type}
                    className="inline-flex items-center rounded-lg border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-medium capitalize text-blue-700 dark:border-blue-800/40 dark:bg-blue-950/30 dark:text-blue-300"
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>

            <ArrowRight className="hidden h-5 w-5 shrink-0 text-gray-400 sm:block" />

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Output
              </p>
              <div className="flex flex-wrap gap-2">
                {skill.outputType.map((type) => (
                  <span
                    key={type}
                    className="inline-flex items-center rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-medium capitalize text-emerald-700 dark:border-emerald-800/40 dark:bg-emerald-950/30 dark:text-emerald-300"
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </DetailSection>

        {/* Example Prompt */}
        <DetailSection
          icon={<MessageSquareCode className="h-5 w-5" />}
          title="Example Prompt"
        >
          <pre className="whitespace-pre-wrap rounded-lg bg-gray-900 p-4 text-sm leading-relaxed text-gray-100 dark:bg-gray-950">
            <code>{detail.examplePrompt}</code>
          </pre>
        </DetailSection>

        {/* Cost Estimate */}
        <DetailSection
          icon={<DollarSign className="h-5 w-5" />}
          title="Estimated Cost"
        >
          <p className="text-gray-700 dark:text-gray-300">
            {detail.estimatedCosts}
          </p>
        </DetailSection>

        {/* Best Practices */}
        <DetailSection
          icon={<Shield className="h-5 w-5" />}
          title="Best Practices"
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

        {/* Use Cases */}
        <DetailSection
          icon={<Lightbulb className="h-5 w-5" />}
          title="Use Cases"
        >
          <ul className="space-y-3">
            {skill.useCases.map((useCase, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-500" />
                <span className="text-gray-700 dark:text-gray-300">
                  {useCase}
                </span>
              </li>
            ))}
          </ul>
        </DetailSection>

        {/* Tags */}
        <DetailSection icon={<Tag className="h-5 w-5" />} title="Tags">
          <div className="flex flex-wrap gap-2">
            {skill.tags.map((tag) => (
              <Link
                key={tag}
                href={`/skills?q=${encodeURIComponent(tag)}`}
                className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-sm text-gray-600 transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:border-brand-700 dark:hover:bg-brand-950/30 dark:hover:text-brand-300"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </DetailSection>

        {/* Embed Code */}
        <DetailSection
          icon={<Code2 className="h-5 w-5" />}
          title="Embed This Skill"
        >
          <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
            Copy the code below to embed this skill card on your website.
          </p>
          <EmbedCodeBlock
            type="skill"
            id={skill.id}
            name={skill.name}
            description={skill.description}
            difficulty={skill.difficulty}
            industry={industry?.name ?? skill.industry}
            category={skill.category}
            estimatedTime={skill.estimatedTime}
          />
        </DetailSection>

        {/* Related Skills */}
        {related.length > 0 && (
          <section className="mt-16">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Related Skills
              </h2>
              <Link
                href={`/skills?industry=${skill.industry}`}
                className="text-sm font-medium text-brand-600 transition-colors hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
              >
                View all in {industry?.name ?? skill.industry}
                <ChevronRight className="ml-0.5 inline h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((s) => (
                <SkillCard key={s.id} skill={s} />
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

function InfoCard({
  icon,
  label,
  value,
  capitalize,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  capitalize?: boolean;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <div className="mb-2">{icon}</div>
      <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
      <p
        className={`mt-0.5 text-sm font-semibold text-gray-900 dark:text-white ${
          capitalize ? "capitalize" : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function DetailSection({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-10">
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
