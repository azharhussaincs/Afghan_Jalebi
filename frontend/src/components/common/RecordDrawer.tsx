import React, { useState } from 'react';
import { X, Copy, Check, ExternalLink, User, BookOpen, MapPin, Hash, Calendar, FileText, GitFork } from 'lucide-react';
import { RecordItem } from '../../types';

interface RecordDrawerProps {
  record: RecordItem | null;
  onClose: () => void;
  onViewFamilyTree?: (recordId: number) => void;
}

export const RecordDrawer: React.FC<RecordDrawerProps> = ({ record, onClose, onViewFamilyTree }) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!record) return null;

  const copyToClipboard = (text: string | number | null, field: string) => {
    if (text === null || text === undefined) return;
    navigator.clipboard.writeText(String(text));
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const fields = [
    { key: 'name', label: 'Name (نام)', val: record.name, icon: User, rtl: true, colSpan: false },
    { key: 'fname', label: "Father's Name (نام پدر)", val: record.fname, icon: User, rtl: true, colSpan: false },
    { key: 'gname', label: "Grandfather's Name (نام پدرکلان)", val: record.gname, icon: User, rtl: true, colSpan: false },
    { key: 'gender', label: 'Gender (جنسیت)', val: record.gender === 0 ? 'Male (مرد)' : (record.gender === 1 ? 'Female (زن)' : null), icon: User, colSpan: false },
    { key: 'dob_year', label: 'Birth Year (هجری شمسی)', val: record.dob_year ? `${record.dob_year} SH` : null, icon: Calendar, colSpan: false },
    { key: 'province', label: 'Province (ولایت)', val: record.province, icon: MapPin, rtl: true, colSpan: false },
    { key: 'district', label: 'District (ولسوالی)', val: record.district, icon: MapPin, rtl: true, colSpan: false },
    { key: 'page_number', label: 'Page Number (صفحه)', val: record.page_number, icon: FileText, colSpan: false },
    { key: 'record_number', label: 'Record Number (شماره ثبت)', val: record.record_number, icon: FileText, colSpan: false },
    { key: 'province_code', label: 'Province Code', val: record.province_code, icon: MapPin, mono: true, colSpan: false },
    { key: 'district_code', label: 'District Code', val: record.district_code, icon: MapPin, mono: true, colSpan: false },
    { key: 'book_name', label: 'Registry Book (جلد)', val: record.book_name, icon: BookOpen, rtl: true, colSpan: true },
    { key: 'id', label: 'ID (Primary Key)', val: record.id, icon: Hash, mono: true, colSpan: false },
    { key: 'integer_key', label: 'Integer Key', val: record.integer_key, icon: Hash, mono: true, colSpan: false },
    { key: 'hash_key', label: 'Hash Key (MD5 Fingerprint)', val: record.hash_key, icon: Hash, mono: true, colSpan: true },
    { key: 'cropped_path', label: 'Cropped Image Path', val: record.cropped_path, icon: ExternalLink, mono: true, colSpan: true }
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/70 shrink-0">
          <div className="flex items-center space-x-3">
            <div
              className={`p-2.5 rounded-xl border ${
                record.gender === 1
                  ? 'bg-pink-500/10 text-pink-400 border-pink-500/20'
                  : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
              }`}
            >
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-400 font-mono">
                  Record Inspector
                </span>
                {record.name && (
                  <>
                    <span className="text-xs text-slate-500">•</span>
                    <span className="text-xs text-slate-300 font-bold">
                      {record.name} {record.fname ? `ولد ${record.fname}` : ''}
                    </span>
                  </>
                )}
              </div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <span>Record #{record.id}</span>
                {record.province && (
                  <span className="text-xs font-normal text-slate-400">
                    ({record.province} {record.district ? `• ${record.district}` : ''})
                  </span>
                )}
              </h3>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {onViewFamilyTree && (
              <button
                onClick={() => {
                  onViewFamilyTree(record.id);
                  onClose();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition-all cursor-pointer shadow-sm"
                title="Explore Family Tree & Lineage"
              >
                <GitFork className="w-3.5 h-3.5" />
                <span>Family Tree</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 overflow-y-auto custom-scrollbar flex-1">


          {/* Two-Column Grid for Record Attributes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {fields.map((f) => {
              const Icon = f.icon;
              const isCopied = copiedField === f.key;
              return (
                <div
                  key={f.key}
                  className={`group p-3 rounded-xl bg-slate-950/70 hover:bg-slate-950 border border-slate-800/80 transition-all flex items-start justify-between gap-2 ${
                    f.colSpan ? 'sm:col-span-2' : ''
                  }`}
                >
                  <div className="flex items-start space-x-2.5 min-w-0 flex-1">
                    <div className="mt-0.5 p-1 rounded-lg bg-slate-800/80 text-slate-400 shrink-0">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[11px] font-medium text-slate-400">{f.label}</div>
                      <div
                        className={`text-xs text-slate-100 font-medium break-words mt-0.5 ${
                          f.rtl ? 'text-sm text-brand-300 font-bold' : ''
                        } ${f.mono ? 'font-mono text-[11px] text-indigo-300' : ''}`}
                      >
                        {f.val !== null && f.val !== undefined && f.val !== '' ? (
                          String(f.val)
                        ) : (
                          <span className="text-slate-600 italic text-[11px]">null / empty</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {f.val !== null && f.val !== undefined && f.val !== '' && (
                    <button
                      onClick={() => copyToClipboard(f.val, f.key)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-all shrink-0 cursor-pointer"
                      title="Copy value"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/70 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-400">
            {record.dob_year ? `Birth Year: ${record.dob_year} SH` : `Volume: ${record.book_name || 'N/A'}`}
          </div>
          <div className="flex items-center space-x-2">
            {onViewFamilyTree && (
              <button
                onClick={() => {
                  onViewFamilyTree(record.id);
                  onClose();
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
              >
                <GitFork className="w-3.5 h-3.5" />
                <span>Family Tree</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors cursor-pointer"
            >
              Close Inspector
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
