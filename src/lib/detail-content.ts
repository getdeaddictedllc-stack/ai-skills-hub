import type { Skill, Workflow } from "@/lib/types";

// ---------------------------------------------------------------------------
// Dynamically generate rich detail content from existing skill/workflow data
// ---------------------------------------------------------------------------

const MODEL_NAMES: Record<string, string> = {
  claude: "Anthropic Claude",
  "gpt-4": "OpenAI GPT-4",
  "gpt-4o": "OpenAI GPT-4o",
  gemini: "Google Gemini",
  llama: "Meta LLaMA",
  mistral: "Mistral AI",
  cohere: "Cohere",
  palm: "Google PaLM",
  dalle: "DALL·E",
  "stable-diffusion": "Stable Diffusion",
  whisper: "OpenAI Whisper",
  midjourney: "Midjourney",
};

const INTEGRATION_DESCRIPTIONS: Record<string, string> = {
  api: "RESTful API — send HTTP requests to integrate this skill into any application or service.",
  webhook: "Webhook — receive real-time event-driven notifications and trigger automated actions.",
  sdk: "SDK — use official client libraries for seamless integration in your preferred language.",
  plugin: "Plugin — install as a plug-and-play extension in supported platforms.",
  standalone: "Standalone — run independently without external dependencies.",
  mcp: "Model Context Protocol (MCP) — connect AI models to external data sources and tools using the open standard.",
  "function-calling": "Function Calling — let the AI model invoke structured functions and tools during conversations.",
};

const DIFFICULTY_PREREQS: Record<string, string[]> = {
  beginner: [
    "Basic understanding of AI and machine learning concepts",
    "Familiarity with REST APIs or web services",
    "A computer with internet access",
  ],
  intermediate: [
    "Working knowledge of AI/ML fundamentals",
    "Experience with at least one programming language (Python, JavaScript, etc.)",
    "Familiarity with API integration patterns",
    "Basic understanding of data formats (JSON, CSV)",
  ],
  advanced: [
    "Strong programming skills in Python or similar languages",
    "Experience with AI model APIs and prompt engineering",
    "Understanding of data pipelines and ETL processes",
    "Knowledge of the specific domain/industry context",
    "Familiarity with cloud services (AWS, GCP, or Azure)",
  ],
  expert: [
    "Deep expertise in machine learning and AI systems",
    "Advanced programming and system architecture skills",
    "Experience deploying production AI systems at scale",
    "Strong domain expertise in the relevant industry",
    "Knowledge of MLOps, model monitoring, and governance",
    "Understanding of security, compliance, and data privacy requirements",
  ],
};

const DIFFICULTY_TIPS: Record<string, string[]> = {
  beginner: [
    "Start with the simplest integration type available and expand as you get comfortable.",
    "Use the playground or sandbox environment to test before deploying to production.",
    "Follow the official documentation step by step for best results.",
  ],
  intermediate: [
    "Implement proper error handling and retry logic for API calls.",
    "Cache frequent responses to reduce latency and API costs.",
    "Monitor usage metrics to optimize performance over time.",
    "Test with diverse input data to ensure robust behavior.",
  ],
  advanced: [
    "Design for scalability — consider rate limits, batching, and async processing.",
    "Implement comprehensive logging and monitoring from the start.",
    "Use prompt engineering techniques to improve output quality and consistency.",
    "Set up automated testing pipelines to catch regressions early.",
    "Consider fallback strategies when the primary AI model is unavailable.",
  ],
  expert: [
    "Architect for high availability with failover across multiple AI providers.",
    "Implement fine-grained access controls and audit logging.",
    "Establish model evaluation benchmarks and continuous quality monitoring.",
    "Design feedback loops to continuously improve system accuracy.",
    "Plan for regulatory compliance and data governance from day one.",
    "Consider building custom fine-tuned models for domain-specific accuracy.",
  ],
};

export interface SkillDetailContent {
  prerequisites: string[];
  implementationSteps: { title: string; description: string }[];
  bestPractices: string[];
  integrationDetails: { type: string; description: string }[];
  modelRecommendations: { model: string; fullName: string; note: string }[];
  examplePrompt: string;
  estimatedCosts: string;
}

export function generateSkillDetailContent(skill: Skill): SkillDetailContent {
  const prerequisites = DIFFICULTY_PREREQS[skill.difficulty] ?? DIFFICULTY_PREREQS.beginner;

  const implementationSteps = generateImplementationSteps(skill);
  const bestPractices = DIFFICULTY_TIPS[skill.difficulty] ?? DIFFICULTY_TIPS.beginner;

  const integrationDetails = skill.integrationTypes.map((type) => ({
    type,
    description: INTEGRATION_DESCRIPTIONS[type] ?? `${type} integration available.`,
  }));

  const modelRecommendations = skill.aiModels.map((model) => ({
    model,
    fullName: MODEL_NAMES[model] ?? model,
    note: getModelNote(model, skill),
  }));

  const examplePrompt = generateExamplePrompt(skill);
  const estimatedCosts = generateCostEstimate(skill);

  return {
    prerequisites,
    implementationSteps,
    bestPractices,
    integrationDetails,
    modelRecommendations,
    examplePrompt,
    estimatedCosts,
  };
}

