import React, { useEffect, useState } from 'react';
import { 
  BookOpen, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  Share2, 
  Search, 
  Layers, 
  FileText, 
  Hash, 
  BookMarked,
  RotateCcw
} from 'lucide-react';
import { api } from '../../services/api';
import { useFilters } from '../../context/FilterContext';
import { BooksPagesData, LedgerPageData, RecordItem } from '../../types';
import { RecordDrawer } from '../common/RecordDrawer';

interface BookPageExplorerProps {
  onSelectRecord?: (record: RecordItem) => void;
  onViewFamilyTree?: (recordId: number) => void;
}

export const BookPageExplorer: React.FC<BookPageExplorerProps> = ({
  onSelectRecord,
  onViewFamilyTree
}) => {
  const { toQueryParams, refreshKey, filters, setBookName } = useFilters();
  const [data, setData] = useState<BooksPagesData | null>(null);
  const [loading, setLoading] = useState(true);

  // Active View Tab: 'ledger' (Physical Sheet Viewer) or 'catalog' (All Books)
  const [activeTab, setActiveTab] = useState<'ledger' | 'catalog'>('ledger');

  // Selected Volume & Page state
  const [currentBook, setCurrentBook] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageInput, setPageInput] = useState<string>('1');

  // Ledger Sheet Data
  const [ledgerData, setLedgerData] = useState<LedgerPageData | null>(null);
  const [ledgerLoading, setLedgerLoading] = useState<boolean>(false);

  // Search filter for books catalog
  const [bookSearch, setBookSearch] = useState<string>('');

  // Local record drawer inspection
  const [inspectRecord, setInspectRecord] = useState<RecordItem | null>(null);

  // 1. Load general books/pages data
  useEffect(() => {
    setLoading(true);
    api.getBooksPagesAnalytics(toQueryParams())
      .then((res) => {
        setData(res);
        if (res.books && res.books.length > 0) {
          const initialBook = filters.book_name || res.books[0].book_name;
          setCurrentBook(initialBook);
        }
      })
      .catch((err) => console.error('Failed to load books/pages data', err))
      .finally(() => setLoading(false));
  }, [refreshKey, JSON.stringify(toQueryParams()), filters.book_name]);

  // 2. Fetch specific physical ledger sheet when currentBook or currentPage changes
  useEffect(() => {
    if (!currentBook) return;
    setLedgerLoading(true);
    api.getLedgerPage(currentBook, currentPage)
      .then((res) => {
        setLedgerData(res);
        setCurrentPage(res.page_number);
        setPageInput(String(res.page_number));
      })
      .catch((err) => console.error('Failed to load ledger page', err))
      .finally(() => setLedgerLoading(false));
  }, [currentBook, currentPage]);

  const handleBookSelect = (book: string) => {
    setCurrentBook(book);
    setCurrentPage(1);
    setPageInput('1');
    setActiveTab('ledger');
    setBookName(book);
  };

  const handlePageJump = (e: React.FormEvent) => {
    e.preventDefault();
    const p = parseInt(pageInput, 10);
    if (!isNaN(p) && ledgerData) {
      const clamped = Math.max(ledgerData.min_page, Math.min(ledgerData.max_page, p));
      setCurrentPage(clamped);
      setPageInput(String(clamped));
    }
  };

  const handleInspect = (r: RecordItem) => {
    if (onSelectRecord) {
      onSelectRecord(r);
    } else {
      setInspectRecord(r);
    }
  };

  if (loading || !data) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-mono text-slate-400">Loading archival registry volumes and page structures...</p>
      </div>
    );
  }

  const filteredBooks = (data.books || []).filter((b) => 
    b.book_name.toLowerCase().includes(bookSearch.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* Top Controller Bar: Mode Switcher & Volume Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('ledger')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'ledger'
                ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/20'
                : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>📖 Physical Ledger Sheet (ورق قلم انداز)</span>
          </button>

          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'catalog'
                ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/20'
                : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>📚 Volume Catalog ({data.books?.length || 0})</span>
          </button>
        </div>

        {/* Quick Volume Switcher */}
        <div className="flex items-center gap-2 max-w-md w-full">
          <span className="text-[11px] uppercase font-bold text-slate-400 shrink-0">Active Volume:</span>
          <select
            value={currentBook}
            onChange={(e) => handleBookSelect(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 font-persian truncate focus:outline-none focus:border-brand-500"
          >
            {data.books.map((b, idx) => (
              <option key={idx} value={b.book_name}>
                {b.book_name} ({b.records_count.toLocaleString()} records)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: PHYSICAL ARCHIVAL LEDGER SHEET VIEWER                             */}
      {/* ========================================================================= */}
      {activeTab === 'ledger' && (
        <div className="space-y-5">
          {/* Volume Summary Cards */}
          {ledgerData && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Total Citizens in Book</span>
                </div>
                <div className="text-xl font-black text-slate-100 mt-1 font-mono">
                  {ledgerData.total_records_in_book.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Recorded identities</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-blue-400" />
                  <span>Total Pages</span>
                </div>
                <div className="text-xl font-black text-slate-100 mt-1 font-mono">
                  {ledgerData.unique_pages_in_book}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Pages {ledgerData.min_page} to {ledgerData.max_page}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Avg Records / Page</span>
                </div>
                <div className="text-xl font-black text-slate-100 mt-1 font-mono">
                  {ledgerData.avg_records_per_page}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Standard density</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1.5">
                  <BookMarked className="w-3.5 h-3.5 text-amber-400" />
                  <span>Jurisdiction</span>
                </div>
                <div className="text-sm font-bold text-slate-100 mt-1 font-persian truncate">
                  {ledgerData.province || '—'} {ledgerData.district ? `• ${ledgerData.district}` : ''}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Civil Registry Office</div>
              </div>
            </div>
          )}

          {/* Physical Page Flipping Navigator */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentPage((p) => Math.max(ledgerData?.min_page || 1, p - 1))}
                disabled={!ledgerData || currentPage <= ledgerData.min_page}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold text-slate-200 flex items-center gap-1 transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Page</span>
              </button>

              <form onSubmit={handlePageJump} className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-400">Page</span>
                <input
                  type="number"
                  min={ledgerData?.min_page || 1}
                  max={ledgerData?.max_page || 100}
                  value={pageInput}
                  onChange={(e) => setPageInput(e.target.value)}
                  className="w-16 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-center text-xs font-bold text-slate-100 font-mono focus:outline-none focus:border-brand-500"
                />
                <span className="text-xs text-slate-400">
                  of {ledgerData?.max_page || 1}
                </span>
                <button
                  type="submit"
                  className="px-2.5 py-1 rounded-lg bg-brand-600 hover:bg-brand-500 text-[11px] font-bold text-white transition-colors cursor-pointer"
                >
                  Go
                </button>
              </form>

              <button
                onClick={() => setCurrentPage((p) => Math.min(ledgerData?.max_page || 100, p + 1))}
                disabled={!ledgerData || currentPage >= ledgerData.max_page}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold text-slate-200 flex items-center gap-1 transition-all cursor-pointer"
              >
                <span>Next Page</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Page Jump Presets */}
            {ledgerData && (
              <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                <span className="text-slate-500 mr-1">Quick Jump:</span>
                {ledgerData.available_pages.slice(0, 10).map((pg) => (
                  <button
                    key={pg}
                    onClick={() => {
                      setCurrentPage(pg);
                      setPageInput(String(pg));
                    }}
                    className={`px-2 py-0.5 rounded-md font-mono text-[10px] transition-colors cursor-pointer ${
                      currentPage === pg
                        ? 'bg-brand-500 text-white font-bold'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    }`}
                  >
                    p.{pg}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Authentic Physical Ledger Sheet Display */}
          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-brand-500/20 text-brand-300 border border-brand-500/30">
                    Archival Page Sheet #{currentPage}
                  </span>
                  <h3 className="text-sm font-bold text-slate-100 font-persian">
                    {currentBook}
                  </h3>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Showing all citizens recorded chronologically on physical page {currentPage}
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                  {ledgerData?.records.length || 0} Citizens on this sheet
                </span>
              </div>
            </div>

            {/* Entries Table */}
            {ledgerLoading ? (
              <div className="py-16 text-center">
                <div className="w-8 h-8 border-3 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-xs text-slate-400 mt-3 font-mono">Turning ledger page...</p>
              </div>
            ) : !ledgerData || ledgerData.records.length === 0 ? (
              <div className="py-16 text-center text-slate-500 text-xs">
                No citizen records registered on page {currentPage} of this volume.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider">
                      <th className="py-3 px-3 font-bold text-center w-12"># Line</th>
                      <th className="py-3 px-3 font-bold text-center w-20">Entry #</th>
                      <th className="py-3 px-4 font-bold">Citizen Name (نام)</th>
                      <th className="py-3 px-4 font-bold">Father (پدر / ولد)</th>
                      <th className="py-3 px-4 font-bold">Grandfather (پدرکلان)</th>
                      <th className="py-3 px-3 font-bold text-center">DoB (سال تولد)</th>
                      <th className="py-3 px-3 font-bold text-center">Gender</th>
                      <th className="py-3 px-3 font-bold text-center">Record ID</th>
                      <th className="py-3 px-4 font-bold text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {ledgerData.records.map((r, index) => (
                      <tr 
                        key={r.id}
                        className="hover:bg-slate-800/40 transition-colors group"
                      >
                        <td className="py-3 px-3 text-center font-mono text-slate-500 text-[11px]">
                          {index + 1}
                        </td>
                        <td className="py-3 px-3 text-center font-mono font-bold text-amber-400">
                          {r.record_number || '—'}
                        </td>
                        <td className="py-3 px-4 font-persian font-bold text-slate-100 text-sm">
                          {r.name}
                        </td>
                        <td className="py-3 px-4 font-persian text-slate-300">
                          {r.fname}
                        </td>
                        <td className="py-3 px-4 font-persian text-slate-400">
                          {r.gname}
                        </td>
                        <td className="py-3 px-3 text-center font-mono text-slate-300">
                          {r.dob_year ? `${r.dob_year} SH` : '—'}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              r.gender === 1
                                ? 'bg-pink-500/15 text-pink-300 border border-pink-500/30'
                                : 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                            }`}
                          >
                            {r.gender === 1 ? 'Female' : 'Male'}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center font-mono text-slate-400 text-[11px]">
                          #{r.id}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleInspect(r)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-brand-600 text-slate-300 hover:text-white transition-all cursor-pointer"
                              title="Inspect Record Details"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            {onViewFamilyTree && (
                              <button
                                onClick={() => onViewFamilyTree(r.id)}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white transition-all cursor-pointer"
                                title="Reconstruct Generational Family Tree"
                              >
                                <Share2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Historical Registry Note */}
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-400 flex items-start gap-2.5">
              <span className="text-brand-400 font-bold shrink-0">ℹ️ Note:</span>
              <span>
                These citizens were sequentially inscribed onto page <strong>{currentPage}</strong> of volume <em>"{currentBook}"</em> during the civil registration drive. Individuals sharing both identical father and grandfather names are biological siblings.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: REGISTRY BOOKS VOLUME CATALOG                                    */}
      {/* ========================================================================= */}
      {activeTab === 'catalog' && (
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-100">Archival Registry Volumes Catalog</h3>
              <p className="text-xs text-slate-400">
                Official bound registry volumes ranked by total registered citizens
              </p>
            </div>

            {/* Catalog Search Bar */}
            <div className="relative max-w-xs w-full">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={bookSearch}
                onChange={(e) => setBookSearch(e.target.value)}
                placeholder="Search volume title or district..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950 border-b border-slate-800 text-slate-300">
                  <th className="py-3 px-4 font-semibold">Volume Title / Book Name (جلد قلم انداز)</th>
                  <th className="py-3 px-4 font-semibold text-right">Unique Pages</th>
                  <th className="py-3 px-4 font-semibold text-right">Total Entries</th>
                  <th className="py-3 px-4 font-semibold text-right">Share of Dataset</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredBooks.map((b, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/60 transition-colors">
                    <td className="py-2.5 px-4 font-persian text-slate-200 font-medium">
                      {b.book_name}
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono text-indigo-400">{b.unique_pages}</td>
                    <td className="py-2.5 px-4 text-right font-mono text-slate-100 font-bold">
                      {b.records_count.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono text-slate-400">
                      {b.percentage}%
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      <button
                        onClick={() => handleBookSelect(b.book_name)}
                        className="px-3 py-1 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-bold text-[11px] transition-colors cursor-pointer"
                      >
                        Inspect Ledger Sheet ↗
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Embedded Record Drawer for inspecting any entry directly */}
      {inspectRecord && (
        <RecordDrawer
          record={inspectRecord}
          onClose={() => setInspectRecord(null)}
          onViewFamilyTree={onViewFamilyTree}
        />
      )}
    </div>
  );
};
