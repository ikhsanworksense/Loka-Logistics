import React from 'react';
import Icon from './Icon';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isOpen: boolean;
  onToggleOpen: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onSearchClick: () => void;
}

export default function Sidebar({
  activeTab,
  onTabChange,
  isOpen,
  onToggleOpen,
  isCollapsed,
  onToggleCollapse,
  onSearchClick
}: SidebarProps) {
  const renderNavButton = (v: string, iconName: string, label: string, extra?: React.ReactNode) => {
    const active = activeTab === v;
    return (
      <button
        className={`nav ${active ? 'active' : ''}`}
        onClick={() => onTabChange(v)}
        title={isCollapsed ? label : undefined}
      >
        <Icon name={iconName} /> {!isCollapsed && <span className="nav-label">{label}</span>}
        {!isCollapsed && extra}
      </button>
    );
  };

  return (
    <aside className={`side ${isOpen ? 'open' : ''} ${isCollapsed ? 'collapsed' : ''}`} id="side">
      {/* Frozen Top Header */}
      <div className="side-header">
        <div className="org">
          <div className="logo" onClick={onToggleCollapse}>L</div>
          {!isCollapsed && (
            <div>
              <div className="name">Loka Logistics</div>
              <div className="plan">Free Plan</div>
            </div>
          )}
          {!isCollapsed && (
            <button 
              className="collapse-btn" 
              onClick={() => {
                // On small screens, close the sidebar drawer. On desktop, collapse.
                if (window.innerWidth < 768) {
                  onToggleOpen();
                } else {
                  onToggleCollapse();
                }
              }}
            >
              <Icon name="chevrons-left" />
            </button>
          )}
        </div>

        <div className="search" onClick={onSearchClick} role="button" tabIndex={0}>
          <Icon name="search" /> {!isCollapsed && <>Search <span className="kbd">⌘ K</span></>}
        </div>
      </div>

      {/* Scrollable Middle Navigation */}
      <div className="side-content">
        {!isCollapsed && <div className="sec">Main Menu</div>}
        {renderNavButton('dash', 'layout-dashboard', 'Dashboard')}
        {renderNavButton('ship', 'package', 'Shipments')}
        {renderNavButton('fleet', 'truck', 'Fleet')}
        {renderNavButton('wh', 'warehouse', 'Warehouse')}
        {renderNavButton('alerts', 'message-square', 'Alerts', <span className="count">14</span>)}

        {!isCollapsed && <div className="sec">Tools</div>}
        {renderNavButton('route', 'map', 'Routes')}
        {renderNavButton('cost', 'wallet', 'Finance')}
        {renderNavButton('forecast', 'trending-up', 'Forecasting')}
        {renderNavButton('reports', 'file-bar-chart', 'Reports')}

        {!isCollapsed && <div className="sec">Workspace</div>}
        {renderNavButton('cust', 'users', 'Customers', <span className="count orange">5</span>)}
        {renderNavButton('proc', 'shopping-cart', 'Procurement', <span className="pindot">4</span>)}
        {renderNavButton('admin', 'shield', 'Governance')}
      </div>

      {/* Frozen Bottom Footer */}
      <div className="side-footer">
        <button className="foot-link" title="Help center"><Icon name="life-buoy" /> {!isCollapsed && "Help center"}</button>
        <button className="foot-link" title="Feedback"><Icon name="message-circle" /> {!isCollapsed && "Feedback"}</button>
        <button className="foot-link" title="Settings"><Icon name="settings" /> {!isCollapsed && "Settings"}</button>
        {!isCollapsed && (
          <div className="upsell">
            <div className="u-ico"><Icon name="zap" /></div>
            <div className="u-t">Upgrade & unlock<br />all features</div>
            <span className="u-arrow"><Icon name="chevron-right" width="16" height="16" /></span>
          </div>
        )}
      </div>
    </aside>
  );
}
