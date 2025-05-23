import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request) {
  try {
    // Obter o ID do usuário da query string
    const { searchParams } = new URL(request.url)
    const usuarioId = searchParams.get("id")

    if (!usuarioId) {
      return NextResponse.json({ error: "ID do usuário é obrigatório" }, { status: 400 })
    }

    // Buscar a nota do usuário
    const notas = await sql`
      SELECT n.nota, u.nome
      FROM notas n
      JOIN usuarios u ON n.usuario_id = u.id
      WHERE n.usuario_id = ${usuarioId}
    `

    if (notas.length === 0) {
      return NextResponse.json({ error: "Nota não encontrada" }, { status: 404 })
    }

    // Formatar a nota para ter apenas 1 casa decimal
    const notaFormatada = Number.parseFloat(notas[0].nota).toFixed(1)

    return NextResponse.json({
      success: true,
      nome: notas[0].nome,
      nota: notaFormatada,
    })
  } catch (error) {
    console.error("Erro ao obter resultado:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
