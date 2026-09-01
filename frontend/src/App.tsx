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
import { DataDictionary } from './components/views/DataDictionary';
import { ReportGenerator } from './components/views/ReportGenerator';
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
      case 'search':
        return <AdvancedSearch onSelectRecord={(r) => setSelectedRecord(r)} />;
      case 'explorer':
        return <DataExplorer onSelectRecord={(r) => setSelectedRecord(r)} />;
      case 'geographic':
        return <GeographicAnalytics />;
      case 'demographics':
        return <DemographicAnalytics />;
      case 'books':
        return <BookPageExplorer />;
      case 'relationships':
        return <RelationshipLab initialRecordId={familyRecordId} />;
      case 'quality':
        return <DataQualityCenter />;
      case 'dictionary':
        return <DataDictionary />;
      case 'reports':
        return <ReportGenerator />;
      default:
        return <ExecutiveOverview onNavigate={(view) => setActiveView(view)} />;
    }
  };

  return (
    <FilterProvider>
      <div className="flex min-h-screen bg-slate-950 text-slate-100 antialiased font-sans">
        {/* Persistent Sidebar */}
        <Sidebar activeView={activeView} setActiveView={setActiveView} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <Header
            activeView={activeView}
            onExportClick={() => setShowExportModal(true)}
            onSearchSubmit={() => setActiveView('search')}
          />
          <GlobalFilterBar onExportClick={() => setShowExportModal(true)} />

          <main className="flex-1 overflow-y-auto">
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
