export interface StatItem {
  label: string;
  value: string;
  delta: string;
  dir: 'up' | 'down';
}

export const STATS: Record<string, StatItem[]> = {
  dash: [
    { label: 'Total Shipments', value: '48,320', delta: '6%', dir: 'up' },
    { label: 'Revenue', value: '$1.86M', delta: '9%', dir: 'up' },
    { label: 'On-Time Delivery', value: '91.2%', delta: '2%', dir: 'up' },
    { label: 'Active Exceptions', value: '14', delta: '3', dir: 'down' }
  ],
  ship: [
    { label: 'Total Shipments', value: '48,320', delta: '6%', dir: 'up' },
    { label: 'In Transit', value: '8,412', delta: '4%', dir: 'up' },
    { label: 'Delivered', value: '47,610', delta: '7%', dir: 'up' },
    { label: 'Failed', value: '2.4%', delta: '0.3%', dir: 'up' }
  ],
  fleet: [
    { label: 'Utilization', value: '74.6%', delta: '4%', dir: 'up' },
    { label: 'Downtime', value: '6.8%', delta: '1.1%', dir: 'up' },
    { label: 'Fuel Cost/KM', value: '$0.12', delta: '2.3%', dir: 'down' },
    { label: 'Load Factor', value: '81.2%', delta: '3.5%', dir: 'up' }
  ],
  wh: [
    { label: 'Inventory Turnover', value: '8.4x', delta: '0.6', dir: 'up' },
    { label: 'Stock Accuracy', value: '98.7%', delta: '0.4%', dir: 'up' },
    { label: 'Picking / hr', value: '142', delta: '9', dir: 'up' },
    { label: 'Stockout', value: '1.9%', delta: '0.5%', dir: 'down' }
  ],
  route: [
    { label: 'Cost / KM', value: '$0.86', delta: '4.1%', dir: 'up' },
    { label: 'Route Adherence', value: '94.6%', delta: '1.9%', dir: 'up' },
    { label: 'Empty Miles', value: '8.7%', delta: '0.9%', dir: 'up' },
    { label: 'Stops / Route', value: '13.2', delta: '0.5%', dir: 'up' }
  ],
  cost: [
    { label: 'Logistics Cost', value: '17.6%', delta: '0.8%', dir: 'up' },
    { label: 'Cost / Shipment', value: '$2.56', delta: '3.2%', dir: 'up' },
    { label: 'Gross Margin', value: '23.8%', delta: '0.9%', dir: 'down' },
    { label: 'Budget Variance', value: '-1.8%', delta: 'better', dir: 'up' }
  ],
  cust: [
    { label: 'SLA Compliance', value: '93.4%', delta: '1.6%', dir: 'up' },
    { label: 'NPS', value: '49', delta: '4', dir: 'up' },
    { label: 'Complaint Rate', value: '0.9%', delta: '0.2%', dir: 'up' },
    { label: 'Retention', value: '92.1%', delta: '1.3%', dir: 'up' }
  ],
  proc: [
    { label: 'Supplier OT', value: '92.6%', delta: '1.1%', dir: 'up' },
    { label: 'PO Cycle', value: '2.8d', delta: '0.6', dir: 'up' },
    { label: 'Defect Rate', value: '0.7%', delta: '0.1%', dir: 'up' },
    { label: 'Spend', value: '$12.4M', delta: '3.2%', dir: 'up' }
  ],
  forecast: [
    { label: 'Forecast Accuracy', value: '88.4%', delta: '2.7%', dir: 'up' },
    { label: 'Delay Risk High', value: '6.2%', delta: '0.8%', dir: 'up' },
    { label: 'Maint. Risk', value: '11', delta: '3', dir: 'up' },
    { label: 'Demand Lift', value: '+7.1%', delta: 'up', dir: 'up' }
  ],
  alerts: [
    { label: 'Open Alerts', value: '14', delta: '3', dir: 'down' },
    { label: 'Critical', value: '3', delta: '1', dir: 'down' },
    { label: 'Acknowledged', value: '9', delta: '2', dir: 'up' },
    { label: 'Avg Resolution', value: '2.1h', delta: '22m', dir: 'up' }
  ],
  reports: [
    { label: 'Saved Reports', value: '18', delta: '2', dir: 'up' },
    { label: 'Scheduled', value: '42', delta: '5', dir: 'up' },
    { label: 'Exports Today', value: '29', delta: '11', dir: 'up' },
    { label: 'Shared Views', value: '13', delta: '3', dir: 'up' }
  ],
  admin: [
    { label: 'Data Quality', value: '96.4%', delta: '1.2%', dir: 'up' },
    { label: 'Fresh Sources', value: '7/8', delta: 'ok', dir: 'up' },
    { label: 'Audit Events', value: '14,382', delta: '12%', dir: 'up' },
    { label: 'Active Users', value: '186', delta: '14', dir: 'up' }
  ]
};

