import React from 'react';
import './ExtractedField.scss';
import { formatCamelCase } from '../../../Shared/functions';

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
  id = `input-${title.replace(/\s+/g, '-').toLowerCase()}`,
  confidenceScore,
  onApproveClick,
  disableApprove,
  approveButtonText,
}) => {
  return (
    <div className="extracted-field">
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
            className="extracted-field__input"
          />
          <span className="scoreField">{confidenceScore}</span>
        </div>
        <button
          className="extracted-field__approve-btn"
          type="button"
          onClick={() => {
            if (value) onApproveClick(true, value); // Approve the field on button click
          }}
          disabled={disableApprove}
        >
          {approveButtonText}
        </button>
      </div>
    </div>
  );
};

export default ExtractedField;
