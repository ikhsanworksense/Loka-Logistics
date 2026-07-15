export type ActiveModalType =
  | null
  | 'search'
  | 'share'
  | 'notifications'
  | 'addUser'
  | 'customizeGrid'
  | 'filter'
  | 'sort'
  | 'viewMode'
  | 'customizeColumns'
  | 'export'
  | 'addNew';

export interface ColumnConfig {
  shipment: boolean;
  service: boolean;
  weight: boolean;
  revenue: boolean;
  eta: boolean;
  status: boolean;
  sla: boolean;
}

export interface ActiveFilters {
  region: string;
  status: string;
  service: string;
}

export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}
