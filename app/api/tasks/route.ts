import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { isToday, isPast, parseISO } from 'date-fns'

const createSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  dueDate: z.string().optional().nullable(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).default('MEDIUM'),
})

export async function GET() {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    })

    // Compute stats
    const now = new Date()
    const total = tasks.length
    const completedToday = tasks.filter(
      (t) => t.completed && t.updatedAt && isToday(t.updatedAt)
    ).length
    const pending = tasks.filter((t) => !t.completed).length
    const overdue = tasks.filter(
      (t) => !t.completed && t.dueDate && isPast(t.dueDate) && !isToday(t.dueDate)
    ).length

    return NextResponse.json({
      tasks: tasks.map((t) => ({
        ...t,
        dueDate: t.dueDate?.toISOString() ?? null,
        createdAt: t.createdAt.toISOString(),
        updatedAt: t.updatedAt.toISOString(),
      })),
      stats: { total, completedToday, pending, overdue },
    })
  } catch (error) {
    console.error('GET /api/tasks error:', error)
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = createSchema.parse(body)

    // Get max order
    const maxOrder = await prisma.task.aggregate({ _max: { order: true } })
    const order = (maxOrder._max.order ?? 0) + 1

    const task = await prisma.task.create({
      data: {
        title: data.title,
        description: data.description ?? null,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        priority: data.priority,
        order,
      },
    })

    return NextResponse.json({
      ...task,
      dueDate: task.dueDate?.toISOString() ?? null,
      createdAt: task.createdAt.toISOString(),
      updatedAt: task.updatedAt.toISOString(),
    }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('POST /api/tasks error:', error)
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 })
  }
}
