import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { deductCredits } from '@/lib/credits'

/**
 * POST /api/courses/[slug]/enroll
 * Enroll user in a course
 */
export async function POST(
  req: Request,
  { params }: { params: { slug: string } }
) {
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

    const { slug } = params

    // Find course
    const course = await db.course.findUnique({
      where: { slug },
      include: {
        lessons: true,
      },
    })

    if (!course) {
      return new NextResponse('Course not found', { status: 404 })
    }

    // Check if already enrolled
    const existingEnrollment = await db.courseEnrollment.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: course.id,
        },
      },
    })

    if (existingEnrollment) {
      return NextResponse.json({
        message: 'Already enrolled',
        enrollment: existingEnrollment
      })
    }

    // Check if premium course and user has premium
    if (course.isPremium && user.subscriptionPlan === 'FREE') {
      return new NextResponse('Premium subscription required', { status: 403 })
    }

    // Deduct credits if required
    if (course.creditCost > 0) {
      try {
        await deductCredits(
          user.id,
          course.creditCost,
          `Enrolled in course: ${course.title}`,
          { courseId: course.id }
        )
      } catch (error) {
        return new NextResponse('Insufficient credits', { status: 400 })
      }
    }

    // Create enrollment
    const enrollment = await db.courseEnrollment.create({
      data: {
        userId: user.id,
        courseId: course.id,
        totalLessons: course.lessons.length,
      },
    })

    // Update course enrollment count
    await db.course.update({
      where: { id: course.id },
      data: {
        enrollmentCount: {
          increment: 1,
        },
      },
    })

    return NextResponse.json({
      message: 'Successfully enrolled',
      enrollment,
    })
  } catch (error) {
    console.error('[COURSE_ENROLL]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
