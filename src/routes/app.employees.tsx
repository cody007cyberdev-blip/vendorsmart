import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Plus, Trash2, Edit2, Mail, Shield, Download } from "lucide-react";
import { downloadCSV } from "@/lib/csv-export";

export const Route = createFileRoute("/app/employees")({
  component: EmployeesPage,
  head: () => ({ title: "Gestão de Funcionários — VendorSmart" }),
});

interface Employee {
  id: string;
  name: string;
  email: string;
  position: string;
  department: string;
  role: "admin" | "manager" | "vendor" | "employee";
  status: "active" | "inactive";
  hireDate: string;
}

function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: "1",
      name: "João Silva",
      email: "joao@empresa.com",
      position: "Gerente de Inventário",
      department: "Operações",
      role: "manager",
      status: "active",
      hireDate: "2024-01-15",
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    position: "",
    department: "",
    role: "employee" as const,
  });

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    const newEmployee: Employee = {
      id: Date.now().toString(),
      ...formData,
      status: "active",
      hireDate: new Date().toISOString().split("T")[0],
    };
    setEmployees([...employees, newEmployee]);
    setFormData({ name: "", email: "", position: "", department: "", role: "employee" });
    setShowForm(false);
  };

  const handleDeleteEmployee = (id: string) => {
    setEmployees(employees.filter(e => e.id !== id));
  };

  const getRoleBadgeColor = (role: string) => {
    const colors: Record<string, string> = {
      admin: "bg-red-100 text-red-700",
      manager: "bg-blue-100 text-blue-700",
      vendor: "bg-green-100 text-green-700",
      employee: "bg-gray-100 text-gray-700",
    };
    return colors[role] || "bg-gray-100 text-gray-700";
  };

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      admin: "Administrador",
      manager: "Gerente",
      vendor: "Vendedor",
      employee: "Funcionário",
    };
    return labels[role] || role;
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Gestão de Funcionários</h1>
          <p className="text-gray-600 mt-2">Crie, edite e gerencie a sua equipa com permissões granulares.</p>
        </div>
        <div className="flex gap-4">
          <Button
            onClick={() => {
              downloadCSV({
                filename: `funcionarios_${new Date().toISOString().split('T')[0]}`,
                headers: ["name", "email", "position", "department", "role", "hireDate"],
                data: employees,
                includeMetadata: true,
              });
            }}
            variant="outline"
            className="border-2 border-orange-600 text-orange-600 hover:bg-orange-50"
          >
            <Download className="mr-2 h-5 w-5" /> Exportar CSV
          </Button>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-orange-600 hover:bg-orange-700 text-white"
          >
            <Plus className="mr-2 h-5 w-5" /> Adicionar Funcionário
          </Button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Novo Funcionário</h2>
          <form onSubmit={handleAddEmployee} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Nome Completo</label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Maria Santos"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Ex: maria@empresa.com"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Cargo</label>
              <Input
                type="text"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                placeholder="Ex: Analista de Inventário"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Departamento</label>
              <Input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                placeholder="Ex: Operações"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Nível de Acesso</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
              >
                <option value="employee">Funcionário (Acesso Básico)</option>
                <option value="vendor">Vendedor (Acesso Vendas)</option>
                <option value="manager">Gerente (Acesso Completo)</option>
                <option value="admin">Administrador (Acesso Total)</option>
              </select>
            </div>

            <div className="md:col-span-2 flex gap-4">
              <Button
                type="submit"
                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-semibold"
              >
                Criar Funcionário
              </Button>
              <Button
                type="button"
                onClick={() => setShowForm(false)}
                variant="outline"
                className="flex-1 border-2 border-gray-300"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Nome</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Cargo</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Departamento</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Nível de Acesso</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Ações</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{emp.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600 flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" /> {emp.email}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{emp.position}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{emp.department}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${getRoleBadgeColor(emp.role)}`}>
                    <Shield className="h-4 w-4" /> {getRoleLabel(emp.role)}
                  </span>
                </td>
                <td className="px-6 py-4 flex gap-2">
                  <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50">
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteEmployee(emp.id)}
                    className="text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
