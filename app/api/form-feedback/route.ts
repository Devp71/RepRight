import { generateText } from "ai"

export const maxDuration = 30

export async function POST(req: Request) {
  const { exercise, angles, feedback } = await req.json()

  const prompt = `You are a professional fitness coach providing real-time form feedback during ${exercise}.
Current joint angles: ${JSON.stringify(angles)}
Previous feedback: ${feedback}

Provide a SHORT (1-2 sentences) encouraging real-time coaching tip that helps improve form RIGHT NOW during the exercise. Be specific about what to adjust.`

  const { text } = await generateText({
    model: "openai/gpt-4-turbo",
    prompt,
    maxOutputTokens: 100,
    temperature: 0.8,
  })

  return Response.json({ feedback: text })
}
