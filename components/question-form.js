"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

export default function QuestionForm({ tentativaId, onSubmit }) {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [answers, setAnswers] = useState({})
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch("/api/perguntas")
        if (response.ok) {
          const data = await response.json()
          setQuestions(data)

          // Initialize answers object
          const initialAnswers = {}
          data.forEach((question) => {
            initialAnswers[question.id_pergunta] = null
          })
          setAnswers(initialAnswers)
        } else {
          setError("Erro ao carregar perguntas")
        }
      } catch (error) {
        console.error("Erro:", error)
        setError("Ocorreu um erro ao carregar as perguntas")
      } finally {
        setLoading(false)
      }
    }

    fetchQuestions()
  }, [])

  const handleAnswerChange = (questionId, answerId) => {
    setAnswers({
      ...answers,
      [questionId]: answerId,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Check if all questions are answered
    const unansweredQuestions = Object.values(answers).filter((answer) => answer === null)

    if (unansweredQuestions.length > 0) {
      setError(`Por favor, responda todas as ${unansweredQuestions.length} perguntas restantes.`)
      return
    }

    // Convert answers object to array of selected answer IDs
    const selectedAnswers = Object.values(answers)
    onSubmit(selectedAnswers)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    )
  }

  if (error && !questions.length) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
        <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
          Tentar novamente
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold text-center">Responda as perguntas</h2>

      {questions.map((question, index) => (
        <Card key={question.id_pergunta} className="overflow-hidden">
          <CardHeader className="bg-gray-50 py-4">
            <CardTitle className="text-lg">
              {index + 1}. {question.descricao}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <RadioGroup
              value={answers[question.id_pergunta]?.toString() || ""}
              onValueChange={(value) => handleAnswerChange(question.id_pergunta, Number.parseInt(value))}
            >
              {question.respostas.map((resposta) => (
                <div key={resposta.id_resposta} className="flex items-center space-x-2 py-2">
                  <RadioGroupItem
                    value={resposta.id_resposta.toString()}
                    id={`q${question.id_pergunta}-r${resposta.id_resposta}`}
                  />
                  <Label htmlFor={`q${question.id_pergunta}-r${resposta.id_resposta}`}>{resposta.texto}</Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
      ))}

      {error && <p className="text-sm text-red-500 text-center">{error}</p>}

      <Button type="submit" className="w-full">
        Finalizar
      </Button>
    </form>
  )
}
