import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { sql } from "@/lib/db"
import Link from "next/link"
import { ArrowLeft, Download } from "lucide-react"
import { TabelaUsuarios } from "@/components/dashboard/tabela-usuarios"

async function obterUsuarios() {
  try {
    const usuarios = await sql`
      SELECT 
        u.id,
        u.login,
        u.nome,
        u.data_cadastro,
        o.descricao as opcao_escolhida,
        n.nota,
        n.data_calculo,
        CASE 
          WHEN n.nota IS NOT NULL THEN 'Completo'
          WHEN uo.opcao_id IS NOT NULL THEN 'Em andamento'
          ELSE 'Iniciado'
        END as status
      FROM usuarios u
      LEFT JOIN usuario_opcao uo ON u.id = uo.usuario_id
      LEFT JOIN opcoes o ON uo.opcao_id = o.id
      LEFT JOIN notas n ON u.id = n.usuario_id
      ORDER BY u.data_cadastro DESC
    `

    return usuarios
  } catch (error) {
    console.error("Erro ao obter usuários:", error)
    return []
  }
}

export default async function UsuariosPage() {
  const usuarios = await obterUsuarios()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Usuários</h1>
                <p className="text-gray-600">Gerenciar todos os usuários do sistema</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Exportar CSV
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Lista de Usuários ({usuarios.length})</CardTitle>
            <CardDescription>Visualize todos os usuários cadastrados e seus status no sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <TabelaUsuarios usuarios={usuarios} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
