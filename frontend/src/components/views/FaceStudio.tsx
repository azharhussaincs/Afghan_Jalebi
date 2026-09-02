import React, { useState, useEffect, useRef } from 'react';
import {
  ScanFace,
  UploadCloud,
  Crosshair,
  ShieldCheck,
  Search,
  User,
  CheckCircle2,
  Copy,
  ExternalLink,
  ChevronRight,
  Sparkles,
  RefreshCw,
  X
} from 'lucide-react';
import { TargetScanHUD } from '../biometrics/TargetScanHUD';

interface BiometricCandidate {
  face_id: number;
  record_id: number;
  path: string;
  distance: number;
  confidence: number;
  name?: string;
  name_english?: string;
  fname?: string;
  fname_english?: string;
  gname?: string;
  gname_english?: string;
  dob_year?: number | string;
  age_approx?: number | string;
  gender?: string;
  province?: string;
  province_english?: string;
  district?: string;
  district_english?: string;
  record_number?: number | string;
  page_number?: number | string;
  book_name?: string;
  cropped_path?: string;
}

interface BiometricsSearchResponse {
  success: boolean;
  probe_type?: string;
  total_searched?: number;
  matches?: BiometricCandidate[];
  error?: string;
}

export const FaceStudio: React.FC = () => {
  const [samplePhotos, setSamplePhotos] = useState<string[]>([]);
  const [selectedSample, setSelectedSample] = useState<string | null>(null);
  const [uploadedImageSrc, setUploadedImageSrc] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [inputRecordId, setInputRecordId] = useState<string>('1009');
  
  const [searching, setSearching] = useState<boolean>(false);
  const [scanStep, setScanStep] = useState<string>('IDLE');
  const [results, setResults] = useState<BiometricsSearchResponse | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<BiometricCandidate | null>(null);
  const [copiedId, setCopiedId] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load sample gallery descriptors on mount
  useEffect(() => {
    fetch('/api/biometrics/photos')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.samples?.length > 0) {
          setSamplePhotos(data.samples);
          setSelectedSample(data.samples[0]);
          executeSearch({ recordId: 1009 });
        }
      })
      .catch(() => {
        executeSearch({ recordId: 1009 });
      });
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    setSelectedSample(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setUploadedImageSrc(base64);
      executeSearch({ imageBase64: base64 });
    };
    reader.readAsDataURL(file);
  };

  const handleRunSample = (sampleName: string, idx: number) => {
    setSelectedSample(sampleName);
    setUploadedFileName(sampleName);
    const sampleRecordId = 1009 + (idx % 8);
    setInputRecordId(String(sampleRecordId));
    setUploadedImageSrc(`/api/biometrics/photos?name=${encodeURIComponent(sampleName)}`);
    executeSearch({ recordId: sampleRecordId });
  };

  const handleRecordIdSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputRecordId.trim()) return;
    setSelectedSample(null);
    setUploadedImageSrc(null);
    setUploadedFileName(`Citizen Record #${inputRecordId.trim()}`);
    executeSearch({ recordId: inputRecordId.trim() });
  };

  const executeSearch = async (payload: { imageBase64?: string; recordId?: string | number }) => {
    setSearching(true);
    setScanStep('SCANNING');

    try {
      // Step 1: Laser Scan Animation
      await new Promise(r => setTimeout(r, 600));
      setScanStep('LOCKING_VECTORS');

      // Step 2: Vector Extraction
      await new Promise(r => setTimeout(r, 600));
      setScanStep('SEARCHING_DATABASE');

      const res = await fetch('/api/biometrics/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: payload.imageBase64,
          recordId: payload.recordId,
          topK: 6
        })
      });

      const data: BiometricsSearchResponse = await res.json();
      if (data.success) {
        setResults(data);
      }
    } catch (err) {
      console.error('Biometric search error:', err);
    } finally {
      setScanStep('COMPLETED');
      setSearching(false);
    }
  };

  const copyRecordDetails = (candidate: BiometricCandidate) => {
    const text = `Citizen Record #${candidate.record_id} | Name: ${candidate.name} (${candidate.name_english}) | Father: ${candidate.fname} | Distance: ${candidate.distance} | Confidence: ${candidate.confidence}%`;
    navigator.clipboard.writeText(text);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto text-slate-100">
      
      {/* Header Telemetry Banner */}
      <div className="glass-card p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-white/10">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 border border-emerald-400/40 flex items-center justify-center shadow-lg shadow-emerald-500/25">
            <ScanFace className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black tracking-tight text-white">
                BIOMETRIC FACIAL RECOGNITION STUDIO
              </h2>
              <span className="badge-glass badge-green">128D VECTOR MATRIX</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              1-to-N Euclidean vector distance matcher indexed across 24,399,444 civil registry biometric photographs.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="status-pill-glass">
            <span className="pulse-dot" />
            <span>ResNet-34 Euclidean Engine Active</span>
          </div>
        </div>
      </div>

      {/* 2-Column Grid: Left Probe & Targeting HUD / Right 1-to-N Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Probe Input & Target HUD with Visual Laser Animation */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Probe Input Card */}
          <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-4">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Crosshair className="w-4 h-4 text-emerald-400" />
                1. Biometric Subject Probe
              </span>
              <span className="badge-glass badge-cyan">PROBE INPUT</span>
            </div>

            {/* Drag & Drop / Upload Photo Box */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-white/15 hover:border-emerald-500/50 rounded-xl p-5 text-center cursor-pointer bg-white/[0.02] hover:bg-emerald-500/[0.03] transition-all flex flex-col items-center gap-2 group"
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                className="hidden"
              />
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                <UploadCloud className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-white">Click or Drag &amp; Drop Any Portrait</span>
              <span className="text-[11px] text-slate-400">Supports JPG, PNG, WEBP (Any resolution)</span>
            </div>

            {/* Search by Citizen ID Form */}
            <form onSubmit={handleRecordIdSubmit} className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-300">
                Or Query by Registered Citizen ID:
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    placeholder="e.g. 1009, 1010, 5032, 9081..."
                    value={inputRecordId}
                    onChange={(e) => setInputRecordId(e.target.value)}
                    className="w-full bg-[#12192a]/80 border border-white/10 focus:border-emerald-500 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder:text-slate-500 outline-none font-mono"
                  />
                </div>
                <button
                  type="submit"
                  disabled={searching}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all shrink-0 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {searching ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Crosshair className="w-3.5 h-3.5" />}
                  <span>Scan</span>
                </button>
              </div>
            </form>

            {/* Archival Sample Gallery Grid */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <span className="text-[11px] font-semibold text-slate-300">
                Or Select from Archival Benchmark Portraits:
              </span>
              <div className="grid grid-cols-4 gap-2">
                {samplePhotos.map((sample, idx) => {
                  const isSel = selectedSample === sample;
                  return (
                    <button
                      key={sample}
                      onClick={() => handleRunSample(sample, idx)}
                      className={`relative rounded-lg overflow-hidden border transition-all aspect-[4/5] bg-black/40 ${
                        isSel
                          ? 'border-emerald-400 ring-2 ring-emerald-400/30'
                          : 'border-white/10 hover:border-emerald-500/50'
                      }`}
                    >
                      <img
                        src={`/api/biometrics/photos?name=${encodeURIComponent(sample)}`}
                        alt={sample}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-0 inset-x-0 bg-black/70 text-[9px] font-mono text-center text-slate-300 py-0.5 truncate px-1">
                        #{1009 + idx}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* =========================================================
              REFERENCE VECTOR TARGET & ARROW IMPACT HUD
              ========================================================= */}
          <TargetScanHUD
            imageSrc={uploadedImageSrc}
            searching={searching}
            confidence={results?.matches?.[0]?.confidence ?? 100.0}
            distance={results?.matches?.[0]?.distance ?? 0.0}
            citizenName={results?.matches?.[0]?.name ? `${results.matches[0].name} (${results.matches[0].name_english || ''})` : undefined}
            citizenId={inputRecordId || '1009'}
            onRetriggerScan={() => executeSearch({ recordId: inputRecordId || 1009 })}
          />

        </div>

        {/* Right Column: 1-to-N Ranked Candidate Dossiers */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="glass-card p-5 rounded-2xl border border-white/10 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                2. Ranked 1-to-N Match Candidates ({results?.matches ? results.matches.length : 0} Identities)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Identities ranked strictly by ascending Euclidean distance ($d \rightarrow 0$) with bilingual translation.
              </p>
            </div>
            {results?.matches?.[0] && (
              <span className="badge-glass badge-green text-xs px-2.5 py-1">
                Top Match: {results.matches[0].confidence}% Match
              </span>
            )}
          </div>

          {/* Candidate List Stack */}
          {searching ? (
            <div className="glass-card p-12 rounded-2xl border border-white/10 text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
              <div className="text-sm font-bold text-white">Synthesizing 128D Facial Vectors...</div>
              <p className="text-xs text-slate-400">Scanning indexed biometric archive for nearest Euclidean neighbors...</p>
            </div>
          ) : results?.matches && results.matches.length > 0 ? (
            <div className="space-y-3">
              {results.matches.map((m, idx) => {
                const isTop = idx === 0;
                return (
                  <div
                    key={m.face_id || idx}
                    className={`glass-card p-4 rounded-xl border transition-all hover:translate-y-[-2px] ${
                      isTop
                        ? 'border-emerald-500/50 bg-emerald-500/[0.04] shadow-lg shadow-emerald-500/10'
                        : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    {/* Header Row: Rank, Distance & Confidence */}
                    <div className="flex items-center justify-between border-b border-white/5 pb-2.5 mb-2.5">
                      <div className="flex items-center gap-2.5">
                        <span className={`text-xs font-mono font-black px-2 py-0.5 rounded ${
                          isTop
                            ? 'bg-emerald-500 text-black font-bold'
                            : 'bg-white/10 text-slate-300'
                        }`}>
                          RANK #{idx + 1}
                        </span>
                        <span className="font-mono text-xs text-white font-bold">
                          Citizen Record #{m.record_id}
                        </span>
                        {isTop && (
                          <span className="badge-glass badge-gold text-[10px]">VERIFIED BEST MATCH</span>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-slate-400">
                          Distance: <strong className="text-white font-bold">{m.distance}</strong>
                        </span>
                        <span className={`font-mono text-xs font-bold px-2.5 py-0.5 rounded-full ${
                          m.confidence >= 90
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : m.confidence >= 75
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-slate-800 text-slate-400 border border-white/10'
                        }`}>
                          {m.confidence}% Match
                        </span>
                      </div>
                    </div>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs mb-3">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Name (Native / EN)</span>
                        <strong className="text-white text-sm">{m.name || '---'}</strong>
                        <span className="text-emerald-400 block text-[11px] font-medium">{m.name_english || ''}</span>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[10px]">Father (FName)</span>
                        <span className="text-slate-200 font-medium">{m.fname || '---'}</span>
                        <span className="text-slate-400 block text-[11px]">({m.fname_english || ''})</span>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[10px]">Province / District</span>
                        <span className="text-slate-200 font-medium">{m.province || '---'}</span>
                        <span className="text-slate-400 block text-[11px]">{m.district || ''}</span>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[10px]">Birth / Ledger</span>
                        <span className="text-slate-200 font-mono font-medium">{m.dob_year || '---'} SH (~{m.age_approx} yrs)</span>
                        <span className="text-slate-400 block text-[10px] font-mono">Rec #{m.record_number} / P #{m.page_number}</span>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px]">
                      <span className="font-mono text-slate-500 truncate max-w-[60%]">
                        Path: {m.cropped_path || m.path}
                      </span>

                      <div className="flex gap-2">
                        <button
                          onClick={() => copyRecordDetails(m)}
                          className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded border border-white/10 transition-all flex items-center gap-1"
                        >
                          <Copy className="w-3 h-3" />
                          <span>{copiedId ? 'Copied' : 'Copy'}</span>
                        </button>
                        <button
                          onClick={() => setSelectedCandidate(m)}
                          className="px-3 py-1 bg-emerald-600/80 hover:bg-emerald-500 text-white font-semibold rounded transition-all flex items-center gap-1 shadow-sm"
                        >
                          <span>Full Dossier</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="glass-card p-12 rounded-2xl border border-white/10 text-center text-slate-400 space-y-2">
              <ScanFace className="w-8 h-8 mx-auto text-slate-600" />
              <p className="text-sm font-semibold text-slate-300">No Biometric Search Executed Yet</p>
              <p className="text-xs">Provide a probe photo or click an archival benchmark portrait to scan.</p>
            </div>
          )}

        </div>

      </div>

      {/* Candidate Dossier Detail Modal */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="glass-card max-w-2xl w-full rounded-2xl border border-white/15 p-6 space-y-5 shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">
                  Biometric Match Dossier #{selectedCandidate.record_id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedCandidate(null)}
                className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              <div className="bg-white/[0.03] p-3 rounded-xl border border-white/5">
                <span className="text-slate-400 block text-[10px]">Confidence Match</span>
                <strong className="text-emerald-400 text-base">{selectedCandidate.confidence}%</strong>
              </div>
              <div className="bg-white/[0.03] p-3 rounded-xl border border-white/5">
                <span className="text-slate-400 block text-[10px]">Euclidean Distance</span>
                <strong className="text-white text-base">{selectedCandidate.distance}</strong>
              </div>
              <div className="bg-white/[0.03] p-3 rounded-xl border border-white/5">
                <span className="text-slate-400 block text-[10px]">Citizen Record ID</span>
                <strong className="text-white text-base font-mono">#{selectedCandidate.record_id}</strong>
              </div>
            </div>

            <div className="space-y-2 bg-[#090e1a]/80 p-4 rounded-xl border border-white/10 text-xs">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Full Name:</span>
                <strong className="text-white">{selectedCandidate.name} ({selectedCandidate.name_english})</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Father's Name:</span>
                <span className="text-slate-200">{selectedCandidate.fname} ({selectedCandidate.fname_english})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Grandfather:</span>
                <span className="text-slate-200">{selectedCandidate.gname} ({selectedCandidate.gname_english})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Birth Year &amp; Age:</span>
                <span className="text-slate-200">{selectedCandidate.dob_year} SH (Approx. {selectedCandidate.age_approx} yrs)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Province &amp; District:</span>
                <span className="text-slate-200">{selectedCandidate.province} - {selectedCandidate.district}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Registry Ledger:</span>
                <span className="text-slate-200">{selectedCandidate.book_name || 'Standard Civil Registry Ledger'}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Vault Cropped Path:</span>
                <span className="text-slate-400 font-mono text-[10px] truncate max-w-[280px]">{selectedCandidate.cropped_path}</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => copyRecordDetails(selectedCandidate)}
                className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-xl text-xs transition-all"
              >
                Copy Profile
              </button>
              <button
                onClick={() => setSelectedCandidate(null)}
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
