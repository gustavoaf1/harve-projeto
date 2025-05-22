import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"

export async function GET() {
  try {
    const db = await connectToDatabase()

    // Get all questions ordered by 'ordem'
    const [questions] = await db.query(`
      SELECT id_pergunta, descricao
      FROM perguntas
      ORDER BY ordem
    `)

    // For each question, get its answers
    const questionsWithAnswers = await Promise.all(
      questions.map(async (question) => {
        const [answers] = await db.query(
          `
          SELECT id_resposta, texto
          FROM respostas
          WHERE id_pergunta = ?
        `,
          [question.id_pergunta],
        )

        return {
          ...question,
          respostas: answers,
        }
      }),
    )

    return NextResponse.json(questionsWithAnswers)
  } catch (error) {
    console.error("Error in /api/perguntas:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
