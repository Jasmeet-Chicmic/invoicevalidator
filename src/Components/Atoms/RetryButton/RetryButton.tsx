import IMAGES from '../../../Shared/Images';
import './RetryButton.scss';

const RetryButton = ({ onClick }: { onClick?: () => void }) => {
  return (
    <div className="retry-button-wrapper">
      <div className="retry-button">
        <button className="retry-icon-button" onClick={onClick}>
          <img src={IMAGES.retryIcon} alt="Retry Icon" className="retry-icon" />
          <span className="retry-text">Retry</span>
        </button>
      </div>
    </div>
  );
};

export default RetryButton;
