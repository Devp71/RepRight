import { generateText } from "ai"

export const maxDuration = 30

export async function POST(req: Request) {
  const { exercise, setNumber, repsTarget, motivation } = await req.json()

  const prompt = `Generate motivational voice coaching guidance for:
- Exercise: ${exercise}
- Current Set: ${setNumber}
- Target Reps: ${repsTarget}
- Tone: ${motivation}

Provide encouraging, real-time coaching cues that can be converted to speech.`

  const { text } = await generateText({
    model: "openai/gpt-4-turbo",
    prompt,
    maxOutputTokens: 500,
    temperature: 0.8,
  })

  return Response.json({ coachingText: text })
}
