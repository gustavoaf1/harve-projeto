import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    const perguntas = await sql`SELECT id, texto, tipo FROM perguntas ORDER BY id`

    // Para cada pergunta de múltipla escolha, buscar as opções
    const perguntasCompletas = await Promise.all(
      perguntas.map(async (pergunta) => {
        if (pergunta.tipo === "multipla_escolha") {
          const opcoes = await sql`
            SELECT id, texto FROM opcoes_resposta 
            WHERE pergunta_id = ${pergunta.id}
            ORDER BY id
          `
          return { ...pergunta, opcoes }
        }
        return { ...pergunta, opcoes: [] }
      }),
    )

    return NextResponse.json(perguntasCompletas)
  } catch (error) {
    console.error("Erro ao obter perguntas:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
