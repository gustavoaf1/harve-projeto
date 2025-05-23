"use client"

import { useState } from "react"
import UserForm from "@/components/user-form"
import FormSelection from "@/components/form-selection"
import QuestionForm from "@/components/question-form"
import ResultDisplay from "@/components/result-display"



export default function Home() {
  const [step, setStep] = useState(1)
  const [userData, setUserData] = useState({ nome: "", email: "" })
  const [tentativaId, setTentativaId] = useState(null)
  const [setSelectedForm] = useState(null)
  const [result, setResult] = useState(null)

  const handleUserSubmit = async (data) => {
    try {
      const response = await fetch("/api/tentativas/iniciar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (response.ok) {
        setUserData(data)
        setTentativaId(result.id_tentativa)
        setStep(2)
      } else {
        alert(result.error || "Erro ao iniciar tentativa")
      }
    } catch (error) {
      console.error("Erro:", error)
      alert("Ocorreu um erro ao processar sua solicitação")
    }
  }

  const handleFormSelect = (formId) => {
    setSelectedForm(formId)
    setStep(3)
  }

  const handleQuestionSubmit = async (selectedAnswers) => {
    try {
      const response = await fetch("/api/tentativas/finalizar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_tentativa: tentativaId,
          ids_respostas: selectedAnswers,
        }),
      })

      const result = await response.json()

      if (response.ok) {
        setResult(result)
        setStep(4)

        // Simulate sending email
        fetch(`/api/tentativas/${tentativaId}/enviar-email`)
      } else {
        alert(result.error || "Erro ao finalizar tentativa")
      }
    } catch (error) {
      console.error("Erro:", error)
      alert("Ocorreu um erro ao processar sua solicitação")
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Sistema de Formulários</h1>

        {step === 1 && <UserForm onSubmit={handleUserSubmit} />}

        {step === 2 && <FormSelection onSelect={handleFormSelect} />}

        {step === 3 && <QuestionForm tentativaId={tentativaId} onSubmit={handleQuestionSubmit} />}

        {step === 4 && <ResultDisplay result={result} userData={userData} />}

        <div className="mt-4 text-sm text-gray-500 text-center">Passo {step} de 4</div>
      </div>
    </main>
  )
}
