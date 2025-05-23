import { neon } from "@neondatabase/serverless"

// Usando a variável de ambiente DATABASE_URL que foi configurada pela integração do Neon
export const sql = neon(process.env.DATABASE_URL)

// Função para testar a conexão
export async function testConnection() {
  try {
    const result = await sql`SELECT NOW()`
    console.log("Conexão com o banco de dados bem-sucedida:", result)
    return true
  } catch (error) {
    console.error("Erro ao conectar ao banco de dados:", error)
    return false
  }
}
