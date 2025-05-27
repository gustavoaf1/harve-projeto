import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { sql } from "@/lib/db"
import Link from "next/link"
import { Users, FileText, Award, TrendingUp } from "lucide-react"
import { GraficoNotas } from "@/components/dashboard/grafico-notas"
import { UltimosUsuarios } from "@/components/dashboard/ultimos-usuarios"

async function obterEstatisticas() {
  try {
    // Total de usuários
    const totalUsuarios = await sql`SELECT COUNT(*) as total FROM usuarios`

    // Total de respostas
    const totalRespostas = await sql`SELECT COUNT(*) as total FROM respostas`

    // Média das notas
    const mediaNotas = await sql`SELECT AVG(nota) as media FROM notas`

    // Usuários que completaram o processo
    const usuariosCompletos = await sql`
      SELECT COUNT(DISTINCT u.id) as total 
      FROM usuarios u 
      INNER JOIN notas n ON u.id = n.usuario_id
    `

    return {
      totalUsuarios: totalUsuarios[0]?.total || 0,
      totalRespostas: totalRespostas[0]?.total || 0,
      mediaNotas: Number(mediaNotas[0]?.media || 0).toFixed(1),
      usuariosCompletos: usuariosCompletos[0]?.total || 0,
    }
  } catch (error) {
    console.error("Erro ao obter estatísticas:", error)
    return {
      totalUsuarios: 0,
      totalRespostas: 0,
      mediaNotas: "0.0",
      usuariosCompletos: 0,
    }
  }
}

export default async function DashboardPage() {
  const stats = await obterEstatisticas()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Sistema de Avaliação - Painel Administrativo</p>
            </div>
            <div className="flex space-x-3">
              <Link href="/dashboard/usuarios">
                <Button variant="outline">Ver Usuários</Button>
              </Link>
              <Link href="/dashboard/relatorios">
                <Button>Relatórios</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Estatísticas Gerais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsuarios}</div>
              <p className="text-xs text-muted-foreground">Usuários cadastrados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Respostas</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalRespostas}</div>
              <p className="text-xs text-muted-foreground">Respostas enviadas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Média das Notas</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.mediaNotas}</div>
              <p className="text-xs text-muted-foreground">Nota média geral</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completaram</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.usuariosCompletos}</div>
              <p className="text-xs text-muted-foreground">Processo completo</p>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos e Tabelas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <GraficoNotas />
          <UltimosUsuarios />
        </div>

        {/* Links Rápidos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciar Usuários</CardTitle>
              <CardDescription>Visualizar e gerenciar todos os usuários do sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/usuarios">
                <Button className="w-full">Ver Usuários</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Relatórios</CardTitle>
              <CardDescription>Gerar relatórios detalhados e exportar dados</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/relatorios">
                <Button className="w-full">Ver Relatórios</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Configurações</CardTitle>
              <CardDescription>Configurar perguntas, opções e sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/configuracoes">
                <Button className="w-full">Configurações</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