function generateImplementationSteps(skill: Skill): { title: string; description: string }[] {
  const steps: { title: string; description: string }[] = [];

  steps.push({
    title: "Set Up Your Environment",
    description: `Choose your preferred integration method (${skill.integrationTypes.join(", ")}) and set up API credentials for your selected AI model.`,
  });

  steps.push({
    title: "Prepare Input Data",
    description: `This skill accepts ${skill.inputType.join(", ")} as input. Ensure your data is properly formatted and validated before processing.`,
  });

  steps.push({
    title: "Configure the AI Model",
    description: `Select from supported models: ${skill.aiModels.map((m) => MODEL_NAMES[m] ?? m).join(", ")}. Configure parameters like temperature, max tokens, and system prompts for optimal results.`,
  });

  steps.push({
    title: "Implement the Core Logic",
    description: `Build the processing pipeline to send ${skill.inputType.join("/")} data to the AI model and handle the ${skill.outputType.join("/")} response.`,
  });

  steps.push({
    title: "Handle Output & Post-Processing",
    description: `Process the ${skill.outputType.join(", ")} output. Apply validation, formatting, and any domain-specific post-processing rules.`,
  });

  steps.push({
    title: "Test & Validate",
    description: `Test with representative data covering edge cases. Validate outputs against expected results for your ${skill.category.toLowerCase()} use cases.`,
  });

  steps.push({
    title: "Deploy & Monitor",
    description: `Deploy to production with proper monitoring, logging, and alerting. Track accuracy, latency, and usage metrics over time.`,
  });

  return steps;
}

function getModelNote(model: string, skill: Skill): string {
  const notes: Record<string, string> = {
    claude: "Excellent for complex reasoning, long-context analysis, and safety-critical applications.",
    "gpt-4": "Strong general-purpose capabilities with broad knowledge and reasoning.",
    "gpt-4o": "Multimodal capabilities — handles text, images, and audio natively.",
    gemini: "Strong multimodal processing with deep Google ecosystem integration.",
    llama: "Open-source model — ideal for on-premise deployment and customization.",
    mistral: "Efficient performance with competitive quality at lower computational cost.",
    cohere: "Specialized in text generation, classification, and enterprise search.",
    palm: "Optimized for Google Cloud integration and enterprise applications.",
    dalle: "Specialized in image generation and creative visual content.",
    "stable-diffusion": "Open-source image generation — highly customizable with fine-tuning.",
    whisper: "Industry-leading speech recognition and audio transcription.",
    midjourney: "Premium image generation with artistic and photorealistic capabilities.",
  };
  return notes[model] ?? "Capable AI model suitable for this skill.";
}

function generateExamplePrompt(skill: Skill): string {
  return `You are an AI assistant specialized in ${skill.category} for the ${skill.industry} industry. ${skill.description}\n\nAnalyze the following ${skill.inputType[0] ?? "input"} and provide a detailed ${skill.outputType[0] ?? "response"}.\n\nConsider these use cases:\n${skill.useCases.map((uc) => `- ${uc}`).join("\n")}\n\nProvide your response in a structured format with clear sections and actionable insights.`;
}

function generateCostEstimate(skill: Skill): string {
  const hasImages = skill.inputType.includes("image") || skill.outputType.includes("image");
  const hasAudio = skill.inputType.includes("audio") || skill.outputType.includes("audio");
  const hasVideo = skill.inputType.includes("video") || skill.outputType.includes("video");

  if (hasVideo) return "Higher cost — video processing requires significant compute. Expect $0.05–$0.50+ per request depending on duration and model.";
  if (hasImages) return "Moderate cost — image analysis/generation typically costs $0.01–$0.10 per request depending on resolution and model.";
  if (hasAudio) return "Moderate cost — audio processing typically costs $0.006–$0.06 per minute depending on the model.";
  return "Low to moderate cost — text-based processing typically costs $0.001–$0.03 per request depending on input length and model.";
}

// ---------------------------------------------------------------------------
// Workflow detail content
// ---------------------------------------------------------------------------

export interface WorkflowDetailContent {
  prerequisites: string[];
  implementationGuide: string;
  bestPractices: string[];
  estimatedCosts: string;
  successCriteria: string[];
}

