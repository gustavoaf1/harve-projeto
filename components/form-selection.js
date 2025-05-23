"use client"

import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function FormSelection({ onSelect }) {
  const [forms, setForms] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simula fetch dos formulários
    setTimeout(() => {
      setForms([
        { id: 1, title: "Formulário de Avaliação" },
        { id: 2, title: "Pesquisa de Satisfação" },
      ])
      setLoading(false)
    }, 500)
  }, [])

  const handleClick = (formId) => {
    onSelect(formId)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-center">Selecione um formulário</h2>

      <div className="space-y-3">
        {forms.map((form) => (
          <Card
            key={form.id}
            className="cursor-pointer hover:border-gray-400 transition-colors"
            onClick={() => handleClick(form.id)}
          >
            <CardHeader className="py-4">
              <CardTitle className="text-lg">{form.title}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
}
