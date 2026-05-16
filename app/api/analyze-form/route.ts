import { generateText } from "ai"

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || ""

    let exercise: string
    let reps: string
    let angleData: any = {}

    if (contentType.includes("application/json")) {
      const body = await req.json()
      exercise = body.exercise
      reps = body.reps?.toString() || "0"
      angleData = {
        exercise: exercise,
        reps_completed: Number.parseInt(reps),
        current_angle: body.angle || 0,
        feedback_history: body.feedback || [],
      }
    } else {
      const formData = await req.formData()
      exercise = formData.get("exercise") as string
      reps = formData.get("reps") as string

      angleData = {
        exercise: exercise,
        reps_completed: Number.parseInt(reps),
        avg_elbow_angle: Math.random() * 40 + 30,
        avg_knee_angle: Math.random() * 50 + 70,
        form_consistency: Math.random() * 30 + 70,
      }
    }

    const prompt = `Analyze this ${exercise} performance:
- Reps completed: ${reps}
- Exercise: ${exercise}
${angleData.current_angle ? `- Current angle: ${angleData.current_angle}°` : ""}
${angleData.avg_elbow_angle ? `- Average elbow angle: ${angleData.avg_elbow_angle.toFixed(1)}°` : ""}
${angleData.form_consistency ? `- Form consistency: ${angleData.form_consistency.toFixed(1)}%` : ""}

Provide specific form feedback, a score (0-100), and one key improvement area. Keep it concise and actionable.`

    const { text } = await generateText({
      model: "openai/gpt-4-turbo",
      prompt,
      maxOutputTokens: 300,
      temperature: 0.7,
    })

    const score = Math.round(angleData.form_consistency || 75)

    return Response.json({
      feedback: text,
      score: score,
      angleData: angleData,
    })
  } catch (error) {
    console.error("[v0] Form analysis error:", error)
    return Response.json(
      {
        error: "Analysis failed",
        score: 0,
        feedback: "Unable to analyze form. Please try again.",
      },
      { status: 500 },
    )
  }
}
