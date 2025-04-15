import React from 'react';
import './ExtractedField.scss';
import { formatCamelCase } from '../../../Shared/functions';

type ExtractedFieldProps = {
  title: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  id?: string;
  confidenceScore: number;
};

const ExtractedField: React.FC<ExtractedFieldProps> = ({
  title,
  placeholder,
  value,
  onChange,
  id = `input-${title.replace(/\s+/g, '-').toLowerCase()}`,
  confidenceScore,
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
      <div>{confidenceScore}</div>
      <button className="extracted-field__approve-btn" type="button">
        Approve
      </button>
    </div>
  );
};

export default ExtractedField;
