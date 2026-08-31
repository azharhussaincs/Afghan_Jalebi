import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { CheckCircle2, ShieldCheck, AlertCircle, HelpCircle, Layers, Check, Hash } from 'lucide-react';
import { api } from '../../services/api';
import { QualityReportData } from '../../types';
import { ExplainModal } from '../common/ExplainModal';

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

  // Quality Gauge Chart Option
  const gaugeOption = {
    series: [
      {
        type: 'gauge',
        startAngle: 180,
        endAngle: 0,
        min: 0,
        max: 100,
        splitNumber: 5,
        itemStyle: { color: '#0284c7' },
        progress: { show: true, roundCap: true, width: 14 },
        pointer: { show: false },
        axisLine: { roundCap: true, lineStyle: { width: 14, color: [[1, '#1e293b']] } },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { color: '#94a3b8', fontSize: 10, distance: -40 },
        title: { show: false },
        detail: {
          valueAnimation: true,
          offsetCenter: [0, '-10%'],
          fontSize: 32,
          fontWeight: 'bolder',
          formatter: '{value}%',
          color: '#f8fafc'
        },
        data: [{ value: data.overall_score }]
      }
    ]
  };

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
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors"
        >
          <HelpCircle className="w-3.5 h-3.5 text-brand-400" />
          <span>Quality Scoring Rubric</span>
        </button>
      </div>

      {/* Quality Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Composite Score Card */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400">COMPOSITE SCORE</span>
            <div className="h-32 mt-2">
              <ReactECharts option={gaugeOption} style={{ height: '100%', width: '100%' }} />
            </div>
          </div>
          <div className="text-center text-[11px] text-emerald-400 font-medium">
            Grade: Excellent (High Confidence)
          </div>
        </div>

        {/* Completeness */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
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
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
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
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">VALIDITY & CONSISTENCY</span>
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
                  <tr key={colName} className="hover:bg-slate-900/60">
                    <td className="py-2.5 px-4 font-bold text-brand-300">{colName}</td>
                    <td className="py-2.5 px-4 text-right text-slate-200">{metrics.non_null_count.toLocaleString()}</td>
                    <td className="py-2.5 px-4 text-right text-slate-400">{metrics.null_count.toLocaleString()}</td>
                    <td className="py-2.5 px-4 text-right">
                      <span className={pct >= 99 ? 'text-emerald-400' : pct >= 90 ? 'text-sky-400' : 'text-amber-400'}>
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
