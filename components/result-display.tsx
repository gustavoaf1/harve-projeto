"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

export default function ResultDisplay({ result, userData }) {
  if (!result) {
    return null
  }

  const handleRestart = () => {
    window.location.href = "/"
  }

  return (
    <div className="space-y-6 text-center">
      <div className="flex justify-center">
        <CheckCircle className="h-16 w-16 text-green-500" />
      </div>

      <h2 className="text-2xl font-bold">Obrigado, {userData.nome}!</h2>
      <p className="text-gray-600">Suas respostas foram registradas com sucesso.</p>

      <Card>
        <CardHeader>
          <CardTitle>Seu resultado</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div className="text-3xl font-bold">{result.pontuacao}</div>
          <p className="text-gray-500 mt-2">Pontuação obtida</p>
        </CardContent>
      </Card>

      <p className="text-sm text-gray-500">Um email com seu resultado foi enviado para {userData.email}</p>

      <Button onClick={handleRestart} className="mt-4">
        Iniciar nova tentativa
      </Button>
    </div>
  )
}
