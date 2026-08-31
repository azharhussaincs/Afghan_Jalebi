import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import {
  Users,
  MapPin,
  BookOpen,
  Calendar,
  CheckCircle2,
  TrendingUp,
  Info,
  ArrowUpRight,
  ShieldAlert,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { api } from '../../services/api';
import { useFilters } from '../../context/FilterContext';
import { OverviewKPIs, SmartInsight, GeographicAnalyticsData, DemographicAnalyticsData } from '../../types';
import { ExplainModal } from '../common/ExplainModal';

export const ExecutiveOverview: React.FC<{ onNavigate: (view: string) => void }> = ({ onNavigate }) => {
  const { toQueryParams, refreshKey } = useFilters();
  const [kpis, setKpis] = useState<OverviewKPIs | null>(null);
  const [insights, setInsights] = useState<SmartInsight[]>([]);
  const [geoData, setGeoData] = useState<GeographicAnalyticsData | null>(null);
  const [demoData, setDemoData] = useState<DemographicAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [explainTopic, setExplainTopic] = useState<'gender_semantics' | 'quality_score' | 'solar_hijri' | null>(null);

  useEffect(() => {
    setLoading(true);
    const params = toQueryParams();
    // Macro overview charts aggregate across geographic/demographic filters
    const macroParams = { ...params };
    delete macroParams.q;

    Promise.all([
      api.getOverviewKPIs(macroParams),
      api.getSmartInsights(),
      api.getGeographicAnalytics(macroParams),
      api.getDemographicAnalytics(macroParams)
    ])
      .then(([kpiRes, insRes, geoRes, demoRes]) => {
        setKpis(kpiRes);
        setInsights(insRes);
        setGeoData(geoRes);
        setDemoData(demoRes);
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
        name: 'Gender Code Distribution',
        type: 'pie',
        radius: ['45%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 6, borderColor: '#020617', borderWidth: 2 },
        label: { show: false },
        emphasis: { label: { show: true, fontSize: 12, fontWeight: 'bold', color: '#f8fafc' } },
        data: kpis.gender_counts.map((g, idx) => ({
          value: g.count,
          name: g.label,
          itemStyle: { color: idx === 0 ? '#38bdf8' : idx === 1 ? '#ec4899' : '#a855f7' }
        }))
      }
    ]
  };

  // Province Chart Option
  const topProvinces = (geoData?.provinces || []).slice(0, 10);
  const provinceChartOption = {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: '3%', right: '4%', bottom: '3%', top: '3%', containLabel: true },
    xAxis: { type: 'value', splitLine: { lineStyle: { color: '#1e293b' } }, axisLabel: { color: '#94a3b8', fontSize: 10 } },
    yAxis: {
      type: 'category',
      data: topProvinces.map((p) => p.province).reverse(),
      axisLabel: { color: '#e2e8f0', fontSize: 11, fontFamily: 'Vazirmatn' }
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

  // Timeline Chart Option
  const years = demoData?.dob_distribution || [];
  const yearChartOption = {
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', top: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      data: years.map((y) => y.year),
      axisLabel: { color: '#94a3b8', fontSize: 10 }
    },
    yAxis: { type: 'value', splitLine: { lineStyle: { color: '#1e293b' } }, axisLabel: { color: '#94a3b8', fontSize: 10 } },
    series: [
      {
        type: 'line',
        smooth: true,
        data: years.map((y) => y.count),
        itemStyle: { color: '#38bdf8' },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(56, 189, 248, 0.4)' },
              { offset: 1, color: 'rgba(56, 189, 248, 0.0)' }
            ]
          }
        }
      }
    ]
  };

  return (
    <div className="p-6 space-y-6">
      {/* Top Banner Alert for Semantic Verification */}
      <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-brand-500/10 text-brand-400">
            <Info className="w-4 h-4" />
          </div>
          <div className="text-xs text-slate-300">
            <span className="font-semibold text-slate-100">Domain Semantic Standard:</span> Displaying dynamic statistics computed from the complete <strong>24,399,446</strong> row dataset. Gender codes (0/1) and Solar Hijri birth years are preserved exactly as recorded in official volumes.
          </div>
        </div>
        <button
          onClick={() => setExplainTopic('gender_semantics')}
          className="text-xs text-brand-400 hover:text-brand-300 font-medium flex items-center gap-1 shrink-0 ml-4"
        >
          <span>Semantic Policy</span>
          <HelpCircle className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

        {/* Data Quality Score */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700/80 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">DATA QUALITY SCORE</span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div className="text-2xl font-black text-slate-100 font-mono tracking-tight">
              {kpis.quality_score}%
            </div>
            <button
              onClick={() => setExplainTopic('quality_score')}
              className="text-[11px] text-brand-400 hover:underline"
            >
              Details &rarr;
            </button>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Schema & Uniqueness Validated</p>
        </div>
      </div>

      {/* Smart Dynamic Insights */}
      <div className="p-5 rounded-xl bg-slate-900/40 border border-slate-800">
        <div className="flex items-center space-x-2 mb-4">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Dynamically Generated Dataset Insights
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {insights.slice(0, 3).map((ins, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800/70 flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-400">
                  {ins.category}
                </span>
                <h4 className="text-xs font-bold text-slate-200 mt-1">{ins.title}</h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{ins.text}</p>
              </div>
            </div>
          ))}
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
              <h3 className="text-sm font-bold text-slate-100">Gender Code Ratio</h3>
              <p className="text-xs text-slate-400">Recorded identity classification breakdown</p>
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

      {/* Timeline Cohort Line Chart */}
      <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-100">Solar Hijri Birth Year Distribution</h3>
            <p className="text-xs text-slate-400">Temporal cohort frequency curve from official registry birth records</p>
          </div>
          <button
            onClick={() => onNavigate('demographics')}
            className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1 font-medium"
          >
            <span>Cohort Deep-Dive</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="h-64">
          <ReactECharts option={yearChartOption} style={{ height: '100%', width: '100%' }} />
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
