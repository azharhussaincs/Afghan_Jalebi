import React, { useState } from 'react';
import { X, Copy, Check, ExternalLink, ImageOff, User, BookOpen, MapPin, Hash, Calendar, FileText, GitFork } from 'lucide-react';
import { RecordItem } from '../../types';

interface RecordDrawerProps {
  record: RecordItem | null;
  onClose: () => void;
  onViewFamilyTree?: (recordId: number) => void;
}

export const RecordDrawer: React.FC<RecordDrawerProps> = ({ record, onClose, onViewFamilyTree }) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);

  if (!record) return null;

  const copyToClipboard = (text: string | number | null, field: string) => {
    if (text === null || text === undefined) return;
    navigator.clipboard.writeText(String(text));
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const fields = [
    { key: 'id', label: 'ID (Primary Key)', val: record.id, icon: Hash, mono: true },
    { key: 'integer_key', label: 'Integer Key', val: record.integer_key, icon: Hash, mono: true },
    { key: 'hash_key', label: 'Hash Key (MD5 Fingerprint)', val: record.hash_key, icon: Hash, mono: true },
    { key: 'name', label: 'Name (نام)', val: record.name, icon: User, rtl: true },
    { key: 'fname', label: "Father's Name (نام پدر)", val: record.fname, icon: User, rtl: true },
    { key: 'gname', label: "Grandfather's Name (نام پدرکلان)", val: record.gname, icon: User, rtl: true },
    { key: 'gender', label: 'Gender Code', val: record.gender !== null ? `Code ${record.gender}` : null, icon: User },
    { key: 'dob_year', label: 'Birth Year (هجری شمسی)', val: record.dob_year ? `${record.dob_year} SH` : null, icon: Calendar },
    { key: 'province', label: 'Province (ولایت)', val: record.province, icon: MapPin, rtl: true },
    { key: 'district', label: 'District (ولسوالی)', val: record.district, icon: MapPin, rtl: true },
    { key: 'province_code', label: 'Province Code', val: record.province_code, icon: MapPin, mono: true },
    { key: 'district_code', label: 'District Code', val: record.district_code, icon: MapPin, mono: true },
    { key: 'book_name', label: 'Registry Book (جلد)', val: record.book_name, icon: BookOpen, rtl: true },
    { key: 'page_number', label: 'Page Number (صفحه)', val: record.page_number, icon: FileText },
    { key: 'record_number', label: 'Record Number (شماره ثبت)', val: record.record_number, icon: FileText },
    { key: 'cropped_path', label: 'Cropped Image Path', val: record.cropped_path, icon: ExternalLink, mono: true }
  ];

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-slate-950/95 backdrop-blur-xl border-l border-slate-800 shadow-2xl flex flex-col justify-between overflow-y-auto">
      <div>
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-950/90 backdrop-blur-md z-10">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-400">
              Record Inspector
            </span>
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              Record #{record.id}
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            {onViewFamilyTree && (
              <button
                onClick={() => {
                  onViewFamilyTree(record.id);
                  onClose();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition-all"
                title="Explore Family Tree & Lineage"
              >
                <GitFork className="w-3.5 h-3.5" />
                <span>Family Tree</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Media Preview Section */}
        <div className="p-5 border-b border-slate-800/80 bg-slate-900/30">
          <h4 className="text-xs font-semibold text-slate-400 mb-2">Cropped Scanned Document Media</h4>
          {record.cropped_path && !imgError ? (
            <div className="rounded-lg border border-slate-800 overflow-hidden bg-slate-950 p-2 flex flex-col items-center">
              <img
                src={`/api/records/${record.id}/image`}
                alt={`Scanned document for record ${record.id}`}
                className="max-h-48 object-contain rounded"
                onError={() => setImgError(true)}
              />
              <span className="mt-2 text-[10px] font-mono text-slate-500 truncate w-full text-center">
                {record.cropped_path}
              </span>
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-slate-800 p-4 text-center bg-slate-950/40">
              <ImageOff className="w-6 h-6 text-slate-600 mx-auto mb-1.5" />
              <p className="text-xs font-medium text-slate-400">Cropped Image File Unavailable Locally</p>
              <p className="text-[10px] text-slate-500 mt-1 font-mono break-all">
                {record.cropped_path || 'No path specified'}
              </p>
              <p className="text-[10px] text-amber-400/80 mt-1">
                Raw source reference preserved faithfully. (No synthetic images generated).
              </p>
            </div>
          )}
        </div>

        {/* Detailed Fields Grid */}
        <div className="p-5 space-y-3">
          {fields.map((f) => {
            const Icon = f.icon;
            const isCopied = copiedField === f.key;
            return (
              <div
                key={f.key}
                className="group p-2.5 rounded-lg bg-slate-900/50 hover:bg-slate-900 border border-slate-800/60 transition-all flex items-start justify-between gap-2"
              >
                <div className="flex items-start space-x-2.5 min-w-0">
                  <div className="mt-0.5 p-1 rounded bg-slate-800/80 text-slate-400">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11px] font-medium text-slate-400">{f.label}</div>
                    <div
                      className={`text-xs text-slate-100 font-medium break-words mt-0.5 ${
                        f.rtl ? 'font-persian text-sm text-brand-300' : ''
                      } ${f.mono ? 'font-mono text-[11px] text-indigo-300' : ''}`}
                    >
                      {f.val !== null && f.val !== undefined && f.val !== '' ? (
                        String(f.val)
                      ) : (
                        <span className="text-slate-600 italic">null / empty</span>
                      )}
                    </div>
                  </div>
                </div>

                {f.val !== null && f.val !== undefined && f.val !== '' && (
                  <button
                    onClick={() => copyToClipboard(f.val, f.key)}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-all"
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
      <div className="p-4 border-t border-slate-800 bg-slate-950/80 text-center">
        <button
          onClick={onClose}
          className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold rounded-lg border border-slate-800 transition-colors"
        >
          Close Inspector
        </button>
      </div>
    </div>
  );
};
