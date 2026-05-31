import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useAppStore, User, Role } from "@/store/useAppStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff } from "lucide-react";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({
    meta: [{ title: "Login — VendorSmart" }],
  }),
});

interface SearchParams {
  redirect?: string;
}

function LoginPage() {
  const navigate = useNavigate();
  const { login, verifyTwoFactor } = useAuth();
  const setUser = useAppStore((state) => state.setUser);
  const search = useSearch({ from: "/login" }) as SearchParams;

  const redirectByRole = (role: string) => {
    if (search.redirect) {
      navigate({ to: search.redirect });
      return;
    }

    switch (role) {
      case "admin":
      case "manager":
        navigate({ to: "/app/dashboard" });
        break;
      case "vendor":
        navigate({ to: "/dashboard/vendedor-pdv" });
        break;
      case "customer":
        navigate({ to: "/dashboard/cliente-loja" });
        break;
      default:
        navigate({ to: "/app/dashboard" });
    }
  };

  const updateStoreUser = (authUser: any) => {
    const user: User = {
      id: authUser.id,
      name: authUser.name,
      email: authUser.email,
      role: (authUser.role === "vendor" ? "VENDEDOR" : 
             authUser.role === "customer" ? "CLIENTE" : 
             authUser.role.toUpperCase()) as Role
    };
    setUser(user);
    return user;
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // 2FA state
  const [twoFactorRequired, setTwoFactorRequired] = useState(false);
  const [userId, setUserId] = useState("");
  const [twoFactorCode, setTwoFactorCode] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Preencha email e palavra-passe");
      return;
    }

    setLoading(true);
    try {
      const result = await login(email, password);
      if (result.twoFactorRequired && result.userId) {
        setTwoFactorRequired(true);
        setUserId(result.userId);
        toast.info("Autenticacao de dois fatores ativada. Verifique seu email.");
      } else if (result.user) {
        toast.success("Login bem-sucedido!");
        const user = updateStoreUser(result.user);
        redirectByRole(result.user.role);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!twoFactorCode) {
      toast.error("Insira o codigo de autenticacao");
      return;
    }

    setLoading(true);
    try {
      const user = await verifyTwoFactor(userId, twoFactorCode);
      toast.success("Autenticacao bem-sucedida!");
      updateStoreUser(user);
      redirectByRole(user.role);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Codigo invalido");
    } finally {
      setLoading(false);
    }
  };

  if (twoFactorRequired) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Autenticacao de Dois Fatores</CardTitle>
            <CardDescription>Insira o codigo enviado para seu email</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleVerify2FA} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Codigo de Autenticacao</Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="000000"
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value)}
                  maxLength={6}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Verificar
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>VendorSmart</CardTitle>
          <CardDescription>Sistema de Gestao de Inventario e Vendas</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@vendorsmart.local"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Palavra-passe</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Entrar
            </Button>
          </form>

          <div className="mt-6 border-t pt-4">
            <p className="text-xs text-muted-foreground">
              <strong>Demo Accounts:</strong>
            </p>
            <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
              <li>Admin: admin@vendorsmart.local / admin123</li>
              <li>Manager: manager@vendorsmart.local / manager123</li>
              <li>Vendor: vendor@vendorsmart.local / vendor123</li>
              <li>Customer: cliente@vendorsmart.local / customer123</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
