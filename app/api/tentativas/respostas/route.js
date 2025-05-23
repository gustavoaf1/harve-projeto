import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST(request) {
  try {
    // Obter dados da requisição
    const { usuarioId, respostas } = await request.json()

    if (!usuarioId || !respostas || !Array.isArray(respostas)) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 })
    }

    // Limpar respostas anteriores do usuário
    await sql`
      DELETE FROM respostas WHERE usuario_id = ${usuarioId}
    `

    // Salvar cada resposta
    for (const resposta of respostas) {
      await sql`
        INSERT INTO respostas (usuario_id, pergunta_id, resposta)
        VALUES (${usuarioId}, ${resposta.perguntaId}, ${resposta.texto})
      `
    }

    // Calcular nota baseada nas respostas
    let nota = 0
    const pontosPorResposta = 10 / respostas.length

    // Pontuação simples - cada resposta vale pontos iguais
    // Em um sistema real, você pode implementar uma lógica mais complexa
    for (const resposta of respostas) {
      if (resposta.texto && resposta.texto.length > 0) {
        // Se a resposta for de múltipla escolha, dar pontuação baseada na escolha
        if (resposta.tipo === "multipla_escolha") {
          if (resposta.texto.includes("Especialista")) {
            nota += pontosPorResposta
          } else if (resposta.texto.includes("Avançado")) {
            nota += pontosPorResposta * 0.75
          } else if (resposta.texto.includes("Intermediário")) {
            nota += pontosPorResposta * 0.5
          } else {
            nota += pontosPorResposta * 0.25
          }
        }
        // Se for resposta de texto, dar pontuação baseada no comprimento
        else {
          const comprimento = resposta.texto.length
          if (comprimento > 100) {
            nota += pontosPorResposta
          } else if (comprimento > 50) {
            nota += pontosPorResposta * 0.7
          } else {
            nota += pontosPorResposta * 0.4
          }
        }
      }
    }

    // Garantir que a nota não exceda 10
    nota = Math.min(nota, 10)

    // Verificar se já existe uma nota para este usuário
    const notas = await sql`
      SELECT id FROM notas WHERE usuario_id = ${usuarioId}
    `

    if (notas.length > 0) {
      // Atualizar nota existente
      await sql`
        UPDATE notas 
        SET nota = ${nota}, data_calculo = CURRENT_TIMESTAMP
        WHERE usuario_id = ${usuarioId}
      `
    } else {
      // Inserir nova nota
      await sql`
        INSERT INTO notas (usuario_id, nota)
        VALUES (${usuarioId}, ${nota})
      `
    }

    return NextResponse.json({
      success: true,
      nota: nota.toFixed(1),
      message: "Respostas salvas com sucesso",
    })
  } catch (error) {
    console.error("Erro ao salvar respostas:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
