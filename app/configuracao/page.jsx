import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ConfiguracaoPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Configuração do Banco de Dados</CardTitle>
          <CardDescription>Configure a integração com Neon para que o sistema funcione corretamente</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Passos para configurar:</h3>

            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <div>
                  <p className="font-medium">Acesse o painel do Vercel</p>
                  <p className="text-sm text-gray-600">Vá para https://vercel.com/dashboard</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <div>
                  <p className="font-medium">Selecione seu projeto</p>
                  <p className="text-sm text-gray-600">Clique no projeto que você acabou de fazer deploy</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <div>
                  <p className="font-medium">Vá para Settings &gt; Integrations</p>
                  <p className="text-sm text-gray-600">No menu lateral, clique em "Settings" e depois "Integrations"</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  4
                </div>
                <div>
                  <p className="font-medium">Adicione a integração Neon</p>
                  <p className="text-sm text-gray-600">Procure por "Neon" e clique em "Add Integration"</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  5
                </div>
                <div>
                  <p className="font-medium">Configure o banco de dados</p>
                  <p className="text-sm text-gray-600">Siga as instruções para criar ou conectar um banco Neon</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  6
                </div>
                <div>
                  <p className="font-medium">Faça redeploy</p>
                  <p className="text-sm text-gray-600">Após configurar, faça um novo deploy do projeto</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-2">Após a configuração:</h3>
            <div className="space-y-2">
              <Link href="/diagnostico">
                <Button className="w-full">Testar Configuração</Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="w-full">
                  Voltar ao Sistema
                </Button>
              </Link>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <h4 className="font-medium text-yellow-800">Importante:</h4>
            <p className="text-sm text-yellow-700 mt-1">
              Certifique-se de que as tabelas do banco de dados foram criadas. Se necessário, execute novamente os
              comandos SQL que criamos anteriormente.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
