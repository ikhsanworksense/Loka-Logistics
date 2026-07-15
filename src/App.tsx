import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Toolbar from './components/Toolbar';
import StatsGrid from './components/StatsGrid';
import Modals from './components/Modals';
import Icon from './components/Icon';

// Shared state sources
import { SHIPMENTS, FLEET_VEHICLES, Shipment, Vehicle } from './data';
import { ActiveModalType, ColumnConfig, ActiveFilters, SortConfig } from './types';

// Views
import DashboardView from './components/views/DashboardView';
import ShipmentsView from './components/views/ShipmentsView';
import FleetView from './components/views/FleetView';
import WarehouseView from './components/views/WarehouseView';
import RoutesView from './components/views/RoutesView';
import FinanceView from './components/views/FinanceView';
import CustomersView from './components/views/CustomersView';
import ProcurementView from './components/views/ProcurementView';
import ForecastingView from './components/views/ForecastingView';
import AlertsView from './components/views/AlertsView';
import ReportsView from './components/views/ReportsView';
import GovernanceView from './components/views/GovernanceView';

const meta: Record<string, [string, string]> = {
  dash: ['Dashboard', 'Add Widget'],
  ship: ['Shipments', 'Add Shipment'],
  fleet: ['Fleet', 'Add Vehicle'],
  wh: ['Warehouse', 'Add SKU'],
  route: ['Routes', 'Add Lane'],
  cost: ['Finance', 'Add Entry'],
  cust: ['Customers', 'Add Customer'],
  proc: ['Procurement', 'Add PO'],
  forecast: ['Forecasting', 'New Model'],
  alerts: ['Alerts', 'New Rule'],
  reports: ['Reports', 'New Report'],
  admin: ['Governance', 'Add User']
};

