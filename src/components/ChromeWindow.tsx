import Icon from './Icon';

export default function ChromeWindow() {
  return (
    <div className="chrome">
      <span className="ico"><Icon name="panel-left" /></span>
      <span className="ico"><Icon name="arrow-left" /></span>
      <span className="ico"><Icon name="arrow-right" /></span>
      <span className="ico"><Icon name="rotate-cw" /></span>
      <div className="omni">
        <Icon name="lock" /> loka.orbit.com
      </div>
      <span className="ico"><Icon name="copy" /></span>
      <span className="ico"><Icon name="panel-right" /></span>
    </div>
  );
}
