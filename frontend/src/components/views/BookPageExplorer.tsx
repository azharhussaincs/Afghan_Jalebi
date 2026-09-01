import React, { useEffect, useState } from 'react';
import { BookOpen } from 'lucide-react';
import { api } from '../../services/api';
import { useFilters } from '../../context/FilterContext';
import { BooksPagesData } from '../../types';

export const BookPageExplorer: React.FC = () => {
  const { toQueryParams, refreshKey, setBookName } = useFilters();
  const [data, setData] = useState<BooksPagesData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.getBooksPagesAnalytics(toQueryParams())
      .then(setData)
      .catch((err) => console.error('Failed to load books/pages data', err))
      .finally(() => setLoading(false));
  }, [refreshKey, JSON.stringify(toQueryParams())]);

  if (loading || !data) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-mono text-slate-400">Aggregating registry volumes and page structures...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header Info */}
      <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100">
              Registry Books & Physical Page Structure Analytics
            </h2>
            <p className="text-xs text-slate-400">
              Exploration of handwritten volume titles (قلم انداز / جلد), page pagination density, and sequential records
            </p>
          </div>
        </div>
      </div>


      {/* Top Books Table */}
      <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
        <h3 className="text-sm font-bold text-slate-100 mb-1">Registry Books Volume Catalog</h3>
        <p className="text-xs text-slate-400 mb-4">Top archival volumes ranked by total registered citizens</p>

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
              {data.books.map((b, idx) => (
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
                      onClick={() => setBookName(b.book_name)}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-brand-600 text-slate-300 hover:text-white text-[11px] transition-colors"
                    >
                      Filter Book
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
