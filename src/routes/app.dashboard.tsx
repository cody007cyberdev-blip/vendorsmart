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
  PlusCircle,
  Hammer,
  ShoppingCart,
  ArrowLeftRight,
  BarChart3,
  Calendar,
  Filter,
  BarChart,
  LayoutGrid
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/dashboard")({
  component: DashboardPage,
  head: () => ({ meta: [{ title: "Dashboard — VendorSmart Enterprise" }] }),
});

function DashboardPage() {
  return (
    <div className="flex flex-col h-full bg-[#F8F9FA] overflow-hidden">
      {/* Top Header Bar */}
      <header className="h-16 bg-white border-b flex items-center justify-between px-8 shrink-0">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-orange-500 rounded-lg">
            <LayoutGrid className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight uppercase">Dashboard</h1>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Real-time overview of inventory and operations</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input className="pl-10 h-10 bg-muted/20 border-none rounded-full text-xs" placeholder="Search (Ctrl + K)" />
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center border-2 border-white">8</span>
            </div>
            <Settings className="w-5 h-5 text-muted-foreground" />
            <div className="flex items-center gap-3 pl-4 border-l">
              <div className="text-right">
                <p className="text-xs font-bold">João Almeida</p>
                <p className="text-[9px] text-muted-foreground uppercase font-black">System Admin</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-200 border overflow-hidden">
                <img src="https://github.com/shadcn.png" alt="Avatar" />
              </div>
            </div>
          </div>
        </div>
      </header>

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
            <Button className="bg-orange-500 hover:bg-orange-600 gap-2 h-10 font-bold uppercase text-[10px] tracking-widest shadow-lg shadow-orange-500/20">
              <Settings className="w-3.5 h-3.5" />
              Customize
              <ChevronDown className="w-3 h-3" />
            </Button>
          </div>

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <Card className="bg-[#1A1A1A] text-white border-none shadow-2xl">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-1">Total Inventory Value</p>
                    <h3 className="text-2xl font-black">€2,657,890.45</h3>
                  </div>
                  <div className="p-2 bg-white/10 rounded-lg">
                    <BarChart3 className="w-5 h-5 text-orange-500" />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold">
                  <span className="text-green-400">↑ 12.4%</span>
                  <span className="text-white/30 uppercase tracking-widest">vs Apr 2025</span>
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
                  <div className="p-2 bg-orange-50 rounded-lg">
                    <Tag className="w-5 h-5 text-orange-500" />
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
                  <div className="p-2 bg-orange-50 rounded-lg">
                    <RefreshCcw className="w-5 h-5 text-orange-500" />
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
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold">
                  <span className="text-red-500">↓ 8.6%</span>
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
                    <XCircle className="w-5 h-5 text-red-500" />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold">
                  <span className="text-red-500">↓ 11.4%</span>
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
                  <div className="absolute inset-0 rounded-full border-[12px] border-orange-500 border-t-transparent border-l-transparent rotate-45" />
                  <div className="absolute inset-0 rounded-full border-[12px] border-purple-500 border-b-transparent border-r-transparent -rotate-12 opacity-50" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-black">€2.66M</span>
                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Total</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-x-8 gap-y-2 w-full">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-orange-500" />
                      <span className="text-[9px] font-bold uppercase tracking-widest">Raw Materials</span>
                    </div>
                    <span className="text-[9px] font-black">€1.12M (42.1%)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-black" />
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
                <Button variant="link" className="text-[9px] font-black uppercase tracking-widest text-orange-500 p-0 h-auto">View all</Button>
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
                        <td className="px-6 py-3 text-center text-[10px] font-black text-red-500">{item.stock}</td>
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
                <div className="w-full h-full relative overflow-hidden rounded bg-orange-50/30 border border-orange-100">
                  <div className="absolute inset-0 bg-gradient-to-t from-orange-500/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 h-[60%] border-t-2 border-orange-500 flex items-center justify-center">
                     <span className="text-[9px] font-black uppercase tracking-[0.3em] text-orange-500/30">Growth Trend Visualization</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-none shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between border-b pb-4 px-6">
                <CardTitle className="text-[11px] font-black uppercase tracking-widest">ABC Classification (by Value)</CardTitle>
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
                  <tbody className="divide-y text-[10px]">
                    {[
                      { class: "A", skus: "732", percSkus: "8.3%", val: "€1,592,340", percVal: "59.9%", color: "bg-orange-500" },
                      { class: "B", skus: "2,124", percSkus: "24.0%", val: "€828,710", percVal: "31.2%", color: "bg-orange-300" },
                      { class: "C", skus: "5,986", percSkus: "67.7%", val: "€236,840", percVal: "8.9%", color: "bg-orange-100" },
                    ].map((row, i) => (
                      <tr key={i}>
                        <td className="px-6 py-4 font-black">{row.class}</td>
                        <td className="px-6 py-4 text-center font-bold">{row.skus}</td>
                        <td className="px-6 py-4 text-center font-bold text-muted-foreground">{row.percSkus}</td>
                        <td className="px-6 py-4 text-right font-black">{row.val}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-3">
                            <span className="font-black">{row.percVal}</span>
                            <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                              <div className={cn("h-full", row.color)} style={{ width: row.percVal }} />
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-muted/5 border-t">
                    <tr className="text-[10px] font-black">
                      <td className="px-6 py-4">Total</td>
                      <td className="px-6 py-4 text-center">8,842</td>
                      <td className="px-6 py-4 text-center text-muted-foreground">100%</td>
                      <td className="px-6 py-4 text-right">€2,657,890</td>
                      <td className="px-6 py-4 text-right">100%</td>
                    </tr>
                  </tfoot>
                </table>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Floating Bottom Quick Actions Bar */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-[#1A1A1A] text-white border border-white/10 shadow-2xl rounded-xl p-2 px-6 z-50">
        <div className="flex items-center gap-2 px-4 border-r border-white/10 mr-2">
          <Zap className="w-4 h-4 text-orange-500" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Quick Actions</span>
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" className="h-10 rounded-lg text-[9px] font-bold uppercase tracking-widest hover:bg-white/10 gap-2">
            <FileText className="w-3.5 h-3.5" />
            New Purchase Order
          </Button>
          <Button variant="ghost" className="h-10 rounded-lg text-[9px] font-bold uppercase tracking-widest hover:bg-white/10 gap-2">
            <Hammer className="w-3.5 h-3.5" />
            New Production Order
          </Button>
          <Button variant="ghost" className="h-10 rounded-lg text-[9px] font-bold uppercase tracking-widest hover:bg-white/10 gap-2">
            <ShoppingCart className="w-3.5 h-3.5" />
            New Sales Order
          </Button>
          <Button variant="ghost" className="h-10 rounded-lg text-[9px] font-bold uppercase tracking-widest hover:bg-white/10 gap-2">
            <Settings className="w-3.5 h-3.5" />
            Stock Adjustment
          </Button>
          <Button variant="ghost" className="h-10 rounded-lg text-[9px] font-bold uppercase tracking-widest hover:bg-white/10 gap-2">
            <ArrowLeftRight className="w-3.5 h-3.5" />
            Inventory Transfer
          </Button>
        </div>
        <div className="h-6 w-px bg-white/10 mx-4" />
        <Button className="bg-orange-500 hover:bg-orange-600 h-10 rounded-lg px-6 gap-2 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-orange-500/20">
          <BarChart3 className="w-4 h-4" />
          View Reports
        </Button>
      </div>
    </div>
  );
}

function Zap(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 14.71 13.29 4.1a1 1 0 0 1 1.54 1.28L10.29 12h8.71a1 1 0 0 1 .83 1.56L10.71 23.9a1 1 0 0 1-1.54-1.28L13.71 16H5a1 1 0 0 1-.83-1.56Z" />
    </svg>
  );
}

function FileText(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M10 9H8" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
    </svg>
  );
}
