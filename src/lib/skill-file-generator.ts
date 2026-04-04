import type { Skill, Workflow } from "@/lib/types";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const MODEL_MAP: Record<string, { name: string; id: string; provider: string }> = {
  claude: { name: "Claude", id: "claude-sonnet-4-6", provider: "Anthropic" },
  "gpt-4": { name: "GPT-4", id: "gpt-4", provider: "OpenAI" },
  "gpt-4o": { name: "GPT-4o", id: "gpt-4o", provider: "OpenAI" },
  gemini: { name: "Gemini", id: "gemini-2.0-flash", provider: "Google" },
  llama: { name: "LLaMA", id: "llama-3.1-70b", provider: "Meta" },
  mistral: { name: "Mistral", id: "mistral-large-latest", provider: "Mistral AI" },
  cohere: { name: "Command R+", id: "command-r-plus", provider: "Cohere" },
  palm: { name: "PaLM 2", id: "text-bison-002", provider: "Google" },
  dalle: { name: "DALL-E 3", id: "dall-e-3", provider: "OpenAI" },
  "stable-diffusion": { name: "Stable Diffusion XL", id: "stable-diffusion-xl", provider: "Stability AI" },
  whisper: { name: "Whisper", id: "whisper-large-v3", provider: "OpenAI" },
  midjourney: { name: "Midjourney v6", id: "midjourney-v6", provider: "Midjourney" },
};

const INTEGRATION_GUIDE: Record<string, { setup: string; example: string }> = {
  api: {
    setup: "Set up REST API access by obtaining an API key from the model provider's dashboard. Configure your HTTP client with proper authentication headers and base URL.",
    example: `curl -X POST https://api.provider.com/v1/completions \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "MODEL_ID",
    "messages": [{"role": "system", "content": "SYSTEM_PROMPT"}, {"role": "user", "content": "USER_INPUT"}],
    "temperature": 0.3,
    "max_tokens": 4096
  }'`,
  },
  sdk: {
    setup: "Install the official SDK via your package manager. Initialize the client with your API key and configure default parameters.",
    example: `# Python
from anthropic import Anthropic
client = Anthropic(api_key="YOUR_API_KEY")

response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=4096,
    system="SYSTEM_PROMPT",
    messages=[{"role": "user", "content": "USER_INPUT"}]
)
print(response.content[0].text)`,
  },
  webhook: {
    setup: "Register a webhook endpoint URL in the provider's dashboard. Implement the handler to receive POST requests with event payloads and process them asynchronously.",
    example: `# Webhook handler (Node.js / Express)
app.post('/webhook/ai-result', (req, res) => {
  const { event, data } = req.body;
  if (event === 'completion.done') {
    processResult(data.output);
  }
  res.status(200).json({ received: true });
});`,
  },
  plugin: {
    setup: "Install the plugin from the platform's marketplace or extension store. Configure it through the settings panel with your API credentials and preferred defaults.",
    example: `// Plugin configuration (JSON)
{
  "plugin": "ai-skill-plugin",
  "api_key": "YOUR_API_KEY",
  "model": "MODEL_ID",
  "defaults": {
    "temperature": 0.3,
    "max_tokens": 4096
  }
}`,
  },
  standalone: {
    setup: "Download and install the standalone application. No external API calls required — the model runs locally on your hardware.",
    example: `# Run locally
./ai-skill-runner --model MODEL_ID --input data.json --output results.json`,
  },
  mcp: {
    setup: "Configure a Model Context Protocol (MCP) server to expose your data sources and tools. Connect your AI model client to the MCP server for real-time context access.",
    example: `// MCP server configuration
{
  "mcpServers": {
    "skill-server": {
      "command": "npx",
      "args": ["-y", "@your-org/mcp-skill-server"],
      "env": {
        "API_KEY": "YOUR_API_KEY"
      }
    }
  }
}`,
  },
  "function-calling": {
    setup: "Define your tool/function schemas and pass them alongside your prompt. The AI model will generate structured function calls that your application executes.",
    example: `# Function calling setup
tools = [{
    "name": "analyze_input",
    "description": "Process and analyze the input data",
    "input_schema": {
        "type": "object",
        "properties": {
            "data": {"type": "string", "description": "The input data to analyze"},
            "format": {"type": "string", "enum": ["detailed", "summary"]}
        },
        "required": ["data"]
    }
}]

response = client.messages.create(
    model="claude-sonnet-4-6",
    tools=tools,
    messages=[{"role": "user", "content": "Analyze this data..."}]
)`,
  },
};

