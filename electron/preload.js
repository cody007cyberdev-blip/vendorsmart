const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  // Autenticação
  login: (credentials) => ipcRenderer.invoke('auth:login', credentials),
  logout: () => ipcRenderer.invoke('auth:logout'),
  getMe: () => ipcRenderer.invoke('auth:me'),

  // Catálogo
  getItems: (filters) => ipcRenderer.invoke('catalog:get-items', filters),
  createItem: (item) => ipcRenderer.invoke('catalog:create-item', item),
  updateItem: (id, updates) => ipcRenderer.invoke('catalog:update-item', { id, updates }),
  deleteItem: (id) => ipcRenderer.invoke('catalog:delete-item', id),

  // Vendas
  createSale: (saleData) => ipcRenderer.invoke('sales:create', saleData),
  getSales: (filters) => ipcRenderer.invoke('sales:get-all', filters),

  // Relatórios
  generateReport: (data, type, reportType) => ipcRenderer.invoke('reports:generate', { data, type, reportType }),

  // Sistema
  getAppConfig: () => ipcRenderer.invoke('system:get-config'),
});
