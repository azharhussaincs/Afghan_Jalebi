import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { MapPin, Globe, Users, ArrowUpDown } from 'lucide-react';
import { api } from '../../services/api';
import { useFilters } from '../../context/FilterContext';
import { GeographicAnalyticsData } from '../../types';

export const GeographicAnalytics: React.FC = () => {
  const { toQueryParams, refreshKey, setProvince } = useFilters();
  const [data, setData] = useState<GeographicAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.getGeographicAnalytics(toQueryParams())
      .then(setData)
      .catch((err) => console.error('Failed to load geographic data', err))
      .finally(() => setLoading(false));
  }, [refreshKey, JSON.stringify(toQueryParams())]);

  if (loading || !data) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-mono text-slate-400">Aggregating geographic distributions...</p>
      </div>
    );
  }

  // Top 15 Provinces Chart Option
  const provinceChartOption = {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: '3%', right: '4%', bottom: '3%', top: '3%', containLabel: true },
    xAxis: { type: 'value', splitLine: { lineStyle: { color: '#1e293b' } }, axisLabel: { color: '#94a3b8' } },
    yAxis: {
      type: 'category',
      data: data.provinces.slice(0, 15).map((p) => p.province).reverse(),
      axisLabel: { color: '#e2e8f0', fontSize: 11, fontFamily: 'Vazirmatn' }
    },
    series: [
      {
        type: 'bar',
        data: data.provinces.slice(0, 15).map((p) => p.count).reverse(),
        itemStyle: { color: '#0ea5e9', borderRadius: [0, 4, 4, 0] }
      }
    ]
  };

  // Top Districts Treemap Option
  const treemapOption = {
    tooltip: {
      formatter: (info: any) => `${info.name}: ${info.value.toLocaleString()} records`
    },
    series: [
      {
        type: 'treemap',
        roam: false,
        nodeClick: false,
        breadcrumb: { show: false },
        label: { show: true, formatter: '{b}\n{c}', fontFamily: 'Vazirmatn', color: '#ffffff' },
        itemStyle: { borderColor: '#020617', borderWidth: 2, gapWidth: 1 },
        data: data.districts.slice(0, 30).map((d) => ({
          name: `${d.district} (${d.province})`,
          value: d.count
        }))
      }
    ]
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header Info */}
      <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100">
              Regional Geographic & Administrative Analytics
            </h2>
            <p className="text-xs text-slate-400">
              Hierarchical distribution across {data.provinces.length} provinces and {data.districts.length} active administrative districts
            </p>
          </div>
        </div>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Province Ranking */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
          <h3 className="text-sm font-bold text-slate-100 mb-1">Province Record Volume Ranking</h3>
          <p className="text-xs text-slate-400 mb-4">Total civil identity records aggregated per province</p>
          <div className="h-80">
            <ReactECharts option={provinceChartOption} style={{ height: '100%', width: '100%' }} />
          </div>
        </div>

        {/* District Density Treemap */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
          <h3 className="text-sm font-bold text-slate-100 mb-1">Top Districts Volume Treemap</h3>
          <p className="text-xs text-slate-400 mb-4">Proportional record distribution across top 30 registered districts</p>
          <div className="h-80">
            <ReactECharts option={treemapOption} style={{ height: '100%', width: '100%' }} />
          </div>
        </div>
      </div>

      {/* Province x Gender Contingency Table */}
      <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
        <h3 className="text-sm font-bold text-slate-100 mb-1">Province × Gender Distribution Matrix</h3>
        <p className="text-xs text-slate-400 mb-4">
          Cross-tabulation of civil registration records by province and recorded gender code
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800 text-slate-300">
                <th className="py-3 px-4 font-semibold">Province (ولایت)</th>
                <th className="py-3 px-4 font-semibold">Code</th>
                <th className="py-3 px-4 font-semibold text-right">Gender Code 0</th>
                <th className="py-3 px-4 font-semibold text-right">Gender Code 1</th>
                <th className="py-3 px-4 font-semibold text-right">Total Records</th>
                <th className="py-3 px-4 font-semibold text-right">Dataset Share</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {data.provinces.map((p) => {
                const matrix = data.province_gender_matrix[p.province] || {};
                const c0 = matrix['0'] || 0;
                const c1 = matrix['1'] || 0;
                return (
                  <tr key={p.province} className="hover:bg-slate-900/60 transition-colors">
                    <td className="py-2.5 px-4 font-persian font-semibold text-slate-100 text-sm">
                      {p.province}
                    </td>
                    <td className="py-2.5 px-4 font-mono text-slate-400">{p.province_code}</td>
                    <td className="py-2.5 px-4 text-right font-mono text-sky-400 font-medium">
                      {c0.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono text-pink-400 font-medium">
                      {c1.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono text-slate-100 font-bold">
                      {p.count.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono text-slate-400">
                      {p.percentage}%
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      <button
                        onClick={() => setProvince(p.province)}
                        className="px-2 py-1 rounded bg-slate-800 hover:bg-brand-600 text-slate-300 hover:text-white text-[11px] transition-colors"
                      >
                        Filter Province
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
