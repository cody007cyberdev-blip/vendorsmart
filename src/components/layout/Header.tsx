import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Search, Plus, User, ChevronDown, ScanBarcode, Bell, PanelLeftClose, PanelLeftOpen, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CommandPalette } from "@/components/command/CommandPalette";
import { cn } from "@/lib/utils";

interface HeaderProps {
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}

export function Header({ sidebarCollapsed, onToggleSidebar }: HeaderProps) {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const navigate = useNavigate();

  // CMD+K / Ctrl+K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="flex flex-col w-full bg-white border-b border-gray-100 z-30">
      {/* Upper Header Row (Leonardo Fonseca) */}
      <div className="h-12 px-6 flex items-center justify-between border-b border-gray-50 bg-white/50">
        <div className="flex items-center gap-4 flex-1">
          {/* Sidebar Toggle Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onToggleSidebar}
            className="h-8 w-8 text-gray-400 hover:text-orange-500 hover:bg-orange-50 transition-colors"
          >
            {sidebarCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </Button>

          <div className="relative w-full max-w-sm group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600 transition-colors" />
            <Input 
              className="h-8 pl-9 pr-12 bg-gray-50/50 border-gray-100 focus:bg-white focus:ring-1 focus:ring-orange-500/20 transition-all text-[11px] rounded-lg" 
              placeholder="Search..." 
              onClick={() => setPaletteOpen(true)}
            />
            <kbd className="absolute right-2 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded border border-gray-200 bg-white font-mono text-[9px] text-gray-400 shadow-sm">
              ⌘K
            </kbd>
          </div>
          
          <div className="flex items-center gap-1.5 ml-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-sm">
              <ScanBarcode className="w-3.5 h-3.5 text-gray-500" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-sm">
              <Plus className="w-3.5 h-3.5 text-gray-500" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-900">
            <Bell className="w-4 h-4" />
          </Button>
          
          <div className="flex items-center gap-2.5 cursor-pointer group px-2 py-1 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="w-7 h-7 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden">
              <User className="w-3.5 h-3.5 text-gray-500" />
            </div>
            <span className="text-[11px] font-bold text-gray-700 group-hover:text-gray-900">Leonardo Fonseca</span>
            <ChevronDown className="w-3 h-3 text-gray-400 group-hover:text-gray-600" />
          </div>
        </div>
      </div>

      {/* Lower Header Row (Dashboard / João Almeida) */}
      <div className="h-16 px-6 flex items-center justify-between bg-white">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20 transition-transform hover:scale-105">
            <LayoutGridIcon className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-sm font-black tracking-tight uppercase text-gray-900 leading-none mb-1">Dashboard</h1>
            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.15em]">Real-time overview of inventory and operations</p>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="relative w-72 group hidden lg:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
            <Input 
              className="h-10 pl-11 bg-gray-100/50 border-none rounded-full text-xs focus:bg-white focus:ring-2 focus:ring-orange-500/10 transition-all" 
              placeholder="Search (Ctrl + K)" 
              onClick={() => setPaletteOpen(true)}
            />
          </div>

          <div className="flex items-center gap-5">
            <div className="relative cursor-pointer hover:scale-110 transition-transform">
              <Bell className="w-5 h-5 text-gray-400" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 text-white text-[8px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-sm">8</span>
            </div>
            <Button variant="ghost" size="icon" className="h-10 w-10 text-gray-400 hover:text-gray-900">
              <Settings className="w-5 h-5" />
            </Button>
            
            <div className="h-8 w-px bg-gray-100 mx-2" />
            
            <div className="flex items-center gap-3.5 pl-2">
              <div className="text-right">
                <p className="text-[11px] font-black text-gray-900 leading-none mb-1">João Almeida</p>
                <p className="text-[8px] text-gray-400 uppercase font-black tracking-widest">System Admin</p>
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-white shadow-md overflow-hidden transition-transform hover:scale-110 cursor-pointer">
                <img src="https://github.com/shadcn.png" alt="João Almeida" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </div>
  );
}

function LayoutGridIcon(props: any) {
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
      <rect width="7" height="7" x="3" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="14" rx="1" />
      <rect width="7" height="7" x="3" y="14" rx="1" />
    </svg>
  );
}
