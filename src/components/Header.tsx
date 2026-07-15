import Icon from './Icon';

interface HeaderProps {
  activeTab: string;
  onMenuToggle: () => void;
  title: string;
  onShareClick: () => void;
  onNotificationsClick: () => void;
  onAddUserClick: () => void;
  onCustomizeClick: () => void;
}

export default function Header({
  activeTab,
  onMenuToggle,
  title,
  onShareClick,
  onNotificationsClick,
  onAddUserClick,
  onCustomizeClick
}: HeaderProps) {
  return (
    <div className="head">
      <button className="menu-btn icon-btn" id="menuBtn" onClick={onMenuToggle}>
        <Icon name="menu" />
      </button>
      <div className="page-title" id="ptitle">{title}</div>
      <div className="head-actions">
        <button className="icon-btn" title="Share Workspace" onClick={onShareClick}>
          <Icon name="share-2" />
        </button>
        <button className="icon-btn relative" title="Notifications feed" onClick={onNotificationsClick}>
          <Icon name="bell" />
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-orange-500 ring-2 ring-[var(--app)]" />
        </button>
        <div className="avatars">
          <div className="av">IW</div>
          <div className="av" style={{ background: 'var(--blue)' }}>RN</div>
          <div className="av more">+3</div>
        </div>
        <button className="icon-btn" title="Invite Teammates" onClick={onAddUserClick}>
          <Icon name="user-plus" />
        </button>
        <button className="btn font-semibold" onClick={onCustomizeClick}>
          <Icon name="layout-grid" /> Customize
        </button>
      </div>
    </div>
  );
}