const IO_DESCRIPTIONS: Record<string, { prepare: string; format: string }> = {
  text: { prepare: "Plain text content, properly encoded as UTF-8", format: "String — pass directly in the prompt or message body" },
  image: { prepare: "Images in PNG, JPEG, or WebP format, ideally under 20MB", format: "Base64-encoded string or URL reference" },
  audio: { prepare: "Audio files in MP3, WAV, or M4A format", format: "Base64-encoded or file upload via multipart form" },
  video: { prepare: "Video files in MP4 or WebM format, segmented if long", format: "File upload or URL reference with frame extraction" },
  document: { prepare: "PDFs, DOCX, or structured documents", format: "Text extraction or base64-encoded file" },
  data: { prepare: "Structured data in JSON, CSV, or tabular format", format: "JSON object or CSV string in the prompt" },
  code: { prepare: "Source code with language identifier and context", format: "Code block string with file path metadata" },
  analysis: { prepare: "N/A — this is an output type", format: "Structured JSON with scores, findings, and recommendations" },
  spreadsheet: { prepare: "Excel (.xlsx) or CSV files with headers", format: "CSV text or JSON array of row objects" },
  presentation: { prepare: "PowerPoint (.pptx) or slide content in text", format: "Structured JSON with slide content and notes" },
  "3d-model": { prepare: "3D model files (OBJ, STL, GLTF)", format: "File reference with metadata" },
  multimodal: { prepare: "Multiple input types combined", format: "Array of content blocks with type annotations" },
};

const DIFFICULTY_CONFIG: Record<string, { temperature: string; maxTokens: string; topP: string; guidance: string }> = {
  beginner: {
    temperature: "0.3",
    maxTokens: "2048",
    topP: "0.9",
    guidance: "Use low temperature for consistent, predictable outputs. Start with shorter max_tokens and increase as needed.",
  },
  intermediate: {
    temperature: "0.4",
    maxTokens: "4096",
    topP: "0.9",
    guidance: "Balance creativity and precision. Use structured output formats (JSON) for easier parsing and integration.",
  },
  advanced: {
    temperature: "0.2",
    maxTokens: "8192",
    topP: "0.95",
    guidance: "Use lower temperature for high-stakes outputs. Implement chain-of-thought prompting for complex reasoning tasks.",
  },
  expert: {
    temperature: "0.1",
    maxTokens: "8192",
    topP: "0.95",
    guidance: "Minimize temperature for maximum precision. Use multi-turn conversations, tool use, and validation layers.",
  },
};

// ---------------------------------------------------------------------------
// Skill file generator
// ---------------------------------------------------------------------------

