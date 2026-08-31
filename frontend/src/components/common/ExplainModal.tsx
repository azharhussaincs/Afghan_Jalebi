import React from 'react';
import { X, HelpCircle, AlertTriangle, CheckCircle, BarChart2 } from 'lucide-react';

interface ExplainModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  topic: 'pearson' | 'spearman' | 'cramers' | 'gender_semantics' | 'solar_hijri' | 'quality_score';
}

export const ExplainModal: React.FC<ExplainModalProps> = ({ isOpen, onClose, title, topic }) => {
  if (!isOpen) return null;

  const renderContent = () => {
    switch (topic) {
      case 'pearson':
        return (
          <div className="space-y-3 text-xs text-slate-300">
            <p>
              <strong>Pearson Correlation Coefficient (r)</strong> measures the linear relationship between two continuous numeric variables.
            </p>
            <ul className="list-disc pl-4 space-y-1">
              <li><strong>+1.0:</strong> Perfect positive linear correlation.</li>
              <li><strong>0.0:</strong> No linear correlation.</li>
              <li><strong>-1.0:</strong> Perfect negative linear correlation.</li>
            </ul>
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-start space-x-2 text-amber-300">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span><strong>Crucial Scientific Rule:</strong> Correlation does NOT imply causation. A strong statistical coefficient indicates co-occurrence, not causal dependency.</span>
            </div>
          </div>
        );
      case 'spearman':
        return (
          <div className="space-y-3 text-xs text-slate-300">
            <p>
              <strong>Spearman's Rank Correlation (&rho;)</strong> assesses monotonic relationships using ranked values rather than linear assumptions.
            </p>
            <p>
              Spearman is robust against non-linear scaling and extreme outliers, making it appropriate for registry sequences like Record Number vs. Page Number.
            </p>
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-start space-x-2 text-amber-300">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>Monotonic association does not establish cause-and-effect mechanisms.</span>
            </div>
          </div>
        );
      case 'cramers':
        return (
          <div className="space-y-3 text-xs text-slate-300">
            <p>
              <strong>Cramér's V (V)</strong> measures the strength of association between two categorical nominal variables based on Pearson's Chi-Square test of independence.
            </p>
            <ul className="list-disc pl-4 space-y-1">
              <li><strong>0.00 - 0.10:</strong> Negligible association.</li>
              <li><strong>0.10 - 0.30:</strong> Weak to moderate association.</li>
              <li><strong>0.30 - 0.50:</strong> Moderate to strong association.</li>
              <li><strong>&gt; 0.50:</strong> Very strong association.</li>
            </ul>
            <p>Used here to test geographic province registration vs recorded gender code distributions.</p>
          </div>
        );
      case 'gender_semantics':
        return (
          <div className="space-y-3 text-xs text-slate-300">
            <p>
              The dataset contains binary values: <strong>0</strong> and <strong>1</strong> in the <code className="bg-slate-800 px-1 py-0.5 rounded text-brand-300">Gender</code> column.
            </p>
            <p>
              While in Afghan national civil registry systems 0 is traditionally coded for Male and 1 for Female (or vice-versa in specific regional systems), we explicitly display them as <strong>Gender Code 0</strong> and <strong>Gender Code 1</strong> to prevent unwarranted assumptions without external domain verification.
            </p>
          </div>
        );
      case 'solar_hijri':
        return (
          <div className="space-y-3 text-xs text-slate-300">
            <p>
              The <code className="bg-slate-800 px-1 py-0.5 rounded text-brand-300">DoBYear</code> column records birth years in the <strong>Solar Hijri (هجری شمسی)</strong> official Afghan calendar.
            </p>
            <p>
              To convert approximately to the Gregorian Calendar (CE): <em>CE Year &asymp; Solar Hijri Year + 621</em> (e.g., 1388 SH corresponds to ~2009-2010 CE).
            </p>
          </div>
        );
      case 'quality_score':
        return (
          <div className="space-y-3 text-xs text-slate-300">
            <p>
              The <strong>Composite Data Quality Score</strong> is computed through a multi-dimensional assessment:
            </p>
            <ul className="list-disc pl-4 space-y-1">
              <li><strong>Completeness (35% weight):</strong> Percentage of non-null fields across all 16 columns.</li>
              <li><strong>Uniqueness (30% weight):</strong> Absence of duplicate primary IDs and MD5 HashKeys.</li>
              <li><strong>Validity (20% weight):</strong> Conformance of data types and value ranges.</li>
              <li><strong>Consistency (15% weight):</strong> Uniformity across Province Code and District Code relationships.</li>
            </ul>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center space-x-2">
            <HelpCircle className="w-4 h-4 text-brand-400" />
            <h3 className="text-sm font-bold text-slate-100">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5">{renderContent()}</div>

        <div className="p-3 border-t border-slate-800 bg-slate-950/50 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
