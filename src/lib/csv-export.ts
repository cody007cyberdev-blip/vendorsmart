/**
 * CSV Export Utility — VendorSmart Professional Enterprise
 * 
 * Este módulo fornece funcionalidades de exportação CSV de alta fidelidade,
 * seguindo os padrões RFC 4180 e as melhores práticas de exportação de dados.
 * 
 * Referências:
 * - RFC 4180: https://tools.ietf.org/html/rfc4180
 * - CSV Best Practices: https://www.w3.org/TR/csv-metadata/
 */

export interface CSVExportOptions {
  filename: string;
  headers: string[];
  data: Record<string, any>[];
  delimiter?: string;
  encoding?: string;
  includeTimestamp?: boolean;
  includeMetadata?: boolean;
}

export interface CSVMetadata {
  exportedAt: string;
  exportedBy: string;
  totalRecords: number;
  version: string;
}

/**
 * Escapa valores de campo CSV conforme RFC 4180
 * - Se o campo contém aspas, delimitador ou quebra de linha, envolve em aspas
 * - Aspas duplas dentro do campo são escapadas com aspas duplas
 */
function escapeCSVField(field: any): string {
  if (field === null || field === undefined) return "";
  
  const str = String(field);
  const needsQuotes = str.includes('"') || str.includes(",") || str.includes("\n") || str.includes("\r");
  
  if (needsQuotes) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  
  return str;
}

/**
 * Formata datas em ISO 8601 para melhor compatibilidade
 */
function formatDate(date: Date | string): string {
  if (typeof date === "string") return date;
  return date.toISOString().split("T")[0];
}

/**
 * Converte um array de objetos em string CSV
 */
export function convertToCSV(options: CSVExportOptions): string {
  const { headers, data, delimiter = ",", includeMetadata = false } = options;
  
  const lines: string[] = [];
  
  // Adicionar metadados como comentário (linha iniciada com #)
  if (includeMetadata) {
    const metadata: CSVMetadata = {
      exportedAt: new Date().toISOString(),
      exportedBy: "VendorSmart Professional Enterprise v3.0",
      totalRecords: data.length,
      version: "1.0",
    };
    
    lines.push(`# Exportado em: ${metadata.exportedAt}`);
    lines.push(`# Total de Registos: ${metadata.totalRecords}`);
    lines.push(`# Versão: ${metadata.version}`);
    lines.push("");
  }
  
  // Adicionar cabeçalhos
  const headerLine = headers.map(h => escapeCSVField(h)).join(delimiter);
  lines.push(headerLine);
  
  // Adicionar dados
  data.forEach(row => {
    const values = headers.map(header => {
      const value = row[header];
      
      // Formatar datas
      if (value instanceof Date) {
        return escapeCSVField(formatDate(value));
      }
      
      // Formatar números com casas decimais
      if (typeof value === "number") {
        return escapeCSVField(value.toFixed(2));
      }
      
      return escapeCSVField(value);
    });
    
    lines.push(values.join(delimiter));
  });
  
  return lines.join("\n");
}

/**
 * Descarrega um CSV diretamente no navegador
 */
export function downloadCSV(options: CSVExportOptions): void {
  const csvContent = convertToCSV(options);
  
  // Criar Blob com encoding UTF-8 BOM para compatibilidade com Excel
  const BOM = "\uFEFF";
  const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" });
  
  // Criar URL e link de download
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  
  link.setAttribute("href", url);
  link.setAttribute("download", `${options.filename}.csv`);
  link.style.visibility = "hidden";
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Limpar URL
  URL.revokeObjectURL(url);
}

/**
 * Exporta dados em formato HTML Table para copiar/colar
 */
export function exportToHTMLTable(options: CSVExportOptions): string {
  const { headers, data } = options;
  
  let html = '<table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; font-family: Arial, sans-serif;">';
  
  // Cabeçalhos
  html += "<thead><tr>";
  headers.forEach(header => {
    html += `<th style="background-color: #f0f0f0; font-weight: bold; text-align: left;">${escapeHTML(header)}</th>`;
  });
  html += "</tr></thead>";
  
  // Dados
  html += "<tbody>";
  data.forEach((row, idx) => {
    const bgColor = idx % 2 === 0 ? "#ffffff" : "#f9f9f9";
    html += `<tr style="background-color: ${bgColor};">`;
    
    headers.forEach(header => {
      const value = row[header] ?? "";
      html += `<td style="text-align: left;">${escapeHTML(String(value))}</td>`;
    });
    
    html += "</tr>";
  });
  html += "</tbody>";
  
  html += "</table>";
  
  return html;
}

/**
 * Escapa caracteres HTML para segurança
 */
function escapeHTML(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  
  return text.replace(/[&<>"']/g, (char) => map[char]);
}

/**
 * Exporta dados com filtros e transformações
 */
export function exportWithTransform(
  options: CSVExportOptions,
  transform: (row: Record<string, any>, index: number) => Record<string, any> | null
): string {
  const transformedData = options.data
    .map((row, idx) => transform(row, idx))
    .filter((row): row is Record<string, any> => row !== null);
  
  return convertToCSV({ ...options, data: transformedData });
}

/**
 * Exemplo de uso:
 * 
 * const employees = [
 *   { id: "1", name: "João Silva", email: "joao@empresa.com", salary: 1500.50 },
 *   { id: "2", name: "Maria Santos", email: "maria@empresa.com", salary: 1800.00 },
 * ];
 * 
 * downloadCSV({
 *   filename: "funcionarios_2026",
 *   headers: ["id", "name", "email", "salary"],
 *   data: employees,
 *   includeMetadata: true,
 * });
 */
