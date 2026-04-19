export interface AgentTool {
  name: string;
  description: string;
  parameters: {
    name: string;
    type: string;
    description: string;
    required?: boolean;
  }[];
  exampleOutput: string;
}

export interface AgentMemoryConfig {
  type: "conversation" | "persistent" | "none";
  maxMessages?: number;
  summaryAfter?: number;
}

export interface AgentDeployConfig {
  methods: ("api" | "sdk" | "mcp" | "webhook" | "embed")[];
  envVars: { name: string; description: string; required: boolean }[];
  dockerSupport: boolean;
}

export interface AgentExample {
  userMessage: string;
  agentResponse: string;
  toolCalls?: { tool: string; input: string; output: string }[];
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  industry: string;
  category: string;
  avatar: string;
  personality: string;
  systemPrompt: string;
  model: string;
  temperature: number;
  maxTokens: number;
  tools: AgentTool[];
  memoryConfig: AgentMemoryConfig;
  deployConfig: AgentDeployConfig;
  examples: AgentExample[];
  useCases: string[];
  tags: string[];
  difficulty: "beginner" | "intermediate" | "advanced" | "expert";
  estimatedSetupTime: string;
  popularity: number;
  price: number;
  relatedSkills: string[];
}
