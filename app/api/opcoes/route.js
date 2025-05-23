import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Verificar se DATABASE_URL está configurada
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        {
          error: "DATABASE_URL não configurada",
          message: "Configure a integração Neon no Vercel",
        },
        { status: 500 },
      )
    }

    // Importar sql dinamicamente
    const { sql } = await import("@/lib/db")

    const opcoes = await sql`SELECT id, descricao FROM opcoes`
    return NextResponse.json(opcoes)
  } catch (error) {
    console.error("Erro ao obter opções:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
