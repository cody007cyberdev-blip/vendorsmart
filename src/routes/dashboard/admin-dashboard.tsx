import { createFileRoute } from "@tanstack/react-router";
import { Users, Shield, Settings, Database, Activity, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export const Route = createFileRoute('/dashboard/admin-dashboard')({
  component: () => (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <AdminDashboard />
    </ProtectedRoute>
  ),
});

function AdminDashboard() {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight">Painel de Administração</h1>
        <p className="text-gray-500">Gestão centralizada do sistema VendorSmart.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold">Total Utilizadores</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black">124</div>
            <p className="text-xs text-gray-500">+12 este mês</p>
          </CardContent>
        </Card>
        <Card className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold">Estado do Sistema</CardTitle>
            <Activity className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black">Online</div>
            <p className="text-xs text-gray-500">Uptime: 99.9%</p>
          </CardContent>
        </Card>
        <Card className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold">Segurança</CardTitle>
            <Shield className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black">Protegido</div>
            <p className="text-xs text-gray-500">Firewall ativa</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="border-2 border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" /> Backup & Dados
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">Último backup realizado há 2 horas.</p>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-black text-white rounded-lg text-sm font-bold">Realizar Backup Agora</button>
              <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-bold">Ver Histórico</button>
            </div>
          </CardContent>
        </Card>
        <Card className="border-2 border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" /> Permissões & Roles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">Gerencie quem pode acessar o quê no sistema.</p>
            <button className="px-4 py-2 bg-black text-white rounded-lg text-sm font-bold">Configurar Roles</button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
