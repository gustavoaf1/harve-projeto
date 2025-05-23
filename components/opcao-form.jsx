"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { salvarOpcao } from "@/app/actions"

export function OpcaoForm({ usuarioId, opcoes }) {
  const router = useRouter()
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(formData) {
    setIsLoading(true)
    setError(null)

    const result = await salvarOpcao(formData)

    if (result.error) {
      setError(result.error)
      setIsLoading(false)
      return
    }

    if (result.success && result.userId) {
      router.push(`/perguntas?id=${result.userId}`)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <input type="hidden" name="usuarioId" value={usuarioId} />

      <RadioGroup defaultValue="1" name="opcaoId" className="space-y-3">
        {opcoes.map((opcao) => (
          <div key={opcao.id} className="flex items-center space-x-2 border p-4 rounded-md">
            <RadioGroupItem value={opcao.id.toString()} id={`opcao-${opcao.id}`} />
            <Label htmlFor={`opcao-${opcao.id}`} className="flex-1">
              {opcao.descricao}
            </Label>
          </div>
        ))}
      </RadioGroup>

      {error && <div className="text-red-500 text-sm">{error}</div>}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Processando..." : "Continuar"}
      </Button>
    </form>
  )
}
