"use client"

interface DadosNota {
  faixa: string
  quantidade: number
}

interface RelatorioNotasProps {
  dados: DadosNota[]
}

export function RelatorioNotas({ dados }: RelatorioNotasProps) {
  const total = dados.reduce((acc, item) => acc + Number(item.quantidade), 0)

  const cores = {
    "Excelente (9-10)": "bg-green-500",
    "Bom (7-8.9)": "bg-blue-500",
    "Regular (5-6.9)": "bg-yellow-500",
    "Baixo (0-4.9)": "bg-red-500",
  }

  return (
    <div className="space-y-4">
      {dados.map((item, index) => {
        const porcentagem = total > 0 ? ((Number(item.quantidade) / total) * 100).toFixed(1) : 0
        return (
          <div key={index} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">{item.faixa}</span>
              <span className="text-sm text-gray-600">
                {item.quantidade} ({porcentagem}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${cores[item.faixa as keyof typeof cores]}`}
                style={{ width: `${porcentagem}%` }}
              ></div>
            </div>
          </div>
        )
      })}
      {dados.length === 0 && <p className="text-center text-gray-500 py-4">Nenhum dado disponível</p>}
    </div>
  )
}
