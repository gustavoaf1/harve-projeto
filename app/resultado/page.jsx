import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { obterNota } from "../actions"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function ResultadoPage({ searchParams }) {
  const usuarioId = searchParams.id

  if (!usuarioId) {
    redirect("/")
  }

  const resultado = await obterNota(Number(usuarioId))

  if (!resultado) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <p className="text-center">Não foi possível encontrar sua nota.</p>
            <div className="mt-4 flex justify-center">
              <Link href="/">
                <Button>Voltar ao início</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Formatar a nota para ter apenas 1 casa decimal
  const notaFormatada = Number.parseFloat(resultado.nota).toFixed(1)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Resultado</CardTitle>
          <CardDescription className="text-center">Obrigado por participar, {resultado.nome}!</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <div className="text-center mb-6">
            <h2 className="text-lg font-medium mb-2">Sua nota é:</h2>
            <div className="text-5xl font-bold text-green-600">{notaFormatada}</div>
          </div>

          <Link href="/">
            <Button>Voltar ao início</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
