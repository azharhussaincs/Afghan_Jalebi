import React from 'react';
import { Filter, X, Calendar, MapPin, BookOpen, Users, RotateCcw, ChevronDown, Check } from 'lucide-react';
import { useFilters } from '../../context/FilterContext';

export const GlobalFilterBar: React.FC = () => {
  const {
    filters,
    filterOptions,
    setProvince,
    setDistrict,
    setGender,
    setYearRange,
    setBookName,
    clearFilters,
    activeFilterCount
  } = useFilters();

  const formatCount = (count?: number) => {
    if (!count) return '';
    if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(2)}M`;
    if (count >= 1_000) return `${(count / 1_000).toFixed(1)}k`;
    return count.toLocaleString();
  };

  return (
    <div className="bg-slate-900/80 border-b border-slate-800/80 px-6 py-2.5 backdrop-blur-sm shadow-sm">
      <div className="flex flex-col gap-2.5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-brand-400 bg-brand-500/10 border border-brand-500/20 px-2.5 py-1.5 rounded-md">
              <Filter className="w-3.5 h-3.5" />
              <span>DYNAMIC CROSS-FILTERS</span>
            </div>

            {/* Dynamic Province Filter */}
            <div className="relative">
              <select
                value={filters.province || ''}
                onChange={(e) => setProvince(e.target.value)}
                className={`text-xs bg-slate-950 border rounded-md px-3 py-1.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-all font-medium ${
                  filters.province ? 'border-brand-500/60 bg-brand-950/20 text-brand-300' : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <option value="">
                  All Provinces ({filterOptions.provinces_with_counts?.length || filterOptions.provinces.length})
                </option>
                {filterOptions.provinces_with_counts && filterOptions.provinces_with_counts.length > 0
                  ? filterOptions.provinces_with_counts.map((p) => (
                      <option key={p.province} value={p.province}>
                        {p.province} ({formatCount(p.count)})
                      </option>
                    ))
                  : filterOptions.provinces.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
              </select>
            </div>

            {/* Dynamic Cascading District Filter */}
            <div className="relative">
              <select
                value={filters.district || ''}
                onChange={(e) => setDistrict(e.target.value)}
                className={`text-xs bg-slate-950 border rounded-md px-3 py-1.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-all font-medium ${
                  filters.district ? 'border-brand-500/60 bg-brand-950/20 text-brand-300' : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <option value="">
                  {filters.province 
                    ? `All Districts in ${filters.province} (${filterOptions.districts_with_counts?.length || filterOptions.districts.length})` 
                    : `All Districts (${filterOptions.districts_with_counts?.length || filterOptions.districts.length})`}
                </option>
                {filterOptions.districts_with_counts && filterOptions.districts_with_counts.length > 0
                  ? filterOptions.districts_with_counts.map((d) => (
                      <option key={d.district} value={d.district}>
                        {d.district} ({formatCount(d.count)})
                      </option>
                    ))
                  : filterOptions.districts.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
              </select>
            </div>

            {/* Dynamic Gender Filter */}
            <div className="relative">
              <select
                value={filters.gender !== undefined ? filters.gender : ''}
                onChange={(e) => setGender(e.target.value !== '' ? Number(e.target.value) : undefined)}
                className={`text-xs bg-slate-950 border rounded-md px-3 py-1.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-all font-medium ${
                  filters.gender !== undefined ? 'border-brand-500/60 bg-brand-950/20 text-brand-300' : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <option value="">All Genders (Both Codes)</option>
                {filterOptions.genders.map((g) => (
                  <option key={g.value} value={g.value}>
                    {g.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Dynamic Solar Hijri Year Range Filter */}
            <div className={`flex items-center space-x-1.5 bg-slate-950 border rounded-md px-2.5 py-1 text-xs text-slate-300 transition-all ${
              filters.dob_year_min || filters.dob_year_max ? 'border-brand-500/60 bg-brand-950/20 text-brand-300' : 'border-slate-800'
            }`}>
              <Calendar className="w-3 h-3 text-slate-400" />
              <span className="text-slate-400">Year:</span>
              <input
                type="number"
                placeholder={String(filterOptions.year_min || 1250)}
                value={filters.dob_year_min || ''}
                onChange={(e) => setYearRange(e.target.value ? Number(e.target.value) : undefined, filters.dob_year_max)}
                className="w-14 bg-slate-900 border border-slate-800 rounded px-1.5 py-0.5 text-center text-slate-200 focus:outline-none focus:border-brand-500 text-xs"
              />
              <span className="text-slate-500">-</span>
              <input
                type="number"
                placeholder={String(filterOptions.year_max || 1405)}
                value={filters.dob_year_max || ''}
                onChange={(e) => setYearRange(filters.dob_year_min, e.target.value ? Number(e.target.value) : undefined)}
                className="w-14 bg-slate-900 border border-slate-800 rounded px-1.5 py-0.5 text-center text-slate-200 focus:outline-none focus:border-brand-500 text-xs"
              />
            </div>

            {/* Dynamic Registry Book Filter */}
            <div className="relative max-w-xs">
              <select
                value={filters.book_name || ''}
                onChange={(e) => setBookName(e.target.value)}
                className={`text-xs bg-slate-950 border rounded-md px-3 py-1.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-all font-medium truncate max-w-xs ${
                  filters.book_name ? 'border-brand-500/60 bg-brand-950/20 text-brand-300' : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <option value="">All Ledger Volumes ({filterOptions.books.length})</option>
                {filterOptions.books.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Reset All Filters Button */}
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-all shadow-sm"
              title="Reset all active cross-filters"
            >
              <RotateCcw className="w-3 h-3 text-amber-400" />
              <span>Reset All ({activeFilterCount})</span>
            </button>
          )}
        </div>

        {/* Active Filter Pills Bar */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-800/50">
            <span className="text-[11px] text-slate-400 font-medium mr-1">Active Filter Constraints:</span>

            {filters.province && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-brand-950/80 border border-brand-500/40 text-brand-300 text-xs">
                <span>📍 Province: {filters.province}</span>
                <button
                  onClick={() => setProvince(undefined)}
                  className="hover:text-white p-0.5 rounded-full hover:bg-brand-800/50"
                  title="Remove province filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filters.district && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs">
                <span>🏘️ District: {filters.district}</span>
                <button
                  onClick={() => setDistrict(undefined)}
                  className="hover:text-white p-0.5 rounded-full hover:bg-emerald-800/50"
                  title="Remove district filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filters.gender !== undefined && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-purple-950/80 border border-purple-500/40 text-purple-300 text-xs">
                <span>⚧ Gender: {filters.gender === 0 ? 'Male / Code 0 (مرد)' : 'Female / Code 1 (زن)'}</span>
                <button
                  onClick={() => setGender(undefined)}
                  className="hover:text-white p-0.5 rounded-full hover:bg-purple-800/50"
                  title="Remove gender filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {(filters.dob_year_min || filters.dob_year_max) && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs">
                <span>📅 SH Year: {filters.dob_year_min || '1250'} - {filters.dob_year_max || '1405'}</span>
                <button
                  onClick={() => setYearRange(undefined, undefined)}
                  className="hover:text-white p-0.5 rounded-full hover:bg-cyan-800/50"
                  title="Remove year range filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filters.book_name && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-950/80 border border-amber-500/40 text-amber-300 text-xs max-w-sm truncate">
                <span className="truncate">📖 Book: {filters.book_name}</span>
                <button
                  onClick={() => setBookName(undefined)}
                  className="hover:text-white p-0.5 rounded-full hover:bg-amber-800/50 shrink-0"
                  title="Remove book filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
