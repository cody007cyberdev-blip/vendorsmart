import { db, schema } from "../db/client.js";
import bcrypt from "bcryptjs";
import { randomUUID } from "node:crypto";

function uid() {
  return randomUUID();
}

async function seed() {
  console.log("[seed] A povoar a base de dados...");

  // Verifica se já existe admin
  const existing = await db.select().from(schema.users).limit(1);
  if (existing.length > 0) {
    console.log("[seed] Base de dados ja contem dados, a saltar seed.");
    return;
  }

  // Utilizadores de demonstracao (1 por perfil)
  const passwordHash = await bcrypt.hash("admin123", 10);
  const vendorHash = await bcrypt.hash("vendor123", 10);
  const managerHash = await bcrypt.hash("manager123", 10);
  const customerHash = await bcrypt.hash("customer123", 10);

  const adminId = uid();
  const managerId = uid();
  const vendorId = uid();
  const customerId = uid();

  await db.insert(schema.users).values([
    {
      id: adminId,
      name: "Administrador",
      email: "admin@vendorsmart.local",
      passwordHash,
      role: "admin",
      twoFactorEnabled: false,
    },
    {
      id: managerId,
      name: "Gestor",
      email: "manager@vendorsmart.local",
      passwordHash: managerHash,
      role: "manager",
    },
    {
      id: vendorId,
      name: "Vendedor",
      email: "vendor@vendorsmart.local",
      passwordHash: vendorHash,
      role: "vendor",
    },
    {
      id: customerId,
      name: "Cliente",
      email: "cliente@vendorsmart.local",
      passwordHash: customerHash,
      role: "customer",
    },
  ]);

  // Categorias
  const catBebidas = uid();
  const catMercearia = uid();
  const catLimpeza = uid();
  const catPadaria = uid();

  await db.insert(schema.categories).values([
    { id: catBebidas, name: "Bebidas", description: "Refrescos, aguas e sumos" },
    { id: catMercearia, name: "Mercearia", description: "Alimentacao basica" },
    { id: catLimpeza, name: "Limpeza", description: "Produtos de limpeza domestica" },
    { id: catPadaria, name: "Padaria", description: "Pao, bolos e similares" },
  ]);

  // Fornecedores
  const supA = uid();
  const supB = uid();

  await db.insert(schema.suppliers).values([
    {
      id: supA,
      name: "Distribuidora Atlantico",
      contactName: "Joao Costa",
      email: "comercial@atlantico.pt",
      phone: "+351 210 000 001",
      address: "Lisboa, Portugal",
      leadTimeDays: 3,
      rating: 4.5,
      isActive: true,
      notes: "Fornecedor principal de bebidas e mercearia.",
    },
    {
      id: supB,
      name: "Padaria Central Lda",
      contactName: "Maria Silva",
      email: "encomendas@padariacentral.pt",
      phone: "+351 210 000 002",
      address: "Porto, Portugal",
      leadTimeDays: 1,
      rating: 4.8,
      isActive: true,
      notes: "Entregas diarias.",
    },
  ]);

  // Produtos
  await db.insert(schema.products).values([
    {
      id: uid(),
      sku: "BEB-001",
      barcode: "5601234500001",
      name: "Agua Mineral 1.5L",
      description: "Garrafa de 1.5L",
      categoryId: catBebidas,
      supplierId: supA,
      unit: "un",
      currentStock: 120,
      reorderPoint: 30,
      reorderQuantity: 60,
      costPrice: 0.35,
      sellingPrice: 0.79,
      status: "active",
    },
    {
      id: uid(),
      sku: "BEB-002",
      barcode: "5601234500002",
      name: "Sumo Laranja 1L",
      categoryId: catBebidas,
      supplierId: supA,
      currentStock: 45,
      reorderPoint: 20,
      reorderQuantity: 30,
      costPrice: 0.85,
      sellingPrice: 1.79,
      status: "active",
    },
    {
      id: uid(),
      sku: "MER-001",
      barcode: "5601234600001",
      name: "Arroz Carolino 1Kg",
      categoryId: catMercearia,
      supplierId: supA,
      currentStock: 18,
      reorderPoint: 25,
      reorderQuantity: 50,
      costPrice: 0.95,
      sellingPrice: 1.49,
      status: "active",
    },
    {
      id: uid(),
      sku: "MER-002",
      barcode: "5601234600002",
      name: "Massa Esparguete 500g",
      categoryId: catMercearia,
      supplierId: supA,
      currentStock: 0,
      reorderPoint: 20,
      reorderQuantity: 40,
      costPrice: 0.55,
      sellingPrice: 0.99,
      status: "active",
    },
    {
      id: uid(),
      sku: "LIM-001",
      name: "Detergente Loica 1L",
      categoryId: catLimpeza,
      supplierId: supA,
      currentStock: 60,
      reorderPoint: 15,
      reorderQuantity: 30,
      costPrice: 1.20,
      sellingPrice: 2.49,
      status: "active",
    },
    {
      id: uid(),
      sku: "PAD-001",
      name: "Pao de Forma 500g",
      categoryId: catPadaria,
      supplierId: supB,
      currentStock: 25,
      reorderPoint: 10,
      reorderQuantity: 20,
      costPrice: 0.80,
      sellingPrice: 1.49,
      status: "active",
    },
  ]);

  console.log("[seed] Concluido. Utilizadores criados:");
  console.log("  admin@vendorsmart.local / admin123      (admin)");
  console.log("  manager@vendorsmart.local / manager123  (manager)");
  console.log("  vendor@vendorsmart.local / vendor123    (vendor)");
  console.log("  cliente@vendorsmart.local / customer123 (customer)");
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("[seed] Falhou:", err);
    process.exit(1);
  });
