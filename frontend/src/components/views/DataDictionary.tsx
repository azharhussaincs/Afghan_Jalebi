import React, { useState } from 'react';
import { BookMarked, Search, Info, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const DataDictionary: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const dictionary = [
    {
      num: 1,
      col: 'ID',
      sqlType: 'INTEGER PRIMARY KEY',
      logicalType: 'Unique Identifier',
      desc: 'Unique primary integer identifier assigned to each individual registration entry in the national registry system.',
      example: '1009, 1010, 1011',
      nullBehavior: 'Mandatory (Zero nulls allowed)'
    },
    {
      num: 2,
      col: 'IntegerKey',
      sqlType: 'INTEGER',
      logicalType: 'System Sequence Key',
      desc: 'Numerical system key assigned during database generation/batch identification.',
      example: '634067377, 1436777043',
      nullBehavior: 'Populated across records'
    },
    {
      num: 3,
      col: 'HashKey',
      sqlType: 'TEXT (CHAR 32)',
      logicalType: 'MD5 Cryptographic Hash',
      desc: '32-character hexadecimal MD5 hash fingerprinting the citizen identity profile.',
      example: 'B3BDB5290D8773A703554E96DA34E64F',
      nullBehavior: 'Populated for unique indexing'
    },
    {
      num: 4,
      col: 'Name',
      sqlType: 'TEXT (Unicode UTF-8)',
      logicalType: 'Personal Name (نام)',
      desc: 'Recorded first name of the citizen in Dari / Persian / Pashto Arabic script.',
      example: 'ظریفه, انصار الله, بلال',
      nullBehavior: 'High completeness; preserved as written'
    },
    {
      num: 5,
      col: 'FName',
      sqlType: 'TEXT (Unicode UTF-8)',
      logicalType: "Patronymic (نام پدر)",
      desc: "Father's name of the citizen recorded in Dari / Persian script.",
      example: 'لالا شیرین, ذکرالله, لاهور',
      nullBehavior: 'Preserved with exact spelling'
    },
    {
      num: 6,
      col: 'GName',
      sqlType: 'TEXT (Unicode UTF-8)',
      logicalType: "Lineage (نام پدرکلان)",
      desc: "Grandfather's name of the citizen recorded for ancestral lineage identification.",
      example: 'در محمد, مومن جان, شرف الدین',
      nullBehavior: 'Preserved as recorded'
    },
    {
      num: 7,
      col: 'DoBYear',
      sqlType: 'INTEGER',
      logicalType: 'Temporal (Birth Year)',
      desc: 'Citizen birth year recorded according to the Solar Hijri (هجری شمسی) Afghan official calendar.',
      example: '1388, 1370, 1356 (Approx. 2009, 1991, 1977 CE)',
      nullBehavior: 'Valid years typically span 1300 - 1405 SH'
    },
    {
      num: 8,
      col: 'Gender',
      sqlType: 'INTEGER',
      logicalType: 'Demographic Code',
      desc: 'Binary gender classification code recorded in the civil database. Explicitly represented as Code 0 and Code 1.',
      example: '0, 1',
      nullBehavior: 'Standard values are 0 and 1'
    },
    {
      num: 9,
      col: 'Province',
      sqlType: 'TEXT (Unicode UTF-8)',
      logicalType: 'Geographic (Province / ولایت)',
      desc: 'Official province where the citizen or family registry is recorded.',
      example: 'کابل, هرات, بلخ, ننگرهار',
      nullBehavior: 'Populated with official Afghan provinces'
    },
    {
      num: 10,
      col: 'District',
      sqlType: 'TEXT (Unicode UTF-8)',
      logicalType: 'Geographic (District / ولسوالی)',
      desc: 'Official administrative district within the province.',
      example: 'موسهی, سروبی, پغمان, بگرامی',
      nullBehavior: 'Populated with district names'
    },
    {
      num: 11,
      col: 'ProvinceCode',
      sqlType: 'TEXT (CHAR 3)',
      logicalType: 'Standard Provincial Code',
      desc: 'Three-letter uppercase standardized abbreviation for the province.',
      example: 'KBL, HRT, BLK, NGR',
      nullBehavior: 'Standard 3-letter codes'
    },
    {
      num: 12,
      col: 'DistrictCode',
      sqlType: 'TEXT (CHAR 4)',
      logicalType: 'Administrative District Code',
      desc: 'Four-digit numerical identifier assigned to the administrative district.',
      example: '0107, 0115, 0103',
      nullBehavior: '4-digit strings'
    },
    {
      num: 13,
      col: 'RecordNumber',
      sqlType: 'INTEGER',
      logicalType: 'Ledger Sequential Number',
      desc: 'Ordinal registration entry number recorded on the specific physical ledger page.',
      example: '201, 280, 156, 76',
      nullBehavior: 'Integer sequence'
    },
    {
      num: 14,
      col: 'PageNumber',
      sqlType: 'INTEGER',
      logicalType: 'Physical Volume Page Number',
      desc: 'Physical page number in the bound handwritten registry book (جلد).',
      example: '41, 1, 32, 16, 5',
      nullBehavior: 'Integer page numbers'
    },
    {
      num: 15,
      col: 'BookName',
      sqlType: 'TEXT (Unicode UTF-8)',
      logicalType: 'Registry Book Title (جلد قلم انداز)',
      desc: 'Complete official volume title, year, and administrative jurisdiction of the ledger book.',
      example: 'جلد 4 قلم انداز سال 1396 ولسوالی موسهی ولایت کابل',
      nullBehavior: 'Full descriptive title'
    },
    {
      num: 16,
      col: 'CroppedPath',
      sqlType: 'TEXT',
      logicalType: 'Scanned Document Reference',
      desc: 'Local file path reference to the scanned crop image corresponding to this entry in historical storage archives.',
      example: '\\15\\48\\59864\\41\\1009.jpg',
      nullBehavior: 'Windows-style media reference path'
    }
  ];

  const filtered = dictionary.filter(
    (d) =>
      d.col.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.logicalType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.desc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header Banner */}
      <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-brand-500/10 text-brand-400">
            <BookMarked className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100">
              Data Dictionary & 16-Column Schema Specification
            </h2>
            <p className="text-xs text-slate-400">
              Formal technical documentation of data types, constraints, logical definitions, and semantic standards
            </p>
          </div>
        </div>

        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search columns or types..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-brand-500"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
        </div>
      </div>

      {/* Semantic Guidance Notice */}
      <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-xs text-slate-300 space-y-2">
        <div className="flex items-center space-x-2 text-brand-400 font-bold">
          <Info className="w-4 h-4" />
          <span>Semantic Policy & Truth-In-Data Standards</span>
        </div>
        <p className="leading-relaxed">
          1. <strong>Gender Codes:</strong> Stored as binary values <code className="bg-slate-800 px-1 py-0.5 rounded text-brand-300">0</code> (Male / مرد) and <code className="bg-slate-800 px-1 py-0.5 rounded text-brand-300">1</code> (Female / زن).
        </p>
        <p className="leading-relaxed">
          2. <strong>Temporal System:</strong> <code className="bg-slate-800 px-1 py-0.5 rounded text-brand-300">DoBYear</code> records birth years in the Solar Hijri (هجری شمسی) calendar.
        </p>
        <p className="leading-relaxed">
          3. <strong>Unicode Preservation:</strong> Dari/Persian characters are strictly preserved in UTF-8 encoding across all storage, indexing, search, and export flows.
        </p>
      </div>

      {/* Dictionary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => (
          <div
            key={item.num}
            className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-400 font-mono text-xs flex items-center justify-center font-bold">
                    {item.num}
                  </span>
                  <h3 className="font-mono font-bold text-sm text-slate-100">{item.col}</h3>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-brand-500/10 text-brand-400 border border-brand-500/20">
                  {item.sqlType}
                </span>
              </div>

              <div className="mt-2 text-xs font-semibold text-indigo-400">
                {item.logicalType}
              </div>

              <p className="mt-2 text-xs text-slate-300 leading-relaxed">{item.desc}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/60 space-y-1.5 text-[11px]">
              <div className="flex items-center justify-between text-slate-400">
                <span>Observed Example:</span>
                <span className="font-mono text-slate-200 font-persian font-medium truncate max-w-[220px]">
                  {item.example}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Null Behavior:</span>
                <span className="text-slate-300 font-medium">{item.nullBehavior}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
