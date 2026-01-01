import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

/**
 * GET /api/courses
 * Fetch all published courses with optional filtering and user enrollment data
 */
export async function GET(req: Request) {
  try {
    const { userId } = await auth()
    const { searchParams } = new URL(req.url)

    const category = searchParams.get('category')
    const difficulty = searchParams.get('difficulty')
    const featured = searchParams.get('featured')
    const limit = parseInt(searchParams.get('limit') || '50')

    // Get user if authenticated
    let user = null
    if (userId) {
      user = await db.user.findUnique({
        where: { clerkId: userId },
        select: {
          id: true,
          subscriptionPlan: true,
          courseEnrollments: {
            select: {
              courseId: true,
              progressPercent: true,
              status: true,
            },
          },
        },
      })
    }

    // Build where clause
    const where: any = {
      isPublished: true,
    }

    if (category && category !== 'all') {
      where.category = category.toUpperCase().replace(' ', '_')
    }

    if (difficulty && difficulty !== 'all') {
      where.difficulty = difficulty.toUpperCase()
    }

    if (featured === 'true') {
      where.isFeatured = true
    }

    // Fetch courses
    const courses = await db.course.findMany({
      where,
      take: limit,
      orderBy: [
        { isFeatured: 'desc' },
        { enrollmentCount: 'desc' },
        { averageRating: 'desc' },
      ],
      select: {
        id: true,
        title: true,
        slug: true,
        shortDescription: true,
        thumbnailUrl: true,
        category: true,
        difficulty: true,
        duration: true,
        creditCost: true,
        isPremium: true,
        isFeatured: true,
        enrollmentCount: true,
        averageRating: true,
        totalReviews: true,
        instructorName: true,
        instructorAvatar: true,
        skillsGained: true,
      },
    })

    // Enrich with user enrollment data
    const enrichedCourses = courses.map((course) => {
      const enrollment = user?.courseEnrollments.find(
        (e) => e.courseId === course.id
      )

      return {
        ...course,
        isEnrolled: !!enrollment,
        progressPercent: enrollment?.progressPercent || 0,
        enrollmentStatus: enrollment?.status,
      }
    })

    // Get recommended courses based on user profile
    let recommendedCourses: string[] = []
    if (user) {
      // TODO: Implement smart recommendation logic based on user profile
      // For now, just return some featured courses
      recommendedCourses = enrichedCourses
        .filter((c) => c.isFeatured)
        .map((c) => c.id)
    }

    return NextResponse.json({
      courses: enrichedCourses,
      recommended: recommendedCourses,
      total: enrichedCourses.length,
    })
  } catch (error) {
    console.error('[COURSES_GET]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