export function generateSkillFileContent(skill: Skill): string {
  const primaryModel = skill.aiModels[0] ?? "claude";
  const modelInfo = MODEL_MAP[primaryModel] ?? MODEL_MAP.claude;
  const diffConfig = DIFFICULTY_CONFIG[skill.difficulty] ?? DIFFICULTY_CONFIG.intermediate;

  const systemPrompt = buildSystemPrompt(skill);
  const inputSpecs = buildInputSpecs(skill);
  const outputSpecs = buildOutputSpecs(skill);
  const integrationGuides = buildIntegrationGuides(skill);
  const qualityChecklist = buildQualityChecklist(skill);
  const errorHandling = buildErrorHandling(skill);
  const useCaseExamples = buildUseCaseExamples(skill);

  const frontmatter = buildFrontmatter({
    name: skill.name,
    description: skill.description,
    version: "1.0.0",
    industry: skill.industry,
    category: skill.category,
    difficulty: skill.difficulty,
    estimated_time: skill.estimatedTime,
    popularity: skill.popularity,
    model: modelInfo.id,
    provider: modelInfo.provider,
    tags: skill.tags,
    input_types: skill.inputType,
    output_types: skill.outputType,
    integration_types: skill.integrationTypes,
    supported_models: skill.aiModels.map((m) => (MODEL_MAP[m] ?? { id: m }).id),
    license: "Commercial - AI Skills Hub",
    source: `https://aiskillhub.info/skill/${skill.id}`,
  });

  return `${frontmatter}

# ${skill.name}

${skill.description}

***

## System Prompt

Use this system prompt to configure the AI model for this skill:

\`\`\`
${systemPrompt}
\`\`\`

***

## Model Configuration

| Parameter | Recommended Value | Notes |
|-----------|-------------------|-------|
| **Model** | ${modelInfo.id} | ${modelInfo.name} by ${modelInfo.provider} |
| **Temperature** | ${diffConfig.temperature} | ${skill.difficulty} difficulty — ${diffConfig.guidance.split(".")[0].toLowerCase()}. |
| **Max Tokens** | ${diffConfig.maxTokens} | Adjust based on expected output length |
| **Top P** | ${diffConfig.topP} | Nucleus sampling threshold |
| **Stop Sequences** | \`[]\` | Use defaults unless output needs truncation |

### Alternative Models

${skill.aiModels.map((m) => {
  const info = MODEL_MAP[m] ?? { name: m, id: m, provider: "Unknown" };
  return `- **${info.name}** (\`${info.id}\`) — ${info.provider}`;
}).join("\n")}

> **Tuning Tip:** ${diffConfig.guidance}

***

## Input Specification

${inputSpecs}

### Input Validation Rules

- Verify all required input fields are present before sending to the model
- Reject inputs that exceed size limits (text: 100K chars, images: 20MB, audio: 25MB)
- Sanitize user-provided content to prevent prompt injection
- Log rejected inputs with reason codes for monitoring

***

## Output Specification

${outputSpecs}

### Output Validation Rules

- Verify the response matches the expected output schema
- Check for hallucinations by cross-referencing key claims when possible
- Apply confidence thresholds — flag outputs below 0.7 confidence for human review
- Sanitize outputs before displaying to end users

***

## Use Cases & Examples

${useCaseExamples}

***

## Integration Guide

${integrationGuides}

***

## Quality Assurance Checklist

${qualityChecklist}

***

## Error Handling

${errorHandling}

***

## Performance Optimization

### Latency Reduction
- Cache identical requests for repeated inputs (TTL: 1–24 hours depending on data freshness needs)
- Use streaming responses for real-time user-facing applications
- Batch multiple inputs into a single request when the API supports it
- Deploy in the region closest to your users for minimum network latency

### Cost Optimization
- Use the smallest model that meets your accuracy requirements for routine tasks
- Reserve the primary model (${modelInfo.id}) for complex or high-stakes inputs
- Implement token counting before submission to estimate and control costs
- Set up usage alerts and budget caps with your API provider

### Accuracy Improvement
- Collect user feedback to identify failure patterns
- Build evaluation datasets from real production inputs and expected outputs
- Run A/B tests when changing prompts or model versions
- Monitor output quality metrics over time (accuracy, relevance, completeness)

***

## Security & Compliance

- **Data Privacy:** Never log or store sensitive input data (PII, PHI, financial records) without encryption and access controls
- **Prompt Injection:** Validate and sanitize all user inputs before including them in prompts
- **Access Control:** Restrict API key access to authorized services only; rotate keys quarterly
- **Audit Trail:** Log all API calls with timestamps, input hashes, and output summaries for compliance
- **Data Residency:** Confirm your model provider stores and processes data in compliant regions
- **Rate Limiting:** Implement rate limits to prevent abuse and manage costs

