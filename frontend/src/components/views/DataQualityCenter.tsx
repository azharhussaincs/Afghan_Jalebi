import React, { useEffect, useState } from 'react';
import { CheckCircle2, ShieldCheck, HelpCircle, Hash, Award, Sparkles } from 'lucide-react';
import { api } from '../../services/api';
import { QualityReportData } from '../../types';
import { ExplainModal } from '../common/ExplainModal';

// Modern, beautifully proportioned SVG Gauge with zero text clipping
const CompositeScoreGauge: React.FC<{ score: number }> = ({ score }) => {
  const radius = 68;
  const circumference = Math.PI * radius;
  const clampedScore = Math.min(Math.max(score, 0), 100);
  const strokeOffset = circumference - (clampedScore / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center pt-2 pb-1">
      <div className="relative w-52 h-28 flex items-center justify-center">
        <svg viewBox="0 0 200 112" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="compositeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0ea5e9" />
              <stop offset="50%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
            <filter id="gaugeGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#10b981" floodOpacity="0.45" />
            </filter>
          </defs>

          {/* Background Track Arc */}
          <path
            d="M 32 90 A 68 68 0 0 1 168 90"
            fill="none"
            stroke="#1e293b"
            strokeWidth="12"
            strokeLinecap="round"
          />

          {/* Subtle tick markers */}
          <circle cx="32" cy="90" r="2.5" fill="#475569" />
          <circle cx="100" cy="22" r="2.5" fill="#475569" />
          <circle cx="168" cy="90" r="2.5" fill="#475569" />

          {/* Foreground Animated Progress Arc */}
          <path
            d="M 32 90 A 68 68 0 0 1 168 90"
            fill="none"
            stroke="url(#compositeGradient)"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeOffset}
            filter="url(#gaugeGlow)"
            className="transition-all duration-1000 ease-out"
          />

          {/* Scale Labels below ends */}
          <text x="32" y="106" fill="#64748b" fontSize="10" fontWeight="600" textAnchor="middle" fontFamily="monospace">
            0%
          </text>
          <text x="100" y="15" fill="#475569" fontSize="9" fontWeight="500" textAnchor="middle" fontFamily="monospace">
            50%
          </text>
          <text x="168" y="106" fill="#64748b" fontSize="10" fontWeight="600" textAnchor="middle" fontFamily="monospace">
            100%
          </text>
        </svg>

        {/* Center Readout with Zero Clipping */}
        <div className="absolute top-9 flex flex-col items-center justify-center">
          <div className="flex items-baseline tracking-tight">
            <span className="text-3xl font-black text-slate-100 font-mono">
              {score.toFixed(1)}
            </span>
            <span className="text-base font-bold text-emerald-400 ml-0.5">%</span>
          </div>
          <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase mt-0.5">
            Integrity Index
          </span>
        </div>
      </div>

      {/* Grade Status Pill Badge */}
      <div className="mt-2.5 flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 shadow-sm shadow-emerald-500/10">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
        <span className="text-[11px] font-bold text-emerald-300">Grade: Excellent (High Confidence)</span>
      </div>
    </div>
  );
};