const PRESETS: Record<string, { label: string; icon: string; desc: string; columns: ColumnConfig }> = {
  standard: {
    label: 'Standard List',
    icon: 'table',
    desc: 'Show standard tracking columns',
    columns: { shipment: true, service: true, weight: true, revenue: true, eta: true, status: true, sla: true }
  },
  compact: {
    label: 'Compact Grid',
    icon: 'layout-grid',
    desc: 'Minimize columns and hide ETA/SLA',
    columns: { shipment: true, service: false, weight: true, revenue: true, eta: false, status: true, sla: false }
  },
  financial: {
    label: 'Financial Breakdown',
    icon: 'wallet',
    desc: 'Focus strictly on revenue metrics',
    columns: { shipment: true, service: false, weight: false, revenue: true, eta: false, status: true, sla: false }
  },
  operations: {
    label: 'Operations Checklist',
    icon: 'truck',
    desc: 'Display service tiers, weights & ETA',
    columns: { shipment: true, service: true, weight: true, revenue: false, eta: true, status: true, sla: false }
  }
};

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dash');
  const [showStats, setShowStats] = useState<boolean>(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  // Live Shared Data State
  const [shipments, setShipments] = useState<Shipment[]>(SHIPMENTS);
  const [vehicles, setVehicles] = useState<Vehicle[]>(FLEET_VEHICLES);

  // Modal Interactive States
  const [activeModal, setActiveModal] = useState<ActiveModalType>(null);
  
  // Table Filters state
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    region: 'All',
    status: 'All',
    service: 'All'
  });

  // Table Sorting state
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: 'revenue',
    direction: 'desc'
  });

  // Table Columns Visibility state
  const [columnsConfig, setColumnsConfig] = useState<ColumnConfig>({
    shipment: true,
    service: true,
    weight: true,
    revenue: true,
    eta: true,
    status: true,
    sla: true
  });

  const [currentPreset, setCurrentPreset] = useState<string>('standard');

  // Custom live feedback Toast Notifications
  const [toasts, setToasts] = useState<{ id: string; message: string; type: 'success' | 'info' | 'warning' }[]>([]);

  const addToast = (message: string, type: 'success' | 'info' | 'warning' = 'info') => {
    const id = Math.random().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const applyPreset = (presetKey: string) => {
    if (PRESETS[presetKey]) {
      setCurrentPreset(presetKey);
      setColumnsConfig(PRESETS[presetKey].columns);
      addToast(`Switched view to ${PRESETS[presetKey].label}`, 'success');
    }
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Keyboard Command Palette Shortcut (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setActiveModal('search');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setIsSidebarOpen(false); // Close sidebar on mobile after clicking
  };

  const handleToggleStats = () => {
    setShowStats(!showStats);
  };

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleToggleCollapse = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // Render correct active view component
  const renderActiveView = () => {
    switch (activeTab) {
      case 'dash':
        return <DashboardView />;
      case 'ship':
        return (
          <ShipmentsView
            shipments={shipments}
            setShipments={setShipments}
            activeFilters={activeFilters}
            sortConfig={sortConfig}
            columnsConfig={columnsConfig}
            onAddColumnClick={() => setActiveModal('customizeColumns')}
          />
        );
      case 'fleet':
        return <FleetView vehicles={vehicles} />;
      case 'wh':
        return <WarehouseView />;
      case 'route':
        return <RoutesView />;
      case 'cost':
        return <FinanceView />;
      case 'cust':
        return <CustomersView />;
      case 'proc':
        return <ProcurementView />;
      case 'forecast':
        return <ForecastingView />;
      case 'alerts':
        return <AlertsView />;
      case 'reports':
        return <ReportsView />;
      case 'admin':
        return <GovernanceView />;
      default:
        return <DashboardView />;
    }
  };

  const [title, addButtonLabel] = meta[activeTab] || ['Dashboard', 'Add New'];

  return (
    <div className="frame">
      <div className={`app ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        {/* Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          isOpen={isSidebarOpen}
          onToggleOpen={handleToggleSidebar}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={handleToggleCollapse}
          onSearchClick={() => setActiveModal('search')}
        />

        {/* Main Workspace */}
        <main className="main">
          {/* Frozen/Sticky Top Bar */}
          <div className="main-topbar">
            {/* Header controls & user status */}
            <Header
              activeTab={activeTab}
              onMenuToggle={handleToggleSidebar}
              title={title}
              onShareClick={() => setActiveModal('share')}
              onNotificationsClick={() => setActiveModal('notifications')}
              onAddUserClick={() => setActiveModal('addUser')}
              onCustomizeClick={() => setActiveModal('customizeGrid')}
            />

            {/* Table presets, query sorting, stats visibility controller */}
            <Toolbar
              showStats={showStats}
              onToggleStats={handleToggleStats}
              addButtonLabel={addButtonLabel}
              onFilterClick={() => setActiveModal('filter')}
              onSortClick={() => setActiveModal('sort')}
              currentPreset={currentPreset}
              onPresetSelect={applyPreset}
              onCustomizeColumnsClick={() => setActiveModal('customizeColumns')}
              onExportClick={() => setActiveModal('export')}
              onAddNewClick={() => setActiveModal('addNew')}
            />
          </div>

          {/* Scrollable Container */}
          <div className="main-scrollable">
            {/* Quick Metrics KPI cards synced with active page */}
            <StatsGrid activeTab={activeTab} showStats={showStats} />

            {/* Main workspace view loader */}
            <div className="workspace-content">
              {renderActiveView()}
            </div>
          </div>
        </main>
      </div>

      {/* Interactive Workspace Modals Provider */}
      {activeModal && (
        <Modals
          activeModal={activeModal}
          onClose={() => setActiveModal(null)}
          onTabChange={handleTabChange}
          shipments={shipments}
          setShipments={setShipments}
          activeFilters={activeFilters}
          setActiveFilters={setActiveFilters}
          sortConfig={sortConfig}
          setSortConfig={setSortConfig}
          columnsConfig={columnsConfig}
          setColumnsConfig={setColumnsConfig}
          activeTab={activeTab}
          vehicles={vehicles}
          setVehicles={setVehicles}
          addToast={addToast}
        />
      )}

      {/* Floating Alert Toasts Notifications System */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-center justify-between gap-3 rounded-lg border border-[var(--line)] bg-[var(--app)] px-4 py-3 shadow-xl animate-fade-in"
            style={{ width: '280px' }}
          >
            <div className="flex items-center gap-2.5">
              <span className={`flex h-5 w-5 items-center justify-center rounded-full ${
                toast.type === 'success' ? 'bg-emerald-500/10 text-emerald-500' :
                toast.type === 'warning' ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-500'
              }`}>
                <Icon name={
                  toast.type === 'success' ? 'check' :
                  toast.type === 'warning' ? 'alert-triangle' : 'info'
                } size={13} />
              </span>
              <span className="text-xs font-semibold text-[var(--ink)]">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-[var(--ink)] cursor-pointer"
            >
              <Icon name="x" size={12} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
