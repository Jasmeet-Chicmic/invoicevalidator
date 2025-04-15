import React from 'react';
import './PreviewWrapper.scss';

type Props = {
  onBack: () => void;
  left: React.ReactNode;
  right: React.ReactNode;
};

const PreviewWrapper: React.FC<Props> = ({ onBack, left, right }) => {
  return (
    <div className="two-pane-wrapper">
      <div className="container">
        <div className="paneWrapper py-5">
          <button type="button" className="back-btn" onClick={onBack}>
            ← Back
          </button>
          <div className="panes">
            <div className="left-pane">{left}</div>
            <div className="right-pane">{right}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewWrapper;
