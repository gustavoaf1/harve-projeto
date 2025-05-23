"use server"

import { sql } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { cache } from "react"

// Cache para evitar consultas repetidas
const cachedOpcoes = cache(async () => {
  try {
    const opcoes = await sql`SELECT id, descricao FROM opcoes`
    return opcoes
  } catch (error) {
    console.error("Erro ao obter opções:", error)
    return []
  }
})

const cachedPerguntas = cache(async () => {
  try {
    const perguntas = await sql`SELECT id, texto, tipo FROM perguntas ORDER BY id`
    return perguntas
  } catch (error) {
    console.error("Erro ao obter perguntas:", error)
    return []
  }
})

// Função para autenticar ou cadastrar usuário
export async function autenticarUsuario(formData) {
  const login = formData.get("login")
  const nome = formData.get("nome")

  if (!login || !nome) {
    return { error: "Login e nome são obrigatórios" }
  }

  try {
    // Verificar se o usuário já existe - usar uma query otimizada
    const usuarios = await sql`
      SELECT id, login, nome FROM usuarios WHERE login = ${login} LIMIT 1
    `

    let usuario

    if (usuarios.length === 0) {
      // Cadastrar novo usuário
      const novoUsuario = await sql`
        INSERT INTO usuarios (login, nome)
        VALUES (${login}, ${nome})
        RETURNING id, login, nome
      `
      usuario = novoUsuario[0]
    } else {
      // Usuário já existe
      usuario = usuarios[0]

      // Atualizar o nome se for diferente
      if (usuario.nome !== nome) {
        await sql`
          UPDATE usuarios SET nome = ${nome}
          WHERE id = ${usuario.id}
        `
        usuario.nome = nome
      }
    }

    // Em vez de redirecionar, retornar o ID do usuário
    revalidatePath("/")
    return { success: true, userId: usuario.id }
  } catch (error) {
    console.error("Erro ao autenticar usuário:", error)
    return { error: "Erro ao processar a solicitação. Tente novamente." }
  }
}

// Função para salvar a opção escolhida - agora com ON CONFLICT funcionando
export async function salvarOpcao(formData) {
  const usuarioId = Number(formData.get("usuarioId"))
  const opcaoId = Number(formData.get("opcaoId"))

  if (!usuarioId || !opcaoId) {
    return { error: "Dados inválidos" }
  }

  try {
    // Agora podemos usar UPSERT com a restrição de unicidade adicionada
    await sql`
      INSERT INTO usuario_opcao (usuario_id, opcao_id)
      VALUES (${usuarioId}, ${opcaoId})
      ON CONFLICT (usuario_id) 
      DO UPDATE SET opcao_id = ${opcaoId}, data_escolha = CURRENT_TIMESTAMP
    `

    // Em vez de redirecionar, retornar o ID do usuário
    revalidatePath("/escolher-opcao")
    return { success: true, userId: usuarioId }
  } catch (error) {
    console.error("Erro ao salvar opção:", error)
    return { error: "Erro ao processar a solicitação" }
  }
}

// Modificar a função salvarRespostas para calcular nota baseada nas respostas
export async function salvarRespostas(formData) {
  const usuarioId = Number(formData.get("usuarioId"))
  const resposta1 = formData.get("resposta1")
  const resposta2 = formData.get("resposta2")

  if (!usuarioId || !resposta1 || !resposta2) {
    return { error: "Todas as respostas são obrigatórias" }
  }

  try {
    // Limpar respostas anteriores do usuário
    await sql`
      DELETE FROM respostas WHERE usuario_id = ${usuarioId}
    `

    // Inserir respostas em batch
    await sql`
      INSERT INTO respostas (usuario_id, pergunta_id, resposta)
      VALUES 
        (${usuarioId}, 1, ${resposta1}),
        (${usuarioId}, 2, ${resposta2})
    `

    // Calcular nota baseada nas respostas
    let nota = 0

    // Pontuação para pergunta de múltipla escolha (pergunta 1)
    if (resposta1.includes("Iniciante")) {
      nota += 2.5
    } else if (resposta1.includes("Intermediário")) {
      nota += 5
    } else if (resposta1.includes("Avançado")) {
      nota += 7.5
    } else if (resposta1.includes("Especialista")) {
      nota += 10
    }

    // Pontuação para pergunta de texto (pergunta 2) - baseada no comprimento da resposta
    const comprimentoResposta2 = resposta2.length
    if (comprimentoResposta2 > 100) {
      nota += 5 // Resposta detalhada
    } else if (comprimentoResposta2 > 50) {
      nota += 3 // Resposta média
    } else {
      nota += 1 // Resposta curta
    }

    // Garantir que a nota não exceda 10
    nota = Math.min(nota, 10)

    // Agora podemos usar UPSERT para a nota também
    await sql`
      INSERT INTO notas (usuario_id, nota)
      VALUES (${usuarioId}, ${nota})
      ON CONFLICT (usuario_id) 
      DO UPDATE SET nota = ${nota}, data_calculo = CURRENT_TIMESTAMP
    `

    // Em vez de redirecionar, retornar o ID do usuário
    revalidatePath("/perguntas")
    return { success: true, userId: usuarioId }
  } catch (error) {
    console.error("Erro ao salvar respostas:", error)
    return { error: "Erro ao processar a solicitação" }
  }
}

// Função para obter as opções disponíveis
export async function obterOpcoes() {
  return cachedOpcoes()
}

// Modificar a função obterPerguntas para incluir o tipo
export async function obterPerguntas() {
  return cachedPerguntas()
}

// Função para obter a nota do usuário
export async function obterNota(usuarioId) {
  try {
    const notas = await sql`
      SELECT n.nota, u.nome
      FROM notas n
      JOIN usuarios u ON n.usuario_id = u.id
      WHERE n.usuario_id = ${usuarioId}
      LIMIT 1
    `

    if (notas.length === 0) {
      return null
    }

    return notas[0]
  } catch (error) {
    console.error("Erro ao obter nota:", error)
    return null
  }
}

// Adicionar função para obter opções de resposta de uma pergunta
export async function obterOpcoesResposta(perguntaId) {
  try {
    const opcoes = await sql`
      SELECT id, texto FROM opcoes_resposta 
      WHERE pergunta_id = ${perguntaId}
      ORDER BY id
    `
    return opcoes
  } catch (error) {
    console.error("Erro ao obter opções de resposta:", error)
    return []
  }
}
