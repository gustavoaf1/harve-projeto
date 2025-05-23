import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { obterOpcoes } from "../actions"
import { redirect } from "next/navigation"
import { OpcaoForm } from "@/components/opcao-form"

export default async function EscolherOpcaoPage({ searchParams }) {
  const usuarioId = searchParams.id

  if (!usuarioId) {
    redirect("/")
  }

  const opcoes = await obterOpcoes()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Escolha uma opção</CardTitle>
          <CardDescription className="text-center">Selecione uma das opções abaixo para continuar</CardDescription>
        </CardHeader>
        <CardContent>
          <OpcaoForm usuarioId={usuarioId} opcoes={opcoes} />
        </CardContent>
      </Card>
    </div>
  )
}
