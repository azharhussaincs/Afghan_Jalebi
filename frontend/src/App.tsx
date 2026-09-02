import React, { useState } from 'react';
import { FilterProvider } from './context/FilterContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { GlobalFilterBar } from './components/layout/GlobalFilterBar';
import { RecordDrawer } from './components/common/RecordDrawer';
import { ExecutiveOverview } from './components/views/ExecutiveOverview';
import { AdvancedSearch } from './components/views/AdvancedSearch';
import { DataExplorer } from './components/views/DataExplorer';
import { GeographicAnalytics } from './components/views/GeographicAnalytics';
import { DemographicAnalytics } from './components/views/DemographicAnalytics';
import { BookPageExplorer } from './components/views/BookPageExplorer';
import { RelationshipLab } from './components/views/RelationshipLab';
import { DataQualityCenter } from './components/views/DataQualityCenter';
import { ReportGenerator } from './components/views/ReportGenerator';
import { FaceStudio } from './components/views/FaceStudio';
import { TranslationStudio } from './components/views/TranslationStudio';
import { RtpRegistryView } from './components/views/RtpRegistryView';
import { IvpAuditView } from './components/views/IvpAuditView';
import { RecordItem } from './types';
import { ExportModal } from './components/common/ExportModal';

export const App: React.FC = () => {
  const [activeView, setActiveView] = useState<string>('overview');
  const [selectedRecord, setSelectedRecord] = useState<RecordItem | null>(null);
  const [familyRecordId, setFamilyRecordId] = useState<number | null>(null);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);

  const handleViewFamilyTree = (recordId: number) => {
    setFamilyRecordId(recordId);
    setActiveView('relationships');
  };

  const renderActiveView = () => {
    switch (activeView) {
      case 'overview':
        return <ExecutiveOverview onNavigate={(view) => setActiveView(view)} />;
      case 'geographic':
        return <GeographicAnalytics />;
      case 'biometrics':
        return <FaceStudio />;
      case 'translation':
        return <TranslationStudio />;
      case 'rtp_relief':
        return <RtpRegistryView />;
      case 'ivp_security':
        return <IvpAuditView />;
      case 'search':
        return <AdvancedSearch onSelectRecord={(r) => setSelectedRecord(r)} />;
      case 'explorer':
        return <DataExplorer onSelectRecord={(r) => setSelectedRecord(r)} />;
      case 'demographics':
        return <DemographicAnalytics />;
      case 'books':
        return (
          <BookPageExplorer
            onSelectRecord={(r) => setSelectedRecord(r)}
            onViewFamilyTree={handleViewFamilyTree}
          />
        );
      case 'relationships':
        return <RelationshipLab initialRecordId={familyRecordId} />;
      case 'quality':
        return <DataQualityCenter />;
      case 'reports':
        return <ReportGenerator />;
      default:
        return <ExecutiveOverview onNavigate={(view) => setActiveView(view)} />;
    }
  };

  return (
    <FilterProvider>
      <div className="flex min-h-screen bg-[#05070d] text-slate-100 antialiased font-sans">
        {/* Persistent Cyber-HUD Sidebar */}
        <Sidebar activeView={activeView} setActiveView={setActiveView} />

        {/* Main Content Viewport */}
        <div className="flex-1 flex flex-col min-w-0">
          <Header
            activeView={activeView}
            onExportClick={() => setShowExportModal(true)}
            onSearchSubmit={() => setActiveView('search')}
          />
          <GlobalFilterBar onExportClick={() => setShowExportModal(true)} />

          <main className="flex-1 overflow-y-auto bg-ambient-grid">
            {renderActiveView()}
          </main>
        </div>

        {/* Record Intelligence Detail Drawer */}
        <RecordDrawer
          record={selectedRecord}
          onClose={() => setSelectedRecord(null)}
          onViewFamilyTree={handleViewFamilyTree}
        />

        {/* Universal Enterprise Export Modal */}
        <ExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
        />
      </div>
    </FilterProvider>
  );
};
