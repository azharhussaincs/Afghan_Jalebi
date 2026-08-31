import React from 'react';
import { Filter, X, Calendar, MapPin, BookOpen, Users, RotateCcw } from 'lucide-react';
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

  return (
    <div className="bg-slate-900/60 border-b border-slate-800/80 px-6 py-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-400 mr-1">
            <Filter className="w-3.5 h-3.5 text-brand-400" />
            <span>CROSS-FILTERS:</span>
          </div>

          {/* Province Filter */}
          <div className="relative">
            <select
              value={filters.province || ''}
              onChange={(e) => setProvince(e.target.value)}
              className="text-xs bg-slate-950 border border-slate-800 rounded-md px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-brand-500 hover:border-slate-700 transition-colors"
            >
              <option value="">All Provinces ({filterOptions.provinces.length})</option>
              {filterOptions.provinces.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* District Filter */}
          <div className="relative">
            <select
              value={filters.district || ''}
              onChange={(e) => setDistrict(e.target.value)}
              className="text-xs bg-slate-950 border border-slate-800 rounded-md px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-brand-500 hover:border-slate-700 transition-colors"
            >
              <option value="">All Districts ({filterOptions.districts.length})</option>
              {filterOptions.districts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Gender Filter */}
          <div className="relative">
            <select
              value={filters.gender !== undefined ? filters.gender : ''}
              onChange={(e) => setGender(e.target.value !== '' ? Number(e.target.value) : undefined)}
              className="text-xs bg-slate-950 border border-slate-800 rounded-md px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-brand-500 hover:border-slate-700 transition-colors"
            >
              <option value="">All Gender Codes</option>
              {filterOptions.genders.map((g) => (
                <option key={g.value} value={g.value}>
                  {g.label}
                </option>
              ))}
            </select>
          </div>

          {/* Year Range Filter */}
          <div className="flex items-center space-x-1.5 bg-slate-950 border border-slate-800 rounded-md px-2.5 py-1 text-xs text-slate-300">
            <Calendar className="w-3 h-3 text-slate-400" />
            <span>SH Year:</span>
            <input
              type="number"
              placeholder={String(filterOptions.year_min)}
              value={filters.dob_year_min || ''}
              onChange={(e) => setYearRange(e.target.value ? Number(e.target.value) : undefined, filters.dob_year_max)}
              className="w-14 bg-slate-900 border border-slate-800 rounded px-1.5 py-0.5 text-center text-slate-200 focus:outline-none focus:border-brand-500"
            />
            <span className="text-slate-500">-</span>
            <input
              type="number"
              placeholder={String(filterOptions.year_max)}
              value={filters.dob_year_max || ''}
              onChange={(e) => setYearRange(filters.dob_year_min, e.target.value ? Number(e.target.value) : undefined)}
              className="w-14 bg-slate-900 border border-slate-800 rounded px-1.5 py-0.5 text-center text-slate-200 focus:outline-none focus:border-brand-500"
            />
          </div>

          {/* Book Filter */}
          <div className="relative max-w-xs">
            <select
              value={filters.book_name || ''}
              onChange={(e) => setBookName(e.target.value)}
              className="text-xs bg-slate-950 border border-slate-800 rounded-md px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-brand-500 hover:border-slate-700 transition-colors truncate max-w-xs"
            >
              <option value="">All Books ({filterOptions.books.length})</option>
              {filterOptions.books.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Clear Filters */}
        {activeFilterCount > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-xs text-brand-400 font-medium">
              {activeFilterCount} active filter{activeFilterCount > 1 ? 's' : ''}
            </span>
            <button
              onClick={clearFilters}
              className="flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
