import { generateText } from "ai"

export const maxDuration = 30

export async function POST(req: Request) {
  const { progressData, workoutHistory } = await req.json()

  const prompt = `Generate AI insights based on this fitness progress data:
- Progress Data: ${JSON.stringify(progressData)}
- Workout History: ${JSON.stringify(workoutHistory)}

Provide:
1. Overall progress assessment
2. Areas of improvement
3. Recommendations for next steps
4. Motivation and encouragement`

  const { text } = await generateText({
    model: "openai/gpt-4-turbo",
    prompt,
    maxOutputTokens: 1500,
    temperature: 0.7,
  })

  return Response.json({ insights: text })
}
