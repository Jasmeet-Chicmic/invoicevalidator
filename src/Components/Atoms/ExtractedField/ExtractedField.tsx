// Third-party libraries
import React, { useCallback, useMemo } from 'react';
// constants
import { formatCamelCase, replaceToLowerCase } from '../../../Shared/functions';
import { CONFIDENCE_CONFIG } from '../../../Shared/Constants';
// styles
import './ExtractedField.scss';
import IMAGES from '../../../Shared/Images';

type ExtractedFieldProps = {
  title: string;
  onApproveClick: (isApproved: boolean, value: string) => void;
  confidenceScore: number;
  disableApprove: boolean;
  approveButtonLoading: boolean;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  id?: string;
  approveButtonText?: string;
};

const ExtractedField: React.FC<ExtractedFieldProps> = ({
  title,
  confidenceScore,
  onApproveClick,
  disableApprove,
  placeholder = 'placeholder',
  value = 'dummy',
  onChange = () => {},
  id = `input-${replaceToLowerCase(title)}`,
  approveButtonText = 'Save',
  approveButtonLoading,
}) => {
  const borderColor = useMemo(() => {
    if (confidenceScore < CONFIDENCE_CONFIG.DANGER) {
      return 'score-red';
    }
    if (confidenceScore < CONFIDENCE_CONFIG.WARNING) {
      return 'score-yellow';
    }
    return 'score-green';
  }, [confidenceScore]);
  const handleOnApprove = () => {
    if (value) onApproveClick(true, value);
  };
  const confidenceScoreText = useCallback((newConfidenceScore: number) => {
    return Math.round(
      newConfidenceScore * CONFIDENCE_CONFIG.CONFIDENCE_MULTIPLIER
    );
  }, []);
  return (
    <div className={`extracted-field `}>
      <label className="extracted-field__title" htmlFor={id}>
        {formatCamelCase(title)}
      </label>
      <div className="d-flex gap-2">
        <div className="form-group flex-1">
          <input
            id={id}
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className={`extracted-field__input ${borderColor}`}
          />
          <span className="scoreField">
            {confidenceScoreText(confidenceScore)}
          </span>
        </div>
        <button
          className="extracted-field__approve-btn"
          type="button"
          onClick={handleOnApprove}
          disabled={!approveButtonLoading || disableApprove || !value}
        >
          <span>
            <img src={IMAGES.tickIcon} alt="Approve" />
          </span>
          {approveButtonText}
        </button>
      </div>
    </div>
  );
};

export default ExtractedField;