***

## Monitoring & Observability

Track these metrics in production:

| Metric | Target | Alert Threshold |
|--------|--------|-----------------|
| Response latency (p95) | < 5 seconds | > 10 seconds |
| Success rate | > 99% | < 95% |
| Output quality score | > 0.85 | < 0.7 |
| Token usage per request | Baseline ± 20% | > 2x baseline |
| Error rate | < 1% | > 5% |
| Cost per request | Baseline | > 1.5x baseline |

***

## Changelog

- **v1.0.0** — Initial release with full system prompt, integration guides, and quality framework

***

*Generated by [AI Skills Hub](https://aiskillhub.info/skill/${skill.id})*
`;
}

// ---------------------------------------------------------------------------
// Workflow file generator
// ---------------------------------------------------------------------------

export function generateWorkflowFileContent(workflow: Workflow): string {
  const stepsYaml = workflow.steps.map((s) => `  - skill: "${s.skillId}"\n    name: "${escYaml(s.skillName)}"\n    order: ${s.order}`).join("\n");

  const stepsDetail = workflow.steps
    .map((step, idx) => {
      const isLast = idx === workflow.steps.length - 1;
      const inputNote = idx === 0 ? "Takes the initial user/system input" : `Receives output from Step ${idx}: ${workflow.steps[idx - 1].skillName}`;
      const outputNote = isLast ? "Produces the final workflow output" : `Passes output to Step ${idx + 2}: ${workflow.steps[idx + 1].skillName}`;

      return `### Step ${step.order}: ${step.skillName}

**Description:** ${step.description}

- **Input:** ${inputNote}
- **Output:** ${outputNote}
- **Skill Reference:** [${step.skillName}](https://aiskillhub.info/skill/${step.skillId})

\`\`\`
System Prompt for Step ${step.order}:
You are processing step ${step.order} of ${workflow.steps.length} in the "${workflow.name}" workflow.
Your role: ${step.description}
${idx > 0 ? `\nYou will receive the output from the previous step (${workflow.steps[idx - 1].skillName}). Use it as your primary input.` : ""}
Provide your output in a structured JSON format so the next step can parse it reliably.
\`\`\``;
    })
    .join("\n\n***\n\n");

  const orchestrationCode = buildOrchestrationCode(workflow);
  const dataFlowDiagram = buildDataFlowDiagram(workflow);

  const frontmatter = buildFrontmatter({
    name: workflow.name,
    description: workflow.description,
    version: "1.0.0",
    industry: workflow.industry,
    category: workflow.category,
    complexity: workflow.complexity,
    estimated_time: workflow.estimatedTime,
    total_steps: workflow.steps.length,
    tags: workflow.tags,
    license: "Commercial - AI Skills Hub",
    source: `https://aiskillhub.info/workflow/${workflow.id}`,
  });

  return `${frontmatter}

# ${workflow.name}

${workflow.description}

***

## Workflow Overview

| Property | Value |
|----------|-------|
| **Industry** | ${workflow.industry} |
| **Category** | ${workflow.category} |
| **Complexity** | ${workflow.complexity} |
| **Total Steps** | ${workflow.steps.length} |
| **Estimated Time** | ${workflow.estimatedTime} |

***

## Data Flow

\`\`\`
${dataFlowDiagram}
\`\`\`

***

## Steps (Detailed)

${stepsDetail}

***

## Orchestration Code

Use this as a starting template to orchestrate the full workflow:

\`\`\`python
${orchestrationCode}
\`\`\`

***

## Step-by-Step Implementation

### Phase 1: Setup
1. Obtain API keys for all AI models required across steps
2. Set up your development environment with the SDKs/HTTP client
3. Create a project structure with separate modules for each step
4. Configure environment variables for API keys and endpoints

### Phase 2: Build Individual Steps
${workflow.steps.map((s, i) => `${i + 1}. **${s.skillName}** — Implement and test in isolation with sample data`).join("\n")}

### Phase 3: Connect the Pipeline
1. Define the data contract (JSON schema) between each step
2. Implement the orchestrator that chains steps together
3. Add intermediate data validation between steps
4. Implement error handling and retry logic at each junction

### Phase 4: Test End-to-End
1. Run the full pipeline with representative test data
2. Verify output quality at each step and at the final output
3. Test failure scenarios (API timeout, malformed data, rate limits)
4. Measure total latency and per-step latency

### Phase 5: Deploy & Monitor
1. Deploy to your production environment with proper secrets management
2. Set up logging, monitoring, and alerting for each step
3. Implement health checks and circuit breakers
4. Document the workflow for your team and stakeholders

***

## Error Handling Strategy

| Failure Point | Strategy | Fallback |
|---------------|----------|----------|
| API timeout | Retry with exponential backoff (max 3 attempts) | Queue for async processing |
| Malformed input | Validate before each step; reject with clear error | Return partial results with error flag |
| Rate limit hit | Implement token bucket; queue excess requests | Switch to backup model provider |
| Step failure | Log error context; attempt recovery from last checkpoint | Alert operator; pause pipeline |
| Quality threshold not met | Re-run step with adjusted parameters | Flag for human review |

***

## Monitoring

Track these workflow-level metrics:

| Metric | Target | Alert Threshold |
|--------|--------|-----------------|
| End-to-end latency | < ${estimateLatency(workflow)} | > 2x target |
| Pipeline success rate | > 98% | < 90% |
| Per-step success rate | > 99% | < 95% |
| Daily throughput | Baseline | < 50% baseline |
| Cost per execution | Baseline | > 1.5x baseline |

***

## Security & Compliance

- Encrypt data in transit between steps (TLS 1.3)
- Do not persist intermediate results containing PII without encryption
- Implement audit logging for every step execution
- Apply least-privilege access controls to each step's API credentials
- Validate and sanitize all inputs at pipeline entry point

***

## Changelog

- **v1.0.0** — Initial release with full step definitions, orchestration code, and deployment guide

***

*Generated by [AI Skills Hub](https://aiskillhub.info/workflow/${workflow.id})*
`;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function escYaml(str: string): string {
  return str.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, " ");
}

