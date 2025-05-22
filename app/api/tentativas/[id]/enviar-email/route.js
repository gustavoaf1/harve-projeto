import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"

export async function GET(request, { params }) {
  try {
    const id = params.id

    if (!id) {
      return NextResponse.json({ error: "ID da tentativa é obrigatório" }, { status: 400 })
    }

    const db = await connectToDatabase()

    // Get attempt data
    const [attempts] = await db.query(
      `
      SELECT t.id_usuario, t.pontuacao, 
             (SELECT COUNT(*) FROM perguntas) as total_perguntas
      FROM tentativas t
      WHERE t.id_tentativa = ?
    `,
      [id],
    )

    if (attempts.length === 0) {
      return NextResponse.json({ error: "Tentativa não encontrada" }, { status: 404 })
    }

    const attempt = attempts[0]

    // Get user email
    const [users] = await db.query(
      `
      SELECT email, nome
      FROM usuarios
      WHERE id_usuario = ?
    `,
      [attempt.id_usuario],
    )

    if (users.length === 0) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })
    }

    const user = users[0]

    // Simulate sending email (log to console)
    console.log(`Enviando email para: ${user.email}`)
    console.log(`Assunto: Resultado da sua avaliação`)
    console.log(`Conteúdo: Olá ${user.nome}, sua pontuação foi: ${attempt.pontuacao}/${attempt.total_perguntas}`)

    return NextResponse.json({
      message: "Email simulado enviado com sucesso",
    })
  } catch (error) {
    console.error("Error in /api/tentativas/[id]/enviar-email:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
