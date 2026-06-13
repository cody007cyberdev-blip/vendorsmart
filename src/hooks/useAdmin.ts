import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Tipos para Admin
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  companyId: string | null;
  createdAt: string;
}

export interface AdminCompany {
  id: string;
  name: string;
  legalName: string;
  nif: string;
  country: "PT" | "CV";
  currency: "EUR" | "CVE";
}

export function useAdmin() {
  const queryClient = useQueryClient();

  // ─── UTILIZADORES ───────────────────────────────────────────
  const { data: users = [], isLoading: loadingUsers } = useQuery<AdminUser[]>({
    queryKey: ["admin", "users"],
    queryFn: async () => {
      const res = await fetch("/api/admin/users");
      if (!res.ok) throw new Error("Falha ao carregar utilizadores");
      return res.json();
    },
  });

  const toggleUserStatus = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const res = await fetch(`/api/admin/users/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive }),
      });
      if (!res.ok) throw new Error("Falha ao atualizar status");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      toast.success("Status do utilizador atualizado");
    },
  });

  // ─── EMPRESAS ───────────────────────────────────────────────
  const { data: companies = [], isLoading: loadingCompanies } = useQuery<AdminCompany[]>({
    queryKey: ["admin", "companies"],
    queryFn: async () => {
      const res = await fetch("/api/admin/companies");
      if (!res.ok) throw new Error("Falha ao carregar empresas");
      return res.json();
    },
  });

  const createCompany = useMutation({
    mutationFn: async (company: Partial<AdminCompany>) => {
      const res = await fetch("/api/admin/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(company),
      });
      if (!res.ok) throw new Error("Falha ao criar empresa");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "companies"] });
      toast.success("Empresa registada com sucesso");
    },
  });

  return {
    users,
    loadingUsers,
    toggleUserStatus,
    companies,
    loadingCompanies,
    createCompany,
  };
}
