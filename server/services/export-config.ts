/**
 * VendorSmart - Enterprise Export Engine Configuration
 * Define os parâmetros avançados para geração de documentos profissionais.
 */
export const EXPORT_CONFIG = {
  pdf: {
    quality: "print", // standard | high | print (300 DPI)
    margins: {
      top: 20,    // mm
      bottom: 20, // mm
      left: 15,   // mm
      right: 15   // mm
    },
    metadata: {
      author: "VendorSmart Enterprise Engine",
      company: "VendorSmart Professional",
      subject: "Inventory & Fiscal Report",
      keywords: ["ERP", "SAF-T", "Inventory", "BOM", "Portugal"]
    },
    branding: {
      primaryColor: "#FF6B00", // Laranja VendorSmart
      secondaryColor: "#1A1A1A", // Preto Profissional
      logoPosition: "top-right"
    }
  },
  saft: {
    version: "1.04_01",
    charset: "Windows-1252",
    certificateNumber: "0000/AT",
    softwareCompany: "VendorSmart Dev Solutions"
  }
};
