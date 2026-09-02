import React from 'react';
import {
  BarChart3,
  Search,
  Table,
  MapPin,
  BookOpen,
  GitFork,
  CheckCircle2,
  FileText,
  Flame
} from 'lucide-react';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  const navItems = [
    { id: 'overview', label: 'Executive Overview', icon: BarChart3, category: 'Analytics' },
    { id: 'geographic', label: 'Geographic Insights', icon: MapPin, category: 'Analytics' },
    { id: 'books', label: 'Books & Page Explorer', icon: BookOpen, category: 'Analytics' },
    { id: 'relationships', label: 'Family Tree & Lineage', icon: GitFork, category: 'Analytics' },
    { id: 'explorer', label: 'Data Explorer', icon: Table, category: 'Data Operations' },
    { id: 'search', label: 'Universal Search Hub', icon: Search, category: 'Data Operations' },
    { id: 'quality', label: 'Data Quality Center', icon: CheckCircle2, category: 'Quality & Docs' },
    { id: 'reports', label: 'Audit & Ingestion', icon: FileText, category: 'Quality & Docs' }
  ];

  const categories = Array.from(new Set(navItems.map(item => item.category)));

  return (
    <aside className="w-64 border-r border-slate-800/80 bg-slate-950 flex flex-col justify-between shrink-0 h-screen sticky top-0 overflow-y-auto">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800/60 flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-brand-500/25">
            <Flame className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-sm text-slate-100 tracking-wide">DATA EXPLORER</h2>
            <p className="text-[11px] text-slate-400 font-mono">v1.0.0 • SQLite WAL</p>
          </div>
        </div>

        {/* Navigation Categories */}
        <div className="p-4 space-y-6">
          {categories.map(category => (
            <div key={category} className="space-y-1">
              <h3 className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                {category}
              </h3>
              {navItems.filter(item => item.category === category).map(item => {
                const Icon = item.icon;
                const isActive = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveView(item.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800/60 text-[11px] text-slate-400">
        <div className="flex items-center justify-between mb-1">
          <span className="font-mono text-[10px] text-emerald-400">● SYSTEM ONLINE</span>
          <span className="text-[10px]">Zero Data Loss</span>
        </div>
        <p className="text-[10px] text-slate-400">Original UTF-16 Source Verified</p>
      </div>
    </aside>
  );
};
