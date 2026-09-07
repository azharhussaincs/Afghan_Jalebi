import React from 'react';
import {
  BarChart3,
  MapPin,
  Languages,
  Table,
  Search,
  BookOpen,
  GitFork,
  Flame
} from 'lucide-react';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  const navItems = [
    // Category 1: National Intelligence & GIS
    { id: 'overview', label: 'Executive Overview', icon: BarChart3, category: 'National Intelligence & GIS' },
    { id: 'geographic', label: '34-Province GIS & Cartography', icon: MapPin, category: 'National Intelligence & GIS', badge: '34 Prov' },
    { id: 'translation', label: 'Dual-Stream Translator', icon: Languages, category: 'National Intelligence & GIS', badge: 'NLLB' },

    // Category 2: Civil Archives & Special Registries
    { id: 'explorer', label: 'Civil Data Explorer', icon: Table, category: 'Civil Archives & Special Registries' },
    { id: 'search', label: 'Universal Search Hub', icon: Search, category: 'Civil Archives & Special Registries' },
    { id: 'books', label: 'Books & Page Explorer', icon: BookOpen, category: 'Civil Archives & Special Registries' },
    { id: 'relationships', label: 'Family Tree & Lineage', icon: GitFork, category: 'Civil Archives & Special Registries' }
  ];

  const categories = Array.from(new Set(navItems.map(item => item.category)));

  return (
    <aside className="w-64 border-r border-white/10 bg-[#090e1a]/95 backdrop-blur-2xl flex flex-col justify-between shrink-0 h-screen sticky top-0 overflow-y-auto">
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-white/10 flex items-center space-x-3 bg-[#05070d]/60">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 border border-emerald-400/40 flex items-center justify-center shadow-lg shadow-emerald-500/25">
            <Flame className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-extrabold text-sm text-white tracking-wider flex items-center gap-1.5">
              KOCHI MANAGER
            </h2>
            <p className="text-[10px] text-emerald-400 font-mono tracking-tight">NSIA Matrix • SQLite WAL</p>
          </div>
        </div>

        {/* Navigation Categories */}
        <div className="p-3 space-y-5">
          {categories.map(category => (
            <div key={category} className="space-y-1">
              <h3 className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">
                {category}
              </h3>
              {navItems.filter(item => item.category === category).map(item => {
                const Icon = item.icon;
                const isActive = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveView(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/30 border border-emerald-400/30'
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.05] border border-transparent'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                        isActive
                          ? 'bg-black/30 text-emerald-200'
                          : 'bg-white/5 text-slate-400 border border-white/5'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Footer Info & Telemetry Status */}
      <div className="p-4 border-t border-white/10 bg-[#05070d]/80 text-[11px] text-slate-400">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-[10px] font-bold text-emerald-400">SYSTEM ONLINE</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">WAL Sync</span>
        </div>
        <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
          <span>24,399,444 Rows</span>
          <span>Zero Loss</span>
        </div>
      </div>
    </aside>
  );
};
