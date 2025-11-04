// src/app/api/activities/explored-clusters/route.ts
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const user = await db.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      return new NextResponse('User not found', { status: 404 })
    }

    // Fetch Career Clusters Exploration completion
    const clustersCompletion = await db.activityCompletion.findFirst({
      where: {
        userId: user.id,
        activity: { slug: 'career-clusters' },
        completed: true
      }
    })

    if (!clustersCompletion || !clustersCompletion.data) {
      return NextResponse.json({
        success: true,
        exploredClusters: [],
        interestedClusters: [],
        message: 'Career clusters exploration not completed'
      })
    }

    const data = clustersCompletion.data as any
    
    return NextResponse.json({
      success: true,
      exploredClusters: data.exploredClusters || [],
      interestedClusters: data.interestedClusters || [],
      quizScores: data.quizScores || null
    })
  } catch (error) {
    console.error('[EXPLORED_CLUSTERS_GET]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
