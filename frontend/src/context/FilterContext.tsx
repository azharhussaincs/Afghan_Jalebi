import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { FilterOptions } from '../types';
import { api, QueryParams } from '../services/api';

interface FilterState {
  province?: string;
  district?: string;
  gender?: number;
  dob_year_min?: number;
  dob_year_max?: number;
  book_name?: string;
  search_query?: string;
}

interface FilterContextType {
  filters: FilterState;
  filterOptions: FilterOptions;
  setProvince: (p?: string) => void;
  setDistrict: (d?: string) => void;
  setGender: (g?: number) => void;
  setYearRange: (min?: number, max?: number) => void;
  setBookName: (b?: string) => void;
  setSearchQuery: (q?: string) => void;
  clearFilters: () => void;
  activeFilterCount: number;
  toQueryParams: () => QueryParams;
  refreshKey: number;
  triggerRefresh: () => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [filters, setFilters] = useState<FilterState>({});
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    provinces: [],
    districts: [],
    books: [],
    genders: [
      { value: 0, label: 'Male (مرد)' },
      { value: 1, label: 'Female (زن)' }
    ],
    year_min: 1300,
    year_max: 1405
  });
  const [refreshKey, setRefreshKey] = useState<number>(0);

  useEffect(() => {
    api.getFilterOptions(filters.province).then(opts => {
      if (opts && opts.provinces) {
        setFilterOptions(opts);
      }
    }).catch(err => console.error('Failed to load filter options', err));
  }, [filters.province, refreshKey]);

  const setProvince = (province?: string) => {
    setFilters(prev => ({
      ...prev,
      province: province || undefined,
      district: undefined // automatically reset district when province changes
    }));
  };

  const setDistrict = (district?: string) => {
    setFilters(prev => ({ ...prev, district: district || undefined }));
  };

  const setGender = (gender?: number) => {
    setFilters(prev => ({ ...prev, gender }));
  };

  const setYearRange = (dob_year_min?: number, dob_year_max?: number) => {
    setFilters(prev => ({ ...prev, dob_year_min, dob_year_max }));
  };

  const setBookName = (book_name?: string) => {
    setFilters(prev => ({ ...prev, book_name: book_name || undefined }));
  };

  const setSearchQuery = (search_query?: string) => {
    setFilters(prev => ({ ...prev, search_query: search_query || undefined }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const triggerRefresh = () => {
    setRefreshKey(k => k + 1);
  };

  const activeFilterCount = Object.keys(filters).filter(k => {
    const v = (filters as any)[k];
    return v !== undefined && v !== null && v !== '';
  }).length;

  const toQueryParams = (): QueryParams => {
    return {
      province: filters.province,
      district: filters.district,
      gender: filters.gender,
      dob_year_min: filters.dob_year_min,
      dob_year_max: filters.dob_year_max,
      book_name: filters.book_name,
      q: filters.search_query
    };
  };

  return (
    <FilterContext.Provider
      value={{
        filters,
        filterOptions,
        setProvince,
        setDistrict,
        setGender,
        setYearRange,
        setBookName,
        setSearchQuery,
        clearFilters,
        activeFilterCount,
        toQueryParams,
        refreshKey,
        triggerRefresh
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export const useFilters = (): FilterContextType => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
};
