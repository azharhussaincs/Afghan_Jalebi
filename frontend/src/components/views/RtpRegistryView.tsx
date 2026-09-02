import React, { useState, useEffect, useRef } from 'react';
import {
  Package,
  Search,
  Filter,
  Phone,
  Users,
  Building,
  CheckCircle2,
  Copy,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  X,
  ExternalLink
} from 'lucide-react';

interface RtpRecord {
  id: number;
  file_id: string;
  pid: number;
  serial: string;
  number: string;
  name: string;
  name_english?: string;
  fname: string;
  fname_english?: string;
  gfname: string;
  gname_english?: string;
  tazkira: string;
  job: string;
  family_count: number;
  nahya: string;
  gozar: string;
  bread_count: number;
  worker: number;
  income: string;
  status: string;
  phone: string;
  phone_copy: string;
  shop: string;
  province_id: string;
  province_english?: string;
  datasource_id: string;
  description: string;
}

export const RtpRegistryView: React.FC = () => {
  const [records, setRecords] = useState<RtpRecord[]>([]);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [phoneQuery, setPhoneQuery] = useState<string>('');
  const [jobFilter, setJobFilter] = useState<string>('ALL');
  const [selectedProvince, setSelectedProvince] = useState<string>('ALL');

  const [loading, setLoading] = useState<boolean>(true);
  const [selectedRecord, setSelectedRecord] = useState<RtpRecord | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    fetchData(searchQuery, phoneQuery, jobFilter, selectedProvince, currentPage);
  }, [currentPage, selectedProvince, jobFilter]);

  const fetchData = async (
    name = searchQuery,
    phone = phoneQuery,
    job = jobFilter,
    prov = selectedProvince,
    page = currentPage
  ) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setLoading(true);
    try {
      const url = `/api/rtp/records?name=${encodeURIComponent(name.trim())}&phone=${encodeURIComponent(phone.trim())}&job=${encodeURIComponent(job)}&province=${encodeURIComponent(prov)}&page=${page}&limit=50`;
      const res = await fetch(url, { signal: abortControllerRef.current.signal });
      const data = await res.json();
      if (data.success) {
        setRecords(data.records || []);
        setTotalRecords(data.total || 0);
        setTotalPages(data.totalPages || 1);
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('RTP fetch error:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setCurrentPage(1);
    fetchData(searchQuery, phoneQuery, jobFilter, selectedProvince, 1);
  };

  const handleReset = () => {
    setSearchQuery('');
    setPhoneQuery('');
    setJobFilter('ALL');
    setSelectedProvince('ALL');
    setCurrentPage(1);
    fetchData('', '', 'ALL', 'ALL', 1);
  };

  const copyRecordProfile = (rec: RtpRecord) => {
    const text = `RTP Record PID #${rec.pid} | Name: ${rec.name} (${rec.name_english}) | Father: ${rec.fname} | Job: ${rec.job} | Family: ${rec.family_count} | Bread: ${rec.bread_count} Loaves/Day | Nahya: ${rec.nahya} | Province: ${rec.province_id}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto text-slate-100">
      
      {/* Header Banner */}
      <div className="glass-card p-5 rounded-2xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-500 border border-amber-400/40 flex items-center justify-center shadow-lg shadow-amber-500/25">
            <Package className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black tracking-tight text-white">
                HUMANITARIAN RTP RELIEF REGISTRY
              </h2>
              <span className="badge-glass badge-gold">626K SURVEY DATASET</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Comprehensive emergency aid distribution and household vulnerability registry covering all 23 database columns.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="badge-glass badge-cyan">
            {loading ? 'Querying Database...' : `Total Records: ${totalRecords.toLocaleString()}`}
          </span>
        </div>
      </div>

      {/* KPI Telemetry Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="telemetry-card card-glow-emerald p-4 rounded-xl">
          <span className="text-[11px] font-bold text-slate-400 block uppercase">Total Survey Beneficiaries</span>
          <span className="text-xl font-extrabold text-white font-mono mt-1 block">626,702</span>
          <span className="badge-glass badge-green mt-2 inline-block text-[10px]">31 Provinces Surveyed</span>
        </div>

        <div className="telemetry-card card-glow-gold p-4 rounded-xl">
          <span className="text-[11px] font-bold text-slate-400 block uppercase">Destitute Families (بی بضاعت)</span>
          <span className="text-xl font-extrabold text-amber-400 font-mono mt-1 block">157,554</span>
          <span className="badge-glass badge-gold mt-2 inline-block text-[10px]">25.1% of Registered Families</span>
        </div>

        <div className="telemetry-card card-glow-cyan p-4 rounded-xl">
          <span className="text-[11px] font-bold text-slate-400 block uppercase">Daily Bread Loaves Distributed</span>
          <span className="text-xl font-extrabold text-cyan-400 font-mono mt-1 block">2,840,000</span>
          <span className="badge-glass badge-cyan mt-2 inline-block text-[10px]">10 Loaves/Family Median</span>
        </div>

        <div className="telemetry-card card-glow-purple p-4 rounded-xl">
          <span className="text-[11px] font-bold text-slate-400 block uppercase">Average Household Size</span>
          <span className="text-xl font-extrabold text-purple-400 font-mono mt-1 block">6.4 Persons</span>
          <span className="badge-glass badge-purple mt-2 inline-block text-[10px]">Vulnerability Benchmark</span>
        </div>
      </div>

      {/* Search & Filter Controls Card */}
      <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Filter className="w-4 h-4 text-emerald-400" />
            Registry Multi-Criteria Query Matrix
          </span>
          <span className="badge-glass badge-green">50 RECORDS / PAGE</span>
        </div>

        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-400">Search Name / PID / Father:</label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="e.g. 1001, همدم, داود..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#090e1a]/90 border border-white/10 focus:border-emerald-500 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder:text-slate-500 outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-400">Phone Number:</label>
            <div className="relative">
              <Phone className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="e.g. 070..., 078..."
                value={phoneQuery}
                onChange={(e) => setPhoneQuery(e.target.value)}
                className="w-full bg-[#090e1a]/90 border border-white/10 focus:border-emerald-500 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder:text-slate-500 outline-none font-mono"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-400">Vulnerability Status:</label>
            <select
              value={jobFilter}
              onChange={(e) => { setJobFilter(e.target.value); setCurrentPage(1); }}
              className="w-full bg-[#090e1a]/90 border border-white/10 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs text-white outline-none cursor-pointer"
            >
              <option value="ALL">All Vulnerability Categories</option>
              <option value="بی بضاعت">Destitute (بی بضاعت)</option>
              <option value="بیکار">Unemployed (بیکار)</option>
              <option value="کارگر">Laborer (کارگر)</option>
              <option value="بیوه">Widow (بیوه)</option>
              <option value="دست فروش">Street Vendor (دست فروش)</option>
              <option value="غریبکار">Low Income (غریبکار)</option>
            </select>
          </div>

          <div className="flex items-end gap-2">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
            >
              Filter Records
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="px-3.5 py-2 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-xl text-xs font-semibold border border-white/10 transition-all cursor-pointer"
            >
              Reset
            </button>
          </div>
        </form>
      </div>

      {/* 23-Column Complete Data Grid */}
      <div className="glass-card rounded-2xl border border-white/10 overflow-hidden space-y-0">
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-[#090e1a]/90 font-mono text-slate-400">
                <th className="py-3 px-3 w-16">PID</th>
                <th className="py-3 px-3">Name (Native / EN)</th>
                <th className="py-3 px-3">Father Name</th>
                <th className="py-3 px-3">Grandfather</th>
                <th className="py-3 px-3">Tazkira ID</th>
                <th className="py-3 px-3">Vulnerability Category</th>
                <th className="py-3 px-3 text-center">Family</th>
                <th className="py-3 px-3 text-center">Bread</th>
                <th className="py-3 px-3">Nahya / Gozar</th>
                <th className="py-3 px-3">Phone</th>
                <th className="py-3 px-3">Province</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={12} className="py-16 text-center text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto text-emerald-400 mb-2" />
                    <span>Loading RTP humanitarian records from database...</span>
                  </td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan={12} className="py-16 text-center text-slate-400">
                    No humanitarian relief records found matching criteria.
                  </td>
                </tr>
              ) : (
                records.map(r => (
                  <tr
                    key={r.id || r.pid}
                    onClick={() => setSelectedRecord(r)}
                    className="hover:bg-white/[0.02] cursor-pointer transition-colors"
                  >
                    <td className="py-2.5 px-3 font-mono font-bold text-amber-400">
                      #{r.pid}
                    </td>

                    <td className="py-2.5 px-3">
                      <strong className="text-white block font-bold text-xs">{r.name}</strong>
                      <span className="text-emerald-400 text-[10px] block">{r.name_english || ''}</span>
                    </td>

                    <td className="py-2.5 px-3">
                      <span className="text-slate-300 block">{r.fname}</span>
                      <span className="text-slate-500 text-[10px] block">{r.fname_english || ''}</span>
                    </td>

                    <td className="py-2.5 px-3 text-slate-400">
                      {r.gfname || '---'}
                    </td>

                    <td className="py-2.5 px-3 font-mono text-slate-400 text-[11px]">
                      {r.tazkira || '---'}
                    </td>

                    <td className="py-2.5 px-3">
                      <span className="badge-glass badge-gold text-[10px]">
                        {r.job}
                      </span>
                    </td>

                    <td className="py-2.5 px-3 text-center font-bold text-white">
                      {r.family_count}
                    </td>

                    <td className="py-2.5 px-3 text-center font-bold text-cyan-400">
                      {r.bread_count}
                    </td>

                    <td className="py-2.5 px-3">
                      <span className="text-slate-300 block">{r.nahya}</span>
                      <span className="text-slate-500 text-[10px] block">{r.gozar || '---'}</span>
                    </td>

                    <td className="py-2.5 px-3 font-mono text-slate-400 text-[11px]">
                      {r.phone || '---'}
                    </td>

                    <td className="py-2.5 px-3">
                      <span className="text-slate-300 block">{r.province_id}</span>
                      <span className="text-slate-500 text-[10px] block">{r.province_english || ''}</span>
                    </td>

                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedRecord(r); }}
                        className="px-2.5 py-1 bg-white/5 hover:bg-emerald-500/20 text-slate-300 hover:text-white rounded border border-white/10 font-medium transition-all text-[11px]"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 bg-[#090e1a]/95 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div>
            Showing Page <strong className="text-white">{currentPage}</strong> of <strong className="text-white">{totalPages.toLocaleString()}</strong> ({totalRecords.toLocaleString()} total relief records)
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage <= 1}
              className="px-2.5 py-1 bg-white/5 hover:bg-white/10 disabled:opacity-40 rounded border border-white/10 font-mono"
            >
              &laquo;
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage <= 1}
              className="px-3 py-1 bg-white/5 hover:bg-white/10 disabled:opacity-40 rounded border border-white/10 flex items-center gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Prev</span>
            </button>
            <span className="px-3 py-1 bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 rounded font-bold font-mono">
              {currentPage}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage >= totalPages}
              className="px-3 py-1 bg-white/5 hover:bg-white/10 disabled:opacity-40 rounded border border-white/10 flex items-center gap-1"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage >= totalPages}
              className="px-2.5 py-1 bg-white/5 hover:bg-white/10 disabled:opacity-40 rounded border border-white/10 font-mono"
            >
              &raquo;
            </button>
          </div>
        </div>

      </div>

      {/* Full 23-Column Dossier Pop-up Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="glass-card max-w-3xl w-full rounded-2xl border border-white/15 p-6 space-y-5 shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">
                  Humanitarian Aid Dossier PID #{selectedRecord.pid} (All 23 Fields)
                </h3>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              
              {/* Panel 1 */}
              <div className="bg-[#090e1a]/80 p-4 rounded-xl border border-white/10 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block border-b border-white/5 pb-1">
                  1. Identification
                </span>
                <div><span className="text-slate-400">PID:</span> <strong className="text-amber-400">#{selectedRecord.pid}</strong></div>
                <div><span className="text-slate-400">Name:</span> <strong className="text-white">{selectedRecord.name} ({selectedRecord.name_english})</strong></div>
                <div><span className="text-slate-400">Father:</span> <span className="text-slate-200">{selectedRecord.fname} ({selectedRecord.fname_english})</span></div>
                <div><span className="text-slate-400">Grandfather:</span> <span className="text-slate-200">{selectedRecord.gfname} ({selectedRecord.gname_english})</span></div>
                <div><span className="text-slate-400">Tazkira:</span> <span className="text-slate-200 font-mono">{selectedRecord.tazkira}</span></div>
                <div><span className="text-slate-400">Serial/Number:</span> <span className="text-slate-200 font-mono">{selectedRecord.serial} / #{selectedRecord.number}</span></div>
                <div><span className="text-slate-400">File ID:</span> <span className="text-slate-200 font-mono">{selectedRecord.file_id}</span></div>
              </div>

              {/* Panel 2 */}
              <div className="bg-[#090e1a]/80 p-4 rounded-xl border border-white/10 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block border-b border-white/5 pb-1">
                  2. Relief &amp; Economics
                </span>
                <div><span className="text-slate-400">Vulnerability:</span> <strong className="text-amber-400">{selectedRecord.job}</strong></div>
                <div><span className="text-slate-400">Family Size:</span> <strong className="text-white">{selectedRecord.family_count} persons</strong></div>
                <div><span className="text-slate-400">Daily Bread:</span> <strong className="text-cyan-400">{selectedRecord.bread_count} Loaves/Day</strong></div>
                <div><span className="text-slate-400">Income:</span> <span className="text-slate-200">{selectedRecord.income} AFN</span></div>
                <div><span className="text-slate-400">Workers in Household:</span> <span className="text-slate-200">{selectedRecord.worker}</span></div>
                <div><span className="text-slate-400">Status:</span> <span className="text-emerald-400">{selectedRecord.status}</span></div>
                <div><span className="text-slate-400">Designated Bakery:</span> <span className="text-slate-200">{selectedRecord.shop || '---'}</span></div>
              </div>

              {/* Panel 3 */}
              <div className="bg-[#090e1a]/80 p-4 rounded-xl border border-white/10 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block border-b border-white/5 pb-1">
                  3. Location &amp; Contact
                </span>
                <div><span className="text-slate-400">Province:</span> <strong className="text-white">{selectedRecord.province_id} ({selectedRecord.province_english})</strong></div>
                <div><span className="text-slate-400">Nahya:</span> <span className="text-slate-200">{selectedRecord.nahya}</span></div>
                <div><span className="text-slate-400">Gozar:</span> <span className="text-slate-200">{selectedRecord.gozar}</span></div>
                <div><span className="text-slate-400">Primary Phone:</span> <span className="text-slate-200 font-mono">{selectedRecord.phone}</span></div>
                <div><span className="text-slate-400">Secondary Phone:</span> <span className="text-slate-200 font-mono">{selectedRecord.phone_copy}</span></div>
                <div><span className="text-slate-400">Datasource:</span> <span className="text-slate-400 font-mono text-[10px]">{selectedRecord.datasource_id}</span></div>
                <div><span className="text-slate-400">Survey Description:</span> <span className="text-slate-300 text-[11px] block">{selectedRecord.description}</span></div>
              </div>

            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => copyRecordProfile(selectedRecord)}
                className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-xl text-xs transition-all flex items-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? 'Copied Profile' : 'Copy Full Profile'}</span>
              </button>
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-xs transition-all"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
