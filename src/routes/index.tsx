import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ArrowRight, Download, BookOpen, Globe } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({ title: "VendorSmart Professional Enterprise" }),
});

function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex flex-col items-center justify-center p-8">
      <div className="text-center max-w-4xl space-y-8">
        <h1 className="text-6xl font-extrabold tracking-tight leading-tight">
          <span className="text-orange-500">VendorSmart</span> Professional Enterprise
        </h1>
        <p className="text-xl text-gray-300 leading-relaxed">
          A solução ERP de próxima geração para gestão de inventário, produção, finanças e conformidade fiscal em **Portugal** e **Cabo Verde**.
        </p>

        <div className="flex flex-wrap justify-center gap-4 mt-10">
          <Button asChild className="bg-orange-600 hover:bg-orange-700 text-white text-lg px-8 py-6 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
            <Link to="/app/dashboard">
              Aceder ao Dashboard <ArrowRight className="ml-3 h-6 w-6" />
            </Link>
          </Button>
          <Button asChild variant="outline" className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white text-lg px-8 py-6 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
            <Link to="/docs">
              Documentação <BookOpen className="ml-3 h-6 w-6" />
            </Link>
          </Button>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-700 space-y-6">
          <h2 className="text-4xl font-bold text-gray-100">Obtenha o VendorSmart</h2>
          <p className="text-lg text-gray-400">Escolha a melhor forma de integrar o VendorSmart na sua infraestrutura.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700 hover:border-orange-500 transition-all duration-300">
              <Download className="h-10 w-10 text-orange-500 mb-4" />
              <h3 className="text-2xl font-semibold mb-2">Instalável (Desktop)</h3>
              <p className="text-gray-400 mb-4">Descarregue e instale o VendorSmart diretamente no seu ambiente local.</p>
              <Button variant="secondary" className="w-full bg-gray-700 hover:bg-gray-600 text-white">
                Download <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700 hover:border-orange-500 transition-all duration-300">
              <Globe className="h-10 w-10 text-orange-500 mb-4" />
              <h3 className="text-2xl font-semibold mb-2">Web (Cloud)</h3>
              <p className="text-gray-400 mb-4">Aceda ao VendorSmart a partir de qualquer navegador, em qualquer lugar.</p>
              <Button variant="secondary" className="w-full bg-gray-700 hover:bg-gray-600 text-white">
                Saber Mais <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700 hover:border-orange-500 transition-all duration-300">
              <BookOpen className="h-10 w-10 text-orange-500 mb-4" />
              <h3 className="text-2xl font-semibold mb-2">API & WebSockets</h3>
              <p className="text-gray-400 mb-4">Integre o VendorSmart com os seus sistemas existentes via API e WebSockets.</p>
              <Button variant="secondary" className="w-full bg-gray-700 hover:bg-gray-600 text-white">
                Ver Docs API <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
