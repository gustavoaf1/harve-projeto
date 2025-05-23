import { neon } from "@neondatabase/serverless"

console.log("=== CONFIGURANDO CONEXÃO COM BANCO ===")

// Verificar se a variável de ambiente existe
if (!process.env.DATABASE_URL) {
  console.error("ERRO: DATABASE_URL não encontrada nas variáveis de ambiente")
  throw new Error("DATABASE_URL não configurada")
}

console.log("DATABASE_URL encontrada:", process.env.DATABASE_URL.substring(0, 20) + "...")

// Usando a variável de ambiente DATABASE_URL que foi configurada pela integração do Neon
export const sql = neon(process.env.DATABASE_URL)

// Função para testar a conexão
export async function testConnection() {
  try {
    console.log("Testando conexão com banco de dados...")
    const result = await sql`SELECT NOW() as current_time, version() as version`
    console.log("Conexão com o banco de dados bem-sucedida!")
    console.log("Hora atual:", result[0].current_time)
    console.log("Versão do PostgreSQL:", result[0].version.substring(0, 50) + "...")
    return true
  } catch (error) {
    console.error("Erro ao conectar ao banco de dados:")
    console.error("Tipo:", error.constructor.name)
    console.error("Mensagem:", error.message)
    console.error("Stack:", error.stack)
    return false
  }
}

// Testar conexão na inicialização
testConnection()
