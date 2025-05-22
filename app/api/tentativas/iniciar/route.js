import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"

export async function POST(request) {
  try {
    const { nome, email } = await request.json()

    // Validate input
    if (!nome || !nome.trim()) {
      return NextResponse.json({ error: "Nome é obrigatório" }, { status: 400 })
    }

    if (!email || !email.trim()) {
      return NextResponse.json({ error: "Email é obrigatório" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Email inválido" }, { status: 400 })
    }

    const db = await connectToDatabase()

    // Check if user exists
    const [existingUsers] = await db.query("SELECT id_usuario FROM usuarios WHERE email = ?", [email])

    let userId

    if (existingUsers.length > 0) {
      // User exists, get ID
      userId = existingUsers[0].id_usuario
    } else {
      // User doesn't exist, create new user
      const [result] = await db.query("INSERT INTO usuarios (nome, email) VALUES (?, ?)", [nome, email])

      userId = result.insertId
    }

    // Create new attempt
    const currentDate = new Date().toISOString().slice(0, 19).replace("T", " ")

    const [attemptResult] = await db.query("INSERT INTO tentativas (id_usuario, data_inicio) VALUES (?, ?)", [
      userId,
      currentDate,
    ])

    const tentativaId = attemptResult.insertId

    return NextResponse.json({
      id_usuario: userId,
      id_tentativa: tentativaId,
    })
  } catch (error) {
    console.error("Error in /api/tentativas/iniciar:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
