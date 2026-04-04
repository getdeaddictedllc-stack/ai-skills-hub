import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import type { Skill, Workflow, Industry } from '@/lib/types';

// Add any providers your app needs here
function AllProviders({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

function customRender(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, { wrapper: AllProviders, ...options });
}

// Re-export everything from testing-library
export * from '@testing-library/react';

// Override render with the custom one
export { customRender as render };

// --- Mock data factory helpers ---

export function createMockSkill(overrides?: Partial<Skill>): Skill {
  return {
    id: 'skill-1',
    name: 'Test Skill',
    description: 'A test skill description',
    industry: 'technology',
    category: 'automation',
    difficulty: 'intermediate',
    tags: ['ai', 'automation'],
    integrationTypes: ['api'],
    aiModels: ['claude'],
    inputType: ['text'],
    outputType: ['text'],
    useCases: ['Testing', 'Demo'],
    estimatedTime: '5 min',
    popularity: 85,
    ...overrides,
  };
}

export function createMockWorkflow(overrides?: Partial<Workflow>): Workflow {
  return {
    id: 'workflow-1',
    name: 'Test Workflow',
    description: 'A test workflow description',
    industry: 'technology',
    steps: [
      {
        skillId: 'skill-1',
        skillName: 'Step One',
        order: 1,
        description: 'First step',
      },
      {
        skillId: 'skill-2',
        skillName: 'Step Two',
        order: 2,
        description: 'Second step',
      },
    ],
    estimatedTime: '15 min',
    complexity: 'moderate',
    tags: ['automation', 'pipeline'],
    category: 'automation',
    ...overrides,
  };
}

export function createMockIndustry(overrides?: Partial<Industry>): Industry {
  return {
    id: 'industry-1',
    name: 'Technology',
    icon: 'Cpu',
    description: 'A test industry description',
    skillCount: 12,
    workflowCount: 4,
    categories: ['automation', 'development', 'analytics'],
    color: '#3B82F6',
    ...overrides,
  };
}
