"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function DiagnosticoPage() {
  const [resultado, setResultado] = useState(null)
  const [loading, setLoading] = useState(false)
  const [testeGet, setTesteGet] = useState(null)

  async function testarAPI() {
    setLoading(true)
    try {
      const response = await fetch("/api/tentativas/iniciar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          login: "teste123",
          nome: "Usuário Teste",
        }),
      })

      const data = await response.json()
      setResultado({
        status: response.status,
        data: data,
        ok: response.ok,
      })
    } catch (error) {
      setResultado({
        status: "ERRO",
        data: { error: error.message },
        ok: false,
      })
    }
    setLoading(false)
  }

  async function testarGET() {
    setLoading(true)
    try {
      const response = await fetch("/api/tentativas/iniciar")
      const data = await response.json()
      setTesteGet({
        status: response.status,
        data: data,
        ok: response.ok,
      })
    } catch (error) {
      setTesteGet({
        status: "ERRO",
        data: { error: error.message },
        ok: false,
      })
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-4xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Diagnóstico da API</CardTitle>
            <CardDescription>Teste as APIs para identificar problemas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Button onClick={testarGET} disabled={loading}>
                Testar GET (Diagnóstico)
              </Button>
              <Button onClick={testarAPI} disabled={loading}>
                Testar POST (Iniciar Tentativa)
              </Button>
            </div>

            {testeGet && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Resultado do Teste GET:</h3>
                <div className={`p-4 rounded-md ${testeGet.ok ? "bg-green-50" : "bg-red-50"}`}>
                  <p>Status: {testeGet.status}</p>
                  <pre className="mt-2 text-sm overflow-auto">{JSON.stringify(testeGet.data, null, 2)}</pre>
                </div>
              </div>
            )}

            {resultado && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Resultado do Teste POST:</h3>
                <div className={`p-4 rounded-md ${resultado.ok ? "bg-green-50" : "bg-red-50"}`}>
                  <p>Status: {resultado.status}</p>
                  <pre className="mt-2 text-sm overflow-auto">{JSON.stringify(resultado.data, null, 2)}</pre>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Teste Manual da API</CardTitle>
          </CardHeader>
          <CardContent>
            <TesteManuaAPI />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function TesteManuaAPI() {
  const [login, setLogin] = useState("")
  const [nome, setNome] = useState("")
  const [resultado, setResultado] = useState(null)
  const [loading, setLoading] = useState(false)

  async function enviarTeste() {
    setLoading(true)
    try {
      const response = await fetch("/api/tentativas/iniciar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ login, nome }),
      })

      const data = await response.json()
      setResultado({
        status: response.status,
        data: data,
        ok: response.ok,
      })
    } catch (error) {
      setResultado({
        status: "ERRO",
        data: { error: error.message },
        ok: false,
      })
    }
    setLoading(false)
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="login">Login</Label>
          <Input id="login" value={login} onChange={(e) => setLogin(e.target.value)} placeholder="Digite um login" />
        </div>
        <div>
          <Label htmlFor="nome">Nome</Label>
          <Input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Digite um nome" />
        </div>
      </div>

      <Button onClick={enviarTeste} disabled={loading || !login || !nome}>
        {loading ? "Testando..." : "Testar API"}
      </Button>

      {resultado && (
        <div className={`p-4 rounded-md ${resultado.ok ? "bg-green-50" : "bg-red-50"}`}>
          <p>Status: {resultado.status}</p>
          <pre className="mt-2 text-sm overflow-auto">{JSON.stringify(resultado.data, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}
