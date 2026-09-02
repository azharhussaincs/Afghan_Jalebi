import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import {
  Users,
  MapPin,
  BookOpen,
  Calendar,
  TrendingUp,
  ArrowUpRight,
  ShieldAlert,
  HelpCircle
} from 'lucide-react';
import { api } from '../../services/api';
import { useFilters } from '../../context/FilterContext';
import { OverviewKPIs, GeographicAnalyticsData } from '../../types';
import { ExplainModal } from '../common/ExplainModal';
import { getEnglishProvinceName } from '../../utils/geoTranslation';

export const ExecutiveOverview: React.FC<{ onNavigate: (view: string) => void }> = ({ onNavigate }) => {
  const { toQueryParams, refreshKey, filters, activeFilterCount, clearFilters } = useFilters();
  const [kpis, setKpis] = useState<OverviewKPIs | null>(null);
  const [geoData, setGeoData] = useState<GeographicAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [explainTopic, setExplainTopic] = useState<'gender_semantics' | 'quality_score' | 'solar_hijri' | null>(null);

  useEffect(() => {
    setLoading(true);
    const params = toQueryParams();

    Promise.all([
      api.getOverviewKPIs(params),
      api.getGeographicAnalytics(params)
    ])
      .then(([kpiRes, geoRes]) => {
        setKpis(kpiRes);
        setGeoData(geoRes);
      })
      .catch((err) => console.error('Failed to load overview data', err))
      .finally(() => setLoading(false));
  }, [refreshKey, JSON.stringify(toQueryParams())]);

  if (loading || !kpis) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[500px]">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-mono text-slate-400">Aggregating 24,399,446 registry records...</p>
      </div>
    );
  }

  // Gender Chart Option
  const genderChartOption = {
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    legend: { bottom: '5%', left: 'center', textStyle: { color: '#94a3b8', fontSize: 11 } },
    series: [
      {
        name: 'Gender Distribution',
        type: 'pie',
        radius: ['45%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 6, borderColor: '#020617', borderWidth: 2 },
        label: { show: false },
        emphasis: { label: { show: true, fontSize: 12, fontWeight: 'bold', color: '#f8fafc' } },
        data: kpis.gender_counts.map((g) => ({
          value: g.count,
          name: g.value === 0 ? 'Male (مرد)' : (g.value === 1 ? 'Female (زن)' : g.label),
          itemStyle: { color: g.value === 0 ? '#38bdf8' : g.value === 1 ? '#ec4899' : '#a855f7' }
        }))
      }
    ]
  };

  // Province Chart Option
  const topProvinces = (geoData?.provinces || []).slice(0, 10);
  const provinceChartOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: (params: any) => {
        const item = params[0];
        if (!item) return '';
        return `<strong>${item.name}</strong>: ${item.value.toLocaleString()} records`;
      }
    },
    grid: { left: '3%', right: '4%', bottom: '3%', top: '3%', containLabel: true },
    xAxis: { type: 'value', splitLine: { lineStyle: { color: '#1e293b' } }, axisLabel: { color: '#94a3b8', fontSize: 10 } },
    yAxis: {
      type: 'category',
      data: topProvinces.map((p) => `${getEnglishProvinceName(p.province)} (${p.province})`).reverse(),
      axisLabel: { color: '#e2e8f0', fontSize: 11 }
    },
    series: [
      {
        type: 'bar',
        data: topProvinces.map((p) => p.count).reverse(),
        itemStyle: {
          color: '#0284c7',
          borderRadius: [0, 4, 4, 0]
        }
      }
    ]
  };


  return (
    <div className="p-6 space-y-6">
      {/* Active Cross-Filter Indicator Banner */}
      {activeFilterCount > 0 && (
        <div className="p-3.5 rounded-xl bg-brand-950/40 border border-brand-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center space-x-3">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-400 animate-pulse shrink-0"></span>
            <div>
              <div className="text-xs font-bold text-brand-200 flex items-center gap-2">
                <span>Active Filter Scope Enabled</span>
                <span className="px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 text-[10px] font-mono border border-brand-500/30">
                  {kpis.total_records.toLocaleString()} Matching Records
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Executive KPIs, volume distributions, and demographic cohorts are actively synchronized with your cross-filters.
              </p>
            </div>
          </div>
          <button
            onClick={clearFilters}
            className="px-3 py-1 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors shrink-0 self-start sm:self-auto font-medium"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Records */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700/80 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">TOTAL RECORDS</span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-100 font-mono tracking-tight">
              {kpis.total_records.toLocaleString()}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">100% Ingestion Verification</p>
          </div>
        </div>

        {/* Geographic Span */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700/80 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">GEOGRAPHY</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-100 font-mono tracking-tight">
              {kpis.unique_provinces} <span className="text-sm font-normal text-slate-400">Provinces</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">{kpis.unique_districts} Unique Districts</p>
          </div>
        </div>

        {/* Registry Books */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700/80 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">REGISTRY VOLUMES</span>
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-100 font-mono tracking-tight">
              {kpis.unique_books.toLocaleString()}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Official Archival Volumes</p>
          </div>
        </div>
      </div>


      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Geographic Bar Chart */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-100">Top Provinces Distribution</h3>
              <p className="text-xs text-slate-400">Record density across regional administrative divisions</p>
            </div>
            <button
              onClick={() => onNavigate('geographic')}
              className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1 font-medium"
            >
              <span>Explore Map & Districts</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="h-64">
            <ReactECharts option={provinceChartOption} style={{ height: '100%', width: '100%' }} />
          </div>
        </div>

        {/* Gender Breakdown Donut */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-100">Gender Ratio (Male / Female)</h3>
              <p className="text-xs text-slate-400">Demographic distribution across registry entries</p>
            </div>
            <button
              onClick={() => setExplainTopic('gender_semantics')}
              className="p-1 text-slate-400 hover:text-slate-200"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
          <div className="h-64">
            <ReactECharts option={genderChartOption} style={{ height: '100%', width: '100%' }} />
          </div>
        </div>
      </div>


      {/* Explanation Modal */}
      {explainTopic && (
        <ExplainModal
          isOpen={true}
          onClose={() => setExplainTopic(null)}
          title={
            explainTopic === 'gender_semantics'
              ? 'Gender Semantic Mapping Note'
              : explainTopic === 'quality_score'
              ? 'Composite Quality Score Methodology'
              : 'Solar Hijri Calendar Conversion'
          }
          topic={explainTopic}
        />
      )}
    </div>
  );
};
