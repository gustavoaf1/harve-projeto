"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { salvarRespostas } from "@/app/actions"

export function PerguntasForm({ usuarioId, perguntas }) {
  const router = useRouter()
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(formData) {
    setIsLoading(true)
    setError(null)

    const result = await salvarRespostas(formData)

    if (result.error) {
      setError(result.error)
      setIsLoading(false)
      return
    }

    if (result.success && result.userId) {
      router.push(`/resultado?id=${result.userId}`)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <input type="hidden" name="usuarioId" value={usuarioId} />

      {perguntas.map((pergunta, index) => (
        <div key={pergunta.id} className="space-y-3">
          <Label className="text-base font-medium">
            {index + 1}. {pergunta.texto}
          </Label>

          {pergunta.tipo === "multipla_escolha" ? (
            <RadioGroup name={`resposta${index + 1}`} className="space-y-2">
              {pergunta.opcoes.map((opcao) => (
                <div key={opcao.id} className="flex items-center space-x-2 border p-3 rounded-md hover:bg-gray-50">
                  <RadioGroupItem value={opcao.texto} id={`opcao-${opcao.id}`} />
                  <Label htmlFor={`opcao-${opcao.id}`} className="flex-1 cursor-pointer">
                    {opcao.texto}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          ) : (
            <Textarea name={`resposta${index + 1}`} placeholder="Sua resposta" required className="min-h-[100px]" />
          )}
        </div>
      ))}

      {error && <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md">{error}</div>}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Processando..." : "Enviar respostas"}
      </Button>
    </form>
  )
}
