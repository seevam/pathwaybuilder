import { z } from 'zod'

export const activityCompletionSchema = z.object({
  data: z.record(z.any()).optional(),
  timeSpent: z.number().optional(),
})

// Remove activityId from the schema since it comes from URL params

export const reflectionSchema = z.object({
  prompt: z.string().min(1),
  response: z.string().min(10, "Please write at least 10 characters"),
})

export const valuesSchema = z.object({
  alwaysTrue: z.array(z.string()).min(3, "Select at least 3 values"),
  sometimes: z.array(z.string()),
  notPriority: z.array(z.string()),
})

// Project validations
export const brainstormSchema = z.object({
  interests: z.string().min(10, 'Please describe your interests in more detail'),
  problemArea: z.string().min(10, 'Please describe the problem area'),
  timeCommitment: z.enum(['2-3', '4-6', '7-10', '10+']),
  projectTypes: z.array(z.string()).min(1, 'Select at least one project type'),
})

export const createProjectSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.enum(['CREATIVE', 'SOCIAL_IMPACT', 'ENTREPRENEURIAL', 'RESEARCH', 'TECHNICAL', 'LEADERSHIP']),
  status: z.enum(['IDEATION', 'PLANNING', 'IN_PROGRESS', 'PAUSED', 'COMPLETED', 'ABANDONED']).optional(),
  ideaSource: z.any().optional(),
})

export const updateProjectSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().min(10).optional(),
  category: z.enum(['CREATIVE', 'SOCIAL_IMPACT', 'ENTREPRENEURIAL', 'RESEARCH', 'TECHNICAL', 'LEADERSHIP']).optional(),
  status: z.enum(['IDEATION', 'PLANNING', 'IN_PROGRESS', 'PAUSED', 'COMPLETED', 'ABANDONED']).optional(),
  healthScore: z.number().min(0).max(100).optional(),
  goals: z.any().optional(),
  resources: z.any().optional(),
  metrics: z.any().optional(),
  startedAt: z.string().datetime().optional(),
  targetCompletionAt: z.string().datetime().optional(),
  completedAt: z.string().datetime().optional(),
})

export const milestoneSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  orderIndex: z.number().min(0),
  targetDate: z.string().datetime().optional(),
})

export const taskSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  estimatedHours: z.number().min(0).optional(),
})

export const checkInSchema = z.object({
  accomplishments: z.string().min(10, 'Please describe your accomplishments'),
  challenges: z.string().optional(),
  learnings: z.string().optional(),
  nextSteps: z.string().optional(),
  hoursLogged: z.number().min(0).optional(),
  moodRating: z.number().min(1).max(5).optional(),
})
