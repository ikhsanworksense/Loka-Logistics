import React, { useState, useRef, useEffect } from 'react';
import Icon from './Icon';

interface ToolbarProps {
  showStats: boolean;
  onToggleStats: () => void;
  addButtonLabel: string;
  onFilterClick: () => void;
  onSortClick: () => void;
  currentPreset: string;
  onPresetSelect: (preset: string) => void;
  onCustomizeColumnsClick: () => void;
  onExportClick: () => void;
  onAddNewClick: () => void;
}

const PRESET_LIST = [
  { key: 'standard', label: 'Standard List', icon: 'table', desc: 'Show standard tracking columns' },
  { key: 'compact', label: 'Compact Grid', icon: 'layout-grid', desc: 'Minimize columns and hide ETA/SLA' },
  { key: 'financial', label: 'Financial Breakdown', icon: 'wallet', desc: 'Focus strictly on revenue metrics' },
  { key: 'operations', label: 'Operations Checklist', icon: 'truck', desc: 'Display service tiers, weights & ETA' }
];

export default function Toolbar({
  showStats,
  onToggleStats,
  addButtonLabel,
  onFilterClick,
  onSortClick,
  currentPreset,
  onPresetSelect,
  onCustomizeColumnsClick,
  onExportClick,
  onAddNewClick
}: ToolbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const activePresetInfo = PRESET_LIST.find((p) => p.key === currentPreset);

  return (
    <div className="toolbar">
      <div className="relative" ref={dropdownRef}>
        <button 
          className={`btn ${isOpen ? 'active bg-[var(--line-soft)]' : ''}`} 
          onClick={() => setIsOpen(!isOpen)}
        >
          <Icon name={activePresetInfo ? activePresetInfo.icon : 'table'} /> 
          <span>{activePresetInfo ? activePresetInfo.label : 'Table View'}</span> 
          <Icon name="chevron-down" size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        {isOpen && (
          <div className="dropdown-menu">
            <div className="dropdown-header">
              <span>Select Layout Preset</span>
              <span className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse" />
            </div>
            {PRESET_LIST.map((p) => {
              const isActive = currentPreset === p.key;
              return (
                <button
                  key={p.key}
                  onClick={() => {
                    onPresetSelect(p.key);
                    setIsOpen(false);
                  }}
                  className={`dropdown-item ${isActive ? 'active' : ''}`}
                >
                  <div className="icon-wrapper">
                    <Icon name={p.icon} size={15} />
                  </div>
                  <div className="content-wrapper">
                    <div className="title-row">
                      <span className="title">{p.label}</span>
                      {isActive && (
                        <span className="check-indicator">
                          <Icon name="check" size={14} strokeWidth={3} />
                        </span>
                      )}
                    </div>
                    <p className="description">{p.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <button className="btn" onClick={onFilterClick}>
        <Icon name="filter" /> Filter
      </button>
      <button className="btn" onClick={onSortClick}>
        <Icon name="arrow-up-down" /> Sort
      </button>
      <div className="toggle" id="statToggle" onClick={onToggleStats}>
        Show Statistics <span className={`switch ${showStats ? '' : 'off'}`} id="statSwitch"></span>
      </div>
      <div className="tb-right">
        <button className="btn" onClick={onCustomizeColumnsClick}>
          <Icon name="sliders-horizontal" /> Columns
        </button>
        <button className="btn" onClick={onExportClick}>
          <Icon name="upload" /> Export
        </button>
        <button className="btn dark font-semibold" onClick={onAddNewClick}>
          <Icon name="plus" /> <span id="addLabel">{addButtonLabel}</span>
        </button>
      </div>
    </div>
  );
}
