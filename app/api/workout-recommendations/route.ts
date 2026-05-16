import { generateText } from "ai"

export const maxDuration = 30

export async function POST(req: Request) {
  const { userGoals, fitnessLevel, exercises } = await req.json()

  const prompt = `Create a personalized workout recommendation for someone with these characteristics:
- Goals: ${userGoals}
- Fitness Level: ${fitnessLevel}
- Interested in: ${exercises}

Provide a detailed workout plan with exercises, sets, reps, and tips for proper form.`

  const { text } = await generateText({
    model: "openai/gpt-4-turbo",
    prompt,
    maxOutputTokens: 2000,
    temperature: 0.7,
  })

  return Response.json({ recommendation: text })
}
