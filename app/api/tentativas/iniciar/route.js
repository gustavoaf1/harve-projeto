import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST(request) {
  try {
    // Obter dados da requisição
    const { login, nome } = await request.json()

    if (!login || !nome) {
      return NextResponse.json({ error: "Login e nome são obrigatórios" }, { status: 400 })
    }

    // Verificar se o usuário já existe
    const usuarios = await sql`
      SELECT * FROM usuarios WHERE login = ${login}
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

    // Retornar o ID do usuário e outras informações relevantes
    return NextResponse.json({
      success: true,
      userId: usuario.id,
      message: "Tentativa iniciada com sucesso",
    })
  } catch (error) {
    console.error("Erro ao iniciar tentativa:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

// Adicionar suporte para GET para compatibilidade
export async function GET() {
  return NextResponse.json({
    message: "Use o método POST para iniciar uma tentativa",
  })
}
