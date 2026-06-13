import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/register")({
  component: RegisterPage,
  head: () => ({ title: "Criar Conta — VendorSmart" }),
});

function RegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Empresa
    companyName: "",
    companyLegalName: "",
    nif: "",
    country: "PT",
    currency: "EUR",
    // Admin
    adminName: "",
    adminEmail: "",
    adminPassword: "",
    adminPasswordConfirm: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else {
      // Enviar dados para o servidor
      try {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (response.ok) {
          navigate({ to: "/app/dashboard" });
        } else {
          alert("Erro ao registar. Tente novamente.");
        }
      } catch (err) {
        console.error(err);
        alert("Erro na conexão.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {step === 1 ? "Registar Empresa" : "Criar Conta Admin"}
        </h1>
        <p className="text-gray-600 mb-8">
          {step === 1 ? "Passo 1 de 2: Informações da Empresa" : "Passo 2 de 2: Dados do Administrador"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {step === 1 ? (
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nome da Empresa</label>
                <Input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="Ex: Tech Solutions, Lda"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Designação Legal</label>
                <Input
                  type="text"
                  name="companyLegalName"
                  value={formData.companyLegalName}
                  onChange={handleChange}
                  placeholder="Ex: Tech Solutions, Sociedade Unipessoal, Lda"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">NIF</label>
                <Input
                  type="text"
                  name="nif"
                  value={formData.nif}
                  onChange={handleChange}
                  placeholder="Ex: 123456789"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">País</label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                  >
                    <option value="PT">Portugal</option>
                    <option value="CV">Cabo Verde</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Moeda</label>
                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                  >
                    <option value="EUR">EUR (€)</option>
                    <option value="CVE">CVE ($)</option>
                  </select>
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nome Completo (Admin)</label>
                <Input
                  type="text"
                  name="adminName"
                  value={formData.adminName}
                  onChange={handleChange}
                  placeholder="Ex: João Silva"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <Input
                  type="email"
                  name="adminEmail"
                  value={formData.adminEmail}
                  onChange={handleChange}
                  placeholder="Ex: admin@empresa.com"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Senha</label>
                <Input
                  type="password"
                  name="adminPassword"
                  value={formData.adminPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Confirmar Senha</label>
                <Input
                  type="password"
                  name="adminPasswordConfirm"
                  value={formData.adminPasswordConfirm}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                />
              </div>
            </>
          )}

          <div className="flex gap-4 pt-6">
            {step === 2 && (
              <Button
                type="button"
                onClick={() => setStep(1)}
                variant="outline"
                className="flex-1 border-2 border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
              </Button>
            )}
            <Button
              type="submit"
              className={`flex-1 ${step === 1 ? "w-full" : ""} bg-orange-600 hover:bg-orange-700 text-white font-semibold`}
            >
              {step === 1 ? "Continuar" : "Criar Conta"} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>

        <p className="text-center text-gray-600 mt-6">
          Já tem conta? <a href="/login" className="text-orange-600 font-semibold hover:underline">Entrar</a>
        </p>
      </div>
    </div>
  );
}
