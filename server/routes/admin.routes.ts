import { Router } from "express";
import { db } from "../db/client";
import { users, companies, employees, clients } from "../db/schema";
import { eq } from "drizzle-orm";
import { authenticate, requireRole } from "../middleware/auth.middleware";

const router = Router();

// Todas as rotas de admin requerem autenticação e cargo de admin
router.use(authenticate);
router.use(requireRole("admin"));

// ─── GESTÃO DE UTILIZADORES ───────────────────────────────────

// Listar todos os utilizadores
router.get("/users", async (req, res) => {
  try {
    const allUsers = await db.select().from(users);
    res.json(allUsers);
  } catch (error) {
    res.status(500).json({ message: "Erro ao listar utilizadores", error });
  }
});

// Atualizar status de utilizador (Ativar/Desativar)
router.patch("/users/:id/status", async (req, res) => {
  const { id } = req.params;
  const { isActive } = req.body;
  try {
    await db.update(users).set({ isActive }).where(eq(users.id, id));
    res.json({ message: "Status do utilizador atualizado com sucesso" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar status", error });
  }
});

// ─── GESTÃO DE EMPRESAS ───────────────────────────────────────

// Listar empresas
router.get("/companies", async (req, res) => {
  try {
    const allCompanies = await db.select().from(companies);
    res.json(allCompanies);
  } catch (error) {
    res.status(500).json({ message: "Erro ao listar empresas", error });
  }
});

// Criar nova empresa (CV/PT)
router.post("/companies", async (req, res) => {
  try {
    const newCompany = req.body;
    await db.insert(companies).values(newCompany);
    res.status(201).json({ message: "Empresa criada com sucesso" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar empresa", error });
  }
});

// ─── GESTÃO DE FUNCIONÁRIOS ───────────────────────────────────

// Listar funcionários com dados de utilizador
router.get("/employees", async (req, res) => {
  try {
    const allEmployees = await db
      .select()
      .from(employees)
      .leftJoin(users, eq(employees.userId, users.id));
    res.json(allEmployees);
  } catch (error) {
    res.status(500).json({ message: "Erro ao listar funcionários", error });
  }
});

// ─── GESTÃO DE CLIENTES ───────────────────────────────────────

// Listar clientes
router.get("/clients", async (req, res) => {
  try {
    const allClients = await db.select().from(clients);
    res.json(allClients);
  } catch (error) {
    res.status(500).json({ message: "Erro ao listar clientes", error });
  }
});

// Atualizar limite de crédito de cliente
router.patch("/clients/:id/credit", async (req, res) => {
  const { id } = req.params;
  const { creditLimit } = req.body;
  try {
    await db.update(clients).set({ creditLimit }).where(eq(clients.id, id));
    res.json({ message: "Limite de crédito atualizado" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar limite", error });
  }
});

export default router;
