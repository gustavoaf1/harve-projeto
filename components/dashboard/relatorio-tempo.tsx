"use client"

interface DadosTempo {
  data: string
  quantidade: number
}

interface RelatorioTempoProps {
  dados: DadosTempo[]
}

export function RelatorioTempo({ dados }: RelatorioTempoProps) {
  const maxQuantidade = Math.max(...dados.map((item) => Number(item.quantidade)), 1)

  return (
    <div className="space-y-3">
      {dados.map((item, index) => {
        const altura = (Number(item.quantidade) / maxQuantidade) * 100
        return (
          <div key={index} className="flex items-end justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium">{new Date(item.data).toLocaleDateString("pt-BR")}</p>
            </div>
            <div className="flex items-end space-x-2">
              <div className="flex items-end h-8">
                <div
                  className="bg-blue-500 rounded-t"
                  style={{
                    height: `${altura}%`,
                    width: "20px",
                    minHeight: "4px",
                  }}
                ></div>
              </div>
              <span className="text-sm font-bold">{item.quantidade}</span>
            </div>
          </div>
        )
      })}
      {dados.length === 0 && <p className="text-center text-gray-500 py-4">Nenhum dado disponível</p>}
    </div>
  )
}
