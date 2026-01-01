import { db } from '@/lib/db'
import { CreditTransactionType, SubscriptionPlan } from '@prisma/client'

/**
 * Credit reward amounts for different activities
 */
export const CREDIT_REWARDS = {
  ACTIVITY_COMPLETION: 5,
  MODULE_COMPLETION: 25,
  PROJECT_MILESTONE: 10,
  SUBSCRIPTION_MONTHLY: 500,
  SUBSCRIPTION_ANNUAL: 6000,
} as const

/**
 * Multiplier for premium users
 */
export const PREMIUM_MULTIPLIER = 2

/**
 * Add credits to a user's account
 */
export async function addCredits(
  userId: string,
  amount: number,
  type: CreditTransactionType,
  description?: string,
  metadata?: any
) {
  // Get current user and check if they're premium
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { credits: true, subscriptionPlan: true },
  })

  if (!user) {
    throw new Error('User not found')
  }

  // Apply premium multiplier for certain transaction types
  let finalAmount = amount
  if (
    (user.subscriptionPlan === SubscriptionPlan.PREMIUM_MONTHLY ||
      user.subscriptionPlan === SubscriptionPlan.PREMIUM_ANNUAL) &&
    (type === 'ACTIVITY_COMPLETION' ||
      type === 'MODULE_COMPLETION' ||
      type === 'PROJECT_MILESTONE')
  ) {
    finalAmount = amount * PREMIUM_MULTIPLIER
  }

  const newBalance = user.credits + finalAmount

  // Update user credits and create transaction in a single transaction
  const [updatedUser, transaction] = await db.$transaction([
    db.user.update({
      where: { id: userId },
      data: { credits: newBalance },
    }),
    db.creditTransaction.create({
      data: {
        userId,
        type,
        amount: finalAmount,
        balance: newBalance,
        description,
        metadata,
      },
    }),
  ])

  return { user: updatedUser, transaction }
}

/**
 * Deduct credits from a user's account
 */
export async function deductCredits(
  userId: string,
  amount: number,
  description?: string,
  metadata?: any
) {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { credits: true },
  })

  if (!user) {
    throw new Error('User not found')
  }

  if (user.credits < amount) {
    throw new Error('Insufficient credits')
  }

  const newBalance = user.credits - amount

  // Update user credits and create transaction
  const [updatedUser, transaction] = await db.$transaction([
    db.user.update({
      where: { id: userId },
      data: { credits: newBalance },
    }),
    db.creditTransaction.create({
      data: {
        userId,
        type: 'USAGE',
        amount: -amount,
        balance: newBalance,
        description,
        metadata,
      },
    }),
  ])

  return { user: updatedUser, transaction }
}

/**
 * Check if user has enough credits
 */
export async function hasEnoughCredits(
  userId: string,
  amount: number
): Promise<boolean> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { credits: true },
  })

  if (!user) {
    return false
  }

  return user.credits >= amount
}

/**
 * Get user's current credit balance
 */
export async function getCreditBalance(userId: string): Promise<number> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { credits: true },
  })

  return user?.credits ?? 0
}