function buildFrontmatter(fields: Record<string, string | number | string[]>): string {
  const lines: string[] = ["---"];
  for (const [key, value] of Object.entries(fields)) {
    if (Array.isArray(value)) {
      lines.push(`${key}: [${value.map((v) => `"${escYaml(String(v))}"`).join(", ")}]`);
    } else if (typeof value === "number") {
      lines.push(`${key}: ${value}`);
    } else {
      lines.push(`${key}: "${escYaml(String(value))}"`);
    }
  }
  lines.push("---");
  return lines.join("\n");
}

function buildSystemPrompt(skill: Skill): string {
  const inputList = skill.inputType.join(", ");
  const outputList = skill.outputType.join(", ");

  return `You are an expert AI assistant specialized in ${skill.category} for the ${capitalize(skill.industry)} industry.

Your task: ${skill.description}

## Core Capabilities
${skill.useCases.map((uc) => `- ${uc}`).join("\n")}

## Input Format
You accept the following input types: ${inputList}.
Always confirm you have received valid input before proceeding with analysis.

## Output Requirements
Provide your response as: ${outputList}.

Structure your output with these sections:
1. **Summary** — A brief overview of findings (2-3 sentences)
2. **Detailed Analysis** — Comprehensive breakdown with specific data points
3. **Key Findings** — Bulleted list of the most important discoveries
4. **Recommendations** — Actionable next steps ranked by priority
5. **Confidence Score** — Rate your confidence (0.0-1.0) with justification

## Quality Standards
- Be precise and evidence-based; cite specific data points from the input
- Flag any uncertainties or limitations clearly
- If the input is ambiguous or insufficient, ask for clarification rather than guessing
- Follow ${capitalize(skill.industry)} industry best practices and terminology
- Maintain professional tone appropriate for ${skill.difficulty}-level practitioners

## Constraints
- Do not fabricate data or statistics
- Clearly distinguish between analysis and recommendations
- If the request falls outside your ${skill.category} expertise, state so explicitly
- Respect data privacy — do not repeat sensitive information unnecessarily`;
}