export interface DashboardAlert {
  icon: string;
  className: string;
  title: string;
  meta: string;
  time: string;
}

export const DASH_ALERTS: DashboardAlert[] = [
  { icon: 'thermometer', className: 'a-red', title: 'Cold-chain excursion, DKI-07', meta: 'Suhu 9.4C > batas 8C', time: '2 mnt' },
  { icon: 'map-pin-off', className: 'a-red', title: 'Off-route, B 9241 KLX', meta: 'Deviasi 12 km', time: '18 mnt' },
  { icon: 'timer', className: 'a-amber', title: 'SLA breach imminent, 6 order', meta: 'Same-day Surabaya', time: '31 mnt' },
  { icon: 'package-x', className: 'a-amber', title: 'Stok menipis, SKU 8842', meta: 'Cakung < reorder point', time: '1 jam' },
  { icon: 'trending-up', className: 'a-blue', title: 'Anomali biaya, JKT-SBY', meta: 'Cost/KM +18%', time: '2 jam' }
];

export interface OTDRegion {
  name: string;
  value: number;
}

export const OTD_REGIONS: OTDRegion[] = [
  { name: 'Jakarta', value: 94.2 },
  { name: 'Jawa Barat', value: 92.8 },
  { name: 'Jawa Timur', value: 90.1 },
  { name: 'Sumut', value: 87.4 },
  { name: 'Sulsel', value: 85.9 },
  { name: 'Bali', value: 96.1 }
];

export interface Shipment {
  id: string;
  route: string;
  service: string;
  weight: string;
  revenue: string;
  eta: string;
  statusClass: string;
  statusText: string;
  rating: string;
  selected: boolean;
}

export const SHIPMENTS: Shipment[] = [
  { id: 'SHP-88241', route: 'Jakarta → Surabaya', service: 'Next-day', weight: '24.5 kg', revenue: '$635.85', eta: '18 Jul', statusClass: 'blue', statusText: 'In Transit', rating: '5.0', selected: false },
  { id: 'SHP-88242', route: 'Bandung → Cirebon', service: 'Same-day', weight: '8.2 kg', revenue: '$544.05', eta: '15 Jul', statusClass: 'red', statusText: 'Breached', rating: '5.0', selected: true },
  { id: 'SHP-88243', route: 'Medan → Pekanbaru', service: 'Standard', weight: '112 kg', revenue: '$645.25', eta: '20 Jul', statusClass: 'amber', statusText: 'At Risk', rating: '4.9', selected: false },
  { id: 'SHP-88244', route: 'Makassar → Palu', service: 'Standard', weight: '56.8 kg', revenue: '$1,050.00', eta: '21 Jul', statusClass: 'blue', statusText: 'In Transit', rating: '4.8', selected: true },
  { id: 'SHP-88245', route: 'Jakarta → Bandung', service: 'Same-day', weight: '3.1 kg', revenue: '$1,000.00', eta: '15 Jul', statusClass: 'red', statusText: 'Breached', rating: '4.8', selected: false },
  { id: 'SHP-88246', route: 'Surabaya → Malang', service: 'Next-day', weight: '18.9 kg', revenue: '$400.25', eta: '17 Jul', statusClass: 'amber', statusText: 'At Risk', rating: '5.0', selected: false },
  { id: 'SHP-88247', route: 'Semarang → Solo', service: 'Same-day', weight: '12.4 kg', revenue: '$162.40', eta: '15 Jul', statusClass: 'blue', statusText: 'In Transit', rating: '4.7', selected: false },
  { id: 'SHP-88248', route: 'Denpasar → Mataram', service: 'Standard', weight: '88.0 kg', revenue: '$270.15', eta: '22 Jul', statusClass: 'red', statusText: 'Breached', rating: '4.9', selected: false },
  { id: 'SHP-88249', route: 'Batam → Pekanbaru', service: 'Next-day', weight: '41.2 kg', revenue: '$3,705.25', eta: '19 Jul', statusClass: 'blue', statusText: 'In Transit', rating: '5.0', selected: false },
  { id: 'SHP-88250', route: 'Balikpapan → Samarinda', service: 'Standard', weight: '67.5 kg', revenue: '$555.00', eta: '20 Jul', statusClass: 'blue', statusText: 'In Transit', rating: '5.0', selected: false }
];

