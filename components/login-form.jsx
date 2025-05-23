"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { autenticarUsuario } from "@/app/actions"
import { Loader2 } from "lucide-react"

export function LoginForm() {
  const router = useRouter()
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(formData) {
    setIsLoading(true)
    setError(null)

    try {
      // Adicionar um timeout para mostrar erro se demorar muito
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Tempo limite excedido. Tente novamente.")), 15000),
      )

      // Competir entre a autenticação e o timeout
      const result = await Promise.race([autenticarUsuario(formData), timeoutPromise])

      if (result.error) {
        setError(result.error)
        setIsLoading(false)
        return
      }

      if (result.success && result.userId) {
        // Pré-carregar a próxima página
        router.prefetch(`/escolher-opcao?id=${result.userId}`)
        router.push(`/escolher-opcao?id=${result.userId}`)
      } else {
        setError("Resposta inesperada do servidor")
        setIsLoading(false)
      }
    } catch (err) {
      setError(err.message || "Erro ao processar a solicitação")
      setIsLoading(false)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="login">Login</Label>
        <Input id="login" name="login" placeholder="Seu login" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="nome">Nome</Label>
        <Input id="nome" name="nome" placeholder="Seu nome" required />
      </div>
      {error && <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md border border-red-200">{error}</div>}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processando...
          </>
        ) : (
          "Entrar"
        )}
      </Button>
    </form>
  )
}
