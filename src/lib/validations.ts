import { z } from 'zod'

export const activityCompletionSchema = z.object({
  activityId: z.string(),
  data: z.record(z.any()).optional(),
  timeSpent: z.number().optional(),
})

export const reflectionSchema = z.object({
  prompt: z.string().min(1),
  response: z.string().min(10, "Please write at least 10 characters"),
})

export const valuesSchema = z.object({
  alwaysTrue: z.array(z.string()).min(3, "Select at least 3 values"),
  sometimes: z.array(z.string()),
  notPriority: z.array(z.string()),
})
