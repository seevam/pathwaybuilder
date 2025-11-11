import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getModuleDeliverableByModuleId } from '@/lib/config/module-deliverables'

/**
 * POST /api/deliverables/upload
 * Upload a module deliverable
 *
 * TODO: Integrate with cloud storage (Cloudflare R2, AWS S3, etc.)
 * For now, stores file metadata with a placeholder URL
 */
export async function POST(req: Request) {
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

    const formData = await req.formData()
    const file = formData.get('file') as File
    const moduleId = formData.get('moduleId') as string

    if (!file || !moduleId) {
      return new NextResponse('Missing file or moduleId', { status: 400 })
    }

    // Verify module exists
    const moduleData = await db.module.findFirst({
      where: { id: moduleId },
    })

    if (!moduleData) {
      return new NextResponse('Module not found', { status: 404 })
    }

    // Get deliverable config
    const deliverableConfig = getModuleDeliverableByModuleId(moduleId)
    if (!deliverableConfig) {
      return new NextResponse('No deliverable configured for this module', { status: 400 })
    }

    // TODO: Upload file to cloud storage
    // For now, we'll create a placeholder. In production, you'd upload to S3/R2/etc.
    // const uploadResult = await UploadService.uploadFile(file)

    // Placeholder implementation - store file info
    // In production, replace this with actual file URL from cloud storage
    const fileUrl = `https://storage.pathwaybuilder.com/deliverables/${user.id}/${moduleId}/${file.name}`

    // Save deliverable record
    const deliverable = await db.moduleDeliverable.upsert({
      where: {
        userId_moduleId: {
          userId: user.id,
          moduleId: moduleId,
        },
      },
      update: {
        title: deliverableConfig.title,
        fileUrl,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        updatedAt: new Date(),
      },
      create: {
        userId: user.id,
        moduleId: moduleId,
        title: deliverableConfig.title,
        fileUrl,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
      },
    })

    return NextResponse.json({
      success: true,
      deliverable,
      message: 'Deliverable uploaded successfully',
    })
  } catch (error) {
    console.error('[DELIVERABLE_UPLOAD]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

/**
 * GET /api/deliverables/upload?moduleId=xxx
 * Get user's deliverable for a specific module
 */
export async function GET(req: Request) {
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

    const { searchParams } = new URL(req.url)
    const moduleId = searchParams.get('moduleId')

    if (!moduleId) {
      // Get all deliverables for user
      const deliverables = await db.moduleDeliverable.findMany({
        where: { userId: user.id },
        orderBy: { submittedAt: 'desc' },
      })

      return NextResponse.json({ deliverables })
    }

    // Get specific deliverable
    const deliverable = await db.moduleDeliverable.findUnique({
      where: {
        userId_moduleId: {
          userId: user.id,
          moduleId,
        },
      },
    })

    return NextResponse.json({ deliverable })
  } catch (error) {
    console.error('[DELIVERABLE_GET]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
