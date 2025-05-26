"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import { useState } from "react"

interface Usuario {
  id: number
  login: string
  nome: string
  data_cadastro: string
  opcao_escolhida?: string
  nota?: number
  data_calculo?: string
  status: string
}

interface TabelaUsuariosProps {
  usuarios: Usuario[]
}

export function TabelaUsuarios({ usuarios }: TabelaUsuariosProps) {
  const [filtro, setFiltro] = useState<string>("todos")

  const usuariosFiltrados = usuarios.filter((usuario) => {
    if (filtro === "todos") return true
    return usuario.status.toLowerCase() === filtro.toLowerCase()
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completo":
        return "bg-green-100 text-green-800"
      case "Em andamento":
        return "bg-yellow-100 text-yellow-800"
      case "Iniciado":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="flex space-x-2">
        <Button variant={filtro === "todos" ? "default" : "outline"} size="sm" onClick={() => setFiltro("todos")}>
          Todos ({usuarios.length})
        </Button>
        <Button variant={filtro === "completo" ? "default" : "outline"} size="sm" onClick={() => setFiltro("completo")}>
          Completos ({usuarios.filter((u) => u.status === "Completo").length})
        </Button>
        <Button
          variant={filtro === "em andamento" ? "default" : "outline"}
          size="sm"
          onClick={() => setFiltro("em andamento")}
        >
          Em Andamento ({usuarios.filter((u) => u.status === "Em andamento").length})
        </Button>
      </div>

      {/* Tabela */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left p-3 font-medium">Usuário</th>
              <th className="text-left p-3 font-medium">Login</th>
              <th className="text-left p-3 font-medium">Data Cadastro</th>
              <th className="text-left p-3 font-medium">Opção Escolhida</th>
              <th className="text-left p-3 font-medium">Nota</th>
              <th className="text-left p-3 font-medium">Status</th>
              <th className="text-left p-3 font-medium">Ações</th>
            </tr>
          </thead>
          <tbody>
            {usuariosFiltrados.map((usuario) => (
              <tr key={usuario.id} className="border-b hover:bg-gray-50">
                <td className="p-3">
                  <div>
                    <p className="font-medium">{usuario.nome}</p>
                    <p className="text-sm text-gray-600">ID: {usuario.id}</p>
                  </div>
                </td>
                <td className="p-3">
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm">{usuario.login}</code>
                </td>
                <td className="p-3">
                  <div>
                    <p className="text-sm">{new Date(usuario.data_cadastro).toLocaleDateString("pt-BR")}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(usuario.data_cadastro).toLocaleTimeString("pt-BR")}
                    </p>
                  </div>
                </td>
                <td className="p-3">
                  {usuario.opcao_escolhida ? (
                    <span className="text-sm">{usuario.opcao_escolhida}</span>
                  ) : (
                    <span className="text-sm text-gray-400">-</span>
                  )}
                </td>
                <td className="p-3">
                  {usuario.nota ? (
                    <div>
                      <span className="font-medium">{Number(usuario.nota).toFixed(1)}</span>
                      {usuario.data_calculo && (
                        <p className="text-xs text-gray-500">
                          {new Date(usuario.data_calculo).toLocaleDateString("pt-BR")}
                        </p>
                      )}
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400">-</span>
                  )}
                </td>
                <td className="p-3">
                  <Badge className={getStatusColor(usuario.status)}>{usuario.status}</Badge>
                </td>
                <td className="p-3">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    Ver
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {usuariosFiltrados.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">Nenhum usuário encontrado com o filtro selecionado.</p>
        </div>
      )}
    </div>
  )
}
