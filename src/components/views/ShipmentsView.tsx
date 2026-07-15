import React, { useState } from 'react';
import Icon from '../Icon';
import { Shipment } from '../../data';
import { ColumnConfig, ActiveFilters, SortConfig } from '../../types';

interface ShipmentsViewProps {
  shipments: Shipment[];
  setShipments: React.Dispatch<React.SetStateAction<Shipment[]>>;
  activeFilters: ActiveFilters;
  sortConfig: SortConfig;
  columnsConfig: ColumnConfig;
  onAddColumnClick?: () => void;
}

export default function ShipmentsView({
  shipments: rawShipments,
  setShipments,
  activeFilters,
  sortConfig,
  columnsConfig,
  onAddColumnClick
}: ShipmentsViewProps) {
  // Local selection of shipment row IDs
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Dynamic filtering
  let shipments = [...rawShipments];
  if (activeFilters.service && activeFilters.service !== 'All') {
    shipments = shipments.filter(s => s.service === activeFilters.service);
  }
  if (activeFilters.status && activeFilters.status !== 'All') {
    shipments = shipments.filter(s => s.statusText === activeFilters.status);
  }
  if (activeFilters.region && activeFilters.region !== 'All') {
    shipments = shipments.filter(s => s.route.toLowerCase().includes(activeFilters.region.toLowerCase()));
  }

  // Dynamic sorting
  shipments.sort((a, b) => {
    let valA: any = a[sortConfig.key as keyof Shipment] || '';
    let valB: any = b[sortConfig.key as keyof Shipment] || '';

    if (sortConfig.key === 'revenue') {
      valA = parseFloat(a.revenue.replace(/[^0-9.-]+/g, '')) || 0;
      valB = parseFloat(b.revenue.replace(/[^0-9.-]+/g, '')) || 0;
    } else if (sortConfig.key === 'weight') {
      valA = parseFloat(a.weight.replace(/[^0-9.-]+/g, '')) || 0;
      valB = parseFloat(b.weight.replace(/[^0-9.-]+/g, '')) || 0;
    }

    if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
    if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const toggleSelectAll = () => {
    if (selectedIds.size === shipments.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(shipments.map((s) => s.id)));
    }
  };

  const toggleSelectRow = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
  };

  const isAllSelected = selectedIds.size === shipments.length;

  return (
    <div className="view active" id="v-ship">
      <div className="tablewrap">
        <table>
          <thead>
            <tr>
              <th style={{ width: '32%' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '11px' }}>
                  <span
                    className={`check ${isAllSelected ? 'on' : ''}`}
                    id="checkAll"
                    onClick={(e) => { e.stopPropagation(); toggleSelectAll(); }}
                  >
                    <Icon name="check" />
                  </span>{' '}
                  Shipment
                </span>
              </th>
              {columnsConfig.service && <th>Service</th>}
              {columnsConfig.weight && <th className="num">Weight</th>}
              {columnsConfig.revenue && <th className="num">Revenue</th>}
              {columnsConfig.eta && <th>ETA</th>}
              {columnsConfig.status && <th>Status</th>}
              {columnsConfig.sla && <th>SLA</th>}
              <th style={{ width: '30px' }}>
                <Icon name="plus" size={15} />
              </th>
            </tr>
          </thead>
          <tbody id="shipRows">
            {shipments.map((shp) => {
              const isSelected = selectedIds.has(shp.id);
              return (
                <tr
                  key={shp.id}
                  className={isSelected ? 'sel' : ''}
                  onClick={() => toggleSelectRow(shp.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <td>
                    <div className="cell-prod">
                      <span className={`check ${isSelected ? 'on' : ''}`}>
                        <Icon name="check" />
                      </span>{' '}
                      {shp.id}{' '}
                      <span className="muted" style={{ fontWeight: 400 }}>
                        · {shp.route}
                      </span>
                    </div>
                  </td>
                  {columnsConfig.service && <td className="muted">{shp.service}</td>}
                  {columnsConfig.weight && <td className="num">{shp.weight}</td>}
                  {columnsConfig.revenue && <td className="num">{shp.revenue}</td>}
                  {columnsConfig.eta && <td className="muted">{shp.eta}</td>}
                  {columnsConfig.status && (
                    <td>
                      <span className={`pill ${shp.statusClass}`}>{shp.statusText}</span>
                    </td>
                  )}
                  {columnsConfig.sla && (
                    <td>
                      <span className="rating">
                        <Icon name="star" /> {shp.rating}
                      </span>
                    </td>
                  )}
                  <td></td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="addcol cursor-pointer hover:bg-[var(--tag)] transition-all" onClick={onAddColumnClick}>
          <Icon name="plus" /> Add Column
        </div>
      </div>

      {selectedIds.size > 0 && (
        <div className="floatbar" id="floatbar" style={{ display: 'flex' }}>
          <div className="inner">
            <span className="selcount" id="selCount">
              {selectedIds.size} Selected
            </span>
            <button className="fb-btn">
              <Icon name="code" /> Apply Code
            </button>
            <button className="fb-btn">
              <Icon name="pencil" /> Edit Info
            </button>
            <button className="fb-btn danger">
              <Icon name="trash-2" /> Delete
            </button>
            <div className="fb-div"></div>
            <button className="fb-btn">
              <Icon name="more-horizontal" />
            </button>
            <button className="fb-btn" id="clearSel" onClick={(e) => { e.stopPropagation(); clearSelection(); }}>
              <Icon name="x" />
            </button>
          </div>
        </div>
      )}

      <div className="pager">
        <div className="perpage">
          Showing per page{' '}
          <span className="selectbox">
            10 <Icon name="chevron-down" />
          </span>
        </div>
        <div className="pages">
          <button className="pg arrow">
            <Icon name="chevron-left" size={15} />
          </button>
          <button className="pg on">1</button>
          <button className="pg">2</button>
          <button className="pg">3</button>
          <span className="pg" style={{ pointerEvents: 'none' }}>
            …
          </span>
          <button className="pg">25</button>
          <button className="pg arrow">
            <Icon name="chevron-right" size={15} />
          </button>
        </div>
        <div className="goto">
          Go to page <input defaultValue="1" />{' '}
          <span className="go">
            Go <Icon name="arrow-right" />
          </span>
        </div>
      </div>
    </div>
  );
}
