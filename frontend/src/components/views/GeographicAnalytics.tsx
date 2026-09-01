import React, { useEffect, useState, useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import {
  Globe,
  LayoutGrid,
  List,
  Languages,
  Check,
  ChevronRight,
  Filter
} from 'lucide-react';
import { api } from '../../services/api';
import { useFilters } from '../../context/FilterContext';
import { GeographicAnalyticsData } from '../../types';
import {
  formatDistrictDisplay,
  getEnglishProvinceName,
  getCleanNativeName,
  formatCompactNumber,
  DisplayMode
} from '../../utils/geoTranslation';

export const GeographicAnalytics: React.FC = () => {
  const { toQueryParams, refreshKey, setProvince, setDistrict } = useFilters();
  const [data, setData] = useState<GeographicAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  // User presentation controls for maximum readability & beauty
  const [displayMode, setDisplayMode] = useState<DisplayMode>('bilingual');
  const [topCount, setTopCount] = useState<number>(30);
  const [viewMode, setViewMode] = useState<'treemap' | 'list'>('treemap');

  useEffect(() => {
    setLoading(true);
    api.getGeographicAnalytics(toQueryParams())
      .then(setData)
      .catch((err) => console.error('Failed to load geographic data', err))
      .finally(() => setLoading(false));
  }, [refreshKey, JSON.stringify(toQueryParams())]);

  const totalRegistryRecords = useMemo(() => {
    if (!data?.provinces) return 23839823;
    return data.provinces.reduce((acc, p) => acc + p.count, 0);
  }, [data]);

  // Modern cohesive palette for treemap tiles
  const treemapPalette = useMemo(() => [
    '#0284c7', // Sky blue
    '#0ea5e9', // Light sky
    '#06b6d4', // Cyan
    '#0d9488', // Teal
    '#10b981', // Emerald
    '#059669', // Deep emerald
    '#6366f1', // Indigo
    '#4f46e5', // Deep indigo
    '#8b5cf6', // Violet
    '#7c3aed', // Purple
    '#a855f7', // Light purple
    '#d946ef', // Fuchsia
    '#ec4899', // Pink
    '#e11d48', // Rose
    '#f59e0b', // Amber
    '#d97706', // Warm amber
    '#3b82f6', // Bright blue
    '#2563eb'  // Royal blue
  ], []);

  // Format Top Provinces for Bar Chart
  const provinceChartOption = useMemo(() => {
    if (!data?.provinces) return {};
    const top15 = data.provinces.slice(0, 15);

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        backgroundColor: '#090d16',
        borderColor: '#1e293b',
        borderWidth: 1,
        textStyle: { color: '#f8fafc' },
        formatter: (params: any) => {
          const item = params[0];
          if (!item) return '';
          const prov = top15.find(p => p.province === item.name || getEnglishProvinceName(p.province) === item.name);
          const enName = prov ? getEnglishProvinceName(prov.province) : item.name;
          const nativeName = prov ? prov.province : item.name;
          const count = item.value;
          const pct = ((count / totalRegistryRecords) * 100).toFixed(2);
          return `
            <div style="padding: 4px 6px;">
              <div style="font-weight: bold; font-size: 13px; color: #38bdf8;">${enName} (${nativeName})</div>
              <div style="font-size: 12px; color: #cbd5e1; margin-top: 4px;">
                Volume: <strong>${count.toLocaleString()}</strong> records
              </div>
              <div style="font-size: 11px; color: #94a3b8; margin-top: 2px;">
                Share: <strong>${pct}%</strong> of national registry
              </div>
            </div>
          `;
        }
      },
      grid: { left: '3%', right: '5%', bottom: '3%', top: '3%', containLabel: true },
      xAxis: {
        type: 'value',
        splitLine: { lineStyle: { color: '#1e293b' } },
        axisLabel: {
          color: '#94a3b8',
          fontSize: 10,
          formatter: (v: number) => formatCompactNumber(v)
        }
      },
      yAxis: {
        type: 'category',
        data: top15.map((p) => {
          const en = getEnglishProvinceName(p.province);
          if (displayMode === 'english') return en;
          if (displayMode === 'dari') return p.province;
          return `${en} (${p.province})`;
        }).reverse(),
        axisLabel: {
          color: '#e2e8f0',
          fontSize: 11,
          fontFamily: displayMode === 'dari' ? 'Vazirmatn' : 'Inter, Vazirmatn'
        }
      },
      series: [
        {
          type: 'bar',
          data: top15.map((p) => p.count).reverse(),
          itemStyle: {
            color: (params: any) => {
              const colors = ['#0ea5e9', '#0284c7', '#38bdf8', '#06b6d4', '#6366f1'];
              return colors[params.dataIndex % colors.length];
            },
            borderRadius: [0, 4, 4, 0]
          }
        }
      ]
    };
  }, [data, displayMode, totalRegistryRecords]);

  // Prepared processed districts data
  const processedDistricts = useMemo(() => {
    if (!data?.districts) return [];

    return data.districts.slice(0, topCount).map((d, index) => {
      const formatted = formatDistrictDisplay(d.district, d.province, displayMode);
      const enName = formatDistrictDisplay(d.district, d.province, 'english').primary;
      const cleanNative = getCleanNativeName(d.district, d.province);
      const provEn = getEnglishProvinceName(d.province);
      const provNative = (d.province || '').trim();
      const pct = ((d.count / totalRegistryRecords) * 100).toFixed(2);

      return {
        rank: index + 1,
        rawDistrict: d.district,
        rawProvince: d.province,
        name: formatted.primary,
        enName,
        dariName: cleanNative,
        provEn,
        provNative,
        displayLabel: formatted.primary,
        displaySub: formatted.secondary,
        value: d.count,
        formattedCount: formatCompactNumber(d.count),
        exactCount: d.count.toLocaleString(),
        percentage: pct,
        color: treemapPalette[index % treemapPalette.length]
      };
    });
  }, [data, topCount, displayMode, totalRegistryRecords, treemapPalette]);

  // Top Districts Treemap Option (ECharts)
  const treemapOption = useMemo(() => {
    return {
      tooltip: {
        backgroundColor: '#090d16',
        borderColor: '#1e293b',
        borderWidth: 1,
        padding: [10, 14],
        textStyle: { color: '#f8fafc' },
        formatter: (info: any) => {
          const d = info.data;
          if (!d) return '';
          return `
            <div style="font-family: Inter, Vazirmatn, sans-serif; min-width: 200px;">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
                <span style="background: rgba(14, 165, 233, 0.2); color: #38bdf8; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px; border: 1px solid rgba(56, 189, 248, 0.3);">
                  RANK #${d.rank}
                </span>
                <span style="font-size: 11px; color: #94a3b8;">${d.provEn} (${d.provNative})</span>
              </div>
              <div style="font-size: 14px; font-weight: 700; color: #ffffff; margin-bottom: 2px;">
                ${d.enName}
              </div>
              <div style="font-size: 12px; color: #cbd5e1; font-family: Vazirmatn; margin-bottom: 8px;">
                ${d.dariName}
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 11px; border-top: 1px solid #1e293b; padding-top: 6px; margin-bottom: 4px;">
                <span style="color: #94a3b8;">Total Records:</span>
                <span style="font-weight: 700; color: #38bdf8; font-family: monospace;">${d.exactCount}</span>
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 6px;">
                <span style="color: #94a3b8;">National Share:</span>
                <span style="font-weight: 600; color: #a855f7;">${d.percentage}%</span>
              </div>
              <div style="font-size: 10px; color: #64748b; text-align: center; border-top: 1px dashed #1e293b; padding-top: 4px;">
                👉 Click tile to filter dashboard
              </div>
            </div>
          `;
        }
      },
      series: [
        {
          type: 'treemap',
          roam: false,
          nodeClick: false,
          breadcrumb: { show: false },
          leafDepth: 1,
          levels: [
            {
              itemStyle: {
                borderColor: '#020617',
                borderWidth: 2,
                gapWidth: 2
              }
            }
          ],
          label: {
            show: true,
            position: 'insideTopLeft',
            padding: [6, 8, 6, 8],
            formatter: (params: any) => {
              const d = params.data;
              if (!d) return '';

              // Clean multi-line formatting depending on display mode
              if (displayMode === 'english') {
                return `{title|${d.enName}}\n{count|${d.formattedCount}}`;
              }
              if (displayMode === 'dari') {
                return `{title|${d.dariName}}\n{count|${d.formattedCount}}`;
              }
              // Bilingual mode: English on top, clean Dari below, compact count
              return `{title|${d.enName}}\n{sub|${d.dariName}}\n{count|${d.formattedCount}}`;
            },
            rich: {
              title: {
                fontSize: 12,
                fontWeight: 'bold',
                color: '#ffffff',
                lineHeight: 16
              },
              sub: {
                fontSize: 10,
                fontFamily: 'Vazirmatn',
                color: '#e2e8f0',
                lineHeight: 14
              },
              count: {
                fontSize: 11,
                fontWeight: '600',
                fontFamily: 'monospace',
                color: '#bae6fd',
                lineHeight: 16
              }
            }
          },
          data: processedDistricts.map((d) => ({
            ...d,
            itemStyle: {
              color: d.color,
              borderColor: '#020617',
              borderWidth: 2
            }
          }))
        }
      ]
    };
  }, [processedDistricts, displayMode]);

  const handleTreemapClick = (params: any) => {
    if (params?.data?.rawDistrict) {
      setDistrict(params.data.rawDistrict);
      if (params.data.rawProvince) {
        setProvince(params.data.rawProvince);
      }
    }
  };

  if (loading || !data) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-mono text-slate-400">Aggregating geographic distributions...</p>
      </div>
    );
  }

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
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-bold text-slate-100">Province Record Volume Ranking</h3>
              <p className="text-xs text-slate-400">Top 15 provinces aggregated by civil registry registrations</p>
            </div>
          </div>
          <div className="h-80">
            <ReactECharts option={provinceChartOption} style={{ height: '100%', width: '100%' }} />
          </div>
        </div>

        {/* District Volume Treemap & Ranked List */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
          {/* Card Header with Interactive View & Language Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 pb-3 border-b border-slate-800/80">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-100">Top Cities & Districts Treemap</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20 font-mono">
                  Top {topCount}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Proportional density across Afghanistan's major administrative centers
              </p>
            </div>

            {/* Visual Controls Toolbar */}
            <div className="flex flex-wrap items-center gap-1.5 shrink-0">
              {/* Language Selector */}
              <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5 text-xs">
                <button
                  onClick={() => setDisplayMode('bilingual')}
                  className={`px-2 py-1 rounded text-[11px] font-medium transition-all ${
                    displayMode === 'bilingual'
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Bilingual: English + Dari"
                >
                  Bilingual
                </button>
                <button
                  onClick={() => setDisplayMode('english')}
                  className={`px-2 py-1 rounded text-[11px] font-medium transition-all ${
                    displayMode === 'english'
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="English Transliteration"
                >
                  English
                </button>
                <button
                  onClick={() => setDisplayMode('dari')}
                  className={`px-2 py-1 rounded text-[11px] font-medium transition-all ${
                    displayMode === 'dari'
                      ? 'bg-brand-600 text-white shadow-sm font-persian'
                      : 'text-slate-400 hover:text-slate-200 font-persian'
                  }`}
                  title="Original Dari / Pashto Script"
                >
                  دری
                </button>
              </div>

              {/* Count Selector */}
              <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5 text-xs font-mono">
                {[15, 25, 35].map((cnt) => (
                  <button
                    key={cnt}
                    onClick={() => setTopCount(cnt)}
                    className={`px-1.5 py-1 rounded text-[11px] font-medium transition-all ${
                      topCount === cnt
                        ? 'bg-slate-800 text-brand-300 shadow-sm'
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {cnt}
                  </button>
                ))}
              </div>

              {/* View Mode Toggle: Treemap vs Ranked Cards */}
              <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5 text-xs">
                <button
                  onClick={() => setViewMode('treemap')}
                  className={`p-1.5 rounded transition-all ${
                    viewMode === 'treemap'
                      ? 'bg-slate-800 text-brand-400 shadow-sm'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                  title="Treemap Tile View"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded transition-all ${
                    viewMode === 'list'
                      ? 'bg-slate-800 text-brand-400 shadow-sm'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                  title="Ranked List View"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* View Mode 1: Interactive Treemap */}
          {viewMode === 'treemap' ? (
            <div className="h-80 relative">
              <ReactECharts
                option={treemapOption}
                style={{ height: '100%', width: '100%' }}
                onEvents={{ click: handleTreemapClick }}
              />
            </div>
          ) : (
            /* View Mode 2: Ultra-Readable Ranked Card Grid */
            <div className="h-80 overflow-y-auto pr-1 space-y-2">
              {processedDistricts.map((d) => (
                <div
                  key={`${d.rawDistrict}-${d.rawProvince}`}
                  onClick={() => {
                    setDistrict(d.rawDistrict);
                    setProvince(d.rawProvince);
                  }}
                  className="group p-2.5 rounded-lg bg-slate-950/80 hover:bg-slate-900 border border-slate-800/80 hover:border-brand-500/50 transition-all cursor-pointer flex items-center justify-between gap-3 shadow-sm"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className="w-7 h-7 rounded-md font-mono text-xs font-bold flex items-center justify-center shrink-0 border"
                      style={{
                        backgroundColor: `${d.color}20`,
                        borderColor: `${d.color}60`,
                        color: d.color
                      }}
                    >
                      #{d.rank}
                    </span>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-100 flex items-center gap-2">
                        <span className="truncate">{d.enName}</span>
                        <span className="text-slate-500 font-normal">•</span>
                        <span className="text-slate-300 font-persian truncate">{d.dariName}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <span>Province: {d.provEn} ({d.provNative})</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="font-mono text-xs font-bold text-sky-400">
                      {d.exactCount}
                    </div>
                    <div className="text-[10px] text-purple-400 font-medium">
                      {d.percentage}% share
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="pt-2 mt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
            <span>💡 Tip: Click any city or tile to filter the entire dashboard by that district</span>
            <span className="font-mono">{processedDistricts.length} Centers</span>
          </div>
        </div>
      </div>

      {/* Province x Gender Contingency Table */}
      <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
        <h3 className="text-sm font-bold text-slate-100 mb-1">Province × Gender Distribution Matrix</h3>
        <p className="text-xs text-slate-400 mb-4">
          Cross-tabulation of civil registration records by province and gender
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800 text-slate-300">
                <th className="py-3 px-4 font-semibold">Province (ولایت)</th>
                <th className="py-3 px-4 font-semibold">Code</th>
                <th className="py-3 px-4 font-semibold text-right text-sky-400">Male (مرد)</th>
                <th className="py-3 px-4 font-semibold text-right text-pink-400">Female (زن)</th>
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
                const enProv = getEnglishProvinceName(p.province);
                return (
                  <tr key={p.province} className="hover:bg-slate-900/60 transition-colors">
                    <td className="py-2.5 px-4 font-semibold text-slate-100 text-sm">
                      <div className="flex items-center gap-1.5">
                        <span>{enProv}</span>
                        <span className="text-slate-500 font-normal">•</span>
                        <span className="font-persian text-slate-300">{p.province}</span>
                      </div>
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
