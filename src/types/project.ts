// src/types/project.ts
import { Project, Milestone, Task, ProjectCheckIn, ProjectDocument } from '@prisma/client'

export type ProjectWithRelations = Project & {
  milestones: Milestone[]
  tasks: Task[]
  checkIns: ProjectCheckIn[]
  documents: ProjectDocument[]
  _count?: {
    milestones: number
    tasks: number
    checkIns: number
    documents: number
  }
}

export type ProjectIdea = {
  id: string
  title: string
  description: string
  category: string
  feasibilityScore: number
  timeEstimate: string
  uniqueness: 'HIGH' | 'MEDIUM' | 'LOW'
  impactMetrics?: string[]
}

export type BrainstormInput = {
  interests: string
  problemArea: string
  timeCommitment: '2-3' | '4-6' | '7-10' | '10+'
  projectTypes: string[]
}

export type MilestoneInput = {
  title: string
  description?: string
  targetDate?: Date
  orderIndex: number
}

export type TaskInput = {
  title: string
  description?: string
  estimatedHours?: number
}

export type CheckInInput = {
  accomplishments: string
  challenges?: string
  learnings?: string
  nextSteps?: string
  hoursLogged?: number
  moodRating?: number
}