export interface Vehicle {
  plate: string;
  type: string;
  depot: string;
  utilization: number;
  idle: number;
  statusClass: string;
  statusText: string;
}

export const FLEET_VEHICLES: Vehicle[] = [
  { plate: 'B 9241 KLX', type: 'Fuso', depot: 'Cakung', utilization: 58, idle: 28, statusClass: 'amber', statusText: 'Idle tinggi' },
  { plate: 'B 7712 UOP', type: 'Box Truck', depot: 'Bekasi', utilization: 44, idle: 12, statusClass: 'red', statusText: 'Maint. due' },
  { plate: 'D 1180 QAS', type: 'CDD', depot: 'Bandung', utilization: 67, idle: 19, statusClass: 'amber', statusText: 'Idle tinggi' },
  { plate: 'L 3390 TYU', type: 'Van', depot: 'Surabaya', utilization: 49, idle: 9, statusClass: 'red', statusText: 'Risk failure' }
];

export interface WarehouseUtil {
  name: string;
  value: number;
}

export const WAREHOUSES: WarehouseUtil[] = [
  { name: 'Cakung DC', value: 88 },
  { name: 'Bekasi Hub', value: 72 },
  { name: 'Bandung DC', value: 64 },
  { name: 'Surabaya Hub', value: 91 },
  { name: 'Medan Hub', value: 57 }
];

export interface RouteDetail {
  lane: string;
  plan: string;
  actual: string;
  var: string;
}

export const ROUTE_LANE_DETAILS: RouteDetail[] = [
  { lane: 'JKT-SBY', plan: '19h', actual: '20.1h', var: '+1.1h' },
  { lane: 'BDG-CRB', plan: '4h', actual: '4.8h', var: '+0.8h' },
  { lane: 'SBY-MLG', plan: '3h', actual: '2.7h', var: '-0.3h' },
  { lane: 'MKS-PLU', plan: '11h', actual: '12.2h', var: '+1.2h' },
  { lane: 'MDN-PKU', plan: '14h', actual: '13.5h', var: '-0.5h' }
];

export interface RouteState {
  label: string;
  value: string;
}

export const ROUTE_STATES: RouteState[] = [
  { label: 'Current', value: '$0.86' },
  { label: 'Vol +10%', value: '$0.79' },
  { label: 'Vol -10%', value: '$0.92' },
  { label: 'Cross-dock', value: '$0.81' }
];

export interface StrategicAccount {
  name: string;
  otdValue: number;
  type: string;
  revenue: number;
}

export const STRATEGIC_ACCOUNTS: StrategicAccount[] = [
  { name: 'Unilever', otdValue: 96.1, type: 'OTD', revenue: 31 },
  { name: 'Kalbe', otdValue: 94.8, type: 'SLA', revenue: 22 },
  { name: 'Indofood', otdValue: 92.4, type: 'SLA', revenue: 19 },
  { name: 'Nestle', otdValue: 97.2, type: 'OTD', revenue: 17 }
];

export interface SupplierRow {
  name: string;
  ot: number;
  defect: number;
  var: number;
  statusClass: string;
  statusText: string;
}

export const SUPPLIERS: SupplierRow[] = [
  { name: 'Shell Fleet', ot: 94, defect: 0.2, var: 1.1, statusClass: 'green', statusText: 'Healthy' },
  { name: 'Bridgestone', ot: 91, defect: 0.5, var: 2.4, statusClass: 'amber', statusText: 'Watch' },
  { name: 'ColdBox', ot: 96, defect: 0.1, var: 0.6, statusClass: 'green', statusText: 'Healthy' },
  { name: 'SpareX', ot: 86, defect: 1.4, var: 3.2, statusClass: 'red', statusText: 'Critical' }
];

export interface RiskItem {
  label: string;
  value: string;
  color: string;
}

