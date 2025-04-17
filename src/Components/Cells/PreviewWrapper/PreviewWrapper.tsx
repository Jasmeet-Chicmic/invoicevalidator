// Third-party libraries
import React from 'react';
// Styles
import './PreviewWrapper.scss';
import IMAGES from '../../../Shared/Images';

type PreviewWrapperProps = {
  onBack: () => void;
  left: React.ReactNode;
  right: React.ReactNode;
};

const PreviewWrapper: React.FC<PreviewWrapperProps> = ({
  onBack,
  left,
  right,
}) => {
  return (
    <div className="two-pane-wrapper">
      <div className="container-fluid">
        <div className="paneWrapper">
          <div className="panes">
            <div className="left-pane">
              {left}
              <button type="button" className="back-btn" onClick={onBack}>
                <span>
                  {' '}
                  <img src={IMAGES.backIcon} alt="back-icon" />
                </span>{' '}
                Back
              </button>
            </div>
            <div className="right-pane">{right}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewWrapper;
