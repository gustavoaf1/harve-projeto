import { neon } from "@neondatabase/serverless"

// Verificar se estamos em tempo de build
const isBuildTime = process.env.NODE_ENV === "production" && !process.env.VERCEL_ENV

// Criar uma única instância de conexão para reutilização
let sqlInstance = null

function getSqlInstance() {
  if (!sqlInstance && process.env.DATABASE_URL && !isBuildTime) {
    // Configurar com opções otimizadas
    sqlInstance = neon(process.env.DATABASE_URL, {
      // Configurações para melhorar a performance
      fetchOptions: {
        cache: "no-store", // Não armazenar em cache as requisições HTTP
        keepalive: true, // Manter a conexão HTTP viva
      },
    })
  }
  return sqlInstance
}

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
    // Usar a instância singleton
    sql = getSqlInstance()
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
    const result = await sql`SELECT NOW() as current_time`
    console.log("Conexão com o banco de dados bem-sucedida!")
    return true
  } catch (error) {
    console.error("Erro ao conectar ao banco de dados:", error.message)
    return false
  }
}

// Só testar conexão se não estivermos em build time
if (!isBuildTime && process.env.DATABASE_URL) {
  testConnection()
}
