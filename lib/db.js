import { neon } from "@neondatabase/serverless"

console.log("=== CONFIGURANDO CONEXÃO COM BANCO ===")

// Verificar se estamos em tempo de build
const isBuildTime = process.env.NODE_ENV === "production" && !process.env.VERCEL_ENV

let sql

if (isBuildTime) {
  console.log("Build time detectado - pulando configuração do banco")
  // Durante o build, criar uma função mock
  sql = () => {
    throw new Error("Banco de dados não disponível durante o build")
  }
} else {
  // Verificar se a variável de ambiente existe
  if (!process.env.DATABASE_URL) {
    console.error("AVISO: DATABASE_URL não encontrada nas variáveis de ambiente")

    // Criar uma função mock que retorna erro em runtime
    sql = () => {
      throw new Error("DATABASE_URL não configurada. Configure a integração com Neon no Vercel.")
    }
  } else {
    console.log("DATABASE_URL encontrada:", process.env.DATABASE_URL.substring(0, 20) + "...")

    // Usando a variável de ambiente DATABASE_URL que foi configurada pela integração do Neon
    sql = neon(process.env.DATABASE_URL)
  }
}

export { sql }

// Função para testar a conexão
export async function testConnection() {
  try {
    if (isBuildTime) {
      console.log("Pulando teste de conexão durante build")
      return false
    }

    if (!process.env.DATABASE_URL) {
      console.log("DATABASE_URL não configurada - pulando teste")
      return false
    }

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
    return false
  }
}

// Só testar conexão se não estivermos em build time
if (!isBuildTime && process.env.DATABASE_URL) {
  testConnection()
}
