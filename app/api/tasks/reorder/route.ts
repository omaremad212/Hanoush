import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const reorderSchema = z.object({
  ids: z.array(z.string()).min(1),
})

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { ids } = reorderSchema.parse(body)

    await prisma.$transaction(
      ids.map((id, index) =>
        prisma.task.update({
          where: { id },
          data: { order: index },
        })
      )
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('PATCH /api/tasks/reorder error:', error)
    return NextResponse.json({ error: 'Failed to reorder tasks' }, { status: 500 })
  }
}
