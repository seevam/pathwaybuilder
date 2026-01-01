import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

/**
 * GET /api/credits/balance
 * Fetch current credit balance for the authenticated user
 */
export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const user = await db.user.findUnique({
      where: { clerkId: userId },
      select: {
        credits: true,
        subscriptionPlan: true,
      },
    })

    if (!user) {
      return new NextResponse('User not found', { status: 404 })
    }

    return NextResponse.json({
      credits: user.credits,
      plan: user.subscriptionPlan,
    })
  } catch (error) {
    console.error('[CREDITS_BALANCE_GET]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
