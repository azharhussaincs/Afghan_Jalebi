import React, { useState } from 'react';
import { Search, Database, RefreshCw, Download, Layers, ShieldCheck } from 'lucide-react';
import { useFilters } from '../../context/FilterContext';

interface HeaderProps {
  onExportClick: () => void;
  activeView: string;
  onSearchSubmit?: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onExportClick, activeView, onSearchSubmit }) => {
  const { filters, setSearchQuery, activeFilterCount, triggerRefresh } = useFilters();
  const [searchInput, setSearchInput] = useState(filters.search_query || '');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchInput);
    if (onSearchSubmit) {
      onSearchSubmit(searchInput);
    }
  };

  const getTitle = () => {
    switch (activeView) {
      case 'overview': return 'Executive Overview';
      case 'search': return 'Universal Search & Filter Hub';
      case 'explorer': return 'Enterprise Data Explorer';
      case 'geographic': return 'Geographic & Regional Analytics';
      case 'demographics': return 'Demographic & Cohort Intelligence';
      case 'books': return 'Registry Volumes & Page Explorer';
      case 'relationships': return 'Statistical Relationship & Correlation Lab';
      case 'quality': return 'Data Quality & Integrity Center';
      case 'dictionary': return 'Data Dictionary & Schema Specification';
      case 'reports': return 'Ingestion Audit & Technical Report';
      default: return 'Data Exploration Platform';
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md px-6 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-brand-500/20">
            <Database className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-100 tracking-tight flex items-center gap-2">
              {getTitle()}
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20">
                24.4M Records
              </span>
            </h1>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Global Quick Search Form */}
        <form onSubmit={handleSearchSubmit} className="relative w-80">
          <input
            type="text"
            placeholder="Global search (Name, Hash, District, ID)..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-sm bg-slate-900/90 border border-slate-700/60 rounded-lg text-slate-200 placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          {searchInput && (
            <button
              type="button"
              onClick={() => { setSearchInput(''); setSearchQuery(''); }}
              className="absolute right-2.5 top-2 text-xs text-slate-400 hover:text-slate-200"
            >
              ✕
            </button>
          )}
        </form>

        {/* Action Buttons */}
        <button
          onClick={triggerRefresh}
          className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-all hover:text-white"
          title="Refresh Data & KPIs"
        >
          <RefreshCw className="w-4 h-4" />
        </button>

        <button
          onClick={onExportClick}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-sm font-medium shadow-md shadow-brand-600/20 transition-all"
        >
          <Download className="w-4 h-4" />
          <span>Export</span>
        </button>
      </div>
    </header>
  );
};
