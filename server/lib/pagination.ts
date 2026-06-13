import { SQL, count, eq } from "drizzle-orm";
import { SQLiteTable } from "drizzle-orm/sqlite-core";
import { db } from "../db/client.js";

/**
 * Interface para resultados paginados
 */
export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/**
 * Utilitário para realizar queries paginadas com Drizzle
 */
export async function paginate<T extends SQLiteTable>(
  table: T,
  page: number = 1,
  limit: number = 10,
  where?: SQL
): Promise<PaginatedResult<any>> {
  const offset = (page - 1) * limit;

  // Conta o total de registros
  const totalResult = await db
    .select({ total: count() })
    .from(table)
    .where(where);
  
  const total = totalResult[0].total;

  // Busca os dados paginados
  const data = await db
    .select()
    .from(table)
    .where(where)
    .limit(limit)
    .offset(offset);

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

/**
 * Utilitário para construir filtros dinâmicos
 */
export function buildFilters(filters: Record<string, any>) {
  // Implementação básica - pode ser expandida conforme a necessidade
  const conditions: SQL[] = [];
  
  // Exemplo: if (filters.search) conditions.push(like(table.name, `%${filters.search}%`));
  
  return conditions;
}
