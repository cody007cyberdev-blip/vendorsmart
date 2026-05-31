import puppeteer from 'puppeteer-core';
import ExcelJS from 'exceljs';
import { format } from 'date-fns';
import fs from 'fs';
import path from 'path';
import handlebars from 'handlebars';

// No ambiente Linux do sandbox, usamos um caminho relativo ao home
const REPORTS_BASE = '/home/ubuntu/vendorsmart/reports';

export interface ReportData {
  title: string;
  generatedAt: string;
  items: any[];
  summary: {
    totalItems: number;
    totalValue: number;
    [key: string]: any;
  };
  companyInfo?: {
    name: string;
    nif: string;
    address: string;
  };
}

const HTML_TEMPLATE = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Helvetica', sans-serif; color: #333; margin: 40px; }
    .header { display: flex; justify-content: space-between; border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 30px; }
    .company-name { font-size: 24px; font-weight: bold; }
    .report-title { font-size: 18px; color: #666; margin-top: 5px; }
    .meta { text-align: right; font-size: 12px; color: #999; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
    th { background: #f4f4f4; text-align: left; padding: 12px; font-size: 12px; border-bottom: 1px solid #ddd; }
    td { padding: 12px; font-size: 12px; border-bottom: 1px solid #eee; }
    .summary { background: #fafafa; padding: 20px; border-radius: 8px; display: flex; justify-content: flex-end; }
    .summary-item { margin-left: 40px; text-align: right; }
    .summary-label { font-size: 10px; color: #999; text-transform: uppercase; }
    .summary-value { font-size: 18px; font-weight: bold; }
    .footer { position: fixed; bottom: 0; width: 100%; text-align: center; font-size: 10px; color: #ccc; padding: 20px 0; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="company-name">{{companyInfo.name}}</div>
      <div class="report-title">{{title}}</div>
    </div>
    <div class="meta">
      <div>Data de Emissão: {{generatedAt}}</div>
      <div>NIF: {{companyInfo.nif}}</div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>DESCRIÇÃO</th>
        <th>CATEGORIA</th>
        <th style="text-align: center;">QTD</th>
        <th style="text-align: right;">PREÇO UN.</th>
        <th style="text-align: right;">TOTAL</th>
      </tr>
    </thead>
    <tbody>
      {{#each items}}
      <tr>
        <td>{{this.name}}</td>
        <td>{{this.category}}</td>
        <td style="text-align: center;">{{this.quantity}}</td>
        <td style="text-align: right;">€{{this.price}}</td>
        <td style="text-align: right;">€{{this.total}}</td>
      </tr>
      {{/each}}
    </tbody>
  </table>

  <div class="summary">
    <div class="summary-item">
      <div class="summary-label">Total de Itens</div>
      <div class="summary-value">{{summary.totalItems}}</div>
    </div>
    <div class="summary-item">
      <div class="summary-label">Valor Total</div>
      <div class="summary-value">€{{summary.totalValue}}</div>
    </div>
  </div>

  <div class="footer">
    VendorSmart - Sistema de Gestão Inteligente | Gerado automaticamente em {{generatedAt}}
  </div>
</body>
</html>
`;

export async function generateReport(data: ReportData, type: 'pdf' | 'excel', reportType: string) {
  const now = new Date();
  const year = format(now, 'yyyy');
  const month = format(now, 'MM');
  
  const dir = path.join(REPORTS_BASE, year, month);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const filename = `${reportType}-${Date.now()}`;
  const filepath = path.join(dir, `${filename}.${type}`);

  // Default company info if not provided
  if (!data.companyInfo) {
    data.companyInfo = {
      name: 'VendorSmart Lda',
      nif: '500 123 456',
      address: 'Avenida da Liberdade, 123, Lisboa'
    };
  }

  if (type === 'pdf') {
    const template = handlebars.compile(HTML_TEMPLATE);
    const html = template(data);

    // No sandbox, o caminho do chrome pode variar. Puppeteer-core precisa do executablePath
    const browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      executablePath: '/usr/bin/google-chrome' // Common path in Ubuntu
    });
    const page = await browser.newPage();
    await page.setContent(html);
    await page.pdf({ 
      path: filepath, 
      format: 'A4', 
      printBackground: true,
      margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' }
    });
    await browser.close();
  } 
  else if (type === 'excel') {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(data.title);

    // Cabeçalho da Empresa
    worksheet.mergeCells('A1:E1');
    const titleCell = worksheet.getCell('A1');
    titleCell.value = data.companyInfo.name + ' - ' + data.title;
    titleCell.font = { size: 16, bold: true };
    titleCell.alignment = { horizontal: 'center' };

    // Cabeçalhos da Tabela
    worksheet.getRow(3).values = ['DESCRIÇÃO', 'CATEGORIA', 'QTD', 'PREÇO UN.', 'TOTAL'];
    worksheet.getRow(3).font = { bold: true };
    worksheet.getRow(3).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'F4F4F4F4' }
    };

    // Dados
    data.items.forEach((item, index) => {
      worksheet.addRow([
        item.name,
        item.category,
        item.quantity,
        item.price,
        item.total
      ]);
    });

    // Totais
    const lastRow = data.items.length + 4;
    worksheet.getCell(`D${lastRow}`).value = 'TOTAL:';
    worksheet.getCell(`D${lastRow}`).font = { bold: true };
    worksheet.getCell(`E${lastRow}`).value = data.summary.totalValue;
    worksheet.getCell(`E${lastRow}`).font = { bold: true };

    await workbook.xlsx.writeFile(filepath);
  }

  return filepath;
}
