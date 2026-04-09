import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const reorderSchema = z.object({
  ids: z.array(z.string()).min(1),
})

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { ids } = reorderSchema.parse(body)

    // Verify all tasks belong to this user
    const owned = await prisma.task.count({
      where: { id: { in: ids }, userId: session.user.id },
    })
    if (owned !== ids.length) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await prisma.$transaction(
      ids.map((id, index) =>
        prisma.task.update({ where: { id }, data: { order: index } })
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
