import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { obterPerguntas, obterOpcoesResposta } from "../actions"
import { redirect } from "next/navigation"
import { PerguntasForm } from "@/components/perguntas-form"

export default async function PerguntasPage({ searchParams }) {
  const usuarioId = searchParams.id

  if (!usuarioId) {
    redirect("/")
  }

  const perguntas = await obterPerguntas()

  if (perguntas.length < 2) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <p className="text-center">Não há perguntas disponíveis no momento.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Buscar opções para perguntas de múltipla escolha
  const perguntasComOpcoes = await Promise.all(
    perguntas.map(async (pergunta) => {
      if (pergunta.tipo === "multipla_escolha") {
        const opcoes = await obterOpcoesResposta(pergunta.id)
        return { ...pergunta, opcoes }
      }
      return { ...pergunta, opcoes: [] }
    }),
  )

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Responda às perguntas</CardTitle>
          <CardDescription className="text-center">Por favor, responda às duas perguntas abaixo</CardDescription>
        </CardHeader>
        <CardContent>
          <PerguntasForm usuarioId={usuarioId} perguntas={perguntasComOpcoes} />
        </CardContent>
      </Card>
    </div>
  )
}
