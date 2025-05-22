import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"

export async function POST(request) {
  try {
    const { id_tentativa, ids_respostas } = await request.json()

    // Validate input
    if (!id_tentativa) {
      return NextResponse.json({ error: "ID da tentativa é obrigatório" }, { status: 400 })
    }

    if (!ids_respostas || !Array.isArray(ids_respostas) || ids_respostas.length === 0) {
      return NextResponse.json({ error: "Respostas são obrigatórias" }, { status: 400 })
    }

    const db = await connectToDatabase()

    // Get total number of questions
    const [questions] = await db.query("SELECT COUNT(*) as total FROM perguntas")
    const totalQuestions = questions[0].total

    // Validate if all questions were answered
    if (ids_respostas.length !== totalQuestions) {
      return NextResponse.json(
        {
          error: `É necessário responder todas as ${totalQuestions} perguntas`,
        },
        { status: 400 },
      )
    }

    // Insert responses into tentativas_respostas
    for (const id_resposta of ids_respostas) {
      await db.query("INSERT INTO tentativas_respostas (id_tentativa, id_resposta) VALUES (?, ?)", [
        id_tentativa,
        id_resposta,
      ])
    }

    // Calculate score based on correct answers
    const [correctAnswers] = await db.query(
      `
      SELECT COUNT(*) as correct
      FROM tentativas_respostas tr
      JOIN respostas r ON tr.id_resposta = r.id_resposta
      WHERE tr.id_tentativa = ? AND r.verdadeira = TRUE
    `,
      [id_tentativa],
    )

    const score = correctAnswers[0].correct

    // Update attempt with end date and score
    const currentDate = new Date().toISOString().slice(0, 19).replace("T", " ")

    await db.query("UPDATE tentativas SET data_fim = ?, pontuacao = ? WHERE id_tentativa = ?", [
      currentDate,
      score,
      id_tentativa,
    ])

    return NextResponse.json({
      pontuacao: `${score}/${totalQuestions}`,
    })
  } catch (error) {
    console.error("Error in /api/tentativas/finalizar:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
