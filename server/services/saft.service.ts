import { db } from "../db";
import { users, products, taxes, financialDocuments } from "../db/schema";
import { eq } from "drizzle-orm";

/**
 * VendorSmart - SAF-T PT Generator (Simplified)
 * Gera a estrutura base XML para conformidade com a Autoridade Tributária de Portugal.
 */
export class SaftService {
  async generateSaftXml(startDate: string, endDate: string): Promise<string> {
    const customers = await db.select().from(users).where(eq(users.role, "customer"));
    const allProducts = await db.select().from(products);
    const allTaxes = await db.select().from(taxes);
    const invoices = await db.select().from(financialDocuments);

    let xml = `<?xml version="1.0" encoding="Windows-1252"?>
<AuditFile xmlns="urn:OECD:StandardAuditFile-Tax:PT_1.04_01">
  <Header>
    <AuditFileVersion>1.04_01</AuditFileVersion>
    <CompanyID>500000000</CompanyID>
    <TaxRegistrationNumber>500000000</TaxRegistrationNumber>
    <TaxAccountingBasis>F</TaxAccountingBasis>
    <CompanyName>VendorSmart Professional Enterprise</CompanyName>
    <BusinessName>VendorSmart</BusinessName>
    <CompanyAddress>
      <AddressDetail>Avenida da Liberdade, 100</AddressDetail>
      <City>Lisboa</City>
      <PostalCode>1000-001</PostalCode>
      <Country>PT</Country>
    </CompanyAddress>
    <FiscalYear>2026</FiscalYear>
    <StartDate>${startDate}</StartDate>
    <EndDate>${endDate}</EndDate>
    <CurrencyCode>EUR</CurrencyCode>
    <DateCreated>${new Date().toISOString().split('T')[0]}</DateCreated>
    <TaxEntity>Global</TaxEntity>
    <ProductCompanyID>VendorSmart-Dev</ProductCompanyID>
    <SoftwareCertificateNumber>0000</SoftwareCertificateNumber>
  </Header>
  <MasterFiles>
    <Customer>`;
    
    customers.forEach(c => {
      xml += `
      <Customer>
        <CustomerID>${c.id}</CustomerID>
        <AccountID>Unknown</AccountID>
        <CustomerTaxID>999999990</CustomerTaxID>
        <CompanyName>${c.name}</CompanyName>
        <BillingAddress>
          <AddressDetail>Address</AddressDetail>
          <City>City</City>
          <PostalCode>0000-000</PostalCode>
          <Country>PT</Country>
        </BillingAddress>
        <SelfBillingIndicator>0</SelfBillingIndicator>
      </Customer>`;
    });

    xml += `
    </Customer>
    <Product>`;

    allProducts.forEach(p => {
      xml += `
      <Product>
        <ProductType>P</ProductType>
        <ProductCode>${p.sku}</ProductCode>
        <ProductDescription>${p.name}</ProductDescription>
        <ProductNumberCode>${p.sku}</ProductNumberCode>
      </Product>`;
    });

    xml += `
    </Product>
    <TaxTable>`;

    allTaxes.forEach(t => {
      xml += `
      <TaxTableEntry>
        <TaxType>IVA</TaxType>
        <TaxCountryRegion>PT</TaxCountryRegion>
        <TaxCode>NOR</TaxCode>
        <Description>${t.name}</Description>
        <TaxPercentage>${t.rate}</TaxPercentage>
      </TaxTableEntry>`;
    });

    xml += `
    </TaxTable>
  </MasterFiles>
  <SourceDocuments>
    <SalesInvoices>
      <NumberOfEntries>${invoices.length}</NumberOfEntries>
      <TotalDebit>0.00</TotalDebit>
      <TotalCredit>${invoices.reduce((acc, inv) => acc + inv.total, 0).toFixed(2)}</TotalCredit>`;

    invoices.forEach(inv => {
      xml += `
      <Invoice>
        <InvoiceNo>${inv.number}</InvoiceNo>
        <DocumentStatus>
          <InvoiceStatus>N</InvoiceStatus>
          <InvoiceStatusDate>${inv.createdAt}</InvoiceStatusDate>
          <SourceID>1</SourceID>
          <SourceBilling>P</SourceBilling>
        </DocumentStatus>
        <Hash>0</Hash>
        <HashControl>1</HashControl>
        <Period>1</Period>
        <InvoiceDate>${inv.createdAt.split(' ')[0]}</InvoiceDate>
        <InvoiceType>FT</InvoiceType>
        <SelfBillingIndicator>0</SelfBillingIndicator>
        <SystemEntryDate>${inv.createdAt}</SystemEntryDate>
        <CustomerID>${inv.entityId}</CustomerID>
        <Line>
          <LineNumber>1</LineNumber>
          <ProductCode>SERVICE</ProductCode>
          <ProductDescription>Document Total</ProductDescription>
          <Quantity>1</Quantity>
          <UnitOfMeasure>un</UnitOfMeasure>
          <UnitPrice>${inv.subtotal}</UnitPrice>
          <TaxPointDate>${inv.createdAt.split(' ')[0]}</TaxPointDate>
          <Description>Total</Description>
          <CreditAmount>${inv.subtotal}</CreditAmount>
          <Tax>
            <TaxType>IVA</TaxType>
            <TaxCountryRegion>PT</TaxCountryRegion>
            <TaxCode>NOR</TaxCode>
            <TaxPercentage>23.00</TaxPercentage>
          </Tax>
          <SettlementAmount>0.00</SettlementAmount>
        </Line>
        <DocumentTotals>
          <TaxPayable>${inv.taxAmount}</TaxPayable>
          <NetTotal>${inv.subtotal}</NetTotal>
          <GrossTotal>${inv.total}</GrossTotal>
        </DocumentTotals>
      </Invoice>`;
    });

    xml += `
    </SalesInvoices>
  </SourceDocuments>
</AuditFile>`;

    return xml;
  }
}
