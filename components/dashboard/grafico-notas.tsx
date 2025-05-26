import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { sql } from "@/lib/db"

async function obterDistribuicaoNotas() {
  try {
    const notas = await sql`
      SELECT 
        CASE 
          WHEN nota >= 9 THEN 'Excelente'
          WHEN nota >= 7 THEN 'Bom'
          WHEN nota >= 5 THEN 'Regular'
          ELSE 'Baixo'
        END as categoria,
        COUNT(*) as quantidade
      FROM notas
      GROUP BY 
        CASE 
          WHEN nota >= 9 THEN 'Excelente'
          WHEN nota >= 7 THEN 'Bom'
          WHEN nota >= 5 THEN 'Regular'
          ELSE 'Baixo'
        END
      ORDER BY quantidade DESC
    `
    return notas
  } catch (error) {
    console.error("Erro ao obter distribuição de notas:", error)
    return []
  }
}

export async function GraficoNotas() {
  const distribuicao = await obterDistribuicaoNotas()
  const total = distribuicao.reduce((acc, item) => acc + Number(item.quantidade), 0)

  const cores = {
    Excelente: "bg-green-500",
    Bom: "bg-blue-500",
    Regular: "bg-yellow-500",
    Baixo: "bg-red-500",
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribuição de Notas</CardTitle>
        <CardDescription>Como as notas estão distribuídas entre os usuários</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {distribuicao.map((item, index) => {
            const porcentagem = total > 0 ? ((Number(item.quantidade) / total) * 100).toFixed(1) : 0
            return (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${cores[item.categoria as keyof typeof cores]}`}></div>
                  <span className="text-sm font-medium">{item.categoria}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">{item.quantidade}</span>
                  <span className="text-xs text-gray-500">({porcentagem}%)</span>
                </div>
              </div>
            )
          })}
          {distribuicao.length === 0 && <p className="text-center text-gray-500 py-4">Nenhuma nota encontrada</p>}
        </div>
      </CardContent>
    </Card>
  )
}
