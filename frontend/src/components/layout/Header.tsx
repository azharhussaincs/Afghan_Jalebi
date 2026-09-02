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

  // Keep search input in sync with external filter updates
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
      case 'search': return 'Universal Search & Filter Hub';
      case 'explorer': return 'Enterprise Data Explorer';
      case 'geographic': return 'Geographic & Regional Analytics';
      case 'demographics': return 'Demographic & Cohort Intelligence';
      case 'books': return 'Registry Volumes & Page Explorer';
      case 'relationships': return 'Family Tree & Lineage Intelligence Lab';
      case 'quality': return 'Data Quality & Integrity Center';
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
        {/* Global Quick Search Form with Integrated Action Button */}
        <form
          onSubmit={handleSearchSubmit}
          className="relative flex items-center w-72 sm:w-80 md:w-[440px] bg-slate-900/95 border border-slate-700/80 hover:border-slate-600 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/25 rounded-xl p-1 shadow-inner transition-all group"
        >
          <Search className="w-4 h-4 text-slate-400 group-focus-within:text-brand-400 ml-2.5 mr-2 shrink-0 transition-colors" />

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
              className="p-1 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors mr-1 shrink-0"
              title="Clear search query"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="submit"
            className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 active:from-brand-700 active:to-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm shadow-brand-600/30 hover:shadow-brand-500/50 transition-all shrink-0 cursor-pointer"
            title="Search dataset (Enter ↵)"
          >
            <span>Search</span>
            <ArrowRight className="w-3 h-3" />
          </button>
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
