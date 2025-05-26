import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FileText, Award, TrendingUp } from "lucide-react"

interface EstatisticasProps {
  totalUsuarios: number
  totalRespostas: number
  mediaNotas: string
  usuariosCompletos: number
}

export function EstatisticasGerais({
  totalUsuarios,
  totalRespostas,
  mediaNotas,
  usuariosCompletos,
}: EstatisticasProps) {
  const estatisticas = [
    {
      titulo: "Total de Usuários",
      valor: totalUsuarios,
      descricao: "Usuários cadastrados",
      icone: Users,
      cor: "text-blue-600",
    },
    {
      titulo: "Respostas",
      valor: totalRespostas,
      descricao: "Respostas enviadas",
      icone: FileText,
      cor: "text-green-600",
    },
    {
      titulo: "Média das Notas",
      valor: mediaNotas,
      descricao: "Nota média geral",
      icone: Award,
      cor: "text-yellow-600",
    },
    {
      titulo: "Completaram",
      valor: usuariosCompletos,
      descricao: "Processo completo",
      icone: TrendingUp,
      cor: "text-purple-600",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {estatisticas.map((stat, index) => {
        const IconeComponente = stat.icone
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.titulo}</CardTitle>
              <IconeComponente className={`h-4 w-4 ${stat.cor}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.valor}</div>
              <p className="text-xs text-muted-foreground">{stat.descricao}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