export function generateWorkflowDetailContent(workflow: Workflow): WorkflowDetailContent {
  const complexity = workflow.complexity;

  const prereqMap: Record<string, string[]> = {
    simple: [
      "Basic understanding of AI automation concepts",
      "API access to at least one supported AI model",
      "Familiarity with the tools used in each workflow step",
    ],
    moderate: [
      "Experience with multi-step automation and data pipelines",
      "API access and credentials for required AI models",
      "Understanding of data flow between connected systems",
      "Basic error handling and monitoring knowledge",
    ],
    complex: [
      "Strong experience with AI system integration and orchestration",
      "Proficiency in at least one programming language",
      "Understanding of async processing and queue management",
      "Knowledge of the relevant industry domain and compliance requirements",
      "API access to all required AI models and services",
    ],
    enterprise: [
      "Expert-level experience in AI system architecture",
      "Deep understanding of enterprise security and compliance",
      "Experience with distributed systems and microservices",
      "Knowledge of MLOps, CI/CD, and automated testing",
      "Strong domain expertise in the target industry",
      "Access to enterprise-grade AI model APIs and infrastructure",
    ],
  };

  const implementationGuide = `This ${workflow.complexity} workflow consists of ${workflow.steps.length} sequential steps. Each step builds on the output of the previous one, creating a complete ${workflow.category.toLowerCase()} pipeline for the ${workflow.industry} industry. Start by implementing each step individually, then connect them through a data pipeline. Use structured data formats (JSON) to pass information between steps for reliability.`;

  const practiceMap: Record<string, string[]> = {
    simple: [
      "Test each step independently before connecting the full pipeline.",
      "Use structured data formats between steps for reliability.",
      "Implement basic error handling at each step.",
    ],
    moderate: [
      "Implement retry logic with exponential backoff between steps.",
      "Add checkpoint saving so the workflow can resume from failures.",
      "Monitor step-level latency and success rates.",
      "Validate outputs at each step before passing to the next.",
    ],
    complex: [
      "Design for fault tolerance — each step should handle upstream failures gracefully.",
      "Implement comprehensive logging across the entire pipeline.",
      "Use message queues for reliable step-to-step communication.",
      "Set up alerting for pipeline failures and performance degradation.",
      "Plan for horizontal scaling of compute-intensive steps.",
    ],
    enterprise: [
      "Implement circuit breakers between steps to prevent cascade failures.",
      "Use distributed tracing for end-to-end pipeline observability.",
      "Design for multi-region deployment and disaster recovery.",
      "Implement role-based access control for different workflow stages.",
      "Set up automated compliance checks and audit logging.",
      "Plan capacity based on peak load projections.",
    ],
  };

  const successCriteriaMap: Record<string, string[]> = {
    simple: [
      "All steps complete without errors on test data",
      "Output quality meets baseline accuracy requirements",
      "End-to-end processing time is within the estimated range",
    ],
    moderate: [
      "Pipeline completes successfully for 95%+ of test cases",
      "Error handling gracefully manages common failure modes",
      "Processing time is consistently within acceptable bounds",
      "Output quality validated against domain-specific benchmarks",
    ],
    complex: [
      "Pipeline achieves 99%+ reliability on production data",
      "Automated monitoring and alerting are fully operational",
      "Performance meets SLA requirements under expected load",
      "All data security and compliance requirements are met",
      "Rollback and recovery procedures are tested and documented",
    ],
    enterprise: [
      "Pipeline meets enterprise SLA (99.9%+ uptime)",
      "Full audit trail and compliance documentation in place",
      "Disaster recovery tested with < 1 hour RTO",
      "Performance scales linearly with load increases",
      "Security review passed with no critical findings",
      "All stakeholder acceptance criteria met",
    ],
  };

  return {
    prerequisites: prereqMap[complexity] ?? prereqMap.simple,
    implementationGuide,
    bestPractices: practiceMap[complexity] ?? practiceMap.simple,
    estimatedCosts: generateWorkflowCostEstimate(workflow),
    successCriteria: successCriteriaMap[complexity] ?? successCriteriaMap.simple,
  };
}

function generateWorkflowCostEstimate(workflow: Workflow): string {
  const stepCount = workflow.steps.length;
  const complexity = workflow.complexity;

  if (complexity === "enterprise") return `Enterprise-grade workflow with ${stepCount} steps. Estimated $1–$10+ per execution depending on data volume and model selection. Consider volume pricing with AI providers.`;
  if (complexity === "complex") return `Complex ${stepCount}-step pipeline. Estimated $0.50–$5 per execution. Costs scale with input complexity and data volume.`;
  if (complexity === "moderate") return `Moderate ${stepCount}-step workflow. Estimated $0.10–$1 per execution depending on model and data size.`;
  return `Simple ${stepCount}-step workflow. Estimated $0.01–$0.20 per execution with standard API pricing.`;
}
