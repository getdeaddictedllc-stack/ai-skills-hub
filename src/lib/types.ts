export interface Skill {
  id: string;
  name: string;
  description: string;
  industry: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced" | "expert";
  tags: string[];
  integrationTypes: IntegrationType[];
  aiModels: AIModel[];
  inputType: IOType[];
  outputType: IOType[];
  useCases: string[];
  estimatedTime: string;
  popularity: number;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  industry: string;
  steps: WorkflowStep[];
  estimatedTime: string;
  complexity: "simple" | "moderate" | "complex" | "enterprise";
  tags: string[];
  category: string;
}

export interface WorkflowStep {
  skillId: string;
  skillName: string;
  order: number;
  description: string;
}

export interface Industry {
  id: string;
  name: string;
  icon: string;
  description: string;
  skillCount: number;
  workflowCount: number;
  categories: string[];
  color: string;
}

export type IntegrationType = "api" | "webhook" | "sdk" | "plugin" | "standalone" | "mcp" | "function-calling";
export type AIModel = "claude" | "gpt-4" | "gpt-4o" | "gemini" | "llama" | "mistral" | "cohere" | "palm" | "dalle" | "stable-diffusion" | "whisper" | "midjourney";
export type IOType = "text" | "image" | "audio" | "video" | "document" | "data" | "code" | "analysis" | "spreadsheet" | "presentation" | "3d-model" | "multimodal";

export type Difficulty = Skill["difficulty"];
export type Complexity = Workflow["complexity"];
