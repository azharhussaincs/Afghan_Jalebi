import React, { useState } from 'react';
import { Search, RotateCcw, Filter, Eye, ArrowRight, BookOpen, MapPin, Hash, User, Calendar } from 'lucide-react';
import { api } from '../../services/api';
import { RecordItem } from '../../types';
import { useFilters } from '../../context/FilterContext';

interface AdvancedSearchProps {
  onSelectRecord: (record: RecordItem) => void;
}

export const AdvancedSearch: React.FC<AdvancedSearchProps> = ({ onSelectRecord }) => {
  const { filterOptions, filters } = useFilters();
  const [q, setQ] = useState(filters.search_query || '');
  const [name, setName] = useState('');
  const [fname, setFname] = useState('');
  const [gname, setGname] = useState('');
  const [hashKey, setHashKey] = useState('');
  const [province, setProvince] = useState('');
  const [district, setDistrict] = useState('');
  const [gender, setGender] = useState<number | undefined>(undefined);
  const [yearMin, setYearMin] = useState<number | undefined>(undefined);
  const [yearMax, setYearMax] = useState<number | undefined>(undefined);
  const [bookName, setBookName] = useState('');
  const [recordNum, setRecordNum] = useState<number | undefined>(undefined);
  const [pageNum, setPageNum] = useState<number | undefined>(undefined);

  const [results, setResults] = useState<RecordItem[]>([]);
  const [totalMatches, setTotalMatches] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  React.useEffect(() => {
    if (filters.search_query) {
      setQ(filters.search_query);
      setLoading(true);
      setHasSearched(true);
      api.getRecords({
        q: filters.search_query,
        page: 1,
        page_size: 50
      })
        .then((data) => {
          setResults(data.records);
          setTotalMatches(data.total_records);
        })
        .catch((err) => console.error('Search failed', err))
        .finally(() => setLoading(false));
    }
  }, [filters.search_query]);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setHasSearched(true);
    try {
      const data = await api.getRecords({
        q: q || undefined,
        name: name || undefined,
        fname: fname || undefined,
        gname: gname || undefined,
        hash_key: hashKey || undefined,
        province: province || undefined,
        district: district || undefined,
        gender: gender,
        dob_year_min: yearMin,
        dob_year_max: yearMax,
        book_name: bookName || undefined,
        record_number: recordNum,
        page_number: pageNum,
        page: 1,
        page_size: 50
      });
      setResults(data.records);
      setTotalMatches(data.total_records);
    } catch (err) {
      console.error('Search failed', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setQ('');
    setName('');
    setFname('');
    setGname('');
    setHashKey('');
    setProvince('');
    setDistrict('');
    setGender(undefined);
    setYearMin(undefined);
    setYearMax(undefined);
    setBookName('');
    setRecordNum(undefined);
    setPageNum(undefined);
    setResults([]);
    setTotalMatches(null);
    setHasSearched(false);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Search Header Banner */}
      <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 rounded-lg bg-brand-600/10 text-brand-400">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100">Universal Multi-Parametric Search Hub</h2>
            <p className="text-xs text-slate-400">
              Query indexed civil registry records using exact match, Unicode partial text, or cryptographic HashKey
            </p>
          </div>
        </div>

        <form onSubmit={handleSearch} className="space-y-4">
          {/* Universal Query Bar */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Universal Search Bar (Searches all 16 columns)
            </label>
            <div className="relative">
              <input
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by any term (e.g. ظریفه, انصار الله, کابل, موسهی, B3BDB529...)"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          {/* Granular Field Search Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3 pt-2 border-t border-slate-800/80">
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">Name (نام)</label>
              <input
                type="text"
                placeholder="e.g. ظریفه"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-md text-xs text-slate-200 focus:outline-none focus:border-brand-500 font-persian"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">Father's Name (نام پدر)</label>
              <input
                type="text"
                placeholder="e.g. لالا شیرین"
                value={fname}
                onChange={(e) => setFname(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-md text-xs text-slate-200 focus:outline-none focus:border-brand-500 font-persian"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">Grandfather (نام پدرکلان)</label>
              <input
                type="text"
                placeholder="e.g. در محمد"
                value={gname}
                onChange={(e) => setGname(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-md text-xs text-slate-200 focus:outline-none focus:border-brand-500 font-persian"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">MD5 HashKey</label>
              <input
                type="text"
                placeholder="e.g. B3BDB5290D877..."
                value={hashKey}
                onChange={(e) => setHashKey(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-md text-xs text-slate-200 focus:outline-none focus:border-brand-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">Province (ولایت)</label>
              <select
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-md text-xs text-slate-200 focus:outline-none focus:border-brand-500"
              >
                <option value="">All Provinces</option>
                {filterOptions.provinces.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">District (ولسوالی)</label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-md text-xs text-slate-200 focus:outline-none focus:border-brand-500"
              >
                <option value="">All Districts</option>
                {filterOptions.districts.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">Gender Code</label>
              <select
                value={gender !== undefined ? gender : ''}
                onChange={(e) => setGender(e.target.value !== '' ? Number(e.target.value) : undefined)}
                className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-md text-xs text-slate-200 focus:outline-none focus:border-brand-500"
              >
                <option value="">All Codes</option>
                {filterOptions.genders.map((g) => (
                  <option key={g.value} value={g.value}>
                    {g.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">Book Name</label>
              <select
                value={bookName}
                onChange={(e) => setBookName(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-md text-xs text-slate-200 focus:outline-none focus:border-brand-500 truncate"
              >
                <option value="">All Registry Books</option>
                {filterOptions.books.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Search Fields</span>
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-2 px-5 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white text-xs font-semibold shadow-lg shadow-brand-600/25 transition-all"
            >
              <Search className="w-4 h-4" />
              <span>{loading ? 'Executing Query...' : 'Execute Search'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Results Header */}
      {hasSearched && (
        <div className="flex items-center justify-between px-1">
          <div className="text-xs text-slate-400">
            Found <span className="font-bold text-slate-100 font-mono">{totalMatches?.toLocaleString()}</span> matching records
            {totalMatches && totalMatches > 50 ? ' (Displaying top 50 matches)' : ''}
          </div>
        </div>
      )}

      {/* Results List */}
      {results.length > 0 && (
        <div className="space-y-2">
          {results.map((rec) => (
            <div
              key={rec.id}
              onClick={() => onSelectRecord(rec)}
              className="p-4 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-brand-500/50 transition-all cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center space-x-4 min-w-0">
                <div className="p-2 rounded-lg bg-slate-800 text-slate-400 font-mono text-xs font-bold">
                  #{rec.id}
                </div>
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-sm text-slate-100 font-persian">
                      {rec.name || '—'}
                    </span>
                    <span className="text-xs text-slate-400 font-persian">
                      ولد: {rec.fname || '—'} (پدرکلان: {rec.gname || '—'})
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1 font-persian">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      {rec.province} - {rec.district} ({rec.province_code || '-'})
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      {rec.dob_year ? `${rec.dob_year} SH` : 'N/A'}
                    </span>
                    <span className="font-mono text-[11px] text-slate-500 truncate max-w-[150px]">
                      {rec.hash_key}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 shrink-0 ml-4">
                <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800 text-slate-300">
                  {rec.gender === 0 ? 'Code 0' : rec.gender === 1 ? 'Code 1' : 'Unspecified'}
                </span>
                <div className="p-1.5 rounded-lg bg-slate-800 group-hover:bg-brand-600 text-slate-400 group-hover:text-white transition-all">
                  <Eye className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {hasSearched && results.length === 0 && !loading && (
        <div className="p-12 text-center rounded-xl bg-slate-900/40 border border-dashed border-slate-800">
          <Search className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-300">No matching records found</p>
          <p className="text-xs text-slate-500 mt-1">Try broadening your search criteria or resetting filters</p>
        </div>
      )}
    </div>
  );
};
