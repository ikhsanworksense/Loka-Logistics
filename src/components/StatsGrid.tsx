import Icon from './Icon';
import { STATS } from '../data';

interface StatsGridProps {
  activeTab: string;
  showStats: boolean;
}

export default function StatsGrid({ activeTab, showStats }: StatsGridProps) {
  const items = STATS[activeTab] || [];

  if (!showStats) {
    return null;
  }

  return (
    <div className="stats statset" style={{ display: 'grid' }}>
      {items.map((item, index) => {
        const isDown = item.dir === 'down';
        return (
          <div className="stat" key={index}>
            <div className="stat-label">
              {item.label} <Icon name="info" />
            </div>
            <div className="stat-val tnum">{item.value}</div>
            <div className="stat-foot">
              vs last month{' '}
              <span className={`delta ${isDown ? 'down' : ''}`}>
                <Icon name={isDown ? 'arrow-down' : 'arrow-up'} />
                {item.delta}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
