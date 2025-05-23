import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST(request) {
  try {
    // Obter dados da requisição
    const { usuarioId, opcaoId } = await request.json()

    if (!usuarioId || !opcaoId) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 })
    }

    // Verificar se já existe uma escolha para este usuário
    const escolhas = await sql`
      SELECT id FROM usuario_opcao WHERE usuario_id = ${usuarioId}
    `

    if (escolhas.length > 0) {
      // Atualizar escolha existente
      await sql`
        UPDATE usuario_opcao 
        SET opcao_id = ${opcaoId}, data_escolha = CURRENT_TIMESTAMP
        WHERE usuario_id = ${usuarioId}
      `
    } else {
      // Inserir nova escolha
      await sql`
        INSERT INTO usuario_opcao (usuario_id, opcao_id)
        VALUES (${usuarioId}, ${opcaoId})
      `
    }

    return NextResponse.json({
      success: true,
      message: "Opção salva com sucesso",
    })
  } catch (error) {
    console.error("Erro ao salvar opção:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
