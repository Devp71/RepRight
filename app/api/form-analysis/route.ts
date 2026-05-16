import { generateText } from "ai"

export const maxDuration = 30

export async function POST(req: Request) {
  const { exerciseName, angles, reps, notes } = await req.json()

  const prompt = `Analyze this workout form data and provide detailed feedback:
- Exercise: ${exerciseName}
- Joint Angles (degrees): ${JSON.stringify(angles)}
- Reps Completed: ${reps}
- Notes: ${notes}

Provide specific corrections, form tips, and form score (0-100).`

  const { text } = await generateText({
    model: "openai/gpt-4-turbo",
    prompt,
    maxOutputTokens: 1500,
    temperature: 0.7,
  })

  return Response.json({ feedback: text })
}
