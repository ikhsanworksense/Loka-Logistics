import React, { useState, useEffect, useRef } from 'react';
import Icon from './Icon';
import { ActiveModalType, ColumnConfig, ActiveFilters, SortConfig } from '../types';
import { Shipment, Vehicle } from '../data';

interface ModalsProps {
  activeModal: ActiveModalType;
  onClose: () => void;
  onTabChange: (tab: string) => void;
  // Shared States for real functionality
  shipments: Shipment[];
  setShipments: React.Dispatch<React.SetStateAction<Shipment[]>>;
  activeFilters: ActiveFilters;
  setActiveFilters: (filters: ActiveFilters) => void;
  sortConfig: SortConfig;
  setSortConfig: (sort: SortConfig) => void;
  columnsConfig: ColumnConfig;
  setColumnsConfig: (cols: ColumnConfig) => void;
  activeTab: string;
  // Dynamic Fleet state
  vehicles: Vehicle[];
  setVehicles: React.Dispatch<React.SetStateAction<Vehicle[]>>;
  // Toast notifications trigger
  addToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
}

export default function Modals({
  activeModal,
  onClose,
  onTabChange,
  shipments,
  setShipments,
  activeFilters,
  setActiveFilters,
  sortConfig,
  setSortConfig,
  columnsConfig,
  setColumnsConfig,
  activeTab,
  vehicles,
  setVehicles,
  addToast
}: ModalsProps) {
  if (!activeModal) return null;

  // Search Command Palette State
  const [searchQuery, setSearchQuery] = useState('');
  // Region filter input state
  const [regionSearchQuery, setRegionSearchQuery] = useState('');
  // Export progress
  const [exportProgress, setExportProgress] = useState(0);
  const [exportComplete, setExportComplete] = useState(false);
  // Forms state
  const [newShipment, setNewShipment] = useState({
    routeSource: '',
    routeDest: '',
    service: 'Standard',
    weight: '',
    revenue: '',
    eta: ''
  });
  const [newVehicle, setNewVehicle] = useState({
    plate: '',
    type: 'Van',
    depot: '',
    utilization: '50'
  });
  const [newWidget, setNewWidget] = useState({
    title: '',
    type: 'KPI',
    statLabel: ''
  });
  const [teamEmail, setTeamEmail] = useState('');
  const [teamRole, setTeamRole] = useState('Viewer');
  const [invitedMembers, setInvitedMembers] = useState<{ email: string; role: string; date: string }[]>([
    { email: 'admin@lokalogistics.com', role: 'Admin', date: 'Jul 10, 2026' },
    { email: 'operations@lokalogistics.com', role: 'Manager', date: 'Jul 12, 2026' }
  ]);

  // Temp Filters
  const [tempFilters, setTempFilters] = useState<ActiveFilters>({ ...activeFilters });
  // Temp Sort
  const [tempSort, setTempSort] = useState<SortConfig>({ ...sortConfig });
  // Temp Columns
  const [tempCols, setTempCols] = useState<ColumnConfig>({ ...columnsConfig });

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (activeModal === 'search' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [activeModal]);

  // Reset export progress on load
  useEffect(() => {
    if (activeModal === 'export') {
      setExportProgress(0);
      setExportComplete(false);
      const interval = setInterval(() => {
        setExportProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setExportComplete(true);
            addToast('Data successfully compiled and downloaded as XLSX!', 'success');
            return 100;
          }
          return prev + 10;
        });
      }, 150);
      return () => clearInterval(interval);
    }
  }, [activeModal]);

  const handleSearchNavigate = (tab: string) => {
    onTabChange(tab);
    onClose();
  };

  const handleAddShipment = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `SHP-${Math.floor(10000 + Math.random() * 90000)}`;
    const created: Shipment = {
      id: newId,
      route: `${newShipment.routeSource || 'Jakarta'} → ${newShipment.routeDest || 'Surabaya'}`,
      service: newShipment.service,
      weight: `${newShipment.weight || '12'} kg`,
      revenue: `$${newShipment.revenue || '250.00'}`,
      eta: newShipment.eta || '24 Jul',
      statusClass: 'blue',
      statusText: 'In Transit',
      rating: '5.0',
      selected: false
    };
    setShipments([created, ...shipments]);
    addToast(`Successfully created ${newId}!`, 'success');
    onClose();
  };

  const handleAddVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Vehicle = {
      plate: newVehicle.plate || 'B ' + Math.floor(1000 + Math.random() * 8999) + ' XYZ',
      type: newVehicle.type,
      depot: newVehicle.depot || 'Cakung DC',
      utilization: parseInt(newVehicle.utilization) || 80,
      idle: 12,
      statusClass: 'blue',
      statusText: 'In Service'
    };
    setVehicles([created, ...vehicles]);
    addToast(`Successfully added vehicle ${created.plate}!`, 'success');
    onClose();
  };

  const handleInviteTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamEmail) return;
    const newInvite = {
      email: teamEmail,
      role: teamRole,
      date: 'Today'
    };
    setInvitedMembers([newInvite, ...invitedMembers]);
    addToast(`Access invitation sent to ${teamEmail}`, 'success');
    setTeamEmail('');
  };

  // Keyboard events listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const isFilterModal = activeModal === 'filter';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className={`w-full overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--app)] shadow-2xl transition-all ${
        isFilterModal ? 'max-w-3xl' : 'max-w-lg'
      }`}>
        
        {/* MODAL SEARCH COMMAND PALETTE */}
        {activeModal === 'search' && (
          <div>
            <div className="flex items-center gap-3 border-b border-[var(--line)] px-4 py-3">
              <Icon name="search" className="text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search views, routes, shipments, settings..."
                className="w-full bg-transparent text-sm text-[var(--ink)] outline-hidden"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <span className="rounded-sm border border-[var(--line)] bg-[var(--tag)] px-1.5 py-0.5 text-3xs text-gray-400 font-mono">ESC</span>
            </div>
            <div className="max-h-[320px] overflow-y-auto p-2 text-xs">
              <div className="px-2 py-1.5 text-4xs font-semibold tracking-wider text-gray-400 uppercase">Navigation Views</div>
              {[
                { tab: 'dash', label: 'Dashboard Overview', desc: 'Central KPI metrics and system status' },
                { tab: 'ship', label: 'Shipments Listing', desc: 'Manage in-transit, breached & upcoming shipments' },
                { tab: 'fleet', label: 'Fleet Optimization', desc: 'Vehicle diagnostic stats & depot planning' },
                { tab: 'wh', label: 'Warehouse Capacity', desc: 'Track rack utilization, picking, and turnover' },
                { tab: 'route', label: 'Routes Analysis', desc: 'SLA deviation and empty miles calculation' },
                { tab: 'cost', label: 'Financial Statements', desc: 'Gross margin tracking & logistic spend' },
                { tab: 'cust', label: 'Customers Portfolio', desc: 'Client SLAs & Strategic accounts feedback' },
                { tab: 'proc', label: 'Procurement POs', desc: 'Manage supplier orders & cycle rates' },
              ].filter(item => item.label.toLowerCase().includes(searchQuery.toLowerCase()) || item.desc.toLowerCase().includes(searchQuery.toLowerCase())).map((item) => (
                <button
                  key={item.tab}
                  className="flex w-full items-start gap-3 rounded-lg px-3 py-2 text-left hover:bg-[var(--tag)] transition-all"
                  onClick={() => handleSearchNavigate(item.tab)}
                >
                  <Icon name="chevron-right" className="mt-0.5 text-gray-400" />
                  <div>
                    <div className="font-semibold text-[var(--ink)]">{item.label}</div>
                    <div className="text-3xs text-gray-500">{item.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* SHARE MODAL */}
        {activeModal === 'share' && (
          <div className="p-5">
            <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
              <h3 className="text-sm font-semibold flex items-center gap-2"><Icon name="share-2" /> Share Dashboard Workspace</h3>
              <button onClick={onClose} className="rounded-lg p-1 hover:bg-[var(--tag)]"><Icon name="x" /></button>
            </div>
            <div className="py-4">
              <label className="block text-3xs font-semibold text-gray-400 uppercase mb-2">Workspace Link</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value="https://loka-logistics.dashboard.io/shared/workspace-d4ef"
                  className="flex-1 rounded-lg border border-[var(--line)] bg-[var(--tag)] px-3 py-2 text-xs text-gray-400 font-mono outline-hidden"
                />
                <button
                  className="rounded-lg bg-orange-600 px-3 py-2 text-xs font-semibold text-white hover:bg-orange-700 transition-all"
                  onClick={() => {
                    navigator.clipboard.writeText('https://loka-logistics.dashboard.io/shared/workspace-d4ef');
                    addToast('Share link copied to clipboard!', 'success');
                  }}
                >
                  Copy Link
                </button>
              </div>
              <div className="mt-4">
                <label className="block text-3xs font-semibold text-gray-400 uppercase mb-2">Team Access Permissions</label>
                <div className="rounded-lg border border-[var(--line)] p-3 text-xs flex justify-between items-center bg-[var(--tag)]/30">
                  <div>
                    <div className="font-medium">Anyone with the link</div>
                    <div className="text-3xs text-gray-500">Allows direct visual monitoring of dashboard metrics</div>
                  </div>
                  <select className="bg-transparent border border-[var(--line)] rounded-md py-1 px-2 font-medium">
                    <option>Can View (Read-Only)</option>
                    <option>Can Edit (Interactive)</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 border-t border-[var(--line)] pt-3">
              <button onClick={onClose} className="rounded-lg border border-[var(--line)] px-3 py-2 text-xs font-semibold hover:bg-[var(--tag)]">Done</button>
            </div>
          </div>
        )}

        {/* NOTIFICATIONS FEED */}
        {activeModal === 'notifications' && (
          <div className="p-5">
            <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
              <h3 className="text-sm font-semibold flex items-center gap-2"><Icon name="bell" /> Active Log Alerts & Notifications</h3>
              <button onClick={() => {
                addToast('All notifications marked as read', 'info');
                onClose();
              }} className="text-3xs text-orange-500 hover:underline">Mark all read</button>
            </div>
            <div className="max-h-[300px] overflow-y-auto py-3 space-y-3">
              {[
                { icon: 'thermometer', title: 'Cold-chain excursion, DKI-07', text: 'Temperature reached 9.4°C (Limit: 8°C)', time: '2m ago', type: 'critical' },
                { icon: 'map-pin', title: 'Route Deviation Alert', text: 'Vehicle B 9241 KLX diverged 12km off course', time: '18m ago', type: 'critical' },
                { icon: 'package-x', title: 'Inventory Stockout Impending', text: 'SKU-8842 level below minimal threshold at Cakung', time: '1h ago', type: 'warning' },
                { icon: 'shield-alert', title: 'Unusual Freight Surcharge', text: 'Jakarta-Surabaya transport cost spike of +18%', time: '2h ago', type: 'info' }
              ].map((notif, index) => (
                <div key={index} className="flex gap-3 rounded-lg border border-[var(--line)] p-3 hover:bg-[var(--tag)] transition-all">
                  <div className={`mt-0.5 flex h-6 w-6 items-center justify-center rounded-full ${
                    notif.type === 'critical' ? 'bg-red-500/10 text-red-500' :
                    notif.type === 'warning' ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-500'
                  }`}>
                    <Icon name={notif.icon} />
                  </div>
                  <div className="flex-1 text-xs">
                    <div className="font-semibold">{notif.title}</div>
                    <div className="text-3xs text-gray-500 mt-0.5">{notif.text}</div>
                    <div className="text-4xs text-gray-400 mt-1 font-mono">{notif.time}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end border-t border-[var(--line)] pt-3">
              <button onClick={onClose} className="rounded-lg border border-[var(--line)] px-3 py-2 text-xs font-semibold hover:bg-[var(--tag)]">Close</button>
            </div>
          </div>
        )}

        {/* ADD USER MODAL */}
        {activeModal === 'addUser' && (
          <div className="p-5">
            <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
              <h3 className="text-sm font-semibold flex items-center gap-2"><Icon name="user-plus" /> Team Management & Access</h3>
              <button onClick={onClose} className="rounded-lg p-1 hover:bg-[var(--tag)]"><Icon name="x" /></button>
            </div>
            <form onSubmit={handleInviteTeam} className="py-4 space-y-4">
              <div>
                <label className="block text-3xs font-semibold text-gray-400 uppercase mb-1.5">Email Address</label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    required
                    placeholder="teammate@company.com"
                    value={teamEmail}
                    onChange={(e) => setTeamEmail(e.target.value)}
                    className="flex-1 rounded-lg border border-[var(--line)] bg-[var(--tag)] px-3 py-2 text-xs outline-hidden focus:border-orange-500"
                  />
                  <select
                    value={teamRole}
                    onChange={(e) => setTeamRole(e.target.value)}
                    className="rounded-lg border border-[var(--line)] bg-[var(--tag)] px-2 py-2 text-xs outline-hidden"
                  >
                    <option value="Viewer">Viewer</option>
                    <option value="Manager">Manager</option>
                    <option value="Admin">Admin</option>
                  </select>
                  <button
                    type="submit"
                    className="rounded-lg bg-orange-600 px-4 py-2 text-xs font-semibold text-white hover:bg-orange-700 transition-all"
                  >
                    Invite
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-3xs font-semibold text-gray-400 uppercase mb-2">Authorized Accounts ({invitedMembers.length})</label>
                <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                  {invitedMembers.map((member, i) => (
                    <div key={i} className="flex justify-between items-center rounded-md border border-[var(--line)] p-2 text-xs bg-[var(--tag)]/30">
                      <div>
                        <div className="font-medium text-[var(--ink)]">{member.email}</div>
                        <div className="text-4xs text-gray-400 font-mono">Invited {member.date}</div>
                      </div>
                      <span className="rounded-sm bg-orange-500/10 px-2 py-0.5 text-3xs font-semibold text-orange-500 uppercase">{member.role}</span>
                    </div>
                  ))}
                </div>
              </div>
            </form>
            <div className="flex justify-end gap-2 border-t border-[var(--line)] pt-3">
              <button onClick={onClose} className="rounded-lg border border-[var(--line)] px-3 py-2 text-xs font-semibold hover:bg-[var(--tag)]">Done</button>
            </div>
          </div>
        )}

        {/* CUSTOMIZE GRID MODAL */}
        {activeModal === 'customizeGrid' && (
          <div className="p-5">
            <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
              <h3 className="text-sm font-semibold flex items-center gap-2"><Icon name="layout-grid" /> Configure Dashboard Widgets</h3>
              <button onClick={onClose} className="rounded-lg p-1 hover:bg-[var(--tag)]"><Icon name="x" /></button>
            </div>
            <div className="py-4 space-y-4 text-xs">
              <div>
                <div className="font-semibold mb-2">Display Widgets</div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 rounded-md border border-[var(--line)] p-2 hover:bg-[var(--tag)] cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded border-[var(--line)]" />
                    <span>Real-time Alerts & Escalations Feed</span>
                  </label>
                  <label className="flex items-center gap-2 rounded-md border border-[var(--line)] p-2 hover:bg-[var(--tag)] cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded border-[var(--line)]" />
                    <span>On-Time-Delivery (OTD) Regional Map</span>
                  </label>
                  <label className="flex items-center gap-2 rounded-md border border-[var(--line)] p-2 hover:bg-[var(--tag)] cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded border-[var(--line)]" />
                    <span>Vehicle Utilization Diagnoses</span>
                  </label>
                </div>
              </div>
              <div>
                <div className="font-semibold mb-2">Color Palette Accents</div>
                <div className="grid grid-cols-4 gap-2">
                  {['Orange', 'Indigo', 'Emerald', 'Slate'].map((color) => (
                    <button
                      key={color}
                      onClick={() => addToast(`Accent theme configured to ${color}!`, 'success')}
                      className="rounded-lg border border-[var(--line)] p-2 hover:border-orange-500 text-center font-medium transition-all"
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end border-t border-[var(--line)] pt-3">
              <button onClick={onClose} className="rounded-lg bg-orange-600 px-4 py-2 text-xs font-semibold text-white hover:bg-orange-700">Save Config</button>
            </div>
          </div>
        )}

        {/* ADVANCED FILTERS */}
        {activeModal === 'filter' && (() => {
          const serviceOptions = [
            { key: 'All', label: 'All Services', desc: 'Display all delivery tiers without operational limits', icon: 'layout-grid', colorClass: 'bg-indigo-500/10 text-indigo-600' },
            { key: 'Same-day', label: 'Same-day', desc: 'Express courier flights & direct point-to-point transit', icon: 'zap', colorClass: 'bg-amber-500/10 text-amber-500' },
            { key: 'Next-day', label: 'Next-day', desc: 'Overnight linehaul scheduled priority transit', icon: 'clock', colorClass: 'bg-blue-500/10 text-blue-500' },
            { key: 'Standard', label: 'Standard', desc: 'Standard ground shipping & container logistics', icon: 'truck', colorClass: 'bg-emerald-500/10 text-emerald-500' }
          ];

          const statusOptions = [
            { key: 'All', label: 'All Statuses', icon: 'activity', colorClass: 'text-slate-500 border-slate-200 bg-slate-50' },
            { key: 'In Transit', label: 'In Transit', icon: 'play', colorClass: 'text-blue-600 border-blue-200 bg-blue-50/50' },
            { key: 'At Risk', label: 'At Risk', icon: 'alert-triangle', colorClass: 'text-amber-600 border-amber-200 bg-amber-50/50' },
            { key: 'Breached', label: 'Breached', icon: 'x', colorClass: 'text-red-600 border-red-200 bg-red-50/50' }
          ];

          const regionOptions = [
            { key: 'All', label: 'All Regions' },
            { key: 'Jakarta', label: 'Jakarta Hub' },
            { key: 'Bandung', label: 'Bandung Depot' },
            { key: 'Surabaya', label: 'Surabaya DC' },
            { key: 'Medan', label: 'Medan Gate' },
            { key: 'Semarang', label: 'Semarang Hub' },
            { key: 'Makassar', label: 'Makassar DC' }
          ];

          const getServiceCount = (srv: string) => {
            let list = [...shipments];
            if (srv !== 'All') {
              list = list.filter(s => s.service === srv);
            }
            if (tempFilters.status && tempFilters.status !== 'All') {
              list = list.filter(s => s.statusText === tempFilters.status);
            }
            if (tempFilters.region && tempFilters.region !== 'All') {
              list = list.filter(s => s.route.toLowerCase().includes(tempFilters.region.toLowerCase()));
            }
            return list.length;
          };

          const getStatusCount = (st: string) => {
            let list = [...shipments];
            if (tempFilters.service && tempFilters.service !== 'All') {
              list = list.filter(s => s.service === tempFilters.service);
            }
            if (st !== 'All') {
              list = list.filter(s => s.statusText === st);
            }
            if (tempFilters.region && tempFilters.region !== 'All') {
              list = list.filter(s => s.route.toLowerCase().includes(tempFilters.region.toLowerCase()));
            }
            return list.length;
          };

          const getRegionCount = (reg: string) => {
            let list = [...shipments];
            if (tempFilters.service && tempFilters.service !== 'All') {
              list = list.filter(s => s.service === tempFilters.service);
            }
            if (tempFilters.status && tempFilters.status !== 'All') {
              list = list.filter(s => s.statusText === tempFilters.status);
            }
            if (reg !== 'All') {
              list = list.filter(s => s.route.toLowerCase().includes(reg.toLowerCase()));
            }
            return list.length;
          };

          // Calculate overall matching count
          let list = [...shipments];
          if (tempFilters.service && tempFilters.service !== 'All') {
            list = list.filter(s => s.service === tempFilters.service);
          }
          if (tempFilters.status && tempFilters.status !== 'All') {
            list = list.filter(s => s.statusText === tempFilters.status);
          }
          if (tempFilters.region && tempFilters.region !== 'All') {
            list = list.filter(s => s.route.toLowerCase().includes(tempFilters.region.toLowerCase()));
          }
          const matchedCount = list.length;

          const isFiltered = tempFilters.service !== 'All' || tempFilters.status !== 'All' || tempFilters.region !== 'All';

          const filteredRegions = regionOptions.filter(r => 
            r.label.toLowerCase().includes(regionSearchQuery.toLowerCase()) || 
            r.key.toLowerCase().includes(regionSearchQuery.toLowerCase())
          );

          return (
            <div className="flex h-[540px] bg-white overflow-hidden text-slate-800">
              {/* Left Pane (Summary & Status Meter) */}
              <div className="w-72 bg-slate-50 border-r border-slate-100 p-6 flex flex-col justify-between shrink-0">
                <div className="space-y-5">
                  <div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 text-orange-700 px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-widest mb-2">
                      Live Query Engine
                    </span>
                    <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                      Operational Filters
                    </h3>
                    <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                      Configure constraints to slice the logistics grid in real-time.
                    </p>
                  </div>

                  {/* Circular Matching Meter */}
                  <div className="relative flex items-center justify-center h-28 w-28 mx-auto my-3">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-slate-100"
                        strokeWidth="3"
                        stroke="currentColor"
                        fill="transparent"
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-orange-500 transition-all duration-500 ease-out"
                        strokeDasharray={`${Math.round((matchedCount / (shipments.length || 1)) * 100)}, 100`}
                        strokeWidth="3"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-lg font-extrabold text-slate-800 font-mono leading-none">
                        {matchedCount} / {shipments.length}
                      </span>
                      <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider mt-1">Matched</span>
                    </div>
                  </div>

                  {/* Active Filter Recipe List */}
                  <div className="space-y-2 border-t border-slate-100 pt-4">
                    <span className="text-[9px] font-bold uppercase text-slate-400 tracking-wider block">Current Constraints</span>
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-[10px] bg-white border border-slate-100 rounded-lg p-2 shadow-2xs">
                        <span className="text-slate-400">Service:</span>
                        <span className="font-bold text-slate-700">{tempFilters.service === 'All' ? 'All Services' : tempFilters.service}</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] bg-white border border-slate-100 rounded-lg p-2 shadow-2xs">
                        <span className="text-slate-400">Status:</span>
                        <span className={`font-bold px-1.5 py-0.5 rounded-sm text-[9px] ${
                          tempFilters.status === 'All' ? 'text-slate-700 bg-slate-50' :
                          tempFilters.status === 'In Transit' ? 'bg-blue-50 text-blue-700' :
                          tempFilters.status === 'At Risk' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'
                        }`}>{tempFilters.status}</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] bg-white border border-slate-100 rounded-lg p-2 shadow-2xs">
                        <span className="text-slate-400">Hub DC:</span>
                        <span className="font-bold text-slate-700 truncate max-w-[120px]">{tempFilters.region === 'All' ? 'All Regions' : tempFilters.region}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reset button at bottom of sidebar */}
                <button
                  type="button"
                  disabled={!isFiltered}
                  onClick={() => {
                    setTempFilters({ region: 'All', status: 'All', service: 'All' });
                    setRegionSearchQuery('');
                  }}
                  className={`w-full flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-[11px] font-bold border transition-all ${
                    isFiltered 
                      ? 'border-orange-500/20 text-orange-600 bg-white hover:bg-orange-50/50 shadow-sm' 
                      : 'border-slate-100 text-slate-300 bg-transparent cursor-not-allowed'
                  }`}
                >
                  <Icon name="rotate-cw" size={11} />
                  <span>Reset All Settings</span>
                </button>
              </div>

              {/* Right Pane (Scrollable controls) */}
              <div className="flex-1 flex flex-col min-w-0 bg-white">
                {/* Header */}
                <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between bg-white shrink-0">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Configure Dimensions</h4>
                  <button 
                    onClick={onClose} 
                    className="rounded-xl border border-slate-100 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all"
                  >
                    <Icon name="x" size={14} />
                  </button>
                </div>

                {/* Main Scrollable Form */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
                  
                  {/* 1. SERVICE TIER */}
                  <div className="space-y-2.5">
                    <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                      <Icon name="truck" size={12} className="text-orange-500" />
                      1. Service Tier Delivery SLA
                    </label>
                    <div className="space-y-2">
                      {serviceOptions.map((opt) => {
                        const isActive = tempFilters.service === opt.key;
                        const count = getServiceCount(opt.key);
                        return (
                          <button
                            key={opt.key}
                            type="button"
                            onClick={() => setTempFilters({ ...tempFilters, service: opt.key })}
                            className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                              isActive 
                                ? 'border-orange-500 bg-orange-500/[0.02] ring-1 ring-orange-500/15 shadow-2xs' 
                                : 'border-slate-200/80 bg-white hover:border-slate-300 hover:bg-slate-50/30'
                            }`}
                          >
                            <div className="flex items-center gap-3.5 min-w-0">
                              <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all ${
                                isActive ? 'bg-orange-500 text-white' : opt.colorClass
                              }`}>
                                <Icon name={opt.icon} size={13} />
                              </span>
                              <div className="min-w-0">
                                <div className="font-bold text-slate-800 text-xs">{opt.label}</div>
                                <div className="text-[10px] text-slate-400 truncate max-w-[280px] mt-0.5">{opt.desc}</div>
                              </div>
                            </div>
                            <span className={`text-[10px] px-2 py-0.5 rounded-md font-mono font-bold ${
                              isActive ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-500'
                            }`}>
                              {count}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 2. SHIPMENT STATUS */}
                  <div className="space-y-2.5 pt-2">
                    <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                      <Icon name="activity" size={12} className="text-orange-500" />
                      2. Shipment Exception Status
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {statusOptions.map((opt) => {
                        const isActive = tempFilters.status === opt.key;
                        const count = getStatusCount(opt.key);
                        return (
                          <button
                            key={opt.key}
                            type="button"
                            onClick={() => setTempFilters({ ...tempFilters, status: opt.key })}
                            className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                              isActive 
                                ? 'border-orange-500 bg-orange-500/[0.02] ring-1 ring-orange-500/15 shadow-2xs' 
                                : 'border-slate-200/80 bg-white hover:border-slate-300 hover:bg-slate-50/30'
                            }`}
                          >
                            <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all ${
                              isActive ? 'bg-orange-500 text-white shadow-3xs' : opt.colorClass.split(' ')[2] + ' bg-slate-50'
                            }`}>
                              <Icon name={opt.icon} size={12} />
                            </span>
                            <div className="flex-1 min-w-0 flex items-center justify-between">
                              <span className="font-bold text-slate-700 text-xs tracking-tight truncate">{opt.label}</span>
                              <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                                isActive ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-400'
                              }`}>
                                {count}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 3. REGION HUB ISOLATION */}
                  <div className="space-y-2.5 pt-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                        <Icon name="map-pin" size={12} className="text-orange-500" />
                        3. Region Hub Isolation
                      </label>
                    </div>

                    {/* Compact Search Wrapper */}
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                        <Icon name="search" size={12} />
                      </span>
                      <input
                        type="text"
                        placeholder="Search available hub networks..."
                        value={regionSearchQuery}
                        onChange={(e) => setRegionSearchQuery(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-8 text-xs text-slate-700 placeholder-slate-400 focus:border-orange-500 focus:bg-white focus:outline-hidden transition-all"
                      />
                      {regionSearchQuery && (
                        <button
                          type="button"
                          onClick={() => setRegionSearchQuery('')}
                          className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                        >
                          <Icon name="x" size={12} />
                        </button>
                      )}
                    </div>

                    {/* Tag Cloud */}
                    <div className="flex flex-wrap gap-2">
                      {filteredRegions.map((opt) => {
                        const isActive = tempFilters.region === opt.key;
                        const count = getRegionCount(opt.key);
                        return (
                          <button
                            key={opt.key}
                            type="button"
                            onClick={() => setTempFilters({ ...tempFilters, region: opt.key })}
                            className={`inline-flex items-center gap-2 rounded-xl px-3 py-1.5 border text-xs font-bold transition-all ${
                              isActive 
                                ? 'border-orange-500 bg-orange-500/10 text-orange-600 shadow-2xs' 
                                : 'border-slate-200/80 bg-slate-50/50 hover:bg-slate-100 text-slate-600'
                            }`}
                          >
                            {opt.key !== 'All' ? (
                              <Icon name="map-pin" size={11} className={isActive ? 'text-orange-600' : 'text-slate-400'} />
                            ) : (
                              <Icon name="globe" size={11} className={isActive ? 'text-orange-600' : 'text-slate-400'} />
                            )}
                            <span>{opt.label}</span>
                            <span className={`text-[9px] font-mono font-bold px-1 rounded-sm ${
                              isActive ? 'bg-orange-200 text-orange-800' : 'bg-slate-200/60 text-slate-500'
                            }`}>
                              {count}
                            </span>
                          </button>
                        );
                      })}
                      {filteredRegions.length === 0 && (
                        <p className="text-[10px] text-slate-400 py-1 italic">No hub routes matched your query.</p>
                      )}
                    </div>
                  </div>

                </div>

                {/* Footer Controls */}
                <div className="border-t border-slate-100 p-5 bg-slate-50/50 flex justify-end gap-2.5 shrink-0">
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-extrabold text-slate-500 hover:bg-slate-50 transition-all shadow-3xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveFilters(tempFilters);
                      addToast('Filters successfully compiled and applied!', 'info');
                      onClose();
                    }}
                    className="rounded-xl bg-orange-600 px-5 py-2 text-xs font-extrabold text-white hover:bg-orange-700 transition-all shadow-md shadow-orange-600/10 flex items-center gap-2"
                  >
                    <span>Execute Filter</span>
                    <span className="bg-orange-500/30 rounded-md px-1.5 py-0.5 text-[9px] font-mono font-bold text-orange-100 min-w-[20px] text-center">
                      {matchedCount}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

        {/* SORT CONFIGURATION */}
        {activeModal === 'sort' && (
          <div className="p-5">
            <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
              <h3 className="text-sm font-semibold flex items-center gap-2"><Icon name="arrow-up-narrow-wide" /> Sort Configuration</h3>
              <button onClick={onClose} className="rounded-lg p-1 hover:bg-[var(--tag)]"><Icon name="x" /></button>
            </div>
            <div className="py-4 space-y-4 text-xs">
              <div>
                <label className="block text-3xs font-semibold text-gray-400 uppercase mb-1.5">Primary Sort Key</label>
                <select
                  value={tempSort.key}
                  onChange={(e) => setTempSort({ ...tempSort, key: e.target.value })}
                  className="w-full rounded-lg border border-[var(--line)] bg-[var(--tag)] px-3 py-2"
                >
                  <option value="revenue">Revenue Value</option>
                  <option value="weight">Cargo Weight</option>
                  <option value="id">Shipment ID</option>
                </select>
              </div>
              <div>
                <label className="block text-3xs font-semibold text-gray-400 uppercase mb-1.5">Direction</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setTempSort({ ...tempSort, direction: 'asc' })}
                    className={`flex-1 rounded-lg border p-2 text-center font-medium ${tempSort.direction === 'asc' ? 'border-orange-500 bg-orange-500/5 text-orange-500' : 'border-[var(--line)] hover:bg-[var(--tag)]'}`}
                  >
                    Ascending (A → Z, Low → High)
                  </button>
                  <button
                    onClick={() => setTempSort({ ...tempSort, direction: 'desc' })}
                    className={`flex-1 rounded-lg border p-2 text-center font-medium ${tempSort.direction === 'desc' ? 'border-orange-500 bg-orange-500/5 text-orange-500' : 'border-[var(--line)] hover:bg-[var(--tag)]'}`}
                  >
                    Descending (Z → A, High → Low)
                  </button>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 border-t border-[var(--line)] pt-3">
              <button
                onClick={() => {
                  setSortConfig(tempSort);
                  addToast(`Table sorted by ${tempSort.key} (${tempSort.direction})`, 'info');
                  onClose();
                }}
                className="rounded-lg bg-orange-600 px-4 py-2 text-xs font-semibold text-white hover:bg-orange-700"
              >
                Sort Now
              </button>
            </div>
          </div>
        )}

        {/* CUSTOMIZE COLUMNS */}
        {activeModal === 'customizeColumns' && (
          <div className="p-5">
            <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
              <h3 className="text-sm font-semibold flex items-center gap-2"><Icon name="table-properties" /> Customize Columns Visibility</h3>
              <button onClick={onClose} className="rounded-lg p-1 hover:bg-[var(--tag)]"><Icon name="x" /></button>
            </div>
            <div className="py-4 space-y-2 text-xs">
              {(Object.keys(tempCols) as Array<keyof ColumnConfig>).map((key) => (
                <label key={key} className="flex items-center gap-3 rounded-md border border-[var(--line)] p-2 hover:bg-[var(--tag)] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tempCols[key]}
                    onChange={(e) => setTempCols({ ...tempCols, [key]: e.target.checked })}
                    className="rounded border-[var(--line)] text-orange-600 focus:ring-orange-500"
                  />
                  <span className="capitalize">{key}</span>
                </label>
              ))}
            </div>
            <div className="flex justify-end gap-2 border-t border-[var(--line)] pt-3">
              <button
                onClick={() => {
                  setColumnsConfig(tempCols);
                  addToast('Columns configuration saved successfully!', 'success');
                  onClose();
                }}
                className="rounded-lg bg-orange-600 px-4 py-2 text-xs font-semibold text-white hover:bg-orange-700"
              >
                Save
              </button>
            </div>
          </div>
        )}

        {/* EXPORT DATA WITH LOADING PROGRESS */}
        {activeModal === 'export' && (
          <div className="p-5 text-center">
            <div className="flex items-center justify-between border-b border-[var(--line)] pb-3 text-left">
              <h3 className="text-sm font-semibold flex items-center gap-2"><Icon name="download" /> Export Data</h3>
              <button onClick={onClose} className="rounded-lg p-1 hover:bg-[var(--tag)]"><Icon name="x" /></button>
            </div>
            <div className="py-8 space-y-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-500/10 text-orange-500">
                <Icon name={exportComplete ? "check" : "refresh-cw"} className={exportComplete ? "" : "animate-spin"} />
              </div>
              <div>
                <h4 className="font-semibold text-sm">{exportComplete ? "Export Compilation Finished!" : "Compiling Dataset..."}</h4>
                <p className="text-3xs text-gray-500 mt-1">Generating high-fidelity CSV and XLSX format log files.</p>
              </div>
              <div className="w-full rounded-full bg-[var(--line)] h-2 overflow-hidden">
                <div
                  className="bg-orange-500 h-full transition-all duration-150"
                  style={{ width: `${exportProgress}%` }}
                />
              </div>
              <div className="text-4xs text-gray-400 font-mono">{exportProgress}% Completed</div>
            </div>
            <div className="flex justify-end border-t border-[var(--line)] pt-3">
              <button onClick={onClose} className="rounded-lg border border-[var(--line)] px-3 py-2 text-xs font-semibold hover:bg-[var(--tag)]">Close</button>
            </div>
          </div>
        )}

        {/* DYNAMIC CONTEXTUAL "ADD NEW" ACTION */}
        {activeModal === 'addNew' && (
          <div className="p-5">
            <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Icon name="plus" /> 
                {activeTab === 'ship' && "Add New Cargo Shipment"}
                {activeTab === 'fleet' && "Register New Vehicle Asset"}
                {activeTab === 'dash' && "Register New Dashboard Widget"}
                {activeTab !== 'ship' && activeTab !== 'fleet' && activeTab !== 'dash' && "Create Content Entry"}
              </h3>
              <button onClick={onClose} className="rounded-lg p-1 hover:bg-[var(--tag)]"><Icon name="x" /></button>
            </div>

            {/* View specific: ADD SHIPMENT FORM */}
            {activeTab === 'ship' && (
              <form onSubmit={handleAddShipment} className="py-4 space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-4xs font-semibold text-gray-400 uppercase mb-1">Route Source</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Jakarta"
                      value={newShipment.routeSource}
                      onChange={(e) => setNewShipment({ ...newShipment, routeSource: e.target.value })}
                      className="w-full rounded-lg border border-[var(--line)] bg-[var(--tag)] px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-4xs font-semibold text-gray-400 uppercase mb-1">Route Destination</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Surabaya"
                      value={newShipment.routeDest}
                      onChange={(e) => setNewShipment({ ...newShipment, routeDest: e.target.value })}
                      className="w-full rounded-lg border border-[var(--line)] bg-[var(--tag)] px-3 py-2"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-4xs font-semibold text-gray-400 uppercase mb-1">Service Type</label>
                    <select
                      value={newShipment.service}
                      onChange={(e) => setNewShipment({ ...newShipment, service: e.target.value })}
                      className="w-full rounded-lg border border-[var(--line)] bg-[var(--tag)] px-3 py-2"
                    >
                      <option value="Same-day">Same-day</option>
                      <option value="Next-day">Next-day</option>
                      <option value="Standard">Standard</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-4xs font-semibold text-gray-400 uppercase mb-1">Cargo Weight (kg)</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 14.5"
                      value={newShipment.weight}
                      onChange={(e) => setNewShipment({ ...newShipment, weight: e.target.value })}
                      className="w-full rounded-lg border border-[var(--line)] bg-[var(--tag)] px-3 py-2"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-4xs font-semibold text-gray-400 uppercase mb-1">Estimated Revenue ($)</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 850"
                      value={newShipment.revenue}
                      onChange={(e) => setNewShipment({ ...newShipment, revenue: e.target.value })}
                      className="w-full rounded-lg border border-[var(--line)] bg-[var(--tag)] px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-4xs font-semibold text-gray-400 uppercase mb-1">ETA Date</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 19 Jul"
                      value={newShipment.eta}
                      onChange={(e) => setNewShipment({ ...newShipment, eta: e.target.value })}
                      className="w-full rounded-lg border border-[var(--line)] bg-[var(--tag)] px-3 py-2"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 border-t border-[var(--line)] pt-3">
                  <button type="submit" className="rounded-lg bg-orange-600 px-4 py-2 text-xs font-semibold text-white hover:bg-orange-700">Add Shipment</button>
                </div>
              </form>
            )}

            {/* View specific: REGISTER VEHICLE FORM */}
            {activeTab === 'fleet' && (
              <form onSubmit={handleAddVehicle} className="py-4 space-y-3 text-xs">
                <div>
                  <label className="block text-4xs font-semibold text-gray-400 uppercase mb-1">License Plate Number</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. B 1234 SBY"
                    value={newVehicle.plate}
                    onChange={(e) => setNewVehicle({ ...newVehicle, plate: e.target.value })}
                    className="w-full rounded-lg border border-[var(--line)] bg-[var(--tag)] px-3 py-2"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-4xs font-semibold text-gray-400 uppercase mb-1">Vehicle Classification</label>
                    <select
                      value={newVehicle.type}
                      onChange={(e) => setNewVehicle({ ...newVehicle, type: e.target.value })}
                      className="w-full rounded-lg border border-[var(--line)] bg-[var(--tag)] px-3 py-2"
                    >
                      <option value="Van">Van Delivery</option>
                      <option value="CDD">CDD Truck</option>
                      <option value="Fuso">Fuso Cargo</option>
                      <option value="Box Truck">Box Truck</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-4xs font-semibold text-gray-400 uppercase mb-1">Depot / Hub Assignment</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Cakung DC"
                      value={newVehicle.depot}
                      onChange={(e) => setNewVehicle({ ...newVehicle, depot: e.target.value })}
                      className="w-full rounded-lg border border-[var(--line)] bg-[var(--tag)] px-3 py-2"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-4xs font-semibold text-gray-400 uppercase mb-1">Initial Capacity Utilization (%)</label>
                  <input
                    type="number"
                    max="100"
                    placeholder="e.g. 75"
                    value={newVehicle.utilization}
                    onChange={(e) => setNewVehicle({ ...newVehicle, utilization: e.target.value })}
                    className="w-full rounded-lg border border-[var(--line)] bg-[var(--tag)] px-3 py-2"
                  />
                </div>
                <div className="flex justify-end gap-2 border-t border-[var(--line)] pt-3">
                  <button type="submit" className="rounded-lg bg-orange-600 px-4 py-2 text-xs font-semibold text-white hover:bg-orange-700">Add Vehicle</button>
                </div>
              </form>
            )}

            {/* Fallback View Modal Form */}
            {activeTab !== 'ship' && activeTab !== 'fleet' && (
              <div className="py-8 text-center text-xs text-gray-400">
                <Icon name="info" className="mx-auto mb-2 text-orange-500" />
                <p>Register records dynamically. This action is optimized for the **Shipments** and **Fleet** view structures.</p>
                <button onClick={onClose} className="mt-4 rounded-lg border border-[var(--line)] px-3 py-1.5 font-semibold text-[var(--ink)] hover:bg-[var(--tag)]">Close</button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
