import { useState, useMemo } from "react";
import { format } from "date-fns";
import { Plus, MoreHorizontal, Users, Search, ShieldCheck, Shield, User, Power, PowerOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAdmin, AdminUser } from "@/hooks/useAdmin";
import { cn } from "@/lib/utils";

export function UserManagement() {
  const { users, loadingUsers, toggleUserStatus } = useAdmin();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search) return users;
    const q = search.toLowerCase();
    return users.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
  }, [users, search]);

  if (loadingUsers) {
    return (
      <div className="flex h-48 items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Pesquisar utilizadores…" 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            className="pl-9 h-10 text-xs bg-white border-gray-100 rounded-lg" 
          />
        </div>
        <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white font-bold uppercase tracking-widest text-[10px] h-10 px-6">
          <Plus className="mr-2 h-4 w-4" /> Convidar Utilizador
        </Button>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow>
              <TableHead className="text-[10px] font-black uppercase tracking-widest">Nome</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest">Email</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest">Cargo</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest">Status</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest">Criado em</TableHead>
              <TableHead className="w-[80px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-gray-400 font-bold uppercase text-[10px] tracking-widest">
                  Nenhum utilizador encontrado
                </TableCell>
              </TableRow>
            ) : filtered.map((user) => (
              <TableRow key={user.id} className={cn(!user.isActive && "opacity-60 bg-gray-50/30")}>
                <TableCell className="font-bold text-gray-900 text-xs">{user.name}</TableCell>
                <TableCell className="text-xs text-gray-500">{user.email}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn(
                    "text-[9px] font-black uppercase tracking-widest px-2 py-0.5",
                    user.role === "admin" ? "border-orange-200 text-orange-600 bg-orange-50" : "border-gray-200 text-gray-500"
                  )}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={cn(
                    "text-[9px] font-black uppercase tracking-widest px-2 py-0.5",
                    user.isActive ? "bg-green-500" : "bg-gray-400"
                  )}>
                    {user.isActive ? "Ativo" : "Inativo"}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-gray-400">
                  {format(new Date(user.createdAt), "dd/MM/yyyy")}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-400 hover:text-gray-900">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem 
                        onClick={() => toggleUserStatus.mutate({ id: user.id, isActive: !user.isActive })}
                        className="text-xs font-bold uppercase tracking-widest"
                      >
                        {user.isActive ? (
                          <><PowerOff className="mr-2 h-3.5 w-3.5" /> Desativar</>
                        ) : (
                          <><Power className="mr-2 h-3.5 w-3.5" /> Ativar</>
                        )}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
