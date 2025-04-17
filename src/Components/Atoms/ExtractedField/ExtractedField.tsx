// Third-party libraries
import React, { useCallback, useMemo } from 'react';
// constants
import { formatCamelCase, replaceToLowerCase } from '../../../Shared/functions';
import { CONFIDENCE_CONFIG } from '../../../Shared/Constants';
// styles
import './ExtractedField.scss';

type ExtractedFieldProps = {
  title: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onApproveClick: (isApproved: boolean, value: string) => void;
  id?: string;
  confidenceScore: number;
  disableApprove: boolean;
  approveButtonText?: string;
};

const ExtractedField: React.FC<ExtractedFieldProps> = ({
  title,
  placeholder,
  value,
  onChange,
  id = `input-${replaceToLowerCase(title)}`,
  confidenceScore,
  onApproveClick,
  disableApprove,
  approveButtonText,
}) => {
  const borderColor = useMemo(() => {
    if (confidenceScore < CONFIDENCE_CONFIG.DANGER) {
      return 'border-danger';
    }
    if (confidenceScore < CONFIDENCE_CONFIG.WARNING) {
      return 'border-warning';
    }
    return 'border-success';
  }, [confidenceScore]);

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
          onClick={() => {
            if (value) onApproveClick(true, value); // Approve the field on button click
          }}
          disabled={disableApprove || !value}
        >
          {approveButtonText}
        </button>
      </div>
    </div>
  );
};

export default ExtractedField;
