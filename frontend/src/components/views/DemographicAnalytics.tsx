import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { Users, Calendar, HelpCircle, Layers, TrendingUp } from 'lucide-react';
import { api } from '../../services/api';
import { useFilters } from '../../context/FilterContext';
import { DemographicAnalyticsData } from '../../types';
import { ExplainModal } from '../common/ExplainModal';

export const DemographicAnalytics: React.FC = () => {
  const { toQueryParams, refreshKey } = useFilters();
  const [data, setData] = useState<DemographicAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [explainTopic, setExplainTopic] = useState<'solar_hijri' | 'gender_semantics' | null>(null);

  useEffect(() => {
    setLoading(true);
    api.getDemographicAnalytics(toQueryParams())
      .then(setData)
      .catch((err) => console.error('Failed to load demographic data', err))
      .finally(() => setLoading(false));
  }, [refreshKey, JSON.stringify(toQueryParams())]);

  if (loading || !data) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-mono text-slate-400">Aggregating demographic cohorts...</p>
      </div>
    );
  }

  const cohorts = data.dob_gender_distribution;

  // Stacked Area Chart Option: Year x Gender
  const stackedOption = {
    tooltip: { trigger: 'axis', axisPointer: { type: 'cross', label: { backgroundColor: '#0f172a' } } },
    legend: { data: ['Male (مرد)', 'Female (زن)'], textStyle: { color: '#94a3b8', fontSize: 11 } },
    grid: { left: '3%', right: '4%', bottom: '3%', top: '10%', containLabel: true },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: cohorts.map((c) => `${c.year} SH`),
      axisLabel: { color: '#94a3b8', fontSize: 10 }
    },
    yAxis: { type: 'value', splitLine: { lineStyle: { color: '#1e293b' } }, axisLabel: { color: '#94a3b8' } },
    series: [
      {
        name: 'Male (مرد)',
        type: 'line',
        stack: 'Total',
        smooth: true,
        lineStyle: { width: 2, color: '#38bdf8' },
        areaStyle: { opacity: 0.5, color: '#0284c7' },
        data: cohorts.map((c) => c.code_0)
      },
      {
        name: 'Female (زن)',
        type: 'line',
        stack: 'Total',
        smooth: true,
        lineStyle: { width: 2, color: '#ec4899' },
        areaStyle: { opacity: 0.5, color: '#db2777' },
        data: cohorts.map((c) => c.code_1)
      }
    ]
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header Banner */}
      <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-pink-500/10 text-pink-400">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100">
              Demographic & Generational Cohort Intelligence
            </h2>
            <p className="text-xs text-slate-400">
              Analysis of Solar Hijri (هجری شمسی) birth year distributions and gender registration codes
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setExplainTopic('solar_hijri')}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors"
          >
            <Calendar className="w-3.5 h-3.5 text-brand-400" />
            <span>Solar Hijri Calendar</span>
          </button>
        </div>
      </div>

      {/* Stacked Cohort Chart */}
      <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-100">Birth Cohort Registration Trajectory</h3>
            <p className="text-xs text-slate-400">Stacked volume by recorded Solar Hijri birth year and gender (Male / Female)</p>
          </div>
          <button
            onClick={() => setExplainTopic('gender_semantics')}
            className="p-1 text-slate-400 hover:text-slate-200"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
        <div className="h-80">
          <ReactECharts option={stackedOption} style={{ height: '100%', width: '100%' }} />
        </div>
      </div>

      {/* Cohort Distribution Table */}
      <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
        <h3 className="text-sm font-bold text-slate-100 mb-1">Yearly Cohort Breakdown Table</h3>
        <p className="text-xs text-slate-400 mb-4">Detailed counts for each recorded birth year in the Solar Hijri calendar</p>

        <div className="max-h-96 overflow-y-auto rounded-lg border border-slate-800">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="sticky top-0 bg-slate-950 border-b border-slate-800 text-slate-300">
              <tr>
                <th className="py-2.5 px-4 font-semibold">Birth Year (SH)</th>
                <th className="py-2.5 px-4 font-semibold">Approx. Gregorian (CE)</th>
                <th className="py-2.5 px-4 font-semibold text-right text-sky-400">Male (مرد)</th>
                <th className="py-2.5 px-4 font-semibold text-right text-pink-400">Female (زن)</th>
                <th className="py-2.5 px-4 font-semibold text-right">Total Births</th>
                <th className="py-2.5 px-4 font-semibold text-right">Male Ratio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {cohorts.map((c) => (
                <tr key={c.year} className="hover:bg-slate-900/60 transition-colors">
                  <td className="py-2 px-4 font-mono font-bold text-slate-200">{c.year}</td>
                  <td className="py-2 px-4 font-mono text-slate-400">~{c.year + 621} CE</td>
                  <td className="py-2 px-4 text-right font-mono text-sky-400">{c.code_0.toLocaleString()}</td>
                  <td className="py-2 px-4 text-right font-mono text-pink-400">{c.code_1.toLocaleString()}</td>
                  <td className="py-2 px-4 text-right font-mono text-slate-100 font-bold">
                    {c.total.toLocaleString()}
                  </td>
                  <td className="py-2 px-4 text-right font-mono text-slate-400">
                    {c.total > 0 ? `${((c.code_0 / c.total) * 100).toFixed(1)}%` : '0%'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {explainTopic && (
        <ExplainModal
          isOpen={true}
          onClose={() => setExplainTopic(null)}
          title={
            explainTopic === 'solar_hijri'
              ? 'Solar Hijri Calendar Standard'
              : 'Gender Semantic Mapping Note'
          }
          topic={explainTopic}
        />
      )}
    </div>
  );
};
