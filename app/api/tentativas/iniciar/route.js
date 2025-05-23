import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST(request) {
  console.log("=== INICIANDO API /api/tentativas/iniciar ===")

  try {
    // Log da requisição
    console.log("Método:", request.method)
    console.log("URL:", request.url)

    // Verificar se a conexão com o banco está funcionando
    console.log("Testando conexão com banco de dados...")

    try {
      const testConnection = await sql`SELECT 1 as test`
      console.log("Conexão com banco OK:", testConnection)
    } catch (dbError) {
      console.error("Erro na conexão com banco:", dbError)
      return NextResponse.json(
        {
          error: "Erro de conexão com banco de dados",
          details: dbError.message,
        },
        { status: 500 },
      )
    }

    // Obter dados da requisição
    let requestData
    try {
      requestData = await request.json()
      console.log("Dados recebidos:", requestData)
    } catch (parseError) {
      console.error("Erro ao fazer parse do JSON:", parseError)
      return NextResponse.json(
        {
          error: "Dados inválidos - JSON malformado",
          details: parseError.message,
        },
        { status: 400 },
      )
    }

    const { login, nome } = requestData

    if (!login || !nome) {
      console.log("Dados faltando - login:", login, "nome:", nome)
      return NextResponse.json(
        {
          error: "Login e nome são obrigatórios",
        },
        { status: 400 },
      )
    }

    console.log("Verificando se usuário existe...")

    // Verificar se o usuário já existe
    const usuarios = await sql`
      SELECT * FROM usuarios WHERE login = ${login}
    `

    console.log("Usuários encontrados:", usuarios.length)

    let usuario

    if (usuarios.length === 0) {
      console.log("Criando novo usuário...")
      // Cadastrar novo usuário
      const novoUsuario = await sql`
        INSERT INTO usuarios (login, nome)
        VALUES (${login}, ${nome})
        RETURNING id, login, nome
      `
      usuario = novoUsuario[0]
      console.log("Novo usuário criado:", usuario)
    } else {
      console.log("Usuário existente encontrado")
      // Usuário já existe
      usuario = usuarios[0]

      // Atualizar o nome se for diferente
      if (usuario.nome !== nome) {
        console.log("Atualizando nome do usuário...")
        await sql`
          UPDATE usuarios SET nome = ${nome}
          WHERE id = ${usuario.id}
        `
        usuario.nome = nome
      }
    }

    const response = {
      success: true,
      userId: usuario.id,
      message: "Tentativa iniciada com sucesso",
    }

    console.log("Resposta enviada:", response)
    return NextResponse.json(response)
  } catch (error) {
    console.error("=== ERRO GERAL ===")
    console.error("Tipo do erro:", error.constructor.name)
    console.error("Mensagem:", error.message)
    console.error("Stack:", error.stack)

    return NextResponse.json(
      {
        error: "Erro interno do servidor",
        details: error.message,
        type: error.constructor.name,
      },
      { status: 500 },
    )
  }
}

// Adicionar suporte para GET para teste
export async function GET() {
  console.log("=== TESTE GET /api/tentativas/iniciar ===")

  try {
    // Testar conexão com banco
    const testConnection = await sql`SELECT NOW() as current_time`
    console.log("Teste de conexão:", testConnection)

    // Testar se as tabelas existem
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `
    console.log("Tabelas disponíveis:", tables)

    return NextResponse.json({
      message: "API funcionando",
      database: "Conectado",
      tables: tables.map((t) => t.table_name),
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Erro no teste GET:", error)
    return NextResponse.json(
      {
        error: "Erro no teste",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
