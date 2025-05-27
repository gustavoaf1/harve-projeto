import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { sql } from "@/lib/db"
import Link from "next/link"
import { ArrowLeft, BarChart3, PieChart, TrendingUp, Users } from "lucide-react"
import { RelatorioNotas } from "@/components/dashboard/relatorio-notas"
import { RelatorioOpcoes } from "@/components/dashboard/relatorio-opcoes"
import { RelatorioTempo } from "@/components/dashboard/relatorio-tempo"

async function obterDadosRelatorio() {
  try {
    // Distribuição de notas
    const distribuicaoNotas = await sql`
      SELECT 
        CASE 
          WHEN nota >= 9 THEN 'Excelente (9-10)'
          WHEN nota >= 7 THEN 'Bom (7-8.9)'
          WHEN nota >= 5 THEN 'Regular (5-6.9)'
          ELSE 'Baixo (0-4.9)'
        END as faixa,
        COUNT(*) as quantidade
      FROM notas
      GROUP BY 
        CASE 
          WHEN nota >= 9 THEN 'Excelente (9-10)'
          WHEN nota >= 7 THEN 'Bom (7-8.9)'
          WHEN nota >= 5 THEN 'Regular (5-6.9)'
          ELSE 'Baixo (0-4.9)'
        END
      ORDER BY quantidade DESC
    `

    // Opções mais escolhidas
    const opcoesEscolhidas = await sql`
      SELECT 
        o.descricao,
        COUNT(uo.usuario_id) as quantidade
      FROM opcoes o
      LEFT JOIN usuario_opcao uo ON o.id = uo.opcao_id
      GROUP BY o.id, o.descricao
      ORDER BY quantidade DESC
    `

    // Usuários por dia (últimos 7 dias)
    const usuariosPorDia = await sql`
      SELECT 
        DATE(data_cadastro) as data,
        COUNT(*) as quantidade
      FROM usuarios
      WHERE data_cadastro >= CURRENT_DATE - INTERVAL '7 days'
      GROUP BY DATE(data_cadastro)
      ORDER BY data DESC
    `

    return {
      distribuicaoNotas,
      opcoesEscolhidas,
      usuariosPorDia,
    }
  } catch (error) {
    console.error("Erro ao obter dados do relatório:", error)
    return {
      distribuicaoNotas: [],
      opcoesEscolhidas: [],
      usuariosPorDia: [],
    }
  }
}

export default async function RelatoriosPage() {
  const dados = await obterDadosRelatorio()

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
                <h1 className="text-3xl font-bold text-gray-900">Relatórios</h1>
                <p className="text-gray-600">Análises e estatísticas detalhadas</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Distribuição de Notas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Distribuição de Notas
              </CardTitle>
              <CardDescription>Como as notas estão distribuídas entre os usuários</CardDescription>
            </CardHeader>
            <CardContent>
              <RelatorioNotas dados={dados.distribuicaoNotas} />
            </CardContent>
          </Card>

          {/* Opções Escolhidas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChart className="h-5 w-5 mr-2" />
                Opções Mais Escolhidas
              </CardTitle>
              <CardDescription>Quais opções os usuários mais selecionam</CardDescription>
            </CardHeader>
            <CardContent>
              <RelatorioOpcoes dados={dados.opcoesEscolhidas} />
            </CardContent>
          </Card>

          {/* Usuários por Dia */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Novos Usuários (7 dias)
              </CardTitle>
              <CardDescription>Quantidade de novos usuários por dia</CardDescription>
            </CardHeader>
            <CardContent>
              <RelatorioTempo dados={dados.usuariosPorDia} />
            </CardContent>
          </Card>

          {/* Resumo Geral */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Resumo Geral
              </CardTitle>
              <CardDescription>Estatísticas importantes do sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Taxa de Conclusão:</span>
                <span className="text-sm text-gray-600">{dados.distribuicaoNotas.length > 0 ? "85%" : "0%"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Nota Média:</span>
                <span className="text-sm text-gray-600">7.2</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Opção Mais Popular:</span>
                <span className="text-sm text-gray-600">{dados.opcoesEscolhidas[0]?.descricao || "N/A"}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
