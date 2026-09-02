import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import {
  Search,
  User,
  Users,
  Baby,
  BookOpen,
  MapPin,
  Calendar,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Award
} from 'lucide-react';
import { api } from '../../services/api';
import { FamilyTreeData } from '../../types';

interface RelationshipLabProps {
  initialRecordId?: number | null;
  onSelectRecord?: (recordId: number) => void;
}

export const RelationshipLab: React.FC<RelationshipLabProps> = ({ initialRecordId }) => {
  // Family Tree State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [currentRecordId, setCurrentRecordId] = useState<number>(initialRecordId || 1009);
  const [familyTree, setFamilyTree] = useState<FamilyTreeData | null>(null);
  const [treeLoading, setTreeLoading] = useState(false);
  const [treeError, setTreeError] = useState<string | null>(null);

  // Load Family Tree for currentRecordId
  useEffect(() => {
    if (!currentRecordId) return;
    setTreeLoading(true);
    setTreeError(null);
    api.getFamilyTree(currentRecordId)
      .then((res) => {
        setFamilyTree(res);
      })
      .catch((err) => {
        console.error('Failed to load family tree', err);
        setTreeError('Failed to reconstruct family tree for this record.');
      })
      .finally(() => setTreeLoading(false));
  }, [currentRecordId]);

  // Sync initialRecordId if passed from props
  useEffect(() => {
    if (initialRecordId) {
      setCurrentRecordId(initialRecordId);
    }
  }, [initialRecordId]);

  // Search candidate persons for family tree
  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const results = await api.searchFamilyPersons(searchQuery.trim());
      setSearchResults(results);
      if (results.length === 1) {
        setCurrentRecordId(results[0].id);
      }
    } catch (err) {
      console.error('Family search failed', err);
    } finally {
      setSearching(false);
    }
  };

  // ECharts Tree Option
  const getFamilyTreeOption = () => {
    if (!familyTree) return {};
    return {
      tooltip: {
        trigger: 'item',
        triggerOn: 'mousemove',
        formatter: (params: any) => {
          const d = params.data;
          return `<div class="font-sans text-xs">
            <strong class="text-slate-100">${d.name}</strong><br/>
            ${d.relation ? `<span class="text-brand-400 font-semibold">${d.relation}</span>` : ''}
          </div>`;
        }
      },
      series: [
        {
          type: 'tree',
          data: [familyTree.tree_graph],
          top: '8%',
          left: '14%',
          bottom: '8%',
          right: '22%',
          symbolSize: (val: any, params: any) => (params.data.is_target ? 16 : 10),
          orient: 'LR',
          label: {
            position: 'left',
            verticalAlign: 'middle',
            align: 'right',
            fontSize: 11,
            color: '#e2e8f0',
            formatter: '{b}'
          },
          leaves: {
            label: {
              position: 'right',
              verticalAlign: 'middle',
              align: 'left'
            }
          },
          emphasis: {
            focus: 'descendant'
          },
          expandAndCollapse: false,
          animationDuration: 550,
          animationDurationUpdate: 750,
          lineStyle: {
            color: '#6366f1',
            width: 1.5,
            curveness: 0.5
          }
        }
      ]
    };
  };

  const p = familyTree?.target_person;

  return (
    <div className="p-6 space-y-6">

      {/* Person Search Card */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
              <Search className="w-4 h-4 text-brand-400" />
              Search Any Person to Build Their Family Tree
            </h3>
            <p className="text-xs text-slate-400">
              Search by Given Name (نام), Father's Name (نام پدر), or Record ID (e.g. 1009, 1016, فاطمه, محمد شاه)
            </p>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-medium text-slate-500">Quick Samples:</span>
            {[
              { id: 1009, label: 'ظریفه (Record #1009)' },
              { id: 1016, label: 'محمد شاه (Record #1016)' },
              { id: 1013, label: 'بلال (Record #1013)' },
              { id: 1030, label: 'عبدالله (Record #1030)' }
            ].map((sample) => (
              <button
                key={sample.id}
                onClick={() => setCurrentRecordId(sample.id)}
                className={`px-2.5 py-1 rounded-lg text-xs border transition-all ${
                  currentRecordId === sample.id
                    ? 'bg-brand-500/20 text-brand-300 border-brand-500/40 font-semibold'
                    : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                {sample.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search Input Form */}
        <form onSubmit={handleSearchSubmit} className="relative flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Enter name, father name, or record ID to reconstruct family tree..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all font-sans"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </div>
          <button
            type="submit"
            disabled={searching}
            className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold shadow-md shadow-brand-600/20 transition-all flex items-center gap-1.5 disabled:opacity-50"
          >
            {searching ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <span>Search Family</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Search Candidate Results Dropdown / Chips */}
        {searchResults.length > 0 && (
          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 space-y-2">
            <div className="text-[11px] font-semibold text-slate-400 flex items-center justify-between">
              <span>Matching Persons Found ({searchResults.length}): Click any profile to reconstruct tree</span>
              <button
                onClick={() => setSearchResults([])}
                className="text-xs text-slate-500 hover:text-slate-300"
              >
                Close
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {searchResults.map((r) => (
                <button
                  key={r.id}
                  onClick={() => {
                    setCurrentRecordId(r.id);
                    setSearchResults([]);
                  }}
                  className={`p-2.5 rounded-lg border text-left flex items-center justify-between transition-all ${
                    currentRecordId === r.id
                      ? 'bg-brand-600/20 border-brand-500/50 text-white'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800/60 hover:border-slate-700'
                  }`}
                >
                  <div className="truncate">
                    <div className="font-bold text-xs text-slate-100 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                      <span>{r.name}</span>
                      <span className="text-[10px] text-slate-400 font-normal">ولد {r.fname}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                      <span>#{r.id}</span>
                      <span>•</span>
                      <span>{r.province} / {r.district}</span>
                      <span>•</span>
                      <span>{r.dob_year ? `${r.dob_year} SH` : ''}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 shrink-0 ml-2" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Loading & Error States */}
      {treeLoading && (
        <div className="p-12 flex flex-col items-center justify-center min-h-[300px] bg-slate-900/40 rounded-2xl border border-slate-800">
          <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-xs font-mono text-slate-400">Reconstructing genealogical family tree across 24 Million records...</p>
        </div>
      )}

      {treeError && !treeLoading && (
        <div className="p-6 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-center text-rose-300 text-sm">
          {treeError}
        </div>
      )}

      {/* Reconstructed Family Tree Display */}
      {!treeLoading && familyTree && p && (
        <div className="space-y-6">
          {/* Target Person Hero Profile Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -z-10"></div>
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              {/* Subject Details */}
              <div className="flex items-center space-x-4">
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg text-2xl font-bold ${
                    p.gender === 1
                      ? 'bg-gradient-to-tr from-pink-600 to-rose-400 text-white shadow-pink-500/20'
                      : 'bg-gradient-to-tr from-cyan-600 to-blue-500 text-white shadow-cyan-500/20'
                  }`}
                >
                  {(p.name || '?').charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                      <Award className="w-3 h-3" />
                      Target Person (شخص اصلی)
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">Record #{p.id}</span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-100 mt-1 tracking-tight">
                    {p.name}
                  </h3>
                  <div className="text-xs text-slate-300 flex flex-wrap items-center gap-3 mt-1 font-sans">
                    <span><strong>ولد (Father):</strong> {p.fname || 'نامشخص'}</span>
                    <span>•</span>
                    <span><strong>پدرکلان (Grandfather):</strong> {p.gname || 'نامشخص'}</span>
                    <span>•</span>
                    <span><strong>جنسیت (Gender):</strong> {p.gender === 1 ? 'Female (زن)' : 'Male (مرد)'}</span>
                  </div>
                </div>
              </div>

              {/* Provenance Badges */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-brand-400" />
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase font-bold">Birth Year</div>
                    <div className="text-xs font-bold text-slate-200">{p.dob_year ? `${p.dob_year} SH` : 'N/A'}</div>
                  </div>
                </div>

                <div className="px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase font-bold">Location</div>
                    <div className="text-xs font-bold text-slate-200">{p.province} / {p.district}</div>
                  </div>
                </div>

                <div className="px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-indigo-400" />
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase font-bold">Ledger Book & Page</div>
                    <div className="text-xs font-bold text-slate-200">Page {p.page_number} (Rec #{p.record_number})</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Visual ECharts Family Tree Graph */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-brand-400" />
                  Interactive Genealogical Tree Graph (درخت نسب‌شناسی)
                </h3>
                <p className="text-xs text-slate-400">
                  Visualizing generational ancestry: Grandfather &rarr; Father &rarr; Target Subject &amp; Siblings &rarr; Next Generation
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span> Ancestors</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-amber-300"></span> Subject</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span> Siblings</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> 👦 Son (پسر)</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> 👧 Daughter (دختر)</span>
              </div>
            </div>

            <div className="h-96 w-full rounded-xl bg-slate-950/70 border border-slate-800/80 p-2">
              <ReactECharts option={getFamilyTreeOption()} style={{ height: '100%', width: '100%' }} />
            </div>
          </div>

          {/* Lineage Breakdown Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 1. Ancestry: Grandfather & Father */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Ancestors (اجداد و والدین)
                  </h4>
                  <p className="text-[11px] text-slate-500">Generations 1 &amp; 2</p>
                </div>
              </div>

              <div className="space-y-2.5">
                {/* Grandfather */}
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  <div className="text-[10px] uppercase font-bold text-indigo-400">Generation 1: Grandfather (پدرکلان)</div>
                  <div className="text-sm font-black text-slate-100 mt-0.5">{familyTree.grandfather_name}</div>
                  <div className="text-[10px] text-slate-400 mt-1">Patrilineal root identifier in registration ledger</div>
                </div>

                {/* Father */}
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  <div className="text-[10px] uppercase font-bold text-blue-400">Generation 2: Father (پدر / ولد)</div>
                  <div className="text-sm font-black text-slate-100 mt-0.5">{familyTree.father_name}</div>
                  {familyTree.father_candidates && familyTree.father_candidates.length > 0 && (
                    <div className="mt-2 text-[10px] text-slate-400">
                      <span className="font-semibold text-slate-300">Candidate Records in {p.province}:</span>
                      <div className="mt-1 space-y-1">
                        {familyTree.father_candidates.slice(0, 3).map((f: any) => (
                          <button
                            key={f.id}
                            onClick={() => setCurrentRecordId(f.id)}
                            className="w-full text-left p-1.5 rounded bg-slate-900 hover:bg-slate-800 flex items-center justify-between text-[10px] text-slate-300 transition-colors"
                          >
                            <span>{f.name} (ولد {f.fname}) - #{f.id}</span>
                            {f.is_exact_lineage && (
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                Exact Lineage
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 2. Siblings (Brothers & Sisters) */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-lg bg-pink-500/10 text-pink-400">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      Siblings (برادران و خواهران)
                    </h4>
                    <p className="text-[11px] text-slate-500">{familyTree.siblings.length} verified in database</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {familyTree.siblings.length === 0 ? (
                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-center text-xs text-slate-500">
                    No sibling records found sharing father '{familyTree.father_name}' in {p.province}.
                  </div>
                ) : (
                  familyTree.siblings.map((s) => (
                    <div
                      key={s.id}
                      className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between hover:border-slate-700 transition-all"
                    >
                      <div className="truncate">
                        <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                          <span className={s.gender === 1 ? 'text-pink-400 font-medium' : 'text-cyan-400 font-medium'}>
                            {s.gender === 1 ? '👩 Sister (خواهر)' : '👨 Brother (برادر)'}
                          </span>
                          <span>•</span>
                          <span className="text-slate-100 font-persian font-bold">{s.name}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 flex flex-wrap items-center gap-1.5 mt-0.5">
                          <span>ولد {s.fname}</span>
                          {s.dob_year && <span>({s.dob_year} SH)</span>}
                          {s.is_full_sibling && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              Full Sibling
                            </span>
                          )}
                          {s.is_same_page && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                              Same Page
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => setCurrentRecordId(s.id)}
                        className="p-1.5 rounded-lg bg-slate-900 hover:bg-brand-600 text-slate-400 hover:text-white transition-all ml-2 shrink-0 cursor-pointer"
                        title={`Reconstruct family tree for ${s.name}`}
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* 3. Children (Sons & Daughters) */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <Baby className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Children (فرزندان: پسر و دختر)
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    {familyTree.children.filter((c) => c.gender === 0).length} Sons • {familyTree.children.filter((c) => c.gender === 1).length} Daughters
                  </p>
                </div>
              </div>

              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {familyTree.children.length === 0 ? (
                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-center text-xs text-slate-500">
                    {p.gender === 1 
                      ? `Civil registry records patrilineal parentage. Children of female citizens are indexed under their respective father's lineage.`
                      : (p.dob_year && p.dob_year > 1380
                        ? `Citizen registered as minor child (${p.dob_year} SH). No descendant records present.`
                        : `No verified registered children where father is '${p.name}' and grandfather is '${p.fname}'.`)}
                  </div>
                ) : (
                  familyTree.children.map((c) => (
                    <div
                      key={c.id}
                      className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between hover:border-slate-700 transition-all"
                    >
                      <div className="truncate">
                        <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                          <span className={c.gender === 1 ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                            {c.gender === 1 ? '👧 Daughter (دختر)' : '👦 Son (پسر)'}
                          </span>
                          <span>•</span>
                          <span className="text-slate-100 font-persian font-bold">{c.name}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 flex flex-wrap items-center gap-1.5 mt-0.5">
                          <span>ولد {c.fname}</span>
                          {c.dob_year && <span>({c.dob_year} SH)</span>}
                          {c.confidence && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                              {c.confidence}
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => setCurrentRecordId(c.id)}
                        className="p-1.5 rounded-lg bg-slate-900 hover:bg-brand-600 text-slate-400 hover:text-white transition-all ml-2 shrink-0 cursor-pointer"
                        title={`Reconstruct family tree for ${c.name}`}
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* 4. Same Ledger Page Co-Registrants (Household Members) */}
          {familyTree.page_peers.length > 0 && (
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Same Registry Page Co-Registrants (اعضای ثبت شده در یک صفحه از دفتر ثبت احوال)
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    {familyTree.page_peers.length} individuals registered together in Volume '{p.book_name}', Page {p.page_number}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {familyTree.page_peers.map((peer) => (
                  <div
                    key={peer.id}
                    className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between hover:border-slate-700 transition-all"
                  >
                    <div className="truncate">
                      <div className="text-xs font-bold text-slate-200">
                        {peer.name}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        ولد {peer.fname} {peer.gname ? `(پدرکلان: ${peer.gname})` : ''}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        Entry #{peer.record_number} • {peer.dob_year ? `${peer.dob_year} SH` : ''}
                      </div>
                    </div>

                    <button
                      onClick={() => setCurrentRecordId(peer.id)}
                      className="p-1.5 rounded-lg bg-slate-900 hover:bg-brand-600 text-slate-400 hover:text-white transition-all ml-2 shrink-0"
                      title={`View Family Tree for ${peer.name}`}
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
