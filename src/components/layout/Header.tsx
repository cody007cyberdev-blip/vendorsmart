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
      {/* Restored Functional Header Row (Original Logic) */}
      <div className="h-12 px-8 flex items-center justify-between border-b border-gray-50 bg-white/50">
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

      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </div>
  );
}
