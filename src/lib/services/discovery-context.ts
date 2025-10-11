// src/lib/services/discovery-context.ts
import { db } from '@/lib/db'

/**
 * UserDiscoveryContext Service
 * Provides access to all user discoveries across modules
 * Used for personalization and interconnectivity
 */
export class UserDiscoveryContext {
  /**
   * Get complete user discovery profile
   */
  static async getUserProfile(userId: string) {
    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        activities: {
          where: { completed: true },
          include: { activity: true }
        }
      }
    })

    if (!user) return null

    // Gather all discoveries
    const [topValues, topStrengths, riasecCode, discProfile, personalityType, careerInterests] = await Promise.all([
      this.getTopValues(userId),
      this.getTopStrengths(userId),
      this.getRIASECCode(userId),
      this.getDISCProfile(userId),
      this.getPersonalityType(userId),
      this.getCareerInterests(userId)
    ])

    return {
      userId,
      userName: user.name,
      grade: user.grade,
      
      // Module 1 Discoveries
      topValues,
      topStrengths,
      discProfile,
      personalityType,
      
      // Module 2 Discoveries
      riasecCode,
      careerInterests,
      
      // Metadata
      completedActivities: user.activities.map(a => a.activity.slug),
      overallProgress: user.profile?.overallProgress || 0,
      moduleOneProgress: user.profile?.moduleOneProgress || 0
    }
  }

  /**
   * Get top 5 values from Values Card Sort activity
   */
  static async getTopValues(userId: string): Promise<string[]> {
    const completion = await db.activityCompletion.findFirst({
      where: {
        userId,
        activity: { slug: 'values-card-sort' },
        completed: true
      }
    })

    if (!completion?.data) return []
    
    // Expected structure: { alwaysTrue: ['creativity', 'impact', ...] }
    const data = completion.data as any
    return data.alwaysTrue || []
  }

  /**
   * Get top strengths from Strengths Discovery activity
   */
  static async getTopStrengths(userId: string): Promise<Array<{
    id: string
    name: string
    category: string
    rating: number
  }>> {
    const completion = await db.activityCompletion.findFirst({
      where: {
        userId,
        activity: { slug: 'strengths-discovery' },
        completed: true
      }
    })

    if (!completion?.data) return []

    const data = completion.data as any
    const ratings = data.ratings || {}
    const strengthsMetadata = data.strengthsMetadata || {}

    // Convert ratings to sorted array
    const strengthsList = Object.entries(ratings)
      .map(([id, rating]) => ({
        id,
        rating: rating as number,
        name: strengthsMetadata[id]?.name || id,
        category: strengthsMetadata[id]?.category || 'unknown'
      }))
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 5)

    return strengthsList
  }

  /**
   * Get category scores from Strengths Discovery
   */
  static async getStrengthCategories(userId: string): Promise<Record<string, number>> {
    const completion = await db.activityCompletion.findFirst({
      where: {
        userId,
        activity: { slug: 'strengths-discovery' },
        completed: true
      }
    })

    if (!completion?.data) return {}

    const data = completion.data as any
    return data.categoryScores || {}
  }

  /**
   * Get RIASEC code from assessment (Module 2)
   */
  static async getRIASECCode(userId: string): Promise<string | null> {
    const completion = await db.activityCompletion.findFirst({
      where: {
        userId,
        activity: { slug: 'riasec-assessment' },
        completed: true
      }
    })

    if (!completion?.data) return null
    
    // Expected structure: { code: "ASI", scores: { R: 10, I: 25, A: 30, S: 28, E: 15, C: 12 } }
    const data = completion.data as any
    return data.code || null
  }

  /**
   * Get detailed RIASEC scores
   */
  static async getRIASECScores(userId: string): Promise<Record<string, number> | null> {
    const completion = await db.activityCompletion.findFirst({
      where: {
        userId,
        activity: { slug: 'riasec-assessment' },
        completed: true
      }
    })

    if (!completion?.data) return null
    
    const data = completion.data as any
    return data.scores || null
  }

  /**
   * Get DISC profile from assessment
   */
  static async getDISCProfile(userId: string): Promise<{
    primary: string
    scores: Record<string, number>
  } | null> {
    const completion = await db.activityCompletion.findFirst({
      where: {
        userId,
        activity: { slug: 'disc-assessment' },
        completed: true
      }
    })

    if (!completion?.data) return null
    
    const data = completion.data as any
    return {
      primary: data.primary || null,
      scores: data.scores || {}
    }
  }

  /**
   * Get personality type (TypeFinder/16 Personalities)
   */
  static async getPersonalityType(userId: string): Promise<string | null> {
    const completion = await db.activityCompletion.findFirst({
      where: {
        userId,
        activity: { slug: 'typefinder-assessment' },
        completed: true
      }
    })

    if (!completion?.data) return null
    
    const data = completion.data as any
    return data.type || null
  }

  /**
   * Get career interests from Module 2
   */
  static async getCareerInterests(userId: string): Promise<Array<{
    title: string
    interest: number
    researched: boolean
  }>> {
    const completion = await db.activityCompletion.findFirst({
      where: {
        userId,
        activity: { slug: 'career-deep-research' },
        completed: true
      }
    })

    if (!completion?.data) return []
    
    const data = completion.data as any
    return data.selectedCareers || []
  }

  /**
   * Get reflection responses from Module 1
   */
  static async getReflectionInsights(userId: string): Promise<{
    summary: string
    keyThemes: string[]
  } | null> {
    const completion = await db.activityCompletion.findFirst({
      where: {
        userId,
        activity: { slug: 'integration-reflection' },
        completed: true
      }
    })

    if (!completion?.data) return null
    
    const data = completion.data as any
    return {
      summary: data.aiInsight?.summary || '',
      keyThemes: data.aiInsight?.keyThemes?.map((t: any) => t.theme) || []
    }
  }

  /**
   * Check if user has completed a specific activity
   */
  static async hasCompleted(userId: string, activitySlug: string): Promise<boolean> {
    const completion = await db.activityCompletion.findFirst({
      where: {
        userId,
        activity: { slug: activitySlug },
        completed: true
      }
    })

    return !!completion
  }

  /**
   * Get completion percentage for Module 1 foundational activities
   */
  static async getFoundationalCompleteness(userId: string): Promise<number> {
    const foundationalActivities = [
      'who-am-i',
      'values-card-sort',
      'strengths-discovery',
      'integration-reflection'
    ]

    const completions = await Promise.all(
      foundationalActivities.map(slug => this.hasCompleted(userId, slug))
    )

    const completed = completions.filter(Boolean).length
    return Math.round((completed / foundationalActivities.length) * 100)
  }

  /**
   * Get recommended career clusters based on RIASEC code
   */
  static getRecommendedClusters(riasecCode: string): string[] {
    if (!riasecCode) return []

    // RIASEC to Career Cluster mapping
    const mapping: Record<string, string[]> = {
      'R': ['architecture', 'manufacturing', 'transportation', 'agriculture'],
      'I': ['stem', 'health-science', 'information-technology'],
      'A': ['arts-communications', 'design', 'media'],
      'S': ['education', 'human-services', 'health-science', 'government'],
      'E': ['business', 'marketing', 'hospitality', 'government'],
      'C': ['business', 'finance', 'government', 'information-technology']
    }

    // Get top 3 letters from code
    const letters = riasecCode.split('')
    const recommended = new Set<string>()

    letters.forEach(letter => {
      const clusters = mapping[letter] || []
      clusters.forEach(cluster => recommended.add(cluster))
    })

    return Array.from(recommended).slice(0, 6)
  }

  /**
   * Calculate career match score based on user profile
   */
  static calculateCareerMatchScore(
    career: {
      riasecAlignment: string[]
      requiredValues: string[]
      requiredStrengths: string[]
    },
    userProfile: {
      riasecCode: string | null
      topValues: string[]
      topStrengths: Array<{ id: string }>
    }
  ): number {
    let score = 0

    // RIASEC alignment (40 points)
    if (userProfile.riasecCode) {
      const userLetters = userProfile.riasecCode.split('')
      const matches = career.riasecAlignment.filter(letter => 
        userLetters.includes(letter)
      ).length
      score += (matches / userLetters.length) * 40
    }

    // Values alignment (30 points)
    const valueMatches = career.requiredValues.filter(value =>
      userProfile.topValues.includes(value)
    ).length
    score += (valueMatches / Math.min(career.requiredValues.length, 3)) * 30

    // Strengths alignment (30 points)
    const strengthMatches = career.requiredStrengths.filter(strength =>
      userProfile.topStrengths.some(s => s.id === strength)
    ).length
    score += (strengthMatches / Math.min(career.requiredStrengths.length, 3)) * 30

    return Math.round(score)
  }
}
