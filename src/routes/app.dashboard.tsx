import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { 
  Package, 
  Tag, 
  RefreshCcw, 
  AlertTriangle, 
  XCircle, 
  Search, 
  Bell, 
  Settings, 
  ChevronDown,
  LayoutGrid,
  BarChart3,
  Calendar,
  Filter,
  BarChart,
  PlusCircle,
  Hammer,
  ShoppingCart,
  ArrowLeftRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/dashboard")({
  component: DashboardPage,
  head: () => ({ meta: [{ title: "Dashboard — VendorSmart Enterprise" }] }),
});

function DashboardPage() {
  return (
    <div className="flex flex-col h-full bg-background overflow-hidden">
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="max-w-[1600px] mx-auto space-y-8">
          
          {/* Top Controls */}
          <div className="flex justify-end gap-3">
            <div className="flex items-center gap-2 bg-white border rounded-lg px-3 py-2 shadow-sm">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs font-bold">01/05/2025 - 31/05/2025</span>
              <ChevronDown className="w-3 h-3 text-muted-foreground" />
            </div>
            <Button className="bg-primary hover:bg-primary/90 gap-2 h-10 font-bold uppercase text-[10px] tracking-widest shadow-lg shadow-primary/20">
              <Settings className="w-3.5 h-3.5" />
              Customize
              <ChevronDown className="w-3 h-3" />
            </Button>
          </div>

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <Card className="bg-sidebar text-sidebar-foreground border-none shadow-2xl">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-sidebar-foreground/50 mb-1">Total Inventory Value</p>
                    <h3 className="text-2xl font-black">€2,657,890.45</h3>
                  </div>
                  <div className="p-2 bg-sidebar-accent rounded-lg">
                    <BarChart3 className="w-5 h-5 text-primary" />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold">
                  <span className="text-green-400">↑ 12.4%</span>
                  <span className="text-sidebar-foreground/30 uppercase tracking-widest">vs Apr 2025</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-none shadow-sm">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Total SKUs</p>
                    <h3 className="text-2xl font-black">8,842</h3>
                  </div>
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Tag className="w-5 h-5 text-primary" />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold">
                  <span className="text-green-500">↑ 7.3%</span>
                  <span className="text-muted-foreground/50 uppercase tracking-widest">vs Apr 2025</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-none shadow-sm">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Stock Turnover (YTD)</p>
                    <h3 className="text-2xl font-black">5.68x</h3>
                  </div>
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <RefreshCcw className="w-5 h-5 text-primary" />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold">
                  <span className="text-green-500">↑ 9.1%</span>
                  <span className="text-muted-foreground/50 uppercase tracking-widest">vs Apr 2025</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-none shadow-sm">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Low Stock Items</p>
                    <h3 className="text-2xl font-black">128</h3>
                  </div>
                  <div className="p-2 bg-red-50 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-destructive" />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold">
                  <span className="text-destructive">↓ 8.6%</span>
                  <span className="text-muted-foreground/50 uppercase tracking-widest">vs Apr 2025</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-none shadow-sm">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Stockout Items</p>
                    <h3 className="text-2xl font-black">32</h3>
                  </div>
                  <div className="p-2 bg-red-50 rounded-lg">
                    <XCircle className="w-5 h-5 text-destructive" />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold">
                  <span className="text-destructive">↓ 11.4%</span>
                  <span className="text-muted-foreground/50 uppercase tracking-widest">vs Apr 2025</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-1 bg-white border-none shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between border-b pb-4 px-6">
                <CardTitle className="text-[11px] font-black uppercase tracking-widest">Stock Movement</CardTitle>
                <div className="flex gap-2">
                  <div className="bg-muted/30 p-1 rounded-md flex">
                    <div className="bg-white px-2 py-1 rounded shadow-sm text-[9px] font-bold">Daily</div>
                    <ChevronDown className="w-3 h-3 m-1 text-muted-foreground" />
                  </div>
                  <BarChart className="w-4 h-4 text-muted-foreground" />
                  <Filter className="w-4 h-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent className="p-6 h-[300px] flex items-center justify-center">
                <div className="w-full h-full bg-slate-50 rounded flex flex-col items-center justify-center border-2 border-dashed">
                  <BarChart3 className="w-8 h-8 text-muted-foreground/20 mb-2" />
                  <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">Interactive Movement Chart</p>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-1 bg-white border-none shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between border-b pb-4 px-6">
                <CardTitle className="text-[11px] font-black uppercase tracking-widest">Inventory Value by Category</CardTitle>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-bold text-muted-foreground uppercase">This Month</span>
                  <ChevronDown className="w-3 h-3 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent className="p-6 flex flex-col items-center">
                <div className="relative w-48 h-48 mb-6">
                  <div className="absolute inset-0 rounded-full border-[12px] border-primary border-t-transparent border-l-transparent rotate-45" />
                  <div className="absolute inset-0 rounded-full border-[12px] border-sidebar border-b-transparent border-r-transparent -rotate-12 opacity-50" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-black">€2.66M</span>
                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Total</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-x-8 gap-y-2 w-full">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <span className="text-[9px] font-bold uppercase tracking-widest">Raw Materials</span>
                    </div>
                    <span className="text-[9px] font-black">€1.12M (42.1%)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-sidebar" />
                      <span className="text-[9px] font-bold uppercase tracking-widest">Finished Goods</span>
                    </div>
                    <span className="text-[9px] font-black">€0.85M (31.9%)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-1 bg-white border-none shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between border-b pb-4 px-6">
                <CardTitle className="text-[11px] font-black uppercase tracking-widest">Top Low Stock Items</CardTitle>
                <Button variant="link" className="text-[9px] font-black uppercase tracking-widest text-primary p-0 h-auto">View all</Button>
              </CardHeader>
              <CardContent className="p-0">
                <table className="w-full">
                  <thead className="bg-muted/10 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-[8px] font-black uppercase tracking-widest text-muted-foreground">Item</th>
                      <th className="px-6 py-3 text-center text-[8px] font-black uppercase tracking-widest text-muted-foreground">On Hand</th>
                      <th className="px-6 py-3 text-center text-[8px] font-black uppercase tracking-widest text-muted-foreground">Min. Level</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {[
                      { name: "P-1001 - Bearing 6204", stock: 2, min: 20 },
                      { name: "P-1050 - Seal Ring", stock: 5, min: 30 },
                      { name: "P-2003 - Electric Motor 1.5kW", stock: 1, min: 10 },
                      { name: "P-3002 - Gearbox WGA-40", stock: 0, min: 5 },
                      { name: "P-4001 - Hydraulic Pump", stock: 3, min: 8 },
                    ].map((item, i) => (
                      <tr key={i} className="hover:bg-muted/5">
                        <td className="px-6 py-3 text-[10px] font-bold">{item.name}</td>
                        <td className="px-6 py-3 text-center text-[10px] font-black text-destructive">{item.stock}</td>
                        <td className="px-6 py-3 text-center text-[10px] font-bold text-muted-foreground">{item.min}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>

          {/* Bottom Grid Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-24">
            <Card className="bg-white border-none shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between border-b pb-4 px-6">
                <CardTitle className="text-[11px] font-black uppercase tracking-widest">Inventory Value Trend</CardTitle>
                <div className="flex items-center gap-2 bg-muted/20 px-2 py-1 rounded">
                  <span className="text-[9px] font-bold uppercase">This Month</span>
                  <ChevronDown className="w-3 h-3" />
                </div>
              </CardHeader>
              <CardContent className="p-6 h-[250px] flex items-end">
                <div className="w-full h-full flex items-end gap-1">
                  {[40, 45, 38, 52, 60, 58, 65, 72, 68, 80, 85, 82, 90, 95, 88, 100].map((h, i) => (
                    <div key={i} className="flex-1 bg-primary/20 hover:bg-primary transition-colors rounded-t-sm" style={{ height: `${h}%` }} />
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-none shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between border-b pb-4 px-6">
                <CardTitle className="text-[11px] font-black uppercase tracking-widest">ABC Classification (by Value)</CardTitle>
                <AlertTriangle className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="p-0">
                <table className="w-full">
                  <thead className="bg-muted/10 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-[8px] font-black uppercase tracking-widest text-muted-foreground">Class</th>
                      <th className="px-6 py-3 text-center text-[8px] font-black uppercase tracking-widest text-muted-foreground">SKUs</th>
                      <th className="px-6 py-3 text-center text-[8px] font-black uppercase tracking-widest text-muted-foreground">% of SKUs</th>
                      <th className="px-6 py-3 text-right text-[8px] font-black uppercase tracking-widest text-muted-foreground">Value</th>
                      <th className="px-6 py-3 text-right text-[8px] font-black uppercase tracking-widest text-muted-foreground">% of Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {[
                      { class: "A", skus: 732, skuPerc: "8.3%", value: "€1,592,340", valPerc: "59.9%", color: "bg-primary" },
                      { class: "B", skus: 2124, skuPerc: "24.0%", value: "€828,710", valPerc: "31.2%", color: "bg-sidebar" },
                      { class: "C", skus: 5986, skuPerc: "67.7%", value: "€236,840", valPerc: "8.9%", color: "bg-muted-foreground" },
                    ].map((row, i) => (
                      <tr key={i} className="hover:bg-muted/5">
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-2">
                            <div className={cn("w-1.5 h-1.5 rounded-full", row.color)} />
                            <span className="text-[10px] font-black">{row.class}</span>
                          </div>
                        </td>
                        <td className="px-6 py-3 text-center text-[10px] font-bold">{row.skus}</td>
                        <td className="px-6 py-3 text-center text-[10px] font-bold text-muted-foreground">{row.skuPerc}</td>
                        <td className="px-6 py-3 text-right text-[10px] font-black">{row.value}</td>
                        <td className="px-6 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <span className="text-[10px] font-black">{row.valPerc}</span>
                            <div className="w-16 h-1 bg-muted rounded-full overflow-hidden">
                              <div className={cn("h-full", row.color)} style={{ width: row.valPerc }} />
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Floating Action Bar */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-sidebar/90 backdrop-blur-md border border-sidebar-border rounded-2xl shadow-2xl p-2 flex items-center gap-2">
          <div className="flex items-center gap-2 px-4 border-r border-sidebar-border mr-2">
            <Zap className="w-4 h-4 text-primary animate-pulse-orange" />
            <span className="text-[10px] font-black text-white uppercase tracking-widest">Quick Actions</span>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10 gap-2 h-9 px-4 rounded-xl text-[10px] font-bold uppercase tracking-widest">
              <PlusCircle className="w-3.5 h-3.5" />
              New Purchase Order
            </Button>
            <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10 gap-2 h-9 px-4 rounded-xl text-[10px] font-bold uppercase tracking-widest">
              <Hammer className="w-3.5 h-3.5" />
              New Production Order
            </Button>
            <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10 gap-2 h-9 px-4 rounded-xl text-[10px] font-bold uppercase tracking-widest">
              <ShoppingCart className="w-3.5 h-3.5" />
              New Sales Order
            </Button>
            <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10 gap-2 h-9 px-4 rounded-xl text-[10px] font-bold uppercase tracking-widest">
              <ArrowLeftRight className="w-3.5 h-3.5" />
              Inventory Transfer
            </Button>
          </div>
          <Button className="bg-primary hover:bg-primary/90 text-white gap-2 h-9 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest ml-4">
            <BarChart3 className="w-3.5 h-3.5" />
            View Reports
          </Button>
        </div>
      </div>
    </div>
  );
}

const Zap = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14.5 14 3l-2 9h8L10 21l2-9H4Z"/></svg>
);
