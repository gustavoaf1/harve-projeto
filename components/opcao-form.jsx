"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { salvarOpcao } from "@/app/actions"
import { Loader2 } from "lucide-react"

export function OpcaoForm({ usuarioId, opcoes }) {
  const router = useRouter()
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedOption, setSelectedOption] = useState(null)

  async function handleSubmit(formData) {
    setIsLoading(true)
    setError(null)

    try {
      // Adicionar um timeout para mostrar erro se demorar muito
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Tempo limite excedido. Tente novamente.")), 15000),
      )

      // Competir entre a ação e o timeout
      const result = await Promise.race([salvarOpcao(formData), timeoutPromise])

      if (result.error) {
        setError(result.error)
        setIsLoading(false)
        return
      }

      if (result.success && result.userId) {
        // Pré-carregar a próxima página
        router.prefetch(`/perguntas?id=${result.userId}`)
        router.push(`/perguntas?id=${result.userId}`)
      } else {
        setError("Resposta inesperada do servidor")
        setIsLoading(false)
      }
    } catch (err) {
      setError(err.message || "Erro ao processar a solicitação")
      setIsLoading(false)
    }
  }

  // Pré-selecionar a primeira opção para evitar estado vazio
  if (opcoes.length > 0 && !selectedOption) {
    setSelectedOption(opcoes[0].id.toString())
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <input type="hidden" name="usuarioId" value={usuarioId} />

      <RadioGroup
        defaultValue={opcoes.length > 0 ? opcoes[0].id.toString() : "1"}
        name="opcaoId"
        className="space-y-3"
        value={selectedOption}
        onValueChange={setSelectedOption}
      >
        {opcoes.map((opcao) => (
          <div key={opcao.id} className="flex items-center space-x-2 border p-4 rounded-md hover:bg-gray-50">
            <RadioGroupItem value={opcao.id.toString()} id={`opcao-${opcao.id}`} />
            <Label htmlFor={`opcao-${opcao.id}`} className="flex-1 cursor-pointer">
              {opcao.descricao}
            </Label>
          </div>
        ))}
      </RadioGroup>

      {error && <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md border border-red-200">{error}</div>}
      <Button type="submit" className="w-full" disabled={isLoading || !selectedOption}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processando...
          </>
        ) : (
          "Continuar"
        )}
      </Button>
    </form>
  )
}
