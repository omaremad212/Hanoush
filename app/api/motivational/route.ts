import { NextResponse } from 'next/server'
import Groq from 'groq-sdk'

export async function GET() {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'GROQ_API_KEY not configured' }, { status: 503 })
  }

  const client = new Groq({ apiKey })

  const completion = await client.chat.completions.create({
    model: 'llama-3.1-8b-instant',
    max_tokens: 60,
    temperature: 1.2,
    messages: [
      {
        role: 'system',
        content:
          'You are a warm, encouraging assistant for a female Arabic content creator. ' +
          'Generate one short motivational message. Mix Arabic and English naturally. ' +
          'Add one relevant emoji at the end. Maximum 15 words total. ' +
          'Be personal, warm, and cute. Return ONLY the message, nothing else.',
      },
      {
        role: 'user',
        content: 'Give me a fresh motivational message.',
      },
    ],
  })

  const message = completion.choices[0]?.message?.content?.trim() ?? '✨ You are doing amazing!'

  return NextResponse.json({ message })
}