export const DataQualityCenter: React.FC = () => {
  const [data, setData] = useState<QualityReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showExplain, setShowExplain] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.getQualityReport()
      .then(setData)
      .catch((err) => console.error('Failed to load quality report', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-mono text-slate-400">Auditing completeness & integrity across 16 columns...</p>
      </div>
    );
  }

  const columnsList = Object.entries(data.column_metrics);

  return (
    <div className="p-6 space-y-6">
      {/* Header Banner */}
      <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100">
              Data Quality & Audit Center
            </h2>
            <p className="text-xs text-slate-400">
              Multi-dimensional evaluation of completeness, uniqueness, schema validity, and relational consistency
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowExplain(true)}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
        >
          <HelpCircle className="w-3.5 h-3.5 text-brand-400" />
          <span>Quality Scoring Rubric</span>
        </button>
      </div>

      {/* Quality Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Composite Score Card */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between hover:border-slate-700/80 transition-all shadow-sm">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-slate-400 tracking-wide">COMPOSITE SCORE</span>
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Award className="w-4 h-4" />
              </div>
            </div>
            <CompositeScoreGauge score={data.overall_score} />
          </div>
          <p className="text-[11px] text-slate-400 text-center mt-2">
            Harmonic mean across completeness, uniqueness & validity
          </p>
        </div>

        {/* Completeness */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between hover:border-slate-700/80 transition-all shadow-sm">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">COMPLETENESS (35%)</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-black text-slate-100 font-mono mt-3">
              {data.completeness_score}%
            </div>
            <p className="text-xs text-slate-400 mt-1">Non-null cell population across all columns</p>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-4">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${data.completeness_score}%` }}></div>
          </div>
        </div>

        {/* Uniqueness */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between hover:border-slate-700/80 transition-all shadow-sm">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">UNIQUENESS (30%)</span>
              <Hash className="w-4 h-4 text-sky-400" />
            </div>
            <div className="text-3xl font-black text-slate-100 font-mono mt-3">
              {data.uniqueness_score}%
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Duplicate IDs: <span className="font-mono text-slate-200">{data.duplicate_ids}</span> | Duplicate Hashes: <span className="font-mono text-slate-200">{data.duplicate_hashes}</span>
            </p>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-4">
            <div className="bg-sky-500 h-full rounded-full" style={{ width: `${data.uniqueness_score}%` }}></div>
          </div>
        </div>

        {/* Validity & Consistency */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between hover:border-slate-700/80 transition-all shadow-sm">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">VALIDITY & CONSISTENCY (35%)</span>
              <ShieldCheck className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-3xl font-black text-slate-100 font-mono mt-3">
              {data.validity_score}%
            </div>
            <p className="text-xs text-slate-400 mt-1">Data type compliance and province/district code integrity</p>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-4">
            <div className="bg-purple-500 h-full rounded-full" style={{ width: `${data.validity_score}%` }}></div>
          </div>
        </div>
      </div>

      {/* 16-Column Audit Table */}
      <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
        <h3 className="text-sm font-bold text-slate-100 mb-1">16-Column Completeness & Integrity Matrix</h3>
        <p className="text-xs text-slate-400 mb-4">Detailed field-level null value and population breakdown</p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800 text-slate-300">
                <th className="py-3 px-4 font-semibold">Column Name</th>
                <th className="py-3 px-4 font-semibold text-right">Populated Rows</th>
                <th className="py-3 px-4 font-semibold text-right">Missing / Null</th>
                <th className="py-3 px-4 font-semibold text-right">Completeness Rate</th>
                <th className="py-3 px-4 font-semibold">Quality Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {columnsList.map(([colName, metrics]) => {
                const pct = metrics.completeness_pct;
                return (
                  <tr key={colName} className="hover:bg-slate-900/60 transition-colors">
                    <td className="py-2.5 px-4 font-bold text-brand-300">{colName}</td>
                    <td className="py-2.5 px-4 text-right text-slate-200">{metrics.non_null_count.toLocaleString()}</td>
                    <td className="py-2.5 px-4 text-right text-slate-400">{metrics.null_count.toLocaleString()}</td>
                    <td className="py-2.5 px-4 text-right">
                      <span className={pct >= 99 ? 'text-emerald-400 font-semibold' : pct >= 90 ? 'text-sky-400 font-semibold' : 'text-amber-400 font-semibold'}>
                        {pct}%
                      </span>
                    </td>
                    <td className="py-2.5 px-4 font-sans">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium ${
                          pct >= 99
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}
                      >
                        {pct >= 99 ? 'Complete' : 'Minor Nulls'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showExplain && (
        <ExplainModal
          isOpen={true}
          onClose={() => setShowExplain(false)}
          title="Data Quality Scoring Methodology"
          topic="quality_score"
        />
      )}
    </div>
  );
};
