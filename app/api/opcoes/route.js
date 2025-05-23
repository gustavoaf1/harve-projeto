import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    const opcoes = await sql`SELECT id, descricao FROM opcoes`
    return NextResponse.json(opcoes)
  } catch (error) {
    console.error("Erro ao obter opções:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
