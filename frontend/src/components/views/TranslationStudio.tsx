import React, { useState, useEffect, useRef } from 'react';
import {
  Languages,
  ArrowLeftRight,
  Copy,
  Check,
  Sparkles,
  Zap,
  BookOpen,
  ArrowRight,
  RefreshCw,
  SlidersHorizontal
} from 'lucide-react';

interface PresetItem {
  title: string;
  lang: string;
  text: string;
}

interface ParallelComparisonItem {
  id: string;
  dari: string;
  pashto: string;
  english: string;
}

export const TranslationStudio: React.FC = () => {
  const [inputText, setInputText] = useState<string>(
    'جلد 4 قلم انداز سال 1396 ولسوالی موسهی ولایت کابل شماره ثبت 201 صفحه 41'
  );
  const [translatedText, setTranslatedText] = useState<string>(
    'Volume 4, Preliminary Ledger Record (Qalam Andaz) Year 1396 District Musahee Province Kabul Registration Record Number 201 Page Number 41'
  );
  const [srcLang, setSrcLang] = useState<string>('prs_Arab'); // 'prs_Arab' or 'pus_Arab'
  const [forceNeural, setForceNeural] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [engineUsed, setEngineUsed] = useState<string>('lexical_dictionary');

  const debounceRef = useRef<any>(null);

  const samplePresets: PresetItem[] = [
    {
      title: "Tazkira Ledger Entry (کتاب اساس موسهی)",
      lang: "prs_Arab",
      text: "جلد 4 قلم انداز سال 1396 ولسوالی موسهی ولایت کابل شماره ثبت 201 صفحه 41"
    },
    {
      title: "NSIA e-Tazkira Registry (اداره احصائیه)",
      lang: "prs_Arab",
      text: "اداره ملی احصائیه و معلومات ریاست عمومی ثبت احوال نفوس توزیع تذکره الکترونیکی"
    },
    {
      title: "RTP Relief Family Record (سند کمک غذایی)",
      lang: "prs_Arab",
      text: "سرپرست فامیل بی بضاعت ناحیه 8 گذر قلعه فتح الله تعداد اعضای فامیل 7 نفر نان روزانه 10 قرص"
    },
    {
      title: "Pashto Official Verification (د احصایی اداره)",
      lang: "pus_Arab",
      text: "د افغانستان د احصایی او معلوماتو ملی اداره د الکترونیکی تذکرو د ثبت او تصدیق پورتال"
    },
    {
      title: "Vulnerability Survey (سروی نیازمندان)",
      lang: "prs_Arab",
      text: "وضعیت سرپرست خانوار: بیوه، دارای 5 طفل یتیم، فاقد عاید ماهوار و مستحق کمک عاجل"
    }
  ];

  const batchParallelData: ParallelComparisonItem[] = [
    {
      id: "REC-1009",
      dari: "ظریفه بنت لالا شیرین ولد در محمد، سال تولد 1388، ولایت کابل، ولسوالی موسهی",
      pashto: "ظریفه د لالا شیرین لور د در محمد لمسی، د زیږیدو کال 1388، د کابل ولایت موسهی ولسوالی",
      english: "Zarifa, daughter of Lala Shirin, granddaughter of Dar Mohammad, Birth Year 1388, Kabul Province, Musahee District"
    },
    {
      id: "REC-1010",
      dari: "انصار الله ولد ذکرالله ولد مومن جان، سال تولد 1394، ولایت کابل، ولسوالی موسهی",
      pashto: "انصار الله د ذکرالله زوی د مومن جان لمسی، د زیږیدو کال 1394، د کابل ولایت موسهی ولسوالی",
      english: "Ansarullah, son of Zikrullah, grandson of Momin Jan, Birth Year 1394, Kabul Province, Musahee District"
    },
    {
      id: "RTP-157",
      dari: "همدم ولد عبدالواحد، شغل: بی بضاعت، ناحیه 8 گذر قلعه فتح الله، اعضای فامیل: 7، نان: 10 قرص",
      pashto: "همدم د عبدالواحد زوی، دنده: بی بضاعت، 8 ناحیه د قلعه فتح الله ګذر، کورنی: 7، ډوډی: 10",
      english: "Hamdam, son of Abdul Wahid, Status: Destitute Household, Nahya 8, Qala-e-Fathullah Gozar, Family: 7 Persons, Daily Bread: 10 Loaves"
    },
    {
      id: "IVP-104",
      dari: "احمد محمودی، کارمند ارشد پورتال تایید هویت احصائیه، دفتر مرکزی کابل 104",
      pashto: "احمد محمودی، د احصایی د هویت تصدیق پورتال لوړپوړی کارمند، د کابل مرکزی دفتر 104",
      english: "Ahmad Mahmoodi, Senior Identity Verification Portal Operator, NSIA Central Kabul HQ Office #104"
    }
  ];

  const triggerTranslation = async (text: string, lang: string, neural: boolean) => {
    if (!text.trim()) {
      setTranslatedText('');
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          src_lang: lang,
          tgt_lang: 'eng_Latn',
          force_neural: neural
        })
      });

      const data = await res.json();
      if (data.success) {
        setTranslatedText(data.translated);
        setEngineUsed(data.engine || 'lexical_dictionary');
      }
    } catch (err) {
      console.error('Translation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setInputText(val);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      triggerTranslation(val, srcLang, forceNeural);
    }, 250);
  };

  const handleLangChange = (newLang: string) => {
    setSrcLang(newLang);
    triggerTranslation(inputText, newLang, forceNeural);
  };

  const handlePresetSelect = (preset: PresetItem) => {
    setInputText(preset.text);
    setSrcLang(preset.lang);
    triggerTranslation(preset.text, preset.lang, forceNeural);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(translatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto text-slate-100">
      
      {/* Header Banner */}
      <div className="glass-card p-5 rounded-2xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 border border-purple-400/40 flex items-center justify-center shadow-lg shadow-purple-500/25">
            <Languages className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black tracking-tight text-white">
                PARALLEL DUAL-STREAM NEURAL TRANSLATOR
              </h2>
              <span className="badge-glass badge-gold">META NLLB 3.3B + LEXICAL MATRIX</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Real-time parallel translation between Afghan Native Scripts (Dari / Pashto) and English for civil registries.
            </p>
          </div>
        </div>

        {/* Controls: Language and Neural Toggle */}
        <div className="flex flex-wrap items-center gap-3">
          
          <div className="flex bg-[#12192a] p-1 rounded-xl border border-white/10">
            <button
              onClick={() => handleLangChange('prs_Arab')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                srcLang === 'prs_Arab'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🇦🇫 Dari (دری)
            </button>
            <button
              onClick={() => handleLangChange('pus_Arab')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                srcLang === 'pus_Arab'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🇦🇫 Pashto (پښتو)
            </button>
          </div>

          <button
            onClick={() => {
              const nextVal = !forceNeural;
              setForceNeural(nextVal);
              triggerTranslation(inputText, srcLang, nextVal);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
              forceNeural
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Neural NLLB 3.3B: {forceNeural ? 'ON' : 'AUTO'}</span>
          </button>

        </div>
      </div>

      {/* Preset Quick Chips */}
      <div className="glass-card p-3.5 rounded-xl border border-white/10 flex items-center gap-2 overflow-x-auto scrollbar-none">
        <span className="text-[11px] font-bold text-slate-400 shrink-0 flex items-center gap-1">
          <BookOpen className="w-3.5 h-3.5 text-amber-400" />
          Benchmark Presets:
        </span>
        <div className="flex items-center gap-2">
          {samplePresets.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handlePresetSelect(preset)}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-emerald-500/15 border border-white/5 hover:border-emerald-500/30 text-slate-300 hover:text-white text-xs font-medium whitespace-nowrap transition-all cursor-pointer"
            >
              {preset.title}
            </button>
          ))}
        </div>
      </div>

      {/* Side-by-Side Dual-Stream Translation Panes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left Pane: Original Source Text (RTL) */}
        <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                ORIGINAL NATIVE SCRIPT ({srcLang === 'prs_Arab' ? 'دری / فارسی' : 'پښتو'})
              </span>
              <span className="badge-glass badge-cyan">INPUT STREAM (RTL)</span>
            </div>

            <textarea
              dir="rtl"
              value={inputText}
              onChange={handleInputChange}
              placeholder={srcLang === 'prs_Arab' ? "متن، نام، کتاب اساس یا سند رسمی را به زبان دری اینجا بنویسید..." : "دلته خپل متن، نوم یا رسمی سند په پښتو ژبه ولیکئ..."}
              className="w-full h-44 bg-[#090e1a]/80 border border-white/10 focus:border-cyan-500/60 rounded-xl p-4 text-sm sm:text-base text-white placeholder:text-slate-500 font-persian outline-none resize-none leading-relaxed transition-colors shadow-inner"
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px] font-mono text-slate-400">
            <span>{inputText.length} Characters &bull; {inputText.split(/\s+/).filter(Boolean).length} Words</span>
            <button
              onClick={() => { setInputText(''); setTranslatedText(''); }}
              className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Right Pane: English Translation Output (LTR) */}
        <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                PARALLEL ENGLISH TRANSLATION
              </span>
              <span className={`badge-glass ${engineUsed.includes('neural') ? 'badge-purple' : 'badge-green'}`}>
                {engineUsed.includes('neural') ? 'META NLLB 3.3B' : 'AFGHAN LEXICAL MATRIX'}
              </span>
            </div>

            <div className="w-full h-44 bg-[#090e1a]/80 border border-white/10 rounded-xl p-4 text-sm sm:text-base text-slate-100 overflow-y-auto leading-relaxed shadow-inner flex flex-col justify-center">
              {loading ? (
                <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Translation Stream...</span>
                </div>
              ) : translatedText ? (
                <div className="text-emerald-300 font-semibold">{translatedText}</div>
              ) : (
                <span className="text-slate-500 text-xs">Type or select a benchmark preset on the left...</span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px] font-mono text-slate-400">
            <span>{translatedText.length} Characters &bull; {translatedText.split(/\s+/).filter(Boolean).length} Words</span>
            <button
              onClick={copyToClipboard}
              disabled={!translatedText}
              className="px-3 py-1 bg-emerald-600/80 hover:bg-emerald-500 text-white rounded font-sans font-semibold transition-all flex items-center gap-1.5 disabled:opacity-40 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-200" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Translation'}</span>
            </button>
          </div>
        </div>

      </div>

      {/* Parallel Database Record Comparison Table */}
      <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ArrowLeftRight className="w-4 h-4 text-amber-400" />
              Live Parallel Record Comparison Table (Native vs English)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Verified ground-truth bilingual comparisons across civil registries and humanitarian aid dossiers.
            </p>
          </div>
          <span className="badge-glass badge-gold">SIDE-BY-SIDE MATRIX</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 font-mono">
                <th className="py-2.5 px-3 w-28">Record Ref</th>
                <th className="py-2.5 px-3">Original Dari / Pashto Text (متن اصلی)</th>
                <th className="py-2.5 px-3">Parallel English Translation (ترجمه انگلیسی)</th>
                <th className="py-2.5 px-3 w-24 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {batchParallelData.map(item => (
                <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-amber-400">
                    #{item.id}
                  </td>
                  <td className="py-3 px-3">
                    <div dir="rtl" className="font-persian font-bold text-white text-sm mb-0.5">
                      {item.dari}
                    </div>
                    <div dir="rtl" className="font-persian text-xs text-cyan-400">
                      {item.pashto}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-emerald-300 font-semibold leading-relaxed">
                    {item.english}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => {
                        setInputText(item.dari);
                        setTranslatedText(item.english);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded border border-white/10 font-medium transition-all"
                    >
                      Load &rsaquo;
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