function buildInputSpecs(skill: Skill): string {
  return skill.inputType
    .map((type) => {
      const info = IO_DESCRIPTIONS[type] ?? { prepare: "Standard format", format: "Standard encoding" };
      return `### ${capitalize(type)} Input
- **Preparation:** ${info.prepare}
- **Format:** ${info.format}`;
    })
    .join("\n\n");
}

function buildOutputSpecs(skill: Skill): string {
  return skill.outputType
    .map((type) => {
      const info = IO_DESCRIPTIONS[type] ?? { prepare: "Standard format", format: "Standard encoding" };
      return `### ${capitalize(type)} Output
- **Format:** ${info.format}`;
    })
    .join("\n\n");
}

function buildIntegrationGuides(skill: Skill): string {
  return skill.integrationTypes
    .map((type) => {
      const guide = INTEGRATION_GUIDE[type];
      if (!guide) return `### ${capitalize(type)}\n\nStandard ${type} integration.`;

      return `### ${capitalize(type)} Integration

**Setup:** ${guide.setup}

\`\`\`
${guide.example}
\`\`\``;
    })
    .join("\n\n***\n\n");
}

function buildQualityChecklist(skill: Skill): string {
  const checks = [
    "[ ] System prompt configured with correct domain context",
    "[ ] Input validation implemented for all accepted types",
    "[ ] Output schema validation in place",
    `[ ] Temperature set to ${(DIFFICULTY_CONFIG[skill.difficulty] ?? DIFFICULTY_CONFIG.intermediate).temperature} for ${skill.difficulty}-level precision`,
    "[ ] Error handling covers API failures, timeouts, and malformed responses",
    "[ ] Rate limiting configured to stay within API provider limits",
    "[ ] Logging captures request/response metadata (not sensitive content)",
    "[ ] Monitoring dashboard shows latency, success rate, and cost metrics",
    "[ ] Security review completed — no PII leaks, prompt injection vectors addressed",
    "[ ] Load tested with expected peak traffic volume",
    `[ ] Tested with all ${skill.inputType.length} input type(s): ${skill.inputType.join(", ")}`,
    `[ ] Verified output quality for all ${skill.useCases.length} use case(s)`,
  ];

  return checks.join("\n");
}

function buildErrorHandling(skill: Skill): string {
  return `### Common Errors & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| 401 Unauthorized | Invalid or expired API key | Rotate API key; verify environment variable is set |
| 429 Rate Limited | Too many requests | Implement exponential backoff; add request queue |
| 400 Bad Request | Malformed input (${skill.inputType.join(", ")}) | Validate input format and size before API call |
| 500 Server Error | Provider-side issue | Retry after 5s; switch to fallback model if persistent |
| Timeout | Response exceeds time limit | Increase timeout; reduce max_tokens; check input size |
| Low Quality Output | Ambiguous prompt or input | Refine system prompt; add few-shot examples; lower temperature |
| Hallucination | Model generating false information | Add fact-checking layer; require citations; lower temperature to ${(DIFFICULTY_CONFIG[skill.difficulty] ?? DIFFICULTY_CONFIG.intermediate).temperature} |

### Retry Strategy

\`\`\`python
import time

def call_with_retry(fn, max_retries=3, base_delay=1.0):
    for attempt in range(max_retries):
        try:
            return fn()
        except RateLimitError:
            delay = base_delay * (2 ** attempt)
            time.sleep(delay)
        except (TimeoutError, ServerError) as e:
            if attempt == max_retries - 1:
                raise
            time.sleep(base_delay)
    raise MaxRetriesExceeded()
\`\`\``;
}

