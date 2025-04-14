
import './PreviewWrapper.scss';

type Props = {
  onBack: () => void;
  left: React.ReactNode;
  right: React.ReactNode;
};

const PreviewWrapper: React.FC<Props> = ({ onBack, left, right }) => {
  return (
    <div className="two-pane-wrapper">
      <button className="back-btn" onClick={onBack}>← Back</button>
      <div className="panes">
        <div className="left-pane">{left}</div>
        <div className="right-pane">{right}</div>
      </div>
    </div>
  );
};

export default PreviewWrapper;
