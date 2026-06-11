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
      {/* Refined Professional Header Row */}
      <div className="h-16 px-6 flex items-center justify-between bg-white">
        <div className="flex items-center gap-4 flex-1">
          {/* Sidebar Toggle Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onToggleSidebar}
            className="h-9 w-9 text-gray-400 hover:text-orange-500 hover:bg-orange-50 transition-colors"
          >
            {sidebarCollapsed ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
          </Button>

          <div className="flex items-center gap-4 ml-2">
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20 transition-transform hover:scale-105">
              <LayoutGridIcon className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-sm font-black tracking-tight uppercase text-gray-900 leading-none mb-1">Dashboard</h1>
              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.15em]">Real-time overview of inventory and operations</p>
            </div>
          </div>

          <div className="h-8 w-px bg-gray-100 mx-4 hidden lg:block" />

          <div className="relative w-full max-w-sm group hidden lg:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
            <Input 
              className="h-10 pl-11 bg-gray-100/50 border-none rounded-full text-xs focus:bg-white focus:ring-2 focus:ring-orange-500/10 transition-all" 
              placeholder="Search (Ctrl + K)" 
              onClick={() => setPaletteOpen(true)}
            />
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5 mr-2">
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-sm">
              <ScanBarcode className="w-4 h-4 text-gray-500" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-sm">
              <Plus className="w-4 h-4 text-gray-500" />
            </Button>
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
            
            <div className="flex items-center gap-3.5 pl-2 group cursor-pointer">
              <div className="text-right">
                <p className="text-[11px] font-black text-gray-900 leading-none mb-1 group-hover:text-orange-500 transition-colors">João Almeida</p>
                <p className="text-[8px] text-gray-400 uppercase font-black tracking-widest">System Admin</p>
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-white shadow-md overflow-hidden transition-transform group-hover:scale-110">
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
