"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { autenticarUsuario } from "@/app/actions"

export function LoginForm() {
  const router = useRouter()
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(formData) {
    setIsLoading(true)
    setError(null)

    const result = await autenticarUsuario(formData)

    if (result.error) {
      setError(result.error)
      setIsLoading(false)
      return
    }

    if (result.success && result.userId) {
      router.push(`/escolher-opcao?id=${result.userId}`)
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
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Processando..." : "Entrar"}
      </Button>
    </form>
  )
}