function buildUseCaseExamples(skill: Skill): string {
  return skill.useCases
    .map((uc, idx) => {
      return `### Use Case ${idx + 1}: ${uc}

**Scenario:** A ${capitalize(skill.industry)} professional needs to perform "${uc.toLowerCase()}" using AI.

**Prompt Example:**
\`\`\`
Given the following ${skill.inputType[0] ?? "input"}, ${uc.toLowerCase()}.

Provide:
1. A detailed analysis of the ${skill.inputType[0] ?? "input"}
2. Specific findings relevant to ${uc.toLowerCase()}
3. Actionable recommendations with priority levels
4. Confidence score for each finding

Format your response as structured ${skill.outputType[0] ?? "text"} with clear section headers.
\`\`\``;
    })
    .join("\n\n***\n\n");
}

function buildOrchestrationCode(workflow: Workflow): string {
  const stepFns = workflow.steps
    .map(
      (s) =>
        `def step_${s.order}_${s.skillId.replace(/-/g, "_").substring(0, 40)}(input_data):
    """${s.skillName}: ${s.description}"""
    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=4096,
        system=STEP_${s.order}_SYSTEM_PROMPT,
        messages=[{"role": "user", "content": json.dumps(input_data)}]
    )
    return json.loads(response.content[0].text)`
    )
    .join("\n\n");

  const stepCalls = workflow.steps
    .map((s, idx) => {
      const fnName = `step_${s.order}_${s.skillId.replace(/-/g, "_").substring(0, 40)}`;
      const inputVar = idx === 0 ? "initial_input" : `result_step_${idx}`;
      return `    # Step ${s.order}: ${s.skillName}
    result_step_${idx + 1} = ${fnName}(${inputVar})
    log_step(${s.order}, result_step_${idx + 1})`;
    })
    .join("\n\n");

  return `"""
${workflow.name}
${workflow.description}

Auto-generated orchestration template — customize for your environment.
"""

import json
import logging
from anthropic import Anthropic

client = Anthropic(api_key="YOUR_API_KEY")
logger = logging.getLogger("${workflow.id}")

# Define system prompts for each step (customize these)
${workflow.steps.map((s) => `STEP_${s.order}_SYSTEM_PROMPT = """You are step ${s.order} of ${workflow.steps.length} in a workflow. ${s.description}. Output valid JSON."""`).join("\n")}

# --- Step Functions ---

${stepFns}

# --- Orchestrator ---

def run_workflow(initial_input: dict) -> dict:
    """Execute the full ${workflow.steps.length}-step workflow."""
    try:
${stepCalls}

        return result_step_${workflow.steps.length}

    except Exception as e:
        logger.error(f"Workflow failed: {e}")
        raise

def log_step(step_number: int, result: dict):
    logger.info(f"Step {step_number} completed", extra={"step": step_number, "keys": list(result.keys())})

# --- Run ---
if __name__ == "__main__":
    input_data = {}  # Your input here
    output = run_workflow(input_data)
    print(json.dumps(output, indent=2))`;
}

function buildDataFlowDiagram(workflow: Workflow): string {
  const lines: string[] = [];
  lines.push("[Input]");
  lines.push("   |");
  for (const step of workflow.steps) {
    lines.push(`   v`);
    lines.push(`[Step ${step.order}: ${step.skillName}]`);
    if (step.order < workflow.steps.length) {
      lines.push("   |");
    }
  }
  lines.push("   |");
  lines.push("   v");
  lines.push("[Output]");
  return lines.join("\n");
}

function estimateLatency(workflow: Workflow): string {
  const seconds = workflow.steps.length * 5;
  if (seconds < 60) return `${seconds}s`;
  return `${Math.round(seconds / 60)}m`;
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
