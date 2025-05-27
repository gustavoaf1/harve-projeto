"use client"

interface DadosOpcao {
  descricao: string
  quantidade: number
}

interface RelatorioOpcoesProps {
  dados: DadosOpcao[]
}

export function RelatorioOpcoes({ dados }: RelatorioOpcoesProps) {
  const total = dados.reduce((acc, item) => acc + Number(item.quantidade), 0)

  return (
    <div className="space-y-3">
      {dados.map((item, index) => {
        const porcentagem = total > 0 ? ((Number(item.quantidade) / total) * 100).toFixed(1) : 0
        return (
          <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
            <div className="flex-1">
              <p className="font-medium text-sm">{item.descricao}</p>
            </div>
            <div className="text-right">
              <p className="font-bold">{item.quantidade}</p>
              <p className="text-xs text-gray-500">{porcentagem}%</p>
            </div>
          </div>
        )
      })}
      {dados.length === 0 && <p className="text-center text-gray-500 py-4">Nenhum dado disponível</p>}
    </div>
  )
}
