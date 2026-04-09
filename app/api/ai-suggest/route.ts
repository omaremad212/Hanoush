import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { z } from 'zod'

const schema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional().nullable(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { title, description } = schema.parse(body)

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'ANTHROPIC_API_KEY is not configured' },
        { status: 503 }
      )
    }

    const client = new Anthropic({ apiKey })

    const prompt = `You are a helpful productivity assistant. Break down the following task into 4-6 clear, actionable subtasks or steps. Return ONLY a JSON array of strings, no other text.

Task: "${title}"${description ? `\nDetails: "${description}"` : ''}

Return format: ["step 1", "step 2", "step 3", ...]`

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 512,
      messages: [{ role: 'user', content: prompt }],
    })

    const content = message.content[0]
    if (content.type !== 'text') {
      throw new Error('Unexpected response type')
    }

    // Parse the JSON array from the response
    const text = content.text.trim()
    const jsonMatch = text.match(/\[[\s\S]*\]/)
    if (!jsonMatch) {
      throw new Error('Could not parse suggestions')
    }

    const suggestions: string[] = JSON.parse(jsonMatch[0])

    return NextResponse.json({ suggestions })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('POST /api/ai-suggest error:', error)
    return NextResponse.json(
      { error: 'Failed to generate suggestions' },
      { status: 500 }
    )
  }
}
