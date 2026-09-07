import React, { useState, useEffect } from 'react';
import { Search, Database, RefreshCw, Download, X, ArrowRight } from 'lucide-react';
import { useFilters } from '../../context/FilterContext';

interface HeaderProps {
  onExportClick: () => void;
  activeView: string;
  onSearchSubmit?: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onExportClick, activeView, onSearchSubmit }) => {
  const { filters, setSearchQuery, triggerRefresh } = useFilters();
  const [searchInput, setSearchInput] = useState(filters.search_query || '');

  // Keep search input synchronized with global filter state
  useEffect(() => {
    setSearchInput(filters.search_query || '');
  }, [filters.search_query]);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = searchInput.trim();
    setSearchQuery(query || undefined);
    if (onSearchSubmit) {
      onSearchSubmit(query);
    }
  };

  const getTitle = () => {
    switch (activeView) {
      case 'overview': return 'Executive Overview';
      case 'gis_cartography': return '34-Province Geocartography GIS Matrix';
      case 'translation': return 'Parallel Dual-Stream Neural Translator';
      case 'search': return 'Universal Search & Filter Hub';
      case 'explorer': return 'Civil Archives Data Explorer';
      case 'geographic': return 'Geographic & Regional Analytics';
      case 'books': return 'Registry Volumes & Page Explorer';
      case 'relationships': return 'Family Tree & Lineage Intelligence Lab';
      default: return 'Civil Registry & GIS Intelligence Platform';
    }
  };

  return (
    <header className="sticky top-0 z-30 flex flex-col border-b border-white/10 bg-[#05070d]/90 backdrop-blur-2xl transition-all">
      
      {/* Top Tier: Brand, Active View Indicator, Universal Search & Telemetry Controls */}
      <div className="h-16 px-6 flex items-center justify-between gap-4">
        
        {/* Brand & View Context */}
        <div className="flex items-center space-x-3.5 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/30 to-emerald-900/60 border border-emerald-500/50 flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
            <Database className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-extrabold text-white tracking-tight truncate">
                {getTitle()}
              </h1>
              <span className="hidden sm:inline-flex text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shrink-0">
                24.4M Records
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden md:block">
              NSIA Archives • Civil Registry, Biometrics &amp; National Cartography
            </p>
          </div>
        </div>

        {/* Global Quick Search Form & Action Controls */}
        <div className="flex items-center space-x-3 shrink-0">
          
          <form
            onSubmit={handleSearchSubmit}
            className="relative flex items-center w-64 sm:w-80 md:w-96 bg-[#12192a]/85 border border-white/10 hover:border-white/20 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/25 rounded-xl p-1 shadow-inner transition-all group"
          >
            <Search className="w-4 h-4 text-slate-400 group-focus-within:text-emerald-400 ml-2.5 mr-2 shrink-0 transition-colors" />

            <input
              type="text"
              placeholder="Search Name, ID, City, Father, Hash..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="flex-1 bg-transparent text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none min-w-0 pr-2"
            />

            {searchInput && (
              <button
                type="button"
                onClick={() => {
                  setSearchInput('');
                  setSearchQuery(undefined);
                }}
                className="p-1 rounded-md text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors mr-1 shrink-0"
                title="Clear search query"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              type="submit"
              className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:from-emerald-700 active:to-teal-700 text-white text-xs font-semibold rounded-lg shadow-sm shadow-emerald-600/30 hover:shadow-emerald-500/50 transition-all shrink-0 cursor-pointer"
              title="Search dataset (Enter ↵)"
            >
              <span>Search</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </form>

          {/* System Online Status Pill */}
          <div className="hidden lg:inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-full font-mono text-xs font-semibold text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Online</span>
          </div>

          {/* Action Buttons */}
          <button
            onClick={triggerRefresh}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-all hover:text-white"
            title="Refresh Data &amp; KPIs"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={onExportClick}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white text-xs font-semibold shadow-md shadow-emerald-600/25 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>

        </div>
      </div>

    </header>
  );
};
