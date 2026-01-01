import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

/**
 * GET /api/courses/[slug]
 * Fetch a single course by slug with detailed information
 */
export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { userId } = await auth()
    const { slug } = params

    // Get user if authenticated
    let user = null
    if (userId) {
      user = await db.user.findUnique({
        where: { clerkId: userId },
      })
    }

    // Fetch course
    const course = await db.course.findUnique({
      where: { slug },
      include: {
        lessons: {
          orderBy: { orderIndex: 'asc' },
        },
        reviews: {
          where: { isPublished: true },
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: {
            user: {
              select: {
                name: true,
                avatar: true,
              },
            },
          },
        },
      },
    })

    if (!course) {
      return new NextResponse('Course not found', { status: 404 })
    }

    // Check if user is enrolled
    let enrollment = null
    let progress: any[] = []

    if (user) {
      enrollment = await db.courseEnrollment.findUnique({
        where: {
          userId_courseId: {
            userId: user.id,
            courseId: course.id,
          },
        },
      })

      if (enrollment) {
        progress = await db.courseProgress.findMany({
          where: {
            userId: user.id,
            courseId: course.id,
          },
        })
      }
    }

    return NextResponse.json({
      course,
      enrollment,
      progress,
      canEnroll: !course.isPremium || user?.subscriptionPlan !== 'FREE',
    })
  } catch (error) {
    console.error('[COURSE_GET]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