export const RISK_ITEMS: RiskItem[] = [
  { label: 'Delay risk score', value: '6.2% high-risk', color: 'oklch(68% 0.19 42)' },
  { label: 'Maintenance risk', value: '11 unit prioritas', color: 'oklch(74% 0.13 82)' },
  { label: 'Cost anomaly', value: '5 lane outlier', color: 'oklch(64% 0.19 22)' },
  { label: 'Demand surge', value: 'Jatim +12% minggu depan', color: 'oklch(64% 0.15 150)' }
];

export interface LiveAlert {
  icon: string;
  className: string;
  title: string;
  meta: string;
  time: string;
}

export const LIVE_ALERTS: LiveAlert[] = [
  { icon: 'siren', className: 'a-red', title: 'Critical, cold-chain breach · Ops East', meta: 'SLA 30 mnt, belum ack', time: '3 mnt' },
  { icon: 'truck', className: 'a-amber', title: 'Major, breakdown JKT-SBY · Fleet HQ', meta: 'ETA slip 95 mnt', time: '17 mnt' },
  { icon: 'triangle-alert', className: 'a-amber', title: 'Major, 6 same-day near breach', meta: 'Supervisor West assigned', time: '29 mnt' },
  { icon: 'package-x', className: 'a-blue', title: 'Minor, low stock SKU 8842', meta: 'Cakung acknowledged', time: '44 mnt' }
];

export interface AlertStep {
  title: string;
  desc: string;
  time: string;
}

export const ALERT_STEPS: AlertStep[] = [
  { title: 'Rule triggered', desc: 'SLA, off-route, stockout, temperature, anomaly', time: '0-1m' },
  { title: 'Auto-assigned', desc: 'Owner dari region, lane, severity', time: '1-2m' },
  { title: 'Acknowledged', desc: 'Supervisor ack sebelum clock habis', time: '<10m' },
  { title: 'Escalated', desc: 'Push ke manager + buat task otomatis', time: '10-30m' }
];

export interface ReportPreviewRow {
  region: string;
  service: string;
  jun: string;
  jul: string;
  otd: string;
  margin: string;
}

export const REPORT_PREVIEWS: ReportPreviewRow[] = [
  { region: 'Jakarta', service: 'Same-day', jun: '8,420', jul: '9,130', otd: '94.4%', margin: '24.1%' },
  { region: 'Jakarta', service: 'Next-day', jun: '6,620', jul: '6,940', otd: '92.8%', margin: '22.3%' },
  { region: 'Jatim', service: 'Same-day', jun: '3,820', jul: '4,050', otd: '91.1%', margin: '21.4%' },
  { region: 'Jatim', service: 'Standard', jun: '5,980', jul: '6,210', otd: '89.8%', margin: '19.7%' },
  { region: 'Sumut', service: 'Standard', jun: '2,710', jul: '2,820', otd: '87.4%', margin: '18.9%' }
];

export interface SourceHealth {
  name: string;
  lastSync: string;
  fresh: string;
  statusClass: string;
  statusText: string;
}

export const SOURCE_HEALTHS: SourceHealth[] = [
  { name: 'TMS', lastSync: '2 mnt lalu', fresh: '99.1%', statusClass: 'green', statusText: 'Healthy' },
  { name: 'WMS', lastSync: '4 mnt lalu', fresh: '98.4%', statusClass: 'green', statusText: 'Healthy' },
  { name: 'ERP Finance', lastSync: '04:00 UTC', fresh: '92.2%', statusClass: 'amber', statusText: 'Lagging' },
  { name: 'Telematics', lastSync: '30 dtk lalu', fresh: '99.8%', statusClass: 'green', statusText: 'Healthy' },
  { name: 'Fuel Cards', lastSync: '07:00 UTC', fresh: '88.1%', statusClass: 'amber', statusText: 'Lagging' },
  { name: 'CRM', lastSync: '12 mnt lalu', fresh: '97.6%', statusClass: 'green', statusText: 'Healthy' }
];

// Helper to generate days/months datasets dynamically (matches the chart logic)
export const CHART_DAYS = Array.from({ length: 30 }, (_, i) => i < 16 ? `${i + 16}/6` : `${i - 15}/7`);

export function generateDaySeries(n: number, base: number, spread: number, trend: number): number[] {
  const a: number[] = [];
  let v = base;
  for (let i = 0; i < n; i++) {
    v += (Math.random() - 0.45) * spread + trend;
    a.push(Math.max(0, Math.round(v)));
  }
  return a;
}
