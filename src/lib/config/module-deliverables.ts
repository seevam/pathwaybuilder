export interface ModuleDeliverableConfig {
  moduleId: string
  orderIndex: number
  title: string
  description: string
  requirements: string[]
  templateSlug: string
  acceptedFileTypes: string[]
}

export const MODULE_DELIVERABLES: Record<number, ModuleDeliverableConfig> = {
  1: {
    moduleId: 'module-1',
    orderIndex: 1,
    title: 'Identity Collage',
    description: 'Create a visual representation of your identity including your top values, strengths, personality highlights, and a personal motto.',
    requirements: [
      'Your top 5 values',
      'Your key strengths (3-5)',
      'Personality highlights (RIASEC code, DISC type, key traits)',
      'A personal motto or quote that represents you',
      'Images, colors, or symbols that represent your identity',
    ],
    templateSlug: 'identity-collage',
    acceptedFileTypes: ['image/*', 'application/pdf', '.pptx', '.docx'],
  },
  2: {
    moduleId: 'module-2',
    orderIndex: 2,
    title: 'Career Exploration Portfolio',
    description: 'Compile your research and reflections on potential career paths that align with your interests and strengths.',
    requirements: [
      'Summary of your Holland Code career matches',
      'At least 3 career clusters you explored',
      '"Day in the Life" research for 2-3 careers',
      'Reflection on how these careers align with your values',
      'Top 3 career paths you want to explore further',
    ],
    templateSlug: 'career-portfolio',
    acceptedFileTypes: ['application/pdf', '.docx', '.pptx', 'image/*'],
  },
  3: {
    moduleId: 'module-3',
    orderIndex: 3,
    title: 'Education Pathway Plan',
    description: 'Document your education and training pathways for your chosen career direction, including academic requirements and alternatives.',
    requirements: [
      'Education requirements for your top career choices',
      'List of relevant colleges, programs, or training options',
      'Alternative pathways (apprenticeships, certifications, etc.)',
      'Timeline of key milestones from high school to career',
      'SMART goals for your education journey',
    ],
    templateSlug: 'education-plan',
    acceptedFileTypes: ['application/pdf', '.docx', '.pptx'],
  },
  4: {
    moduleId: 'module-4',
    orderIndex: 4,
    title: 'Personal Work Style Profile',
    description: 'Create a comprehensive profile of your work style, preferences, and how you collaborate best with others.',
    requirements: [
      'Your DISC assessment results and interpretation',
      'Work environment preferences (remote, office, hybrid, etc.)',
      'Collaboration style and team role preferences',
      'Time management strategies that work for you',
      'Reflection on how to leverage your work style in your career',
    ],
    templateSlug: 'work-style-profile',
    acceptedFileTypes: ['application/pdf', '.docx', '.pptx', 'image/*'],
  },
  5: {
    moduleId: 'module-5',
    orderIndex: 5,
    title: 'Action Plan Document',
    description: 'Develop a detailed, actionable plan for the next 1-3 years with specific steps, timelines, and accountability systems.',
    requirements: [
      'Quarterly goals for the next year',
      'Timeline builder with key milestones',
      'Your personal "story arc" narrative',
      'Accountability system and support network',
      'Concrete action steps with deadlines',
    ],
    templateSlug: 'action-plan',
    acceptedFileTypes: ['application/pdf', '.docx', '.pptx'],
  },
  6: {
    moduleId: 'module-6',
    orderIndex: 6,
    title: 'Personal Brand Package',
    description: 'Create materials that represent your personal brand, including elevator pitch, digital presence strategy, and portfolio showcase.',
    requirements: [
      'Polished elevator pitch (30-60 seconds)',
      'Digital presence strategy (LinkedIn, portfolio site, etc.)',
      'Skill gap analysis and development plan',
      'Integration reflection connecting all modules',
      'Your unique value proposition and career narrative',
    ],
    templateSlug: 'personal-brand',
    acceptedFileTypes: ['application/pdf', '.docx', '.pptx', 'video/*', 'audio/*'],
  },
}

export function getModuleDeliverable(orderIndex: number): ModuleDeliverableConfig | null {
  return MODULE_DELIVERABLES[orderIndex] || null
}

export function getModuleDeliverableByModuleId(moduleId: string): ModuleDeliverableConfig | null {
  const deliverable = Object.values(MODULE_DELIVERABLES).find(d => d.moduleId === moduleId)
  return deliverable || null
}
