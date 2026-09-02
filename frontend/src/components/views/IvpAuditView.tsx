import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck,
  Search,
  KeyRound,
  Lock,
  Unlock,
  AlertTriangle,
  Building2,
  CheckCircle2,
  Copy,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  X,
  Filter
} from 'lucide-react';

interface IvpAccount {
  id: number;
  username: string;
  normalized_username: string;
  email: string;
  normalized_email: string;
  email_confirmed: number;
  password_hash: string;
  security_stamp: string;
  concurrency_stamp: string;
  phone_number: string;
  phone_number_confirmed: number;
  two_factor_enabled: number;
  lockout_end: string | null;
  lockout_enabled: number;
  access_failed_count: number;
  first_name: string;
  first_name_english?: string;
  last_name: string;
  last_name_english?: string;
  office_id: number;
  disabled: number;
  is_admin: number;
  request_source_id: string;
  created_on: string;
  created_by: string;
  modified_on: string;
  modified_by: string;
}

export const IvpAuditView: React.FC = () => {
  const [accounts, setAccounts] = useState<IvpAccount[]>([]);
  const [totalAccounts, setTotalAccounts] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [officeFilter, setOfficeFilter] = useState<string>('ALL');

  const [loading, setLoading] = useState<boolean>(true);
  const [selectedAccount, setSelectedAccount] = useState<IvpAccount | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    fetchData(searchQuery, roleFilter, officeFilter, currentPage);
  }, [currentPage, roleFilter, officeFilter]);

  const fetchData = async (
    q = searchQuery,
    role = roleFilter,
    office = officeFilter,
    page = currentPage
  ) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setLoading(true);
    try {
      const url = `/api/ivp/audit?q=${encodeURIComponent(q.trim())}&role=${encodeURIComponent(role)}&office=${encodeURIComponent(office)}&page=${page}&limit=50`;
      const res = await fetch(url, { signal: abortControllerRef.current.signal });
      const data = await res.json();
      if (data.success) {
        setAccounts(data.records || []);
        setTotalAccounts(data.total || 0);
        setTotalPages(data.totalPages || 1);
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('IVP audit fetch error:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setCurrentPage(1);
    fetchData(searchQuery, roleFilter, officeFilter, 1);
  };

  const handleReset = () => {
    setSearchQuery('');
    setRoleFilter('ALL');
    setOfficeFilter('ALL');
    setCurrentPage(1);
    fetchData('', 'ALL', 'ALL', 1);
  };

  const copyAccountProfile = (acc: IvpAccount) => {
    const text = `IVP Account #${acc.id} | User: ${acc.username} | Role: ${acc.is_admin ? 'SysAdmin' : 'Operator'} | Office: #${acc.office_id} | Email: ${acc.email} | Hash: ${acc.password_hash} | Status: ${acc.disabled ? 'Disabled' : 'Active'}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto text-slate-100">
      
      {/* Header Banner */}
      <div className="glass-card p-5 rounded-2xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 border border-emerald-400/40 flex items-center justify-center shadow-lg shadow-emerald-500/25">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black tracking-tight text-white">
                IVP OPERATOR SECURITY &amp; CREDENTIALS AUDIT
              </h2>
              <span className="badge-glass badge-green">1,112 OPERATOR ACCOUNTS</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Identity Verification Portal operator audit trail, cryptographic hash verifier, and 25-column security ledger.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="badge-glass badge-cyan">
            {loading ? 'Querying Audit...' : `Indexed Accounts: ${totalAccounts.toLocaleString()}`}
          </span>
        </div>
      </div>

      {/* KPI Telemetry Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="telemetry-card card-glow-emerald p-4 rounded-xl">
          <span className="text-[11px] font-bold text-slate-400 block uppercase">Total Operator Accounts</span>
          <span className="text-xl font-extrabold text-white font-mono mt-1 block">1,112</span>
          <span className="badge-glass badge-green mt-2 inline-block text-[10px]">Active Registry</span>
        </div>

        <div className="telemetry-card card-glow-cyan p-4 rounded-xl">
          <span className="text-[11px] font-bold text-slate-400 block uppercase">Authorized &amp; Active</span>
          <span className="text-xl font-extrabold text-emerald-400 font-mono mt-1 block">826</span>
          <span className="badge-glass badge-cyan mt-2 inline-block text-[10px]">74.3% In Good Standing</span>
        </div>

        <div className="telemetry-card card-glow-gold p-4 rounded-xl">
          <span className="text-[11px] font-bold text-slate-400 block uppercase">Suspended / Disabled</span>
          <span className="text-xl font-extrabold text-amber-400 font-mono mt-1 block">286</span>
          <span className="badge-glass badge-gold mt-2 inline-block text-[10px]">25.7% Revoked / Locked</span>
        </div>

        <div className="telemetry-card card-glow-purple p-4 rounded-xl">
          <span className="text-[11px] font-bold text-slate-400 block uppercase">Regional Branch Offices</span>
          <span className="text-xl font-extrabold text-purple-400 font-mono mt-1 block">48 Offices</span>
          <span className="badge-glass badge-purple mt-2 inline-block text-[10px]">HQ Office #104 Top Volume</span>
        </div>
      </div>

      {/* Search & Filter Controls Card */}
      <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Filter className="w-4 h-4 text-emerald-400" />
            Security Credential Filter Console
          </span>
          <span className="badge-glass badge-green">50 ACCOUNTS / PAGE</span>
        </div>

        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-400">Search Username / Name / Email:</label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="e.g. sysadmin, operator_1, احمد..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#090e1a]/90 border border-white/10 focus:border-emerald-500 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder:text-slate-500 outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-400">Authorization / Role:</label>
            <select
              value={roleFilter}
              onChange={(e) => { setRoleFilter(e.target.value); setCurrentPage(1); }}
              className="w-full bg-[#090e1a]/90 border border-white/10 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs text-white outline-none cursor-pointer"
            >
              <option value="ALL">All Roles &amp; States</option>
              <option value="ADMIN">System Administrators (is_admin=1)</option>
              <option value="OPERATOR">Portal Operators (is_admin=0)</option>
              <option value="ACTIVE">Active Authorized (disabled=0)</option>
              <option value="DISABLED">Suspended / Disabled (disabled=1)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-400">Regional Branch Office:</label>
            <select
              value={officeFilter}
              onChange={(e) => { setOfficeFilter(e.target.value); setCurrentPage(1); }}
              className="w-full bg-[#090e1a]/90 border border-white/10 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs text-white outline-none cursor-pointer"
            >
              <option value="ALL">All Branch Offices (48 Total)</option>
              <option value="Office #104">Office #104 (NSIA Kabul Central HQ)</option>
              <option value="Office #1">Office #1 (Central Directorate)</option>
              <option value="Office #156">Office #156 (Regional Verification)</option>
              <option value="Office #4">Office #4 (Provincial Branch)</option>
              <option value="Office #129">Office #129 (Branch Center)</option>
              <option value="Office #2">Office #2 (Regional Center)</option>
            </select>
          </div>

          <div className="flex items-end gap-2">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
            >
              Execute Filter
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

      {/* 25-Column Audit Grid */}
      <div className="glass-card rounded-2xl border border-white/10 overflow-hidden space-y-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-[#090e1a]/90 font-mono text-slate-400">
                <th className="py-3 px-3 w-16">ID</th>
                <th className="py-3 px-3">Username</th>
                <th className="py-3 px-3">Operator Name</th>
                <th className="py-3 px-3">Email Address</th>
                <th className="py-3 px-3 text-center">Office ID</th>
                <th className="py-3 px-3">Role</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">2FA</th>
                <th className="py-3 px-3">Password Hash (PBKDF2)</th>
                <th className="py-3 px-3">Created Audit</th>
                <th className="py-3 px-3 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={11} className="py-16 text-center text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto text-emerald-400 mb-2" />
                    <span>Querying IVP operator credentials ledger...</span>
                  </td>
                </tr>
              ) : accounts.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-16 text-center text-slate-400">
                    No operator accounts found matching criteria.
                  </td>
                </tr>
              ) : (
                accounts.map(acc => (
                  <tr
                    key={acc.id}
                    onClick={() => setSelectedAccount(acc)}
                    className="hover:bg-white/[0.02] cursor-pointer transition-colors"
                  >
                    <td className="py-2.5 px-3 font-mono font-bold text-amber-400">
                      #{acc.id}
                    </td>

                    <td className="py-2.5 px-3 font-mono font-bold text-white">
                      {acc.username}
                    </td>

                    <td className="py-2.5 px-3">
                      <strong className="text-white block font-bold text-xs">{acc.first_name} {acc.last_name}</strong>
                      <span className="text-emerald-400 text-[10px] block font-sans">
                        {acc.first_name_english || ''} {acc.last_name_english || ''}
                      </span>
                    </td>

                    <td className="py-2.5 px-3 font-mono text-slate-400 text-[11px]">
                      {acc.email}
                    </td>

                    <td className="py-2.5 px-3 text-center">
                      <span className="badge-glass badge-cyan">
                        Office #{acc.office_id}
                      </span>
                    </td>

                    <td className="py-2.5 px-3">
                      {acc.is_admin ? (
                        <span className="badge-glass badge-gold font-bold">
                          SYSADMIN
                        </span>
                      ) : (
                        <span className="badge-glass">
                          OPERATOR
                        </span>
                      )}
                    </td>

                    <td className="py-2.5 px-3">
                      {acc.disabled ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                          <Lock className="w-2.5 h-2.5" />
                          Disabled
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          <Unlock className="w-2.5 h-2.5" />
                          Active
                        </span>
                      )}
                    </td>

                    <td className="py-2.5 px-3">
                      {acc.two_factor_enabled ? (
                        <span className="text-emerald-400 font-mono text-[10px]">ENABLED</span>
                      ) : (
                        <span className="text-slate-500 font-mono text-[10px]">OFF</span>
                      )}
                    </td>

                    <td className="py-2.5 px-3 font-mono text-slate-500 text-[10px] truncate max-w-[120px]">
                      {acc.password_hash}
                    </td>

                    <td className="py-2.5 px-3 font-mono text-slate-400 text-[10px]">
                      {acc.created_on?.split(' ')[0] || '2023-05-10'}
                    </td>

                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedAccount(acc); }}
                        className="px-2.5 py-1 bg-white/5 hover:bg-emerald-500/20 text-slate-300 hover:text-white rounded border border-white/10 font-medium transition-all text-[11px]"
                      >
                        Profile
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
            Showing Page <strong className="text-white">{currentPage}</strong> of <strong className="text-white">{totalPages.toLocaleString()}</strong> ({totalAccounts.toLocaleString()} total accounts)
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

      {/* Full 25-Column Security Dossier Modal */}
      {selectedAccount && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="glass-card max-w-3xl w-full rounded-2xl border border-white/15 p-6 space-y-5 shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">
                  Security Account #{selectedAccount.id} &bull; {selectedAccount.username}
                </h3>
              </div>
              <button
                onClick={() => setSelectedAccount(null)}
                className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              
              <div className="bg-[#090e1a]/80 p-4 rounded-xl border border-white/10 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block border-b border-white/5 pb-1">
                  1. Identity &amp; Profile
                </span>
                <div><span className="text-slate-400">Account ID:</span> <strong className="text-amber-400">#{selectedAccount.id}</strong></div>
                <div><span className="text-slate-400">Username:</span> <strong className="text-white">{selectedAccount.username}</strong></div>
                <div><span className="text-slate-400">Full Name:</span> <strong className="text-white">{selectedAccount.first_name} {selectedAccount.last_name}</strong></div>
                <div><span className="text-slate-400">English:</span> <span className="text-emerald-400">{selectedAccount.first_name_english} {selectedAccount.last_name_english}</span></div>
                <div><span className="text-slate-400">Email:</span> <span className="text-slate-200 font-mono">{selectedAccount.email}</span></div>
                <div><span className="text-slate-400">Phone:</span> <span className="text-slate-200 font-mono">{selectedAccount.phone_number}</span></div>
                <div><span className="text-slate-400">Office ID:</span> <span className="badge-glass badge-cyan">Office #{selectedAccount.office_id}</span></div>
              </div>

              <div className="bg-[#090e1a]/80 p-4 rounded-xl border border-white/10 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block border-b border-white/5 pb-1">
                  2. Security Credentials
                </span>
                <div><span className="text-slate-400">Privilege:</span> <strong className={selectedAccount.is_admin ? 'text-amber-400' : 'text-slate-200'}>{selectedAccount.is_admin ? 'Administrator' : 'Standard Operator'}</strong></div>
                <div><span className="text-slate-400">Status:</span> <span className={selectedAccount.disabled ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>{selectedAccount.disabled ? 'Disabled' : 'Active & Authorized'}</span></div>
                <div><span className="text-slate-400">2-Factor Auth:</span> <span className="text-slate-200">{selectedAccount.two_factor_enabled ? 'Enabled' : 'Disabled'}</span></div>
                <div><span className="text-slate-400">Failed Access:</span> <span className="text-slate-200 font-mono">{selectedAccount.access_failed_count} attempts</span></div>
                <div><span className="text-slate-400">Security Stamp:</span> <span className="text-slate-400 font-mono text-[10px] truncate block">{selectedAccount.security_stamp}</span></div>
                <div><span className="text-slate-400">Concurrency:</span> <span className="text-slate-400 font-mono text-[10px] truncate block">{selectedAccount.concurrency_stamp}</span></div>
              </div>

              <div className="bg-[#090e1a]/80 p-4 rounded-xl border border-white/10 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block border-b border-white/5 pb-1">
                  3. Audit &amp; Cryptography
                </span>
                <div><span className="text-slate-400">Request Source:</span> <span className="text-slate-300 font-mono text-[11px] block">{selectedAccount.request_source_id}</span></div>
                <div><span className="text-slate-400">Created On:</span> <span className="text-slate-300 font-mono text-[11px] block">{selectedAccount.created_on}</span></div>
                <div><span className="text-slate-400">Created By:</span> <span className="text-slate-300 font-mono text-[11px] block">{selectedAccount.created_by}</span></div>
                <div><span className="text-slate-400">Modified On:</span> <span className="text-slate-300 font-mono text-[11px] block">{selectedAccount.modified_on}</span></div>
                <div><span className="text-slate-400">Password Hash:</span> <span className="text-slate-500 font-mono text-[10px] break-all block bg-black/40 p-1.5 rounded">{selectedAccount.password_hash}</span></div>
              </div>

            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => copyAccountProfile(selectedAccount)}
                className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-xl text-xs transition-all flex items-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? 'Copied Profile' : 'Copy Security Audit'}</span>
              </button>
              <button
                onClick={() => setSelectedAccount(null)}
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
