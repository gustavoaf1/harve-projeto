import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { sql } from "@/lib/db"

async function obterUltimosUsuarios() {
  try {
    const usuarios = await sql`
      SELECT 
        u.nome,
        u.login,
        u.data_cadastro,
        n.nota,
        CASE 
          WHEN n.nota IS NOT NULL THEN 'Completo'
          ELSE 'Em andamento'
        END as status
      FROM usuarios u
      LEFT JOIN notas n ON u.id = n.usuario_id
      ORDER BY u.data_cadastro DESC
      LIMIT 5
    `
    return usuarios
  } catch (error) {
    console.error("Erro ao obter últimos usuários:", error)
    return []
  }
}

export async function UltimosUsuarios() {
  const usuarios = await obterUltimosUsuarios()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completo":
        return "bg-green-100 text-green-800"
      case "Em andamento":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Últimos Usuários</CardTitle>
        <CardDescription>Os 5 usuários mais recentes do sistema</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {usuarios.map((usuario, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <p className="font-medium">{usuario.nome}</p>
                <p className="text-sm text-gray-600">@{usuario.login}</p>
                <p className="text-xs text-gray-500">{new Date(usuario.data_cadastro).toLocaleDateString("pt-BR")}</p>
              </div>
              <div className="flex items-center space-x-2">
                {usuario.nota && <span className="text-sm font-medium">{Number(usuario.nota).toFixed(1)}</span>}
                <Badge className={getStatusColor(usuario.status)}>{usuario.status}</Badge>
              </div>
            </div>
          ))}
          {usuarios.length === 0 && <p className="text-center text-gray-500 py-4">Nenhum usuário encontrado</p>}
        </div>
      </CardContent>
    </Card>
  )
}
