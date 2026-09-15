import React, { useState } from 'react';
import { IoTProvider, useIoT } from './context/IoTContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { OverviewDashboard } from './components/dashboard/OverviewDashboard';
import { DeviceList } from './components/devices/DeviceList';
import { DeviceDetailModal } from './components/devices/DeviceDetailModal';
import { ProvisioningModal } from './components/devices/ProvisioningModal';
import { TemplatesView } from './components/templates/TemplatesView';
import { DatastreamsView } from './components/datastreams/DatastreamsView';
import { DashboardBuilder } from './components/dashboard-builder/DashboardBuilder';
import { AutomationsView } from './components/automations/AutomationsView';
import { EventsView } from './components/events/EventsView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { FirmwareOTAView } from './components/firmware/FirmwareOTAView';
import { RoomsView } from './components/rooms/RoomsView';
import { MqttBrokerConsole } from './components/mqtt/MqttBrokerConsole';
import { DeveloperPortal } from './components/developer/DeveloperPortal';
import { AdminPanel } from './components/admin/AdminPanel';
import { MobileAppSimulator } from './components/mobile/MobileAppSimulator';
import { Device } from './types';
import { CheckCircle2, Info } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { viewMode, toastMessage } = useIoT();
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [showProvisioning, setShowProvisioning] = useState<boolean>(false);

  const renderConsoleView = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <OverviewDashboard
            onSelectDevice={(dev) => setSelectedDevice(dev)}
            onOpenProvisioning={() => setShowProvisioning(true)}
          />
        );
      case 'devices':
        return (
          <DeviceList
            onSelectDevice={(dev) => setSelectedDevice(dev)}
            onOpenProvisioning={() => setShowProvisioning(true)}
          />
        );
      case 'templates':
        return <TemplatesView />;
      case 'datastreams':
        return <DatastreamsView />;
      case 'dashboard_builder':
        return <DashboardBuilder />;
      case 'automations':
        return <AutomationsView />;
      case 'events':
        return <EventsView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'firmware_ota':
        return <FirmwareOTAView />;
      case 'rooms':
        return <RoomsView />;
      case 'mqtt_broker':
        return <MqttBrokerConsole />;
      case 'developer':
        return <DeveloperPortal />;
      case 'admin':
        return <AdminPanel />;
      default:
        return (
          <OverviewDashboard
            onSelectDevice={(dev) => setSelectedDevice(dev)}
            onOpenProvisioning={() => setShowProvisioning(true)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Toast Notification Notification Pill */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-emerald-500 text-slate-950 font-semibold text-xs shadow-2xl shadow-emerald-500/20 animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Global Navigation Header */}
      <Header />

      {/* Main Workspace based on View Mode (Console, Mobile, or Split) */}
      <div className="flex-1 flex overflow-hidden">
        {/* CONSOLE ONLY MODE */}
        {viewMode === 'console' && (
          <>
            <Sidebar activeTab={activeTab} onSelectTab={setActiveTab} />
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
              {renderConsoleView()}
            </main>
          </>
        )}

        {/* MOBILE SIMULATOR ONLY MODE */}
        {viewMode === 'mobile' && (
          <main className="flex-1 overflow-y-auto p-4 sm:p-8 flex items-center justify-center bg-slate-900/50">
            <MobileAppSimulator onOpenProvisioning={() => setShowProvisioning(true)} />
          </main>
        )}

        {/* SPLIT VIEW (Console + Mobile App Simulator side by side) */}
        {viewMode === 'split' && (
          <>
            <Sidebar activeTab={activeTab} onSelectTab={setActiveTab} />
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
              <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 border-r border-slate-800">
                {renderConsoleView()}
              </main>
              <div className="w-full lg:w-[460px] bg-slate-900/30 overflow-y-auto p-4 sm:p-6 flex items-center justify-center shrink-0">
                <MobileAppSimulator onOpenProvisioning={() => setShowProvisioning(true)} />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Device Detail Inspection Modal */}
      {selectedDevice && (
        <DeviceDetailModal
          device={selectedDevice}
          onClose={() => setSelectedDevice(null)}
        />
      )}

      {/* Device Provisioning Wizard Modal */}
      {showProvisioning && (
        <ProvisioningModal onClose={() => setShowProvisioning(false)} />
      )}
    </div>
  );
};

export default function App() {
  return (
    <IoTProvider>
      <MainAppContent />
    </IoTProvider>
  );
}
