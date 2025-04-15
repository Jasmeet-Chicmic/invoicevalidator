import React from 'react';
import './ExtractedField.scss';
import { formatCamelCase } from '../../../Shared/functions';

type ExtractedFieldProps = {
  title: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onApproveClick: (isApproved: boolean) => void;
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
      <input
        id={id}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="extracted-field__input"
      />
      <span>{confidenceScore}</span>
      <button
        className="extracted-field__approve-btn"
        type="button"
        onClick={() => {
          onApproveClick(true); // Approve the field on button click
        }}
        disabled={disableApprove}
      >
        {approveButtonText}
      </button>
    </div>
  );
};

export default ExtractedField;
