import ExcelJS from 'exceljs';
import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

const reportsDir = path.join(__dirname, '../../reports');
if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true });

export async function generateSalesReport(data, format = 'excel') {
  const filename = `report-${Date.now()}.${format === 'excel' ? 'xlsx' : 'pdf'}`;
  const filepath = path.join(reportsDir, filename);

  if (format === 'excel') {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Vendas');
    // ... preenche dados com estilos profissionais
    await workbook.xlsx.writeFile(filepath);
  } else {
    // PDF com pdf-lib ou jspdf
  }
  return filename;
}