"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { salvarRespostas } from "@/app/actions"
import { Loader2 } from "lucide-react"

export function PerguntasForm({ usuarioId, perguntas }) {
  const router = useRouter()
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [respostas, setRespostas] = useState({})

  // Pré-selecionar a primeira opção para perguntas de múltipla escolha
  if (perguntas.length > 0 && Object.keys(respostas).length === 0) {
    const initialRespostas = {}
    perguntas.forEach((pergunta, index) => {
      if (pergunta.tipo === "multipla_escolha" && pergunta.opcoes.length > 0) {
        initialRespostas[`resposta${index + 1}`] = pergunta.opcoes[0].texto
      }
    })
    if (Object.keys(initialRespostas).length > 0) {
      setRespostas(initialRespostas)
    }
  }

  const handleRadioChange = (value, name) => {
    setRespostas((prev) => ({ ...prev, [name]: value }))
  }

  const handleTextareaChange = (e) => {
    const { name, value } = e.target
    setRespostas((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(formData) {
    setIsLoading(true)
    setError(null)

    try {
      // Adicionar um timeout para mostrar erro se demorar muito
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Tempo limite excedido. Tente novamente.")), 15000),
      )

      // Competir entre a ação e o timeout
      const result = await Promise.race([salvarRespostas(formData), timeoutPromise])

      if (result.error) {
        setError(result.error)
        setIsLoading(false)
        return
      }

      if (result.success && result.userId) {
        // Pré-carregar a próxima página
        router.prefetch(`/resultado?id=${result.userId}`)
        router.push(`/resultado?id=${result.userId}`)
      } else {
        setError("Resposta inesperada do servidor")
        setIsLoading(false)
      }
    } catch (err) {
      setError(err.message || "Erro ao processar a solicitação")
      setIsLoading(false)
    }
  }

  // Verificar se todas as perguntas têm resposta
  const isFormValid = () => {
    return perguntas.every((_, index) => respostas[`resposta${index + 1}`])
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
            <RadioGroup
              name={`resposta${index + 1}`}
              className="space-y-2"
              value={respostas[`resposta${index + 1}`] || ""}
              onValueChange={(value) => handleRadioChange(value, `resposta${index + 1}`)}
            >
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
            <Textarea
              name={`resposta${index + 1}`}
              placeholder="Sua resposta"
              required
              className="min-h-[100px]"
              value={respostas[`resposta${index + 1}`] || ""}
              onChange={handleTextareaChange}
            />
          )}
        </div>
      ))}

      {error && <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md border border-red-200">{error}</div>}

      <Button type="submit" className="w-full" disabled={isLoading || !isFormValid()}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processando...
          </>
        ) : (
          "Enviar respostas"
        )}
      </Button>
    </form>
  )
}
